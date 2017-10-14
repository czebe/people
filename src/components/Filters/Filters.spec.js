import React from 'react';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import {expect} from 'chai';
import {shallow} from 'enzyme';
import sinon from 'sinon';

import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

import {offices, departments, positions} from '../../mocks/mock.db';

import API from '../../db/Api';
import Filters from '../Filters/Filters';

Enzyme.configure({adapter: new Adapter()});

describe('<Filters />', () => {

	let wrapper, onOfficeChange, onDepartmentChange, onPositionChange, onSortChange;

	beforeEach(() => {
		onOfficeChange = sinon.spy();
		onDepartmentChange = sinon.spy();
		onPositionChange = sinon.spy();
		onSortChange = sinon.spy();
		wrapper = shallow(
			<Filters
				offices={offices}
				departments={departments}
				positions={positions}
				sortByDepartment={false}
				currentOffice={API.all}
				currentDepartment={API.all}
				currentPosition={API.all}
				onOfficeChange={onOfficeChange}
				onDepartmentChange={onDepartmentChange}
				onPositionChange={onPositionChange}
				onSortChange={onSortChange}
			/>
		);
	});

	it('renders without crashing', () => {
		expect(wrapper.find('.filters')).to.have.length(1);
	});

	// TODO: Test components for expected behaviour...

});

// ./node_modules/.bin/mocha --require babel-register --require babel-polyfill --require ignore-styles --require jsdom-global/register --require config/mocha.js './src/components/Filters/Filters.spec.js'
