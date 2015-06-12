HomeController = RouteController.extend({
	layoutTemplate: 'MasterLayout',

	subscriptions: function () {
		this.subscribe('ordersDatePrice').wait();
	},

	action: function () {
		this.render('Home');
	}
});