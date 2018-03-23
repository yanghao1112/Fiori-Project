/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.declare("hcm.approve.leaverequest.util.Conversions");
jQuery.sap.require("sap.ca.ui.model.format.DateFormat");
jQuery.sap.require("hcm.approve.leaverequest.util.NumberFormatter");
jQuery.sap.require("hcm.approve.leaverequest.Configuration");
/*global hcm */
hcm.approve.leaverequest.util.Conversions = (function() {
	var _cachedModelObj = {};
	_cachedModelObj.exist = true;
	return {
		formatterAbsenceDuration: function(AbsenceDays, AbsenceHours, AllDayFlag) {
			var oAbsenceDays, oAbsenceHours, oDuration;
			if (AbsenceDays === null || AbsenceHours === null || AllDayFlag === null) {
				return "";
			}
			oAbsenceDays = AbsenceDays;
			oAbsenceHours = AbsenceHours;
			if (AllDayFlag) {
				oDuration = hcm.approve.leaverequest.util.NumberFormatter.formatNumberStripZerosDays(oAbsenceDays);
			} else {
				oDuration = hcm.approve.leaverequest.util.NumberFormatter.formatNumberStripZeros(oAbsenceHours);
			}
			return oDuration;
		},

		// convert the UTC Datestring to the local timezone
		formatterAbsenceDurationUnit: function(AbsenceDays, AbsenceHours,
			AllDayFlag) {
			var oAbsenceDays, oAbsenceHours, oDurationUnit;
			var oBundle = hcm.approve.leaverequest.Configuration.oApplicationFacade.getResourceBundle();
			if (AbsenceDays === null || AbsenceHours === null || AllDayFlag === null) {
				return "";
			}
			oAbsenceDays = AbsenceDays;
			oAbsenceHours = AbsenceHours;

			if (AllDayFlag) {
				if (parseInt(oAbsenceDays, 10) === 1) {
					oDurationUnit = oBundle.getText("util.Conversions.Day_Singular");
				} else {
					oDurationUnit = oBundle.getText("util.Conversions.Days");
				}
			} else {
				if (parseInt(oAbsenceHours, 10) === 1) {
					oDurationUnit = oBundle.getText("util.Conversions.Hour_Singular");
				} else {
					oDurationUnit = oBundle.getText("util.Conversions.Hours");
				}
			}
			return oDurationUnit;
		},

		formatterAbsenceDurationAndUnit: function(AbsenceDays, AbsenceHours, AllDayFlag) {
			var oAbsenceDays, oAbsenceHours, oDurationUnit;
			var oBundle = hcm.approve.leaverequest.Configuration.oApplicationFacade.getResourceBundle();
			if (AbsenceDays === null || AbsenceHours === null || AllDayFlag === null) {
				return "";
			}
			oAbsenceDays = AbsenceDays;
			oAbsenceHours = AbsenceHours;
			if (AllDayFlag) {
				oAbsenceDays = hcm.approve.leaverequest.util.NumberFormatter.formatNumberStripZerosDays(oAbsenceDays);
				if (parseInt(oAbsenceDays, 10) === 1) {
					oDurationUnit = oBundle.getText("util.Conversions.Value_Day_Singular", [oAbsenceDays]);
				} else {
					oDurationUnit = oBundle.getText("util.Conversions.Value_Days", [oAbsenceDays]);
				}
			} else {
				oAbsenceHours = hcm.approve.leaverequest.util.NumberFormatter.formatNumberStripZeros(oAbsenceHours);
				if (parseInt(oAbsenceHours, 10) === 1) {
					oDurationUnit = oBundle.getText("util.Conversions.Value_Hour_Singular", [oAbsenceHours]);
				} else {
					oDurationUnit = oBundle.getText("util.Conversions.Value_Hours", [oAbsenceHours]);
				}
			}

			return oDurationUnit;
		},

		formatterListCancelStatus: function(sLeaveRequestType) {
			var returnValue = "";
			var oBundle = hcm.approve.leaverequest.Configuration.oApplicationFacade.getResourceBundle();
			if (sLeaveRequestType && sLeaveRequestType.toString() === "3") {
				returnValue = oBundle.getText("view.List.CancellationStatus");
			}
			return returnValue;
		},

		formatterHeaderCancelStatus: function() {
			//for unknown reasons previous code was not working when there was only one argument from the s4view
			var returnValue = "";
			if (arguments.length > 0) {
				var oBundle = hcm.approve.leaverequest.Configuration.oApplicationFacade.getResourceBundle();
				if (arguments[0] && (arguments[0]).toString() === "3") {
					return oBundle.getText("view.Header.CancellationStatus");
				}
			}
			return returnValue;
		},

		formatterCurrentBalanceVisible: function(currentBalTimeUnitCode) {
			var returnValue = true;
			if (!currentBalTimeUnitCode) {
				returnValue = false;
			}
			// '000' is the initial value; only in this case do not show current
			// balance
			// Remark: Even sick leave (code '001') may require current balance
			if (currentBalTimeUnitCode && currentBalTimeUnitCode.toString() === "000") {
				returnValue = false;
			}
			return returnValue;
		},
		
		formatterDeductionVisible: function(deduction) {
				var returnValue = true;
			if (!deduction) {
				returnValue = false;
			}
			if (deduction === "0.00000") {
				returnValue = false;
			}
			return returnValue;
		},

		formatterCurrentBalance: function(CurrentBalance, CurrentBalTimeUnitCode) {
			var oCurrentBalance = 0,
				oCurrentBalTimeUnitCode = 0,
				oResCurrentBalance = 0,
				oBundle = hcm.approve.leaverequest.Configuration.oApplicationFacade.getResourceBundle();
			if (CurrentBalance === null || !CurrentBalTimeUnitCode === null) {
				return "";
			}
			oCurrentBalance = CurrentBalance;
			oCurrentBalTimeUnitCode = CurrentBalTimeUnitCode;
			oCurrentBalance = hcm.approve.leaverequest.util.NumberFormatter.formatNumberStripZeros(oCurrentBalance);
			// current balance unit = days
			if (oCurrentBalTimeUnitCode && oCurrentBalTimeUnitCode.toString() === "010") {
				if (parseInt(oCurrentBalance, 10) === 1) {
					oResCurrentBalance = oBundle.getText("util.Conversions.Value_Day_Singular", [oCurrentBalance]);
				} else {
					oResCurrentBalance = oBundle.getText("util.Conversions.Value_Days", [oCurrentBalance]);
				}
			}
			// current balance unit = hours
			if (oCurrentBalTimeUnitCode && oCurrentBalTimeUnitCode.toString() === "001") {
				if (parseInt(oCurrentBalance, 10) === 1) {
					oResCurrentBalance = oBundle.getText("util.Conversions.Value_Hour_Singular", [oCurrentBalance]);
				} else {
					oResCurrentBalance = oBundle.getText("util.Conversions.Value_Hours", [oCurrentBalance]);
				}
			}
			return oResCurrentBalance;
		},

		formatterEmployeeID: function(sEmployeeID) {
			if (!sEmployeeID) {
				return "";
			}
			return hcm.approve.leaverequest.Configuration.oApplicationFacade.getResourceBundle().getText("view.Header.EmployeeID", [sEmployeeID]);
		},

		formatterOverlapsVisible: function(sOverlaps) {
			var returnValue = true;
			if (!sOverlaps) {
				returnValue = false;
			}
			if (parseInt(sOverlaps, 10) === 0) {
				returnValue = false;
			}
			return returnValue;
		},

		formatterOverlaps: function(sOverlaps) {
			var returnValue = "",
				oBundle = hcm.approve.leaverequest.Configuration.oApplicationFacade.getResourceBundle();
			if (parseInt(sOverlaps, 10) === 1) {
				returnValue = oBundle.getText("util.Conversions.OverlapSing", [sOverlaps]);
			} else if (sOverlaps > 1) {
				returnValue = oBundle.getText("util.Conversions.OverlapsPl", [sOverlaps]);
			}
			return returnValue;
		},

		formatterOverlapLink: function(sOverlaps) {
			var returnValue = "",
				oBundle = hcm.approve.leaverequest.Configuration.oApplicationFacade.getResourceBundle();
			returnValue = oBundle.getText("util.Conversions.OverlapsPlLink");
			return returnValue;
		},

		// formate the timestamp of the service to number of days
		formatterTimestampToDate: function(sTimestamp) {
			var dateShortFormatter, oDateCreatedOn;
			dateShortFormatter = sap.ca.ui.model.format.DateFormat.getInstance({
				style: "short"
			});
			if (!sTimestamp) {
				return "";
			}
			if (typeof sTimestamp === "string") {
				if (sTimestamp.indexOf("Date") >= 0) {
					oDateCreatedOn = hcm.approve.leaverequest.util.Conversions.convertDateStringToDate(sTimestamp);
				} else {
					oDateCreatedOn = hcm.approve.leaverequest.util.Conversions.convertTimestampToDate(sTimestamp);
				}
			} else {
				oDateCreatedOn = new Date(sTimestamp);
			}
			oDateCreatedOn = new Date(oDateCreatedOn.getUTCFullYear(), oDateCreatedOn.getUTCMonth(), oDateCreatedOn.getUTCDate());
			return dateShortFormatter.formatDaysAgo(oDateCreatedOn);
		},

		formatterAbsenceDays3: function(StartDate, StartTime, EndDate, EndTime, AllDayFlag) {
			// old interface: (sTimeRange, oContext)
			var oTimeRange, oStartDate, oEndDate, oStartTime, oEndTime, dateFormatter;
			dateFormatter = sap.ca.ui.model.format.DateFormat.getInstance({
				style: "full"
			});
			// bug in UI5: function is called several times - only the last time
			// all parameters are available!
			if (StartDate === null || StartTime === null || EndDate === null || EndTime === null || AllDayFlag === null) {
				return "";
			}
			try {
				oStartDate = dateFormatter.format(hcm.approve.leaverequest.util.Conversions.getDate(StartDate), true);
				oEndDate = dateFormatter.format(hcm.approve.leaverequest.util.Conversions.getDate(EndDate), true);
				oStartTime = hcm.approve.leaverequest.util.Conversions.formatterTime(StartTime);
				oEndTime = hcm.approve.leaverequest.util.Conversions.formatterTime(EndTime);

				if (oStartDate === oEndDate) {
					if (!AllDayFlag) {
						if (oStartTime === oEndTime) {
							oTimeRange = "";
						} else {
							oTimeRange = "   " + oStartTime + " - " + oEndTime;
						}
					} else {
						oTimeRange = "";
					}
					oTimeRange = oStartDate + oTimeRange;
				} else {
					oTimeRange = oStartDate + " - " + oEndDate;
				}
			} catch (e) {
				jQuery.sap.log.warning("failed", ["formatterAbsenceDays3"], "approver.leaverequests.formatterAbsenceDays3");
				oTimeRange = "";
			}
			return oTimeRange;
		},

		formatterAbsenceDays3Short: function(StartDate, PTStartTime, EndDate, PTEndTime, AllDayFlag) {

			var oTimeRange, oStartDate, oEndDate, oStartTime, oEndTime, dateShortFormatter;
			// bug in UI5: function is called several times - only the last time
			// all parameters are available!
			if (StartDate === null || PTStartTime === null || EndDate === null || PTEndTime === null) {
				return "";
			}
			dateShortFormatter = sap.ca.ui.model.format.DateFormat.getInstance({
				style: "short"
			});
			try {
				oStartDate = dateShortFormatter.format(hcm.approve.leaverequest.util.Conversions.getDate(StartDate), true);
				oEndDate = dateShortFormatter.format(hcm.approve.leaverequest.util.Conversions.getDate(EndDate), true);
				oStartTime = hcm.approve.leaverequest.util.Conversions.formatterTime(PTStartTime);
				oEndTime = hcm.approve.leaverequest.util.Conversions.formatterTime(PTEndTime);

				if (oStartDate === oEndDate) {
					if (!AllDayFlag) {
						if (oStartTime === oEndTime) {
							oTimeRange = "";
						} else {
							oTimeRange = "   " + oStartTime + " - " + oEndTime;
						}
					} else {
						oTimeRange = "";
					}
					oTimeRange = oStartDate + oTimeRange;
				} else {
					oTimeRange = oStartDate + " - " + oEndDate;
				}
			} catch (e) {
				jQuery.sap.log.warning("failed", ["formatterAbsenceDays3Short"], "approver.leaverequests.formatterAbsenceDays3Short");
				oTimeRange = "";
			}
			return oTimeRange;
		},

		formatterDate1: function(oDate) {
			var oFormatter = sap.ca.ui.model.format.DateFormat.getDateInstance({
				pattern: "MMddYYYY"
			});
			var oCreationDate = hcm.approve.leaverequest.util.Conversions.getDate(oDate);
			if (oCreationDate) {
				return oFormatter.format(oCreationDate);
			}
			return "";
		},

		formatterDate2: function(oDate) {
			var oFormatter = sap.ca.ui.model.format.DateFormat.getDateInstance({
					pattern: "YYYY-MM-ddThh:mm"
				}),
				oCreationDate = hcm.approve.leaverequest.util.Conversions.getDate(oDate);
			if (oCreationDate) {
				return oFormatter.format(oCreationDate);
			}
			return "";
		},
		formatterTimeDurationVisible: function(oAllDayFlag) {
			var returnValue = false;
			if (oAllDayFlag !== null) {
				if (!oAllDayFlag) {
					returnValue = true;
				}
			}
			return returnValue;
		},

		formatterTime: function(oTime) {
			// We put the times from the backend into today's date and then the
			// time is formatted.
			// Absence Start and End Time are shown as entered in backend,
			// without timezone
			if (oTime !== null) {

				var HoursMs, Hours, MinutesMs, Minutes;
				try {
					if (oTime.ms) {
						HoursMs = oTime.ms / (3600 * 1000);
						Hours = Math.floor(HoursMs);
						MinutesMs = oTime.ms - (Hours * 3600 * 1000);
						Minutes = Math.floor(MinutesMs / (60 * 1000));
					} else {
						Hours = oTime.substring(0, 2) * 1;
						Minutes = oTime.substring(2, 4) * 1;

					}
				} catch (e) {
					jQuery.sap.log.warning("failed to calculate time", "formatting time", [hcm.approve.leaverequest.util.conversions]);
				}
				var oHours = Hours < 10 ? "0" + Hours : Hours;
				var oMin = Minutes < 10 ? "0" + Minutes : Minutes;
				var isAMPM = oHours < 12 ? "AM" : "PM";
				/* FA 2255815 <<
				if (isAMPM === "PM") { */
				if (oHours > 12 ) {
				//FA 2255815 >>
					return ((oHours - 12) + ":" + oMin + "" + isAMPM);
				} else {
					return (oHours + ":" + oMin + "" + isAMPM);
				}

			}
			return "";

		},
		formatterDurationTime: function(oStartTime, oEndTime) {
			var StartTime = hcm.approve.leaverequest.util.Conversions.formatterTime(oStartTime);
			var EndTime = hcm.approve.leaverequest.util.Conversions.formatterTime(oEndTime);
			return (StartTime + "  -  " + EndTime);

		},

		formatterPT_Time: function(ptstring) {
			if (ptstring === null || ptstring.length !== 6) {
				return "";
			}
			var hoursMS = ptstring.substring(0, 2) * 60 * 60 * 1000,
				minutesMS = ptstring.substring(2, 4) * 60 * 1000,
				secondsMS = ptstring.substring(4, 6) * 1000,
				resultMS = hoursMS + minutesMS + secondsMS,
				oDate = new Date(),
				TimezoneOffset = oDate.getTimezoneOffset() * 60 * 1000,
				sTime = sap.ca.ui.model.format.DateFormat.getTimeInstance({
					style: "short"
				}).format(oDate, true),
				aTimeSegments = sTime.split(":"),
				sAmPm = "",
				lastSeg = aTimeSegments[aTimeSegments.length - 1],
				aAmPm = "";
			oDate.setTime(resultMS + TimezoneOffset);
			if (oDate) {
				// chop off seconds
				// check for am/pm 
				if (isNaN(lastSeg)) {
					aAmPm = lastSeg.split(" ");
					// result array can only have 2 entries
					aTimeSegments[aTimeSegments.length - 1] = aAmPm[0];
					sAmPm = " " + aAmPm[1];
				}
				return (aTimeSegments[0] + ":" + aTimeSegments[1] + sAmPm);
			}
		},

		convertDateStringToDate: function(sDateString) {
			// convert the UTC Datestring to the local timezone
			var iStartIndex = sDateString.indexOf("("),
				iEndIndex = sDateString.indexOf(")"),
				sDate = sDateString.substring(iStartIndex + 1, iEndIndex),
				oDate = new Date();
			oDate.setTime(sDate);
			return oDate;
		},

		convertTimestampToDate: function(sTimestamp) {
			// convert the UTC Date to the local timezone
			var oDateCreatedOn = new Date(),
				oDate = null,
				oType = new sap.ui.model.type.Date({
					source: {
						pattern: "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"
					},
					pattern: "yyyy,MM,dd",
					style: "medium"
				});
			oDateCreatedOn = oType.formatValue(sTimestamp, "string");

			oDate = new Date(oDateCreatedOn);
			return oDate;
		},

		convertUTCToLocalDate: function(oDate) {
			oDate = hcm.approve.leaverequest.util.Conversions.getDate(oDate);
			var oUtcDate = new Date();
			oUtcDate.setUTCDate(oDate.getDate());
			oUtcDate.setUTCFullYear(oDate.getFullYear());
			oUtcDate.setUTCHours(oDate.getHours());
			oUtcDate.setUTCMonth(oDate.getMonth());
			oUtcDate.setUTCMinutes(oDate.getMinutes());
			oUtcDate.setUTCSeconds(oDate.getSeconds());
			oUtcDate.setUTCMilliseconds(oDate.getMilliseconds());
			return oUtcDate;
		},

		convertLocalDateToUTC: function(oValue) {
			var oDate = null,
				oDateFormat = sap.ca.ui.model.format.DateFormat.getDateTimeInstance({
					pattern: "yyyy-MM-dd'T'HH:mm:ss"
				});
			if (oValue instanceof Date) {
				oDate = hcm.approve.leaverequest.util.Conversions.revertTimezoneOffset(oValue);
			} else if (typeof oValue === "string") {
				//expects mockdata(json) with format "2013-07-15T00:00:00"
				oDate = oDateFormat.parse(oValue);
			}
			return oDate;

		},

		revertTimezoneOffset: function(oValue) {
			var oDate, UTCDate, oMS, oTimezoneOffset, returnValue;
			if (oValue instanceof Date) {
				oDate = oValue;
				// correction for timezone to be done for date format
				// assumption: system/UI5 already did already some conversion which is 
				// reverted here!
				oMS = oDate.getTime();
				oTimezoneOffset = oDate.getTimezoneOffset() * 60 * 1000;
				oMS = oMS + oTimezoneOffset;
				UTCDate = new Date(oMS);
				returnValue = UTCDate;
			} else {
				// no conversion for other types
				returnValue = oValue;
			}
			return returnValue;
		},
		formatterNotesVisible: function(sCount) {
			var bVisible = false;
			if (sCount) {
				bVisible = true;
			}
			return bVisible;
		},
		formatErrorDialog: function(oError) {
			var message = "";
			var messageDetails = "";
			if (oError.response) {
				// initially take status text as a general message
				message = oError.response.statusText;
				var body = oError.response.body;
				var indexValue = body.indexOf("value");
				var indexValueEnd = body.substring(indexValue)
					.indexOf("}");
				if (indexValueEnd > -1) {
					message = body.substring(indexValue + 8,
						indexValue + indexValueEnd - 1);
				}
				var indexErr = body.indexOf("errordetails");
				var indexStart = body.substring(indexErr).indexOf(
					"message");
				var indexEnd = body
					.substring(indexErr + indexStart).indexOf(
						",");
				if (indexEnd > -1) {
					messageDetails = body.substring(indexErr + indexStart + 10, indexErr + indexStart + indexEnd - 1);
				}
			}
			var oMessage = {
				message: message,
				details: messageDetails,
				type: sap.ca.ui.message.Type.ERROR
			};
			sap.ca.ui.message.showMessageBox({
				type: oMessage.type,
				message: oMessage.message,
				details: oMessage.details
			});
		},
		_parseNotes: function(notesString) {
			try {
				var notesArray = notesString.split("::NEW::");
				var result = [];
				var oEntry = {};
				var temp, i, d, t, oDate;
				for (i = 1; i < notesArray.length; i++) {
					oEntry = {};
					temp = notesArray[i].split("::::");
					oEntry.Pernr = temp[0];
					oEntry.Author = temp[1];
					oEntry.Text = temp[2];
					d = temp[3].toString();
					t = temp[4].toString();
					oDate = new Date(d.substring(0, 4), parseInt(d.substring(4, 6), 10) - 1, d.substring(6, 8), t.substring(0, 2), t.substring(2, 4), t.substring(
						4, 6));
					var oDateFormat = sap.ca.ui.model.format.DateFormat.getDateTimeInstance({
						style: 'medium'
					});
					oEntry.Timestamp = oDateFormat.format(oDate);
					result.push(oEntry);
				}
				return {
					"NotesCollection": result
				};
			} catch (e) {
				//log the error
				jQuery.sap.log.error("Failed to parse notes details in utils.Formatters._parsenotes with input" + notesString);
			}
		},
		_parseAttachments: function(attachmentString, RequestID, oModel) {
			try {
				var attachments = attachmentString.split("::NEW::");
				var result = [];
				var oEntry = {};
				var temp, i, d, t, oDate;
				//first one will be junk
				for (i = 1; i < attachments.length; i++) {
					oEntry = {};
					temp = attachments[i].split("::::");
					oEntry.FileName = temp[0];
					oEntry.FileType = '';
					oEntry.Contributor = temp[2];
					d = temp[3].toString();
					t = temp[4].toString();
					oDate = new Date(d.substring(0, 4), parseInt(d.substring(4, 6), 10) - 1, d.substring(6, 8), t.substring(0, 2), t.substring(2, 4), t.substring(
						4, 6));
					var oDateFormat = sap.ca.ui.model.format.DateFormat.getDateTimeInstance({
						style: 'medium'
					});
					oEntry.UploadedDate = oDateFormat.format(oDate);
					oEntry.DocumentId = temp[5];
					oEntry.Status = temp[6];
					oEntry.FilePath = temp[7];
					oEntry.FileSize = parseFloat(temp[8], 10);
					oEntry.FileSizeDesc = temp[9];
					oEntry.MimeType = temp[1];
					//FA 2299607 >>
					//oEntry.FileUrl = oModel.sServiceUrl + "/FileAttachmentSet(LeaveRequestId='" + RequestID + "',ArchivDocId='" + temp[5] + "')/$value";
					oEntry.FileUrl = oModel.sServiceUrl + "/FileAttachmentSet(LeaveRequestId='" + RequestID + "',ArchivDocId='" + temp[5] + "',FileName='" + encodeURIComponent(oEntry.FileName) + "')/$value";
					//FA 2299607 >>
					result.push(oEntry);
				}
				return {
					"AttachmentsCollection": result
				};
			} catch (e) {
				//log the error
				jQuery.sap.log.error("Failed to parse notes details in util.conversions._parseAttachments with input" + attachmentString);
			}
		},

		_parseOverlapPernr: function(string) {
			try {
				if (string) {
					var overlapList = string.split("::NEW::");
					var result = [];
					var oEntry = {};
					var temp, i, j, tempString = "",
						oOverlapPernr = "";
					for (i = 1; i < overlapList.length; i++) {
						oEntry = {};
						temp = overlapList[i].split("::::");
						for (j = 1; j < temp.length - 2; j = j + 2) {
							oEntry.Name = temp[j - 1];
							tempString = temp[j - 1] + ", " + tempString;
							oOverlapPernr = temp[j] + " " + oOverlapPernr;
							oEntry.Pernr = temp[1];
							result.push(oEntry);
						}
					}
					return oOverlapPernr;
				}
			} catch (e) {
				//log the error
				jQuery.sap.log.error("Failed to parse notes details in utils.Formatters._parseOverlapList with input" + string);
				return "";
			}
		},
		_parseOverlapList: function(string) {
			try {
				if (string) {
					var overlapList = string.split("::NEW::");
					var result = [];
					var oEntry = {};
					var temp, i, j, tempString = "",
						oOverlapPernr = "";
					for (i = 1; i < overlapList.length; i++) {
						oEntry = {};
						temp = overlapList[i].split("::::");
						for (j = 1; j < temp.length - 2; j = j + 2) {
							oEntry.Name = temp[j - 1];
							// FA 2289207 <<
							//tempString = temp[j - 1] + ", " + tempString;
							tempString = temp[j - 1].trim() + ", " + tempString;
							// FA 2289207>>
							oOverlapPernr = temp[j] + " " + oOverlapPernr;
							oEntry.Pernr = temp[1];
							result.push(oEntry);
						}
					}
					
					tempString = tempString.substring(0,tempString.lastIndexOf(", ")) + "."; // FA 2289207
					return tempString;
				}
			} catch (e) {
				//log the error
				jQuery.sap.log.error("Failed to parse notes details in utils.Formatters._parseOverlapList with input" + string);
				return "";
			}
		},
		getDate: function(oValue) {
			var oDate;
			if (oValue instanceof Date) {
				oDate = oValue;
			} else {
				if (typeof oValue !== "string" && !(oValue instanceof String)) {
					return null;
				}
				if (oValue.substring(0, 6) !== "/Date(" || oValue.substring(oValue.length - 2, oValue.length) !== ")/") {
					return null;
				}
				var dateValue = oValue.substring(6, 6 + oValue.length - 8);
				oDate = new Date();
				oDate.setTime(dateValue * 1);
			}

			return oDate;
		}
	};

}());