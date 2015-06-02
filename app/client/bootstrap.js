getUserLanguage = function () {
	return navigator.language || navigator.userLanguage;
};

Meteor.startup(function () {

	TAPi18n.setLanguage(getUserLanguage())
		.done(function () {
			console.log('language set');
		})
		.fail(function (error_message) {
			console.log(error_message);
		});
});