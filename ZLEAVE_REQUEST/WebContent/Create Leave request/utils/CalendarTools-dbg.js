/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.require("hcm.myleaverequest.utils.DataManager");
jQuery.sap.declare("hcm.myleaverequest.utils.CalendarTools");

hcm.myleaverequest.utils.CalendarTools = (function() {
	var _resourceBundle = null;
	return {
		// The oCache object holds one attribute for each month that has already been read
		// This attribute holds an Object with one array of days for each of the supported day type based on LR status (SENT, POSTED, APPROVED) 
		// plus one array for the day types derived from the workschedule (WEEKEND, PHOLIDAY)
		oCache : {},
		init : function(oresourceBundle) {
			_resourceBundle = oresourceBundle;
		},

		clearCache : function() {
			hcm.myleaverequest.utils.CalendarTools.oCache = {};
		},

		getDayLabelsForMonth : function(oDate, successCallback, errorCallback) {
			// this method reads the leave requests and work schedules for the month oDate is within and also for the previous and next month.
			// the results are evaluated (leave requests with status SENT, POSTED, APPROVED are considered; workschedules with status 1 
			// (WEEKEND) and 2 (PHOLIDAY) are considered)
			// the results are returned and stored in oCache for later use

			// returns day labels for the complete oDate's month

			// successCallback(oDayLabels, oUserData)
			// oDayLabels example:
			//	{
			//		"PHOLIDAY": ["2013-04-30T22:00:00.000Z",
			//			"2013-05-08T22:00:00.000Z",
			//			"2013-05-18T22:00:00.000Z",
			//			"2013-05-19T22:00:00.000Z"],
			//		"SENT": ["2013-05-01T22:00:00.000Z",
			//			"2013-05-06T22:00:00.000Z",
			//			"2013-05-13T22:00:00.000Z",
			//			"2013-05-14T22:00:00.000Z",
			//			"2013-05-15T22:00:00.000Z",
			//			"2013-05-16T22:00:00.000Z",
			//			"2013-05-20T22:00:00.000Z",
			//			"2013-05-21T22:00:00.000Z",
			//			"2013-05-22T22:00:00.000Z",
			//			"2013-05-23T22:00:00.000Z",
			//			"2013-05-25T22:00:00.000Z",
			//			"2013-05-26T22:00:00.000Z"],
			//		"WEEKEND": ["2013-05-03T22:00:00.000Z",
			//			"2013-05-04T22:00:00.000Z",
			//			"2013-05-10T22:00:00.000Z",
			//			"2013-05-11T22:00:00.000Z",
			//			"2013-05-17T22:00:00.000Z",
			//			"2013-05-24T22:00:00.000Z",
			//			"2013-05-25T22:00:00.000Z"],
			//		"POSTED": ["2013-05-28T22:00:00.000Z",
			//			"2013-05-29T22:00:00.000Z"]
			//	}

			// errorCallback(aErrorMessages, oUserData)

			// check if requested results are already in the cache
			var oRequestedMonthStartDate = hcm.myleaverequest.utils.CalendarTools.calcMonthStartDate(oDate); // use the 1st day of the month as key
			var oNextMonthStartDate = hcm.myleaverequest.utils.CalendarTools.calcNextMonthStartDate(oRequestedMonthStartDate);
			var oPreviousMonthStartDate = hcm.myleaverequest.utils.CalendarTools.calcPreviousMonthStartDate(oRequestedMonthStartDate);
	
			// check if work schedule results are already in the cache for 3 months
			var oCachedResult = hcm.myleaverequest.utils.CalendarTools.oCache[oRequestedMonthStartDate];
			var oCachedResultPrevious = hcm.myleaverequest.utils.CalendarTools.oCache[oPreviousMonthStartDate];
			var oCachedResultNext =hcm.myleaverequest.utils.CalendarTools.oCache[oNextMonthStartDate];
			
			var oStartDate = oPreviousMonthStartDate;
			var oEndDate = oNextMonthStartDate;
			
			//return only if all 3 months work schedules exist
			if (! ((oCachedResult === undefined) || (oCachedResultPrevious === undefined) ||( oCachedResultNext === undefined))) {
				successCallback(oCachedResult);
				return;
			}			
			
			//this is for the initial call
			if(oCachedResult === undefined){
				oEndDate = hcm.myleaverequest.utils.CalendarTools.approximateMonthEndDate(oNextMonthStartDate);
			}
			//if previous month doesn't exist
			else if(oCachedResultPrevious === undefined){
				oEndDate = hcm.myleaverequest.utils.CalendarTools.approximateMonthEndDate(oPreviousMonthStartDate);
				oStartDate = new Date(oPreviousMonthStartDate.getFullYear(), oPreviousMonthStartDate.getMonth() - 2, 1);
				oNextMonthStartDate = oPreviousMonthStartDate;
				oPreviousMonthStartDate = oStartDate;
				oRequestedMonthStartDate = new Date(oStartDate.getFullYear(), oStartDate.getMonth() + 1, 1);
			}
			//if next month doesn't exist
			else if(oCachedResultNext === undefined){
				oStartDate = oNextMonthStartDate;
				oEndDate = new Date(oStartDate.getFullYear(), oStartDate.getMonth() + 2, 1);
				oPreviousMonthStartDate = oStartDate;
				oNextMonthStartDate = oEndDate;
				oEndDate = hcm.myleaverequest.utils.CalendarTools.approximateMonthEndDate(oEndDate);
				oRequestedMonthStartDate = new Date(oStartDate.getFullYear(), oStartDate.getMonth() + 1, 1);
			}
			
			var _aLeaveRequests = null;
			var _aWorkSchedules = null;
			var _alreadyFailed = false;

			var fnSuccessCalback = successCallback;
			var fnErrorCallback = errorCallback;

			hcm.myleaverequest.utils.DataManager.getLeaveRequestsForTimePeriod(oStartDate, oEndDate, function(
					aLeaveRequests) {
				if (_alreadyFailed) {
					return;
				}
				_aLeaveRequests = aLeaveRequests;
				if (_aWorkSchedules !== null) {
					hcm.myleaverequest.utils.CalendarTools._finish(oStartDate, oEndDate, oRequestedMonthStartDate,
							oPreviousMonthStartDate, oNextMonthStartDate, _aLeaveRequests, _aWorkSchedules, fnSuccessCalback,
							fnErrorCallback);
				}
			}, function(aErrorMessages) {
				if (_alreadyFailed) {
					return;
				}
				_alreadyFailed = true;
				errorCallback(aErrorMessages);
			});

			hcm.myleaverequest.utils.DataManager.getWorkSchedulesForTimePeriod(oStartDate, oEndDate, function(
					aWorkSchedules) {
				if (_alreadyFailed) {
					return;
				}
				_aWorkSchedules = aWorkSchedules;
				if (_aLeaveRequests !== null) {
					hcm.myleaverequest.utils.CalendarTools._finish(oStartDate, oEndDate, oRequestedMonthStartDate,
							oPreviousMonthStartDate, oNextMonthStartDate, _aLeaveRequests, _aWorkSchedules, fnSuccessCalback,
							fnErrorCallback);
				}
			}, function(aErrorMessages) {
				if (_alreadyFailed) {
					return;
				}
				_alreadyFailed = true;
				errorCallback(aErrorMessages);
			});
		},

		_calcDayLabelsForMonth : function(_aLeaveRequests, _aWorkSchedules, oMonthStartDate, iDayOffset) {
			// This method checks for every day of the moth the Work Schedules staus and the status of leave requests for that day.
			// It returns an object containing one array of date objects for each of the following categories
			// APPROVED, SENT, POSTED, WEEKEND, PHOLIDAY
			// This information is used in S4 to set the colors of the days in the calendar control
			var oResult = {};
			var iMonthDayCount = hcm.myleaverequest.utils.CalendarTools.calcMonthDayCount(oMonthStartDate);
			for ( var iDay = 0; iDay < iMonthDayCount; iDay++) {
				var oDayDate = new Date(oMonthStartDate.getFullYear(), oMonthStartDate.getMonth(), iDay + 1);
				var bLeaveFound = false;
				for ( var iLeave = 0; iLeave < _aLeaveRequests.length; iLeave++) {
					if (_aLeaveRequests[iLeave].StatusCode
							&& (_aLeaveRequests[iLeave].StatusCode === "SENT" || _aLeaveRequests[iLeave].StatusCode === "POSTED" 
								|| _aLeaveRequests[iLeave].StatusCode === "APPROVED" || _aLeaveRequests[iLeave].StatusCode === "REJECTED")) {
						var oStart = hcm.myleaverequest.utils.Formatters.getDate(_aLeaveRequests[iLeave].StartDate);
						var oEnd = hcm.myleaverequest.utils.Formatters.getDate(_aLeaveRequests[iLeave].EndDate);
						oStart = new Date(oStart.getUTCFullYear(), oStart.getUTCMonth(), oStart.getUTCDate(),0,0,0);
						oEnd = new Date(oEnd.getUTCFullYear(), oEnd.getUTCMonth(), oEnd.getUTCDate(),0,0,0);
						if (hcm.myleaverequest.utils.CalendarTools.dayRangeMatch(oDayDate, oStart, oEnd)) {
							if (!oResult[_aLeaveRequests[iLeave].StatusCode]) {
								oResult[_aLeaveRequests[iLeave].StatusCode] = [oDayDate];
							} else {
								oResult[_aLeaveRequests[iLeave].StatusCode].push(oDayDate);
							}
							bLeaveFound = true;
						}
					}
				}
				if (!bLeaveFound && _aWorkSchedules.length > 0 && _aWorkSchedules[0].StatusValues.length > iDayOffset + iDay) {
				    var oDayStatus = (_aWorkSchedules[0].StatusValues[iDayOffset + iDay]).toString();
					if (oDayStatus === "2") {
						if (!oResult.WEEKEND) {
							oResult.WEEKEND = [oDayDate];
						} else {
							oResult.WEEKEND.push(oDayDate);
						}
					} else if (oDayStatus === "1") {
						if (!oResult.PHOLIDAY) {
							oResult.PHOLIDAY = [oDayDate];
						} else {
							oResult.PHOLIDAY.push(oDayDate);
						}
					} else if (oDayStatus === "0") {
						if (!oResult.WORKDAY) {
							oResult.WORKDAY = [oDayDate];
						} else {
							oResult.WORKDAY.push(oDayDate);
						}
					}
				}
			}
			return oResult;
		},

		_finish : function(oStartDate, oEndDate, oRequestedMonthStartDate, oPreviousMonthStartDate, oNextMonthStartDate,
				_aLeaveRequests, _aWorkSchedules, successCallback, errorCallback) {

			var oDayLabels;

			try {
				var iDayOffset = 0;
				if (oStartDate < oRequestedMonthStartDate) {
					hcm.myleaverequest.utils.CalendarTools.oCache[oPreviousMonthStartDate] = this._calcDayLabelsForMonth(_aLeaveRequests, _aWorkSchedules, oPreviousMonthStartDate, 0);
					iDayOffset += hcm.myleaverequest.utils.CalendarTools.calcMonthDayCount(oPreviousMonthStartDate);
				}
				oDayLabels = hcm.myleaverequest.utils.CalendarTools.oCache[oRequestedMonthStartDate] = this._calcDayLabelsForMonth(
				    _aLeaveRequests, _aWorkSchedules, oRequestedMonthStartDate, iDayOffset);
				iDayOffset += hcm.myleaverequest.utils.CalendarTools.calcMonthDayCount(oRequestedMonthStartDate);
				var oRequestedEndDate = hcm.myleaverequest.utils.CalendarTools.approximateMonthEndDate(oRequestedMonthStartDate);
				if (oEndDate > oRequestedEndDate) {
					hcm.myleaverequest.utils.CalendarTools.oCache[oNextMonthStartDate] = this._calcDayLabelsForMonth(
							_aLeaveRequests, _aWorkSchedules, oNextMonthStartDate, iDayOffset);
				}
				//include all three months
				var oDayLabelsPrev = hcm.myleaverequest.utils.CalendarTools.oCache[oPreviousMonthStartDate];
				var oDayLabelsNext = hcm.myleaverequest.utils.CalendarTools.oCache[oNextMonthStartDate];
				
				var statusList = ["SENT", "APPROVED", "POSTED", "REJECTED", "WEEKEND" , "PHOLIDAY", "WORKDAY" ];
				
				for( var i = 0; i < statusList.length; i++){		
					if(!oDayLabels[statusList[i]]){
						oDayLabels[statusList[i]] = [];
					}
					if(oDayLabelsPrev[statusList[i]]){
						for(var j = 0;j < oDayLabelsPrev[statusList[i]].length;j++){
							oDayLabels[statusList[i]].push(oDayLabelsPrev[statusList[i]][j]);
						}
					}
					if(oDayLabelsNext[statusList[i]]){
						if(oDayLabelsNext[statusList[i]]){
							for( var k = 0;k < oDayLabelsNext[statusList[i]].length;k++){
								oDayLabels[statusList[i]].push(oDayLabelsNext[statusList[i]][k]);
							}
						}
					}
				}
			} catch (e) {
				errorCallback([_resourceBundle.getText("LR_CT_PARSE_ERR") + " (CalendarTools.getDayLabelsForMonth)"]);
				return;
			}
			successCallback(oDayLabels);
		},

		calcMonthStartDate : function(oDate) {
			var oMonthStartDate = new Date(oDate.getFullYear(), oDate.getMonth(), 1, 0, 0, 0);
			oMonthStartDate.setMilliseconds(0);
			return oMonthStartDate;
		},

		approximateMonthEndDate : function(oDate) {
			var oEndDate = new Date(oDate.getFullYear(), oDate.getMonth(), 1, 0, 0, 0);
			oEndDate.setDate(oEndDate.getDate() + 31); // a little more does not affect calculations in this scenario
			return oEndDate;
		},

		calcNextMonthStartDate : function(oDate) {
			return new Date(oDate.getFullYear(), oDate.getMonth() + 1, 1);
		},

		calcPreviousMonthStartDate : function(oDate) {
			return new Date(oDate.getFullYear(), oDate.getMonth() - 1, 1);
		},

		calcMonthDayCount : function(oDate) {
			// calculates the number of days of the month containing oDate
			var days = 32 - new Date(oDate.getFullYear(), oDate.getMonth(), 32).getDate();
			if(days < 32 && days > 27){
			    return days;
			}else{
				jQuery.sap.log.warning("Failed to calculate number of days in utils.CalendarTools.calcMonthDayCount with input" + oDate.toString());
				throw "error in calculating number of days in a month.\nFunction:utils.CalendarTools.calcMonthDayCount\nInput: " + oDate.toString() + "\nOutput:"+days;
			}
		},

		dayRangeMatch : function(oDayDate, oStartDate, oEndDate) {
			// is the day described with oDayDate within the range?
			// we calculate with days, therefore we remove the time components, and rely on the fact, that oDayDate does not have one
			var oFixedStart = new Date(oStartDate.getFullYear(), oStartDate.getMonth(), oStartDate.getDate()); // remove time component
			var oFixedEnd = new Date(oEndDate.getFullYear(), oEndDate.getMonth(), oEndDate.getDate()); // remove time component
			if (oFixedStart <= oDayDate && oFixedEnd >= oDayDate){ 
			    return true;
			}
			return false;
		}
	};

}());