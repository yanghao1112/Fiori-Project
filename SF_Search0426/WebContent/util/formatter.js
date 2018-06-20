sap.ui.define([
	"sap/ui/core/format/NumberFormat"
], function (NumberFormat) {
	"use strict";
	let oNumberFormat = NumberFormat.getFloatInstance();
    let oPercentFormat4 = NumberFormat.getPercentInstance({
    	decimals: 4
    });
    let oPercentFormat0 = NumberFormat.getPercentInstance({
    	decimals: 0
    });
	return {
		numberText: function (aNumber) {
			return aNumber ? oNumberFormat.format(aNumber) : aNumber;
		},
		percentText: function (aNumber) {
			return aNumber ? oPercentFormat4.format(aNumber) : aNumber;
		},
		percentText0: function (aNumber) {
			return aNumber ? oPercentFormat0.format(aNumber) : aNumber;
		}
	};
});