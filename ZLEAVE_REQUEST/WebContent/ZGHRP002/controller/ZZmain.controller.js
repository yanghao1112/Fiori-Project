jQuery.sap.require("sap.ui.core.mvc.Controller");
jQuery.sap.require("sap.m.MessageToast");
jQuery.sap.require("sap.m.MessageBox");
jQuery.sap.require("sap.ZG001.timesheet.input.weekly.util.Formatter");
jQuery.sap.require("sap.ZG001.timesheet.input.weekly.util.DataManager");
sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ZG001/timesheet/valuehelp/util/ZHE_APPROVER",
	"sap/ZG001/timesheet/valuehelp/util/ZHE_CLIENTCD",
	"sap/ZG001/timesheet/valuehelp/util/ZHE_TSCD",
	"sap/ZG001/timesheet/valuehelp/util/ZHE_EMPLOYEE",
	"sap/ui/model/ValidateException"
], function(Controller, ApproverHelp, ClientHelp, TSHelp, EmployeeHelp, ValidateException) {
	"use strict";
	return Controller.extend("sap.ZG001.timesheet.input.weekly.controller.ZZmain", {
		onInit : function() {
			"use strict";
			this.oDataModel = this.getOwnerComponent().getModel();
			this.oBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();
			this.oDataManager = new sap.ZG001.timesheet.input.weekly.DataManager(this.oDataModel, this.oBundle);
			
			/* Get Data From Application Navigation */
			var oScreenModel = new sap.ui.model.json.JSONModel();
			this.getView().setModel(oScreenModel,"ScreenModel");

			var dSystemDate = new Date();
			/* Current Date (Date Type) */
			this.dCurrentDate = dSystemDate;
			/* Calendar Begin Day */
			this.dBegda = this._getDay(this.dCurrentDate,1);
			/* Calendar End Day */
			this.dEndda = this._getDay(this.dBegda,7);	
			/* Display Mode or not */
			this.bMode = false;
			/* normal or proxy or manager proxy */
			this.sSourceScreen = "0";
			this.oInitWorkingHours = {};
			this.oInitTimesheetData = {};
			this.oRetrievePernrDeferred = new jQuery.Deferred();

			this.sYear = "0000";
			this.sMonth = "00";
			this.bFirst = true;
			
			/* Initialize class variables */
			oScreenModel.setData({
				"Settinginfo": {
					"minutesStep": 15,
					"RestTime2Visible": false,
					"RestTime2Icon": "sap-icon://add",
					"TimeHoliday2Visible": false,
					"TimeHoliday2Icon": "sap-icon://add",
					"LateLeaveEarly2Visible": false,
					"LateLeaveEarly2Icon": "sap-icon://add",
					"ChildRearing2Visible": false,
					"ChildRearing2Icon": "sap-icon://add",
					"ChildNursing2Visible": false,
					"ChildNursing2Icon": "sap-icon://add",
					"NursingTime2Visible": false,
					"NursingTime2Icon": "sap-icon://add",
					"Subtotal": ["0.00","0.00","0.00","0.00","0.00","0.00","0.00"],
					"DeductionTSHour": [0,0,0,0,0,0,0],
					"Total": "0.00",
					"BeginDate": this.dBegda,
					"EndDate": this.dEndda,
					"SaveOpreationType": "0",
					"SendOpreationType": "1",
					"ResendOpreationType": "2",
					"DeleteOpreationType": "3",
					"ProxyVisible": true,
					"ProxyPernr": "",
					"ProxyPernrName": "",
					"ProxyType": "0",
					"EditMode": true,
					"ModifiedMode": false,
					"SendVisible"	: false,
					"ResendVisible"	: false,
					"UploadVisible"	: false,
					"SaveVisible"	: false,
					"CancelVisible"	: false,
					"DeleteVisible"	: false,
					"SendClickable"	: false,
					"ResendClickable" : false,
					"UploadClickable" : false,
					"SaveClickable"	: false,
					"CancelClickable" : false,
					"DeleteClickable" : false,
					"WorkingHoursVisible" : false,
					"PersonalPortalVisible" : false,
                    "TargetEditable":[true,true,true,true,true,true,true]
				}
			},false);

			this.oSpecialDates = {};

			/* Get Working Hours */
			var oWorkingHours  = new sap.ui.model.json.JSONModel();
			this.getView().setModel(oWorkingHours, "WorkingHours");

			/* Display Working Hours Model */
			var oDisplayWorkingHours  = new sap.ui.model.json.JSONModel();
			this.getView().setModel(oDisplayWorkingHours, "DisplayWorkingHours");
			
			/* Get Timesheet Data */
			var oTimesheetData = new sap.ui.model.json.JSONModel();
			this.getView().setModel(oTimesheetData, "TimesheetData");

			/* Get WorkCalendar Data */
			var oWorkCalendar  = new sap.ui.model.json.JSONModel();
			this.getView().setModel(oWorkCalendar, "WorkCalendar");

			/* Month Detail Info */
			var oMonthDetailInfo = new sap.ui.model.json.JSONModel();
			this.getView().setModel(oMonthDetailInfo, "MonthDetailInfo");

			/* Month Working Time */
			var oMonthlyWorkingTime  = new sap.ui.model.json.JSONModel();
			this.getView().setModel(oMonthlyWorkingTime, "MonthlyWorkingTime");

			/* Setting Info */
			var oSettingInfo  = new sap.ui.model.json.JSONModel();
			this.getView().setModel(oSettingInfo, "SettingInfo");
			
			/* SubEntry Data*/
			var oSubEntry = new sap.ui.model.json.JSONModel();
			this.getView().setModel(oSubEntry,"SubEntry");

			this.getView().byId("timesheetData").addEventDelegate({
				onAfterRendering: function() {
					$(".ZZNumberOnly").keypress(function(aEvent) {
						var keyCode = aEvent.which;
						if (keyCode === 46 || (keyCode >= 48 && keyCode <=57)) 
							return true;
						else
							return false;
					}).bind("paste",function(aEvent) {
						var sValue = "";
						if (window.clipboardData && window.clipboardData.getData) { // IE
							sValue = window.clipboardData.getData("Text");
							window.clipboardData.setData("Text",sValue.replace(/[^\.\d]/g,''));
						} else {
							sValue = aEvent.originalEvent.clipboardData.getData("text/plain");
							aEvent.originalEvent.clipboardData.setData("text/plain",sValue.replace(/[^\.\d]/g,''));
						}
					});
					
					$(".ZZNumberOnlyN").keypress(function(event) {
						var keyCode = event.which;
						if (keyCode >= 48 && keyCode <=57)
							return true;
						else
							return false;
					}).bind("paste",function(aEvent) {
						var sValue = "";
						if (window.clipboardData && window.clipboardData.getData) { // IE
							sValue = window.clipboardData.getData("Text");
							window.clipboardData.setData("Text",sValue.replace(/[^\d]/g,''));
						} else {
							sValue = aEvent.originalEvent.clipboardData.getData("text/plain");
							aEvent.originalEvent.clipboardData.setData("text/plain",sValue.replace(/[^\d]/g,''));
						}
					});
				}
			});
			
			/* attach handlers for validation errors */
			sap.ui.getCore().attachValidationError(function (aEvent) {
				var oControl = aEvent.getParameter("element");
				var oI18n = oControl.getModel("i18n").getResourceBundle();
				var sMsg = aEvent.getParameter("message");
				if (oControl && oControl.setValueState) {
					oControl.setValueState("Error");
					if (sMsg.substr(0,6) === "ZF_MSG") {
						oControl.setValueStateText(oI18n.getText(sMsg));
					} else {
						oControl.setValueStateText(sMsg);
					}
					oControl.focus();
				}
			});

			/* attach handlers for validation success */
			sap.ui.getCore().attachValidationSuccess(function (aEvent) {
				var oControl = aEvent.getParameter("element");
				if (oControl && oControl.setValueState) {
					oControl.setValueState("None");
				}
			});
            
            /* attach handlers for parse errors */
			sap.ui.getCore().attachParseError(function (aEvent) {
				var oControl = aEvent.getSource();
				var sMsg = aEvent.getParameter("message");
				if (oControl && oControl.setValueState) {
					oControl.setValueState("Error");
					oControl.setValueStateText(sMsg);
				}
			});
			
			/* Set selected Day Text */
			this.getView().byId("LEGEND").getAggregation("standardItems")[1].setText(this.oBundle.getText("ZF_CALDSELECTED"));
			
			/* Delete Standard Legend Working Day and Non-working Day */
			this.getView().byId("LEGEND").removeAggregation("standardItems",0);
			this.getView().byId("LEGEND").removeAggregation("standardItems",0);
			this.getView().byId("LEGEND").removeAggregation("standardItems",0);
			this.getView().byId("LEGEND").removeAggregation("standardItems",0);		
			
		},
		onAfterRendering: function() {
			"use strict";
			var oSelf = this;
			/* Retrieve Settings Information */
			if (!this.sPernr) {
				try {
					/* Get pernr from the startup parameters */
					var oStartUpParameters = oSelf.getOwnerComponent().getComponentData().startupParameters;
					this.sSourceScreen = oStartUpParameters.ProxyType[0];
					if (this.sSourceScreen === "1" || this.sSourceScreen === "2") {
						/* When Proxy Type is 1 or 2. Open up proxy dialog for pernr input */
						this.onProxyPress();
						this.getView().getModel("ScreenModel").setProperty("/Settinginfo/ProxyVisible",true);
						this.getView().getModel("ScreenModel").setProperty("/Settinginfo/ProxyType",this.sSourceScreen);
						jQuery.when(this.oRetrievePernrDeferred).then(function(){

							try {
								/* Get date from the startup parameters */
								var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "YYYYMMdd"});
								var sDate = oStartUpParameters.date[0];
								var dDate = oDateFormat.parse(sDate);
								this.dCurrentDate = dDate;
								this.dBegda = this._getDay(this.dCurrentDate,1);
								this.dEndda = this._getDay(this.dBegda,7);
								if (oStartUpParameters.mode[0] === "D") {
									oSelf.mode = true;
									oSelf.getView().getModel("ScreenModel").setProperty("/Settinginfo/EditMode",false);
								} else if (oStartUpParameters.mode[0] === "E") {
									oSelf.mode = false;
									oSelf.getView().getModel("ScreenModel").setProperty("/Settinginfo/EditMode",true);
								}

								oSelf._checkDateValidation(oSelf.dBegda, oSelf.dEndda).then(function() {
									oSelf._updateModel();
								});
							} catch (o) {

								oSelf._checkDateValidation(oSelf.dBegda, oSelf.dEndda).then(function() {
									oSelf._updateModel();
								});
							}
						});
					} else {
						this.getView().getModel("ScreenModel").setProperty("/Settinginfo/ProxyVisible",false);
						this.getView().getModel("ScreenModel").setProperty("/Settinginfo/ProxyType",this.sSourceScreen);
						/* Get pernr from the startup parameters */
						this.sPernr = oStartUpParameters.pernr[0];
						/* Get date from the startup parameters */
						var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "YYYYMMdd"});
						var sDate = oStartUpParameters.date[0];
			            var dDate = oDateFormat.parse(sDate);
			            this.dCurrentDate = dDate;
			            this.dBegda = this._getDay(this.dCurrentDate,1);
			            this.dEndda = this._getDay(this.dBegda,7);
						/* Get ProxyType from the startup parameters */
						this.sSourceScreen = oStartUpParameters.ProxyType[0];
						if (oStartUpParameters.mode[0] === "D") {
							this.bMode = true;
							this.getView().getModel("ScreenModel").setProperty("/Settinginfo/EditMode",false);
						} else {
							this._initialValue();
							return;
						}
						oSelf._checkDateValidation(oSelf.dBegda, oSelf.dEndda).then(function() {
							oSelf._updateModel();
						});
					}
				} catch (o) {
					this._initialValue();
				}
			}
		},
		_initialValue: function() {
			var oSelf = this;
			var dSystemDate = new Date();
			/* Current Date (Date Type) */
			this.dCurrentDate = dSystemDate;
			/* Calendar Begin Day */
			this.dBegda = this._getDay(this.dCurrentDate,1);
			/* Calendar End Day */
			this.dEndda = this._getDay(this.dBegda,7);
			/* Display Mode or not */
			this.bMode = false;
			/* normal or proxy or manager proxy */
			this.sSourceScreen = "0";

			this.oDataManager.getRootPernr(function(results){
				oSelf.sPernr = results[0]["Pernr"];
				oSelf._checkDateValidation(oSelf.dBegda, oSelf.dEndda).then(function() {
					oSelf._updateModel();
				});
			});
		},
		
		_checkDateValidation: function(aBegdaCheck, aEnddaCheck) {
			var oCheckDateDeferred = new jQuery.Deferred();
			/* Date Check */
			var oSelf = this;
			this.oDataManager.getDateValidation(this.sPernr, aBegdaCheck, aEnddaCheck, function(aResult) {
				var oErrorMessage = [];
				$.each(aResult, function(aIdx, aItem){						
					if (aItem["CheckFlag"] === true) {
						oErrorMessage.push({
							code:		aItem["MsgID"],
							num:		aItem["MsgNumber"],
							message:	aItem["MsgText"],
						});
					}	
				});
				if (oErrorMessage.length > 0) {
					oSelf._processMessage(oErrorMessage,sap.m.MessageBox.Icon.ERROR,oSelf.oBundle.getText("ERROR"));
					oCheckDateDeferred.reject();
				} else {
					oCheckDateDeferred.resolve();
				}
			});
			return oCheckDateDeferred;
		},
		
		/* Update Model which bind on the view */
		_updateModel: function(aOpreationType) {
			"use strict";
			var oSelf = this;
			var oScreenModel = this.getView().getModel("ScreenModel");
			var sResendOpreationType = oScreenModel.getProperty("/Settinginfo/ResendOpreationType");
			var sDeleteOpreationType = oScreenModel.getProperty("/Settinginfo/DeleteOpreationType");
			
			/* set input field to initial status */
			this._initView();
			
			/* Get Working Hours */
			this.oDataManager.getWorkingHours(this.sPernr, this.dBegda, this.dEndda, function(aResults){
				/* When resend, retain the flag of target date */
				if (aOpreationType === sResendOpreationType){
					var aResultsCopy = oSelf._deepCopy(aResults);
					var oWorkinghoursData = oSelf.getView().getModel("WorkingHours").getData();
					for (var i=0; i<aResultsCopy.length; i++){
						aResultsCopy[i].FlgTarget = oWorkinghoursData[i].FlgTarget;
					}
					oSelf.getView().getModel("WorkingHours").setData(aResultsCopy,false);
				}else {
					oSelf.getView().getModel("WorkingHours").setData(aResults,false);
				}
				
				oSelf.oInitWorkingHours = oSelf._deepCopy(aResults);
				oSelf.getView().getModel("DisplayWorkingHours").setData(oSelf._deepCopy(aResults),false);
				oSelf._setScreenModel();
			});
			
			/* Get Timesheet Data */
			this.oDataManager.getTimesheetData(this.sPernr, this.dBegda, this.dEndda, function(aResults){
				oSelf.InitResendTimesheetData = [];
				if (aResults.length > 0) {
					oSelf.InitResendTimesheetData = oSelf._deepCopy(aResults);
					/* Transform data from backend */
					var oTimesheetData = oSelf._transformTimesheetData(aResults);
					/* Bind Timesheet Data to Screen */
					oSelf.getView().getModel("TimesheetData").setData(oTimesheetData,false);
					oSelf.oInitTimesheetData = oSelf._deepCopy(oTimesheetData);
					oSelf.getView().byId("timesheetData").destroyContent()
					for (var i = 0; i < oTimesheetData.length; i++) {
							oSelf._displayMoreTimesheetData(i);
					}
					/* Calculate Subtotal & Total Hours */
					oSelf._calculateTotalHours();
				} else {
					/* Get Default Timesheet Data */
					oSelf.oDataManager.getDefaultTimesheet(oSelf.sPernr, oSelf.dBegda, oSelf.dEndda, oSelf.sSourceScreen, function(aResults){
						/* Transform data from backend */
						var oDefaultTimesheet = oSelf._transformDefaultTimesheet(aResults);
						oSelf.getView().getModel("TimesheetData").setData(oDefaultTimesheet,false);
						/* Bind Timesheet Data to Screen */
						oSelf.oInitTimesheetData = oSelf._deepCopy(oDefaultTimesheet);
						oSelf.getView().byId("timesheetData").destroyContent()
						for (var iTSCount = 0; iTSCount < oDefaultTimesheet.length; iTSCount++) {
								oSelf._displayMoreTimesheetData(iTSCount);
						}
						oSelf._calculateTotalHours();
					});
				}
			});
			
			/* Get WorkCalendar Data */
			oSelf._removeCalendarColor();
			this.oDataManager.getWorkCalendar(this.sPernr, this.dBegda, this.dEndda, function(aResults) {
				var oWorkCalendar = oSelf._transformWorkCalendar(aResults);
				oSelf.getView().getModel("WorkCalendar").setData(oWorkCalendar,false);
				oSelf._setCalendarColor();
			});
			
			//if (this.sYear !== this.dBegda.getFullYear() || this.sMonth !== this.dBegda.getMonth()) {
			if (this.bFirst) {
				this.oDataManager.getDeductionTScd(function(aResult) {
					oSelf.oDeductionTScd = aResult;
					//oSelf.getView().getModel("MonthDetailInfo").setData(aResult,false);
				});
				
				this.bFirst = false;
			}
			
			/* Month Detail Info */
			this.oDataManager.getMonthDetailInfo(this.sPernr, '0000', '00', function(aResult){
				oSelf.getView().getModel("MonthDetailInfo").setData(aResult,false);
			});
			/* Month Working Time */
			this.oDataManager.getMonthlyWorkingTime(this.sPernr, '0000', '00', this.dBegda,function(aResults){
				oSelf.getView().getModel("MonthlyWorkingTime").setData(aResults);
			});
			
			this.sYear = this.dBegda.getFullYear();
			this.sMonth = this.dBegda.getMonth();
			
			/* Setting Info */
			this.oDataManager.getSettingInfo(this.sPernr, this.dBegda, this.dEndda, this.bMode, this.sSourceScreen, function(aResult) {
				oSelf.getView().getModel("SettingInfo").setData(aResult);
				oSelf._checkAllDisplayMode();
				oSelf._setButtonAttribute();
			});
		},
		/* Set Screen data */
		_setScreenModel: function() {
			"use strict";
			var oScreenModel = this.getView().getModel("ScreenModel");
			oScreenModel.setProperty("/Settinginfo/RestTime2Visible",false);
			oScreenModel.setProperty("/Settinginfo/RestTime2Icon","sap-icon://add");
		},
		/* Transform Timesheet Data */
		_transformTimesheetData: function(aResults) {
			"use strict";
			var oTimesheetMapping = {};
			var oTransformData = [];
			var iKeyCount = 0;
			for (var i = 0; i < aResults.length; i++) {
				var iLineNo;
				var sKey = aResults[i]["TSCdOutput"].concat( 
							aResults[i]["DataFields"]["TsSbCd"],
							aResults[i]["DataFields"]["ClntCd"],
							aResults[i]["DataFields"]["Appointapp"]);
				if (typeof (oTimesheetMapping[sKey]) !== "undefined") {
					iLineNo = oTimesheetMapping[sKey];
				} else {
					oTimesheetMapping[sKey] = iKeyCount;
					iLineNo = iKeyCount;
					iKeyCount++;
					/* Push the new Timesheet data */
					oTransformData.push({
						TimesheetCd: aResults[i]["TSCdOutput"],
						ClientCd: aResults[i]["DataFields"]["ClntCd"],
						ApproverCd: aResults[i]["DataFields"]["Appointapp"],
						TimesheetName: aResults[i]["TSTextOutput"],
						ClientName: aResults[i]["ClientNameOutput"],
						ApproverName: aResults[i]["ApproverName"],
						Subcode: aResults[i]["DataFields"]["TsSbCd"],
						dayHours: [ {WeekHours: null,	Status: "",	Counter: ""	}, 
						            {WeekHours: null,	Status: "",	Counter: ""	},
						            {WeekHours: null,	Status: "",	Counter: ""	},
						            {WeekHours: null,	Status: "",	Counter: ""	},
						            {WeekHours: null,	Status: "",	Counter: ""	},
						            {WeekHours: null,	Status: "",	Counter: ""	},
						            {WeekHours: null,	Status: "",	Counter: ""	}],
						original: [{}, {}, {}, {}, {}, {}, {}]
					
					});
				}
				/* DATE - STARTDATE */
				var fTimeDiff = Math.abs(aResults[i]["DataFields"]["Workdate"].getTime() - this._cvtDateToDb(this.dBegda).getTime());
				var iDiffDays = Math.ceil(fTimeDiff / (1000 * 3600 * 24)); 
				
				oTransformData[iLineNo]["dayHours"][iDiffDays]["WeekHours"] = parseFloat(aResults[i]["DataFields"]["Catshours"]);
				oTransformData[iLineNo]["dayHours"][iDiffDays]["Status"] = aResults[i]["DataFields"]["Status"];
				oTransformData[iLineNo]["dayHours"][iDiffDays]["Counter"] = aResults[i]["Counter"];
				oTransformData[iLineNo]["original"][iDiffDays] = aResults[i];
				
			}
			return oTransformData;
		},
		/* Display Timesheet Data */
		_displayMoreTimesheetData: function(aNumber) {
			"use strict";
			/* Show the timesheet data to the screen */
			var oVerticalLayout = this.getView().byId("timesheetData");
			var oTimesheetData = this.getView().getModel("TimesheetData").getProperty("/");
			var oTimesheetDataFragment = sap.ui
			.xmlfragment("id" + oTimesheetData.length,
					"sap.ZG001.timesheet.input.weekly.view.TimesheetData",
					this);
			oTimesheetDataFragment.bindObject({
				path : "/" + aNumber,
				model : "TimesheetData"
			});
			oVerticalLayout.addContent(oTimesheetDataFragment.clone());
		},
		/* Transform Default Timesheet Data */
		_transformDefaultTimesheet: function(aResults) {
			"use strict";
			/* Transform retrived default timesheet Data to Screen displayed format */
			var oTimesheetMapping = {};
			var oTransformData = [];
			for (var i = 0; i < aResults.length; i++) {
				/* Push the new Timesheet data */
				oTransformData.push({
					TimesheetCd: aResults[i]["TimesheetMainCode"],
					ClientName: aResults[i]["ClientName"],
					TimesheetName: aResults[i]["TimesheetName"],
					ClientCd: aResults[i]["ClientCode"],
					ApproverCd: aResults[i]["ApproverCode"],
					ApproverName : aResults[i]["ApproverName"],
					Subcode: aResults[i]["TimesheetSubCode"],
					dayHours: [ {WeekHours: null,	Status: "",	Counter: ""	}, 
					            {WeekHours: null,	Status: "",	Counter: ""	},
					            {WeekHours: null,	Status: "",	Counter: ""	},
					            {WeekHours: null,	Status: "",	Counter: ""	},
					            {WeekHours: null,	Status: "",	Counter: ""	},
					            {WeekHours: null,	Status: "",	Counter: ""	},
					            {WeekHours: null,	Status: "",	Counter: ""	}],
					original: [{}, {}, {}, {}, {}, {}, {}]
				
				});
				if( oTransformData[i]["ApproverCd"] === "00000000")
					oTransformData[i]["ApproverCd"] = "";
			}
			return oTransformData;
		},
		/* Calculate Timesheet Hours */
		onCalculateTotalHours: function(aControlEvent) {
			"use strict";
			var oSubTotal = [0,0,0,0,0,0,0];
			var oDeductionTSHour = [0,0,0,0,0,0,0];
			var fTotal = 0;
			var fDeductionTime = 0;
			var oTimesheetData = this.getView().getModel("TimesheetData").getData();
						
			/* Calculate timesheet hours daily */
			for(var iCount = 0; iCount < oTimesheetData.length; iCount++) {
				for(var iDays = 0; iDays < 7; iDays++) {
					oSubTotal[iDays] = Number(oTimesheetData[iCount].dayHours[iDays]["WeekHours"]) + Number(oSubTotal[iDays]);
					fTotal = Number(fTotal) + Number(oTimesheetData[iCount].dayHours[iDays]["WeekHours"]);
					/* Calculate deduction time */
					$.each(this.oDeductionTScd,function(aIdx, aItem){
						if (oTimesheetData[iCount]["TimesheetCd"] === aItem.TScd) {
							oDeductionTSHour[iDays] = oDeductionTSHour[iDays] + Number(oTimesheetData[iCount].dayHours[iDays]["WeekHours"]);
						}
					});
				}
			}
			var oSubTotalString = [];
			/* Calculate timesheet hours weekly */
			for(var iDaysSum = 0; iDaysSum < 7; iDaysSum++) {
				oSubTotalString.push(oSubTotal[iDaysSum].toFixed(2).toString());
			}
			
			/* Set calculated timesheet hours to the model*/
			this.getView().getModel("ScreenModel").setProperty("/Settinginfo/Subtotal",oSubTotalString);
			this.getView().getModel("ScreenModel").setProperty("/Settinginfo/Total",fTotal.toFixed(2).toString());
			this.getView().getModel("ScreenModel").setProperty("/Settinginfo/DeductionTSHour",oDeductionTSHour);	
			
			var sId = aControlEvent.getSource().getCustomData()[0].getValue();
			this._calculateLegalOvertime(sId);
		},
		/* Remove Calendar Title Color */
		_removeCalendarColor: function() {
			"use strict";
			/* Set Calendar Title Color as initial from Monday to Sunday */
			var oWorkCalendarData = this.getView().getModel("WorkCalendar").getProperty("/");
			for(var iCount = 0; iCount<oWorkCalendarData.length; iCount++) {
				this.getView().byId("ZZDay" + (iCount+1)).removeStyleClass("ZZCalendarDateType" + oWorkCalendarData[iCount].DayType);
			}
		},
		/* Transform Work Calendar Data */
		_transformWorkCalendar: function(aResults) {
			"use strict";
			var oWorkCalendar = [];
			for (var iCount = 0; iCount < aResults.length; iCount++) {
				var oDayInfo = {};
				if (!(aResults[iCount].WorkingDay === "TRUE")) {
					/* add to holidays to grey out */
					oDayInfo["DayType"] = "03";
				} else if (aResults[iCount].Status === "YACTION") {
					/* add missing days as yaction */
					oDayInfo["DayType"] = "01";
				} else if (aResults[iCount].Status === "MACTION") {
					oDayInfo["DayType"] = "05";
				} else if (aResults[iCount].Status === "REJECTED") {
					oDayInfo["DayType"] = "02";
				} else if (aResults[iCount].Status === "DONE") {
					oDayInfo["DayType"] = "04";
				}
				
				oDayInfo["SubDay"] = aResults[iCount].SubDay;
				oDayInfo["SubWorkingDay"] = aResults[iCount].SubWorkingDay;
				oWorkCalendar.push(oDayInfo);
			}
			return oWorkCalendar;
		},
		/* Set Calendar Title Color */
		_setCalendarColor: function() {
			"use strict";
			var oWorkCalendarData = this.getView().getModel("WorkCalendar").getProperty("/");
			for(var iCount = 0; iCount<oWorkCalendarData.length; iCount++) {
				this.getView().byId("ZZDay" + (iCount+1)).addStyleClass("ZZCalendarDateType" + oWorkCalendarData[iCount].DayType);
			}
		},
		/* Set screen data editable */
		_checkAllDisplayMode: function() {
			"use strict";
			var oSettingInfo = this.getView().getModel("SettingInfo");
			var oScreenModel = this.getView().getModel("ScreenModel");
			if(oSettingInfo.getProperty("/0/WorkingHoursEditable") ||
					oSettingInfo.getProperty("/1/WorkingHoursEditable") || 
					oSettingInfo.getProperty("/2/WorkingHoursEditable") || 
					oSettingInfo.getProperty("/3/WorkingHoursEditable") || 
					oSettingInfo.getProperty("/4/WorkingHoursEditable") || 
					oSettingInfo.getProperty("/5/WorkingHoursEditable") || 
					oSettingInfo.getProperty("/6/WorkingHoursEditable") ) {
				/* When WorkingHours can't be edited from Monday to Sunday */
				oScreenModel.setProperty("/Settinginfo/ModifiedMode",true);
			} else {
				/* When at least on day's WorkingHours can be edited from Monday to Sunday */
				oScreenModel.setProperty("/Settinginfo/ModifiedMode",false);
			}
		},
		/* Set button status */
		_setButtonAttribute: function(){
			"use strict";
			var oSettingInfo = this.getView().getModel("SettingInfo");
			var oScreenModel = this.getView().getModel("ScreenModel");
			var oButtonArray = ["Resend","Upload","Send","Save","Cancel","Delete","WorkingHours", "PersonalPortal"];
			var oFlag = {
					SendVisible		: false,
					ResendVisible	: false,
					UploadVisible	: false,
					SaveVisible		: false,
					CancelVisible	: false,
					DeleteVisible	: false,
					SendClickable	: false,
					ResendClickable	: false,
					UploadClickable	: false,
					SaveClickable	: false,
					CancelClickable : false,
					DeleteClickable	: false,
					WorkingHoursVisible: false,
					PersonalPortalVisible: false
			}
			for (var iCount = 0; iCount < 7; iCount++ ) {
				/* For each button when it is invisible from Monday to Sunday */
				/* Set that button as invisible */
				/* For each button when at least on day it is visible from Monday to Sunday */
				/* Set that button as visible */
				/* For each button when it is unclickable from Monday to Sunday */
				/* Set that button as unclickable */
				/* For each button when at least on day it is clickable from Monday to Sunday */
				/* Set that button as clickable */
				$.each(oButtonArray, function(aIdx, aItem){
					var sClickable	= aItem + "Clickable";
					var sVisible	= aItem + "Visible";
					var bClickable = oSettingInfo.getProperty("/" + iCount + "/" + sClickable);
					var bVisible = oSettingInfo.getProperty("/" + iCount + "/" + sVisible);
					if (bClickable) {
						oFlag[sClickable] = true;
					}
					if (bVisible) {
						oFlag[sVisible] = true;
					}
				});
				
				var bResendClickable = oSettingInfo.getProperty("/" + iCount + "/ResendClickable");
				var bSendClickable = oSettingInfo.getProperty("/" + iCount + "/SendClickable");
				var bSaveClickable = oSettingInfo.getProperty("/" + iCount + "/SaveClickable");
				
				if (!bResendClickable && !bSendClickable && !bSaveClickable) {
					oScreenModel.setProperty("/Settinginfo/TargetEditable/" + iCount, false);
				} else {
					oScreenModel.setProperty("/Settinginfo/TargetEditable/" + iCount, true);
				}
			}
			/* Set button status to the model */
			$.each(oButtonArray, function(aIdx, aItem){
				var sClickable	= aItem + "Clickable";
				var sVisible	= aItem + "Visible";
				oScreenModel.setProperty("/Settinginfo/" + sClickable, oFlag[sClickable]);
				oScreenModel.setProperty("/Settinginfo/" + sVisible, oFlag[sVisible]);
			});
		},
		/* Set input field to initial status */
		_initView: function() {
			"use strict";
			var oView = this.getView();

			for(var iDays = 0; iDays < 7; iDays++) {

				var aFieldId = [iDays + "WorkingHours",iDays + "Break1",iDays + "Break2",
				                iDays + "TimeHoliday1",iDays + "TimeHoliday2",iDays + "LateLeaveEarly1",
				                iDays + "LateLeaveEarly2", iDays + "ChildRearing1", iDays + "ChildRearing2",
				                iDays + "ChildNursing1",iDays + "ChildNursing2", iDays + "Care1",iDays + "Care2"];

				for( var iCount = 0; iCount<aFieldId.length; iCount++ ) {
					oView.byId(aFieldId[iCount] + "S").setValueState("None");
					oView.byId(aFieldId[iCount] + "E").setValueState("None");
				}
			}
			
			var oFieldGroup = sap.ui.getCore().byFieldGroupId("ZZInputField");
			/* Check All the input field */
			$.each(oFieldGroup, function(aIdx, aItem) {
				aItem.setValueState("None");
				aItem.setValue("");
			});
		},
		/* Get date with offset to start date */
		_getDay: function(aDate, aOffset) {
			"use strict";
			var oDate = new Date(aDate.toString());
			return new Date(oDate.setDate(oDate.getDate() - (oDate.getDay() === 0 ? 7:oDate.getDay()) + aOffset));
		},
		/* Event handler when add new tab button clicked */
		onAddTimesheetData: function() {
			"use strict";
			/* Create new Timesheet Input field to screen and return */
			var oVerticalLayout = this.getView().byId("timesheetData");			
			var oTimesheetData = this.getView().getModel("TimesheetData").getData();
			var oTimesheetDataFragment = sap.ui.xmlfragment("sap.ZG001.timesheet.input.weekly.view.TimesheetData",
					this);
			oTimesheetDataFragment.bindObject({
				path : "/" + oTimesheetData.length,
				model : "TimesheetData"
			});
			var oInitData = {
					"ClientCd": "",
					"ClientName": "",
					"TimesheetCd": "",
					"TimesheetName": "",
					"ApproverCd": "",
					"ApproverName": "",
					"Subcode" : "00",
					"dayHours": [ {WeekHours: null, Status: "", Counter: ""}, 
					              {WeekHours: null, Status: "", Counter: ""},
					              {WeekHours: null, Status: "", Counter: ""},
					              {WeekHours: null, Status: "", Counter: ""},
					              {WeekHours: null, Status: "", Counter: ""},
					              {WeekHours: null, Status: "", Counter: ""},
					              {WeekHours: null, Status: "", Counter: ""}],
					"original": [{}, {}, {}, {}, {}, {}, {}]
			};
			oTimesheetData.push(this._deepCopy(oInitData));
			this.oInitTimesheetData.push(this._deepCopy(oInitData));
			this.getView().getModel("ScreenModel").setProperty("/TimesheetData",oTimesheetData);
			oVerticalLayout.addContent(oTimesheetDataFragment.clone());
		},
		/* Event handler when Time2 visible button clicked */
		onTime2VisiblePress: function(aControlEvent) {
			"use strict";
			var sElement = aControlEvent.getSource().getCustomData()[0].getValue();
			var bDisplayFlag = this.getView().getModel("ScreenModel").getProperty("/Settinginfo/" + sElement + "Visible");
			if (bDisplayFlag) {
				/* When it is visible, set it to invisible and set button to show */
				this.getView().getModel("ScreenModel").setProperty("/Settinginfo/" + sElement + "Visible",false);
				this.getView().getModel("ScreenModel").setProperty("/Settinginfo/" + sElement + "Icon","sap-icon://add");
				aControlEvent.getSource().setIcon("sap-icon://add");
			} else {
				/* When it is invisible, set it to visible and set button to hidden */
				this.getView().getModel("ScreenModel").setProperty("/Settinginfo/" + sElement + "Visible",true);
				this.getView().getModel("ScreenModel").setProperty("/Settinginfo/" + sElement + "Icon","sap-icon://less");
			}
		},
		/* Event handler when Calendar Title button clicked */
		onCalendarTitlePress: function(aControlEvent) {
			"use strict";
			/* Create a Popup with a Calendar */
			if (!this._oPopup) {
				jQuery.sap.require("sap.ui.core.Popup");
				this._oPopup = new sap.ui.core.Popup();
				this._oPopup.setDurations(0, 0);
			}
			
			if (!this._oCalendar) {
				sap.ui.getCore().loadLibrary("sap.ui.unified");
				jQuery.sap.require("sap.ui.unified.library");
				this._oCalendar = new sap.ui.unified.Calendar({firstDayOfWeek:1,
																singleSelection: true});
				this._oDateRange = new sap.ui.unified.DateRange();
				this._oPopup.setContent(this._oCalendar);
				/* Call function "_selectDate" when select on day on calendar */
				this._oCalendar.attachSelect(this._selectDate, this);
				/* Call function "_addSpecialDate" when calendar start date changed */
				this._oCalendar.attachStartDateChange(this._addSpecialDate, this);
				this._addSpecialDate(null);
			}
			/* Set Calendar Selected Date as Application Date */
			this._oDateRange = new sap.ui.unified.DateRange({
				startDate: this.dCurrentDate
			});
			this._oCalendar.removeAllSelectedDates();
			this._oCalendar.addSelectedDate(this._oDateRange);
			var source = aControlEvent.getSource();
			var oDock = sap.ui.core.Popup.Dock;
			var sAt = oDock.BeginBottom + "-4"; 
			if (this._oPopup.isOpen()) {
				this._oPopup.close();
			} else {
				this._oPopup.open(0, oDock.CenterTop, sAt, source, null, "fit", true);
				this._oCalendar.focusDate(null);
			}

		},
		/* Event handler when select on day on calendar */
		_selectDate: function(aControlEvent){
			"use strict";
			var oSelf = this;
			var oTimesheetData = this.getView().getModel("TimesheetData").getData();
			var oWorkingHours = this.getView().getModel("WorkingHours").getData();
			var oChangeDateDeferred = new jQuery.Deferred();
			/* Check the data on Screen are changed or not */
			if ( !(this._deepCompare(oTimesheetData, this.oInitTimesheetData)) ||
				 !(this._deepCompare(oWorkingHours, this.oInitWorkingHours)) ) {
				/* Confirm change date when data have been changed */
				var sMessage = this.oBundle.getText("ZF_MSG020");
				this._processConfirmMessageBox(sMessage, sap.m.MessageBox.Icon.WARNING, function() {
					oChangeDateDeferred.resolve();
				});
			} else {
				oChangeDateDeferred.resolve();
				
			}
			oChangeDateDeferred.done(function() {
				/* Date Check */
				var dDateCheck = oSelf._getSelectedDate();
				var dBegdaCheck = oSelf._getDay(dDateCheck,1);
				var dEnddaCheck = oSelf._getDay(dDateCheck,7);
				oSelf._checkDateValidation(dBegdaCheck,dEnddaCheck).then(function(){
					/* Change Date */
					var dDate = oSelf._getSelectedDate();
					oSelf.dCurrentDate = dDate;
					oSelf.dBegda = oSelf._getDay(oSelf.dCurrentDate,1);
					oSelf.dEndda = oSelf._getDay(oSelf.dBegda,7);

					var oScreenModel = oSelf.getView().getModel("ScreenModel");
					oScreenModel.setProperty("/Settinginfo/BeginDate",oSelf.dBegda);
					oScreenModel.setProperty("/Settinginfo/EndDate",oSelf.dEndda);
					
					oSelf._updateModel();
					oSelf.getView().getModel("ScreenModel").setProperty("/Settinginfo/SelectedDate",dDate);
				})
			});
			
			oSelf._oPopup.close();
		},
		/*Confirm Message Box */
		_processConfirmMessageBox : function(aSummaryMessage, aMsgType, aFOK, aFCancel) {
			"use strict";
			var oSelf = this;
			var sMessage = aSummaryMessage;
			var oMessage = {
					message: sMessage,
					type: aMsgType
			};

			setTimeout(function(){
				sap.m.MessageBox.confirm(
						oMessage.message, {
							icon: aMsgType,
							onClose: function(oAction) {
								switch(oAction) {
								case "OK":
									/* When ok button is clicked, call function aFOK */
									aFOK();
									break;
								case "CANCEL":
									/* When cancel button is clicked, call function aFCancel */
									if (typeof (aFCancel) !== "undefined") {
										aFCancel();
									}
									break;
								default:
									break;
								}
							}
						}
				);
			},300);
		},
		/* Get Selected Date on calendar */
		_getSelectedDate: function() {
			"use strict";
			var aSelectedDates = this._oCalendar.getSelectedDates();
			var oDate;

			if (aSelectedDates.length > 0) {
				oDate = aSelectedDates[0].getStartDate();
			}
			return oDate;
		},
		/* Event handler calendar start date changed */
		_addSpecialDate: function(){
			"use strict";
			var oSelf = this;
			var dFirstDate = this._oCalendar.getStartDate();
			var dEndDate = new Date(dFirstDate);  
			dEndDate.setMonth(dFirstDate.getMonth()+1);  
			dEndDate.setDate(0);
			/* Get Calendar data */
			this.oDataManager.getWorkCalendar(this.sPernr, dFirstDate, dEndDate, function(aResults){
				oSelf._transformPopupCalendarDate(aResults);
			});

			this._oCalendar.focusDate(null);
		},
		/* Transform Work Calendar */
		_transformPopupCalendarDate: function(aResults) {
			"use strict";
			var oGrey = [],
				oYaction = [],
				oDone = [],
				oMaction = [],
				oRejected = [];
			for (var i = 0; i < aResults.length; i++) {
				var dDateToWork = this._cvtDateToScreen(aResults[i].Date);
				var bWorkingDay = aResults[i].WorkingDay === "TRUE";

				var sStatus = aResults[i].Status;

				if (!bWorkingDay) {
					/* add to holidays to grey out */
					oGrey.push(dDateToWork);
				} else if (sStatus === "YACTION") {
					/* add missing days as yaction */
					oYaction.push(dDateToWork);
				} else if (sStatus === "MACTION") {
					oMaction.push(dDateToWork);
				} else if (sStatus === "REJECTED") {
					oRejected.push(dDateToWork);
				} else if (sStatus === "DONE") {
					oDone.push(dDateToWork);
				}

			}
			/* Add Transfromed Special date to calendar by call function "_setSpecialDate" */
			this._oCalendar.removeAllSpecialDates();
			this._setSpecialDate(oMaction,"Type05");
			this._setSpecialDate(oDone,"Type04");
			this._setSpecialDate(oGrey,"Type03");
			this._setSpecialDate(oYaction,"Type01");
			this._setSpecialDate(oRejected,"Type02");
			this._oCalendar.rerender();
		},
		/* Add Transfromed Special date to calendar */
		_setSpecialDate: function(aDateArray, aDateType) {
			"use strict";
			for (var iCount = 0; iCount < aDateArray.length; iCount++) {
				this.oSpecialDates[aDateArray[iCount]] = new sap.ui.unified.DateTypeRange({
					startDate : new Date(aDateArray[iCount]),
					type : aDateType
				});
				this._oCalendar.addSpecialDate(this.oSpecialDates[aDateArray[iCount]]);
			}
		},
		/* Event handler when timepicker data changed */
		onTimePickerChange: function(aControlEvent) {
			"use strict";
			/* Get Changed Property */
			var sId = aControlEvent.getSource().getCustomData()[0].getValue();
			var oWorkingHoursModel = this.getView().getModel("WorkingHours");
			var iMsoffset = ((new Date).getTimezoneOffset())*60*1000;
			/* Get StartHour, EndHour, sumHours and Next day Flag */
			var oStart = oWorkingHoursModel.getProperty(sId + "S");
			var oEnd = oWorkingHoursModel.getProperty(sId + "E");
			var sStartValue = oStart !== null ? new Date(oStart.ms + iMsoffset) : new Date(0 + iMsoffset);
			var sEndValue   = oEnd !== null ? new Date(oEnd.ms + iMsoffset) : new Date(0 + iMsoffset);
			var sStartAnotherDay = oWorkingHoursModel.getProperty(sId + "SF");
			var sEndAnotherDay = oWorkingHoursModel.getProperty(sId + "EF");
			
			sStartValue = sStartAnotherDay === true ? new Date(sStartValue.setDate(sStartValue.getDate() + 1)) : sStartValue;
			sEndValue = sEndAnotherDay === true ? new Date(sEndValue.setDate(sEndValue.getDate() + 1)) : sEndValue;
			
			var fOldHours    = oWorkingHoursModel.getProperty(sId + "H");
			/* Calculate Hours */
			if (sStartValue && sEndValue) {
				var fNewHours = this._calculateTime(sId, sStartValue, sEndValue);
				oWorkingHoursModel.setProperty(sId + "H",fNewHours);
				this._sumHours(sId,fNewHours,fOldHours);
			} else {
				oWorkingHoursModel.setProperty(sId + "H",null);
				this._sumHours(sId,0,fOldHours);
			}

		},
		_calculateTime : function(aId, aStartDate, aEndDate) {
			"use strict";
			if (aId.substr(aId.length-12,12) === "WorkingHours") {
				if(	(this.getView().getModel("WorkCalendar").getProperty(aId.substr(0,3)+"DayType") === "03"
						&& this.getView().getModel("WorkingHours").getProperty(aId.substr(0,3) + "CompensatingDay" ) === null )
					|| this.getView().getModel("WorkCalendar").getProperty(aId.substr(0,3)+"DayType") !== "03"
						&& this.getView().getModel("WorkingHours").getProperty(aId.substr(0,3) + "CompensatingDay" ) !== null ){
					return ((aEndDate - aStartDate) / 3600 / 1000).toFixed(2);
				} else {
					return this._calculateWorkHours(aStartDate, aEndDate);
				}
			} else if (aId.substr(aId.length-12,12) === "TimeHoliday1" || 
						aId.substr(aId.length-15,15) === "LateLeaveEarly1" ||
						aId.substr(aId.length-13,13) === "ChildRearing1" ||
						aId.substr(aId.length-13,13) === "ChildNursing1" ||
						aId.substr(aId.length-5,5) === "Care1" ){
				return this._calculateWorkHours(aStartDate, aEndDate);
			} else if (aStartDate && aEndDate) {
					return ((aEndDate - aStartDate) / 3600 / 1000).toFixed(2);
			} else {
					return 0;
			}
		},
		_calculateWorkHours : function(aStartDate, aEndDate) {
			"use strict";
			var iDeviation = this._getOverlapTime(aStartDate, aEndDate);
			return ((aEndDate - aStartDate - iDeviation / 2) / 3600 / 1000).toFixed(2);
        },
        
        _getOverlapTime: function(aStartDate, aEndDate) {
			"use strict";
			var oStartRestDate = (new Date(aStartDate)).setHours(12,0);
			var oEndRestDate   = (new Date(aStartDate)).setHours(13,0);
			/* Calculate offset times */
			var iOffset = (aEndDate - aStartDate) + (oEndRestDate - oStartRestDate) - Math.abs(aStartDate - oStartRestDate) - Math.abs(aEndDate - oEndRestDate)
			var iDeviation;
			/* if offset < 0, means there is no offset times */
			if (iOffset < 0) {
				iDeviation = 0;
			} else {
				iDeviation = iOffset;
			}
			return iDeviation;
        },
        
        /* Calculate SumHours */
		_sumHours : function(aId,aNewHours,aOldHours) {
			"use strict";
			var oWorkingHoursDisplayModel = this.getView().getModel("DisplayWorkingHours");
			
			var sSumHours = Number(oWorkingHoursDisplayModel.getProperty(aId.substr(0,3) + "TodayWorkingHours"));

			if (aId.substr(aId.length-12,12) === "WorkingHours"){
				sSumHours = aNewHours - aOldHours + sSumHours;
			} else if (aId.substr(aId.length-6,6) === "Break1" ||
					aId.substr(aId.length-6,6) === "Break2"){
				sSumHours = aOldHours - aNewHours + sSumHours;
			} else{
			}

			oWorkingHoursDisplayModel.setProperty(aId.substr(0,3) + "TodayWorkingHours",sSumHours.toFixed(2));

			this._calculateLegalOvertime(aId);
		},
		
		onPreviousWeek: function() {
			"use strict";
			/* Check the data on Screen are changed or not */
			var oSelf = this;
			var oTimesheetData = this.getView().getModel("TimesheetData").getData();
			var oWorkingHours = this.getView().getModel("WorkingHours").getData();
			var oChangeDateDeferred = new jQuery.Deferred();
			if ( !(this._deepCompare(oTimesheetData, this.oInitTimesheetData)) ||
				 !(this._deepCompare(oWorkingHours, this.oInitWorkingHours)) ) {
				
				/* Confirm change date when data have been changed */
				var sMessage = this.oBundle.getText("ZF_MSG020");
				this._processConfirmMessageBox(sMessage, sap.m.MessageBox.Icon.WARNING, function() {
					oChangeDateDeferred.resolve();
				});
			} else {
				oChangeDateDeferred.resolve();
			}

			oChangeDateDeferred.done(function() {
				/* Date Check */
				
				var dCurrDateCheck = new Date(oSelf.dCurrentDate.toString());
				var dDateCheck = new Date(dCurrDateCheck.setDate(dCurrDateCheck.getDate() - 7));
				var dBegdaCheck = oSelf._getDay(dDateCheck,1);
				var dEnddaCheck = oSelf._getDay(dDateCheck,7);

				oSelf._checkDateValidation(dBegdaCheck,dEnddaCheck).then(function(){
					/* Change Date */
					var oDate = new Date(oSelf.dCurrentDate.toString());
					var oScreenModel = oSelf.getView().getModel("ScreenModel");
					oSelf.dCurrentDate = new Date(oDate.setDate(oDate.getDate() - 7));
					oSelf.dBegda = oSelf._getDay(oSelf.dCurrentDate,1);
					oSelf.dEndda = oSelf._getDay(oSelf.dBegda,7);
					oScreenModel.setProperty("/Settinginfo/BeginDate",oSelf.dBegda);
					oScreenModel.setProperty("/Settinginfo/EndDate",oSelf.dEndda);
					oSelf._updateModel();
				});
			});
		},
		
		onNextWeek: function() {
            "use strict";
			/* Check the data on Screen are changed or not */
			var oSelf = this;
			var oTimesheetData = this.getView().getModel("TimesheetData").getData();
			var oWorkingHours = this.getView().getModel("WorkingHours").getData();
			var oChangeDateDeferred = new jQuery.Deferred();
			if ( !(this._deepCompare(oTimesheetData, this.oInitTimesheetData)) ||
				 !(this._deepCompare(oWorkingHours, this.oInitWorkingHours)) ) {
				
				/* Confirm change date when data have been changed */
				var sMessage = this.oBundle.getText("ZF_MSG020");
				this._processConfirmMessageBox(sMessage, sap.m.MessageBox.Icon.WARNING, function() {
					oChangeDateDeferred.resolve();
				});
			} else {
				oChangeDateDeferred.resolve();
			}
			oChangeDateDeferred.done(function() {
				/* Date Check */
				var dCurrDateCheck = new Date(oSelf.dCurrentDate.toString());
				var dDateCheck = new Date(dCurrDateCheck.setDate(dCurrDateCheck.getDate() + 7));
				var dBegdaCheck = oSelf._getDay(dDateCheck,1);
				var dEnddaCheck = oSelf._getDay(dDateCheck,7);

				oSelf._checkDateValidation(dBegdaCheck,dEnddaCheck).then(function(){
					/* Change Date */
		            var oDate = new Date(oSelf.dCurrentDate.toString());
					var oScreenModel = oSelf.getView().getModel("ScreenModel");
					oSelf.dCurrentDate = new Date(oDate.setDate(oDate.getDate() + 7));
		            oSelf.dBegda = oSelf._getDay(oSelf.dCurrentDate,1);
		            oSelf.dEndda = oSelf._getDay(oSelf.dBegda,7);
					oScreenModel.setProperty("/Settinginfo/BeginDate",oSelf.dBegda);
					oScreenModel.setProperty("/Settinginfo/EndDate",oSelf.dEndda);
					oSelf._updateModel();
				});
			});
		},
		_deepCopy: function(aData) {
            "use strict";
			if (aData != null) {
				var oResult;
				oResult = aData.constructor === Array ? [] : {};
				if ( aData.constructor === Date ) {
					oResult = new Date(aData);
				}
				for ( var oProperty in aData) {
					if (aData.hasOwnProperty(oProperty)) {
						oResult[oProperty] = typeof aData[oProperty] === "object" ? this._deepCopy(aData[oProperty]) : aData[oProperty];
					}
				}
				return oResult;   
			} else {
				return null;
			}
		},
		_deepCompare: function(aObject1,aObject2) {
            "use strict";
			/* If both aObject1 and aObject2 are null or undefined and exactly the same */
			if ( aObject1 === aObject2 ) {
				return true;
			}
			/* If they are not strictly equal, they both need to be Objects */
			if ( !( aObject1 instanceof Object ) || !( aObject2 instanceof Object ) ) {
				return false;
			}
			/* They must have the same prototype chain,the closest we can */
			/* do is */
			/* test the constructor. */
			if ( aObject1.constructor !== aObject2.constructor ) {
				return false;
			}
			var oProperty;
			for ( oProperty in aObject1 ) {
				/* Inherited properties were tested using aObject1.constructor === */
				/* aObject2.constructor */
				if ( aObject1.hasOwnProperty( oProperty ) ) {
					/* Allows comparing aObject1[ p ] and aObject2[ p ] when set to undefined */
					if ( !aObject2.hasOwnProperty( oProperty ) ) {
						return false;
					}
					/* If they have the same strict value or identity then they are */
					/* equal */
					if ( aObject1[ oProperty ] === aObject2[ oProperty ] ) {
						continue;
					}
					/* Numbers, Strings, Functions, Booleans must be strictly equal */
					if ( typeof ( aObject1[ oProperty ] ) !== "object" ) {
						return false;
					}
					/* Objects and Array must be tested recursively */
					if ( !this._deepCompare( aObject1[ oProperty ], aObject2[ oProperty ] ) ) {
						return false;
					}
				}
			}
			
			for ( oProperty in aObject2 ) {
				/* allows aObject1[ p ] to be set to undefined */
				if ( aObject2.hasOwnProperty( oProperty ) && !aObject1.hasOwnProperty( oProperty ) ) {
					return false;
				}
			}
			return true;
		},
		_processMessage : function(aMessages, aMsgType, aTitle) {
			"use strict";
			var sMessage = "";
			var sMessageDetails = "";
			if (aMessages) {
				for (var i = 0; i < aMessages.length; i++) {
					sMessageDetails += aMessages[i].code + "(" + aMessages[i].num + "):" + aMessages[i].message + "\n";
				}
			}
			sMessage = this.oBundle.getText("ZF_NUMBEROFERROR",aMessages.length);
			var oMessage = {
					message: sMessage,
					details: sMessageDetails,
					type: aMsgType
			};
			setTimeout(function(){
				sap.m.MessageBox.show(
						oMessage.message, {
							icon: aMsgType,
							title: aTitle,
							actions: [sap.m.MessageBox.Action.OK],
							details: oMessage.details,
							onClose: function(oAction) {}
						}
				);
			},300);
		},
		/* Nav Back or Cancel Button Press Processing */
		onNavPress: function() {
			"use strict";
			/* Check the data on Screen are changed or not */
			var oSelf = this;
			var oTimesheetData = this.getView().getModel("TimesheetData").getData();
			var oWorkingHours = this.getView().getModel("WorkingHours").getData();
			var oDeferred = new jQuery.Deferred();
			
			if ( !(this._deepCompare(oTimesheetData, this.oInitTimesheetData)) ||
					!(this._deepCompare(oWorkingHours, this.oInitWorkingHours)) ) {

				/* Confirm change date when data have been changed */
				var sMessage = this.oBundle.getText("ZF_MSG020");
				this._processConfirmMessageBox(sMessage, sap.m.MessageBox.Icon.WARNING, function() {
					oDeferred.resolve();
				});
			} else {
				oDeferred.resolve();
			}
			oDeferred.done(function() {
				window.history.go(-1);
			});
		},

		/* Save Button Press Processing */
		onSave: function() {
			"use strict";
			var oSelf = this;
			var oScreenModel = oSelf.getView().getModel("ScreenModel");
			var sSaveOpreationType = oScreenModel.getProperty("/Settinginfo/SaveOpreationType");
			/* Check if there is some dates which data is changed but not target date */
			var oChangeDateArray = oSelf._checkTargetDataOnSelected();
			var sMessage = oSelf.oBundle.getText("ZF_MSG026");
			var sSuccessMessage = oSelf.oBundle.getText("ZF_MSG027");
			var sChangeDateArrayMSG = oSelf.oBundle.getText("ZF_MSG057",[oChangeDateArray["Date"].join(","),oSelf.oBundle.getText("ZF_BTN_SAVE")]);
			oSelf._checkChangeDateProcess(oChangeDateArray,sSaveOpreationType,sMessage,sSuccessMessage,sChangeDateArrayMSG);

		},

		_checkTargetDataOnSelected: function() {
			"use strict";
			var oWorkingHours = this.getView().getModel("WorkingHours");
			var oTimesheetData = this.getView().getModel("TimesheetData").getData();
			var oWorkingHoursData = this.getView().getModel("WorkingHours").getData();
			var oChangeDateArray = {
					"Number":[],
					"Date":[],
					"TargetDays":0
			};

			this._setDataUpdateStatus(oWorkingHoursData, false);
			this._setDataDeleteStatus(oWorkingHoursData, false);
			
			var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "MM/dd"});
			for (var iDays = 0; iDays < 7; iDays++) {
				var sTimesheetFlag = true;
				var oDate = this._getDay(this.dCurrentDate,iDays + 1);
				/* Check the data on Screen are changed or not */
				for (var iCount = 0; iCount < oTimesheetData.length; iCount++) {
					if (this._deepCompare(oTimesheetData[iCount]["dayHours"][iDays], this.oInitTimesheetData[iCount]["dayHours"][iDays]) &&
							( Number(oTimesheetData[iCount]["dayHours"][iDays]["WeekHours"]) === 0 )) {
						continue;
					} else if ( !(this._deepCompare(oTimesheetData[iCount]["dayHours"][iDays], this.oInitTimesheetData[iCount]["dayHours"][iDays]) ) ||
								 !(this._deepCompare(oTimesheetData[iCount]["original"][iDays], this.oInitTimesheetData[iCount]["original"][iDays])) ||
								 !(this._deepCompare(oTimesheetData[iCount]["ApproverCd"], this.oInitTimesheetData[iCount]["ApproverCd"])) ||
								 !(this._deepCompare(oTimesheetData[iCount]["ClientCd"], this.oInitTimesheetData[iCount]["ClientCd"]))  ||
								 !(this._deepCompare(oTimesheetData[iCount]["TimesheetCd"], this.oInitTimesheetData[iCount]["TimesheetCd"])) ||
								 !(this._deepCompare(oTimesheetData[iCount]["Subcode"], this.oInitTimesheetData[iCount]["Subcode"])))  {
						sTimesheetFlag = false;
						break;
					}
				}
				if ( !sTimesheetFlag ||
					 !(this._deepCompare(oWorkingHoursData[iDays], this.oInitWorkingHours[iDays])) ) {
					/*if Target Flag is not on*/
					if (!oWorkingHours.getProperty("/" + iDays + "/FlgTarget")) {
						oChangeDateArray["Date"].push(oDateFormat.format(oDate));
						oChangeDateArray["Number"].push(iDays);
					}
				}
				if (oWorkingHours.getProperty("/" + iDays + "/FlgTarget")) {
					oChangeDateArray["TargetDays"]++;
				}
			}
			return oChangeDateArray;
		},
		_checkChangeDateProcess: function(aChangeDateArray, aOpreationType,aMessage,aSuccessMessage,aChangeDateArrayMSG) {
			"use strict";
			var oSelf = this;
			var oWorkingHours = oSelf.getView().getModel("WorkingHours");
			var oWorkingHoursData = oSelf.getView().getModel("WorkingHours").getData();
			var oTimesheetData = oSelf.getView().getModel("TimesheetData").getData();
			var oDeferred = new jQuery.Deferred();
			var oScreenModel = this.getView().getModel("ScreenModel");
			var sDeleteOpreationType = oScreenModel.getProperty("/Settinginfo/DeleteOpreationType");
			if (aChangeDateArray["TargetDays"] === 0) {
				/* No Target Date */
				var sNoTargetMessage = {
						code : "ZHR001",
						num : "036",
						message : this.oBundle.getText("ZF_MSG036")
				}
				oSelf._processMessage([sNoTargetMessage],sap.m.MessageBox.Icon.ERROR,oSelf.oBundle.getText("ERROR"));
			} else {
				oDeferred.resolve();
			}
			oDeferred.done(function() {
				/* Set Update Data */
				if (sDeleteOpreationType === aOpreationType) {
					var oUpdateData = [];
				} else {
					var oUpdateData = oSelf._prepareUpdateData(oTimesheetData,aOpreationType);
				}
				oSelf._updateProcess(oWorkingHoursData, oUpdateData, aMessage, aSuccessMessage, aOpreationType 
						,aChangeDateArray,aChangeDateArrayMSG);
			});
		},

		/* Data Prepare Processing */
		_prepareUpdateData: function(aTimesheetData, aOpreationType) {
			"use strict";
			var oWorkingHours = this.getView().getModel("WorkingHours");
			var oUpdateData = [];

			var oScreenModel = this.getView().getModel("ScreenModel");
			var sResendOpreationType = oScreenModel.getProperty("/Settinginfo/ResendOpreationType");
			var sSaveOpreationType = oScreenModel.getProperty("/Settinginfo/SaveOpreationType");
			
			for(var iCount = 0; iCount < aTimesheetData.length; iCount++) {
				
				for (var iDays = 0; iDays < 7; iDays++) {
					
					oUpdateData.push(this._deepCopy(aTimesheetData[iCount]["original"][iDays]));
					
					if (typeof (aTimesheetData[iCount]["original"][iDays]["DataFields"]) !== "undefined") {
						/* Data from CATSDB */
						oUpdateData[oUpdateData.length - 1]["DataFields"]["Pernr"] = this.sPernr;
						oUpdateData[oUpdateData.length - 1]["DataFields"]["ClntCd"] = aTimesheetData[iCount]["ClientCd"];
						oUpdateData[oUpdateData.length - 1]["DataFields"]["Appointapp"] = aTimesheetData[iCount]["ApproverCd"];
						oUpdateData[oUpdateData.length - 1]["DataFields"]["TsSbCd"] = aTimesheetData[iCount]["Subcode"].toString();

						oUpdateData[oUpdateData.length - 1]["Status"] = aTimesheetData[iCount]["dayHours"][iDays]["Status"];
						oUpdateData[oUpdateData.length - 1]["TSCdOutput"] = aTimesheetData[iCount]["TimesheetCd"];
						oUpdateData[oUpdateData.length - 1]["WorkDate"] = this._cvtDateToDb(new Date(this.dBegda.getTime() + 24*60*60*1000*iDays));
						oUpdateData[oUpdateData.length - 1]["OperationType"] = aOpreationType;
						oUpdateData[oUpdateData.length - 1]["FlgTarget"] = oWorkingHours.getProperty("/" + iDays + "/FlgTarget");
						oUpdateData[oUpdateData.length - 1]["SourceScreenMode"] = this.sSourceScreen;
						if (Number(aTimesheetData[iCount]["dayHours"][iDays]["WeekHours"]) === 0) {
							oUpdateData[oUpdateData.length - 1]["FlgDel"] = true;
						} else {
							oUpdateData[oUpdateData.length - 1]["DataFields"]["Catshours"] = Number(aTimesheetData[iCount]["dayHours"][iDays]["WeekHours"]).toFixed(2).toString();
						}
					} else if (Number(aTimesheetData[iCount]["dayHours"][iDays]["WeekHours"]) === 0) {
						/* Data from default timesheet data or Add timesheet processing */
						oUpdateData.pop();
					} else {
						oUpdateData[oUpdateData.length - 1] = {
								DataFields: {
									Pernr: this.sPernr,
									ClntCd: aTimesheetData[iCount]["ClientCd"],
									Appointapp: aTimesheetData[iCount]["ApproverCd"],
									Catshours: Number(aTimesheetData[iCount]["dayHours"][iDays]["WeekHours"]).toFixed(2).toString(),
									TsSbCd: aTimesheetData[iCount]["Subcode"].toString()
								},
								Pernr: this.sPernr,
								TSCdOutput: aTimesheetData[iCount]["TimesheetCd"],
								WorkDate: this._cvtDateToDb(new Date(this.dBegda.getTime() + 24*60*60*1000*iDays)),
								OperationType: aOpreationType,
								FlgTarget: oWorkingHours.getProperty("/" + iDays + "/FlgTarget"),
								SourceScreenMode: this.sSourceScreen
						}
					}
				}
			}
			return oUpdateData;
		},
		/* Update Process */
		_updateProcess: function(aWoringHours, aTimesheetData, aMessage, aSuccessMessage, 
				aOpreationType,aChangeDateArray,aChangeDateArrayMSG) {
			"use strict";
			var oSelf = this;
			var sCheckErrorMessage = "";
			var oScreenModel = this.getView().getModel("ScreenModel");
			var sResendOpreationType = oScreenModel.getProperty("/Settinginfo/ResendOpreationType");
			var sDeleteOpreationType = oScreenModel.getProperty("/Settinginfo/DeleteOpreationType");
			var oConfirmDeferred = new jQuery.Deferred();
			var oUpdateDeferred = new jQuery.Deferred();
			var oBackendCheckDeferred = new jQuery.Deferred();
			var oTargetCheckDeferred = new jQuery.Deferred();
			
			/* check view data validity */
			if (aOpreationType !== sResendOpreationType && aOpreationType !== sDeleteOpreationType) {
				if (!oSelf._checkViewData()) {
					return;
				}
			}
			
			/*
			else {
				if (!oSelf._validateTimesheetData()){
					return;
				};
			}
			*/

			/* check timesheet data status */
			if (aOpreationType !== sDeleteOpreationType) {
				var oReturnObject = this._checkTimesheetData(aWoringHours, aTimesheetData, aOpreationType)
				if (oReturnObject["ErrorFlag"]) {
					oSelf._processMessage([oReturnObject["ErrorMessage"]],sap.m.MessageBox.Icon.ERROR,oSelf.oBundle.getText("ERROR"));
					return;
				}
			}

			/* check delete process */
			if (aOpreationType === sDeleteOpreationType) {
				var oReturnObject = this._checkDeleteProcessing();
				if (oReturnObject["ErrorFlag"]) {
					oSelf._processMessage([oReturnObject["ErrorMessage"]],sap.m.MessageBox.Icon.ERROR,oSelf.oBundle.getText("ERROR"));
					return;
				}
			}
			
			/* check warning */
			var oWarningMessage = [];
			if (aOpreationType !== sResendOpreationType && aOpreationType !== sDeleteOpreationType) {
				oWarningMessage = this._checkWarningMessage();
			}
			if (oWarningMessage.length > 0) {
				oSelf._processConfirmMessageBox(oWarningMessage.join("\n"), sap.m.MessageBox.Icon.WARNING,
						/* OK Process */
						function() {
							oConfirmDeferred.resolve();
						}
				);
			} else {
				oConfirmDeferred.resolve();
			}
			
			/* Warning Confirmed OK */
			/* When Delete */
			if (aOpreationType === sDeleteOpreationType) {
				oSelf._setDataDeleteStatus(aWoringHours, true);
			}
			oConfirmDeferred.done(function() {
				/* Set Data as check status */
				oSelf._setDataUpdateStatus(aWoringHours, false);

				/* Check Update Data */
				oSelf.oDataManager.updateTimesheetData(oSelf.sPernr, aWoringHours, aTimesheetData,oSelf.InitResendTimesheetData, function(){
					/* No Error for update data */
					oBackendCheckDeferred.resolve()
				});
			});
			
			/* Backend Check OK */
			oBackendCheckDeferred.done(function() {
				if (aChangeDateArray["Date"].length > 0 && sDeleteOpreationType !== aOpreationType) {
					/* Confirm target Date */
					oSelf._processConfirmMessageBox(aChangeDateArrayMSG, sap.m.MessageBox.Icon.WARNING, 
							/* OK Process */
							function() {
								/* Confirm Update Opreation */
								oTargetCheckDeferred.resolve();
							});
				} else {
					oTargetCheckDeferred.resolve();
				}
			});
			
			/* Backend Check OK */
			oTargetCheckDeferred.done(function() {
				/* Call a messbox for user confirm update action */
				oSelf._processConfirmMessageBox(aMessage, sap.m.MessageBox.Icon.WARNING, function() {
					oUpdateDeferred.resolve();
				});
			});
			
			/* Update Confirmed OK */
			oUpdateDeferred.done(function() {
				/* Set Data as check status */
				oSelf._setDataUpdateStatus(aWoringHours, true);
				
				oSelf.oDataManager.updateTimesheetData(oSelf.sPernr, aWoringHours, aTimesheetData, oSelf.InitResendTimesheetData, function(){
					sap.m.MessageToast.show(aSuccessMessage,{
						animationDuration:6000
					});
					if (aOpreationType !== sResendOpreationType && aOpreationType !== sDeleteOpreationType) {
						oSelf._backToMenu();
					} else {
						oSelf._updateModel(aOpreationType);
					}
				});
			});
		},
		
		_setDataUpdateStatus: function(aWoringHours, aStatus) {
			$.each(aWoringHours, function(aIdx, aItem){
				aItem["FlgUpdate"] = aStatus;
			});
		},
		_setDataDeleteStatus: function(aWoringHours, aStatus) {
			$.each(aWoringHours, function(aIdx, aItem){
				aItem["FlgDelete"] = aStatus;
			});
		},
		/* Nav Back to Menu Screen */
		_backToMenu: function() {
			var sUrl = sap.ushell.Container.getService("CrossApplicationNavigation").hrefForExternal({
				target : {
					semanticObject : "Shell",
					action : "home",
				}
			});
			sap.ushell.Container.getService("CrossApplicationNavigation").toExternal({
				target: {
					shellHash: sUrl
				}
			});
		},
		_checkTimesheetData: function(aWoringHours, aTimesheetData, aOpreationType) {
			"use strict";
			var oScreenModel = this.getView().getModel("ScreenModel");
			var sSaveOpreationType = oScreenModel.getProperty("/Settinginfo/SaveOpreationType");
			var sSendOpreationType = oScreenModel.getProperty("/Settinginfo/SendOpreationType");
			var sResendOpreationType = oScreenModel.getProperty("/Settinginfo/ResendOpreationType");
			var oReturnObject = {
					"ErrorFlag": false,
					"ErrorMessage": ""
			}
			switch(aOpreationType) {
				/* Save Opreation */
				case sSaveOpreationType:
					for(var iCountSave = 0; iCountSave < aTimesheetData.length; iCountSave++) {
						if (Number(aTimesheetData[iCountSave]["Status"]) >= 20 && aTimesheetData[iCountSave]["FlgTarget"]) {
							oReturnObject["ErrorMessage"] = {
									code : "ZHR001",
									num : "041",
									message : this.oBundle.getText("ZF_MSG041")
							};
							oReturnObject["ErrorFlag"] = true;
							break;
						}
					}
					break;
				case sSendOpreationType:
					/* Send Opreation */
					for(var iCountSend = 0; iCountSend < aTimesheetData.length; iCountSend++) {
						if (Number(aTimesheetData[iCountSend]["Status"]) >= 20 && aTimesheetData[iCountSend]["FlgTarget"]) {
							oReturnObject["ErrorMessage"] = {
									code : "ZHR001",
									num : "039",
									message : this.oBundle.getText("ZF_MSG039")
							};
							oReturnObject["ErrorFlag"] = true;
							break;
						}
					}
					break;
				case sResendOpreationType:
					/* Resend Opreation */
					var bFlgResendError = false;
					var bTimesheetExist = false;
					
					for(var i = 0; i < aWoringHours.length; i++){
						bTimesheetExist = false;
						
						if ( aWoringHours[i]["FlgTarget"] === false ){
							continue;
						}
						
						$.each(aTimesheetData, function(aIdx, aItem){
							if( aItem["WorkDate"].getDate() === aWoringHours[i]["Date"].getDate()){
								bTimesheetExist = true;
							}							
						});
						
						if ( !bTimesheetExist ){
							bFlgResendError = true;
							break;
						}
					}
					
					for(var iCountResend = 0; iCountResend < aTimesheetData.length; iCountResend++) {
						if ( ((typeof (aTimesheetData[iCountResend]["Status"]) === "undefined") || Number(aTimesheetData[iCountResend]["Status"]) <= 10 ) && aTimesheetData[iCountResend]["FlgTarget"]) {
							bFlgResendError = true;
							break;
						}
					}
					
					if (bFlgResendError){
						oReturnObject["ErrorMessage"] = {
								code : "ZHR001",
								num : "040",
								message : this.oBundle.getText("ZF_MSG040")
						};
						oReturnObject["ErrorFlag"] = true;
					}
					
					break;
				default:
					break;
			}
			return oReturnObject;
		},
		
		_checkDeleteProcessing: function() {
			var oWorkingHours = this.getView().getModel("WorkingHours");
			var oSettingInfo = this.getView().getModel("SettingInfo");
			var oReturnObject = {
					"ErrorFlag": false,
					"ErrorMessage": ""
			}
			var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "MM/dd"});
			var oErrorDateArray = [];
			
			for(var iDays = 0; iDays < 7; iDays++) {
				var oDate = this._getDay(this.dCurrentDate,iDays + 1);
				var bTarget = oWorkingHours.getProperty("/" + iDays + "/FlgTarget");
				var bClickable = oSettingInfo.getProperty("/" + iDays + "/" + "DeleteVisible");
				if (bTarget && !bClickable) {
					oErrorDateArray.push(oDateFormat.format(oDate));
				}
			}
			if (oErrorDateArray.length > 0) {

				oReturnObject["ErrorMessage"] = {
						code : "ZHR001",
						num : "093",
						message : this.oBundle.getText("ZF_MSG093",oErrorDateArray.join(","))
				};
				oReturnObject["ErrorFlag"] = true;
			}
			return oReturnObject;
		},
		
		/* View Data Check */
		_checkViewData: function(){
			"use strict";
			
			/* Input Data Type Check */
			var bErrorFlag = false;
			var oErrorElements = [];
			var oFieldGroup = sap.ui.getCore().byFieldGroupId("ZZInputField");
			/* Check All the input field */
			$.each(oFieldGroup, function(aIdx, aItem){						
				if ("Error" === aItem.getValueState()) {
					/* When input field has Error occured */
					bErrorFlag = true; 
					oErrorElements.push(aItem);
				}
				/* Exit the loop when Error ItemArray and ErrorElments Array both have data*/
				if (oErrorElements.length > 0) {
					return false;
				}
			});
			if (bErrorFlag === true) {
				oErrorElements[0].focus();
				return false;
			}

			/* Check Logic of Time Data */
			var oView = this.getView();
			var oI18n = this.getOwnerComponent().getModel("i18n").getResourceBundle();
			var oWorkingHours = this.getView().getModel("WorkingHours");
			var oErrorArray = [];
			var oMessageArray = [];
			var oMessage;
			var iCount;
			var oScreenModel = this.getView().getModel("ScreenModel");
			var oSettingInfoModel = this.getView().getModel("SettingInfo");
			var oWorkCalendar = this.getView().getModel("WorkCalendar")
			var iMsoffset = ((new Date).getTimezoneOffset())*60*1000;
			var oId = ["WorkingHours","Break1","Break2","TimeHoliday1","TimeHoliday2","LateLeaveEarly1","LateLeaveEarly2",
			           "ChildRearing1","ChildRearing2","ChildNursing1","ChildNursing2","Care1","Care2"];
			var oFieldName = ["ZF_KIMHOUR","ZF_REST1","ZF_REST2","ZF_TIMELEV1","ZF_TIMELEV2","ZF_LATELEAVE1","ZF_LATELEAVE2",
			                  "ZF_SUPCHILD1","ZF_SUPCHILD2","ZF_CARCHILD1","ZF_CARCHILD2","ZF_NURCARE1","ZF_NURCARE2"];

			for(var iDays = 0; iDays < 7; iDays++) {

				var oStartTimeArray = [];
				var oEndTimeArray = []; 
				var sPath = "/" + iDays + "/";
				if (!oWorkingHours.getProperty(sPath + "FlgTarget")) {
					continue;
				}
				var sWorkingStartFlag = oWorkingHours.getProperty(sPath + "WorkingHoursSF");
				var sWorkingEndFlag = oWorkingHours.getProperty(sPath + "WorkingHoursEF");
				var oWorkingStart = oWorkingHours.getProperty(sPath + "WorkingHoursS");
				var oWorkingEnd = oWorkingHours.getProperty(sPath + "WorkingHoursE");
				var sWorkingStartTime = oWorkingStart !== null ? new Date(oWorkingStart.ms + iMsoffset) : new Date(0 + iMsoffset);
				var sWorkingEndTime = oWorkingEnd !== null ? new Date(oWorkingEnd.ms + iMsoffset) : new Date(0 + iMsoffset);
				if(!this._checkTimeInitial(sWorkingEndTime,sWorkingEndFlag)){
					sWorkingEndTime = sWorkingEndFlag === true ? new Date(sWorkingEndTime.setDate(sWorkingEndTime.getDate() + 1)) : sWorkingEndTime;
				}
				if(!this._checkTimeInitial(sWorkingStartTime,sWorkingStartFlag)){
					sWorkingStartTime = sWorkingStartFlag === true ? new Date(sWorkingStartTime.setDate(sWorkingStartTime.getDate() + 1)) : sWorkingStartTime;
				}

				var oStartTime,
					oEndTime,
					oEndTimeScreen,
					oTimeNine,
					sEndFlag,
					sStartFlag,
					oStart,
					oEnd;
				var aFieldId = [iDays + "WorkingHours",iDays + "Break1",iDays + "Break2",
				                iDays + "TimeHoliday1",iDays + "TimeHoliday2",iDays + "LateLeaveEarly1",
				                iDays + "LateLeaveEarly2", iDays + "ChildRearing1", iDays + "ChildRearing2",
				                iDays + "ChildNursing1",iDays + "ChildNursing2", iDays + "Care1",iDays + "Care2"];
				/* for begin */
				for( iCount = 0; iCount < oId.length; iCount++ ) {

					if (oScreenModel.getProperty(oId + "Visible") === false) {
						continue;
					}
					
					switch(oId[iCount]) {
						case "ChildRearing1":
							if (oSettingInfoModel.getProperty(sPath + "ChildSupp12Visible") === false) {
								continue;
							}
							break;
						case "ChildRearing2":
							if (oSettingInfoModel.getProperty(sPath + "ChildSupp12Visible") === false) {
								continue;
							}
							break;
						case "ChildNursing1":
							if (oSettingInfoModel.getProperty(sPath + "ChildNurs12Visible") === false) {
								continue;
							}
							break;
						case "ChildNursing2":
							if (oSettingInfoModel.getProperty(sPath + "ChildNurs12Visible") === false) {
								continue;
							}
							break;
						case "Care1":
							if (oSettingInfoModel.getProperty(sPath + "Care12Visible") === false) {
								continue;
							}
							break;
						case "Care2":
							if (oSettingInfoModel.getProperty(sPath + "Care12Visible") === false) {
								continue;
							}
							break;
						default:
							break;
					}

					sStartFlag	  = oWorkingHours.getProperty(sPath + oId[iCount] + "SF");
					sEndFlag	  = oWorkingHours.getProperty(sPath + oId[iCount] + "EF");
					oStart = oWorkingHours.getProperty(sPath + oId[iCount] + "S");
					oEnd = oWorkingHours.getProperty(sPath + oId[iCount] + "E");
					oStartTime = oStart !== null ? new Date(oStart.ms + iMsoffset) : new Date(0 + iMsoffset);
					oEndTime = oEnd !== null ? new Date(oEnd.ms + iMsoffset) : new Date(0 + iMsoffset);
					oEndTimeScreen = oEnd !== null ? new Date(oEnd.ms + iMsoffset) : new Date(0 + iMsoffset);
					oTimeNine  = new Date((new Date((new Date(oEndTime)).setHours(9,0))).setDate(oEndTime.getDate() + 1));
					
					if(!this._checkTimeInitial(oEndTime,sEndFlag)){
						oEndTime = sEndFlag === true ? new Date(oEndTime.setDate(oEndTime.getDate() + 1)) : oEndTime;
					}
					if(!this._checkTimeInitial(oStartTime,sStartFlag)){
						oStartTime = sStartFlag === true ? new Date(oStartTime.setDate(oStartTime.getDate() + 1)) : oStartTime;
					}
					/* 117 */
					/* When all time input data is not inputed with unit of 15 minutes */
					if ((!this._checkTimeInitial(oStartTime,sStartFlag) && oStartTime.getTime() / 1000 / 60 % 15 !== 0) ||
						(!this._checkTimeInitial(oEndTime,sEndFlag) && oEndTime.getTime() / 1000 / 60 % 15 !== 0)) {
						if (!this._checkTimeInitial(oStartTime,sStartFlag) && oStartTime.getTime() / 1000 / 60 % 15 !== 0) {
							oView.byId(aFieldId[iCount] + "S").setValueStateText(oI18n.getText("ZF_MSG054"));
							oView.byId(aFieldId[iCount] + "S").setValueState("Error");
							oErrorArray.push(oView.byId(aFieldId[iCount] + "S"));
						} else {
							oView.byId(aFieldId[iCount] + "S").setValueState("None");
						}
						if (!this._checkTimeInitial(oEndTime,sEndFlag) && oEndTime.getTime() / 1000 / 60 % 15 !== 0) {
							oView.byId(aFieldId[iCount] + "E").setValueStateText(oI18n.getText("ZF_MSG054"));
							oView.byId(aFieldId[iCount] + "E").setValueState("Error");
							oErrorArray.push(oView.byId(aFieldId[iCount] + "E"));
						} else {
							oView.byId(aFieldId[iCount] + "E").setValueState("None");
						}
						continue;
					} else {
						oView.byId(aFieldId[iCount] + "S").setValueState("None");
						oView.byId(aFieldId[iCount] + "E").setValueState("None");
					}
					
					/* No.22~29,95~97 */
					/* When all time input data is inputed with end time > start time */
					if(!this._checkTimeInitial(oStartTime,sStartFlag) && !this._checkTimeInitial(oEndTime,sEndFlag) && (oStartTime > oEndTime)){
						oView.byId(aFieldId[iCount] + "S").setValueStateText(
										oI18n.getText("ZF_MSG006",
										[ oI18n.getText(oFieldName[iCount]) + oI18n.getText("ZF_MSGSTARTTIME"), oI18n.getText(oFieldName[iCount]) + oI18n.getText("ZF_MSGENDTIME") ]
								));
						oView.byId(aFieldId[iCount] + "E").setValueStateText(
										oI18n.getText("ZF_MSG006",
										[ oI18n.getText(oFieldName[iCount]) + oI18n.getText("ZF_MSGSTARTTIME"), oI18n.getText(oFieldName[iCount]) + oI18n.getText("ZF_MSGENDTIME") ]
								));
						oView.byId(aFieldId[iCount] + "S").setValueState("Error");
						oView.byId(aFieldId[iCount] + "E").setValueState("Error");
						oErrorArray.push(oView.byId(aFieldId[iCount] + "S"));
						oErrorArray.push(oView.byId(aFieldId[iCount] + "E"));
						continue;
					} else {
						oView.byId(aFieldId[iCount] + "S").setValueState("None");
						oView.byId(aFieldId[iCount] + "E").setValueState("None");			
					}
					
					/* No.35~39 */
					/* When following input data is inputed with start time > 9:00(Next Day) */
					if( (oId[iCount] === "WorkingHours") 	|| 
						(oId[iCount] === "Break1") 			||
						(oId[iCount] === "Break2") 			|| 
						(oId[iCount] === "TimeHoliday1") 	||
						(oId[iCount] === "LateLeaveEarly1") ){
						if( ( oEndTime > oTimeNine ) && (oWorkingHours.getProperty(sPath + oId[iCount] + "EF") === true) 
								&& !this._checkTimeInitial(oEndTime,sEndFlag)) {
							oView.byId(aFieldId[iCount] + "E").setValueStateText(oI18n.getText("ZF_MSG010"));
							oView.byId(aFieldId[iCount] + "E").setValueState("Error");
							oErrorArray.push(oView.byId(aFieldId[iCount] + "E"));
							continue;		
						} else {
							oView.byId(aFieldId[iCount] + "E").setValueState("None");								
						}
						if( ( oStartTime > oTimeNine ) && (oWorkingHours.getProperty(sPath + oId[iCount] + "SF") === true) 
								&& !this._checkTimeInitial(oStartTime, sStartFlag)) {
							oView.byId(aFieldId[iCount] + "S").setValueStateText(oI18n.getText("ZF_MSG010"));
							oView.byId(aFieldId[iCount] + "S").setValueState("Error");
							oErrorArray.push(oView.byId(aFieldId[iCount] + "S"));		
							continue;
						} else {
							oView.byId(aFieldId[iCount] + "S").setValueState("None");								
						}
						
						if((oWorkingHours.getProperty(sPath + oId[iCount] + "SF") === true) 
								&& (oWorkingHours.getProperty(sPath + oId[iCount] + "EF") === false)){
							oView.byId(aFieldId[iCount] + "S").setValueStateText(
									oI18n.getText("ZF_MSG006",
											[ oI18n.getText(oFieldName[iCount]) + oI18n.getText("ZF_MSGSTARTTIME"), oI18n.getText(oFieldName[iCount]) + oI18n.getText("ZF_MSGENDTIME") ]
									));
							oView.byId(aFieldId[iCount] + "E").setValueStateText(
									oI18n.getText("ZF_MSG006",
											[ oI18n.getText(oFieldName[iCount]) + oI18n.getText("ZF_MSGSTARTTIME"), oI18n.getText(oFieldName[iCount]) + oI18n.getText("ZF_MSGENDTIME") ]
									));
							oView.byId(aFieldId[iCount] + "S").setValueState("Error");
							oView.byId(aFieldId[iCount] + "E").setValueState("Error");
							oErrorArray.push(oView.byId(aFieldId[iCount] + "S"));
							oErrorArray.push(oView.byId(aFieldId[iCount] + "E"));
							continue;
						} else {
							oView.byId(aFieldId[iCount] + "S").setValueState("None");
							oView.byId(aFieldId[iCount] + "E").setValueState("None");
						}
					}
					
					/* No.54~61 */
					/* When following hours is not aliquant for 0.25 */
					if( (oId[iCount] === "WorkingHours")		||
						(oId[iCount] === "Break1") 			||
						(oId[iCount] === "Break2") 			|| 
						(oId[iCount] === "LateLeaveEarly1")	||
						(oId[iCount] === "LateLeaveEarly2")	) {
						if( Number(oWorkingHours.getProperty(sPath + oId[iCount] + "H")) % 0.25 !== 0){
							oView.byId(aFieldId[iCount] + "S").setValueStateText(oI18n.getText("ZF_MSG014"));
							oView.byId(aFieldId[iCount] + "E").setValueStateText(oI18n.getText("ZF_MSG014"));
							oView.byId(aFieldId[iCount] + "S").setValueState("Error");
							oView.byId(aFieldId[iCount] + "E").setValueState("Error");
							oErrorArray.push(oView.byId(aFieldId[iCount] + "S"));
							oErrorArray.push(oView.byId(aFieldId[iCount] + "E"));
							continue;
						} else {
							oView.byId(aFieldId[iCount] + "S").setValueState("None");
							oView.byId(aFieldId[iCount] + "E").setValueState("None");
						}
					} else if ( (oId[iCount] === "TimeHoliday1")  ||
								(oId[iCount] === "TimeHoliday2")  ||
								(oId[iCount] === "ChildRearing1") ||
								(oId[iCount] === "ChildRearing2") ||
								(oId[iCount] === "ChildNursing1") ||
								(oId[iCount] === "ChildNursing2") ||
								(oId[iCount] === "Care1") 		 ||
								(oId[iCount] === "Care2")       ) {
						/* When following hours is not aliquant for 1 */
						if( Number(oWorkingHours.getProperty(sPath + oId[iCount] + "H")) % 1 !== 0){
							oView.byId(aFieldId[iCount] + "S").setValueStateText(oI18n.getText("ZF_MSG015"));
							oView.byId(aFieldId[iCount] + "E").setValueStateText(oI18n.getText("ZF_MSG015"));
							oView.byId(aFieldId[iCount] + "S").setValueState("Error");
							oView.byId(aFieldId[iCount] + "E").setValueState("Error");
							oErrorArray.push(oView.byId(aFieldId[iCount] + "S"));		
							oErrorArray.push(oView.byId(aFieldId[iCount] + "E"));
							continue;
						} else {
							oView.byId(aFieldId[iCount] + "S").setValueState("None");
							oView.byId(aFieldId[iCount] + "E").setValueState("None");
						}
					}

					/* No 62,112~116 */
					/* When following element, time1 = 0 but time2 <> 0 */
					if( (oId[iCount] === "Break1") 		   ||
						(oId[iCount] === "LateLeaveEarly1") ||
						(oId[iCount] === "ChildRearing1")   ||
						(oId[iCount] === "ChildNursing1")   ||
						(oId[iCount] === "Care1")	   ) 	{
						var id2 = oId[iCount].substring(0,oId[iCount].length-1) + "2";
						
						if((Number(oWorkingHours.getProperty(sPath + oId[iCount] + "H")) === 0) && 
							(Number(oWorkingHours.getProperty(sPath + id2 + "H")) !== 0)) {
							oView.byId(aFieldId[iCount] + "S").setValueStateText(oI18n.getText("ZF_MSG017"));
							oView.byId(aFieldId[iCount] + "E").setValueStateText(oI18n.getText("ZF_MSG017"));
							oView.byId(aFieldId[iCount] + "S").setValueState("Error");
							oView.byId(aFieldId[iCount] + "E").setValueState("Error");
							oErrorArray.push(oView.byId(aFieldId[iCount] + "S"));		
							oErrorArray.push(oView.byId(aFieldId[iCount] + "E"));
							continue;
						} else {
							oView.byId(aFieldId[iCount] + "S").setValueState("None");
							oView.byId(aFieldId[iCount] + "E").setValueState("None");
						}
					};
					
					/* No 63,64,104~109 */
					/* When following element, time1 is overlap with time2 */
					if( (oId[iCount] === "Break2") ) {
						var sId1 = oId[iCount].substring(0,oId[iCount].length-1) + "1";
						var sEndFlag1      = oWorkingHours.getProperty(sPath + sId1 + "EF");
						var sStartFlag1      = oWorkingHours.getProperty(sPath + sId1 + "SF");

						var oStart1 = oWorkingHours.getProperty(sPath + sId1 + "S");
						var oEnd1 = oWorkingHours.getProperty(sPath + sId1 + "E");
						var oStartTime1 = oStart1 !== null ? new Date(oStart1.ms + iMsoffset) : new Date(0 + iMsoffset);
						var oEndTime1 = oEnd1 !== null ? new Date(oEnd1.ms + iMsoffset) : new Date(0 + iMsoffset);
						
						if (!this._checkTimeInitial(oEndTime1,sEndFlag1)){
							oEndTime1 = sEndFlag1 === true ? new Date(oEndTime1.setDate(oEndTime1.getDate() + 1)) : oEndTime1;
						}
						if (!this._checkTimeInitial(oStartTime1,sStartFlag1)){
							oStartTime1 = sStartFlag1 === true ? new Date(oStartTime1.setDate(oStartTime1.getDate() + 1)) : oStartTime1;
						}
						if (!this._checkTimeInitial(oStartTime1,sStartFlag1) && 
								!this._checkTimeInitial(oEndTime1,sEndFlag1) && 
								!this._checkTimeInitial(oStartTime,sStartFlag) && 
								!this._checkTimeInitial(oEndTime,sEndFlag)) {
							if((oStartTime1 > oStartTime) || (oEndTime1 > oStartTime) || 
							   (oStartTime1 > oEndTime) 	 || (oEndTime1 > oEndTime))  {
								oView.byId(aFieldId[iCount] + "S").setValueStateText(oI18n.getText("ZF_MSG017"));
								oView.byId(aFieldId[iCount] + "E").setValueStateText(oI18n.getText("ZF_MSG017"));
								oView.byId(aFieldId[iCount] + "S").setValueState("Error");
								oView.byId(aFieldId[iCount] + "E").setValueState("Error");
								oErrorArray.push(oView.byId(aFieldId[iCount] + "S"));		
								oErrorArray.push(oView.byId(aFieldId[iCount] + "E"));
								continue;
							} else {
								oView.byId(aFieldId[iCount] + "S").setValueState("None");
								oView.byId(aFieldId[iCount] + "E").setValueState("None");
							}
						}
					}
					
					/* No.66 */
					if( (oId[iCount] === "Break1") ||
						(oId[iCount] === "Break2") ||
						(oId[iCount] === "TimeHoliday1")  ||
						(oId[iCount] === "LateLeaveEarly1") ||
						(oId[iCount] === "ChildRearing1") ||
						(oId[iCount] === "ChildNursing1") ||
						(oId[iCount] === "Care1")  ) {
						
						if ((oStartTime < sWorkingStartTime || oEndTime > sWorkingEndTime) &&
								(!this._checkTimeInitial(oEndTime,sEndFlag) && !this._checkTimeInitial(oStartTime,sStartFlag) )) {
							oView.byId(aFieldId[iCount] + "S").setValueStateText(oI18n.getText("ZF_MSG089",[oI18n.getText(("ZF_MSG"+oId[iCount]).toUpperCase())]));
							oView.byId(aFieldId[iCount] + "E").setValueStateText(oI18n.getText("ZF_MSG089",[oI18n.getText(("ZF_MSG"+oId[iCount]).toUpperCase())]));
							oView.byId(aFieldId[iCount] + "S").setValueState("Error");
							oView.byId(aFieldId[iCount] + "E").setValueState("Error");
							oErrorArray.push(oView.byId(aFieldId[iCount] + "S"));		
							oErrorArray.push(oView.byId(aFieldId[iCount] + "E"));
							continue;
						} else {
							oView.byId(aFieldId[iCount] + "S").setValueState("None");
							oView.byId(aFieldId[iCount] + "E").setValueState("None");
						}
					}

					/* No.134 */
					/* When following time input data is overlap with 12:00~13:00 */
					if( ( 	(oId[iCount] === "Break1") ||
							(oId[iCount] === "Break2") )  &&
						( (			oWorkCalendar.getProperty("/" + iDays + "/DayType") !== "03"
										&& oWorkingHours.getProperty(sPath + "CompensatingDay") === null )
							|| (	oWorkCalendar.getProperty("/" + iDays + "/DayType") === "03" 
										&& oWorkingHours.getProperty(sPath + "CompensatingDay") !== null  ) ) ) {
						
						var iOverlapTime = this._getOverlapTime(oStartTime, oEndTime);
						if (iOverlapTime > 0) {
							oView.byId(aFieldId[iCount] + "S").setValueStateText(oI18n.getText("ZF_MSG087",[oI18n.getText(oFieldName[iCount])]));
							oView.byId(aFieldId[iCount] + "E").setValueStateText(oI18n.getText("ZF_MSG087",[oI18n.getText(oFieldName[iCount])]));
							oView.byId(aFieldId[iCount] + "S").setValueState("Error");
							oView.byId(aFieldId[iCount] + "E").setValueState("Error");
							oErrorArray.push(oView.byId(aFieldId[iCount] + "S"));		
							oErrorArray.push(oView.byId(aFieldId[iCount] + "E"));
							continue;
						} else {
							oView.byId(aFieldId[iCount] + "S").setValueState("None");
							oView.byId(aFieldId[iCount] + "E").setValueState("None");
						}
					}
					
					/* No.147~148 */
					/* Check rest1 and rest2: start time = working start time or end time = working end time */
					if (	(oId[iCount] === "Break1") ||
							(oId[iCount] === "Break2") 
						){
						if ( (!this._checkTimeInitial(oStartTime,sStartFlag)) && (oStartTime.getTime() === sWorkingStartTime.getTime()) ){
							oView.byId(aFieldId[iCount] + "S").setValueStateText(oI18n.getText("ZF_MSG100",[oI18n.getText(oFieldName[iCount])]));
							oView.byId(aFieldId[iCount] + "S").setValueState("Error");
							oErrorArray.push(oView.byId(aFieldId[iCount] + "S"));
							continue;
						} else {
							oView.byId(aFieldId[iCount] + "S").setValueState("None");					
						}
						
						if ( (!this._checkTimeInitial(oEndTime,sEndFlag)) && (oEndTime.getTime() === sWorkingEndTime.getTime()) ){
							oView.byId(aFieldId[iCount] + "E").setValueStateText(oI18n.getText("ZF_MSG100",[oI18n.getText(oFieldName[iCount])]));
							oView.byId(aFieldId[iCount] + "E").setValueState("Error");
							oErrorArray.push(oView.byId(aFieldId[iCount] + "E"));
							continue;
						} else {
							oView.byId(aFieldId[iCount] + "E").setValueState("None");					
						}	
					}
					
					/* No.150 */
					/* When LateLeaveEarly1's start time is not equal working start time and LateLeaveEarly1's end time is not equal working end time */					
					if (oId[iCount] === "LateLeaveEarly1"){
						if ( (!this._checkTimeInitial(oStartTime,sStartFlag)) && (oStartTime.getTime() !== sWorkingStartTime.getTime())
							&& (!this._checkTimeInitial(oEndTime,sEndFlag)) && (oEndTime.getTime() !== sWorkingEndTime.getTime())	){
							oView.byId(aFieldId[iCount] + "S").setValueStateText(oI18n.getText("ZF_MSG101",[oI18n.getText(oFieldName[iCount])]));
							oView.byId(aFieldId[iCount] + "E").setValueStateText(oI18n.getText("ZF_MSG101",[oI18n.getText(oFieldName[iCount])]));
							oView.byId(aFieldId[iCount] + "S").setValueState("Error");
							oView.byId(aFieldId[iCount] + "E").setValueState("Error");
							oErrorArray.push(oView.byId(aFieldId[iCount] + "S"));		
							oErrorArray.push(oView.byId(aFieldId[iCount] + "E"));
							continue;
						} else {
							oView.byId(aFieldId[iCount] + "S").setValueState("None");
							oView.byId(aFieldId[iCount] + "E").setValueState("None");					
						}
					}
					
					/* No.167 */
					/* When start time is equal end time */
					if (	(oId[iCount] === "Break1")  ||
							(oId[iCount] === "Break2")  ||
							(oId[iCount] === "TimeHoliday1")  ||
							(oId[iCount] === "LateLeaveEarly1") ||
							(oId[iCount] === "ChildRearing1") ||
							(oId[iCount] === "ChildNursing1") ||
							(oId[iCount] === "Care1") ){
						if ( (this._checkTimeInitial(oEndTime,sEndFlag)) && (this._checkTimeInitial(oEndTime,sEndFlag)) ){
							continue;
						}else{
							if ( oStartTime.getTime() === oEndTime.getTime() ){
								oView.byId(aFieldId[iCount] + "S").setValueStateText(oI18n.getText("ZF_MSG113",[oI18n.getText(oFieldName[iCount])]));
								oView.byId(aFieldId[iCount] + "E").setValueStateText(oI18n.getText("ZF_MSG113",[oI18n.getText(oFieldName[iCount])]));								
								oView.byId(aFieldId[iCount] + "S").setValueState("Error");
								oView.byId(aFieldId[iCount] + "E").setValueState("Error");
								oErrorArray.push(oView.byId(aFieldId[iCount] + "S"));		
								oErrorArray.push(oView.byId(aFieldId[iCount] + "E"));
							}else{
								oView.byId(aFieldId[iCount] + "S").setValueState("None");
								oView.byId(aFieldId[iCount] + "E").setValueState("None");	
							}
						}
					}
					
					/* Duplicated Time */
					if(oId[iCount] !== "WorkingHours"){
						oStartTimeArray.push(oStartTime);
						oEndTimeArray.push(oEndTime);
					}
				}
				/* for end */
		        /* Duplicated Time */
		        oStartTimeArray.sort(function(aTime1,aTime2) {
		          return aTime1 - aTime2
		        });
		        oEndTimeArray.sort(function(aTime1,aTime2) {
		          return aTime1 - aTime2
		        });
		        /* When element beside working hours is overlap */
	            for (var iIndex = 1; iIndex<oStartTimeArray.length; iIndex++) {
	                if (oStartTimeArray[iIndex] < oEndTimeArray[iIndex-1]) {
	                    oMessage = {
                                code : "ZHR001",
                                num : "018",
                                message : oI18n.getText("ZF_MSG018")
                        }
                        oMessageArray.push(oMessage);
	                    break;
	                }
	            }
            }
			
            /* Check Timesheet Data */
			var oTimesheetData = this.getView().getModel("TimesheetData");
			var oVerticalLayout = this.getView().byId("timesheetData");
			var oUITimesheetData = oVerticalLayout.getAggregation("content");
			var oTimesheetCodeArray = [];
			var oTimesheetUIArray = [];
			for (var iTSCount = 0; iTSCount < oTimesheetData.getData().length; iTSCount++) {
				var sSumHours = 0;
				var sSubCode = oTimesheetData.getProperty("/" + iTSCount + "/Subcode");
				var sTSSUB = oTimesheetData.getProperty("/" + iTSCount + "/TimesheetCd") + " " + oTimesheetData.getProperty("/" + iTSCount + "/Subcode");
				var sDayHoursArray = oTimesheetData.getProperty("/" + iTSCount + "/dayHours");
				var sTimesheetCode = sSubCode === 0 ? (oTimesheetData.getProperty("/" + iTSCount + "/TimesheetCd")) : sTSSUB;
				var sApproverCode  = oTimesheetData.getProperty("/" + iTSCount + "/ApproverCd");
				var oUIClientCode = oUITimesheetData[iTSCount].getAggregation("content")[0]
																.getAggregation("content")[0]
																.getAggregation("content")[0]
																.getAggregation("content")[1]
																.getAggregation("items")[0];
				var oUITimesheetCode = oUITimesheetData[iTSCount].getAggregation("content")[0]
																.getAggregation("content")[0]
																.getAggregation("content")[1]
																.getAggregation("content")[1]
																.getAggregation("items")[0];
				var oUIApproverCode = oUITimesheetData[iTSCount].getAggregation("content")[0]
																.getAggregation("content")[0]
																.getAggregation("content")[9]
																.getAggregation("content")[1]
																.getAggregation("items")[0];
				for (var iTSDays = 0; iTSDays < 7; iTSDays++ ) {
					sSumHours = sSumHours + (sDayHoursArray[iTSDays]["WeekHours"] === "" ? 0 : Number(sDayHoursArray[iTSDays]["WeekHours"]));
				}
				/* Necessary Timesheet input */
				if (!sTimesheetCode && sSumHours > 0) {
					oUITimesheetCode.setValueStateText(this.oBundle.getText("ZF_MSG001",this.oBundle.getText("ZF_MSGTIMESHEET")));
					oUITimesheetCode.setValueState("Error");
					oErrorArray.push(oUITimesheetCode);
				} else if (oTimesheetCodeArray.indexOf(sTimesheetCode,0) !== -1 && sSumHours > 0) {
					/* Duplicated Timesheet input */
					var bEditable = oUITimesheetCode.getEditable();
					if (bEditable) {
						oUITimesheetCode.setValueStateText(this.oBundle.getText("ZF_MSG008",sTimesheetCode));
						oUITimesheetCode.setValueState("Error");
						oErrorArray.push(oUITimesheetCode);
					} else {
						var oDupTSCode = oTimesheetUIArray[oTimesheetCodeArray.indexOf(sTimesheetCode,0)];
						var bDupEditable = oDupTSCode.getEditable();
						if (bDupEditable) {
							oDupTSCode.setValueStateText(this.oBundle.getText("ZF_MSG008",sTimesheetCode));
							oDupTSCode.setValueState("Error");
							oErrorArray.push(oDupTSCode);
						}
					}
				} else {
					oUITimesheetCode.setValueState("None");
					if (sSumHours > 0) {
						oTimesheetCodeArray.push(sTimesheetCode);
						oTimesheetUIArray.push(oUITimesheetCode);
					}
				}
				
				/* Necessary Approvercode input */
				if ((!sApproverCode || sApproverCode === "00000000") && sSumHours > 0 && oSettingInfoModel.getProperty("/0/ManageVisible") === true) {
					oUIApproverCode.setValueStateText(this.oBundle.getText("ZF_MSG001",this.oBundle.getText("ZF_MSGAPPROVER")));
					oUIApproverCode.setValueState("Error");
					oErrorArray.push(oUIApproverCode);
				} else {
					oUIApproverCode.setValueState("None");
				}
			}
			
			if(oErrorArray.length > 0){
				oErrorArray[0].focus();	
				return false;
			}
			
			if (oMessageArray.length > 0){
                this._processMessage(oMessageArray,sap.m.MessageBox.Icon.ERROR,oI18n.getText("ERROR"));
                return false;
            }
			
			return true;
		},		
		_checkWarningMessage: function() {
			"use strict";
			var oWorkingHours = this.getView().getModel("WorkingHours");
			var oTimesheetData = this.getView().getModel("TimesheetData").getData();
			var oWorkingHoursData = this.getView().getModel("WorkingHours").getData();
			var oWorkCalendar = this.getView().getModel("WorkCalendar");
			
			var oWarnMessageArray = [];
			var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "MM/dd"});
			for (var iDays = 0; iDays < 7; iDays++) {
				
				var sDayType = oWorkCalendar.getProperty("/" + iDays + "/DayType");
				var oCompensatingDay = oWorkingHours.getProperty("/" + iDays + "/CompensatingDay");
				
				if (oWorkingHours.getProperty("/" + iDays + "/FlgTarget") 
						&& sDayType === "03"
						&& !oCompensatingDay) {

					var sSumHours = Number(oWorkingHours.getProperty("/" + iDays + "/TodayWorkingHours"));
					var sRestHours = Number(oWorkingHours.getProperty("/" + iDays + "/Break1H")) + 
										Number(oWorkingHours.getProperty("/" + iDays + "/Break2H"));
					var oDate = this._getDay(this.dCurrentDate,iDays + 1);
					if (sSumHours > 6) {
						if (sSumHours > 8 && sRestHours < 1) {
							/* When working hours > 8 */
							oWarnMessageArray.push(this.oBundle.getText("ZF_MSG038") + "(" + oDateFormat.format(oDate) + ")");
						} else if (sRestHours < 0.75) {
							/* When working hours > 6 and working hours <= 8 */
							oWarnMessageArray.push(this.oBundle.getText("ZF_MSG037") + "(" + oDateFormat.format(oDate) + ")");
						}
					}
				}
			}
			return oWarnMessageArray;
		},
		/* Resend Button Press Processing */
		onResend: function() {
			"use strict";
			var oSelf = this;
			var oScreenModel = this.getView().getModel("ScreenModel");
			var sResendOpreationType = oScreenModel.getProperty("/Settinginfo/ResendOpreationType");
			var oChangeDateArray = oSelf._checkTargetDataOnSelected();
			/*var sMessage = oSelf.oBundle.getText("ZF_MSG033",oSelf.oBundle.getText("ZF_MSGPARA_APPLY"));*/
			var sMessage = oSelf.oBundle.getText("ZF_MSG024");
			var sSuccessMessage = oSelf.oBundle.getText("ZF_MSG025");
			var sChangeDateArrayMSG = oSelf.oBundle.getText("ZF_MSG057",[oChangeDateArray["Date"].join(","),oSelf.oBundle.getText("ZF_BTN_RESEND")]);
			oSelf._checkChangeDateProcess(oChangeDateArray,sResendOpreationType,sMessage,sSuccessMessage,sChangeDateArrayMSG);
		},
		/* Send Button Press Processing */
		onSend: function() {
			"use strict";
			var oSelf = this;
			var oScreenModel = this.getView().getModel("ScreenModel");
			var sSendOpreationType = oScreenModel.getProperty("/Settinginfo/SendOpreationType");
			var oChangeDateArray = oSelf._checkTargetDataOnSelected();
			var sMessage = oSelf.oBundle.getText("ZF_MSG022");
			var sSuccessMessage = oSelf.oBundle.getText("ZF_MSG023");
			var sChangeDateArrayMSG = oSelf.oBundle.getText("ZF_MSG057",[oChangeDateArray["Date"].join(","),oSelf.oBundle.getText("ZF_BTN_SEND")]);
			oSelf._checkChangeDateProcess(oChangeDateArray,sSendOpreationType,sMessage,sSuccessMessage,sChangeDateArrayMSG);

		},
		/* Delete Button Press Processing */
		onDelete: function() {
			"use strict";
			var oSelf = this;
			var oScreenModel = this.getView().getModel("ScreenModel");
			var sDeleteOpreationType = oScreenModel.getProperty("/Settinginfo/DeleteOpreationType");
			var oChangeDateArray = oSelf._checkTargetDataOnSelected();
			var sMessage = oSelf.oBundle.getText("ZF_MSG090");
			var sSuccessMessage = oSelf.oBundle.getText("ZF_MSG091");
			var sChangeDateArrayMSG = "";
			oSelf._checkChangeDateProcess(oChangeDateArray,sDeleteOpreationType,sMessage,sSuccessMessage,sChangeDateArrayMSG);

		},
		formatStatusText: function(aStatus) {
			"use strict";
			var sStatusText;
			if (aStatus !== "") {
				switch(aStatus) {
				case "10":
					/* When Status is Saved */
					sStatusText = this.oBundle.getText("ZF_SAVED");
					break;
				case "20":
					/* When Status is Processing */
					sStatusText = this.oBundle.getText("ZF_PROCESSING");
					break;
				case "30":
					/* When Status is Approved */
					sStatusText = this.oBundle.getText("ZF_APPROVED");
					break;
				case "40":
					/* When Status is Rejected */
					sStatusText = this.oBundle.getText("ZF_REJECTED");
					break;
				default:
					sStatusText = "";
					break;
				}
			} else {
				sStatusText = "";
			}
			return sStatusText;
		},
		_checkTimeInitial: function(aDateTime, aNextDayFlag) {
			"use strict";
			var iMsoffset = ((new Date).getTimezoneOffset())*60*1000;
			if (aDateTime) {
				var iTimes = aDateTime.getTime();
				if (typeof (aNextDayFlag) !== "undefined") {
					if (iTimes === iMsoffset && !aNextDayFlag) {
						return true;
					} else {
						return false;
					}
				} else if (iTimes === iMsoffset) {
					return true;
				} else {
					return false;
				}
			} else {
				return true;
			}
		},
		onProxyPress: function() {
			"use strict";
			var oSelf = this;
			var sPernr;
			if (!this._oDialogSubEntry) {
				this._oDialogSubEntry = sap.ui.xmlfragment(
						"sap.ZG001.timesheet.input.weekly.view.SubEntry",
						this);

				this.getView().addDependent(this._oDialogSubEntry);
			}
			
			var oInput = sap.ui.getCore().byId("myInput");
			
			jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(),
					this._oDialog);
			/* Open window for user to input proxy person number */
			this._oDialogSubEntry.open();
			oInput.setValueState("None");
			oInput.getBinding("value").refresh(true);
			
			if (this.sSourceScreen === "1"){
				oSelf.oDataManager.getRootPernr(function(oResults){
					sPernr = oResults[0]["Pernr"];
					oSelf.oDataManager.getSubEntry(sPernr, function(aData) {
						oSelf.getView().getModel("SubEntry").setData(aData,false);
					});
				});
			}
			this._oDialogSubEntry.attachAfterClose(function(){
				if(!oSelf.sPernr){
					/* Go back to Menu Screen */
					oSelf._backToMenu();
				}
			});

			oInput.addEventDelegate({
				onAfterRendering: function() {
					$(".ZZNumberOnly").keypress(function(event) {
						var keyCode = event.which;
						if (keyCode === 46 || (keyCode >= 48 && keyCode <=57)) 
							return true;
						else
							return false;
					});
					$(".ZZNumberOnlyN").keypress(function(event) {
						var keyCode = event.which;
						if (keyCode >= 48 && keyCode <=57)
							return true;
						else
							return false;
					}).bind("paste",function(aEvent) {
						var sValue = "";
						if (window.clipboardData && window.clipboardData.getData) { // IE
							sValue = window.clipboardData.getData("Text");
							window.clipboardData.setData("Text",sValue.replace(/[^\d]/g,''));
						} else {
							sValue = aEvent.originalEvent.clipboardData.getData("text/plain");
							aEvent.originalEvent.clipboardData.setData("text/plain",sValue.replace(/[^\d]/g,''));
						}
					});
				}
			});
			
		},
		handleSubEntryOKPress: function(aControlEvent) {
			"use strict";
			var sPernr = this.getView().getModel("ScreenModel").getProperty("/Settinginfo/ProxyPernr");
			var oInput = sap.ui.getCore().byId("myInput");
			var bError = false;
			
			if (oInput.getValueState() === "Error") {
				bError = true;
				oInput.focus();	
			} else {
				if (this.sSourceScreen === "1"){
					this.sPernr = sap.ui.getCore().byId("myProxy").getSelectedKey();
				} else if (this.sSourceScreen === "2") {
					if (sPernr !== this.sPernr && sPernr !== "" && sPernr) {
						var rNumericRegex = /^[0-9]*$/;
						if (!sPernr.match(rNumericRegex)) {
							oInput.setValueStateText(this.oBundle.getText("ZF_MSG000_NUMERIC"));
							oInput.setValueState("Error");
							bError = true;
							oInput.focus();	
						} else {
							/* Set input proxy pernr to Model , close the window */
							this.sPernr = sPernr;
						}
					}
				}			
			}
			
			if ( this.sPernr && !bError) {
				this.oRetrievePernrDeferred.resolve();
				this.bFirst = true;
				this._updateModel();
				this._oDialogSubEntry.close();
			}
		},
		handleSubEntryCancelPress: function(aControlEvent) {
			"use strict";
			this.getView().getModel("ScreenModel").setProperty("/Settinginfo/ProxyPernr",this.sPernr);
			this._oDialogSubEntry.close();
		},
		formatValueTypeText: function(aValueType) {
			"use strict";
			if (aValueType !== "") {
				return this.oBundle.getText("ZF_" + aValueType);
			} else {
				return "";
			}
		},
		onTimesheetCode: function(aControlEvent) {
			"use strict";
			var oParent = aControlEvent.getSource().getParent().getParent().getParent().getParent().getParent();
			var sItemPath = oParent.getObjectBinding("TimesheetData").sPath + "/";
			var oTimesheetDataModel = this.getView().getModel("TimesheetData");
			var sValue = aControlEvent.getSource().getValue();
			var sTimesheetCode,
				sTimesheetSubcode;
			if (sValue.length <= 10) {
				sTimesheetCode = sValue.substr(0,sValue.length);
				sTimesheetSubcode = "";
			} else if (sValue.length > 10 && sValue.length <= 11) {
				sTimesheetCode = sValue.substr(0,10);
				sTimesheetSubcode = "";
			} else if (sValue.length > 11 && sValue.length <= 13) {
				sTimesheetCode = sValue.substr(0,10);
				sTimesheetSubcode = sValue.substr(11,2);
			} 
			oTimesheetDataModel.setProperty(sItemPath + "TimesheetCd", sTimesheetCode);
			oTimesheetDataModel.setProperty(sItemPath + "Subcode",sTimesheetSubcode);
		},
		/* for Screen display Datetime value conversion */
		_cvtDateToScreen : function(aDbDate){
			"use strict";
			return new Date(aDbDate.getUTCFullYear(), aDbDate.getUTCMonth(), aDbDate.getUTCDate(), 0, 0, 0);
		},
		/* for DB update Datetime value conversion */
		_cvtDateToDb : function(aScreenDate){
			"use strict";
			return new Date(Date.UTC(aScreenDate.getFullYear(), aScreenDate.getMonth(), aScreenDate.getDate(), 0, 0, 0));
		},
		/* Handle Search Help for Approver */
		handleApproverSearchHelp: function(aControlEvent) {
			"use strict";
			var oItem = aControlEvent.getSource();
			var sBindingPath = oItem.getBindingContext("TimesheetData").getPath();
			var oTimesheetModel = this.getView().getModel("TimesheetData");
			ApproverHelp.open().then(function(aRet) {
				if (aRet) {
					/* Set selected Approver cd from value help window to approver cd in model */
					/* Set selected Approver Name from value help window to approver name in model */
					oTimesheetModel.setProperty(sBindingPath + "/ApproverCd",aRet["Pernr"]);
					oTimesheetModel.setProperty(sBindingPath + "/ApproverName",aRet["Ename"]);
					oItem.setValueState("None");
					oItem.getBinding("value").refresh(true);
				}
			});
		},
		/* Handle Search Help for Client */
		handleClientSearchHelp: function(aControlEvent) {
			"use strict";
			var oItem = aControlEvent.getSource();
			var sBindingPath = oItem.getBindingContext("TimesheetData").getPath();
			var oTimesheetModel = this.getView().getModel("TimesheetData");
			var sCurrentLocale = sap.ui.getCore().getConfiguration().getLanguage();
			ClientHelp.open().then(function(aRet) {
				if (aRet) {
					/* Set selected Client cd from value help window to client cd in model */
					/* Set selected Client Name from value help window to client name in model */
					oTimesheetModel.setProperty(sBindingPath + "/ClientCd",aRet["ZclntCd"]);
					if (sCurrentLocale === "ja"){
						oTimesheetModel.setProperty(sBindingPath + "/ClientName",aRet["ZclntoNm"]);
					}
					else{
						oTimesheetModel.setProperty(sBindingPath + "/ClientName",aRet["ZclnteNm"]);
					}
					oItem.setValueState("None");
					oItem.getBinding("value").refresh(true);
				}
			});
		},
		/* Handle Search Help for Timesheet */
		handleTSSearchHelp: function(aControlEvent) {
			"use strict";
			var oSelf = this;
			var oTSItem = aControlEvent.getSource();
			var sBindingPath = oTSItem.getBindingContext("TimesheetData").getPath();
			var oClientItem = this._getNeighborClientInput(oTSItem);
			var oTimesheetModel = this.getView().getModel("TimesheetData");
			TSHelp.open().then(function(aRet) {
				if (aRet) {
					/* Set selected TS cd from value help window to TS cd in model */
					/* Set selected TS Name from value help window to TS Name in model */
					/* Set selected TS Sub code from value help window to TS Sub code in model */
					/* Set selected Client cd from value help window to client cd in model */
					/* Set selected Client Name from value help window to client name in model */
					oTimesheetModel.setProperty(sBindingPath + "/TimesheetCd",aRet["ZtsMaCd"]);
					oTimesheetModel.setProperty(sBindingPath + "/TimesheetName",aRet["ZtsTx"]);
					oTimesheetModel.setProperty(sBindingPath + "/Subcode",aRet["ZtsSbCd"]);
					oTimesheetModel.setProperty(sBindingPath + "/ClientCd",aRet["ZclntCd"]);
					oTimesheetModel.setProperty(sBindingPath + "/ClientName",aRet["ZclntoNm"]);
					oTSItem.setValueState("None");
					oTSItem.getBinding("value").refresh(true);
					oClientItem.setValueState("None");
					oClientItem.getBinding("value").refresh(true);
				}
			});
		},
		_getNeighborClientInput: function(aTSInput) {
			
			var oClientInput = aTSInput.getParent()		/* Get the Vbox which is the TS Input belong to */
										.getParent()	/* Get the blocklayoutcell which is the TS Input belong to */
										.getParent()	/* Get the blocklayoutrow which is the TS Input belong to */
										.getAggregation("content")[0]		/* Get the blocklayoutcell which is the Client Input belong to */
										.getAggregation("content")[1]		/* Get the Vbox which is the Client Input belong to */
										.getAggregation("items")[0];		/* Get the Client Input item */

			return oClientInput;
		},
		/* Handle Search Help for Employee */
		handleEmployeeSearchHelp: function(aControlEvent) {
			var oScreenModel = this.getView().getModel("ScreenModel");
			var oItem = aControlEvent.getSource();
			EmployeeHelp.open().then(function(aRet) {
				if (aRet) {
					/* Set selected employee cd from value help window to proxy pernr input field */
					oScreenModel.setProperty("/Settinginfo/ProxyPernr",aRet["Pernr"]);
					oScreenModel.setProperty("/Settinginfo/ProxyPernrName",aRet["Ename"]);
					oItem.setValueState("None");
					oItem.getBinding("value").refresh(true);
				}
			});
		},
		
		onNavToPortal: function(aControlEvent) {
			var oParams = {};
			var oTarget = {
					semanticObject : "TimeEntry",
					action : "tspportal",
			};

			if (this.sSourceScreen === "1" || this.sSourceScreen === "2") {
				oParams = {
						pernr: this.sPernr
				};
			}
			var sUrl = sap.ushell.Container.getService("CrossApplicationNavigation").hrefForExternal({
				target : oTarget,
				params : oParams
			});
			window.open([window.location.pathname, sUrl].join(""));
		},

		onProxyChange: function(aControlEvent) {
			"use strict";
			var oScreenModel = this.getView().getModel("ScreenModel");
			var oValue = aControlEvent.getSource().getValue();
			oScreenModel.setProperty("/Settinginfo/ProxyPernr",oValue);
			oScreenModel.setProperty("/Settinginfo/ProxyPernrName","");
		},
		
		/* Calculate Timesheet Hours */
		_calculateTotalHours: function() {
			"use strict";
			var oSubTotal = [0,0,0,0,0,0,0];
			var fTotal = 0;
			var oTimesheetData = this.getView().getModel("TimesheetData").getData();
			/* Calculate timesheet hours daily */
			for(var iCount = 0; iCount < oTimesheetData.length; iCount++) {
				for(var iDays = 0; iDays < 7; iDays++) {
					oSubTotal[iDays] = Number(oTimesheetData[iCount].dayHours[iDays]["WeekHours"]) + Number(oSubTotal[iDays]);
					fTotal = Number(fTotal) + Number(oTimesheetData[iCount].dayHours[iDays]["WeekHours"]);
				}
			}
			var oSubTotalString = [];
			/* Calculate timesheet hours weekly */
			for(var iDaysSum = 0; iDaysSum < 7; iDaysSum++) {
				oSubTotalString.push(oSubTotal[iDaysSum].toFixed(2).toString());
			}
			
			/* Set calculated timesheet hours to the model*/
			this.getView().getModel("ScreenModel").setProperty("/Settinginfo/Subtotal",oSubTotalString);
			this.getView().getModel("ScreenModel").setProperty("/Settinginfo/Total",fTotal.toFixed(2).toString());
		},

		/* Calculate OverTime Hours */
		_calculateLegalOvertime: function(aId) {
			var oWorkingHoursDisplayModel = this.getView().getModel("DisplayWorkingHours");
			var oWorkingHoursModel = this.getView().getModel("WorkingHours");
			var oWorkCalendarModel = this.getView().getModel("WorkCalendar");
			var oDeductionTSHour = this.getView().getModel("ScreenModel").getProperty("/Settinginfo/DeductionTSHour");

			var sTodayWorkingHours = "";
			var sLegalOvertime = "";
			var fLegalOvertime = 0;
			var fExpectWorkingHours = 0;

			/* Get Standard WorkingTime Daily */
			var fWorkingTimeDaily = Number(oWorkingHoursDisplayModel.getProperty("/0/WorkingTimeDaily"));
			
			for (var iCount = 0; iCount < 7; iCount++) {
					fExpectWorkingHours = Number( oWorkingHoursModel.getProperty("/" + iCount + "/TimeHoliday1H") )
											+ Number( oWorkingHoursModel.getProperty("/" + iCount + "/LateLeaveEarly1H") )
											+ Number( oWorkingHoursModel.getProperty("/" + iCount + "/ChildRearing1H") )
											+ Number( oWorkingHoursModel.getProperty("/" + iCount + "/ChildNursing1H") )
											+ Number( oWorkingHoursModel.getProperty("/" + iCount + "/Care1H") );
				
				var fActualWorkingTimeDaily = Number(oWorkingHoursDisplayModel.getProperty("/" + iCount + "/TodayWorkingHours"));
				oWorkingHoursDisplayModel.setProperty("/" + iCount + "/TodayWorkingHours",(fActualWorkingTimeDaily).toFixed(2));
				
				/* Get Sub day */
				var iSubDay = oWorkCalendarModel.getProperty("/" + iCount + "/SubDay");
				var iSubWorkingDay = oWorkCalendarModel.getProperty("/" + iCount + "/SubWorkingDay");
				
				/* When working day */
				if ( iSubWorkingDay === "TRUE" ){					
					if (fActualWorkingTimeDaily > fWorkingTimeDaily) {
						fLegalOvertime = (Number(fActualWorkingTimeDaily) - Number(fWorkingTimeDaily)).toFixed(2) - Number(oDeductionTSHour[iCount]) - Number(fExpectWorkingHours);	
						fLegalOvertime = fLegalOvertime < 0 ? Number(0) : fLegalOvertime;
						oWorkingHoursDisplayModel.setProperty("/" + iCount + "/LegalOvertime", fLegalOvertime.toFixed(2));
					} else {
						oWorkingHoursDisplayModel.setProperty("/" + iCount + "/LegalOvertime",(Number(0)).toFixed(2));
					}
				}else{
					/* Sunday */
					if ( iSubDay === "7"){
						oWorkingHoursDisplayModel.setProperty("/" + iCount + "/LegalOvertime",(Number(0)).toFixed(2));					
					/* Saturday or holiday */	
					}else{
						fLegalOvertime = (Number(fActualWorkingTimeDaily) ).toFixed(2) - Number(oDeductionTSHour[iCount]) - Number(fExpectWorkingHours);
						fLegalOvertime = fLegalOvertime < 0 ? Number(0) : fLegalOvertime;
						oWorkingHoursDisplayModel.setProperty("/" + iCount + "/LegalOvertime", fLegalOvertime.toFixed(2));
					}
				}
				
				/* When Current Modify Day, Modify WorkingHours Model (For Update) */
				if (aId === "TSCode" || iCount == Number(aId.substr(1,1))) {
					sTodayWorkingHours = oWorkingHoursDisplayModel.getProperty("/" + iCount + "/TodayWorkingHours");
					sLegalOvertime = oWorkingHoursDisplayModel.getProperty("/" + iCount + "/LegalOvertime");
					oWorkingHoursModel.setProperty("/" + iCount + "/TodayWorkingHours",sTodayWorkingHours);
					oWorkingHoursModel.setProperty("/" + iCount + "/LegalOvertime",sLegalOvertime);
				}
			}
				
		},
		
//      legal over time (2017/04/26)		
//		/* Calculate OverTime Hours */
//		_calculateLegalOvertime: function(aId, aOldDeductionTSHour, aNewDeductionTSHour) {
//			var oWorkingHoursDisplayModel = this.getView().getModel("DisplayWorkingHours");
//			var oWorkingHoursModel = this.getView().getModel("WorkingHours");
//			var oWorkCalendarModel = this.getView().getModel("WorkCalendar");
//			
//			var sTodayWorkingHours = "";
//			var sLegalOvertime = "";
//
//			/* Get Standard WorkingTime Daily & Weekly */
//			var fWorkingTimeDaily = Number(oWorkingHoursDisplayModel.getProperty("/0/WorkingTimeDaily"));
//			var fWorkingTimeWeekly = Number(oWorkingHoursDisplayModel.getProperty("/0/WorkingTimeWeekly"));
//			
//			/* Get Actual WorkingTime Weekly */
//			var fActualWorkingTimeWeekly = 0;
//			
//			var oSubDayArray = this._getSortedSubDay(oWorkingHoursDisplayModel.getData());
//			
//			for (var iCount = 0; iCount < 7; iCount++) {
//				
//				/* Get Sub day */
//				var iSubDay = oSubDayArray[iCount].SubDay;
//				var iDay = oSubDayArray[iCount].Day;
//					
//				var fActualWorkingTimeDaily = aOldDeductionTSHour[iDay] - aNewDeductionTSHour[iDay] + Number(oWorkingHoursDisplayModel.getProperty("/" + iDay + "/TodayWorkingHours"));
//				
//				/* Get Actual WorkingTime Weekly Beside today */
//				var fLeftWorkingHoursWeekly = fWorkingTimeWeekly - fActualWorkingTimeWeekly;
//				if (fLeftWorkingHoursWeekly < 0) {
//					fLeftWorkingHoursWeekly = 0;
//				}
//				
//				oWorkingHoursDisplayModel.setProperty("/" + iDay + "/TodayWorkingHours",(fActualWorkingTimeDaily).toFixed(2));
//				
//				/* Left hours is greate than daily working hour (8) */
//				if (fLeftWorkingHoursWeekly > fWorkingTimeDaily) {
//
//					/* Set actual Daily Working Hours greater than daily standard working hour (8) */
//					/* Set actual Daily Overtime Hours as actual Daily Working Hours - daily working hour (8) */
//					if (fActualWorkingTimeDaily > fWorkingTimeDaily) {
//						oWorkingHoursDisplayModel.setProperty("/" + iDay + "/LegalOvertime",(Number(fActualWorkingTimeDaily) - Number(fWorkingTimeDaily)).toFixed(2));
//					} else {
//						oWorkingHoursDisplayModel.setProperty("/" + iDay + "/LegalOvertime",(Number(0)).toFixed(2));
//					}
//				} else if (fActualWorkingTimeDaily > fLeftWorkingHoursWeekly) {
//					oWorkingHoursDisplayModel.setProperty("/" + iDay + "/LegalOvertime",(Number(fActualWorkingTimeDaily) - Number(fLeftWorkingHoursWeekly)).toFixed(2));
//				} else {
//					oWorkingHoursDisplayModel.setProperty("/" + iDay + "/LegalOvertime",(Number(0)).toFixed(2));
//				}
//
//				fActualWorkingTimeWeekly = fActualWorkingTimeWeekly + 
//												( Number(oWorkingHoursDisplayModel.getProperty("/" + iDay + "/TodayWorkingHours")) > fWorkingTimeDaily ? fWorkingTimeDaily: Number(oWorkingHoursDisplayModel.getProperty("/" + iDay + "/TodayWorkingHours")));
//				
//				/* When Saturday */
//				if (iSubDay === 5) {
//					if (fLeftWorkingHoursWeekly > fActualWorkingTimeDaily) {
//						oWorkingHoursDisplayModel.setProperty("/" + iDay + "/LegalOvertime",(Number(0)).toFixed(2));
//					} else {
//						oWorkingHoursDisplayModel.setProperty("/" + iDay + "/LegalOvertime",(Number(fActualWorkingTimeDaily) - Number(fLeftWorkingHoursWeekly)).toFixed(2));
//					}
//				}
//				
//				/* When Sunday */
//				if (iSubDay === 6) {
//					oWorkingHoursDisplayModel.setProperty("/" + iDay + "/LegalOvertime",(Number(0)).toFixed(2));
//				}
//
//				/* When Current Modify Day, Modify WorkingHours Model (For Update) */
//				if (aId === "TSCode" || iDay == Number(aId.substr(1,1))) {
//					sTodayWorkingHours = oWorkingHoursDisplayModel.getProperty("/" + iDay + "/TodayWorkingHours");
//					sLegalOvertime = oWorkingHoursDisplayModel.getProperty("/" + iDay + "/LegalOvertime");
//					oWorkingHoursModel.setProperty("/" + iDay + "/TodayWorkingHours",sTodayWorkingHours);
//					oWorkingHoursModel.setProperty("/" + iDay + "/LegalOvertime",sLegalOvertime);
//				}
//			}
//				
//		},
		
	    onChangeCode : function(aEvent){
	    	"use strict";			
	    			
	    	var oSelf = this;
			/* Get Changed Element */
            var sId = aEvent.getSource().getCustomData()[0].getValue();
            var sState = aEvent.getSource().getValueState();
            var oInput = aEvent.getSource();
            /* If Error, do not get text */
            if(sState === "Error"){
            	return;
            }
            
            if(sId !== "ProxyPernr"){
            	var sBindingPath = aEvent.getSource().getBindingContext("TimesheetData").getPath();
    			var oTimesheetModel = this.getView().getModel("TimesheetData");
            }

            switch(sId) {
				case "ClientCode":

					var sClntCd = jQuery.trim(oTimesheetModel.getProperty(sBindingPath+"/ClientCd"));
					if(sClntCd && sClntCd!== ""){
						oSelf.oDataManager.getClientText(sClntCd,function(aData){
							oTimesheetModel.setProperty(sBindingPath+"/ClientName",aData["ClientNameOutput"]);
						});
					} else {
						oTimesheetModel.setProperty(sBindingPath+"/ClientName","");
					}
					break;
					
				case "TSCode":
					var sTsMnCd = jQuery.trim(oTimesheetModel.getProperty(sBindingPath+"/TimesheetCd"));
					var sTsSbCd = oTimesheetModel.getProperty(sBindingPath+"/Subcode");
					var oClientInput = oInput.getParent()
										.getParent()	/* Get the blocklayoutcell which is the TS Input belong to */
										.getParent()	/* Get the blocklayoutrow which is the TS Input belong to */
										.getAggregation("content")[0]		/* Get the blocklayoutcell which is the Client Input belong to */
										.getAggregation("content")[1]		/* Get the Vbox which is the Client Input belong to */
										.getAggregation("items")[0];		/* Get the Client Input item */
					if(sTsMnCd && sTsMnCd!== ""){
						oSelf.oDataManager.getTimesheetCodeText(sTsMnCd,sTsSbCd,function(aData){
							oTimesheetModel.setProperty(sBindingPath+"/TimesheetName",aData["TSTextOutput"]);
							oTimesheetModel.setProperty(sBindingPath+"/ClientCd",aData["ClntCd"]);
							oTimesheetModel.setProperty(sBindingPath+"/ClientName",aData["ClientNameOutput"]);
						});
					} else {
						oTimesheetModel.setProperty(sBindingPath+"/TimesheetName","");
						oTimesheetModel.setProperty(sBindingPath+"/ClientCd","");
						oTimesheetModel.setProperty(sBindingPath+"/ClientName","");
					}

					oClientInput.setValueState("None");
					oClientInput.getBinding("value").refresh(true);
					
					oSelf.onCalculateTotalHours(aEvent);
					break;
					
				case "ApproverCode":
					var sApprover = oTimesheetModel.getProperty(sBindingPath+"/ApproverCd");
					if(sApprover && sApprover !== "00000000"){
						oSelf.oDataManager.getEmployeeName(sApprover,function(aData){
							oTimesheetModel.setProperty(sBindingPath+"/ApproverName",aData["ApproverNameO"]);
						});
					} else {
						oTimesheetModel.setProperty(sBindingPath+"/ApproverName","");
					}
					break;
					
				case "ProxyPernr":
					var sPernr = oSelf.getView().getModel("ScreenModel").getProperty("/Settinginfo/ProxyPernr");
					if (sPernr && sPernr !== "00000000") {
						oSelf.oDataManager.getEmployeeName(sPernr,function(aData){
							oSelf.getView().getModel("ScreenModel").setProperty("/Settinginfo/ProxyPernrName",aData["ApproverNameO"]);
						});
					} else {
						oSelf.getView().getModel("ScreenModel").setProperty("/Settinginfo/ProxyPernrName","");
					}
					break;
					
				default :
					break;
			}
	    },
	    
		WorkingTime : sap.ui.model.odata.type.Time.extend("WorkingTime", {
			parseValue: function (aValue, aSourceType) {
				var oInitialTime = {
						__edmType : "Edm.Time",
						ms : 0
				};
				var oTime = sap.ui.model.odata.type.Time.prototype.parseValue(aValue, aSourceType);
				if (!oTime) {
					/* When WorkingTime cd is null, set it as 00:00 */
					return oInitialTime;
				} else {
					/* When Approver cd is not null, display it as original */
					return oTime;
				}
	        }
		}),
		ZTSCodeType  : sap.ui.model.CompositeType.extend("ZTSCodeType", {
			formatValue: function (aValue) {
				if (typeof (aValue) === "undefined") {
					return "";
				} else {
					if (aValue[0]) {
						if (aValue[1]) {
							return aValue[0] + " " + aValue[1];
						} else {
							return aValue[0];
						}
					} else {
						return "";
					}
				}
			},
			parseValue: function (aValue) {
				var iPos = aValue.lastIndexOf(" ");
				var sInitTSSub = "";
				var sTSSub = sInitTSSub;
				var sTSNo = "";
				if (iPos < 0) {
					sTSSub = sInitTSSub;
					sTSNo = aValue;
				} else {
					sTSNo = aValue.slice(0,iPos);
					sTSSub = aValue.slice(iPos + 1,aValue.length);
					if (sTSSub === "") {
						sTSSub = sInitTSSub;
					}
				}
				return [sTSNo,sTSSub];
			},
			validateValue: function (aValue) {
				var oStringType = new sap.ui.model.odata.type.String({},
						{
							maxLength : 10
						});
				try {
					oStringType.validateValue(aValue[0]);
				} catch (oException) {
					throw new ValidateException("ZF_MSGZ01");
				}

				var oIntegerType = new sap.ui.model.type.Integer(
						{
							pattern : "00"
						},
						{
							maximum : 99,
							minimum : 0
						});
				
				try {
					oIntegerType.validateValue(aValue[1]);
				} catch (oException) {
					throw new ValidateException("ZF_MSGZ02");
				}
			}
		}),
		ZTypCodeText  : sap.ui.model.CompositeType.extend("ZTypCodeText", {
			formatValue: function (aValue) {
				if (typeof (aValue) === "undefined") {
					return "";
				} else {
					if (aValue[0]) {
						if (aValue[1]) {
							return aValue[1] + " (" + aValue[0] + ")";
						} else {
							return aValue[0];
						}
					} else {
						return "";
					}
				}
			},
			parseValue: function (aValue) {
				var iPos1 = aValue.lastIndexOf("(")
				var iPos2 = aValue.lastIndexOf(")")
				var sName = "";
				var sNumber = "";
				if (iPos1 < 0 || iPos2 < 0) {
					sName = "";
					sNumber = aValue;
				} else {
					if (iPos1 === 0) {
						sName = "";
					} else {
						sName = aValue.slice(0,iPos1);
					}
					sNumber = aValue.slice(iPos1 + 1,iPos2);
				}
				return [sNumber,sName];
			},
            validateValue: function (aValue) {
            }
		}),		
		ZInteger : sap.ui.model.SimpleType.extend("ZInteger", {
			constructor : function () {
				this.oInterger = new sap.ui.model.type.Integer(arguments[0],arguments[1]);
			},
			formatValue: function (aValue, aInternalType) {
				return this.oInterger.formatValue(aValue, aInternalType);
			},
			parseValue: function (aValue, aSourceType) {
				var sValue = aValue;
				if (aValue === null || aValue === "") {
					sValue = "00";
				}
				var iResult = this.oInterger.parseValue(sValue, aSourceType);

				return iResult;
	        },
	        validateValue: function (aValue) {
	        	return this.oInterger.validateValue(aValue);
	        }
		}),

//      legal over time logic (2017/04/26)		
//		/* get sorted sub day array */
//		_getSortedSubDay : function( aData ){
//			var oResultArray = [];
//			var oWorkCalendarModel = this.getView().getModel("WorkCalendar");
//			
//			for (var i = 0; i < 7; i++) {
//				/* Get Sub day */
//				var sSubDay = oWorkCalendarModel.getProperty( "/" + i + "/SubDay" ) - 1;
//				
//				oResultArray.push({
//					"Day" : i,
//					"SubDay" : sSubDay
//				})		
//			}
//			oResultArray.sort( function(a,b){
//				var iKeyA =  a.SubDay;
//				var iKeyB =  b.SubDay;
//				
//				if(iKeyA < iKeyB) return -1;
//				if(iKeyA > iKeyB) return 1;
//				return 0;
//			})
//			
//			return oResultArray;
//		}
	});
});
