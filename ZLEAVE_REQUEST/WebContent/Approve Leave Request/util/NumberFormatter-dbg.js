/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.declare("hcm.approve.leaverequest.util.NumberFormatter");
jQuery.sap.require("sap.ca.ui.model.format.NumberFormat");

hcm.approve.leaverequest.util.NumberFormatter = (function() {
	"use strict";
	return {
		// strips unwanted leading or ending zeros
		formatNumberStripZeros: function(number) {
			var numberFormatter = sap.ca.ui.model.format.NumberFormat.getInstance();
			numberFormatter.oFormatOptions.decimals = 2;
			if (typeof number === "string") {
				return numberFormatter.format(Number(number));
			}
			return numberFormatter.format(number);
		},
		formatNumberStripZerosDays: function(number) {
			var numberFormatter = sap.ca.ui.model.format.NumberFormat.getInstance();
			numberFormatter.oFormatOptions.decimals = 0;
			if (typeof number === "string") {
				return numberFormatter.format(Number(number));
			}
			return numberFormatter.format(number);
		}
	};
}());