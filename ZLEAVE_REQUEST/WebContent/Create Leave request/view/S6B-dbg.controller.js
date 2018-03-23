/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.require("sap.ca.scfld.md.controller.BaseDetailController");
jQuery.sap.require("hcm.myleaverequest.utils.Formatters");
jQuery.sap.require("hcm.myleaverequest.utils.UIHelper");
jQuery.sap.require("hcm.myleaverequest.utils.DataManager");
jQuery.sap.require("sap.m.MessageBox");
jQuery.sap.require("sap.ca.ui.dialog.factory");
jQuery.sap.require("hcm.myleaverequest.utils.ConcurrentEmployment");
/*global hcm:true window*/
sap.ca.scfld.md.controller.BaseDetailController.extend("hcm.myleaverequest.view.S6B", {

	extHookChangeFooterButtons: null,
	extHookWithdrawDialogContent: null,
	extHookDetailView: null,

	onInit: function() {

		sap.ca.scfld.md.controller.BaseDetailController.prototype.onInit.call(this);
		this.oApplication = this.oApplicationFacade.oApplicationImplementation;
		this.resourceBundle = this.oApplicationFacade.getResourceBundle();
		this.oDataModel = this.oApplicationFacade.getODataModel();
		hcm.myleaverequest.utils.DataManager.init(this.oDataModel, this.resourceBundle);
		hcm.myleaverequest.utils.Formatters.init(this.resourceBundle);

		this._buildHeaderFooter();

		this.oRouter.attachRouteMatched(this._handleRouteMatched, this);
	},

	_handleRouteMatched: function(oEvent) {

		if (oEvent.getParameter("name") === "detail") {
			hcm.myleaverequest.utils.DataManager.init(this.oDataModel, this.resourceBundle);
			oEvent.getParameter("arguments").contextPath = decodeURIComponent(oEvent.getParameter("arguments").contextPath);
			var _this = this;
			var contextPath = decodeURIComponent(oEvent.getParameter("arguments").contextPath);
			var indexVal = null;
			var consolidatedLeaveRequestcollection = null;
			var setDetails = function() {
				hcm.myleaverequest.utils.UIHelper.setRoutingProperty(consolidatedLeaveRequestcollection);
				consolidatedLeaveRequestcollection = hcm.myleaverequest.utils.UIHelper.getRoutingProperty();
				if (consolidatedLeaveRequestcollection !== null) {
					for (var i = 0; i < consolidatedLeaveRequestcollection.length; i++) {
						if (consolidatedLeaveRequestcollection[i]._navProperty === contextPath) {
							indexVal = i;
							break;
						}
					}
				}
				var curntLeaveRequest = consolidatedLeaveRequestcollection[indexVal];

				if (curntLeaveRequest) {
					_this.currntObj = curntLeaveRequest;

					var cntrlObjectHeader = _this.byId("LRS6B_HEADER");
					var cntrlNotesTab = _this.byId("LRS6B_ICNTABBAR");

					var lblOrigDate = _this.byId("LRS6B_LBL_ORIGINAL_DATE");
					var hdrStartDate = _this.byId("LRS6B_HEADER_START_DATE");
					var hdrEndDate = _this.byId("LRS6B_HEADER_END_DATE");
					var lblChngedDate = _this.byId("LRS6B_LBL_CHANGED_DATE");
					var hdrNewStartDate = _this.byId("LRS6B_NEW_HEADER_START_DATE");
					var hdrNewEndDate = _this.byId("LRS6B_NEW_HEADER_END_DATE");
					var hdrStatus = _this.byId("LRS6B_HEADER_STATUS");
					var hdrStatus2 = _this.byId("LRS6B_HEADER_STATUS2");
					if (_this.currntObj.Notes === "") {
						cntrlNotesTab.setVisible(false);
					} else {
						cntrlNotesTab.setVisible(true);
					}
					cntrlObjectHeader.setTitle(curntLeaveRequest.AbsenceTypeName);
					//FA 2310160<<
					//cntrlObjectHeader.setNumber(hcm.myleaverequest.utils.Formatters.adjustSeparator(curntLeaveRequest.WorkingHoursDuration));
					//cntrlObjectHeader.setNumberUnit(_this.resourceBundle.getText("LR_LOWERCASE_HOURS"));
                    cntrlObjectHeader.setNumber(hcm.myleaverequest.utils.Formatters.formatterAbsenceDuration(curntLeaveRequest.WorkingDaysDuration, curntLeaveRequest.WorkingHoursDuration,curntLeaveRequest.AdditionalFields.ALLDF));
                    cntrlObjectHeader.setNumberUnit(hcm.myleaverequest.utils.Formatters.formatterAbsenceDurationUnit(curntLeaveRequest.WorkingDaysDuration, curntLeaveRequest.WorkingHoursDuration,curntLeaveRequest.AdditionalFields.ALLDF));
                    // FA 2310160>>					
					lblOrigDate.setVisible(hcm.myleaverequest.utils.Formatters.SET_RELATED_VISIBILITY(curntLeaveRequest.aRelatedRequests));
					hdrStartDate.setText(hcm.myleaverequest.utils.Formatters.DATE_ODATA_EEEdMMMyyyyLong(curntLeaveRequest.StartDate));
					hdrEndDate.setText(hcm.myleaverequest.utils.Formatters.FORMAT_ENDDATE_LONG(_this.resourceBundle.getText("LR_HYPHEN"),
						curntLeaveRequest.WorkingDaysDuration, curntLeaveRequest.StartTime, curntLeaveRequest.EndDate, curntLeaveRequest.EndTime));
					lblChngedDate.setVisible(hcm.myleaverequest.utils.Formatters.SET_RELATED_VISIBILITY(curntLeaveRequest.aRelatedRequests));
					hdrNewStartDate.setVisible(hcm.myleaverequest.utils.Formatters.SET_RELATED_START_DATE_VISIBILITY(curntLeaveRequest.aRelatedRequests));
					hdrNewStartDate.setText(hcm.myleaverequest.utils.Formatters.FORMAT_RELATED_START_DATE_LONG(curntLeaveRequest.aRelatedRequests));
					hdrNewEndDate.setVisible(hcm.myleaverequest.utils.Formatters.SET_RELATED_END_DATE_VISIBILITY(curntLeaveRequest.aRelatedRequests));
					hdrNewEndDate.setText(hcm.myleaverequest.utils.Formatters.FORMAT_RELATED_END_DATE_LONG(_this.resourceBundle.getText("LR_HYPHEN"),
						curntLeaveRequest.aRelatedRequests));
					hdrStatus.setText(curntLeaveRequest.StatusName);
					hdrStatus.setState(hcm.myleaverequest.utils.Formatters.State(curntLeaveRequest.StatusCode));
					hdrStatus2.setText(hcm.myleaverequest.utils.Formatters.FORMATTER_INTRO(curntLeaveRequest.aRelatedRequests));
					hdrStatus2.setState("Error");
					_this.byId("LRS6B_NOTESICNTAB").setVisible(false);
					_this.byId("S6B_NOTES_LIST").destroyItems();
					_this.byId("LRS6B_ATTACH_ICNTAB").setVisible(false);
					_this.byId("S6B_FILE_LIST").destroyItems();
					if (curntLeaveRequest.Notes) {
						var oDataNotes = hcm.myleaverequest.utils.Formatters._parseNotes(curntLeaveRequest.Notes);
						if (oDataNotes.NotesCollection) {
							_this.byId("LRS6B_NOTESICNTAB").setVisible(true);
							_this.byId("LRS6B_ICNTABBAR").setVisible(true);
							_this.byId("LRS6B_NOTESICNTAB").setCount(oDataNotes.NotesCollection.length);
							var oNotesModel = new sap.ui.model.json.JSONModel(oDataNotes);
							_this.byId("S6B_NOTES_LIST").setModel(oNotesModel, "notes");
						} else {
							_this.byId("LRS6B_NOTESICNTAB").setVisible(false);
							_this.byId("LRS6B_ICNTABBAR").setVisible(false);
						}
					}
					if (curntLeaveRequest.AttachmentDetails) {
						var oDataFiles = hcm.myleaverequest.utils.Formatters._parseAttachments(curntLeaveRequest.AttachmentDetails, curntLeaveRequest.RequestID,
							_this.oDataModel);
						if (oDataFiles.AttachmentsCollection) {
							_this.byId("LRS6B_ATTACH_ICNTAB").setCount(oDataFiles.AttachmentsCollection.length);
							_this.byId("LRS6B_ATTACH_ICNTAB").setVisible(true);
							_this.byId("LRS6B_ICNTABBAR").setVisible(true);
							var attachmentsModel = new sap.ui.model.json.JSONModel(oDataFiles);
							_this.byId("S6B_FILE_LIST").setModel(attachmentsModel, "files");
						} else {
							_this.byId("LRS6B_ATTACH_ICNTAB").setVisible(false);
						}
					}
					var combinedPromise = $.when(hcm.myleaverequest.utils.DataManager.getAbsenceTypeCollection());
					combinedPromise.done(function(leaveTypeColl) {
						_this.handleAdditionalFields(curntLeaveRequest,leaveTypeColl);
					});
					_this.byId("LRS6B_ICNTABBAR").rerender();
					_this._initState();
				}
			};
			consolidatedLeaveRequestcollection = hcm.myleaverequest.utils.DataManager.getCachedModelObjProp("ConsolidatedLeaveRequests");
			var oPernr = hcm.myleaverequest.utils.UIHelper.getPernr();
			if (oPernr) {
				if (consolidatedLeaveRequestcollection === undefined) {
					hcm.myleaverequest.utils.DataManager.getConsolidatedLeaveRequests(function(objResponse) {

						consolidatedLeaveRequestcollection = objResponse.LeaveRequestCollection;
						hcm.myleaverequest.utils.DataManager.setCachedModelObjProp("ConsolidatedLeaveRequests", consolidatedLeaveRequestcollection);
						setDetails();
						hcm.myleaverequest.utils.UIHelper.setIsLeaveCollCached(true);
					}, function(objResponse) {
						hcm.myleaverequest.utils.DataManager.parseErrorMessages(objResponse);
					});
				} else {
					setDetails();
				}
			} else {
				hcm.myleaverequest.utils.ConcurrentEmployment.getCEEnablement(this, function() {
					if (consolidatedLeaveRequestcollection === undefined) {
						hcm.myleaverequest.utils.DataManager.getConsolidatedLeaveRequests(function(objResponse) {

							consolidatedLeaveRequestcollection = objResponse.LeaveRequestCollection;
							hcm.myleaverequest.utils.DataManager.setCachedModelObjProp("ConsolidatedLeaveRequests", consolidatedLeaveRequestcollection);
							setDetails();
							hcm.myleaverequest.utils.UIHelper.setIsLeaveCollCached(true);
						}, function(objResponse) {
							hcm.myleaverequest.utils.DataManager.parseErrorMessages(objResponse);
						});
					} else {
						setDetails();
					}
				});
			}
			/**
			 * @ControllerHook Modify the loaded view
			 * This hook method can be used to add or change UI and business logic
			 * It is called when the route match to detail
			 * @callback hcm.myleaverequest.view.S6B~extHookDetailView
			 */
			if (this.extHookDetailView) {
				this.extHookDetailView();
			}

			//sap.ca.ui.utils.busydialog.releaseBusyDialog();
		}

	},

	/*	
	 * override BaseMasterController method in order to decode the JSONModel based contextPath
	 * Crossroads.js does not allow slashes in the navigation hash, JSON contextPath contains
	 */
	/*resolveHash : function(oEvent){
			      return URI.decode(oEvent.getParameter("arguments").contextPath);
			    },*/

	_buildHeaderFooter: function() {

		var _this = this;
		//workaround for scaffolding API
		var objOptionsHeaderFooter = {
			sI18NDetailTitle: "LR_TITLE_LEAVE_REQUEST",
			buttonList: [{
				sId: "LRS6B_BTN_CHANGE",
				sI18nBtnTxt: "LR_CHANGE",
				onBtnPressed: function(evt) {
					_this.onChange(evt);
				}
			}, {
				sId: "LRS6B_BTN_WITDHDRAW",
				sI18nBtnTxt: "LR_WITHDRAW",
				onBtnPressed: function(evt) {
					_this.onWithdraw(evt);
				}
			}],
			oAddBookmarkSettings: {
				title: _this.resourceBundle.getText("LR_TITLE_DETAILS_VIEW"),
				icon: "sap-icon://Fiori2/F0394"
			}
		};
		var m = new sap.ui.core.routing.HashChanger();
		var oUrl = m.getHash();
		if (oUrl.indexOf("Shell-runStandaloneApp") >= 0) {
			objOptionsHeaderFooter.bSuppressBookmarkButton = true;
		}
		/**
		 * @ControllerHook Modify the footer buttons
		 * This hook method can be used to add and change buttons for the detail view footer
		 * It is called when the decision options for the detail item are fetched successfully
		 * @callback hcm.myleaverequest.view.S6B~extHookChangeFooterButtons
		 * @param {object} Header Footer Object
		 * @return {object} Header Footer Object
		 */
		if (this.extHookChangeFooterButtons) {
			objOptionsHeaderFooter = this.extHookChangeFooterButtons(objOptionsHeaderFooter);
		}

		this.setHeaderFooterOptions(objOptionsHeaderFooter);
	},

	_isChangeRequest: function(aRelatedRequests) {
		return aRelatedRequests != undefined && aRelatedRequests.length > 0 && aRelatedRequests[0].LeaveRequestType == "2";
	},

	_hasNewEndDate: function(aRelatedRequests) {
		return this._isChangeRequest(aRelatedRequests) && this._hasEndDate(aRelatedRequests[0].WorkingDaysDuration);
	},

	_hasEndDate: function(sWorkingDaysDuration) {
		return sWorkingDaysDuration != undefined && (hcm.myleaverequest.utils.Formatters.isHalfDayLeave(sWorkingDaysDuration) ||
			sWorkingDaysDuration * 1 != 1);
	},

	_initState: function() {
		var btnChngeAttr = false;
		if (!this.currntObj.RelatedRequests || this.currntObj.RelatedRequests.length < 1) {
			btnChngeAttr = this.currntObj.ActionModifyInd;
		} else if (this.currntObj.RelatedRequests) {
			if (this.currntObj.RelatedRequests[0].LeaveRequestType == "2") {
				btnChngeAttr = this.currntObj.RelatedRequests[0].ActionModifyInd;
			}
		}

		this.setBtnEnabled("LRS6B_BTN_CHANGE", btnChngeAttr);
		var btnWtDrwAttr = false;

		if (!this.currntObj.RelatedRequests || this.currntObj.RelatedRequests.length < 1) {
			btnWtDrwAttr = this.currntObj.ActionDeleteInd || this.currntObj.StatusCode === "CREATED";
		}

		this.setBtnEnabled("LRS6B_BTN_WITDHDRAW", btnWtDrwAttr);

	},

	// event handler for change button
	onChange: function() {
		var reqId = this.currntObj.RequestID;
		hcm.myleaverequest.utils.UIHelper.setIsChangeAction(true);
		if (reqId === "") {
			reqId = this.currntObj.LeaveKey;
		}
		if (reqId !== "") {
			this.oRouter.navTo("change", {
				requestID: reqId
			});
		} else {
			/*hcm.myleaverequest.utils.UIHelper.errorDialog([this.resourceBundle.getText("LR_DD_GENERIC_ERR"), 
							                                                    "hcm.myleaverequest.view.S6B",
							                                                    "_handleRouteMatched",
							                                                    "curntLeaveRequest is null"]);*/
			jQuery.sap.log.warning("curntLeaveRequest is null", "_handleRouteMatched", "hcm.myleaverequest.view.S6B");
		}
	},

	// event handler for withdraw button
	onWithdraw: function() {
		var _this = this;
		this.oHeader = this.byId("LRS6B_HEADER");
		var _from;
		var _to;
		var _fromTime = this.currntObj.StartTime;
		var _toTime = this.currntObj.EndTime;
		var _startDate = this.currntObj.StartDate;
		var _endDate = this.currntObj.EndDate;
		var _absenceType = this.currntObj.AbsenceTypeName;

		if (_fromTime === "000000" && _toTime === "000000") {
			_from = hcm.myleaverequest.utils.Formatters.DATE_ODATA_EEEdMMMyyyy(_startDate);
			_to = hcm.myleaverequest.utils.Formatters.DATE_ODATA_EEEdMMMyyyy(_endDate);
		} else {
			_from = hcm.myleaverequest.utils.Formatters.DATE_ODATA_EEEdMMMyyyy(_startDate, "medium");
			_to = hcm.myleaverequest.utils.Formatters.DATE_ODATA_EEEdMMMyyyy(_endDate, "medium");
			_from += " " + hcm.myleaverequest.utils.Formatters.TIME_hhmm(_fromTime);
			_to += " " + hcm.myleaverequest.utils.Formatters.TIME_hhmm(_toTime);
		}

		var sNumberAndUnit = null;
		if (this.oHeader) {
			sNumberAndUnit = this.oHeader.getNumber() + "  " + this.oHeader.getNumberUnit();
		} else {
			sNumberAndUnit = "-";
		}

		var oSettings = {
			question: this.resourceBundle.getText("LR_WITHDRAWNMSG"),
			additionalInformation: [{
				label: this.resourceBundle.getText("LR_BALANCE_DEDUCTIBLE"),
				text: _absenceType
			}, {
				label: this.resourceBundle.getText("LR_FROM"),
				text: _from
			}, {
				label: this.resourceBundle.getText("LR_TO"),
				text: _to
			}, {
				label: this.resourceBundle.getText("LR_REQUEST"),
				text: sNumberAndUnit
			}],
			showNote: false,
			title: this.resourceBundle.getText("LR_TITLE_WITHDRAW"),
			confirmButtonLabel: this.resourceBundle.getText("LR_OK")
		};

		/**
		 * @ControllerHook Modify the content of withdraw dialog
		 * This hook method can be used to add and change content of withdraw dialog
		 * It is called when the onWithdraw method gets executed
		 * @callback hcm.myleaverequest.view.S6B~extHookWithdrawDialogContent
		 * @param {object} oSettings Object
		 * @return {object} oSettings Object
		 */
		if (this.extHookWithdrawDialogContent) {
			oSettings = this.extHookWithdrawDialogContent(oSettings);
		}

		sap.ca.ui.dialog.factory.confirm(oSettings, function(response) {
			if (response.isConfirmed === true) {
				_this.withdraw();
			}
		});
	},

	// withdraw leave request
	withdraw: function() {
		var _this = this;

		//sap.ca.ui.utils.busydialog.requireBusyDialog();

		var sStatusCode = this.currntObj.StatusCode;
		var sEmployeeID = this.currntObj.EmployeeID;
		var sRequestId = this.currntObj.RequestID;
		var sChangeStateID = this.currntObj.ChangeStateID;
		var sLeaveKey = this.currntObj.LeaveKey;

		hcm.myleaverequest.utils.DataManager.withdrawLeaveRequest(sStatusCode, sEmployeeID, sRequestId,
			sChangeStateID, sLeaveKey, function(response) {
				// sap.ca.ui.utils.busydialog.releaseBusyDialog();

				sap.ui.getCore().getEventBus().publish("hcm.myleaverequest.LeaveCollection", "refresh");
				hcm.myleaverequest.utils.UIHelper.setIsWithDrawn(_this.currntObj._navProperty);
				hcm.myleaverequest.utils.UIHelper.setIsWithDrawAction(true);
				sap.m.MessageToast.show(_this.resourceBundle.getText("LR_WITHDRAWDONE"));
			}, function(errorMsgs) {
				//sap.ca.ui.utils.busydialog.releaseBusyDialog();
				hcm.myleaverequest.utils.UIHelper.errorDialog(errorMsgs);
			}, this);

	},
	handleAdditionalFields: function(curntLeaveRequest, aLeaveTypes) {
		var _this = this;
		try {
			_this.byId("LRS6B_ADDN_FORM_CNR").destroyFormElements();
			_this.byId("LRS6B_ADDN_ICNTAB").setVisible(false);
			for (var h = 0; h < aLeaveTypes.length; h++) {
				if (aLeaveTypes[h].AbsenceTypeCode == curntLeaveRequest.AbsenceTypeCode) {
					var oAdFls = aLeaveTypes[h].AdditionalFields.results;
					for (var k = 0; k < oAdFls.length; k++) {
						//if(curntLeaveRequest.AdditionalFields[oAdFls[k].Fieldname] != ""){
						var oFormElement = new sap.ui.layout.form.FormElement({
							layoutData: new sap.ui.layout.ResponsiveFlowLayoutData({
								linebreak: true
							}),
							label: new sap.m.Label({
								text: oAdFls[k].FieldLabel
							}),
							fields: [
								new sap.m.Text({
									text: (curntLeaveRequest.AdditionalFields[oAdFls[k].Fieldname]).toString()
								})
							]
						});
						_this.byId("LRS6B_ADDN_FORM_CNR").addFormElement(oFormElement);
						_this.byId("LRS6B_ADDN_ICNTAB").setVisible(true);
						_this.byId("LRS6B_ICNTABBAR").setVisible(true);
						//}
					}
				}
			}
		} catch (e) {
			jQuery.sap.log.warning("additional fields couldn't be added", "_handleRouteMatched", "hcm.myleaverequest.view.S6B");
			_this.byId("LRS6B_ADDN_FORM_CNR").destroyFormElements();
			_this.byId("LRS6B_ADDN_ICNTAB").setVisible(false);
		}
	}
});