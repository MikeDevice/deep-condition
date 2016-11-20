'use strict';

var _ = require('underscore'),
	deepCondition = require('../lib/deep-condition');

var slice = Array.prototype.slice;

exports.createIndicator = function(values) {
	var indicator = {};

	if (_.isArray(values)) {
		_(values).each(function(value, index) {
			indicator[index] = value;
		});
	} else {
		_(_.range(values)).each(function(value, index) {
			indicator[index] = false;
		});
	}

	return indicator;
};

exports.deepConditionWrapper = function(params) {
	var functions;

	if (typeof params === 'function') {
		params = {};
		functions = slice.call(arguments);
	} else {
		params = _.first(slice.call(arguments, 0, 1));
		functions = slice.call(arguments, 1);
	}

	var indicator = exports.createIndicator(functions.length);

	functions = _(functions).map(function(func, index) {
		return function() {
			func.apply(this, arguments);
			indicator[index] = true;
		};
	});

	deepCondition.apply(null, [params].concat(functions));

	return indicator;
};
