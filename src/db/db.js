const faker = require('faker');
const _ = require('lodash');
const API = require('./Api');

const PEOPLE_COUNT = 300;

faker.locale = 'en';

module.exports = () => {

	const departments = _.uniqBy(_.times(30, () => ({
		[API.department.id]: faker.fake('department_{{random.uuid}}'),
		[API.department.name]: faker.fake('{{name.jobArea}}')
	})), API.department.name);

	const positions = _.uniqBy(_.times(40, () => ({
		[API.position.id]: faker.fake('position_{{random.uuid}}'),
		[API.position.name]: faker.fake('{{name.jobTitle}}')
	})), API.position.name);

	const offices = [
		{
			[API.office.id]: faker.fake('office_{{random.uuid}}'),
			[API.office.city]: 'Budapest',
			[API.office.country]: 'Hungary',
			[API.office.departments]: _.map(_.sampleSize(departments, 4), API.department.id)
		},
		{
			[API.office.id]: faker.fake('office_{{random.uuid}}'),
			[API.office.city]: 'London',
			[API.office.country]: 'UK',
			[API.office.departments]: _.map(_.sampleSize(departments, 8), API.department.id)
		},
		{
			[API.office.id]: faker.fake('office_{{random.uuid}}'),
			[API.office.city]: 'Tallinn',
			[API.office.country]: 'Estonia',
			[API.office.departments]: _.map(_.sampleSize(departments, 6), API.department.id)
		}
	];


	const profileImages = _.shuffle(_.range(0, 43));

	const people = _.times(PEOPLE_COUNT, (index) => {

		const office = _.sample(offices);
		const profileImage = '/i/staff/' + profileImages[index % profileImages.length] + '.jpg';

		const person = {
			[API.person.id]: faker.fake('person_{{random.uuid}}'),

			// Personal details
			[API.person.firstName]: faker.fake('{{name.firstName}}'),
			[API.person.lastName]: faker.fake('{{name.lastName}}'),
			[API.person.profileImage]: profileImage,

			// Company details
			[API.person.position]: _.sample(positions)[API.position.id],
			[API.person.department]: _.sample(office[API.office.departments]),
			[API.person.office]: office[API.office.id],

			// Contact information
			[API.person.phone]: faker.fake('{{phone.phoneNumberFormat(2)}}'),
			[API.person.mobile]: faker.fake('{{phone.phoneNumberFormat(2)}}'),
			[API.person.email]: faker.fake('{{internet.email}}')
		};

		return person;
	});

	return {
		departments,
		positions,
		offices,
		people
	};
};