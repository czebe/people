import React from 'react';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import {expect} from 'chai';
import sinon from 'sinon';
import moxios from 'moxios';
import {shallow} from 'enzyme';

import API from '../../db/Api';
import People from './People';

Enzyme.configure({adapter: new Adapter()});

describe('<People />', () => {

	let wrapper;

	describe('Loading', () => {

		beforeEach(() => {
			moxios.install();
			wrapper = shallow(<People defaultCity="Budapest" />, {disableLifecycleMethods: true});
		});

		afterEach(() => {
			moxios.uninstall();
		});

		it('should initiate load of initial data on mount', () => {
			const loadInitialData = sinon.stub(wrapper.instance(), 'loadInitialData');
			wrapper.instance().componentDidMount();
			expect(loadInitialData.calledOnce).to.equal(true);
		});

		it('should load offices', () => {

			const testData = [{
				office: 'test'
			}];

			moxios.stubRequest(API.url + 'offices', {
				status: 200,
				response: testData
			});

			return wrapper.instance().loadOffices().then(() => {
				expect(wrapper.instance().offices).to.be.deep.equal(testData);
			});

		});

		it('should load departments', () => {

			const testData = [{
				department: 'test'
			}];

			moxios.stubRequest(API.url + 'departments', {
				status: 200,
				response: testData
			});

			return wrapper.instance().loadDepartments().then(() => {
				expect(wrapper.instance().departments).to.be.deep.equal(testData);
			});

		});

		it('should load positions', () => {

			const testData = [{
				position: 'test'
			}];

			moxios.stubRequest(API.url + 'positions', {
				status: 200,
				response: testData
			});

			return wrapper.instance().loadPositions().then(() => {
				expect(wrapper.instance().positions).to.be.deep.equal(testData);
			});

		});


	});

	describe('Sorting', () => {

		beforeEach(() => {
			wrapper = shallow(<People defaultCity="Budapest" />, {disableLifecycleMethods: true});

			// Initialize departments
			wrapper.instance().departments = [
				{[API.department.id]: 'dept_1', [API.department.name]: 'Department 1'},
				{[API.department.id]: 'dept_2', [API.department.name]: 'Department 2'},
				{[API.department.id]: 'dept_3', [API.department.name]: 'Department 3'},
			];
		});

		it('should sort data by department', () => {

			const unsorted = [
				{[API.person.firstName]: 'C', [API.person.lastName]: 'C', [API.person.department]: 'dept_3'},
				{[API.person.firstName]: 'A', [API.person.lastName]: 'A', [API.person.department]: 'dept_1'},
				{[API.person.firstName]: 'B', [API.person.lastName]: 'B', [API.person.department]: 'dept_2'}
			];

			const expected = [
				{name: 'Department 1', items: [unsorted[1]]},
				{name: 'Department 2', items: [unsorted[2]]},
				{name: 'Department 3', items: [unsorted[0]]},
			];

			const sorted = wrapper.instance().applySorting(unsorted);

			expect(sorted).to.be.deep.equal(expected);
		});

		it('should sort data by name, alphabetically', () => {

			wrapper.instance().state.sortByDepartment = false;

			const unsorted = [
				{[API.person.firstName]: 'A', [API.person.lastName]: 'C'},
				{[API.person.firstName]: 'B', [API.person.lastName]: 'B'},
				{[API.person.firstName]: 'A', [API.person.lastName]: 'B'},
				{[API.person.firstName]: 'C', [API.person.lastName]: 'C'},
				{[API.person.firstName]: 'A', [API.person.lastName]: 'A'}
			];

			const expected = [
				{
					name: 'A-Z',
					items: [
						{[API.person.firstName]: 'A', [API.person.lastName]: 'A'},
						{[API.person.firstName]: 'A', [API.person.lastName]: 'B'},
						{[API.person.firstName]: 'B', [API.person.lastName]: 'B'},
						{[API.person.firstName]: 'A', [API.person.lastName]: 'C'},
						{[API.person.firstName]: 'C', [API.person.lastName]: 'C'}
					]
				}
			];

			const sorted = wrapper.instance().applySorting(unsorted);

			expect(sorted).to.be.deep.equal(expected);

		});

	});

	describe('Search', () => {

		beforeEach(() => {
			moxios.install();
			wrapper = shallow(<People defaultCity="Budapest"/>, {disableLifecycleMethods: true});

			// Initialize departments
			wrapper.instance().departments = [
				{[API.department.id]: 'dept_1', [API.department.name]: 'Department 1'},
				{[API.department.id]: 'dept_2', [API.department.name]: 'Department 2'},
				{[API.department.id]: 'dept_3', [API.department.name]: 'Department 3'},
			];
		});

		afterEach(() => {
			moxios.uninstall();
		});

		it('search() should set state and perform search', (done) => {
			wrapper.instance().search('abc');

			expect(wrapper.instance().state.search).to.be.equal('abc');

			moxios.wait(function () {
				const request = moxios.requests.mostRecent();
				request.respondWith({
					status: 200,
					response: [
						{
							[API.person.firstName]: 'abc',
							[API.person.lastName]: 'def',
							[API.person.department]: 'dept_1'
						}
					]
				}).then(() => {
					expect(request.url).to.be.equal(API.url + 'people?q=abc&');
					done();
				})
			});

		});



	});

});

// ./node_modules/.bin/mocha --require babel-register --require babel-polyfill --require ignore-styles --require jsdom-global/register --require config/mocha.js './src/containers/People/People.spec.js'
