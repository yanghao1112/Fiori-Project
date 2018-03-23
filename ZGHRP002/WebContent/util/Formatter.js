jQuery.sap.declare("sap.ZG001.timesheet.input.weekly.util.Formatter");
sap.ZG001.timesheet.input.weekly.util.Formatter = {
	fmtCalendarDate: function(aDate) {
		if (aDate) {
			/* Format Date Object as pattern "MM/dd" for return */
			var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "MM/dd",UTC:true});
		    return oDateFormat.format(new Date(aDate));
		} else {
			return "";
		}
	},
	fmtCompensatingDay: function(aFlag, aDate) {
		if(aDate) {
			/* Format Date Object as pattern "yyyy/MM/dd" for return */
			var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyy/MM/dd",UTC:true});
			return oDateFormat.format(aDate);
			
		} else {
			return "";
		}
	},
	fmtCalendarTitle: function(aBeginDate, aEndDate) {
		if(aBeginDate && aEndDate) {
			/* Format Date Object as pattern "yyyy/MM" */
			var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyy/MM"});
			var sBegin = oDateFormat.format(aBeginDate);
			var sEnd = oDateFormat.format(aEndDate);
			if (sBegin === sEnd) {
				return sBegin;
			} else {
				return sBegin + " - " + sEnd;
			}
		} else {
			return "";
		}
	},
	fmtTimesheetCode: function(aTScode, aTSSubcode) {
		if(aTScode && aTSSubcode) {
			return aTScode + " " + aTSSubcode;
		} else if (aTScode) {
			return aTScode;
		} else {
			return "";
		}		
	},
	fmtTSEditable: function(aDay1Hours, aDay1Editable,
							aDay2Hours, aDay2Editable,
							aDay3Hours, aDay3Editable,
							aDay4Hours, aDay4Editable,
							aDay5Hours, aDay5Editable,
							aDay6Hours, aDay6Editable,
							aDay7Hours, aDay7Editable) {
		if(sap.ZG001.timesheet.input.weekly.util.Formatter._checkEditable(aDay1Hours, aDay1Editable) &&
				sap.ZG001.timesheet.input.weekly.util.Formatter._checkEditable(aDay2Hours, aDay2Editable) &&
				sap.ZG001.timesheet.input.weekly.util.Formatter._checkEditable(aDay3Hours, aDay3Editable) &&
				sap.ZG001.timesheet.input.weekly.util.Formatter._checkEditable(aDay4Hours, aDay4Editable) &&
				sap.ZG001.timesheet.input.weekly.util.Formatter._checkEditable(aDay5Hours, aDay5Editable) &&
				sap.ZG001.timesheet.input.weekly.util.Formatter._checkEditable(aDay6Hours, aDay6Editable) &&
				sap.ZG001.timesheet.input.weekly.util.Formatter._checkEditable(aDay7Hours, aDay7Editable) ) {
			if (!aDay1Editable && !aDay2Editable && !aDay3Editable && !aDay4Editable && !aDay5Editable && !aDay6Editable && !aDay7Editable) {
				return false;
			} else {
			/* When only day1~day7 has no data not editable return true */
				return true;
			}
		} else {
			/* When only day1~day7 has data not editable return false */
			return false;
		}
	},
	_checkEditable: function(aDayHours, aDayEditable) {
		if (aDayEditable === false && aDayHours !== 0 && aDayHours !== "" && aDayHours) {
			/* When aDayEditable is false and aDayHours is not 0 and aDayHours is not blank, return false */
			return false;
		} else {
			/* When aDayEditable is true or aDayHours is 0 or aDayHours is blank, return true */
			return true;
		}
	},
	fmtCodeText : function(aCode, aText) {
		if (aCode) {
			if (aText) {
				return aText + " (" + aCode + ")";
			} else {
				return aCode;
			}
		} else {
			return "";
		}
	},	
}