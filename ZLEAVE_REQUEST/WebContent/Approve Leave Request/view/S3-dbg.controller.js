/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.require("sap.ca.scfld.md.controller.BaseDetailController");
jQuery.sap.require("sap.ca.ui.dialog.factory");
jQuery.sap.require("hcm.approve.leaverequest.util.Conversions");
jQuery.sap.require("hcm.approve.leaverequest.util.CalendarServices");
jQuery.sap.require("sap.ca.ui.message.message");
/*global hcm:true*/
sap.ca.scfld.md.controller.BaseDetailController.extend("hcm.approve.leaverequest.view.S3", {

	extHookChangeFooterButtons: null,

	onInit: function() {
		"use strict";
		this.resourceBundle = this.oApplicationFacade.getResourceBundle();
		this.oDataModel = this.oApplicationFacade.getODataModel();
		this.oView = this.getView();
		this.mailSubject = "";
		this.msg = "";
		this.dateFilter = "";
		this.oNextItemContext = null;
		this.sApprovingOperation = null;
		this.oApprovingRequest = null;

		this.oRouter.attachRouteMatched(function(oEvent) {

			if (oEvent.getParameter("name") === "detail") {
				this.oNextItemContext = new sap.ui.model.Context(this.oView.getModel(), "/" + oEvent.getParameter("arguments").contextPath);
				var sDetailTabContextPath = oEvent.getParameter("arguments").contextPath;
				var data = this.oDataModel.getProperty("/" + sDetailTabContextPath);
				this.oBusyDialog = new sap.m.BusyDialog();
				if (data === undefined) {
					this.oBusyDialog.open();
					this.oDataModel.read("/LeaveRequestSet", null, null, true, jQuery.proxy(this._handleSuccess, this), jQuery.proxy(this._handleFailure,
						this));
				} else {
					this.initializeData(data);
				}
				if (this.oView.byId("LRAtc").getSelectedKey() !== "contentInfo") {
					this.oView.byId("LRAtc").setSelectedKey("contentInfo");
				}
			}
		}, this);
		this.oBusyDialog = new sap.m.BusyDialog();
		this.jsonModel = new sap.ui.model.json.JSONModel();
		this.getView().setModel(this.jsonModel, "NewModel");
	},

	_handleSuccess: function(odata) {
		var o = new sap.ui.core.routing.HashChanger(),
			i;
		var url = o.getHash();
		var context = url.split("'")[1];
		for (i = 0; i < odata.results.length; i++) {
			if (odata.results[i].RequestId === context) {
				var data = odata.results[i];
				break;
			}
		}
		this.oBusyDialog.close();
		this.initializeData(data);

	},

	_handleFailure: function(oError) {
		"use strict";
		this.oBusyDialog.close();
		sap.ca.ui.message.showMessageBox({
			type: sap.ca.ui.message.Type.ERROR,
			message: oError.message,
			details: oError.response.body
		});
	},

	initializeData: function(data) {
		if (data && data.Note) {
			var oDataNotes = hcm.approve.leaverequest.util.Conversions._parseNotes(data.Note);
			if (oDataNotes.NotesCollection) {
				var oNotesModel = new sap.ui.model.json.JSONModel(oDataNotes);
				this.byId("NotesList").setModel(oNotesModel, "notes");
			}
		}
		if (data && data.Fileattachments) {
			var oDataFiles = hcm.approve.leaverequest.util.Conversions._parseAttachments(data.Fileattachments, data.RequestId, this.oDataModel);
			if (oDataFiles.AttachmentsCollection) {
				var attachmentsModel = new sap.ui.model.json.JSONModel(oDataFiles);
				this.byId("S3_FILE_LIST").setModel(attachmentsModel, "files");
			}
		}
		// Note 2286172: Overlaps might already be determined?
		if(data.CalculateOverlaps) {
			this._onOverlapCallSuccess(data);
			data.CalculateOverlaps = ""; // Prevent overlap reuse for next time the item is selected
		} else {
			var begda = data.StartDate;
			var odate = new Date();
			var oStartDate = hcm.approve.leaverequest.util.CalendarServices.setDateType(odate.setTime(begda));
			var EndDate = hcm.approve.leaverequest.util.CalendarServices.setDateType(odate.setTime(data.EndDate));
			var param = "RequestId='" + data.RequestId + "'," + "RequesterName='" + encodeURIComponent(data.RequesterName) + "'," + "RequesterNumber='" + data.RequesterNumber +
				"'," + "StartDate=datetime'" + encodeURIComponent(oStartDate) + "'," + "EndDate=datetime'" + encodeURIComponent(EndDate) + "'";                                     //NOTE 2263678              
			this.oDataModel.read("/LeaveRequestSet(" + param + ")", null, null, true,
				jQuery.proxy(this._onOverlapCallSuccess, this),
				jQuery.proxy(this._onOverlapCallFail, this)
			);
			this.oBusyDialog.open();
			//	var overlapList = hcm.approve.leaverequest.util.Conversions._parseOverlapPernr(data.OverlapList);
		}
	},

	_onOverlapCallSuccess: function(odata) {
		this.oBusyDialog.close();
		
		// Update binding context of the view, since the item is now completely loaded
		this.oView.setBindingContext(this.oNextItemContext);
		this.oNextItemContext = null;
		
		var overlapVisible = this.byId("Overlaps");
		var overlapText = this.byId("OverlapListLabel");
		var overlapList = this.byId("OverlapList");
		var overlapCalendar = this.byId("S3_OverlapCalendar");
		if (odata.Overlaps) {
			overlapVisible.setVisible(true);
			overlapText.setText(hcm.approve.leaverequest.util.Conversions.formatterOverlaps(odata.Overlaps));
			overlapList.setText(hcm.approve.leaverequest.util.Conversions._parseOverlapList(odata.OverlapList));
			overlapCalendar.setVisible(true);
			overlapCalendar.setCount(odata.Overlaps);
		} else {
			overlapVisible.setVisible(false);
			overlapCalendar.setVisible(false);
		}
		var oLapList = hcm.approve.leaverequest.util.Conversions._parseOverlapPernr(odata.OverlapList);
		var oCal = this.byId("OverlapCalendar2");
		var begda = odata.StartDate;
		var odate = new Date();
		var oStartDate = hcm.approve.leaverequest.util.CalendarServices.setDateType(odate.setTime(begda));
		//oCal.setStartDate(oStartDate); // FA 2299607
		var endda, oEndDate;
		if ((odata.EndDate).getDate() > (odata.StartDate).getDate() + 13) {
			endda = new Date(odata.EndDate);
			oEndDate = hcm.approve.leaverequest.util.CalendarServices.setDateType(endda.setDate(endda.getDate()));
		} else {
			endda = new Date(odata.StartDate);
			oEndDate = hcm.approve.leaverequest.util.CalendarServices.setDateType(endda.setDate(endda.getDate() + 13));
		}
		this.dateFilter = "$filter=OverlapList eq '" + oLapList + "' and EmployeeNumber eq '" + odata.RequesterNumber +
			"' and StartDate eq datetime'" + oStartDate + "' and EndDate eq datetime'" + oEndDate + "'";
		var textbegda = hcm.approve.leaverequest.util.CalendarServices.dateFormatter(begda);
		begda = hcm.approve.leaverequest.util.CalendarServices.stringdateToobject(textbegda); // FA2311921
		var textendda = hcm.approve.leaverequest.util.CalendarServices.dateFormatter(endda);
		endda = hcm.approve.leaverequest.util.CalendarServices.stringdateToobject(textendda); // FA2311921
		oCal.setStartDate(begda);
		this.msg = this.resourceBundle.getText("dialog.leave.overlaps.disclaimer", [odata.RequesterName, textbegda, textendda]);
		var oLegend = this.byId("CalenderLegend");
		if (oLegend) {
			oLegend.setLegendForNormal(this.resourceBundle.getText("view.Calendar.LegendWorkingDay"));
			oLegend.setLegendForType00(this.resourceBundle.getText("view.Calendar.LegendDayOff"));
			oLegend.setLegendForType01(this.resourceBundle.getText("view.Calendar.LegendApproved"));
			oLegend.setLegendForType04(this.resourceBundle.getText("view.Calendar.LegendPending"));
			oLegend.setLegendForType06(this.resourceBundle.getText("view.Calendar.LegendHoliday"));
			oLegend.setLegendForType07(this.resourceBundle.getText("view.Calendar.LegendDeletionRequested"));
			oLegend.setLegendForToday(this.resourceBundle.getText("view.Calendar.LegendToday"));
		}

	},

	_onOverlapCallFail: function(oError) {
		"use strict";
		this.oBusyDialog.close();
		sap.ca.ui.message.showMessageBox({
			type: sap.ca.ui.message.Type.ERROR,
			message: oError.message,
			details: oError.response.body
		});
	},

	/**
	 * Get header footer options for detail page
	 * @return {void}
	 */
	getHeaderFooterOptions: function() {
		"use strict";
		var that = this;
		var objHdrFtr = {
			sI18NDetailTitle: "view.Detail.title",
			oPositiveAction: {
				sId: "S3_APPROVE",
				sI18nBtnTxt: that.resourceBundle.getText("XBUT_APPROVE"),
				onBtnPressed: jQuery.proxy(that._handleApprove, that)
			},
			oNegativeAction: {
				sId: "S3_REJECT",
				sI18nBtnTxt: that.resourceBundle.getText("XBUT_REJECT"),
				onBtnPressed: jQuery.proxy(that._handleReject, that)
			},
			oAddBookmarkSettings: {
				title: that.resourceBundle.getText("view.Detail.title"),
				icon: "sap-icon://card"
			}
			//should be handled by framework
			/*onBack: jQuery.proxy(function() {
                //Check if a navigation to master is the previous entry in the history
                var sDir = sap.ui.core.routing.History.getInstance().getDirection(this.oRouter.getURL("master"));
                if (sDir === "Backwards") {
                    window.history.go(-1);
                } else {
                    //we came from somewhere else - create the master view
                    this.oRouter.navTo("master");
                }
            }, this)*/
		};
		var m = new sap.ui.core.routing.HashChanger();
		var oUrl = m.getHash();
		if (oUrl.indexOf("Shell-runStandaloneApp") >= 0) {
			objHdrFtr.bSuppressBookmarkButton = true;
		}

		/**
		 * @ControllerHook Modify the footer buttons
		 * This hook method can be used to add and change buttons for the detail view footer
		 * It is called when the decision options for the detail item are fetched successfully
		 * @callback hcm.approve.leaverequest.view.S3~extHookChangeFooterButtons
		 * @param {object} Header Footer Object
		 * @return {object} Header Footer Object
		 */
		if (this.extHookChangeFooterButtons) {
			objHdrFtr = this.extHookChangeFooterButtons(objHdrFtr);
		}
		return objHdrFtr;
	},

	/**
	 * handler for IconTabBar select
	 * @param {object} evt tabSelect Event
	 * @return {void}
	 * // FIXME: The below is a workaround because the odata service doesnt handler /Notes but only $expand=Notes.
	 * Whenever scaffolding triggers a model refresh, automatically /Notes on main model is triggered which fails.
	 * Hence, a new JSON model for notes is created and assigned on notes tab click
	 */
	_handleTabSelect: function(evt) {
		"use strict";
		var sKey = evt.getParameter("selectedKey");
		if (sKey === "calendar") {
			this.oDataModel.read("/TeamCalendarSet", null, [this.dateFilter], true,
				jQuery.proxy(this._onSuccess, this),
				jQuery.proxy(this._onFail, this));
			this.oBusyDialog.open();
			var msg = new sap.m.Text();
			msg = this.byId("infoText");
			msg.setText(this.msg);
			msg.addStyleClass("msgCss");
		}

	},

	_onSuccess: function(odata) {
		// FA 2299607<<		
		for ( var i = 0; i < odata.results.length; i++) {
			odata.results[i].StartDate = hcm.approve.leaverequest.util.CalendarServices.dateFormatter(odata.results[i].StartDate);
			odata.results[i].StartDate = hcm.approve.leaverequest.util.CalendarServices.stringdateToobject(odata.results[i].StartDate); //FA2311921
			odata.results[i].EndDate = hcm.approve.leaverequest.util.CalendarServices.dateFormatter(odata.results[i].EndDate);
			odata.results[i].EndDate = hcm.approve.leaverequest.util.CalendarServices.stringdateToobject(odata.results[i].EndDate); //FA2311921
		}
		// FA 2299607>>
		var oModel = new sap.ui.model.json.JSONModel(odata.results);
		this.oBusyDialog.close();
		var eventTemplate = new sap.me.OverlapCalendarEvent({
			startDay: "{StartDate}",
			endDay: "{EndDate}",
			row: "{Order}",
			type: "{LegendType}",
			name: "{EmployeeName}"
		});
		this.oCal = this.byId("OverlapCalendar2");
		this.oCal.setModel(oModel);
		this.oCal.bindAggregation("calendarEvents", "/", eventTemplate);
		//this.oCal.setStartDate();
	},

	_onFail: function(oError) {
		"use strict";
		this.oBusyDialog.close();
		sap.ca.ui.message.showMessageBox({
			type: sap.ca.ui.message.Type.ERROR,
			message: oError.message,
			details: oError.response.body
		});
	},

	/**
	 *  handler for approve action
	 * @return {void}
	 */
	_handleApprove: function() {
		"use strict";
		var oDataObj = this.oView.getModel().getProperty(this.oView.getBindingContext().getPath()),
			bApprove = true,
			fnClose = jQuery.proxy(function(oResult) {
				this._handleApproveRejectExecute(oResult, bApprove, oDataObj);
			}, this),
			sUserName = this.oView.getBindingContext().getProperty("RequesterName"),
			sLeaveType = this.oView.getBindingContext().getProperty("LeaveTypeDesc"),
			sAbsenceDays = this.oView.getBindingContext().getProperty("AbsenceDays"),
			sAbsenceHours = this.oView.getBindingContext().getProperty("AbsenceHours"),
			sAllDayFlag = this.oView.getBindingContext().getProperty("AllDayFlag"),
			sLeaveRequestType = this.oView.getBindingContext().getProperty("LeaveRequestType"),
			sRequested = hcm.approve.leaverequest.util.Conversions.formatterAbsenceDurationAndUnit(sAbsenceDays, sAbsenceHours, sAllDayFlag),
			sApproveText = "";

		if (sLeaveRequestType === "3") {
			sApproveText = this.resourceBundle.getText("dialog.question.approvecancel", [sUserName]);
		} else {
			sApproveText = this.resourceBundle.getText("dialog.question.approve", [sUserName]);
		}

		sap.ca.ui.dialog.confirmation.open({
			question: sApproveText,
			showNote: true,
			additionalInformation: [{
				label: this.resourceBundle.getText("view.AddInfo.LeaveType"),
				text: sLeaveType
            }, {
				label: this.resourceBundle.getText("view.AddInfo.Requested"),
				text: sRequested
            }],
			title: this.resourceBundle.getText("XTIT_APPROVAL"),
			confirmButtonLabel: this.resourceBundle.getText("XBUT_APPROVE")
		}, jQuery.proxy(fnClose, this));
	},

	/**
	 * handler for reject action
	 * @return {void}
	 */
	_handleReject: function() {
		"use strict";
		var oDataObj = this.oView.getModel().getProperty(this.oView.getBindingContext().getPath()),
			bApprove = false,
			fnClose = jQuery.proxy(function(oResult) {
				this._handleApproveRejectExecute(oResult, bApprove, oDataObj);
			}, this),
			sUserName = this.oView.getBindingContext().getProperty("RequesterName"),
			sLeaveType = this.oView.getBindingContext().getProperty("LeaveTypeDesc"),
			sAbsenceDays = this.oView.getBindingContext().getProperty("AbsenceDays"),
			sAbsenceHours = this.oView.getBindingContext().getProperty("AbsenceHours"),
			sAllDayFlag = this.oView.getBindingContext().getProperty("AllDayFlag"),
			sLeaveRequestType = this.oView.getBindingContext().getProperty("LeaveRequestType"),
			//sRequested = hcm.approve.leaverequest.util.Conversions.formatterAbsenceDurationAndUnit(sAbsenceDays, sAbsenceHours, sAllDayFlag),
			sRequested = hcm.approve.leaverequest.util.Conversions.formatterAbsenceDurationAndUnit(sAbsenceDays, sAbsenceHours, sAllDayFlag),
			sRejectText = "";

		if (sLeaveRequestType === "3") {
			sRejectText = this.resourceBundle.getText("dialog.question.rejectcancel", [sUserName]);
		} else {
			sRejectText = this.resourceBundle.getText("dialog.question.reject", [sUserName]);
		}

		// open the confirmation dialog
		sap.ca.ui.dialog.confirmation.open({
			question: sRejectText,
			showNote: true,
			additionalInformation: [{
				label: this.resourceBundle.getText("view.AddInfo.LeaveType"),
				text: sLeaveType
            }, {
				label: this.resourceBundle.getText("view.AddInfo.Requested"),
				text: sRequested
            }],
			title: this.resourceBundle.getText("XTIT_REJECT"),
			confirmButtonLabel: this.resourceBundle.getText("XBUT_REJECT")
		}, jQuery.proxy(fnClose, this));
	},

	/**
	 * handler for executing the approval/reject to backend
	 * @param {object} oResult Result from backend
	 * @param {boolean} bApprove Approve/Reject flag
	 * @param {object} oDataObj Leave object
	 * @return {void}
	 */
	_handleApproveRejectExecute: function(oResult, bApprove, oDataObj) {
		"use strict";
		if (oResult.isConfirmed) {
			var sDecision, sURL;
			if (bApprove) {
				sDecision = "PREPARE_APPROVE";
				this.sTextKey = "dialog.success.approve";
			} else {
				sDecision = "PREPARE_REJECT";
				this.sTextKey = "dialog.success.reject";
			}

			sURL = "ApplyLeaveRequestDecision?SAP__Origin='" + oDataObj.SAP__Origin + "'&RequestId='" + oDataObj.RequestId + "'&Version=" +
				oDataObj.Version + "&Comment='" + encodeURIComponent(oResult.sNote) + "'&Decision='" + sDecision + "'"; // encoding added FA 2289207
			
			// Note 2286172: Handle approve/reject in batch request, so only one round trip happens
			// 1) Add approve/request operation to batch request
			var aReadOps = [];
			var requestApprove = this.oDataModel.createBatchOperation(sURL, "GET");
			aReadOps.push(requestApprove);
			
			// 2) If a next item is present, try to preload it
			if(this.oApplicationFacade._sNextDetailPath) {
				var context = this.oApplicationFacade._sNextDetailPath;
				if(context.startsWith("/")) {
					context = context.substring(1);
				}
				var requestReadNext = this.oDataModel.createBatchOperation(context, "GET");
				aReadOps.push(requestReadNext);
			}
			
			// Submit batch request
			this.oBusyDialog.open();
			this.sApprovingOperation = sDecision;
			this.oApprovingRequest = oDataObj; // Remember approved request
			this.oDataModel.addBatchReadOperations(aReadOps);
			this.oDataModel.submitBatch(jQuery.proxy(this._handleApproveBatchRequestSuccess, this),
				jQuery.proxy(this._handleApproveBatchRequestError, this));
		}
	},
	
	/**
	 * Success callback function for the approve/reject batch request.
	 * @param {object} oData Data object for each request
	 * @param {object} oResponse Full HTTP response object
	 * @param {array} aErrorResponses Array to errors
	 */
	_handleApproveBatchRequestSuccess: function(oData, oResponse, aErrorResponses) {
		
		this.oBusyDialog.close();
		
		// Approve/reject request failed?
		if(!oData.__batchResponses[0].statusText || oData.__batchResponses[0].statusText !== "OK") {
			hcm.approve.leaverequest.util.Conversions.formatErrorDialog(oData.__batchResponses[0]);
			return;
		}
		
		// A next item was fetched and the request was successful
		if(oData.__batchResponses.length > 1 && oData.__batchResponses[1].statusText && oData.__batchResponses[1].statusText === "OK") {
			// Add calculated overlaps to the model, so they are automatically used when the list selection is changed
			var oResponseData = oData.__batchResponses[1].data;
			
			// CAUSION: If the previous operation was an reject and the next item we just preloaded has an overlap with the rejected
			// leave request, we might have a race condition because of parallel execution of the batch request between gateway and
			// backend. In this case, we reload the leave request data, to make sure that no outdated data is shown.
			var bKeepNextEntry = true;
			if(oResponseData.OverlapList && this.sApprovingOperation === "PREPARE_REJECT") {
				var aOverlapEntriesString = oResponseData.OverlapList.split("::NEW::");
				var aOverlapEntries = [];
				for(var i = 0; i < aOverlapEntriesString.length; i++) {
					var aParts = aOverlapEntriesString[i].split("::::");
					if(aParts.length === 4) { // a valid entry
						aOverlapEntries.push( {name: aParts[0], pernr: aParts[1], begda: aParts[2], endda: aParts[3]} );
					}
				}
				
				// Any overlaps with the rejected request?
				var oPrevRequest = this.oApprovingRequest;
				bKeepNextEntry = !aOverlapEntries.some(function(currentValue, index, array) {
					// (Wrongly?) converted dates might contain a time component (hours, minutes), but we have to compare only the date component
					var oldBegda = new Date(oPrevRequest.StartDate.getFullYear(), oPrevRequest.StartDate.getMonth(), oPrevRequest.StartDate.getDate());
					var oldEndda = new Date(oPrevRequest.EndDate.getFullYear(), oPrevRequest.EndDate.getMonth(), oPrevRequest.EndDate.getDate());
					var begda = new Date(currentValue.begda.substr(0,4), currentValue.begda.substr(4,2) - 1, currentValue.begda.substr(6,2));
					var endda = new Date(currentValue.begda.substr(0,4), currentValue.begda.substr(4,2) - 1, currentValue.begda.substr(6,2));
					return oPrevRequest.RequesterNumber === currentValue.pernr
							&& oldBegda.getTime() <= endda.getTime()
							&& oldEndda.getTime() >= begda.getTime();
				});
			}
			
			if(bKeepNextEntry) {
				var oModelItem = this.oDataModel.getProperty(this.oApplicationFacade._sNextDetailPath);
				oModelItem.CalculateOverlaps = "X"; //oResponseData.CalculateOverlaps;
				oModelItem.OverlapList = oResponseData.OverlapList;
				oModelItem.Overlaps = oResponseData.Overlaps;
			}
		}
		
		// Notify the master list, that approve/reject was successful
		var sComponentId = sap.ui.core.Component.getOwnerIdFor(this.oView),
			oComponent = sap.ui.component(sComponentId);
		oComponent.oEventBus.publish("hcm.approve.leaverequest", "leaveRequestApproveReject", this.oApprovingRequest);
		this.sApprovingOperation = null;
		this.oApprovingRequest = null;
		
		// Show success message
		sap.ca.ui.message.showMessageToast(this.resourceBundle.getText(this.sTextKey));
	},
	
	/**
	 * Error callback function for the approve/reject batch request.
	 * @param {object} oError Error object
	 */
	_handleApproveBatchRequestError: function(oError) {
		"use strict";
		this.oBusyDialog.close();
		hcm.approve.leaverequest.util.Conversions.formatErrorDialog(oError);
	},

	/**
	 * handler for manager name press
	 * @param {object} oEvent Click event on name
	 * @return {void}
	 */
	_handleNamePress: function(oEvent) {
		"use strict";
		jQuery.proxy(this._handleEmployeeNameClick(oEvent), this);
	},

	/**
	 * handler for employee name press
	 * @param {object} oEvent Click event on name
	 * @return {void}
	 */
	_handleSenderPress: function(oEvent) {
		"use strict";
		jQuery.proxy(this._handleEmployeeNameClick(oEvent), this);
	},

	/**
	 * handler for opening employee business card
	 * @param {object} oEvent Click event on name
	 * @return {void}
	 */
	_handleEmployeeNameClick: function(oEvent) {
		"use strict";
		this.oControl = oEvent.getParameters().domRef;
		var oContext = this.oView.getBindingContext(),
			userID = oContext.getProperty("RequesterNumber"),
			leaveTypeDesc = oContext.getProperty("LeaveTypeDesc"),
			startDate = oContext.getProperty("StartDate"),
			startTime = oContext.getProperty("StartTime"),
			endDate = oContext.getProperty("EndDate"),
			endTime = oContext.getProperty("EndTime"),
			allDayFlag = oContext.getProperty("AllDayFlag"),
			tFrame = hcm.approve.leaverequest.util.Conversions.formatterAbsenceDays3(startDate, startTime, endDate, endTime, allDayFlag),
			Subject = this.resourceBundle.getText("view.BusinessCard.Employee.Subject", [leaveTypeDesc]);
		try {
			//if call is from notes, fetch the Pernr of the commenter and not the Requester of the leave request
			var oId = oEvent.getSource().getParent().getId();
			if (oId.indexOf("NotesList") >= 0) {
				var index = oEvent.getSource().getBindingContextPath().split("/")[2];
				var oModelData = this.byId("NotesList").getModel("notes").getData();
				userID = oModelData.NotesCollection[index].Pernr;
			}
		} catch (e) {
			jQuery.sap.log.warning("Couldn't find the Details of employee", "_handleEmployeeNameClick", "hcm.approve.leaverequest.view.S3");
		}
		this.mailSubject = Subject + " " + tFrame;
		this.oDataModel.read("EmployeeSet", null, ["$filter=EmployeeNumber eq '" + userID + "'"], true,
			jQuery.proxy(this._onRequestSuccess, this),
			jQuery.proxy(this._onRequestFailed, this));
	},

	/**
	 * handler for service request failure
	 * @param {object} oData Employee details
	 * @return {void}
	 */
	_onRequestSuccess: function(oData) {
		"use strict";
		jQuery.sap.require("sap.ca.ui.quickoverview.EmployeeLaunch");
		var data = oData.results[0],
			oEmpConfig = {
				title: "Employee",
				name: data.Name,
				department: data.Department,
				contactmobile: data.Mobile,
				contactphone: data.Phone,
				contactemail: data.Email,
				contactemailsubj: this.mailSubject,
				companyname: data.Company,
				companyaddress: data.Address
			},
			oEmployeeLaunch = new sap.ca.ui.quickoverview.EmployeeLaunch(oEmpConfig);

		oEmployeeLaunch.openBy(this.oControl);
	},

	/**
	 * handler for service request failure
	 * @param {object} oError Error details
	 * @return {void}
	 */
	_onRequestFailed: function(oError) {
		"use strict";
		sap.ca.ui.message.showMessageBox({
			type: sap.ca.ui.message.Type.ERROR,
			message: oError.message,
			details: oError.response.body
		});
	}
});