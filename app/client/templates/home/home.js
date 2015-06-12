/*****************************************************************************/
/* Home: Event Handlers */
/*****************************************************************************/
Template.Home.events({});

/*****************************************************************************/
/* Home: Helpers */
/*****************************************************************************/
Template.Home.helpers({
	getTotalPrice: function () {
		totalPrice();
		return Session.get('totalPrice');
	},
	getAverage: function () {
		var totalPrice = Session.get('totalPrice');
		var count = OrderCollection.find().count();

		if (count === 0) {
			return 0;
		}

		return Math.round(totalPrice / count);
	}
});

/*****************************************************************************/
/* Home: Lifecycle Hooks */
/*****************************************************************************/
Template.Home.created = function () {};

Template.Home.rendered = function () {
	this.autorun(function () {
		drawTotalByMonthChart();
		drawPercentualOfProducts();
	});
};

Template.Home.destroyed = function () {};

function totalPrice() {
	var orders = OrderCollection.find().fetch();

	var totalPrice = lodash.sum(orders, function (_order) {
		return _order.price;
	});

	Session.set('totalPrice', totalPrice);
}

function getOrdersByMonth() {

	var orders = OrderCollection.find().fetch();

	var _ordersByMonth = lodash.chain(orders)
		.map(function (_order) {
			var _dateAsString = moment(new Date(_order.date.getFullYear(), _order.date.getMonth() + 1, 0)).format('MM/YYYY');
			return {
				price: _order.price,
				date: _dateAsString
			};
		})
		.groupBy(function (_order) {
			return _order.date;
		})
		.map(function (_orders) {
			return {
				date: _orders[0].date,
				sum: lodash.sum(_orders, function (_order) {
					return _order.price;
				})
			};
		})
		.value();

	return _ordersByMonth;
}

function getCountByItems() {
	var _orders = OrderCollection.find().fetch();

	lodash.each(_orders, function (_order) {
		if (typeof _order.items !== Array) {
			_order.items = $.makeArray(_order.items);
		}
	});

	var countBy = lodash.countBy(_orders, function (_order) {
		return _order.items;
	});

	return countBy;
}

function drawPercentualOfProducts() {
	var _countByItems = getCountByItems();

	return new Highcharts.Chart({

		chart: {
			renderTo: 'graph-pie',
			plotBackgroundColor: null,
			plotBorderWidth: null,
			plotShadow: false
		},
		title: {
			text: '',
			margin: 0
		},
		tooltip: {
			pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
		},
		plotOptions: {
			pie: {
				allowPointSelect: true,
				cursor: 'pointer',
				dataLabels: {
					enabled: true,
					format: '<b>{point.name}</b>: {point.percentage:.1f} %',
					style: {
						color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
					}
				}
			}
		},
		series: [{
			type: 'pie',
			name: 'Product',
			data: [
                ['Cake', _countByItems['1']],
                ['Candy', _countByItems['2']]
            ]
        }]
	});
}

function drawTotalByMonthChart() {
	var _ordersByMonth = getOrdersByMonth();

	var _labels = lodash.map(_ordersByMonth, function (_order) {
		return _order.date;
	});
	var _pricesSum = lodash.map(_ordersByMonth, function (_order) {
		return _order.sum;
	});

	return new Highcharts.Chart({
		chart: {
			renderTo: 'graph-column',
			type: 'column'
		},
		title: {
			text: 'Monthly Sales'
		},
		subtitle: {
			text: 'Source: notes from Mônica'
		},
		xAxis: {
			categories: _labels
		},
		yAxis: {
			min: 0,
			title: {
				text: 'Amount ($)'
			}
		},
		tooltip: {
			headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
			pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
				'<td style="padding:0"><b>$ {point.y:.1f}</b></td></tr>',
			footerFormat: '</table>',
			shared: true,
			useHTML: true
		},
		plotOptions: {
			column: {
				pointPadding: 0.2,
				borderWidth: 0
			}
		},
		series: [{
			name: 'Year 2015',
			data: _pricesSum
        }]
	});
}