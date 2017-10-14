import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import API from '../../api/Api';
import {get} from '../../services/http';

import Layout from '../../components/Layout/Layout';
import PersonsGroup from '../../components/PersonsGroup/PersonsGroup';
import Person from '../../components/Person/Person';
import Search from '../Search/Search';
import Filters from '../Filters/Filters';

const SORT_RULES = {
	department: 'department',
	firstName: 'firstName',
	lastName: 'lastName'
};

class People extends PureComponent {

	constructor(props) {
		super(props);

		this.state = {
			people: [],
			search: '',
			office: API.all,
			department: API.all,
			position: API.all,
			sort: null
		};

		this.offices = [];
		this.departments = [];
		this.positions = [];
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

	setFilter = (key, id) => {

		this.setState(() => ({[key]: id}), () => {

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

			this.loadPeople('?' + queryString);

		});
	};

	loadOffices = () => {
		return get('http://localhost:3001/offices')
			.then((response) => {
				// Store offices for use in filters
				this.offices = response.data;
				return response.data;
			});
	};

	loadDepartments = () => {
		return get('http://localhost:3001/' + 'departments')
			.then((response) => {
				this.departments = response.data;
			})
	};

	loadPositions = () => {
		return get('http://localhost:3001/' + 'positions')
			.then((response) => {
				this.positions = response.data;
			})
	};

	loadPeople = (searchQuery) => {
		return get('http://localhost:3001/' + 'people' + (searchQuery ? searchQuery : ''))
			.then((response) => {
				const people = this.applySorting(response.data);
				this.setState(() => ({people: people}));
			})
	};

	applySorting = (data) => {
		let orderRule = [API.person.lastName, API.person.firstName];

		switch (this.state.sort) {

			case SORT_RULES.firstName:
				orderRule = [API.person.firstName, API.person.lastName];
				data = _.groupBy(data, (person) => {
					return person[API.person.firstName].substr(0, 1);
				});
				break;

			case SORT_RULES.lastName:
				data = _.groupBy(data, (person) => {
					return person[API.person.lastName].substr(0, 1);
				});
				break;

			case SORT_RULES.department:
			default:
				// Group by department
				data = _.groupBy(data, (person) => {
					// Find the corresponding department name
					return _.find(this.departments, {[API.department.id]: person[API.person.department]})[API.department.name];
				});
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
		this.loadPeople('?q=' + value);

		// TODO: add filters
	};

	render() {

		const {people, search, office, department, position} = this.state;
		let groups;

		// Return early if data is not loaded yet
		if (!this.offices.length || !this.departments.length || !this.positions.length) {
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
		}

		const searchBox = <Search query={search} onChange={_.throttle(this.search, 500)} />;
		const filters = (
			<Filters
				onOfficeChange={(event, index, value) => this.setFilter(API.office._key, value)}
				onDepartmentChange={(event, index, value) => this.setFilter(API.department._key, value)}
				onPositionChange={(event, index, value) => this.setFilter(API.position._key, value)}
				offices={_.sortBy(this.offices, API.office.city)}
				departments={_.sortBy(this.departments, API.department.name)}
				positions={_.sortBy(this.positions, API.position.name)}
				currentOffice={office}
				currentDepartment={department}
				currentPosition={position}
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

}

export default People;
