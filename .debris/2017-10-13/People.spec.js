import React from 'react';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import {expect} from 'chai';
import sinon from 'sinon';
import moxios from 'moxios';
import {shallow} from 'enzyme';

import API from '../../api/Api';
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

	describe.only('Sorting', () => {

		beforeEach(() => {
			wrapper = shallow(<People defaultCity="Budapest" />, {disableLifecycleMethods: true});
		});

		it('should sort data by department', () => {

			// Initialize departments
			wrapper.instance().departments = [
				{[API.department.id]: 'dept_1', [API.department.name]: 'Department 1'},
				{[API.department.id]: 'dept_2', [API.department.name]: 'Department 2'},
				{[API.department.id]: 'dept_3', [API.department.name]: 'Department 3'},
			];

			const unsorted = [
				{[API.person.firstName]: 'A', [API.person.lastName]: 'A', [API.person.department]: 'dept_1'},
				{[API.person.firstName]: 'B', [API.person.lastName]: 'B', [API.person.department]: 'dept_2'},
				{[API.person.firstName]: 'C', [API.person.lastName]: 'C', [API.person.department]: 'dept_3'}
			];

			const sorted = wrapper.instance().applySorting(unsorted);

			console.log(sorted);

		});


	});

});

// ./node_modules/.bin/mocha --require babel-register --require babel-polyfill --require ignore-styles --require jsdom-global/register --require config/mocha.js './src/containers/People/People.spec.js'