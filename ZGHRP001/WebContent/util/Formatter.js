jQuery.sap.declare("sap.ZG001.timesheet.input.daily.util.Formatter");
sap.ZG001.timesheet.input.daily.util.Formatter = {
/*	fmtCodeText : function(aCode, aText) {
		if (aCode) {
			if (aText) {
				return aText + " (" + aCode + ")";
			} else {
				return aCode;
			}
		} else {
			return "";
		}
	},*/
	fmtCompensatingDay: function(aDate) {
		if (aDate){
			var oDateFormat = sap.ui.core.format.DateFormat
					.getDateTimeInstance({
						pattern : "yyyy/MM/dd",
						UTC: true
					});
			return oDateFormat.format(aDate);

		} else {
			return "";
		}
	},
	fmt36PhoneVisible: function(aPhoneFlag, aManagerFlag) {
		if(aPhoneFlag) {
			return aManagerFlag;
		}  else {
			return false;
		}
	},
	fmt36NoPhoneVisible: function(aNoPhoneFlag, aManagerFlag) {
		if(aNoPhoneFlag) {
			return aManagerFlag;
		} else {
			return false;
		}
	},
	fmtSpanSingle : function(aIsPhone) {
		if (aIsPhone) {
			return "L12 M12 S12";
		} else {
			return "L7 M7 S7";
		}
	},
	fmtSpanMulti : function(aIsPhone) {
		if (aIsPhone) {
			return "L12 M12 S12";
		} else {
			return "L3 M3 S3";
		}
	},
	fmtSpanLabel : function(aIsPhone) {
		if (aIsPhone) {
			return "L12 M12 S12";
		} else {
			return "L3 M3 S3";
		}
	},
	fmtpanTSCode : function(aIsPhone) {
		if (aIsPhone) {
			return "L12 M12 S12";
		} else {
			return "L7 M7 S7";
		}
	},
	fmtpanTSSubCode : function(aIsPhone) {
		if (aIsPhone) {
			return "L12 M12 S12";
		} else {
			return "L2 M2 S2";
		}
	},
	fmtPersonalPortalVisible : function(aVisible,aNoPhone) {
		return aVisible && aNoPhone;
	}
}
