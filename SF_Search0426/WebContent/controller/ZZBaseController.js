sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/pwaa/util/formatter",
	"sap/viz/ui5/format/ChartFormatter"
],
function(Controller, JSONModel, Formatter, ChartFormatter) {
	"use strict";
	return Controller.extend("sap.pwaa.controller.ZZBaseController", {
		oFormatter: Formatter,  // Formatter is an object instead of function
		
		onShowHelpContent: function(aEvent) {
			"use strict";
			// create popover
			let sPos = "Right";
			let oIcon = aEvent.getSource();
			let oCustomData = oIcon.getCustomData();
			let sText = oCustomData[0].getValue();
			
			if(oCustomData.length >= 2) {
				sPos = oCustomData[1].getValue();
			}
			
			if (! this._oPopover) {
				this._oPopover = sap.ui.xmlfragment("sap.pwaa.view.ZZHelpContent", this);
			}
			this._oPopover.setModel(new JSONModel({
				helpContent: sText
			}));
			jQuery.sap.delayedCall(0, this, function () {
				this._oPopover.setPlacement(sPos);
				this._oPopover.openBy(oIcon);
			});
		},
		
		/**
		 * Format Performance Motivation Chart left axis
		 * 0 -- C
		 * 1 -- B
		 * 2 -- A
		 * 3 -- L
		 * @private
		 */
		formatPrecentAxis: function(aValue) {
			return this.oFormatter.percentText0(aValue);
		},
	})
});