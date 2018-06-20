sap.ui.define([
	"sap/ui/core/format/NumberFormat"
], function (NumberFormat) {
	"use strict";
	let oNumberFormat = NumberFormat.getFloatInstance();
    let oPercentFormat = NumberFormat.getPercentInstance({
    	decimals: 4
    });
	return {
		numberText: function (aNumber) {
			return aNumber ? oNumberFormat.format(aNumber) : aNumber;
		},
		percentText: function (aNumber) {
			return aNumber ? oPercentFormat.format(aNumber) : aNumber;
		}
	};
});