'use strict';

var _ = require('underscore'),
	expect = require('expect.js'),
	helpers = require('./helpers');

var noop = _.noop;

describe('Deep condition test', function() {
	var deepConditionWrapper = helpers.deepConditionWrapper;

	describe('Functions call', function() {
		it('All conditions are true', function() {
			var indicator = helpers.createIndicator([true, true, true]);

			var conditionResult = deepConditionWrapper(noop, noop, noop);

			expect(conditionResult).to.eql(indicator);
		});

		it('Default condition is false', function() {
			var indicator = helpers.createIndicator([false, false, false]);

			var conditionResult = deepConditionWrapper({
				condition: false
			}, noop, noop, noop);

			expect(conditionResult).to.eql(indicator);
		});

		it('Set false condition in first function', function() {
			var indicator = helpers.createIndicator([true, false, false]);

			var conditionResult = deepConditionWrapper(
				function() {
					this.nextCondition(false);
				},
				noop,
				noop
			);

			expect(conditionResult).to.eql(indicator);
		});

		it('Set false condition in second function', function() {
			var indicator = helpers.createIndicator([true, true, false]);

			var conditionResult = deepConditionWrapper(
				noop,
				function() {
					this.nextCondition(false);
				},
				noop
			);

			expect(conditionResult).to.eql(indicator);
		});

		it('Set false condition in last function', function() {
			var indicator = helpers.createIndicator([true, true, true]);

			var conditionResult = deepConditionWrapper(
				noop,
				noop,
				function() {
					this.nextCondition(false);
				}
			);

			expect(conditionResult).to.eql(indicator);
		});
	});

	describe('Conditions', function() {
		describe('Rigth conditions', function() {
			var conditions = [{}, [], 10, 'hello', true];

			_(conditions).each(function(condition) {
				it('Set condition: ' + condition, function() {
					var indicator = helpers.createIndicator([true, true, true]);

					var conditionResult = deepConditionWrapper(
						function() {
							this.nextCondition(condition);
						},
						noop,
						noop
					);

					expect(conditionResult).to.eql(indicator);
				});
			});
		});

		describe('Wrong conditions', function() {
			var conditions = [null, void 0, NaN, '', 0, false];

			_(conditions).each(function(condition) {
				it('Set condition: ' + condition, function() {
					var indicator = helpers.createIndicator([true, false, false]);

					var conditionResult = deepConditionWrapper(
						function() {
							this.nextCondition(condition);
						},
						noop,
						noop
					);

					expect(conditionResult).to.eql(indicator);
				});
			});
		});
	});

	describe('Else statement', function() {
		it('Set default custom else statement', function() {
			var indicator;

			deepConditionWrapper({
				condition: false,
				elseStatement: function() {indicator = true;}
			}, noop);

			expect(indicator).to.be(true);
		});

		it('Set custom else statement in function', function() {
			var indicator;

			deepConditionWrapper(
				function() {
					this.nextCondition(false);
					this.nextElseStatement(function() {
						indicator = true;
					});
				},
				noop
			);

			expect(indicator).to.be(true);
		});
	});
});
