jQuery.sap.registerPreloadedModules({
"name":"hcm/myleaverequest/Component-preload",
"version":"2.0",
"modules":{
	"hcm/myleaverequest/Component.js":function(){/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.declare("hcm.myleaverequest.Component");
jQuery.sap.require("hcm.myleaverequest.Configuration");
jQuery.sap.require("sap.ca.scfld.md.ComponentBase");

sap.ca.scfld.md.ComponentBase.extend("hcm.myleaverequest.Component", {
		metadata : sap.ca.scfld.md.ComponentBase.createMetaData("MD", {
			"name" : "My Leave Request",
			"version" : "1.8.28",
			"library" : "hcm.myleaverequest",
			"includes" : ["css/scfld.css"],
				"dependencies" : {
				"libs" : ["sap.m", "sap.me"],
			"components" : []
			},
			"config" : {
				"resourceBundle" : "i18n/i18n.properties",
				"titleResource" : "app.Identity"
			//	"icon" : "sap-icon://Fiori2/F0002",
			//	"favIcon" : "./resources/sap/ca/ui/themes/base/img/favicon/F0002_My_Accounts.ico",
			//	"homeScreenIconPhone" : "./resources/sap/ca/ui/themes/base/img/launchicon/F0002_My_Accounts/57_iPhone_Desktop_Launch.png",
			//	"homeScreenIconPhone@2" : "./resources/sap/ca/ui/themes/base/img/launchicon/F0002_My_Accounts/114_iPhone-Retina_Web_Clip.png",
			//	"homeScreenIconTablet" : "./resources/sap/ca/ui/themes/base/img/launchicon/F0002_My_Accounts/72_iPad_Desktop_Launch.png",
			//	"homeScreenIconTablet@2" : "./resources/sap/ca/ui/themes/base/img/launchicon/F0002_My_Accounts/144_iPad_Retina_Web_Clip.png",
		},
		viewPath : "hcm.myleaverequest.view",
		
		masterPageRoutes : {
			"master" : {
				"pattern" : "history",
				"view" : "S3"				
			}
		},
		
		detailPageRoutes :{
			// fill the routes to your detail pages in here. The application will navigate from the master
			// page to route
			// "detail" leading to detail screen S3.
			// If this is not desired please define your own route "detail"
			"detail" : {
					"pattern" : "detail/{contextPath}",
					"view" : "S6B"
			}
		},
		
		fullScreenPageRoutes : {
			// fill the routes to your full screen pages in here.
				"home" : {
					"pattern" : "",
					"view" : "S1"
				},
				"change" : {
					"pattern" : "change/{requestID}",
					"view" : "S1"
				},
				"entitlements" : {
					"pattern" : "entitlements",
					"view" : "S2"
				}
			}
	}),
	
	/**
	 * Initialize the application
	 *
	 * @returns {sap.ui.core.Control} the content
	 */
	createContent : function() {

		var oViewData = {
			component : this
		};
		return sap.ui.view({
			viewName : "hcm.myleaverequest.Main",
			type : sap.ui.core.mvc.ViewType.XML,
			viewData : oViewData
		});
	}
});

},
	"hcm/myleaverequest/Configuration.js":function(){/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.declare("hcm.myleaverequest.Configuration");
jQuery.sap.require("sap.ca.scfld.md.ConfigurationBase");
jQuery.sap.require("sap.ca.scfld.md.app.Application");

sap.ca.scfld.md.ConfigurationBase.extend("hcm.myleaverequest.Configuration", {
	oServiceParams: {
		serviceList: [{		
			name: "My Leave Request",
			masterCollection: "LeaveRequestCollection",
			serviceUrl: "/sap/opu/odata/sap/HCM_LEAVE_REQ_CREATE_SRV/", //oData service relative path
			isDefault: true,
			mockedDataSource: "/hcm.myleaverequest/model/metadata.xml"
		}]
	},

	getServiceParams : function() {
		return this.oServiceParams;
	},

	/**
	 * @inherit
	 */
	getServiceList : function() {
		return this.getServiceParams().serviceList;
	},

	getMasterKeyAttributes : function() {
		//return the key attribute of your master list item
		return ["Id"];
	}
});
},
	"hcm/myleaverequest/Main.controller.js":function(){/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
sap.ui.controller("hcm.myleaverequest.Main", {
	/*global hcm:true*/
	onInit: function() {
		jQuery.sap.require("sap.ca.scfld.md.Startup");
		jQuery.sap.require("hcm.myleaverequest.utils.ConcurrentEmployment");
        hcm.myleaverequest.utils.ConcurrentEmployment.iAmAlreadyCalled = false;
		sap.ca.scfld.md.Startup.init("hcm.myleaverequest", this);
	},
	onExit: function() {
		//exit cleanup code here
		try {
			var oController = hcm.myleaverequest.utils.ConcurrentEmployment.getControllerInstance();
			hcm.myleaverequest.utils.UIHelper.setPernr("");
			hcm.myleaverequest.utils.ConcurrentEmployment.iAmAlreadyCalled = false;
			if (oController.oCEDialog.isOpen()) {
				oController.oCEDialog.Cancelled = true;
				oController.oCEDialog.close();
			}
		} catch (e) {
			jQuery.sap.log.error("couldn't execute onExit", ["onExit failed in main controller"], ["hcm.myleaverequest.Main"]);
		}
	}
});
},
	"hcm/myleaverequest/Main.view.xml":'<!--\n\n    Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved\n\n-->\n<core:View xmlns:core="sap.ui.core" xmlns="sap.m"\n\tcontrollerName="hcm.myleaverequest.Main" displayBlock="true" height="100%">\n\t<NavContainer id="fioriContent" showHeader="false">\n\t</NavContainer>\n</core:View>',
	"hcm/myleaverequest/i18n/i18n.properties":'# Texts for the leave request create app\n# __ldi.translation.uuid=4e51c570-5913-11e4-8ed6-0800200c9a66\n\n#XTIT: Application name (shown in browser header bar or as browser tab title)\napp.Identity=My Leave Requests\n\n#XTIT: title of the home view\nLR_TITLE_HOME_VIEW=My Leave Requests\n\n#XTIT: title of the leave create view\nLR_TITLE_CREATE_VIEW=Request Leave\n\n#XTIT: title of the leave change view\nLR_TITLE_CHANGE_VIEW=Change Leave Request\n\n#XTIT: title of the Entitlements view\nLR_TITLE_BALANCE_VIEW=Entitlements\n\n#XTIT: title of the leave History view\nLR_TITLE_HISTORY_VIEW=History\n\n#XTIT: title of the leave details view\nLR_TITLE_DETAILS_VIEW=Leave Details\n\n#XTIT: title of the leave requests\nLR_TITLE_LEAVE_REQUESTS=Leave Requests\n\n#XTIT: title of the leave request\nLR_TITLE_LEAVE_REQUEST=Leave Request\n\n#XTIT: deductible\nLR_BALANCE_DEDUCTIBLE=Category\n\n#XTIT: Balance\nLR_BALANCE_BALANCE=Available\n\n#XTIT: Used\nLR_BALANCE_USED=Used\n\n#XTIT: Requested\nLR_BALANCE_REQUESTED=Requested\n\n#XTIT: Quota\nLR_BALANCE_QUOTA=Entitlements\n\n#XTIT: Entitlement\nLR_ENTITLEMENT_QUOTA=Entitlement\n\n#XTIT: Send leave request\nLR_TITLE_SEND=Send Leave Request\n\n#XTIT: Cancel leave request\nLR_TITLE_WITHDRAW=Withdraw Leave Request\n\n#XTIT: ATTENTION Tile text line break after 12 characters!\nLR_BALANCE_TILE=Entitlements \n\n#XTIT: ATTENTION Tile text line break after 12 characters!\nLR_HISTORY_TILE=History\n\n#XTIT: ATTENTION Tile text line break after 12 characters!\nLR_CREATE_LEAVE_TILE=Create Leave Request\n\n#XBUT\nLR_SHOW_HIST=History\n\n#XBUT\nLR_CREATE_LEAVE=Request Leave\n\n#XBUT: text for "send leave request" button\nLR_SEND=Send\n\n#XBUT: text for ok button \nLR_OK=OK\n\n#XBUT: text for reset button \nLR_RESET=Reset\n\n#XBUT: text for cancel button e.g. on the day range picker screen\nLR_CANCEL=Cancel\n\n#XBUT: text for change button on the Leave Overview details screen\nLR_CHANGE=Change\n\n#XBUT: text for cancel button on the Leave Overview details screen\nLR_WITHDRAW=Withdraw\n\n#XSEL\nLR_UPDATED=Updated \n\n#XFLD\nLR_NOTE=Note\n\n#XFLD\nLR_CUSTOM1=Custom Field 1\n\n#XFLD: used vacation, lower case for status under calendar. Reads "X days [line feed] used"\nLR_BOOKED=used\n\n#XFLD: Available balance, lower case for status under calendar. Reads "X days [line feed] available"\nLR_REMAINING=available\n\n#XFLD\nLR_LOWERCASE_DAYS=days\n\n#XFLD\nLR_LOWERCASE_DAY=day\n\n#XFLD\nLR_LOWERCASE_HOURS=hours\n\n#XFLD\nLR_LOWERCASE_HOUR=hour\n\n#XFLD\nLR_UP_TO=Valid Upto\n\n#XFLD\nLR_FROM=From\n\n#XFLD\nLR_TO=To\n\n#XFLD\nLR_DEDUCTION=Deduction\n\n#XFLD: Hyphen for Date Formatting\nLR_HYPHEN=-\n\n#XTIT: title of error dialog\nLR_PROBLEM=A problem occurred\n\n#XTIT: title of confirmation dialog\nLR_CONFIRMATION=Confirmation\n\n#YMSG\nLR_CONFIRMATIONMSG=Do you want to send this leave request to {0}?\n\n#YMSG\nLR_WITHDRAWNMSG=Do you want to withdraw this leave request?\n\n#XFLD\nLR_DAYS=days\n\n#XFLD\nLR_DAY=day\n\n#XFLD\nLR_HOURS=hours\n\n#XFLD\nLR_HOUR=hour\n\n#XFLD\nLR_REQUEST=Requested\n\n#XSEL: day type (legend)\nLR_DTYPE_TODAY=Today\n\n#XSEL: day type (legend)\nLR_DTYPE_SELECTED=Selected Day\n\n#YMSG: processing\nLR_PROCESSING=Processing...\n\n#YMSG\nLR_SUBMITDONE=Your leave request was sent to {0}\n\n#YMSG\nLR_WITHDRAWDONE=Your leave request was withdrawn\n\n#YMSG\nLR_AX_MODEL_NOT_REG=A technical problem has occurred\\n\\nError Details:\\nInternal error; model not registered\n\n#YMSG\nLR_AX_PARSE_ERR=A technical problem has occurred\\n\\nError Details:\\nProtocol error; could not parse HTTP response\n\n#YMSG\nLR_DD_NO_APPROVER=A technical problem has occurred\\n\\nError Details:\\nProtocol error; approver name missing in response\n\n#YMSG\nLR_DD_NO_CFG=A technical problem has occurred\\n\\nError Details:\\nProtocol error; configuration missing in response\n\n#YMSG\nLR_DD_NO_BALANCES=A technical problem has occurred\\n\\nError Details:\\nProtocol error; balances missing in response\n\n#YMSG\nLR_DD_PARSE_ERR=A technical problem has occurred\\n\\nError Details:\\nProtocol error; could not parse response\n\n#YMSG\nLR_DD_COMM_ERR=A problem has occurred with your connection\n\n#YMSG\nLR_DD_GENERIC_ERR=An error has occurred\n\n#YMSG\nLR_CT_PARSE_ERR=A technical problem has occurred\\n\\nError Details:\\nProtocol error; Could not parse response\n\n#XFLD\nLR_S1_PENDING:Pending\n\n#YMSG\nLR_UNKNOWN=Unknown\n\n#XSEL: (legend)\nLR_NONWORKING=Non-Working Day\n\n#XSEL: (legend)\nLR_APPROVELEAVE=Approved\n\n#XSEL: (legend)\nLR_REJECTEDLEAVE=Rejected \n\n#XSEL: (legend)\nLR_APPROVEPENDING=Approval Pending\n\n#XSEL: (legend)\nLR_PUBLICHOLIDAY=Public Holiday\n\n#XSEL: (legend)\nLR_WORKINGDAY=Working Day\n\n#XSEL: (legend)\nLR_DELETIONREQUESTED=Cancellation Requested\n\n#XTIT\nLR_DELETION_REQ=Cancellation Request\n\n#XTIT\nLR_CHANGE_REQ=Change Request\n\n#XTIT\nLR_CHANGE_PENDING=Change Pending\n\n#XTIT\nLR_CANCEL_PENDING=Cancellation Pending\n\n#XTIT\nLR_CHANGE_DONE=Change Approved\n\n#XTIT\nLR_CANCEL_DONE=Cancellation Approved\n\n#XTIT: Original\nLR_OLD_VERSION=Original\n\n#XTIT: Leave Changes\nLR_NEW_VERSION=Changed\n\n#XFLD: Label for Approver Selection\nLR_APPROVER=Approver\n\n#XFLD: Label for Attendance/Absence Hours\nLR_ABS_HOURS=Att./Absence Hours\n\n#XFLD: Label for Attachments\nLR_ATTACHMENTS=Attachments\n\n#XFLD: Placeholder for Attachments\nLR_ATTACHMENT= Add attachment\n\n#XFLD: Label for Start Time\nLR_START_TIME=Start Time\n\n#XFLD: Label for Start Time\nLR_END_TIME=End Time\n\n#YMSG: Error message to display, if the file upload fails\nLR_ATTACHMENT_ERROR= Cannot upload the attachment. \n\n#YMSG: warning message to show if the file type is not supported\nLR_ATTACHMENT_TYPECHECK= This attachment type is not supported. \n\n#YMSG: Warning message to show if the file size exceeds 25MB- Mega Bytes\nLR_ATTACHMENT_SIZECHECK= File size is too big. Please select a file less than 25MB.\n\n#XFLD: Select Personnel Assignment Label\nPERSONAL_ASSIGN=Choose a Personnel Assignment\n\n#XTIT: Select Personnel Assignment Title\nPERSONAL_ASSIGN_TITLE=Personnel Assignments\n\n#XFLD: Level for approver\nLR_LEVEL = Level {0}\n\n#YMSG: error message to display, if the maximum number of approvers reached\nLR_APPROVER_LEVEL_MAX= Maximum number of approvers already added',
	"hcm/myleaverequest/i18n/i18n_ar.properties":'\n#XTIT: Application name (shown in browser header bar or as browser tab title)\napp.Identity=\\u0637\\u0644\\u0628\\u0627\\u062A \\u0627\\u0644\\u0625\\u062C\\u0627\\u0632\\u0629 \\u0627\\u0644\\u062E\\u0627\\u0635\\u0629 \\u0628\\u064A\n\n#XTIT: title of the home view\nLR_TITLE_HOME_VIEW=\\u0637\\u0644\\u0628\\u0627\\u062A \\u0627\\u0644\\u0625\\u062C\\u0627\\u0632\\u0629 \\u0627\\u0644\\u062E\\u0627\\u0635\\u0629 \\u0628\\u064A\n\n#XTIT: title of the leave create view\nLR_TITLE_CREATE_VIEW=\\u0637\\u0644\\u0628 \\u0627\\u0644\\u0625\\u062C\\u0627\\u0632\\u0629\n\n#XTIT: title of the leave change view\nLR_TITLE_CHANGE_VIEW=\\u062A\\u063A\\u064A\\u064A\\u0631 \\u0637\\u0644\\u0628 \\u0627\\u0644\\u0625\\u062C\\u0627\\u0632\\u0629\n\n#XTIT: title of the Entitlements view\nLR_TITLE_BALANCE_VIEW=\\u0627\\u0644\\u062D\\u0642\\u0648\\u0642\n\n#XTIT: title of the leave History view\nLR_TITLE_HISTORY_VIEW=\\u0627\\u0644\\u0633\\u062C\\u0644\n\n#XTIT: title of the leave details view\nLR_TITLE_DETAILS_VIEW=\\u062A\\u0641\\u0627\\u0635\\u064A\\u0644 \\u0627\\u0644\\u0625\\u062C\\u0627\\u0632\\u0629\n\n#XTIT: title of the leave requests\nLR_TITLE_LEAVE_REQUESTS=\\u0637\\u0644\\u0628\\u0627\\u062A \\u0627\\u0644\\u0625\\u062C\\u0627\\u0632\\u0629\n\n#XTIT: title of the leave request\nLR_TITLE_LEAVE_REQUEST=\\u0637\\u0644\\u0628 \\u0627\\u0644\\u0625\\u062C\\u0627\\u0632\\u0629\n\n#XTIT: deductible\nLR_BALANCE_DEDUCTIBLE=\\u0627\\u0644\\u0641\\u0626\\u0629\n\n#XTIT: Balance\nLR_BALANCE_BALANCE=\\u0645\\u062A\\u0648\\u0641\\u0631\n\n#XTIT: Used\nLR_BALANCE_USED=\\u0645\\u0633\\u062A\\u062E\\u062F\\u064E\\u0645\n\n#XTIT: Requested\nLR_BALANCE_REQUESTED=\\u0645\\u0637\\u0644\\u0648\\u0628\n\n#XTIT: Quota\nLR_BALANCE_QUOTA=\\u0627\\u0644\\u062D\\u0642\\u0648\\u0642\n\n#XTIT: Entitlement\nLR_ENTITLEMENT_QUOTA=\\u0627\\u0644\\u062D\\u0642\n\n#XTIT: Send leave request\nLR_TITLE_SEND=\\u0625\\u0631\\u0633\\u0627\\u0644 \\u0637\\u0644\\u0628 \\u0627\\u0644\\u0625\\u062C\\u0627\\u0632\\u0629\n\n#XTIT: Cancel leave request\nLR_TITLE_WITHDRAW=\\u0633\\u062D\\u0628 \\u0637\\u0644\\u0628 \\u0627\\u0644\\u0625\\u062C\\u0627\\u0632\\u0629\n\n#XTIT: ATTENTION Tile text line break after 12 characters!\nLR_BALANCE_TILE=\\u0627\\u0644\\u062D\\u0642\\u0648\\u0642\n\n#XTIT: ATTENTION Tile text line break after 12 characters!\nLR_HISTORY_TILE=\\u0627\\u0644\\u0633\\u062C\\u0644\n\n#XTIT: ATTENTION Tile text line break after 12 characters!\nLR_CREATE_LEAVE_TILE=\\u0625\\u0646\\u0634\\u0627\\u0621 \\u0637\\u0644\\u0628 \\u0625\\u062C\\u0627\\u0632\\u0629\n\n#XBUT\nLR_SHOW_HIST=\\u0633\\u062C\\u0644\n\n#XBUT\nLR_CREATE_LEAVE=\\u0637\\u0644\\u0628 \\u0625\\u062C\\u0627\\u0632\\u0629\n\n#XBUT: text for "send leave request" button\nLR_SEND=\\u0625\\u0631\\u0633\\u0627\\u0644\n\n#XBUT: text for ok button \nLR_OK=\\u0645\\u0648\\u0627\\u0641\\u0642\n\n#XBUT: text for reset button \nLR_RESET=\\u0625\\u0639\\u0627\\u062F\\u0629 \\u062A\\u0639\\u064A\\u064A\\u0646\n\n#XBUT: text for cancel button e.g. on the day range picker screen\nLR_CANCEL=\\u0625\\u0644\\u063A\\u0627\\u0621\n\n#XBUT: text for change button on the Leave Overview details screen\nLR_CHANGE=\\u062A\\u063A\\u064A\\u064A\\u0631\n\n#XBUT: text for cancel button on the Leave Overview details screen\nLR_WITHDRAW=\\u0633\\u062D\\u0628\n\n#XSEL\nLR_UPDATED=\\u062A\\u0645 \\u062A\\u062D\\u062F\\u064A\\u062B\\u0647\n\n#XFLD\nLR_NOTE=\\u0645\\u0644\\u0627\\u062D\\u0638\\u0629\n\n#XFLD\nLR_CUSTOM1=\\u0627\\u0644\\u062D\\u0642\\u0644 \\u0627\\u0644\\u0645\\u062E\\u0635\\u0635 1\n\n#XFLD: used vacation, lower case for status under calendar. Reads "X days [line feed] used"\nLR_BOOKED=\\u0645\\u0633\\u062A\\u062E\\u062F\\u064E\\u0645\n\n#XFLD: Available balance, lower case for status under calendar. Reads "X days [line feed] available"\nLR_REMAINING=\\u0645\\u062A\\u0648\\u0641\\u0631\n\n#XFLD\nLR_LOWERCASE_DAYS=\\u0623\\u064A\\u0627\\u0645\n\n#XFLD\nLR_LOWERCASE_DAY=\\u064A\\u0648\\u0645\n\n#XFLD\nLR_LOWERCASE_HOURS=\\u0633\\u0627\\u0639\\u0627\\u062A\n\n#XFLD\nLR_LOWERCASE_HOUR=\\u0633\\u0627\\u0639\\u0629\n\n#XFLD\nLR_UP_TO=\\u0635\\u0627\\u0644\\u062D \\u062D\\u062A\\u0649\n\n#XFLD\nLR_FROM=\\u0645\\u0646\n\n#XFLD\nLR_TO=\\u0625\\u0644\\u0649\n\n#XFLD\nLR_DEDUCTION=\\u0627\\u0633\\u062A\\u0642\\u0637\\u0627\\u0639\n\n#XFLD: Hyphen for Date Formatting\nLR_HYPHEN=-\n\n#XTIT: title of error dialog\nLR_PROBLEM=\\u062D\\u062F\\u062B\\u062A \\u0645\\u0634\\u0643\\u0644\\u0629\n\n#XTIT: title of confirmation dialog\nLR_CONFIRMATION=\\u062A\\u0623\\u0643\\u064A\\u062F\n\n#YMSG\nLR_CONFIRMATIONMSG=\\u0647\\u0644 \\u062A\\u0631\\u064A\\u062F \\u0625\\u0631\\u0633\\u0627\\u0644 \\u0637\\u0644\\u0628 \\u0627\\u0644\\u0625\\u062C\\u0627\\u0632\\u0629 \\u0647\\u0630\\u0627 \\u0625\\u0644\\u0649 {0}\\u061F\n\n#YMSG\nLR_WITHDRAWNMSG=\\u0647\\u0644 \\u062A\\u0631\\u064A\\u062F \\u0633\\u062D\\u0628 \\u0637\\u0644\\u0628 \\u0627\\u0644\\u0625\\u062C\\u0627\\u0632\\u0629 \\u0647\\u0630\\u0627\\u061F\n\n#XFLD\nLR_DAYS=\\u0623\\u064A\\u0627\\u0645\n\n#XFLD\nLR_DAY=\\u064A\\u0648\\u0645\n\n#XFLD\nLR_HOURS=\\u0633\\u0627\\u0639\\u0627\\u062A\n\n#XFLD\nLR_HOUR=\\u0633\\u0627\\u0639\\u0629\n\n#XFLD\nLR_REQUEST=\\u0645\\u0637\\u0644\\u0648\\u0628\n\n#XSEL: day type (legend)\nLR_DTYPE_TODAY=\\u0627\\u0644\\u064A\\u0648\\u0645\n\n#XSEL: day type (legend)\nLR_DTYPE_SELECTED=\\u064A\\u0648\\u0645 (\\u0623\\u064A\\u0627\\u0645) \\u0645\\u062D\\u062F\\u062F\n\n#YMSG: processing\nLR_PROCESSING=\\u062C\\u0627\\u0631\\u064D \\u0627\\u0644\\u0645\\u0639\\u0627\\u0644\\u062C\\u0629...\n\n#YMSG\nLR_SUBMITDONE=\\u062A\\u0645 \\u0625\\u0631\\u0633\\u0627\\u0644 \\u0637\\u0644\\u0628 \\u0627\\u0644\\u0625\\u062C\\u0627\\u0632\\u0629 \\u0627\\u0644\\u062E\\u0627\\u0635 \\u0628\\u0643 \\u0625\\u0644\\u0649 {0}\n\n#YMSG\nLR_WITHDRAWDONE=\\u062A\\u0645 \\u0633\\u062D\\u0628 \\u0637\\u0644\\u0628 \\u0625\\u062C\\u0627\\u0632\\u062A\\u0643\n\n#YMSG\nLR_AX_MODEL_NOT_REG=\\u062D\\u062F\\u062B\\u062A \\u0645\\u0634\\u0643\\u0644\\u0629 \\u062A\\u0642\\u0646\\u064A\\u0629\\n\\n\\u062A\\u0641\\u0627\\u0635\\u064A\\u0644 \\u0627\\u0644\\u062E\\u0637\\u0623\\:\\n\\u062E\\u0637\\u0623 \\u062F\\u0627\\u062E\\u0644\\u064A\\u061B \\u0644\\u0645 \\u064A\\u062A\\u0645 \\u062A\\u0633\\u062C\\u064A\\u0644 \\u0627\\u0644\\u0646\\u0645\\u0648\\u0630\\u062C\n\n#YMSG\nLR_AX_PARSE_ERR=\\u062D\\u062F\\u062B\\u062A \\u0645\\u0634\\u0643\\u0644\\u0629 \\u062A\\u0642\\u0646\\u064A\\u0629\\n\\n\\u062A\\u0641\\u0627\\u0635\\u064A\\u0644 \\u0627\\u0644\\u062E\\u0637\\u0623\\:\\n\\u062E\\u0637\\u0623 \\u0641\\u064A \\u0627\\u0644\\u0628\\u0631\\u0648\\u062A\\u0648\\u0643\\u0648\\u0644\\u061B \\u062A\\u0639\\u0630\\u0631 \\u062A\\u062D\\u0644\\u064A\\u0644 \\u0627\\u0633\\u062A\\u062C\\u0627\\u0628\\u0629 HTTP\n\n#YMSG\nLR_DD_NO_APPROVER=\\u062D\\u062F\\u062B\\u062A \\u0645\\u0634\\u0643\\u0644\\u0629 \\u062A\\u0642\\u0646\\u064A\\u0629\\n\\n\\u062A\\u0641\\u0627\\u0635\\u064A\\u0644 \\u0627\\u0644\\u062E\\u0637\\u0623\\:\\n\\u062E\\u0637\\u0623 \\u0641\\u064A \\u0627\\u0644\\u0628\\u0631\\u0648\\u062A\\u0648\\u0643\\u0648\\u0644\\u061B \\u0627\\u0633\\u0645 \\u0627\\u0644\\u0645\\u0639\\u062A\\u0645\\u0650\\u062F \\u0645\\u0641\\u0642\\u0648\\u062F \\u0641\\u064A \\u0627\\u0644\\u0627\\u0633\\u062A\\u062C\\u0627\\u0628\\u0629\n\n#YMSG\nLR_DD_NO_CFG=\\u062D\\u062F\\u062B\\u062A \\u0645\\u0634\\u0643\\u0644\\u0629 \\u062A\\u0642\\u0646\\u064A\\u0629\\n\\n\\u062A\\u0641\\u0627\\u0635\\u064A\\u0644 \\u0627\\u0644\\u062E\\u0637\\u0623\\:\\n\\u062E\\u0637\\u0623 \\u0641\\u064A \\u0627\\u0644\\u0628\\u0631\\u0648\\u062A\\u0648\\u0643\\u0648\\u0644\\u061B \\u0627\\u0644\\u062A\\u0643\\u0648\\u064A\\u0646 \\u0645\\u0641\\u0642\\u0648\\u062F \\u0641\\u064A \\u0627\\u0644\\u0627\\u0633\\u062A\\u062C\\u0627\\u0628\\u0629\n\n#YMSG\nLR_DD_NO_BALANCES=\\u062D\\u062F\\u062B\\u062A \\u0645\\u0634\\u0643\\u0644\\u0629 \\u062A\\u0642\\u0646\\u064A\\u0629\\n\\n\\u062A\\u0641\\u0627\\u0635\\u064A\\u0644 \\u0627\\u0644\\u062E\\u0637\\u0623\\:\\n\\u062E\\u0637\\u0623 \\u0641\\u064A \\u0627\\u0644\\u0628\\u0631\\u0648\\u062A\\u0648\\u0643\\u0648\\u0644\\u061B \\u0627\\u0644\\u0623\\u0631\\u0635\\u062F\\u0629 \\u0645\\u0641\\u0642\\u0648\\u062F\\u0629 \\u0641\\u064A \\u0627\\u0644\\u0627\\u0633\\u062A\\u062C\\u0627\\u0628\\u0629\n\n#YMSG\nLR_DD_PARSE_ERR=\\u062D\\u062F\\u062B\\u062A \\u0645\\u0634\\u0643\\u0644\\u0629 \\u062A\\u0642\\u0646\\u064A\\u0629\\n\\n\\u062A\\u0641\\u0627\\u0635\\u064A\\u0644 \\u0627\\u0644\\u062E\\u0637\\u0623\\:\\n\\u062E\\u0637\\u0623 \\u0641\\u064A \\u0627\\u0644\\u0628\\u0631\\u0648\\u062A\\u0648\\u0643\\u0648\\u0644\\u061B \\u062A\\u0639\\u0630\\u0631 \\u062A\\u062D\\u0644\\u064A\\u0644 \\u0627\\u0644\\u0627\\u0633\\u062A\\u062C\\u0627\\u0628\\u0629\n\n#YMSG\nLR_DD_COMM_ERR=\\u062D\\u062F\\u062B\\u062A \\u0645\\u0634\\u0643\\u0644\\u0629 \\u0641\\u064A \\u0627\\u0644\\u0627\\u062A\\u0635\\u0627\\u0644\n\n#YMSG\nLR_DD_GENERIC_ERR=\\u062D\\u062F\\u062B \\u062E\\u0637\\u0623\n\n#YMSG\nLR_CT_PARSE_ERR=\\u062D\\u062F\\u062B\\u062A \\u0645\\u0634\\u0643\\u0644\\u0629 \\u062A\\u0642\\u0646\\u064A\\u0629\\n\\n\\u062A\\u0641\\u0627\\u0635\\u064A\\u0644 \\u0627\\u0644\\u062E\\u0637\\u0623\\:\\n\\u062E\\u0637\\u0623 \\u0641\\u064A \\u0627\\u0644\\u0628\\u0631\\u0648\\u062A\\u0648\\u0643\\u0648\\u0644\\u061B \\u062A\\u0639\\u0630\\u0631 \\u062A\\u062D\\u0644\\u064A\\u0644 \\u0627\\u0644\\u0627\\u0633\\u062A\\u062C\\u0627\\u0628\\u0629\n\n#XFLD\nLR_S1_PENDING=\\u0645\\u0639\\u0644\\u0642\n\n#YMSG\nLR_UNKNOWN=\\u063A\\u064A\\u0631 \\u0645\\u0639\\u0631\\u0648\\u0641\n\n#XSEL: (legend)\nLR_NONWORKING=\\u064A\\u0648\\u0645 \\u0639\\u0637\\u0644\\u0629\n\n#XSEL: (legend)\nLR_APPROVELEAVE=\\u0645\\u0639\\u062A\\u0645\\u064E\\u062F\n\n#XSEL: (legend)\nLR_REJECTEDLEAVE=\\u0645\\u0631\\u0641\\u0648\\u0636\n\n#XSEL: (legend)\nLR_APPROVEPENDING=\\u0641\\u064A \\u0627\\u0646\\u062A\\u0638\\u0627\\u0631 \\u0627\\u0644\\u0627\\u0639\\u062A\\u0645\\u0627\\u062F\n\n#XSEL: (legend)\nLR_PUBLICHOLIDAY=\\u0639\\u0637\\u0644\\u0629 \\u0631\\u0633\\u0645\\u064A\\u0629\n\n#XSEL: (legend)\nLR_WORKINGDAY=\\u064A\\u0648\\u0645 \\u0639\\u0645\\u0644\n\n#XSEL: (legend)\nLR_DELETIONREQUESTED=\\u0645\\u0637\\u0644\\u0648\\u0628 \\u0627\\u0644\\u0625\\u0644\\u063A\\u0627\\u0621\n\n#XTIT\nLR_DELETION_REQ=\\u0637\\u0644\\u0628 \\u0627\\u0644\\u0625\\u0644\\u063A\\u0627\\u0621\n\n#XTIT\nLR_CHANGE_REQ=\\u0637\\u0644\\u0628 \\u0627\\u0644\\u062A\\u063A\\u064A\\u064A\\u0631\n\n#XTIT\nLR_CHANGE_PENDING=\\u0641\\u064A \\u0627\\u0646\\u062A\\u0638\\u0627\\u0631 \\u0627\\u0644\\u062A\\u063A\\u064A\\u064A\\u0631\n\n#XTIT\nLR_CANCEL_PENDING=\\u0641\\u064A \\u0627\\u0646\\u062A\\u0638\\u0627\\u0631 \\u0627\\u0644\\u0625\\u0644\\u063A\\u0627\\u0621\n\n#XTIT\nLR_CHANGE_DONE=\\u062A\\u0645 \\u0627\\u0639\\u062A\\u0645\\u0627\\u062F \\u0627\\u0644\\u062A\\u063A\\u064A\\u064A\\u0631\n\n#XTIT\nLR_CANCEL_DONE=\\u062A\\u0645 \\u0627\\u0639\\u062A\\u0645\\u0627\\u062F \\u0627\\u0644\\u0625\\u0644\\u063A\\u0627\\u0621\n\n#XTIT: Original\nLR_OLD_VERSION=\\u0627\\u0644\\u0623\\u0635\\u0644\\u064A\n\n#XTIT: Leave Changes\nLR_NEW_VERSION=\\u062A\\u0645 \\u062A\\u063A\\u064A\\u064A\\u0631\\u0647\n\n#XFLD: Label for Approver Selection\nLR_APPROVER=\\u0627\\u0644\\u0645\\u0639\\u062A\\u0645\\u0650\\u062F\n\n#XFLD: Label for Attendance/Absence Hours\nLR_ABS_HOURS=\\u0627\\u0644\\u062D\\u0636\\u0648\\u0631/\\u0627\\u0644\\u063A\\u064A\\u0627\\u0628 \\u0628\\u0627\\u0644\\u0633\\u0627\\u0639\\u0627\\u062A\n\n#XFLD: Label for Attachments\nLR_ATTACHMENTS=\\u0627\\u0644\\u0645\\u0631\\u0641\\u0642\\u0627\\u062A\n\n#XFLD: Placeholder for Attachments\nLR_ATTACHMENT=\\u0625\\u0636\\u0627\\u0641\\u0629 \\u0645\\u0631\\u0641\\u0642\n\n#XFLD: Label for Start Time\nLR_START_TIME=\\u0648\\u0642\\u062A \\u0627\\u0644\\u0628\\u062F\\u0621\n\n#XFLD: Label for Start Time\nLR_END_TIME=\\u0648\\u0642\\u062A \\u0627\\u0644\\u0627\\u0646\\u062A\\u0647\\u0627\\u0621\n\n#YMSG: Error message to display, if the file upload fails\nLR_ATTACHMENT_ERROR=\\u062A\\u0639\\u0630\\u0631 \\u062A\\u062D\\u0645\\u064A\\u0644 \\u0627\\u0644\\u0645\\u0631\\u0641\\u0642\n\n#YMSG: warning message to show if the file type is not supported\nLR_ATTACHMENT_TYPECHECK=\\u0646\\u0648\\u0639 \\u0627\\u0644\\u0645\\u0631\\u0641\\u0642 \\u0647\\u0630\\u0627 \\u063A\\u064A\\u0631 \\u0645\\u062F\\u0639\\u0648\\u0645\n\n#YMSG: Warning message to show if the file size exceeds 25MB- Mega Bytes\nLR_ATTACHMENT_SIZECHECK=\\u062D\\u062C\\u0645 \\u0627\\u0644\\u0645\\u0644\\u0641 \\u0643\\u0628\\u064A\\u0631 \\u062C\\u062F\\u064B\\u0627\\u061B \\u0628\\u0631\\u062C\\u0627\\u0621 \\u062A\\u062D\\u062F\\u064A\\u062F \\u0645\\u0644\\u0641 \\u0628\\u062D\\u062C\\u0645 \\u0623\\u0642\\u0644 \\u0645\\u0646 25 \\u0645\\u064A\\u062C\\u0627 \\u0628\\u0627\\u064A\\u062A.\n\n#XFLD: Select Personnel Assignment Label\nPERSONAL_ASSIGN=\\u0627\\u062E\\u062A\\u0631 \\u062A\\u0639\\u064A\\u064A\\u0646 \\u0645\\u0648\\u0638\\u0641\n\n#XTIT: Select Personnel Assignment Title\nPERSONAL_ASSIGN_TITLE=\\u062A\\u0639\\u064A\\u064A\\u0646\\u0627\\u062A \\u0627\\u0644\\u0645\\u0648\\u0638\\u0641\\u064A\\u0646\n\n#XFLD: Level for approver\nLR_LEVEL=\\u0627\\u0644\\u0645\\u0633\\u062A\\u0648\\u0649 {0}\n\n#YMSG: error message to display, if the maximum number of approvers reached\nLR_APPROVER_LEVEL_MAX=\\u0623\\u062F\\u062E\\u0644\\u062A \\u0628\\u0627\\u0644\\u0641\\u0639\\u0644 \\u0623\\u0642\\u0635\\u0649 \\u0639\\u062F\\u062F \\u0645\\u0646 \\u0627\\u0644\\u0645\\u0639\\u062A\\u0645\\u0650\\u062F\\u064A\\u0646.\n',
	"hcm/myleaverequest/i18n/i18n_bg.properties":'\n#XTIT: Application name (shown in browser header bar or as browser tab title)\napp.Identity=\\u041C\\u043E\\u0438\\u0442\\u0435 \\u0437\\u0430\\u044F\\u0432\\u043A\\u0438 \\u0437\\u0430 \\u043E\\u0442\\u043F\\u0443\\u0441\\u043A\n\n#XTIT: title of the home view\nLR_TITLE_HOME_VIEW=\\u041C\\u043E\\u0438\\u0442\\u0435 \\u0437\\u0430\\u044F\\u0432\\u043A\\u0438 \\u0437\\u0430 \\u043E\\u0442\\u043F\\u0443\\u0441\\u043A\n\n#XTIT: title of the leave create view\nLR_TITLE_CREATE_VIEW=\\u0417\\u0430\\u044F\\u0432\\u043A\\u0430 \\u0437\\u0430 \\u043E\\u0442\\u043F\\u0443\\u0441\\u043A\n\n#XTIT: title of the leave change view\nLR_TITLE_CHANGE_VIEW=\\u041F\\u0440\\u043E\\u043C\\u044F\\u043D\\u0430 \\u043D\\u0430 \\u0437\\u0430\\u044F\\u0432\\u043A\\u0430 \\u0437\\u0430 \\u043E\\u0442\\u043F\\u0443\\u0441\\u043A\n\n#XTIT: title of the Entitlements view\nLR_TITLE_BALANCE_VIEW=\\u041F\\u0440\\u0430\\u0432\\u0430\n\n#XTIT: title of the leave History view\nLR_TITLE_HISTORY_VIEW=\\u0418\\u0441\\u0442\\u043E\\u0440\\u0438\\u044F\n\n#XTIT: title of the leave details view\nLR_TITLE_DETAILS_VIEW=\\u041F\\u043E\\u0434\\u0440\\u043E\\u0431\\u043D\\u0438 \\u0434\\u0430\\u043D\\u043D\\u0438 \\u0437\\u0430 \\u043E\\u0442\\u043F\\u0443\\u0441\\u043A\n\n#XTIT: title of the leave requests\nLR_TITLE_LEAVE_REQUESTS=\\u0417\\u0430\\u044F\\u0432\\u043A\\u0438 \\u0437\\u0430 \\u043E\\u0442\\u043F\\u0443\\u0441\\u043A\n\n#XTIT: title of the leave request\nLR_TITLE_LEAVE_REQUEST=\\u0417\\u0430\\u044F\\u0432\\u043A\\u0430 \\u0437\\u0430 \\u043E\\u0442\\u043F\\u0443\\u0441\\u043A\n\n#XTIT: deductible\nLR_BALANCE_DEDUCTIBLE=\\u041A\\u0430\\u0442\\u0435\\u0433\\u043E\\u0440\\u0438\\u044F\n\n#XTIT: Balance\nLR_BALANCE_BALANCE=\\u041D\\u0430\\u043B\\u0438\\u0447\\u0435\\u043D\n\n#XTIT: Used\nLR_BALANCE_USED=\\u0418\\u0437\\u043F\\u043E\\u043B\\u0437\\u0432\\u0430\\u043D\\u0438\n\n#XTIT: Requested\nLR_BALANCE_REQUESTED=\\u0417\\u0430\\u044F\\u0432\\u0435\\u043D\n\n#XTIT: Quota\nLR_BALANCE_QUOTA=\\u041F\\u0440\\u0430\\u0432\\u0430\n\n#XTIT: Entitlement\nLR_ENTITLEMENT_QUOTA=\\u041F\\u0440\\u0430\\u0432\\u043E\n\n#XTIT: Send leave request\nLR_TITLE_SEND=\\u0418\\u0437\\u043F\\u0440\\u0430\\u0449\\u0430\\u043D\\u0435 \\u043D\\u0430 \\u0437\\u0430\\u044F\\u0432\\u043A\\u0430 \\u0437\\u0430 \\u043E\\u0442\\u043F\\u0443\\u0441\\u043A\n\n#XTIT: Cancel leave request\nLR_TITLE_WITHDRAW=\\u041E\\u0442\\u0442\\u0435\\u0433\\u043B\\u044F\\u043D\\u0435 \\u043D\\u0430 \\u0437\\u0430\\u044F\\u0432\\u043A\\u0430 \\u0437\\u0430 \\u043E\\u0442\\u043F\\u0443\\u0441\\u043A\n\n#XTIT: ATTENTION Tile text line break after 12 characters!\nLR_BALANCE_TILE=\\u041F\\u0440\\u0430\\u0432\\u0430\n\n#XTIT: ATTENTION Tile text line break after 12 characters!\nLR_HISTORY_TILE=\\u0418\\u0441\\u0442\\u043E\\u0440\\u0438\\u044F\n\n#XTIT: ATTENTION Tile text line break after 12 characters!\nLR_CREATE_LEAVE_TILE=\\u0421\\u044A\\u0437\\u0434\\u0430\\u0432\\u0430\\u043D\\u0435 \\u043D\\u0430 \\u0437\\u0430\\u044F\\u0432\\u043A\\u0430 \\u0437\\u0430 \\u043E\\u0442\\u043F\\u0443\\u0441\\u043A\n\n#XBUT\nLR_SHOW_HIST=\\u0418\\u0441\\u0442\\u043E\\u0440\\u0438\\u044F\n\n#XBUT\nLR_CREATE_LEAVE=\\u0417\\u0430\\u044F\\u0432\\u043A\\u0430 \\u0437\\u0430 \\u043E\\u0442\\u043F\\u0443\\u0441\\u043A\n\n#XBUT: text for "send leave request" button\nLR_SEND=\\u0418\\u0437\\u043F\\u0440\\u0430\\u0449\\u0430\\u043D\\u0435\n\n#XBUT: text for ok button \nLR_OK=OK\n\n#XBUT: text for reset button \nLR_RESET=\\u041F\\u043E\\u0432\\u0442\\u043E\\u0440\\u043D\\u043E \\u0437\\u0430\\u0434\\u0430\\u0432\\u0430\\u043D\\u0435\n\n#XBUT: text for cancel button e.g. on the day range picker screen\nLR_CANCEL=\\u041E\\u0442\\u043A\\u0430\\u0437\n\n#XBUT: text for change button on the Leave Overview details screen\nLR_CHANGE=\\u041F\\u0440\\u043E\\u043C\\u044F\\u043D\\u0430\n\n#XBUT: text for cancel button on the Leave Overview details screen\nLR_WITHDRAW=\\u041E\\u0442\\u0442\\u0435\\u0433\\u043B\\u044F\\u043D\\u0435\n\n#XSEL\nLR_UPDATED=\\u0410\\u043A\\u0442\\u0443\\u0430\\u043B\\u0438\\u0437\\u0438\\u0440\\u0430\\u043D\\u0438\n\n#XFLD\nLR_NOTE=\\u0417\\u0430\\u0431\\u0435\\u043B\\u0435\\u0436\\u043A\\u0430\n\n#XFLD\nLR_CUSTOM1=\\u041F\\u043E\\u0442\\u0440\\u0435\\u0431\\u0438\\u0442\\u0435\\u043B\\u0441\\u043A\\u043E \\u043F\\u043E\\u043B\\u0435 1\n\n#XFLD: used vacation, lower case for status under calendar. Reads "X days [line feed] used"\nLR_BOOKED=\\u0438\\u0437\\u043F\\u043E\\u043B\\u0437\\u0432\\u0430\\u043D\\u0438\n\n#XFLD: Available balance, lower case for status under calendar. Reads "X days [line feed] available"\nLR_REMAINING=\\u043D\\u0430\\u043B\\u0438\\u0447\\u043D\\u0438\n\n#XFLD\nLR_LOWERCASE_DAYS=\\u0434\\u043D\\u0438\n\n#XFLD\nLR_LOWERCASE_DAY=\\u0434\\u0435\\u043D\n\n#XFLD\nLR_LOWERCASE_HOURS=\\u0447\\u0430\\u0441\\u043E\\u0432\\u0435\n\n#XFLD\nLR_LOWERCASE_HOUR=\\u0447\\u0430\\u0441\n\n#XFLD\nLR_UP_TO=\\u0412\\u0430\\u043B\\u0438\\u0434\\u0435\\u043D \\u0434\\u043E\n\n#XFLD\nLR_FROM=\\u041E\\u0442\n\n#XFLD\nLR_TO=\\u0414\\u043E\n\n#XFLD\nLR_DEDUCTION=\\u0423\\u0434\\u0440\\u044A\\u0436\\u043A\\u0430\n\n#XFLD: Hyphen for Date Formatting\nLR_HYPHEN=-\n\n#XTIT: title of error dialog\nLR_PROBLEM=\\u0412\\u044A\\u0437\\u043D\\u0438\\u043A\\u043D\\u0430\\u043B \\u0435 \\u043F\\u0440\\u043E\\u0431\\u043B\\u0435\\u043C\n\n#XTIT: title of confirmation dialog\nLR_CONFIRMATION=\\u041F\\u043E\\u0442\\u0432\\u044A\\u0440\\u0436\\u0434\\u0435\\u043D\\u0438\\u0435\n\n#YMSG\nLR_CONFIRMATIONMSG=\\u0418\\u0437\\u043F\\u0440\\u0430\\u0442\\u0435\\u0442\\u0435 \\u0442\\u0430\\u0437\\u0438 \\u0437\\u0430\\u044F\\u0432\\u043A\\u0430 \\u0437\\u0430 \\u043E\\u0442\\u043F\\u0443\\u0441\\u043A \\u0434\\u043E {0}?\n\n#YMSG\nLR_WITHDRAWNMSG=\\u0416\\u0435\\u043B\\u0430\\u0435\\u0442\\u0435 \\u043B\\u0438 \\u0434\\u0430 \\u043E\\u0442\\u0442\\u0435\\u0433\\u043B\\u0438\\u0442\\u0435 \\u0442\\u0430\\u0437\\u0438 \\u0437\\u0430\\u044F\\u0432\\u043A\\u0430 \\u0437\\u0430 \\u043E\\u0442\\u043F\\u0443\\u0441\\u043A?\n\n#XFLD\nLR_DAYS=\\u0434\\u043D\\u0438\n\n#XFLD\nLR_DAY=\\u0414\\u0435\\u043D\n\n#XFLD\nLR_HOURS=\\u0427\\u0430\\u0441\\u043E\\u0432\\u0435\n\n#XFLD\nLR_HOUR=\\u0427\\u0430\\u0441\n\n#XFLD\nLR_REQUEST=\\u0417\\u0430\\u044F\\u0432\\u0435\\u043D\n\n#XSEL: day type (legend)\nLR_DTYPE_TODAY=\\u0414\\u043D\\u0435\\u0441\n\n#XSEL: day type (legend)\nLR_DTYPE_SELECTED=\\u0418\\u0437\\u0431\\u0440\\u0430\\u043D \\u0434\\u0435\\u043D(\\u0438)\n\n#YMSG: processing\nLR_PROCESSING=\\u041E\\u0431\\u0440\\u0430\\u0431\\u043E\\u0442\\u043A\\u0430...\n\n#YMSG\nLR_SUBMITDONE=\\u0412\\u0430\\u0448\\u0430\\u0442\\u0430 \\u0437\\u0430\\u044F\\u0432\\u043A\\u0430 \\u0437\\u0430 \\u043E\\u0442\\u043F\\u0443\\u0441\\u043A \\u0435 \\u0438\\u0437\\u043F\\u0440\\u0430\\u0442\\u0435\\u043D\\u0430 \\u0434\\u043E {0}\n\n#YMSG\nLR_WITHDRAWDONE=\\u0417\\u0430\\u044F\\u0432\\u043A\\u0430\\u0442\\u0430 \\u0432\\u0438 \\u0437\\u0430 \\u043E\\u0442\\u043F\\u0443\\u0441\\u043A \\u0435 \\u043E\\u0442\\u0442\\u0435\\u0433\\u043B\\u0435\\u043D\\u0430\n\n#YMSG\nLR_AX_MODEL_NOT_REG=\\u0412\\u044A\\u0437\\u043D\\u0438\\u043A\\u043D\\u0430 \\u0442\\u0435\\u0445\\u043D\\u0438\\u0447\\u0435\\u0441\\u043A\\u0438 \\u043F\\u0440\\u043E\\u0431\\u043B\\u0435\\u043C\\n\\n\\u041F\\u043E\\u0434\\u0440\\u043E\\u0431\\u043D\\u0438 \\u0434\\u0430\\u043D\\u043D\\u0438 \\u043D\\u0430 \\u0433\\u0440\\u0435\\u0448\\u043A\\u0430\\:\\n\\u0412\\u044A\\u0442\\u0440\\u0435\\u0448\\u043D\\u0430 \\u0433\\u0440\\u0435\\u0448\\u043A\\u0430; \\u043C\\u043E\\u0434\\u0435\\u043B\\u044A\\u0442 \\u043D\\u0435 \\u0435 \\u0440\\u0435\\u0433\\u0438\\u0441\\u0442\\u0440\\u0438\\u0440\\u0430\\u043D\n\n#YMSG\nLR_AX_PARSE_ERR=\\u0412\\u044A\\u0437\\u043D\\u0438\\u043A\\u043D\\u0430 \\u0442\\u0435\\u0445\\u043D\\u0438\\u0447\\u0435\\u0441\\u043A\\u0438 \\u043F\\u0440\\u043E\\u0431\\u043B\\u0435\\u043C\\n\\n\\u041F\\u043E\\u0434\\u0440\\u043E\\u0431\\u043D\\u0438 \\u0434\\u0430\\u043D\\u043D\\u0438 \\u043D\\u0430 \\u0433\\u0440\\u0435\\u0448\\u043A\\u0430\\:\\n\\u0413\\u0440\\u0435\\u0448\\u043A\\u0430 \\u043D\\u0430 \\u043F\\u0440\\u043E\\u0442\\u043E\\u043A\\u043E\\u043B; \\u043D\\u0435 \\u043C\\u043E\\u0436\\u0435 \\u0434\\u0430 \\u0430\\u043D\\u0430\\u043B\\u0438\\u0437\\u0438\\u0440\\u0430 \\u0441\\u0438\\u043D\\u0442\\u0430\\u043A\\u0442\\u0438\\u0447\\u043D\\u043E HTTP \\u043E\\u0442\\u0433\\u043E\\u0432\\u043E\\u0440\n\n#YMSG\nLR_DD_NO_APPROVER=\\u0412\\u044A\\u0437\\u043D\\u0438\\u043A\\u043D\\u0430 \\u0442\\u0435\\u0445\\u043D\\u0438\\u0447\\u0435\\u0441\\u043A\\u0438 \\u043F\\u0440\\u043E\\u0431\\u043B\\u0435\\u043C\\n\\n\\u041F\\u043E\\u0434\\u0440\\u043E\\u0431\\u043D\\u0438 \\u0434\\u0430\\u043D\\u043D\\u0438 \\u043D\\u0430 \\u0433\\u0440\\u0435\\u0448\\u043A\\u0430\\:\\n\\u0413\\u0440\\u0435\\u0448\\u043A\\u0430 \\u043D\\u0430 \\u043F\\u0440\\u043E\\u0442\\u043E\\u043A\\u043E\\u043B; \\u043B\\u0438\\u043F\\u0441\\u0432\\u0430 \\u0438\\u043C\\u0435 \\u043D\\u0430 \\u043E\\u0434\\u043E\\u0431\\u0440\\u044F\\u0432\\u0430\\u0449 \\u0432 \\u043E\\u0442\\u0433\\u043E\\u0432\\u043E\\u0440\n\n#YMSG\nLR_DD_NO_CFG=\\u0412\\u044A\\u0437\\u043D\\u0438\\u043A\\u043D\\u0430 \\u0442\\u0435\\u0445\\u043D\\u0438\\u0447\\u0435\\u0441\\u043A\\u0438 \\u043F\\u0440\\u043E\\u0431\\u043B\\u0435\\u043C\\n\\n\\u041F\\u043E\\u0434\\u0440\\u043E\\u0431\\u043D\\u0438 \\u0434\\u0430\\u043D\\u043D\\u0438 \\u043D\\u0430 \\u0433\\u0440\\u0435\\u0448\\u043A\\u0430\\:\\n\\u0413\\u0440\\u0435\\u0448\\u043A\\u0430 \\u043D\\u0430 \\u043F\\u0440\\u043E\\u0442\\u043E\\u043A\\u043E\\u043B; \\u043B\\u0438\\u043F\\u0441\\u0432\\u0430 \\u043A\\u043E\\u043D\\u0444\\u0438\\u0433\\u0443\\u0440\\u0430\\u0446\\u0438\\u044F \\u0432 \\u043E\\u0442\\u0433\\u043E\\u0432\\u043E\\u0440\n\n#YMSG\nLR_DD_NO_BALANCES=\\u0412\\u044A\\u0437\\u043D\\u0438\\u043A\\u043D\\u0430 \\u0442\\u0435\\u0445\\u043D\\u0438\\u0447\\u0435\\u0441\\u043A\\u0438 \\u043F\\u0440\\u043E\\u0431\\u043B\\u0435\\u043C\\n\\n\\u041F\\u043E\\u0434\\u0440\\u043E\\u0431\\u043D\\u0438 \\u0434\\u0430\\u043D\\u043D\\u0438 \\u043D\\u0430 \\u0433\\u0440\\u0435\\u0448\\u043A\\u0430\\:\\n\\u0413\\u0440\\u0435\\u0448\\u043A\\u0430 \\u043D\\u0430 \\u043F\\u0440\\u043E\\u0442\\u043E\\u043A\\u043E\\u043B; \\u043B\\u0438\\u043F\\u0441\\u0432\\u0430\\u0442 \\u0441\\u0430\\u043B\\u0434\\u0430 \\u0432 \\u043E\\u0442\\u0433\\u043E\\u0432\\u043E\\u0440\n\n#YMSG\nLR_DD_PARSE_ERR=\\u0412\\u044A\\u0437\\u043D\\u0438\\u043A\\u043D\\u0430 \\u0442\\u0435\\u0445\\u043D\\u0438\\u0447\\u0435\\u0441\\u043A\\u0438 \\u043F\\u0440\\u043E\\u0431\\u043B\\u0435\\u043C\\n\\n\\u041F\\u043E\\u0434\\u0440\\u043E\\u0431\\u043D\\u0438 \\u0434\\u0430\\u043D\\u043D\\u0438 \\u043D\\u0430 \\u0433\\u0440\\u0435\\u0448\\u043A\\u0430\\:\\n\\u0413\\u0440\\u0435\\u0448\\u043A\\u0430 \\u043D\\u0430 \\u043F\\u0440\\u043E\\u0442\\u043E\\u043A\\u043E\\u043B; \\u043D\\u0435 \\u043C\\u043E\\u0436\\u0435 \\u0434\\u0430 \\u0430\\u043D\\u0430\\u043B\\u0438\\u0437\\u0438\\u0440\\u0430 \\u0441\\u0438\\u043D\\u0442\\u0430\\u043A\\u0442\\u0438\\u0447\\u043D\\u043E \\u043E\\u0442\\u0433\\u043E\\u0432\\u043E\\u0440\n\n#YMSG\nLR_DD_COMM_ERR=\\u0412\\u044A\\u0437\\u043D\\u0438\\u043A\\u043D\\u0430 \\u043F\\u0440\\u043E\\u0431\\u043B\\u0435\\u043C \\u0441 \\u0432\\u0440\\u044A\\u0437\\u043A\\u0430\\u0442\\u0430 \\u0432\\u0438\n\n#YMSG\nLR_DD_GENERIC_ERR=\\u0412\\u044A\\u0437\\u043D\\u0438\\u043A\\u043D\\u0430 \\u0433\\u0440\\u0435\\u0448\\u043A\\u0430\n\n#YMSG\nLR_CT_PARSE_ERR=\\u0412\\u044A\\u0437\\u043D\\u0438\\u043A\\u043D\\u0430 \\u0442\\u0435\\u0445\\u043D\\u0438\\u0447\\u0435\\u0441\\u043A\\u0438 \\u043F\\u0440\\u043E\\u0431\\u043B\\u0435\\u043C\\n\\n\\u041F\\u043E\\u0434\\u0440\\u043E\\u0431\\u043D\\u0438 \\u0434\\u0430\\u043D\\u043D\\u0438 \\u043D\\u0430 \\u0433\\u0440\\u0435\\u0448\\u043A\\u0430\\:\\n\\u0413\\u0440\\u0435\\u0448\\u043A\\u0430 \\u043D\\u0430 \\u043F\\u0440\\u043E\\u0442\\u043E\\u043A\\u043E\\u043B; \\u043D\\u0435 \\u043C\\u043E\\u0436\\u0435 \\u0434\\u0430 \\u0430\\u043D\\u0430\\u043B\\u0438\\u0437\\u0438\\u0440\\u0430 \\u0441\\u0438\\u043D\\u0442\\u0430\\u043A\\u0442\\u0438\\u0447\\u043D\\u043E \\u043E\\u0442\\u0433\\u043E\\u0432\\u043E\\u0440\n\n#XFLD\nLR_S1_PENDING=\\u0418\\u0437\\u0447\\u0430\\u043A\\u0432\\u0430\\u0449 \\u043E\\u0431\\u0440\\u0430\\u0431\\u043E\\u0442\\u043A\\u0430\n\n#YMSG\nLR_UNKNOWN=\\u041D\\u0435\\u0438\\u0437\\u0432\\u0435\\u0441\\u0442\\u0435\\u043D\n\n#XSEL: (legend)\nLR_NONWORKING=\\u041D\\u0435\\u0440\\u0430\\u0431\\u043E\\u0442\\u0435\\u043D \\u0434\\u0435\\u043D\n\n#XSEL: (legend)\nLR_APPROVELEAVE=\\u041E\\u0434\\u043E\\u0431\\u0440\\u0435\\u043D\n\n#XSEL: (legend)\nLR_REJECTEDLEAVE=\\u041E\\u0442\\u0445\\u0432\\u044A\\u0440\\u043B\\u0435\\u043D\n\n#XSEL: (legend)\nLR_APPROVEPENDING=\\u0418\\u0437\\u0447\\u0430\\u043A\\u0432\\u0430 \\u0441\\u0435 \\u043E\\u0434\\u043E\\u0431\\u0440\\u0435\\u043D\\u0438\\u0435\n\n#XSEL: (legend)\nLR_PUBLICHOLIDAY=\\u041E\\u0444\\u0438\\u0446\\u0438\\u0430\\u043B\\u0435\\u043D \\u043F\\u0440\\u0430\\u0437\\u043D\\u0438\\u043A\n\n#XSEL: (legend)\nLR_WORKINGDAY=\\u0420\\u0430\\u0431\\u043E\\u0442\\u0435\\u043D \\u0434\\u0435\\u043D\n\n#XSEL: (legend)\nLR_DELETIONREQUESTED=\\u041E\\u0442\\u043A\\u0430\\u0437\\u044A\\u0442 \\u0435 \\u0437\\u0430\\u044F\\u0432\\u0435\\u043D\n\n#XTIT\nLR_DELETION_REQ=\\u0417\\u0430\\u044F\\u0432\\u043A\\u0430 \\u0437\\u0430 \\u043E\\u0442\\u043A\\u0430\\u0437\n\n#XTIT\nLR_CHANGE_REQ=\\u0417\\u0430\\u044F\\u0432\\u043A\\u0430 \\u0437\\u0430 \\u043F\\u0440\\u043E\\u043C\\u044F\\u043D\\u0430\n\n#XTIT\nLR_CHANGE_PENDING=\\u0418\\u0437\\u0447\\u0430\\u043A\\u0432\\u0430 \\u0441\\u0435 \\u043F\\u0440\\u043E\\u043C\\u044F\\u043D\\u0430\n\n#XTIT\nLR_CANCEL_PENDING=\\u0418\\u0437\\u0447\\u0430\\u043A\\u0432\\u0430 \\u0441\\u0435 \\u043E\\u0442\\u043A\\u0430\\u0437\n\n#XTIT\nLR_CHANGE_DONE=\\u041F\\u0440\\u043E\\u043C\\u044F\\u043D\\u0430\\u0442\\u0430 \\u0435 \\u043E\\u0434\\u043E\\u0431\\u0440\\u0435\\u043D\\u0430\n\n#XTIT\nLR_CANCEL_DONE=\\u041E\\u0442\\u043A\\u0430\\u0437\\u044A\\u0442 \\u0435 \\u043E\\u0434\\u043E\\u0431\\u0440\\u0435\\u043D\n\n#XTIT: Original\nLR_OLD_VERSION=\\u041E\\u0440\\u0438\\u0433\\u0438\\u043D\\u0430\\u043B\n\n#XTIT: Leave Changes\nLR_NEW_VERSION=\\u041F\\u0440\\u043E\\u043C\\u0435\\u043D\\u0435\\u043D\n\n#XFLD: Label for Approver Selection\nLR_APPROVER=\\u041E\\u0434\\u043E\\u0431\\u0440\\u044F\\u0432\\u0430\\u0449\n\n#XFLD: Label for Attendance/Absence Hours\nLR_ABS_HOURS=\\u0427\\u0430\\u0441\\u043E\\u0432\\u0435 \\u043D\\u0430 \\u043F\\u0440\\u0438\\u0441\\u044A\\u0441\\u0442\\u0432\\u0438\\u0435/\\u043E\\u0442\\u0441\\u044A\\u0441\\u0442\\u0432\\u0438\\u0435\n\n#XFLD: Label for Attachments\nLR_ATTACHMENTS=\\u041F\\u0440\\u0438\\u043B\\u043E\\u0436\\u0435\\u043D\\u0438\\u044F\n\n#XFLD: Placeholder for Attachments\nLR_ATTACHMENT=\\u0414\\u043E\\u0431\\u0430\\u0432\\u044F\\u043D\\u0435 \\u043D\\u0430 \\u043F\\u0440\\u0438\\u043B\\u043E\\u0436\\u0435\\u043D\\u0438\\u0435\n\n#XFLD: Label for Start Time\nLR_START_TIME=\\u041D\\u0430\\u0447\\u0430\\u043B\\u0435\\u043D \\u0447\\u0430\\u0441\n\n#XFLD: Label for Start Time\nLR_END_TIME=\\u041A\\u0440\\u0430\\u0435\\u043D \\u0447\\u0430\\u0441\n\n#YMSG: Error message to display, if the file upload fails\nLR_ATTACHMENT_ERROR=\\u041F\\u0440\\u0438\\u043B\\u043E\\u0436\\u0435\\u043D\\u0438\\u0435\\u0442\\u043E \\u043D\\u0435 \\u043C\\u043E\\u0436\\u0435 \\u0434\\u0430 \\u0431\\u044A\\u0434\\u0435 \\u043A\\u0430\\u0447\\u0435\\u043D\\u043E\n\n#YMSG: warning message to show if the file type is not supported\nLR_ATTACHMENT_TYPECHECK=\\u0422\\u043E\\u0437\\u0438 \\u0432\\u0438\\u0434 \\u043F\\u0440\\u0438\\u043B\\u043E\\u0436\\u0435\\u043D\\u0438\\u0435 \\u043D\\u0435 \\u0441\\u0435 \\u043F\\u043E\\u0434\\u0434\\u044A\\u0440\\u0436\\u0430\n\n#YMSG: Warning message to show if the file size exceeds 25MB- Mega Bytes\nLR_ATTACHMENT_SIZECHECK=\\u0420\\u0430\\u0437\\u043C\\u0435\\u0440\\u044A\\u0442 \\u043D\\u0430 \\u0444\\u0430\\u0439\\u043B\\u0430 \\u0435 \\u0442\\u0432\\u044A\\u0440\\u0434\\u0435 \\u0433\\u043E\\u043B\\u044F\\u043C. \\u041C\\u043E\\u043B\\u044F \\u0438\\u0437\\u0431\\u0435\\u0440\\u0435\\u0442\\u0435 \\u0444\\u0430\\u0439\\u043B \\u0441 \\u0440\\u0430\\u0437\\u043C\\u0435\\u0440 \\u043F\\u043E-\\u043C\\u0430\\u043B\\u044A\\u043A \\u043E\\u0442 25MB.\n\n#XFLD: Select Personnel Assignment Label\nPERSONAL_ASSIGN=\\u0418\\u0437\\u0431\\u0435\\u0440\\u0435\\u0442\\u0435 \\u043F\\u0440\\u0438\\u0441\\u044A\\u0435\\u0434\\u0438\\u043D\\u044F\\u0432\\u0430\\u043D\\u0435 \\u043D\\u0430 \\u043F\\u0435\\u0440\\u0441\\u043E\\u043D\\u0430\\u043B\n\n#XTIT: Select Personnel Assignment Title\nPERSONAL_ASSIGN_TITLE=\\u041F\\u0440\\u0438\\u0441\\u044A\\u0435\\u0434\\u0438\\u043D\\u044F\\u0432\\u0430\\u043D\\u0438\\u044F \\u043D\\u0430 \\u043F\\u0435\\u0440\\u0441\\u043E\\u043D\\u0430\\u043B\n\n#XFLD: Level for approver\nLR_LEVEL=\\u041D\\u0438\\u0432\\u043E {0}\n\n#YMSG: error message to display, if the maximum number of approvers reached\nLR_APPROVER_LEVEL_MAX=\\u0412\\u0435\\u0447\\u0435 \\u0441\\u0442\\u0435 \\u0432\\u044A\\u0432\\u0435\\u043B\\u0438 \\u043C\\u0430\\u043A\\u0441\\u0438\\u043C\\u0430\\u043B\\u043D\\u0438\\u044F \\u0431\\u0440\\u043E\\u0439 \\u043E\\u0434\\u043E\\u0431\\u0440\\u044F\\u0432\\u0430\\u0449\\u0438.\n',
	"hcm/myleaverequest/i18n/i18n_cs.properties":'\n#XTIT: Application name (shown in browser header bar or as browser tab title)\napp.Identity=Moje \\u017E\\u00E1dosti o dovolenou\n\n#XTIT: title of the home view\nLR_TITLE_HOME_VIEW=Moje \\u017E\\u00E1dosti o dovolenou\n\n#XTIT: title of the leave create view\nLR_TITLE_CREATE_VIEW=\\u017D\\u00E1dost o dovolenou\n\n#XTIT: title of the leave change view\nLR_TITLE_CHANGE_VIEW=Zm\\u011Bna \\u017E\\u00E1dosti o dovolenou\n\n#XTIT: title of the Entitlements view\nLR_TITLE_BALANCE_VIEW=N\\u00E1roky\n\n#XTIT: title of the leave History view\nLR_TITLE_HISTORY_VIEW=Historie\n\n#XTIT: title of the leave details view\nLR_TITLE_DETAILS_VIEW=Detaily dovolen\\u00E9\n\n#XTIT: title of the leave requests\nLR_TITLE_LEAVE_REQUESTS=\\u017D\\u00E1dosti o dovolenou\n\n#XTIT: title of the leave request\nLR_TITLE_LEAVE_REQUEST=\\u017D\\u00E1dost o dovolenou\n\n#XTIT: deductible\nLR_BALANCE_DEDUCTIBLE=Kategorie\n\n#XTIT: Balance\nLR_BALANCE_BALANCE=K dispozici\n\n#XTIT: Used\nLR_BALANCE_USED=Pou\\u017Eito\n\n#XTIT: Requested\nLR_BALANCE_REQUESTED=Po\\u017Eadov\\u00E1no\n\n#XTIT: Quota\nLR_BALANCE_QUOTA=N\\u00E1roky\n\n#XTIT: Entitlement\nLR_ENTITLEMENT_QUOTA=N\\u00E1rok\n\n#XTIT: Send leave request\nLR_TITLE_SEND=Odeslat \\u017E\\u00E1dost o dovolenou\n\n#XTIT: Cancel leave request\nLR_TITLE_WITHDRAW=Zru\\u0161en\\u00ED \\u017E\\u00E1dosti o dovolenou\n\n#XTIT: ATTENTION Tile text line break after 12 characters!\nLR_BALANCE_TILE=N\\u00E1roky\n\n#XTIT: ATTENTION Tile text line break after 12 characters!\nLR_HISTORY_TILE=Historie\n\n#XTIT: ATTENTION Tile text line break after 12 characters!\nLR_CREATE_LEAVE_TILE=Vytvo\\u0159it \\u017E\\u00E1dost o dovolenou\n\n#XBUT\nLR_SHOW_HIST=Historie\n\n#XBUT\nLR_CREATE_LEAVE=\\u017D\\u00E1dost o dovolenou\n\n#XBUT: text for "send leave request" button\nLR_SEND=Odeslat\n\n#XBUT: text for ok button \nLR_OK=OK\n\n#XBUT: text for reset button \nLR_RESET=Resetovat\n\n#XBUT: text for cancel button e.g. on the day range picker screen\nLR_CANCEL=Zru\\u0161it\n\n#XBUT: text for change button on the Leave Overview details screen\nLR_CHANGE=Zm\\u011Bnit\n\n#XBUT: text for cancel button on the Leave Overview details screen\nLR_WITHDRAW=Zru\\u0161it\n\n#XSEL\nLR_UPDATED=Aktualizov\\u00E1no\n\n#XFLD\nLR_NOTE=Pozn\\u00E1mka\n\n#XFLD\nLR_CUSTOM1=U\\u017Eivatelsk\\u00E9 pole 1\n\n#XFLD: used vacation, lower case for status under calendar. Reads "X days [line feed] used"\nLR_BOOKED=vyu\\u017Eito\n\n#XFLD: Available balance, lower case for status under calendar. Reads "X days [line feed] available"\nLR_REMAINING=disponibiln\\u00ED\n\n#XFLD\nLR_LOWERCASE_DAYS=dny\n\n#XFLD\nLR_LOWERCASE_DAY=den\n\n#XFLD\nLR_LOWERCASE_HOURS=hodiny\n\n#XFLD\nLR_LOWERCASE_HOUR=hodina\n\n#XFLD\nLR_UP_TO=Plat\\u00ED do\n\n#XFLD\nLR_FROM=Od\n\n#XFLD\nLR_TO=Do\n\n#XFLD\nLR_DEDUCTION=Sr\\u00E1\\u017Eka\n\n#XFLD: Hyphen for Date Formatting\nLR_HYPHEN=-\n\n#XTIT: title of error dialog\nLR_PROBLEM=Do\\u0161lo k probl\\u00E9mu\n\n#XTIT: title of confirmation dialog\nLR_CONFIRMATION=Potvrzen\\u00ED\n\n#YMSG\nLR_CONFIRMATIONMSG=Odeslat tuto \\u017E\\u00E1dost o dovolenou p\\u0159\\u00EDjemci\\: {0}?\n\n#YMSG\nLR_WITHDRAWNMSG=Chcete \\u017E\\u00E1dost o dovolenou zru\\u0161it?\n\n#XFLD\nLR_DAYS=dny\n\n#XFLD\nLR_DAY=Den\n\n#XFLD\nLR_HOURS=Hodiny\n\n#XFLD\nLR_HOUR=Hodina\n\n#XFLD\nLR_REQUEST=Po\\u017Eadov\\u00E1no\n\n#XSEL: day type (legend)\nLR_DTYPE_TODAY=Dnes\n\n#XSEL: day type (legend)\nLR_DTYPE_SELECTED=Vybran\\u00E9 dny\n\n#YMSG: processing\nLR_PROCESSING=Prob\\u00EDh\\u00E1 zpracov\\u00E1n\\u00ED...\n\n#YMSG\nLR_SUBMITDONE=Va\\u0161e \\u017E\\u00E1dost o dovolenou byla odesl\\u00E1na p\\u0159\\u00EDjemci\\: {0}\n\n#YMSG\nLR_WITHDRAWDONE=Va\\u0161e \\u017E\\u00E1dost o dovolenou byla zru\\u0161ena\n\n#YMSG\nLR_AX_MODEL_NOT_REG=Do\\u0161lo k technick\\u00E9 chyb\\u011B\\n\\nDetaily chyby\\:\\nIntern\\u00ED chyba; model nen\\u00ED registrov\\u00E1n\n\n#YMSG\nLR_AX_PARSE_ERR=Do\\u0161lo k technick\\u00E9 chyb\\u011B\\n\\nDetaily chyby\\:\\nChyba protokolu; nepoda\\u0159ilo se analyzovat odezvu HTTP\n\n#YMSG\nLR_DD_NO_APPROVER=Do\\u0161lo k technick\\u00E9 chyb\\u011B\\n\\nDetaily chyby\\:\\nChyba protokolu; v odezv\\u011B chyb\\u00ED jm\\u00E9no schvalovatele\n\n#YMSG\nLR_DD_NO_CFG=Do\\u0161lo k technick\\u00E9 chyb\\u011B\\n\\nDetaily chyby\\:\\nChyba protokolu; v odezv\\u011B chyb\\u00ED konfigurace\n\n#YMSG\nLR_DD_NO_BALANCES=Do\\u0161lo k technick\\u00E9 chyb\\u011B\\n\\nDetaily chyby\\:\\nChyba protokolu; v odezv\\u011B chyb\\u011Bj\\u00ED z\\u016Fstatky\n\n#YMSG\nLR_DD_PARSE_ERR=Do\\u0161lo k technick\\u00E9 chyb\\u011B\\n\\nDetaily chyby\\:\\nChyba protokolu; nepoda\\u0159ilo se analyzovat odezvu\n\n#YMSG\nLR_DD_COMM_ERR=Do\\u0161lo k probl\\u00E9mu s va\\u0161\\u00EDm p\\u0159ipojen\\u00EDm\n\n#YMSG\nLR_DD_GENERIC_ERR=Do\\u0161lo k chyb\\u011B\n\n#YMSG\nLR_CT_PARSE_ERR=Do\\u0161lo k technick\\u00E9 chyb\\u011B\\n\\nDetaily chyby\\:\\nChyba protokolu; nepoda\\u0159ilo se analyzovat odezvu\n\n#XFLD\nLR_S1_PENDING=Nevy\\u0159\\u00EDzeno\n\n#YMSG\nLR_UNKNOWN=Nen\\u00ED zn\\u00E1mo\n\n#XSEL: (legend)\nLR_NONWORKING=Nepracovn\\u00ED den\n\n#XSEL: (legend)\nLR_APPROVELEAVE=Schv\\u00E1leno\n\n#XSEL: (legend)\nLR_REJECTEDLEAVE=Zam\\u00EDtnuto\n\n#XSEL: (legend)\nLR_APPROVEPENDING=Nevy\\u0159\\u00EDzen\\u00E9 schv\\u00E1len\\u00ED\n\n#XSEL: (legend)\nLR_PUBLICHOLIDAY=Sv\\u00E1tek\n\n#XSEL: (legend)\nLR_WORKINGDAY=Pracovn\\u00ED den\n\n#XSEL: (legend)\nLR_DELETIONREQUESTED=Po\\u017Eadov\\u00E1no zru\\u0161en\\u00ED\n\n#XTIT\nLR_DELETION_REQ=\\u017D\\u00E1dost o zru\\u0161en\\u00ED\n\n#XTIT\nLR_CHANGE_REQ=\\u017D\\u00E1dost o zm\\u011Bnu\n\n#XTIT\nLR_CHANGE_PENDING=Nevy\\u0159\\u00EDzen\\u00E1 zm\\u011Bna\n\n#XTIT\nLR_CANCEL_PENDING=Nevy\\u0159\\u00EDzen\\u00E9 zru\\u0161en\\u00ED\n\n#XTIT\nLR_CHANGE_DONE=Zm\\u011Bna schv\\u00E1lena\n\n#XTIT\nLR_CANCEL_DONE=Schv\\u00E1len\\u00E9 zru\\u0161en\\u00ED\n\n#XTIT: Original\nLR_OLD_VERSION=P\\u016Fvodn\\u00ED\n\n#XTIT: Leave Changes\nLR_NEW_VERSION=Zm\\u011Bn\\u011Bno\n\n#XFLD: Label for Approver Selection\nLR_APPROVER=Schvalovatel\n\n#XFLD: Label for Attendance/Absence Hours\nLR_ABS_HOURS=Hodiny p\\u0159\\u00EDtomnosti/nep\\u0159\\u00EDtomnosti\n\n#XFLD: Label for Attachments\nLR_ATTACHMENTS=P\\u0159\\u00EDlohy\n\n#XFLD: Placeholder for Attachments\nLR_ATTACHMENT=P\\u0159ipojit p\\u0159\\u00EDlohu\n\n#XFLD: Label for Start Time\nLR_START_TIME=Po\\u010D\\u00E1te\\u010Dn\\u00ED \\u010Das\n\n#XFLD: Label for Start Time\nLR_END_TIME=Koncov\\u00FD \\u010Das\n\n#YMSG: Error message to display, if the file upload fails\nLR_ATTACHMENT_ERROR=Nepoda\\u0159ilo se uploadovat p\\u0159\\u00EDlohu\n\n#YMSG: warning message to show if the file type is not supported\nLR_ATTACHMENT_TYPECHECK=Tento typ p\\u0159\\u00EDlohy nen\\u00ED podporov\\u00E1n\n\n#YMSG: Warning message to show if the file size exceeds 25MB- Mega Bytes\nLR_ATTACHMENT_SIZECHECK=Soubor je p\\u0159\\u00EDli\\u0161 velk\\u00FD. Vyberte soubor, kter\\u00FD je men\\u0161\\u00ED ne\\u017E 25 MB.\n\n#XFLD: Select Personnel Assignment Label\nPERSONAL_ASSIGN=Zvolte pracovn\\u00ED smlouvu\n\n#XTIT: Select Personnel Assignment Title\nPERSONAL_ASSIGN_TITLE=Pracovn\\u00ED smlouvy\n\n#XFLD: Level for approver\nLR_LEVEL=\\u00DArove\\u0148 {0}\n\n#YMSG: error message to display, if the maximum number of approvers reached\nLR_APPROVER_LEVEL_MAX=Ji\\u017E jste zadali maxim\\u00E1ln\\u00ED po\\u010Det schvalovatel\\u016F.\n',
	"hcm/myleaverequest/i18n/i18n_de.properties":'\n#XTIT: Application name (shown in browser header bar or as browser tab title)\napp.Identity=Meine Abwesenheitsantr\\u00E4ge\n\n#XTIT: title of the home view\nLR_TITLE_HOME_VIEW=Meine Abwesenheitsantr\\u00E4ge\n\n#XTIT: title of the leave create view\nLR_TITLE_CREATE_VIEW=Abwesenheit beantragen\n\n#XTIT: title of the leave change view\nLR_TITLE_CHANGE_VIEW=Abwesenheitsantrag \\u00E4ndern\n\n#XTIT: title of the Entitlements view\nLR_TITLE_BALANCE_VIEW=Anspr\\u00FCche\n\n#XTIT: title of the leave History view\nLR_TITLE_HISTORY_VIEW=Verlauf\n\n#XTIT: title of the leave details view\nLR_TITLE_DETAILS_VIEW=Abwesenheitsdetails\n\n#XTIT: title of the leave requests\nLR_TITLE_LEAVE_REQUESTS=Abwesenheitsantr\\u00E4ge\n\n#XTIT: title of the leave request\nLR_TITLE_LEAVE_REQUEST=Abwesenheitsantrag\n\n#XTIT: deductible\nLR_BALANCE_DEDUCTIBLE=Kategorie\n\n#XTIT: Balance\nLR_BALANCE_BALANCE=Verf\\u00FCgbar\n\n#XTIT: Used\nLR_BALANCE_USED=Verwendet\n\n#XTIT: Requested\nLR_BALANCE_REQUESTED=Beantragt\n\n#XTIT: Quota\nLR_BALANCE_QUOTA=Anspr\\u00FCche\n\n#XTIT: Entitlement\nLR_ENTITLEMENT_QUOTA=Anspruch\n\n#XTIT: Send leave request\nLR_TITLE_SEND=Abwesenheitsantrag senden\n\n#XTIT: Cancel leave request\nLR_TITLE_WITHDRAW=Abwesenheitsantrag stornieren\n\n#XTIT: ATTENTION Tile text line break after 12 characters!\nLR_BALANCE_TILE=Anspr\\u00FCche\n\n#XTIT: ATTENTION Tile text line break after 12 characters!\nLR_HISTORY_TILE=Verlauf\n\n#XTIT: ATTENTION Tile text line break after 12 characters!\nLR_CREATE_LEAVE_TILE=Abwesenheitsantrag anlegen\n\n#XBUT\nLR_SHOW_HIST=Verlauf\n\n#XBUT\nLR_CREATE_LEAVE=Abwesenheit beantragen\n\n#XBUT: text for "send leave request" button\nLR_SEND=Senden\n\n#XBUT: text for ok button \nLR_OK=OK\n\n#XBUT: text for reset button \nLR_RESET=Zur\\u00FCcksetzen\n\n#XBUT: text for cancel button e.g. on the day range picker screen\nLR_CANCEL=Abbrechen\n\n#XBUT: text for change button on the Leave Overview details screen\nLR_CHANGE=\\u00C4ndern\n\n#XBUT: text for cancel button on the Leave Overview details screen\nLR_WITHDRAW=Stornieren\n\n#XSEL\nLR_UPDATED=Aktualisiert\n\n#XFLD\nLR_NOTE=Notiz\n\n#XFLD\nLR_CUSTOM1=Benutzerdefiniertes Feld 1\n\n#XFLD: used vacation, lower case for status under calendar. Reads "X days [line feed] used"\nLR_BOOKED=verbraucht\n\n#XFLD: Available balance, lower case for status under calendar. Reads "X days [line feed] available"\nLR_REMAINING=verf\\u00FCgbar\n\n#XFLD\nLR_LOWERCASE_DAYS=Tage\n\n#XFLD\nLR_LOWERCASE_DAY=Tag\n\n#XFLD\nLR_LOWERCASE_HOURS=Stunden\n\n#XFLD\nLR_LOWERCASE_HOUR=Stunde\n\n#XFLD\nLR_UP_TO=G\\u00FCltig bis\n\n#XFLD\nLR_FROM=Von\n\n#XFLD\nLR_TO=Bis\n\n#XFLD\nLR_DEDUCTION=Abzug\n\n#XFLD: Hyphen for Date Formatting\nLR_HYPHEN=-\n\n#XTIT: title of error dialog\nLR_PROBLEM=Fehler aufgetreten\n\n#XTIT: title of confirmation dialog\nLR_CONFIRMATION=Best\\u00E4tigung\n\n#YMSG\nLR_CONFIRMATIONMSG=Abwesenheitsantrag an {0} senden?\n\n#YMSG\nLR_WITHDRAWNMSG=M\\u00F6chten Sie diesen Abwesenheitsantrag stornieren?\n\n#XFLD\nLR_DAYS=Tage\n\n#XFLD\nLR_DAY=Tag\n\n#XFLD\nLR_HOURS=Stunden\n\n#XFLD\nLR_HOUR=Stunde\n\n#XFLD\nLR_REQUEST=Beantragt\n\n#XSEL: day type (legend)\nLR_DTYPE_TODAY=Heute\n\n#XSEL: day type (legend)\nLR_DTYPE_SELECTED=Ausgew\\u00E4hlte Tage\n\n#YMSG: processing\nLR_PROCESSING=Verarbeitung l\\u00E4uft ...\n\n#YMSG\nLR_SUBMITDONE=Ihr Abwesenheitsantrag wurde an {0} gesendet\n\n#YMSG\nLR_WITHDRAWDONE=Ihr Abwesenheitsantrag wurde storniert\n\n#YMSG\nLR_AX_MODEL_NOT_REG=Ein technisches Problem ist aufgetreten.\\n\\nFehlerdetails\\:\\nInterner Fehler, Modell nicht registriert\n\n#YMSG\nLR_AX_PARSE_ERR=Ein technisches Problem ist aufgetreten.\\n\\nFehlerdetails\\:\\nProtokollfehler, HTTP-Antwort kann nicht analysiert werden\n\n#YMSG\nLR_DD_NO_APPROVER=Ein technisches Problem ist aufgetreten.\\n\\nFehlerdetails\\:\\nProtokollfehler, Genehmigender fehlt in Antwort\n\n#YMSG\nLR_DD_NO_CFG=Ein technisches Problem ist aufgetreten.\\n\\nFehlerdetails\\:\\nProtokollfehler, Konfiguration fehlt in Antwort\n\n#YMSG\nLR_DD_NO_BALANCES=Ein technisches Problem ist aufgetreten.\\n\\nFehlerdetails\\:\\nProtokollfehler, Salden fehlen in Antwort\n\n#YMSG\nLR_DD_PARSE_ERR=Ein technisches Problem ist aufgetreten.\\n\\nFehlerdetails\\:\\nProtokollfehler, Antwort kann nicht analysiert werden\n\n#YMSG\nLR_DD_COMM_ERR=Verbindungsfehler\n\n#YMSG\nLR_DD_GENERIC_ERR=Es ist ein Fehler aufgetreten\n\n#YMSG\nLR_CT_PARSE_ERR=Ein technisches Problem ist aufgetreten.\\n\\nFehlerdetails\\:\\nProtokollfehler, Antwort kann nicht analysiert werden\n\n#XFLD\nLR_S1_PENDING=Ausstehend\n\n#YMSG\nLR_UNKNOWN=Unbekannt\n\n#XSEL: (legend)\nLR_NONWORKING=Arbeitsfreier Tag\n\n#XSEL: (legend)\nLR_APPROVELEAVE=Genehmigt\n\n#XSEL: (legend)\nLR_REJECTEDLEAVE=Abgelehnt\n\n#XSEL: (legend)\nLR_APPROVEPENDING=Genehmigung ausstehend\n\n#XSEL: (legend)\nLR_PUBLICHOLIDAY=Feiertag\n\n#XSEL: (legend)\nLR_WORKINGDAY=Arbeitstag\n\n#XSEL: (legend)\nLR_DELETIONREQUESTED=Stornierung beantragt\n\n#XTIT\nLR_DELETION_REQ=Stornierungsantrag\n\n#XTIT\nLR_CHANGE_REQ=Antrag \\u00E4ndern\n\n#XTIT\nLR_CHANGE_PENDING=\\u00C4nderung ausstehend\n\n#XTIT\nLR_CANCEL_PENDING=Stornierung ausstehend\n\n#XTIT\nLR_CHANGE_DONE=\\u00C4nderung wurde genehmigt\n\n#XTIT\nLR_CANCEL_DONE=Stornierung wurde genehmigt\n\n#XTIT: Original\nLR_OLD_VERSION=Original\n\n#XTIT: Leave Changes\nLR_NEW_VERSION=Ge\\u00E4ndert\n\n#XFLD: Label for Approver Selection\nLR_APPROVER=Genehmigender\n\n#XFLD: Label for Attendance/Absence Hours\nLR_ABS_HOURS=Anwesenheits-/Abwesenheitsstunden\n\n#XFLD: Label for Attachments\nLR_ATTACHMENTS=Anlagen\n\n#XFLD: Placeholder for Attachments\nLR_ATTACHMENT=Anlage hinzuf\\u00FCgen\n\n#XFLD: Label for Start Time\nLR_START_TIME=Beginn (Zeit)\n\n#XFLD: Label for Start Time\nLR_END_TIME=Ende (Zeit)\n\n#YMSG: Error message to display, if the file upload fails\nLR_ATTACHMENT_ERROR=Die Anlage konnte nicht hochgeladen werden.\n\n#YMSG: warning message to show if the file type is not supported\nLR_ATTACHMENT_TYPECHECK=Diese Anlagenart wird nicht unterst\\u00FCtzt.\n\n#YMSG: Warning message to show if the file size exceeds 25MB- Mega Bytes\nLR_ATTACHMENT_SIZECHECK=Die Datei ist zu gro\\u00DF. W\\u00E4hlen Sie eine Datei aus, die kleiner als 25 MB ist.\n\n#XFLD: Select Personnel Assignment Label\nPERSONAL_ASSIGN=W\\u00E4hlen Sie einen Besch\\u00E4ftigungsvertrag\n\n#XTIT: Select Personnel Assignment Title\nPERSONAL_ASSIGN_TITLE=Besch\\u00E4ftigungsvertr\\u00E4ge\n\n#XFLD: Level for approver\nLR_LEVEL=Ebene {0}\n\n#YMSG: error message to display, if the maximum number of approvers reached\nLR_APPROVER_LEVEL_MAX=Sie haben die maximale Anzahl der Genehmigenden bereits erreicht.\n',
	"hcm/myleaverequest/i18n/i18n_en.properties":'\n#XTIT: Application name (shown in browser header bar or as browser tab title)\napp.Identity=My Leave Requests\n\n#XTIT: title of the home view\nLR_TITLE_HOME_VIEW=My Leave Requests\n\n#XTIT: title of the leave create view\nLR_TITLE_CREATE_VIEW=Request Leave\n\n#XTIT: title of the leave change view\nLR_TITLE_CHANGE_VIEW=Change Leave Request\n\n#XTIT: title of the Entitlements view\nLR_TITLE_BALANCE_VIEW=Entitlements\n\n#XTIT: title of the leave History view\nLR_TITLE_HISTORY_VIEW=History\n\n#XTIT: title of the leave details view\nLR_TITLE_DETAILS_VIEW=Leave Details\n\n#XTIT: title of the leave requests\nLR_TITLE_LEAVE_REQUESTS=Leave Requests\n\n#XTIT: title of the leave request\nLR_TITLE_LEAVE_REQUEST=Leave Request\n\n#XTIT: deductible\nLR_BALANCE_DEDUCTIBLE=Category\n\n#XTIT: Balance\nLR_BALANCE_BALANCE=Available\n\n#XTIT: Used\nLR_BALANCE_USED=Used\n\n#XTIT: Requested\nLR_BALANCE_REQUESTED=Requested\n\n#XTIT: Quota\nLR_BALANCE_QUOTA=Entitlements\n\n#XTIT: Entitlement\nLR_ENTITLEMENT_QUOTA=Entitlement\n\n#XTIT: Send leave request\nLR_TITLE_SEND=Send Leave Request\n\n#XTIT: Cancel leave request\nLR_TITLE_WITHDRAW=Withdraw Leave Request\n\n#XTIT: ATTENTION Tile text line break after 12 characters!\nLR_BALANCE_TILE=Entitlements\n\n#XTIT: ATTENTION Tile text line break after 12 characters!\nLR_HISTORY_TILE=History\n\n#XTIT: ATTENTION Tile text line break after 12 characters!\nLR_CREATE_LEAVE_TILE=Create Leave Request\n\n#XBUT\nLR_SHOW_HIST=History\n\n#XBUT\nLR_CREATE_LEAVE=Request Leave\n\n#XBUT: text for "send leave request" button\nLR_SEND=Send\n\n#XBUT: text for ok button \nLR_OK=OK\n\n#XBUT: text for reset button \nLR_RESET=Reset\n\n#XBUT: text for cancel button e.g. on the day range picker screen\nLR_CANCEL=Cancel\n\n#XBUT: text for change button on the Leave Overview details screen\nLR_CHANGE=Change\n\n#XBUT: text for cancel button on the Leave Overview details screen\nLR_WITHDRAW=Withdraw\n\n#XSEL\nLR_UPDATED=Updated\n\n#XFLD\nLR_NOTE=Note\n\n#XFLD\nLR_CUSTOM1=Custom Field 1\n\n#XFLD: used vacation, lower case for status under calendar. Reads "X days [line feed] used"\nLR_BOOKED=used\n\n#XFLD: Available balance, lower case for status under calendar. Reads "X days [line feed] available"\nLR_REMAINING=available\n\n#XFLD\nLR_LOWERCASE_DAYS=days\n\n#XFLD\nLR_LOWERCASE_DAY=day\n\n#XFLD\nLR_LOWERCASE_HOURS=hours\n\n#XFLD\nLR_LOWERCASE_HOUR=hour\n\n#XFLD\nLR_UP_TO=Valid Until\n\n#XFLD\nLR_FROM=From\n\n#XFLD\nLR_TO=To\n\n#XFLD\nLR_DEDUCTION=Deduction\n\n#XFLD: Hyphen for Date Formatting\nLR_HYPHEN=-\n\n#XTIT: title of error dialog\nLR_PROBLEM=A problem occurred\n\n#XTIT: title of confirmation dialog\nLR_CONFIRMATION=Confirmation\n\n#YMSG\nLR_CONFIRMATIONMSG=Send this leave request to {0}?\n\n#YMSG\nLR_WITHDRAWNMSG=Do you want to withdraw this leave request?\n\n#XFLD\nLR_DAYS=days\n\n#XFLD\nLR_DAY=Day\n\n#XFLD\nLR_HOURS=Hours\n\n#XFLD\nLR_HOUR=Hour\n\n#XFLD\nLR_REQUEST=Requested\n\n#XSEL: day type (legend)\nLR_DTYPE_TODAY=Today\n\n#XSEL: day type (legend)\nLR_DTYPE_SELECTED=Selected Day(s)\n\n#YMSG: processing\nLR_PROCESSING=Processing...\n\n#YMSG\nLR_SUBMITDONE=Your leave request was sent to {0}\n\n#YMSG\nLR_WITHDRAWDONE=Your leave request was withdrawn\n\n#YMSG\nLR_AX_MODEL_NOT_REG=A technical problem has occurred\\n\\nError Details\\:\\nInternal error; model not registered\n\n#YMSG\nLR_AX_PARSE_ERR=A technical problem has occurred\\n\\nError Details\\:\\nProtocol error; could not parse HTTP response\n\n#YMSG\nLR_DD_NO_APPROVER=A technical problem has occurred\\n\\nError Details\\:\\nProtocol error; approver name missing in response\n\n#YMSG\nLR_DD_NO_CFG=A technical problem has occurred\\n\\nError Details\\:\\nProtocol error; configuration missing in response\n\n#YMSG\nLR_DD_NO_BALANCES=A technical problem has occurred\\n\\nError Details\\:\\nProtocol error; balances missing in response\n\n#YMSG\nLR_DD_PARSE_ERR=A technical problem has occurred\\n\\nError Details\\:\\nProtocol error; could not parse response\n\n#YMSG\nLR_DD_COMM_ERR=A problem has occurred with your connection\n\n#YMSG\nLR_DD_GENERIC_ERR=An error has occurred\n\n#YMSG\nLR_CT_PARSE_ERR=A technical problem has occurred\\n\\nError Details\\:\\nProtocol error; could not parse response\n\n#XFLD\nLR_S1_PENDING=Pending\n\n#YMSG\nLR_UNKNOWN=Unknown\n\n#XSEL: (legend)\nLR_NONWORKING=Non-Working Day\n\n#XSEL: (legend)\nLR_APPROVELEAVE=Approved\n\n#XSEL: (legend)\nLR_REJECTEDLEAVE=Rejected\n\n#XSEL: (legend)\nLR_APPROVEPENDING=Approval Pending\n\n#XSEL: (legend)\nLR_PUBLICHOLIDAY=Public Holiday\n\n#XSEL: (legend)\nLR_WORKINGDAY=Working Day\n\n#XSEL: (legend)\nLR_DELETIONREQUESTED=Cancellation Requested\n\n#XTIT\nLR_DELETION_REQ=Cancellation Request\n\n#XTIT\nLR_CHANGE_REQ=Change Request\n\n#XTIT\nLR_CHANGE_PENDING=Change Pending\n\n#XTIT\nLR_CANCEL_PENDING=Cancellation Pending\n\n#XTIT\nLR_CHANGE_DONE=Change Approved\n\n#XTIT\nLR_CANCEL_DONE=Cancellation Approved\n\n#XTIT: Original\nLR_OLD_VERSION=Original\n\n#XTIT: Leave Changes\nLR_NEW_VERSION=Changed\n\n#XFLD: Label for Approver Selection\nLR_APPROVER=Approver\n\n#XFLD: Label for Attendance/Absence Hours\nLR_ABS_HOURS=Attendance/Absence Hours\n\n#XFLD: Label for Attachments\nLR_ATTACHMENTS=Attachments\n\n#XFLD: Placeholder for Attachments\nLR_ATTACHMENT=Add Attachment\n\n#XFLD: Label for Start Time\nLR_START_TIME=Start Time\n\n#XFLD: Label for Start Time\nLR_END_TIME=End Time\n\n#YMSG: Error message to display, if the file upload fails\nLR_ATTACHMENT_ERROR=Could not upload the attachment\n\n#YMSG: warning message to show if the file type is not supported\nLR_ATTACHMENT_TYPECHECK=This attachment type is not supported\n\n#YMSG: Warning message to show if the file size exceeds 25MB- Mega Bytes\nLR_ATTACHMENT_SIZECHECK=File size is too big. Please select a file less than 25MB in size.\n\n#XFLD: Select Personnel Assignment Label\nPERSONAL_ASSIGN=Choose a Personnel Assignment\n\n#XTIT: Select Personnel Assignment Title\nPERSONAL_ASSIGN_TITLE=Personnel Assignments\n\n#XFLD: Level for approver\nLR_LEVEL=Level {0}\n\n#YMSG: error message to display, if the maximum number of approvers reached\nLR_APPROVER_LEVEL_MAX=You have already entered the maximum number of approvers.\n',
	"hcm/myleaverequest/i18n/i18n_en_US_sappsd.properties":'\n#XTIT: Application name (shown in browser header bar or as browser tab title)\napp.Identity=[[[\\u039C\\u0177 \\u013B\\u0113\\u0105\\u028B\\u0113 \\u0158\\u0113\\u01A3\\u0171\\u0113\\u015F\\u0163\\u015F\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n#XTIT: title of the home view\nLR_TITLE_HOME_VIEW=[[[\\u039C\\u0177 \\u013B\\u0113\\u0105\\u028B\\u0113 \\u0158\\u0113\\u01A3\\u0171\\u0113\\u015F\\u0163\\u015F\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n#XTIT: title of the leave create view\nLR_TITLE_CREATE_VIEW=[[[\\u0158\\u0113\\u01A3\\u0171\\u0113\\u015F\\u0163 \\u013B\\u0113\\u0105\\u028B\\u0113\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n#XTIT: title of the leave change view\nLR_TITLE_CHANGE_VIEW=[[[\\u0108\\u0125\\u0105\\u014B\\u011F\\u0113 \\u013B\\u0113\\u0105\\u028B\\u0113 \\u0158\\u0113\\u01A3\\u0171\\u0113\\u015F\\u0163\\u2219\\u2219\\u2219\\u2219]]]\n\n#XTIT: title of the Entitlements view\nLR_TITLE_BALANCE_VIEW=[[[\\u0114\\u014B\\u0163\\u012F\\u0163\\u013A\\u0113\\u0271\\u0113\\u014B\\u0163\\u015F\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n#XTIT: title of the leave History view\nLR_TITLE_HISTORY_VIEW=[[[\\u0124\\u012F\\u015F\\u0163\\u014F\\u0157\\u0177\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n#XTIT: title of the leave details view\nLR_TITLE_DETAILS_VIEW=[[[\\u013B\\u0113\\u0105\\u028B\\u0113 \\u010E\\u0113\\u0163\\u0105\\u012F\\u013A\\u015F\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n#XTIT: title of the leave requests\nLR_TITLE_LEAVE_REQUESTS=[[[\\u013B\\u0113\\u0105\\u028B\\u0113 \\u0158\\u0113\\u01A3\\u0171\\u0113\\u015F\\u0163\\u015F\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n#XTIT: title of the leave request\nLR_TITLE_LEAVE_REQUEST=[[[\\u013B\\u0113\\u0105\\u028B\\u0113 \\u0158\\u0113\\u01A3\\u0171\\u0113\\u015F\\u0163\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n#XTIT: deductible\nLR_BALANCE_DEDUCTIBLE=[[[\\u0108\\u0105\\u0163\\u0113\\u011F\\u014F\\u0157\\u0177\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n#XTIT: Balance\nLR_BALANCE_BALANCE=[[[\\u0100\\u028B\\u0105\\u012F\\u013A\\u0105\\u0183\\u013A\\u0113\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n#XTIT: Used\nLR_BALANCE_USED=[[[\\u016E\\u015F\\u0113\\u018C]]]\n\n#XTIT: Requested\nLR_BALANCE_REQUESTED=[[[\\u0158\\u0113\\u01A3\\u0171\\u0113\\u015F\\u0163\\u0113\\u018C\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n#XTIT: Quota\nLR_BALANCE_QUOTA=[[[\\u0114\\u014B\\u0163\\u012F\\u0163\\u013A\\u0113\\u0271\\u0113\\u014B\\u0163\\u015F\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n#XTIT: Entitlement\nLR_ENTITLEMENT_QUOTA=[[[\\u0114\\u014B\\u0163\\u012F\\u0163\\u013A\\u0113\\u0271\\u0113\\u014B\\u0163\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n#XTIT: Send leave request\nLR_TITLE_SEND=[[[\\u015C\\u0113\\u014B\\u018C \\u013B\\u0113\\u0105\\u028B\\u0113 \\u0158\\u0113\\u01A3\\u0171\\u0113\\u015F\\u0163\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n#XTIT: Cancel leave request\nLR_TITLE_WITHDRAW=[[[\\u0174\\u012F\\u0163\\u0125\\u018C\\u0157\\u0105\\u0175 \\u013B\\u0113\\u0105\\u028B\\u0113 \\u0158\\u0113\\u01A3\\u0171\\u0113\\u015F\\u0163\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n#XTIT: ATTENTION Tile text line break after 12 characters!\nLR_BALANCE_TILE=[[[\\u0114\\u014B\\u0163\\u012F\\u0163\\u013A\\u0113\\u0271\\u0113\\u014B\\u0163\\u015F \\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n#XTIT: ATTENTION Tile text line break after 12 characters!\nLR_HISTORY_TILE=[[[\\u0124\\u012F\\u015F\\u0163\\u014F\\u0157\\u0177\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n#XTIT: ATTENTION Tile text line break after 12 characters!\nLR_CREATE_LEAVE_TILE=[[[\\u0108\\u0157\\u0113\\u0105\\u0163\\u0113 \\u013B\\u0113\\u0105\\u028B\\u0113 \\u0158\\u0113\\u01A3\\u0171\\u0113\\u015F\\u0163\\u2219\\u2219\\u2219\\u2219]]]\n\n#XBUT\nLR_SHOW_HIST=[[[\\u0124\\u012F\\u015F\\u0163\\u014F\\u0157\\u0177\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n#XBUT\nLR_CREATE_LEAVE=[[[\\u0158\\u0113\\u01A3\\u0171\\u0113\\u015F\\u0163 \\u013B\\u0113\\u0105\\u028B\\u0113\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n#XBUT: text for "send leave request" button\nLR_SEND=[[[\\u015C\\u0113\\u014B\\u018C]]]\n\n#XBUT: text for ok button \nLR_OK=[[[\\u014E\\u0136\\u2219\\u2219]]]\n\n#XBUT: text for reset button \nLR_RESET=[[[\\u0158\\u0113\\u015F\\u0113\\u0163\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n#XBUT: text for cancel button e.g. on the day range picker screen\nLR_CANCEL=[[[\\u0108\\u0105\\u014B\\u010B\\u0113\\u013A\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n#XBUT: text for change button on the Leave Overview details screen\nLR_CHANGE=[[[\\u0108\\u0125\\u0105\\u014B\\u011F\\u0113\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n#XBUT: text for cancel button on the Leave Overview details screen\nLR_WITHDRAW=[[[\\u0174\\u012F\\u0163\\u0125\\u018C\\u0157\\u0105\\u0175\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n#XSEL\nLR_UPDATED=[[[\\u016E\\u03C1\\u018C\\u0105\\u0163\\u0113\\u018C \\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n#XFLD\nLR_NOTE=[[[\\u0143\\u014F\\u0163\\u0113]]]\n\n#XFLD\nLR_CUSTOM1=[[[\\u0108\\u0171\\u015F\\u0163\\u014F\\u0271 \\u0191\\u012F\\u0113\\u013A\\u018C 1\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n#XFLD: used vacation, lower case for status under calendar. Reads "X days [line feed] used"\nLR_BOOKED=[[[\\u0171\\u015F\\u0113\\u018C]]]\n\n#XFLD: Available balance, lower case for status under calendar. Reads "X days [line feed] available"\nLR_REMAINING=[[[\\u0105\\u028B\\u0105\\u012F\\u013A\\u0105\\u0183\\u013A\\u0113\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n#XFLD\nLR_LOWERCASE_DAYS=[[[\\u018C\\u0105\\u0177\\u015F]]]\n\n#XFLD\nLR_LOWERCASE_DAY=[[[\\u018C\\u0105\\u0177\\u2219]]]\n\n#XFLD\nLR_LOWERCASE_HOURS=[[[\\u0125\\u014F\\u0171\\u0157\\u015F\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n#XFLD\nLR_LOWERCASE_HOUR=[[[\\u0125\\u014F\\u0171\\u0157]]]\n\n#XFLD\nLR_UP_TO=[[[\\u01B2\\u0105\\u013A\\u012F\\u018C \\u016E\\u03C1\\u0163\\u014F\\u2219\\u2219\\u2219\\u2219]]]\n\n#XFLD\nLR_FROM=[[[\\u0191\\u0157\\u014F\\u0271]]]\n\n#XFLD\nLR_TO=[[[\\u0162\\u014F\\u2219\\u2219]]]\n\n#XFLD\nLR_DEDUCTION=[[[\\u010E\\u0113\\u018C\\u0171\\u010B\\u0163\\u012F\\u014F\\u014B\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n#XFLD: Hyphen for Date Formatting\nLR_HYPHEN=[[[-\\u2219\\u2219\\u2219]]]\n\n#XTIT: title of error dialog\nLR_PROBLEM=[[[\\u0100 \\u03C1\\u0157\\u014F\\u0183\\u013A\\u0113\\u0271 \\u014F\\u010B\\u010B\\u0171\\u0157\\u0157\\u0113\\u018C\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n#XTIT: title of confirmation dialog\nLR_CONFIRMATION=[[[\\u0108\\u014F\\u014B\\u0192\\u012F\\u0157\\u0271\\u0105\\u0163\\u012F\\u014F\\u014B\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n#YMSG\nLR_CONFIRMATIONMSG=[[[\\u010E\\u014F \\u0177\\u014F\\u0171 \\u0175\\u0105\\u014B\\u0163 \\u0163\\u014F \\u015F\\u0113\\u014B\\u018C \\u0163\\u0125\\u012F\\u015F \\u013A\\u0113\\u0105\\u028B\\u0113 \\u0157\\u0113\\u01A3\\u0171\\u0113\\u015F\\u0163 \\u0163\\u014F {0}?]]]\n\n#YMSG\nLR_WITHDRAWNMSG=[[[\\u010E\\u014F \\u0177\\u014F\\u0171 \\u0175\\u0105\\u014B\\u0163 \\u0163\\u014F \\u0175\\u012F\\u0163\\u0125\\u018C\\u0157\\u0105\\u0175 \\u0163\\u0125\\u012F\\u015F \\u013A\\u0113\\u0105\\u028B\\u0113 \\u0157\\u0113\\u01A3\\u0171\\u0113\\u015F\\u0163?\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n#XFLD\nLR_DAYS=[[[\\u018C\\u0105\\u0177\\u015F]]]\n\n#XFLD\nLR_DAY=[[[\\u018C\\u0105\\u0177\\u2219]]]\n\n#XFLD\nLR_HOURS=[[[\\u0125\\u014F\\u0171\\u0157\\u015F\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n#XFLD\nLR_HOUR=[[[\\u0125\\u014F\\u0171\\u0157]]]\n\n#XFLD\nLR_REQUEST=[[[\\u0158\\u0113\\u01A3\\u0171\\u0113\\u015F\\u0163\\u0113\\u018C\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n#XSEL: day type (legend)\nLR_DTYPE_TODAY=[[[\\u0162\\u014F\\u018C\\u0105\\u0177\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n#XSEL: day type (legend)\nLR_DTYPE_SELECTED=[[[\\u015C\\u0113\\u013A\\u0113\\u010B\\u0163\\u0113\\u018C \\u010E\\u0105\\u0177\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n#YMSG: processing\nLR_PROCESSING=[[[\\u01A4\\u0157\\u014F\\u010B\\u0113\\u015F\\u015F\\u012F\\u014B\\u011F...\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n#YMSG\nLR_SUBMITDONE=[[[\\u0176\\u014F\\u0171\\u0157 \\u013A\\u0113\\u0105\\u028B\\u0113 \\u0157\\u0113\\u01A3\\u0171\\u0113\\u015F\\u0163 \\u0175\\u0105\\u015F \\u015F\\u0113\\u014B\\u0163 \\u0163\\u014F {0}]]]\n\n#YMSG\nLR_WITHDRAWDONE=[[[\\u0176\\u014F\\u0171\\u0157 \\u013A\\u0113\\u0105\\u028B\\u0113 \\u0157\\u0113\\u01A3\\u0171\\u0113\\u015F\\u0163 \\u0175\\u0105\\u015F \\u0175\\u012F\\u0163\\u0125\\u018C\\u0157\\u0105\\u0175\\u014B\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n#YMSG\nLR_AX_MODEL_NOT_REG=[[[\\u0100 \\u0163\\u0113\\u010B\\u0125\\u014B\\u012F\\u010B\\u0105\\u013A \\u03C1\\u0157\\u014F\\u0183\\u013A\\u0113\\u0271 \\u0125\\u0105\\u015F \\u014F\\u010B\\u010B\\u0171\\u0157\\u0157\\u0113\\u018C\\n\\n\\u0114\\u0157\\u0157\\u014F\\u0157 \\u010E\\u0113\\u0163\\u0105\\u012F\\u013A\\u015F\\:\\n\\u012C\\u014B\\u0163\\u0113\\u0157\\u014B\\u0105\\u013A \\u0113\\u0157\\u0157\\u014F\\u0157; \\u0271\\u014F\\u018C\\u0113\\u013A \\u014B\\u014F\\u0163 \\u0157\\u0113\\u011F\\u012F\\u015F\\u0163\\u0113\\u0157\\u0113\\u018C\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n#YMSG\nLR_AX_PARSE_ERR=[[[\\u0100 \\u0163\\u0113\\u010B\\u0125\\u014B\\u012F\\u010B\\u0105\\u013A \\u03C1\\u0157\\u014F\\u0183\\u013A\\u0113\\u0271 \\u0125\\u0105\\u015F \\u014F\\u010B\\u010B\\u0171\\u0157\\u0157\\u0113\\u018C\\n\\n\\u0114\\u0157\\u0157\\u014F\\u0157 \\u010E\\u0113\\u0163\\u0105\\u012F\\u013A\\u015F\\:\\n\\u01A4\\u0157\\u014F\\u0163\\u014F\\u010B\\u014F\\u013A \\u0113\\u0157\\u0157\\u014F\\u0157; \\u010B\\u014F\\u0171\\u013A\\u018C \\u014B\\u014F\\u0163 \\u03C1\\u0105\\u0157\\u015F\\u0113 \\u0124\\u0162\\u0162\\u01A4 \\u0157\\u0113\\u015F\\u03C1\\u014F\\u014B\\u015F\\u0113\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n#YMSG\nLR_DD_NO_APPROVER=[[[\\u0100 \\u0163\\u0113\\u010B\\u0125\\u014B\\u012F\\u010B\\u0105\\u013A \\u03C1\\u0157\\u014F\\u0183\\u013A\\u0113\\u0271 \\u0125\\u0105\\u015F \\u014F\\u010B\\u010B\\u0171\\u0157\\u0157\\u0113\\u018C\\n\\n\\u0114\\u0157\\u0157\\u014F\\u0157 \\u010E\\u0113\\u0163\\u0105\\u012F\\u013A\\u015F\\:\\n\\u01A4\\u0157\\u014F\\u0163\\u014F\\u010B\\u014F\\u013A \\u0113\\u0157\\u0157\\u014F\\u0157; \\u0105\\u03C1\\u03C1\\u0157\\u014F\\u028B\\u0113\\u0157 \\u014B\\u0105\\u0271\\u0113 \\u0271\\u012F\\u015F\\u015F\\u012F\\u014B\\u011F \\u012F\\u014B \\u0157\\u0113\\u015F\\u03C1\\u014F\\u014B\\u015F\\u0113\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n#YMSG\nLR_DD_NO_CFG=[[[\\u0100 \\u0163\\u0113\\u010B\\u0125\\u014B\\u012F\\u010B\\u0105\\u013A \\u03C1\\u0157\\u014F\\u0183\\u013A\\u0113\\u0271 \\u0125\\u0105\\u015F \\u014F\\u010B\\u010B\\u0171\\u0157\\u0157\\u0113\\u018C\\n\\n\\u0114\\u0157\\u0157\\u014F\\u0157 \\u010E\\u0113\\u0163\\u0105\\u012F\\u013A\\u015F\\:\\n\\u01A4\\u0157\\u014F\\u0163\\u014F\\u010B\\u014F\\u013A \\u0113\\u0157\\u0157\\u014F\\u0157; \\u010B\\u014F\\u014B\\u0192\\u012F\\u011F\\u0171\\u0157\\u0105\\u0163\\u012F\\u014F\\u014B \\u0271\\u012F\\u015F\\u015F\\u012F\\u014B\\u011F \\u012F\\u014B \\u0157\\u0113\\u015F\\u03C1\\u014F\\u014B\\u015F\\u0113\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n#YMSG\nLR_DD_NO_BALANCES=[[[\\u0100 \\u0163\\u0113\\u010B\\u0125\\u014B\\u012F\\u010B\\u0105\\u013A \\u03C1\\u0157\\u014F\\u0183\\u013A\\u0113\\u0271 \\u0125\\u0105\\u015F \\u014F\\u010B\\u010B\\u0171\\u0157\\u0157\\u0113\\u018C\\n\\n\\u0114\\u0157\\u0157\\u014F\\u0157 \\u010E\\u0113\\u0163\\u0105\\u012F\\u013A\\u015F\\:\\n\\u01A4\\u0157\\u014F\\u0163\\u014F\\u010B\\u014F\\u013A \\u0113\\u0157\\u0157\\u014F\\u0157; \\u0183\\u0105\\u013A\\u0105\\u014B\\u010B\\u0113\\u015F \\u0271\\u012F\\u015F\\u015F\\u012F\\u014B\\u011F \\u012F\\u014B \\u0157\\u0113\\u015F\\u03C1\\u014F\\u014B\\u015F\\u0113\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n#YMSG\nLR_DD_PARSE_ERR=[[[\\u0100 \\u0163\\u0113\\u010B\\u0125\\u014B\\u012F\\u010B\\u0105\\u013A \\u03C1\\u0157\\u014F\\u0183\\u013A\\u0113\\u0271 \\u0125\\u0105\\u015F \\u014F\\u010B\\u010B\\u0171\\u0157\\u0157\\u0113\\u018C\\n\\n\\u0114\\u0157\\u0157\\u014F\\u0157 \\u010E\\u0113\\u0163\\u0105\\u012F\\u013A\\u015F\\:\\n\\u01A4\\u0157\\u014F\\u0163\\u014F\\u010B\\u014F\\u013A \\u0113\\u0157\\u0157\\u014F\\u0157; \\u010B\\u014F\\u0171\\u013A\\u018C \\u014B\\u014F\\u0163 \\u03C1\\u0105\\u0157\\u015F\\u0113 \\u0157\\u0113\\u015F\\u03C1\\u014F\\u014B\\u015F\\u0113\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n#YMSG\nLR_DD_COMM_ERR=[[[\\u0100 \\u03C1\\u0157\\u014F\\u0183\\u013A\\u0113\\u0271 \\u0125\\u0105\\u015F \\u014F\\u010B\\u010B\\u0171\\u0157\\u0157\\u0113\\u018C \\u0175\\u012F\\u0163\\u0125 \\u0177\\u014F\\u0171\\u0157 \\u010B\\u014F\\u014B\\u014B\\u0113\\u010B\\u0163\\u012F\\u014F\\u014B\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n#YMSG\nLR_DD_GENERIC_ERR=[[[\\u0100\\u014B \\u0113\\u0157\\u0157\\u014F\\u0157 \\u0125\\u0105\\u015F \\u014F\\u010B\\u010B\\u0171\\u0157\\u0157\\u0113\\u018C\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n#YMSG\nLR_CT_PARSE_ERR=[[[\\u0100 \\u0163\\u0113\\u010B\\u0125\\u014B\\u012F\\u010B\\u0105\\u013A \\u03C1\\u0157\\u014F\\u0183\\u013A\\u0113\\u0271 \\u0125\\u0105\\u015F \\u014F\\u010B\\u010B\\u0171\\u0157\\u0157\\u0113\\u018C\\n\\n\\u0114\\u0157\\u0157\\u014F\\u0157 \\u010E\\u0113\\u0163\\u0105\\u012F\\u013A\\u015F\\:\\n\\u01A4\\u0157\\u014F\\u0163\\u014F\\u010B\\u014F\\u013A \\u0113\\u0157\\u0157\\u014F\\u0157; \\u0108\\u014F\\u0171\\u013A\\u018C \\u014B\\u014F\\u0163 \\u03C1\\u0105\\u0157\\u015F\\u0113 \\u0157\\u0113\\u015F\\u03C1\\u014F\\u014B\\u015F\\u0113\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n#XFLD\nLR_S1_PENDING=[[[\\u01A4\\u0113\\u014B\\u018C\\u012F\\u014B\\u011F\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n#YMSG\nLR_UNKNOWN=[[[\\u016E\\u014B\\u0137\\u014B\\u014F\\u0175\\u014B\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n#XSEL: (legend)\nLR_NONWORKING=[[[\\u0143\\u014F\\u014B-\\u0174\\u014F\\u0157\\u0137\\u012F\\u014B\\u011F \\u010E\\u0105\\u0177\\u2219\\u2219\\u2219\\u2219]]]\n\n#XSEL: (legend)\nLR_APPROVELEAVE=[[[\\u0100\\u03C1\\u03C1\\u0157\\u014F\\u028B\\u0113\\u018C\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n#XSEL: (legend)\nLR_REJECTEDLEAVE=[[[\\u0158\\u0113\\u0135\\u0113\\u010B\\u0163\\u0113\\u018C \\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n#XSEL: (legend)\nLR_APPROVEPENDING=[[[\\u0100\\u03C1\\u03C1\\u0157\\u014F\\u028B\\u0105\\u013A \\u01A4\\u0113\\u014B\\u018C\\u012F\\u014B\\u011F\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n#XSEL: (legend)\nLR_PUBLICHOLIDAY=[[[\\u01A4\\u0171\\u0183\\u013A\\u012F\\u010B \\u0124\\u014F\\u013A\\u012F\\u018C\\u0105\\u0177\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n#XSEL: (legend)\nLR_WORKINGDAY=[[[\\u0174\\u014F\\u0157\\u0137\\u012F\\u014B\\u011F \\u010E\\u0105\\u0177\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n#XSEL: (legend)\nLR_DELETIONREQUESTED=[[[\\u0108\\u0105\\u014B\\u010B\\u0113\\u013A\\u013A\\u0105\\u0163\\u012F\\u014F\\u014B \\u0158\\u0113\\u01A3\\u0171\\u0113\\u015F\\u0163\\u0113\\u018C\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n#XTIT\nLR_DELETION_REQ=[[[\\u0108\\u0105\\u014B\\u010B\\u0113\\u013A\\u013A\\u0105\\u0163\\u012F\\u014F\\u014B \\u0158\\u0113\\u01A3\\u0171\\u0113\\u015F\\u0163\\u2219\\u2219\\u2219\\u2219]]]\n\n#XTIT\nLR_CHANGE_REQ=[[[\\u0108\\u0125\\u0105\\u014B\\u011F\\u0113 \\u0158\\u0113\\u01A3\\u0171\\u0113\\u015F\\u0163\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n#XTIT\nLR_CHANGE_PENDING=[[[\\u0108\\u0125\\u0105\\u014B\\u011F\\u0113 \\u01A4\\u0113\\u014B\\u018C\\u012F\\u014B\\u011F\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n#XTIT\nLR_CANCEL_PENDING=[[[\\u0108\\u0105\\u014B\\u010B\\u0113\\u013A\\u013A\\u0105\\u0163\\u012F\\u014F\\u014B \\u01A4\\u0113\\u014B\\u018C\\u012F\\u014B\\u011F\\u2219\\u2219\\u2219\\u2219]]]\n\n#XTIT\nLR_CHANGE_DONE=[[[\\u0108\\u0125\\u0105\\u014B\\u011F\\u0113 \\u0100\\u03C1\\u03C1\\u0157\\u014F\\u028B\\u0113\\u018C\\u2219\\u2219\\u2219\\u2219]]]\n\n#XTIT\nLR_CANCEL_DONE=[[[\\u0108\\u0105\\u014B\\u010B\\u0113\\u013A\\u013A\\u0105\\u0163\\u012F\\u014F\\u014B \\u0100\\u03C1\\u03C1\\u0157\\u014F\\u028B\\u0113\\u018C\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n#XTIT: Original\nLR_OLD_VERSION=[[[\\u014E\\u0157\\u012F\\u011F\\u012F\\u014B\\u0105\\u013A\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n#XTIT: Leave Changes\nLR_NEW_VERSION=[[[\\u0108\\u0125\\u0105\\u014B\\u011F\\u0113\\u018C\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n#XFLD: Label for Approver Selection\nLR_APPROVER=[[[\\u0100\\u03C1\\u03C1\\u0157\\u014F\\u028B\\u0113\\u0157\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n#XFLD: Label for Attendance/Absence Hours\nLR_ABS_HOURS=[[[\\u0100\\u0163\\u0163./\\u0100\\u0183\\u015F\\u0113\\u014B\\u010B\\u0113 \\u0124\\u014F\\u0171\\u0157\\u015F\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n#XFLD: Label for Attachments\nLR_ATTACHMENTS=[[[\\u0100\\u0163\\u0163\\u0105\\u010B\\u0125\\u0271\\u0113\\u014B\\u0163\\u015F\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n#XFLD: Placeholder for Attachments\nLR_ATTACHMENT=[[[\\u0100\\u018C\\u018C \\u0105\\u0163\\u0163\\u0105\\u010B\\u0125\\u0271\\u0113\\u014B\\u0163\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n#XFLD: Label for Start Time\nLR_START_TIME=[[[\\u015C\\u0163\\u0105\\u0157\\u0163 \\u0162\\u012F\\u0271\\u0113\\u2219\\u2219\\u2219\\u2219]]]\n\n#XFLD: Label for Start Time\nLR_END_TIME=[[[\\u0114\\u014B\\u018C \\u0162\\u012F\\u0271\\u0113\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n#YMSG: Error message to display, if the file upload fails\nLR_ATTACHMENT_ERROR=[[[\\u0108\\u0105\\u014B\\u014B\\u014F\\u0163 \\u0171\\u03C1\\u013A\\u014F\\u0105\\u018C \\u0163\\u0125\\u0113 \\u0105\\u0163\\u0163\\u0105\\u010B\\u0125\\u0271\\u0113\\u014B\\u0163. \\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n#YMSG: warning message to show if the file type is not supported\nLR_ATTACHMENT_TYPECHECK=[[[\\u0162\\u0125\\u012F\\u015F \\u0105\\u0163\\u0163\\u0105\\u010B\\u0125\\u0271\\u0113\\u014B\\u0163 \\u0163\\u0177\\u03C1\\u0113 \\u012F\\u015F \\u014B\\u014F\\u0163 \\u015F\\u0171\\u03C1\\u03C1\\u014F\\u0157\\u0163\\u0113\\u018C. \\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n#YMSG: Warning message to show if the file size exceeds 25MB- Mega Bytes\nLR_ATTACHMENT_SIZECHECK=[[[\\u0191\\u012F\\u013A\\u0113 \\u015F\\u012F\\u017E\\u0113 \\u012F\\u015F \\u0163\\u014F\\u014F \\u0183\\u012F\\u011F. \\u01A4\\u013A\\u0113\\u0105\\u015F\\u0113 \\u015F\\u0113\\u013A\\u0113\\u010B\\u0163 \\u0105 \\u0192\\u012F\\u013A\\u0113 \\u013A\\u0113\\u015F\\u015F \\u0163\\u0125\\u0105\\u014B 25\\u039C\\u0181.\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n#XFLD: Select Personnel Assignment Label\nPERSONAL_ASSIGN=[[[\\u0108\\u0125\\u014F\\u014F\\u015F\\u0113 \\u0105 \\u01A4\\u0113\\u0157\\u015F\\u014F\\u014B\\u014B\\u0113\\u013A \\u0100\\u015F\\u015F\\u012F\\u011F\\u014B\\u0271\\u0113\\u014B\\u0163\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n#XTIT: Select Personnel Assignment Title\nPERSONAL_ASSIGN_TITLE=[[[\\u01A4\\u0113\\u0157\\u015F\\u014F\\u014B\\u014B\\u0113\\u013A \\u0100\\u015F\\u015F\\u012F\\u011F\\u014B\\u0271\\u0113\\u014B\\u0163\\u015F\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n#XFLD: Level for approver\nLR_LEVEL=[[[\\u013B\\u0113\\u028B\\u0113\\u013A {0}]]]\n\n#YMSG: error message to display, if the maximum number of approvers reached\nLR_APPROVER_LEVEL_MAX=[[[\\u039C\\u0105\\u03C7\\u012F\\u0271\\u0171\\u0271 \\u014B\\u0171\\u0271\\u0183\\u0113\\u0157 \\u014F\\u0192 \\u0105\\u03C1\\u03C1\\u0157\\u014F\\u028B\\u0113\\u0157\\u015F \\u0105\\u013A\\u0157\\u0113\\u0105\\u018C\\u0177 \\u0105\\u018C\\u018C\\u0113\\u018C\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n',
	"hcm/myleaverequest/i18n/i18n_en_US_saptrc.properties":'\n#XTIT: Application name (shown in browser header bar or as browser tab title)\napp.Identity=HDxRiwoeUW1++okE8GMgsQ_My Leave Requests\n\n#XTIT: title of the home view\nLR_TITLE_HOME_VIEW=La8hdEKioTmRKxPheUXsQw_My Leave Requests\n\n#XTIT: title of the leave create view\nLR_TITLE_CREATE_VIEW=G+DA8JGcIYWncWNmKlaovw_Request Leave\n\n#XTIT: title of the leave change view\nLR_TITLE_CHANGE_VIEW=tG8HmoE7OoYHVlcHFQdbMw_Change Leave Request\n\n#XTIT: title of the Entitlements view\nLR_TITLE_BALANCE_VIEW=b/PvGsTbClof3of9YzF1TA_Entitlements\n\n#XTIT: title of the leave History view\nLR_TITLE_HISTORY_VIEW=h3yYo2+2qVyNqANLHoFkOQ_History\n\n#XTIT: title of the leave details view\nLR_TITLE_DETAILS_VIEW=3Q6vOTqclrPIhvOAaJ2Gow_Leave Details\n\n#XTIT: title of the leave requests\nLR_TITLE_LEAVE_REQUESTS=O4CGmtzVmNaMKKeYEl3/aw_Leave Requests\n\n#XTIT: title of the leave request\nLR_TITLE_LEAVE_REQUEST=xm/RzB7RjQP8gRZQdMFgng_Leave Request\n\n#XTIT: deductible\nLR_BALANCE_DEDUCTIBLE=DusWUYzLo+zv4DZZArD39A_Category\n\n#XTIT: Balance\nLR_BALANCE_BALANCE=dKJHiv/klcauEORCftUZzw_Available\n\n#XTIT: Used\nLR_BALANCE_USED=QReHBm+UW1jJtBOghZyZ9Q_Used\n\n#XTIT: Requested\nLR_BALANCE_REQUESTED=ODwxFLt4BYrpfjgVSDGdUQ_Requested\n\n#XTIT: Quota\nLR_BALANCE_QUOTA=9mb6N6MjCe5FPfLGgNc7cQ_Entitlements\n\n#XTIT: Entitlement\nLR_ENTITLEMENT_QUOTA=zw2w/bXsi76fq55mY3toPQ_Entitlement\n\n#XTIT: Send leave request\nLR_TITLE_SEND=cyPWtRurEjDpDKey9GibXQ_Send Leave Request\n\n#XTIT: Cancel leave request\nLR_TITLE_WITHDRAW=xySUDt4bGd7SDnZvP8xTtA_Withdraw Leave Request\n\n#XTIT: ATTENTION Tile text line break after 12 characters!\nLR_BALANCE_TILE=63vQ5cPmUMXtHfqSTk3PCg_Entitlements \n\n#XTIT: ATTENTION Tile text line break after 12 characters!\nLR_HISTORY_TILE=9k5gYhKk6kDB4fvLhTr29w_History\n\n#XTIT: ATTENTION Tile text line break after 12 characters!\nLR_CREATE_LEAVE_TILE=IVh/Oxgrk1qFitlsWDnHUQ_Create Leave Request\n\n#XBUT\nLR_SHOW_HIST=okPaJ8Zg8SE/oqm7Yqws6g_History\n\n#XBUT\nLR_CREATE_LEAVE=C8fJ9nP0Sdns3mdilf9Jmw_Request Leave\n\n#XBUT: text for "send leave request" button\nLR_SEND=9krKB3bTTyoSteaOpUwXiA_Send\n\n#XBUT: text for ok button \nLR_OK=EV5WqoiGY1H0/LQz96T6dg_OK\n\n#XBUT: text for reset button \nLR_RESET=saYRRG2+voh74zdTTntHnA_Reset\n\n#XBUT: text for cancel button e.g. on the day range picker screen\nLR_CANCEL=bJFLFuSkERKBvpmC9MvYEQ_Cancel\n\n#XBUT: text for change button on the Leave Overview details screen\nLR_CHANGE=oZ3SLHTPYXDZIQJHuFD1vw_Change\n\n#XBUT: text for cancel button on the Leave Overview details screen\nLR_WITHDRAW=G+/+0aK/HCKkHbcH81sudQ_Withdraw\n\n#XSEL\nLR_UPDATED=zqZgk2eh4n8Mu7oUiHnIjg_Updated \n\n#XFLD\nLR_NOTE=FeOLyWVGf5VZil1QDUpNTA_Note\n\n#XFLD\nLR_CUSTOM1=pIMPxvk1QCChGxgFozcRgA_Custom Field 1\n\n#XFLD: used vacation, lower case for status under calendar. Reads "X days [line feed] used"\nLR_BOOKED=DBeBBmLLspW03YXIDL86Jw_used\n\n#XFLD: Available balance, lower case for status under calendar. Reads "X days [line feed] available"\nLR_REMAINING=1EFwvmp7Pme+gbIeGHFh+g_available\n\n#XFLD\nLR_LOWERCASE_DAYS=fTAWVYsv5N2aCTiL/Fpodg_days\n\n#XFLD\nLR_LOWERCASE_DAY=Xl5N/ONNWFEPagP/z6mLgg_day\n\n#XFLD\nLR_LOWERCASE_HOURS=TY2Yi5qPbOH3ANoQ3CbXAA_hours\n\n#XFLD\nLR_LOWERCASE_HOUR=+/2Yue1jlzIGiBYOT1QScA_hour\n\n#XFLD\nLR_UP_TO=3NUNfldBirzACAmJWeXyqg_Valid Upto\n\n#XFLD\nLR_FROM=7JvtS+JKsJZ933II+UmNSA_From\n\n#XFLD\nLR_TO=+kLYkfMLbqiID7gsqCOHlQ_To\n\n#XFLD\nLR_DEDUCTION=6y7Kw7SL0LqptflYHh9tfg_Deduction\n\n#XFLD: Hyphen for Date Formatting\nLR_HYPHEN=cqXKch/iE/e7dpW0nHcXvg_-\n\n#XTIT: title of error dialog\nLR_PROBLEM=zkrCU0tkowDZODRdIMMYEA_A problem occurred\n\n#XTIT: title of confirmation dialog\nLR_CONFIRMATION=o5QpOVZV+N2cSNAOljufOg_Confirmation\n\n#YMSG\nLR_CONFIRMATIONMSG=Rd1Es+Eh1ZkdvSrA4AFLSw_Do you want to send this leave request to {0}?\n\n#YMSG\nLR_WITHDRAWNMSG=u3Jgt4AVp58TBk9/1ueQhA_Do you want to withdraw this leave request?\n\n#XFLD\nLR_DAYS=OdZJnEiNPn6vHkl+5BOcKA_days\n\n#XFLD\nLR_DAY=sEw5UT4ZEjg9ksbcv/YNng_day\n\n#XFLD\nLR_HOURS=Ce+0ZoPYgWTn2Wvb1c7Jsg_hours\n\n#XFLD\nLR_HOUR=Qxns0DHg6CdCcLJ0suoMxQ_hour\n\n#XFLD\nLR_REQUEST=fvUARTNa8E2VyS7PCsYzqA_Requested\n\n#XSEL: day type (legend)\nLR_DTYPE_TODAY=McurWS1413KPSkdUDURuOA_Today\n\n#XSEL: day type (legend)\nLR_DTYPE_SELECTED=dRwo8TodujavIwumlyDv5A_Selected Day\n\n#YMSG: processing\nLR_PROCESSING=VnxOruzR0xqvyNfg1Ee6xw_Processing...\n\n#YMSG\nLR_SUBMITDONE=/Y0jff9NxpvJpuJapsWClw_Your leave request was sent to {0}\n\n#YMSG\nLR_WITHDRAWDONE=Zyy7CROJPJK7zvRzPrxqYA_Your leave request was withdrawn\n\n#YMSG\nLR_AX_MODEL_NOT_REG=XnLSdG+zsMC5heGMKvRDLA_A technical problem has occurred\\n\\nError Details\\:\\nInternal error; model not registered\n\n#YMSG\nLR_AX_PARSE_ERR=NBDVR2eaALRVpA5/Te+32g_A technical problem has occurred\\n\\nError Details\\:\\nProtocol error; could not parse HTTP response\n\n#YMSG\nLR_DD_NO_APPROVER=lc8vqEWW2z8uScaZv3FVwg_A technical problem has occurred\\n\\nError Details\\:\\nProtocol error; approver name missing in response\n\n#YMSG\nLR_DD_NO_CFG=CrdNKNzMX/KOOjgKiVaE+w_A technical problem has occurred\\n\\nError Details\\:\\nProtocol error; configuration missing in response\n\n#YMSG\nLR_DD_NO_BALANCES=dUFlt1Joo4WuwBaPG77ZJA_A technical problem has occurred\\n\\nError Details\\:\\nProtocol error; balances missing in response\n\n#YMSG\nLR_DD_PARSE_ERR=ztxtStpK0e7Viepw9CmwKw_A technical problem has occurred\\n\\nError Details\\:\\nProtocol error; could not parse response\n\n#YMSG\nLR_DD_COMM_ERR=XQDPDsFHUwwKYx9vdSxNXA_A problem has occurred with your connection\n\n#YMSG\nLR_DD_GENERIC_ERR=QxtpBWl/9k9hbAUUMfO4Iw_An error has occurred\n\n#YMSG\nLR_CT_PARSE_ERR=0BPXkgSKtFRo0SHGpdRVyA_A technical problem has occurred\\n\\nError Details\\:\\nProtocol error; Could not parse response\n\n#XFLD\nLR_S1_PENDING=JlJ65HGgXoeANBk5SrAstw_Pending\n\n#YMSG\nLR_UNKNOWN=hiwq5PNjt+ohrR45qBB6iQ_Unknown\n\n#XSEL: (legend)\nLR_NONWORKING=6XhAMAFYlJow35s+GmX+zw_Non-Working Day\n\n#XSEL: (legend)\nLR_APPROVELEAVE=6N+wL54AYzEyVXlP5PSGCA_Approved\n\n#XSEL: (legend)\nLR_REJECTEDLEAVE=HS+/Cl4BjgMXK1Z/TH5Pag_Rejected \n\n#XSEL: (legend)\nLR_APPROVEPENDING=i/i2KRF+wH5vqSNtgdCn+A_Approval Pending\n\n#XSEL: (legend)\nLR_PUBLICHOLIDAY=NCLHZmSRBnYG2AZZJhXX2w_Public Holiday\n\n#XSEL: (legend)\nLR_WORKINGDAY=JD5tbekw43XPAZz3ADDWkA_Working Day\n\n#XSEL: (legend)\nLR_DELETIONREQUESTED=Gl+5Z1VZqmVYd3t+Fcce3Q_Cancellation Requested\n\n#XTIT\nLR_DELETION_REQ=UDXA3pd7EPhSi/pBtCx4tw_Cancellation Request\n\n#XTIT\nLR_CHANGE_REQ=XCTP6+x+rppPysiuBA1Fxw_Change Request\n\n#XTIT\nLR_CHANGE_PENDING=AbRULfM1isL9G5ZPuSb8ag_Change Pending\n\n#XTIT\nLR_CANCEL_PENDING=f0wwrH6tit8tLaIEjZJR0Q_Cancellation Pending\n\n#XTIT\nLR_CHANGE_DONE=yCvOs+/k76PkWtaVZcZv9Q_Change Approved\n\n#XTIT\nLR_CANCEL_DONE=SDv1fQ8IN7iS5fEO+HrJdQ_Cancellation Approved\n\n#XTIT: Original\nLR_OLD_VERSION=IO1CECue7v2W1UqYUaNQhg_Original\n\n#XTIT: Leave Changes\nLR_NEW_VERSION=Nzr/lqFFmKfhnw3bItnpGA_Changed\n\n#XFLD: Label for Approver Selection\nLR_APPROVER=lNei4fpmsd8LF4texUjJUw_Approver\n\n#XFLD: Label for Attendance/Absence Hours\nLR_ABS_HOURS=meJk5GGJsjtIUihMLWZXzw_Att./Absence Hours\n\n#XFLD: Label for Attachments\nLR_ATTACHMENTS=6MItDAB0MsblUgUB4qWRQQ_Attachments\n\n#XFLD: Placeholder for Attachments\nLR_ATTACHMENT=FLHKnIbwjitL4VY4gCFC4A_Add attachment\n\n#XFLD: Label for Start Time\nLR_START_TIME=AKt12jxaszaihKZ8O+XC7w_Start Time\n\n#XFLD: Label for Start Time\nLR_END_TIME=dbh2pASAalGIrcfg1MtaiA_End Time\n\n#YMSG: Error message to display, if the file upload fails\nLR_ATTACHMENT_ERROR=D+5Ewv2Sap3qc7jyU1nl3Q_Cannot upload the attachment. \n\n#YMSG: warning message to show if the file type is not supported\nLR_ATTACHMENT_TYPECHECK=dWa39HmPW/j44TqQO7FfFw_This attachment type is not supported. \n\n#YMSG: Warning message to show if the file size exceeds 25MB- Mega Bytes\nLR_ATTACHMENT_SIZECHECK=Vjy2B4RWNJaUJiJjwUfXTQ_File size is too big. Please select a file less than 25MB.\n\n#XFLD: Select Personnel Assignment Label\nPERSONAL_ASSIGN=4xsuZveawb1UWb6Y1GgEIw_Choose a Personnel Assignment\n\n#XTIT: Select Personnel Assignment Title\nPERSONAL_ASSIGN_TITLE=/r/8zCu/+g0/ycSZghVIFg_Personnel Assignments\n\n#XFLD: Level for approver\nLR_LEVEL=dAspumqnAqd6nJq4Axv9lQ_Level {0}\n\n#YMSG: error message to display, if the maximum number of approvers reached\nLR_APPROVER_LEVEL_MAX=IWjeqMjLPM3uzXc+VlhuZg_Maximum number of approvers already added\n',
	"hcm/myleaverequest/i18n/i18n_es.properties":'\n#XTIT: Application name (shown in browser header bar or as browser tab title)\napp.Identity=Solicitud de ausencia\n\n#XTIT: title of the home view\nLR_TITLE_HOME_VIEW=Solicitud de ausencia\n\n#XTIT: title of the leave create view\nLR_TITLE_CREATE_VIEW=Solicitar ausencia\n\n#XTIT: title of the leave change view\nLR_TITLE_CHANGE_VIEW=Modificar solicitud de ausencia\n\n#XTIT: title of the Entitlements view\nLR_TITLE_BALANCE_VIEW=Derechos\n\n#XTIT: title of the leave History view\nLR_TITLE_HISTORY_VIEW=Historial\n\n#XTIT: title of the leave details view\nLR_TITLE_DETAILS_VIEW=Detalles de la ausencia\n\n#XTIT: title of the leave requests\nLR_TITLE_LEAVE_REQUESTS=Solicitudes de ausencia\n\n#XTIT: title of the leave request\nLR_TITLE_LEAVE_REQUEST=Solicitud de ausencia\n\n#XTIT: deductible\nLR_BALANCE_DEDUCTIBLE=Categor\\u00EDa\n\n#XTIT: Balance\nLR_BALANCE_BALANCE=Disponible\n\n#XTIT: Used\nLR_BALANCE_USED=Utilizados\n\n#XTIT: Requested\nLR_BALANCE_REQUESTED=Solicitados\n\n#XTIT: Quota\nLR_BALANCE_QUOTA=Derechos\n\n#XTIT: Entitlement\nLR_ENTITLEMENT_QUOTA=Derecho\n\n#XTIT: Send leave request\nLR_TITLE_SEND=Enviar solicitud de ausencia\n\n#XTIT: Cancel leave request\nLR_TITLE_WITHDRAW=Anular solicitud de ausencia\n\n#XTIT: ATTENTION Tile text line break after 12 characters!\nLR_BALANCE_TILE=Derechos\n\n#XTIT: ATTENTION Tile text line break after 12 characters!\nLR_HISTORY_TILE=Historial\n\n#XTIT: ATTENTION Tile text line break after 12 characters!\nLR_CREATE_LEAVE_TILE=Crear solicitud de ausencia\n\n#XBUT\nLR_SHOW_HIST=Historial\n\n#XBUT\nLR_CREATE_LEAVE=Solicitar ausencia\n\n#XBUT: text for "send leave request" button\nLR_SEND=Enviar\n\n#XBUT: text for ok button \nLR_OK=Aceptar\n\n#XBUT: text for reset button \nLR_RESET=Reinicializar\n\n#XBUT: text for cancel button e.g. on the day range picker screen\nLR_CANCEL=Cancelar\n\n#XBUT: text for change button on the Leave Overview details screen\nLR_CHANGE=Cambiar\n\n#XBUT: text for cancel button on the Leave Overview details screen\nLR_WITHDRAW=Anular\n\n#XSEL\nLR_UPDATED=Actualizado\n\n#XFLD\nLR_NOTE=Nota\n\n#XFLD\nLR_CUSTOM1=Campo personalizado 1\n\n#XFLD: used vacation, lower case for status under calendar. Reads "X days [line feed] used"\nLR_BOOKED=utilizados\n\n#XFLD: Available balance, lower case for status under calendar. Reads "X days [line feed] available"\nLR_REMAINING=disponibles\n\n#XFLD\nLR_LOWERCASE_DAYS=d\\u00EDas\n\n#XFLD\nLR_LOWERCASE_DAY=d\\u00EDa\n\n#XFLD\nLR_LOWERCASE_HOURS=Horas\n\n#XFLD\nLR_LOWERCASE_HOUR=Hora\n\n#XFLD\nLR_UP_TO=V\\u00E1lido hasta\n\n#XFLD\nLR_FROM=De\\:\n\n#XFLD\nLR_TO=A\n\n#XFLD\nLR_DEDUCTION=Deducci\\u00F3n\n\n#XFLD: Hyphen for Date Formatting\nLR_HYPHEN=-\n\n#XTIT: title of error dialog\nLR_PROBLEM=Ha ocurrido un problema\n\n#XTIT: title of confirmation dialog\nLR_CONFIRMATION=Confirmaci\\u00F3n\n\n#YMSG\nLR_CONFIRMATIONMSG=\\u00BFEnviar esta solicitud de ausencia a {0}?\n\n#YMSG\nLR_WITHDRAWNMSG=\\u00BFDesea anular esta solicitud de ausencia?\n\n#XFLD\nLR_DAYS=d\\u00EDas\n\n#XFLD\nLR_DAY=D\\u00EDa\n\n#XFLD\nLR_HOURS=Horas\n\n#XFLD\nLR_HOUR=Hora\n\n#XFLD\nLR_REQUEST=Solicitados\n\n#XSEL: day type (legend)\nLR_DTYPE_TODAY=Hoy\n\n#XSEL: day type (legend)\nLR_DTYPE_SELECTED=D\\u00EDa(s) seleccionado(s)\n\n#YMSG: processing\nLR_PROCESSING=Procesando...\n\n#YMSG\nLR_SUBMITDONE=Su solicitud de ausencia se ha enviado a {0}\n\n#YMSG\nLR_WITHDRAWDONE=Se ha anulado su solicitud de ausencia\n\n#YMSG\nLR_AX_MODEL_NOT_REG=Ha ocurrido un problema t\\u00E9cnico\\n\\nDetalles del error\\:\\nError interno; modelo no registrado\n\n#YMSG\nLR_AX_PARSE_ERR=Ha ocurrido un problema t\\u00E9cnico\\n\\nDetalles del error\\:\\nError de protocolo; no se ha podido analizar sint\\u00E1cticamente la respuesta HTTP\n\n#YMSG\nLR_DD_NO_APPROVER=Ha ocurrido un problema t\\u00E9cnico\\n\\nDetalles del error\\:\\nError de protocolo; falta el nombre del autorizador en la respuesta\n\n#YMSG\nLR_DD_NO_CFG=Ha ocurrido un problema t\\u00E9cnico\\n\\nDetalles del error\\:\\nError de protocolo; falta configuraci\\u00F3n en la respuesta\n\n#YMSG\nLR_DD_NO_BALANCES=Ha ocurrido un problema t\\u00E9cnico\\n\\nDetalles del error\\:\\nError de protocolo; faltan saldos en la respuesta\n\n#YMSG\nLR_DD_PARSE_ERR=Ha ocurrido un problema t\\u00E9cnico\\n\\nDetalles del error\\:\\nError de protocolo; no se ha podido analizar sint\\u00E1cticamente la respuesta \n\n#YMSG\nLR_DD_COMM_ERR=Ha ocurrido un problema con su conexi\\u00F3n\n\n#YMSG\nLR_DD_GENERIC_ERR=Se ha producido un error\n\n#YMSG\nLR_CT_PARSE_ERR=Ha ocurrido un problema t\\u00E9cnico\\n\\nDetalles del error\\:\\nError de protocolo; no se ha podido analizar sint\\u00E1cticamente la respuesta \n\n#XFLD\nLR_S1_PENDING=Pendiente\n\n#YMSG\nLR_UNKNOWN=Desconocido\n\n#XSEL: (legend)\nLR_NONWORKING=D\\u00EDa no laborable\n\n#XSEL: (legend)\nLR_APPROVELEAVE=Autorizado\n\n#XSEL: (legend)\nLR_REJECTEDLEAVE=Rechazadas\n\n#XSEL: (legend)\nLR_APPROVEPENDING=Aprobaci\\u00F3n pendiente\n\n#XSEL: (legend)\nLR_PUBLICHOLIDAY=D\\u00EDa festivo\n\n#XSEL: (legend)\nLR_WORKINGDAY=D\\u00EDa laborable\n\n#XSEL: (legend)\nLR_DELETIONREQUESTED=Cancelaci\\u00F3n solicitada\n\n#XTIT\nLR_DELETION_REQ=Solicitud de cancelaci\\u00F3n\n\n#XTIT\nLR_CHANGE_REQ=Solicitud de modificaci\\u00F3n\n\n#XTIT\nLR_CHANGE_PENDING=Modificaci\\u00F3n pendiente\n\n#XTIT\nLR_CANCEL_PENDING=Cancelaci\\u00F3n pendiente\n\n#XTIT\nLR_CHANGE_DONE=Modificaci\\u00F3n aprobada\n\n#XTIT\nLR_CANCEL_DONE=Cancelaci\\u00F3n aprobada\n\n#XTIT: Original\nLR_OLD_VERSION=Original\n\n#XTIT: Leave Changes\nLR_NEW_VERSION=Modificados\n\n#XFLD: Label for Approver Selection\nLR_APPROVER=Autorizador\n\n#XFLD: Label for Attendance/Absence Hours\nLR_ABS_HOURS=Horas de ausencia/presencia\n\n#XFLD: Label for Attachments\nLR_ATTACHMENTS=Anexos\n\n#XFLD: Placeholder for Attachments\nLR_ATTACHMENT=A\\u00F1adir anexo\n\n#XFLD: Label for Start Time\nLR_START_TIME=Hora de inicio\n\n#XFLD: Label for Start Time\nLR_END_TIME=Hora de fin\n\n#YMSG: Error message to display, if the file upload fails\nLR_ATTACHMENT_ERROR=No se ha podido cargar el anexo\n\n#YMSG: warning message to show if the file type is not supported\nLR_ATTACHMENT_TYPECHECK=Este tipo de anexo no est\\u00E1 soportado\n\n#YMSG: Warning message to show if the file size exceeds 25MB- Mega Bytes\nLR_ATTACHMENT_SIZECHECK=El tama\\u00F1o del fichero es demasiado grande. Seleccione un fichero con un tama\\u00F1o inferior a 25MB.\n\n#XFLD: Select Personnel Assignment Label\nPERSONAL_ASSIGN=Seleccione un contrato de ocupaci\\u00F3n\n\n#XTIT: Select Personnel Assignment Title\nPERSONAL_ASSIGN_TITLE=Contratos de ocupaci\\u00F3n\n\n#XFLD: Level for approver\nLR_LEVEL=Nivel {0}\n\n#YMSG: error message to display, if the maximum number of approvers reached\nLR_APPROVER_LEVEL_MAX=Ya ha introducido el n\\u00FAmero m\\u00E1ximo de autorizadores\n',
	"hcm/myleaverequest/i18n/i18n_fr.properties":'\n#XTIT: Application name (shown in browser header bar or as browser tab title)\napp.Identity=Mes demandes de cong\\u00E9\n\n#XTIT: title of the home view\nLR_TITLE_HOME_VIEW=Mes demandes de cong\\u00E9\n\n#XTIT: title of the leave create view\nLR_TITLE_CREATE_VIEW=Demande de cong\\u00E9\n\n#XTIT: title of the leave change view\nLR_TITLE_CHANGE_VIEW=Modification de demande de cong\\u00E9\n\n#XTIT: title of the Entitlements view\nLR_TITLE_BALANCE_VIEW=Droits\n\n#XTIT: title of the leave History view\nLR_TITLE_HISTORY_VIEW=Historique\n\n#XTIT: title of the leave details view\nLR_TITLE_DETAILS_VIEW=D\\u00E9tails du cong\\u00E9\n\n#XTIT: title of the leave requests\nLR_TITLE_LEAVE_REQUESTS=Demandes de cong\\u00E9s\n\n#XTIT: title of the leave request\nLR_TITLE_LEAVE_REQUEST=Demande de cong\\u00E9\n\n#XTIT: deductible\nLR_BALANCE_DEDUCTIBLE=Cat\\u00E9gorie\n\n#XTIT: Balance\nLR_BALANCE_BALANCE=Disponible(s)\n\n#XTIT: Used\nLR_BALANCE_USED=Utilis\\u00E9(s)\n\n#XTIT: Requested\nLR_BALANCE_REQUESTED=Demand\\u00E9\n\n#XTIT: Quota\nLR_BALANCE_QUOTA=Droits\n\n#XTIT: Entitlement\nLR_ENTITLEMENT_QUOTA=Droit\n\n#XTIT: Send leave request\nLR_TITLE_SEND=Envoi de demande de cong\\u00E9\n\n#XTIT: Cancel leave request\nLR_TITLE_WITHDRAW=Retrait de demande de cong\\u00E9\n\n#XTIT: ATTENTION Tile text line break after 12 characters!\nLR_BALANCE_TILE=Droits\n\n#XTIT: ATTENTION Tile text line break after 12 characters!\nLR_HISTORY_TILE=Historique\n\n#XTIT: ATTENTION Tile text line break after 12 characters!\nLR_CREATE_LEAVE_TILE=Cr\\u00E9ation de demande de cong\\u00E9\n\n#XBUT\nLR_SHOW_HIST=Historique\n\n#XBUT\nLR_CREATE_LEAVE=Demander cong\\u00E9\n\n#XBUT: text for "send leave request" button\nLR_SEND=Envoyer\n\n#XBUT: text for ok button \nLR_OK=OK\n\n#XBUT: text for reset button \nLR_RESET=R\\u00E9initialiser\n\n#XBUT: text for cancel button e.g. on the day range picker screen\nLR_CANCEL=Annuler\n\n#XBUT: text for change button on the Leave Overview details screen\nLR_CHANGE=Modifier\n\n#XBUT: text for cancel button on the Leave Overview details screen\nLR_WITHDRAW=Retirer\n\n#XSEL\nLR_UPDATED=Mise \\u00E0 jour effectu\\u00E9e\n\n#XFLD\nLR_NOTE=Note\n\n#XFLD\nLR_CUSTOM1=Zone personnalisable 1\n\n#XFLD: used vacation, lower case for status under calendar. Reads "X days [line feed] used"\nLR_BOOKED=utilis\\u00E9(s)\n\n#XFLD: Available balance, lower case for status under calendar. Reads "X days [line feed] available"\nLR_REMAINING=disponible(s)\n\n#XFLD\nLR_LOWERCASE_DAYS=jours\n\n#XFLD\nLR_LOWERCASE_DAY=jour\n\n#XFLD\nLR_LOWERCASE_HOURS=heures\n\n#XFLD\nLR_LOWERCASE_HOUR=heure\n\n#XFLD\nLR_UP_TO=Fin de validit\\u00E9\n\n#XFLD\nLR_FROM=Du\n\n#XFLD\nLR_TO=Au\n\n#XFLD\nLR_DEDUCTION=D\\u00E9compte\n\n#XFLD: Hyphen for Date Formatting\nLR_HYPHEN=-\n\n#XTIT: title of error dialog\nLR_PROBLEM=Un probl\\u00E8me s\'est produit.\n\n#XTIT: title of confirmation dialog\nLR_CONFIRMATION=Confirmation\n\n#YMSG\nLR_CONFIRMATIONMSG=Envoyer cette demande de cong\\u00E9 \\u00E0 {0}\\u00A0?\n\n#YMSG\nLR_WITHDRAWNMSG=Souhaitez-vous retirer cette demande de cong\\u00E9 ?\n\n#XFLD\nLR_DAYS=Jours\n\n#XFLD\nLR_DAY=Jour\n\n#XFLD\nLR_HOURS=Heures\n\n#XFLD\nLR_HOUR=Heure\n\n#XFLD\nLR_REQUEST=Demand\\u00E9\n\n#XSEL: day type (legend)\nLR_DTYPE_TODAY=Aujourd\'hui\n\n#XSEL: day type (legend)\nLR_DTYPE_SELECTED=Jour(s) s\\u00E9lectionn\\u00E9(s)\n\n#YMSG: processing\nLR_PROCESSING=En cours de traitement...\n\n#YMSG\nLR_SUBMITDONE=Votre demande de cong\\u00E9 a \\u00E9t\\u00E9 envoy\\u00E9e \\u00E0 {0}.\n\n#YMSG\nLR_WITHDRAWDONE=Votre demande de cong\\u00E9 a \\u00E9t\\u00E9 retir\\u00E9e.\n\n#YMSG\nLR_AX_MODEL_NOT_REG=Un probl\\u00E8me technique est survenu.\\n\\nD\\u00E9tails de l\'erreur\\u00A0\\:\\nerreur interne, mod\\u00E8le non enregistr\\u00E9.\n\n#YMSG\nLR_AX_PARSE_ERR=Un probl\\u00E8me technique est survenu.\\n\\nD\\u00E9tails de l\'erreur\\u00A0\\:\\nerreur de protocole, impossible d\'analyser la r\\u00E9ponse HTTP.\n\n#YMSG\nLR_DD_NO_APPROVER=Un probl\\u00E8me technique est survenu.\\n\\nD\\u00E9tails de l\'erreur\\u00A0\\:\\nerreur de protocole, le nom de l\'approbateur ne figure pas dans la r\\u00E9ponse.\n\n#YMSG\nLR_DD_NO_CFG=Un probl\\u00E8me technique est survenu.\\n\\nD\\u00E9tails de l\'erreur\\u00A0\\:\\nerreur de protocole, la configuration ne figure pas dans la r\\u00E9ponse.\n\n#YMSG\nLR_DD_NO_BALANCES=Un probl\\u00E8me technique est survenu.\\n\\nD\\u00E9tails de l\'erreur\\u00A0\\:\\nerreur de protocole, les soldes ne figurent pas dans la r\\u00E9ponse.\n\n#YMSG\nLR_DD_PARSE_ERR=Un probl\\u00E8me technique est survenu.\\n\\nD\\u00E9tails de l\'erreur\\u00A0\\:\\nerreur de protocole, impossible d\'analyser la r\\u00E9ponse.\n\n#YMSG\nLR_DD_COMM_ERR=Un probl\\u00E8me de connexion s\'est produit.\n\n#YMSG\nLR_DD_GENERIC_ERR=Une erreur s\'est produite.\n\n#YMSG\nLR_CT_PARSE_ERR=Un probl\\u00E8me technique est survenu.\\n\\nD\\u00E9tails de l\'erreur\\u00A0\\:\\nerreur de protocole, impossible d\'analyser la r\\u00E9ponse.\n\n#XFLD\nLR_S1_PENDING=En attente\n\n#YMSG\nLR_UNKNOWN=Inconnu\n\n#XSEL: (legend)\nLR_NONWORKING=Jour ch\\u00F4m\\u00E9\n\n#XSEL: (legend)\nLR_APPROVELEAVE=Approuv\\u00E9\n\n#XSEL: (legend)\nLR_REJECTEDLEAVE=Refus\\u00E9\n\n#XSEL: (legend)\nLR_APPROVEPENDING=Approbation en attente\n\n#XSEL: (legend)\nLR_PUBLICHOLIDAY=Jour f\\u00E9ri\\u00E9\n\n#XSEL: (legend)\nLR_WORKINGDAY=Jour ouvr\\u00E9\n\n#XSEL: (legend)\nLR_DELETIONREQUESTED=Annulation demand\\u00E9e\n\n#XTIT\nLR_DELETION_REQ=Demande d\'annulation\n\n#XTIT\nLR_CHANGE_REQ=Demande de modification\n\n#XTIT\nLR_CHANGE_PENDING=Modification en attente\n\n#XTIT\nLR_CANCEL_PENDING=Annulation en attente\n\n#XTIT\nLR_CHANGE_DONE=Modification approuv\\u00E9e\n\n#XTIT\nLR_CANCEL_DONE=Annulation approuv\\u00E9e\n\n#XTIT: Original\nLR_OLD_VERSION=Original\n\n#XTIT: Leave Changes\nLR_NEW_VERSION=Modifi\\u00E9\n\n#XFLD: Label for Approver Selection\nLR_APPROVER=Approbateur\n\n#XFLD: Label for Attendance/Absence Hours\nLR_ABS_HOURS=Heures de pr\\u00E9sence/d\'absence\n\n#XFLD: Label for Attachments\nLR_ATTACHMENTS=Pi\\u00E8ces jointes\n\n#XFLD: Placeholder for Attachments\nLR_ATTACHMENT=Ajouter une pi\\u00E8ce jointe\n\n#XFLD: Label for Start Time\nLR_START_TIME=Heure de d\\u00E9but\n\n#XFLD: Label for Start Time\nLR_END_TIME=Heure de fin\n\n#YMSG: Error message to display, if the file upload fails\nLR_ATTACHMENT_ERROR=Impossible de t\\u00E9l\\u00E9charger la pi\\u00E8ce jointe\n\n#YMSG: warning message to show if the file type is not supported\nLR_ATTACHMENT_TYPECHECK=Ce type de pi\\u00E8ce jointe n\'est pas pris en charge.\n\n#YMSG: Warning message to show if the file size exceeds 25MB- Mega Bytes\nLR_ATTACHMENT_SIZECHECK=Taille du fichier trop importante. S\\u00E9lectionnez un fichier dont la taille est inf\\u00E9rieure \\u00E0 25 Mo.\n\n#XFLD: Select Personnel Assignment Label\nPERSONAL_ASSIGN=S\\u00E9lectionner un contrat de travail\n\n#XTIT: Select Personnel Assignment Title\nPERSONAL_ASSIGN_TITLE=Contrats de travail\n\n#XFLD: Level for approver\nLR_LEVEL=Niveau {0}\n\n#YMSG: error message to display, if the maximum number of approvers reached\nLR_APPROVER_LEVEL_MAX=Vous avez d\\u00E9j\\u00E0 saisi le nombre maximal d\'approbateurs.\n',
	"hcm/myleaverequest/i18n/i18n_hr.properties":'\n#XTIT: Application name (shown in browser header bar or as browser tab title)\napp.Identity=Moji zahtjevi za dopust\n\n#XTIT: title of the home view\nLR_TITLE_HOME_VIEW=Moji zahtjevi za dopust\n\n#XTIT: title of the leave create view\nLR_TITLE_CREATE_VIEW=Zatra\\u017Ei dopust\n\n#XTIT: title of the leave change view\nLR_TITLE_CHANGE_VIEW=Promijeni zahtjev za dopust\n\n#XTIT: title of the Entitlements view\nLR_TITLE_BALANCE_VIEW=Prava\n\n#XTIT: title of the leave History view\nLR_TITLE_HISTORY_VIEW=Povijest\n\n#XTIT: title of the leave details view\nLR_TITLE_DETAILS_VIEW=Detalji dopusta\n\n#XTIT: title of the leave requests\nLR_TITLE_LEAVE_REQUESTS=Zahtjevi za dopust\n\n#XTIT: title of the leave request\nLR_TITLE_LEAVE_REQUEST=Zahtjev za dopust\n\n#XTIT: deductible\nLR_BALANCE_DEDUCTIBLE=Kategorija\n\n#XTIT: Balance\nLR_BALANCE_BALANCE=Raspolo\\u017Eivo\n\n#XTIT: Used\nLR_BALANCE_USED=Kori\\u0161teno\n\n#XTIT: Requested\nLR_BALANCE_REQUESTED=Zatra\\u017Eeno\n\n#XTIT: Quota\nLR_BALANCE_QUOTA=Prava\n\n#XTIT: Entitlement\nLR_ENTITLEMENT_QUOTA=Pravo\n\n#XTIT: Send leave request\nLR_TITLE_SEND=Po\\u0161alji zahtjev za dopust\n\n#XTIT: Cancel leave request\nLR_TITLE_WITHDRAW=Povuci zahtjev za dopust\n\n#XTIT: ATTENTION Tile text line break after 12 characters!\nLR_BALANCE_TILE=Prava\n\n#XTIT: ATTENTION Tile text line break after 12 characters!\nLR_HISTORY_TILE=Povijest\n\n#XTIT: ATTENTION Tile text line break after 12 characters!\nLR_CREATE_LEAVE_TILE=Kreiraj zahtjev za dopust\n\n#XBUT\nLR_SHOW_HIST=Povijest\n\n#XBUT\nLR_CREATE_LEAVE=Zatra\\u017Ei dopust\n\n#XBUT: text for "send leave request" button\nLR_SEND=Po\\u0161alji\n\n#XBUT: text for ok button \nLR_OK=OK\n\n#XBUT: text for reset button \nLR_RESET=Ponovno postavi\n\n#XBUT: text for cancel button e.g. on the day range picker screen\nLR_CANCEL=Otka\\u017Ei\n\n#XBUT: text for change button on the Leave Overview details screen\nLR_CHANGE=Promijeni\n\n#XBUT: text for cancel button on the Leave Overview details screen\nLR_WITHDRAW=Povuci\n\n#XSEL\nLR_UPDATED=A\\u017Eurirano\n\n#XFLD\nLR_NOTE=Bilje\\u0161ka\n\n#XFLD\nLR_CUSTOM1=Korisni\\u010Dki definirano polje 1\n\n#XFLD: used vacation, lower case for status under calendar. Reads "X days [line feed] used"\nLR_BOOKED=kori\\u0161teno\n\n#XFLD: Available balance, lower case for status under calendar. Reads "X days [line feed] available"\nLR_REMAINING=raspolo\\u017Eivo\n\n#XFLD\nLR_LOWERCASE_DAYS=dana\n\n#XFLD\nLR_LOWERCASE_DAY=dan\n\n#XFLD\nLR_LOWERCASE_HOURS=sati\n\n#XFLD\nLR_LOWERCASE_HOUR=sat\n\n#XFLD\nLR_UP_TO=Vrijedi do\n\n#XFLD\nLR_FROM=Od\n\n#XFLD\nLR_TO=Do\n\n#XFLD\nLR_DEDUCTION=Odbitak\n\n#XFLD: Hyphen for Date Formatting\nLR_HYPHEN=-\n\n#XTIT: title of error dialog\nLR_PROBLEM=Pojavio se problem\n\n#XTIT: title of confirmation dialog\nLR_CONFIRMATION=Potvrda\n\n#YMSG\nLR_CONFIRMATIONMSG=Poslati ovaj zahtjev za dopust {0}?\n\n#YMSG\nLR_WITHDRAWNMSG=\\u017Delite li povu\\u0107i ovaj zahtjev za dopust?\n\n#XFLD\nLR_DAYS=dana\n\n#XFLD\nLR_DAY=Dan\n\n#XFLD\nLR_HOURS=Sati\n\n#XFLD\nLR_HOUR=Sat\n\n#XFLD\nLR_REQUEST=Zatra\\u017Eeno\n\n#XSEL: day type (legend)\nLR_DTYPE_TODAY=Danas\n\n#XSEL: day type (legend)\nLR_DTYPE_SELECTED=Odabrani dani\n\n#YMSG: processing\nLR_PROCESSING=Obrada...\n\n#YMSG\nLR_SUBMITDONE=Va\\u0161 je zahtjev za dopust poslan {0}\n\n#YMSG\nLR_WITHDRAWDONE=Va\\u0161 zahtjev za dopust povu\\u010Den je\n\n#YMSG\nLR_AX_MODEL_NOT_REG=Pojavio se tehni\\u010Dki problem\\n\\nDetalji gre\\u0161ke\\:\\nInterna gre\\u0161ka; model nije registriran\n\n#YMSG\nLR_AX_PARSE_ERR=Pojavio se tehni\\u010Dki problem\\n\\nDetalji gre\\u0161ke\\:\\nGre\\u0161ka protokola; nije bilo mogu\\u0107e parsirati HTTP odgovor\n\n#YMSG\nLR_DD_NO_APPROVER=Pojavio se tehni\\u010Dki problem\\n\\nDetalji gre\\u0161ke\\:\\nGre\\u0161ka protokola; u odgovoru nedostaje ime odobravatelja\n\n#YMSG\nLR_DD_NO_CFG=Pojavio se tehni\\u010Dki problem\\n\\nDetalji gre\\u0161ke\\:\\nGre\\u0161ka protokola; u odgovoru nedostaje konfiguracija\n\n#YMSG\nLR_DD_NO_BALANCES=Pojavio se tehni\\u010Dki problem\\n\\nDetalji gre\\u0161ke\\:\\nGre\\u0161ka protokola; u odgovoru nedostaju stanja\n\n#YMSG\nLR_DD_PARSE_ERR=Pojavio se tehni\\u010Dki problem\\n\\nDetalji gre\\u0161ke\\:\\nGre\\u0161ka protokola; nije bilo mogu\\u0107e parsirati odgovor\n\n#YMSG\nLR_DD_COMM_ERR=Pojavio se problem s va\\u0161om vezom\n\n#YMSG\nLR_DD_GENERIC_ERR=Pojavila se gre\\u0161ka\n\n#YMSG\nLR_CT_PARSE_ERR=Pojavio se tehni\\u010Dki problem\\n\\nDetalji gre\\u0161ke\\:\\nGre\\u0161ka protokola; nije bilo mogu\\u0107e parsirati odgovor\n\n#XFLD\nLR_S1_PENDING=Na \\u010Dekanju\n\n#YMSG\nLR_UNKNOWN=Nepoznato\n\n#XSEL: (legend)\nLR_NONWORKING=Neradni dan\n\n#XSEL: (legend)\nLR_APPROVELEAVE=Odobreno\n\n#XSEL: (legend)\nLR_REJECTEDLEAVE=Odbijeno\n\n#XSEL: (legend)\nLR_APPROVEPENDING=Odobrenje na \\u010Dekanju\n\n#XSEL: (legend)\nLR_PUBLICHOLIDAY=Dr\\u017Eavni praznik\n\n#XSEL: (legend)\nLR_WORKINGDAY=Radni dan\n\n#XSEL: (legend)\nLR_DELETIONREQUESTED=Otkazivanje zatra\\u017Eeno\n\n#XTIT\nLR_DELETION_REQ=Nalog za storniranje\n\n#XTIT\nLR_CHANGE_REQ=Zahtjev za promjenu\n\n#XTIT\nLR_CHANGE_PENDING=Promjena na \\u010Dekanju\n\n#XTIT\nLR_CANCEL_PENDING=Otkazivanje na \\u010Dekanju\n\n#XTIT\nLR_CHANGE_DONE=Promjena odobrena\n\n#XTIT\nLR_CANCEL_DONE=Otkazivanje odobreno\n\n#XTIT: Original\nLR_OLD_VERSION=Original\n\n#XTIT: Leave Changes\nLR_NEW_VERSION=Promijenjeno\n\n#XFLD: Label for Approver Selection\nLR_APPROVER=Odobravatelj\n\n#XFLD: Label for Attendance/Absence Hours\nLR_ABS_HOURS=Sati prisutnosti/odsutnosti\n\n#XFLD: Label for Attachments\nLR_ATTACHMENTS=Prilozi\n\n#XFLD: Placeholder for Attachments\nLR_ATTACHMENT=Dodaj prilog\n\n#XFLD: Label for Start Time\nLR_START_TIME=Po\\u010Detno vrijeme\n\n#XFLD: Label for Start Time\nLR_END_TIME=Zavr\\u0161no vrijeme\n\n#YMSG: Error message to display, if the file upload fails\nLR_ATTACHMENT_ERROR=Nije bilo mogu\\u0107e prenijeti prilog na poslu\\u017Eitelj\n\n#YMSG: warning message to show if the file type is not supported\nLR_ATTACHMENT_TYPECHECK=Ovaj tip priloga nije podr\\u017Ean\n\n#YMSG: Warning message to show if the file size exceeds 25MB- Mega Bytes\nLR_ATTACHMENT_SIZECHECK=Veli\\u010Dina datoteke prevelika. Molimo, odaberite datoteku manju od 25 MB.\n\n#XFLD: Select Personnel Assignment Label\nPERSONAL_ASSIGN=Izaberite ugovor o radu\n\n#XTIT: Select Personnel Assignment Title\nPERSONAL_ASSIGN_TITLE=Ugovori o radu\n\n#XFLD: Level for approver\nLR_LEVEL=Razina {0}\n\n#YMSG: error message to display, if the maximum number of approvers reached\nLR_APPROVER_LEVEL_MAX=Ve\\u0107 ste unijeli maksimalni broj odobravatelja.\n',
	"hcm/myleaverequest/i18n/i18n_hu.properties":'\n#XTIT: Application name (shown in browser header bar or as browser tab title)\napp.Identity=Saj\\u00E1t t\\u00E1voll\\u00E9tk\\u00E9relmek\n\n#XTIT: title of the home view\nLR_TITLE_HOME_VIEW=Saj\\u00E1t t\\u00E1voll\\u00E9tk\\u00E9relmek\n\n#XTIT: title of the leave create view\nLR_TITLE_CREATE_VIEW=T\\u00E1voll\\u00E9t k\\u00E9r\\u00E9se\n\n#XTIT: title of the leave change view\nLR_TITLE_CHANGE_VIEW=T\\u00E1voll\\u00E9tk\\u00E9relem m\\u00F3dos\\u00EDt\\u00E1sa\n\n#XTIT: title of the Entitlements view\nLR_TITLE_BALANCE_VIEW=Ig\\u00E9nyek\n\n#XTIT: title of the leave History view\nLR_TITLE_HISTORY_VIEW=T\\u00F6rt\\u00E9net\n\n#XTIT: title of the leave details view\nLR_TITLE_DETAILS_VIEW=T\\u00E1voll\\u00E9t r\\u00E9szletei\n\n#XTIT: title of the leave requests\nLR_TITLE_LEAVE_REQUESTS=T\\u00E1voll\\u00E9tk\\u00E9relmek\n\n#XTIT: title of the leave request\nLR_TITLE_LEAVE_REQUEST=T\\u00E1voll\\u00E9tk\\u00E9relem\n\n#XTIT: deductible\nLR_BALANCE_DEDUCTIBLE=Kateg\\u00F3ria\n\n#XTIT: Balance\nLR_BALANCE_BALANCE=Rendelkez\\u00E9sre \\u00E1ll\n\n#XTIT: Used\nLR_BALANCE_USED=Felhaszn\\u00E1lt\n\n#XTIT: Requested\nLR_BALANCE_REQUESTED=Ig\\u00E9nyelt\n\n#XTIT: Quota\nLR_BALANCE_QUOTA=Ig\\u00E9nyek\n\n#XTIT: Entitlement\nLR_ENTITLEMENT_QUOTA=Ig\\u00E9ny\n\n#XTIT: Send leave request\nLR_TITLE_SEND=T\\u00E1voll\\u00E9tk\\u00E9relem k\\u00FCld\\u00E9se\n\n#XTIT: Cancel leave request\nLR_TITLE_WITHDRAW=T\\u00E1voll\\u00E9tk\\u00E9relem visszavon\\u00E1sa\n\n#XTIT: ATTENTION Tile text line break after 12 characters!\nLR_BALANCE_TILE=Ig\\u00E9nyek\n\n#XTIT: ATTENTION Tile text line break after 12 characters!\nLR_HISTORY_TILE=T\\u00F6rt\\u00E9net\n\n#XTIT: ATTENTION Tile text line break after 12 characters!\nLR_CREATE_LEAVE_TILE=T\\u00E1voll\\u00E9tk\\u00E9relem l\\u00E9trehoz\\u00E1sa\n\n#XBUT\nLR_SHOW_HIST=T\\u00F6rt\\u00E9net\n\n#XBUT\nLR_CREATE_LEAVE=T\\u00E1voll\\u00E9t k\\u00E9r\\u00E9se\n\n#XBUT: text for "send leave request" button\nLR_SEND=K\\u00FCld\\u00E9s\n\n#XBUT: text for ok button \nLR_OK=Rendben\n\n#XBUT: text for reset button \nLR_RESET=Vissza\\u00E1ll\\u00EDt\\u00E1s\n\n#XBUT: text for cancel button e.g. on the day range picker screen\nLR_CANCEL=M\\u00E9gse\n\n#XBUT: text for change button on the Leave Overview details screen\nLR_CHANGE=M\\u00F3dos\\u00EDt\\u00E1s\n\n#XBUT: text for cancel button on the Leave Overview details screen\nLR_WITHDRAW=Visszavon\\u00E1s\n\n#XSEL\nLR_UPDATED=Aktualiz\\u00E1lva\n\n#XFLD\nLR_NOTE=Megjegyz\\u00E9s\n\n#XFLD\nLR_CUSTOM1=1. egy\\u00E9ni mez\\u0151\n\n#XFLD: used vacation, lower case for status under calendar. Reads "X days [line feed] used"\nLR_BOOKED=felhaszn\\u00E1lva\n\n#XFLD: Available balance, lower case for status under calendar. Reads "X days [line feed] available"\nLR_REMAINING=\\u00E1ll rendelkez\\u00E9sre\n\n#XFLD\nLR_LOWERCASE_DAYS=nap\n\n#XFLD\nLR_LOWERCASE_DAY=nap\n\n#XFLD\nLR_LOWERCASE_HOURS=\\u00F3ra\n\n#XFLD\nLR_LOWERCASE_HOUR=\\u00F3ra\n\n#XFLD\nLR_UP_TO=\\u00C9rv\\u00E9nyes eddig\\:\n\n#XFLD\nLR_FROM=Kezdete\\:\n\n#XFLD\nLR_TO=V\\u00E9ge\\:\n\n#XFLD\nLR_DEDUCTION=Levon\\u00E1s\n\n#XFLD: Hyphen for Date Formatting\nLR_HYPHEN=-\n\n#XTIT: title of error dialog\nLR_PROBLEM=Hiba t\\u00F6rt\\u00E9nt\n\n#XTIT: title of confirmation dialog\nLR_CONFIRMATION=Visszaigazol\\u00E1s\n\n#YMSG\nLR_CONFIRMATIONMSG=Elk\\u00FCldi ezt a t\\u00E1voll\\u00E9tk\\u00E9relmet a k\\u00F6vetkez\\u0151nek\\: {0}?\n\n#YMSG\nLR_WITHDRAWNMSG=Visszavonja ezt a t\\u00E1voll\\u00E9tk\\u00E9relmet?\n\n#XFLD\nLR_DAYS=nap\n\n#XFLD\nLR_DAY=Nap\n\n#XFLD\nLR_HOURS=\\u00F3ra\n\n#XFLD\nLR_HOUR=\\u00D3ra\n\n#XFLD\nLR_REQUEST=Ig\\u00E9nyelt\n\n#XSEL: day type (legend)\nLR_DTYPE_TODAY=Ma\n\n#XSEL: day type (legend)\nLR_DTYPE_SELECTED=Kiv\\u00E1lasztott napok\n\n#YMSG: processing\nLR_PROCESSING=Feldolgoz\\u00E1s...\n\n#YMSG\nLR_SUBMITDONE=T\\u00E1voll\\u00E9tk\\u00E9relme el lett k\\u00FCldve\\: {0}\n\n#YMSG\nLR_WITHDRAWDONE=T\\u00E1voll\\u00E9tk\\u00E9relme visszavonva\n\n#YMSG\nLR_AX_MODEL_NOT_REG=M\\u0171szaki hiba t\\u00F6rt\\u00E9nt\\n\\nHiba r\\u00E9szletei\\:\\nBels\\u0151 hiba; a modell nincs regisztr\\u00E1lva\n\n#YMSG\nLR_AX_PARSE_ERR=M\\u0171szaki hiba t\\u00F6rt\\u00E9nt\\n\\nHiba r\\u00E9szletei\\:\\nProtokollhiba; nem siker\\u00FClt a HTTP-v\\u00E1lasz elemz\\u00E9se\n\n#YMSG\nLR_DD_NO_APPROVER=M\\u0171szaki hiba t\\u00F6rt\\u00E9nt\\n\\nHiba r\\u00E9szletei\\:\\nProtokollhiba; a v\\u00E1lasz nem tartalmazza az enged\\u00E9lyez\\u0151 nev\\u00E9t\n\n#YMSG\nLR_DD_NO_CFG=M\\u0171szaki hiba t\\u00F6rt\\u00E9nt\\n\\nHiba r\\u00E9szletei\\:\\nProtokollhiba; a v\\u00E1lasz nem tartalmazza a konfigur\\u00E1ci\\u00F3t\n\n#YMSG\nLR_DD_NO_BALANCES=M\\u0171szaki hiba t\\u00F6rt\\u00E9nt\\n\\nHiba r\\u00E9szletei\\:\\nProtokollhiba; a v\\u00E1lasz nem tartalmazza az egyenlegeket\n\n#YMSG\nLR_DD_PARSE_ERR=M\\u0171szaki hiba t\\u00F6rt\\u00E9nt\\n\\nHiba r\\u00E9szletei\\:\\nProtokollhiba; nem siker\\u00FClt a v\\u00E1lasz elemz\\u00E9se\n\n#YMSG\nLR_DD_COMM_ERR=Probl\\u00E9ma volt a kapcsolattal\n\n#YMSG\nLR_DD_GENERIC_ERR=Hiba t\\u00F6rt\\u00E9nt\n\n#YMSG\nLR_CT_PARSE_ERR=M\\u0171szaki hiba t\\u00F6rt\\u00E9nt\\n\\nHiba r\\u00E9szletei\\:\\nProtokollhiba; nem siker\\u00FClt a v\\u00E1lasz elemz\\u00E9se\n\n#XFLD\nLR_S1_PENDING=F\\u00FCgg\\u0151ben\n\n#YMSG\nLR_UNKNOWN=Ismeretlen\n\n#XSEL: (legend)\nLR_NONWORKING=Nem munkanap\n\n#XSEL: (legend)\nLR_APPROVELEAVE=J\\u00F3v\\u00E1hagyva\n\n#XSEL: (legend)\nLR_REJECTEDLEAVE=Elutas\\u00EDtva\n\n#XSEL: (legend)\nLR_APPROVEPENDING=J\\u00F3v\\u00E1hagy\\u00E1s f\\u00FCgg\\u0151ben\n\n#XSEL: (legend)\nLR_PUBLICHOLIDAY=\\u00DCnnepnap\n\n#XSEL: (legend)\nLR_WORKINGDAY=Munkanap\n\n#XSEL: (legend)\nLR_DELETIONREQUESTED=Visszavon\\u00E1st k\\u00E9rt\n\n#XTIT\nLR_DELETION_REQ=Visszavon\\u00E1si k\\u00E9relem\n\n#XTIT\nLR_CHANGE_REQ=K\\u00E9relem m\\u00F3dos\\u00EDt\\u00E1sa\n\n#XTIT\nLR_CHANGE_PENDING=M\\u00F3dos\\u00EDt\\u00E1s f\\u00FCgg\\u0151ben\n\n#XTIT\nLR_CANCEL_PENDING=Visszavon\\u00E1s f\\u00FCgg\\u0151ben\n\n#XTIT\nLR_CHANGE_DONE=M\\u00F3dos\\u00EDt\\u00E1s enged\\u00E9lyezve\n\n#XTIT\nLR_CANCEL_DONE=Visszavon\\u00E1s enged\\u00E9lyezve\n\n#XTIT: Original\nLR_OLD_VERSION=Eredeti\n\n#XTIT: Leave Changes\nLR_NEW_VERSION=M\\u00F3dos\\u00EDtva\n\n#XFLD: Label for Approver Selection\nLR_APPROVER=Enged\\u00E9lyez\\u0151\n\n#XFLD: Label for Attendance/Absence Hours\nLR_ABS_HOURS=Jelenl\\u00E9t/t\\u00E1voll\\u00E9t \\u00F3r\\u00E1kban\n\n#XFLD: Label for Attachments\nLR_ATTACHMENTS=Mell\\u00E9kletek\n\n#XFLD: Placeholder for Attachments\nLR_ATTACHMENT=Mell\\u00E9klet hozz\\u00E1ad\\u00E1sa\n\n#XFLD: Label for Start Time\nLR_START_TIME=Kezd\\u00E9s id\\u0151pontja\n\n#XFLD: Label for Start Time\nLR_END_TIME=Befejez\\u00E9s id\\u0151pontja\n\n#YMSG: Error message to display, if the file upload fails\nLR_ATTACHMENT_ERROR=Nem lehetett felt\\u00F6lteni a mell\\u00E9kletet\n\n#YMSG: warning message to show if the file type is not supported\nLR_ATTACHMENT_TYPECHECK=Ezt a fajta mell\\u00E9kletet nem t\\u00E1mogatja a rendszer\n\n#YMSG: Warning message to show if the file size exceeds 25MB- Mega Bytes\nLR_ATTACHMENT_SIZECHECK=A f\\u00E1jl t\\u00FAl nagy. K\\u00E9rem, olyan f\\u00E1jlt v\\u00E1lasszon, melynek m\\u00E9rete nem haladja meg a 25MB-ot.\n\n#XFLD: Select Personnel Assignment Label\nPERSONAL_ASSIGN=Foglalkoztat\\u00E1si szerz\\u0151d\\u00E9s v\\u00E1laszt\\u00E1sa\n\n#XTIT: Select Personnel Assignment Title\nPERSONAL_ASSIGN_TITLE=Foglalkoztat\\u00E1si szerz\\u0151d\\u00E9sek\n\n#XFLD: Level for approver\nLR_LEVEL=Szint {0}\n\n#YMSG: error message to display, if the maximum number of approvers reached\nLR_APPROVER_LEVEL_MAX=M\\u00E1r megadta a maxim\\u00E1lis sz\\u00E1m\\u00FA enged\\u00E9lyez\\u0151t.\n',
	"hcm/myleaverequest/i18n/i18n_it.properties":'\n#XTIT: Application name (shown in browser header bar or as browser tab title)\napp.Identity=Le mie richieste di ferie\n\n#XTIT: title of the home view\nLR_TITLE_HOME_VIEW=Le mie richieste di ferie\n\n#XTIT: title of the leave create view\nLR_TITLE_CREATE_VIEW=Richiedi ferie\n\n#XTIT: title of the leave change view\nLR_TITLE_CHANGE_VIEW=Modifica richiesta di ferie\n\n#XTIT: title of the Entitlements view\nLR_TITLE_BALANCE_VIEW=Diritti\n\n#XTIT: title of the leave History view\nLR_TITLE_HISTORY_VIEW=Storico\n\n#XTIT: title of the leave details view\nLR_TITLE_DETAILS_VIEW=Dettagli ferie\n\n#XTIT: title of the leave requests\nLR_TITLE_LEAVE_REQUESTS=Richieste di ferie\n\n#XTIT: title of the leave request\nLR_TITLE_LEAVE_REQUEST=Richiesta di ferie\n\n#XTIT: deductible\nLR_BALANCE_DEDUCTIBLE=Categoria\n\n#XTIT: Balance\nLR_BALANCE_BALANCE=Disponibile\n\n#XTIT: Used\nLR_BALANCE_USED=Goduto\n\n#XTIT: Requested\nLR_BALANCE_REQUESTED=Richiesto\n\n#XTIT: Quota\nLR_BALANCE_QUOTA=Diritti\n\n#XTIT: Entitlement\nLR_ENTITLEMENT_QUOTA=Diritto\n\n#XTIT: Send leave request\nLR_TITLE_SEND=Invia richiesta di ferie\n\n#XTIT: Cancel leave request\nLR_TITLE_WITHDRAW=Ritira richiesta di ferie\n\n#XTIT: ATTENTION Tile text line break after 12 characters!\nLR_BALANCE_TILE=Diritti\n\n#XTIT: ATTENTION Tile text line break after 12 characters!\nLR_HISTORY_TILE=Storico\n\n#XTIT: ATTENTION Tile text line break after 12 characters!\nLR_CREATE_LEAVE_TILE=Crea richiesta di ferie\n\n#XBUT\nLR_SHOW_HIST=Storico\n\n#XBUT\nLR_CREATE_LEAVE=Richiedi ferie\n\n#XBUT: text for "send leave request" button\nLR_SEND=Invia\n\n#XBUT: text for ok button \nLR_OK=OK\n\n#XBUT: text for reset button \nLR_RESET=Resetta\n\n#XBUT: text for cancel button e.g. on the day range picker screen\nLR_CANCEL=Annulla\n\n#XBUT: text for change button on the Leave Overview details screen\nLR_CHANGE=Modifica\n\n#XBUT: text for cancel button on the Leave Overview details screen\nLR_WITHDRAW=Ritira\n\n#XSEL\nLR_UPDATED=Aggiornato\n\n#XFLD\nLR_NOTE=Nota\n\n#XFLD\nLR_CUSTOM1=Campo personalizzato 1\n\n#XFLD: used vacation, lower case for status under calendar. Reads "X days [line feed] used"\nLR_BOOKED=usufruiti\n\n#XFLD: Available balance, lower case for status under calendar. Reads "X days [line feed] available"\nLR_REMAINING=disponibili\n\n#XFLD\nLR_LOWERCASE_DAYS=giorni\n\n#XFLD\nLR_LOWERCASE_DAY=giorno\n\n#XFLD\nLR_LOWERCASE_HOURS=ore\n\n#XFLD\nLR_LOWERCASE_HOUR=ora\n\n#XFLD\nLR_UP_TO=Fine validit\\u00E0\n\n#XFLD\nLR_FROM=Da\n\n#XFLD\nLR_TO=A\n\n#XFLD\nLR_DEDUCTION=Detrazione\n\n#XFLD: Hyphen for Date Formatting\nLR_HYPHEN=-\n\n#XTIT: title of error dialog\nLR_PROBLEM=Si \\u00E8 verificato un problema\n\n#XTIT: title of confirmation dialog\nLR_CONFIRMATION=Conferma\n\n#YMSG\nLR_CONFIRMATIONMSG=Inviare questa richiesta di ferie a {0}?\n\n#YMSG\nLR_WITHDRAWNMSG=Ritirare questa richiesta di ferie?\n\n#XFLD\nLR_DAYS=giorni\n\n#XFLD\nLR_DAY=Giorno\n\n#XFLD\nLR_HOURS=Ore\n\n#XFLD\nLR_HOUR=Ora\n\n#XFLD\nLR_REQUEST=Richiesto\n\n#XSEL: day type (legend)\nLR_DTYPE_TODAY=Oggi\n\n#XSEL: day type (legend)\nLR_DTYPE_SELECTED=Giorni selezionati\n\n#YMSG: processing\nLR_PROCESSING=In elaborazione...\n\n#YMSG\nLR_SUBMITDONE=La richiesta di ferie \\u00E8 stata inviata a {0}\n\n#YMSG\nLR_WITHDRAWDONE=La tua richiesta di ferie \\u00E8 stata ritirata\n\n#YMSG\nLR_AX_MODEL_NOT_REG=Si \\u00E8 verificato un problema tecnico\\n\\nDettagli dell\'errore\\:\\nErrore interno; modello non registrato\n\n#YMSG\nLR_AX_PARSE_ERR=Si \\u00E8 verificato un problema tecnico\\n\\nDettagli dell\'errore\\:\\nErrore di protocollo; analisi sintattica della risposta HTTP non riuscita\n\n#YMSG\nLR_DD_NO_APPROVER=Si \\u00E8 verificato un problema tecnico\\n\\nDettagli dell\'errore\\:\\nErrore di protocollo; nome approvatore mancante nella risposta\n\n#YMSG\nLR_DD_NO_CFG=Si \\u00E8 verificato un problema tecnico\\n\\nDettagli dell\'errore\\:\\nErrore di protocollo; configurazione mancante nella risposta\n\n#YMSG\nLR_DD_NO_BALANCES=Si \\u00E8 verificato un problema tecnico\\n\\nDettagli dell\'errore\\:\\nErrore di protocollo; saldi mancanti nella risposta\n\n#YMSG\nLR_DD_PARSE_ERR=Si \\u00E8 verificato un problema tecnico\\n\\nDettagli dell\'errore\\:\\nErrore di protocollo; analisi sintattica della risposta non riuscita\n\n#YMSG\nLR_DD_COMM_ERR=Problema rilevato nella connessione\n\n#YMSG\nLR_DD_GENERIC_ERR=Si \\u00E8 verificato un errore\n\n#YMSG\nLR_CT_PARSE_ERR=Si \\u00E8 verificato un problema tecnico\\n\\nDettagli dell\'errore\\:\\nErrore di protocollo; analisi sintattica della risposta non riuscita\n\n#XFLD\nLR_S1_PENDING=In sospeso\n\n#YMSG\nLR_UNKNOWN=Sconosciuto\n\n#XSEL: (legend)\nLR_NONWORKING=Giorno non lavorativo\n\n#XSEL: (legend)\nLR_APPROVELEAVE=Approvato\n\n#XSEL: (legend)\nLR_REJECTEDLEAVE=Rifiutato\n\n#XSEL: (legend)\nLR_APPROVEPENDING=In attesa di approvazione\n\n#XSEL: (legend)\nLR_PUBLICHOLIDAY=Giorno festivo\n\n#XSEL: (legend)\nLR_WORKINGDAY=Giorno lavorativo\n\n#XSEL: (legend)\nLR_DELETIONREQUESTED=Annullamento richiesto\n\n#XTIT\nLR_DELETION_REQ=Richiesta di annullamento\n\n#XTIT\nLR_CHANGE_REQ=Modifica la richiesta\n\n#XTIT\nLR_CHANGE_PENDING=Modifica in sospeso\n\n#XTIT\nLR_CANCEL_PENDING=Annullamento in sospeso\n\n#XTIT\nLR_CHANGE_DONE=Modifica approvata\n\n#XTIT\nLR_CANCEL_DONE=Annullamento approvato\n\n#XTIT: Original\nLR_OLD_VERSION=Originale\n\n#XTIT: Leave Changes\nLR_NEW_VERSION=Modificato\n\n#XFLD: Label for Approver Selection\nLR_APPROVER=Approvatore\n\n#XFLD: Label for Attendance/Absence Hours\nLR_ABS_HOURS=Presenza/Assenza in ore\n\n#XFLD: Label for Attachments\nLR_ATTACHMENTS=Allegati\n\n#XFLD: Placeholder for Attachments\nLR_ATTACHMENT=Aggiungi allegato\n\n#XFLD: Label for Start Time\nLR_START_TIME=Ora di inizio\n\n#XFLD: Label for Start Time\nLR_END_TIME=Ora di fine\n\n#YMSG: Error message to display, if the file upload fails\nLR_ATTACHMENT_ERROR=Allegato non caricato\n\n#YMSG: warning message to show if the file type is not supported\nLR_ATTACHMENT_TYPECHECK=Questo tipo di allegato non \\u00E8 supportato\n\n#YMSG: Warning message to show if the file size exceeds 25MB- Mega Bytes\nLR_ATTACHMENT_SIZECHECK=Dimensioni file troppo elevate. Seleziona un file inferiore ai 25MB.\n\n#XFLD: Select Personnel Assignment Label\nPERSONAL_ASSIGN=Seleziona un contratto d\'impiego\n\n#XTIT: Select Personnel Assignment Title\nPERSONAL_ASSIGN_TITLE=Contratti d\'impiego\n\n#XFLD: Level for approver\nLR_LEVEL=Livello {0}\n\n#YMSG: error message to display, if the maximum number of approvers reached\nLR_APPROVER_LEVEL_MAX=Hai gi\\u00E0 inserito il numero massimo di approvatori.\n',
	"hcm/myleaverequest/i18n/i18n_iw.properties":'\n#XTIT: Application name (shown in browser header bar or as browser tab title)\napp.Identity=\\u05D1\\u05E7\\u05E9\\u05D5\\u05EA \\u05D4\\u05D7\\u05D5\\u05E4\\u05E9\\u05D4 \\u05E9\\u05DC\\u05D9\n\n#XTIT: title of the home view\nLR_TITLE_HOME_VIEW=\\u05D1\\u05E7\\u05E9\\u05D5\\u05EA \\u05D4\\u05D7\\u05D5\\u05E4\\u05E9\\u05D4 \\u05E9\\u05DC\\u05D9\n\n#XTIT: title of the leave create view\nLR_TITLE_CREATE_VIEW=\\u05D1\\u05E7\\u05E9 \\u05D7\\u05D5\\u05E4\\u05E9\\u05D4\n\n#XTIT: title of the leave change view\nLR_TITLE_CHANGE_VIEW=\\u05E9\\u05E0\\u05D4 \\u05D1\\u05E7\\u05E9\\u05EA \\u05D7\\u05D5\\u05E4\\u05E9\\u05D4\n\n#XTIT: title of the Entitlements view\nLR_TITLE_BALANCE_VIEW=\\u05D6\\u05DB\\u05D0\\u05D5\\u05D9\\u05D5\\u05EA\n\n#XTIT: title of the leave History view\nLR_TITLE_HISTORY_VIEW=\\u05D4\\u05D9\\u05E1\\u05D8\\u05D5\\u05E8\\u05D9\\u05D4\n\n#XTIT: title of the leave details view\nLR_TITLE_DETAILS_VIEW=\\u05E4\\u05E8\\u05D8\\u05D9 \\u05D7\\u05D5\\u05E4\\u05E9\\u05D4\n\n#XTIT: title of the leave requests\nLR_TITLE_LEAVE_REQUESTS=\\u05D1\\u05E7\\u05E9\\u05D5\\u05EA \\u05D7\\u05D5\\u05E4\\u05E9\\u05D4\n\n#XTIT: title of the leave request\nLR_TITLE_LEAVE_REQUEST=\\u05D1\\u05E7\\u05E9\\u05EA \\u05D7\\u05D5\\u05E4\\u05E9\\u05D4\n\n#XTIT: deductible\nLR_BALANCE_DEDUCTIBLE=\\u05E7\\u05D8\\u05D2\\u05D5\\u05E8\\u05D9\\u05D4\n\n#XTIT: Balance\nLR_BALANCE_BALANCE=\\u05D9\\u05DE\\u05D9\\u05DD \\u05E0\\u05D5\\u05EA\\u05E8\\u05D5\n\n#XTIT: Used\nLR_BALANCE_USED=\\u05D9\\u05DE\\u05D9\\u05DD \\u05E0\\u05D5\\u05E6\\u05DC\\u05D5\n\n#XTIT: Requested\nLR_BALANCE_REQUESTED=\\u05DE\\u05D1\\u05D5\\u05E7\\u05E9\n\n#XTIT: Quota\nLR_BALANCE_QUOTA=\\u05D6\\u05DB\\u05D0\\u05D5\\u05D9\\u05D5\\u05EA\n\n#XTIT: Entitlement\nLR_ENTITLEMENT_QUOTA=\\u05D6\\u05DB\\u05D0\\u05D5\\u05EA\n\n#XTIT: Send leave request\nLR_TITLE_SEND=\\u05E9\\u05DC\\u05D7 \\u05D1\\u05E7\\u05E9\\u05EA \\u05D7\\u05D5\\u05E4\\u05E9\\u05D4\n\n#XTIT: Cancel leave request\nLR_TITLE_WITHDRAW=\\u05D4\\u05E1\\u05E8 \\u05D1\\u05E7\\u05E9\\u05EA \\u05D7\\u05D5\\u05E4\\u05E9\\u05D4\n\n#XTIT: ATTENTION Tile text line break after 12 characters!\nLR_BALANCE_TILE=\\u05D6\\u05DB\\u05D0\\u05D5\\u05D9\\u05D5\\u05EA\n\n#XTIT: ATTENTION Tile text line break after 12 characters!\nLR_HISTORY_TILE=\\u05D4\\u05D9\\u05E1\\u05D8\\u05D5\\u05E8\\u05D9\\u05D4\n\n#XTIT: ATTENTION Tile text line break after 12 characters!\nLR_CREATE_LEAVE_TILE=\\u05E6\\u05D5\\u05E8 \\u05D1\\u05E7\\u05E9\\u05EA \\u05D7\\u05D5\\u05E4\\u05E9\\u05D4\n\n#XBUT\nLR_SHOW_HIST=\\u05D4\\u05D9\\u05E1\\u05D8\\u05D5\\u05E8\\u05D9\\u05D4\n\n#XBUT\nLR_CREATE_LEAVE=\\u05D1\\u05E7\\u05E9 \\u05D7\\u05D5\\u05E4\\u05E9\\u05D4\n\n#XBUT: text for "send leave request" button\nLR_SEND=\\u05E9\\u05DC\\u05D7\n\n#XBUT: text for ok button \nLR_OK=OK\n\n#XBUT: text for reset button \nLR_RESET=\\u05D0\\u05E4\\u05E1\n\n#XBUT: text for cancel button e.g. on the day range picker screen\nLR_CANCEL=\\u05D1\\u05D8\\u05DC\n\n#XBUT: text for change button on the Leave Overview details screen\nLR_CHANGE=\\u05E9\\u05E0\\u05D4\n\n#XBUT: text for cancel button on the Leave Overview details screen\nLR_WITHDRAW=\\u05D4\\u05E1\\u05E8\n\n#XSEL\nLR_UPDATED=\\u05E2\\u05D5\\u05D3\\u05DB\\u05DF\n\n#XFLD\nLR_NOTE=\\u05D4\\u05E2\\u05E8\\u05D4\n\n#XFLD\nLR_CUSTOM1=\\u05E9\\u05D3\\u05D4 \\u05DE\\u05D5\\u05EA\\u05D0\\u05DD \\u05D0\\u05D9\\u05E9\\u05D9\\u05EA 1\n\n#XFLD: used vacation, lower case for status under calendar. Reads "X days [line feed] used"\nLR_BOOKED=\\u05E0\\u05D5\\u05E6\\u05DC\\u05D5\n\n#XFLD: Available balance, lower case for status under calendar. Reads "X days [line feed] available"\nLR_REMAINING=\\u05E0\\u05D5\\u05EA\\u05E8\\u05D5\n\n#XFLD\nLR_LOWERCASE_DAYS=\\u05D9\\u05DE\\u05D9\\u05DD\n\n#XFLD\nLR_LOWERCASE_DAY=\\u05D9\\u05D5\\u05DD\n\n#XFLD\nLR_LOWERCASE_HOURS=\\u05E9\\u05E2\\u05D5\\u05EA\n\n#XFLD\nLR_LOWERCASE_HOUR=\\u05E9\\u05E2\\u05D4\n\n#XFLD\nLR_UP_TO=\\u05D1\\u05EA\\u05D5\\u05E7\\u05E3 \\u05E2\\u05D3\n\n#XFLD\nLR_FROM=\\u05DE-\n\n#XFLD\nLR_TO=\\u05E2\\u05D3\n\n#XFLD\nLR_DEDUCTION=\\u05E0\\u05D9\\u05DB\\u05D5\\u05D9\n\n#XFLD: Hyphen for Date Formatting\nLR_HYPHEN=-\n\n#XTIT: title of error dialog\nLR_PROBLEM=\\u05D0\\u05D9\\u05E8\\u05E2\\u05D4 \\u05D1\\u05E2\\u05D9\\u05D4\n\n#XTIT: title of confirmation dialog\nLR_CONFIRMATION=\\u05D0\\u05D9\\u05E9\\u05D5\\u05E8\n\n#YMSG\nLR_CONFIRMATIONMSG=\\u05D4\\u05D0\\u05DD \\u05DC\\u05E9\\u05DC\\u05D5\\u05D7 \\u05D0\\u05EA \\u05D1\\u05E7\\u05E9\\u05EA \\u05D4\\u05D7\\u05D5\\u05E4\\u05E9\\u05D4 \\u05D4\\u05D6\\u05D5 \\u05D0\\u05DC {0}?\n\n#YMSG\nLR_WITHDRAWNMSG=\\u05D4\\u05D0\\u05DD \\u05D1\\u05E8\\u05E6\\u05D5\\u05E0\\u05DA \\u05DC\\u05D4\\u05E1\\u05D9\\u05E8 \\u05D1\\u05E7\\u05E9\\u05EA \\u05D7\\u05D5\\u05E4\\u05E9\\u05D4 \\u05D6\\u05D5?\n\n#XFLD\nLR_DAYS=\\u05D9\\u05DE\\u05D9\\u05DD\n\n#XFLD\nLR_DAY=\\u05D9\\u05D5\\u05DD\n\n#XFLD\nLR_HOURS=\\u05E9\\u05E2\\u05D5\\u05EA\n\n#XFLD\nLR_HOUR=\\u05E9\\u05E2\\u05D4\n\n#XFLD\nLR_REQUEST=\\u05DE\\u05D1\\u05D5\\u05E7\\u05E9\n\n#XSEL: day type (legend)\nLR_DTYPE_TODAY=\\u05D4\\u05D9\\u05D5\\u05DD\n\n#XSEL: day type (legend)\nLR_DTYPE_SELECTED=\\u05D9\\u05DE\\u05D9\\u05DD \\u05E9\\u05E0\\u05D1\\u05D7\\u05E8\\u05D5\n\n#YMSG: processing\nLR_PROCESSING=\\u05DE\\u05E2\\u05D1\\u05D3...\n\n#YMSG\nLR_SUBMITDONE=\\u05D1\\u05E7\\u05E9\\u05EA \\u05D4\\u05D7\\u05D5\\u05E4\\u05E9\\u05D4 \\u05E9\\u05DC\\u05DA \\u05E0\\u05E9\\u05DC\\u05D7\\u05D4 \\u05D0\\u05DC {0}\n\n#YMSG\nLR_WITHDRAWDONE=\\u05D1\\u05E7\\u05E9\\u05EA \\u05D4\\u05D7\\u05D5\\u05E4\\u05E9\\u05D4 \\u05E9\\u05DC\\u05DA \\u05D4\\u05D5\\u05E1\\u05E8\\u05D4\n\n#YMSG\nLR_AX_MODEL_NOT_REG=\\u05D0\\u05D9\\u05E8\\u05E2\\u05D4 \\u05D1\\u05E2\\u05D9\\u05D4 \\u05D8\\u05DB\\u05E0\\u05D9\\u05EA\\n\\n\\u05E4\\u05E8\\u05D8\\u05D9 \\u05E9\\u05D2\\u05D9\\u05D0\\u05D4\\:\\n\\u05E9\\u05D2\\u05D9\\u05D0\\u05D4 \\u05E4\\u05E0\\u05D9\\u05DE\\u05D9\\u05EA; \\u05D3\\u05D2\\u05DD \\u05DC\\u05D0 \\u05E0\\u05E8\\u05E9\\u05DD\n\n#YMSG\nLR_AX_PARSE_ERR=\\u05D0\\u05D9\\u05E8\\u05E2\\u05D4 \\u05D1\\u05E2\\u05D9\\u05D4 \\u05D8\\u05DB\\u05E0\\u05D9\\u05EA\\n\\n\\u05E4\\u05E8\\u05D8\\u05D9 \\u05E9\\u05D2\\u05D9\\u05D0\\u05D4\\:\\n\\u05E9\\u05D2\\u05D9\\u05D0\\u05EA \\u05E4\\u05E8\\u05D5\\u05D8\\u05D5\\u05E7\\u05D5\\u05DC; \\u05DC\\u05D0 \\u05E0\\u05D9\\u05EA\\u05DF \\u05D4\\u05D9\\u05D4 \\u05DC\\u05E0\\u05EA\\u05D7 \\u05EA\\u05D2\\u05D5\\u05D1\\u05EA HTTP\n\n#YMSG\nLR_DD_NO_APPROVER=\\u05D0\\u05D9\\u05E8\\u05E2\\u05D4 \\u05D1\\u05E2\\u05D9\\u05D4 \\u05D8\\u05DB\\u05E0\\u05D9\\u05EA\\n\\n\\u05E4\\u05E8\\u05D8\\u05D9 \\u05E9\\u05D2\\u05D9\\u05D0\\u05D4\\:\\n\\u05E9\\u05D2\\u05D9\\u05D0\\u05EA \\u05E4\\u05E8\\u05D5\\u05D8\\u05D5\\u05E7\\u05D5\\u05DC; \\u05E9\\u05DD \\u05D4\\u05DE\\u05D0\\u05E9\\u05E8 \\u05D7\\u05E1\\u05E8 \\u05D1\\u05EA\\u05D2\\u05D5\\u05D1\\u05D4\n\n#YMSG\nLR_DD_NO_CFG=\\u05D0\\u05D9\\u05E8\\u05E2\\u05D4 \\u05D1\\u05E2\\u05D9\\u05D4 \\u05D8\\u05DB\\u05E0\\u05D9\\u05EA\\n\\n\\u05E4\\u05E8\\u05D8\\u05D9 \\u05E9\\u05D2\\u05D9\\u05D0\\u05D4\\:\\n\\u05E9\\u05D2\\u05D9\\u05D0\\u05EA \\u05E4\\u05E8\\u05D5\\u05D8\\u05D5\\u05E7\\u05D5\\u05DC; \\u05EA\\u05E6\\u05D5\\u05E8\\u05D4 \\u05D7\\u05E1\\u05E8\\u05D4 \\u05D1\\u05EA\\u05D2\\u05D5\\u05D1\\u05D4\n\n#YMSG\nLR_DD_NO_BALANCES=\\u05D0\\u05D9\\u05E8\\u05E2\\u05D4 \\u05D1\\u05E2\\u05D9\\u05D4 \\u05D8\\u05DB\\u05E0\\u05D9\\u05EA\\n\\n\\u05E4\\u05E8\\u05D8\\u05D9 \\u05E9\\u05D2\\u05D9\\u05D0\\u05D4\\:\\n\\u05E9\\u05D2\\u05D9\\u05D0\\u05EA \\u05E4\\u05E8\\u05D5\\u05D8\\u05D5\\u05E7\\u05D5\\u05DC; \\u05D9\\u05EA\\u05E8\\u05D5\\u05EA \\u05D7\\u05E1\\u05E8\\u05D5\\u05EA \\u05D1\\u05EA\\u05D2\\u05D5\\u05D1\\u05D4\n\n#YMSG\nLR_DD_PARSE_ERR=\\u05D0\\u05D9\\u05E8\\u05E2\\u05D4 \\u05D1\\u05E2\\u05D9\\u05D4 \\u05D8\\u05DB\\u05E0\\u05D9\\u05EA\\n\\n\\u05E4\\u05E8\\u05D8\\u05D9 \\u05E9\\u05D2\\u05D9\\u05D0\\u05D4\\:\\n\\u05E9\\u05D2\\u05D9\\u05D0\\u05EA \\u05E4\\u05E8\\u05D5\\u05D8\\u05D5\\u05E7\\u05D5\\u05DC; \\u05DC\\u05D0 \\u05E0\\u05D9\\u05EA\\u05DF \\u05D4\\u05D9\\u05D4 \\u05DC\\u05E0\\u05EA\\u05D7 \\u05EA\\u05D2\\u05D5\\u05D1\\u05D4\n\n#YMSG\nLR_DD_COMM_ERR=\\u05D0\\u05D9\\u05E8\\u05E2\\u05D4 \\u05D1\\u05E2\\u05D9\\u05D4 \\u05E2\\u05DD \\u05D4\\u05D7\\u05D9\\u05D1\\u05D5\\u05E8 \\u05E9\\u05DC\\u05DA\n\n#YMSG\nLR_DD_GENERIC_ERR=\\u05D0\\u05D9\\u05E8\\u05E2\\u05D4 \\u05E9\\u05D2\\u05D9\\u05D0\\u05D4\n\n#YMSG\nLR_CT_PARSE_ERR=\\u05D0\\u05D9\\u05E8\\u05E2\\u05D4 \\u05D1\\u05E2\\u05D9\\u05D4 \\u05D8\\u05DB\\u05E0\\u05D9\\u05EA\\n\\n\\u05E4\\u05E8\\u05D8\\u05D9 \\u05E9\\u05D2\\u05D9\\u05D0\\u05D4\\:\\n\\u05E9\\u05D2\\u05D9\\u05D0\\u05EA \\u05E4\\u05E8\\u05D5\\u05D8\\u05D5\\u05E7\\u05D5\\u05DC; \\u05DC\\u05D0 \\u05E0\\u05D9\\u05EA\\u05DF \\u05D4\\u05D9\\u05D4 \\u05DC\\u05E0\\u05EA\\u05D7 \\u05EA\\u05D2\\u05D5\\u05D1\\u05D4\n\n#XFLD\nLR_S1_PENDING=\\u05D1\\u05D4\\u05DE\\u05EA\\u05E0\\u05D4\n\n#YMSG\nLR_UNKNOWN=\\u05DC\\u05D0 \\u05D9\\u05D3\\u05D5\\u05E2\n\n#XSEL: (legend)\nLR_NONWORKING=\\u05D9\\u05D5\\u05DD \\u05E9\\u05D0\\u05D9\\u05E0\\u05D5 \\u05D9\\u05D5\\u05DD \\u05E2\\u05D1\\u05D5\\u05D3\\u05D4\n\n#XSEL: (legend)\nLR_APPROVELEAVE=\\u05D0\\u05D5\\u05E9\\u05E8\n\n#XSEL: (legend)\nLR_REJECTEDLEAVE=\\u05E0\\u05D3\\u05D7\\u05D4\n\n#XSEL: (legend)\nLR_APPROVEPENDING=\\u05D0\\u05D9\\u05E9\\u05D5\\u05E8 \\u05D1\\u05D4\\u05DE\\u05EA\\u05E0\\u05D4\n\n#XSEL: (legend)\nLR_PUBLICHOLIDAY=\\u05D7\\u05D2 \\u05E8\\u05E9\\u05DE\\u05D9\n\n#XSEL: (legend)\nLR_WORKINGDAY=\\u05D9\\u05D5\\u05DD \\u05E2\\u05D1\\u05D5\\u05D3\\u05D4\n\n#XSEL: (legend)\nLR_DELETIONREQUESTED=\\u05D4\\u05D5\\u05D2\\u05E9\\u05D4 \\u05D1\\u05E7\\u05E9\\u05D4 \\u05DC\\u05D1\\u05D9\\u05D8\\u05D5\\u05DC\n\n#XTIT\nLR_DELETION_REQ=\\u05D1\\u05E7\\u05E9\\u05EA \\u05D1\\u05D9\\u05D8\\u05D5\\u05DC\n\n#XTIT\nLR_CHANGE_REQ=\\u05D1\\u05E7\\u05E9\\u05EA \\u05E9\\u05D9\\u05E0\\u05D5\\u05D9\n\n#XTIT\nLR_CHANGE_PENDING=\\u05E9\\u05D9\\u05E0\\u05D5\\u05D9 \\u05D1\\u05D4\\u05DE\\u05EA\\u05E0\\u05D4\n\n#XTIT\nLR_CANCEL_PENDING=\\u05D1\\u05D9\\u05D8\\u05D5\\u05DC \\u05D1\\u05D4\\u05DE\\u05EA\\u05E0\\u05D4\n\n#XTIT\nLR_CHANGE_DONE=\\u05E9\\u05D9\\u05E0\\u05D5\\u05D9 \\u05D0\\u05D5\\u05E9\\u05E8\n\n#XTIT\nLR_CANCEL_DONE=\\u05D1\\u05D9\\u05D8\\u05D5\\u05DC \\u05D0\\u05D5\\u05E9\\u05E8\n\n#XTIT: Original\nLR_OLD_VERSION=\\u05DE\\u05E7\\u05D5\\u05E8\\u05D9\n\n#XTIT: Leave Changes\nLR_NEW_VERSION=\\u05E9\\u05D5\\u05E0\\u05D4\n\n#XFLD: Label for Approver Selection\nLR_APPROVER=\\u05DE\\u05D0\\u05E9\\u05E8\n\n#XFLD: Label for Attendance/Absence Hours\nLR_ABS_HOURS=\\u05E9\\u05E2\\u05D5\\u05EA \\u05D4\\u05D9\\u05E2\\u05D3\\u05E8\\u05D5\\u05EA/\\u05E0\\u05D5\\u05DB\\u05D7\\u05D5\\u05EA\n\n#XFLD: Label for Attachments\nLR_ATTACHMENTS=\\u05E7\\u05D1\\u05E6\\u05D9\\u05DD \\u05DE\\u05E6\\u05D5\\u05E8\\u05E4\\u05D9\\u05DD\n\n#XFLD: Placeholder for Attachments\nLR_ATTACHMENT=\\u05D4\\u05D5\\u05E1\\u05E3 \\u05E7\\u05D5\\u05D1\\u05E5 \\u05DE\\u05E6\\u05D5\\u05E8\\u05E3\n\n#XFLD: Label for Start Time\nLR_START_TIME=\\u05E9\\u05E2\\u05EA \\u05D4\\u05EA\\u05D7\\u05DC\\u05D4\n\n#XFLD: Label for Start Time\nLR_END_TIME=\\u05E9\\u05E2\\u05EA \\u05E1\\u05D9\\u05D5\\u05DD\n\n#YMSG: Error message to display, if the file upload fails\nLR_ATTACHMENT_ERROR=\\u05DC\\u05D0 \\u05E0\\u05D9\\u05EA\\u05DF \\u05D4\\u05D9\\u05D4 \\u05DC\\u05D4\\u05E2\\u05DC\\u05D5\\u05EA \\u05D0\\u05EA \\u05D4\\u05E7\\u05D5\\u05D1\\u05E5 \\u05D4\\u05DE\\u05E6\\u05D5\\u05E8\\u05E3\n\n#YMSG: warning message to show if the file type is not supported\nLR_ATTACHMENT_TYPECHECK=\\u05E1\\u05D5\\u05D2 \\u05D6\\u05D4 \\u05E9\\u05DC \\u05E7\\u05D5\\u05D1\\u05E5 \\u05DE\\u05E6\\u05D5\\u05E8\\u05E3 \\u05D0\\u05D9\\u05E0\\u05D5 \\u05E0\\u05EA\\u05DE\\u05DA\n\n#YMSG: Warning message to show if the file size exceeds 25MB- Mega Bytes\nLR_ATTACHMENT_SIZECHECK=\\u05E7\\u05D5\\u05D1\\u05E5 \\u05D2\\u05D3\\u05D5\\u05DC \\u05DE\\u05D3\\u05D9. \\u05D1\\u05D7\\u05E8 \\u05D1\\u05E7\\u05D5\\u05D1\\u05E5 \\u05E7\\u05D8\\u05DF \\u05DE-25MB.\n\n#XFLD: Select Personnel Assignment Label\nPERSONAL_ASSIGN=\\u05D1\\u05D7\\u05E8 \\u05D4\\u05E7\\u05E6\\u05D0\\u05EA \\u05E2\\u05D5\\u05D1\\u05D3\n\n#XTIT: Select Personnel Assignment Title\nPERSONAL_ASSIGN_TITLE=\\u05D4\\u05E7\\u05E6\\u05D0\\u05D5\\u05EA \\u05E2\\u05D5\\u05D1\\u05D3\\u05D9\\u05DD\n\n#XFLD: Level for approver\nLR_LEVEL=\\u05E8\\u05DE\\u05D4 {0}\n\n#YMSG: error message to display, if the maximum number of approvers reached\nLR_APPROVER_LEVEL_MAX=\\u05DB\\u05D1\\u05E8 \\u05D4\\u05D6\\u05E0\\u05EA \\u05D0\\u05EA \\u05D4\\u05DE\\u05E1\\u05E4\\u05E8 \\u05D4\\u05DE\\u05E7\\u05E1\\u05D9\\u05DE\\u05DC\\u05D9 \\u05E9\\u05DC \\u05DE\\u05D0\\u05E9\\u05E8\\u05D9\\u05DD.\n',
	"hcm/myleaverequest/i18n/i18n_ja.properties":'\n#XTIT: Application name (shown in browser header bar or as browser tab title)\napp.Identity=\\u4F11\\u6687\\u7533\\u8ACB\n\n#XTIT: title of the home view\nLR_TITLE_HOME_VIEW=\\u4F11\\u6687\\u7533\\u8ACB\n\n#XTIT: title of the leave create view\nLR_TITLE_CREATE_VIEW=\\u4F11\\u6687\\u7533\\u8ACB\n\n#XTIT: title of the leave change view\nLR_TITLE_CHANGE_VIEW=\\u4F11\\u6687\\u7533\\u8ACB\\u5909\\u66F4\n\n#XTIT: title of the Entitlements view\nLR_TITLE_BALANCE_VIEW=\\u4F11\\u6687\\u4ED8\\u4E0E\n\n#XTIT: title of the leave History view\nLR_TITLE_HISTORY_VIEW=\\u5C65\\u6B74\n\n#XTIT: title of the leave details view\nLR_TITLE_DETAILS_VIEW=\\u4F11\\u6687\\u8A73\\u7D30\n\n#XTIT: title of the leave requests\nLR_TITLE_LEAVE_REQUESTS=\\u4F11\\u6687\\u7533\\u8ACB\n\n#XTIT: title of the leave request\nLR_TITLE_LEAVE_REQUEST=\\u4F11\\u6687\\u7533\\u8ACB\n\n#XTIT: deductible\nLR_BALANCE_DEDUCTIBLE=\\u30AB\\u30C6\\u30B4\\u30EA\n\n#XTIT: Balance\nLR_BALANCE_BALANCE=\\u5229\\u7528\\u53EF\\u80FD\n\n#XTIT: Used\nLR_BALANCE_USED=\\u6D88\\u5316\\u6E08\n\n#XTIT: Requested\nLR_BALANCE_REQUESTED=\\u7533\\u8ACB\\u6E08\n\n#XTIT: Quota\nLR_BALANCE_QUOTA=\\u4F11\\u6687\\u4ED8\\u4E0E\n\n#XTIT: Entitlement\nLR_ENTITLEMENT_QUOTA=\\u4F11\\u6687\\u4ED8\\u4E0E\n\n#XTIT: Send leave request\nLR_TITLE_SEND=\\u4F11\\u6687\\u7533\\u8ACB\\u9001\\u4FE1\n\n#XTIT: Cancel leave request\nLR_TITLE_WITHDRAW=\\u4F11\\u6687\\u7533\\u8ACB\\u53D6\\u6D88\n\n#XTIT: ATTENTION Tile text line break after 12 characters!\nLR_BALANCE_TILE=\\u4F11\\u6687\\u4ED8\\u4E0E\n\n#XTIT: ATTENTION Tile text line break after 12 characters!\nLR_HISTORY_TILE=\\u5C65\\u6B74\n\n#XTIT: ATTENTION Tile text line break after 12 characters!\nLR_CREATE_LEAVE_TILE=\\u4F11\\u6687\\u7533\\u8ACB\\u767B\\u9332\n\n#XBUT\nLR_SHOW_HIST=\\u5C65\\u6B74\n\n#XBUT\nLR_CREATE_LEAVE=\\u4F11\\u6687\\u7533\\u8ACB\n\n#XBUT: text for "send leave request" button\nLR_SEND=\\u9001\\u4FE1\n\n#XBUT: text for ok button \nLR_OK=OK\n\n#XBUT: text for reset button \nLR_RESET=\\u30EA\\u30BB\\u30C3\\u30C8\n\n#XBUT: text for cancel button e.g. on the day range picker screen\nLR_CANCEL=\\u4E2D\\u6B62\n\n#XBUT: text for change button on the Leave Overview details screen\nLR_CHANGE=\\u5909\\u66F4\n\n#XBUT: text for cancel button on the Leave Overview details screen\nLR_WITHDRAW=\\u53D6\\u6D88\n\n#XSEL\nLR_UPDATED=\\u66F4\\u65B0\\u6E08\n\n#XFLD\nLR_NOTE=\\u30E1\\u30E2\n\n#XFLD\nLR_CUSTOM1=\\u30E6\\u30FC\\u30B6\\u5B9A\\u7FA9\\u9805\\u76EE 1\n\n#XFLD: used vacation, lower case for status under calendar. Reads "X days [line feed] used"\nLR_BOOKED=\\u6D88\\u5316\\u6E08\n\n#XFLD: Available balance, lower case for status under calendar. Reads "X days [line feed] available"\nLR_REMAINING=\\u5229\\u7528\\u53EF\\u80FD\n\n#XFLD\nLR_LOWERCASE_DAYS=\\u65E5\n\n#XFLD\nLR_LOWERCASE_DAY=\\u65E5\n\n#XFLD\nLR_LOWERCASE_HOURS=\\u6642\\u9593\n\n#XFLD\nLR_LOWERCASE_HOUR=\\u6642\\u9593\n\n#XFLD\nLR_UP_TO=\\u6709\\u52B9\\u671F\\u9650\n\n#XFLD\nLR_FROM=\\u958B\\u59CB\n\n#XFLD\nLR_TO=\\u7D42\\u4E86\n\n#XFLD\nLR_DEDUCTION=\\u6D88\\u5316\n\n#XFLD: Hyphen for Date Formatting\nLR_HYPHEN=-\n\n#XTIT: title of error dialog\nLR_PROBLEM=\\u554F\\u984C\\u304C\\u767A\\u751F\\u3057\\u307E\\u3057\\u305F\n\n#XTIT: title of confirmation dialog\nLR_CONFIRMATION=\\u78BA\\u8A8D\n\n#YMSG\nLR_CONFIRMATIONMSG=\\u3053\\u306E\\u4F11\\u6687\\u7533\\u8ACB\\u3092 {0} \\u306B\\u9001\\u4FE1\\u3057\\u307E\\u3059\\u304B\\u3002\n\n#YMSG\nLR_WITHDRAWNMSG=\\u3053\\u306E\\u4F11\\u6687\\u7533\\u8ACB\\u3092\\u53D6\\u308A\\u6D88\\u3057\\u307E\\u3059\\u304B\\u3002\n\n#XFLD\nLR_DAYS=\\u65E5\n\n#XFLD\nLR_DAY=\\u65E5\n\n#XFLD\nLR_HOURS=\\u6642\\u9593\n\n#XFLD\nLR_HOUR=\\u6642\\u9593\n\n#XFLD\nLR_REQUEST=\\u7533\\u8ACB\\u6E08\n\n#XSEL: day type (legend)\nLR_DTYPE_TODAY=\\u672C\\u65E5\n\n#XSEL: day type (legend)\nLR_DTYPE_SELECTED=\\u9078\\u629E\\u65E5\n\n#YMSG: processing\nLR_PROCESSING=\\u51E6\\u7406\\u4E2D...\n\n#YMSG\nLR_SUBMITDONE=\\u4F11\\u6687\\u7533\\u8ACB\\u304C {0} \\u306B\\u9001\\u4FE1\\u3055\\u308C\\u307E\\u3057\\u305F\n\n#YMSG\nLR_WITHDRAWDONE=\\u4F11\\u6687\\u7533\\u8ACB\\u304C\\u53D6\\u308A\\u6D88\\u3055\\u308C\\u307E\\u3057\\u305F\n\n#YMSG\nLR_AX_MODEL_NOT_REG=\\u6280\\u8853\\u7684\\u306A\\u554F\\u984C\\u304C\\u767A\\u751F\\u3057\\u307E\\u3057\\u305F\\n\\n\\u30A8\\u30E9\\u30FC\\u8A73\\u7D30\\: \\n\\u5185\\u90E8\\u30A8\\u30E9\\u30FC\\: \\u30E2\\u30C7\\u30EB\\u304C\\u767B\\u9332\\u3055\\u308C\\u3066\\u3044\\u307E\\u305B\\u3093\n\n#YMSG\nLR_AX_PARSE_ERR=\\u6280\\u8853\\u7684\\u306A\\u554F\\u984C\\u304C\\u767A\\u751F\\u3057\\u307E\\u3057\\u305F\\n\\n\\u30A8\\u30E9\\u30FC\\u8A73\\u7D30\\: \\n\\u30D7\\u30ED\\u30C8\\u30B3\\u30EB\\u30A8\\u30E9\\u30FC\\: HTTP \\u5FDC\\u7B54\\u3092\\u30D1\\u30FC\\u30B9\\u3067\\u304D\\u307E\\u305B\\u3093\\u3067\\u3057\\u305F\n\n#YMSG\nLR_DD_NO_APPROVER=\\u6280\\u8853\\u7684\\u306A\\u554F\\u984C\\u304C\\u767A\\u751F\\u3057\\u307E\\u3057\\u305F\\n\\n\\u30A8\\u30E9\\u30FC\\u8A73\\u7D30\\: \\n\\u30D7\\u30ED\\u30C8\\u30B3\\u30EB\\u30A8\\u30E9\\u30FC\\: \\u5FDC\\u7B54\\u306B\\u627F\\u8A8D\\u8005\\u540D\\u304C\\u542B\\u307E\\u308C\\u3066\\u3044\\u307E\\u305B\\u3093\n\n#YMSG\nLR_DD_NO_CFG=\\u6280\\u8853\\u7684\\u306A\\u554F\\u984C\\u304C\\u767A\\u751F\\u3057\\u307E\\u3057\\u305F\\n\\n\\u30A8\\u30E9\\u30FC\\u8A73\\u7D30\\: \\n\\u30D7\\u30ED\\u30C8\\u30B3\\u30EB\\u30A8\\u30E9\\u30FC\\: \\u5FDC\\u7B54\\u306B\\u8A2D\\u5B9A\\u304C\\u542B\\u307E\\u308C\\u3066\\u3044\\u307E\\u305B\\u3093\n\n#YMSG\nLR_DD_NO_BALANCES=\\u6280\\u8853\\u7684\\u306A\\u554F\\u984C\\u304C\\u767A\\u751F\\u3057\\u307E\\u3057\\u305F\\n\\n\\u30A8\\u30E9\\u30FC\\u8A73\\u7D30\\: \\n\\u30D7\\u30ED\\u30C8\\u30B3\\u30EB\\u30A8\\u30E9\\u30FC\\: \\u5FDC\\u7B54\\u306B\\u30D0\\u30E9\\u30F3\\u30B9\\u304C\\u542B\\u307E\\u308C\\u3066\\u3044\\u307E\\u305B\\u3093\n\n#YMSG\nLR_DD_PARSE_ERR=\\u6280\\u8853\\u7684\\u306A\\u554F\\u984C\\u304C\\u767A\\u751F\\u3057\\u307E\\u3057\\u305F\\n\\n\\u30A8\\u30E9\\u30FC\\u8A73\\u7D30\\: \\n\\u30D7\\u30ED\\u30C8\\u30B3\\u30EB\\u30A8\\u30E9\\u30FC\\: \\u5FDC\\u7B54\\u3092\\u30D1\\u30FC\\u30B9\\u3067\\u304D\\u307E\\u305B\\u3093\\u3067\\u3057\\u305F\n\n#YMSG\nLR_DD_COMM_ERR=\\u63A5\\u7D9A\\u6642\\u306B\\u554F\\u984C\\u304C\\u767A\\u751F\\u3057\\u307E\\u3057\\u305F\n\n#YMSG\nLR_DD_GENERIC_ERR=\\u30A8\\u30E9\\u30FC\\u304C\\u767A\\u751F\\u3057\\u307E\\u3057\\u305F\n\n#YMSG\nLR_CT_PARSE_ERR=\\u6280\\u8853\\u7684\\u306A\\u554F\\u984C\\u304C\\u767A\\u751F\\u3057\\u307E\\u3057\\u305F\\n\\n\\u30A8\\u30E9\\u30FC\\u8A73\\u7D30\\: \\n\\u30D7\\u30ED\\u30C8\\u30B3\\u30EB\\u30A8\\u30E9\\u30FC\\: \\u5FDC\\u7B54\\u3092\\u30D1\\u30FC\\u30B9\\u3067\\u304D\\u307E\\u305B\\u3093\\u3067\\u3057\\u305F\n\n#XFLD\nLR_S1_PENDING=\\u4FDD\\u7559\n\n#YMSG\nLR_UNKNOWN=\\u672A\\u5B9A\\u7FA9\n\n#XSEL: (legend)\nLR_NONWORKING=\\u4F11\\u65E5\n\n#XSEL: (legend)\nLR_APPROVELEAVE=\\u627F\\u8A8D\\u6E08\n\n#XSEL: (legend)\nLR_REJECTEDLEAVE=\\u5374\\u4E0B\\u6E08\n\n#XSEL: (legend)\nLR_APPROVEPENDING=\\u627F\\u8A8D\\u4FDD\\u7559\n\n#XSEL: (legend)\nLR_PUBLICHOLIDAY=\\u795D\\u65E5\n\n#XSEL: (legend)\nLR_WORKINGDAY=\\u52E4\\u52D9\\u65E5\n\n#XSEL: (legend)\nLR_DELETIONREQUESTED=\\u53D6\\u6D88\\u4F9D\\u983C\\u6E08\n\n#XTIT\nLR_DELETION_REQ=\\u53D6\\u6D88\\u4F9D\\u983C\n\n#XTIT\nLR_CHANGE_REQ=\\u7533\\u8ACB\\u5909\\u66F4\n\n#XTIT\nLR_CHANGE_PENDING=\\u5909\\u66F4\\u4FDD\\u7559\n\n#XTIT\nLR_CANCEL_PENDING=\\u53D6\\u6D88\\u4FDD\\u7559\n\n#XTIT\nLR_CHANGE_DONE=\\u5909\\u66F4\\u627F\\u8A8D\\u6E08\n\n#XTIT\nLR_CANCEL_DONE=\\u53D6\\u6D88\\u627F\\u8A8D\\u6E08\n\n#XTIT: Original\nLR_OLD_VERSION=\\u5909\\u66F4\\u524D\n\n#XTIT: Leave Changes\nLR_NEW_VERSION=\\u5909\\u66F4\\u5F8C\n\n#XFLD: Label for Approver Selection\nLR_APPROVER=\\u627F\\u8A8D\\u8005\n\n#XFLD: Label for Attendance/Absence Hours\nLR_ABS_HOURS=\\u51FA\\u52E4/\\u4F11\\u52D9\\u6642\\u9593\n\n#XFLD: Label for Attachments\nLR_ATTACHMENTS=\\u6DFB\\u4ED8\\u6587\\u66F8\n\n#XFLD: Placeholder for Attachments\nLR_ATTACHMENT=\\u6DFB\\u4ED8\\u6587\\u66F8\\u8FFD\\u52A0\n\n#XFLD: Label for Start Time\nLR_START_TIME=\\u958B\\u59CB\\u6642\\u523B\n\n#XFLD: Label for Start Time\nLR_END_TIME=\\u7D42\\u4E86\\u6642\\u523B\n\n#YMSG: Error message to display, if the file upload fails\nLR_ATTACHMENT_ERROR=\\u6DFB\\u4ED8\\u6587\\u66F8\\u3092\\u30A2\\u30C3\\u30D7\\u30ED\\u30FC\\u30C9\\u3067\\u304D\\u307E\\u305B\\u3093\\u3067\\u3057\\u305F\n\n#YMSG: warning message to show if the file type is not supported\nLR_ATTACHMENT_TYPECHECK=\\u3053\\u306E\\u6DFB\\u4ED8\\u6587\\u66F8\\u30BF\\u30A4\\u30D7\\u306F\\u30B5\\u30DD\\u30FC\\u30C8\\u3055\\u308C\\u3066\\u3044\\u307E\\u305B\\u3093\n\n#YMSG: Warning message to show if the file size exceeds 25MB- Mega Bytes\nLR_ATTACHMENT_SIZECHECK=\\u30D5\\u30A1\\u30A4\\u30EB\\u30B5\\u30A4\\u30BA\\u304C\\u5927\\u304D\\u3059\\u304E\\u307E\\u3059\\u3002\\u30B5\\u30A4\\u30BA\\u304C 25MB \\u672A\\u6E80\\u306E\\u30D5\\u30A1\\u30A4\\u30EB\\u3092\\u9078\\u629E\\u3057\\u3066\\u304F\\u3060\\u3055\\u3044\\u3002\n\n#XFLD: Select Personnel Assignment Label\nPERSONAL_ASSIGN=\\u5F93\\u696D\\u54E1\\u5272\\u5F53\\u306E\\u9078\\u629E\n\n#XTIT: Select Personnel Assignment Title\nPERSONAL_ASSIGN_TITLE=\\u5F93\\u696D\\u54E1\\u5272\\u5F53\n\n#XFLD: Level for approver\nLR_LEVEL=\\u30EC\\u30D9\\u30EB {0}\n\n#YMSG: error message to display, if the maximum number of approvers reached\nLR_APPROVER_LEVEL_MAX=\\u3059\\u3067\\u306B\\u6700\\u5927\\u6570\\u306E\\u627F\\u8A8D\\u8005\\u304C\\u5165\\u529B\\u3055\\u308C\\u3066\\u3044\\u307E\\u3059\\u3002\n',
	"hcm/myleaverequest/i18n/i18n_no.properties":'\n#XTIT: Application name (shown in browser header bar or as browser tab title)\napp.Identity=Mine frav\\u00E6rss\\u00F8knader\n\n#XTIT: title of the home view\nLR_TITLE_HOME_VIEW=Mine frav\\u00E6rss\\u00F8knader\n\n#XTIT: title of the leave create view\nLR_TITLE_CREATE_VIEW=S\\u00F8k om frav\\u00E6r\n\n#XTIT: title of the leave change view\nLR_TITLE_CHANGE_VIEW=Endre frav\\u00E6rss\\u00F8knad\n\n#XTIT: title of the Entitlements view\nLR_TITLE_BALANCE_VIEW=Krav\n\n#XTIT: title of the leave History view\nLR_TITLE_HISTORY_VIEW=Historikk\n\n#XTIT: title of the leave details view\nLR_TITLE_DETAILS_VIEW=Frav\\u00E6rsdetaljer\n\n#XTIT: title of the leave requests\nLR_TITLE_LEAVE_REQUESTS=Frav\\u00E6rss\\u00F8knader\n\n#XTIT: title of the leave request\nLR_TITLE_LEAVE_REQUEST=Frav\\u00E6rss\\u00F8knad\n\n#XTIT: deductible\nLR_BALANCE_DEDUCTIBLE=Kategori\n\n#XTIT: Balance\nLR_BALANCE_BALANCE=tilgjengelig\n\n#XTIT: Used\nLR_BALANCE_USED=brukt\n\n#XTIT: Requested\nLR_BALANCE_REQUESTED=S\\u00F8kt om\n\n#XTIT: Quota\nLR_BALANCE_QUOTA=Krav\n\n#XTIT: Entitlement\nLR_ENTITLEMENT_QUOTA=Krav\n\n#XTIT: Send leave request\nLR_TITLE_SEND=Send frav\\u00E6rss\\u00F8knad\n\n#XTIT: Cancel leave request\nLR_TITLE_WITHDRAW=Annuller frav\\u00E6rss\\u00F8knad\n\n#XTIT: ATTENTION Tile text line break after 12 characters!\nLR_BALANCE_TILE=Krav\n\n#XTIT: ATTENTION Tile text line break after 12 characters!\nLR_HISTORY_TILE=Historikk\n\n#XTIT: ATTENTION Tile text line break after 12 characters!\nLR_CREATE_LEAVE_TILE=Opprett frav\\u00E6rss\\u00F8knad\n\n#XBUT\nLR_SHOW_HIST=Historikk\n\n#XBUT\nLR_CREATE_LEAVE=S\\u00F8k om frav\\u00E6r\n\n#XBUT: text for "send leave request" button\nLR_SEND=Send\n\n#XBUT: text for ok button \nLR_OK=OK\n\n#XBUT: text for reset button \nLR_RESET=Tilbakestill\n\n#XBUT: text for cancel button e.g. on the day range picker screen\nLR_CANCEL=Avbryt\n\n#XBUT: text for change button on the Leave Overview details screen\nLR_CHANGE=Endre\n\n#XBUT: text for cancel button on the Leave Overview details screen\nLR_WITHDRAW=Annuller\n\n#XSEL\nLR_UPDATED=Oppdatert\n\n#XFLD\nLR_NOTE=Merknad\n\n#XFLD\nLR_CUSTOM1=Brukerdefinert felt 1\n\n#XFLD: used vacation, lower case for status under calendar. Reads "X days [line feed] used"\nLR_BOOKED=brukt\n\n#XFLD: Available balance, lower case for status under calendar. Reads "X days [line feed] available"\nLR_REMAINING=tilgjengelig\n\n#XFLD\nLR_LOWERCASE_DAYS=dager\n\n#XFLD\nLR_LOWERCASE_DAY=dag\n\n#XFLD\nLR_LOWERCASE_HOURS=timer\n\n#XFLD\nLR_LOWERCASE_HOUR=time\n\n#XFLD\nLR_UP_TO=Gyldig til\n\n#XFLD\nLR_FROM=Fra\n\n#XFLD\nLR_TO=Til\n\n#XFLD\nLR_DEDUCTION=Fradrag\n\n#XFLD: Hyphen for Date Formatting\nLR_HYPHEN=-\n\n#XTIT: title of error dialog\nLR_PROBLEM=Feil har oppst\\u00E5tt\n\n#XTIT: title of confirmation dialog\nLR_CONFIRMATION=Bekreftelse\n\n#YMSG\nLR_CONFIRMATIONMSG=Sende denne frav\\u00E6rss\\u00F8knaden til {0}?\n\n#YMSG\nLR_WITHDRAWNMSG=Vil du annullere denne frav\\u00E6rss\\u00F8knaden?\n\n#XFLD\nLR_DAYS=dager\n\n#XFLD\nLR_DAY=dag\n\n#XFLD\nLR_HOURS=timer\n\n#XFLD\nLR_HOUR=time\n\n#XFLD\nLR_REQUEST=Rekvirert\n\n#XSEL: day type (legend)\nLR_DTYPE_TODAY=I dag\n\n#XSEL: day type (legend)\nLR_DTYPE_SELECTED=Valgte dager\n\n#YMSG: processing\nLR_PROCESSING=Behandler ...\n\n#YMSG\nLR_SUBMITDONE=Frav\\u00E6rss\\u00F8knaden er sendt til {0}\n\n#YMSG\nLR_WITHDRAWDONE=Frav\\u00E6rss\\u00F8knaden din er annullert\n\n#YMSG\nLR_AX_MODEL_NOT_REG=Et teknisk problem har oppst\\u00E5tt\\n\\nFeildetaljer\\:\\nIntern feil, modell er ikke registrert\n\n#YMSG\nLR_AX_PARSE_ERR=Et teknisk problem har oppst\\u00E5tt\\n\\nFeildetaljer\\:\\nProtokollfeil, kan ikke analysere HTTP-svar\n\n#YMSG\nLR_DD_NO_APPROVER=Et teknisk problem har oppst\\u00E5tt\\n\\nFeildetaljer\\:\\nProtokollfeil, godkjennernavn mangler i svar\n\n#YMSG\nLR_DD_NO_CFG=Et teknisk problem har oppst\\u00E5tt\\n\\nFeildetaljer\\:\\nProtokollfeil, konfigurasjon mangler i svar\n\n#YMSG\nLR_DD_NO_BALANCES=Et teknisk problem har oppst\\u00E5tt\\n\\nFeildetaljer\\:\\nProtokollfeil, saldoer mangler i svar\n\n#YMSG\nLR_DD_PARSE_ERR=Et teknisk problem har oppst\\u00E5tt\\n\\nFeildetaljer\\:\\nProtokollfeil, kan ikke analysere svar\n\n#YMSG\nLR_DD_COMM_ERR=Forbindelsesfeil\n\n#YMSG\nLR_DD_GENERIC_ERR=Det har oppst\\u00E5tt en feil\n\n#YMSG\nLR_CT_PARSE_ERR=Et teknisk problem har oppst\\u00E5tt\\n\\nFeildetaljer\\:\\nProtokollfeil, kan ikke analysere svar\n\n#XFLD\nLR_S1_PENDING=Venter\n\n#YMSG\nLR_UNKNOWN=Ukjent\n\n#XSEL: (legend)\nLR_NONWORKING=Fridag\n\n#XSEL: (legend)\nLR_APPROVELEAVE=Godkjent\n\n#XSEL: (legend)\nLR_REJECTEDLEAVE=Avvist\n\n#XSEL: (legend)\nLR_APPROVEPENDING=Venter p\\u00E5 godkjenning\n\n#XSEL: (legend)\nLR_PUBLICHOLIDAY=Helgedag\n\n#XSEL: (legend)\nLR_WORKINGDAY=Virkedag\n\n#XSEL: (legend)\nLR_DELETIONREQUESTED=Annullering \\u00F8nsket\n\n#XTIT\nLR_DELETION_REQ=Annulleringsforesp\\u00F8rsel\n\n#XTIT\nLR_CHANGE_REQ=Endringsforesp\\u00F8rsel\n\n#XTIT\nLR_CHANGE_PENDING=Venter p\\u00E5 endring\n\n#XTIT\nLR_CANCEL_PENDING=Venter p\\u00E5 annullering\n\n#XTIT\nLR_CHANGE_DONE=Endring godkjent\n\n#XTIT\nLR_CANCEL_DONE=Annullering godkjent\n\n#XTIT: Original\nLR_OLD_VERSION=Original\n\n#XTIT: Leave Changes\nLR_NEW_VERSION=Endret\n\n#XFLD: Label for Approver Selection\nLR_APPROVER=Godkjenner\n\n#XFLD: Label for Attendance/Absence Hours\nLR_ABS_HOURS=Fremm\\u00F8te-/frav\\u00E6rstimer\n\n#XFLD: Label for Attachments\nLR_ATTACHMENTS=Vedlegg\n\n#XFLD: Placeholder for Attachments\nLR_ATTACHMENT=Tilf\\u00F8y vedlegg\n\n#XFLD: Label for Start Time\nLR_START_TIME=Starttidspunkt\n\n#XFLD: Label for Start Time\nLR_END_TIME=Sluttidspunkt\n\n#YMSG: Error message to display, if the file upload fails\nLR_ATTACHMENT_ERROR=Kan ikke laste opp vedlegg\n\n#YMSG: warning message to show if the file type is not supported\nLR_ATTACHMENT_TYPECHECK=Vedleggstypen st\\u00F8ttes ikke\n\n#YMSG: Warning message to show if the file size exceeds 25MB- Mega Bytes\nLR_ATTACHMENT_SIZECHECK=Filst\\u00F8rrelsen er for stor. Velg en fil som er mindre enn 25 MB.\n\n#XFLD: Select Personnel Assignment Label\nPERSONAL_ASSIGN=Velg en ansettelseskontrakt\n\n#XTIT: Select Personnel Assignment Title\nPERSONAL_ASSIGN_TITLE=Ansettelseskontrakter\n\n#XFLD: Level for approver\nLR_LEVEL=Niv\\u00E5 {0}\n\n#YMSG: error message to display, if the maximum number of approvers reached\nLR_APPROVER_LEVEL_MAX=Du har allerede oppgitt maksimalt antall godkjennere\n',
	"hcm/myleaverequest/i18n/i18n_pl.properties":'\n#XTIT: Application name (shown in browser header bar or as browser tab title)\napp.Identity=Moje wnioski urlopowe\n\n#XTIT: title of the home view\nLR_TITLE_HOME_VIEW=Moje wnioski urlopowe\n\n#XTIT: title of the leave create view\nLR_TITLE_CREATE_VIEW=Wniosek o urlop\n\n#XTIT: title of the leave change view\nLR_TITLE_CHANGE_VIEW=Zmiana wniosku urlopowego\n\n#XTIT: title of the Entitlements view\nLR_TITLE_BALANCE_VIEW=Uprawnienia\n\n#XTIT: title of the leave History view\nLR_TITLE_HISTORY_VIEW=Historia\n\n#XTIT: title of the leave details view\nLR_TITLE_DETAILS_VIEW=Szczeg\\u00F3\\u0142y urlopu\n\n#XTIT: title of the leave requests\nLR_TITLE_LEAVE_REQUESTS=Wnioski urlopowe\n\n#XTIT: title of the leave request\nLR_TITLE_LEAVE_REQUEST=Wniosek urlopowy\n\n#XTIT: deductible\nLR_BALANCE_DEDUCTIBLE=Kategoria\n\n#XTIT: Balance\nLR_BALANCE_BALANCE=Dost\\u0119pne\n\n#XTIT: Used\nLR_BALANCE_USED=Wykorzystane\n\n#XTIT: Requested\nLR_BALANCE_REQUESTED=Wnioskowane\n\n#XTIT: Quota\nLR_BALANCE_QUOTA=Uprawnienia\n\n#XTIT: Entitlement\nLR_ENTITLEMENT_QUOTA=Uprawnienie\n\n#XTIT: Send leave request\nLR_TITLE_SEND=Wysy\\u0142anie wniosku urlopowego\n\n#XTIT: Cancel leave request\nLR_TITLE_WITHDRAW=Wycofanie wniosku urlopowego\n\n#XTIT: ATTENTION Tile text line break after 12 characters!\nLR_BALANCE_TILE=Uprawnienia\n\n#XTIT: ATTENTION Tile text line break after 12 characters!\nLR_HISTORY_TILE=Historia\n\n#XTIT: ATTENTION Tile text line break after 12 characters!\nLR_CREATE_LEAVE_TILE=Nowy wniosek urlopowy\n\n#XBUT\nLR_SHOW_HIST=Historia\n\n#XBUT\nLR_CREATE_LEAVE=Wniosek o urlop\n\n#XBUT: text for "send leave request" button\nLR_SEND=Wy\\u015Blij\n\n#XBUT: text for ok button \nLR_OK=OK\n\n#XBUT: text for reset button \nLR_RESET=Resetuj\n\n#XBUT: text for cancel button e.g. on the day range picker screen\nLR_CANCEL=Anuluj\n\n#XBUT: text for change button on the Leave Overview details screen\nLR_CHANGE=Zmie\\u0144\n\n#XBUT: text for cancel button on the Leave Overview details screen\nLR_WITHDRAW=Wycofaj\n\n#XSEL\nLR_UPDATED=Zaktualizowane\n\n#XFLD\nLR_NOTE=Notatka\n\n#XFLD\nLR_CUSTOM1=Pole u\\u017Cytkownika 1\n\n#XFLD: used vacation, lower case for status under calendar. Reads "X days [line feed] used"\nLR_BOOKED=wykorzystanych\n\n#XFLD: Available balance, lower case for status under calendar. Reads "X days [line feed] available"\nLR_REMAINING=dost\\u0119pnych\n\n#XFLD\nLR_LOWERCASE_DAYS=dni\n\n#XFLD\nLR_LOWERCASE_DAY=dzie\\u0144\n\n#XFLD\nLR_LOWERCASE_HOURS=godziny\n\n#XFLD\nLR_LOWERCASE_HOUR=godzina\n\n#XFLD\nLR_UP_TO=Wa\\u017Cne do\n\n#XFLD\nLR_FROM=Od\n\n#XFLD\nLR_TO=Do\n\n#XFLD\nLR_DEDUCTION=Potr\\u0105cenie\n\n#XFLD: Hyphen for Date Formatting\nLR_HYPHEN=-\n\n#XTIT: title of error dialog\nLR_PROBLEM=Wyst\\u0105pi\\u0142 problem\n\n#XTIT: title of confirmation dialog\nLR_CONFIRMATION=Potwierdzenie\n\n#YMSG\nLR_CONFIRMATIONMSG=Wys\\u0142a\\u0107 ten wniosek urlopowy do {0}?\n\n#YMSG\nLR_WITHDRAWNMSG=Czy chcesz wycofa\\u0107 ten wniosek urlopowy?\n\n#XFLD\nLR_DAYS=dni\n\n#XFLD\nLR_DAY=Dzie\\u0144\n\n#XFLD\nLR_HOURS=Godziny\n\n#XFLD\nLR_HOUR=Godzina\n\n#XFLD\nLR_REQUEST=Wnioskowane\n\n#XSEL: day type (legend)\nLR_DTYPE_TODAY=Dzisiaj\n\n#XSEL: day type (legend)\nLR_DTYPE_SELECTED=Wybrane dni\n\n#YMSG: processing\nLR_PROCESSING=Przetwarzanie...\n\n#YMSG\nLR_SUBMITDONE=Wys\\u0142ano wniosek urlopowy do {0}\n\n#YMSG\nLR_WITHDRAWDONE=Wycofano wniosek urlopowy\n\n#YMSG\nLR_AX_MODEL_NOT_REG=Wyst\\u0105pi\\u0142 b\\u0142\\u0105d techniczny\\n\\nSzczeg\\u00F3\\u0142y b\\u0142\\u0119du\\:\\nB\\u0142\\u0105d wewn\\u0119trzny; nie zarejestrowano modelu\n\n#YMSG\nLR_AX_PARSE_ERR=Wyst\\u0105pi\\u0142 b\\u0142\\u0105d techniczny\\n\\nSzczeg\\u00F3\\u0142y b\\u0142\\u0119du\\:\\nB\\u0142\\u0105d protoko\\u0142u; nie mo\\u017Cna by\\u0142o przeanalizowa\\u0107 sk\\u0142adni odpowiedzi HTTP\n\n#YMSG\nLR_DD_NO_APPROVER=Wyst\\u0105pi\\u0142 b\\u0142\\u0105d techniczny\\n\\nSzczeg\\u00F3\\u0142y b\\u0142\\u0119du\\:\\nB\\u0142\\u0105d protoko\\u0142u; brak nazwiska osoby zatwierdzaj\\u0105cej w odpowiedzi\n\n#YMSG\nLR_DD_NO_CFG=Wyst\\u0105pi\\u0142 b\\u0142\\u0105d techniczny\\n\\nSzczeg\\u00F3\\u0142y b\\u0142\\u0119du\\:\\nB\\u0142\\u0105d protoko\\u0142u; brak konfiguracji w odpowiedzi\n\n#YMSG\nLR_DD_NO_BALANCES=Wyst\\u0105pi\\u0142 b\\u0142\\u0105d techniczny\\n\\nSzczeg\\u00F3\\u0142y b\\u0142\\u0119du\\:\\nB\\u0142\\u0105d protoko\\u0142u; brak sald w odpowiedzi\n\n#YMSG\nLR_DD_PARSE_ERR=Wyst\\u0105pi\\u0142 b\\u0142\\u0105d techniczny\\n\\nSzczeg\\u00F3\\u0142y b\\u0142\\u0119du\\:\\nB\\u0142\\u0105d protoko\\u0142u; nie mo\\u017Cna by\\u0142o przeanalizowa\\u0107 sk\\u0142adni odpowiedzi\n\n#YMSG\nLR_DD_COMM_ERR=Wyst\\u0105pi\\u0142 b\\u0142\\u0105d po\\u0142\\u0105czenia\n\n#YMSG\nLR_DD_GENERIC_ERR=Wyst\\u0105pi\\u0142 b\\u0142\\u0105d\n\n#YMSG\nLR_CT_PARSE_ERR=Wyst\\u0105pi\\u0142 b\\u0142\\u0105d techniczny\\n\\nSzczeg\\u00F3\\u0142y b\\u0142\\u0119du\\:\\nB\\u0142\\u0105d protoko\\u0142u; nie mo\\u017Cna by\\u0142o przeanalizowa\\u0107 sk\\u0142adni odpowiedzi\n\n#XFLD\nLR_S1_PENDING=Oczekuje\n\n#YMSG\nLR_UNKNOWN=Nieznane\n\n#XSEL: (legend)\nLR_NONWORKING=Dzie\\u0144 wolny od pracy\n\n#XSEL: (legend)\nLR_APPROVELEAVE=Zatwierdzone\n\n#XSEL: (legend)\nLR_REJECTEDLEAVE=Odrzucone\n\n#XSEL: (legend)\nLR_APPROVEPENDING=Oczekuje na zatwierdzenie\n\n#XSEL: (legend)\nLR_PUBLICHOLIDAY=Dzie\\u0144 \\u015Bwi\\u0105teczny\n\n#XSEL: (legend)\nLR_WORKINGDAY=Dzie\\u0144 roboczy\n\n#XSEL: (legend)\nLR_DELETIONREQUESTED=Za\\u017C\\u0105dano anulowania\n\n#XTIT\nLR_DELETION_REQ=\\u017B\\u0105danie anulowania\n\n#XTIT\nLR_CHANGE_REQ=Wniosek o zmian\\u0119\n\n#XTIT\nLR_CHANGE_PENDING=Zmiana oczekuje\n\n#XTIT\nLR_CANCEL_PENDING=Anulowanie oczekuje\n\n#XTIT\nLR_CHANGE_DONE=Zatwierdzono zmian\\u0119\n\n#XTIT\nLR_CANCEL_DONE=Zatwierdzono anulowanie\n\n#XTIT: Original\nLR_OLD_VERSION=Oryginalne\n\n#XTIT: Leave Changes\nLR_NEW_VERSION=Zmienione\n\n#XFLD: Label for Approver Selection\nLR_APPROVER=Osoba zatwierdzaj\\u0105ca\n\n#XFLD: Label for Attendance/Absence Hours\nLR_ABS_HOURS=Godziny obecno\\u015Bci/nieobecno\\u015Bci\n\n#XFLD: Label for Attachments\nLR_ATTACHMENTS=Za\\u0142\\u0105czniki\n\n#XFLD: Placeholder for Attachments\nLR_ATTACHMENT=Dodaj za\\u0142\\u0105cznik\n\n#XFLD: Label for Start Time\nLR_START_TIME=Czas rozpocz\\u0119cia\n\n#XFLD: Label for Start Time\nLR_END_TIME=Czas zako\\u0144czenia\n\n#YMSG: Error message to display, if the file upload fails\nLR_ATTACHMENT_ERROR=Nie mo\\u017Cna by\\u0142o wczyta\\u0107 za\\u0142\\u0105cznika\n\n#YMSG: warning message to show if the file type is not supported\nLR_ATTACHMENT_TYPECHECK=Ten typ za\\u0142\\u0105cznika nie jest obs\\u0142ugiwany\n\n#YMSG: Warning message to show if the file size exceeds 25MB- Mega Bytes\nLR_ATTACHMENT_SIZECHECK=Za du\\u017Cy rozmiar pliku. Wybierz plik mniejszy ni\\u017C 25 MB.\n\n#XFLD: Select Personnel Assignment Label\nPERSONAL_ASSIGN=Wybierz umow\\u0119 o prac\\u0119\n\n#XTIT: Select Personnel Assignment Title\nPERSONAL_ASSIGN_TITLE=Umowy o prac\\u0119\n\n#XFLD: Level for approver\nLR_LEVEL=Poziom {0}\n\n#YMSG: error message to display, if the maximum number of approvers reached\nLR_APPROVER_LEVEL_MAX=Wprowadzono ju\\u017C maksymaln\\u0105 liczb\\u0119 os\\u00F3b zatwierdzaj\\u0105cych\n',
	"hcm/myleaverequest/i18n/i18n_pt.properties":'\n#XTIT: Application name (shown in browser header bar or as browser tab title)\napp.Identity=Minhas solicita\\u00E7\\u00F5es de aus\\u00EAncia\n\n#XTIT: title of the home view\nLR_TITLE_HOME_VIEW=Minhas solicita\\u00E7\\u00F5es de aus\\u00EAncia\n\n#XTIT: title of the leave create view\nLR_TITLE_CREATE_VIEW=Solicitar aus\\u00EAncia\n\n#XTIT: title of the leave change view\nLR_TITLE_CHANGE_VIEW=Modificar solicita\\u00E7\\u00E3o de aus\\u00EAncia\n\n#XTIT: title of the Entitlements view\nLR_TITLE_BALANCE_VIEW=Direitos\n\n#XTIT: title of the leave History view\nLR_TITLE_HISTORY_VIEW=Hist\\u00F3rico\n\n#XTIT: title of the leave details view\nLR_TITLE_DETAILS_VIEW=Detalhes de aus\\u00EAncia\n\n#XTIT: title of the leave requests\nLR_TITLE_LEAVE_REQUESTS=Solicita\\u00E7\\u00F5es aus\\u00EAncia\n\n#XTIT: title of the leave request\nLR_TITLE_LEAVE_REQUEST=Solicita\\u00E7\\u00E3o de aus\\u00EAncia\n\n#XTIT: deductible\nLR_BALANCE_DEDUCTIBLE=Categoria\n\n#XTIT: Balance\nLR_BALANCE_BALANCE=Dispon\\u00EDvel\n\n#XTIT: Used\nLR_BALANCE_USED=Utilizado\n\n#XTIT: Requested\nLR_BALANCE_REQUESTED=Solicitado\n\n#XTIT: Quota\nLR_BALANCE_QUOTA=Direitos\n\n#XTIT: Entitlement\nLR_ENTITLEMENT_QUOTA=Direito\n\n#XTIT: Send leave request\nLR_TITLE_SEND=Enviar solicita\\u00E7\\u00E3o de aus\\u00EAncia\n\n#XTIT: Cancel leave request\nLR_TITLE_WITHDRAW=Estornar solicita\\u00E7\\u00E3o de aus\\u00EAncia\n\n#XTIT: ATTENTION Tile text line break after 12 characters!\nLR_BALANCE_TILE=Direitos\n\n#XTIT: ATTENTION Tile text line break after 12 characters!\nLR_HISTORY_TILE=Hist\\u00F3rico\n\n#XTIT: ATTENTION Tile text line break after 12 characters!\nLR_CREATE_LEAVE_TILE=Criar solicita\\u00E7\\u00E3o de aus\\u00EAncia\n\n#XBUT\nLR_SHOW_HIST=Hist\\u00F3rico\n\n#XBUT\nLR_CREATE_LEAVE=Solicitar aus\\u00EAncia\n\n#XBUT: text for "send leave request" button\nLR_SEND=Enviar\n\n#XBUT: text for ok button \nLR_OK=OK\n\n#XBUT: text for reset button \nLR_RESET=Reinicializar\n\n#XBUT: text for cancel button e.g. on the day range picker screen\nLR_CANCEL=Anular\n\n#XBUT: text for change button on the Leave Overview details screen\nLR_CHANGE=Modificar\n\n#XBUT: text for cancel button on the Leave Overview details screen\nLR_WITHDRAW=Estornar\n\n#XSEL\nLR_UPDATED=Atualizada\n\n#XFLD\nLR_NOTE=Nota\n\n#XFLD\nLR_CUSTOM1=Campo personalizado 1\n\n#XFLD: used vacation, lower case for status under calendar. Reads "X days [line feed] used"\nLR_BOOKED=gozados\n\n#XFLD: Available balance, lower case for status under calendar. Reads "X days [line feed] available"\nLR_REMAINING=dispon\\u00EDveis\n\n#XFLD\nLR_LOWERCASE_DAYS=dias\n\n#XFLD\nLR_LOWERCASE_DAY=dia\n\n#XFLD\nLR_LOWERCASE_HOURS=horas\n\n#XFLD\nLR_LOWERCASE_HOUR=hora\n\n#XFLD\nLR_UP_TO=V\\u00E1lido at\\u00E9\n\n#XFLD\nLR_FROM=De\n\n#XFLD\nLR_TO=A\n\n#XFLD\nLR_DEDUCTION=Dedu\\u00E7\\u00E3o\n\n#XFLD: Hyphen for Date Formatting\nLR_HYPHEN=-\n\n#XTIT: title of error dialog\nLR_PROBLEM=Ocorreu um problema\n\n#XTIT: title of confirmation dialog\nLR_CONFIRMATION=Confirma\\u00E7\\u00E3o\n\n#YMSG\nLR_CONFIRMATIONMSG=Enviar essa solicita\\u00E7\\u00E3o de aus\\u00EAncia para {0}?\n\n#YMSG\nLR_WITHDRAWNMSG=Estornar essa solicita\\u00E7\\u00E3o de aus\\u00EAncia?\n\n#XFLD\nLR_DAYS=Dias\n\n#XFLD\nLR_DAY=Dia\n\n#XFLD\nLR_HOURS=Horas\n\n#XFLD\nLR_HOUR=Hora\n\n#XFLD\nLR_REQUEST=Solicitada\n\n#XSEL: day type (legend)\nLR_DTYPE_TODAY=Hoje\n\n#XSEL: day type (legend)\nLR_DTYPE_SELECTED=Dia(s) selecionado(s)\n\n#YMSG: processing\nLR_PROCESSING=Processando...\n\n#YMSG\nLR_SUBMITDONE=Sua solicita\\u00E7\\u00E3o de aus\\u00EAncia foi enviada para {0}\n\n#YMSG\nLR_WITHDRAWDONE=Sua solicita\\u00E7\\u00E3o de aus\\u00EAncia foi estornada\n\n#YMSG\nLR_AX_MODEL_NOT_REG=Ocorreu um problema t\\u00E9cnico\\n\\nDetalhes do erro\\:\\nErro interno; modelo n\\u00E3o registrado\n\n#YMSG\nLR_AX_PARSE_ERR=Ocorreu um problema t\\u00E9cnico\\n\\nDetalhes do erro\\:\\nErro de protocolo; n\\u00E3o foi poss\\u00EDvel analisar resposta HTTP\n\n#YMSG\nLR_DD_NO_APPROVER=Ocorreu um problema t\\u00E9cnico\\n\\nDetalhes do erro\\:\\nErro de protocolo; falta nome do autorizador na resposta\n\n#YMSG\nLR_DD_NO_CFG=Ocorreu um problema t\\u00E9cnico\\n\\nDetalhes do erro\\:\\nErro de protocolo; falta configura\\u00E7\\u00E3o na resposta\n\n#YMSG\nLR_DD_NO_BALANCES=Ocorreu um problema t\\u00E9cnico\\n\\nDetalhes do erro\\:\\nErro de protocolo; faltam saldos na resposta\n\n#YMSG\nLR_DD_PARSE_ERR=Ocorreu um problema t\\u00E9cnico\\n\\nDetalhes do erro\\:\\nErro de protocolo; n\\u00E3o foi poss\\u00EDvel analisar resposta\n\n#YMSG\nLR_DD_COMM_ERR=Ocorreu um problema com sua conex\\u00E3o\n\n#YMSG\nLR_DD_GENERIC_ERR=Ocorreu um erro\n\n#YMSG\nLR_CT_PARSE_ERR=Ocorreu um problema t\\u00E9cnico\\n\\nDetalhes do erro\\:\\nErro de protocolo; n\\u00E3o foi poss\\u00EDvel analisar resposta\n\n#XFLD\nLR_S1_PENDING=Pendente\n\n#YMSG\nLR_UNKNOWN=Desconhecida\n\n#XSEL: (legend)\nLR_NONWORKING=Dia livre\n\n#XSEL: (legend)\nLR_APPROVELEAVE=Aprovada\n\n#XSEL: (legend)\nLR_REJECTEDLEAVE=Rejeitada\n\n#XSEL: (legend)\nLR_APPROVEPENDING=Aprova\\u00E7\\u00E3o pendente\n\n#XSEL: (legend)\nLR_PUBLICHOLIDAY=Feriado\n\n#XSEL: (legend)\nLR_WORKINGDAY=Dia \\u00FAtil\n\n#XSEL: (legend)\nLR_DELETIONREQUESTED=Cancelamento solicitado\n\n#XTIT\nLR_DELETION_REQ=Solicita\\u00E7\\u00E3o de cancelamento\n\n#XTIT\nLR_CHANGE_REQ=Modificar solicita\\u00E7\\u00E3o\n\n#XTIT\nLR_CHANGE_PENDING=Modificar pendente\n\n#XTIT\nLR_CANCEL_PENDING=Cancelamento pendente\n\n#XTIT\nLR_CHANGE_DONE=Modifica\\u00E7\\u00E3o aprovada\n\n#XTIT\nLR_CANCEL_DONE=Cancelamento aprovado\n\n#XTIT: Original\nLR_OLD_VERSION=Original\n\n#XTIT: Leave Changes\nLR_NEW_VERSION=Modificada\n\n#XFLD: Label for Approver Selection\nLR_APPROVER=Autorizador\n\n#XFLD: Label for Attendance/Absence Hours\nLR_ABS_HOURS=Horas de presen\\u00E7a/aus\\u00EAncia\n\n#XFLD: Label for Attachments\nLR_ATTACHMENTS=Anexos\n\n#XFLD: Placeholder for Attachments\nLR_ATTACHMENT=Adicionar anexo\n\n#XFLD: Label for Start Time\nLR_START_TIME=Hora de in\\u00EDcio\n\n#XFLD: Label for Start Time\nLR_END_TIME=Hora de fim\n\n#YMSG: Error message to display, if the file upload fails\nLR_ATTACHMENT_ERROR=Imposs\\u00EDvel carregar o anexo\n\n#YMSG: warning message to show if the file type is not supported\nLR_ATTACHMENT_TYPECHECK=Tipo de anexo n\\u00E3o suportado\n\n#YMSG: Warning message to show if the file size exceeds 25MB- Mega Bytes\nLR_ATTACHMENT_SIZECHECK=Tamanho do arquivo \\u00E9 muito grande. Selecione um arquivo com menos de 25MB de tamanho.\n\n#XFLD: Select Personnel Assignment Label\nPERSONAL_ASSIGN=Selecionar um contrato de emprego\n\n#XTIT: Select Personnel Assignment Title\nPERSONAL_ASSIGN_TITLE=Contratos de emprego\n\n#XFLD: Level for approver\nLR_LEVEL=N\\u00EDvel {0}\n\n#YMSG: error message to display, if the maximum number of approvers reached\nLR_APPROVER_LEVEL_MAX=Voc\\u00EA j\\u00E1 inseriu o n\\u00BA m\\u00E1ximo de autorizadores.\n',
	"hcm/myleaverequest/i18n/i18n_ro.properties":'\n#XTIT: Application name (shown in browser header bar or as browser tab title)\napp.Identity=Cererile mele de concediu\n\n#XTIT: title of the home view\nLR_TITLE_HOME_VIEW=Cererile mele de concediu\n\n#XTIT: title of the leave create view\nLR_TITLE_CREATE_VIEW=Cerere de concediu\n\n#XTIT: title of the leave change view\nLR_TITLE_CHANGE_VIEW=Modificare cerere de concediu\n\n#XTIT: title of the Entitlements view\nLR_TITLE_BALANCE_VIEW=Drepturi\n\n#XTIT: title of the leave History view\nLR_TITLE_HISTORY_VIEW=Istoric\n\n#XTIT: title of the leave details view\nLR_TITLE_DETAILS_VIEW=Detalii concediu\n\n#XTIT: title of the leave requests\nLR_TITLE_LEAVE_REQUESTS=Cereri de concediu\n\n#XTIT: title of the leave request\nLR_TITLE_LEAVE_REQUEST=Cerere de concediu\n\n#XTIT: deductible\nLR_BALANCE_DEDUCTIBLE=Categorie\n\n#XTIT: Balance\nLR_BALANCE_BALANCE=Disponibil\n\n#XTIT: Used\nLR_BALANCE_USED=Utilizat\n\n#XTIT: Requested\nLR_BALANCE_REQUESTED=Solicitat\n\n#XTIT: Quota\nLR_BALANCE_QUOTA=Drepturi\n\n#XTIT: Entitlement\nLR_ENTITLEMENT_QUOTA=Drept\n\n#XTIT: Send leave request\nLR_TITLE_SEND=Expediere cerere de concediu\n\n#XTIT: Cancel leave request\nLR_TITLE_WITHDRAW=Retragere cerere de concediu\n\n#XTIT: ATTENTION Tile text line break after 12 characters!\nLR_BALANCE_TILE=Drepturi\n\n#XTIT: ATTENTION Tile text line break after 12 characters!\nLR_HISTORY_TILE=Istoric\n\n#XTIT: ATTENTION Tile text line break after 12 characters!\nLR_CREATE_LEAVE_TILE=Creare cerere de concediu\n\n#XBUT\nLR_SHOW_HIST=Istoric\n\n#XBUT\nLR_CREATE_LEAVE=Cerere de concediu\n\n#XBUT: text for "send leave request" button\nLR_SEND=Expediere\n\n#XBUT: text for ok button \nLR_OK=OK\n\n#XBUT: text for reset button \nLR_RESET=Resetare\n\n#XBUT: text for cancel button e.g. on the day range picker screen\nLR_CANCEL=Anulare\n\n#XBUT: text for change button on the Leave Overview details screen\nLR_CHANGE=Modificare\n\n#XBUT: text for cancel button on the Leave Overview details screen\nLR_WITHDRAW=Retragere\n\n#XSEL\nLR_UPDATED=Actualizat\n\n#XFLD\nLR_NOTE=Not\\u0103\n\n#XFLD\nLR_CUSTOM1=C\\u00E2mp 1 definit de utilizator\n\n#XFLD: used vacation, lower case for status under calendar. Reads "X days [line feed] used"\nLR_BOOKED=utilizat\n\n#XFLD: Available balance, lower case for status under calendar. Reads "X days [line feed] available"\nLR_REMAINING=disponibil\n\n#XFLD\nLR_LOWERCASE_DAYS=zile\n\n#XFLD\nLR_LOWERCASE_DAY=zi\n\n#XFLD\nLR_LOWERCASE_HOURS=ore\n\n#XFLD\nLR_LOWERCASE_HOUR=or\\u0103\n\n#XFLD\nLR_UP_TO=Valabil p\\u00E2n\\u0103 la\n\n#XFLD\nLR_FROM=De la\n\n#XFLD\nLR_TO=P\\u00E2n\\u0103 la\n\n#XFLD\nLR_DEDUCTION=Deducere\n\n#XFLD: Hyphen for Date Formatting\nLR_HYPHEN=-\n\n#XTIT: title of error dialog\nLR_PROBLEM=A ap\\u0103rut o problem\\u0103\n\n#XTIT: title of confirmation dialog\nLR_CONFIRMATION=Confirmare\n\n#YMSG\nLR_CONFIRMATIONMSG=Expedia\\u0163i aceast\\u0103 cerere de concediu la {0}?\n\n#YMSG\nLR_WITHDRAWNMSG=Dori\\u0163i s\\u0103 retrage\\u0163i aceast\\u0103 cerere de concediu?\n\n#XFLD\nLR_DAYS=zile\n\n#XFLD\nLR_DAY=Zi\n\n#XFLD\nLR_HOURS=Ore\n\n#XFLD\nLR_HOUR=Or\\u0103\n\n#XFLD\nLR_REQUEST=Solicitat\n\n#XSEL: day type (legend)\nLR_DTYPE_TODAY=Ast\\u0103zi\n\n#XSEL: day type (legend)\nLR_DTYPE_SELECTED=Zi(le) selectat\\u0103(e)\n\n#YMSG: processing\nLR_PROCESSING=Prelucrare...\n\n#YMSG\nLR_SUBMITDONE=Cererea dvs. de concediu a fost expediat\\u0103 la {0}\n\n#YMSG\nLR_WITHDRAWDONE=Cererea dvs.de concediu a fost retras\\u0103\n\n#YMSG\nLR_AX_MODEL_NOT_REG=A ap\\u0103rut o problem\\u0103 tehnic\\u0103\\n\\nDetalii eroare\\:\\nEroare intern\\u0103; model ne\\u00EEnregistrat\n\n#YMSG\nLR_AX_PARSE_ERR=A ap\\u0103rut o problem\\u0103 tehnic\\u0103\\n\\nDetalii eroare\\:\\nEroare de protocol; imposibil de analizat sintactic r\\u0103spuns HTTP\n\n#YMSG\nLR_DD_NO_APPROVER=A ap\\u0103rut o problem\\u0103 tehnic\\u0103\\n\\nDetalii eroare\\:\\nEroare de protocol; nume aprobator lipse\\u015Fte \\u00EEn r\\u0103spuns\n\n#YMSG\nLR_DD_NO_CFG=A ap\\u0103rut o problem\\u0103 tehnic\\u0103\\n\\nDetalii eroare\\:\\nEroare de protocol; configurare lipse\\u015Fte \\u00EEn r\\u0103spuns\n\n#YMSG\nLR_DD_NO_BALANCES=A ap\\u0103rut o problem\\u0103 tehnic\\u0103\\n\\nDetalii eroare\\:\\nEroare de protocol; solduri lipsesc \\u00EEn r\\u0103spuns\n\n#YMSG\nLR_DD_PARSE_ERR=A ap\\u0103rut o problem\\u0103 tehnic\\u0103\\n\\nDetalii eroare\\:\\nEroare de protocol; imposibil de analizat sintactic r\\u0103spuns\n\n#YMSG\nLR_DD_COMM_ERR=A ap\\u0103rut o problem\\u0103 cu conexiunea dvs.\n\n#YMSG\nLR_DD_GENERIC_ERR=A ap\\u0103rut o eroare\n\n#YMSG\nLR_CT_PARSE_ERR=A ap\\u0103rut o problem\\u0103 tehnic\\u0103\\n\\nDetalii eroare\\:\\nEroare de protocol; imposibil de analizat sintactic r\\u0103spuns\n\n#XFLD\nLR_S1_PENDING=\\u00CEn a\\u015Fteptare\n\n#YMSG\nLR_UNKNOWN=Necunoscut\n\n#XSEL: (legend)\nLR_NONWORKING=Zi nelucr\\u0103toare\n\n#XSEL: (legend)\nLR_APPROVELEAVE=Aprobat\n\n#XSEL: (legend)\nLR_REJECTEDLEAVE=Respins\n\n#XSEL: (legend)\nLR_APPROVEPENDING=Aprobare \\u00EEn a\\u015Fteptare\n\n#XSEL: (legend)\nLR_PUBLICHOLIDAY=S\\u0103rb\\u0103toare legal\\u0103\n\n#XSEL: (legend)\nLR_WORKINGDAY=Zi lucr\\u0103toare\n\n#XSEL: (legend)\nLR_DELETIONREQUESTED=Anulare solicitat\\u0103\n\n#XTIT\nLR_DELETION_REQ=Cerere de anulare\n\n#XTIT\nLR_CHANGE_REQ=Modificare cerere\n\n#XTIT\nLR_CHANGE_PENDING=Modificare \\u00EEn a\\u015Fteptare\n\n#XTIT\nLR_CANCEL_PENDING=Anulare \\u00EEn a\\u015Fteptare\n\n#XTIT\nLR_CHANGE_DONE=Modificare aprobat\\u0103\n\n#XTIT\nLR_CANCEL_DONE=Anulare aprobat\\u0103\n\n#XTIT: Original\nLR_OLD_VERSION=Original\n\n#XTIT: Leave Changes\nLR_NEW_VERSION=Modificat\n\n#XFLD: Label for Approver Selection\nLR_APPROVER=Aprobator\n\n#XFLD: Label for Attendance/Absence Hours\nLR_ABS_HOURS=Ore prezen\\u0163\\u0103/absen\\u0163\\u0103\n\n#XFLD: Label for Attachments\nLR_ATTACHMENTS=Anexe\n\n#XFLD: Placeholder for Attachments\nLR_ATTACHMENT=Ad\\u0103ugare anex\\u0103\n\n#XFLD: Label for Start Time\nLR_START_TIME=Or\\u0103 de \\u00EEnceput\n\n#XFLD: Label for Start Time\nLR_END_TIME=Or\\u0103 de sf\\u00E2r\\u015Fit\n\n#YMSG: Error message to display, if the file upload fails\nLR_ATTACHMENT_ERROR=Imposibil de \\u00EEnc\\u0103rcat anexa\n\n#YMSG: warning message to show if the file type is not supported\nLR_ATTACHMENT_TYPECHECK=Acest tip de anex\\u0103 nu este suportat\n\n#YMSG: Warning message to show if the file size exceeds 25MB- Mega Bytes\nLR_ATTACHMENT_SIZECHECK=M\\u0103rime fi\\u015Fier este prea mare. Selecta\\u0163i un fi\\u015Fier cu o m\\u0103rime mai mic\\u0103 de 25 MB.\n\n#XFLD: Select Personnel Assignment Label\nPERSONAL_ASSIGN=Alege\\u0163i un contract de munc\\u0103\n\n#XTIT: Select Personnel Assignment Title\nPERSONAL_ASSIGN_TITLE=Contracte de munc\\u0103\n\n#XFLD: Level for approver\nLR_LEVEL=Nivel {0}\n\n#YMSG: error message to display, if the maximum number of approvers reached\nLR_APPROVER_LEVEL_MAX=A\\u0163i introdus deja num\\u0103rul maxim de aprobatori.\n',
	"hcm/myleaverequest/i18n/i18n_ru.properties":'\n#XTIT: Application name (shown in browser header bar or as browser tab title)\napp.Identity=\\u041C\\u043E\\u0438 \\u0437\\u0430\\u044F\\u0432\\u043A\\u0438 \\u043D\\u0430 \\u043E\\u0442\\u043F\\u0443\\u0441\\u043A\n\n#XTIT: title of the home view\nLR_TITLE_HOME_VIEW=\\u041C\\u043E\\u0438 \\u0437\\u0430\\u044F\\u0432\\u043A\\u0438 \\u043D\\u0430 \\u043E\\u0442\\u043F\\u0443\\u0441\\u043A\n\n#XTIT: title of the leave create view\nLR_TITLE_CREATE_VIEW=\\u0417\\u0430\\u043F\\u0440\\u043E\\u0441\\u0438\\u0442\\u044C \\u043E\\u0442\\u043F\\u0443\\u0441\\u043A\n\n#XTIT: title of the leave change view\nLR_TITLE_CHANGE_VIEW=\\u0418\\u0437\\u043C\\u0435\\u043D\\u0438\\u0442\\u044C \\u0437\\u0430\\u044F\\u0432\\u043A\\u0443\n\n#XTIT: title of the Entitlements view\nLR_TITLE_BALANCE_VIEW=\\u041F\\u0440\\u0430\\u0432\\u0430\n\n#XTIT: title of the leave History view\nLR_TITLE_HISTORY_VIEW=\\u0418\\u0441\\u0442\\u043E\\u0440\\u0438\\u044F\n\n#XTIT: title of the leave details view\nLR_TITLE_DETAILS_VIEW=\\u041E\\u0442\\u043F\\u0443\\u0441\\u043A \\u043F\\u043E\\u0434\\u0440\\u043E\\u0431\\u043D\\u043E\n\n#XTIT: title of the leave requests\nLR_TITLE_LEAVE_REQUESTS=\\u0417\\u0430\\u044F\\u0432\\u043A\\u0438 \\u043D\\u0430 \\u043E\\u0442\\u043F\\u0443\\u0441\\u043A\n\n#XTIT: title of the leave request\nLR_TITLE_LEAVE_REQUEST=\\u0417\\u0430\\u044F\\u0432\\u043A\\u0430 \\u043D\\u0430 \\u043E\\u0442\\u043F\\u0443\\u0441\\u043A\n\n#XTIT: deductible\nLR_BALANCE_DEDUCTIBLE=\\u041A\\u0430\\u0442\\u0435\\u0433\\u043E\\u0440\\u0438\\u044F\n\n#XTIT: Balance\nLR_BALANCE_BALANCE=\\u0414\\u043E\\u0441\\u0442\\u0443\\u043F\\u043D\\u043E\n\n#XTIT: Used\nLR_BALANCE_USED=\\u0418\\u0441\\u043F\\u043E\\u043B\\u044C\\u0437\\u043E\\u0432\\u0430\\u043D\\u043E\n\n#XTIT: Requested\nLR_BALANCE_REQUESTED=\\u0417\\u0430\\u043F\\u0440\\u043E\\u0448\\u0435\\u043D\\u043E\n\n#XTIT: Quota\nLR_BALANCE_QUOTA=\\u041F\\u0440\\u0430\\u0432\\u0430\n\n#XTIT: Entitlement\nLR_ENTITLEMENT_QUOTA=\\u041F\\u0440\\u0430\\u0432\\u043E\n\n#XTIT: Send leave request\nLR_TITLE_SEND=\\u041E\\u0442\\u043F\\u0440\\u0430\\u0432\\u0438\\u0442\\u044C \\u0437\\u0430\\u044F\\u0432\\u043A\\u0443 \\u043D\\u0430 \\u043E\\u0442\\u043F\\u0443\\u0441\\u043A\n\n#XTIT: Cancel leave request\nLR_TITLE_WITHDRAW=\\u041E\\u0442\\u043E\\u0437\\u0432\\u0430\\u0442\\u044C \\u0437\\u0430\\u044F\\u0432\\u043A\\u0443\n\n#XTIT: ATTENTION Tile text line break after 12 characters!\nLR_BALANCE_TILE=\\u041F\\u0440\\u0430\\u0432\\u0430\n\n#XTIT: ATTENTION Tile text line break after 12 characters!\nLR_HISTORY_TILE=\\u0418\\u0441\\u0442\\u043E\\u0440\\u0438\\u044F\n\n#XTIT: ATTENTION Tile text line break after 12 characters!\nLR_CREATE_LEAVE_TILE=\\u0421\\u043E\\u0437\\u0434\\u0430\\u0442\\u044C \\u0437\\u0430\\u044F\\u0432\\u043A\\u0443 \\u043D\\u0430 \\u043E\\u0442\\u043F\\u0443\\u0441\\u043A\n\n#XBUT\nLR_SHOW_HIST=\\u0418\\u0441\\u0442\\u043E\\u0440\\u0438\\u044F\n\n#XBUT\nLR_CREATE_LEAVE=\\u0417\\u0430\\u043F\\u0440\\u043E\\u0441\\u0438\\u0442\\u044C \\u043E\\u0442\\u043F\\u0443\\u0441\\u043A\n\n#XBUT: text for "send leave request" button\nLR_SEND=\\u041E\\u0442\\u043F\\u0440\\u0430\\u0432\\u0438\\u0442\\u044C\n\n#XBUT: text for ok button \nLR_OK=\\u041E\\u041A\n\n#XBUT: text for reset button \nLR_RESET=\\u0421\\u0431\\u0440\\u043E\\u0441\\u0438\\u0442\\u044C\n\n#XBUT: text for cancel button e.g. on the day range picker screen\nLR_CANCEL=\\u041E\\u0442\\u043C\\u0435\\u043D\\u0438\\u0442\\u044C\n\n#XBUT: text for change button on the Leave Overview details screen\nLR_CHANGE=\\u0418\\u0437\\u043C\\u0435\\u043D\\u0438\\u0442\\u044C\n\n#XBUT: text for cancel button on the Leave Overview details screen\nLR_WITHDRAW=\\u041E\\u0442\\u043E\\u0437\\u0432\\u0430\\u0442\\u044C\n\n#XSEL\nLR_UPDATED=\\u041E\\u0431\\u043D\\u043E\\u0432\\u043B\\u0435\\u043D\\u043E\n\n#XFLD\nLR_NOTE=\\u041F\\u0440\\u0438\\u043C\\u0435\\u0447\\u0430\\u043D\\u0438\\u0435\n\n#XFLD\nLR_CUSTOM1=\\u041F\\u043E\\u043B\\u0435 \\u043A\\u043B\\u0438\\u0435\\u043D\\u0442\\u0430 1\n\n#XFLD: used vacation, lower case for status under calendar. Reads "X days [line feed] used"\nLR_BOOKED=\\u0438\\u0441\\u043F\\u043E\\u043B\\u044C\\u0437\\u043E\\u0432\\u0430\\u043D\\u043E\n\n#XFLD: Available balance, lower case for status under calendar. Reads "X days [line feed] available"\nLR_REMAINING=\\u0434\\u043E\\u0441\\u0442\\u0443\\u043F\\u043D\\u043E\n\n#XFLD\nLR_LOWERCASE_DAYS=\\u0434\\u043D.\n\n#XFLD\nLR_LOWERCASE_DAY=\\u0434\\u0435\\u043D\\u044C\n\n#XFLD\nLR_LOWERCASE_HOURS=\\u0447.\n\n#XFLD\nLR_LOWERCASE_HOUR=\\u0447\\u0430\\u0441\n\n#XFLD\nLR_UP_TO=\\u0414\\u0435\\u0439\\u0441\\u0442\\u0432\\u0438\\u0442\\u0435\\u043B\\u044C\\u043D\\u043E \\u043F\\u043E\n\n#XFLD\nLR_FROM=\\u0421\n\n#XFLD\nLR_TO=\\u041F\\u043E\n\n#XFLD\nLR_DEDUCTION=\\u0412\\u044B\\u0447\\u0435\\u0442\n\n#XFLD: Hyphen for Date Formatting\nLR_HYPHEN=-\n\n#XTIT: title of error dialog\nLR_PROBLEM=\\u0412\\u043E\\u0437\\u043D\\u0438\\u043A\\u043B\\u0430 \\u043F\\u0440\\u043E\\u0431\\u043B\\u0435\\u043C\\u0430\n\n#XTIT: title of confirmation dialog\nLR_CONFIRMATION=\\u041F\\u043E\\u0434\\u0442\\u0432\\u0435\\u0440\\u0436\\u0434\\u0435\\u043D\\u0438\\u0435\n\n#YMSG\nLR_CONFIRMATIONMSG=\\u041E\\u0442\\u043F\\u0440\\u0430\\u0432\\u0438\\u0442\\u044C \\u0437\\u0430\\u044F\\u0432\\u043A\\u0443 \\u043D\\u0430 \\u043E\\u0442\\u043F\\u0443\\u0441\\u043A {0}?\n\n#YMSG\nLR_WITHDRAWNMSG=\\u041E\\u0442\\u043E\\u0437\\u0432\\u0430\\u0442\\u044C \\u044D\\u0442\\u0443 \\u0437\\u0430\\u044F\\u0432\\u043A\\u0443 \\u043D\\u0430 \\u043E\\u0442\\u043F\\u0443\\u0441\\u043A?\n\n#XFLD\nLR_DAYS=\\u0434\\u043D.\n\n#XFLD\nLR_DAY=\\u0434\\u0435\\u043D\\u044C\n\n#XFLD\nLR_HOURS=\\u0447.\n\n#XFLD\nLR_HOUR=\\u0447\\u0430\\u0441\n\n#XFLD\nLR_REQUEST=\\u0417\\u0430\\u043F\\u0440\\u043E\\u0448\\u0435\\u043D\\u043E\n\n#XSEL: day type (legend)\nLR_DTYPE_TODAY=\\u0421\\u0435\\u0433\\u043E\\u0434\\u043D\\u044F\n\n#XSEL: day type (legend)\nLR_DTYPE_SELECTED=\\u0412\\u044B\\u0431\\u0440\\u0430\\u043D\\u043D\\u044B\\u0439 \\u0434\\u0435\\u043D\\u044C(\\u0434\\u043D\\u0438)\n\n#YMSG: processing\nLR_PROCESSING=\\u041E\\u0431\\u0440\\u0430\\u0431\\u043E\\u0442\\u043A\\u0430...\n\n#YMSG\nLR_SUBMITDONE=\\u0417\\u0430\\u044F\\u0432\\u043A\\u0430 \\u043D\\u0430 \\u043E\\u0442\\u043F\\u0443\\u0441\\u043A \\u043E\\u0442\\u043F\\u0440\\u0430\\u0432\\u043B\\u0435\\u043D\\u0430 {0}\n\n#YMSG\nLR_WITHDRAWDONE=\\u0412\\u0430\\u0448\\u0430 \\u0437\\u0430\\u044F\\u0432\\u043A\\u0430 \\u043D\\u0430 \\u043E\\u0442\\u043F\\u0443\\u0441\\u043A \\u043E\\u0442\\u043E\\u0437\\u0432\\u0430\\u043D\\u0430\n\n#YMSG\nLR_AX_MODEL_NOT_REG=\\u0412\\u043E\\u0437\\u043D\\u0438\\u043A\\u043B\\u0430 \\u0442\\u0435\\u0445\\u043D\\u0438\\u0447\\u0435\\u0441\\u043A\\u0430\\u044F \\u043F\\u0440\\u043E\\u0431\\u043B\\u0435\\u043C\\u0430\\n\\n\\u041F\\u043E\\u0434\\u0440\\u043E\\u0431\\u043D\\u043E\\u0441\\u0442\\u0438\\:\\n\\u0412\\u043D\\u0443\\u0442\\u0440\\u0435\\u043D\\u043D\\u044F\\u044F \\u043E\\u0448\\u0438\\u0431\\u043A\\u0430, \\u043C\\u043E\\u0434\\u0435\\u043B\\u044C \\u043D\\u0435 \\u0437\\u0430\\u0440\\u0435\\u0433\\u0438\\u0441\\u0442\\u0440\\u0438\\u0440\\u043E\\u0432\\u0430\\u043D\\u0430\n\n#YMSG\nLR_AX_PARSE_ERR=\\u0412\\u043E\\u0437\\u043D\\u0438\\u043A\\u043B\\u0430 \\u0442\\u0435\\u0445\\u043D\\u0438\\u0447\\u0435\\u0441\\u043A\\u0430\\u044F \\u043F\\u0440\\u043E\\u0431\\u043B\\u0435\\u043C\\u0430\\n\\n\\u041F\\u043E\\u0434\\u0440\\u043E\\u0431\\u043D\\u043E\\u0441\\u0442\\u0438\\:\\n\\u041E\\u0448\\u0438\\u0431\\u043A\\u0430 \\u043F\\u0440\\u043E\\u0442\\u043E\\u043A\\u043E\\u043B\\u0430, \\u043D\\u0435\\u0432\\u043E\\u0437\\u043C\\u043E\\u0436\\u043D\\u043E \\u043F\\u0440\\u043E\\u0430\\u043D\\u0430\\u043B\\u0438\\u0437\\u0438\\u0440\\u043E\\u0432\\u0430\\u0442\\u044C \\u043E\\u0442\\u0432\\u0435\\u0442 HTTP\n\n#YMSG\nLR_DD_NO_APPROVER=\\u0412\\u043E\\u0437\\u043D\\u0438\\u043A\\u043B\\u0430 \\u0442\\u0435\\u0445\\u043D\\u0438\\u0447\\u0435\\u0441\\u043A\\u0430\\u044F \\u043F\\u0440\\u043E\\u0431\\u043B\\u0435\\u043C\\u0430\\n\\n\\u041F\\u043E\\u0434\\u0440\\u043E\\u0431\\u043D\\u043E\\u0441\\u0442\\u0438\\:\\n\\u041E\\u0448\\u0438\\u0431\\u043A\\u0430 \\u043F\\u0440\\u043E\\u0442\\u043E\\u043A\\u043E\\u043B\\u0430, \\u0432 \\u043E\\u0442\\u0432\\u0435\\u0442\\u0435 \\u043D\\u0435\\u0442 \\u0438\\u043C\\u0435\\u043D\\u0438 \\u0443\\u0442\\u0432\\u0435\\u0440\\u0436\\u0434\\u0430\\u044E\\u0449\\u0435\\u0433\\u043E\n\n#YMSG\nLR_DD_NO_CFG=\\u0412\\u043E\\u0437\\u043D\\u0438\\u043A\\u043B\\u0430 \\u0442\\u0435\\u0445\\u043D\\u0438\\u0447\\u0435\\u0441\\u043A\\u0430\\u044F \\u043F\\u0440\\u043E\\u0431\\u043B\\u0435\\u043C\\u0430\\n\\n\\u041F\\u043E\\u0434\\u0440\\u043E\\u0431\\u043D\\u043E\\u0441\\u0442\\u0438\\:\\n\\u041E\\u0448\\u0438\\u0431\\u043A\\u0430 \\u043F\\u0440\\u043E\\u0442\\u043E\\u043A\\u043E\\u043B\\u0430, \\u0432 \\u043E\\u0442\\u0432\\u0435\\u0442\\u0435 \\u043D\\u0435\\u0442 \\u043A\\u043E\\u043D\\u0444\\u0438\\u0433\\u0443\\u0440\\u0430\\u0446\\u0438\\u0438\n\n#YMSG\nLR_DD_NO_BALANCES=\\u0412\\u043E\\u0437\\u043D\\u0438\\u043A\\u043B\\u0430 \\u0442\\u0435\\u0445\\u043D\\u0438\\u0447\\u0435\\u0441\\u043A\\u0430\\u044F \\u043F\\u0440\\u043E\\u0431\\u043B\\u0435\\u043C\\u0430\\n\\n\\u041F\\u043E\\u0434\\u0440\\u043E\\u0431\\u043D\\u043E\\u0441\\u0442\\u0438\\:\\n\\u041E\\u0448\\u0438\\u0431\\u043A\\u0430 \\u043F\\u0440\\u043E\\u0442\\u043E\\u043A\\u043E\\u043B\\u0430, \\u0432 \\u043E\\u0442\\u0432\\u0435\\u0442\\u0435 \\u043D\\u0435\\u0442 \\u043E\\u0441\\u0442\\u0430\\u0442\\u043A\\u043E\\u0432\n\n#YMSG\nLR_DD_PARSE_ERR=\\u0412\\u043E\\u0437\\u043D\\u0438\\u043A\\u043B\\u0430 \\u0442\\u0435\\u0445\\u043D\\u0438\\u0447\\u0435\\u0441\\u043A\\u0430\\u044F \\u043F\\u0440\\u043E\\u0431\\u043B\\u0435\\u043C\\u0430\\n\\n\\u041F\\u043E\\u0434\\u0440\\u043E\\u0431\\u043D\\u043E\\u0441\\u0442\\u0438\\:\\n\\u041E\\u0448\\u0438\\u0431\\u043A\\u0430 \\u043F\\u0440\\u043E\\u0442\\u043E\\u043A\\u043E\\u043B\\u0430, \\u043D\\u0435\\u0432\\u043E\\u0437\\u043C\\u043E\\u0436\\u043D\\u043E \\u043F\\u0440\\u043E\\u0430\\u043D\\u0430\\u043B\\u0438\\u0437\\u0438\\u0440\\u043E\\u0432\\u0430\\u0442\\u044C \\u043E\\u0442\\u0432\\u0435\\u0442\n\n#YMSG\nLR_DD_COMM_ERR=\\u0412\\u043E\\u0437\\u043D\\u0438\\u043A\\u043B\\u0430 \\u043F\\u0440\\u043E\\u0431\\u043B\\u0435\\u043C\\u0430 \\u0441 \\u0441\\u043E\\u0435\\u0434\\u0438\\u043D\\u0435\\u043D\\u0438\\u0435\\u043C\n\n#YMSG\nLR_DD_GENERIC_ERR=\\u0412\\u043E\\u0437\\u043D\\u0438\\u043A\\u043B\\u0430 \\u043E\\u0448\\u0438\\u0431\\u043A\\u0430\n\n#YMSG\nLR_CT_PARSE_ERR=\\u0412\\u043E\\u0437\\u043D\\u0438\\u043A\\u043B\\u0430 \\u0442\\u0435\\u0445\\u043D\\u0438\\u0447\\u0435\\u0441\\u043A\\u0430\\u044F \\u043F\\u0440\\u043E\\u0431\\u043B\\u0435\\u043C\\u0430\\n\\n\\u041F\\u043E\\u0434\\u0440\\u043E\\u0431\\u043D\\u043E\\u0441\\u0442\\u0438\\:\\n\\u041E\\u0448\\u0438\\u0431\\u043A\\u0430 \\u043F\\u0440\\u043E\\u0442\\u043E\\u043A\\u043E\\u043B\\u0430, \\u043D\\u0435\\u0432\\u043E\\u0437\\u043C\\u043E\\u0436\\u043D\\u043E \\u043F\\u0440\\u043E\\u0430\\u043D\\u0430\\u043B\\u0438\\u0437\\u0438\\u0440\\u043E\\u0432\\u0430\\u0442\\u044C \\u043E\\u0442\\u0432\\u0435\\u0442\n\n#XFLD\nLR_S1_PENDING=\\u0412 \\u043E\\u0436\\u0438\\u0434\\u0430\\u043D\\u0438\\u0438\n\n#YMSG\nLR_UNKNOWN=\\u041D\\u0435\\u0438\\u0437\\u0432\\u0435\\u0441\\u0442\\u043D\\u043E\n\n#XSEL: (legend)\nLR_NONWORKING=\\u041D\\u0435\\u0440\\u0430\\u0431\\u043E\\u0447\\u0438\\u0439 \\u0434\\u0435\\u043D\\u044C\n\n#XSEL: (legend)\nLR_APPROVELEAVE=\\u0423\\u0442\\u0432\\u0435\\u0440\\u0436\\u0434\\u0435\\u043D\\u043E\n\n#XSEL: (legend)\nLR_REJECTEDLEAVE=\\u041E\\u0442\\u043A\\u043B\\u043E\\u043D\\u0435\\u043D\\u043E\n\n#XSEL: (legend)\nLR_APPROVEPENDING=\\u041E\\u0436\\u0438\\u0434\\u0430\\u0435\\u0442 \\u0443\\u0442\\u0432\\u0435\\u0440\\u0436\\u0434\\u0435\\u043D\\u0438\\u044F\n\n#XSEL: (legend)\nLR_PUBLICHOLIDAY=\\u041F\\u0440\\u0430\\u0437\\u0434\\u043D\\u0438\\u0447\\u043D\\u044B\\u0439 \\u0434\\u0435\\u043D\\u044C\n\n#XSEL: (legend)\nLR_WORKINGDAY=\\u0420\\u0430\\u0431\\u043E\\u0447\\u0438\\u0439 \\u0434\\u0435\\u043D\\u044C\n\n#XSEL: (legend)\nLR_DELETIONREQUESTED=\\u0417\\u0430\\u043F\\u0440\\u043E\\u0448\\u0435\\u043D\\u0430 \\u043E\\u0442\\u043C\\u0435\\u043D\\u0430\n\n#XTIT\nLR_DELETION_REQ=\\u0417\\u0430\\u043F\\u0440\\u043E\\u0441 \\u043D\\u0430 \\u043E\\u0442\\u043C\\u0435\\u043D\\u0443\n\n#XTIT\nLR_CHANGE_REQ=\\u0417\\u0430\\u043F\\u0440\\u043E\\u0441 \\u043D\\u0430 \\u0438\\u0437\\u043C\\u0435\\u043D\\u0435\\u043D\\u0438\\u0435\n\n#XTIT\nLR_CHANGE_PENDING=\\u0418\\u0437\\u043C\\u0435\\u043D\\u0435\\u043D\\u0438\\u0435 \\u0432 \\u043E\\u0436\\u0438\\u0434\\u0430\\u043D\\u0438\\u0438\n\n#XTIT\nLR_CANCEL_PENDING=\\u041E\\u0442\\u043C\\u0435\\u043D\\u0430 \\u0432 \\u043E\\u0436\\u0438\\u0434\\u0430\\u043D\\u0438\\u0438\n\n#XTIT\nLR_CHANGE_DONE=\\u0418\\u0437\\u043C\\u0435\\u043D\\u0435\\u043D\\u0438\\u0435 \\u0443\\u0442\\u0432\\u0435\\u0440\\u0436\\u0434\\u0435\\u043D\\u043E\n\n#XTIT\nLR_CANCEL_DONE=\\u041E\\u0442\\u043C\\u0435\\u043D\\u0430 \\u0443\\u0442\\u0432\\u0435\\u0440\\u0436\\u0434\\u0435\\u043D\\u0430\n\n#XTIT: Original\nLR_OLD_VERSION=\\u041E\\u0440\\u0438\\u0433\\u0438\\u043D\\u0430\\u043B\n\n#XTIT: Leave Changes\nLR_NEW_VERSION=\\u0418\\u0437\\u043C\\u0435\\u043D\\u0435\\u043D\\u043E\n\n#XFLD: Label for Approver Selection\nLR_APPROVER=\\u0423\\u0442\\u0432\\u0435\\u0440\\u0436\\u0434\\u0430\\u044E\\u0449\\u0438\\u0439\n\n#XFLD: Label for Attendance/Absence Hours\nLR_ABS_HOURS=\\u0427\\u0430\\u0441\\u044B \\u043F\\u0440\\u0438\\u0441\\u0443\\u0442\\u0441\\u0442\\u0432\\u0438\\u044F/\\u043E\\u0442\\u0441\\u0443\\u0442\\u0441\\u0442\\u0432\\u0438\\u044F\n\n#XFLD: Label for Attachments\nLR_ATTACHMENTS=\\u0412\\u043B\\u043E\\u0436\\u0435\\u043D\\u0438\\u044F\n\n#XFLD: Placeholder for Attachments\nLR_ATTACHMENT=\\u0414\\u043E\\u0431\\u0430\\u0432\\u0438\\u0442\\u044C \\u0432\\u043B\\u043E\\u0436\\u0435\\u043D\\u0438\\u0435\n\n#XFLD: Label for Start Time\nLR_START_TIME=\\u0412\\u0440\\u0435\\u043C\\u044F \\u043D\\u0430\\u0447\\u0430\\u043B\\u0430\n\n#XFLD: Label for Start Time\nLR_END_TIME=\\u0412\\u0440\\u0435\\u043C\\u044F \\u043E\\u043A\\u043E\\u043D\\u0447\\u0430\\u043D\\u0438\\u044F\n\n#YMSG: Error message to display, if the file upload fails\nLR_ATTACHMENT_ERROR=\\u041D\\u0435 \\u0443\\u0434\\u0430\\u043B\\u043E\\u0441\\u044C \\u0437\\u0430\\u0433\\u0440\\u0443\\u0437\\u0438\\u0442\\u044C \\u0432\\u043B\\u043E\\u0436\\u0435\\u043D\\u0438\\u0435\n\n#YMSG: warning message to show if the file type is not supported\nLR_ATTACHMENT_TYPECHECK=\\u042D\\u0442\\u043E\\u0442 \\u0442\\u0438\\u043F \\u0432\\u043B\\u043E\\u0436\\u0435\\u043D\\u0438\\u044F \\u043D\\u0435 \\u043F\\u043E\\u0434\\u0434\\u0435\\u0440\\u0436\\u0438\\u0432\\u0430\\u0435\\u0442\\u0441\\u044F\n\n#YMSG: Warning message to show if the file size exceeds 25MB- Mega Bytes\nLR_ATTACHMENT_SIZECHECK=\\u0421\\u043B\\u0438\\u0448\\u043A\\u043E\\u043C \\u0431\\u043E\\u043B\\u044C\\u0448\\u043E\\u0439 \\u0440\\u0430\\u0437\\u043C\\u0435\\u0440 \\u0444\\u0430\\u0439\\u043B\\u0430; \\u0432\\u044B\\u0431\\u0435\\u0440\\u0438\\u0442\\u0435 \\u0444\\u0430\\u0439\\u043B \\u0440\\u0430\\u0437\\u043C\\u0435\\u0440\\u043E\\u043C \\u043C\\u0435\\u043D\\u0435\\u0435 25 \\u041C\\u0411\n\n#XFLD: Select Personnel Assignment Label\nPERSONAL_ASSIGN=\\u0412\\u044B\\u0431\\u0440\\u0430\\u0442\\u044C \\u0442\\u0440\\u0443\\u0434\\u043E\\u0432\\u043E\\u0439 \\u0434\\u043E\\u0433\\u043E\\u0432\\u043E\\u0440\n\n#XTIT: Select Personnel Assignment Title\nPERSONAL_ASSIGN_TITLE=\\u0422\\u0440\\u0443\\u0434\\u043E\\u0432\\u044B\\u0435 \\u0434\\u043E\\u0433\\u043E\\u0432\\u043E\\u0440\\u044B\n\n#XFLD: Level for approver\nLR_LEVEL=\\u0423\\u0440\\u043E\\u0432\\u0435\\u043D\\u044C {0}\n\n#YMSG: error message to display, if the maximum number of approvers reached\nLR_APPROVER_LEVEL_MAX=\\u0423\\u0436\\u0435 \\u0432\\u0432\\u0435\\u0434\\u0435\\u043D\\u043E \\u043C\\u0430\\u043A\\u0441\\u0438\\u043C\\u0430\\u043B\\u044C\\u043D\\u043E\\u0435 \\u0447\\u0438\\u0441\\u043B\\u043E \\u0443\\u0442\\u0432\\u0435\\u0440\\u0436\\u0434\\u0430\\u044E\\u0449\\u0438\\u0445\n',
	"hcm/myleaverequest/i18n/i18n_sh.properties":'\n#XTIT: Application name (shown in browser header bar or as browser tab title)\napp.Identity=Moji zahtevi za odsustvo\n\n#XTIT: title of the home view\nLR_TITLE_HOME_VIEW=Moji zahtevi za odsustvo\n\n#XTIT: title of the leave create view\nLR_TITLE_CREATE_VIEW=Zahtevaj odsustvo\n\n#XTIT: title of the leave change view\nLR_TITLE_CHANGE_VIEW=Promeni zahtev za odsustvo\n\n#XTIT: title of the Entitlements view\nLR_TITLE_BALANCE_VIEW=Prava\n\n#XTIT: title of the leave History view\nLR_TITLE_HISTORY_VIEW=Istorija\n\n#XTIT: title of the leave details view\nLR_TITLE_DETAILS_VIEW=Detalji odsustva\n\n#XTIT: title of the leave requests\nLR_TITLE_LEAVE_REQUESTS=Zahtevi za odsustvo\n\n#XTIT: title of the leave request\nLR_TITLE_LEAVE_REQUEST=Zahtev za odsustvo\n\n#XTIT: deductible\nLR_BALANCE_DEDUCTIBLE=Kategorija\n\n#XTIT: Balance\nLR_BALANCE_BALANCE=Dostupno\n\n#XTIT: Used\nLR_BALANCE_USED=Kori\\u0161teno\n\n#XTIT: Requested\nLR_BALANCE_REQUESTED=Zahtevano\n\n#XTIT: Quota\nLR_BALANCE_QUOTA=Prava\n\n#XTIT: Entitlement\nLR_ENTITLEMENT_QUOTA=Pravo\n\n#XTIT: Send leave request\nLR_TITLE_SEND=Po\\u0161alji zahtev za odsustvo\n\n#XTIT: Cancel leave request\nLR_TITLE_WITHDRAW=Povuci zahtev za odsustvo\n\n#XTIT: ATTENTION Tile text line break after 12 characters!\nLR_BALANCE_TILE=Prava\n\n#XTIT: ATTENTION Tile text line break after 12 characters!\nLR_HISTORY_TILE=Istorija\n\n#XTIT: ATTENTION Tile text line break after 12 characters!\nLR_CREATE_LEAVE_TILE=Kreiraj zahtev za odstustvo\n\n#XBUT\nLR_SHOW_HIST=Istorija\n\n#XBUT\nLR_CREATE_LEAVE=Zahtevaj odsustvo\n\n#XBUT: text for "send leave request" button\nLR_SEND=Po\\u0161alji\n\n#XBUT: text for ok button \nLR_OK=OK\n\n#XBUT: text for reset button \nLR_RESET=Ponovo postavi\n\n#XBUT: text for cancel button e.g. on the day range picker screen\nLR_CANCEL=Odustani\n\n#XBUT: text for change button on the Leave Overview details screen\nLR_CHANGE=Promeni\n\n#XBUT: text for cancel button on the Leave Overview details screen\nLR_WITHDRAW=Povuci\n\n#XSEL\nLR_UPDATED=A\\u017Eurirano\n\n#XFLD\nLR_NOTE=Bele\\u0161ka\n\n#XFLD\nLR_CUSTOM1=Korisni\\u010Dki definisano polje 1\n\n#XFLD: used vacation, lower case for status under calendar. Reads "X days [line feed] used"\nLR_BOOKED=kori\\u0161teno\n\n#XFLD: Available balance, lower case for status under calendar. Reads "X days [line feed] available"\nLR_REMAINING=dostupno\n\n#XFLD\nLR_LOWERCASE_DAYS=dani\n\n#XFLD\nLR_LOWERCASE_DAY=dan\n\n#XFLD\nLR_LOWERCASE_HOURS=sati\n\n#XFLD\nLR_LOWERCASE_HOUR=sat\n\n#XFLD\nLR_UP_TO=Va\\u017Ee\\u0107e do\n\n#XFLD\nLR_FROM=Od\n\n#XFLD\nLR_TO=Do\n\n#XFLD\nLR_DEDUCTION=Oduzimanje\n\n#XFLD: Hyphen for Date Formatting\nLR_HYPHEN=-\n\n#XTIT: title of error dialog\nLR_PROBLEM=Problem\n\n#XTIT: title of confirmation dialog\nLR_CONFIRMATION=Potvrda\n\n#YMSG\nLR_CONFIRMATIONMSG=Poslati zahtev za odsustvo {0}?\n\n#YMSG\nLR_WITHDRAWNMSG=Da li \\u017Eelite da povu\\u010Dete ovaj zahtev za odsustvo?\n\n#XFLD\nLR_DAYS=dani\n\n#XFLD\nLR_DAY=Dan\n\n#XFLD\nLR_HOURS=Sati\n\n#XFLD\nLR_HOUR=Sat\n\n#XFLD\nLR_REQUEST=Zahtevano\n\n#XSEL: day type (legend)\nLR_DTYPE_TODAY=Danas\n\n#XSEL: day type (legend)\nLR_DTYPE_SELECTED=Odabrani dan(i)\n\n#YMSG: processing\nLR_PROCESSING=Obrada...\n\n#YMSG\nLR_SUBMITDONE=Va\\u0161 zahtev za odsustvo je poslat {0}\n\n#YMSG\nLR_WITHDRAWDONE=Va\\u0161 zahtev za odsustvo je povu\\u010Den\n\n#YMSG\nLR_AX_MODEL_NOT_REG=Tehni\\u010Dki problem\\n\\nDetalji gre\\u0161ke\\:\\nInterna gre\\u0161ka; model nije registrovan\n\n#YMSG\nLR_AX_PARSE_ERR=Tehni\\u010Dki problem\\n\\nDetalji gre\\u0161ke\\:\\nGre\\u0161ka protokola; nije mogu\\u0107e sintaksi\\u010Dki analizirati HTTP odgovor\n\n#YMSG\nLR_DD_NO_APPROVER=Tehni\\u010Dki problem\\n\\nDetalji gre\\u0161ke\\:\\nGre\\u0161ka protokola; naziv davaoca odobrenja nedostaje u odgovoru\n\n#YMSG\nLR_DD_NO_CFG=Tehni\\u010Dki problem\\n\\nDetalji gre\\u0161ke\\:\\nGre\\u0161ka protokola; konfiguracija nedostaje u odgovoru\n\n#YMSG\nLR_DD_NO_BALANCES=Tehni\\u010Dki problem\\n\\nDetalji gre\\u0161ke\\:\\nGre\\u0161ka protokola; stanja nedostaju u odgovoru\n\n#YMSG\nLR_DD_PARSE_ERR=Tehni\\u010Dki problem\\n\\nDetalji gre\\u0161ke\\:\\nGre\\u0161ka protokola; nije mogu\\u0107e sintaksi\\u010Dki analizirati odgovor\n\n#YMSG\nLR_DD_COMM_ERR=Problem s va\\u0161om vezom\n\n#YMSG\nLR_DD_GENERIC_ERR=Gre\\u0161ka\n\n#YMSG\nLR_CT_PARSE_ERR=Tehni\\u010Dki problem\\n\\nDetalji gre\\u0161ke\\:\\nGre\\u0161ka protokola; nije mogu\\u0107e sintaksi\\u010Dki analizirati odgovor\n\n#XFLD\nLR_S1_PENDING=Na \\u010Dekanju\n\n#YMSG\nLR_UNKNOWN=Nepoznato\n\n#XSEL: (legend)\nLR_NONWORKING=Neradni dan\n\n#XSEL: (legend)\nLR_APPROVELEAVE=Odobreno\n\n#XSEL: (legend)\nLR_REJECTEDLEAVE=Odbijeno\n\n#XSEL: (legend)\nLR_APPROVEPENDING=Odobrenje na \\u010Dekanju\n\n#XSEL: (legend)\nLR_PUBLICHOLIDAY=Dr\\u017Eavni praznik\n\n#XSEL: (legend)\nLR_WORKINGDAY=Radni dan\n\n#XSEL: (legend)\nLR_DELETIONREQUESTED=Otkazivanje zahtevano\n\n#XTIT\nLR_DELETION_REQ=Zahtev za otkazivanje\n\n#XTIT\nLR_CHANGE_REQ=Promeni zahtev\n\n#XTIT\nLR_CHANGE_PENDING=Promena na \\u010Dekanju\n\n#XTIT\nLR_CANCEL_PENDING=Otkazivanje na \\u010Dekanju\n\n#XTIT\nLR_CHANGE_DONE=Promena odobrena\n\n#XTIT\nLR_CANCEL_DONE=Otkazivanje odobreno\n\n#XTIT: Original\nLR_OLD_VERSION=Originalno\n\n#XTIT: Leave Changes\nLR_NEW_VERSION=Promenjeno\n\n#XFLD: Label for Approver Selection\nLR_APPROVER=Davalac odobrenja\n\n#XFLD: Label for Attendance/Absence Hours\nLR_ABS_HOURS=Sati prisustva/odsustva\n\n#XFLD: Label for Attachments\nLR_ATTACHMENTS=Dodaci\n\n#XFLD: Placeholder for Attachments\nLR_ATTACHMENT=Dodaj dodatak\n\n#XFLD: Label for Start Time\nLR_START_TIME=Vreme po\\u010Detka\n\n#XFLD: Label for Start Time\nLR_END_TIME=Vreme zavr\\u0161etka\n\n#YMSG: Error message to display, if the file upload fails\nLR_ATTACHMENT_ERROR=Nije mogu\\u0107e u\\u010Ditati dodatak\n\n#YMSG: warning message to show if the file type is not supported\nLR_ATTACHMENT_TYPECHECK=Ovaj tip dodatka nije podr\\u017Ean\n\n#YMSG: Warning message to show if the file size exceeds 25MB- Mega Bytes\nLR_ATTACHMENT_SIZECHECK=Fajl je prevelik. Odaberite fajl veli\\u010Dine manje od 25MB.\n\n#XFLD: Select Personnel Assignment Label\nPERSONAL_ASSIGN=Izaberite ugovor o radu\n\n#XTIT: Select Personnel Assignment Title\nPERSONAL_ASSIGN_TITLE=Ugovori o radu\n\n#XFLD: Level for approver\nLR_LEVEL=Nivo {0}\n\n#YMSG: error message to display, if the maximum number of approvers reached\nLR_APPROVER_LEVEL_MAX=Ve\\u0107 ste uneli maksimalni broj davalaca odobrenja.\n',
	"hcm/myleaverequest/i18n/i18n_sk.properties":'\n#XTIT: Application name (shown in browser header bar or as browser tab title)\napp.Identity=Moje \\u017Eiadosti o dovolenku\n\n#XTIT: title of the home view\nLR_TITLE_HOME_VIEW=Moje \\u017Eiadosti o dovolenku\n\n#XTIT: title of the leave create view\nLR_TITLE_CREATE_VIEW=\\u017Diada\\u0165 o dovolenku\n\n#XTIT: title of the leave change view\nLR_TITLE_CHANGE_VIEW=Zmeni\\u0165 \\u017Eiados\\u0165 o dovolenku\n\n#XTIT: title of the Entitlements view\nLR_TITLE_BALANCE_VIEW=N\\u00E1roky\n\n#XTIT: title of the leave History view\nLR_TITLE_HISTORY_VIEW=Hist\\u00F3ria\n\n#XTIT: title of the leave details view\nLR_TITLE_DETAILS_VIEW=Detaily dovolenky\n\n#XTIT: title of the leave requests\nLR_TITLE_LEAVE_REQUESTS=\\u017Diadosti o dovolenku\n\n#XTIT: title of the leave request\nLR_TITLE_LEAVE_REQUEST=\\u017Diados\\u0165 o dovolenku\n\n#XTIT: deductible\nLR_BALANCE_DEDUCTIBLE=Kateg\\u00F3ria\n\n#XTIT: Balance\nLR_BALANCE_BALANCE=Dostupn\\u00E9\n\n#XTIT: Used\nLR_BALANCE_USED=Pou\\u017Eit\\u00E9\n\n#XTIT: Requested\nLR_BALANCE_REQUESTED=Po\\u017Eadovan\\u00E9\n\n#XTIT: Quota\nLR_BALANCE_QUOTA=N\\u00E1roky\n\n#XTIT: Entitlement\nLR_ENTITLEMENT_QUOTA=N\\u00E1rok\n\n#XTIT: Send leave request\nLR_TITLE_SEND=Odosla\\u0165 \\u017Eiados\\u0165 o dovolenku\n\n#XTIT: Cancel leave request\nLR_TITLE_WITHDRAW=Zru\\u0161i\\u0165 \\u017Eiados\\u0165 o dovolenku\n\n#XTIT: ATTENTION Tile text line break after 12 characters!\nLR_BALANCE_TILE=N\\u00E1roky\n\n#XTIT: ATTENTION Tile text line break after 12 characters!\nLR_HISTORY_TILE=Hist\\u00F3ria\n\n#XTIT: ATTENTION Tile text line break after 12 characters!\nLR_CREATE_LEAVE_TILE=Vytvori\\u0165 \\u017Eiados\\u0165 o dovolenku\n\n#XBUT\nLR_SHOW_HIST=Hist\\u00F3ria\n\n#XBUT\nLR_CREATE_LEAVE=\\u017Diada\\u0165 o dovolenku\n\n#XBUT: text for "send leave request" button\nLR_SEND=Odosla\\u0165\n\n#XBUT: text for ok button \nLR_OK=OK\n\n#XBUT: text for reset button \nLR_RESET=Resetova\\u0165\n\n#XBUT: text for cancel button e.g. on the day range picker screen\nLR_CANCEL=Zru\\u0161i\\u0165\n\n#XBUT: text for change button on the Leave Overview details screen\nLR_CHANGE=Zmeni\\u0165\n\n#XBUT: text for cancel button on the Leave Overview details screen\nLR_WITHDRAW=Zru\\u0161i\\u0165\n\n#XSEL\nLR_UPDATED=Aktualizovan\\u00E9\n\n#XFLD\nLR_NOTE=Pozn\\u00E1mka\n\n#XFLD\nLR_CUSTOM1=Pou\\u017E\\u00EDvate\\u013Esk\\u00E9 pole 1\n\n#XFLD: used vacation, lower case for status under calendar. Reads "X days [line feed] used"\nLR_BOOKED=vyu\\u017Eit\\u00E9\n\n#XFLD: Available balance, lower case for status under calendar. Reads "X days [line feed] available"\nLR_REMAINING=k dispoz\\u00EDcii\n\n#XFLD\nLR_LOWERCASE_DAYS=dni\n\n#XFLD\nLR_LOWERCASE_DAY=de\\u0148\n\n#XFLD\nLR_LOWERCASE_HOURS=hodiny\n\n#XFLD\nLR_LOWERCASE_HOUR=hodina\n\n#XFLD\nLR_UP_TO=Plat\\u00ED do\n\n#XFLD\nLR_FROM=Od\n\n#XFLD\nLR_TO=Do\n\n#XFLD\nLR_DEDUCTION=Zr\\u00E1\\u017Eka\n\n#XFLD: Hyphen for Date Formatting\nLR_HYPHEN=-\n\n#XTIT: title of error dialog\nLR_PROBLEM=Vyskytol sa probl\\u00E9m\n\n#XTIT: title of confirmation dialog\nLR_CONFIRMATION=Potvrdenie\n\n#YMSG\nLR_CONFIRMATIONMSG=Odosla\\u0165 t\\u00FAto \\u017Eiados\\u0165 o dovolenku pr\\u00EDjemcovi {0}?\n\n#YMSG\nLR_WITHDRAWNMSG=Chcete zru\\u0161i\\u0165 t\\u00FAto \\u017Eiados\\u0165 o dovolenku?\n\n#XFLD\nLR_DAYS=dni\n\n#XFLD\nLR_DAY=De\\u0148\n\n#XFLD\nLR_HOURS=Hodiny\n\n#XFLD\nLR_HOUR=Hodina\n\n#XFLD\nLR_REQUEST=Po\\u017Eadovan\\u00E9\n\n#XSEL: day type (legend)\nLR_DTYPE_TODAY=Dnes\n\n#XSEL: day type (legend)\nLR_DTYPE_SELECTED=Vybrat\\u00E9 dni\n\n#YMSG: processing\nLR_PROCESSING=Prebieha spracovanie...\n\n#YMSG\nLR_SUBMITDONE=Va\\u0161a \\u017Eiados\\u0165 o dovolenku bola odoslan\\u00E1 pr\\u00EDjemcovi {0}\n\n#YMSG\nLR_WITHDRAWDONE=Va\\u0161a \\u017Eiados\\u0165 o dovolenku bola zru\\u0161en\\u00E1\n\n#YMSG\nLR_AX_MODEL_NOT_REG=Vyskytol sa technick\\u00FD probl\\u00E9m\\n\\nDetaily chyby\\:\\nIntern\\u00E1 chyba; model nie je registrovan\\u00FD\n\n#YMSG\nLR_AX_PARSE_ERR=Vyskytol sa technick\\u00FD probl\\u00E9m\\n\\nDetaily chyby\\:\\nChyba protokolu; nebolo mo\\u017En\\u00E9 syntakticky analyzova\\u0165 odozvu HTTP\n\n#YMSG\nLR_DD_NO_APPROVER=Vyskytol sa technick\\u00FD probl\\u00E9m\\n\\nDetaily chyby\\:\\nChyba protokolu; v odozve ch\\u00FDba meno schva\\u013Eovate\\u013Ea  \n\n#YMSG\nLR_DD_NO_CFG=Vyskytol sa technick\\u00FD probl\\u00E9m\\n\\nDetaily chyby\\:\\nChyba protokolu; v odozve ch\\u00FDba konfigur\\u00E1cia  \n\n#YMSG\nLR_DD_NO_BALANCES=Vyskytol sa technick\\u00FD probl\\u00E9m\\n\\nDetaily chyby\\:\\nChyba protokolu; v odozve ch\\u00FDbaj\\u00FA zostatky\n\n#YMSG\nLR_DD_PARSE_ERR=Vyskytol sa technick\\u00FD probl\\u00E9m\\n\\nDetaily chyby\\:\\nChyba protokolu; odozvu nebolo mo\\u017En\\u00E9 syntakticky analyzova\\u0165 \n\n#YMSG\nLR_DD_COMM_ERR=Vyskytol sa probl\\u00E9m s va\\u0161im pripojen\\u00EDm\n\n#YMSG\nLR_DD_GENERIC_ERR=Vyskytla sa chyba\n\n#YMSG\nLR_CT_PARSE_ERR=Vyskytol sa technick\\u00FD probl\\u00E9m\\n\\nDetaily chyby\\:\\nChyba protokolu; odozvu nebolo mo\\u017En\\u00E9 syntakticky analyzova\\u0165 \n\n#XFLD\nLR_S1_PENDING=Nevybaven\\u00E9\n\n#YMSG\nLR_UNKNOWN=Nezn\\u00E1me\n\n#XSEL: (legend)\nLR_NONWORKING=Nepracovn\\u00FD de\\u0148\n\n#XSEL: (legend)\nLR_APPROVELEAVE=Schv\\u00E1len\\u00E9\n\n#XSEL: (legend)\nLR_REJECTEDLEAVE=Zamietnut\\u00E9\n\n#XSEL: (legend)\nLR_APPROVEPENDING=Nevybaven\\u00E9 schv\\u00E1lenie\n\n#XSEL: (legend)\nLR_PUBLICHOLIDAY=Sviatok\n\n#XSEL: (legend)\nLR_WORKINGDAY=Pracovn\\u00FD de\\u0148\n\n#XSEL: (legend)\nLR_DELETIONREQUESTED=Po\\u017Eadovan\\u00E9 zru\\u0161enie\n\n#XTIT\nLR_DELETION_REQ=\\u017Diados\\u0165 o zru\\u0161enie\n\n#XTIT\nLR_CHANGE_REQ=\\u017Diados\\u0165 o zmenu\n\n#XTIT\nLR_CHANGE_PENDING=Nevybaven\\u00E1 zmena\n\n#XTIT\nLR_CANCEL_PENDING=Nevybaven\\u00E9 zru\\u0161enie\n\n#XTIT\nLR_CHANGE_DONE=Schv\\u00E1len\\u00E1 zmena\n\n#XTIT\nLR_CANCEL_DONE=Schv\\u00E1len\\u00E9 zru\\u0161enie\n\n#XTIT: Original\nLR_OLD_VERSION=P\\u00F4vodn\\u00E9\n\n#XTIT: Leave Changes\nLR_NEW_VERSION=Zmenen\\u00E9\n\n#XFLD: Label for Approver Selection\nLR_APPROVER=Schva\\u013Eovate\\u013E\n\n#XFLD: Label for Attendance/Absence Hours\nLR_ABS_HOURS=Hodiny pr\\u00EDtomnosti/nepr\\u00EDtomnosti\n\n#XFLD: Label for Attachments\nLR_ATTACHMENTS=Pr\\u00EDlohy\n\n#XFLD: Placeholder for Attachments\nLR_ATTACHMENT=Prida\\u0165 pr\\u00EDlohu\n\n#XFLD: Label for Start Time\nLR_START_TIME=\\u010Cas za\\u010Diatku\n\n#XFLD: Label for Start Time\nLR_END_TIME=\\u010Cas ukon\\u010Denia\n\n#YMSG: Error message to display, if the file upload fails\nLR_ATTACHMENT_ERROR=Pr\\u00EDlohu nebolo mo\\u017En\\u00E9 odovzda\\u0165\n\n#YMSG: warning message to show if the file type is not supported\nLR_ATTACHMENT_TYPECHECK=Tento typ pr\\u00EDlohy nie je podporovan\\u00FD\n\n#YMSG: Warning message to show if the file size exceeds 25MB- Mega Bytes\nLR_ATTACHMENT_SIZECHECK=S\\u00FAbor je pr\\u00EDli\\u0161 ve\\u013Ek\\u00FD. Vyberte s\\u00FAbor, ktor\\u00FD je men\\u0161\\u00ED ako 25 MB.\n\n#XFLD: Select Personnel Assignment Label\nPERSONAL_ASSIGN=Vyberte pracovn\\u00FA zmluvu\n\n#XTIT: Select Personnel Assignment Title\nPERSONAL_ASSIGN_TITLE=Pracovn\\u00E9 zmluvy\n\n#XFLD: Level for approver\nLR_LEVEL=\\u00DArove\\u0148 {0}\n\n#YMSG: error message to display, if the maximum number of approvers reached\nLR_APPROVER_LEVEL_MAX=U\\u017E ste zadali maxim\\u00E1lny po\\u010Det schva\\u013Eovate\\u013Eov.\n',
	"hcm/myleaverequest/i18n/i18n_sl.properties":'\n#XTIT: Application name (shown in browser header bar or as browser tab title)\napp.Identity=Moji zahtevki za odsotnost\n\n#XTIT: title of the home view\nLR_TITLE_HOME_VIEW=Moji zahtevki za odsotnost\n\n#XTIT: title of the leave create view\nLR_TITLE_CREATE_VIEW=Zahteva za odsotnost\n\n#XTIT: title of the leave change view\nLR_TITLE_CHANGE_VIEW=Sprememba zahtevka za odsotnost\n\n#XTIT: title of the Entitlements view\nLR_TITLE_BALANCE_VIEW=Pravice\n\n#XTIT: title of the leave History view\nLR_TITLE_HISTORY_VIEW=Zgodovina\n\n#XTIT: title of the leave details view\nLR_TITLE_DETAILS_VIEW=Detajli odsotnosti\n\n#XTIT: title of the leave requests\nLR_TITLE_LEAVE_REQUESTS=Zahtevki za odsotnost\n\n#XTIT: title of the leave request\nLR_TITLE_LEAVE_REQUEST=Zahtevek za odsotnost\n\n#XTIT: deductible\nLR_BALANCE_DEDUCTIBLE=Kategorija\n\n#XTIT: Balance\nLR_BALANCE_BALANCE=Razpolo\\u017Eljivo\n\n#XTIT: Used\nLR_BALANCE_USED=Uporabljeno\n\n#XTIT: Requested\nLR_BALANCE_REQUESTED=Zahtevano\n\n#XTIT: Quota\nLR_BALANCE_QUOTA=Pravice\n\n#XTIT: Entitlement\nLR_ENTITLEMENT_QUOTA=Pravica\n\n#XTIT: Send leave request\nLR_TITLE_SEND=Po\\u0161iljanje zahtevka za odsotnost\n\n#XTIT: Cancel leave request\nLR_TITLE_WITHDRAW=Umik zahtevka za odsotnost\n\n#XTIT: ATTENTION Tile text line break after 12 characters!\nLR_BALANCE_TILE=Pravice\n\n#XTIT: ATTENTION Tile text line break after 12 characters!\nLR_HISTORY_TILE=Zgodovina\n\n#XTIT: ATTENTION Tile text line break after 12 characters!\nLR_CREATE_LEAVE_TILE=Kreiranje zahtevka za odsotnost\n\n#XBUT\nLR_SHOW_HIST=Zgodovina\n\n#XBUT\nLR_CREATE_LEAVE=Zahteva za odsotnost\n\n#XBUT: text for "send leave request" button\nLR_SEND=Po\\u0161iljanje\n\n#XBUT: text for ok button \nLR_OK=OK\n\n#XBUT: text for reset button \nLR_RESET=Ponastavitev\n\n#XBUT: text for cancel button e.g. on the day range picker screen\nLR_CANCEL=Prekinitev\n\n#XBUT: text for change button on the Leave Overview details screen\nLR_CHANGE=Sprememba\n\n#XBUT: text for cancel button on the Leave Overview details screen\nLR_WITHDRAW=Umik\n\n#XSEL\nLR_UPDATED=A\\u017Eurirano\n\n#XFLD\nLR_NOTE=Opomba\n\n#XFLD\nLR_CUSTOM1=Uporabni\\u0161ko definirano polje 1\n\n#XFLD: used vacation, lower case for status under calendar. Reads "X days [line feed] used"\nLR_BOOKED=uporabljeno\n\n#XFLD: Available balance, lower case for status under calendar. Reads "X days [line feed] available"\nLR_REMAINING=razpolo\\u017Eljivo\n\n#XFLD\nLR_LOWERCASE_DAYS=Dnevi\n\n#XFLD\nLR_LOWERCASE_DAY=Dan\n\n#XFLD\nLR_LOWERCASE_HOURS=Ure\n\n#XFLD\nLR_LOWERCASE_HOUR=Ura\n\n#XFLD\nLR_UP_TO=Veljavno do\n\n#XFLD\nLR_FROM=Od\n\n#XFLD\nLR_TO=Do\n\n#XFLD\nLR_DEDUCTION=Odbitek\n\n#XFLD: Hyphen for Date Formatting\nLR_HYPHEN=-\n\n#XTIT: title of error dialog\nLR_PROBLEM=Pri\\u0161lo je do te\\u017Eave\n\n#XTIT: title of confirmation dialog\nLR_CONFIRMATION=Potrditev\n\n#YMSG\nLR_CONFIRMATIONMSG=\\u017Delite poslati to zahtevo za odsotnost {0}?\n\n#YMSG\nLR_WITHDRAWNMSG=\\u017Delite umakniti ta zahtevek za odsotnost?\n\n#XFLD\nLR_DAYS=Dnevi\n\n#XFLD\nLR_DAY=Dan\n\n#XFLD\nLR_HOURS=Ure\n\n#XFLD\nLR_HOUR=Ura\n\n#XFLD\nLR_REQUEST=Zahtevano\n\n#XSEL: day type (legend)\nLR_DTYPE_TODAY=Danes\n\n#XSEL: day type (legend)\nLR_DTYPE_SELECTED=Izbrani dnevi\n\n#YMSG: processing\nLR_PROCESSING=Procesiranje poteka ...\n\n#YMSG\nLR_SUBMITDONE=Va\\u0161a zahteva za odsotnost je bila poslana {0}\n\n#YMSG\nLR_WITHDRAWDONE=Va\\u0161 zahtevek za odsotnost je bil umaknjen\n\n#YMSG\nLR_AX_MODEL_NOT_REG=Pri\\u0161lo je do tehni\\u010Dne te\\u017Eave\\n\\nDetajli napake\\:\\nInterna napaka; model ni registriran\n\n#YMSG\nLR_AX_PARSE_ERR=Pri\\u0161lo je do tehni\\u010Dne te\\u017Eave\\n\\nDetajli napake\\:\\nNapaka v protokolu; raz\\u010Dlenjevanje HTTP-odziva ni bilo mogo\\u010De\n\n#YMSG\nLR_DD_NO_APPROVER=Pri\\u0161lo je do tehni\\u010Dne te\\u017Eave\\n\\nDetajli napake\\:\\nNapaka v protokolu; v odzivu manjka ime odobritelja\n\n#YMSG\nLR_DD_NO_CFG=Pri\\u0161lo je do tehni\\u010Dne te\\u017Eave\\n\\nDetajli napake\\:\\nNapaka v protokolu; v odzivu manjka konfiguracija\n\n#YMSG\nLR_DD_NO_BALANCES=Pri\\u0161lo je do tehni\\u010Dne te\\u017Eave\\n\\nDetajli napake\\:\\nNapaka v protokolu; v odzivu manjkajo stanja\n\n#YMSG\nLR_DD_PARSE_ERR=Pri\\u0161lo je do tehni\\u010Dne te\\u017Eave\\n\\nDetajli napake\\:\\nNapaka v protokolu; raz\\u010Dlenjevanje odziva ni bilo mogo\\u010De\n\n#YMSG\nLR_DD_COMM_ERR=Pri\\u0161lo do problema z va\\u0161o povezavo\n\n#YMSG\nLR_DD_GENERIC_ERR=Pri\\u0161lo je do napake\n\n#YMSG\nLR_CT_PARSE_ERR=Pri\\u0161lo je do tehni\\u010Dne te\\u017Eave\\n\\nDetajli napake\\:\\nNapaka v protokolu; raz\\u010Dlenjevanje odziva ni bilo mogo\\u010De\n\n#XFLD\nLR_S1_PENDING=\\u010Caka\n\n#YMSG\nLR_UNKNOWN=Neznano\n\n#XSEL: (legend)\nLR_NONWORKING=Dela prost dan\n\n#XSEL: (legend)\nLR_APPROVELEAVE=Odobreno\n\n#XSEL: (legend)\nLR_REJECTEDLEAVE=Zavrnjeno\n\n#XSEL: (legend)\nLR_APPROVEPENDING=Odobritev na \\u010Dakanju\n\n#XSEL: (legend)\nLR_PUBLICHOLIDAY=Praznik\n\n#XSEL: (legend)\nLR_WORKINGDAY=Delovni dan\n\n#XSEL: (legend)\nLR_DELETIONREQUESTED=Zahtevana odpoved\n\n#XTIT\nLR_DELETION_REQ=Zahteva odpovedi\n\n#XTIT\nLR_CHANGE_REQ=Zahteva za spremembo\n\n#XTIT\nLR_CHANGE_PENDING=Sprememba na \\u010Dakanju\n\n#XTIT\nLR_CANCEL_PENDING=Odpoved na \\u010Dakanju\n\n#XTIT\nLR_CHANGE_DONE=Sprememba odobrena\n\n#XTIT\nLR_CANCEL_DONE=Odpoved odobrena\n\n#XTIT: Original\nLR_OLD_VERSION=Original\n\n#XTIT: Leave Changes\nLR_NEW_VERSION=Spremenjeno\n\n#XFLD: Label for Approver Selection\nLR_APPROVER=Odobritelj\n\n#XFLD: Label for Attendance/Absence Hours\nLR_ABS_HOURS=Ure prisotnosti/odsotnosti\n\n#XFLD: Label for Attachments\nLR_ATTACHMENTS=Priloge\n\n#XFLD: Placeholder for Attachments\nLR_ATTACHMENT=Dodajanje priloge\n\n#XFLD: Label for Start Time\nLR_START_TIME=\\u010Cas za\\u010Detka\n\n#XFLD: Label for Start Time\nLR_END_TIME=\\u010Cas konca\n\n#YMSG: Error message to display, if the file upload fails\nLR_ATTACHMENT_ERROR=Prenos priloge v stre\\u017Enik ni bil mogo\\u010D\n\n#YMSG: warning message to show if the file type is not supported\nLR_ATTACHMENT_TYPECHECK=Ta tip priloge ni podprt\n\n#YMSG: Warning message to show if the file size exceeds 25MB- Mega Bytes\nLR_ATTACHMENT_SIZECHECK=Velikost datoteke je prevelika. Izberite datoteko z manj kot 25 MB.\n\n#XFLD: Select Personnel Assignment Label\nPERSONAL_ASSIGN=Izberite pogodbo o delu\n\n#XTIT: Select Personnel Assignment Title\nPERSONAL_ASSIGN_TITLE=Pogodbe o delu\n\n#XFLD: Level for approver\nLR_LEVEL=Raven {0}\n\n#YMSG: error message to display, if the maximum number of approvers reached\nLR_APPROVER_LEVEL_MAX=Vnesli ste \\u017Ee maksimalno \\u0161tevilo odobriteljev.\n',
	"hcm/myleaverequest/i18n/i18n_tr.properties":'\n#XTIT: Application name (shown in browser header bar or as browser tab title)\napp.Identity=\\u0130zin taleplerim\n\n#XTIT: title of the home view\nLR_TITLE_HOME_VIEW=\\u0130zin taleplerim\n\n#XTIT: title of the leave create view\nLR_TITLE_CREATE_VIEW=\\u0130zin talep et\n\n#XTIT: title of the leave change view\nLR_TITLE_CHANGE_VIEW=\\u0130zin talebini de\\u011Fi\\u015Ftir\n\n#XTIT: title of the Entitlements view\nLR_TITLE_BALANCE_VIEW=Haklar\n\n#XTIT: title of the leave History view\nLR_TITLE_HISTORY_VIEW=Ge\\u00E7mi\\u015F\n\n#XTIT: title of the leave details view\nLR_TITLE_DETAILS_VIEW=\\u0130zin ayr\\u0131nt\\u0131lar\\u0131\n\n#XTIT: title of the leave requests\nLR_TITLE_LEAVE_REQUESTS=\\u0130zin talepleri\n\n#XTIT: title of the leave request\nLR_TITLE_LEAVE_REQUEST=\\u0130zin talebi\n\n#XTIT: deductible\nLR_BALANCE_DEDUCTIBLE=Kategori\n\n#XTIT: Balance\nLR_BALANCE_BALANCE=Kullan\\u0131labilir\n\n#XTIT: Used\nLR_BALANCE_USED=Kullan\\u0131ld\\u0131\n\n#XTIT: Requested\nLR_BALANCE_REQUESTED=Talep edildi\n\n#XTIT: Quota\nLR_BALANCE_QUOTA=Haklar\n\n#XTIT: Entitlement\nLR_ENTITLEMENT_QUOTA=Hak\n\n#XTIT: Send leave request\nLR_TITLE_SEND=\\u0130zin talebini g\\u00F6nder\n\n#XTIT: Cancel leave request\nLR_TITLE_WITHDRAW=\\u0130zin talebini geri al\n\n#XTIT: ATTENTION Tile text line break after 12 characters!\nLR_BALANCE_TILE=Haklar\n\n#XTIT: ATTENTION Tile text line break after 12 characters!\nLR_HISTORY_TILE=Ge\\u00E7mi\\u015F\n\n#XTIT: ATTENTION Tile text line break after 12 characters!\nLR_CREATE_LEAVE_TILE=\\u0130zin talebi olu\\u015Ftur\n\n#XBUT\nLR_SHOW_HIST=Ge\\u00E7mi\\u015F\n\n#XBUT\nLR_CREATE_LEAVE=\\u0130zin talep et\n\n#XBUT: text for "send leave request" button\nLR_SEND=G\\u00F6nder\n\n#XBUT: text for ok button \nLR_OK=Tamam\n\n#XBUT: text for reset button \nLR_RESET=S\\u0131f\\u0131rla\n\n#XBUT: text for cancel button e.g. on the day range picker screen\nLR_CANCEL=\\u0130ptal et\n\n#XBUT: text for change button on the Leave Overview details screen\nLR_CHANGE=De\\u011Fi\\u015Fiklik\n\n#XBUT: text for cancel button on the Leave Overview details screen\nLR_WITHDRAW=Geri al\n\n#XSEL\nLR_UPDATED=G\\u00FCncellendi\n\n#XFLD\nLR_NOTE=Not\n\n#XFLD\nLR_CUSTOM1=\\u00D6zel alan 1\n\n#XFLD: used vacation, lower case for status under calendar. Reads "X days [line feed] used"\nLR_BOOKED=kullan\\u0131lan\n\n#XFLD: Available balance, lower case for status under calendar. Reads "X days [line feed] available"\nLR_REMAINING=Kullan\\u0131labilir\n\n#XFLD\nLR_LOWERCASE_DAYS=g\\u00FCn\n\n#XFLD\nLR_LOWERCASE_DAY=g\\u00FCn\n\n#XFLD\nLR_LOWERCASE_HOURS=saat\n\n#XFLD\nLR_LOWERCASE_HOUR=saat\n\n#XFLD\nLR_UP_TO=Ge\\u00E7erlilik biti\\u015Fi\n\n#XFLD\nLR_FROM=Ba\\u015Flang\\u0131\\u00E7\n\n#XFLD\nLR_TO=Biti\\u015F\n\n#XFLD\nLR_DEDUCTION=\\u0130ndirim\n\n#XFLD: Hyphen for Date Formatting\nLR_HYPHEN=-\n\n#XTIT: title of error dialog\nLR_PROBLEM=Problem ortaya \\u00E7\\u0131kt\\u0131\n\n#XTIT: title of confirmation dialog\nLR_CONFIRMATION=Teyit\n\n#YMSG\nLR_CONFIRMATIONMSG=\\u0130zin talebi g\\u00F6nderilsin mi? Al\\u0131c\\u0131\\: {0}\n\n#YMSG\nLR_WITHDRAWNMSG=Bu izin talebini geri almak istiyor musunuz?\n\n#XFLD\nLR_DAYS=g\\u00FCn\n\n#XFLD\nLR_DAY=G\\u00FCn\n\n#XFLD\nLR_HOURS=Saat\n\n#XFLD\nLR_HOUR=Saat\n\n#XFLD\nLR_REQUEST=Talep edildi\n\n#XSEL: day type (legend)\nLR_DTYPE_TODAY=Bug\\u00FCn\n\n#XSEL: day type (legend)\nLR_DTYPE_SELECTED=Se\\u00E7ilen g\\u00FCn(ler)\n\n#YMSG: processing\nLR_PROCESSING=\\u0130\\u015Fleniyor...\n\n#YMSG\nLR_SUBMITDONE=\\u0130zin talebiniz g\\u00F6nderildi. Al\\u0131c\\u0131\\: {0}\n\n#YMSG\nLR_WITHDRAWDONE=\\u0130zin talebiniz geri al\\u0131nd\\u0131\n\n#YMSG\nLR_AX_MODEL_NOT_REG=Teknik problem ortaya \\u00E7\\u0131kt\\u0131\\n\\nHata ayr\\u0131nt\\u0131lar\\u0131\\:\\nDahili hata; model kaydedilmedi\n\n#YMSG\nLR_AX_PARSE_ERR=Teknik problem ortaya \\u00E7\\u0131kt\\u0131\\n\\nHata ayr\\u0131nt\\u0131lar\\u0131\\:\\nG\\u00FCnl\\u00FCk hatas\\u0131; HTTP cevab\\u0131 ayr\\u0131\\u015Ft\\u0131r\\u0131lamad\\u0131\n\n#YMSG\nLR_DD_NO_APPROVER=Teknik problem ortaya \\u00E7\\u0131kt\\u0131\\n\\nHata ayr\\u0131nt\\u0131lar\\u0131\\:\\nG\\u00FCnl\\u00FCk hatas\\u0131; cevapta onaylayan ad\\u0131 eksik\n\n#YMSG\nLR_DD_NO_CFG=Teknik problem ortaya \\u00E7\\u0131kt\\u0131\\n\\nHata ayr\\u0131nt\\u0131lar\\u0131\\:\\nG\\u00FCnl\\u00FCk hatas\\u0131; konfig\\u00FCrasyon cevapta eksik\n\n#YMSG\nLR_DD_NO_BALANCES=Teknik problem ortaya \\u00E7\\u0131kt\\u0131\\n\\nHata ayr\\u0131nt\\u0131lar\\u0131\\:\\nG\\u00FCnl\\u00FCk hatas\\u0131; cevapta bakiyeler eksik\n\n#YMSG\nLR_DD_PARSE_ERR=Teknik problem ortaya \\u00E7\\u0131kt\\u0131\\n\\nHata ayr\\u0131nt\\u0131lar\\u0131\\:\\nG\\u00FCnl\\u00FCk hatas\\u0131; cevap ayr\\u0131\\u015Ft\\u0131r\\u0131lamad\\u0131\n\n#YMSG\nLR_DD_COMM_ERR=Ba\\u011Flant\\u0131n\\u0131zla problem ortaya \\u00E7\\u0131kt\\u0131\n\n#YMSG\nLR_DD_GENERIC_ERR=Hata ortaya \\u00E7\\u0131kt\\u0131\n\n#YMSG\nLR_CT_PARSE_ERR=Teknik problem ortaya \\u00E7\\u0131kt\\u0131\\n\\nHata ayr\\u0131nt\\u0131lar\\u0131\\:\\nG\\u00FCnl\\u00FCk hatas\\u0131; cevap ayr\\u0131\\u015Ft\\u0131r\\u0131lamad\\u0131\n\n#XFLD\nLR_S1_PENDING=Beklemede\n\n#YMSG\nLR_UNKNOWN=Bilinmiyor\n\n#XSEL: (legend)\nLR_NONWORKING=\\u00C7al\\u0131\\u015F\\u0131lmayan g\\u00FCn\n\n#XSEL: (legend)\nLR_APPROVELEAVE=Onayland\\u0131\n\n#XSEL: (legend)\nLR_REJECTEDLEAVE=Reddedildi\n\n#XSEL: (legend)\nLR_APPROVEPENDING=Onay beklemede\n\n#XSEL: (legend)\nLR_PUBLICHOLIDAY=Resmi tatil\n\n#XSEL: (legend)\nLR_WORKINGDAY=\\u0130\\u015F g\\u00FCn\\u00FC\n\n#XSEL: (legend)\nLR_DELETIONREQUESTED=\\u0130ptal talep edildi\n\n#XTIT\nLR_DELETION_REQ=\\u0130ptal talebi\n\n#XTIT\nLR_CHANGE_REQ=De\\u011Fi\\u015Fiklik talebi\n\n#XTIT\nLR_CHANGE_PENDING=De\\u011Fi\\u015Fiklik beklemede\n\n#XTIT\nLR_CANCEL_PENDING=\\u0130ptal beklemede\n\n#XTIT\nLR_CHANGE_DONE=De\\u011Fi\\u015Fiklik onayland\\u0131\n\n#XTIT\nLR_CANCEL_DONE=\\u0130ptal onayland\\u0131\n\n#XTIT: Original\nLR_OLD_VERSION=Orijinal\n\n#XTIT: Leave Changes\nLR_NEW_VERSION=De\\u011Fi\\u015Ftirildi\n\n#XFLD: Label for Approver Selection\nLR_APPROVER=Onaylayan\n\n#XFLD: Label for Attendance/Absence Hours\nLR_ABS_HOURS=Devam/devams\\u0131zl\\u0131k saatleri\n\n#XFLD: Label for Attachments\nLR_ATTACHMENTS=Ekler\n\n#XFLD: Placeholder for Attachments\nLR_ATTACHMENT=Ek ekle\n\n#XFLD: Label for Start Time\nLR_START_TIME=Ba\\u015Flang\\u0131\\u00E7 saati\n\n#XFLD: Label for Start Time\nLR_END_TIME=Biti\\u015F saati\n\n#YMSG: Error message to display, if the file upload fails\nLR_ATTACHMENT_ERROR=Ek y\\u00FCklenemedi\n\n#YMSG: warning message to show if the file type is not supported\nLR_ATTACHMENT_TYPECHECK=Bu ek t\\u00FCr\\u00FC desteklenmiyor\n\n#YMSG: Warning message to show if the file size exceeds 25MB- Mega Bytes\nLR_ATTACHMENT_SIZECHECK=Dosya boyutu \\u00E7ok b\\u00FCy\\u00FCk. Boyut olarak 25MB\'tan daha k\\u00FC\\u00E7\\u00FCk dosya se\\u00E7in.\n\n#XFLD: Select Personnel Assignment Label\nPERSONAL_ASSIGN=Personel tayini se\\u00E7\n\n#XTIT: Select Personnel Assignment Title\nPERSONAL_ASSIGN_TITLE=Personel tayinleri\n\n#XFLD: Level for approver\nLR_LEVEL=D\\u00FCzey {0}\n\n#YMSG: error message to display, if the maximum number of approvers reached\nLR_APPROVER_LEVEL_MAX=Onaylayanlar\\u0131n azami say\\u0131s\\u0131n\\u0131 zaten girdiniz.\n',
	"hcm/myleaverequest/i18n/i18n_zh_CN.properties":'\n#XTIT: Application name (shown in browser header bar or as browser tab title)\napp.Identity=\\u4F11\\u5047\\u7533\\u8BF7\n\n#XTIT: title of the home view\nLR_TITLE_HOME_VIEW=\\u4F11\\u5047\\u7533\\u8BF7\n\n#XTIT: title of the leave create view\nLR_TITLE_CREATE_VIEW=\\u7533\\u8BF7\\u4F11\\u5047\n\n#XTIT: title of the leave change view\nLR_TITLE_CHANGE_VIEW=\\u66F4\\u6539\\u4F11\\u5047\\u7533\\u8BF7\n\n#XTIT: title of the Entitlements view\nLR_TITLE_BALANCE_VIEW=\\u5E94\\u5F97\\u4F11\\u5047\n\n#XTIT: title of the leave History view\nLR_TITLE_HISTORY_VIEW=\\u5386\\u53F2\\u8BB0\\u5F55\n\n#XTIT: title of the leave details view\nLR_TITLE_DETAILS_VIEW=\\u4F11\\u5047\\u8BE6\\u7EC6\\u4FE1\\u606F\n\n#XTIT: title of the leave requests\nLR_TITLE_LEAVE_REQUESTS=\\u4F11\\u5047\\u7533\\u8BF7\n\n#XTIT: title of the leave request\nLR_TITLE_LEAVE_REQUEST=\\u4F11\\u5047\\u7533\\u8BF7\n\n#XTIT: deductible\nLR_BALANCE_DEDUCTIBLE=\\u7C7B\\u522B\n\n#XTIT: Balance\nLR_BALANCE_BALANCE=\\u53EF\\u7528\n\n#XTIT: Used\nLR_BALANCE_USED=\\u5DF2\\u4F7F\\u7528\n\n#XTIT: Requested\nLR_BALANCE_REQUESTED=\\u5DF2\\u7533\\u8BF7\n\n#XTIT: Quota\nLR_BALANCE_QUOTA=\\u5E94\\u5F97\\u4F11\\u5047\n\n#XTIT: Entitlement\nLR_ENTITLEMENT_QUOTA=\\u5E94\\u5F97\n\n#XTIT: Send leave request\nLR_TITLE_SEND=\\u53D1\\u9001\\u4F11\\u5047\\u7533\\u8BF7\n\n#XTIT: Cancel leave request\nLR_TITLE_WITHDRAW=\\u64A4\\u9500\\u4F11\\u5047\\u7533\\u8BF7\n\n#XTIT: ATTENTION Tile text line break after 12 characters!\nLR_BALANCE_TILE=\\u5E94\\u5F97\\u4F11\\u5047\n\n#XTIT: ATTENTION Tile text line break after 12 characters!\nLR_HISTORY_TILE=\\u5386\\u53F2\\u8BB0\\u5F55\n\n#XTIT: ATTENTION Tile text line break after 12 characters!\nLR_CREATE_LEAVE_TILE=\\u521B\\u5EFA\\u4F11\\u5047\\u7533\\u8BF7\n\n#XBUT\nLR_SHOW_HIST=\\u5386\\u53F2\\u8BB0\\u5F55\n\n#XBUT\nLR_CREATE_LEAVE=\\u7533\\u8BF7\\u4F11\\u5047\n\n#XBUT: text for "send leave request" button\nLR_SEND=\\u53D1\\u9001\n\n#XBUT: text for ok button \nLR_OK=\\u786E\\u5B9A\n\n#XBUT: text for reset button \nLR_RESET=\\u91CD\\u7F6E\n\n#XBUT: text for cancel button e.g. on the day range picker screen\nLR_CANCEL=\\u53D6\\u6D88\n\n#XBUT: text for change button on the Leave Overview details screen\nLR_CHANGE=\\u66F4\\u6539\n\n#XBUT: text for cancel button on the Leave Overview details screen\nLR_WITHDRAW=\\u64A4\\u9500\n\n#XSEL\nLR_UPDATED=\\u66F4\\u65B0\\u4E8E\n\n#XFLD\nLR_NOTE=\\u6CE8\\u91CA\n\n#XFLD\nLR_CUSTOM1=\\u81EA\\u5B9A\\u4E49\\u5B57\\u6BB5 1\n\n#XFLD: used vacation, lower case for status under calendar. Reads "X days [line feed] used"\nLR_BOOKED=\\u5DF2\\u7528\n\n#XFLD: Available balance, lower case for status under calendar. Reads "X days [line feed] available"\nLR_REMAINING=\\u53EF\\u7528\n\n#XFLD\nLR_LOWERCASE_DAYS=\\u5929\n\n#XFLD\nLR_LOWERCASE_DAY=\\u5929\n\n#XFLD\nLR_LOWERCASE_HOURS=\\u5C0F\\u65F6\n\n#XFLD\nLR_LOWERCASE_HOUR=\\u5C0F\\u65F6\n\n#XFLD\nLR_UP_TO=\\u6709\\u6548\\u671F\\u81F3\n\n#XFLD\nLR_FROM=\\u81EA\n\n#XFLD\nLR_TO=\\u81F3\n\n#XFLD\nLR_DEDUCTION=\\u6263\\u51CF\n\n#XFLD: Hyphen for Date Formatting\nLR_HYPHEN=-\n\n#XTIT: title of error dialog\nLR_PROBLEM=\\u51FA\\u73B0\\u95EE\\u9898\n\n#XTIT: title of confirmation dialog\nLR_CONFIRMATION=\\u786E\\u8BA4\n\n#YMSG\nLR_CONFIRMATIONMSG=\\u662F\\u5426\\u5C06\\u6B64\\u4F11\\u5047\\u7533\\u8BF7\\u53D1\\u9001\\u7ED9 {0}\\uFF1F\n\n#YMSG\nLR_WITHDRAWNMSG=\\u662F\\u5426\\u8981\\u64A4\\u9500\\u6B64\\u4F11\\u5047\\u7533\\u8BF7\\uFF1F\n\n#XFLD\nLR_DAYS=\\u5929\n\n#XFLD\nLR_DAY=\\u5929\n\n#XFLD\nLR_HOURS=\\u5C0F\\u65F6\n\n#XFLD\nLR_HOUR=\\u5C0F\\u65F6\n\n#XFLD\nLR_REQUEST=\\u5DF2\\u7533\\u8BF7\n\n#XSEL: day type (legend)\nLR_DTYPE_TODAY=\\u4ECA\\u5929\n\n#XSEL: day type (legend)\nLR_DTYPE_SELECTED=\\u9009\\u5B9A\\u65E5\\u671F\n\n#YMSG: processing\nLR_PROCESSING=\\u6B63\\u5728\\u5904\\u7406...\n\n#YMSG\nLR_SUBMITDONE=\\u5DF2\\u5C06\\u60A8\\u7684\\u4F11\\u5047\\u7533\\u8BF7\\u53D1\\u9001\\u7ED9 {0}\n\n#YMSG\nLR_WITHDRAWDONE=\\u5DF2\\u64A4\\u9500\\u60A8\\u7684\\u4F11\\u5047\\u7533\\u8BF7\n\n#YMSG\nLR_AX_MODEL_NOT_REG=\\u51FA\\u73B0\\u6280\\u672F\\u95EE\\u9898\\n\\n\\u9519\\u8BEF\\u8BE6\\u7EC6\\u4FE1\\u606F\\uFF1A\\n\\u5185\\u90E8\\u9519\\u8BEF\\uFF1B\\u672A\\u6CE8\\u518C\\u6A21\\u578B\n\n#YMSG\nLR_AX_PARSE_ERR=\\u51FA\\u73B0\\u6280\\u672F\\u95EE\\u9898\\n\\n\\u9519\\u8BEF\\u8BE6\\u7EC6\\u4FE1\\u606F\\uFF1A\\n\\u534F\\u8BAE\\u9519\\u8BEF\\uFF1B\\u65E0\\u6CD5\\u89E3\\u6790 HTTP \\u54CD\\u5E94\n\n#YMSG\nLR_DD_NO_APPROVER=\\u51FA\\u73B0\\u6280\\u672F\\u95EE\\u9898\\n\\n\\u9519\\u8BEF\\u8BE6\\u7EC6\\u4FE1\\u606F\\uFF1A\\n\\u534F\\u8BAE\\u9519\\u8BEF\\uFF1B\\u54CD\\u5E94\\u4E2D\\u7F3A\\u5C11\\u5BA1\\u6279\\u4EBA\\u59D3\\u540D\n\n#YMSG\nLR_DD_NO_CFG=\\u51FA\\u73B0\\u6280\\u672F\\u95EE\\u9898\\n\\n\\u9519\\u8BEF\\u8BE6\\u7EC6\\u4FE1\\u606F\\uFF1A\\n\\u534F\\u8BAE\\u9519\\u8BEF\\uFF1B\\u54CD\\u5E94\\u4E2D\\u7F3A\\u5C11\\u914D\\u7F6E\n\n#YMSG\nLR_DD_NO_BALANCES=\\u51FA\\u73B0\\u6280\\u672F\\u95EE\\u9898\\n\\n\\u9519\\u8BEF\\u8BE6\\u7EC6\\u4FE1\\u606F\\uFF1A\\n\\u534F\\u8BAE\\u9519\\u8BEF\\uFF1B\\u54CD\\u5E94\\u4E2D\\u7F3A\\u5C11\\u5269\\u4F59\\u4F11\\u5047\n\n#YMSG\nLR_DD_PARSE_ERR=\\u51FA\\u73B0\\u6280\\u672F\\u95EE\\u9898\\n\\n\\u9519\\u8BEF\\u8BE6\\u7EC6\\u4FE1\\u606F\\uFF1A\\n\\u534F\\u8BAE\\u9519\\u8BEF\\uFF1B\\u65E0\\u6CD5\\u89E3\\u6790\\u54CD\\u5E94\n\n#YMSG\nLR_DD_COMM_ERR=\\u8FDE\\u63A5\\u51FA\\u73B0\\u95EE\\u9898\n\n#YMSG\nLR_DD_GENERIC_ERR=\\u51FA\\u9519\n\n#YMSG\nLR_CT_PARSE_ERR=\\u51FA\\u73B0\\u6280\\u672F\\u95EE\\u9898\\n\\n\\u9519\\u8BEF\\u8BE6\\u7EC6\\u4FE1\\u606F\\uFF1A\\n\\u534F\\u8BAE\\u9519\\u8BEF\\uFF1B\\u65E0\\u6CD5\\u89E3\\u6790\\u54CD\\u5E94\n\n#XFLD\nLR_S1_PENDING=\\u5F85\\u5B9A\n\n#YMSG\nLR_UNKNOWN=\\u672A\\u77E5\n\n#XSEL: (legend)\nLR_NONWORKING=\\u975E\\u5DE5\\u4F5C\\u65E5\n\n#XSEL: (legend)\nLR_APPROVELEAVE=\\u5DF2\\u6279\\u51C6\n\n#XSEL: (legend)\nLR_REJECTEDLEAVE=\\u5DF2\\u62D2\\u7EDD\n\n#XSEL: (legend)\nLR_APPROVEPENDING=\\u5F85\\u5BA1\\u6279\n\n#XSEL: (legend)\nLR_PUBLICHOLIDAY=\\u6CD5\\u5B9A\\u5047\\u65E5\n\n#XSEL: (legend)\nLR_WORKINGDAY=\\u5DE5\\u4F5C\\u65E5\n\n#XSEL: (legend)\nLR_DELETIONREQUESTED=\\u5DF2\\u7533\\u8BF7\\u53D6\\u6D88\n\n#XTIT\nLR_DELETION_REQ=\\u53D6\\u6D88\\u7533\\u8BF7\n\n#XTIT\nLR_CHANGE_REQ=\\u53D8\\u66F4\\u7533\\u8BF7\n\n#XTIT\nLR_CHANGE_PENDING=\\u5F85\\u66F4\\u6539\n\n#XTIT\nLR_CANCEL_PENDING=\\u5F85\\u53D6\\u6D88\n\n#XTIT\nLR_CHANGE_DONE=\\u53D8\\u66F4\\u5DF2\\u6279\\u51C6\n\n#XTIT\nLR_CANCEL_DONE=\\u53D6\\u6D88\\u5DF2\\u6279\\u51C6\n\n#XTIT: Original\nLR_OLD_VERSION=\\u539F\\u59CB\n\n#XTIT: Leave Changes\nLR_NEW_VERSION=\\u5DF2\\u66F4\\u6539\n\n#XFLD: Label for Approver Selection\nLR_APPROVER=\\u5BA1\\u6279\\u4EBA\n\n#XFLD: Label for Attendance/Absence Hours\nLR_ABS_HOURS=\\u51FA\\u52E4/\\u7F3A\\u52E4\\u65F6\\u6570\n\n#XFLD: Label for Attachments\nLR_ATTACHMENTS=\\u9644\\u4EF6\n\n#XFLD: Placeholder for Attachments\nLR_ATTACHMENT=\\u6DFB\\u52A0\\u9644\\u4EF6\n\n#XFLD: Label for Start Time\nLR_START_TIME=\\u5F00\\u59CB\\u65F6\\u95F4\n\n#XFLD: Label for Start Time\nLR_END_TIME=\\u7ED3\\u675F\\u65F6\\u95F4\n\n#YMSG: Error message to display, if the file upload fails\nLR_ATTACHMENT_ERROR=\\u65E0\\u6CD5\\u4E0A\\u8F7D\\u9644\\u4EF6\n\n#YMSG: warning message to show if the file type is not supported\nLR_ATTACHMENT_TYPECHECK=\\u4E0D\\u652F\\u6301\\u6B64\\u9644\\u4EF6\\u7C7B\\u578B\n\n#YMSG: Warning message to show if the file size exceeds 25MB- Mega Bytes\nLR_ATTACHMENT_SIZECHECK=\\u6587\\u4EF6\\u592A\\u5927\\u3002\\u8BF7\\u9009\\u62E9\\u5927\\u5C0F\\u5728 25MB \\u4EE5\\u4E0B\\u7684\\u6587\\u4EF6\\u3002\n\n#XFLD: Select Personnel Assignment Label\nPERSONAL_ASSIGN=\\u9009\\u62E9\\u4EBA\\u4E8B\\u5206\\u914D\n\n#XTIT: Select Personnel Assignment Title\nPERSONAL_ASSIGN_TITLE=\\u4EBA\\u4E8B\\u5206\\u914D\n\n#XFLD: Level for approver\nLR_LEVEL=\\u7EA7\\u522B {0}\n\n#YMSG: error message to display, if the maximum number of approvers reached\nLR_APPROVER_LEVEL_MAX=\\u60A8\\u8F93\\u5165\\u7684\\u5BA1\\u6279\\u4EBA\\u6570\\u91CF\\u5DF2\\u8FBE\\u5230\\u6700\\u5927\\u503C\\u3002\n',
	"hcm/myleaverequest/utils/CalendarTools.js":function(){/*
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
},
	"hcm/myleaverequest/utils/ConcurrentEmployment.js":function(){/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.declare("hcm.myleaverequest.utils.ConcurrentEmployment");
jQuery.sap.require("hcm.myleaverequest.utils.DataManager");
/*global hcm:true */
hcm.myleaverequest.utils.ConcurrentEmployment = {

	getCEEnablement: function(self, successHandler) {
		var that = this;
		if (that.iAmAlreadyCalled === false) {
			that.iAmAlreadyCalled = true;
		} else {
			//this is to handle consecutive call when history is refreshed
			that.secondSuccessHandler = successHandler;
			return;
		}

		this.initialize(self, successHandler);
		var oModel = new sap.ui.model.json.JSONModel();
		hcm.myleaverequest.utils.DataManager.getPersonellAssignments(self, function(data) {
			if (data.length > 1) {
				oModel.setData(data);
				self.oCEForm.setModel(oModel);
				self.oCEDialog.open();
			} else {
				self.oApplication.pernr = data[0].Pernr;
				hcm.myleaverequest.utils.UIHelper.setPernr(data[0].Pernr);
				successHandler();
				if (that.secondSuccessHandler) {
					that.secondSuccessHandler();
					that.secondSuccessHandler = null;
				}
			}
		});
	},
	initialize: function(self, successHandler) {
		var that = this;
		this.setControllerInstance(self);
		var itemTemplate = new sap.m.RadioButton({
			text: "{AssignmentText}",
			//key: "{Pernr}"
			customData: new sap.ui.core.CustomData({
				"key": "Pernr",
				"value": "{Pernr}"
			})
		});
		self.oCESelect = new sap.m.RadioButtonGroup().bindAggregation("buttons", "/", itemTemplate);
		self.oCEForm = new sap.ui.layout.form.Form({
			maxContainerCols: 2,
			class: "sapUiLargeMarginTopBottom",
			layout: new sap.ui.layout.form.ResponsiveGridLayout({
				labelSpanL: 12,
				//emptySpanL: 0,
				labelSpanM: 12,
				//emptySpanM: 2,
				labelSpanS: 12,
				columnsL: 2,
				columnsM: 2
			}),
			formContainers: new sap.ui.layout.form.FormContainer({
				formElements: [
                                       new sap.ui.layout.form.FormElement({
						label: new sap.m.Label({
							text: self.resourceBundle.getText("PERSONAL_ASSIGN")
						}),
						fields: self.oCESelect
					})
                               ]
			})
		});

		self.oCEDialog = new sap.m.Dialog({
			title: self.resourceBundle.getText("PERSONAL_ASSIGN_TITLE"),
			class: "sapUiContentPadding sapUiLargeMarginTopBottom",
			content: self.oCEForm,
			buttons: [
			    new sap.m.Button({
					text: self.resourceBundle.getText("LR_OK"),
					press: function() {
						that.iAmAlreadyCalled = false;
						self.oCEDialog.close();
						self.oCEDialog.Cancelled = false;
						self.oApplication.pernr = self.oCESelect.getSelectedButton().data().Pernr;
						hcm.myleaverequest.utils.UIHelper.setPernr(self.oApplication.pernr);
						successHandler();
						if (that.secondSuccessHandler) {
							that.secondSuccessHandler();
							that.secondSuccessHandler = null;
						}
					}
				}),
			    new sap.m.Button({
					text: self.resourceBundle.getText("LR_CANCEL"),
					press: function() {
						that.iAmAlreadyCalled = false;
						self.oCEDialog.close();
						self.oCEDialog.Cancelled = true;
						/*var oHistory = sap.ui.core.routing.History.getInstance();
                        var sPreviousHash = oHistory.getPreviousHash();
                        //The history contains a previous entry           
                            if (sPreviousHash !== undefined)*/
						/* eslint-disable sap-browser-api-warning */
						window.history.go(-1);
						/* eslint-enable sap-browser-api-warning */
						//}
					}
				})

			]
		});
		self.oCEDialog.attachAfterClose(function() {
			if (!self.oApplication.pernr && !self.oCEDialog.Cancelled) {
				self.oCEDialog.open();
			}
		});
	},
	setControllerInstance: function(me) {
		this.me = me;
	},

	getControllerInstance: function() {
		return this.me;
	}

};
},
	"hcm/myleaverequest/utils/DataManager.js":function(){/*
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
},
	"hcm/myleaverequest/utils/Formatters.js":function(){/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.require("sap.ca.ui.model.format.NumberFormat");
jQuery.sap.require("sap.ca.ui.model.format.DateFormat");
jQuery.sap.declare("hcm.myleaverequest.utils.Formatters");
/*global hcm:true*/
hcm.myleaverequest.utils.Formatters = (function() {
	return {
		init: function(resourseBundle) {
			this.resourceBundle = resourseBundle;
		},

		getDate: function(oValue) {
			var oDate;
			if (oValue instanceof Date) {
				oDate = oValue;
			} else {
				if (typeof oValue !== "string" && !(oValue instanceof String)) {
					return null;
				}
				if (oValue.length < 8) {
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
		},

		stripDecimals: function(sNumber) {
			while (sNumber.length > 0 && sNumber.charAt(0) === "0") {
				sNumber = sNumber.substring(1, 1 + sNumber.length - 1);
			}
			var pos = sNumber.indexOf(".");
			if (pos < 0) {
				if (sNumber.length < 1) {
					return "0";
				}
				return sNumber;
			}
			while (sNumber.charAt(sNumber.length - 1) === "0") {
				sNumber = sNumber.substring(0, sNumber.length - 1);
			}
			if (sNumber.charAt(sNumber.length - 1) === ".") {
				sNumber = sNumber.substring(0, sNumber.length - 1);
			}
			if (sNumber.length < 1) {
				return "0";
			}
			if (sNumber.length > 0 && sNumber.charAt(0) === ".") {
				return "0" + sNumber;
			}
			return sNumber;
		},

		adjustSeparator: function(number) {
			try {
				if (!isNaN(parseFloat(number)) && isFinite(number)) {
					var numberFormatter = sap.ca.ui.model.format.NumberFormat
						.getInstance();
					if (number.indexOf(".") > 0) {
						numberFormatter.oFormatOptions.decimals = 2;
					}
					return numberFormatter.format(number);
				}
			} catch (e) {}
			return "";
		},

		// format date MMMyyyy
		DATE_ODATA_MMMyyyy: function(oValue) {

			var oDate = hcm.myleaverequest.utils.Formatters.getDate(oValue);
			if (oDate !== null) {
				var oDateFormat = sap.ca.ui.model.format.DateFormat
					.getInstance({
						pattern: "MMM yyyy"
					});
				return oDateFormat.format(oDate, true);
			} else {
				return null;
			}
		},

		// format date EEEdMMMyyyy
		DATE_ODATA_EEEdMMMyyyy: function(oValue, sStyle) {
			var oDate = hcm.myleaverequest.utils.Formatters.getDate(oValue);
			var oDateFormat;
			if (oDate !== null) {
				if (sStyle) {
					oDateFormat = sap.ca.ui.model.format.DateFormat.getInstance({
							style: sStyle
						});
					return oDateFormat.format(oDate, true);
				} else {
					if (sap.ui.Device.system.phone === true) {
						oDateFormat = sap.ca.ui.model.format.DateFormat.getInstance({
								style: "medium"
							});
						return oDateFormat.format(oDate, true);
					} else {
						oDateFormat = sap.ca.ui.model.format.DateFormat.getInstance({
								style: "medium"
							});
						return oDateFormat.format(oDate, true);
					}
				}
			} else {
				return null;
			}
		},

		// format date EEEdMMMyyyy
		DATE_ODATA_EEEdMMMyyyyLong: function(oValue, sStyle) {

			var oDate = hcm.myleaverequest.utils.Formatters.getDate(oValue);
			var oDateFormat;
			if (oDate !== null) {
				if (sStyle) {
					oDateFormat = sap.ca.ui.model.format.DateFormat.getInstance({
							style: sStyle
						});
					return oDateFormat.format(oDate, true);
				} else {
					if (sap.ui.Device.system.phone === true) {
						oDateFormat = sap.ca.ui.model.format.DateFormat.getInstance({
								style: "long"
							});
						return oDateFormat.format(oDate, true);
					} else {
						oDateFormat = sap.ca.ui.model.format.DateFormat.getInstance({
								style: "full"
							});
						return oDateFormat.format(oDate, true);
					}
				}
			} else {
				return null;
			}
		},

		// format date ddMMMyyyy
		DATE_ODATA_ddMMMyyyy: function(oValue) {
			var oDate = hcm.myleaverequest.utils.Formatters.getDate(oValue);

			if (oDate !== null) {
				var oDateFormat = sap.ca.ui.model.format.DateFormat
					.getInstance({
						pattern: "dd.MM.yyyy"
					});
				return oDateFormat.format(oDate, true);
			} else {
				return null;
			}
		},

		// format date YYYYMMdd
		DATE_YYYYMMdd: function(oDate) {

			if (oDate === undefined)
				return "";

			var oDateFormat = sap.ca.ui.model.format.DateFormat.getInstance({
				pattern: "YYYY-MM-dd"
			});

			return oDateFormat.format(oDate);
		},

		BALANCE: function(oValue) {

			if (oValue === undefined)
				return "";

			if (typeof oValue !== 'string' && !(oValue instanceof String))
				return "";

			return hcm.myleaverequest.utils.Formatters
				.adjustSeparator(hcm.myleaverequest.utils.Formatters
					.stripDecimals(oValue));
		},

		//return duration Hours in 00:00 format 
		DURATION_FORMAT: function(sHours) {
			if (sHours.indexOf(".") > -1) {
				var duration = sHours.split(".");
				var hours = duration[0].toString();
				if (parseInt(duration[1]) < 10) duration[1] = parseInt(duration[1]) * 10;
				var minutes = (parseInt(duration[1]) * 60) / 100;
				minutes = Math.round(minutes);
				minutes = minutes.toString();
				if (minutes < 10) minutes = "0" + minutes;
				return hours + ":" + minutes;
			} else
				return sHours + ":00";

		},

		// return duration days or hours depending on input
		DURATION: function(sDays, sHours) {

			if (sDays === undefined || sHours === undefined)
				return "";

			sDays = hcm.myleaverequest.utils.Formatters
				.stripDecimals(sDays);
            if(sDays){
			var pos = sDays.indexOf(".");
			if (pos < 0)
				return hcm.myleaverequest.utils.Formatters.adjustSeparator(sDays);
            }
			return hcm.myleaverequest.utils.Formatters.DURATION_FORMAT(hcm.myleaverequest.utils.Formatters.stripDecimals(sHours));
		},

		// determine duration unit based on leave time range
		DURATION_UNIT: function(sDays, sHours) {

			if (sDays === undefined || sHours === undefined)
				return "";

			sDays = hcm.myleaverequest.utils.Formatters
				.stripDecimals(sDays);
            if(sDays){
                var pos = sDays.indexOf(".");
			if (pos < 0)
				return (sDays * 1 !== 1) ? hcm.myleaverequest.utils.Formatters.resourceBundle
					.getText("LR_DAYS") : hcm.myleaverequest.utils.Formatters.resourceBundle
					.getText("LR_DAY");
            }
			return (sHours * 1 !== 1) ? hcm.myleaverequest.utils.Formatters.resourceBundle
				.getText("LR_HOURS") : hcm.myleaverequest.utils.Formatters.resourceBundle.getText("LR_HOUR");
		},

		// check leave time range whether below 1 day
		isHalfDayLeave: function(sDays) {

			if (sDays === undefined)
				return false;

			sDays = hcm.myleaverequest.utils.Formatters
				.stripDecimals(sDays);

			var pos = sDays.indexOf(".");
			if (pos < 0)
				return false;

			return true;
		},

		// time formatter
		TIME_hhmm: function(oValue) {

			if (oValue === undefined)
				return "";

			var oDate;

			if (oValue instanceof Date) {
				oDate = oValue;
			} else if (oValue.ms) {
				var hours = (oValue.ms / (3600 * 1000)) | 0;
				var minutes = ((oValue.ms - (hours * 3600 * 1000)) / (60 * 1000)) | 0;
				var seconds = ((oValue.ms - (hours * 3600 * 1000) - (minutes * 60 * 1000)) / 1000) | 0;
				oDate = new Date();
				oDate.setHours(hours, minutes, seconds, 0);
			} else {
				if (typeof oValue !== 'string' && !(oValue instanceof String))
					return "";
				if (oValue.length !== 6)
					return "";
				var hours = oValue.substring(0, 2) * 1;
				var minutes = oValue.substring(2, 4) * 1;
				var seconds = oValue.substring(4, 6) * 1;
				oDate = new Date();
				oDate.setHours(hours, minutes, seconds, 0);
			}

			var oDateFormat = sap.ca.ui.model.format.DateFormat
				.getTimeInstance({
					style: "short"
				});
			var sTime = oDateFormat.format(oDate);
			var aTimeSegments = sTime.split(":");
			var sAmPm = "";
			var lastSeg = aTimeSegments[aTimeSegments.length - 1];

			// chop off seconds
			// check for am/pm at the end
			if (isNaN(lastSeg)) {
				var aAmPm = lastSeg.split(" ");
				// result array can only have 2 entries
				aTimeSegments[aTimeSegments.length - 1] = aAmPm[0];
				sAmPm = " " + aAmPm[1];
			}
			return (aTimeSegments[0] + ":" + aTimeSegments[1] + sAmPm);

		},

		// format date and time in format EEEdMMMyyyy
		FORMAT_DATETIME: function(sPrefix, oValue) {

			return sPrefix + " " + hcm.myleaverequest.utils.Formatters
				.DATE_ODATA_EEEdMMMyyyy(oValue);
		},

		// history view date and label formatters: related dates are the ones
		// from an original leave request
		// where a change request has been submitted

		// header label indicating cancel or change request pending
		FORMATTER_INTRO: function(aRelatedRequests) {
			if (!aRelatedRequests || aRelatedRequests.length < 1) {
				return "";
			}
			var sLeaveRequestType = aRelatedRequests[0].LeaveRequestType;
			var sStatusCode = aRelatedRequests[0].StatusCode;
			if (sLeaveRequestType && sLeaveRequestType.toString() === "2") {
				if (sStatusCode === "SENT") {
					return hcm.myleaverequest.utils.Formatters.resourceBundle
						.getText("LR_CHANGE_PENDING");
				}
				if (sStatusCode === "APPROVED") {
					return hcm.myleaverequest.utils.Formatters.resourceBundle
						.getText("LR_CHANGE_DONE");
				}
			}
			if (sLeaveRequestType && sLeaveRequestType.toString() === "3") {
				if (sStatusCode === "SENT") {
					return hcm.myleaverequest.utils.Formatters.resourceBundle
						.getText("LR_CANCEL_PENDING");
				}
				if (sStatusCode === "APPROVED") {
					return hcm.myleaverequest.utils.Formatters.resourceBundle
						.getText("LR_CANCEL_DONE");
				}
			}
			return "";
		},

		// format end date
		FORMAT_ENDDATE: function(sHyphen, sWorkingDaysDuration, sStartTime,
			sEndDate, sEndTime) {
			try {
				if (sHyphen && sWorkingDaysDuration && sStartTime && sEndDate && sEndTime) {
					if (hcm.myleaverequest.utils.Formatters
						.isHalfDayLeave(sWorkingDaysDuration)) {
						return hcm.myleaverequest.utils.Formatters
							.TIME_hhmm(sStartTime) + " " + sHyphen + " " + hcm.myleaverequest.utils.Formatters
							.TIME_hhmm(sEndTime);
					} else if (sWorkingDaysDuration * 1 !== 1) {
						return sHyphen + " " + hcm.myleaverequest.utils.Formatters.DATE_ODATA_EEEdMMMyyyy(sEndDate);
					}
				}
			} catch (e) {
				// ignore
			}
			return "";
		},

		// format end date
		FORMAT_ENDDATE_LONG: function(sHyphen, sWorkingDaysDuration, sStartTime,
			sEndDate, sEndTime) {
			try {
				if (sHyphen && sWorkingDaysDuration && sStartTime && sEndDate && sEndTime) {
					if (hcm.myleaverequest.utils.Formatters
						.isHalfDayLeave(sWorkingDaysDuration)) {
						return hcm.myleaverequest.utils.Formatters
							.TIME_hhmm(sStartTime) + " " + sHyphen + " " + hcm.myleaverequest.utils.Formatters
							.TIME_hhmm(sEndTime);
					} else if (sWorkingDaysDuration * 1 != 1) {
						return sHyphen + " " + hcm.myleaverequest.utils.Formatters
							.DATE_ODATA_EEEdMMMyyyyLong(sEndDate);
					}
				}
			} catch (e) {
				// ignore
			}
			return "";
		},

		// visibility setter for original/changed date range labels
		SET_RELATED_VISIBILITY: function(aRelatedRequests) {
			return aRelatedRequests !== undefined && aRelatedRequests.length > 0 && aRelatedRequests[0].LeaveRequestType == "2";
		},

		SET_RELATED_START_DATE_VISIBILITY: function(aRelatedRequests) {
			return aRelatedRequests !== undefined && aRelatedRequests.length > 0 && aRelatedRequests[0].LeaveRequestType == "2" && aRelatedRequests[
				0].StartDate != undefined;
		},

		// format related start date
		FORMAT_RELATED_START_DATE: function(aRelatedRequests) {
			if (aRelatedRequests !== undefined && aRelatedRequests.length > 0 && aRelatedRequests[0].LeaveRequestType == "2" && aRelatedRequests[0].StartDate !=
				undefined) {
				try {
					return hcm.myleaverequest.utils.Formatters
						.DATE_ODATA_EEEdMMMyyyy(aRelatedRequests[0].StartDate);
				} catch (e) {}
			}
			return "";
		},

		FORMAT_RELATED_START_DATE_LONG: function(aRelatedRequests) {
			if (aRelatedRequests !== undefined && aRelatedRequests.length > 0 && aRelatedRequests[0].LeaveRequestType == "2" && aRelatedRequests[0].StartDate !=
				undefined) {
				try {
					return hcm.myleaverequest.utils.Formatters
						.DATE_ODATA_EEEdMMMyyyyLong(aRelatedRequests[0].StartDate);
				} catch (e) {}
			}
			return "";
		},

		// set related end date from change request visible if available
		SET_RELATED_END_DATE_VISIBILITY: function(aRelatedRequests) {
			return aRelatedRequests != undefined && aRelatedRequests.length > 0 && aRelatedRequests[0].LeaveRequestType == "2" && aRelatedRequests[
					0].WorkingDaysDuration != undefined && aRelatedRequests[0].StartDate != undefined && aRelatedRequests[0].EndDate != undefined && !
				aRelatedRequests[0].EndTime != undefined && (hcm.myleaverequest.utils.Formatters
					.isHalfDayLeave(aRelatedRequests[0].WorkingDaysDuration) || aRelatedRequests[0].WorkingDaysDuration * 1 != 1);
		},

		// format related end date
		FORMAT_RELATED_END_DATE: function(sHyphen, aRelatedRequests) {
			if (aRelatedRequests != undefined && aRelatedRequests.length > 0 && aRelatedRequests[0].LeaveRequestType == "2" && aRelatedRequests[0].WorkingDaysDuration !=
				undefined && aRelatedRequests[0].StartDate != undefined && aRelatedRequests[0].EndDate != undefined && !aRelatedRequests[0].EndTime !=
				undefined) {
				try {
					if (hcm.myleaverequest.utils.Formatters
						.isHalfDayLeave(aRelatedRequests[0].WorkingDaysDuration)) {
						return hcm.myleaverequest.utils.Formatters
							.TIME_hhmm(aRelatedRequests[0].StartTime) + " " + sHyphen + " " + hcm.myleaverequest.utils.Formatters
							.TIME_hhmm(aRelatedRequests[0].EndTime);
					}
					if (aRelatedRequests[0].WorkingDaysDuration * 1 != 1) {
						return sHyphen + " " + hcm.myleaverequest.utils.Formatters
							.DATE_ODATA_EEEdMMMyyyy(aRelatedRequests[0].EndDate);
					}
				} catch (e) {}
			}
			return "";
		},

		FORMAT_RELATED_END_DATE_LONG: function(sHyphen, aRelatedRequests) {
			if (aRelatedRequests != undefined && aRelatedRequests.length > 0 && aRelatedRequests[0].LeaveRequestType == "2" && aRelatedRequests[0].WorkingDaysDuration !=
				undefined && aRelatedRequests[0].StartDate != undefined && aRelatedRequests[0].EndDate != undefined && !aRelatedRequests[0].EndTime !=
				undefined) {
				try {
					if (hcm.myleaverequest.utils.Formatters
						.isHalfDayLeave(aRelatedRequests[0].WorkingDaysDuration)) {
						return hcm.myleaverequest.utils.Formatters
							.TIME_hhmm(aRelatedRequests[0].StartTime) + " " + sHyphen + " " + hcm.myleaverequest.utils.Formatters
							.TIME_hhmm(aRelatedRequests[0].EndTime);
					}
					if (aRelatedRequests[0].WorkingDaysDuration * 1 != 1) {
						return sHyphen + " " + hcm.myleaverequest.utils.Formatters
							.DATE_ODATA_EEEdMMMyyyyLong(aRelatedRequests[0].EndDate);
					}
				} catch (e) {}
			}
			return "";
		},

		State: function(status) {
			status = status.toLowerCase();
			switch (status) {
				case "sent":
					return null;
				case "posted":
					return "Success";
				case "approved":
					return "Success";
				case "rejected":
					return "Error";
				default:
					return null;
			}

		},

		/**
		 * Adds BalanceUsedQuantity, BalanceApprovedQuantity & BalanceRequestedQuantity
		 * @param {String} BalanceUsedQuantity
		 * @param {String} BalanceApprovedQuantity
		 * @param {String} BalanceRequestedQuantity
		 * @return {String} totalUsed
		 */
		calculateUsed: function(BalanceUsedQuantity, BalanceApprovedQuantity, BalanceRequestedQuantity) {
			var sBalanceTotalUsedQuantity = parseFloat(BalanceUsedQuantity) + parseFloat(BalanceApprovedQuantity) + parseFloat(
				BalanceRequestedQuantity);
			sBalanceTotalUsedQuantity = hcm.myleaverequest.utils.Formatters.BALANCE(sBalanceTotalUsedQuantity.toString());
			return sBalanceTotalUsedQuantity;
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
				oDate = new Date(d.substring(0, 4), parseInt(d.substring(4, 6), 10) - 1, d.substring(6, 8), t.substring(0, 2), t.substring(2, 4), t.substring(4, 6));
				var oDateFormat = sap.ca.ui.model.format.DateFormat.getDateTimeInstance({style: 'medium'});
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
	_parseAttachments: function(attachmentString, RequestID,oModel) {
		try {
			var attachments = attachmentString.split("::NEW::");
			var result = [];
			var oEntry = {};
			var temp, i, d, t, oDate;
			var oPernr = hcm.myleaverequest.utils.UIHelper.getPernr();
			//first one will be junk
			for (i = 1; i < attachments.length; i++) {
				oEntry = {};
				temp = attachments[i].split("::::");
				oEntry.FileName = temp[0];
				oEntry.FileType = '';
				oEntry.Contributor = temp[2];
				d = temp[3].toString();
				t = temp[4].toString();
				oDate = new Date(d.substring(0, 4), parseInt(d.substring(4, 6), 10) - 1, d.substring(6, 8), t.substring(0, 2), t.substring(2, 4), t.substring(4, 6));
				var oDateFormat = sap.ca.ui.model.format.DateFormat.getDateTimeInstance({style: 'medium'});
				oEntry.UploadedDate = oDateFormat.format(oDate);
				oEntry.DocumentId = temp[5];
				oEntry.Status = temp[6];
				oEntry.FilePath = temp[7];
				oEntry.FileSize = parseFloat(temp[8],10);
				oEntry.FileSizeDesc = temp[9];
				oEntry.MimeType = temp[1];
				if(temp[5]){
				// 2299607 <<
				   //oEntry.FileUrl = oModel.sServiceUrl + "/FileAttachmentSet(EmployeeID='" + oPernr + "',LeaveRequestId='" + RequestID + "',ArchivDocId='" + temp[5] + "')/$value";
				   oEntry.FileUrl = oModel.sServiceUrl + "/FileAttachmentSet(EmployeeID='" + oPernr + "',LeaveRequestId='" + RequestID + "',ArchivDocId='" + temp[5] + "',FileName='" + encodeURIComponent(oEntry.FileName) + "')/$value";
				   // Note 2299607 <<
				}
				else{
				    jQuery.sap.log.error("ArchivDocId is missing for LeaveRequestID:" + RequestID, [], ["hcm.myleaverequest.utils.Formatters._parseAttachments"]);
				    oEntry.FileUrl = "";
				}
				result.push(oEntry);
			}
			return {
				"AttachmentsCollection": result
			};
		} catch (e) {
			//log the error
			jQuery.sap.log.error("Failed to parse notes details in utils.Formatters._parseAttachments with input" + attachmentString);
		}
	},
	isRequired:function(value){
		if(value === "" || value === null || value === undefined){
			return false;
		}
		else return true;
	},
//FA 2310160<<
		formatterAbsenceDuration: function(WorkingDaysDuration, WorkingHoursDuration, Alldf){
		    		var finalduration;
					if (WorkingHoursDuration === null || WorkingDaysDuration === null || Alldf === null){
						return "";
					}
					if (Alldf){
						finalduration = hcm.myleaverequest.utils.Formatters.stripDecimals(WorkingDaysDuration);
					}else {
						finalduration = hcm.myleaverequest.utils.Formatters.stripDecimals(WorkingHoursDuration);
					}
					return finalduration;
		},
		formatterAbsenceDurationUnit: function(WorkingDaysDuration, WorkingHoursDuration, Alldf){
		    				var finalUnit;
					if (Alldf){
						if (parseInt(WorkingDaysDuration, 10) === 1 ){
							finalUnit = hcm.myleaverequest.utils.Formatters.resourceBundle.getText("LR_DAY");
						}else{
							finalUnit = hcm.myleaverequest.utils.Formatters.resourceBundle.getText("LR_DAYS");
						}
					}
					else{
						if(parseInt(WorkingHoursDuration, 10) === 1){
							finalUnit = hcm.myleaverequest.utils.Formatters.resourceBundle.getText("LR_HOUR");
						}else {
						finalUnit = hcm.myleaverequest.utils.Formatters.resourceBundle.getText("LR_HOURS");
						}
					}
					return finalUnit;
		}

//FA 2310160>>

	};

}());
},
	"hcm/myleaverequest/utils/UIHelper.js":function(){/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.require("sap.ca.ui.dialog.factory");
jQuery.sap.declare("hcm.myleaverequest.utils.UIHelper");

hcm.myleaverequest.utils.UIHelper = (function() {
	var _cntrlrInst = null;
	var _objLeaveRequestCollection = null;
	var _isLeaveCollCached = false;
	var _isWithDrawn = [];
	var _isChangeAction = false;
	var _isWithDrawAction = false;
	var _pernr = null;
	return {

		setControllerInstance : function(oControllerInst) {
			_cntrlrInst = oControllerInst;
		},

		getControllerInstance : function() {
			return _cntrlrInst;
		},
		setRoutingProperty : function(objLeaveRequestCollection) {
			if(objLeaveRequestCollection){
				for ( var oItemIndex = 0; oItemIndex < objLeaveRequestCollection.length; oItemIndex++) {
					var oLeaveKey = objLeaveRequestCollection[oItemIndex].LeaveKey;
					var oRequestID = objLeaveRequestCollection[oItemIndex].RequestID;
					if(oRequestID !== ""){
						objLeaveRequestCollection[oItemIndex]._navProperty = oRequestID;
					}else{
						objLeaveRequestCollection[oItemIndex]._navProperty = oLeaveKey;
					}
				}
			}
			_objLeaveRequestCollection = objLeaveRequestCollection;
		},

		getRoutingProperty : function() {
			return _objLeaveRequestCollection;
		},
		setIsLeaveCollCached : function(isLeaveCollCached) {
			_isLeaveCollCached = isLeaveCollCached;
		},

		getIsLeaveCollCached : function() {
			return _isLeaveCollCached;
		},
		
		setIsWithDrawn : function(id) {
			_isWithDrawn.push(id);
		},

		getIsWithDrawn : function(id) {
			if(jQuery.inArray(id,_isWithDrawn) >= 0)
			return true;
			else return false;
		},
		
		setIsChangeAction : function(oStatus) {
			_isChangeAction = oStatus;
		},

		getIsChangeAction : function() {
			return _isChangeAction;
		},
		
		setIsWithDrawAction : function(oStatus) {
			_isWithDrawAction = oStatus;
		},

		getIsWithDrawAction : function() {
			return _isWithDrawAction;
		},
		setPernr : function(oPernr) {
			_pernr = oPernr;
		},

		getPernr : function() {
			return _pernr;
		},
		errorDialog : function(messages) {

			var _errorTxt = "";
			var _firstMsgTxtLine = "";
			var _detailmsg = "";
			var oSettings = "";

			if (typeof messages === "string") {
				oSettings = {
					message : messages,
					type : sap.ca.ui.message.Type.ERROR
				};
			} else if (messages instanceof Array) {

				for ( var i = 0; i < messages.length; i++) {
					_errorTxt = "";
					if (typeof messages[i] === "string") {
						_errorTxt = messages[i];
					} else if (typeof messages[i] === "object") {
						_errorTxt = messages[i].value;
					}
					_errorTxt.trim();
					if( _errorTxt !== ""){
    					if (i === 0) {
    						_firstMsgTxtLine = _errorTxt;
    					} else {
    						_detailmsg = _detailmsg + _errorTxt + "\n";
    					}
					}
				}

				if (_detailmsg == "") { // do not show any details if none are there
					oSettings = {
						message : _firstMsgTxtLine,
						type : sap.ca.ui.message.Type.ERROR
					};
				} else {
					oSettings = {
						message : _firstMsgTxtLine,
						details : _detailmsg,
						type : sap.ca.ui.message.Type.ERROR
					};
				}

			}
			sap.ca.ui.message.showMessageBox(oSettings);
		}

	};

}());
},
	"hcm/myleaverequest/view/S1.controller.js":function(){/*
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
},
	"hcm/myleaverequest/view/S1.view.xml":'<!--\n\n    Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved\n\n-->\n<!--Copyright (C) 2009-2013 SAP AG or an SAP affiliate company. All rights reserved-->\n<sap.ui.core:View id="S1" xmlns="sap.m"\n    xmlns:sap.ui.layout.form="sap.ui.layout.form" xmlns:sap.ui.layout="sap.ui.layout"\n    xmlns:sap.me="sap.me" xmlns:sap.ui.core="sap.ui.core" xmlns:ui="sap.ca.ui" xmlns:sap.ui.unified="sap.ui.unified"\n    controllerName="hcm.myleaverequest.view.S1">\n\n\t<Page id="S1_page" title="{i18n>LR_TITLE_HOME_VIEW}">\n\t\t<content>\n\t\t\t<sap.ui.layout:Grid id="LRS4_FLX_TOP" width="auto" defaultIndent="L4 M3"\n\t\t\t\tdefaultSpan="L4 M6 S12" class="s4leaveTypeSelectorFlx">\n\t\t\t\t<sap.ui.layout:content>\n\t\t\t\t\t<Select id="SLCT_LEAVETYPE" change="onSelectionChange"\n\t\t\t\t\t\twidth="100%">\t\t\t\t\t\t\n\t\t\t\t\t</Select>\n\t\t\t\t</sap.ui.layout:content>\n\t\t\t</sap.ui.layout:Grid>\n\n\t\t\t<sap.ui.layout:Grid defaultSpan="L12 M12 S12"\n\t\t\t\twidth="auto">\n\t\t\t\t<sap.ui.layout:content>\n\t\t\t\t\t<sap.ui.layout.form:Form id="LRS4_FRM_MAIN"\n\t\t\t\t\t\tminWidth="1024" maxContainerCols="2">\n\t\t\t\t\t\t<sap.ui.layout.form:layout>\n\t\t\t\t\t\t\t<sap.ui.layout.form:ResponsiveGridLayout\n\t\t\t\t\t\t\t\tlabelSpanL="3" labelSpanM="3" emptySpanL="4" emptySpanM="4"\n\t\t\t\t\t\t\t\tcolumnsL="1" columnsM="1" />\n\t\t\t\t\t\t</sap.ui.layout.form:layout>\n\n\t\t\t\t\t\t<sap.ui.layout.form:formContainers>\n\t\t\t\t\t\t\t<sap.ui.layout.form:FormContainer\n\t\t\t\t\t\t\t\tid="LRS4_FRM_CNT_CALENDAR">\n\t\t\t\t\t\t\t\t<sap.ui.layout.form:layoutData>\n\n\t\t\t\t\t\t\t\t\t<sap.ui.layout:ResponsiveFlowLayoutData\n\t\t\t\t\t\t\t\t\t\tweight="6" linebreak="true"></sap.ui.layout:ResponsiveFlowLayoutData>\n\t\t\t\t\t\t\t\t</sap.ui.layout.form:layoutData>\n\t\t\t\t\t\t\t\t<sap.ui.layout.form:formElements>\n\t\t\t\t\t\t\t\t\t<sap.ui.layout.form:FormElement\n\t\t\t\t\t\t\t\t\t\tid="LRS4_FELEM_CALENDAR">\n\t\t\t\t\t\t\t\t\t\t<sap.ui.layout.form:layoutData>\n\t\t\t\t\t\t\t\t\t\t\t<sap.ui.layout:ResponsiveFlowLayoutData></sap.ui.layout:ResponsiveFlowLayoutData>\n\t\t\t\t\t\t\t\t\t\t</sap.ui.layout.form:layoutData>\n\t\t\t\t\t\t\t\t\t\t<sap.ui.layout.form:fields>\n\t\t\t\t\t\t\t\t\t\t\t<sap.me:Calendar id="LRS4_DAT_CALENDAR"\n\t\t\t\t\t\t\t\t\t\t\t\tclass="s4Calendar"></sap.me:Calendar>\n\t\t\t\t\t\t\t\t\t\t\t<sap.me:CalendarLegend id="LRS4_LEGEND"         \n                                                class="s4LEGEND" legendWidth="18em">                                \n                                                <sap.me:layoutData>\n                                                <sap.ui.layout:ResponsiveFlowLayoutData\n                                                    id="LRS4_LYO_LEGEND" minWidth="30" weight="15"></sap.ui.layout:ResponsiveFlowLayoutData>\n                                                </sap.me:layoutData>\n                                            </sap.me:CalendarLegend>\n\t\t\t\t\t\t\t\t\t\t</sap.ui.layout.form:fields>\n\t\t\t\t\t\t\t\t\t</sap.ui.layout.form:FormElement>\n\t\t\t\t\t\t\t\t</sap.ui.layout.form:formElements>\n\t\t\t\t\t\t\t</sap.ui.layout.form:FormContainer>\n\t\t\t\t\t\t\t<sap.ui.layout.form:FormContainer\n\t\t\t\t\t\t\t\tid="LRS4_FRM_CNT_BALANCES">\n\t\t\t\t\t\t\t\t<sap.ui.layout.form:layoutData>\n\t\t\t\t\t\t\t\t\t<sap.ui.layout:ResponsiveFlowLayoutData\n\t\t\t\t\t\t\t\t\t\tweight="3"></sap.ui.layout:ResponsiveFlowLayoutData>\n\t\t\t\t\t\t\t\t</sap.ui.layout.form:layoutData>\n\t\t\t\t\t\t\t\t<sap.ui.layout.form:formElements>\n\t\t\t\t\t\t\t\t\t<sap.ui.layout.form:FormElement\n\t\t\t\t\t\t\t\t\t\tid="LRS4_FELEM_BALANCES">\n\t\t\t\t\t\t\t\t\t\t<sap.ui.layout.form:layoutData>\n\t\t\t\t\t\t\t\t\t\t\t<sap.ui.layout:ResponsiveFlowLayoutData></sap.ui.layout:ResponsiveFlowLayoutData>\n\t\t\t\t\t\t\t\t\t\t</sap.ui.layout.form:layoutData>\n\t\t\t\t\t\t\t\t\t\t<sap.ui.layout.form:fields>\n\t\t\t\t\t\t\t\t\t\t\t<sap.ui.layout:Grid width="100%"\n\t\t\t\t\t\t\t\t\t\t\t\tdefaultSpan="L6 M6 S6">\n\t\t\t\t\t\t\t\t\t\t\t\t<sap.ui.layout:content>\n\t\t\t\t\t\t\t\t\t\t\t\t\t<sap.ui.layout:VerticalLayout id="LRS4_TXT_BOOKEDDAYS"\n\t\t\t\t\t\t\t\t\t\t\t\t\t\tclass="s4BalancesFlxLeft" width="100%">\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t<BusyIndicator id="LRS1_BUSY_BOOKEDDAYS" size= "1em" visible ="true"></BusyIndicator>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t<ObjectNumber id="LRS4_TXT_BOOKED_DAYS"\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tclass="s4BALANCEOBJECT" number="{TimeAccount>BalanceTotalUsedQuantity}"\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tunit="{TimeAccount>TimeUnitName}" visible="false">\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<FlexItemData growFactor="1"></FlexItemData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t</layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t</ObjectNumber>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t<ObjectStatus id="LRS4_TXT_BOOKED" text="{i18n>LR_BALANCE_USED}">\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<FlexItemData growFactor="1"></FlexItemData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t</layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t</ObjectStatus>\n\t\t\t\t\t\t\t\t\t\t\t\t\t</sap.ui.layout:VerticalLayout>\n\t\t\t\t\t\t\t\t\t\t\t\t\t<sap.ui.layout:VerticalLayout id="LRS4_TXT_REMAININGDAY"\n\t\t\t\t\t\t\t\t\t\t\t\t\t\tclass="s4BalancesFlxRight" width="100%">\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t<BusyIndicator id="LRS1_BUSY_REMAININGDAYS" size= "1em" visible ="true"></BusyIndicator>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t<ObjectNumber id="LRS4_TXT_REMAINING_DAYS"\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tclass="s4BALANCEOBJECT" number="{TimeAccount>BalanceAvailableQuantity}"\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tunit="{TimeAccount>TimeUnitName}" visible="false">\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<FlexItemData growFactor="1"></FlexItemData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t</layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t</ObjectNumber>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t<ObjectStatus id="LRS4_TXT_REMAINING" text="{i18n>LR_BALANCE_BALANCE}">\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<FlexItemData growFactor="1"></FlexItemData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t</layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t</ObjectStatus>\n\t\t\t\t\t\t\t\t\t\t\t\t\t</sap.ui.layout:VerticalLayout>\n\t\t\t\t\t\t\t\t\t\t\t\t</sap.ui.layout:content>\n\t\t\t\t\t\t\t\t\t\t\t</sap.ui.layout:Grid>\n\t\t\t\t\t\t\t\t\t\t</sap.ui.layout.form:fields>\n\t\t\t\t\t\t\t\t\t</sap.ui.layout.form:FormElement>\n\t\t\t\t\t\t\t\t\t<sap.ui.layout.form:FormElement\n\t\t\t\t\t\t\t\t\t\tid="LRS4_FELEM_TIMEINPUT" visible="false">\n\t\t\t\t\t\t\t\t\t\t<sap.ui.layout.form:layoutData>\n\t\t\t\t\t\t\t\t\t\t\t<sap.ui.layout:ResponsiveFlowLayoutData\n\t\t\t\t\t\t\t\t\t\t\t\tlinebreak="true"></sap.ui.layout:ResponsiveFlowLayoutData>\n\t\t\t\t\t\t\t\t\t\t    </sap.ui.layout.form:layoutData>\n\t\t\t\t\t\t\t\t\t\t<sap.ui.layout.form:fields>\n\t\t\t\t\t\t\t\t\t\t\t<sap.ui.layout:Grid width="100%"\n\t\t\t\t\t\t\t\t\t\t\t\tdefaultSpan="L6 M6 S6">\n\t\t\t\t\t\t\t\t\t\t\t\t<sap.ui.layout:content>\n\t\t\t\t\t\t\t\t\t\t\t\t\t<sap.ui.layout:VerticalLayout width="100%">\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t<Label id="LRS4_LBL_STARTTIME" text="{i18n>LR_START_TIME}"></Label>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t<DateTimeInput id="LRS4_DAT_STARTTIME"\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tchange="onTimeChange" type="Time"\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tvalueFormat="HH:mm"></DateTimeInput>\n\t\t\t\t\t\t\t\t\t\t\t\t\t</sap.ui.layout:VerticalLayout>\n\t\t\t\t\t\t\t\t\t\t\t\t\t<sap.ui.layout:VerticalLayout width="100%">\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t<Label id="LRS4_LBL_ENDTIME" text="{i18n>LR_END_TIME}"></Label>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t<DateTimeInput id="LRS4_DAT_ENDTIME" change="onTimeChange"\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\ttype="Time" valueFormat="HH:mm"></DateTimeInput>\n\t\t\t\t\t\t\t\t\t\t\t\t\t</sap.ui.layout:VerticalLayout>\n\t\t\t\t\t\t\t\t\t\t\t\t</sap.ui.layout:content>\n\t\t\t\t\t\t\t\t\t\t\t</sap.ui.layout:Grid>\n\t\t\t\t\t\t\t\t\t\t\t</sap.ui.layout.form:fields>\n\t\t\t\t\t\t\t\t\t</sap.ui.layout.form:FormElement>\n\t\t\t\t\t\t\t\t\t\t<sap.ui.layout.form:FormElement\n\t\t\t\t\t\t\t\t\t\tid="LRS4_FELEM_ABSENCE" visible="false">\n\t\t\t\t\t\t\t\t\t\t<sap.ui.layout.form:layoutData>\n\t\t\t\t\t\t\t\t\t\t\t<sap.ui.layout:ResponsiveFlowLayoutData\n\t\t\t\t\t\t\t\t\t\t\t\tlinebreak="true"></sap.ui.layout:ResponsiveFlowLayoutData>\n\t\t\t\t\t\t\t\t\t\t    </sap.ui.layout.form:layoutData>\n\t\t\t\t\t\t\t\t\t\t    <sap.ui.layout.form:fields>\n\t\t\t\t\t\t\t\t\t\t\t<sap.ui.layout:Grid width="100%"\n\t\t\t\t\t\t\t\t\t\t\t\tdefaultSpan="L12 M12 S12">\n\t\t\t\t\t\t\t\t\t\t\t\t<sap.ui.layout:content>\n\t\t\t\t\t\t\t\t\t\t\t\t\t<sap.ui.layout:VerticalLayout width="100%">\n\t\t\t\t\t\t\t\t\t\t\t\t\t   \t<Label id="LRS4_LBL_ABS_HOURS" text="{i18n>LR_ABS_HOURS}"></Label>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t<Input id="LRS4_ABS_HOURS" change="onAbsenceHoursChange" maxLength="10"></Input>\n\t\t\t\t\t\t\t\t\t\t\t\t\t</sap.ui.layout:VerticalLayout>\n\t\t\t\t\t\t\t\t\t\t\t\t</sap.ui.layout:content>\n\t\t\t\t\t\t\t\t\t\t\t</sap.ui.layout:Grid>\n\t\t\t\t\t\t\t\t\t\t</sap.ui.layout.form:fields>\n\t\t\t\t\t\t\t\t\t</sap.ui.layout.form:FormElement>\n\t\t\t\t\t\t\t\t\t\t<sap.ui.layout.form:FormElement\n\t\t\t\t\t\t\t\t\t\tid="LR_FELEM_APPROVER">\n\t\t\t\t\t\t\t\t\t\t<sap.ui.layout.form:layoutData>\n\t\t\t\t\t\t\t\t\t\t\t<sap.ui.layout:ResponsiveFlowLayoutData\n\t\t\t\t\t\t\t\t\t\t\t\tlinebreak="true"></sap.ui.layout:ResponsiveFlowLayoutData>\n\t\t\t\t\t\t\t\t\t\t</sap.ui.layout.form:layoutData>\n\t\t\t\t\t\t\t\t\t\t<sap.ui.layout.form:fields id="LR_APP_FIELD">\n\t\t\t\t\t\t\t\t\t\t\t<sap.ui.layout:Grid id="LR_APPROVER" width="100%"\n\t\t\t\t\t\t\t\t\t\t\t\tdefaultSpan="L12 M12 S12">\n\t\t\t\t\t\t\t\t\t\t\t\t<sap.ui.layout:content>\n\t\t\t\t\t\t\t\t\t\t\t\t\t<Label id="LRS4_LBL_APPROVER" text="{i18n>LR_APPROVER}">\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t<layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<sap.ui.layout:ResponsiveFlowLayoutData\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tlinebreak="true"></sap.ui.layout:ResponsiveFlowLayoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t</layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t</Label>\n\t\t\t\t\t\t\t\t\t\t\t\t\t<!--<sap.ui.layout:HorizontalLayout width="100%">-->\n\t\t\t\t\t\t\t\t\t\t\t\t\t<FlexBox width = "100%">\n\t\t\t\t\t\t\t\t\t\t\t\t\t<items>\n\t\t\t\t\t\t\t\t\t\t\t\t\t<Input\n                                                        id="LRS4_APPROVER_NAME"\n                                                        type="Text"\n                                                        showSuggestion="true"\n                                                        valueHelpOnly="true"\n                                                        showValueHelp="true"\n                                                        valueHelpRequest="handleValueHelp">\n                                                        <layoutData>\n                                                        \t<FlexItemData growFactor="30"/>\n                                                        </layoutData>\n                                                      </Input>\n                                                      </items>\n                                                      </FlexBox>\n                                                    \t<!--</sap.ui.layout:HorizontalLayout>-->\n\t\t\t\t\t\t\t\t\t\t\t\t</sap.ui.layout:content>\n\t\t\t\t\t\t\t\t\t\t\t</sap.ui.layout:Grid>\n\t\t\t\t\t\t\t\t\t\t</sap.ui.layout.form:fields>\n\t\t\t\t\t\t\t\t\t</sap.ui.layout.form:FormElement>\n\t\t\t\t\t\t\t\t\t<sap.ui.layout.form:FormElement id="LRS4_MUL_APP">\n                                    <sap.ui.layout.form:layoutData>\n\t\t\t\t\t\t\t\t\t\t\t<sap.ui.layout:ResponsiveFlowLayoutData\n\t\t\t\t\t\t\t\t\t\t\t\tlinebreak="true">\n\t\t\t\t\t\t\t\t\t\t\t\t\t</sap.ui.layout:ResponsiveFlowLayoutData>\n\t\t\t\t\t\t\t\t\t\t</sap.ui.layout.form:layoutData>\n\t\t\t\t\t\t\t\t\t\t\t<sap.ui.layout.form:fields>\n\t\t\t\t\t\t\t\t\t\t\t<sap.ui.layout:Grid width="100%" id="LRS4_FR_MUL_APP_GRID"\n\t\t\t\t\t\t\t\t\t\t\t\tdefaultSpan="L12 M12 S12">\n\t\t\t\t\t\t\t\t\t\t\t\t</sap.ui.layout:Grid>\n\t\t\t\t\t\t\t\t\t\t\t\t\t</sap.ui.layout.form:fields>\n                                    </sap.ui.layout.form:FormElement>\n\t\t\t\t\t\t\t\t\t<sap.ui.layout.form:FormElement\n\t\t\t\t\t\t\t\t\t\tid="LRS4_FELEM_NOTE">\n\t\t\t\t\t\t\t\t\t\t<sap.ui.layout.form:layoutData>\n\t\t\t\t\t\t\t\t\t\t\t<sap.ui.layout:ResponsiveFlowLayoutData\n\t\t\t\t\t\t\t\t\t\t\t\tlinebreak="true"></sap.ui.layout:ResponsiveFlowLayoutData>\n\t\t\t\t\t\t\t\t\t\t</sap.ui.layout.form:layoutData>\n\t\t\t\t\t\t\t\t\t\t<sap.ui.layout.form:fields>\n\t\t\t\t\t\t\t\t\t\t\t<sap.ui.layout:Grid id="LRS4_NOTE" width="100%"\n\t\t\t\t\t\t\t\t\t\t\t\tdefaultSpan="L12 M12 S12">\n\t\t\t\t\t\t\t\t\t\t\t\t<sap.ui.layout:content>\n\t\t\t\t\t\t\t\t\t\t\t\t\t<Label id="LRS4_LBL_NOTE" text="{i18n>LR_NOTE}">\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t<layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<sap.ui.layout:ResponsiveFlowLayoutData\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tlinebreak="true"></sap.ui.layout:ResponsiveFlowLayoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t</layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t</Label>\n\t\t\t\t\t\t\t\t\t\t\t\t\t<TextArea id="LRS4_TXA_NOTE" class="s4Notes "\n\t\t\t\t\t\t\t\t\t\t\t\t\t\twidth="100%" height="6rem" wrapping="None" maxLength="255">\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t<layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<sap.ui.layout:ResponsiveFlowLayoutData\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tweight="8" linebreak="true"></sap.ui.layout:ResponsiveFlowLayoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t</layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t</TextArea>\n\t\t\t\t\t\t\t\t\t\t\t\t</sap.ui.layout:content>\n\t\t\t\t\t\t\t\t\t\t\t</sap.ui.layout:Grid>\n\t\t\t\t\t\t\t\t\t\t</sap.ui.layout.form:fields>\n\t\t\t\t\t\t\t\t\t</sap.ui.layout.form:FormElement>\n\t\t\t\t\t\t\t\t\t<sap.ui.layout.form:FormElement visible = "false"\n                                    id="LRS4_FELEM_FILEATTACHMENTS">\n                                        <sap.ui.layout.form:layoutData>\n                                            <sap.ui.layout:ResponsiveFlowLayoutData\n                                                linebreak="true"></sap.ui.layout:ResponsiveFlowLayoutData>\n                                        </sap.ui.layout.form:layoutData>\n                                        <sap.ui.layout.form:fields>\n                                            <sap.ui.layout:Grid id="LRS4_FILEATTACHMENTS" width="100%"\n                                                defaultSpan="L12 M12 S12">\n                                                <sap.ui.layout:content>\n                                                    <sap.ui.unified:FileUploader\n                                                          id="fileUploader"\n                                                          width="100%"\n                                                          uploadUrl=""\n                                                          placeholder="{i18n>LR_ATTACHMENT}"\n                                                          uploadOnChange="false"\n                                                          uploadComplete="handleUploadComplete"\n                                                          change="handleValueChange"\n                                                          typeMissmatch="handleTypeMissmatch"\n                                                          style="Emphasized"\n                                                          useMultipart="false"\n                                                          >\n                                                           </sap.ui.unified:FileUploader>\n                                                <UploadCollection\n                                                            id="fileupload"\n                                                            visible="false"\n                                                            uploadEnabled="false"\n                                                            editMode="false"\n                                                            items="{files>/AttachmentsCollection}">\n                                                             <UploadCollectionItem\n                                                             contributor= "{files>Contributor}"\n                                                             documentId="{files>DocumentId}"\n                                                             enableDelete="false"\n                                                             enableEdit="false"\n                                                             url="{files>FileUrl}"\n                                                             mimeType="{files>MimeType}"\n                                                             fileName="{files>FileName}"\n                                                             fileSize="{files>FileSize}"\n                                                             uploadedDate="{files>UploadedDate}"\n                                                             > </UploadCollectionItem>\n                                                          </UploadCollection>\n                                                    </sap.ui.layout:content> \n                                            </sap.ui.layout:Grid>\n                                        </sap.ui.layout.form:fields>\n                                    </sap.ui.layout.form:FormElement>\n                                    <sap.ui.layout.form:FormElement id="LRS4_FR_ADDN_FIELDS">\n                                    <sap.ui.layout.form:layoutData>\n\t\t\t\t\t\t\t\t\t\t\t<sap.ui.layout:ResponsiveFlowLayoutData\n\t\t\t\t\t\t\t\t\t\t\t\tlinebreak="true">\n\t\t\t\t\t\t\t\t\t\t\t\t\t</sap.ui.layout:ResponsiveFlowLayoutData>\n\t\t\t\t\t\t\t\t\t\t</sap.ui.layout.form:layoutData>\n\t\t\t\t\t\t\t\t\t\t\t<sap.ui.layout.form:fields>\n\t\t\t\t\t\t\t\t\t\t\t<sap.ui.layout:Grid width="100%" id="LRS4_FR_ADDN_FIELDS_GRID"\n\t\t\t\t\t\t\t\t\t\t\t\tdefaultSpan="L12 M12 S12">\n\t\t\t\t\t\t\t\t\t\t\t\t</sap.ui.layout:Grid>\n\t\t\t\t\t\t\t\t\t\t\t\t\t</sap.ui.layout.form:fields>\n                                    </sap.ui.layout.form:FormElement>\n\t\t\t\t\t\t\t\t\t<!-- extension point for additional fields -->\n\t\t\t\t\t\t\t\t\t<sap.ui.core:ExtensionPoint name="extS1Field"></sap.ui.core:ExtensionPoint>\n\t\t\t\t\t\t\t\t</sap.ui.layout.form:formElements>\n\t\t\t\t\t\t\t\t</sap.ui.layout.form:FormContainer>\n\t\t\t\t\t\t</sap.ui.layout.form:formContainers>\n\t\t\t\t\t\t<sap.ui.layout.form:layout>\n\t\t\t\t\t\t\t<sap.ui.layout.form:ResponsiveLayout\n\t\t\t\t\t\t\t\tid="LRS4_FRM_MAIN_LAYOUT"></sap.ui.layout.form:ResponsiveLayout>\n\t\t\t\t\t\t</sap.ui.layout.form:layout>\n\t\t\t\t\t</sap.ui.layout.form:Form>\n\t\t\t\t</sap.ui.layout:content>\n\t\t\t</sap.ui.layout:Grid>\n\t\t</content>\n\t</Page>\n</sap.ui.core:View>',
	"hcm/myleaverequest/view/S2.controller.js":function(){/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.require("sap.ca.scfld.md.controller.BaseFullscreenController");
jQuery.sap.require("hcm.myleaverequest.utils.Formatters");
jQuery.sap.require("hcm.myleaverequest.utils.UIHelper");
jQuery.sap.require("hcm.myleaverequest.utils.DataManager");
jQuery.sap.require("hcm.myleaverequest.utils.ConcurrentEmployment");
/*global hcm:true*/
sap.ca.scfld.md.controller.BaseFullscreenController.extend("hcm.myleaverequest.view.S2", {

	extHookChangeFooterButtons: null,	
	extHookTimeAccountCollection : null,
	
	onInit : function() {

		sap.ca.scfld.md.controller.BaseFullscreenController.prototype.onInit.call(this);
        this.oApplication = this.oApplicationFacade.oApplicationImplementation;
		this.resourceBundle = this.oApplicationFacade.getResourceBundle();
		this.oDataModel = this.oApplicationFacade.getODataModel();

		this.entitlementTableCntrl = this.byId("entitlemntTble");		
		this.templateCntrl = this.byId("LRS2_LISTITEM");

		this.oRouter.attachRouteMatched(this._handleRouteMatched, this);

		hcm.myleaverequest.utils.DataManager.init(this.oDataModel, this.resourceBundle);
		hcm.myleaverequest.utils.Formatters.init(this.resourceBundle);
	},
	
	_handleRouteMatched : function(oEvent){
		if(oEvent.getParameter("name") === "entitlements"){	
			var _this = this;
			var oPernr = hcm.myleaverequest.utils.UIHelper.getPernr();
			if (oPernr) {
					_this.initializeEntitlementView();
				}
			else{
			    hcm.myleaverequest.utils.ConcurrentEmployment.getCEEnablement(this, function() {
				_this.initializeEntitlementView();
			});
			}
			
		}
	},
	initializeEntitlementView: function(){
	    var _this = this;
	    sap.ca.ui.utils.busydialog.requireBusyDialog();	
	    hcm.myleaverequest.utils.DataManager.getTimeAccountCollection(function(response) {			
				sap.ca.ui.utils.busydialog.releaseBusyDialog();
				
				/**
		     * @ControllerHook Modify the TimeAccountCollection response
		     * This hook method can be used to modify the TimeAccountCollection
		     * It is called when the method getTimeAccountCollection in DataManager executes
		     * @callback hcm.myleaverequest.view.S2~extHookTimeAccountCollection
		     * @param {object} TimeAccountCollection Object
		     * @return {object} TimeAccountCollection Object
		     */
				if(this.extHookTimeAccountCollection) {
					response = this.extHookTimeAccountCollection(response);
				}
			  _this.entitlementTableCntrl.setModel(new sap.ui.model.json.JSONModel(response));		   
			  _this.entitlementTableCntrl.bindItems("/TimeAccountCollection", _this.templateCntrl);
			}, function(objResponse) {
					sap.ca.ui.utils.busydialog.releaseBusyDialog();
					hcm.myleaverequest.utils.UIHelper.errorDialog(hcm.myleaverequest.utils.DataManager.parseErrorMessages(objResponse));
			});
	},

	getHeaderFooterOptions : function() {
		var objHdrFtr = {
			sI18NFullscreenTitle : "LR_TITLE_BALANCE_VIEW"
			/*onBack: jQuery.proxy(function() {
				//Check if a navigation to master is the previous entry in the history
				var sDir = sap.ui.core.routing.History.getInstance().getDirection(this.oRouter.getURL("home"));
				if (sDir === "Backwards") {
					window.history.go(-1);
				} else {
					//we came from somewhere else - create the master view
					this.oRouter.navTo("home");
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
         * @callback hcm.myleaverequest.view.S2~extHookChangeFooterButtons
         * @param {object} Header Footer Object
         * @return {object} Header Footer Object
         */
    	
    	if (this.extHookChangeFooterButtons) {
    		objHdrFtr = this.extHookChangeFooterButtons(objHdrFtr);
    	}
    	return objHdrFtr;
	}
});
},
	"hcm/myleaverequest/view/S2.view.xml":'<!--\n\n    Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved\n\n-->\n<!--Copyright (C) 2009-2013 SAP AG or an SAP affiliate company. All rights reserved-->\n<core:View id="S2" xmlns:core="sap.ui.core"\n    xmlns="sap.m" xmlns:sap.ui.layout="sap.ui.layout" controllerName="hcm.myleaverequest.view.S2">\n\n   <Page id="S2_page" >\n        <content>\n            <Table id="entitlemntTble" items="{TimeAccountCollection}">\n                <ColumnListItem id="LRS2_LISTITEM">\n                        <cells>\n                              <sap.ui.layout:VerticalLayout width="100%">\n                                \n                                    <ObjectIdentifier id="LRS2_LIST_ITEM_ACCOUNT" title="{TimeAccountTypeName}" badgeNotes="false" badgePeople="false" badgeAttachments="false"></ObjectIdentifier>\n                                        <sap.ui.layout:HorizontalLayout id="LRS2_HBOX1">\n                                       \n                                            <ObjectIdentifier text="{i18n>LR_UP_TO}" hAlign="Left" badgeNotes="false" badgePeople="false" badgeAttachments="false"></ObjectIdentifier>\n                                            <Label width="1em"></Label>\n                                            <ObjectIdentifier id="LRS2_LIST_ITEM_END_DATE" hAlign="Center" text="{path:\'DeductionEndDate\', formatter:\'hcm.myleaverequest.utils.Formatters.DATE_ODATA_EEEdMMMyyyy\'}" badgeNotes="false" badgePeople="false" badgeAttachments="false"></ObjectIdentifier>\n                                        \n                                        </sap.ui.layout:HorizontalLayout>\n                              </sap.ui.layout:VerticalLayout>\n                            <ObjectNumber number="{path:\'BalanceAvailableQuantity\', formatter:\'hcm.myleaverequest.utils.Formatters.BALANCE\'}" numberUnit="{TimeUnitName}"></ObjectNumber>\n                            <ObjectNumber number="{parts: [{path:\'BalanceUsedQuantity\'},{path: \'BalanceApprovedQuantity\'},{path: \'BalanceRequestedQuantity\'}], formatter:\'hcm.myleaverequest.utils.Formatters.calculateUsed\'}" numberUnit="{TimeUnitName}"></ObjectNumber>\n                            <ObjectNumber number="{path:\'BalanceEntitlementQuantity\', formatter:\'hcm.myleaverequest.utils.Formatters.BALANCE\'}" numberUnit="{TimeUnitName}"></ObjectNumber>\n                            <!-- extension point for additional Column Item -->\n                            <core:ExtensionPoint name="extS2ColItem"></core:ExtensionPoint>\n                        </cells>\n                </ColumnListItem>               \n                <columns>\n                    <Column width="19em">\n                        <header>\n                            <Label text="{i18n>LR_BALANCE_DEDUCTIBLE}"></Label>\n                        </header>\n                    </Column>\n                    <Column hAlign="Right" minScreenWidth="small" demandPopin="true">\n                        <header>\n                            <Label text="{i18n>LR_BALANCE_BALANCE}"></Label>\n                        </header>\n                    </Column>\n                    <Column hAlign="Right" minScreenWidth="small" demandPopin="true">\n                        <header>\n                            <Label text="{i18n>LR_BALANCE_USED}"></Label>\n                        </header>\n                    </Column>\n                    <Column hAlign="Right" minScreenWidth="small" demandPopin="true">\n                        <header>\n                            <Label text="{i18n>LR_ENTITLEMENT_QUOTA}"></Label>\n                        </header>\n                    </Column>\n                    <!-- extension point for additional Column Header -->\n                    <core:ExtensionPoint name="extS2ColHeader"></core:ExtensionPoint>\n                </columns>\n            </Table>\n        </content>\n    </Page>\n</core:View>',
	"hcm/myleaverequest/view/S3.controller.js":function(){/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.require("sap.ca.scfld.md.controller.ScfldMasterController");
jQuery.sap.require("hcm.myleaverequest.utils.Formatters");
jQuery.sap.require("hcm.myleaverequest.utils.DataManager");
jQuery.sap.require("hcm.myleaverequest.utils.UIHelper");
jQuery.sap.require("hcm.myleaverequest.utils.ConcurrentEmployment");
jQuery.sap.require("sap.m.ObjectAttribute");
/*global hcm window*/
sap.ca.scfld.md.controller.ScfldMasterController.extend("hcm.myleaverequest.view.S3", {

	extHookChangeFooterButtons: null,
	extHookLeaveRequestCollection : null,
	extHookItemTemplate : null,
	
	onInit : function() {
		sap.ca.scfld.md.controller.ScfldMasterController.prototype.onInit.call(this);
		this.oApplication = this.oApplicationFacade.oApplicationImplementation;
		this.resourceBundle = this.oApplicationFacade.getResourceBundle();
		this.oDataModel = this.oApplicationFacade.getODataModel();
		hcm.myleaverequest.utils.DataManager.init(this.oDataModel, this.resourceBundle);
		hcm.myleaverequest.utils.Formatters.init(this.resourceBundle);
		this.oRouter.attachRouteMatched(this._handleRouteMatched, this);
		this.masterListCntrl = this.oView.byId("list");
		this.objLeaveRequestCollection = null;
		this.oBus = sap.ui.getCore().getEventBus();
		this.oBus.subscribe("hcm.myleaverequest.LeaveCollection", "refresh", this._initData, this);
		this.onDataLoaded();
		this._fnRefreshCompleted = null;
		this._isLocalRouting = false;
		this._isInitialized = false;
		this._isMasterRefresh = false;
		this._searchField = "";
	},

	/**
     * @public [onDataLoaded On master list loaded]
     */
    onDataLoaded: function() {
    	var that = this;
        if (that.getList().getItems().length < 1) {
            if (!sap.ui.Device.system.phone) {
            	 that.showEmptyView();
            }
           
        }
    },


	getHeaderFooterOptions : function() {
		var _this = this;
		var objHdrFtr = {
			sI18NMasterTitle : "LR_TITLE_LEAVE_REQUESTS",
			onRefresh : function(searchField, fnRefreshCompleted){
				_this._fnRefreshCompleted = fnRefreshCompleted;
				_this._searchField = searchField;
				_this._isMasterRefresh = true;
				_this._initData();
			}
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
         * @callback hcm.myleaverequest.view.S3~extHookChangeFooterButtons
         * @param {object} Header Footer Object
         * @return {object} Header Footer Object
         */
    	
    	if (this.extHookChangeFooterButtons) {
    		objHdrFtr = this.extHookChangeFooterButtons(objHdrFtr);
    	}
    	return objHdrFtr;
	},
	
	
	_handleRouteMatched : function(oEvent) {
        var _this = this;
		// to use cached data for local routing
		if (oEvent.getParameter("name") === "master" && ((this._isLocalRouting === false) || hcm.myleaverequest.utils.UIHelper.getIsChangeAction())) {
			hcm.myleaverequest.utils.UIHelper.setIsChangeAction(false);
			//clear searchField
			if(!!this._oControlStore & !!this._oControlStore.oMasterSearchField && !!this._oControlStore.oMasterSearchField.clear){
				this._oControlStore.oMasterSearchField.clear();
			}
			var oPernr = hcm.myleaverequest.utils.UIHelper.getPernr();
			if (oPernr) {
					_this._initData();
				}
			else{
			    hcm.myleaverequest.utils.ConcurrentEmployment.getCEEnablement(this, function() {
				_this._initData();
			});
			}
			
		}
		
		//reset flag
		if(oEvent.getParameter("name") === "master" && this._isLocalRouting === false){
			this._isLocalRouting = true;
		}
		
	},
		
	_initData : function(){		
		var _this = this;
		sap.ca.ui.utils.busydialog.requireBusyDialog();
		  
		  // creation of a local JSON model is required because the leave request collection in the OData model contains
			// all leave requests including change requests. In the list view, only the original requests shall be shown.
			// Change requests to the original requests shall be only reflected by adding an additional info field like e.g.
			// 'Change Pending'
			// Solution: Function getConsolidatedLeaveRequests operates on all leave requests and creates a new collection
			// result only
			// containing the original requests which have a relation to the change request leave key
		if(!hcm.myleaverequest.utils.UIHelper.getIsLeaveCollCached()){
			hcm.myleaverequest.utils.DataManager.getConsolidatedLeaveRequests(function(objResponse) {
				
				_this.objLeaveRequestCollection = objResponse.LeaveRequestCollection;
				
				/**
		     * @ControllerHook Modify the LeaveRequestCollection response
		     * This hook method can be used to modify the LeaveRequestCollection
		     * It is called when the method LeaveRequestCollection in DataManager executes
		     * @callback hcm.myleaverequest.view.S3~extHookLeaveRequestCollection
		     * @param {object} LeaveRequestCollection Object
		     * @return {object} LeaveRequestCollection Object
		     */
				if(_this.extHookLeaveRequestCollection) {
					_this.objLeaveRequestCollection = _this.extHookLeaveRequestCollection(_this.objLeaveRequestCollection);
				}
				
				hcm.myleaverequest.utils.DataManager.setCachedModelObjProp("ConsolidatedLeaveRequests",_this.objLeaveRequestCollection);
				hcm.myleaverequest.utils.UIHelper.setIsLeaveCollCached(false);
				_this.setMasterListItems();
				if(_this._searchField!=="")
				{
				_this.applySearchPattern(_this._searchField);
				}
			}, function(objResponse) {

				hcm.myleaverequest.utils.DataManager.parseErrorMessages(objResponse);
			});
		}
		else{
			_this.objLeaveRequestCollection=hcm.myleaverequest.utils.DataManager.getCachedModelObjProp("ConsolidatedLeaveRequests");
			hcm.myleaverequest.utils.UIHelper.setIsLeaveCollCached(false);
			_this.setMasterListItems();
		}
	},
	
	//@overriding since we are using LeaveKey/RequestId as contextPath
	getDetailNavigationParameters : function(oListItem) {
		var navProperty = "";
		if(oListItem){
		var parameters = oListItem.getBindingContext(this.sModelName).getPath().substr(1).split("/");
		if((parameters.length > 1) && (this.objLeaveRequestCollection.length > parameters[1])){
			navProperty = this.objLeaveRequestCollection[parameters[1]]._navProperty;
		}
		return {
			contextPath : encodeURIComponent(navProperty)
		};
		}
	},
	
	setMasterListItems : function(){
		var _this = this;
		try{
			if (_this.objLeaveRequestCollection) {
				hcm.myleaverequest.utils.UIHelper.setRoutingProperty(_this.objLeaveRequestCollection);
				_this.objLeaveRequestCollection=hcm.myleaverequest.utils.UIHelper.getRoutingProperty();				
				var oModel = new sap.ui.model.json.JSONModel({ "LeaveRequestCollection" : _this.objLeaveRequestCollection});
				_this.oView.setModel(oModel);
				//_this._isLocalRouting = true;
				
				var itemTemplate = new sap.m.ObjectListItem(
            {
              type : "{device>/listItemType}",
               title : "{AbsenceTypeName}",
                // FA 2310160<<
                number : "{parts:[{path:'WorkingDaysDuration'},{path:'WorkingHoursDuration'},{path:'AdditionalFields/ALLDF'}], formatter: 'hcm.myleaverequest.utils.Formatters.formatterAbsenceDuration'}",
                numberUnit : "{parts:[{path:'WorkingDaysDuration'},{path:'WorkingHoursDuration'},{path:'AdditionalFields/ALLDF'}], formatter: 'hcm.myleaverequest.utils.Formatters.formatterAbsenceDurationUnit'}",
                //number : "{path:'WorkingHoursDuration', formatter:'hcm.myleaverequest.utils.Formatters.adjustSeparator'}",
                //numberUnit :_this.resourceBundle.getText("LR_LOWERCASE_HOURS"),
                //FA 2310160>>               
                 attributes : [
                                 new sap.m.ObjectAttribute(
                                               {			text : "{path:'StartDate', formatter:'hcm.myleaverequest.utils.Formatters.DATE_ODATA_EEEdMMMyyyy'}"
                                               }),
                                 new sap.m.ObjectAttribute(
                                               {
                                                      text : "{parts:[{path:'i18n>LR_HYPHEN'},{path:'WorkingDaysDuration'},{path:'StartTime'},{path:'EndDate'},{path:'EndTime'}], formatter: 'hcm.myleaverequest.utils.Formatters.FORMAT_ENDDATE'}"
                                               }) ],
                 firstStatus :  new sap.m.ObjectStatus({
                	 text : "{StatusName}",
              		 state : "{path:'StatusCode', formatter:'hcm.myleaverequest.utils.Formatters.State'}"	 
                 }), 
                 secondStatus : new sap.m.ObjectStatus({
                		 state : "Error",
                		 text : "{path:'aRelatedRequests', formatter:'hcm.myleaverequest.utils.Formatters.FORMATTER_INTRO'}"	 
                 }),
                 press : jQuery.proxy(_this._handleItemPress,_this)
        });
				
				
				/**
		     * @ControllerHook Modify the item template for list
		     * This hook method can be used to modify the itemTemplate
		     * It is called when the method setMasterListItems executes
		     * @callback hcm.myleaverequest.view.S3~extHookItemTemplate
		     * @param {object} itemTemplate Object
		     * @return {object} itemTemplate Object
		     */
				if(this.extHookItemTemplate) {
					itemTemplate = this.extHookItemTemplate(itemTemplate);
				}
							
				
				_this.masterListCntrl.bindItems({
					path : "/LeaveRequestCollection",
					template : itemTemplate
				});
				if(_this._fnRefreshCompleted)
				{
					_this._fnRefreshCompleted();
				}
				//sap.ca.ui.utils.busydialog.releaseBusyDialog();
			 }	
			}
			
			catch(err)
			{
				jQuery.sap.log.warning(err);

			}
			sap.ca.ui.utils.busydialog.releaseBusyDialog();
			if(!jQuery.device.is.phone && !_this._isInitialized){
				_this.registerMasterListBind(_this.masterListCntrl);						
				_this._isInitialized = true;
			}
			if(!jQuery.device.is.phone || hcm.myleaverequest.utils.UIHelper.getIsWithDrawAction()){
				
				_this.setLeadSelection();
			}
			
	},
	

	// event handler for setting the lead selection in the history overview list. Initially the first entry is
	// preselected.
	// also called when in history details a leave was withdrawn
	setLeadSelection : function() {
		var oItems = this.masterListCntrl.getItems();
		var oIndex = null, searchKey = null;
		var completeURL =  window.location.hash.split('detail');
		if(completeURL[1]!== undefined){
			completeURL= completeURL[1].split('/');
		}
		if(completeURL[1]!== undefined){
			searchKey = decodeURIComponent(completeURL[1]);
			searchKey = decodeURIComponent (searchKey);
		}
		if((searchKey !== null && searchKey !== "")&& (this.objLeaveRequestCollection) && !hcm.myleaverequest.utils.UIHelper.getIsWithDrawAction()){   //NOTE 2316063
			for ( var i = 0; i < this.objLeaveRequestCollection.length; i++) {
				if (this.objLeaveRequestCollection[i]._navProperty === searchKey) {
					oIndex = i;
					break;
				}
			}
			if(oIndex === null){
				if(hcm.myleaverequest.utils.UIHelper.getIsWithDrawn(searchKey) && (oItems.length > 0)){
					this.setListItem(oItems[0]);
			}else{
					this.showEmptyView();
				}
	
			}else{
				if(oItems.length > oIndex){
				   this.setListItem(oItems[oIndex]);
				}
			}

		}else {
			oIndex = 0;
			if(oItems.length > 0){
				this.setListItem(oItems[oIndex]);
			}
		}		
	},
	
	
  setListItem : function(oItem) {
	  if(this._isMasterRefresh){
		  this._isMasterRefresh = false;
		  this.setLeadSelection();
	  }else{
		  if (oItem !== undefined) {
			  oItem.setSelected(true);
			  if(hcm.myleaverequest.utils.UIHelper.getIsWithDrawAction() && jQuery.device.is.phone){
				  hcm.myleaverequest.utils.UIHelper.setIsWithDrawAction(false);
				  this.oRouter.navTo("detail",this.getDetailNavigationParameters(oItem),true);
			  }else{
				  this.oRouter.navTo("detail",this.getDetailNavigationParameters(oItem),!jQuery.device.is.phone);
			  }
		  } 
		  this._isLocalRouting = true;    
	  }
  }
	

});
},
	"hcm/myleaverequest/view/S3.view.xml":'<!--\n\n    Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved\n\n-->\n<sap.ui.core:View id="S3" controllerName="hcm.myleaverequest.view.S3"\n    xmlns="sap.m"\n    xmlns:sap.ui.core="sap.ui.core" >\n    <Page>\n        <content>\n            <List id="list" mode="{device>/listMode}" select="_handleSelect">\n                 \n            </List>\n        </content>\n \n    </Page>\n</sap.ui.core:View>',
	"hcm/myleaverequest/view/S6B.controller.js":function(){/*
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
},
	"hcm/myleaverequest/view/S6B.view.xml":'<!--\n\n    Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved\n\n-->\n<!--Copyright (C) 2009-2013 SAP AG or an SAP affiliate company. All rights reserved-->\n<sap.ui.core:View id="S6B" controllerName="hcm.myleaverequest.view.S6B"\n    xmlns="sap.m"\n    xmlns:sap.ui.layout.form="sap.ui.layout.form"\n    xmlns:sap.ui.layout="sap.ui.layout"\n    xmlns:sap.ui.core="sap.ui.core" >\n    <Page class="sapUiFioriObjectPage">\n        <content>\n            <ObjectHeader id="LRS6B_HEADER" introActive="true" titleActive="false" iconActive="false">\n                <attributes>\n                    <ObjectAttribute id="LRS6B_LBL_ORIGINAL_DATE" text="{i18n>LR_OLD_VERSION}" active="false"></ObjectAttribute>\n                    <ObjectAttribute id="LRS6B_HEADER_START_DATE" active="false"></ObjectAttribute>\n                    <ObjectAttribute id="LRS6B_HEADER_END_DATE" active="false"></ObjectAttribute>\n                    <ObjectAttribute id="LRS6B_LBL_CHANGED_DATE" text="{i18n>LR_NEW_VERSION}" active="false"></ObjectAttribute>\n                    <ObjectAttribute id="LRS6B_NEW_HEADER_START_DATE" active="false"></ObjectAttribute>\n                   <ObjectAttribute id="LRS6B_NEW_HEADER_END_DATE" active="false"></ObjectAttribute>\n                </attributes>\n                <firstStatus>\n                    <ObjectStatus id="LRS6B_HEADER_STATUS"></ObjectStatus>\n                </firstStatus>\n                <secondStatus>\n                    <ObjectStatus id="LRS6B_HEADER_STATUS2"></ObjectStatus>\n                </secondStatus>\n                <!-- extension point for additional Header Field-->\n                <sap.ui.core:ExtensionPoint name="extS6BHeaderField"></sap.ui.core:ExtensionPoint>\n            </ObjectHeader>\n            <IconTabBar id="LRS6B_ICNTABBAR" visible="false">\n                <items>\n                    <IconTabFilter id="LRS6B_NOTESICNTAB" icon="sap-icon://notes" visible="false">\n                        <content>\n                             <sap.ui.layout:VerticalLayout\n                                width="100%">\n                                  <List id="S6B_NOTES_LIST" \n                                    items="{notes>/NotesCollection}"\n                                    inset="false"\n        \t\t\t\t\t\t\tmode="SingleSelectMaster"\n        \t\t\t\t\t\t\tshowSeparators="None"\n        \t\t\t\t\t\t\theaderDesign="Plain">\n                                    <FeedListItem\n                                      sender="{notes>Author}"\n                                      showIcon="false" \n\t\t\t                          senderActive="false" \n                                      timestamp="{notes>Timestamp}"\n                                      text="{notes>Text}" />\n                                  </List>\n                              </sap.ui.layout:VerticalLayout>\n                             </content>\n                    </IconTabFilter>  \n                    <IconTabFilter id="LRS6B_ATTACH_ICNTAB" icon="sap-icon://attachment" visible="false">\n                        <content>\n                             <sap.ui.layout:VerticalLayout\n                                width="100%">\n                                  <UploadCollection id="S6B_FILE_LIST"\n                                  uploadEnabled="false"\n                                  items="{files>/AttachmentsCollection}"\n                                  >\n                                     <UploadCollectionItem\n                                     contributor= "{files>Contributor}"\n                                     documentId="{files>DocumentId}"\n                                     enableDelete="false"\n                                     enableEdit="false"\n                                     url="{files>FileUrl}"\n                                     mimeType="{files>MimeType}"\n                                     fileName="{files>FileName}"\n                                     fileSize="{files>FileSize}"\n                                     uploadedDate="{files>UploadedDate}"\n                                     > </UploadCollectionItem>\n                                  </UploadCollection>\n                              </sap.ui.layout:VerticalLayout>\n                             </content>\n                    </IconTabFilter>  \n                    \t<IconTabFilter id="LRS6B_ADDN_ICNTAB"\n\t\t\t\t\ticon="sap-icon://hint"\n\t\t\t\t\ticonColor="Default">\n\t\t\t\t\t<content>\n\t\t\t\t\t\t<sap.ui.layout.form:Form id="LRS6B_ADDN_ICNTAB_FORM">\n\t\t\t\t\t\t\t<sap.ui.layout.form:layout>\n\t\t\t\t\t\t\t\t<sap.ui.layout.form:ResponsiveLayout  />\n\t\t\t\t\t\t\t</sap.ui.layout.form:layout>\n\t\t\t\t\t\t\t<sap.ui.layout.form:formContainers>\n\t\t\t\t\t\t\t\t<sap.ui.layout.form:FormContainer id="LRS6B_ADDN_FORM_CNR">\n\t\t\t\t\t\t\t\t\t<sap.ui.layout.form:layoutData>\n\t\t\t\t\t\t\t\t\t\t<sap.ui.layout:ResponsiveFlowLayoutData\n\t\t\t\t\t\t\t\t\t\t\tlinebreak="true"></sap.ui.layout:ResponsiveFlowLayoutData>\n\t\t\t\t\t\t\t\t\t</sap.ui.layout.form:layoutData>\n\t\t\t\t\t\t\t\t\t<sap.ui.layout.form:formElements>\n\t\t\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t\t\t</sap.ui.layout.form:formElements>\n\t\t\t\t\t\t\t\t</sap.ui.layout.form:FormContainer>\n\t\t\t\t\t\t\t</sap.ui.layout.form:formContainers>\n\t\t\t\t\t\t</sap.ui.layout.form:Form>\n\t\t\t\t\t</content>\n\t\t\t\t</IconTabFilter>\n                    <!-- extension point for additional Icon Tab Filter-->\n                    <sap.ui.core:ExtensionPoint name="extS6BIconTab"></sap.ui.core:ExtensionPoint>\n                </items>\n            </IconTabBar>            \n        </content>\n    </Page>\n</sap.ui.core:View>'
}});
