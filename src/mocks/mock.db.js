import API from '../db/Api';

export const offices = [
	{[API.office.id]: 'office_0', [API.office.city]: 'city A', [API.office.country]: 'country A'},
	{[API.office.id]: 'office_1', [API.office.city]: 'city B', [API.office.country]: 'country B'},
	{[API.office.id]: 'office_2', [API.office.city]: 'city C', [API.office.country]: 'country C'}
];

export const departments = [
	{[API.department.id]: 'dept_0', [API.department.name]: 'department A'},
	{[API.department.id]: 'dept_1', [API.department.name]: 'department B'},
	{[API.department.id]: 'dept_2', [API.department.name]: 'department C'}
];

export const positions = [
	{[API.position.id]: 'pos_0', [API.position.name]: 'position A'},
	{[API.position.id]: 'pos_1', [API.position.name]: 'position B'},
	{[API.position.id]: 'pos_2', [API.position.name]: 'position C'}
];