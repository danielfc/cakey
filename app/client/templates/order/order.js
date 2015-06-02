/*****************************************************************************/
/* Order: Event Handlers */
/*****************************************************************************/
Template.Order.events({
	'submit form': function (event) {
		event.preventDefault();
		if ($('input,select,textarea').jqBootstrapValidation('hasErrors')) {
			return;
		}

		var order = formHelper.load('orderForm');

		if (Session.get('editing')) {
			Meteor.call('updateOrder', Session.get('selectedOrder'), order);
		} else {
			Meteor.call('insertOrder', order);
		}

		Session.set('editing', false);
		Session.set('selectedOrder', undefined);
	},
	'click table.orders tr': function (event) {
		var orderId = this._id;
		Session.set('selectedOrder', orderId);
	},
	'click #remove': function () {
		var orderId = this._id;
		Meteor.call('removeOrder', orderId);
		Session.set('selectedOrder', orderId);
	},
	'click #edit': function () {
		var orderId = this._id;
		Session.set('selectedOrder', orderId);

		if (!orderId) {
			return;
		}

		var order = OrderCollection.findOne(orderId);

		$('#customer').val(order.customer);
		$('#date').val(order.date);
		$('#phone').val(order.phone);
		$('#cell').val(order.cell);
		$('#price').val(order.price);

		Session.set('editing', true);

	}
});

/*****************************************************************************/
/* Order: Helpers */
/*****************************************************************************/
Template.Order.helpers({
	getOrders: function () {
		return OrderCollection.find();
	},
	selectedOrder: function () {
		var selectedOrder = Session.get('selectedOrder');
		return selectedOrder;
	},
	selectedClass: function () {
		return (this._id === Session.get('selectedOrder')) ? "bg-primary" : "";
	},
	isEmpty: function () {
		return OrderCollection.find().count() === 0;
	}
});

/*****************************************************************************/
/* Order: Lifecycle Hooks */
/*****************************************************************************/
Template.Order.created = function () {};

Template.Order.rendered = function () {
	$('.datetime').datetimepicker();

	$('.phone').inputmask({
		mask: "(99) 9999-9999",
		greedy: false,
		clearMaskOnLostFocus: true,
		clearIncomplete: true
	});

	$("input,select,textarea").not("[type=submit]").jqBootstrapValidation();
};

Template.Order.destroyed = function () {};