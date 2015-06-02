Meteor.publish('orders', function () {
	var currentUserId = this.userId;

	return OrderCollection.find({
		createdBy: currentUserId
	});
});