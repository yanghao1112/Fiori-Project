/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.require("sap.ca.scfld.md.controller.BaseFullscreenController");
jQuery.sap.require("hcm.myleaverequest.utils.Formatters");
jQuery.sap.require("hcm.myleaverequest.utils.UIHelper");
jQuery.sap.require("sap.m.MessageBox");
jQuery.sap.require("hcm.myleaverequest.utils.DataManager");
jQuery.sap.require("hcm.myleaverequest.utils.ConcurrentEmployment");
jQuery.sap.require("hcm.myleaverequest.utils.CalendarTools");
jQuery.sap.require("sap.ca.ui.dialog.factory");
jQuery.sap.require("sap.ca.ui.dialog.Dialog");
jQuery.sap.require("sap.m.MessageToast");
jQuery.support.useFlexBoxPolyfill = false;
jQuery.sap.require("sap.ca.ui.model.format.FileSizeFormat");
jQuery.sap.require("sap.ca.ui.message.message");
jQuery.sap.require("sap.ui.thirdparty.sinon");

/*global hcm window setTimeout sinon:true*/
sap.ca.scfld.md.controller.BaseFullscreenController.extend("hcm.myleaverequest.view.S1", {

	extHookChangeFooterButtons: null,
	extHookRouteMatchedHome: null,
	extHookRouteMatchedChange: null,
	extHookClearData: null,
	extHookInitCalendar: null,
	extHookTapOnDate: null,
	extHookSetHighlightedDays: null,
	extHookDeviceDependantLayout: null,
	extHookSubmit: null,
	extHookOnSubmitLRCfail: null,
	extHookOnSubmitLRCsuccess: null,
	extHookCallDialog: null,

	onInit: function() {
		sap.ca.scfld.md.controller.BaseFullscreenController.prototype.onInit.call(this);
		this.oApplication = this.oApplicationFacade.oApplicationImplementation;
		this.resourceBundle = this.oApplicationFacade.getResourceBundle();
		this.oDataModel = this.oApplicationFacade.getODataModel();
		hcm.myleaverequest.utils.DataManager.init(this.oDataModel, this.resourceBundle);
		hcm.myleaverequest.utils.Formatters.init(this.resourceBundle);
		hcm.myleaverequest.utils.CalendarTools.init(this.resourceBundle);
		this.oDataModel = hcm.myleaverequest.utils.DataManager.getBaseODataModel();
		this.oRouter.attachRouteMatched(this._handleRouteMatched, this);
		this._buildHeaderFooter();
		this._initCntrls();
		sap.ui.getCore().getEventBus().subscribe("hcm.myleaverequest.LeaveCollection", "refresh", this._onLeaveCollRefresh, this);

	},

	_initCntrls: function() {

		this.changeMode = false; // true: S4 is called by history view for existing lr
		this.oChangeModeData = {}; // container for LR data coming from history view in change mode
		this.selRange = {}; // Object holding the selected dates of the calendar control
		this.selRange.start = null; // earliest selected date or singel selected date
		this.selRange.end = null; // latest selected date or null for single days
		this.aLeaveTypes = []; // array of absence types for current user
		this.leaveType = {}; // currently selected absence type

		this.iPendingRequestCount = 0;

		// ----variables used during onSend:
		this.bSubmitOK = null; // true when the submit simulation was successful
		this.bApproverOK = null; // true when the approving manager could be determined
		this.oSubmitResult = {};
		this.sApprover = ""; // Approving manager - used in confirmation popup
		this.sApproverPernr = ""; // Approving manager pernr - introduced with note 2286578 
		this.bSimulation = true; // used in oData call for submit of lr - true: just check user entry false: do posting
		this._isLocalReset = false;

		// ------- convenience variables for screen elements
		//this.oBusy = null; FA 2289793
		this.oBusy = new sap.m.BusyDialog(); // FA 2289793
		this.formContainer = this.byId("LRS4_FRM_CNT_BALANCES");
		this.timeInputElem = this.byId("LRS4_FELEM_TIMEINPUT");
		this.balanceElem = this.byId("LRS4_FELEM_BALANCES");
		this.noteElem = this.byId("LRS4_FELEM_NOTE");
		this.timeFrom = this.byId("LRS4_DAT_STARTTIME");
		this.timeTo = this.byId("LRS4_DAT_ENDTIME");
		this.legend = this.byId("LRS4_LEGEND");
		this.remainingVacation = this.byId("LRS4_TXT_REMAINING_DAYS");
		this.bookedVacation = this.byId("LRS4_TXT_BOOKED_DAYS");
		this.note = this.byId("LRS4_TXA_NOTE");
		this.cale = this.byId("LRS4_DAT_CALENDAR");
		this.slctLvType = this.byId("SLCT_LEAVETYPE");
		this.calSelResetData = [];
		this._initCalendar(); // set up layout + fill calendar with events
		this._deviceDependantLayout();
		this.objectResponse = null;
		this.ResponseMessage = null;
	},

	_onLeaveCollRefresh: function() {
		hcm.myleaverequest.utils.CalendarTools.clearCache();
	},

	onAfterRendering: function() {
		var that = this;
		$(window).on("orientationchange", function(event) {
			//passing the type orientation to decide number of months to be displayed
			that._orientationDependancies(event.orientation);
		});

		if (!sap.ui.getCore().getConfiguration().getRTL()) {
			//to align the text and total days available to right
			this.byId('LRS4_TXT_REMAININGDAY').onAfterRendering = function() {
				jQuery(this.getDomRef()).css({
					'text-align': 'right' /*for IE and web kit browsers*/
				});
			};
			//to enhance the font of days used/available
			this.byId('LRS4_TXT_REMAINING_DAYS').onAfterRendering = function() {
				jQuery(this.getDomRef()).css({
					'font-size': '1.5rem',
					'font-weight': '700',
					'text-align': 'right'
				});
			};

		} else {
			// in case of LTR text direction
			//to align the text and total days available to left
			this.byId('LRS4_TXT_REMAININGDAY').onAfterRendering = function() {
				jQuery(this.getDomRef()).css({
					'text-align': 'left' /*for IE and web kit browsers*/
				});
			};
			//to enhance the font of days used/available
			this.byId('LRS4_TXT_REMAINING_DAYS').onAfterRendering = function() {
				jQuery(this.getDomRef()).css({
					'font-size': '1.5rem',
					'font-weight': '700',
					'text-align': 'left'
				});
			};
		}
		this.byId('LRS4_TXT_BOOKED_DAYS').onAfterRendering = function() {
			jQuery(this.getDomRef()).css({
				'font-size': '1.5rem',
				'font-weight': '700'
			});
		};
	},

	_buildHeaderFooter: function() {
		var _this = this;
		this.objHeaderFooterOptions = {
			sI18NFullscreenTitle: "",
			oEditBtn: {
				sId: "LRS4_BTN_SEND",
				sI18nBtnTxt: "LR_SEND",
				onBtnPressed: function(evt) {
					_this.onSendClick(evt);
				}
			},
			buttonList: [{
				sId: "LRS4_BTN_CANCEL",
				sI18nBtnTxt: "LR_RESET",
				onBtnPressed: function(evt) {
					_this.onCancelClick(evt);
				}
			}, {
				sId: "LRS4_BTN_ENTITLEMENT",
				sI18nBtnTxt: "LR_BALANCE_TILE",
				onBtnPressed: function(evt) {
					_this.onEntitlementClick(evt);
				}
			}, {
				sId: "LRS4_BTN_HISTORY",
				sI18nBtnTxt: "LR_HISTORY_TILE",
				onBtnPressed: function(evt) {
					_this.onHistoryClick(evt);
				}
			}]
		};
		var m = new sap.ui.core.routing.HashChanger();
		var oUrl = m.getHash();
		if (oUrl.indexOf("Shell-runStandaloneApp") >= 0) {
			this.objHeaderFooterOptions.bSuppressBookmarkButton = true;
		}

		/**
		 * @ControllerHook Modify the footer buttons
		 * This hook method can be used to add and change buttons for the detail view footer
		 * It is called when the decision options for the detail item are fetched successfully
		 * @callback hcm.myleaverequest.view.S1~extHookChangeFooterButtons
		 * @param {object} Header Footer Object
		 * @return {object} Header Footer Object
		 */
		if (this.extHookChangeFooterButtons) {
			this.objHeaderFooterOptions = this.extHookChangeFooterButtons(this.objHeaderFooterOptions);
		}
	},

	_handleRouteMatched: function(evt) {
		var _this = this;

		if (evt.getParameter("name") === "home") {

			hcm.myleaverequest.utils.DataManager.init(this.oDataModel, this.resourceBundle);
			this.objHeaderFooterOptions.sI18NFullscreenTitle = "LR_CREATE_LEAVE_TILE";
			this.setHeaderFooterOptions(this.objHeaderFooterOptions);
			hcm.myleaverequest.utils.UIHelper.setControllerInstance(this);
			this.oChangeModeData = {};
			this.changeMode = false;
			this.byId("fileupload").setVisible(false);
			this._clearData();
			hcm.myleaverequest.utils.CalendarTools.clearCache();
			var sComponentId = sap.ui.core.Component.getOwnerIdFor(this.getView()); //get the pernr from the cross app nav
			var oStartUpParameters = sap.ui.component(sComponentId).getComponentData().startupParameters;
			var oPernr;
			if (oStartUpParameters && oStartUpParameters.pernr) {
				oPernr = oStartUpParameters.pernr[0];
				hcm.myleaverequest.utils.UIHelper.setPernr(oPernr);
			} else {
				oPernr = hcm.myleaverequest.utils.UIHelper.getPernr();
			}
			if (oPernr) {
				_this.initializeView();
			} else {
				hcm.myleaverequest.utils.ConcurrentEmployment.getCEEnablement(this, function() {
					_this.initializeView();
				});
			}

			if (_this.cale && _this.cale.getSelectedDates().length === 0) {
				_this.setBtnEnabled("LRS4_BTN_SEND", false);
			} else {
				_this.setBtnEnabled("LRS4_BTN_SEND", true);
			}

			/**
			 * @ControllerHook Extend load behavior of home view
			 * This hook method can be used to add UI or business logic
			 * It is called when the routeMatched event name match with home
			 * @callback hcm.myleaverequest.view.S1~extHookRouteMatchedHome
			 */
			if (this.extHookRouteMatchedHome) {
				this.extHookRouteMatchedHome();
			}

		} else if (evt.getParameter("name") === "change") {

			hcm.myleaverequest.utils.DataManager.init(this.oDataModel, this.resourceBundle);
			this.objHeaderFooterOptions.sI18NFullscreenTitle = "LR_TITLE_CHANGE_VIEW";
			this.setHeaderFooterOptions(this.objHeaderFooterOptions);
			hcm.myleaverequest.utils.UIHelper.setControllerInstance(this);
			this.oChangeModeData = {};
			this.changeMode = true;
			this._clearData();

			var currntRequestId = evt.getParameters().arguments.requestID;

			var curntLeaveRequest = null,
				i;

			var consolidatedLeaveRequestcollection = hcm.myleaverequest.utils.DataManager.getCachedModelObjProp("ConsolidatedLeaveRequests");

			if (consolidatedLeaveRequestcollection) {
				for (i = 0; i < consolidatedLeaveRequestcollection.length; i++) {
					if (consolidatedLeaveRequestcollection[i].RequestID == currntRequestId) {
						curntLeaveRequest = consolidatedLeaveRequestcollection[i];
					}
				}

				//requestID is null
				if (curntLeaveRequest == null) {
					for (i = 0; i < consolidatedLeaveRequestcollection.length; i++) {
						if (consolidatedLeaveRequestcollection[i].LeaveKey == currntRequestId) {
							curntLeaveRequest = consolidatedLeaveRequestcollection[i];
						}
					}
				}
			}

			if (!curntLeaveRequest) {
				/*hcm.myleaverequest.utils.UIHelper.errorDialog([this.resourceBundle.getText("LR_DD_GENERIC_ERR"), 
					                                                    "hcm.myleaverequest.view.S1",
					                                                    "_handleRouteMatched",
					                                                    "curntLeaveRequest is null"]);*/
				jQuery.sap.log.warning("curntLeaveRequest is null", "_handleRouteMatched", "hcm.myleaverequest.view.S1");
				this.oRouter.navTo("home", {}, true);
			} else {
				var startDate_UTC = hcm.myleaverequest.utils.Formatters.getDate(curntLeaveRequest.StartDate);
				var endDate_UTC = hcm.myleaverequest.utils.Formatters.getDate(curntLeaveRequest.EndDate);
				startDate_UTC = new Date(startDate_UTC.getUTCFullYear(), startDate_UTC.getUTCMonth(), startDate_UTC.getUTCDate(), 0, 0, 0);
				endDate_UTC = new Date(endDate_UTC.getUTCFullYear(), endDate_UTC.getUTCMonth(), endDate_UTC.getUTCDate(), 0, 0, 0);
				_this.oChangeModeData.requestId = curntLeaveRequest.RequestID;
				_this.oChangeModeData.leaveTypeCode = curntLeaveRequest.AbsenceTypeCode;
				_this.oChangeModeData.startDate = startDate_UTC.toString();
				_this.oChangeModeData.endDate = endDate_UTC.toString();
				_this.oChangeModeData.requestID = curntLeaveRequest.RequestID;
				_this.oChangeModeData.noteTxt = curntLeaveRequest.Notes;
				_this.oChangeModeData.startTime = curntLeaveRequest.StartTime;
				_this.oChangeModeData.endTime = curntLeaveRequest.EndTime;
				_this.oChangeModeData.employeeID = curntLeaveRequest.EmployeeID;
				_this.oChangeModeData.changeStateID = curntLeaveRequest.ChangeStateID;
				_this.oChangeModeData.leaveKey = curntLeaveRequest.LeaveKey;
				_this.oChangeModeData.evtType = _this._getCaleEvtTypeForStatus(curntLeaveRequest.StatusCode);
				_this.oChangeModeData.StatusCode = curntLeaveRequest.StatusCode;
				_this.oChangeModeData.ApproverEmployeeID = curntLeaveRequest.ApproverEmployeeID;
				_this.oChangeModeData.ApproverEmployeeName = curntLeaveRequest.ApproverEmployeeName;
				_this.oChangeModeData.WorkingHoursDuration = curntLeaveRequest.WorkingHoursDuration;
				_this.oChangeModeData.AttachmentDetails = curntLeaveRequest.AttachmentDetails;
				try {
					_this.oChangeModeData.AdditionalFields = curntLeaveRequest.AdditionalFields;
					_this.oChangeModeData.MultipleApprovers = curntLeaveRequest.MultipleApprovers;
				} catch (e) {
					jQuery.sap.log.warning("falied to copy additional fields" + e, "_handleRouteMatched", "hcm.myleaverequest.view.S1");
				}

				//to handle navigations from history>Change screen (create screen is loading first time)
				if (!hcm.myleaverequest.utils.DataManager.getCachedModelObjProp("DefaultConfiguration")) {
					_this.initializeView(_this.oChangeModeData.leaveTypeCode);
				} else {
					_this._setUpLeaveTypeData(_this.oChangeModeData.leaveTypeCode);
				}
				//_copyChangeModeData has dependencies on leaveType selected
				var combinedPromise = $.when(hcm.myleaverequest.utils.DataManager.getAbsenceTypeCollection());
				combinedPromise.done(function(leaveTypeColl) {
					_this.leaveType = _this._readWithKey(leaveTypeColl, _this.oChangeModeData.leaveTypeCode);
					_this._copyChangeModeData();
				});

				//disable time inputs if the leaveRange > 1
				if (_this.cale.getSelectedDates().length > 1) {
					if (this.timeFrom) {
						this.timeFrom.setValue("");
						this.timeFrom.setEnabled(false);
					}
					if (this.timeTo) {
						this.timeTo.setValue("");
						this.timeTo.setEnabled(false);
					}
				}
				// send button should be disabled if no date is selected
				if (_this.cale && _this.cale.getSelectedDates().length === 0) {
					_this.setBtnEnabled("LRS4_BTN_SEND", false);
				} else {
					_this.setBtnEnabled("LRS4_BTN_SEND", true);
				}
			}
			//sap.ca.ui.utils.busydialog.releaseBusyDialog();

			/**
			 * @ControllerHook Extend load behavior of change view
			 * This hook method can be used to add UI or business logic
			 * It is called when the routeMatched event name match with change
			 * @callback hcm.myleaverequest.view.S1~extHookRouteMatchedChange
			 */
			if (this.extHookRouteMatchedChange) {
				this.extHookRouteMatchedChange();
			}
		}

	},

	_copyChangeModeData: function() {
		// In change mode the data to be displayed is not entered by the user instead it
		// comes from the LR selected in the history view - This method fills the data coming
		// from the history view into the screen elements of S4
		var _oStartTime = null;
		var _oEndTime = null;
		var _HH = 0;
		var _MM = 0;

		// set Start and End date for calendar
		if (this.oChangeModeData === {}) {
			return;
		}

		this.selRange.start = this.oChangeModeData.startDate;
		this.selRange.end = this.oChangeModeData.endDate;
		if (this.selRange.start === this.selRange.end) {
			this.selRange.end = null;
			if (this.cale) {
				this.cale.toggleDatesSelection([this.selRange.start], true);
			}
		} else {
			if (this.cale) {
				this.cale.toggleDatesRangeSelection(this.selRange.start, this.selRange.end, true);
			}
		}
		if (this.cale) {
			this.cale.setCurrentDate(this.selRange.start);
			this._setHighlightedDays(this.cale.getCurrentDate());
		}

		// set simple ones
		this.requestID = this.oChangeModeData.requestID;
		if (this.note) { // App Designer specific: in case note field was removed
			//remove previous note if exists
			if (!!this.byId("LRS4_NOTE") && this.byId("LRS4_NOTE").getContent().length > 2)
				this.byId("LRS4_NOTE").removeContent(1);

			//adding note text only if exists
			if (!!this.oChangeModeData.noteTxt && this.oChangeModeData.noteTxt !== "") {
				var oDataNotes = hcm.myleaverequest.utils.Formatters._parseNotes(this.oChangeModeData.noteTxt);
				var tempNote = "";
				for (var i = 0; i < oDataNotes.NotesCollection.length; i++) {
					tempNote = tempNote + oDataNotes.NotesCollection[i].Author + ":" + oDataNotes.NotesCollection[i].Text + "\n";
				}

				var noteText = new sap.m.Text({
					width: "100%",
					wrapping: true,
					layoutData: new sap.ui.layout.ResponsiveFlowLayoutData({
						weight: 8
					})
				});
				noteText.setText(tempNote);
				this.byId("LRS4_NOTE").insertContent(noteText, 1);
			}
		}
		//add attachments if exist
		this.byId("fileupload").removeAllItems();
		this.byId("fileupload").destroyItems();
		if (this.oChangeModeData.AttachmentDetails) {
			var oDataFiles = hcm.myleaverequest.utils.Formatters._parseAttachments(this.oChangeModeData.AttachmentDetails, this.oChangeModeData.RequestID,
				this.oDataModel);
			if (oDataFiles.AttachmentsCollection.length > 0) {
				var attachmentsModel = new sap.ui.model.json.JSONModel(oDataFiles);
				this.byId("fileupload").setModel(attachmentsModel, "files");
				this.byId("fileupload").setVisible(true);
			} else {
				this.byId("fileupload").setVisible(false);
			}
		}
		// set start and end Time
		if (typeof this.oChangeModeData.startTime === "string") {
			if (this.timeFrom) {
				if (this.oChangeModeData.startTime === "000000") {
					this.timeFrom.setValue("");
				} else {
					this.timeFrom.setValue(this.oChangeModeData.startTime.substring(0, 2) + ":" + this.oChangeModeData.startTime.substring(2, 4));
				}
			}
			if (this.timeTo) {
				if (this.oChangeModeData.endTime === "000000") {
					this.timeTo.setValue("");
				} else {
					this.timeTo.setValue(this.oChangeModeData.endTime.substring(0, 2) + ":" + this.oChangeModeData.endTime.substring(2, 4));
				}
			}
		} else {
			_oStartTime = new Date(this.oChangeModeData.startTime.ms);
			_HH = _oStartTime.getUTCHours();
			_MM = _oStartTime.getUTCMinutes();
			_HH = (_HH < 10 ? "0" : "") + _HH;
			_MM = (_MM < 10 ? "0" : "") + _MM;
			if (this.timeFrom) {
				this.timeFrom.setValue(_HH + ":" + _MM);
			}

			_oEndTime = new Date(this.oChangeModeData.endTime.ms);
			_HH = _oEndTime.getUTCHours();
			_MM = _oEndTime.getUTCMinutes();
			_HH = (_HH < 10 ? "0" : "") + _HH;
			_MM = (_MM < 10 ? "0" : "") + _MM;
			if (this.timeTo) {
				this.timeTo.setValue(_HH + ":" + _MM);
			}
			// this.timeFrom = _oStartTime.getHours().toString() + ":" + _oStartTime.getMinutes();
		}
		//if (this.send) {
		if (this.cale & this.cale.getSelectedDates().length === 0) {
			//this.send.setEnabled(false);
			this.setBtnEnabled("LRS4_BTN_SEND", false);
		} else {
			//this.send.setEnabled(true);
			this.setBtnEnabled("LRS4_BTN_SEND", true);
		}
		//};
		if (this.oChangeModeData.WorkingHoursDuration) {
			this.byId("LRS4_ABS_HOURS").setValue(this.oChangeModeData.WorkingHoursDuration);
		}

		//process additional Fields:
		try {
			if (this.leaveType.AdditionalFields && this.leaveType.AdditionalFields.results.length > 0) {
				var oContent = this.byId("LRS4_FR_ADDN_FIELDS_GRID").getContent();
				for (var k = 0; k < oContent.length; k++) {
					var oInput = oContent[k].getContent()[1];
					var fieldName = oInput.getCustomData()[0].getValue();
					oInput.setValue(this.oChangeModeData.AdditionalFields[fieldName]);
				}
			}
		} catch (e) {
			jQuery.sap.log.warning("falied to copy values to additional fields" + e, "_copyChangeModeData", "hcm.myleaverequest.view.S1");
		}
	},
	_clearData: function() {
		// All screen elements that can be changed by a user are set back to their initial values
		// This refresh is done when the screen is started (onNavigateTo) and when a new LR has
		// successfully been submitted (onSubmitLRCsuccess) and when changing/creating a LR is
		// aborted with the cancel button (onCancel)
		// This method does NO refresh of the ajax buffer or the calendarTool buffer
//		if (!this.changeMode) {        NOTE 2294924
			this._clearDateSel();
//		}							   NOTE 2294924

		if (this._isLocalReset) {
			for (var i = 0; i < this.calSelResetData.length; i++) {
				this.cale.toggleDatesType(this.calSelResetData[i].calEvt, this.calSelResetData[i].evtType, false);
			}
			this.calSelResetData = [];
		}
		//Retain the change mode data.. needed in case if employee tries to change the leave consecutively
		if (!this.changeMode) {
			this.oChangeModeData = {};
		}
		if (this.cale) {
			this.cale.setCurrentDate(new Date());
		}
		if (this.note) { // App Designer specific: in case note field was removed
			this.note.setValue("");
			//remove previous note if exists
			if (!!this.byId("LRS4_NOTE") && this.byId("LRS4_NOTE").getContent().length > 2)
				this.byId("LRS4_NOTE").removeContent(1);
		}
		if (this.timeFrom) {
			this.timeFrom.setValue("");
			this.timeFrom.rerender(); //workaround since setValue won't remove HTML content in the input box in Mobile devices
			this.timeFrom.setEnabled(true);
		}
		if (this.timeTo) {
			this.timeTo.setValue("");
			this.timeTo.rerender(); //workaround since setValue won't remove HTML content in the input box in Mobile devices
			this.timeTo.setEnabled(true);
		}
		if (this.byId("LRS4_ABS_HOURS")) {
			this.byId("LRS4_ABS_HOURS").setValue("");
			this.byId("LRS4_ABS_HOURS").rerender(); //workaround since setValue won't remove HTML content in the input box in Mobile devices
			this.byId("LRS4_ABS_HOURS").setEnabled(true);
		}
		if (this.byId("fileUploader")) {
			this.byId("fileUploader").setValue("");
		}
		this.setBtnEnabled("LRS4_BTN_SEND", false);
		if (this.byId("LRS4_LBL_TITLE")) {
			this.byId("LRS4_LBL_TITLE").setText(this.resourceBundle.getText("LR_TITLE_CREATE_VIEW"));
		}

		// set leave type to default absence type + get balances for absence type
		if (this.aLeaveTypes.length > 0 && this.changeMode === false && this._isLocalReset === true) {

			//var defaultLeaveObj = hcm.myleaverequest.utils.DataManager.getCachedModelObjProp("DefaultConfigurations");
			this._setUpLeaveTypeData();
			// The selection inthe drop down list needs also to be reset to the default value but
			// setting the selected item programatically in sap.m.list does not work once the selection
			// was done by a real tap event...
			// Therefore then list content is destroyed and rebuild here which also resets the selection.
			// The tap handler will then set the selection to the default value (first list item)
		}

		this._isLocalReset = false;

		/**
		 * @ControllerHook Extend behavior of clearing of data
		 * This hook method can be used to add UI or business logic
		 * It is called when the clearData method executes
		 * @callback hcm.myleaverequest.view.S1~extHookClearData
		 */
		if (this.extHookClearData) {
			this.extHookClearData();
		}

	},

	_clearDateSel: function() {
		// remove all selected days from the calendar control and from selRange
		if (this.cale) {
			this.cale.unselectAllDates();
		}
		this.selRange.end = null;
		this.selRange.start = null;
		//if (this.send) {
		//this.send.setEnabled(false);
		this.setBtnEnabled("LRS4_BTN_SEND", false);
		//}
	},

	_initCalendar: function() {
		// Here the initial setup for the calendar and the calendar legend is done
		// this setting is refined depending on the used device and device orientation
		// in deviceDependantLayout() and leaveTypeDependantSettings()
		if (this.cale) {
			this.cale.setSwipeToNavigate(true);
			// handler for paging in calendar
			this.cale.attachChangeCurrentDate(this._onChangeCurrentDate, this);
			// handler for date selection
			this.cale.attachTapOnDate(this._onTapOnDate, this);
			// disable swipe range selection -> we do the range selection using 'tap'
			this.cale.setEnableMultiselection(false);
			// setup display for moth
			this.cale.setWeeksPerRow(1);

		}

		// create legend
		if (this.legend) {
			this.legend.setLegendForNormal(this.resourceBundle.getText("LR_WORKINGDAY"));
			this.legend.setLegendForType00(this.resourceBundle.getText("LR_NONWORKING"));
			this.legend.setLegendForType01(this.resourceBundle.getText("LR_APPROVELEAVE"));
			this.legend.setLegendForType04(this.resourceBundle.getText("LR_APPROVEPENDING"));
			this.legend.setLegendForType06(this.resourceBundle.getText("LR_PUBLICHOLIDAY"));
			this.legend.setLegendForType07(this.resourceBundle.getText("LR_REJECTEDLEAVE"));
			this.legend.setLegendForToday(this.resourceBundle.getText("LR_DTYPE_TODAY"));
			this.legend.setLegendForSelected(this.resourceBundle.getText("LR_DTYPE_SELECTED"));
		}

		/**
		 * @ControllerHook Extend behavior of initializing calendar
		 * This hook method can be used to add UI or business logic
		 * It is called when the initCalendar method executes
		 * @callback hcm.myleaverequest.view.S1~extHookInitCalendar
		 */
		if (this.extHookInitCalendar) {
			this.extHookInitCalendar();
		}

	},

	//TODO Orientation
	registerForOrientationChange: function(oApp) {
		// called by Main.controller.js during init
		// registration is only done on tablets
		if (sap.ui.Device.system.tablet) {
			this.parentApp = oApp;
			oApp.attachOrientationChange(jQuery.proxy(this._onOrientationChanged, this));
		}
	},

	_onOrientationChanged: function() {
		// the dynamic layout for orientation changes is done in leaveTypeDependantSettings
		this._leaveTypeDependantSettings(this.leaveType, false);
	},

	_onTapOnDate: function(evt) {
		// tap handler for calendar control
		// Depending on the AllowedDurationMultipleDayInd the selection of a single day or a range of days is allowed
		// selecting a singel day: tap on a day
		// deselecting a sngle day: select a different day or tap again on a selected day
		// selecting a range of days: tap on one day to select it then tap an a different day to select both
		// days and all days between them
		// deselecting a range: tapping an a day while a range of days is selected deselects the range and the tapped
		// day becomes selected
		var _aSelction;

		if (this.cale) {
			_aSelction = this.cale.getSelectedDates();
		}

		if (this.leaveType.AllowedDurationMultipleDayInd === false) {
			// there are Absence Types where partial days AND multiple days are allowed
			// || this.leaveType.AllowedDurationPartialDayInd === true) {
			// only one day may be selected at a time
			// no special treatment needed

		} else if (this.leaveType.AllowedDurationMultipleDayInd) {
			// Ranges and single days are allowed
			if (_aSelction.length === 0) {
				// ************** a selection was removed *****************
				if (this.selRange.start !== null && this.selRange.end !== null) {
					// a selected range was deselected -> the new selection replaces the old}
					this._clearDateSel();
					if (evt.getParameters().date !== "") {
						this.selRange.start = evt.getParameters().date;
						if (this.cale) {
							this.cale.toggleDatesSelection([this.selRange.start], true);
						}
					}
				} else if (this.selRange.start !== null && this.selRange.end === null) {
					// A single field was deselected -> remove selection
					this._clearDateSel();
				}
			}
			// // ************** something was selected *****************
			else if (this.selRange.start === null) {
				// start date of range selected
				this.selRange.start = evt.getParameters().date;
			} else if (this.selRange.end === null) {
				// end date of range selected
				this.selRange.end = evt.getParameters().date;
				if (this.cale) {
					this.cale.toggleDatesRangeSelection(this.selRange.start, this.selRange.end, true);
				}
			} else {
				this.selRange.start = evt.getParameters().date;
				this.selRange.end = null;
				// this.selRange.lastTap = null;
				if (this.cale) {
					this.cale.toggleDatesSelection([this.selRange.start], true);
				}
			}
		}

		// if partial days AND multiple days are allowed the time input fields shall only be open
		// for input if a single day is selected
		if (this.leaveType.AllowedDurationMultipleDayInd === true && this.timeFrom && this.timeTo) {
			_aSelction = this.cale.getSelectedDates();
			if (_aSelction.length > 1) {
				this.timeFrom.setValue("");
				this.timeTo.setValue("");
				this.byId("LRS4_ABS_HOURS").setValue("");
				this.timeFrom.setEnabled(false);
				this.timeTo.setEnabled(false);
				this.byId("LRS4_ABS_HOURS").setEnabled(false);
			} else {
				this.timeFrom.setEnabled(true);
				this.timeTo.setEnabled(true);
				this.byId("LRS4_ABS_HOURS").setEnabled(true);
			}
    // Begin of LAK2260406 
        }else if(this.leaveType.AllowedDurationMultipleDayInd === false){
            _aSelction = this.cale.getSelectedDates();                                            
            if (_aSelction.length > 1) {
                this.timeFrom.setValue("");
                this.timeTo.setValue("");
                this.byId("LRS4_ABS_HOURS").setValue("");
                this.timeFrom.setEnabled(false);
                this.timeTo.setEnabled(false);
                this.byId("LRS4_ABS_HOURS").setEnabled(false);
            } else {
                this.timeFrom.setEnabled(true);
                this.timeTo.setEnabled(true);
                this.byId("LRS4_ABS_HOURS").setEnabled(true);
            }
        }    
    //End of LAK2260406

		

		if (this.cale && this.cale.getSelectedDates().length === 0) {
			this.setBtnEnabled("LRS4_BTN_SEND", false);
		} else {
			this.setBtnEnabled("LRS4_BTN_SEND", true);
		}

		/**
		 * @ControllerHook Extend behavior of tap on Date
		 * This hook method can be used to add UI or business logic
		 * It is called when the onTapOnDate method executes
		 * @callback hcm.myleaverequest.view.S1~extHookTapOnDate
		 */
		if (this.extHookTapOnDate) {
			this.extHookTapOnDate();
		}

	},

	_setHighlightedDays: function(strDate) {
		// This method triggers the reading of the calendar events from the backend for the
		// currently displayed month as well as the previous and next month.
		// Buffering of the calendar events is done in calendarTools.js
		var _oDate;
		//incorporating framework change
		try {
			_oDate = sap.me.Calendar.parseDate(strDate);
		} catch (e) {
			_oDate = new Date(strDate);
		}
		//sap.ca.ui.utils.busydialog.requireBusyDialog();
		hcm.myleaverequest.utils.CalendarTools.getDayLabelsForMonth(_oDate, this._getCalLabelsOK,
			this._getCalLabelsError);

		/**
		 * @ControllerHook Extend behavior of highlighted days
		 * This hook method can be used to add UI or business logic
		 * It is called when the setHighlightedDays method executes
		 * @callback hcm.myleaverequest.view.S1~extHookSetHighlightedDays
		 */
		if (this.extHookSetHighlightedDays) {
			this.extHookSetHighlightedDays();
		}

	},

	_getCalLabelsOK: function(oCalEvents) {

		var _this = hcm.myleaverequest.utils.UIHelper.getControllerInstance();
		/*
		 maps the back end status to the corresponding sap.me.calendar event type
		 sap.me.CalendarEventType.Type00 Type00 (non-working day)
		 sap.me.CalendarEventType.Type10 Type10 (working day) ONLY Available after 1.22.x hence we have check
		 sap.me.CalendarEventType.Type01 Type01 (Booked/Approved)
		 sap.me.CalendarEventType.Type04 Type04 (open request / manager action needed)
		 sap.me.CalendarEventType.Type06 Type06 (public holiday)
		 sap.me.CalendarEventType.Type07 Type07 (deletion requested / your action needed/ Rejected)
		 Precedences(low---high) : REJECTED< SENT< (APPROVED|POSTED)
		 It means if you have two leave requests on same day, Approved will more precedence than rejected one.
		 WEEKEND , WORKDAY, PHOLIDAY, (all LEAVE TYPES) are independent. 
		 Hence toggling is needed only b/w leave types
		 */
		if (!!oCalEvents.REJECTED && oCalEvents.REJECTED.length > 0) {
			_this.cale.toggleDatesType(oCalEvents.REJECTED, sap.me.CalendarEventType.Type07, true);
			_this.cale.toggleDatesType(oCalEvents.REJECTED, sap.me.CalendarEventType.Type04, false);
			_this.cale.toggleDatesType(oCalEvents.REJECTED, sap.me.CalendarEventType.Type01, false);
		}
		if (!!oCalEvents.SENT && oCalEvents.SENT.length > 0) {
			_this.cale.toggleDatesType(oCalEvents.SENT, sap.me.CalendarEventType.Type07, false);
			_this.cale.toggleDatesType(oCalEvents.SENT, sap.me.CalendarEventType.Type04, true);
			_this.cale.toggleDatesType(oCalEvents.SENT, sap.me.CalendarEventType.Type01, false);
		}
		if (!!oCalEvents.APPROVED && oCalEvents.APPROVED.length > 0) {
			_this.cale.toggleDatesType(oCalEvents.APPROVED, sap.me.CalendarEventType.Type07, false);
			_this.cale.toggleDatesType(oCalEvents.APPROVED, sap.me.CalendarEventType.Type04, false);
			_this.cale.toggleDatesType(oCalEvents.APPROVED, sap.me.CalendarEventType.Type01, true);
		}
		if (!!oCalEvents.POSTED && oCalEvents.POSTED.length > 0) {
			_this.cale.toggleDatesType(oCalEvents.POSTED, sap.me.CalendarEventType.Type07, false);
			_this.cale.toggleDatesType(oCalEvents.POSTED, sap.me.CalendarEventType.Type04, false);
			_this.cale.toggleDatesType(oCalEvents.POSTED, sap.me.CalendarEventType.Type01, true);
		}
		if (!!oCalEvents.WEEKEND && oCalEvents.WEEKEND.length > 0) {
		 _this.cale.toggleDatesType(oCalEvents.WEEKEND, sap.me.CalendarEventType.Type04, false); // FA2310160
		_this.cale.toggleDatesType(oCalEvents.WEEKEND, sap.me.CalendarEventType.Type01, false); // FA 2310160
			_this.cale.toggleDatesType(oCalEvents.WEEKEND, sap.me.CalendarEventType.Type00, true);
		}
		if (!!oCalEvents.PHOLIDAY && oCalEvents.PHOLIDAY.length > 0) {
		_this.cale.toggleDatesType(oCalEvents.PHOLIDAY, sap.me.CalendarEventType.Type04, false); //FA2310160
			_this.cale.toggleDatesType(oCalEvents.PHOLIDAY, sap.me.CalendarEventType.Type06, true);
		}
		if (!!oCalEvents.WORKDAY && oCalEvents.WORKDAY.length > 0) {
			if (sap.me.CalendarEventType.Type10) {
				_this.cale.toggleDatesType(oCalEvents.WORKDAY, sap.me.CalendarEventType.Type10, true);
			} else {
				_this.cale.toggleDatesType(oCalEvents.WORKDAY, "", true);
			}
		}
	},

	_getCaleEvtTypeForStatus: function(sStatus) {
		// maps the back end status to the corresponding sap.me.calendar event type
		// sap.me.CalendarEventType.Type00 Type 00 (non-working day (e.g.
		// sap.me.CalendarEventType.Type01 Type 01 (nonattendance / submitted day)
		// sap.me.CalendarEventType.Type04 Type 04 (open request / manager action needed)
		// sap.me.CalendarEventType.Type06 Type 06 (public holiday)
		// sap.me.CalendarEventType.Type07 Type 07 (deletion requested / your action needed/ Rejected)
		if (sStatus === "WEEKEND") {
			return sap.me.CalendarEventType.Type00;
		} else if (sStatus === "PHOLIDAY") {
			return sap.me.CalendarEventType.Type06;
		} else if (sStatus === "SENT") {
			return sap.me.CalendarEventType.Type04;
		} else if (sStatus === "POSTED" || sStatus === "APPROVED") {
			return sap.me.CalendarEventType.Type01;
		} else if (sStatus === "REJECTED") {
			return sap.me.CalendarEventType.Type07;
		} else if (sStatus === "WORKDAY") {
			if (sap.me.CalendarEventType.Type10)
				return sap.me.CalendarEventType.Type10;
			else return "";
		} else {
			return "";
		}
	},

	_getCalLabelsError: function(objResponse) {
		//sap.ca.ui.utils.busydialog.releaseBusyDialog();
		hcm.myleaverequest.utils.UIHelper.errorDialog(objResponse);
	},

	_onChangeCurrentDate: function(evt) {
		if (this.cale) {
			this._setHighlightedDays(this.cale.getCurrentDate());
		}
	},

	_getStartEndDate: function(aStringDates) {
		var _oDates = [];
		var _oDatesSorted = [];
		var oResponse = {};
		for (var i = 0; i < aStringDates.length; i++) {
			_oDates[i] = new Date(aStringDates[i]);
		}

		if (_oDates.length === 0) {
			oResponse.startDate = {};
			oResponse.endDate = {};
		} else if (_oDates.length === 1) {
			oResponse.startDate = _oDates[0];
			oResponse.endDate = _oDates[0];
		} else {
			_oDatesSorted = _oDates.sort(function(date1, date2) {
				if (date1 < date2)
					return -1;
				if (date1 > date2)
					return 1;
				return 0;
			});
			oResponse.startDate = _oDatesSorted[0];
			oResponse.endDate = _oDatesSorted[_oDatesSorted.length - 1];
		}

		return oResponse;
	},

	_getLeaveTypesFromModel: function() {
		// This method reads the absence types from the model and fills the information in aLeaveTypes.
		// THis method was done to handle the slightly different formats in which the absence type information
		// is stored in the model -> it can be a single records or an array depending on if mock data or oData data is used
		var _aLeaveTypes = new Array();
		for (var x in this.oDataModel.oData) {
			if (x.substring(0, 21) === "AbsenceTypeCollection") {
				if (this.oDataModel.oData[x] instanceof Array) {
					for (var i = 0; i < this.oDataModel.oData[x].length; i++) {
						_aLeaveTypes.push(this.oDataModel.oData[x][i]);
					}
				} else {
					_aLeaveTypes.push(this.oDataModel.oData[x]);
				}
			}
		}
		return _aLeaveTypes;
	},

	_setUpLeaveTypeData: function(absenceTypeCode) {
		// When the absence types are read for the first time the user has not yet
		// selected one absence type from the list. Therefore the absence type are
		// initially done for the first absence type of the list.
		if (!absenceTypeCode) {
			this.leaveType = this._getDefaultAbsenceType(this.aLeaveTypes);
			absenceTypeCode = this.leaveType.AbsenceTypeCode;
		} else {
			this.leaveType = this._readWithKey(this.aLeaveTypes, absenceTypeCode);
		}
		if (this.slctLvType) {
			this.slctLvType.setSelectedKey(absenceTypeCode);
		}
		this._leaveTypeDependantSettings(this.leaveType, false);
		this.getBalancesForAbsenceType(absenceTypeCode);
		this.selectorInititDone = true;
    // Begin of LAK2260406
        if(this.leaveType.AllowedDurationMultipleDayInd === false && this.cale.getSelectedDates().length > 1){
            this._clearDateSel();    
        }
    //End of LAK2260406

	},
	_setUpLeaveTypeDataNoInit: function(absenceTypeCode) {
		// Note 2286578 Keep latest appover selected and update balances
		this.leaveType.ApproverName = this.sApproverPernr;
        this.leaveType.ApproverPernr = this.sApprover;

		this.getBalancesForAbsenceType(absenceTypeCode);
        this.selectorInititDone = true;
	},
	
	// Note 2294673: Keep last approver when changing leave type
    _setUpLeaveTypeAfterChangedSelection: function(absenceTypeCode) {
    	this.leaveType.ApproverName = this.sApproverPernr;
        this.leaveType.ApproverPernr = this.sApprover;    
        
        this.leaveType = this._readWithKey(this.aLeaveTypes, absenceTypeCode);
        if (this.slctLvType) {
        	this.slctLvType.setSelectedKey(absenceTypeCode);
        }
        this._leaveTypeDependantSettings(this.leaveType, true);
        this.getBalancesForAbsenceType(absenceTypeCode);
        this.selectorInititDone = true;
    },                            

	
	_readWithKey: function(aList, keyValue) {
		// searches an arry for a given key/value pair and returns the first matching entry
		// used to search the array of absence types
		var oDefault;
		for (var i = 0; i < aList.length; i++) {
			if (aList[i].AbsenceTypeCode === keyValue) {
				oDefault = aList[i];
				return oDefault;
			}
		}
		if (aList.length > 1) {
			return aList[0];
		}
	},
	_getDefaultAbsenceType: function(aList) {
		// searches an arry for a given key/value pair and returns the first matching entry
		// used to search the array of absence types
		var oDefault;
		for (var i = 0; i < aList.length; i++) {
			if (aList[i].DefaultType === true) {
				oDefault = aList[i];
				return oDefault;
			}
		}
		//if defaultLeave Type is not fount in employee's leave types throw error! can't proceed.
		if (!oDefault) {
			hcm.myleaverequest.utils.UIHelper.errorDialog(this.resourceBundle.getText("LR_DD_GENERIC_ERR"));
			jQuery.sap.log.warning("couldn't find defaultLeaveType", "_getDefaultAbsenceType", "hcm.myleaverequest.view.S1");
		}
		//fallback case: send the first item as default one
		if (aList.length > 1) {
			return aList[0];
		}
	},

	_getBalancesBusyOn: function() {
		// Removes the "used days" and "remaining days" screen elements and replaces
		// them with busy indicators while the information is read asynchronously from the back end
		//Removal and addition is not optimal so visibilities are changed!		
		this.bookedVacation.setVisible(false);
		this.byId("LRS1_BUSY_BOOKEDDAYS").setVisible(true);
		this.remainingVacation.setVisible(false);
		this.byId("LRS1_BUSY_REMAININGDAYS").setVisible(true);
	},

	_getBalancesBusyOff: function() {
		// Removes the busy indicators and replaces them with the "used days" and "remaining days"
		// screen elements as soon as the asynchronous calls to get the information are finished
		//Removal and addition is not optimal so visibilities are changed!
		this.bookedVacation.setVisible(true);
		this.byId("LRS1_BUSY_BOOKEDDAYS").setVisible(false);
		this.remainingVacation.setVisible(true);
		this.byId("LRS1_BUSY_REMAININGDAYS").setVisible(false);
	},

	_leaveTypeDependantSettings: function(lt, bIgnoreApprover) {
    	/* Time input visibility is controlled based leaveType selected */
    	var oConfig = hcm.myleaverequest.utils.DataManager.getCachedModelObjProp("DefaultConfigurations");
        var oCustomData;
        if (lt && lt.AllowedDurationPartialDayInd) {
            if (this.timeInputElem && this.byId("LRS4_FELEM_ABSENCE") && oConfig) {
            	this.timeInputElem.setVisible(oConfig.RecordInClockTimesAllowedInd);
            	this.byId("LRS4_FELEM_ABSENCE").setVisible(oConfig.RecordInClockHoursAllowedInd);
        		}
            } else {
            	if (this.timeInputElem && this.byId("LRS4_FELEM_ABSENCE")) {
                	this.timeInputElem.setVisible(false);
                    this.byId("LRS4_FELEM_ABSENCE").setVisible(false);
                }	
        }
        if (lt) {
        	var approverName;
            var approverPernr;
            // Note 2294673: Keep last approver when changing leave type 
        	if (!bIgnoreApprover){
                this.byId("LR_FELEM_APPROVER").setVisible(lt.ApproverVisibleInd);
                this.byId("LRS4_APPROVER_NAME").setEnabled(!lt.ApproverReadOnlyInd);
                this.byId("LRS4_APPROVER_NAME").setShowSuggestion(!lt.ApproverReadOnlyInd);                                                   //NOTE 2316063
                if (this.changeMode && this.oChangeModeData.ApproverEmployeeID && this.oChangeModeData.ApproverEmployeeID !== "00000000") {   //NOTE 2306536
                	oCustomData = new sap.ui.core.CustomData({
                    "key": "ApproverEmployeeID",
                    "value": this.oChangeModeData.ApproverEmployeeID
                    });
                    this.byId("LRS4_APPROVER_NAME").setValue(this.oChangeModeData.ApproverEmployeeName);
                } else {
                    	//there is a mismatch in SEGW gateway model with Name and Pernr in AbsenceType entity. Have to be corrected with SP
                    approverName = lt.ApproverPernr !== "" ? lt.ApproverPernr : oConfig.DefaultApproverEmployeeName;
                    approverPernr = lt.ApproverName !== "" ? lt.ApproverName : oConfig.DefaultApproverEmployeeID;
                    oCustomData = new sap.ui.core.CustomData({
                                    "key": "ApproverEmployeeID",
                                    "value": approverPernr
                                    });
                    this.byId("LRS4_APPROVER_NAME").setValue(approverName);
                } 
            } else {
          		// Note 2297127: 2297127 - Approver enablement 
          		this.byId("LR_FELEM_APPROVER").setVisible(lt.ApproverVisibleInd);
                this.byId("LRS4_APPROVER_NAME").setEnabled(!lt.ApproverReadOnlyInd);
                // Note 2294673: Keep last approver when changing leave type
                approverName = lt.ApproverPernr = this.byId("LRS4_APPROVER_NAME").getValue();
        		approverPernr = lt.ApproverName;
            }
			this.byId("LRS4_APPROVER_NAME").removeAllCustomData();
			this.byId("LRS4_APPROVER_NAME").addCustomData(oCustomData);
			this.byId("LRS4_FELEM_NOTE").setVisible(lt.NoteVisibleInd);
			this.byId("LRS4_FELEM_FILEATTACHMENTS").setVisible(lt.AttachmentEnabled);
			//Reset the values
			this.timeFrom.setValue("");
			this.timeTo.setValue("");
			this.byId("LRS4_ABS_HOURS").setValue("");
			this.note.setValue("");
			this.byId("fileUploader").setValue("");
			}
		var oAddFieldsModel = new sap.ui.model.json.JSONModel();
		var oGrid = this.byId("LRS4_FR_ADDN_FIELDS_GRID");
		oGrid.destroyContent();
		if (lt.AdditionalFields && lt.AdditionalFields.results.length > 0) {
			oAddFieldsModel.setData(lt.AdditionalFields.results);
			oGrid.setModel(oAddFieldsModel);
			var oVerticalLayout = new sap.ui.layout.VerticalLayout({
				width: "100%",
				content: [
					new sap.m.Label({
						width: "100%",
						text: "{FieldLabel}",
						layoutData: new sap.ui.layout.ResponsiveFlowLayoutData({
							linebreak: true,
							baseSize: "100%"
						}),
						required: "{path:'Required',formatter:'hcm.myleaverequest.utils.Formatters.isRequired'}"
					}),
					new sap.m.Input({
						width: "100%",
						layoutData: new sap.ui.layout.ResponsiveFlowLayoutData({
							linebreak: true,
							baseSize: "100%"
						}),
						customData: new sap.ui.core.CustomData({
							"key": "FieldName",
							"value": "{Fieldname}"
						})
					})
				]
			});
			oGrid.bindAggregation("content", "/", oVerticalLayout);
		} else {
			oGrid.removeAllContent();
			oGrid.destroyContent();
		}
		try{
		if (lt.MultipleApproverFlag === false) {
			if (lt.AddDelApprovers && (this.byId("LR_APPROVER").getContent()[1].getItems()).length < 2) {
				var oButton = new sap.m.Button({
					//id: "addB" + oLevel,
					icon: "sap-icon://add",
					width: "38px",
					customData: new sap.ui.core.CustomData({
						"key": "Level",
						"value": 1
					}),
					enabled: lt.AddDelApprovers,
					press: this.handleAdd,
					layoutData: new sap.m.FlexItemData({
						growFactor: 1
					})
				});
				this.byId("LR_APPROVER").getContent()[1].insertItem(oButton, 1);
				this.byId("LR_APPROVER").getContent()[1].rerender();
			}
			this.byId("LRS4_FR_MUL_APP_GRID").removeAllContent();
			var oLevel = 2,
				j;
			//first MultipleApprover is already from default next processor, hence process from the second row
			//adhering to the webdynrpo logic
			if (this.changeMode) {
				if (this.oChangeModeData.MultipleApprovers.results.length > 0) {
					for (j = 1; this.oChangeModeData.MultipleApprovers.results && j < this.oChangeModeData.MultipleApprovers.results.length; j++) {
						this._addContentToGrid(oLevel++, this.oChangeModeData.MultipleApprovers.results[j], !lt.ApproverReadOnlyInd);     //NOTE 2306536
					}
			//BEGIN OF NOTE 2252943		
					approverPernr = this.oChangeModeData.MultipleApprovers.results[0].Pernr;                           
				        approverName = this.oChangeModeData.MultipleApprovers.results[0].Name;
					oCustomData = new sap.ui.core.CustomData({
						"key": "ApproverEmployeeID",
						"value": approverPernr
					});
					this.byId("LRS4_APPROVER_NAME").setValue(approverName);
					this.byId("LRS4_APPROVER_NAME").removeAllCustomData();
                                       this.byId("LRS4_APPROVER_NAME").addCustomData(oCustomData);
                                } else if(lt.MultipleApprovers.results.length > 0){
                                       for (j = 1; lt.MultipleApprovers && j < lt.MultipleApprovers.results.length; j++) {
						this._addContentToGrid(oLevel++, lt.MultipleApprovers.results[j], !lt.ApproverReadOnlyInd);                    //NOTE 2306536   
					}
   	                               approverPernr = lt.MultipleApprovers.results[0].Pernr;
				       approverName = lt.MultipleApprovers.results[0].Name;
				       oCustomData = new sap.ui.core.CustomData({
						"key": "ApproverEmployeeID",
						"value": approverPernr
					});
					this.byId("LRS4_APPROVER_NAME").setValue(approverName);
					this.byId("LRS4_APPROVER_NAME").removeAllCustomData();
                                        this.byId("LRS4_APPROVER_NAME").addCustomData(oCustomData);
            //END OF NOTE 2252943                            
				} else {
					this.byId("LRS4_FR_MUL_APP_GRID").removeAllContent();
				}
			} else {
				if (lt.MultipleApprovers.results.length > 0) {
					for (j = 1; lt.MultipleApprovers && j < lt.MultipleApprovers.results.length; j++) {
						this._addContentToGrid(oLevel++, lt.MultipleApprovers.results[j], !lt.ApproverReadOnlyInd);                  //NOTE 2306536      
					}
//BEGIN OF NOTE 2306536					
					approverPernr = this.oChangeModeData.MultipleApprovers.results[0].Pernr;                           
				        approverName = this.oChangeModeData.MultipleApprovers.results[0].Name;
					oCustomData = new sap.ui.core.CustomData({
						"key": "ApproverEmployeeID",
						"value": approverPernr
					});
					this.byId("LRS4_APPROVER_NAME").setValue(approverName);
					this.byId("LRS4_APPROVER_NAME").removeAllCustomData();
                                       this.byId("LRS4_APPROVER_NAME").addCustomData(oCustomData);	
//END OF NOTE 2306536                                       
				} else {
					this.byId("LRS4_FR_MUL_APP_GRID").removeAllContent();
				}
			}
		}}catch(e){
			jQuery.sap.log.warning("falied to process Multiple Approvers" + e.message, "_leaveTypeDependantSettings", "hcm.myleaverequest.view.S1");
		}
	},

	_orientationDependancies: function(currentMode) {
		/*Months to be visible and layoutData is decided based on device type and orientation*/
		//backward compatibility for getLayoutData
		try {
			if (sap.ui.Device.system.phone === true) {
				if (this.cale) {
					this.cale.setMonthsToDisplay(1);
					this.cale.setMonthsPerRow(1);
				}
			} else {
				if (currentMode === "portrait") {
					if (this.byId("LRS4_FRM_CNT_CALENDAR") && this.byId("LRS4_FRM_CNT_CALENDAR").getLayoutData()) {
						this.byId("LRS4_FRM_CNT_CALENDAR").getLayoutData().setWeight(5);
					}
					if (this.cale) {
						this.cale.setMonthsToDisplay(1);
						this.cale.setMonthsPerRow(1);
					}
					if (this.formContainer && this.formContainer.getLayoutData()) {
						this.formContainer.getLayoutData().setWeight(5);
					}
				} else if (currentMode === "landscape" && this.byId("LRS4_FRM_CNT_CALENDAR").getLayoutData()) {
					if (this.byId("LRS4_FRM_CNT_CALENDAR")) {
						this.byId("LRS4_FRM_CNT_CALENDAR").getLayoutData().setWeight(6);
					}
					if (this.cale) {
						this.cale.setMonthsToDisplay(2);
						this.cale.setMonthsPerRow(2);
					}
					if (this.formContainer && this.formContainer.getLayoutData()) {
						this.formContainer.getLayoutData().setWeight(3);
					}
				}
			}
		} catch (e) {
			jQuery.sap.log.warning("Unable to set the orientation Dependancies:" + e.message, [], [
				"hcm.myleaverequest.view.S1.controller._orientationDependancies"
			]);
		}
	},

	_deviceDependantLayout: function() {
		// This method defines the screen layout depending on the used device.
		// The only mechanism used here to rearrange the screen elements is the line-break
		// function of the sap.ui.commons.form.Form control.
		// The initial screen layout as defined in the html view is used for phones
		try {
			if (sap.ui.Device.system.phone) {
				// ******************** PHONE start ********************
				if (this.byId("LRS4_LEGEND")) {
					this.byId("LRS4_LEGEND").setExpandable(true);
					this.byId("LRS4_LEGEND").setExpanded(false);
				}
				if (this.timeInputElem) {
					this.timeInputElem.getLayoutData().setLinebreak(true);
				}

				if (this.formContainer) {
					this.formContainer.getLayoutData().setLinebreak(true);
					this.formContainer.getLayoutData().setWeight(3);
				}
				// ******************** PHONE end ********************
			} else {
				// ******************** TABLET / PC start *******************
				// scrolling is only needed for phone - disabled on other devices
				if (this.byId("S4")) {
					this.byId("S4").setEnableScrolling(false);
				}
				// Calendar - default full day? - Cale takes up complete 1st row
				if (this.byId("LRS4_FRM_CNT_CALENDAR")) {
					this.byId("LRS4_FRM_CNT_CALENDAR").getLayoutData().setWeight(6);
				}
				if (this.cale) {
					this.cale.setMonthsToDisplay(2);
					this.cale.setMonthsPerRow(2);
				}

				if (this.formContainer) {
					this.formContainer.getLayoutData().setLinebreak(false);
					this.formContainer.getLayoutData().setWeight(3);
				}
				// Balances
				if (this.balanceElem) {
					this.balanceElem.getLayoutData().setLinebreak(false);
				}

				// Time Input
				// - default full day? - Time Input should not be shown
				if (this.timeInputElem) {
					this.timeInputElem.getLayoutData().setLinebreak(true);
					this.timeInputElem.setVisible(false);
				}

				// Note
				if (this.noteElem) {
					this.noteElem.getLayoutData().setLinebreak(true);
				}

				// Legend
				if (this.byId("LRS4_LEGEND")) {
					this.byId("LRS4_LEGEND").setExpandable(true);
					this.byId("LRS4_LEGEND").setExpanded(true);
				}
				if (this.byId("LRS4_FRM_CNT_LEGEND")) {
					this.byId("LRS4_FRM_CNT_LEGEND").getLayoutData().setLinebreak(true);
					this.byId("LRS4_FRM_CNT_LEGEND").getLayoutData().setWeight(9);
				}
				// ******************** TABLET / PC end ********************
			}

			/**
			 * @ControllerHook Extend behavior of device Dependant Layout
			 * This hook method can be used to add UI or business logic
			 * It is called when the deviceDependantLayout method executes
			 * @callback hcm.myleaverequest.view.S1~extHookDeviceDependantLayout
			 */
			if (this.extHookDeviceDependantLayout) {
				this.extHookDeviceDependantLayout();
			}
		} catch (e) {
			jQuery.sap.log.warning("Unable to set the device Dependancies:" + e.message, [], [
				"hcm.myleaverequest.view.S1.controller._deviceDependantLayout"
			]);
		}
	},

	_getDaysOfRange: function(startDate, endDate) {
		var _startDate = null;
		var _endDate = null;
		var aDaysOfRange = [];

		if (startDate instanceof Date) {
			_startDate = new Date(startDate.getUTCFullYear(), startDate.getUTCMonth(), startDate.getUTCDate());
		} else if (typeof startDate === "string") {
			_startDate = new Date(startDate);
			//	_startDate = new Date(_startDate.getUTCFullYear(), _startDate.getUTCMonth(), _startDate.getUTCDate());
		}
		if (endDate instanceof Date) {
			_endDate = new Date(endDate.getUTCFullYear(), endDate.getUTCMonth(), endDate.getUTCDate());
		} else if (typeof endDate === "string") {
			_endDate = new Date(endDate);
			//	_endDate = new Date(_endDate.getUTCFullYear(), _endDate.getUTCMonth(), _endDate.getUTCDate());
		}
		if (_endDate === null) {
			_startDate = new Date(_startDate);
			return [_startDate.toDateString()];
		} else {
			while (_startDate <= _endDate) {
				// add day to result array
				aDaysOfRange.push(_startDate.toDateString());
				// proceed to the next day
				_startDate.setTime(_startDate.getTime() + 86400000);
			}
			return aDaysOfRange;
		}
	},

	onSend: function() {
		this.submit(true);
	},

	submit: function(isSimulation) {
		// This method is called when the "send" button is tapped after entering a new leave request
		// or changing an existing one.
		// The method is called two times during one "submit" event. The first time it is called by the
		// tap event handler of the submit button. This call is done with parameter isSimulation=true. This
		// parameter is passed on to the backend where the data is checked. If the check has a positive result
		// a confirmation popup with a summary of the lr data is show. When the user confirmr this popup this function
		// is called the second time this time not in simulate mode

		var sStartDate, sStartTime, sEndDate, sEndTime;
		// reset globals
		this.bApproverOK = null;
		this.bSubmitOK = null;
		this.oSubmitResult = {};
		this.bSimulation = isSimulation;

		if (this.cale) {
			var _oStartEndDates = this._getStartEndDate(this.cale.getSelectedDates());
			// collect data for submit
			if (this.timeFrom && this.timeTo && this.leaveType.AllowedDurationPartialDayInd) {
				sStartDate = hcm.myleaverequest.utils.Formatters.DATE_YYYYMMdd(_oStartEndDates.startDate) + 'T00:00:00';
				if (this.timeFrom.getValue() === "") {
					sStartTime = '000000';
				} else {
					sStartTime = this.timeFrom.getValue().substring(0, 2) + this.timeFrom.getValue().substring(3, 5) + "00";
				}
				sEndDate = hcm.myleaverequest.utils.Formatters.DATE_YYYYMMdd(_oStartEndDates.endDate) + 'T00:00:00';
				if (this.timeTo.getValue() === "") {
					sEndTime = '000000';
				} else {
					sEndTime = this.timeTo.getValue().substring(0, 2) + this.timeTo.getValue().substring(3, 5) + "00";
				}
			} else {
				sStartDate = hcm.myleaverequest.utils.Formatters.DATE_YYYYMMdd(_oStartEndDates.startDate) + 'T00:00:00';
				sStartTime = '000000';
				sEndDate = hcm.myleaverequest.utils.Formatters.DATE_YYYYMMdd(_oStartEndDates.endDate) + 'T00:00:00';
				sEndTime = '000000';
			}
			// submit leave request
			/* FA 2289793 <<
			if (!this.oBusy) {
				this.oBusy = new sap.m.BusyDialog();
			} FA 2289793 >> */
			this.oBusy.open();
			var notes = "";
			if (this.note) { // App Designer specific: in case note field was removed
				notes = this.note.getValue();
			}
			var oNewEntry = {};
			oNewEntry.StartDate = sStartDate;
			oNewEntry.StartTime = sStartTime;
			oNewEntry.Notes = notes;
			oNewEntry.ProcessCheckOnlyInd = (isSimulation ? true : false);
			oNewEntry.AbsenceTypeCode = this.leaveType.AbsenceTypeCode;
			oNewEntry.EndDate = sEndDate;
			oNewEntry.EndTime = sEndTime;
			oNewEntry.InfoType = this.leaveType.InfoType;

			if (this.byId("LRS4_ABS_HOURS").getValue()) {
				oNewEntry.WorkingHoursDuration = this.byId("LRS4_ABS_HOURS").getValue();
			}
			if (this.byId("LRS4_APPROVER_NAME").getValue()) {
				oNewEntry.ApproverEmployeeName = this.byId("LRS4_APPROVER_NAME").getValue();
			}
			try {
				oNewEntry.ApproverEmployeeID = this.byId("LRS4_APPROVER_NAME").getCustomData()[0].getValue();
			} catch (e) {
                if (!this.sApproverPernr) {
                               oNewEntry.ApproverEmployeeID = "";
                } else {
            	//2286578 - Keep approver when changing leave type
            	//this.sApproverPernr is stored when changing the approver
                 oNewEntry.ApproverEmployeeID = this.sApproverPernr;       
                }
			}
			//fetching and mapping additional fields data:
			oNewEntry.AdditionalFields = {};
			try {
				if (this.leaveType.AdditionalFields && this.leaveType.AdditionalFields.results.length > 0) {
					var oContent = this.byId("LRS4_FR_ADDN_FIELDS_GRID").getContent();
					for (var k = 0; k < oContent.length; k++) {
						var oInput = oContent[k].getContent()[1];
						var fieldName = oInput.getCustomData()[0].getValue();
						if (oInput.getValue() !== "") { // FA 2289793
						oNewEntry.AdditionalFields[fieldName] = oInput.getValue();
						} // FA 2289793
					}
				}
			} catch (e) {
				jQuery.sap.log.warning("falied to get additional fields" + e, "submit", "hcm.myleaverequest.view.S1");
				oNewEntry.AdditionalFields = {};
			}
			try {
				oNewEntry.MultipleApprovers = [];
				var grid = this.byId("LRS4_FR_MUL_APP_GRID");
				//update label text & custom data fields
				var oApprover = {
					Pernr: (oNewEntry.ApproverEmployeeID).toString(),
					Name: oNewEntry.ApproverEmployeeName,
					Seqnr: "1"
				};
				if(oApprover.Pernr !== ""){                                                            //NOTE 2316063
				oNewEntry.MultipleApprovers.push(oApprover);
				for (var j = 0; j < grid.getContent().length; j++) {
					var oFlexBox = grid.getContent()[j].getContent()[1];
					var oApproverInput = oFlexBox.getItems()[0];
					if (oApproverInput.getCustomData()[0].getValue()) {
						oApprover = {
							Pernr: (oApproverInput.getCustomData()[0].getValue()).toString(),
							Name: oApproverInput.getValue(),
							Seqnr: (j + 2).toString()
						};
						oNewEntry.MultipleApprovers.push(oApprover);
					}
				}
				}                                                                                  //NOTE 2316063
			} catch (e) {
				jQuery.sap.log.warning("falied to get additional fields" + e, "submit", "hcm.myleaverequest.view.S1");
				delete oNewEntry.MultipleApprovers;
			}

			if (this.changeMode) {
				// if an existing LR is changed additional data is needed to identify the lr to be changed
				oNewEntry.RequestID = this.oChangeModeData.requestID;
				oNewEntry.EmployeeID = hcm.myleaverequest.utils.UIHelper.getPernr();
				oNewEntry.ChangeStateID = this.oChangeModeData.changeStateID;
				oNewEntry.ActionCode = 2;
				oNewEntry.LeaveKey = this.oChangeModeData.leaveKey;
				oNewEntry.EmployeeID = hcm.myleaverequest.utils.UIHelper.getPernr();
				hcm.myleaverequest.utils.DataManager.changeLeaveRequest(oNewEntry, isSimulation, this.onSubmitLRCsuccess, this.onSubmitLRCfail, this.uploadFileAttachments);

			} else {
				oNewEntry.RequestID = ""; //new request- hence will be empty
				oNewEntry.EmployeeID = hcm.myleaverequest.utils.UIHelper.getPernr();
				oNewEntry.ActionCode = 1;
				hcm.myleaverequest.utils.DataManager.submitLeaveRequest(oNewEntry, isSimulation, this.onSubmitLRCsuccess, this.onSubmitLRCfail, this.uploadFileAttachments);
			}
		}

		/**
		 * @ControllerHook Extend behavior of submit
		 * This hook method can be used to add UI or business logic
		 * It is called when the submit method executes
		 * @callback hcm.myleaverequest.view.S1~extHookSubmit
		 */
		if (this.extHookSubmit) {
			this.extHookSubmit();
		}
	},

	onSubmitLRCfail: function(aErrorMessages) {
		var _this = hcm.myleaverequest.utils.UIHelper.getControllerInstance();
		_this.evalSubmitResult("submitLRC", false, {});
		_this.oBusy.close();

		/**
		 * @ControllerHook Extend behavior of request submit failure
		 * This hook method can be used to add UI or business logic
		 * It is called when the submit method executes
		 * @callback hcm.myleaverequest.view.S1~extHookOnSubmitLRCfail
		 * @param {object} ErrorMessages Object
		 * @return {object} ErrorMessages Object
		 */
		if (this.extHookOnSubmitLRCfail) {
			aErrorMessages = this.extHookOnSubmitLRCfail(aErrorMessages);
		}
		hcm.myleaverequest.utils.UIHelper.errorDialog(aErrorMessages);
	},

	onSubmitLRCsuccess: function(oResult, oMsgHeader) {
		var _this = hcm.myleaverequest.utils.UIHelper.getControllerInstance();
		/**
		 * @ControllerHook Extend behavior of request submit failure
		 * This hook method can be used to add UI or business logic
		 * It is called when the submit method executes
		 * @callback hcm.myleaverequest.view.S1~extHookOnSubmitLRCsuccess
		 * @param {object} oResult Object
		 * @param {object} oMsgHeader Object
		 * @return {object} Object with oResult and oMsgHeader
		 */
		if (this.extHookOnSubmitLRCsuccess) {
			var extResult = this.extHookOnSubmitLRCsuccess(oResult, oMsgHeader);
			oResult = extResult.oResult;
			oMsgHeader = extResult.oMsgHeader;
		}
		_this.oLRSuccessResult = oResult;
		// get approver for confirmation dialog
		if (_this.bSimulation) {
			if (oMsgHeader && oMsgHeader.severity) {
				// show the warning message in a MessageBox
				if (oMsgHeader.severity === "warning") {
					//inject the method into the native prototype for those browsers which don't support trim()
					if (typeof String.prototype.trim !== "function") {
						String.prototype.trim = function() {
							return this.replace(/^\s+|\s+$/g, '');
						};
					}
					var detailsMsg = "";
					oMsgHeader.details.forEach(function(entry) {
						detailsMsg += decodeURI(entry.message).trim() + '\r\n';
					});
					sap.ca.ui.message.showMessageBox({
							type: sap.ca.ui.message.Type.WARNING,
							message: decodeURI(oMsgHeader.message).trim(),
							details: detailsMsg
						},
						_this._fetchApprover(oResult));
				} else {
					_this._fetchApprover(oResult);
				}
			} else {
				_this._fetchApprover(oResult);
			}

		} else {
			// just for change mode - remove old day markings
			if (_this.cale && _this.changeMode) {
				var oDaysRange = _this._getDaysOfRange(_this.oChangeModeData.startDate, _this.oChangeModeData.endDate);
				_this.cale.toggleDatesType(oDaysRange, _this.oChangeModeData.evtType, false);
				_this._deleteOldDatesFromCalendarCache(oDaysRange, _this.oChangeModeData.StatusCode);
				//replace the oChangeModeData for the next change Action
				var startDate_UTC = hcm.myleaverequest.utils.Formatters.getDate(_this.oLRSuccessResult.StartDate);
				var endDate_UTC = hcm.myleaverequest.utils.Formatters.getDate(_this.oLRSuccessResult.EndDate);
				startDate_UTC = new Date(startDate_UTC.getUTCFullYear(), startDate_UTC.getUTCMonth(), startDate_UTC.getUTCDate(), 0, 0, 0);
				endDate_UTC = new Date(endDate_UTC.getUTCFullYear(), endDate_UTC.getUTCMonth(), endDate_UTC.getUTCDate(), 0, 0, 0);
				_this.oChangeModeData.requestId = _this.oLRSuccessResult.RequestID;
				_this.oChangeModeData.leaveTypeCode = _this.oLRSuccessResult.AbsenceTypeCode;
				_this.oChangeModeData.startDate = startDate_UTC.toString();
				_this.oChangeModeData.endDate = endDate_UTC.toString();
				_this.oChangeModeData.requestID = _this.oLRSuccessResult.RequestID;
				_this.oChangeModeData.noteTxt = _this.oLRSuccessResult.Notes;
				_this.oChangeModeData.startTime = _this.oLRSuccessResult.StartTime;
				_this.oChangeModeData.endTime = _this.oLRSuccessResult.EndTime;
				_this.oChangeModeData.employeeID = _this.oLRSuccessResult.EmployeeID;
				_this.oChangeModeData.changeStateID = _this.oLRSuccessResult.ChangeStateID;
				_this.oChangeModeData.leaveKey = _this.oLRSuccessResult.LeaveKey;
				_this.oChangeModeData.evtType = _this._getCaleEvtTypeForStatus(_this.oLRSuccessResult.StatusCode);
				_this.oChangeModeData.StatusCode = _this.oLRSuccessResult.StatusCode;
				_this.oChangeModeData.ApproverEmployeeID = _this.oLRSuccessResult.ApproverEmployeeID;
				_this.oChangeModeData.ApproverEmployeeName = _this.oLRSuccessResult.ApproverEmployeeName;
				_this.oChangeModeData.WorkingHoursDuration = _this.oLRSuccessResult.WorkingHoursDuration;
				_this.oChangeModeData.AttachmentDetails = _this.oLRSuccessResult.AttachmentDetails;
				try {
					_this.oChangeModeData.AdditionalFields = _this.oLRSuccessResult.AdditionalFields;
					_this.oChangeModeData.MultipleApprovers = _this.oLRSuccessResult.MultipleApprovers;
				} catch (e) {
					jQuery.sap.log.warning("falied to copy additional fields" + e, "onSubmitLRCsuccess", "hcm.myleaverequest.view.S1");
				}
			}
			sap.m.MessageToast.show(_this.resourceBundle.getText("LR_SUBMITDONE", [_this.sApprover]), {
				width: "15em"
			});
			_this._clearData();
			// Note 2286578 Keep latest appover selected and update balances
			_this._setUpLeaveTypeDataNoInit(_this.slctLvType.getSelectedKey());
			_this.note.setValue("");
			if (_this.cale) {
				//temp solution
				var datesArray = _this.cale.getSelectedDates();

				var daysOfRange = _this._getDaysOfRange(_this.oLRSuccessResult.StartDate, _this.oLRSuccessResult.EndDate);
				if (!daysOfRange) {
					daysOfRange = _this._getDaysOfRange(datesArray[0], datesArray[datesArray.length - 1]);
				}
				//Updating the Calendar Cache
				for (var i = 0; i < daysOfRange.length; i++) {
					var currDate = new Date(daysOfRange[i]);
					//get the first day of month and its cache data
					var firstDayOfMonth = new Date(currDate.getFullYear(), currDate.getMonth(), 1);
					var CalCache = hcm.myleaverequest.utils.CalendarTools.oCache;
					//check if cache exists for that month
					if (CalCache.hasOwnProperty(firstDayOfMonth.toString())) {
						var currObj = CalCache[firstDayOfMonth];
						//find the date in all the other arrays and remove it
						for (var key in currObj) {
							if (currObj.hasOwnProperty(key)) {
								if (currObj[key].length > 0) {
									for (var j = 0; j < currObj[key].length; j++) {
										//direct comparison would lead to erraneous output
										//hence convert both to dates and then to sting and then compare
										if ((new Date(currObj[key][j])).toString() == (new Date(currDate)).toString()) {
											//delete currObj[key][j]; // DON'T USE because it sets it to undefined
											currObj[key].splice(j, 1);
											//delete the array if its empty || else it creates trouble in label painting
											if (currObj[key].length < 1) {
												delete currObj[key]; //use delete here, because key is not integer/index
											}
											break;
										}
									}
								}
							}
						}

						//push to Approval pending i.e., SENT array OR APPROVED array
						//if array exists already
						if (_this.oLRSuccessResult.StatusCode === "APPROVED") {
							if (currObj.hasOwnProperty("APPROVED"))
								currObj.APPROVED.push(daysOfRange[i]);
							//else create the array and push
							else {
								currObj.APPROVED = new Array(daysOfRange[i]);
							}
						} else {
							if (currObj.hasOwnProperty("SENT"))
								currObj.SENT.push(daysOfRange[i]);
							//else create the array and push
							else {
								currObj.SENT = new Array(daysOfRange[i]);
							}
						}
					}
				}
				_this.cale.toggleDatesType(daysOfRange, sap.me.CalendarEventType.Type06, false);
				_this.cale.toggleDatesType(daysOfRange, sap.me.CalendarEventType.Type01, false);
				_this.cale.toggleDatesType(daysOfRange, sap.me.CalendarEventType.Type07, false);
				_this.cale.toggleDatesType(daysOfRange, sap.me.CalendarEventType.Type04, false);
				if (sap.me.CalendarEventType.Type10) {
					_this.cale.toggleDatesType(daysOfRange, sap.me.CalendarEventType.Type10, false);
				}
				if (_this.oLRSuccessResult.StatusCode === "APPROVED" || _this.oLRSuccessResult.StatusCode === "POSTED") {
					_this.cale.toggleDatesType(daysOfRange, sap.me.CalendarEventType.Type01, true);
				} else {
					_this.cale.toggleDatesType(daysOfRange, sap.me.CalendarEventType.Type04, true);
				}

			}
		}
		_this.oBusy.close();
	},

	_fetchApprover: function(oLRResult) {
		var _this = hcm.myleaverequest.utils.UIHelper.getControllerInstance();
		var _oResult = {};
		if (oLRResult.ApproverEmployeeName !== "") {
			//reset to selected item. issue with binding trigger. need to check.
			_this.slctLvType.setSelectedKey(_this.leaveType.AbsenceTypeCode);

			_oResult.sApprover = _this.sApprover = oLRResult.ApproverEmployeeName;
			_oResult.sApproverPernr = _this.sApproverPernr = oLRResult.ApproverEmployeeID;
			_this.evalSubmitResult("getApprover", true, _oResult);
			_this.evalSubmitResult("submitLRC", true, _this.oLRSuccessResult);

		} else {
			hcm.myleaverequest.utils.DataManager.getApprover(function(sApprover) {
				//reset to selected item. issue with binding trigger. need to check.
				_this.slctLvType.setSelectedKey(_this.leaveType.AbsenceTypeCode);

				_oResult.sApprover = _this.sApprover = sApprover;
				_this.evalSubmitResult("getApprover", true, _oResult);
				_this.evalSubmitResult("submitLRC", true, _this.oLRSuccessResult);

			}, function() {
				_oResult.sApprover = _this.resourceBundle.getText("LR_UNKNOWN");
				_this.evalSubmitResult("getApprover", false, _oResult);
			}, this);
		}

	},

	evalSubmitResult: function(sCaller, bSuccess, oResult) {
		// evaluate the results of two asynchronous calls (submit leave request and get approver) to decide when the
		// confirmation popup can be shown
		var _this = hcm.myleaverequest.utils.UIHelper.getControllerInstance();
		if (sCaller === "submitLRC") {
			_this.bSubmitOK = bSuccess;
			_this.oSubmitResult = oResult;
		}
		if (sCaller === "getApprover") {
			_this.bApproverOK = bSuccess;
			_this.sApprover = oResult.sApprover;
		}
		if (_this.bSubmitOK === false) {
			//if (_this.oBusy) { FA 2289793
				_this.oBusy.close();
			//} FA 2289793
			// errors are already shown by the caller
		} else if (_this.bSubmitOK === true) {
			if (_this.bApproverOK === false) {
				//if (_this.oBusy) { FA 2289793
					_this.oBusy.close();
				// } FA 2289793
				_this.callDialog(_this.oSubmitResult, _this.sApprover);
			} else if (_this.bApproverOK === true) {
				//if (_this.oBusy) { FA 2289793
					_this.oBusy.close();
				//} 2289793
				_this.callDialog(_this.oSubmitResult, _this.sApprover);
			}
		}
	},

	callDialog: function(oSimResponse, sApprover) {
		// here the confirmation dialog is created which is shown when the "send" button is clicked
		// The generic Dialog popup sap.ca.common.uilib.dialog.dialog is reused.
		var _this = hcm.myleaverequest.utils.UIHelper.getControllerInstance();

		var _from, _to;

		if (jQuery.sap.getUriParameters().get("responderOn")) {
			if (_this.selRange.start === null) {
				try {
					_this.selRange.start = sap.me.Calendar.parseDate(_this.cale.getSelectedDates()[0]);
				} catch (e) {
					_this.selRange.start = new Date(_this.cale.getSelectedDates()[0]);
				}
			}
			_from = _this.selRange.start;
			if (_this.selRange.end === null) {
				_to = _this.selRange.start;
			} else {
				_to = _this.selRange.end;
			}
		} else {
			if (_this.leaveType.AllowedDurationPartialDayInd) {
				_from = hcm.myleaverequest.utils.Formatters.DATE_ODATA_EEEdMMMyyyy(oSimResponse.StartDate, "medium");
				_to = hcm.myleaverequest.utils.Formatters.DATE_ODATA_EEEdMMMyyyy(oSimResponse.EndDate, "medium");
				_from += " " + hcm.myleaverequest.utils.Formatters.TIME_hhmm(oSimResponse.StartTime);
				_to += " " + hcm.myleaverequest.utils.Formatters.TIME_hhmm(oSimResponse.EndTime);
			} else {
				_from = hcm.myleaverequest.utils.Formatters.DATE_ODATA_EEEdMMMyyyy(oSimResponse.StartDate);
				_to = hcm.myleaverequest.utils.Formatters.DATE_ODATA_EEEdMMMyyyy(oSimResponse.EndDate);
			}
		}

				_this.oConfirmationForm = new sap.ui.layout.form.Form({
			maxContainerCols: 2,
			class: "sapUiLargeMarginTopBottom",
			layout: new sap.ui.layout.form.ResponsiveGridLayout({
				labelSpanL: 3,
				//emptySpanL: 0,
				labelSpanM: 4,
				//emptySpanM: 2,
				labelSpanS: 3,
				columnsL: 2,
				columnsM: 2
			}),
			formContainers: new sap.ui.layout.form.FormContainer({
				formElements: [			
										new sap.ui.layout.form.FormElement({
									label: new sap.m.Label({
							text: _this.resourceBundle.getText("LR_BALANCE_DEDUCTIBLE")
						}),
						fields:new sap.m.Text({
							text: this.leaveType.AbsenceTypeName
						})
					}),
                                       new sap.ui.layout.form.FormElement({
						label: new sap.m.Label({
							text: _this.resourceBundle.getText("LR_FROM")
						}),
						fields:new sap.m.Text({
							text: _from
						})
					}),
					
                                       new sap.ui.layout.form.FormElement({
						label: new sap.m.Label({
							text: _this.resourceBundle.getText("LR_TO")
						}),
						fields:new sap.m.Text({
							text: _to
						})
					}),
					
                                       new sap.ui.layout.form.FormElement({
						label: new sap.m.Label({
							text: _this.resourceBundle.getText("LR_REQUEST")
						}),
						fields:	new sap.m.Text({
							text: hcm.myleaverequest.utils.Formatters.adjustSeparator(oSimResponse.WorkingHoursDuration) + " " + _this.resourceBundle.getText(
					"LR_LOWERCASE_HOURS")
						})
						
					}),
					new sap.ui.layout.form.FormElement({
						visible: Boolean(oSimResponse.DeductionInfo),
						label: new sap.m.Label({
							text: _this.resourceBundle.getText("LR_DEDUCTION")
						}),
						fields:new sap.m.Text({
							text:hcm.myleaverequest.utils.Formatters.adjustSeparator(oSimResponse.TotalDeduction) + " " + _this.resourceBundle.getText(oSimResponse.TimeUnitTextDeduction)
						})
					})
					
                     ]
			})
		});

		_this.oConfirmationDialog = new sap.m.Dialog({
			title: _this.resourceBundle.getText("LR_TITLE_SEND"),
			class: "sapUiContentPadding sapUiLargeMarginTopBottom",
			content:	[new sap.m.Text({text: this.resourceBundle.getText("LR_CONFIRMATIONMSG", [sApprover])}),
						_this.oConfirmationForm],
			buttons: [
			    new sap.m.Button({
					text: _this.resourceBundle.getText("LR_OK"),
					press: function() {
						
						_this.oConfirmationDialog.close();
						_this.submit(false);
					}
				}),
			    new sap.m.Button({
					text: _this.resourceBundle.getText("LR_CANCEL"),
					press: function() {
						_this.oConfirmationDialog.close();
						_this.oConfirmationDialog.Cancelled = true;
					
					}
				})
			]
		});
		//if approver don't exist, deelete the confirmation text
		if (!sApprover || sApprover === null || sApprover === undefined) {
			delete _this.oConfirmationDialog.removeContent(0);
		}
		_this.oConfirmationDialog.open();
		/**
		 * @ControllerHook Modify the Dialog Content
		 * This hook method can be used to modify the dialog content
		 * It is called when the leave was submitted and oData response was received
		 * @callback hcm.myleaverequest.view.S1~extHookCallDialog
		 * @param {object} Settings Object
		 * @return {object} Settings Object
		 */
		if (this.extHookCallDialog) {
			_this.oConfirmationDialog = this.extHookCallDialog(_this.oConfirmationDialog);
		}
	},

	onSelectionChange: function(evt) {
		var selectdItem = evt.getParameter("selectedItem");
		var absenceTypeCode = selectdItem.getProperty("key");
		//this._setUpLeaveTypeData(absenceTypeCode);
		// Note 2294673: Keep last approver when changing leave type
        this._setUpLeaveTypeAfterChangedSelection(absenceTypeCode);

	},

	/*
	 * Fetches used,available,planned timeAccount for a particular absenceType
	 * Will NOT display this formElement if the timeAccount is an empty Array
	 */
	getBalancesForAbsenceType: function(sAbsenceTypeCode) {
		if (!sAbsenceTypeCode) {
			return;
		}
		this._getBalancesBusyOn();
		var _this = this;
		hcm.myleaverequest.utils.DataManager.getBalancesForAbsenceType(sAbsenceTypeCode, function(sBalancePlanned,
			sTimeUnitNamePlanned, sBalanceAvailable, sTimeUnitNameAvailable, sTimeAccountTypeName, sBalanceUsed, sBalanceTotalUsedQuantity,
			doValuesExist) {
			//hide the formElement if the values don't exist
			_this.balanceElem.setVisible(doValuesExist);
			// Success handler for DataManager.getBalancesForAbsenceType
			_this._getBalancesBusyOff();
			if (doValuesExist) {
				// create json model to bind the values to the s4 screen elements
				var json = {
					BalancePlannedQuantity: sBalancePlanned,
					BalanceAvailableQuantity: sBalanceAvailable,
					BalanceUsedQuantity: sBalanceUsed,
					BalanceTotalUsedQuantity: sBalanceTotalUsedQuantity,
					TimeUnitName: sTimeUnitNameAvailable
				};
				var oModel = new sap.ui.model.json.JSONModel(json);
				_this.getView().setModel(oModel, "TimeAccount");
				oModel.createBindingContext("/", function(oContext) {
					_this.getView().setBindingContext(oContext, "TimeAccount");
				});
			}
		}, function(aErrorMessages) {
			// Error handler for DataManager.getBalancesForAbsenceType
			_this._getBalancesBusyOff();
			hcm.myleaverequest.utils.UIHelper.errorDialog(aErrorMessages);
		}, this);
	},

	onTimeChange: function() {
		// set default value of the endTime picker based on the startTime
		var _endTime = this.byId("LRS4_DAT_ENDTIME").getValue();
		var _startTime = this.byId("LRS4_DAT_STARTTIME").getValue();

		if (this.byId("LRS4_DAT_ENDTIME") && _endTime === "" && _startTime !== "") {
			this.byId("LRS4_DAT_ENDTIME").setValue(_startTime);
		}
		if (this.byId("LRS4_DAT_STARTTIME") && _endTime !== "" && _startTime === "") {
			this.byId("LRS4_DAT_STARTTIME").setValue(_endTime);
		}

	},

	onSendClick: function() {
		if (this.checkAttachmentMandatory("sendButton")) {
			this.submit(true);
		}
	},

	onCancelClick: function() {
		// if (!this.changeMode) { FA 2283700
			this._isLocalReset = true;
			this.changeMode = false; // FA 2283700
			this._clearData();
			hcm.myleaverequest.utils.CalendarTools.clearCache();
			this._setHighlightedDays(this.cale.getCurrentDate());
		/* FA 2283700 <<
		} else {
			this.oRouter.navTo("master");
		} FA 2283700 >>*/
	},

	onEntitlementClick: function() {
		this.oRouter.navTo("entitlements", {});
	},

	onHistoryClick: function() {
		this.oRouter.navTo("master", {});
	},

	handleAdd: function(evt) {
		try {
			var controller = hcm.myleaverequest.utils.UIHelper.getControllerInstance();
			var customData = evt.getSource().getParent().getCustomData();
			var oLevel = 1;
			if (customData.length > 0) {
				oLevel = customData[0].getValue();
			}
			var grid = controller.byId("LRS4_FR_MUL_APP_GRID");
			if (controller.leaveType.ApproverLevel > grid.getContent().length + 1) {
				oLevel++;
				controller._addContentToGrid(oLevel);
				//update label text & custom data fields
				for (var k = oLevel - 1; k < grid.getContent().length; k++) {
					var oLabel = grid.getContent()[k].getContent()[0];
					var oFlexBox = grid.getContent()[k].getContent()[1];
					oLabel.setText(controller.resourceBundle.getText("LR_LEVEL", [k + 2]));
					oFlexBox.getCustomData()[0].setValue(k + 2);
				}
			} else {
				//show that maximum level of approvers reached..
				var oErrorMessage = controller.resourceBundle.getText("LR_APPROVER_LEVEL_MAX");
				hcm.myleaverequest.utils.UIHelper.errorDialog(oErrorMessage);
			}
		} catch (e) {
			jQuery.sap.log.warning("Couldn't add approver:" + e.message, "handleAdd", "hcm.myleaverequest.view.S1");
		}
	},

	handleLess: function(evt) {
		try {
			var controller = hcm.myleaverequest.utils.UIHelper.getControllerInstance();
			var customData = evt.getSource().getParent().getCustomData();
			var oLevel = -1;
			if (customData.length > 0) {
				oLevel = customData[0].getValue();
			}
			var grid = controller.byId("LRS4_FR_MUL_APP_GRID");
			if (oLevel > 1) {
				var vContent = grid.getContent()[oLevel - 2];
				grid.removeContent(vContent);
				for (var k = oLevel - 2; k < grid.getContent().length; k++) {
					var oLabel = grid.getContent()[k].getContent()[0];
					var oFlexBox = grid.getContent()[k].getContent()[1];
					oLabel.setText(controller.resourceBundle.getText("LR_LEVEL", [k + 2]));
					oFlexBox.getCustomData()[0].setValue(k + 2);
				}
			}
		} catch (e) {
			jQuery.sap.log.warning("Couldn't remove approver:" + e.message, "handleLess", "hcm.myleaverequest.view.S1");
		}
	},

	handleValueHelp: function(evt) {
		var _this = hcm.myleaverequest.utils.UIHelper.getControllerInstance();
		_this.currentApproverField = evt.getSource();
		var DialogHeader = _this.resourceBundle.getText("LR_APPROVER");
		var oSelectDialog = new sap.m.SelectDialog({
			title: DialogHeader,
			search: _this._searchAction
		});
		oSelectDialog.open();
	},
	_searchAction: function(evt) {
		var _this = this;
		if (evt.getParameter('value').length > 0 || !isNaN(evt.getParameter('value'))) {
			sap.ca.ui.utils.busydialog.requireBusyDialog();
			var successCall = function(oData) {
				//delete the unwanted results
				for (var i = 0; i < oData.results.length; i++) {
					if (oData.results[i].ApproverEmployeeID === "00000000") {
						delete oData.results[i];
					}
				}
				var oModel = new sap.ui.model.json.JSONModel(oData);
				sap.ca.ui.utils.busydialog.releaseBusyDialog();
				var itemTemplate = new sap.m.StandardListItem({
					title: "{ApproverEmployeeName}",
					description: "{ApproverEmployeeID}",
					active: "true"
				});
				_this.setModel(oModel);
				_this.bindAggregation("items", "/results", itemTemplate);
				_this.attachConfirm(function(evt) {
					var _this = hcm.myleaverequest.utils.UIHelper.getControllerInstance();
					var selectedItem = evt.getParameter("selectedItem");
					var oCustomData = new sap.ui.core.CustomData({
						"key": "ApproverEmployeeID",
						"value": selectedItem.getDescription()
					});
					// _this.byId("LRS4_APPROVER_NAME").removeAllCustomData();
					// _this.byId("LRS4_APPROVER_NAME").addCustomData(oCustomData);
					// _this.byId("LRS4_APPROVER_NAME").setValue(selectedItem.getTitle());
					//Note: 2294673 Keep approver after changing leave type
                	_this.sApproverPernr = selectedItem.getProperty("description");
					_this.currentApproverField.removeAllCustomData();
					_this.currentApproverField.addCustomData(oCustomData);
					_this.currentApproverField.setValue(selectedItem.getTitle());
				});
			};
			hcm.myleaverequest.utils.DataManager.searchApprover(evt.getParameter('value'), successCall);
		}
	},
	uploadFileAttachments: function(successCallback, objResponseData, objMsg) {
		var _this = hcm.myleaverequest.utils.UIHelper.getControllerInstance();
		_this.objectResponse = objResponseData;
		var oFileUploader = _this.byId("fileUploader");
		_this.ResponseMessage = objMsg;
		if (!_this.bSimulation && _this.leaveType.AttachmentEnabled && oFileUploader.getValue()) {
			var oUrl = "/LeaveRequestCollection(EmployeeID='',RequestID='" + objResponseData.RequestID +
				"',ChangeStateID=1,LeaveKey='')/Attachments";
			oUrl = _this.oDataModel.sServiceUrl + oUrl; //appending application service URL (shouldn't e hardcoded)
			oFileUploader.setUploadUrl(oUrl);
			oFileUploader.removeAllHeaderParameters();
			oFileUploader.addHeaderParameter(new sap.ui.unified.FileUploaderParameter({
				name: "slug",
				value: oFileUploader.getValue()
			}));
			oFileUploader.addHeaderParameter(new sap.ui.unified.FileUploaderParameter({
				name: "x-csrf-token",
				value: _this.oDataModel.getSecurityToken()
			}));
			oFileUploader.setSendXHR(true);
			if (oFileUploader.getValue()) {
				oFileUploader.upload();
			}
		} else {
			_this.onSubmitLRCsuccess(_this.objectResponse, _this.ResponseMessage);
		}
	},
	handleUploadComplete: function(oControlEvent) {
		var _this = hcm.myleaverequest.utils.UIHelper.getControllerInstance();
		var oParameters = oControlEvent.getParameters();
		if (parseInt(oParameters.status, 10) >= 400) {
			//handle error
			var XmlContent = jQuery.parseXML(oParameters.responseRaw);
			var error = hcm.myleaverequest.utils.DataManager.Xml2Json(XmlContent.documentElement);
			var oSettings = {
				message: error.message,
				type: sap.ca.ui.message.Type.ERROR
			};
			sap.ca.ui.message.showMessageBox(oSettings);
		}
		this.onSubmitLRCsuccess(_this.objectResponse, _this.ResponseMessage);
	},
	handleValueChange: function() {
		var _this = hcm.myleaverequest.utils.UIHelper.getControllerInstance();
		_this.checkAttachmentMandatory();
		jQuery.sap.log.info("fileUploaderValue changed", ["handleValueChange"], ["S1 controller"]);
	},
	_deleteOldDatesFromCalendarCache: function(daysOfRange, status) {
		try {
			for (var i = 0; i < daysOfRange.length; i++) {
				var currDate = new Date(daysOfRange[i]);
				//get the first day of month and its cache data
				var firstDayOfMonth = new Date(currDate.getFullYear(), currDate.getMonth(), 1);
				var CalCache = hcm.myleaverequest.utils.CalendarTools.oCache;
				//check if cache exists for that month
				if (CalCache.hasOwnProperty(firstDayOfMonth.toString())) {
					var currObj = CalCache[firstDayOfMonth];
					//find the date in all the other arrays and remove it
					for (var key in currObj) {
						if (key === status && currObj.hasOwnProperty(key)) {
							if (currObj[key].length > 0) {
								for (var j = 0; j < currObj[key].length; j++) {
									//direct comparison would lead to erraneous output
									//hence convert both to dates and then to sting and then compare
									if ((new Date(currObj[key][j])).toString() == (new Date(currDate)).toString()) {
										//delete currObj[key][j]; // DON'T USE because it sets it to undefined
										currObj[key].splice(j, 1);
										//delete the array if its empty || else it creates trouble in label painting
										if (currObj[key].length < 1) {
											delete currObj[key]; //use delete here, because key is not integer/index
										}
										break;
									}
								}
							}
						}
					}
				}
			}
		} catch (e) {
			jQuery.sap.log.warning("falied to update cache" + e, "_deleteOldDatesFromCalendarCache", "hcm.myleaverequest.view.S1");
		}
	},
	initializeView: function(oAbsenceTypeCode) {
		var _this = this;
		var combinedPromise = $.when(hcm.myleaverequest.utils.DataManager.getConfiguration(), hcm.myleaverequest.utils.DataManager.getAbsenceTypeCollection());
		combinedPromise.done(function(defaultType, leaveTypeColl) {
			// make sure that the leave type collection is available.
			_this.aLeaveTypes = leaveTypeColl;
			var objAbsenceTypes = {};
			objAbsenceTypes.AbsenceTypeCollection = _this.aLeaveTypes;
			_this.slctLvType.setModel(new sap.ui.model.json.JSONModel(objAbsenceTypes));
			_this.slctLvType.bindItems({
				path: "/AbsenceTypeCollection",
				template: new sap.ui.core.Item({
					key: "{AbsenceTypeCode}",
					text: "{AbsenceTypeName}"
				})
			});
			if (_this.aLeaveTypes.length > 0) {
				//var abscenceCode = _this.aLeaveTypes[0].AbsenceTypeCode;
				//_this._setUpLeaveTypeData(abscenceCode);					
				_this._setUpLeaveTypeData(oAbsenceTypeCode);
			}
		});
		combinedPromise.fail(function(error) {
			hcm.myleaverequest.utils.UIHelper.errorDialog(error);
		});
		_this._setHighlightedDays(_this.cale.getCurrentDate());
	},
	checkAttachmentMandatory: function(origin) {
		var _this = hcm.myleaverequest.utils.UIHelper.getControllerInstance();
		if (_this.leaveType.AttachmentMandatory && _this.byId("fileUploader").getValue() === "") {
			_this.byId("fileUploader").setValueState("Error");
			_this.byId("fileUploader").focus();
			if (origin === "sendButton") {
				return false;
			}
		} else {
			_this.byId("fileUploader").setValueState("None");
			if (origin === "sendButton") {
				return true;
			}
		}
	},
	_addContentToGrid: function(oLevel, approver, approverReadOnlyInd) {             //NOTE 2306536
		try{
		var controller = hcm.myleaverequest.utils.UIHelper.getControllerInstance();
		var oApprover = {};
		oApprover.Name = approver ? approver.Name : "";
		oApprover.Pernr = approver ? approver.Pernr : "";
		var grid = controller.byId("LRS4_FR_MUL_APP_GRID");
		var oVerticalLayout = new sap.ui.layout.VerticalLayout({
			width: "100%",
			content: [
				new sap.m.Label({
					width: "100%",
					text: controller.resourceBundle.getText("LR_LEVEL", [oLevel]),
					layoutData: new sap.ui.layout.ResponsiveFlowLayoutData({
						linebreak: true,
						baseSize: "100%"
					})
				}),
				new sap.m.FlexBox({
					customData: new sap.ui.core.CustomData({
						"key": "Level",
						"value": oLevel
					}),
					width: "100%",
					items: [
						new sap.m.Input({
							//	id: "LRS4_APPROVER_NAME" + oLevel,
							value: oApprover.Name,
							enabled: approverReadOnlyInd,                            //NOTE 2306536 
							width: "100%",
							showSuggestion: true,
							valueHelpOnly: true,
							showValueHelp: true,
							valueHelpRequest: controller.handleValueHelp,
							customData: new sap.ui.core.CustomData({
								"key": "ApproverEmployeeID",
								"value": oApprover.Pernr
							}),
							layoutData: new sap.m.FlexItemData({
								growFactor: 30
							})
						}),
						new sap.m.Button({
							//id: "addB" + oLevel,
							width: "38px",
							icon: "sap-icon://add",
							enabled: controller.leaveType.AddDelApprovers,
							press: controller.handleAdd,
							layoutData: new sap.m.FlexItemData({
								growFactor: 1
							})
						}),
						new sap.m.Button({
							//id: "subB" + oLevel,
							width: "38px",
							icon: "sap-icon://less",
							enabled: controller.leaveType.AddDelApprovers,
							press: controller.handleLess,
							layoutData: new sap.m.FlexItemData({
								growFactor: 1
							})
						})
					]
				})
			]
		});
		grid.insertContent(oVerticalLayout, oLevel - 2);
		}catch(e){
			jQuery.sap.log.warning("falied to add content grid" + e.message, "_leaveTypeDependantSettings", "hcm.myleaverequest.view.S1");
		}
	} 
});