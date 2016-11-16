'use strict';

var _ = require('underscore'),
	helpers = require('./helpers');

var noop = function() {};

describe('Deep condition test', function() {
	describe('Call all functions', function() {
		var functionsHashes = [{
			shouldCalled: true,
			func: noop
		}, {
			shouldCalled: true,
			func: noop
		}];

		it('Without params', function() {
			helpers.checkDeepCondition({}, functionsHashes);
		});

		_([true, 1, 'hello', noop]).each(function(condition) {
			it('With true condition: ' + condition, function() {
				helpers.checkDeepCondition({
					condition: condition
				}, functionsHashes);
			});
		});

		it('Set custom condition', function() {
			helpers.checkDeepCondition({}, [{
				shouldCalled: true,
				func: function() {
					this.nextCondition(true);
				}
			}, {
				shouldCalled: true,
				func: noop
			}]);
		});
	});

	describe('Call not all functions', function() {
		it('First condition is false', function() {
			var functionsHashes = [{
				shouldCalled: false,
				func: noop
			}, {
				shouldCalled: false,
				func: noop
			}];

			helpers.checkDeepCondition({
				condition: false
			}, functionsHashes);
		});

		it('Set custom false condition to first function', function() {
			var functionsHashes = [{
				shouldCalled: true,
				func: function() {
					this.nextCondition(false);
				}
			}, {
				shouldCalled: false,
				func: noop
			}];

			helpers.checkDeepCondition({}, functionsHashes);
		});
	});
});
