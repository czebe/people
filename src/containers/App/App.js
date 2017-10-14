import React, {Component} from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import injectTapEventPlugin from 'react-tap-event-plugin';

import People from '../People/People';

class App extends Component {

	constructor(props) {
		super(props);
		injectTapEventPlugin();
	}

	render() {
		return (
			<MuiThemeProvider>
				<People defaultCity={window.city} />
			</MuiThemeProvider>
		);
	}
}

export default App;
