import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import API from '../../api/api';
import {get} from '../../services/http';

import Layout from '../../components/Layout/Layout';
import PersonsGroup from '../../components/PersonsGroup/PersonsGroup';
import Person from '../../components/Person/Person';

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
			office: null,
			sort: null
		};

		this.offices = [];
		this.departments = [];
		this.positions = [];
	}

	componentDidMount() {
		// Load initial data

		this
			.loadOffices()
			.then(this.loadDepartments)
			.then(this.loadPositions)
			.then(this.loadPeople);
	}

	setOffice = (id) => {
		this.setState(() => ({office: id}));
	};

	loadOffices = () => {

		const {defaultCity} = this.props;

		return get('http://localhost:3001/offices')
			.then((response) => {
				// Store offices for use in filters
				this.offices = response.data;

				// Set default office
				if (defaultCity && defaultCity.length) {
					const defaultOffice = _.find(this.offices, {[API.office.city]: defaultCity});

					// Office id was found for the required city, set it as default
					if (defaultOffice) {
						this.setOffice(defaultOffice[API.office.id]);
					}
				}
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

	loadPeople = () => {
		return get('http://localhost:3001/' + 'people')
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
					const departmentName = _.find(this.departments, {[API.department.id]: person[API.person.department]})[API.department.name];
					return departmentName;
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

	render() {

		const {people} = this.state;
		let groups;

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

		return (
			<Layout>
				{groups}
			</Layout>
		);
	}

	static propTypes = {
		defaultCity: PropTypes.string.isRequired
	};

}

export default People;