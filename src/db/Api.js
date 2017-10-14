
module.exports = {

	url: process.env.NODE_ENV === 'development' ? 'http://localhost:3001/' : 'https://people-tw-api.herokuapp.com/',

	all: 'all',

	department: {
		_key: 'department',
		id: 'id',
		name: 'name'
	},

	position: {
		_key: 'position',
		id: 'id',
		name: 'name'
	},

	office: {
		_key: 'office',
		id: 'id',
		city: 'city',
		country: 'country',
		departments: 'departments'
	},

	person: {
		_key: 'person',
		id: 'id',
		firstName: 'firstName',
		lastName: 'lastName',
		profileImage: 'profileImage',
		position: 'position',
		department: 'department',
		office: 'office',
		phone: 'phone',
		mobile: 'mobile',
		email: 'email'
	}

};