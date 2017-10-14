import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import TextField from 'material-ui/TextField';
import IconButton from 'material-ui/IconButton/IconButton';
import SearchIcon from 'material-ui/svg-icons/action/search';

import './Search.css';

class Search extends PureComponent {

	constructor(props) {
		super(props);

		this.field = null;
	}

	performSearch = (e) => {
		if (e) {
			e.preventDefault();
		}
		this.props.onChange(this.field.getValue());
	};

	render() {

		const {query} = this.props;

		return (
			<div className="search">
				<form onSubmit={this.performSearch}>
					<TextField
						autoComplete="off"
						ref={(el) => this.field = el}
						className="search__field"
						hintText="Enter keyword"
						floatingLabelText="Search for firstname, lastname"
						defaultValue={query}
						fullWidth={true}
						onChange={this.performSearch}
					/>

					<div className="search__icon">
						<IconButton tooltip="Search" type="submit">
							<SearchIcon />
						</IconButton>
					</div>
				</form>
			</div>
		);
	}

	static propTypes = {
		query: PropTypes.string,
		onChange: PropTypes.func
	};
}

export default Search;
