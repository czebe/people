import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';

class PersonsGroup extends PureComponent {
	render() {

		const {children} = this.props;

		return (
			<div className="persons-group">
				{children}
			</div>
		);
	}

	static propTypes = {

	};

}

export default PersonsGroup;
