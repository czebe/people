import React from 'react';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import {expect} from 'chai';
import {shallow} from 'enzyme';

import App from './App';
import People from '../People/People';

Enzyme.configure({adapter: new Adapter()});

describe('<App />', () => {

	it('renders without crashing', () => {
		const wrapper = shallow(<App />);
		expect(wrapper.find(People)).to.have.length(1);
	});

});

// ./node_modules/.bin/mocha --require babel-register --require babel-polyfill --require ignore-styles --require jsdom-global/register --require config/mocha.js './src/containers/App/App.spec.js'
