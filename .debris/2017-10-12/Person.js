import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import ValidatorPropTypes from 'react-validator-prop-types';
import classNames from 'classnames';
import _ from 'lodash';

import './Person.css';

// http://www.danielboschung.com/

class Person extends PureComponent {

	constructor(props) {
		super(props);

		this.state = {
			selected: false
		};
	}

	select = () => {
		this.setState(() => ({selected: true}));
	};

	deselect = () => {
		this.setState(() => ({selected: false}));
	};

	render() {

		const {firstName, lastName, profileImage, position, department, office, phone, mobile, email, fb, skype, instagram, twitter} = this.props;
		const {selected} = this.state;

		const classes = classNames({
			'person': true,
			'person--selected': selected
		});

		const details = {
			'Office': office,
			'E-mail': email,
			'Mobile': mobile,
			'Phone': phone
		};

		return (
			<div tabIndex={0} onFocus={this.select} onBlur={this.deselect} className={classes} style={{backgroundImage: 'url(' + profileImage + ')'}}>
				<div className="person__name">{firstName} {lastName}</div>
				<div className="person__position">{position}</div>
				<div className="person__department">{department}</div>

				<div className="details">
					<h2 className="details__title">Details</h2>
					<dl>
						{
							_.map(details, (value, key) => {
								let detailBlock;
								if (value && value.length) {
									detailBlock = (
										<div key={key}>
											<dt>{key}</dt>
											<dd>{value}</dd>
										</div>
									);
								}
								return detailBlock;
							})
						}
					</dl>
				</div>

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
