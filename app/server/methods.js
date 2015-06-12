/*****************************************************************************/
/* Server Only Methods */
/*****************************************************************************/
Meteor.methods({
	'insertOrder': function (order) {
		var currentUserId = Meteor.userId();

		order = lodash.assign(order, {
			createdBy: currentUserId
		});

		OrderCollection.insert(order);
	},
	'updateOrder': function (selectedOrder, order) {
		var currentUserId = Meteor.userId();

		OrderCollection.update({
			_id: selectedOrder,
			createdBy: currentUserId
		}, {
			$set: order
		});
	},
	'removeOrder': function (selectedOrder) {
		var currentUserId = Meteor.userId();

		OrderCollection.remove({
			_id: selectedOrder,
			createdBy: currentUserId
		});
	},
	'totalByPrice': function () {
		var currentUserId = Meteor.userId();

		var pipeline = [
			{
				$group: {
					_id: null,
					total: {
						$sum: "$price"
					}
				}
			}
];
		return OrderCollection.aggregate(pipeline);
	}
});