import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import Sticky from 'react-stickynode';
import IconButton from 'material-ui/IconButton/IconButton';
import FilterIcon from 'material-ui/svg-icons/content/filter-list';

import './Layout.css';

class Layout extends PureComponent {

	constructor(props) {
		super(props);

		this.state = {
			filtersOpen: false
		};
	}

	toggleFilters = (e) => {
		if (e) {
			e.preventDefault(); // Keyboard button press triggers 2 subsequent events (keypress + mouse click)
		}
		this.setState(() => ({filtersOpen: !this.state.filtersOpen}));
	};

	render() {

		const {search, filters, children} = this.props;
		const {filtersOpen} = this.state;

		return (
			<section className="layout">
				<Sticky innerZ={1}>
					<header className="header">
						<h1 className="title">People</h1>

						<div className="search-container">
							{search}
						</div>

						<div className="open-filters">
							<IconButton tooltip={filtersOpen ? 'Close filters' : 'Open filters'} onClick={this.toggleFilters}>
								<FilterIcon />
							</IconButton>
						</div>

						{
							filtersOpen &&
								<div className="filters-container">
									{filters}
								</div>
						}
					</header>
				</Sticky>

				{children}

			</section>
		);
	}

	static propTypes = {
		search: PropTypes.node,
		filters: PropTypes.node,
		children: PropTypes.oneOfType([
			PropTypes.arrayOf(PropTypes.node),
			PropTypes.node
		])
	};

}

export default Layout;
