sap.ui.define([
	"sap/ui/core/format/NumberFormat"
], function (NumberFormat) {
	"use strict";
	let oNumberFormat = NumberFormat.getFloatInstance();
    let oPercentFormat = NumberFormat.getPercentInstance();
	return {
		numberText: function (aNumber) {
			return aNumber ? oNumberFormat.format(aNumber) : oNumberFormat.format(0);
		},
		percentText: function (aNumber) {
			return aNumber ? oPercentFormat.format(aNumber) : oNumberFormat.format(0);
		}
	};
});