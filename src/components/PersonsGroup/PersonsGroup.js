import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';

import './PersonsGroup.css';

class PersonsGroup extends PureComponent {
	render() {

		const {name, children} = this.props;

		return (
			<div className="persons-group">
				<div className="persons-group__title"><span className="persons-group__name">{name}</span></div>
				<div className="persons-group__list">{children}</div>
			</div>
		);
	}

	static propTypes = {
		name: PropTypes.string.isRequired,
		children: PropTypes.oneOfType([
			PropTypes.arrayOf(PropTypes.node),
			PropTypes.node
		])
	};

}

export default PersonsGroup;
