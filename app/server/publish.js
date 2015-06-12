Meteor.publish('orders', function () {
	var currentUserId = this.userId;

	return OrderCollection.find({
		createdBy: currentUserId
	});
});

Meteor.publish('allOrders', function () {
	return OrderCollection.find();
});

Meteor.publish('ordersDatePrice', function () {
	return OrderCollection.find({}, {
		fields: {
			'date': 1,
			'price': 1,
			'items': 1
		},
		sort: {
			'date': 1
		}
	});
});