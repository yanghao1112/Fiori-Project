/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.declare("hcm.approve.leaverequest.util.NumberFormatter");jQuery.sap.require("sap.ca.ui.model.format.NumberFormat");hcm.approve.leaverequest.util.NumberFormatter=(function(){"use strict";return{formatNumberStripZeros:function(n){var a=sap.ca.ui.model.format.NumberFormat.getInstance();a.oFormatOptions.decimals=2;if(typeof n==="string"){return a.format(Number(n));}return a.format(n);},formatNumberStripZerosDays:function(n){var a=sap.ca.ui.model.format.NumberFormat.getInstance();a.oFormatOptions.decimals=0;if(typeof n==="string"){return a.format(Number(n));}return a.format(n);}};}());
