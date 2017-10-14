import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import Checkbox from 'material-ui/Checkbox';

import API from '../../db/Api';

import './Filters.css';

class Filters extends PureComponent {

	render() {

		const {offices, departments, positions, sortByDepartment, currentOffice, currentDepartment, currentPosition, onOfficeChange, onDepartmentChange, onPositionChange, onSortChange} = this.props;
		const selectStyle = {
			whiteSpace: 'normal',
			lineHeight: 1.3,
			minHeight: 0,
			padding: '5px 0'
		};

		return (
			<div className="filters">

				<div className="filters__group">
					<SelectField floatingLabelText="Office" value={currentOffice} onChange={onOfficeChange} fullWidth={true}>
						<MenuItem value={API.all} primaryText="All" />
						{
							_.map(offices, (office) => {
								return <MenuItem key={office[API.office.id]} value={office[API.office.id]} primaryText={office[API.office.city] + '/' + office[API.office.country]} style={selectStyle} />;
							})
						}
					</SelectField>
				</div>


				<div className="filters__group">
					<SelectField floatingLabelText="Department" value={currentDepartment} onChange={onDepartmentChange} fullWidth={true}>
						<MenuItem value={API.all} primaryText="All" />
						{
							_.map(departments, (department) => {
								return <MenuItem key={department[API.department.id]} value={department[API.department.id]} primaryText={department[API.department.name]} style={selectStyle} />;
							})
						}
					</SelectField>
				</div>


				<div className="filters__group">
					<SelectField floatingLabelText="Position" value={currentPosition} onChange={onPositionChange} fullWidth={true}>
						<MenuItem value={API.all} primaryText="All" />
						{
							_.map(positions, (position) => {
								return <MenuItem key={position[API.position.id]} value={position[API.position.id]} primaryText={position[API.position.name]} style={selectStyle} />;
							})
						}
					</SelectField>
				</div>

				<div className="filters__group filters__group--options">
					<Checkbox label="Group by department" checked={sortByDepartment} onCheck={onSortChange} style={{width: 'auto', whiteSpace: 'nowrap', margin: 'auto'}}/>
				</div>

			</div>
		);
	}

	static propTypes = {
		offices: PropTypes.array.isRequired,
		departments: PropTypes.array.isRequired,
		positions: PropTypes.array.isRequired,
		sortByDepartment: PropTypes.bool,
		currentOffice: PropTypes.string.isRequired,
		currentDepartment: PropTypes.string.isRequired,
		currentPosition: PropTypes.string.isRequired,
		onOfficeChange: PropTypes.func.isRequired,
		onDepartmentChange: PropTypes.func.isRequired,
		onPositionChange: PropTypes.func.isRequired,
		onSortChange: PropTypes.func.isRequired
	};
}

export default Filters;
