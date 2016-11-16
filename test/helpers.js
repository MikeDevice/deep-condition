'use strict';

var _ = require('underscore'),
	deepCondition = require('../lib/deep-condition'),
	expect = require('expect.js');

var wrapFunctions = function(indicatorHash, functionsHashes) {
	return _(functionsHashes).map(function(hash, index) {
		return function() {
			hash.func.call(this);
			indicatorHash[index] = true;
		};
	});
};

exports.checkDeepCondition = function(params, functionsHashes) {
	var indicatorHash = {};
	var functions = wrapFunctions(indicatorHash, functionsHashes);

	deepCondition.apply(null, [params].concat(functions));

	_(functionsHashes).each(function(hash, index) {
		if (hash.shouldCalled) {
			expect(indicatorHash[index]).to.be(true);
		} else {
			expect(indicatorHash[index]).to.be(void 0);
		}
	});
};
