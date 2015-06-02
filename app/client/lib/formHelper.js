formHelper = {
	load: function (formId) {
		var _object = {};

		$.each($('#' + formId).serializeArray(), function () {
			var _value = this.value;

			//Converters
			if ($('*[name=' + this.name + ']').data('converter') === 'float') {
				_value = parseFloat(_value);
			} else if ($('*[name=' + this.name + ']').data('converter') === 'date') {
				_value = new Date(_value);
			}

			//
			if (_object.hasOwnProperty(this.name)) {
				_object[this.name] = $.makeArray(_object[this.name]);
				_object[this.name].push(_value);
			} else {
				_object[this.name] = _value;
			}
		});

		$('#' + formId).trigger("reset");

		return _object;
	}
}