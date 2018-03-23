sap.ui.define([
	], function () {
		"use strict";

		return {
			/**
			 * Rounds the currency value to 2 digits
			 *
			 * @public
			 * @param {string} sValue value to be formatted
			 * @returns {string} formatted currency value with 2 digits
			 */
			currencyValue : function (sValue) {
				if (!sValue) {
					return "";
				}

				return parseFloat(sValue).toFixed(2);
			},
			
			/* Date Formatter */
			fmtDate: function (aDate){
				"use strict";
				var dateformat = sap.ui.core.format.DateFormat.getDateTimeInstance(
		    			{pattern : "dd.MM.yyyy"}
		    		);
		    	if(aDate === null || aDate === '') {
		    		return "";
		    	} else {
		    		return dateformat.format(aDate);
		    	}
		    },
		    
		    fmtItemCount: function (aCount){
		    	"use strict";
		    	if(aCount > 1) {
		    		return aCount + " items";
		    	} else {
		    		return aCount + " item";
		    	}
		    },
		    
		    fmtValue : function (aValue) {
		    	"use strict";
		    	if(typeof aValue === "string"){
		    		return Number(aValue);
		    	}
		    }
		};

	}
);