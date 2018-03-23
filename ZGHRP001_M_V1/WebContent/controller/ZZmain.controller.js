jQuery.sap.require("sap.ui.model.odata.datajs");
jQuery.sap.require("sap.ui.base.EventProvider");
jQuery.sap.require("sap.ui.core.mvc.Controller");
jQuery.sap.require("sap.m.MessageToast");
jQuery.sap.require("sap.m.MessageBox");
jQuery.sap.require("sap.ZG001.timesheet.input.dailyDemo.util.Formatter");
jQuery.sap.require("sap.ZG001.timesheet.input.dailyDemo.util.DataManager");
sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ZG001/timesheet/valuehelp/util/ZHE_APPROVER",
	"sap/ZG001/timesheet/valuehelp/util/ZHE_CLIENTCD",
	"sap/ZG001/timesheet/valuehelp/util/ZHE_TSCD",
	"sap/ZG001/timesheet/valuehelp/util/ZHE_EMPLOYEE"
], function(Controller, ApproverHelp, ClientHelp, TSHelp, EmployeeHelp) {
	"use strict";
	return Controller.extend("sap.ZG001.timesheet.input.dailyDemo.controller.ZZmain", {
		onInit : function(oEvent) {
			"use strict";
			var CalendarDateInterval = new sap.ui.unified.CalendarDateInterval(this.getView().createId("CalendarDateInterval"),{
				days: 7,
				width: "100%",
				select: $.proxy(this.onTapOnDate,this),
				startDateChange: $.proxy(this.onStartDateChanged,this)
			},this.getView()); 
			if (sap.ui.Device.system.phone) {
				var scroll = this.getView().byId("scroller").insertContent(CalendarDateInterval,0);
			} else {
				var FixFlex = this.getView().byId("FixFlex").addFixContent(CalendarDateInterval);
			} 
			
			var dSystemDate = new Date();
			this.oBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();
			this.oDataModel = this.getOwnerComponent().getModel();
			if (!this.oDataManager) {
				this.oDataManager = new sap.ZG001.timesheet.input.dailyDemo.DataManager(this.oDataModel,this.oBundle);
			}

			/* Initialize */
			this.oSpecialDates = {};
			this.oInput = {};
			this.oDeleteItem = [];
			this.oEditFlag = {};
			this.oRetrievePernrDeferred = new jQuery.Deferred();
			this.fieldCount = 0;
			this.aFormElements = [];
			
			/* Current Date (Date Type) */
			this.dCurrentDate = dSystemDate;
			/* Calendar Start Date */
			this.dBegda = this._getDay(this.dCurrentDate,1);
			/* Calendar End Date */
			this.dEndda = this._getDay(this.dBegda,7);
			/* Display Mode */
			this.bMode = false;
			/* Current Date (YYYYMMDD Format) */
			this.sDate = this._changeDate(this.dCurrentDate);
			/* Normal or Proxy or Manager Proxy */
			this.sSourceScreenMode = "0";
			/* Set Deduction Hours */
			this.nOldDeductionTsCd = [];
			/* Set Calendar Start Date */
			this.getView().byId("CalendarDateInterval").setStartDate(this.dBegda);
			/* Set Current Date as Selected Date */
			this.getView().byId("CalendarDateInterval").addSelectedDate(new sap.ui.unified.DateTypeRange({
				startDate : this.dCurrentDate
			}));
			/* First Time */
			this.bFirst = true;
			/* Initialize EditFlag */
			for(var i = 0; i < 7; i++){
				this.oEditFlag[this._changeDate(this._getDay(this.dBegda,i+1))] = {
						"WorkingHours" : "",
						"TimesheetData" : ""
				};
			}
			/*Initialize ScreenModel*/
			var oScreenModel = new sap.ui.model.json.JSONModel({
				"step" : 15,
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
				"SendOpreationType" : "1",
				"ResendOpreationType" : "2",
				"SaveOpreationType" : "0",
				"ProxyVisible" : false,
				"ProxyPernr" : "",
				"ProxyPernrName": "",
				"WorkingHoursVisible":true,
				"RestTime1Visible": false,
				"TimeHoliday1Visible": false,
				"LateLeaveEarly1Visible": false,
				"TimeHoliday1BtnVis":false
			},false);
			this.getView().setModel(oScreenModel,"screenModel");
			
			/* Set Lengend */
			this.getView().byId("LEGEND").removeAggregation("standardItems",2);
			this.getView().byId("LEGEND").removeAggregation("standardItems",2);
			this.getView().byId("LEGEND").getAggregation("standardItems")[1].setText(this.oBundle.getText("ZF_CALDSELECTED"));

			var oSelf = this;
			
			/* Model for WorkingHours */	
			var oWorkingHours = new sap.ui.model.json.JSONModel();
			this.getView().setModel(oWorkingHours, "WorkingHours");
			this.oInitWorkHours = {};
			
			/* Model for TimesheetData */
			var oTimesheetData = new sap.ui.model.json.JSONModel();
			this.getView().setModel(oTimesheetData,"TimesheetData");
			this.oInitTimesheetData = {};

			/* Initialize TimesheetData */
			this.oTSData = {};
			this.oTSData[this.sDate] = {
					"today":[{
						"ClientCode" : "",
						"ClientName" : "",
						"TimesheetMainCode" : "",
						"TimsheetName" : "",
						"LandCode" : "",
						"LandName" : "",
						"RegioCode" : "",
						"RegioName" : "",
						"CityCode" : "",
						"CityName" : "",
						"Appointapp" : "",
						"ApproverName" : "",
						"hours" : "",
						"Status" : ""
					}]
			};						
			
			this.getView().getModel("TimesheetData").setData(this.oTSData,false);	
			this.getView().byId("myTabContainer").bindObject({
				path : "/" + oSelf.sDate,
				model : "TimesheetData"
			});
			
			/* Model for Calendar */
			var oCalendar = new sap.ui.model.json.JSONModel();
			this.getView().setModel(oCalendar,"Calendar");
			this.oCalendar = {};			
			
			/* Model for MonthlyWorkingTime */
			var oMonthlyWorkingTime = new sap.ui.model.json.JSONModel();
			this.getView().setModel(oMonthlyWorkingTime,"MonthlyWorkingTime");
			
			/* Model for MonthDetailInfo */
			var oMonthDetailInfo = new sap.ui.model.json.JSONModel();
			this.getView().setModel(oMonthDetailInfo,"MonthDetailInfo");
			
			/* Model for SettingInfo */
			var oSettingInfo = new sap.ui.model.json.JSONModel();
			this.getView().setModel(oSettingInfo,"SettingInfo");
			
			/* Model for SubEntry */
			var oSubEntry = new sap.ui.model.json.JSONModel();
			this.getView().setModel(oSubEntry,"SubEntry");
			
			/* Model for FormElements */
			var oFormElements = new sap.ui.model.json.JSONModel();
			this.getView().setModel(oFormElements, "FormElements");
			this.getView().getModel("FormElements").setData(this.aFormElements);
			
			this.getView().byId("iconTab").setSelectedKey("WorkingHours");
			
			/* attach handlers for validation errors */
			sap.ui.getCore().attachValidationError(function (aEvent) {
				var oControl = aEvent.getParameter("element");
				var sMsg = aEvent.getParameter("message");
				if (oControl && oControl.setValueState) {
					oControl.setValueState("Error");
					oControl.setValueStateText(sMsg);
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
		},
		
		onAfterRendering: function() {
			"use strict";
			var oSelf = this;
			var oDateValidateDeferred = new jQuery.Deferred();
			var oI18n = oSelf.getOwnerComponent().getModel("i18n").getResourceBundle();
			if (!this.sPernr) {
				try {
					/*Get pernr from the cross app nav*/
					var oStartUpParameters = this.getOwnerComponent().getComponentData().startupParameters;
					this.sSourceScreenMode = oStartUpParameters.ProxyType[0];
					if (this.sSourceScreenMode === "1" || this.sSourceScreenMode === "2") {
						this.onProxyPress();
						this.getView().getModel("screenModel").setProperty("/ProxyVisible",true);
						this.getView().getModel("screenModel").setProperty("/ProxyType",this.sSourceScreenMode);
						jQuery.when(this.oRetrievePernrDeferred).then(function(){
							try {
								/*Get date from the cross app nav*/
								var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyyMMdd"});
								var sDate = oStartUpParameters.date[0];
					            var dDate = oDateFormat.parse(sDate);
					            oSelf.dCurrentDate = dDate;
					            oSelf.sDate = oSelf._changeDate(oSelf.dCurrentDate);
								oSelf.dBegda = oSelf._getDay(oSelf.dCurrentDate,1);
								oSelf.dEndda = oSelf._getDay(oSelf.dBegda,7);
								if (oStartUpParameters.mode[0] === "D") {
									oSelf.bMode = true;
									oSelf.getView().getModel("SettingInfo").setProperty("/WorkingHoursEditable",false);
								} else if (oStartUpParameters.mode[0] === "E") {
									oSelf.bMode = false;
									oSelf.getView().getModel("SettingInfo").setProperty("/WorkingHoursEditable",true);
								}
								oDateValidateDeferred = oSelf._getDateValidation(oSelf.sPernr,oSelf.dCurrentDate,oSelf.dCurrentDate);
								oDateValidateDeferred.done(function(aMessageArray,aDate){
									if(aMessageArray.length > 0) {
										oSelf._processMessage(aMessageArray,sap.m.MessageBox.Icon.ERROR,oI18n.getText("ZF_NUMBEROFERROR",aMessageArray.length));
									} else {
										oSelf._updateModel();
									}
								})
							} catch (o) {
								oDateValidateDeferred = oSelf._getDateValidation(oSelf.sPernr,oSelf.dCurrentDate,oSelf.dCurrentDate);
								oDateValidateDeferred.done(function(aMessageArray,aDate){
									if(aMessageArray.length > 0) {
										oSelf._processMessage(aMessageArray,sap.m.MessageBox.Icon.ERROR,oI18n.getText("ZF_NUMBEROFERROR",aMessageArray.length));
									} else {
										oSelf._updateModel();
									}
								})
							}
						})
					} else {
						this.getView().getModel("screenModel").setProperty("/ProxyVisible",false);
						this.getView().getModel("screenModel").setProperty("/ProxyType",this.sSourceScreenMode);
						/*Get pernr from the cross app nav*/
						this.sPernr = oStartUpParameters.pernr[0];
						/*Get date from the cross app nav*/
						var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyyMMdd"});
						var sDate = oStartUpParameters.date[0];
			            var dDate = oDateFormat.parse(sDate);
			            this.dCurrentDate = dDate;
						this.sDate = this._changeDate(this.dCurrentDate);
						this.dBegda = this._getDay(this.dCurrentDate,1);
						this.dEndda = this._getDay(this.dBegda,7);
						/*Get ProxyType from the cross app nav*/
						this.sSourceScreenMode = oStartUpParameters.ProxyType[0];
						if (oStartUpParameters.mode[0] === "D") {
							this.bMode = true;
							this.getView().getModel("SettingInfo").setProperty("/WorkingHoursEditable",false);
						} else if (oStartUpParameters.mode[0] === "E") {
							this.bMode = false;
							this.getView().getModel("SettingInfo").setProperty("/WorkingHoursEditable",true);
						}
						oDateValidateDeferred = oSelf._getDateValidation(oSelf.sPernr,oSelf.dCurrentDate,oSelf.dCurrentDate);
						oDateValidateDeferred.done(function(aMessageArray,aDate){
							if(aMessageArray.length > 0) {
								oSelf._processMessage(aMessageArray,sap.m.MessageBox.Icon.ERROR,oI18n.getText("ZF_NUMBEROFERROR",aMessageArray.length));
							} else {
								oSelf._updateModel();
							}
						})
					}
				} catch (o) {
					var dSystemDate = new Date();
					this.dCurrentDate = dSystemDate;							/* Current Date (Date Type)			*/
					this.dBegda = this._getDay(this.dCurrentDate,1);			/* Calendar Start Date				*/
					this.dEndda = this._getDay(this.dBegda,7);					/* Calendar End Date				*/
					this.bMode = false;											/* Display Mode						*/
					this.sDate = this._changeDate(this.dCurrentDate); 			/* Current Date (YYYYMMDD Format)	*/
					this.sSourceScreenMode = "0";								/* normal or proxy or manager proxy	*/
					oSelf.oDataManager.getRootPernr(function(oResults){
						oSelf.sPernr = oResults[0]["Pernr"];
						oDateValidateDeferred = oSelf._getDateValidation(oSelf.sPernr,oSelf.dCurrentDate,oSelf.dCurrentDate);
						oDateValidateDeferred.done(function(aMessageArray,aDate){
							if(aMessageArray.length > 0) {
								oSelf._processMessage(aMessageArray,sap.m.MessageBox.Icon.ERROR,oI18n.getText("ZF_NUMBEROFERROR",aMessageArray.length));
							} else {
								oSelf._updateModel();
							}
						})
					});
				}
			}
		},

		/* Update Model which bind on the view */
		_updateModel: function() {
			"use strict";
			var oSelf = this;
			var oWorkingHours = oSelf.getView().getModel("WorkingHours");
			var sPath = "/" + this.sDate + "/";
			oSelf._initView();
			/*oSelf.oDeductionDeferred = new jQuery.Deferred();*/
			
			oSelf._setWorkingHours(oSelf);
			oSelf._setTimesheetData(oSelf);
			/*oSelf.oDeductionDeferred.done(function(){
				oSelf._setDeductionTsCd(oSelf);
			});*/
			
			oSelf._setDeductionTsCd(oSelf);
			oSelf.oDataManager.getWorkCalendar(oSelf.sPernr, oSelf.dBegda, oSelf.dEndda, function(aData) {
				oSelf.byId("CalendarDateInterval").removeAllSpecialDates();
				oSelf._getTimeSheetCalendar(aData);
				var oData = {};
				for(var i=0;i<aData.length;i++){
					oData[oSelf._changeDate(oSelf._cvtDateToScreen(aData[i].Date))] = aData[i];
				}

				oSelf.getView().getModel("Calendar").setData(oData,false);
				oSelf.getView().byId("exchgHoliWork").bindObject({
					path : "/" + oSelf.sDate,
					model : "Calendar"
				});
				
				oSelf.getView().byId("CalendarDateInterval").setStartDate(oSelf.dBegda);
		        oSelf.getView().byId("CalendarDateInterval").getSelectedDates()[0].setStartDate(oSelf.dCurrentDate);
			});

			oSelf._setSettingInfo(oSelf);
			
			oSelf.oDataManager.getMonthDetailInfo(oSelf.sPernr, '0000', '00', function(data){
				oSelf.getView().getModel("MonthDetailInfo").setData(data,false);
	        });
			oSelf.oDataManager.getMonthlyWorkingTime(oSelf.sPernr, '0000', '00',oSelf.dBegda, function(data){
	        	oSelf.getView().getModel("MonthlyWorkingTime").setData(data);
	        });
	        oSelf.bFirst = false;
	        
			oSelf.month = oSelf.dBegda.getMonth();
			oSelf.year = oSelf.dBegda.getFullYear();
			oSelf.oDeleteItem = [];

		},

		/*Get WorkingHours Data and set data to model*/
		_setWorkingHours : function(aSelf){
			"use strict";
			aSelf.oDataManager.getWorkingHours(aSelf.sPernr, aSelf.dBegda, aSelf.dEndda, function(aData) {
				var oData = {};
				for(var i=0;i<aData.length;i++){
					oData[aSelf._changeDate(aSelf._cvtDateToScreen(aData[i].Date))] = aData[i];
				}
				aSelf.getView().getModel("WorkingHours").setData(oData,false);
				aSelf.oInitWorkHours = aSelf._deepCopy(oData);
				aSelf.getView().byId("worktimeAssignments").bindObject({
					path : "/" + aSelf.sDate,
					model : "WorkingHours"
				});
				aSelf._setScreenMode();
			});
		},
		
		/* Get TimesheetData and set data to model*/
		_setTimesheetData : function(aSelf){
			"use strict";
			aSelf.oDataManager.getTimesheetData(aSelf.sPernr, aSelf.dCurrentDate, aSelf.dCurrentDate, function(aResults){
				aSelf.InitResendTimesheetData = [];
				if (aResults.length > 0) {
					aSelf.InitResendTimesheetData = aSelf._deepCopy(aResults);
					var oData = {};
					for(var i=0; i<aResults.length; i++){
						if (typeof (oData[aSelf._changeDate(aSelf._cvtDateToScreen(aResults[i]["WorkDate"]))]) === "undefined") {
							oData[aSelf._changeDate(aSelf._cvtDateToScreen(aResults[i]["WorkDate"]))] = {"today":[]};
						}
						oData[aSelf._changeDate(aSelf._cvtDateToScreen(aResults[i]["WorkDate"]))]["today"].push(aResults[i]);
					}
						aSelf.oInitTimesheetData = aSelf._deepCopy(oData);
						aSelf.getView().getModel("TimesheetData").setData(oData,false);
						aSelf.getView().byId("myTabContainer").bindObject({
							path : "/" + aSelf.sDate,
							model : "TimesheetData"
						});
				} else {
					/* Get Default Timesheet Data*/
					aSelf.oDataManager.getDefaultTimesheet(aSelf.sPernr,aSelf.dCurrentDate, aSelf.dCurrentDate,aSelf.sSourceScreenMode, function(aResults){
						var oTempArray = [];
						var oData = {};
						if(aResults.length > 0){
							for(var i=0;i<aResults.length;i++){
								oTempArray.push({
									"Pernr"				: aResults[i]["Pernr"],
									"ClientNameOutput"	: aResults[i]["ClientName"],
									"TSTextOutput"	: aResults[i]["TimesheetName"],
									"Status"	: "",
									"WorkDate"	: aSelf._cvtDateToDb(aSelf.dCurrentDate),
									"TSCdOutput"	: aResults[i]["TimesheetMainCode"],
									"ApproverName"	: aResults[i]["ApproverName"],
									"DataFields"	: {
										"Pernr"  :  aResults[i]["Pernr"],
										"ClntCd" :	aResults[i]["ClientCode"],
										"TsSbCd" :	aResults[i]["TimesheetSubCode"],
										"Land"	 :	aResults[i]["LandCode"],
										"Regio"	 :	aResults[i]["RegioCode"],
										"Cityc"  :	aResults[i]["CityCode"],
										"Appointapp" : aResults[i]["ApproverCode"] ,
										"Catshours" : null
									}
								});
								if( oTempArray[i]["DataFields"]["Appointapp"] === "00000000")
									oTempArray[i]["DataFields"]["Appointapp"] = "";
								
								oData[aSelf.sDate] = {
										"today" : aSelf._deepCopy(oTempArray)
								};
							}
							aSelf.oInitTimesheetData = aSelf._deepCopy(oData);
							aSelf.getView().getModel("TimesheetData").setData(oData,false);
							aSelf.getView().byId("myTabContainer").bindObject({
								path : "/" + aSelf.sDate,
								model : "TimesheetData"
							});
						} else {
							aSelf.getView().getModel("TimesheetData").setData(aSelf.oTSData,false);
							aSelf.getView().byId("myTabContainer").bindObject({
								path : "/" + aSelf.sDate,
								model : "TimesheetData"
							});
						}
					});
				}
				
				/*aSelf.oDeductionDeferred.resolve();*/
			});
		},
		
//		_setDeductionTsCd: function(aSelf){
//			"use strict";
//			aSelf.oDataManager.getDeductionTsCd(function(aData) {
//				var oTimesheetData = aSelf.getView().getModel("TimesheetData").getProperty("/"+ aSelf.sDate +"/today");
//				aSelf.oDeductionTsCd = aData;
//				aSelf.nOldDeductionTsCd = 0;
//				
//				if(aSelf.oDeductionTsCd.length > 0 && oTimesheetData){
//					for (var i = 0;i<oTimesheetData.length;i++){
//						$.each(aSelf.oDeductionTsCd,function(aIdxd, aItemd){
//							if((oTimesheetData[i]["TSCdOutput"] === aItemd["TScd"]) && 
//								(oTimesheetData[i]["DataFields"]["Catshours"])){
//								aSelf.nOldDeductionTsCd = aSelf.nOldDeductionTsCd + Number(oTimesheetData[i]["DataFields"]["Catshours"]);
//							}
//						})
//					}
//				}
//			});
//		},
		
		_setDeductionTsCd: function(aSelf){
			"use strict";
			aSelf.oDataManager.getDeductionTsCd(function(aData) {
				aSelf.oDeductionTsCd = aData;
			});
			
		},	

		_setScreenMode: function() {
			/* Get Data From Application Navigation */
			var oScreenModel = this.getView().getModel("screenModel");
			oScreenModel.setProperty("/RestTime2Visible",false);
			oScreenModel.setProperty("/RestTime2Icon","sap-icon://add");
		},
		
		_setSettingInfo : function(aSelf) {
			"use strict";
			aSelf.oDataManager.getSettingInfo(aSelf.sPernr, aSelf.dCurrentDate, aSelf.dCurrentDate, aSelf.bMode ,aSelf.sSourceScreenMode,function(aData) {
				var oData = {};
				for(var i=0;i<aData.length;i++){
					oData[aSelf._changeDate(aSelf._cvtDateToScreen(aData[i].WorkingDate))] = aData[i];
				}
				aSelf.getView().getModel("SettingInfo").setData(oData,false);
				aSelf.getView().byId("worktimeAssignments").bindObject({
					path : "/" + aSelf.sDate,
					model : "SettingInfo"
				});
				aSelf.getView().byId("myTabContainer").bindObject({
					path : "/" + aSelf.sDate,
					model : "SettingInfo"
				});
				aSelf.getView().byId("footerToolbar").bindObject({
					path : "/" + aSelf.sDate,
					model : "SettingInfo"
				});
			});
		},

		_checkViewData: function(){
			"use strict";
			var sPath = "/" + this.sDate + "/";
			var oView = this.getView();
			var oI18n = this.getOwnerComponent().getModel("i18n").getResourceBundle();
			var oWorkingHours = this.getView().getModel("WorkingHours");
			var oTimesheetModel = this.getView().getModel("TimesheetData").getData();
			var oSettingInfo = this.getView().getModel("SettingInfo");
			var oCalendar = this.getView().getModel("Calendar");
			var oErrorArray = [];
			var oMessageArray = [];
			var oMessage;	
			var i;
			var oStartTimeArray = [];
			var oEndTimeArray = [];
			var iMsoffset = ((new Date).getTimezoneOffset())*60*1000;
			var oId = ["WorkingHours","Break1","Break2","TimeHoliday1","TimeHoliday2","LateLeaveEarly1","LateLeaveEarly2",
			           "ChildRearing1","ChildRearing2","ChildNursing1","ChildNursing2","Care1","Care2"];
			var oFieldName = ["ZF_KIMHOUR","ZF_REST1","ZF_REST2","ZF_TIMELEV1","ZF_TIMELEV2","ZF_LATELEAVE1","ZF_LATELEAVE2",
			                  "ZF_SUPCHILD1","ZF_SUPCHILD2","ZF_CARCHILD1","ZF_CARCHILD2","ZF_NURCARE1","ZF_NURCARE2"];
			var dStartTime,
				dEndTime,
				dEndTimeScreen,
				dTimeNine,
				bFlag,
				bFlagS,
				oStart,
				oEnd;
			var oFieldGroup = sap.ui.getCore().byFieldGroupId("ZZInputField");
			var oItemsArray = [];
			var bErrorFlag = false;
			var oErrorElements = [];
			var oTabContainer = this.getView().byId("myTabContainer");
			var oTabContainerItems = oTabContainer.getItems();
			var iMsoffset = ((new Date).getTimezoneOffset())*60*1000;
			
			/* Check All the input field */
			$.each(oFieldGroup, function(aIdx, aItem){						
				if ("Error" === aItem.getValueState()) {
					/* When input field has Error occured */
					bErrorFlag = true; 
					oErrorElements.push(aItem);
					
					var oBindingContext = aItem.getBindingContext("TimesheetData");
					if (typeof (oBindingContext) !== "undefined") {
						/* When input field is included in Tabcontainer, get the TabcontainerItem Number */
						var sPath = oBindingContext.getPath();
						var iPos = sPath.lastIndexOf("/")
						var iItemNum = sPath.slice(iPos + 1,sPath.length);
						oItemsArray.push(oTabContainerItems[iItemNum]);
					}
				}
				/* Exit the loop when Error ItemArray and ErrorElments Array both have data*/
				if (oItemsArray.length > 0 && oErrorElements.length > 0) {
					return false;
				}
			});
			if (bErrorFlag === true) {
				/* When input field in Tabcontainer has error, move to the first error TabcontainerItem */
				if (oItemsArray.length > 0) {
					oTabContainer.setSelectedItem(oItemsArray[0]);
				}
				oErrorElements[0].focus();
				return;
			}
			
			/*for begin*/
			for( i=0;i<oId.length;i++ ) {

				var bWorkingEndFlag = oWorkingHours.getProperty(sPath + "WorkingHoursEF");
				var bWorkingStartFlag = oWorkingHours.getProperty(sPath + "WorkingHoursSF");
				var oWorkingStart = oWorkingHours.getProperty(sPath + "WorkingHoursS");
				var oWorkingEnd = oWorkingHours.getProperty(sPath + "WorkingHoursE");
				var dWorkingStartTime = oWorkingStart !== null ? new Date(oWorkingStart.ms + iMsoffset) : new Date(0 + iMsoffset);
				var dWorkingEndTime = oWorkingEnd !== null ? new Date(oWorkingEnd.ms + iMsoffset) : new Date(0 + iMsoffset);
				
				if(!this._checkTimeInitial(dWorkingStartTime,bWorkingStartFlag)){
					dWorkingStartTime = bWorkingStartFlag === true ? new Date(dWorkingStartTime.setDate(dWorkingStartTime.getDate() + 1)) : dWorkingStartTime;
				}
				if(!this._checkTimeInitial(dWorkingEndTime,bWorkingEndFlag)){
					dWorkingEndTime = bWorkingEndFlag === true ? new Date(dWorkingEndTime.setDate(dWorkingEndTime.getDate() + 1)) : dWorkingEndTime;
				}

				bFlag	  = oWorkingHours.getProperty(sPath + oId[i] + "EF");
				bFlagS  = oWorkingHours.getProperty(sPath + oId[i] + "SF");
				oStart = oWorkingHours.getProperty(sPath + oId[i] + "S");
				oEnd = oWorkingHours.getProperty(sPath + oId[i] + "E");
				dStartTime = oStart !== null ? new Date(oStart.ms + iMsoffset) : new Date(0 + iMsoffset);
				dEndTime = oEnd !== null ? new Date(oEnd.ms + iMsoffset) : new Date(0 + iMsoffset);
				dEndTimeScreen = oEnd !== null ? new Date(oEnd.ms + iMsoffset) : new Date(0 + iMsoffset);
				dTimeNine  = new Date((new Date((new Date(dEndTime)).setHours(9,0))).setDate(dEndTime.getDate() + 1));
				
				if(!this._checkTimeInitial(dEndTime,bFlag)){
					dEndTime = bFlag === true ? new Date(dEndTime.setDate(dEndTime.getDate() + 1)) : dEndTime;
				}
				
				if(!this._checkTimeInitial(dEndTime,bFlagS)){
					dStartTime = bFlagS === true ? new Date(dStartTime.setDate(dStartTime.getDate() + 1)) : dStartTime;
				}
				
				var sId = oId[i].substr(0,oId[i].length - 1);
				if(this.getView().byId("FM_" + sId) && this.getView().byId("FM_" + sId).getVisible() === false && oId[i].substr(oId[i].length - 1,1) === "2"){
					continue;
				}
				
				switch(oId[i]) {
				case "ChildRearing1":
					if (oSettingInfo.getProperty("/" + this.sDate + "/ChildSupp12Visible") === false) {
						continue;
					}
					break;
				case "ChildRearing2":
					if (oSettingInfo.getProperty("/" + this.sDate + "/ChildSupp12Visible") === false) {
						continue;
					}
					break;
				case "ChildNursing1":
					if (oSettingInfo.getProperty("/" + this.sDate + "/ChildNurs12Visible") === false) {
						continue;
					}
					break;
				case "ChildNursing2":
					if (oSettingInfo.getProperty("/" + this.sDate + "/ChildNurs12Visible") === false) {
						continue;
					}
					break;
				case "Care1":
					if (oSettingInfo.getProperty("/" + this.sDate + "/Care12Visible") === false) {
						continue;
					}
					break;
				case "Care2":
					if (oSettingInfo.getProperty("/" + this.sDate + "/Care12Visible") === false) {
						continue;
					}
					break;
				default :
					break;
				}

				/*117*/
				if ((!this._checkTimeInitial(dStartTime,bFlagS) && dStartTime.getTime() / 1000 / 60 % 15 !== 0) ||
					(!this._checkTimeInitial(dEndTime,bFlag) && dEndTime.getTime() / 1000 / 60 % 15 !== 0)) {
					if (!this._checkTimeInitial(dStartTime,bFlagS) && dStartTime.getTime() / 1000 / 60 % 15 !== 0) {
						oView.byId(oId[i] + "S").setValueStateText(oI18n.getText("ZF_MSG054"));
						oView.byId(oId[i] + "S").setValueState("Error");
						oErrorArray.push(oView.byId(oId[i] + "S"));
					} else {
						oView.byId(oId[i] + "S").setValueState("None");
					}
					if (!this._checkTimeInitial(dEndTime,bFlag) && dEndTime.getTime() / 1000 / 60 % 15 !== 0) {
						oView.byId(oId[i] + "E").setValueStateText(oI18n.getText("ZF_MSG054"));
						oView.byId(oId[i] + "E").setValueState("Error");
						oErrorArray.push(oView.byId(oId[i] + "E"));
					} else {
						oView.byId(oId[i] + "E").setValueState("None");
					}
					continue;
				} else {
					oView.byId(oId[i] + "S").setValueState("None");
					oView.byId(oId[i] + "E").setValueState("None");
				}
				
				/*167*/
				if(oId[i] === "Break1" || oId[i] === "Break2" ||
						oId[i] === "TimeHoliday1"  || oId[i] === "LateLeaveEarly1" ||
						oId[i] === "ChildRearing1" || oId[i] === "ChildNursing1"   ||
						oId[i] === "Care1"){
					if (!this._checkTimeInitial(dStartTime,bFlagS) && !this._checkTimeInitial(dEndTime,bFlag) && 
							dStartTime.getTime() ===dEndTime.getTime()) {
						oView.byId(oId[i] + "S").setValueStateText(oI18n.getText("ZF_MSG113"));
						oView.byId(oId[i] + "S").setValueState("Error");
						oErrorArray.push(oView.byId(oId[i] + "S"));
						oView.byId(oId[i] + "E").setValueStateText(oI18n.getText("ZF_MSG113"));
						oView.byId(oId[i] + "E").setValueState("Error");
						oErrorArray.push(oView.byId(oId[i] + "E"));
						continue;
					} else {
						oView.byId(oId[i] + "S").setValueState("None");
						oView.byId(oId[i] + "E").setValueState("None");
					}	
				}
				
				/*No.147~148*/
				if( oId[i] === "Break1" || oId[i] === "Break2" ) {
					if( dStartTime.getTime() === dWorkingStartTime.getTime() && !this._checkTimeInitial(dStartTime,bFlagS)){
						oView.byId(oId[i] + "S").setValueStateText(oI18n.getText("ZF_MSG100"));
						oView.byId(oId[i] + "S").setValueState("Error");
						oErrorArray.push(oView.byId(oId[i] + "S"));		
						continue;
					} else {
						oView.byId(oId[i] + "S").setValueState("None");	
					}
					
					if( dEndTime.getTime() === dWorkingEndTime.getTime() && !this._checkTimeInitial(dEndTime,bFlag)){
						oView.byId(oId[i] + "E").setValueStateText(oI18n.getText("ZF_MSG100"));
						oView.byId(oId[i] + "E").setValueState("Error");
						oErrorArray.push(oView.byId(oId[i] + "E"));	
						continue;
					} else {
						oView.byId(oId[i] + "E").setValueState("None");	
					}
				}
				
				/*No.150*/
				if(oId[i] === "LateLeaveEarly1"){
					if(oWorkingHours.getProperty(sPath + oId[i] + "H") !== "0.00" &&
							oWorkingHours.getProperty(sPath + "WorkingHoursH") !== "0.00" &&
							dWorkingStartTime.getTime() !== dStartTime.getTime() &&
							dWorkingEndTime.getTime() !== dEndTime.getTime()){
						oView.byId(oId[i] + "S").setValueStateText(oI18n.getText("ZF_MSG101"));
						oView.byId(oId[i] + "S").setValueState("Error");
						oErrorArray.push(oView.byId(oId[i] + "S"));	
						oView.byId(oId[i] + "E").setValueStateText(oI18n.getText("ZF_MSG101"));
						oView.byId(oId[i] + "E").setValueState("Error");
						oErrorArray.push(oView.byId(oId[i] + "E"));	
						continue;
					} else {
						oView.byId(oId[i] + "S").setValueState("None");	
						oView.byId(oId[i] + "E").setValueState("None");	
					}
				}
				
				/*No.22~29,95~97*/
				if (!this._checkTimeInitial(dStartTime,bFlagS) && !this._checkTimeInitial(dEndTime, bFlag)) {

					if(dStartTime <= dEndTime){
						oView.byId(oId[i] + "S").setValueState("None");
						oView.byId(oId[i] + "E").setValueState("None");
					} else {	
						oView.byId(oId[i] + "S").setValueStateText(
								oI18n.getText("ZF_MSG006",
										[ oI18n.getText(oFieldName[i]) + oI18n.getText("ZF_MSGSTARTTIME"), 
										  oI18n.getText(oFieldName[i]) + oI18n.getText("ZF_MSGENDTIME") ]
								));
						oView.byId(oId[i] + "E").setValueStateText(
								oI18n.getText("ZF_MSG006",
										[ oI18n.getText(oFieldName[i]) + oI18n.getText("ZF_MSGSTARTTIME"), 
										  oI18n.getText(oFieldName[i]) + oI18n.getText("ZF_MSGENDTIME") ]
								));
						oView.byId(oId[i] + "S").setValueState("Error");
						oView.byId(oId[i] + "E").setValueState("Error");
						oErrorArray.push(oView.byId(oId[i] + "S"));
						oErrorArray.push(oView.byId(oId[i] + "E"));
						continue;
					}
				}

				/*No.35~39*/
				if( (oId[i] === "WorkingHours")			||
						(oId[i] === "Break1") 			||
						(oId[i] === "Break2") 			||
						(oId[i] === "TimeHoliday1") 	||
						(oId[i] === "LateLeaveEarly1") ){
					
					if( ( dEndTime >  dTimeNine ) && (oWorkingHours.getProperty(sPath + oId[i] + "EF") === true)
							&& !this._checkTimeInitial(dEndTime, bFlag)) {
						oView.byId(oId[i] + "E").setValueStateText(oI18n.getText("ZF_MSG010"));
						oView.byId(oId[i] + "E").setValueState("Error");
						oErrorArray.push(oView.byId(oId[i] + "E"));		
						continue;
					} else {
						oView.byId(oId[i] + "E").setValueState("None");								
					}
					
					if( ( dStartTime >  dTimeNine ) && (oWorkingHours.getProperty(sPath + oId[i] + "SF") === true)
							&& !this._checkTimeInitial(dStartTime, bFlagS)) {
						oView.byId(oId[i] + "S").setValueStateText(oI18n.getText("ZF_MSG010"));
						oView.byId(oId[i] + "S").setValueState("Error");
						oErrorArray.push(oView.byId(oId[i] + "S"));		
						continue;
					} else {
						oView.byId(oId[i] + "S").setValueState("None");							
					}
					
					if((oWorkingHours.getProperty(sPath + oId[i] + "SF") === true)
							&& (oWorkingHours.getProperty(sPath + oId[i] + "EF") === false)){
						oView.byId(oId[i] + "S").setValueStateText(
								oI18n.getText("ZF_MSG006",
										[ oI18n.getText(oFieldName[i]) + oI18n.getText("ZF_MSGSTARTTIME"), 
										  oI18n.getText(oFieldName[i]) + oI18n.getText("ZF_MSGENDTIME") ]
								));
						oView.byId(oId[i] + "E").setValueStateText(
								oI18n.getText("ZF_MSG006",
										[ oI18n.getText(oFieldName[i]) + oI18n.getText("ZF_MSGSTARTTIME"), 
										  oI18n.getText(oFieldName[i]) + oI18n.getText("ZF_MSGENDTIME") ]
								));
						oView.byId(oId[i] + "S").setValueState("Error");
						oView.byId(oId[i] + "E").setValueState("Error");
						oErrorArray.push(oView.byId(oId[i] + "S"));
						oErrorArray.push(oView.byId(oId[i] + "E"));
						continue;
					} else {
						oView.byId(oId[i] + "S").setValueState("None");
						oView.byId(oId[i] + "E").setValueState("None");
					}
				}
				
				/*No.81~82*/
				if( (oId[i] === "TimeHoliday2") 	||
						(oId[i] === "LateLeaveEarly2") ){
					if( ( dEndTime <  dTimeNine ) && (oWorkingHours.getProperty(sPath + oId[i] + "EF") === false)
							&& !this._checkTimeInitial(dEndTime, bFlag)) {
						oView.byId(oId[i] + "E").setValueStateText(oI18n.getText("ZF_MSG010"));
						oView.byId(oId[i] + "E").setValueState("Error");
						oErrorArray.push(oView.byId(oId[i] + "E"));		
						continue;
					} else {
						oView.byId(oId[i] + "E").setValueState("None");								
					}
				}
				
				/*No.54~61*/
				if( (oId[i] === "WorkingHours")		||
					(oId[i] === "Break1") 			||
					(oId[i] === "Break2") 			||
					(oId[i] === "LateLeaveEarly1")	||
					(oId[i] === "LateLeaveEarly2")	) {
					if( Number(oWorkingHours.getProperty(sPath + oId[i] + "H")) % 0.25 !== 0){
						oView.byId(oId[i] + "S").setValueStateText(oI18n.getText("ZF_MSG014"));
						oView.byId(oId[i] + "E").setValueStateText(oI18n.getText("ZF_MSG014"));
						oView.byId(oId[i] + "S").setValueState("Error");
						oView.byId(oId[i] + "E").setValueState("Error");
						oErrorArray.push(oView.byId(oId[i] + "S"));		
						oErrorArray.push(oView.byId(oId[i] + "E"));		
						continue;
					} else {
						oView.byId(oId[i] + "S").setValueState("None");
						oView.byId(oId[i] + "E").setValueState("None");
					}
				} else if ( (oId[i] === "TimeHoliday1")  ||
							(oId[i] === "TimeHoliday2")  ||
							(oId[i] === "ChildRearing1") ||
							(oId[i] === "ChildRearing2") ||
							(oId[i] === "ChildNursing1") ||
							(oId[i] === "ChildNursing2") ||
							(oId[i] === "Care1") 		 ||
							(oId[i] === "Care2")       ) {
					if( Number(oWorkingHours.getProperty(sPath + oId[i] + "H")) % 1 !== 0){
						oView.byId(oId[i] + "S").setValueStateText(oI18n.getText("ZF_MSG015"));
						oView.byId(oId[i] + "E").setValueStateText(oI18n.getText("ZF_MSG015"));
						oView.byId(oId[i] + "S").setValueState("Error");
						oView.byId(oId[i] + "E").setValueState("Error");
						oErrorArray.push(oView.byId(oId[i] + "S"));		
						oErrorArray.push(oView.byId(oId[i] + "E"));	
						continue;
					} else {
						oView.byId(oId[i] + "S").setValueState("None");
						oView.byId(oId[i] + "E").setValueState("None");
					}
				}

				/*No 62,112~116*/
				if( (oId[i] === "Break1") 		   ||
					(oId[i] === "LateLeaveEarly1") ||
					(oId[i] === "ChildRearing1")   ||
					(oId[i] === "ChildNursing1")   ||
					(oId[i] === "Care1")	   ) 	{
					var sId2 = oId[i].substring(0,oId[i].length-1) + "2";
					
					if((Number(oWorkingHours.getProperty(sPath + oId[i] + "H")) === 0) &&
						(Number(oWorkingHours.getProperty(sPath + sId2 + "H")) !== 0)) {
						oView.byId(oId[i] + "S").setValueStateText(oI18n.getText("ZF_MSG017"));
						oView.byId(oId[i] + "E").setValueStateText(oI18n.getText("ZF_MSG017"));
						oView.byId(oId[i] + "S").setValueState("Error");
						oView.byId(oId[i] + "E").setValueState("Error");
						oErrorArray.push(oView.byId(oId[i] + "S"));		
						oErrorArray.push(oView.byId(oId[i] + "E"));	
						continue;
					} else {
						oView.byId(oId[i] + "S").setValueState("None");
						oView.byId(oId[i] + "E").setValueState("None");
					}
				};
				
				/*No 63,64,104~109*/
				if( oId[i] === "Break2")  {
					var sId1 = oId[i].substring(0,oId[i].length-1) + "1";
					var bFlag1      = oWorkingHours.getProperty(sPath + sId1 + "EF");
					var bFlagS1  = oWorkingHours.getProperty(sPath + sId1 + "SF");
					var oStart1 = oWorkingHours.getProperty(sPath + sId1 + "S");
					var oEnd1 = oWorkingHours.getProperty(sPath + sId1 + "E");
					var dStartTime1 = oStart1 !== null ? new Date(oStart1.ms + iMsoffset) : new Date(0 + iMsoffset);
					var dEndTime1 = oEnd1 !== null ? new Date(oEnd1.ms + iMsoffset) : new Date(0 + iMsoffset);
					
					if (!this._checkTimeInitial(dEndTime1, bFlag1)){
						dEndTime1 = bFlag1 === true ? new Date(dEndTime1.setDate(dEndTime1.getDate() + 1)) : dEndTime1;
					}
					if (!this._checkTimeInitial(dStartTime1, bFlagS1)){
						dStartTime1 = bFlagS1 === true ? new Date(dStartTime1.setDate(dStartTime1.getDate() + 1)) : dStartTime1;
					}
					
					if (!this._checkTimeInitial(dStartTime1,bFlagS1) &&
							!this._checkTimeInitial(dEndTime1,bFlag1) &&
							!this._checkTimeInitial(dStartTime,bFlagS) &&
							!this._checkTimeInitial(dEndTime,bFlag)) {
						if((dStartTime < dStartTime1) || (dEndTime < dStartTime1) ||
							(dStartTime < dEndTime1) 	 || (dEndTime < dEndTime1))  {
							oView.byId(oId[i] + "S").setValueStateText(oI18n.getText("ZF_MSG017"));
							oView.byId(oId[i] + "E").setValueStateText(oI18n.getText("ZF_MSG017"));
							oView.byId(oId[i] + "S").setValueState("Error");
							oView.byId(oId[i] + "E").setValueState("Error");
							oErrorArray.push(oView.byId(oId[i] + "S"));		
							oErrorArray.push(oView.byId(oId[i] + "E"));	
							continue;
						} else {
							oView.byId(oId[i] + "S").setValueState("None");
							oView.byId(oId[i] + "E").setValueState("None");
						}	
					}
				}
				
				/* No.66 */
				if( (oId[i] === "Break1") ||
					(oId[i] === "Break2") ||
					(oId[i] === "TimeHoliday1")  ||
					(oId[i] === "LateLeaveEarly1") ||
					(oId[i] === "ChildRearing1") ||
					(oId[i] === "ChildNursing1") ||
					(oId[i] === "Care1")  ) {
					
					if ((dStartTime < dWorkingStartTime || dEndTime > dWorkingEndTime) &&
							(!this._checkTimeInitial(dEndTime,bFlag) && !this._checkTimeInitial(dStartTime,bFlagS) )) {
						/*oView.byId(oId[i] + "S").setValueStateText(oI18n.getText("ZF_MSG053"));
						oView.byId(oId[i] + "E").setValueStateText(oI18n.getText("ZF_MSG053"));*/
						oView.byId(oId[i] + "S").setValueStateText(oI18n.getText("ZF_MSG089",[oI18n.getText(("ZF_MSG"+oId[i]).toUpperCase())]));
						oView.byId(oId[i] + "E").setValueStateText(oI18n.getText("ZF_MSG089",[oI18n.getText(("ZF_MSG"+oId[i]).toUpperCase())]));
						oView.byId(oId[i] + "S").setValueState("Error");
						oView.byId(oId[i] + "E").setValueState("Error");
						oErrorArray.push(oView.byId(oId[i] + "S"));		
						oErrorArray.push(oView.byId(oId[i] + "E"));
						continue;
					} else {
						oView.byId(oId[i] + "S").setValueState("None");
						oView.byId(oId[i] + "E").setValueState("None");
					}
				}
				
				/* No.134 */
				/* When following time input data is overlap with 12:00~13:00 */
				if(((oId[i] === "Break1") ||
					(oId[i] === "Break2")) && 
					(((oCalendar.getProperty(sPath + "WorkingDay") === "TRUE") &&
					(!oWorkingHours.getProperty(sPath + "CompensatingDay"))) ||
					(((oCalendar.getProperty(sPath + "WorkingDay") === "FALSE")&&
					(oWorkingHours.getProperty(sPath + "CompensatingDay")))))) {
					
					var iOverlapTime = this._getOverlapTime(dStartTime, dEndTime);
					if (iOverlapTime > 0) {
						oView.byId(oId[i] + "S").setValueStateText(oI18n.getText("ZF_MSG087",[oI18n.getText(oFieldName[i])]));
						oView.byId(oId[i] + "E").setValueStateText(oI18n.getText("ZF_MSG087",[oI18n.getText(oFieldName[i])]));
						oView.byId(oId[i] + "S").setValueState("Error");
						oView.byId(oId[i] + "E").setValueState("Error");
						oErrorArray.push(oView.byId(oId[i] + "S"));		
						oErrorArray.push(oView.byId(oId[i] + "E"));
						continue;
					} else {
						oView.byId(oId[i] + "S").setValueState("None");
						oView.byId(oId[i] + "E").setValueState("None");
					}
				}
				
				/*Duplicated Time */
				if(oId[i] !== "WorkingHours"){
					oStartTimeArray.push(dStartTime);
					oEndTimeArray.push(dEndTime);
				}	
			}
			/*for end*/

			/*Duplicated Time */
			oStartTimeArray.sort(function(aTime1,aTime2) {
				return aTime1 - aTime2;
			});
			oEndTimeArray.sort(function(aTime1,aTime2) {
				return aTime1 - aTime2;
			});
			for (var j = 1; j<oStartTimeArray.length; j++) {
				if (oStartTimeArray[j] < oEndTimeArray[j-1]) {
					oMessage = {
							code : "ZHR001",
							num : "018",
							message : oI18n.getText("ZF_MSG018")
					}
					oMessageArray.push(oMessage);
					break;
				}
			}

			/* Check TimesheetData*/
			var oTimesheetData = this.getView().getModel("TimesheetData").getProperty(sPath);
			var oTabContainer = this.getView().byId("myTabContainer");
			var oTabContainerItems = oTabContainer.getAggregation("items");
			var oTabContainerItemsErrar = [];
			var oTimesheetCodeArray = [];
			var iErrorNo = 0;
			for (i = 0; i<oTimesheetData["today"].length; i++){
				var rNumericRegex = /^[0-9]*$/;
				var sClientCode = oTimesheetData["today"][i]["DataFields"].ClntCd;
				var sApproverCode = oTimesheetData["today"][i]["DataFields"].Appointapp;
				var sHours = oTimesheetData["today"][i]["DataFields"].Catshours;
				var sSubCd = oTimesheetData["today"][i]["DataFields"].TsSbCd;
				var sTsCd = oTimesheetData["today"][i].TSCdOutput;
				var sTsSubCd = oTimesheetData["today"][i].TSCdOutput + " " + oTimesheetData["today"][i]["DataFields"].TsSbCd;
				var sTimesheetCode = sSubCd === "" ? oTimesheetData["today"][i].TSCdOutput : sTsSubCd;
				
				var oContent = oTabContainerItems[i].getAggregation("content");
				var oFormContainers = oContent[0].getAggregation("formContainers");
				var oFormElements = oFormContainers[0].getAggregation("formElements");
				var oUITimesheetCode = oFormElements[1].getAggregation("fields")[0];
				var oUIApproverCode	 =  oFormElements[3].getAggregation("fields")[0];
				var oUIHours		 =  oFormElements[4].getAggregation("fields")[0];
				/* Necessary Timesheet input*/
				if (!sTsCd) {
					oUITimesheetCode.setValueStateText(this.oBundle.getText("ZF_MSG001",this.oBundle.getText("ZF_TIMESHEETCD")));
					oUITimesheetCode.setValueState("Error");
					oErrorArray.push(oUITimesheetCode);
					oTabContainerItemsErrar.push(oTabContainerItems[i]);
				} else if (oTimesheetCodeArray.indexOf(sTimesheetCode,0) !== -1) {
					/* Duplicated Timesheet input*/
					oUITimesheetCode.setValueStateText(this.oBundle.getText("ZF_MSG008",sTimesheetCode));
					oUITimesheetCode.setValueState("Error");
					oErrorArray.push(oUITimesheetCode);
					oTabContainerItemsErrar.push(oTabContainerItems[i]);
				} else {
					oUITimesheetCode.setValueState("None");
					oTimesheetCodeArray.push(sTimesheetCode);
				}
				
				/* Necessary Approvercode input*/
				if ((!sApproverCode || sApproverCode === "00000000")&&(oSettingInfo.getProperty("/" + this.sDate + "/ManageVisible") === true)) {
					oUIApproverCode.setValueStateText(this.oBundle.getText("ZF_MSG001",this.oBundle.getText("ZF_MSGAPPROVER")));
					oUIApproverCode.setValueState("Error");
					oErrorArray.push(oUIApproverCode);
					oTabContainerItemsErrar.push(oTabContainerItems[i]);
				} else if (!sApproverCode.match(rNumericRegex)) {
					oUIApproverCode.setValueStateText(this.oBundle.getText("ZF_MSG000_NUMERIC"));
					oUIApproverCode.setValueState("Error");
					oErrorArray.push(oUIApproverCode);
					oTabContainerItemsErrar.push(oTabContainerItems[i]);
				} else {
					oUIApproverCode.setValueState("None");
				}
				
				if (Number(sHours) === 0 || sHours === "") {
					oUIHours.setValueStateText(this.oBundle.getText("ZF_MSG001",this.oBundle.getText("ZF_MSGHOURS")));
					oUIHours.setValueState("Error");
					oErrorArray.push(oUIHours);
					oTabContainerItemsErrar.push(oTabContainerItems[i]);
				} else if (Number(sHours) % 0.25 !== 0){
					oUIHours.setValueStateText(oI18n.getText("ZF_MSG014"));
					oUIHours.setValueState("Error");
					oErrorArray.push(oUIHours);
					oTabContainerItemsErrar.push(oTabContainerItems[i]);
				} else {
					oUIHours.setValueState("None");
				}
			}
			
			if(oTabContainerItemsErrar.length > 0){
				oTabContainer.setSelectedItem(oTabContainerItemsErrar[0]);
			}
			
			if(oErrorArray.length > 0){
				this.byId("CalendarDateInterval").getSelectedDates()[0].setStartDate(this._changeDate(this.sDate));
				oErrorArray[0].focus();	
				return false;
			}
			
			if (oMessageArray.length > 0){
				this._processMessage(oMessageArray,sap.m.MessageBox.Icon.ERROR,oI18n.getText("ZF_NUMBEROFERROR",oMessageArray.length));
				return false;
			}

			return true;
		},

		_processMessage : function(aMessages,aMsgType,aTitle) {
			"use strict";
			var sMessage = "";
			var sMessageDetails = "";
			if (aMessages) {
				for (var i = 0; i < aMessages.length; i++) {
					sMessageDetails += aMessages[i].code + "(" + aMessages[i].num + "):" + aMessages[i].message + "\n";
				}
				sMessage = this.getOwnerComponent().getModel("i18n").getResourceBundle().
				getText("ZF_NUMBEROFERROR",aMessages.length);
			}
			var oMessage = {
					message: sMessage,
					details: sMessageDetails,
					type: aMsgType
			};
			
			try {
				sap.m.MessageBox.show(
						oMessage.message, {
							icon: aMsgType,
							title: aTitle,
							actions: [sap.m.MessageBox.Action.OK],
							details: oMessage.details,
							onClose: function(oAction) {}
						}
				);
			} catch (o) {
				oMessage.type = sap.ca.ui.message.Type.ERROR;
				sap.ca.ui.message.showMessageBox({
					type: sap.ca.ui.message.Type.ERROR,
					message: oMessage.message,
					details: oMessage.details
				});
			}
		},

		_processConfirmMessageBox : function(aSummaryMessage, aMsgType,aFOK ,aFCancel) {
			"use strict";
			var oSelf = this;
			var sMessage = aSummaryMessage;
			var oMessage = {
					message : sMessage,
					type : aMsgType
			};

			setTimeout(function() {
				sap.m.MessageBox.confirm(oMessage.message,{
					icon : aMsgType,
					onClose : function(oAction) {
						switch (oAction) {
						case "OK":
							aFOK(oSelf);
							break;
						case "CANCEL":
							if (typeof (aFCancel) !== "undefined") {
								aFCancel(oSelf);
							}
							break;
						default:
							break;
						}
					}
				});
			},300);
		},

		onResend: function(aEvent){
			"use strict";
			var oSelf = this;
			var oUpdData = [];
			var sResendOpreationType = oSelf.getView().getModel("screenModel").getProperty("/ResendOpreationType");
			/*var sMessage = oSelf.oBundle.getText("ZF_MSG033",oSelf.oBundle.getText("ZF_MSGAPPLY"));*/
			var sMessage = oSelf.oBundle.getText("ZF_MSG024");
			var oUpdateDeferred = new jQuery.Deferred();
			
			oUpdData = oSelf._prepareUpdateData(oSelf,sResendOpreationType);
			oUpdData[0][0]["FlgUpdate"] = false;
			oSelf.oDataManager.updateTimesheetData(oSelf.sPernr,oUpdData[0],oUpdData[1],oSelf.InitResendTimesheetData, function() {
				oSelf._processConfirmMessageBox(sMessage, sap.m.MessageBox.Icon.ERROR, function(){
					oUpdateDeferred.resolve();
				});
			});
			
			oUpdateDeferred.done(function() {
				oUpdData = oSelf._prepareUpdateData(oSelf,sResendOpreationType);
				oUpdData[0][0]["FlgUpdate"] = true;
				oSelf.oDataManager.updateTimesheetData(oSelf.sPernr,oUpdData[0],oUpdData[1],oSelf.InitResendTimesheetData, function() {
					var sMessage = oSelf.oBundle.getText("ZF_MSG025");
					sap.m.MessageToast.show(sMessage,{
						animationDuration:6000
					});
					oSelf._updateModel();
				});
			});
		},

		onSend: function(aEvent){
			"use strict";
			var oSelf = this;
			var oUpdData = [];
			var sSendOpreationType = oSelf.getView().getModel("screenModel").getProperty("/SendOpreationType");
			var sMessage = oSelf.oBundle.getText("ZF_MSG022");
			var oUpdateDeferred = new  jQuery.Deferred();
			var oWarningDeferred = new jQuery.Deferred();
			
			this.getView().byId("WorkingHoursE").fireChange();
			
			if(oSelf._checkViewData()){
				oUpdData = oSelf._prepareUpdateData(oSelf,sSendOpreationType);
				oUpdData[0][0]["FlgUpdate"] = false;
				oSelf.oDataManager.updateTimesheetData(oSelf.sPernr,oUpdData[0],oUpdData[1],oSelf.InitResendTimesheetData, function() {
					oWarningDeferred.resolve();
				});
				oWarningDeferred.done(function() {
					var oWarningMessage = oSelf._checkWarningMessage();
					if (oWarningMessage.length > 0) {
						oSelf._processConfirmMessageBox(oWarningMessage.join("\n"), sap.m.MessageBox.Icon.WARNING,function(){
							/*OK Process*/
							oUpdateDeferred.resolve();
						});
					} else {
						oUpdateDeferred.resolve();
					}
				});
				
				oUpdateDeferred.done(function() {
					oSelf._processConfirmMessageBox(sMessage, sap.m.MessageBox.Icon.INFORMATION, function(){
						oUpdData = oSelf._prepareUpdateData(oSelf,sSendOpreationType);
						oUpdData[0][0]["FlgUpdate"] = true;
						oSelf.oDataManager.updateTimesheetData(oSelf.sPernr,oUpdData[0],oUpdData[1],oSelf.InitResendTimesheetData, function() {
							var sMessage = oSelf.oBundle.getText("ZF_MSG023");
							sap.m.MessageToast.show(sMessage,{
								animationDuration:6000
							});
							oSelf._navToLaunchpad();
						});
					});
				});
			}
		},
		
		onDelete: function(aEvent){
			"use strict";
			var oSelf = this;
			var oUpdData = [];
			var sMessage = oSelf.oBundle.getText("ZF_MSG090");
			var oDeleteDeferred = new jQuery.Deferred();
			var oCheckDeferred = new jQuery.Deferred();
			
			oUpdData = oSelf._prepareUpdateData(oSelf,"");
			oUpdData[0][0]["FlgDelete"] = true;
			oUpdData[0][0]["FlgUpdate"] = false;
			oSelf.oDataManager.updateTimesheetData(oSelf.sPernr,oUpdData[0],[],oSelf.InitResendTimesheetData,function() {
				oCheckDeferred.resolve();
			});
			
			oCheckDeferred.done(function() {
				oSelf._processConfirmMessageBox(sMessage, sap.m.MessageBox.Icon.WARNING,function(){
					/*OK Process*/
					/*oUpdData = oSelf._prepareUpdateData(oSelf,"");
					oUpdData[0][0]["FlgDelete"] = true;*/
					oUpdData[0][0]["FlgUpdate"] = true;
					oSelf.oDataManager.updateTimesheetData(oSelf.sPernr,oUpdData[0],[],oSelf.InitResendTimesheetData,function() {
						oDeleteDeferred.resolve();
					});
				});
			})
			
			
			
			oDeleteDeferred.done(function() {
				var sMessage = oSelf.oBundle.getText("ZF_MSG091");
				sap.m.MessageToast.show(sMessage,{
					animationDuration:6000
				});
				oSelf._updateModel();
			});
		},
		
		onNavToPortal: function(aControlEvent) {
			var oParams = {};
			var oTarget = {
					semanticObject : "TimeEntry",
					action : "tspportal",
			};

			if (this.sSourceScreenMode === "1" || this.sSourceScreenMode === "2") {
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
	    
		onSave: function(aEvent){
			"use strict";
			var oSelf = this;
			var oUpdData = [];
			var sSaveOpreationType = this.getView().getModel("screenModel").getProperty("/SaveOpreationType");
			var sMessage = oSelf.oBundle.getText("ZF_MSG026");
			var oUpdateDeferred = new jQuery.Deferred();
			var oWarningDeferred = new jQuery.Deferred();
			
			this.getView().byId("WorkingHoursE").fireChange();
			
			if(oSelf._checkViewData()){
				oUpdData = oSelf._prepareUpdateData(oSelf,sSaveOpreationType);
				oUpdData[0][0]["FlgUpdate"] = false;
				oSelf.oDataManager.updateTimesheetData(oSelf.sPernr,oUpdData[0],oUpdData[1],oSelf.InitResendTimesheetData, function() {
					oWarningDeferred.resolve();
				});
				
				oWarningDeferred.done(function() {
					var oWarningMessage = oSelf._checkWarningMessage();
					if (oWarningMessage.length > 0) {
						oSelf._processConfirmMessageBox(oWarningMessage.join("\n"), sap.m.MessageBox.Icon.WARNING,function() {
							/*OK Process*/
							oUpdateDeferred.resolve();
						});
					} else {
						oUpdateDeferred.resolve();
					}	
				});
				
				oUpdateDeferred.done(function() {
					oSelf._processConfirmMessageBox(sMessage, sap.m.MessageBox.Icon.INFORMATION, function(){
						oUpdData = oSelf._prepareUpdateData(oSelf,sSaveOpreationType);
						oUpdData[0][0]["FlgUpdate"] = true;
						oSelf.oDataManager.updateTimesheetData(oSelf.sPernr,oUpdData[0],oUpdData[1],oSelf.InitResendTimesheetData, function() {
							var sMessage = oSelf.oBundle.getText("ZF_MSG027");
							sap.m.MessageToast.show(sMessage,{
								animationDuration:6000
							});
							oSelf._navToLaunchpad();
						});
					});
				});
			}
		},
		
		_checkWarningMessage: function() {
			var oWorkingHours = this.getView().getModel("WorkingHours");
			var oCalendar = this.getView().getModel("Calendar");
			var oTimesheetData = this.getView().getModel("TimesheetData").getData();
			var oWorkingHoursData = this.getView().getModel("WorkingHours").getData();
			var oWarnMessageArray = [];

			var iSumHours = Number(oWorkingHours.getProperty("/" + this.sDate + "/TodayWorkingHours"));
			var iRestHours = Number(oWorkingHours.getProperty("/" + this.sDate + "/Break1H")) +
								Number(oWorkingHours.getProperty("/" + this.sDate + "/Break2H"));
			
			if((oCalendar.getProperty("/"+this.sDate+"/WorkingDay") !== "TRUE") && 
					!oWorkingHours.getProperty("/"+this.sDate+"/CompensatingDay")){
				if (iSumHours > 6) {
					if (iSumHours > 8) {
						if (iRestHours < 1) {
							oWarnMessageArray.push(this.oBundle.getText("ZF_MSG038"));
						}
					} else if (iRestHours < 0.75) {
						oWarnMessageArray.push(this.oBundle.getText("ZF_MSG037"));
					}
				}
			}
			
			return oWarnMessageArray;
		},
		
		_prepareUpdateData : function(aSelf,aOperationType) {
			"use strict";
			aSelf._editCheck();
			var oUpdWorkingHours  = [];
			var oUpdTimesheetData = [];
			var oWorkingHours  = aSelf._deepCopy(aSelf.getView().getModel("WorkingHours").getData());
			var oTimesheetData = aSelf._deepCopy(aSelf.getView().getModel("TimesheetData").getData());
			var iIndex = 0;
			var j;
			
			oUpdWorkingHours[iIndex] = this._deepCopy(oWorkingHours[aSelf.sDate]);
			
			oUpdWorkingHours[iIndex]["FlgTarget"] = true;
			
			for(j = 0 ; j< oTimesheetData[aSelf.sDate]["today"].length; j++){
				oUpdTimesheetData.push(this._deepCopy(oTimesheetData[aSelf.sDate]["today"][j]));
				oUpdTimesheetData[oUpdTimesheetData.length - 1]["OperationType"] = aOperationType;
				oUpdTimesheetData[oUpdTimesheetData.length - 1]["SourceScreenMode"] = aSelf.sSourceScreenMode;
				oUpdTimesheetData[oUpdTimesheetData.length - 1]["FlgTarget"] = true;
				oUpdTimesheetData[oUpdTimesheetData.length - 1]["DataFields"]["TsSbCd"] =
					oUpdTimesheetData[oUpdTimesheetData.length - 1]["DataFields"]["TsSbCd"].toString();
				oUpdTimesheetData[oUpdTimesheetData.length - 1]["ClientNameOutput"] = "";
				oUpdTimesheetData[oUpdTimesheetData.length - 1]["TSTextOutput"] = "";
				oUpdTimesheetData[oUpdTimesheetData.length - 1]["ApproverName"] = "";
			}
			iIndex++;
			for(j = 0; j<aSelf.oDeleteItem.length; j++){
				
				aSelf.oDeleteItem[j]["FlgDel"] = true;
				aSelf.oDeleteItem[j]["FlgTarget"] = true;
				aSelf.oDeleteItem[j]["ClientNameOutput"] = "";
				aSelf.oDeleteItem[j]["TSTextOutput"] = "";
				aSelf.oDeleteItem[j]["ApproverName"] = "";
				oUpdTimesheetData.push(this._deepCopy(aSelf.oDeleteItem[j]));
			}
			
			return [oUpdWorkingHours,oUpdTimesheetData];
		},
		
		onCancel: function(aEvent){
			"use strict";
			var oSelf = this;
			var sMessage = oSelf.oBundle.getText("ZF_MSG020");
			if(!oSelf._deepCompare(oSelf.getView().getModel("WorkingHours").getData(),oSelf.oInitWorkHours)||
					!oSelf._deepCompare(oSelf.getView().getModel("TimesheetData").getData(),oSelf.oInitTimesheetData)){
				oSelf._processConfirmMessageBox(sMessage, sap.m.MessageBox.Icon.WARNING, function(){ window.history.go(-1); });
			} else {
				window.history.go(-1);
			}
		},

		onStartDateChanged: function(aEvent){
			"use strict";
			var aSelf = this;
			var dOldDate  = aSelf.getView().byId("CalendarDateInterval").getSelectedDates()[0].getStartDate();
			var dOldStart = aSelf._getDay(dOldDate,1);
			/* var sMessage  = aSelf.oBundle.getText("ZF_MSG020"); */
			var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyy/MM/dd"});
			var sMessage = aSelf.oBundle.getText("ZF_MSG021", oDateFormat.format(aSelf.dCurrentDate));
			
			if(!aSelf._deepCompare(aSelf.getView().getModel("WorkingHours").getData(),aSelf.oInitWorkHours)||
					!aSelf._deepCompare(aSelf.getView().getModel("TimesheetData").getData(),aSelf.oInitTimesheetData)){
				aSelf._processConfirmMessageBox(sMessage, sap.m.MessageBox.Icon.WARNING, this._setNewCalendar, function(aSelf) {
					aSelf.getView().byId("CalendarDateInterval").setStartDate(dOldStart);
					aSelf.getView().byId("CalendarDateInterval").getSelectedDates()[0].setStartDate(dOldDate);

				});
			} else {
				this._setNewCalendar(aSelf);
			}
		},
		
		_setNewCalendar: function(aSelf) {
			var dNewDate = aSelf._getDay(aSelf.byId("CalendarDateInterval").getStartDate(),1);
			aSelf.dBegda = dNewDate;
			aSelf.dEndda = aSelf._getDay(aSelf.dBegda,7);
			aSelf.dCurrentDate = aSelf.dBegda;
			aSelf.sDate  = aSelf._changeDate(aSelf.dBegda);
			var oI18n = aSelf.getOwnerComponent().getModel("i18n").getResourceBundle();
			var dOldDate  = aSelf.getView().byId("CalendarDateInterval").getSelectedDates()[0].getStartDate();
			var dOldStart = aSelf._getDay(dOldDate,1);
			var oValidateDeferred = new jQuery.Deferred();
			var oMessageArray = [];
			var oMessage;
			
			oValidateDeferred = aSelf._getDateValidation(aSelf.sPernr,aSelf.dBegda,aSelf.dEndda);
			
			oValidateDeferred.done(function(aMessageArray,aDate){
				
				if ( aMessageArray.length > 0 ) {
					aSelf._processMessage(aMessageArray,sap.m.MessageBox.Icon.ERROR,oI18n.getText("ZF_NUMBEROFERROR",aMessageArray.length));
					aSelf.getView().byId("CalendarDateInterval").setStartDate(dOldStart);
					aSelf.getView().byId("CalendarDateInterval").getSelectedDates()[0].setStartDate(dOldDate);
					aSelf.dCurrentDate = dOldDate;
					aSelf.sDate  = aSelf._changeDate(aSelf.dCurrentDate);
					aSelf.dBegda = aSelf._getDay(aSelf.dCurrentDate,1);
					aSelf.dEndda = aSelf._getDay(aSelf.dBegda,7);
				} else {
					if(aDate && (aSelf._cvtDateToScreen(aDate).getTime() !== aSelf.dBegda.getTime())){
						aSelf.getView().byId("CalendarDateInterval").getSelectedDates()[0].setStartDate(aDate);
						aSelf.dCurrentDate = aSelf._cvtDateToScreen(aDate);
						aSelf.sDate  = aSelf._changeDate(aSelf.dCurrentDate);
					} else {
						aSelf.getView().byId("CalendarDateInterval").getSelectedDates()[0].setStartDate(aSelf.dBegda);
					}
					aSelf.byId("CalendarDateInterval").removeAllSpecialDates();
					aSelf.getView().byId("CalendarDateInterval").setStartDate(aSelf.dBegda);
					aSelf._updateModel();
				}
				aSelf.getView().byId("CalendarDateInterval").focusDate(aSelf.dCurrentDate);
				for(var i = 0;i<7;i++){
					aSelf.oEditFlag[aSelf._changeDate(aSelf._getDay(aSelf.dBegda,i+1))] = {
							"WorkingHours" : "",
							"TimesheetData" : ""
					};
				}
			});
		},
		
		_getTimeSheetCalendar: function(aData) {
			"use strict";
			var oGrey = [],
			oYaction = [],
			oDone = [],
			oMaction = [],
			oRejected = [];
			var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyyMMdd"});
			var dCurrentSelectedDay = oDateFormat.format(this.byId("CalendarDateInterval").getSelectedDates()[0].getStartDate());
			
			for (var i = 0; i < aData.length; i++) {
				var sWorkingDay = aData[i].WorkingDay === "TRUE";
				var dDate = new Date(this._cvtDateToScreen(aData[i].Date));

				var sStatus = aData[i].Status;

				if (!sWorkingDay) {
				/*	 add to holidays to grey out*/
					oGrey.push(dDate);
				} else if (sStatus === "YACTION") {
					oYaction.push(dDate);
				} else if (sStatus === "MACTION") {
					oMaction.push(dDate);
				} else if (sStatus === "REJECTED") {
					oRejected.push(dDate);
				} else if (sStatus === "DONE") {
					oDone.push(dDate);
				}
			}

			var oWeeklyCal = this.byId("CalendarDateInterval");
			var oLegend = this.byId("LEGEND");
			this._setSpecialDate(oMaction,"Type05");
			this._setSpecialDate(oDone,"Type04");
			this._setSpecialDate(oGrey,"Type03");
			this._setSpecialDate(oYaction,"Type01");
			this._setSpecialDate(oRejected,"Type02");
		},
		
		_setSpecialDate: function(aDateArray,aDateType) {
			"use strict";
			var oWeeklyCal = this.byId("CalendarDateInterval");
			for (var i=0;i<aDateArray.length;i++) {
				this.oSpecialDates[aDateArray[i]] = new sap.ui.unified.DateTypeRange({
					startDate : new Date(aDateArray[i]),
					type : aDateType
				});
				oWeeklyCal.addSpecialDate(this.oSpecialDates[aDateArray[i]]);
			}
		},
		
		onTimerPickerChange : function(aControlEvent) {
			"use strict";			
			/* Get Changed Property*/
            var sId = aControlEvent.getSource().getCustomData()[0].getValue();
			var sPath = "/" + this.sDate + "/" + sId;
            var oWorkingHoursModel = this.getView().getModel("WorkingHours");
            var iMsoffset = ((new Date).getTimezoneOffset())*60*1000;
            /* Get StartHour, EndHour, sumHours and Next day Flag*/
            var oStart = oWorkingHoursModel.getProperty(sPath + "S");
            var oEnd = oWorkingHoursModel.getProperty(sPath + "E");
            var sStartValue = oStart !== null ? new Date(oStart.ms + iMsoffset) : new Date(0 + iMsoffset);
            var sEndValue   = oEnd !== null ? new Date(oEnd.ms + iMsoffset) : new Date(0 + iMsoffset);
           
            var sStartAnotherDay = oWorkingHoursModel.getProperty(sPath + "SF");
            var sEndAnotherDay = oWorkingHoursModel.getProperty(sPath + "EF");
            var oldHours = Number(this.getView().getModel("WorkingHours").getProperty(sPath+"H"));
            
            sStartValue = sStartAnotherDay === true ? new Date(sStartValue.setDate(sStartValue.getDate() + 1)) : sStartValue;
            sEndValue = sEndAnotherDay === true ? new Date(sEndValue.setDate(sEndValue.getDate() + 1)) : sEndValue;

            if (sStartValue && sEndValue) {
				var sNewHours = this._calculateTime(sId,sStartValue, sEndValue);
				this.getView().getModel("WorkingHours").setProperty(sPath+"H",sNewHours);
				this._sumHours(sId,Number(sNewHours),Number(oldHours));
			} else {
				this.getView().getModel("WorkingHours").setProperty(sPath+"H",null);
				this._sumHours(sId,0,Number(oldHours));
			}
            
            if (sId !== "WorkingHours"){
				this.getView().byId("WorkingHoursE").fireChange();
			}

		},

		changeHours : function(aHours){
			"use strict";
			var sHourText = this.oBundle.getText("ZF_HOURS");
			if(aHours && sap.ui.Device.system.phone) {
				return "(" + aHours + " " + sHourText + ")";
			}else{
				return null;
			}
		},
		
		changePCHours : function(aHours){
			"use strict";
			var sHourText = this.oBundle.getText("ZF_HOURS");
			if(aHours && !sap.ui.Device.system.phone) {
				return aHours + " " + sHourText;
			}else{
				return null;
			}
		},
		
		/* Delete 2017/04/26 change r059 */
//		_sumHours : function(aId,aNewHours,aOldHours) {
//			var sPath = "/" + this.sDate + "/";
//			var oWorkingHoursModel = this.getView().getModel("WorkingHours");
//			var oCalendar = this.getView().getModel("Calendar");
//			var nSumHours = Number(oWorkingHoursModel.getProperty(sPath + "TodayWorkingHours"));
//			Number(oWorkingHoursModel.getProperty(sPath + "LegalOvertime"));
//
//			/* Get Standard WorkingTime Daily & Weekly */
//			var fWorkingTimeDaily = Number(oWorkingHoursModel.getProperty(sPath + "WorkingTimeDaily"));
//			var fWorkingTimeWeekly = Number(oWorkingHoursModel.getProperty(sPath + "WorkingTimeWeekly"));
//			
//			/* Get Actual WorkingTime Weekly */
//			var fActualWorkingTimeWeekly = 0;
//			var fActualWorkingTimeDaily = 0;
//			var nIndex = this._changeDate(this.sDate).getDay() === 0 ? 6 : this._changeDate(this.sDate).getDay() - 1;
//			var nSubDay = Number(oCalendar.getProperty(sPath + "SubDay"));
//			
//			if (aId === "WorkingHours"){
//				nSumHours = aNewHours - aOldHours + nSumHours;
//			} else {
//				nSumHours = aOldHours - aNewHours + nSumHours;
//			}
//
//			var nHours = Number(nSumHours.toFixed(2)) >
//					Number(fWorkingTimeDaily.toFixed(2)) ?
//							fWorkingTimeDaily.toFixed(2) :
//								nSumHours.toFixed(2);
//								oWorkingHoursModel.setProperty(sPath + "TodayWorkingHours",nHours);
//			for (var iCount2 = 1; iCount2 < 8; iCount2++) {
//				for(var iCount = 0;iCount < 7;iCount++){
//					var sPathOther = "/" + this._changeDate(this._getDay(this.dBegda , iCount + 1)) + "/";
//					if (Number(oCalendar.getProperty(sPathOther + "SubDay")) === iCount2){
//						/* Get Actual WorkingTime Weekly Beside today */
//						var fLeftWorkingHoursWeekly = fWorkingTimeWeekly - fActualWorkingTimeWeekly;
//						
//						if (iCount !== nIndex) {
//							fActualWorkingTimeDaily = Number(oWorkingHoursModel.getProperty(sPathOther + "TodayWorkingHours")) +
//									Number(oWorkingHoursModel.getProperty(sPathOther + "LegalOvertime"));
//						} else {
//							fActualWorkingTimeDaily = nSumHours;
//						}
//						
//						/* Left hours is greater than daily working hour (8)*/
//		                 
//						if (iCount === nIndex) {
//							
//							oWorkingHoursModel.setProperty(sPathOther + "TodayWorkingHours",(fActualWorkingTimeDaily).toFixed(2));
//							
//							if ((fLeftWorkingHoursWeekly > fWorkingTimeDaily)) {
//								/*
//								 * Set actual Daily Working Hours greater than daily standard working hour (8)
//								 * Set actual Daily Overtime Hours as actual Daily Working Hours - daily working hour (8)
//								 */
//								if (fActualWorkingTimeDaily > fWorkingTimeDaily) {
//									oWorkingHoursModel.setProperty(sPathOther + "LegalOvertime",(Number(fActualWorkingTimeDaily) - Number(fWorkingTimeDaily)).toFixed(2));
//								} else {
//									oWorkingHoursModel.setProperty(sPathOther + "LegalOvertime",(Number(0)).toFixed(2));
//								}
//								
//							} else if (fActualWorkingTimeDaily > fLeftWorkingHoursWeekly) {
//								oWorkingHoursModel.setProperty(sPathOther + "LegalOvertime",(Number(fActualWorkingTimeDaily) - Number(fLeftWorkingHoursWeekly)).toFixed(2));
//							} else {
//								oWorkingHoursModel.setProperty(sPathOther + "LegalOvertime",(Number(0)).toFixed(2));
//							}
//							
//							if (nSubDay === 7) {
//								oWorkingHoursModel.setProperty(sPathOther + "LegalOvertime",(Number(0)).toFixed(2));
//							}
//						}
//						
//						fActualWorkingTimeWeekly = fActualWorkingTimeWeekly +
//							( Number(oWorkingHoursModel.getProperty(sPathOther + "TodayWorkingHours")) >
//							fWorkingTimeDaily ? fWorkingTimeDaily:
//								Number(oWorkingHoursModel.getProperty(sPathOther + "TodayWorkingHours")));
//						
//					} else
//						continue;
//				}
//			}
//		},
		
		/* Add 2017/04/26 change r059 */
		_sumHours : function(aId,aNewHours,aOldHours) {
			var sPath = "/" + this.sDate + "/";
			var oSelf = this;
			var oTimesheetData = this.getView().getModel("TimesheetData").getProperty("/"+ this.sDate +"/today");
			var oWorkingHoursModel = this.getView().getModel("WorkingHours");
			var oCalendar = this.getView().getModel("Calendar");
			var nSumHours = Number(oWorkingHoursModel.getProperty(sPath + "TodayWorkingHours"));
			var fWorkingTimeDaily = Number(oWorkingHoursModel.getProperty(sPath + "WorkingTimeDaily"));
			var nSubDay = Number(oCalendar.getProperty(sPath + "SubDay"));
			var bWorkingDay = oCalendar.getProperty(sPath + "SubWorkingDay");
			var nLegalOvertime;
			var nDeductionHours = 0;
			if (aId === "WorkingHours"){
				nSumHours = aNewHours - aOldHours + nSumHours;
			} else if (aId === "Break1" || aId === "Break2"){
				nSumHours = aOldHours - aNewHours + nSumHours;
			} 
			
			/* Set TodayWorkingHours */
			oWorkingHoursModel.setProperty(sPath + "TodayWorkingHours",nSumHours.toFixed(2));
			
			/* Set LegalOvertime */
			if( bWorkingDay === "TRUE" ){
				if(nSumHours > fWorkingTimeDaily){
					nLegalOvertime = nSumHours - fWorkingTimeDaily;
				} else {
					nLegalOvertime = 0;
				}
			} else {
				if ( nSubDay === 7 ){
					nLegalOvertime = 0;
				} else {
					nLegalOvertime = nSumHours;
				}
			}
			
			nLegalOvertime = nLegalOvertime - Number(oWorkingHoursModel.getProperty(sPath + "TimeHoliday1H"))
								- Number(oWorkingHoursModel.getProperty(sPath + "LateLeaveEarly1H"))
								- Number(oWorkingHoursModel.getProperty(sPath + "ChildRearing1H"))
								- Number(oWorkingHoursModel.getProperty(sPath + "ChildNursing1H"))
								- Number(oWorkingHoursModel.getProperty(sPath + "Care1H"));
			
			if(oSelf.oDeductionTsCd.length > 0){
				for (var i = 0;i<oTimesheetData.length;i++){
					$.each(oSelf.oDeductionTsCd,function(aIdxd, aItemd){
						if((oTimesheetData[i]["TSCdOutput"] === aItemd["TScd"]) && 
							(oTimesheetData[i]["DataFields"]["Catshours"])){
							nDeductionHours = nDeductionHours + Number(oTimesheetData[i]["DataFields"]["Catshours"]);
						}
					})
				}
			}
			
			nLegalOvertime = nLegalOvertime - nDeductionHours;
			
			nLegalOvertime = nLegalOvertime > 0 ? nLegalOvertime : 0;
			oWorkingHoursModel.setProperty(sPath + "LegalOvertime",nLegalOvertime.toFixed(2));
			
		},
		
//		onHourChange : function(aControlEvent){
//			
//            var oTimesheetData = this.getView().getModel("TimesheetData").getProperty("/"+ this.sDate +"/today");
//            var nSumHours = 0;
//            var oSelf = this;
//            var bFlag = false;
//            var nOldHours = oSelf.nOldDeductionTsCd;
//			if(oSelf.oDeductionTsCd.length > 0){
//				for (var i = 0;i<oTimesheetData.length;i++){
//					$.each(oSelf.oDeductionTsCd,function(aIdxd, aItemd){
//						if((oTimesheetData[i]["TSCdOutput"] === aItemd["TScd"]) && 
//							(oTimesheetData[i]["DataFields"]["Catshours"])){
//							nSumHours = nSumHours + Number(oTimesheetData[i]["DataFields"]["Catshours"]);
//							oSelf.nOldDeductionTsCd = nSumHours;
//							bFlag = true;
//						}
//					})
//				}
//			}
//			
//			if(!bFlag){
//				oSelf.nOldDeductionTsCd = 0;
//			}
//            
//			oSelf._sumHours("TSCD",nSumHours,nOldHours);
//            
//		},
		
		onHourChange : function(aControlEvent){
			
			this._sumHours("TSCD",0,0);
		},

		onTapOnDate : function(aControlEvent) {
			"use strict";
			var dOldDate = this._changeDate(this.sDate);
			var oWeeklyCal = this.byId("CalendarDateInterval");
			var oSelf = this;
			var dDate  = aControlEvent.getSource().getSelectedDates()[0].getStartDate();
			var oOkPressDeffered = new jQuery.Deferred();
			var oValidationDeferred = new jQuery.Deferred();
			var oI18n = oSelf.getOwnerComponent().getModel("i18n").getResourceBundle();
			/* If View Check OK */
			this._editCheck();
			if (this.oEditFlag[this.sDate]["WorkingHours"] || this.oEditFlag[this.sDate]["TimesheetData"]) {
				var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyy/MM/dd"});
				var sMessage = this.oBundle.getText("ZF_MSG021", oDateFormat.format(this.dCurrentDate));
				this._processConfirmMessageBox(sMessage, sap.m.MessageBox.Icon.WARNING,
						/*OK Processing*/
						function() {
							oOkPressDeffered.resolve();
						},
						/*Cancel Processing*/
						function(){
							oSelf.getView().byId("CalendarDateInterval").getSelectedDates()[0].setStartDate(dOldDate);
							oSelf.getView().byId("CalendarDateInterval").focusDate(dOldDate);
						}
				);
			} else {
				oOkPressDeffered.resolve();
			}
			
			oOkPressDeffered.then(function(){
				return oSelf._getDateValidation(oSelf.sPernr,dDate,dDate);
			}).then(function(aMessageArray,aDate){
				if ( aMessageArray.length > 0 ) {
					oSelf.getView().byId("CalendarDateInterval").getSelectedDates()[0].setStartDate(dOldDate);
					oSelf.getView().byId("CalendarDateInterval").focusDate(dOldDate);
					oSelf.dCurrentDate = dOldDate;
					oSelf.sDate = oSelf._changeDate(oSelf.dCurrentDate);
					oSelf._processMessage(aMessageArray,sap.m.MessageBox.Icon.ERROR,oI18n.getText("ZF_NUMBEROFERROR",aMessageArray.length));
				} else {
					oSelf.dCurrentDate = dDate;
					oSelf.sDate = oSelf._changeDate(dDate);
					oSelf.oEditFlag[oSelf.sDate] = {};
					oSelf.dBegda = oSelf._getDay(oSelf.dCurrentDate,1);
					oSelf.dEndda = oSelf._getDay(oSelf.dBegda,7);
					oSelf._updateModel();
					oSelf.getView().byId("CalendarDateInterval").focusDate(dDate);
				}
			});
		},

		_getDateValidation : function (aPernr,aBegda,aEndda){
			var oValidateDeferred = new jQuery.Deferred(); 
			var oMessageArray = [];
			var oMessage;
			var aSelf = this;
			
			aSelf.oDataManager.getDateValidationse(aPernr, aBegda, aEndda, function(aData) {
				$.each(aData, function(aIdx, aItem){
					if ( aItem["CheckFlag"] ) {
						oMessage = {
							code 	: aItem["MsgID"],
							num 	: aItem["MsgNumber"],
							message : aItem["MsgText"]
						}
						oMessageArray.push(oMessage);
					}
				});
				oValidateDeferred.resolve(oMessageArray,aData[0]["CurrentDate"]);
			});
			
			return oValidateDeferred;
		},

		_editCheck : function(){
			if(!this._deepCompare(this.oInitWorkHours[this.sDate],
					this.getView().getModel("WorkingHours").getProperty("/"+this.sDate))) {
						this.oEditFlag[this.sDate]["WorkingHours"] = true;
			} else {
				this.oEditFlag[this.sDate]["WorkingHours"] = false;
			}

			if (!this._deepCompare(this.oInitTimesheetData[this.sDate],
					this.getView().getModel("TimesheetData").getProperty("/"+this.sDate))){
						this.oEditFlag[this.sDate]["TimesheetData"] = true;	
			} else {
				this.oEditFlag[this.sDate]["TimesheetData"] = false;	
			}
		},

		_changeTime : function(aTime) {
			"use strict";
			if(aTime) {
				var iMsoffset = ((new Date).getTimezoneOffset())*60*1000;
				return new Date(aTime.ms + iMsoffset);
			} else {
				return null;
			}
		},
		
		_changeDate : function(aDate) {
			"use strict";
			var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyyMMdd"});
			if	(typeof aDate === "string"){
				var oDate = oDateFormat.parse(aDate);
				return oDate;
			} else {
				return oDateFormat.format(aDate);
			}
		},

		_calculateTime : function(aId, aStartDate, aEndDate) {
			"use strict";
			if (aId.substr(aId.length-12,12) === "WorkingHours") {
				return this._calculateWorkHours(aStartDate, aEndDate);
			} else if (aId === "Break1" || aId === "Break2") {
				return ((aEndDate - aStartDate) / 3600 / 1000).toFixed(2).toString();
			} else {
				var iDeviation = this._getOverlapTime(aStartDate, aEndDate);
				return ((aEndDate - aStartDate - iDeviation / 2) / 3600 / 1000).toFixed(2);
			} 
		},
		
		_calculateWorkHours : function(aStartDate, aEndDate) {
			"use strict";
			if (((this.getView().getModel("Calendar").getProperty("/"+this.sDate+"/WorkingDay") === "FALSE") && 
				(!this.getView().getModel("WorkingHours").getProperty("/"+this.sDate+"/CompensatingDay"))) || 
				((this.getView().getModel("Calendar").getProperty("/"+this.sDate+"/WorkingDay") === "TRUE")&&
				(this.getView().getModel("WorkingHours").getProperty("/"+this.sDate+"/CompensatingDay")))) {
				return ((aEndDate - aStartDate) / 3600 / 1000).toFixed(2);
			} else {
				var iDeviation = this._getOverlapTime(aStartDate, aEndDate);
				return ((aEndDate - aStartDate - iDeviation / 2) / 3600 / 1000).toFixed(2);
			}
		},

		_getOverlapTime: function(aStartDate, aEndDate) {
			"use strict";
			var oStartRestDate = (new Date(aStartDate)).setHours(12,0);
			var oEndRestDate   = (new Date(aStartDate)).setHours(13,0);
			/* Calculate offset times */
				var iOffset = (aEndDate - aStartDate) + 
								(oEndRestDate - oStartRestDate) - 
								Math.abs(aStartDate - oStartRestDate) - 
								Math.abs(aEndDate - oEndRestDate)
			
			var iDeviation;
			/* if offset < 0, means there is no offset times */
			if (iOffset < 0) {
				iDeviation = 0;
			} else {
				iDeviation = iOffset;
			}
			return iDeviation;
		},
		
		addNewButtonPressHandler : function() {
			"use strict";
			var oNewTab = this._createEngagementTab();
			var oTabContainer = this.getView().byId("myTabContainer");
			var oTimesheetDataModel = this.getView().getModel("TimesheetData");
			var data = oTimesheetDataModel.getData();
			oTabContainer.addItem(oNewTab);
			oTabContainer.setSelectedItem(oNewTab);
			data[this.sDate]["today"].push({
				"Pernr" : this.sPernr,
				"TSCdOutput": "",
				"Status":"",
				"WorkDate" : this._cvtDateToDb(this.dCurrentDate),
				"DataFields"  : {
					"Pernr" : this.sPernr,
					"ClntCd" :	"",
					"TsSbCd" :	"",
					"Land"	 :	"",
					"Regio"	 :	"",
					"Cityc"  :	"",
					"Appointapp" :  "",
					"Catshours" : null,
					"Workdate" : this._cvtDateToDb(this.dCurrentDate)                    					
				}
			});
			oTimesheetDataModel.setData(data,false);
		},
		
		/*
		 * Create Form to input Timesheet information
		 */
		_createEngagementTab : function() {
			"use strict";
			var oTabContainerItem = sap.ui.xmlfragment("sap.ZG001.timesheet.input.dailyDemo.view.TabContainerItem",
					this);
			return oTabContainerItem;
		},

		itemCloseHandler : function(oControlEvent) {
			"use strict";
			var sMessage = this.oBundle.getText("ZF_MSG020");
			var oTabContainerItems = this.getView().byId("myTabContainer").getItems();
			var sItemPath = oControlEvent.getParameter("item").getBindingContext("TimesheetData").getPath();
			var aSelf = this;
			var oSettingInfoModel = this.getView().getModel("SettingInfo");
			var oItem = oControlEvent.getParameter("item");
			
			oControlEvent.bPreventDefault = true;
			if (!(oSettingInfoModel.getProperty("/" + this.sDate + "/WorkingHoursEditable"))) {
				return;
			}
			this._processConfirmMessageBox(sMessage, sap.m.MessageBox.Icon.WARNING, function(){
				"use strict";
				var oTabContainerItems = aSelf.getView().byId("myTabContainer").getItems();
				var oTimesheetDataModel = aSelf.getView().getModel("TimesheetData");
				var oData = oTimesheetDataModel.getData();
				
				if (oTabContainerItems.length === 1) {
					oData[aSelf.sDate]["today"][0] = {
							"Pernr":aSelf.sPernr,
							"ClientNameOutput":"",
							"TSTextOutput" :"",
							"Status":"" ,
							"WorkDate":aSelf._cvtDateToDb(aSelf.dCurrentDate),
							"TSCdOutput":"",
							"DataFields" : {
								"Pernr":"",
								/*"SeqNo":"",*/
								"ClntCd":"",
								/*"ClientName":"",*/
								"TsMaCd":"",
								"TsSbCd":"",
								"Land":"",
								"Regio":"",
								"Cityc":"",
								"Appointapp":"",
								"Catshours":null,
								"Workdate":aSelf._cvtDateToDb(aSelf.dCurrentDate),
								"Status":""
							}
					};
					oTimesheetDataModel.setData(oData,false);
					aSelf.getView().byId("myTabContainer").getObjectBinding("TimesheetData").refresh(true);
					aSelf.onHourChange();
					return;
				} else {
					aSelf.getView().byId("myTabContainer").removeItem(oItem);
					oItem.destroy();
				}
				var oDeleteData = oData[aSelf.sDate]["today"][parseInt(sItemPath.substr(sItemPath.length-1,1),10)];
				if (oDeleteData["Counter"]) {
					aSelf.oDeleteItem.push(oDeleteData);
				}
				
				oData[aSelf.sDate]["today"].splice(parseInt(sItemPath.substr(sItemPath.length-1,1),10),1);
				oTimesheetDataModel.setData(oData,false);
				aSelf.onHourChange();
				
			});
		},
		
		setTabContainerItemHeaderText: function(aTimesheetMainCode) {
			"use strict";
			if (aTimesheetMainCode) {
				return aTimesheetMainCode;
			} else {
				return this.oBundle.getText("ZF_TBCHEADER_TEXT")
			}
		},
		
		onPressAdd : function(aEvent) {
//			"use strict";
//			var sElement = aEvent.getSource().getCustomData()[0].getValue();
//			var bDisplayFlag = this.getView().getModel("screenModel").getProperty("/" + sElement + "Visible");
//			if (bDisplayFlag) {
//				this.getView().getModel("screenModel").setProperty("/" + sElement + "Visible",false);
//				this.getView().getModel("screenModel").setProperty("/" + sElement + "Icon","sap-icon://add");
//			} else {
//				this.getView().getModel("screenModel").setProperty("/" + sElement + "Visible",true);
//				this.getView().getModel("screenModel").setProperty("/" + sElement + "Icon","sap-icon://less");
//			}

		},
		onPressAddWorkingHours : function(aEvent) {
			"use strict";

			this.getView().byId("BT_WorkingHours").setVisible(false);
			this.getView().byId("BT_WorkingHoursPhone").setVisible(false);
//			if ( this.fieldCount <= 10){ 
//				var oContainer = this.getView().byId("worktimeAssignmentContainer");
//				var iIndex = oContainer.getAggregation("formElements").length - 3;
//				var oWorkingHours = this.getView().getModel("WorkingHours").getData()[this.sDate];
//				var oElement = {
//						"Label" : this.oBundle.getText("ZF_TIMELEV1"),
//						"Start" : oWorkingHours.Break1S,
//						"End"   : oWorkingHours.Break1E,
//						"Hours" : oWorkingHours.Break1H,
//						"Add" : true,
//						"Cancel" : false
//						}
//				
//				if (this.aFormElements && this.aFormElements.length > 0) {
//					this.aFormElements.forEach(function(currentValue, index, arr){
//						currentValue.Add = false;
//						currentValue.Cancel = false;
//						
//					});				
//				}
//
//				this.aFormElements.push(this._deepCopy(oElement));
//				
//				var oFormElementFragment = sap.ui.xmlfragment("sap.ZG001.timesheet.input.dailyDemo.view.FormElement",
//						this);
//				oFormElementFragment.bindObject({
//					path : "/" + this.fieldCount,
//					model : "FormElements"
//				});
//				this.getView().getModel("FormElements").updateBindings(true);
//				
//				oContainer.insertFormElement(oFormElementFragment,iIndex)
//				this.fieldCount ++;
//			}
			/* Model for RestType */
			var oRestType = new sap.ui.model.json.JSONModel({
				"Selections" : [
					{
						"Text" : this.oBundle.getText("ZF_REST1"),
						"Id"   : "Break"
					},
					{
						"Text" : this.oBundle.getText("ZF_REST2"),
						"Id"   : "Break"
						},
					{
						"Text" : this.oBundle.getText("ZF_TIMELEV1"),
						"Id"   : "TimeHoliday"
					},
					{
						"Text" : this.oBundle.getText("ZF_LATELEAVE1"),
						"Id"   : "LateLeaveEarly"
					},
					{
						"Text" : this.oBundle.getText("ZF_SUPCHILD1"),
						"Id"   : "ChildRearing"
					},
					{
						"Text" : this.oBundle.getText("ZF_CARCHILD1"),
						"Id"   : "ChildNursing"
					},
					{
						"Text" : this.oBundle.getText("ZF_NURCARE1"),
						"Id"   : "Care"
					}
				]
			},false);
			
			if (!this._oDialogRestType) {
				this._oDialogRestType = sap.ui.xmlfragment("sap.ZG001.timesheet.input.dailyDemo.view.RestTypeSelection", this);
				this._oDialogRestType.setModel(oRestType);
			}
  
			// clear the old search filter
			this._oDialogRestType.getBinding("items").filter([]);
 
			// toggle compact style
			jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this._oDialogRestType);
			this._oDialogRestType.open();
		},
		
		handleClose: function(oEvent) {
			"use strict";
			
			var aContexts = oEvent.getParameter("selectedContexts");
			var oContainer = this.getView().byId("worktimeAssignmentContainer");
			
			if (aContexts.length) {
				aContexts.map(function(oContext) {
					this.addNewFormElement(oContext);
				}.bind(this));
			}
			oEvent.getSource().getBinding("items").filter([]);
		},
		
		onTabChange : function(oEvent) {
			"use strict";
			
//			if ( oEvent.getParameter("selectedKey") !== "WorkingHours"){
//				this.getView().byId("tabPanel").setVisible(false);
//			} else {
//				this.getView().byId("tabPanel").setVisible(true);
//			}
		},
		
		addNewFormElement : function (aContext){
			"use strict";
			
			if ( this.fieldCount <= 10){ 
				var oContainer = this.getView().byId("worktimeAssignmentContainer");
				var iIndex = oContainer.getAggregation("formElements").length - 4;
				var oWorkingHours = this.getView().getModel("WorkingHours").getData()[this.sDate];
				var oElement = {
						"Label" : aContext.getObject().Text,
						"Start" : oWorkingHours.Break1S,
						"End"   : oWorkingHours.Break1E,
						"Hours" : oWorkingHours.Break1H,
						"Add" : true,
						"Cancel" : false
						}
				
				this.aFormElements.forEach(function(currentValue, index, arr){
					currentValue.Add = false;
					currentValue.Cancel = false;
					
				});
				this.aFormElements.push(this._deepCopy(oElement));
				
				var oFormElementFragment = sap.ui.xmlfragment("sap.ZG001.timesheet.input.dailyDemo.view.FormElement",
						this);
				oFormElementFragment.bindObject({
					path : "/" + this.fieldCount,
					model : "FormElements"
				});
				this.getView().getModel("FormElements").updateBindings(true);
				
				oContainer.insertFormElement(oFormElementFragment,iIndex)
				this.fieldCount ++;
			}
			
		},
		
		_deepCopy: function(aData) {
			"use strict";
			if (aData !== null) {
				var oResult = aData.constructor === Array ? [] : {};
				if(aData.constructor === Date){
					oResult = aData;
				}
				for ( var i in aData) {
					if (aData.hasOwnProperty(i)) {
						oResult[i] = typeof aData[i] === "object" ? this._deepCopy(aData[i]) : aData[i];
					}
				}
				return oResult;   	
			} else {
				return null;
			}
		},
		
		_deepCompare: function(aObject1,aObject2) {
			"use strict";
			/* If both sObject1 and sObject2 are null or undefined and exactly the same*/
			if ( aObject1 === aObject2 ) { 
				return true;
			}

			/* If they are not strictly equal, they both need to be Objects*/
			if ( !( aObject1 instanceof Object ) || !( aObject2 instanceof Object ) ) {
				return false;
			}
			/* They must have the same prototype chain,the closest we can*/
			/* do is*/
			/* test the constructor.*/
			if ( aObject1.constructor !== aObject2.constructor ) {
				return false;
			}
			var oProperty;
			for (oProperty in aObject1 ) {
				 /*Inherited properties were tested using sObject1.constructor ===*/
				 /*sObject2.constructor*/
				if ( aObject1.hasOwnProperty( oProperty ) ) {
					/* Allows comparing sObject1[ p ] and sObject2[ p ] when set to undefined*/
					if (!aObject2.hasOwnProperty( oProperty ) ) {
						return false;
					}
					/* If they have the same strict value or identity then they are*/
					/* equal*/
					if ( aObject1[ oProperty ] === aObject2[ oProperty ] ) {
						continue;
					}
					/* Numbers, Strings, Functions, Booleans must be strictly equal*/
					if ( typeof ( aObject1[ oProperty ] ) !== "object" ) {
						return false;
					}
					/* Objects and Array must be tested recursively*/
					if ( !this._deepCompare( aObject1[ oProperty ], aObject2[ oProperty ] ) ) {
						return false;
					}
				}
			}

			for ( oProperty in aObject2 ) {
				/* allows sObject1[ p ] to be set to undefined*/
				if ( aObject2.hasOwnProperty( oProperty ) && !aObject1.hasOwnProperty( oProperty ) ) {
					return false;
				}
			}
			return true;
		},
		
		onProxyChange: function(aControlEvent) {
			"use strict";
			var oValue = aControlEvent.getSource().getValue();
			var oScreenModel = this.getView().getModel("screenModel");
			oScreenModel.setProperty("/ProxyPernr" , oValue);
			oScreenModel.setProperty("/ProxyPernrName" , "");
		},
		
		_getDay: function(aDate, aOffset) {
			"use strict";
			var oDate = new Date(aDate.toString());
			return new Date(oDate.setDate(oDate.getDate() - (oDate.getDay() === 0 ? 7:oDate.getDay()) + aOffset))
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

		formatValueTypeText: function(aValueType) {
			if (aValueType !== "") {
				return this.oBundle.getText("ZF_" + aValueType);
			} else {
				return "";
			}
		},

		ApproverType : sap.ui.model.SimpleType.extend("ApproverType", {
			formatValue: function (aValue) {
				if (aValue === "00000000") {
					return "";
				} else {
					return aValue;
				}
			},

			parseValue: function (aValue) {
				return aValue;
			},
			
			validateValue: function (aValue) {
			}
			
		}),
		
		WorkingTime : sap.ui.model.odata.type.Time.extend("WorkingTime", {
			parseValue: function (aValue, aSourceType) {
				var oInitialTime = {
						__edmType : "Edm.Time",
						ms : 0
				};
				var oTime = sap.ui.model.odata.type.Time.prototype.parseValue(aValue, aSourceType);
				if (!oTime) {
					return oInitialTime;
				} else {
					return oTime;
				}				
	        }
		}),
		_initView: function() {
//			"use strict";
//			var oView = this.getView();
//			var oFieldGroup = sap.ui.getCore().byFieldGroupId("ZZInputField");
//			var aId = ["WorkingHours","Break1","Break2","TimeHoliday1","TimeHoliday2","LateLeaveEarly1","LateLeaveEarly2",
//			           "ChildRearing1","ChildRearing2","ChildNursing1","ChildNursing2","Care1","Care2"];
//
//			for( var iCount = 0; iCount<aId.length; iCount++ ) {
//				
//					oView.byId(aId[iCount] + "S").setValueState("None");
//					oView.byId(aId[iCount] + "E").setValueState("None");	
//			}
//			
//			$.each(oFieldGroup, function(aIdx, aItem){						
//				aItem.setValueState("None");
//				aItem.setValue("");
//			});
			
		},
		_navToLaunchpad: function() {
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
			})
		},
		onProxyPress: function() {
			"use strict";
			var oSelf = this;
			var sPernr;
			if (!this._oDialogSubEntry) {
				this._oDialogSubEntry = sap.ui.xmlfragment(
						"sap.ZG001.timesheet.input.dailyDemo.view.SubEntry",
						this);
				this.getView().addDependent(this._oDialogSubEntry);
			}
			
			var oInput = sap.ui.getCore().byId("myInput");
			/*var oInput = this._oDialogSubEntry.getAggregation("content")[0].getAggregation("fixContent")[0].getAggregation("items")[0];*/

			jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(),
					this._oDialog);
			this._oDialogSubEntry.open();
			oInput.setValueState("None");
			
			if (this.sSourceScreenMode === "1"){
				oSelf.oDataManager.getRootPernr(function(oResults){
					sPernr = oResults[0]["Pernr"];
					oSelf.oDataManager.getSubEntry(sPernr, function(aData) {
						oSelf.getView().getModel("SubEntry").setData(aData,false);
					});
				});
			}
			
			oInput.addEventDelegate({
				onAfterRendering: function() {
					$(".ZZNumberOnly").keypress(function(event) {
						var keyCode = event.which;
						if (keyCode == 46 || (keyCode >= 48 && keyCode <=57))
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

			this._oDialogSubEntry.attachAfterClose(function(){
				if(!oSelf.sPernr){
					/* Go back to Menu Screen */
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
				}
			});
		},
		
		handleSubEntryOKPress: function(aControlEvent) {
			"use strict";
			var sPernr = this.getView().getModel("screenModel").getProperty("/ProxyPernr");
			var oSelf = this;
			var oInput = sap.ui.getCore().byId("myInput");
			var bError = false;
			
			if(oInput.getValueState() === "Error") {
				bError = true;
				oInput.focus();
			} else {
				if (this.sSourceScreenMode === "1"){
					this.sPernr = sap.ui.getCore().byId("myProxy").getSelectedKey();
				} else if (this.sSourceScreenMode === "2") {
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
				this.bFirst = true;
				this.oRetrievePernrDeferred.resolve();
				this._updateModel();
				this._oDialogSubEntry.close();
			}
		},
		
		handleSubEntryCancelPress: function(aControlEvent) {
			"use strict";
			this.getView().getModel("screenModel").setProperty("/ProxyPernr",this.sPernr);
			this._oDialogSubEntry.close();
		},
		
		/* for Screen display Datetime value conversion */
		_cvtDateToScreen : function(aDbDate){
			return new Date(aDbDate.getUTCFullYear(), aDbDate.getUTCMonth(), aDbDate.getUTCDate(), 0, 0, 0);
		},
		/* for DB update Datetime value conversion */
		_cvtDateToDb : function(aScreenDate){
			return new Date(Date.UTC(aScreenDate.getFullYear(), aScreenDate.getMonth(), aScreenDate.getDate(), 0, 0, 0));
		},	    /* Handle Search Help for Approver */
	    handleApproverSearchHelp: function(aControlEvent) {
			"use strict";
			var sBindingPath = aControlEvent.getSource().oPropagatedProperties.oBindingContexts.TimesheetData.getPath();
			var oTimesheetModel = this.getView().getModel("TimesheetData");
			var oItem = aControlEvent.getSource();
			ApproverHelp.open().then(function(aRet) {
				if (aRet) {
					oTimesheetModel.setProperty(sBindingPath + "/DataFields/Appointapp",aRet["Pernr"]);
					oTimesheetModel.setProperty(sBindingPath + "/ApproverName",aRet["Ename"]);
					oItem.setValueState("None");
					oItem.getBinding("value").refresh(true);
				}
			});
	    },
	    /* Handle Search Help for Client */
	    handleClientSearchHelp: function(aControlEvent) {
			"use strict";
			var sBindingPath = aControlEvent.getSource().oPropagatedProperties.oBindingContexts.TimesheetData.getPath();
			var oTimesheetModel = this.getView().getModel("TimesheetData");
			var oItem = aControlEvent.getSource();
			var sCurrentLocale = sap.ui.getCore().getConfiguration().getLanguage();
			ClientHelp.open().then(function(aRet) {
				if (aRet) {
					oTimesheetModel.setProperty(sBindingPath + "/DataFields/ClntCd",aRet["ZclntCd"]);
					if (sCurrentLocale === "ja"){
						oTimesheetModel.setProperty(sBindingPath + "/ClientNameOutput",aRet["ZclntoNm"]);                                                            
	                }else{
	                	oTimesheetModel.setProperty(sBindingPath + "/ClientNameOutput", aRet["ZclnteNm"]);
	                }
					oItem.setValueState("None");
					oItem.getBinding("value").refresh(true);
				}
			});
	    },
	    /* Handle Search Help for Timesheet */
	    handleTSSearchHelp: function(aControlEvent) {
			"use strict";
			var sBindingPath = aControlEvent.getSource().oPropagatedProperties.oBindingContexts.TimesheetData.getPath();
			var oTimesheetModel = this.getView().getModel("TimesheetData");
			var oTSItem = aControlEvent.getSource();
            var oClientItem = this._getNeighborClientInput(oTSItem);
            var oSubCdItem = oTSItem.getParent().getAggregation("fields")[1];
            var oSelf = this;
            
			TSHelp.open().then(function(aRet) {
				if (aRet) {
					oTimesheetModel.setProperty(sBindingPath + "/TSCdOutput",aRet["ZtsMaCd"]);
					oTimesheetModel.setProperty(sBindingPath + "/TSTextOutput",aRet["ZtsTx"]);
					oTimesheetModel.setProperty(sBindingPath + "/DataFields/TsSbCd",aRet["ZtsSbCd"]);
					oTimesheetModel.setProperty(sBindingPath + "/DataFields/ClntCd",aRet["ZclntCd"]);
					oTimesheetModel.setProperty(sBindingPath + "/ClientNameOutput",aRet["ZclntoNm"]);
					oTSItem.setValueState("None");
					oTSItem.getBinding("value").refresh(true);
					oClientItem.setValueState("None");
					oClientItem.getBinding("value").refresh(true);
					oSubCdItem.setValueState("None");
					oSubCdItem.getBinding("value").refresh(true);
					oSelf.onHourChange();
				}
			});
	    },
	    
	    _getNeighborClientInput: function(aTSInput) {
	    	var oClientInput = aTSInput.getParent().
	    			getParent().
	    			getAggregation("formElements")[0].
	    			getAggregation("fields")[0];
	    	return oClientInput;
	    },
	    
	    /* Handle Search Help for Employee */
	    handleEmployeeSearchHelp: function(aControlEvent) {
			"use strict";
			var oItem = aControlEvent.getSource();
			var oSelf = this;
			EmployeeHelp.open().then(function(aRet) {
				if (aRet) {
					oSelf.getView().getModel("screenModel").setProperty("/ProxyPernr", aRet["Pernr"]);
					oSelf.getView().getModel("screenModel").setProperty("/ProxyPernrName", aRet["Ename"]);
					oItem.setValueState("None");
					oItem.getBinding("value").refresh(true);
				}
			});
	    },
	    
	    itemSelectHandler: function(aControlEvent){
	    	if(typeof aControlEvent.getParameter("item") !== "undefined"){
		    	aControlEvent.getParameter("item").getAggregation("content")[0].addEventDelegate({
		    		onAfterRendering: function() {
						$(".ZZNumberOnly").keypress(function(event) {
							var keyCode = event.which;
							if (keyCode == 46 || (keyCode >= 48 && keyCode <= 57))
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
	    	}
	    },
	    
	    onChangeCode : function(aEvent){
	    	"use strict";			
	    	var oSelf = this;
			/* Get Changed Element */
            var sId = aEvent.getSource().getCustomData()[0].getValue();
            var sState = aEvent.getSource().getValueState();
            var oInput = aEvent.getSource();
            if(sState === "Error"){
            	return;
            }
            
            if(sId !== "SubEntry"){
                var sPath = aEvent.getSource().oPropagatedProperties.oBindingContexts.TimesheetData.getPath();
                var oTimesheet = oSelf.getView().getModel("TimesheetData");
            }

            switch(sId) {
			case "Client":
				var sClntCd = jQuery.trim(oTimesheet.getProperty(sPath+"/DataFields/ClntCd"));
				if(sClntCd && sClntCd !== ""){
					oSelf.oDataManager.getClientText(sClntCd,function(aData){
						oTimesheet.setProperty(sPath+"/ClientNameOutput",aData["ClientNameOutput"]);
					});
				} else {
					oTimesheet.setProperty(sPath+"/ClientNameOutput","");
				}
				break;
			case "Timesheet Cd":
				var sTsMnCd = jQuery.trim(oTimesheet.getProperty(sPath+"/TSCdOutput"));
				var sTsSbCd = oTimesheet.getProperty(sPath+"/DataFields/TsSbCd");
				var oClientInput = oInput.getParent()
									.getParent()
									.getAggregation("formElements")[0]
									.getAggregation("fields")[0];
				if(sTsMnCd && sTsMnCd !== ""){
					oSelf.oDataManager.getTimesheetCodeText(sTsMnCd,sTsSbCd,function(aData){
						oTimesheet.setProperty(sPath+"/TSTextOutput",aData["TSTextOutput"]);
						oClientInput.setValueState("None");
						oClientInput.getBinding("value").refresh(true);
						oTimesheet.setProperty(sPath+"/DataFields/ClntCd",aData["ClntCd"]);
						oTimesheet.setProperty(sPath+"/ClientNameOutput",aData["ClientNameOutput"]);
					});
				} else {
					oTimesheet.setProperty(sPath+"/TSTextOutput","");
					oClientInput.setValueState("None");
					oClientInput.getBinding("value").refresh(true);
					oTimesheet.setProperty(sPath+"/DataFields/ClntCd","");
					oTimesheet.setProperty(sPath+"/ClientNameOutput","");
				}
				oSelf.onHourChange();
				break;
			case "TimsheetSub":
				var sTsMnCd = jQuery.trim(oTimesheet.getProperty(sPath+"/TSCdOutput"));
				var sTsSbCd = oTimesheet.getProperty(sPath+"/DataFields/TsSbCd");
				var oClientInput = oInput.getParent()
									.getParent()
									.getAggregation("formElements")[0]
									.getAggregation("fields")[0];
				if(sTsMnCd && sTsMnCd !== ""){
					oSelf.oDataManager.getTimesheetCodeText(sTsMnCd,sTsSbCd,function(aData){
						oTimesheet.setProperty(sPath+"/TSTextOutput",aData["TSTextOutput"]);
						oClientInput.setValueState("None");
						oClientInput.getBinding("value").refresh(true);
						oTimesheet.setProperty(sPath+"/DataFields/ClntCd",aData["ClntCd"]);
						oTimesheet.setProperty(sPath+"/ClientNameOutput",aData["ClientNameOutput"]);
					});
				} else {
					oTimesheet.setProperty(sPath+"/TSTextOutput","");
					oClientInput.setValueState("None");
					oClientInput.getBinding("value").refresh(true);
					oTimesheet.setProperty(sPath+"/DataFields/ClntCd","");
					oTimesheet.setProperty(sPath+"/ClientNameOutput","");
				}
				break;
			case "Approver":
				var sApprover = oTimesheet.getProperty(sPath+"/DataFields/Appointapp");
				if(sApprover && sApprover !== "00000000"){
					oSelf.oDataManager.getApproverName(sApprover,function(aData){
						oTimesheet.setProperty(sPath+"/ApproverName",aData["ApproverNameO"]);
					});
				} else {
					oTimesheet.setProperty(sPath+"/ApproverName","");
				}
				break;
			case "SubEntry":
				var sPernr = oSelf.getView().getModel("screenModel").getProperty("/ProxyPernr");
				if (sPernr && sPernr !== "00000000") {
					oSelf.oDataManager.getApproverName(sPernr,function(aData){
						oSelf.getView().getModel("screenModel").setProperty("/ProxyPernrName",aData["ApproverNameO"]);
					});
				} else {
					oSelf.getView().getModel("screenModel").setProperty("/ProxyPernrName","");
				}
				break;
			default :
				break;
			}
            
	    },
	    
		fmtCompensatingDayLabel: function(aWorkingDayFlag, aCompensatingDay) {
			if(aWorkingDayFlag === "FALSE" ){
				if (aCompensatingDay) {
					return this.oBundle.getText("ZF_SUBHOLI");
				} else {
					return this.oBundle.getText("ZF_SUBWORK");
				}
			} else if (aCompensatingDay) {
				return this.oBundle.getText("ZF_SUBWORK");
			} else {
				return this.oBundle.getText("ZF_SUBHOLI");
			}
		},
		typCodeText  : sap.ui.model.CompositeType.extend("typCodeText", {
			formatValue: function (aValue) {
				if (typeof (aValue) === "undefined") {
					/* When Approver cd is "00000000", display as blank */
					return "";
				} else {
					/* When Approver cd is not "00000000", display it as original */
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
		})
	});
});