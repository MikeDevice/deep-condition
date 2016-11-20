'use strict';

var slice = Array.prototype.slice;

var DeepCondition = function(params, functions) {
	params = params || {};
	functions = functions || [];

	this.condition = 'condition' in params ? params.condition : true;
	this.elseStatement = params.elseStatement || function() {};

	this.pattern = params.pattern || function(val) {
		return val;
	};

	for (var i = 0; i < functions.length; i++) {
		if (this.getCurrentCondition()) {
			this.hasCustomCondition = false;
			functions[i].apply(this);
		} else {
			this.getCurrentElseStatement()();
			break;
		}
	}
};

DeepCondition.prototype.getCurrentCondition = function() {
	var condition = this.hasCustomCondition ? this.customCondition :
		this.condition;

	return this.pattern(condition);
};

DeepCondition.prototype.getCurrentElseStatement = function() {
	return this.hasCustomElseStatement ? this.customElseStatement :
		this.elseStatement;
};

DeepCondition.prototype.nextCondition = function(condition) {
	this.customCondition = condition;
	this.hasCustomCondition = true;
};

DeepCondition.prototype.nextElseStatement = function(statement) {
	this.customElseStatement = statement;
	this.hasCustomElseStatement = true;
};

module.exports = function(params) {
	var functions;

	if (typeof params === 'function') {
		params = {};
		functions = slice.call(arguments);
	} else {
		params = params || {};
		functions = slice.call(arguments, 1);
	}

	return new DeepCondition(params, functions);
};
