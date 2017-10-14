import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';

class Layout extends PureComponent {
	render() {

		const {children} = this.props;

		return (
			<section className="layout">

				<header className="header">
					<h1 className="title">People</h1>
					<div className="search-box">

					</div>
				</header>

				<nav className="filters">

				</nav>

				{children}

			</section>
		);
	}

	static propTypes = {

	};

}

export default Layout;
