require('jsdom-global')(null, {
	url: 'http://localhost:3001',
	beforeParse: function (window) {}
});