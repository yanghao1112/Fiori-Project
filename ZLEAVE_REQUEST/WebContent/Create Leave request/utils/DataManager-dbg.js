/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.require("hcm.myleaverequest.utils.Formatters");
jQuery.sap.declare("hcm.myleaverequest.utils.DataManager");
/*global hcm:true */
hcm.myleaverequest.utils.DataManager = (function() {
	var _modelBase = null;
	var _resourceBundle = null;
	var _cachedModelObj = {};
	_cachedModelObj.exist = true;

	return {
		init: function(oDataModel, oresourceBundle) {
			_modelBase = oDataModel;
			_modelBase.setCountSupported(false);
			_resourceBundle = oresourceBundle;
		},

		getBaseODataModel: function() {
			return _modelBase;
		},

		setCachedModelObjProp: function(propName, propObj) {
			_cachedModelObj[propName] = propObj;
		},

		getCachedModelObjProp: function(propName) {
			return _cachedModelObj[propName];
		},

		getApprover: function(successCallback, errorCallback) {
			var sPath = "ApproverCollection";
			var arrParams = ["$select=ApproverEmployeeName,ApproverEmployeeID,ApproverUserID"];
			this._getOData(sPath, null, arrParams, function(objResponse) {
				var sApproverName,approverEmployeeID;
				try {
					var oResult = objResponse.results;
					if (oResult instanceof Array) {
						for (var i = 0; i < oResult.length; i++) {
							sApproverName = oResult[i].ApproverEmployeeName;
							approverEmployeeID = oResult[i].ApproverEmployeeID;
						}
					}
					if (sApproverName === undefined) {
						errorCallback([_resourceBundle.getText("LR_DD_NO_APPROVER") + " (DataManager.getApprover)"]);
						return;
					}
				} catch (e) {
					errorCallback([_resourceBundle.getText("LR_DD_PARSE_ERR") + " (DataManager.getApprover)"]);
					return;
				}
				successCallback(sApproverName,approverEmployeeID);
			}, function(objResponse) {
				errorCallback(hcm.myleaverequest.utils.DataManager.parseErrorMessages(objResponse));
			});

		},

		getConfiguration: function() {
			var deferredDefaultType = $.Deferred();
			var sPath = "ConfigurationCollection";
			var arrParams = ['$select=DefaultApproverEmployeeID,DefaultApproverEmployeeName,RecordInClockHoursAllowedInd,RecordInClockTimesAllowedInd'];

			if (!_cachedModelObj.DefaultConfigurations) {
				this._getOData(sPath, null, arrParams, function(objResponse) {
					var oConfiguration;
					try {
						var oResult = objResponse.results;
						if (oResult instanceof Array) {
							oConfiguration = oResult[0];
						}
						if (oConfiguration === undefined) {
							deferredDefaultType.reject(hcm.myleaverequest.utils.DataManager.parseErrorMessages(objResponse));
							return;
						}
					} catch (e) {
						deferredDefaultType.reject(hcm.myleaverequest.utils.DataManager.parseErrorMessages(e));
						return;
					}
					_cachedModelObj.DefaultConfigurations = oConfiguration;
					//successCallback(oConfiguration);
					deferredDefaultType.resolve(oConfiguration);

				}, function(objResponse) {
					deferredDefaultType.reject(hcm.myleaverequest.utils.DataManager.parseErrorMessages(objResponse));
				});
			} else {
				deferredDefaultType.resolve(_cachedModelObj.DefaultConfigurations);
			}
			return deferredDefaultType.promise();
		},

		getAbsenceTypeCollection: function() {
			var deferredAbsTypeColl = $.Deferred();
			var sPath = "AbsenceTypeCollection";
			var oParams = ['$expand=AdditionalFields,MultipleApprovers'];
			if (!_cachedModelObj.AbsenceTypeCollection) {
				this._getOData(sPath, null, oParams, function(objResponse) {
					_cachedModelObj.AbsenceTypeCollection = objResponse.results;
					//successCallback(objResponse.results);
					deferredAbsTypeColl.resolve(objResponse.results);
				}, function(objResponse) {
					deferredAbsTypeColl.reject(hcm.myleaverequest.utils.DataManager.parseErrorMessages(objResponse));
				});
			} else {
				deferredAbsTypeColl.resolve(_cachedModelObj.AbsenceTypeCollection);
			}
			return deferredAbsTypeColl.promise();
		},

		getBalancesForAbsenceType: function(sAbsenceTypeCode, successCallback, errorCallback) {
            var oPernr = hcm.myleaverequest.utils.UIHelper.getPernr();
			var sPath = "AbsenceTypeCollection(EmployeeID='" + oPernr + "',AbsenceTypeCode='" + sAbsenceTypeCode +
				"')/absenceTypeTimeAccount";
			var arrParams = ["$select=BalancePlannedQuantity,BalanceAvailableQuantity,BalanceUsedQuantity,TimeUnitName,TimeAccountTypeName"];

			this._getOData(sPath, null, arrParams, function(objResponse) {
				var sBalancePlanned = null,
					sBalanceAvailable = null,
					sBalanceUsed = null,
					sBalanceTotalUsedQuantity = null;
				var sTimeUnitNamePlanned = null,
					sTimeUnitNameAvailable = null,
					sTimeAccountTypeName = null;
				var iBalancePlanned = null,
					iBalanceAvailable = null,
					iBalanceUsed = null;
				var doValuesExist = false; //used to hide balances in the view
				try {
					var oResult = objResponse.results;
					if (oResult instanceof Array && oResult.length > 0) {
						doValuesExist = true;
						sTimeUnitNamePlanned = oResult[0].TimeUnitName;
						sTimeUnitNameAvailable = oResult[0].TimeUnitName;
						sTimeAccountTypeName = oResult[0].TimeAccountTypeName;
						for (var i = 0; i < oResult.length; i++) {
							iBalancePlanned += parseFloat(oResult[i].BalancePlannedQuantity);
							iBalanceAvailable += parseFloat(oResult[i].BalanceAvailableQuantity);
							iBalanceUsed += parseFloat(oResult[i].BalanceUsedQuantity);
						}
						sBalancePlanned = hcm.myleaverequest.utils.Formatters.BALANCE(iBalancePlanned.toString());
						sBalanceAvailable = hcm.myleaverequest.utils.Formatters.BALANCE(iBalanceAvailable.toString());
						sBalanceUsed = hcm.myleaverequest.utils.Formatters.BALANCE(iBalanceUsed.toString());
						sBalanceTotalUsedQuantity = hcm.myleaverequest.utils.Formatters.BALANCE((iBalanceUsed + iBalancePlanned).toString());
					}
				} catch (e) {
					errorCallback([_resourceBundle.getText("LR_DD_PARSE_ERR") + " (DataManager.getBalancesForAbsenceType)"]);
					return;
				}
				successCallback(sBalancePlanned, sTimeUnitNamePlanned, sBalanceAvailable, sTimeUnitNameAvailable,
					sTimeAccountTypeName, sBalanceUsed, sBalanceTotalUsedQuantity, doValuesExist);
			}, function(objResponse) {
				errorCallback(hcm.myleaverequest.utils.DataManager.parseErrorMessages(objResponse));
			});
		},

		getPendingLeaves: function(successCallback, errorCallback) {

			this.getConsolidatedLeaveRequests(function(sPendingLeaves) {
				var aLeaveRequests = sPendingLeaves.LeaveRequestCollection;
				var iPendingLeaves = 0;
				for (var i = 0; i < aLeaveRequests.length; i++) {
					if (aLeaveRequests[i].StatusCode === "SENT") {
						iPendingLeaves++;
					} else if (aLeaveRequests[i].aRelatedRequests !== undefined && aLeaveRequests[i].aRelatedRequests.length > 0) {
						if (aLeaveRequests[i].aRelatedRequests[0].StatusCode === "SENT") {
							iPendingLeaves++;
						}
					}
				}
				successCallback(iPendingLeaves + "");
			}, errorCallback);
		},

		getConsolidatedLeaveRequests: function(successCallback, errorCallback) {
			var sPath = "LeaveRequestCollection";
			var oParams = [
				'$select=ApproverEmployeeID,ApproverEmployeeName,EmployeeID,RequestID,ChangeStateID,LeaveKey,ActionCode,StatusCode,StatusName,AbsenceTypeCode,AbsenceTypeName,InfoType,StartDate,StartTime,EndDate,EndTime,WorkingHoursDuration,WorkingDaysDuration,Notes,ActionDeleteInd,ActionModifyInd,DeductionInfo,TotalDeduction,TimeUnitDeduction,TimeUnitTextDeduction,LeaveRequestType,AttachmentDetails,AdditionalFields,MultipleApprovers'
				];
            var oPernr = hcm.myleaverequest.utils.UIHelper.getPernr();
            oParams.push("$expand=MultipleApprovers");
            oParams.push("$filter=EmployeeID eq '" + oPernr + "'");
			this._getOData(sPath, null, oParams, function(objResponse) {
				var aLeaveRequests = [];
				try {
					var oResult = objResponse.results;
					if (!oResult instanceof Array) {
						errorCallback([_resourceBundle.getText("LR_DD_NO_CFG") + " (DataManager.getConsolidatedLeaveRequests)"]);
						return;
					}
					var oRelatedRequestsByLeaveKey = {}; // object of arrays
					for (var i = 0; i < oResult.length; i++) {
						if ((oResult[i].LeaveRequestType === "2" || oResult[i].LeaveRequestType === "3") && oResult[i].LeaveKey) {
							if (!oRelatedRequestsByLeaveKey[oResult[i].LeaveKey]) {
								oRelatedRequestsByLeaveKey[oResult[i].LeaveKey] = [];
							}
							oRelatedRequestsByLeaveKey[oResult[i].LeaveKey].push(oResult[i]);
						}
					}
					for (var i = 0; i < oResult.length; i++) {
						if (oResult[i].LeaveRequestType !== "2" && oResult[i].LeaveRequestType !== "3") {
							if (oResult[i].LeaveKey && oRelatedRequestsByLeaveKey[oResult[i].LeaveKey]) {
								oResult[i].aRelatedRequests = oRelatedRequestsByLeaveKey[oResult[i].LeaveKey];
								for (var j = 0; j < oResult[i].aRelatedRequests.length; j++) {
									oResult[i].Notes = oResult[i].aRelatedRequests[j].Notes + oResult[i].Notes;
								}
							}
							aLeaveRequests.push(oResult[i]);
						}
					}
				} catch (e) {
					errorCallback([_resourceBundle.getText("LR_DD_PARSE_ERR") + " (DataManager.getConsolidatedLeaveRequests)"]);
					return;
				}
				successCallback({
					LeaveRequestCollection: aLeaveRequests
				});
			}, function(objResponse) {
				errorCallback(hcm.myleaverequest.utils.DataManager.parseErrorMessages(objResponse));
			});
		},

		getTimeAccountCollection: function(successCallback, errorCallback) {

			var sPath = "TimeAccountCollection";
			this._getOData(sPath, null, null, function(objResponse) {
				var aTimeAccounts = [];
				try {
					// var oResult = this.getTimeAccountCollectionDataFromXml(this.parseXml(sResponse));
					var oResult = objResponse.results;
					if (!oResult instanceof Array) {
						errorCallback([_resourceBundle.getText("LR_DD_NO_CFG") + " (DataManager.getTimeAccountCollection)"]);
						return;
					}
					for (var i = 0; i < oResult.length; i++) {
						delete oResult[i]['__metadata'];
						aTimeAccounts.push(oResult[i]);
					}
				} catch (e) {
					errorCallback([_resourceBundle.getText("LR_DD_PARSE_ERR") + " (DataManager.getTimeAccountCollection)"]);
					return;
				}
				successCallback({
					TimeAccountCollection: aTimeAccounts
				});
			}, function(objResponse) {
				errorCallback(hcm.myleaverequest.utils.DataManager.parseErrorMessages(objResponse));
			});
		},

		submitLeaveRequest: function(oNewEntry, bProcessCheckOnlyInd, successCallback, errorCallback, uploadFileAttachments) {
			oNewEntry.ProcessCheckOnlyInd = (bProcessCheckOnlyInd ? true : false);
			this._postOData("LeaveRequestCollection", oNewEntry, function(objResponseData, objResponse) {
				var objMsg = "";
				if (objResponse.headers["sap-message"]) {
					objMsg = JSON.parse(objResponse.headers["sap-message"]);
				}
				if(!objResponseData.RequestID){
				    var msg = objMsg || _resourceBundle.getText("LR_DD_GENERIC_ERR");
				    hcm.myleaverequest.utils.UIHelper.errorDialog(msg);
				}else{
				hcm.myleaverequest.utils.UIHelper.setIsChangeAction(true);
				if(uploadFileAttachments){
				uploadFileAttachments(successCallback,objResponseData, objMsg);
				}}
				
			}, function(objResponseData) {
				errorCallback(hcm.myleaverequest.utils.DataManager.parseErrorMessages(objResponseData));
			});
		},

		changeLeaveRequest: function(oModifiedEntry, bProcessCheckOnlyInd, successCallback, errorCallback, uploadFileAttachments) {
			oModifiedEntry.ProcessCheckOnlyInd = (bProcessCheckOnlyInd ? true : false);
			var _this = this;
			this._postOData("LeaveRequestCollection", oModifiedEntry, function(objResponseData, objResponse) {
				var objMsg = "";
				if (objResponse.headers["sap-message"]) {
					objMsg = JSON.parse(objResponse.headers["sap-message"]);
				}
				if(!objResponseData.RequestID){
				    var msg = objMsg || _resourceBundle.getText("LR_DD_GENERIC_ERR");
				    hcm.myleaverequest.utils.UIHelper.errorDialog(msg);
				}else{
				hcm.myleaverequest.utils.UIHelper.setIsChangeAction(true);
				if(uploadFileAttachments){
				uploadFileAttachments(successCallback,objResponseData, objMsg);
				}}
			}, function(objResponseData) {
				errorCallback(hcm.myleaverequest.utils.DataManager.parseErrorMessages(objResponseData));
			});
		},

		withdrawLeaveRequest: function(sStatusCode, sEmployeeId, sRequestId, sChangeStateId, sLeaveKey, successCallback,
			errorCallback) {
            this.recallLeaveRequest(sEmployeeId, sRequestId, sChangeStateId, sLeaveKey, successCallback, errorCallback);
			/*if (this.isRecallableLeaveRequest(sStatusCode, sLeaveKey)) {
				this.recallLeaveRequest(sEmployeeId, sRequestId, sChangeStateId, sLeaveKey, successCallback, errorCallback);
			} else {
				this.createDeleteLeaveRequest(sEmployeeId, sRequestId, sChangeStateId, sLeaveKey, successCallback,
					errorCallback);
			}*/
		},

		getLeaveRequestsForTimePeriod: function(oStartDate, oEndDate, successCallback, errorCallback) {

			// aLeaveRequests example:
			// [{
			// "StatusCode": "REJECTED",
			// "StatusName": "Abgelehnt",
			// "AbsenceTypeCode": "0148",
			// "AbsenceTypeName": "Krankheit",
			// "StartDate": Date,
			// "StartTime": "PT00H00M00S",
			// "EndDate": Date,
			// "EndTime": "PT00H00M00S",
			// },
			// {
			// "StatusCode": "REJECTED",
			// "StatusName": "Abgelehnt",
			// "AbsenceTypeCode": "0148",
			// "AbsenceTypeName": "Krankheit",
			// "StartDate": Date,
			// "StartTime": "PT00H00M00S",
			// "EndDate": Date,
			// "EndTime": "PT00H00M00S",
			// }]

			// GET
			// /sap/opu/odata/GBHCM/LEAVEREQUEST;v=2/LeaveRequestCollection?$format=json&$filter=StartDate%20eq%20datetime'2013-01-01T00%3A00%3A00'
			// HTTP/1.1

			var sStartDate = hcm.myleaverequest.utils.Formatters.DATE_YYYYMMdd(oStartDate) + 'T00:00:00';
			var sEndDate = hcm.myleaverequest.utils.Formatters.DATE_YYYYMMdd(oEndDate) + 'T00:00:00';
			var sPath = "LeaveRequestCollection";
            var oPernr = hcm.myleaverequest.utils.UIHelper.getPernr();
			var arrParams = ["$filter=StartDate eq datetime'" + sStartDate + "' and EndDate eq datetime'" + sEndDate + "' and EmployeeID eq '" + oPernr + "'",
					"$select=StatusCode,StatusName,AbsenceTypeCode,AbsenceTypeName,StartDate,StartTime,EndDate,EndTime"];
            
			this._getOData(sPath, null, arrParams, function(objResponse) {
				var aLeaveRequests = [];
				try {
					var oResult = objResponse.results;

					if (oResult instanceof Array) {
						for (var i = 0; i < oResult.length; i++) {
							var oRequest = new Object();
							oRequest.StatusCode = oResult[i].StatusCode;
							oRequest.StatusName = oResult[i].StatusName;
							oRequest.AbsenceTypeCode = oResult[i].AbsenceTypeCode;
							oRequest.AbsenceTypeName = oResult[i].AbsenceTypeName;
							oRequest.StartDate = oResult[i].StartDate;
							oRequest.StartTime = oResult[i].StartTime;
							oRequest.EndDate = oResult[i].EndDate;
							oRequest.EndTime = oResult[i].EndTime;
							aLeaveRequests.push(oRequest);
						}
					}
				} catch (e) {
					errorCallback([_resourceBundle.getText("LR_DD_PARSE_ERR") + " (DataManager.getLeaveRequestsForTimePeriod)"]);
					return;
				}
				successCallback(aLeaveRequests);
			}, function(objResponse) {
				errorCallback(hcm.myleaverequest.utils.DataManager.parseErrorMessages(objResponse));
			});
		},

		getWorkSchedulesForTimePeriod: function(oStartDate, oEndDate, successCallback, errorCallback) {

			// aWorkSchedules example:
			// [{
			// "StartDate": Date,
			// "EndDate": Date,
			// "StatusValues": "222000000220200222200000",
			// },
			// {
			// "StartDate": Date,
			// "EndDate": Date,
			// "StatusValues": "222000000220200222200000",
			// }]

			// GET
			// /sap/opu/odata/GBHCM/LEAVEREQUEST;v=2/WorkScheduleCollection?$format=json&$filter=StartDate%20eq%20datetime'2013-3-1T00%3A00'and%20EndDate%20eq%20datetime'2013-5-31T00%3A00'
			// HTTP/1.1

			var sStartDate = hcm.myleaverequest.utils.Formatters.DATE_YYYYMMdd(oStartDate) + 'T00:00:00';
			var sEndDate = hcm.myleaverequest.utils.Formatters.DATE_YYYYMMdd(oEndDate) + 'T00:00:00';
			var sPath = "WorkScheduleCollection";
            var oPernr = hcm.myleaverequest.utils.UIHelper.getPernr();
			var arrParams = ["$filter=StartDate eq datetime'" + sStartDate + "' and EndDate eq datetime'" + sEndDate + "' and EmployeeID eq '" + oPernr + "'",
				"$select=EmployeeID,StartDate,EndDate,StatusValues"];

			this._getOData(sPath, null, arrParams, function(objResponse) {
				var aWorkSchedules = [];
				try {
					// var oResult = this.getWorkScheduleCollectionDataFromXml(this.parseXml(sResponse));
					var oResult = objResponse.results;
					if (oResult instanceof Array) {
						for (var i = 0; i < oResult.length; i++) {
							var oSchedule = new Object();
							oSchedule.StartDate = oResult[i].StartDate;
							oSchedule.EndDate = oResult[i].EndDate;
							oSchedule.StatusValues = oResult[i].StatusValues;
							aWorkSchedules.push(oSchedule);
						}
					}
				} catch (e) {
					errorCallback([_resourceBundle.getText("LR_DD_PARSE_ERR") + " (DataManager.getWorkSchedulesForTimePeriod)"]);
					return;
				}
				successCallback(aWorkSchedules);
			}, function(objResponse) {
				errorCallback(hcm.myleaverequest.utils.DataManager.parseErrorMessages(objResponse));
			});
		},

		// =======
		// private
		// =======

		isRecallableLeaveRequest: function(sStatusCode, sLeaveKey) {
			if (sStatusCode === "CREATED"){
				return true;
			}
			if (!sLeaveKey){
				return true;
			}
			for (var i = 0; i < sLeaveKey.length; i++) {
				var c = sLeaveKey.charAt(i);
				if (c !== " " && c !== "\t" && c !== "\v" && c !== "\r" && c !== "\n" && c !== "0")
				{
				    	return false;
				}
			}
			return true;
		},

		createDeleteLeaveRequest: function(sEmployeeId, sRequestId, sChangeStateId, sLeaveKey, successCallback,
			errorCallback) {

			var sBody = {};
			sBody.ActionCode = 03;
			sBody.EmployeeID = sEmployeeId;
			sBody.RequestID = sRequestId;
			sBody.ChangeStateID = sChangeStateId;
			sBody.LeaveKey = sLeaveKey;
			sBody.ProcessCheckOnlyInd = false;

			this._postOData("LeaveRequestCollection", sBody, function(objResponseData, objResponse) {
				var objMsg = "";
				if (objResponse.headers["sap-message"]) {
					objMsg = JSON.parse(objResponse.headers["sap-message"]);
				}
				successCallback(objResponseData, objMsg);
			}, function(objResponseData) {
				errorCallback(hcm.myleaverequest.utils.DataManager.parseErrorMessages(objResponseData));
			});
		},

		recallLeaveRequest: function(sEmployeeId, sRequestId, sChangeStateId, sLeaveKey, successCallback, errorCallback) {
			this._deleteOData("LeaveRequestCollection(EmployeeID='" + sEmployeeId + "',RequestID='" + sRequestId + "',ChangeStateID=" +
				sChangeStateId + ",LeaveKey='" + sLeaveKey + "')", function(objResponse) {
					successCallback(objResponse);
				}, function(objResponse) {
					errorCallback(hcm.myleaverequest.utils.DataManager.parseErrorMessages(objResponse));
				});
		},

		parseErrorMessages: function(objResponse) {
			if (objResponse.response && objResponse.response.body) {
				var dynamicSort = function(property) {
					var sortOrder = 1;
					if (property[0] === "-") {
						sortOrder = -1;
						property = property.substr(1);
					}
					return function(a, b) {
						var result;
						if (a[property] < b[property]) {
							result = -1;
						} else if (a[property] > b[property]) {
							result = 1;
						} else {
							result = 0;
						}
						return result * sortOrder;
					};
				};
				try {
					var oResponse = JSON.parse(objResponse.response.body);
					if (oResponse.error && oResponse.error.message && oResponse.error.message.value) {
						var result = [];
						result.push(oResponse.error.message.value);
						if (oResponse.error.innererror && oResponse.error.innererror.errordetails && oResponse.error.innererror.errordetails instanceof Array) {
							oResponse.error.innererror.errordetails.sort(dynamicSort("severity"));
							for (var i = 0; i < oResponse.error.innererror.errordetails.length; i++) {
								if (oResponse.error.innererror.errordetails[i].message) {
									var message = oResponse.error.innererror.errordetails[i].message;
//BEGIN OF NOTE 2306536
									if (oResponse.error.innererror.errordetails[i].code) {           
										message += " [" + oResponse.error.innererror.errordetails[i].code + "]";
									} 
									// if (oResponse.error.innererror.errordetails[i].severity) {          
									// 	message += " (" + oResponse.error.innererror.errordetails[i].severity + ")";
									// }
//END OF NOTE 2306536									
									result.push(message);
								}
							}
						}
						return result;
					}
				} catch (e) {
					jQuery.sap.log.warning("couldn't parse error message", ["parseErrorMessages"], ["DataManger"]);
				}
			} else {
				return [_resourceBundle.getText("LR_DD_GENERIC_ERR") + objResponse.message];
			}
		},

		getXmlNodeValue: function(oNode) {

			try {
				if (oNode.childNodes.length !== 1)
					return null;
				switch (oNode.childNodes[0].nodeType) {
					case 3:
						return oNode.childNodes[0].data;
				}
			} catch (e) {
				return null;
			}
		},

		getDateFromString: function(sValue) {

			// creates a date from yyyy-mm-ddTHH:MM:SS without timezone shift
			if (sValue.length !== 19){
				return null;
			}
			if (sValue.charAt(4) !== '-' || sValue.charAt(7) !== '-' || sValue.charAt(10) !== 'T' || sValue.charAt(13) !== ':' || sValue.charAt(16) !==	':'){
				return null;
				}
			var year = sValue.substring(0, 4) * 1;
			var month = sValue.substring(5, 7) * 1;
			var day = sValue.substring(8, 10) * 1;
			var hour = sValue.substring(11, 13) * 1;
			var minute = sValue.substring(14, 16) * 1;
			var second = sValue.substring(17, 19) * 1;
			return new Date(year, month - 1, day, hour, minute, second);
		},

        searchApprover: function(searchString, successCallback){
            var sPath = "ApproverCollection";
            var searchPernr ='';
            if(!isNaN(searchString)){
                searchPernr = searchString;
            }
            searchString = encodeURIComponent(searchString);
			var arrParams = ["$filter=ApproverEmployeeName eq '" + searchString + "' and ApproverEmployeeID eq '" + searchPernr + "'"];
			this._getOData(sPath, null, arrParams, function(objResponse) {
				try {
					var oResult = objResponse.results;
					if (oResult instanceof Array) {
							successCallback(objResponse);
					}
				} catch (e) {
					hcm.myleaverequest.utils.DataManager.parseErrorMessages([_resourceBundle.getText("LR_DD_PARSE_ERR") + " (DataManager.getApprover)"]);
					 sap.ca.ui.utils.busydialog.releaseBusyDialog();
					return;
				}
			}, function(objResponse) {
			    sap.ca.ui.utils.busydialog.releaseBusyDialog();
			    hcm.myleaverequest.utils.DataManager.parseErrorMessages(objResponse);
			});
        },
        getPersonellAssignments : function(appController, fSuccess) {
                        this._getOData("/ConcurrentEmploymentSet", null, [], function(oData) {
									fSuccess(oData.results);
								},
								function(oError) {
									hcm.myleaverequest.utils.DataManager.parseErrorMessages(oError);
								});
		},
		_getOData: function(sPath, oContext, oUrlParams, successCallback, errorCallback) {
            if(sPath === "AbsenceTypeCollection" || sPath === "ConfigurationCollection" || sPath === "TimeAccountCollection"){
                var oPernr = hcm.myleaverequest.utils.UIHelper.getPernr();
                oUrlParams = oUrlParams ? oUrlParams : [];
                oUrlParams.push("$filter=EmployeeID eq '" + oPernr + "'");
            }
			_modelBase.read(sPath, oContext, oUrlParams, true, function(response) {
				successCallback(response);
			}, function(response) {
				errorCallback(response);
			});

		},

		_postOData: function(sPath, sBody, successCallback, errorCallback) {
			_modelBase.create(sPath, sBody, null, successCallback, errorCallback);
		},

		_deleteOData: function(sPath, successCallback, errorCallback) {

			var oParameters = {};
			oParameters.fnSuccess = successCallback;
			oParameters.fnError = errorCallback;
			_modelBase.remove(sPath, oParameters);
		},
		Xml2Json: function (node) {
            var data = {}, that = this;
            // append a value
            var Add = function (name, value) {
                if (data[name]) {
                    if (data[name].constructor !== Array) {
                        data[name] = [data[name]];
                    }
                    data[name][data[name].length] = value;
                } else {
                    data[name] = value;
                }
            };
            // element attributes
            var c, cn;
            for (c = 0;c < node.attributes.length ; c++) {
                cn = node.attributes[c];
                Add(cn.name, cn.value);
            }
            // child elements
            for (c = 0; c < node.childNodes.length; c++) {
                cn = node.childNodes[c];
                if (cn.nodeType === 1) {
                    if (cn.childNodes.length === 1 && cn.firstChild.nodeType === 3) {
                        // text value
                        Add(cn.nodeName, cn.firstChild.nodeValue);
                    } else {
                        // sub-object
                        Add(cn.nodeName, that.Xml2Json(cn));
                    }
                }
            }
            return data;
    }

	};

}());