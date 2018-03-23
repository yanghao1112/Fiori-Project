sap.ui.define([
	"sap/ui/core/format/NumberFormat"
], function (NumberFormat) {
	"use strict";
	let oNumberFormat = NumberFormat.getFloatInstance();
    let oPercentFormat = NumberFormat.getPercentInstance();
	return {
		numberText: function (aNumber) {
			return oNumberFormat.format(aNumber)
		},
		percentText: function (aNumber) {
			return oPercentFormat.format(aNumber)
		}
	};
});