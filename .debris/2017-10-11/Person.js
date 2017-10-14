import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import ValidatorPropTypes from 'react-validator-prop-types';

class Person extends PureComponent {
	render() {

		const {firstName, lastName} = this.props;

		return (
			<div className="person">
				{firstName}
				{lastName}
			</div>
		);
	}

	static propTypes = {
		firstName: PropTypes.string.isRequired,
		lastName: PropTypes.string.isRequired,
		profileImage: ValidatorPropTypes.url,
		position: PropTypes.string.isRequired,
		department: PropTypes.string.isRequired,
		office: PropTypes.string.isRequired,
		phone: PropTypes.string,
		mobile: PropTypes.string,
		email: ValidatorPropTypes.email.isRequired,
		fb: ValidatorPropTypes.url,
		skype: ValidatorPropTypes.url,
		instagram: ValidatorPropTypes.url,
		twitter: ValidatorPropTypes.url
	};

}

export default Person;
