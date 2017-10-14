import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';

import './Filter.css';

class Filter extends PureComponent {
	render() {

		const {name, children} = this.props;

		return (
			<div className="filter">

			</div>
		);
	}

	static propTypes = {
	};

}

export default Filter;
