import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import API from '../../db/Api';
import {get} from '../../services/http';

import Layout from '../../components/Layout/Layout';
import PersonsGroup from '../../components/PersonsGroup/PersonsGroup';
import Person from '../../components/Person/Person';
import Search from '../../components/Search/Search';
import Filters from '../../components/Filters/Filters';

class People extends PureComponent {

	constructor(props) {
		super(props);

		this.state = {
			people: [],
			search: '',
			office: API.all,
			department: API.all,
			position: API.all,
			sortByDepartment: true
		};

		this.offices = [];
		this.departments = [];
		this.positions = [];
		this.unsortedPeople = null;
	}

	componentDidMount() {
		this.loadInitialData();
	}

	loadInitialData = () => {
		// Load initial data
		const {defaultCity} = this.props;

		this
			.loadOffices()
			.then(this.loadDepartments)
			.then(this.loadPositions)
			.then(() => {
				// Set default office
				if (defaultCity && defaultCity.length) {
					const defaultOffice = _.find(this.offices, {[API.office.city]: defaultCity});

					// Office id was found for the required city, set it as default
					if (defaultOffice) {
						this.setFilter(API.office._key, defaultOffice[API.office.id]);
					}
				}
			});
	};

	getFiltersQuery = () => {
		const {office, department, position} = this.state;
		let queryString = '';

		if (office !== API.all) {
			queryString += API.office._key + '=' + office + '&';
		}

		if (department !== API.all) {
			queryString += API.department._key + '=' + department + '&';
		}

		if (position !== API.all) {
			queryString += API.position._key + '=' + position + '&';
		}

		return queryString;
	};

	setFilter = (key, id) => {
		this.setState(() => ({[key]: id}), () => {
			this.loadPeople('?' + this.getFiltersQuery());
		});
	};

	changeSort = (sort) => {
		this.setState(() => ({
			sortByDepartment: sort
		}), () => {
			this.setState(() => ({people: this.applySorting(this.unsortedPeople)}));
		});
	};

	loadOffices = () => {
		return get(API.url + 'offices')
			.then((response) => {
				// Store offices for use in filters
				this.offices = response.data;
				return response.data;
			});
	};

	loadDepartments = () => {
		return get(API.url + 'departments')
			.then((response) => {
				this.departments = response.data;
			})
	};

	loadPositions = () => {
		return get(API.url + 'positions')
			.then((response) => {
				this.positions = response.data;
			})
	};

	loadPeople = (searchQuery) => {
		return get(API.url + 'people' + (searchQuery ? searchQuery : ''))
			.then((response) => {
				this.unsortedPeople = response.data;
				this.setState(() => ({people: this.applySorting(this.unsortedPeople)}));
			})
	};

	applySorting = (data) => {
		const orderRule = [API.person.lastName, API.person.firstName];

		if (this.state.sortByDepartment) {
			data = _.groupBy(data, (person) => {
				// Find the corresponding department name
				return _.find(this.departments, {[API.department.id]: person[API.person.department]})[API.department.name];
			});
		} else {
			data = {
				'A-Z': data
			};
		}

		// Rearrange data so we can loop through sorted groups in render()
		data = _.map(data, (value, key) => {
			return {
				name: key,
				items: _.orderBy(value, orderRule) // Order groups by lastname, firstname
			}
		});

		// Finally sort alphabetically by group name
		data = _.sortBy(data, 'name');
		return data;
	};

	search = (value) => {
		this.setState(() => ({search: value}));
		this.loadPeople('?q=' + value + '&' + this.getFiltersQuery());
	};

	render() {

		const {people, search, office, department, position, sortByDepartment} = this.state;
		let groups;

		// Return early if data is not loaded yet
		if (!this.offices.length || !this.departments.length || !this.positions.length || !this.unsortedPeople) {
			return null;
		}

		// Assemble list of people
		if (people.length) {
			groups = _.map(people, (group) => {
				const persons = _.map(group.items, (person) => {

					const departmentName = _.find(this.departments, {[API.department.id]: person[API.person.department]})[API.department.name];
					const positionName = _.find(this.positions, {[API.position.id]: person[API.person.position]})[API.position.name];
					const office = _.find(this.offices, {[API.office.id]: person[API.person.office]});
					const officeLocation = office[API.office.city] + '/' + office[API.office.country];

					return (
						<Person
							key={person[API.person.id]}
							firstName={person[API.person.firstName]}
							lastName={person[API.person.lastName]}
							profileImage={person[API.person.profileImage]}
							position={positionName}
							department={departmentName}
							sortByDepartment={sortByDepartment}
							office={officeLocation}
							phone={person[API.person.phone]}
							mobile={person[API.person.mobile]}
							email={person[API.person.email]}
							fb={person[API.person.fb]}
							skype={person[API.person.skype]}
							instagram={person[API.person.instagram]}
							twitter={person[API.person.twitter]}
						/>
					);
				});

				return (
					<PersonsGroup key={group.name} name={group.name}>
						{persons}
					</PersonsGroup>
				)
			});
		} else {
			groups = <div className="noresults">No results, try modifying your search criteria.</div>;
		}

		const searchBox = <Search query={search} onChange={_.throttle(this.search, 500)} />;
		const filters = (
			<Filters
				onOfficeChange={(event, index, value) => this.setFilter(API.office._key, value)}
				onDepartmentChange={(event, index, value) => this.setFilter(API.department._key, value)}
				onPositionChange={(event, index, value) => this.setFilter(API.position._key, value)}
				onSortChange={(event, sort) => this.changeSort(sort)}
				offices={_.sortBy(this.offices, API.office.city)}
				departments={_.sortBy(this.departments, API.department.name)}
				positions={_.sortBy(this.positions, API.position.name)}
				currentOffice={office}
				currentDepartment={department}
				currentPosition={position}
				sortByDepartment={sortByDepartment}
			/>
		);

		return (
			<Layout search={searchBox} filters={filters}>
				{groups}
			</Layout>
		);
	}

	static propTypes = {
		defaultCity: PropTypes.string.isRequired
	};

	static defaultProps = {
		defaultCity: 'Budapest'
	};

}

export default People;
