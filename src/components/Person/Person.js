import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import _ from 'lodash';
import Paper from 'material-ui/Paper';

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

		const {firstName, lastName, profileImage, position, department, office, phone, mobile, email, sortByDepartment} = this.props;
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
			<Paper zDepth={selected ? 3 : 0} tabIndex={0} onFocus={this.select} onBlur={this.deselect} className={classes}>

				<div className="person__photo" style={{backgroundImage: 'url(' + profileImage + ')'}} />

				<div className="highlights">
					<span className="person__name">{firstName} {lastName}</span><br />
					<span className="person__position">{position}</span><br />

					{
						!sortByDepartment &&
							<span className="person__department">{department}</span>
					}

				</div>

				<div className="details">
					<h2 className="details__title">Details</h2>
					<dl>
						{
							_.map(details, (value, key) => {
								let detailBlock;
								if (value && value.length) {

									if (key === 'E-mail') {
										value = <a href={'mailto:' + value}>{value}</a>;
									} else if (key === 'Mobile' || key === 'Phone') {
										value = <a href={'tel:' + value}>{value}</a>;
									}

									detailBlock = (
										<div key={key} className="details__group">
											<dt className="details__key">{key}</dt>
											<dd className="details__value">{value}</dd>
										</div>
									);
								}
								return detailBlock;
							})
						}
					</dl>
				</div>


			</Paper>
		);
	}

	static propTypes = {
		firstName: PropTypes.string.isRequired,
		lastName: PropTypes.string.isRequired,
		profileImage: PropTypes.string.isRequired,
		position: PropTypes.string.isRequired,
		department: PropTypes.string.isRequired,
		office: PropTypes.string.isRequired,
		phone: PropTypes.string,
		mobile: PropTypes.string,
		email: PropTypes.string.isRequired,
		sortByDepartment: PropTypes.bool
	};

}

export default Person;
