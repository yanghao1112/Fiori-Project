jQuery.sap.registerPreloadedModules({
"name":"hcm/approve/leaverequest/Component-preload",
"version":"2.0",
"modules":{
	"hcm/approve/leaverequest/Component.js":function(){/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.declare("hcm.approve.leaverequest.Component");
jQuery.sap.require("hcm.approve.leaverequest.Configuration");
jQuery.sap.require("sap.ca.scfld.md.ComponentBase");

sap.ca.scfld.md.ComponentBase.extend("hcm.approve.leaverequest.Component", {
		metadata : sap.ca.scfld.md.ComponentBase.createMetaData("MD", {
			"name" : "Master Detail Sample",
			"version" : "1.8.25",
			"library" : "hcm.approve.leaverequest",
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
		viewPath : "hcm.approve.leaverequest.view",
		masterPageRoutes: {
			"master": {
				"pattern": ":scenarioId:",
				"view": "S2"
			}
		},
		detailPageRoutes: {
			"detail": {
				"pattern": "detail/{contextPath}",
				"view": "S3"
			},
			"calendar": {
				"pattern": "calendar/{SAP__Origin}/{RequestId}/{StartDate}",
				"view": "S4"
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
				component: this
			},
			oView = sap.ui.view({
				viewName: "hcm.approve.leaverequest.Main",
				type: sap.ui.core.mvc.ViewType.XML,
				viewData: oViewData
			}),
			sPrefix = oView.getId() + "--",
			oEventBus = sap.ui.getCore().getEventBus();

		this.oEventBus = {
			publish: function(channelId, eventId, data) {
				channelId = sPrefix + channelId;
				oEventBus.publish(channelId, eventId, data);
			},
			subscribe: function(channelId, eventId, data, oListener) {
				channelId = sPrefix + channelId;
				oEventBus.subscribe(channelId, eventId, data, oListener);
			},
			unsubscribe: function(channelId, eventId, data, oListener) {
				channelId = sPrefix + channelId;
				oEventBus.unsubscribe(channelId, eventId, data, oListener);
			}
		};
		return oView;
	}
});

},
	"hcm/approve/leaverequest/Configuration.js":function(){/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.declare("hcm.approve.leaverequest.Configuration");
jQuery.sap.require("sap.ca.scfld.md.ConfigurationBase");
jQuery.sap.require("sap.ca.scfld.md.app.Application");

sap.ca.scfld.md.ConfigurationBase.extend("hcm.approve.leaverequest.Configuration", {
	oServiceParams: {
		serviceList: [{		
			name: "Approve Leave Requests",
			masterCollection: "LeaveRequestSet",
			serviceUrl: "/sap/opu/odata/sap/HCM_LEAVE_REQ_APPROVE_SRV/", //oData service relative path
			isDefault: true,
			mockedDataSource: "/hcm.approve.leaverequest/model/metadata.xml"
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
		return ["RequestId"];
	},
	
	setApplicationFacade: function(oApplicationFacade) {
        hcm.approve.leaverequest.Configuration.oApplicationFacade = oApplicationFacade;
    }
});
},
	"hcm/approve/leaverequest/Main.controller.js":function(){/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
sap.ui.controller("hcm.approve.leaverequest.Main", {

	onInit : function() {
		jQuery.sap.require("sap.ca.scfld.md.Startup");				
		sap.ca.scfld.md.Startup.init("hcm.approve.leaverequest", this);
	}
});
},
	"hcm/approve/leaverequest/Main.view.xml":'<!--\n\n    Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved\n\n-->\n<core:View xmlns:core="sap.ui.core" xmlns="sap.m"\n\tcontrollerName="hcm.approve.leaverequest.Main" displayBlock="true" height="100%">\n\t<NavContainer id="fioriContent" showHeader="false">\n\t</NavContainer>\n</core:View>',
	"hcm/approve/leaverequest/i18n/i18n.properties":'# Texts for Approve Leave Request app\n# __ldi.translation.uuid=b118c2a0-5916-11e4-8ed6-0800200c9a66\n\n# XFLD: number of absence days requested (e.g. two days)\nutil.Conversions.Days=days\n\n# XFLD: number of absence days requested (singular)\nutil.Conversions.Day_Singular=day\n\n# XFLD: number of absence hours requested (e.g. two hours)\nutil.Conversions.Hours=hours\n\n# XFLD: number of absence hours requested (e.g. one hour, Singular!)\nutil.Conversions.Hour_Singular=hour\n\n# XFLD: number of absence days requested (e.g. two days)\nutil.Conversions.Value_Days={0} days\n\n# XFLD: number of absence days requested (singular)\nutil.Conversions.Value_Day_Singular={0} day\n\n# XFLD: number of absence hours requested (e.g. two hours)\nutil.Conversions.Value_Hours={0} hours\n\n# XFLD: number of absence hours requested (e.g. one hour, Singular!)\nutil.Conversions.Value_Hour_Singular={0} hour\n\n# XFLD: Current Balance of the leave quote on Detail Screen\nview.AddInfo.CurrentBalance=Available Balance\n\n# XFLD: Requested amount of the leave type on Detail Screen (e.g. Vacation Requested:  14 Days)\nview.AddInfo.Requested=Requested\n\n# YMSG: information of existing overlaps of leave requests (e.g.  3 overlaps, Plural)\nutil.Conversions.OverlapsPl={0} Overlaps\n\n# YMSG: information of existing overlaps of leave requests (e.g. 1 overlap, Singular)\nutil.Conversions.OverlapSing={0} Overlap\n\n# XFLD: Requested amount of the leave type on Confirm/Decline Popup (e.g. Request    14 days)\nview.Detail.Request=Requested\n\n#XFLD: Label for Requested Time Duration\nview.Detail.FromTo=From-To\n\n# YMSG: Alert message that current balance of leave request may not be accurate.\nview.AddInfo.AlertMessageBalanceNotAccurate=This person has recently submitted other leave requests. The balance may not be accurate.\n\n# XSEL: status of Leave Request: approved\nview.Calendar.LegendApproved=Approved Leave\n\n# XSEL: status of Leave Request: working day\nview.Calendar.LegendWorkingDay=Workday\n\n# XSEL: status of Leave Request: Open Request\nview.Calendar.LegendPending=Pending Approval\n\n# XSEL: status of Leave Request: Non-working day (e.g. weekend)\nview.Calendar.LegendDayOff=Non-Workday\n\n# XSEL: status of Leave Request: Public Holiday\nview.Calendar.LegendHoliday=Public Holiday\n\n# XSEL: status of Leave Request: Today\nview.Calendar.LegendToday=Today\n\n# XSEL: status of Leave Request:  other request types\nview.Calendar.LegendDeletionRequested=Others\n\n# YMSG: Toast message that approval of leave request was successful\nview.Toast.YMSG_LRA_Approved=Leave request was approved\n\n# YMSG: Toast message that reject of leave request was successful\nview.Toast.YMSG_LRA_Declined=Leave request was rejected\n\n# XTIT: Leave Request Details\nview.Detail.title=Leave Request\n\n# XTIT: Leave Request Details - Calendar\nview.Calendar.title=Calendar\n\n# XTIT: Leave Type\nview.AddInfo.LeaveType=Leave Type\n\n# XTIT: Total Deduction\nview.AddInfo.Deduction=Total Deduction\n\n# XTIT: Personel Number\nview.Header.EmployeeID=Employee ID {0}\n\n# XTIT: Header text of Master List\nview.Master.title=Leave Requests ({0})\n\n# XTIT: Application name (shown in browser header bar or as browser tab title)\napp.Identity=Approve Leave Requests\n\n\n# XTIT: Title of Email to Employee on Business Card\nview.BusinessCard.Employee.Subject=Your Leave Request of Type {0}\n\n# XTIT: Shell title (shown within the UI as title of shell component, desktop only)\nshell.Identity=Approve Leave Requests\n\n# YMSG\ndialog.question.approve=Approve the leave request submitted by {0}?\n\n# YMSG\ndialog.question.reject=Reject the leave request submitted by {0}?\n\n# YMSG\ndialog.question.approvecancel=Approve the cancellation submitted by {0}?\n\n# YMSG\ndialog.question.rejectcancel=Reject the cancellation submitted by {0}?\n\n# YMSG\ndialog.success.approvecancel=Cancellation was approved \n\n# YMSG\ndialog.success.rejectcancel=Cancellation was rejected\n\n# YMSG\ndialog.success.approve=Leave request was approved \n\n# YMSG\ndialog.success.reject=Leave request was rejected\n\n# YMSG\ndialog.leave.overlaps.disclaimer= Leave Overlaps for {0} between {1} and {2}\n\n# YMSG: link to Team calendar\nutil.Conversions.OverlapsPlLink=Show Team Calendar\n\n# XFLD: Status: Cancellation of a Leave Request requested \nview.Header.CancellationStatus=Cancellation Requested\n\n# XFLD: Status: Cancellation of a Leave Request requested \nview.List.CancellationStatus=Cancelled\n\n#XBUT: Button for Approve action\nXBUT_APPROVE=Approve\n\n#XBUT: Button for Reject action\nXBUT_REJECT=Reject\n\n#XTIT: Title of the confirmation dialog while executing an action\nXTIT_APPROVAL=Approve\n\n#XTIT: Title of the confirmation dialog while executing an action\nXTIT_REJECT=Reject\n\n# YMSG: Loading\nLOADING=Loading...\n\n# XTIT: Leave Request Details\nDETAIL_TITLE=Leave Request\n\n# YMSG: No items are currently available\nNO_ITEMS_AVAILABLE=No items are currently available\n\n#XFLD: Label for Start Time\nALR_START_TIME=Start Time\n\n#XFLD: Label for Start Time\nALR_END_TIME=END Time',
	"hcm/approve/leaverequest/i18n/i18n_ar.properties":'\n# XFLD: number of absence days requested (e.g. two days)\nutil.Conversions.Days=\\u0623\\u064A\\u0627\\u0645\n\n# XFLD: number of absence days requested (singular)\nutil.Conversions.Day_Singular=\\u064A\\u0648\\u0645\n\n# XFLD: number of absence hours requested (e.g. two hours)\nutil.Conversions.Hours=\\u0633\\u0627\\u0639\\u0627\\u062A\n\n# XFLD: number of absence hours requested (e.g. one hour, Singular!)\nutil.Conversions.Hour_Singular=\\u0633\\u0627\\u0639\\u0629\n\n# XFLD: number of absence days requested (e.g. two days)\nutil.Conversions.Value_Days={0} \\u0645\\u0646 \\u0627\\u0644\\u0623\\u064A\\u0627\\u0645\n\n# XFLD: number of absence days requested (singular)\nutil.Conversions.Value_Day_Singular={0} \\u064A\\u0648\\u0645\n\n# XFLD: number of absence hours requested (e.g. two hours)\nutil.Conversions.Value_Hours={0} \\u0633\\u0627\\u0639\\u0629/\\u0633\\u0627\\u0639\\u0627\\u062A\n\n# XFLD: number of absence hours requested (e.g. one hour, Singular!)\nutil.Conversions.Value_Hour_Singular={0} \\u0633\\u0627\\u0639\\u0629\n\n# XFLD: Current Balance of the leave quote on Detail Screen\nview.AddInfo.CurrentBalance=\\u0627\\u0644\\u0631\\u0635\\u064A\\u062F \\u0627\\u0644\\u0645\\u062A\\u0648\\u0641\\u0631\n\n# XFLD: Requested amount of the leave type on Detail Screen (e.g. Vacation Requested:  14 Days)\nview.AddInfo.Requested=\\u0645\\u0637\\u0644\\u0648\\u0628\n\n# YMSG: information of existing overlaps of leave requests (e.g.  3 overlaps, Plural)\nutil.Conversions.OverlapsPl={0} \\u0645\\u0646 \\u0627\\u0644\\u062A\\u062F\\u0627\\u062E\\u0644\\u0627\\u062A\n\n# YMSG: information of existing overlaps of leave requests (e.g. 1 overlap, Singular)\nutil.Conversions.OverlapSing={0} \\u0645\\u0646 \\u0627\\u0644\\u062A\\u062F\\u0627\\u062E\\u0644\\u0627\\u062A\n\n# XFLD: Requested amount of the leave type on Confirm/Decline Popup (e.g. Request    14 days)\nview.Detail.Request=\\u0645\\u0637\\u0644\\u0648\\u0628\n\n#XFLD: Label for Requested Time Duration\nview.Detail.FromTo=\\u0645\\u0646 - \\u0625\\u0644\\u0649\n\n# YMSG: Alert message that current balance of leave request may not be accurate.\nview.AddInfo.AlertMessageBalanceNotAccurate=\\u0642\\u0627\\u0645 \\u0647\\u0630\\u0627 \\u0627\\u0644\\u0634\\u062E\\u0635 \\u0645\\u0624\\u062E\\u0631\\u064B\\u0627 \\u0628\\u062A\\u0642\\u062F\\u064A\\u0645 \\u0637\\u0644\\u0628\\u0627\\u062A \\u0625\\u062C\\u0627\\u0632\\u0629 \\u0623\\u062E\\u0631\\u0649\\u061B \\u0648\\u0645\\u0646 \\u062B\\u0645 \\u0641\\u0642\\u062F \\u0644\\u0627 \\u064A\\u0643\\u0648\\u0646 \\u0627\\u0644\\u0631\\u0635\\u064A\\u062F \\u062F\\u0642\\u064A\\u0642\\u064B\\u0627\n\n# XSEL: status of Leave Request: approved\nview.Calendar.LegendApproved=\\u0627\\u0644\\u0625\\u062C\\u0627\\u0632\\u0629 \\u0627\\u0644\\u0645\\u0639\\u062A\\u0645\\u062F\\u0629\n\n# XSEL: status of Leave Request: working day\nview.Calendar.LegendWorkingDay=\\u064A\\u0648\\u0645 \\u0639\\u0645\\u0644\n\n# XSEL: status of Leave Request: Open Request\nview.Calendar.LegendPending=\\u0641\\u064A \\u0627\\u0646\\u062A\\u0638\\u0627\\u0631 \\u0627\\u0644\\u0627\\u0639\\u062A\\u0645\\u0627\\u062F\n\n# XSEL: status of Leave Request: Non-working day (e.g. weekend)\nview.Calendar.LegendDayOff=\\u0639\\u0637\\u0644\\u0629\n\n# XSEL: status of Leave Request: Public Holiday\nview.Calendar.LegendHoliday=\\u0639\\u0637\\u0644\\u0629 \\u0631\\u0633\\u0645\\u064A\\u0629\n\n# XSEL: status of Leave Request: Today\nview.Calendar.LegendToday=\\u0627\\u0644\\u064A\\u0648\\u0645\n\n# XSEL: status of Leave Request:  other request types\nview.Calendar.LegendDeletionRequested=\\u0623\\u062E\\u0631\\u0649\n\n# YMSG: Toast message that approval of leave request was successful\nview.Toast.YMSG_LRA_Approved=\\u062A\\u0645 \\u0627\\u0639\\u062A\\u0645\\u0627\\u062F \\u0637\\u0644\\u0628 \\u0627\\u0644\\u0625\\u062C\\u0627\\u0632\\u0629\n\n# YMSG: Toast message that reject of leave request was successful\nview.Toast.YMSG_LRA_Declined=\\u062A\\u0645 \\u0631\\u0641\\u0636 \\u0637\\u0644\\u0628 \\u0627\\u0644\\u0625\\u062C\\u0627\\u0632\\u0629\n\n# XTIT: Leave Request Details\nview.Detail.title=\\u0637\\u0644\\u0628 \\u0627\\u0644\\u0625\\u062C\\u0627\\u0632\\u0629\n\n# XTIT: Leave Request Details - Calendar\nview.Calendar.title=\\u0627\\u0644\\u062A\\u0642\\u0648\\u064A\\u0645\n\n# XTIT: Leave Type\nview.AddInfo.LeaveType=\\u0646\\u0648\\u0639 \\u0627\\u0644\\u0625\\u062C\\u0627\\u0632\\u0629\n\n# XTIT: Total Deduction\nview.AddInfo.Deduction=\\u0625\\u062C\\u0645\\u0627\\u0644\\u064A \\u0627\\u0644\\u0627\\u0633\\u062A\\u0642\\u0637\\u0627\\u0639\n\n# XTIT: Personel Number\nview.Header.EmployeeID=\\u0645\\u0639\\u0631\\u0641 \\u0627\\u0644\\u0645\\u0648\\u0638\\u0641 {0}\n\n# XTIT: Header text of Master List\nview.Master.title=\\u0637\\u0644\\u0628\\u0627\\u062A \\u0627\\u0644\\u0625\\u062C\\u0627\\u0632\\u0629 ({0})\n\n# XTIT: Application name (shown in browser header bar or as browser tab title)\napp.Identity=\\u0627\\u0639\\u062A\\u0645\\u0627\\u062F \\u0637\\u0644\\u0628\\u0627\\u062A \\u0627\\u0644\\u0625\\u062C\\u0627\\u0632\\u0629\n\n\n# XTIT: Title of Email to Employee on Business Card\nview.BusinessCard.Employee.Subject=\\u0637\\u0644\\u0628 \\u0627\\u0644\\u0625\\u062C\\u0627\\u0632\\u0629 \\u0627\\u0644\\u062E\\u0627\\u0635 \\u0628\\u0643\\: {0}\n\n# XTIT: Shell title (shown within the UI as title of shell component, desktop only)\nshell.Identity=\\u0627\\u0639\\u062A\\u0645\\u0627\\u062F \\u0637\\u0644\\u0628\\u0627\\u062A \\u0627\\u0644\\u0625\\u062C\\u0627\\u0632\\u0629\n\n# YMSG\ndialog.question.approve=\\u0647\\u0644 \\u062A\\u0631\\u064A\\u062F \\u0627\\u0639\\u062A\\u0645\\u0627\\u062F \\u0637\\u0644\\u0628 \\u0627\\u0644\\u0625\\u062C\\u0627\\u0632\\u0629 \\u0627\\u0644\\u0645\\u0642\\u062F\\u0645 \\u0628\\u0648\\u0627\\u0633\\u0637\\u0629 {0}\\u061F\n\n# YMSG\ndialog.question.reject=\\u0647\\u0644 \\u062A\\u0631\\u064A\\u062F \\u0631\\u0641\\u0636 \\u0637\\u0644\\u0628 \\u0627\\u0644\\u0625\\u062C\\u0627\\u0632\\u0629 \\u0627\\u0644\\u0645\\u0642\\u062F\\u0645 \\u0628\\u0648\\u0627\\u0633\\u0637\\u0629 {0}\\u061F\n\n# YMSG\ndialog.question.approvecancel=\\u0647\\u0644 \\u062A\\u0631\\u064A\\u062F \\u0627\\u0639\\u062A\\u0645\\u0627\\u062F \\u0627\\u0644\\u0625\\u0644\\u063A\\u0627\\u0621 \\u0627\\u0644\\u0645\\u0642\\u062F\\u0645 \\u0628\\u0648\\u0627\\u0633\\u0637\\u0629 {0}\\u061F\n\n# YMSG\ndialog.question.rejectcancel=\\u0647\\u0644 \\u062A\\u0631\\u064A\\u062F \\u0631\\u0641\\u0636 \\u0627\\u0644\\u0625\\u0644\\u063A\\u0627\\u0621 \\u0627\\u0644\\u0645\\u0642\\u062F\\u0645 \\u0628\\u0648\\u0627\\u0633\\u0637\\u0629 {0}\\u061F\n\n# YMSG\ndialog.success.approvecancel=\\u062A\\u0645 \\u0627\\u0639\\u062A\\u0645\\u0627\\u062F \\u0627\\u0644\\u0625\\u0644\\u063A\\u0627\\u0621\n\n# YMSG\ndialog.success.rejectcancel=\\u062A\\u0645 \\u0631\\u0641\\u0636 \\u0627\\u0644\\u0625\\u0644\\u063A\\u0627\\u0621\n\n# YMSG\ndialog.success.approve=\\u062A\\u0645 \\u0627\\u0639\\u062A\\u0645\\u0627\\u062F \\u0637\\u0644\\u0628 \\u0627\\u0644\\u0625\\u062C\\u0627\\u0632\\u0629\n\n# YMSG\ndialog.success.reject=\\u062A\\u0645 \\u0631\\u0641\\u0636 \\u0637\\u0644\\u0628 \\u0627\\u0644\\u0625\\u062C\\u0627\\u0632\\u0629\n\n# YMSG\ndialog.leave.overlaps.disclaimer=\\u062A\\u062A\\u062F\\u0627\\u062E\\u0644 \\u0625\\u062C\\u0627\\u0632\\u0629 {0} \\u0628\\u064A\\u0646 {1} \\u0648{2}\n\n# YMSG: link to Team calendar\nutil.Conversions.OverlapsPlLink=\\u0625\\u0638\\u0647\\u0627\\u0631 \\u062A\\u0642\\u0648\\u064A\\u0645 \\u0627\\u0644\\u0641\\u0631\\u064A\\u0642\n\n# XFLD: Status: Cancellation of a Leave Request requested \nview.Header.CancellationStatus=\\u0645\\u0637\\u0644\\u0648\\u0628 \\u0627\\u0644\\u0625\\u0644\\u063A\\u0627\\u0621\n\n# XFLD: Status: Cancellation of a Leave Request requested \nview.List.CancellationStatus=\\u0645\\u0644\\u063A\\u0649\n\n#XBUT: Button for Approve action\nXBUT_APPROVE=\\u0627\\u0639\\u062A\\u0645\\u0627\\u062F\n\n#XBUT: Button for Reject action\nXBUT_REJECT=\\u0631\\u0641\\u0636\n\n#XTIT: Title of the confirmation dialog while executing an action\nXTIT_APPROVAL=\\u0627\\u0639\\u062A\\u0645\\u0627\\u062F\n\n#XTIT: Title of the confirmation dialog while executing an action\nXTIT_REJECT=\\u0631\\u0641\\u0636\n\n# YMSG: Loading\nLOADING=\\u062C\\u0627\\u0631\\u064D \\u0627\\u0644\\u062A\\u062D\\u0645\\u064A\\u0644 ...\n\n# XTIT: Leave Request Details\nDETAIL_TITLE=\\u0637\\u0644\\u0628 \\u0627\\u0644\\u0625\\u062C\\u0627\\u0632\\u0629\n\n# YMSG: No items are currently available\nNO_ITEMS_AVAILABLE=\\u0644\\u0627 \\u062A\\u062A\\u0648\\u0641\\u0631 \\u0623\\u064A\\u0629 \\u0639\\u0646\\u0627\\u0635\\u0631\n\n#XFLD: Label for Start Time\nALR_START_TIME=\\u0648\\u0642\\u062A \\u0627\\u0644\\u0628\\u062F\\u0621\n\n#XFLD: Label for Start Time\nALR_END_TIME=\\u0648\\u0642\\u062A \\u0627\\u0644\\u0627\\u0646\\u062A\\u0647\\u0627\\u0621\n',
	"hcm/approve/leaverequest/i18n/i18n_bg.properties":'\n# XFLD: number of absence days requested (e.g. two days)\nutil.Conversions.Days=\\u0414\\u043D\\u0438\n\n# XFLD: number of absence days requested (singular)\nutil.Conversions.Day_Singular=\\u0414\\u0435\\u043D\n\n# XFLD: number of absence hours requested (e.g. two hours)\nutil.Conversions.Hours=\\u0427\\u0430\\u0441\\u043E\\u0432\\u0435\n\n# XFLD: number of absence hours requested (e.g. one hour, Singular!)\nutil.Conversions.Hour_Singular=\\u0427\\u0430\\u0441\n\n# XFLD: number of absence days requested (e.g. two days)\nutil.Conversions.Value_Days={0} \\u0434\\u043D\\u0438\n\n# XFLD: number of absence days requested (singular)\nutil.Conversions.Value_Day_Singular={0} \\u0434\\u043D\\u0438\n\n# XFLD: number of absence hours requested (e.g. two hours)\nutil.Conversions.Value_Hours={0} \\u0447\\u0430\\u0441\\u043E\\u0432\\u0435\n\n# XFLD: number of absence hours requested (e.g. one hour, Singular!)\nutil.Conversions.Value_Hour_Singular={0} \\u0447\\u0430\\u0441\n\n# XFLD: Current Balance of the leave quote on Detail Screen\nview.AddInfo.CurrentBalance=\\u041D\\u0430\\u043B\\u0438\\u0447\\u043D\\u043E \\u0441\\u0430\\u043B\\u0434\\u043E\n\n# XFLD: Requested amount of the leave type on Detail Screen (e.g. Vacation Requested:  14 Days)\nview.AddInfo.Requested=\\u0417\\u0430\\u044F\\u0432\\u0435\\u043D\n\n# YMSG: information of existing overlaps of leave requests (e.g.  3 overlaps, Plural)\nutil.Conversions.OverlapsPl={0} \\u0441\\u0435 \\u0437\\u0430\\u0441\\u0442\\u044A\\u043F\\u0432\\u0430\n\n# YMSG: information of existing overlaps of leave requests (e.g. 1 overlap, Singular)\nutil.Conversions.OverlapSing={0} \\u0437\\u0430\\u0441\\u0442\\u044A\\u043F\\u0432\\u0430\n\n# XFLD: Requested amount of the leave type on Confirm/Decline Popup (e.g. Request    14 days)\nview.Detail.Request=\\u0417\\u0430\\u044F\\u0432\\u0435\\u043D\n\n#XFLD: Label for Requested Time Duration\nview.Detail.FromTo=\\u041E\\u0442 - \\u0434\\u043E\n\n# YMSG: Alert message that current balance of leave request may not be accurate.\nview.AddInfo.AlertMessageBalanceNotAccurate=\\u041B\\u0438\\u0446\\u0435\\u0442\\u043E \\u0435 \\u043F\\u043E\\u0434\\u0430\\u0432\\u0430\\u043B\\u043E \\u043D\\u0430\\u0441\\u043A\\u043E\\u0440\\u043E \\u0434\\u0440\\u0443\\u0433\\u0438 \\u0437\\u0430\\u044F\\u0432\\u043A\\u0438 \\u0437\\u0430 \\u043E\\u0442\\u043F\\u0443\\u0441\\u043A; \\u0441\\u0430\\u043B\\u0434\\u043E\\u0442\\u043E \\u043C\\u043E\\u0436\\u0435 \\u0434\\u0430 \\u043D\\u0435 \\u0435 \\u0442\\u043E\\u0447\\u043D\\u043E\n\n# XSEL: status of Leave Request: approved\nview.Calendar.LegendApproved=\\u041E\\u0434\\u043E\\u0431\\u0440\\u0435\\u043D \\u043E\\u0442\\u043F\\u0443\\u0441\\u043A\n\n# XSEL: status of Leave Request: working day\nview.Calendar.LegendWorkingDay=\\u0420\\u0430\\u0431\\u043E\\u0442\\u0435\\u043D \\u0434\\u0435\\u043D\n\n# XSEL: status of Leave Request: Open Request\nview.Calendar.LegendPending=\\u041E\\u0447\\u0430\\u043A\\u0432\\u0430 \\u043E\\u0434\\u043E\\u0431\\u0440\\u0435\\u043D\\u0438\\u0435\n\n# XSEL: status of Leave Request: Non-working day (e.g. weekend)\nview.Calendar.LegendDayOff=\\u041D\\u0435\\u0440\\u0430\\u0431\\u043E\\u0442\\u0435\\u043D \\u0434\\u0435\\u043D\n\n# XSEL: status of Leave Request: Public Holiday\nview.Calendar.LegendHoliday=\\u041E\\u0444\\u0438\\u0446\\u0438\\u0430\\u043B\\u0435\\u043D \\u043F\\u0440\\u0430\\u0437\\u043D\\u0438\\u043A\n\n# XSEL: status of Leave Request: Today\nview.Calendar.LegendToday=\\u0414\\u043D\\u0435\\u0441\n\n# XSEL: status of Leave Request:  other request types\nview.Calendar.LegendDeletionRequested=\\u0414\\u0440\\u0443\\u0433\\u0438\n\n# YMSG: Toast message that approval of leave request was successful\nview.Toast.YMSG_LRA_Approved=\\u0417\\u0430\\u044F\\u0432\\u043A\\u0430\\u0442\\u0430 \\u0437\\u0430 \\u043E\\u0442\\u043F\\u0443\\u0441\\u043A \\u0435 \\u043E\\u0434\\u043E\\u0431\\u0440\\u0435\\u043D\\u0430\n\n# YMSG: Toast message that reject of leave request was successful\nview.Toast.YMSG_LRA_Declined=\\u0417\\u0430\\u044F\\u0432\\u043A\\u0430\\u0442\\u0430 \\u0437\\u0430 \\u043E\\u0442\\u043F\\u0443\\u0441\\u043A \\u0435 \\u043E\\u0442\\u0445\\u0432\\u044A\\u0440\\u043B\\u0435\\u043D\\u0430\n\n# XTIT: Leave Request Details\nview.Detail.title=\\u0417\\u0430\\u044F\\u0432\\u043A\\u0430 \\u0437\\u0430 \\u043E\\u0442\\u043F\\u0443\\u0441\\u043A\n\n# XTIT: Leave Request Details - Calendar\nview.Calendar.title=\\u041A\\u0430\\u043B\\u0435\\u043D\\u0434\\u0430\\u0440\n\n# XTIT: Leave Type\nview.AddInfo.LeaveType=\\u0412\\u0438\\u0434 \\u043E\\u0442\\u043F\\u0443\\u0441\\u043A\n\n# XTIT: Total Deduction\nview.AddInfo.Deduction=\\u041E\\u0431\\u0449\\u043E \\u0443\\u0434\\u0440\\u044A\\u0436\\u043A\\u0430\n\n# XTIT: Personel Number\nview.Header.EmployeeID=\\u0418\\u0414 \\u043D\\u0430 \\u0441\\u043B\\u0443\\u0436\\u0438\\u0442\\u0435\\u043B {0}\n\n# XTIT: Header text of Master List\nview.Master.title=\\u0417\\u0430\\u044F\\u0432\\u043A\\u0438 \\u0437\\u0430 \\u043E\\u0442\\u043F\\u0443\\u0441\\u043A ({0})\n\n# XTIT: Application name (shown in browser header bar or as browser tab title)\napp.Identity=\\u041E\\u0434\\u043E\\u0431\\u0440\\u044F\\u0432\\u0430\\u043D\\u0435 \\u043D\\u0430 \\u0437\\u0430\\u044F\\u0432\\u043A\\u0438 \\u0437\\u0430 \\u043E\\u0442\\u043F\\u0443\\u0441\\u043A\n\n\n# XTIT: Title of Email to Employee on Business Card\nview.BusinessCard.Employee.Subject=\\u0412\\u0430\\u0448\\u0430\\u0442\\u0430 \\u0437\\u0430\\u044F\\u0432\\u043A\\u0430 \\u0437\\u0430 \\u043E\\u0442\\u043F\\u0443\\u0441\\u043A\\: {0}\n\n# XTIT: Shell title (shown within the UI as title of shell component, desktop only)\nshell.Identity=\\u041E\\u0434\\u043E\\u0431\\u0440\\u044F\\u0432\\u0430\\u043D\\u0435 \\u043D\\u0430 \\u0437\\u0430\\u044F\\u0432\\u043A\\u0438 \\u0437\\u0430 \\u043E\\u0442\\u043F\\u0443\\u0441\\u043A\n\n# YMSG\ndialog.question.approve=\\u041E\\u0434\\u043E\\u0431\\u0440\\u044F\\u0432\\u0430\\u043D\\u0435 \\u0437\\u0430\\u044F\\u0432\\u043A\\u0430 \\u0437\\u0430 \\u043E\\u0442\\u043F\\u0443\\u0441\\u043A \\u043F\\u043E\\u0434\\u0430\\u0434\\u0435\\u043D\\u0430 \\u043E\\u0442 {0}?\n\n# YMSG\ndialog.question.reject=\\u041E\\u0442\\u0445\\u0432\\u044A\\u0440\\u043B\\u044F\\u043D\\u0435 \\u0437\\u0430\\u044F\\u0432\\u043A\\u0430 \\u0437\\u0430 \\u043E\\u0442\\u043F\\u0443\\u0441\\u043A \\u043F\\u043E\\u0434\\u0430\\u0434\\u0435\\u043D\\u0430 \\u043E\\u0442 {0}?\n\n# YMSG\ndialog.question.approvecancel=\\u041E\\u0434\\u043E\\u0431\\u0440\\u044F\\u0432\\u0430\\u043D\\u0435 \\u043E\\u0442\\u043A\\u0430\\u0437 \\u043F\\u043E\\u0434\\u0430\\u0434\\u0435\\u043D \\u043E\\u0442 {0}?\n\n# YMSG\ndialog.question.rejectcancel=\\u041E\\u0442\\u0445\\u0432\\u044A\\u0440\\u043B\\u044F\\u043D\\u0435 \\u043D\\u0430 \\u043E\\u0442\\u043A\\u0430\\u0437 \\u043F\\u043E\\u0434\\u0430\\u0434\\u0435\\u043D \\u043E\\u0442 {0}?\n\n# YMSG\ndialog.success.approvecancel=\\u041E\\u0442\\u043A\\u0430\\u0437\\u044A\\u0442 \\u0435 \\u043E\\u0434\\u043E\\u0431\\u0440\\u0435\\u043D\n\n# YMSG\ndialog.success.rejectcancel=\\u041E\\u0442\\u043A\\u0430\\u0437\\u044A\\u0442 \\u0435 \\u043E\\u0442\\u0445\\u0432\\u044A\\u0440\\u043B\\u0435\\u043D\n\n# YMSG\ndialog.success.approve=\\u0417\\u0430\\u044F\\u0432\\u043A\\u0430\\u0442\\u0430 \\u0437\\u0430 \\u043E\\u0442\\u043F\\u0443\\u0441\\u043A \\u0435 \\u043E\\u0434\\u043E\\u0431\\u0440\\u0435\\u043D\\u0430\n\n# YMSG\ndialog.success.reject=\\u0417\\u0430\\u044F\\u0432\\u043A\\u0430\\u0442\\u0430 \\u0437\\u0430 \\u043E\\u0442\\u043F\\u0443\\u0441\\u043A \\u0435 \\u043E\\u0442\\u0445\\u0432\\u044A\\u0440\\u043B\\u0435\\u043D\\u0430\n\n# YMSG\ndialog.leave.overlaps.disclaimer=\\u041F\\u0440\\u0438\\u043F\\u043E\\u043A\\u0440\\u0438\\u0432\\u0430\\u043D\\u0438\\u044F \\u043D\\u0430 \\u043E\\u0442\\u043F\\u0443\\u0441\\u043A\\u0438 \\u0437\\u0430 {0} \\u043C\\u0435\\u0436\\u0434\\u0443 {1} \\u0438 {2}\n\n# YMSG: link to Team calendar\nutil.Conversions.OverlapsPlLink=\\u041F\\u043E\\u043A\\u0430\\u0437\\u0432\\u0430\\u043D\\u0435 \\u043A\\u0430\\u043B\\u0435\\u043D\\u0434\\u0430\\u0440 \\u043D\\u0430 \\u0435\\u043A\\u0438\\u043F\n\n# XFLD: Status: Cancellation of a Leave Request requested \nview.Header.CancellationStatus=\\u041E\\u0442\\u043A\\u0430\\u0437\\u044A\\u0442 \\u0435 \\u0437\\u0430\\u044F\\u0432\\u0435\\u043D\n\n# XFLD: Status: Cancellation of a Leave Request requested \nview.List.CancellationStatus=\\u041E\\u0442\\u043A\\u0430\\u0437\\u0430\\u043D\n\n#XBUT: Button for Approve action\nXBUT_APPROVE=\\u041E\\u0434\\u043E\\u0431\\u0440\\u044F\\u0432\\u0430\\u043D\\u0435\n\n#XBUT: Button for Reject action\nXBUT_REJECT=\\u041E\\u0442\\u0445\\u0432\\u044A\\u0440\\u043B\\u044F\\u043D\\u0435\n\n#XTIT: Title of the confirmation dialog while executing an action\nXTIT_APPROVAL=\\u041E\\u0434\\u043E\\u0431\\u0440\\u044F\\u0432\\u0430\\u043D\\u0435\n\n#XTIT: Title of the confirmation dialog while executing an action\nXTIT_REJECT=\\u041E\\u0442\\u0445\\u0432\\u044A\\u0440\\u043B\\u044F\\u043D\\u0435\n\n# YMSG: Loading\nLOADING=\\u0417\\u0430\\u0440\\u0435\\u0436\\u0434\\u0430\\u043D\\u0435...\n\n# XTIT: Leave Request Details\nDETAIL_TITLE=\\u0417\\u0430\\u044F\\u0432\\u043A\\u0430 \\u0437\\u0430 \\u043E\\u0442\\u043F\\u0443\\u0441\\u043A\n\n# YMSG: No items are currently available\nNO_ITEMS_AVAILABLE=\\u041D\\u044F\\u043C\\u0430 \\u043D\\u0430\\u043B\\u0438\\u0447\\u043D\\u0438 \\u043F\\u043E\\u0437\\u0438\\u0446\\u0438\\u0438\n\n#XFLD: Label for Start Time\nALR_START_TIME=\\u041D\\u0430\\u0447\\u0430\\u043B\\u0435\\u043D \\u0447\\u0430\\u0441\n\n#XFLD: Label for Start Time\nALR_END_TIME=\\u041A\\u0440\\u0430\\u0435\\u043D \\u0447\\u0430\\u0441\n',
	"hcm/approve/leaverequest/i18n/i18n_cs.properties":'\n# XFLD: number of absence days requested (e.g. two days)\nutil.Conversions.Days=Dny\n\n# XFLD: number of absence days requested (singular)\nutil.Conversions.Day_Singular=Den\n\n# XFLD: number of absence hours requested (e.g. two hours)\nutil.Conversions.Hours=Hodiny\n\n# XFLD: number of absence hours requested (e.g. one hour, Singular!)\nutil.Conversions.Hour_Singular=Hodina\n\n# XFLD: number of absence days requested (e.g. two days)\nutil.Conversions.Value_Days={0} dn\\u00ED\n\n# XFLD: number of absence days requested (singular)\nutil.Conversions.Value_Day_Singular={0} den\n\n# XFLD: number of absence hours requested (e.g. two hours)\nutil.Conversions.Value_Hours={0} hodin\n\n# XFLD: number of absence hours requested (e.g. one hour, Singular!)\nutil.Conversions.Value_Hour_Singular={0} hodina\n\n# XFLD: Current Balance of the leave quote on Detail Screen\nview.AddInfo.CurrentBalance=Dostupn\\u00FD z\\u016Fstatek\n\n# XFLD: Requested amount of the leave type on Detail Screen (e.g. Vacation Requested:  14 Days)\nview.AddInfo.Requested=Po\\u017Eadov\\u00E1no\n\n# YMSG: information of existing overlaps of leave requests (e.g.  3 overlaps, Plural)\nutil.Conversions.OverlapsPl={0} p\\u0159ekr\\u00FDv\\u00E1n\\u00ED\n\n# YMSG: information of existing overlaps of leave requests (e.g. 1 overlap, Singular)\nutil.Conversions.OverlapSing={0} p\\u0159ekr\\u00FDv\\u00E1n\\u00ED\n\n# XFLD: Requested amount of the leave type on Confirm/Decline Popup (e.g. Request    14 days)\nview.Detail.Request=Po\\u017Eadov\\u00E1no\n\n#XFLD: Label for Requested Time Duration\nview.Detail.FromTo=Od - do\n\n# YMSG: Alert message that current balance of leave request may not be accurate.\nview.AddInfo.AlertMessageBalanceNotAccurate=Tato osoba ned\\u00E1vno odeslala dal\\u0161\\u00ED \\u017E\\u00E1dosti o dovolenou; z\\u016Fstatek nemus\\u00ED b\\u00FDt p\\u0159esn\\u00FD\n\n# XSEL: status of Leave Request: approved\nview.Calendar.LegendApproved=Schv\\u00E1len\\u00E1 dovolen\\u00E1\n\n# XSEL: status of Leave Request: working day\nview.Calendar.LegendWorkingDay=Pracovn\\u00ED den\n\n# XSEL: status of Leave Request: Open Request\nview.Calendar.LegendPending=\\u010Cek\\u00E1 na schv\\u00E1len\\u00ED\n\n# XSEL: status of Leave Request: Non-working day (e.g. weekend)\nview.Calendar.LegendDayOff=Nepracovn\\u00ED den\n\n# XSEL: status of Leave Request: Public Holiday\nview.Calendar.LegendHoliday=Sv\\u00E1tek\n\n# XSEL: status of Leave Request: Today\nview.Calendar.LegendToday=Dnes\n\n# XSEL: status of Leave Request:  other request types\nview.Calendar.LegendDeletionRequested=Jin\\u00E9\n\n# YMSG: Toast message that approval of leave request was successful\nview.Toast.YMSG_LRA_Approved=\\u0179\\u00E1dost o dovolenou byla schv\\u00E1lena\n\n# YMSG: Toast message that reject of leave request was successful\nview.Toast.YMSG_LRA_Declined=\\u0179\\u00E1dost o dovolenou byla zam\\u00EDtnuta\n\n# XTIT: Leave Request Details\nview.Detail.title=\\u017D\\u00E1dost o dovolenou\n\n# XTIT: Leave Request Details - Calendar\nview.Calendar.title=Kalend\\u00E1\\u0159\n\n# XTIT: Leave Type\nview.AddInfo.LeaveType=Typ dovolen\\u00E9\n\n# XTIT: Total Deduction\nview.AddInfo.Deduction=Celkov\\u00E9 sn\\u00ED\\u017Een\\u00ED\n\n# XTIT: Personel Number\nview.Header.EmployeeID=ID zam\\u011Bstnance {0}\n\n# XTIT: Header text of Master List\nview.Master.title=\\u017D\\u00E1dosti o dovolenou ({0})\n\n# XTIT: Application name (shown in browser header bar or as browser tab title)\napp.Identity=Schvalov\\u00E1n\\u00ED \\u017E\\u00E1dost\\u00ED o dovolenou\n\n\n# XTIT: Title of Email to Employee on Business Card\nview.BusinessCard.Employee.Subject=Va\\u0161e \\u017E\\u00E1dost o dovolenou\\: {0}\n\n# XTIT: Shell title (shown within the UI as title of shell component, desktop only)\nshell.Identity=Schvalov\\u00E1n\\u00ED \\u017E\\u00E1dost\\u00ED o dovolenou\n\n# YMSG\ndialog.question.approve=Schv\\u00E1lit \\u017E\\u00E1dost o dovolenou, kterou podal(a) {0}?\n\n# YMSG\ndialog.question.reject=Zam\\u00EDtnout \\u017E\\u00E1dost o dovolenou, kterou podal(a) {0}?\n\n# YMSG\ndialog.question.approvecancel=Schv\\u00E1lit storno, kter\\u00E9 podal(a) {0}?\n\n# YMSG\ndialog.question.rejectcancel=Zam\\u00EDtnout storno, kter\\u00E9 podal(a) {0}?\n\n# YMSG\ndialog.success.approvecancel=Zru\\u0161en\\u00ED bylo schv\\u00E1leno\n\n# YMSG\ndialog.success.rejectcancel=Zru\\u0161en\\u00ED bylo zam\\u00EDtnuto\n\n# YMSG\ndialog.success.approve=\\u0179\\u00E1dost o dovolenou byla schv\\u00E1lena\n\n# YMSG\ndialog.success.reject=\\u0179\\u00E1dost o dovolenou byla zam\\u00EDtnuta\n\n# YMSG\ndialog.leave.overlaps.disclaimer=Dovolen\\u00E1 se p\\u0159ekr\\u00FDv\\u00E1 pro {0} mezi {1} a {2}\n\n# YMSG: link to Team calendar\nutil.Conversions.OverlapsPlLink=Zobrazit kalend\\u00E1\\u0159 t\\u00FDmu\n\n# XFLD: Status: Cancellation of a Leave Request requested \nview.Header.CancellationStatus=Po\\u017Eadov\\u00E1no zru\\u0161en\\u00ED\n\n# XFLD: Status: Cancellation of a Leave Request requested \nview.List.CancellationStatus=Zru\\u0161eno\n\n#XBUT: Button for Approve action\nXBUT_APPROVE=Schv\\u00E1lit\n\n#XBUT: Button for Reject action\nXBUT_REJECT=Zam\\u00EDtnout\n\n#XTIT: Title of the confirmation dialog while executing an action\nXTIT_APPROVAL=Schv\\u00E1lit\n\n#XTIT: Title of the confirmation dialog while executing an action\nXTIT_REJECT=Zam\\u00EDtnout\n\n# YMSG: Loading\nLOADING=Na\\u010D\\u00EDt\\u00E1n\\u00ED...\n\n# XTIT: Leave Request Details\nDETAIL_TITLE=\\u017D\\u00E1dost o dovolenou\n\n# YMSG: No items are currently available\nNO_ITEMS_AVAILABLE=Nejsou k dispozici \\u017E\\u00E1dn\\u00E9 polo\\u017Eky\n\n#XFLD: Label for Start Time\nALR_START_TIME=Po\\u010D\\u00E1te\\u010Dn\\u00ED \\u010Das\n\n#XFLD: Label for Start Time\nALR_END_TIME=Koncov\\u00FD \\u010Das\n',
	"hcm/approve/leaverequest/i18n/i18n_de.properties":'\n# XFLD: number of absence days requested (e.g. two days)\nutil.Conversions.Days=Tage\n\n# XFLD: number of absence days requested (singular)\nutil.Conversions.Day_Singular=Tag\n\n# XFLD: number of absence hours requested (e.g. two hours)\nutil.Conversions.Hours=Stunden\n\n# XFLD: number of absence hours requested (e.g. one hour, Singular!)\nutil.Conversions.Hour_Singular=Stunde\n\n# XFLD: number of absence days requested (e.g. two days)\nutil.Conversions.Value_Days={0} Tage\n\n# XFLD: number of absence days requested (singular)\nutil.Conversions.Value_Day_Singular={0} Tag\n\n# XFLD: number of absence hours requested (e.g. two hours)\nutil.Conversions.Value_Hours={0} Stunden\n\n# XFLD: number of absence hours requested (e.g. one hour, Singular!)\nutil.Conversions.Value_Hour_Singular={0} Stunde\n\n# XFLD: Current Balance of the leave quote on Detail Screen\nview.AddInfo.CurrentBalance=Zur Verf\\u00FCgung stehender Anspruch\n\n# XFLD: Requested amount of the leave type on Detail Screen (e.g. Vacation Requested:  14 Days)\nview.AddInfo.Requested=Beantragt\n\n# YMSG: information of existing overlaps of leave requests (e.g.  3 overlaps, Plural)\nutil.Conversions.OverlapsPl={0} \\u00DCberschneidungen\n\n# YMSG: information of existing overlaps of leave requests (e.g. 1 overlap, Singular)\nutil.Conversions.OverlapSing={0} \\u00DCberschneidung\n\n# XFLD: Requested amount of the leave type on Confirm/Decline Popup (e.g. Request    14 days)\nview.Detail.Request=Beantragt\n\n#XFLD: Label for Requested Time Duration\nview.Detail.FromTo=Von - bis\n\n# YMSG: Alert message that current balance of leave request may not be accurate.\nview.AddInfo.AlertMessageBalanceNotAccurate=Der Mitarbeiter hat bereits weitere Abwesenheitsantr\\u00E4ge eingereicht. Der angezeigte Anspruch ist m\\u00F6glicherweise nicht korrekt.\n\n# XSEL: status of Leave Request: approved\nview.Calendar.LegendApproved=Genehmigte Abwesenheit\n\n# XSEL: status of Leave Request: working day\nview.Calendar.LegendWorkingDay=Arbeitstag\n\n# XSEL: status of Leave Request: Open Request\nview.Calendar.LegendPending=Genehmigung ausstehend\n\n# XSEL: status of Leave Request: Non-working day (e.g. weekend)\nview.Calendar.LegendDayOff=Kein Arbeitstag\n\n# XSEL: status of Leave Request: Public Holiday\nview.Calendar.LegendHoliday=Feiertag\n\n# XSEL: status of Leave Request: Today\nview.Calendar.LegendToday=Heute\n\n# XSEL: status of Leave Request:  other request types\nview.Calendar.LegendDeletionRequested=Sonstige\n\n# YMSG: Toast message that approval of leave request was successful\nview.Toast.YMSG_LRA_Approved=Abwesenheitsantrag wurde genehmigt\n\n# YMSG: Toast message that reject of leave request was successful\nview.Toast.YMSG_LRA_Declined=Abwesenheitsantrag wurde abgelehnt\n\n# XTIT: Leave Request Details\nview.Detail.title=Abwesenheitsantrag\n\n# XTIT: Leave Request Details - Calendar\nview.Calendar.title=Kalender\n\n# XTIT: Leave Type\nview.AddInfo.LeaveType=Abwesenheitsart\n\n# XTIT: Total Deduction\nview.AddInfo.Deduction=Abzug gesamt\n\n# XTIT: Personel Number\nview.Header.EmployeeID=Mitarbeiter-ID {0}\n\n# XTIT: Header text of Master List\nview.Master.title=Antr\\u00E4ge ({0})\n\n# XTIT: Application name (shown in browser header bar or as browser tab title)\napp.Identity=Abwesenheitsantr\\u00E4ge genehmigen\n\n\n# XTIT: Title of Email to Employee on Business Card\nview.BusinessCard.Employee.Subject=Ihr Abwesenheitsantrag\\: {0}\n\n# XTIT: Shell title (shown within the UI as title of shell component, desktop only)\nshell.Identity=Abwesenheitsantr\\u00E4ge genehmigen\n\n# YMSG\ndialog.question.approve=Abwesenheitsantrag von {0} genehmigen?\n\n# YMSG\ndialog.question.reject=Abwesenheitsantrag von {0} ablehnen?\n\n# YMSG\ndialog.question.approvecancel=Stornierung von {0} genehmigen?\n\n# YMSG\ndialog.question.rejectcancel=Stornierung von {0} ablehnen?\n\n# YMSG\ndialog.success.approvecancel=Stornierung wurde genehmigt\n\n# YMSG\ndialog.success.rejectcancel=Stornierung wurde abgelehnt\n\n# YMSG\ndialog.success.approve=Abwesenheitsantrag wurde genehmigt\n\n# YMSG\ndialog.success.reject=Abwesenheitsantrag wurde abgelehnt\n\n# YMSG\ndialog.leave.overlaps.disclaimer=\\u00DCberschneidungen der Abwesenheiten f\\u00FCr {0} zwischen dem {1} und dem {2}\n\n# YMSG: link to Team calendar\nutil.Conversions.OverlapsPlLink=Teamkalender anzeigen\n\n# XFLD: Status: Cancellation of a Leave Request requested \nview.Header.CancellationStatus=Stornierung beantragt\n\n# XFLD: Status: Cancellation of a Leave Request requested \nview.List.CancellationStatus=Storniert\n\n#XBUT: Button for Approve action\nXBUT_APPROVE=Genehmigen\n\n#XBUT: Button for Reject action\nXBUT_REJECT=Ablehnen\n\n#XTIT: Title of the confirmation dialog while executing an action\nXTIT_APPROVAL=Genehmigen\n\n#XTIT: Title of the confirmation dialog while executing an action\nXTIT_REJECT=Ablehnen\n\n# YMSG: Loading\nLOADING=Ladevorgang l\\u00E4uft ...\n\n# XTIT: Leave Request Details\nDETAIL_TITLE=Abwesenheitsantrag\n\n# YMSG: No items are currently available\nNO_ITEMS_AVAILABLE=Keine Eintr\\u00E4ge verf\\u00FCgbar\n\n#XFLD: Label for Start Time\nALR_START_TIME=Beginn (Zeit)\n\n#XFLD: Label for Start Time\nALR_END_TIME=Ende (Zeit)\n',
	"hcm/approve/leaverequest/i18n/i18n_en.properties":'\n# XFLD: number of absence days requested (e.g. two days)\nutil.Conversions.Days=Days\n\n# XFLD: number of absence days requested (singular)\nutil.Conversions.Day_Singular=Day\n\n# XFLD: number of absence hours requested (e.g. two hours)\nutil.Conversions.Hours=Hours\n\n# XFLD: number of absence hours requested (e.g. one hour, Singular!)\nutil.Conversions.Hour_Singular=Hour\n\n# XFLD: number of absence days requested (e.g. two days)\nutil.Conversions.Value_Days={0} days\n\n# XFLD: number of absence days requested (singular)\nutil.Conversions.Value_Day_Singular={0} day\n\n# XFLD: number of absence hours requested (e.g. two hours)\nutil.Conversions.Value_Hours={0} hours\n\n# XFLD: number of absence hours requested (e.g. one hour, Singular!)\nutil.Conversions.Value_Hour_Singular={0} hour\n\n# XFLD: Current Balance of the leave quote on Detail Screen\nview.AddInfo.CurrentBalance=Available Balance\n\n# XFLD: Requested amount of the leave type on Detail Screen (e.g. Vacation Requested:  14 Days)\nview.AddInfo.Requested=Requested\n\n# YMSG: information of existing overlaps of leave requests (e.g.  3 overlaps, Plural)\nutil.Conversions.OverlapsPl={0} Overlaps\n\n# YMSG: information of existing overlaps of leave requests (e.g. 1 overlap, Singular)\nutil.Conversions.OverlapSing={0} Overlap\n\n# XFLD: Requested amount of the leave type on Confirm/Decline Popup (e.g. Request    14 days)\nview.Detail.Request=Requested\n\n#XFLD: Label for Requested Time Duration\nview.Detail.FromTo=From - To\n\n# YMSG: Alert message that current balance of leave request may not be accurate.\nview.AddInfo.AlertMessageBalanceNotAccurate=This person has recently submitted other leave requests; the balance may not be accurate\n\n# XSEL: status of Leave Request: approved\nview.Calendar.LegendApproved=Approved Leave\n\n# XSEL: status of Leave Request: working day\nview.Calendar.LegendWorkingDay=Workday\n\n# XSEL: status of Leave Request: Open Request\nview.Calendar.LegendPending=Pending Approval\n\n# XSEL: status of Leave Request: Non-working day (e.g. weekend)\nview.Calendar.LegendDayOff=Non-Workday\n\n# XSEL: status of Leave Request: Public Holiday\nview.Calendar.LegendHoliday=Public Holiday\n\n# XSEL: status of Leave Request: Today\nview.Calendar.LegendToday=Today\n\n# XSEL: status of Leave Request:  other request types\nview.Calendar.LegendDeletionRequested=Others\n\n# YMSG: Toast message that approval of leave request was successful\nview.Toast.YMSG_LRA_Approved=Leave request was approved\n\n# YMSG: Toast message that reject of leave request was successful\nview.Toast.YMSG_LRA_Declined=Leave request was rejected\n\n# XTIT: Leave Request Details\nview.Detail.title=Leave Request\n\n# XTIT: Leave Request Details - Calendar\nview.Calendar.title=Calendar\n\n# XTIT: Leave Type\nview.AddInfo.LeaveType=Leave Type\n\n# XTIT: Total Deduction\nview.AddInfo.Deduction=Total Deduction\n\n# XTIT: Personel Number\nview.Header.EmployeeID=Employee ID {0}\n\n# XTIT: Header text of Master List\nview.Master.title=Leave Requests ({0})\n\n# XTIT: Application name (shown in browser header bar or as browser tab title)\napp.Identity=Approve Leave Requests\n\n\n# XTIT: Title of Email to Employee on Business Card\nview.BusinessCard.Employee.Subject=Your Request for Leave\\: {0}\n\n# XTIT: Shell title (shown within the UI as title of shell component, desktop only)\nshell.Identity=Approve Leave Requests\n\n# YMSG\ndialog.question.approve=Approve the leave request submitted by {0}?\n\n# YMSG\ndialog.question.reject=Reject the leave request submitted by {0}?\n\n# YMSG\ndialog.question.approvecancel=Approve the cancellation submitted by {0}?\n\n# YMSG\ndialog.question.rejectcancel=Reject the cancellation submitted by {0}?\n\n# YMSG\ndialog.success.approvecancel=Cancellation was approved\n\n# YMSG\ndialog.success.rejectcancel=Cancellation was rejected\n\n# YMSG\ndialog.success.approve=Leave request was approved\n\n# YMSG\ndialog.success.reject=Leave request was rejected\n\n# YMSG\ndialog.leave.overlaps.disclaimer=Leave overlaps for {0} between {1} and {2}\n\n# YMSG: link to Team calendar\nutil.Conversions.OverlapsPlLink=Show Team Calendar\n\n# XFLD: Status: Cancellation of a Leave Request requested \nview.Header.CancellationStatus=Cancellation Requested\n\n# XFLD: Status: Cancellation of a Leave Request requested \nview.List.CancellationStatus=Canceled\n\n#XBUT: Button for Approve action\nXBUT_APPROVE=Approve\n\n#XBUT: Button for Reject action\nXBUT_REJECT=Reject\n\n#XTIT: Title of the confirmation dialog while executing an action\nXTIT_APPROVAL=Approve\n\n#XTIT: Title of the confirmation dialog while executing an action\nXTIT_REJECT=Reject\n\n# YMSG: Loading\nLOADING=Loading ...\n\n# XTIT: Leave Request Details\nDETAIL_TITLE=Leave Request\n\n# YMSG: No items are currently available\nNO_ITEMS_AVAILABLE=No items available\n\n#XFLD: Label for Start Time\nALR_START_TIME=Start Time\n\n#XFLD: Label for Start Time\nALR_END_TIME=End Time\n',
	"hcm/approve/leaverequest/i18n/i18n_en_US_sappsd.properties":'\n# XFLD: number of absence days requested (e.g. two days)\nutil.Conversions.Days=[[[\\u018C\\u0105\\u0177\\u015F]]]\n\n# XFLD: number of absence days requested (singular)\nutil.Conversions.Day_Singular=[[[\\u018C\\u0105\\u0177\\u2219]]]\n\n# XFLD: number of absence hours requested (e.g. two hours)\nutil.Conversions.Hours=[[[\\u0125\\u014F\\u0171\\u0157\\u015F\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n# XFLD: number of absence hours requested (e.g. one hour, Singular!)\nutil.Conversions.Hour_Singular=[[[\\u0125\\u014F\\u0171\\u0157]]]\n\n# XFLD: number of absence days requested (e.g. two days)\nutil.Conversions.Value_Days=[[[{0} \\u018C\\u0105\\u0177\\u015F]]]\n\n# XFLD: number of absence days requested (singular)\nutil.Conversions.Value_Day_Singular=[[[{0} \\u018C\\u0105\\u0177]]]\n\n# XFLD: number of absence hours requested (e.g. two hours)\nutil.Conversions.Value_Hours=[[[{0} \\u0125\\u014F\\u0171\\u0157\\u015F]]]\n\n# XFLD: number of absence hours requested (e.g. one hour, Singular!)\nutil.Conversions.Value_Hour_Singular=[[[{0} \\u0125\\u014F\\u0171\\u0157]]]\n\n# XFLD: Current Balance of the leave quote on Detail Screen\nview.AddInfo.CurrentBalance=[[[\\u0100\\u028B\\u0105\\u012F\\u013A\\u0105\\u0183\\u013A\\u0113 \\u0181\\u0105\\u013A\\u0105\\u014B\\u010B\\u0113\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n# XFLD: Requested amount of the leave type on Detail Screen (e.g. Vacation Requested:  14 Days)\nview.AddInfo.Requested=[[[\\u0158\\u0113\\u01A3\\u0171\\u0113\\u015F\\u0163\\u0113\\u018C\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n# YMSG: information of existing overlaps of leave requests (e.g.  3 overlaps, Plural)\nutil.Conversions.OverlapsPl=[[[{0} \\u014E\\u028B\\u0113\\u0157\\u013A\\u0105\\u03C1\\u015F]]]\n\n# YMSG: information of existing overlaps of leave requests (e.g. 1 overlap, Singular)\nutil.Conversions.OverlapSing=[[[{0} \\u014E\\u028B\\u0113\\u0157\\u013A\\u0105\\u03C1]]]\n\n# XFLD: Requested amount of the leave type on Confirm/Decline Popup (e.g. Request    14 days)\nview.Detail.Request=[[[\\u0158\\u0113\\u01A3\\u0171\\u0113\\u015F\\u0163\\u0113\\u018C\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n#XFLD: Label for Requested Time Duration\nview.Detail.FromTo=[[[\\u0191\\u0157\\u014F\\u0271-\\u0162\\u014F\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n# YMSG: Alert message that current balance of leave request may not be accurate.\nview.AddInfo.AlertMessageBalanceNotAccurate=[[[\\u0162\\u0125\\u012F\\u015F \\u03C1\\u0113\\u0157\\u015F\\u014F\\u014B \\u0125\\u0105\\u015F \\u0157\\u0113\\u010B\\u0113\\u014B\\u0163\\u013A\\u0177 \\u015F\\u0171\\u0183\\u0271\\u012F\\u0163\\u0163\\u0113\\u018C \\u014F\\u0163\\u0125\\u0113\\u0157 \\u013A\\u0113\\u0105\\u028B\\u0113 \\u0157\\u0113\\u01A3\\u0171\\u0113\\u015F\\u0163\\u015F. \\u0162\\u0125\\u0113 \\u0183\\u0105\\u013A\\u0105\\u014B\\u010B\\u0113 \\u0271\\u0105\\u0177 \\u014B\\u014F\\u0163 \\u0183\\u0113 \\u0105\\u010B\\u010B\\u0171\\u0157\\u0105\\u0163\\u0113.\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n# XSEL: status of Leave Request: approved\nview.Calendar.LegendApproved=[[[\\u0100\\u03C1\\u03C1\\u0157\\u014F\\u028B\\u0113\\u018C \\u013B\\u0113\\u0105\\u028B\\u0113\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n# XSEL: status of Leave Request: working day\nview.Calendar.LegendWorkingDay=[[[\\u0174\\u014F\\u0157\\u0137\\u018C\\u0105\\u0177\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n# XSEL: status of Leave Request: Open Request\nview.Calendar.LegendPending=[[[\\u01A4\\u0113\\u014B\\u018C\\u012F\\u014B\\u011F \\u0100\\u03C1\\u03C1\\u0157\\u014F\\u028B\\u0105\\u013A\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n# XSEL: status of Leave Request: Non-working day (e.g. weekend)\nview.Calendar.LegendDayOff=[[[\\u0143\\u014F\\u014B-\\u0174\\u014F\\u0157\\u0137\\u018C\\u0105\\u0177\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n# XSEL: status of Leave Request: Public Holiday\nview.Calendar.LegendHoliday=[[[\\u01A4\\u0171\\u0183\\u013A\\u012F\\u010B \\u0124\\u014F\\u013A\\u012F\\u018C\\u0105\\u0177\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n# XSEL: status of Leave Request: Today\nview.Calendar.LegendToday=[[[\\u0162\\u014F\\u018C\\u0105\\u0177\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n# XSEL: status of Leave Request:  other request types\nview.Calendar.LegendDeletionRequested=[[[\\u014E\\u0163\\u0125\\u0113\\u0157\\u015F\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n# YMSG: Toast message that approval of leave request was successful\nview.Toast.YMSG_LRA_Approved=[[[\\u013B\\u0113\\u0105\\u028B\\u0113 \\u0157\\u0113\\u01A3\\u0171\\u0113\\u015F\\u0163 \\u0175\\u0105\\u015F \\u0105\\u03C1\\u03C1\\u0157\\u014F\\u028B\\u0113\\u018C\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n# YMSG: Toast message that reject of leave request was successful\nview.Toast.YMSG_LRA_Declined=[[[\\u013B\\u0113\\u0105\\u028B\\u0113 \\u0157\\u0113\\u01A3\\u0171\\u0113\\u015F\\u0163 \\u0175\\u0105\\u015F \\u0157\\u0113\\u0135\\u0113\\u010B\\u0163\\u0113\\u018C\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n# XTIT: Leave Request Details\nview.Detail.title=[[[\\u013B\\u0113\\u0105\\u028B\\u0113 \\u0158\\u0113\\u01A3\\u0171\\u0113\\u015F\\u0163\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n# XTIT: Leave Request Details - Calendar\nview.Calendar.title=[[[\\u0108\\u0105\\u013A\\u0113\\u014B\\u018C\\u0105\\u0157\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n# XTIT: Leave Type\nview.AddInfo.LeaveType=[[[\\u013B\\u0113\\u0105\\u028B\\u0113 \\u0162\\u0177\\u03C1\\u0113\\u2219\\u2219\\u2219\\u2219]]]\n\n# XTIT: Total Deduction\nview.AddInfo.Deduction=[[[\\u0162\\u014F\\u0163\\u0105\\u013A \\u010E\\u0113\\u018C\\u0171\\u010B\\u0163\\u012F\\u014F\\u014B\\u2219\\u2219\\u2219\\u2219]]]\n\n# XTIT: Personel Number\nview.Header.EmployeeID=[[[\\u0114\\u0271\\u03C1\\u013A\\u014F\\u0177\\u0113\\u0113 \\u012C\\u010E {0}]]]\n\n# XTIT: Header text of Master List\nview.Master.title=[[[\\u013B\\u0113\\u0105\\u028B\\u0113 \\u0158\\u0113\\u01A3\\u0171\\u0113\\u015F\\u0163\\u015F ({0})]]]\n\n# XTIT: Application name (shown in browser header bar or as browser tab title)\napp.Identity=[[[\\u0100\\u03C1\\u03C1\\u0157\\u014F\\u028B\\u0113 \\u013B\\u0113\\u0105\\u028B\\u0113 \\u0158\\u0113\\u01A3\\u0171\\u0113\\u015F\\u0163\\u015F\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n\n# XTIT: Title of Email to Employee on Business Card\nview.BusinessCard.Employee.Subject=[[[\\u0176\\u014F\\u0171\\u0157 \\u013B\\u0113\\u0105\\u028B\\u0113 \\u0158\\u0113\\u01A3\\u0171\\u0113\\u015F\\u0163 \\u014F\\u0192 \\u0162\\u0177\\u03C1\\u0113 {0}]]]\n\n# XTIT: Shell title (shown within the UI as title of shell component, desktop only)\nshell.Identity=[[[\\u0100\\u03C1\\u03C1\\u0157\\u014F\\u028B\\u0113 \\u013B\\u0113\\u0105\\u028B\\u0113 \\u0158\\u0113\\u01A3\\u0171\\u0113\\u015F\\u0163\\u015F\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n# YMSG\ndialog.question.approve=[[[\\u0100\\u03C1\\u03C1\\u0157\\u014F\\u028B\\u0113 \\u0163\\u0125\\u0113 \\u013A\\u0113\\u0105\\u028B\\u0113 \\u0157\\u0113\\u01A3\\u0171\\u0113\\u015F\\u0163 \\u015F\\u0171\\u0183\\u0271\\u012F\\u0163\\u0163\\u0113\\u018C \\u0183\\u0177 {0}?]]]\n\n# YMSG\ndialog.question.reject=[[[\\u0158\\u0113\\u0135\\u0113\\u010B\\u0163 \\u0163\\u0125\\u0113 \\u013A\\u0113\\u0105\\u028B\\u0113 \\u0157\\u0113\\u01A3\\u0171\\u0113\\u015F\\u0163 \\u015F\\u0171\\u0183\\u0271\\u012F\\u0163\\u0163\\u0113\\u018C \\u0183\\u0177 {0}?]]]\n\n# YMSG\ndialog.question.approvecancel=[[[\\u0100\\u03C1\\u03C1\\u0157\\u014F\\u028B\\u0113 \\u0163\\u0125\\u0113 \\u010B\\u0105\\u014B\\u010B\\u0113\\u013A\\u013A\\u0105\\u0163\\u012F\\u014F\\u014B \\u015F\\u0171\\u0183\\u0271\\u012F\\u0163\\u0163\\u0113\\u018C \\u0183\\u0177 {0}?]]]\n\n# YMSG\ndialog.question.rejectcancel=[[[\\u0158\\u0113\\u0135\\u0113\\u010B\\u0163 \\u0163\\u0125\\u0113 \\u010B\\u0105\\u014B\\u010B\\u0113\\u013A\\u013A\\u0105\\u0163\\u012F\\u014F\\u014B \\u015F\\u0171\\u0183\\u0271\\u012F\\u0163\\u0163\\u0113\\u018C \\u0183\\u0177 {0}?]]]\n\n# YMSG\ndialog.success.approvecancel=[[[\\u0108\\u0105\\u014B\\u010B\\u0113\\u013A\\u013A\\u0105\\u0163\\u012F\\u014F\\u014B \\u0175\\u0105\\u015F \\u0105\\u03C1\\u03C1\\u0157\\u014F\\u028B\\u0113\\u018C \\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n# YMSG\ndialog.success.rejectcancel=[[[\\u0108\\u0105\\u014B\\u010B\\u0113\\u013A\\u013A\\u0105\\u0163\\u012F\\u014F\\u014B \\u0175\\u0105\\u015F \\u0157\\u0113\\u0135\\u0113\\u010B\\u0163\\u0113\\u018C\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n# YMSG\ndialog.success.approve=[[[\\u013B\\u0113\\u0105\\u028B\\u0113 \\u0157\\u0113\\u01A3\\u0171\\u0113\\u015F\\u0163 \\u0175\\u0105\\u015F \\u0105\\u03C1\\u03C1\\u0157\\u014F\\u028B\\u0113\\u018C \\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n# YMSG\ndialog.success.reject=[[[\\u013B\\u0113\\u0105\\u028B\\u0113 \\u0157\\u0113\\u01A3\\u0171\\u0113\\u015F\\u0163 \\u0175\\u0105\\u015F \\u0157\\u0113\\u0135\\u0113\\u010B\\u0163\\u0113\\u018C\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n# YMSG\ndialog.leave.overlaps.disclaimer=[[[\\u013B\\u0113\\u0105\\u028B\\u0113 \\u014E\\u028B\\u0113\\u0157\\u013A\\u0105\\u03C1\\u015F \\u0192\\u014F\\u0157 {0} \\u0183\\u0113\\u0163\\u0175\\u0113\\u0113\\u014B {1} \\u0105\\u014B\\u018C {2}]]]\n\n# YMSG: link to Team calendar\nutil.Conversions.OverlapsPlLink=[[[\\u015C\\u0125\\u014F\\u0175 \\u0162\\u0113\\u0105\\u0271 \\u0108\\u0105\\u013A\\u0113\\u014B\\u018C\\u0105\\u0157\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n# XFLD: Status: Cancellation of a Leave Request requested \nview.Header.CancellationStatus=[[[\\u0108\\u0105\\u014B\\u010B\\u0113\\u013A\\u013A\\u0105\\u0163\\u012F\\u014F\\u014B \\u0158\\u0113\\u01A3\\u0171\\u0113\\u015F\\u0163\\u0113\\u018C\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n# XFLD: Status: Cancellation of a Leave Request requested \nview.List.CancellationStatus=[[[\\u0108\\u0105\\u014B\\u010B\\u0113\\u013A\\u013A\\u0113\\u018C\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n#XBUT: Button for Approve action\nXBUT_APPROVE=[[[\\u0100\\u03C1\\u03C1\\u0157\\u014F\\u028B\\u0113\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n#XBUT: Button for Reject action\nXBUT_REJECT=[[[\\u0158\\u0113\\u0135\\u0113\\u010B\\u0163\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n#XTIT: Title of the confirmation dialog while executing an action\nXTIT_APPROVAL=[[[\\u0100\\u03C1\\u03C1\\u0157\\u014F\\u028B\\u0113\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n#XTIT: Title of the confirmation dialog while executing an action\nXTIT_REJECT=[[[\\u0158\\u0113\\u0135\\u0113\\u010B\\u0163\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n# YMSG: Loading\nLOADING=[[[\\u013B\\u014F\\u0105\\u018C\\u012F\\u014B\\u011F...\\u2219\\u2219\\u2219\\u2219]]]\n\n# XTIT: Leave Request Details\nDETAIL_TITLE=[[[\\u013B\\u0113\\u0105\\u028B\\u0113 \\u0158\\u0113\\u01A3\\u0171\\u0113\\u015F\\u0163\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n# YMSG: No items are currently available\nNO_ITEMS_AVAILABLE=[[[\\u0143\\u014F \\u012F\\u0163\\u0113\\u0271\\u015F \\u0105\\u0157\\u0113 \\u010B\\u0171\\u0157\\u0157\\u0113\\u014B\\u0163\\u013A\\u0177 \\u0105\\u028B\\u0105\\u012F\\u013A\\u0105\\u0183\\u013A\\u0113\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n#XFLD: Label for Start Time\nALR_START_TIME=[[[\\u015C\\u0163\\u0105\\u0157\\u0163 \\u0162\\u012F\\u0271\\u0113\\u2219\\u2219\\u2219\\u2219]]]\n\n#XFLD: Label for Start Time\nALR_END_TIME=[[[\\u0114\\u0143\\u010E \\u0162\\u012F\\u0271\\u0113\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n',
	"hcm/approve/leaverequest/i18n/i18n_en_US_saptrc.properties":'\n# XFLD: number of absence days requested (e.g. two days)\nutil.Conversions.Days=r+mmpQynC4KBSPQ6TIQzIw_days\n\n# XFLD: number of absence days requested (singular)\nutil.Conversions.Day_Singular=6QKotL9VyZT+tLX4gMYEtQ_day\n\n# XFLD: number of absence hours requested (e.g. two hours)\nutil.Conversions.Hours=0Ot1dpEXqjqxZr8WsSnw3g_hours\n\n# XFLD: number of absence hours requested (e.g. one hour, Singular!)\nutil.Conversions.Hour_Singular=2G4v5LLBRbn9RmxoH9wiZA_hour\n\n# XFLD: number of absence days requested (e.g. two days)\nutil.Conversions.Value_Days=1jpIuMnf8H+mIIcm0hU60w_{0} days\n\n# XFLD: number of absence days requested (singular)\nutil.Conversions.Value_Day_Singular=0KC3zE2lvMGalywpWlJDjA_{0} day\n\n# XFLD: number of absence hours requested (e.g. two hours)\nutil.Conversions.Value_Hours=7Nn/NktEuhVNua+ZIwhHRg_{0} hours\n\n# XFLD: number of absence hours requested (e.g. one hour, Singular!)\nutil.Conversions.Value_Hour_Singular=B70XYmBYh1X5K2htX/IXkw_{0} hour\n\n# XFLD: Current Balance of the leave quote on Detail Screen\nview.AddInfo.CurrentBalance=i6vE/uG59gqRctuQUs0lAg_Available Balance\n\n# XFLD: Requested amount of the leave type on Detail Screen (e.g. Vacation Requested:  14 Days)\nview.AddInfo.Requested=KvxxQWljNZw/XLaM+4jsbQ_Requested\n\n# YMSG: information of existing overlaps of leave requests (e.g.  3 overlaps, Plural)\nutil.Conversions.OverlapsPl=XqTKJ4asBIhNvSpij+m5Sw_{0} Overlaps\n\n# YMSG: information of existing overlaps of leave requests (e.g. 1 overlap, Singular)\nutil.Conversions.OverlapSing=g1H4itScDNlgktjEheaI2Q_{0} Overlap\n\n# XFLD: Requested amount of the leave type on Confirm/Decline Popup (e.g. Request    14 days)\nview.Detail.Request=fdp0KYaMuqYs/RN58Otrww_Requested\n\n#XFLD: Label for Requested Time Duration\nview.Detail.FromTo=BAgOBZKkE+hAJGO7BFN9Ew_From-To\n\n# YMSG: Alert message that current balance of leave request may not be accurate.\nview.AddInfo.AlertMessageBalanceNotAccurate=fEK1vBVDesZ2pBvMI5b3ig_This person has recently submitted other leave requests. The balance may not be accurate.\n\n# XSEL: status of Leave Request: approved\nview.Calendar.LegendApproved=0Ahd75xBOii9TjNDkUCrjw_Approved Leave\n\n# XSEL: status of Leave Request: working day\nview.Calendar.LegendWorkingDay=cf4Za+4fB650iCrkwr8CZw_Workday\n\n# XSEL: status of Leave Request: Open Request\nview.Calendar.LegendPending=j4Wyvr7YBj4lYcpdnrceJA_Pending Approval\n\n# XSEL: status of Leave Request: Non-working day (e.g. weekend)\nview.Calendar.LegendDayOff=TUA3FeUXiBXQwBEDmbZByA_Non-Workday\n\n# XSEL: status of Leave Request: Public Holiday\nview.Calendar.LegendHoliday=YdB3FCi1zexd67Ez7wzMnw_Public Holiday\n\n# XSEL: status of Leave Request: Today\nview.Calendar.LegendToday=iXAUtsCjUWa2eHE7BhKQ6w_Today\n\n# XSEL: status of Leave Request:  other request types\nview.Calendar.LegendDeletionRequested=2agfRwtoZluLwV6bNiaK/w_Others\n\n# YMSG: Toast message that approval of leave request was successful\nview.Toast.YMSG_LRA_Approved=6+1MzBedKg7ZRsPVAwwudQ_Leave request was approved\n\n# YMSG: Toast message that reject of leave request was successful\nview.Toast.YMSG_LRA_Declined=ldU95j/W9QXbU3f8U+lsXA_Leave request was rejected\n\n# XTIT: Leave Request Details\nview.Detail.title=X5PviWGpS0at7+Fr1CI5Nw_Leave Request\n\n# XTIT: Leave Request Details - Calendar\nview.Calendar.title=M8/kaKAva04XfxHvI9/11w_Calendar\n\n# XTIT: Leave Type\nview.AddInfo.LeaveType=o23nX5dYMeBT6b4Stahxdw_Leave Type\n\n# XTIT: Total Deduction\nview.AddInfo.Deduction=SH4pYZL/t8r2+1h3bn7jKA_Total Deduction\n\n# XTIT: Personel Number\nview.Header.EmployeeID=xGZPAK31i9qVehQqN6tgbw_Employee ID {0}\n\n# XTIT: Header text of Master List\nview.Master.title=BEDf22eX9iWlt17htAqkgg_Leave Requests ({0})\n\n# XTIT: Application name (shown in browser header bar or as browser tab title)\napp.Identity=4dDIq/TgfJm92RWjeMGcjw_Approve Leave Requests\n\n\n# XTIT: Title of Email to Employee on Business Card\nview.BusinessCard.Employee.Subject=ol6o5tbX/Ufv+q103gp3Yw_Your Leave Request of Type {0}\n\n# XTIT: Shell title (shown within the UI as title of shell component, desktop only)\nshell.Identity=V+VHlMTyl0j+p11Nx2o8jg_Approve Leave Requests\n\n# YMSG\ndialog.question.approve=gZ/d+0eZC1ZPamsFEd48fA_Approve the leave request submitted by {0}?\n\n# YMSG\ndialog.question.reject=edVWv14H6dT5AmbEcGLjFg_Reject the leave request submitted by {0}?\n\n# YMSG\ndialog.question.approvecancel=cSSeQL1JNAzLgm4vxfIx5g_Approve the cancellation submitted by {0}?\n\n# YMSG\ndialog.question.rejectcancel=VMkjuC7pBpdrz1ZAglcN0w_Reject the cancellation submitted by {0}?\n\n# YMSG\ndialog.success.approvecancel=kfoPDWJHVC2RUugwk43WWg_Cancellation was approved \n\n# YMSG\ndialog.success.rejectcancel=H0iIF6g943ZjdM6KkNtcUA_Cancellation was rejected\n\n# YMSG\ndialog.success.approve=a313rlcTuKlXuwYtUCrbwQ_Leave request was approved \n\n# YMSG\ndialog.success.reject=Wav2YmnhTfz6mDmbrj2j8A_Leave request was rejected\n\n# YMSG\ndialog.leave.overlaps.disclaimer=uotYKWdUVAHTjx0WN97wlA_Leave Overlaps for {0} between {1} and {2}\n\n# YMSG: link to Team calendar\nutil.Conversions.OverlapsPlLink=FKePBQOH5ENWAKXD/Bf5tw_Show Team Calendar\n\n# XFLD: Status: Cancellation of a Leave Request requested \nview.Header.CancellationStatus=v7FAu+Cnzj4dFuv0pe6OSA_Cancellation Requested\n\n# XFLD: Status: Cancellation of a Leave Request requested \nview.List.CancellationStatus=FbaQqx1QoY5o1Lgk1V99HA_Cancelled\n\n#XBUT: Button for Approve action\nXBUT_APPROVE=4usF8HdIn2PBScp7orXfbg_Approve\n\n#XBUT: Button for Reject action\nXBUT_REJECT=gYQZsGMuq9q+VVQ5S9aW+A_Reject\n\n#XTIT: Title of the confirmation dialog while executing an action\nXTIT_APPROVAL=gPe6tvDVzVyWv5JLSifxxA_Approve\n\n#XTIT: Title of the confirmation dialog while executing an action\nXTIT_REJECT=xM/hwzXD6tamq25sCFMrPQ_Reject\n\n# YMSG: Loading\nLOADING=l6QEwv9ryBkSahs0J0knqQ_Loading...\n\n# XTIT: Leave Request Details\nDETAIL_TITLE=FRMC4D7yPQqXT7Y5aprHQQ_Leave Request\n\n# YMSG: No items are currently available\nNO_ITEMS_AVAILABLE=EhzRT1hBFP+YA26YGgxC5A_No items are currently available\n\n#XFLD: Label for Start Time\nALR_START_TIME=7K3aCb7suLRAN+hexZVsrA_Start Time\n\n#XFLD: Label for Start Time\nALR_END_TIME=MHZx2SScQoXslvJk9HigZw_END Time\n',
	"hcm/approve/leaverequest/i18n/i18n_es.properties":'\n# XFLD: number of absence days requested (e.g. two days)\nutil.Conversions.Days=D\\u00EDas\n\n# XFLD: number of absence days requested (singular)\nutil.Conversions.Day_Singular=D\\u00EDa\n\n# XFLD: number of absence hours requested (e.g. two hours)\nutil.Conversions.Hours=horas\n\n# XFLD: number of absence hours requested (e.g. one hour, Singular!)\nutil.Conversions.Hour_Singular=Hora\n\n# XFLD: number of absence days requested (e.g. two days)\nutil.Conversions.Value_Days={0} d\\u00EDas\n\n# XFLD: number of absence days requested (singular)\nutil.Conversions.Value_Day_Singular={0} d\\u00EDa\n\n# XFLD: number of absence hours requested (e.g. two hours)\nutil.Conversions.Value_Hours={0} horas\n\n# XFLD: number of absence hours requested (e.g. one hour, Singular!)\nutil.Conversions.Value_Hour_Singular={0} hora\n\n# XFLD: Current Balance of the leave quote on Detail Screen\nview.AddInfo.CurrentBalance=Saldo disponible\n\n# XFLD: Requested amount of the leave type on Detail Screen (e.g. Vacation Requested:  14 Days)\nview.AddInfo.Requested=Solicitados\n\n# YMSG: information of existing overlaps of leave requests (e.g.  3 overlaps, Plural)\nutil.Conversions.OverlapsPl={0} Solapamientos\n\n# YMSG: information of existing overlaps of leave requests (e.g. 1 overlap, Singular)\nutil.Conversions.OverlapSing={0} Solapamiento\n\n# XFLD: Requested amount of the leave type on Confirm/Decline Popup (e.g. Request    14 days)\nview.Detail.Request=Solicitados\n\n#XFLD: Label for Requested Time Duration\nview.Detail.FromTo=De - A\n\n# YMSG: Alert message that current balance of leave request may not be accurate.\nview.AddInfo.AlertMessageBalanceNotAccurate=Esta persona ha enviado recientemente otras solicitudes de ausencia. Puede que el saldo no sea exacto.\n\n# XSEL: status of Leave Request: approved\nview.Calendar.LegendApproved=Ausencia aprobada\n\n# XSEL: status of Leave Request: working day\nview.Calendar.LegendWorkingDay=D\\u00EDa laborable\n\n# XSEL: status of Leave Request: Open Request\nview.Calendar.LegendPending=Pendiente de aprobaci\\u00F3n\n\n# XSEL: status of Leave Request: Non-working day (e.g. weekend)\nview.Calendar.LegendDayOff=D\\u00EDa no laborable\n\n# XSEL: status of Leave Request: Public Holiday\nview.Calendar.LegendHoliday=D\\u00EDa festivo\n\n# XSEL: status of Leave Request: Today\nview.Calendar.LegendToday=Hoy\n\n# XSEL: status of Leave Request:  other request types\nview.Calendar.LegendDeletionRequested=Otros\n\n# YMSG: Toast message that approval of leave request was successful\nview.Toast.YMSG_LRA_Approved=Solicitud de ausencia aprobada\n\n# YMSG: Toast message that reject of leave request was successful\nview.Toast.YMSG_LRA_Declined=Solicitud de ausencia rechazada\n\n# XTIT: Leave Request Details\nview.Detail.title=Solicitud de ausencia\n\n# XTIT: Leave Request Details - Calendar\nview.Calendar.title=Calendario\n\n# XTIT: Leave Type\nview.AddInfo.LeaveType=Tipo de ausencia\n\n# XTIT: Total Deduction\nview.AddInfo.Deduction=Deducci\\u00F3n total\n\n# XTIT: Personel Number\nview.Header.EmployeeID=ID de empleado {0}\n\n# XTIT: Header text of Master List\nview.Master.title=Solicitudes de ausencia({0})\n\n# XTIT: Application name (shown in browser header bar or as browser tab title)\napp.Identity=Aprobaci\\u00F3n de solicitudes de ausencia\n\n\n# XTIT: Title of Email to Employee on Business Card\nview.BusinessCard.Employee.Subject=Su solicitud para ausentarse\\: {0}\n\n# XTIT: Shell title (shown within the UI as title of shell component, desktop only)\nshell.Identity=Aprobaci\\u00F3n de solicitudes de ausencia\n\n# YMSG\ndialog.question.approve=\\u00BFAprobar la solicitud de ausencia enviada por {0}?\n\n# YMSG\ndialog.question.reject=\\u00BFRechazar la solicitud de ausencia enviada por {0}?\n\n# YMSG\ndialog.question.approvecancel=\\u00BFAprobar la cancelaci\\u00F3n enviada por {0}?\n\n# YMSG\ndialog.question.rejectcancel=\\u00BFRechazar la cancelaci\\u00F3n enviada por {0}?\n\n# YMSG\ndialog.success.approvecancel=Cancelaci\\u00F3n aprobada\n\n# YMSG\ndialog.success.rejectcancel=Cancelaci\\u00F3n rechazada\n\n# YMSG\ndialog.success.approve=Solicitud de ausencia aprobada\n\n# YMSG\ndialog.success.reject=Solicitud de ausencia rechazada\n\n# YMSG\ndialog.leave.overlaps.disclaimer=Deja solapamientos de {0} entre {1} y {2}\n\n# YMSG: link to Team calendar\nutil.Conversions.OverlapsPlLink=Mostrar calendario de equipo\n\n# XFLD: Status: Cancellation of a Leave Request requested \nview.Header.CancellationStatus=Cancelaci\\u00F3n solicitada\n\n# XFLD: Status: Cancellation of a Leave Request requested \nview.List.CancellationStatus=Cancelados\n\n#XBUT: Button for Approve action\nXBUT_APPROVE=Autorizar\n\n#XBUT: Button for Reject action\nXBUT_REJECT=Rechazar\n\n#XTIT: Title of the confirmation dialog while executing an action\nXTIT_APPROVAL=Autorizar\n\n#XTIT: Title of the confirmation dialog while executing an action\nXTIT_REJECT=Rechazar\n\n# YMSG: Loading\nLOADING=Cargando...\n\n# XTIT: Leave Request Details\nDETAIL_TITLE=Solicitud de ausencia\n\n# YMSG: No items are currently available\nNO_ITEMS_AVAILABLE=No hay posiciones disponibles\n\n#XFLD: Label for Start Time\nALR_START_TIME=Hora de inicio\n\n#XFLD: Label for Start Time\nALR_END_TIME=Hora de fin\n',
	"hcm/approve/leaverequest/i18n/i18n_fr.properties":'\n# XFLD: number of absence days requested (e.g. two days)\nutil.Conversions.Days=Jours\n\n# XFLD: number of absence days requested (singular)\nutil.Conversions.Day_Singular=Jour\n\n# XFLD: number of absence hours requested (e.g. two hours)\nutil.Conversions.Hours=Heures\n\n# XFLD: number of absence hours requested (e.g. one hour, Singular!)\nutil.Conversions.Hour_Singular=Heure\n\n# XFLD: number of absence days requested (e.g. two days)\nutil.Conversions.Value_Days={0} jours\n\n# XFLD: number of absence days requested (singular)\nutil.Conversions.Value_Day_Singular={0} jour\n\n# XFLD: number of absence hours requested (e.g. two hours)\nutil.Conversions.Value_Hours={0} heures\n\n# XFLD: number of absence hours requested (e.g. one hour, Singular!)\nutil.Conversions.Value_Hour_Singular={0} heure\n\n# XFLD: Current Balance of the leave quote on Detail Screen\nview.AddInfo.CurrentBalance=Solde disponible\n\n# XFLD: Requested amount of the leave type on Detail Screen (e.g. Vacation Requested:  14 Days)\nview.AddInfo.Requested=Demand\\u00E9\n\n# YMSG: information of existing overlaps of leave requests (e.g.  3 overlaps, Plural)\nutil.Conversions.OverlapsPl={0} chevauchements\n\n# YMSG: information of existing overlaps of leave requests (e.g. 1 overlap, Singular)\nutil.Conversions.OverlapSing={0} chevauchement\n\n# XFLD: Requested amount of the leave type on Confirm/Decline Popup (e.g. Request    14 days)\nview.Detail.Request=Demand\\u00E9\n\n#XFLD: Label for Requested Time Duration\nview.Detail.FromTo=De - \\u00C0\n\n# YMSG: Alert message that current balance of leave request may not be accurate.\nview.AddInfo.AlertMessageBalanceNotAccurate=Cette personne a envoy\\u00E9 d\'autres demandes de cong\\u00E9 r\\u00E9cemment. Le solde n\'est peut-\\u00EAtre pas correct.\n\n# XSEL: status of Leave Request: approved\nview.Calendar.LegendApproved=Cong\\u00E9 approuv\\u00E9\n\n# XSEL: status of Leave Request: working day\nview.Calendar.LegendWorkingDay=Jour ouvr\\u00E9\n\n# XSEL: status of Leave Request: Open Request\nview.Calendar.LegendPending=Approbation en attente\n\n# XSEL: status of Leave Request: Non-working day (e.g. weekend)\nview.Calendar.LegendDayOff=Jour non ouvrable\n\n# XSEL: status of Leave Request: Public Holiday\nview.Calendar.LegendHoliday=Jour f\\u00E9ri\\u00E9\n\n# XSEL: status of Leave Request: Today\nview.Calendar.LegendToday=Aujourd\'hui\n\n# XSEL: status of Leave Request:  other request types\nview.Calendar.LegendDeletionRequested=Autres\n\n# YMSG: Toast message that approval of leave request was successful\nview.Toast.YMSG_LRA_Approved=Demande de cong\\u00E9 approuv\\u00E9e\n\n# YMSG: Toast message that reject of leave request was successful\nview.Toast.YMSG_LRA_Declined=Demande de cong\\u00E9 refus\\u00E9e\n\n# XTIT: Leave Request Details\nview.Detail.title=Demande de cong\\u00E9\n\n# XTIT: Leave Request Details - Calendar\nview.Calendar.title=Calendrier\n\n# XTIT: Leave Type\nview.AddInfo.LeaveType=Type de cong\\u00E9\n\n# XTIT: Total Deduction\nview.AddInfo.Deduction=D\\u00E9compte - total\n\n# XTIT: Personel Number\nview.Header.EmployeeID=Matricule {0}\n\n# XTIT: Header text of Master List\nview.Master.title=Demandes de cong\\u00E9s ({0})\n\n# XTIT: Application name (shown in browser header bar or as browser tab title)\napp.Identity=Approbation de demandes de cong\\u00E9s\n\n\n# XTIT: Title of Email to Employee on Business Card\nview.BusinessCard.Employee.Subject=Votre demande de cong\\u00E9\\u00A0\\: {0}\n\n# XTIT: Shell title (shown within the UI as title of shell component, desktop only)\nshell.Identity=Approbation de demandes de cong\\u00E9s\n\n# YMSG\ndialog.question.approve=Approuver la demande de cong\\u00E9 envoy\\u00E9e par {0}\\u00A0?\n\n# YMSG\ndialog.question.reject=Refuser la demande de cong\\u00E9 envoy\\u00E9e par {0}\\u00A0?\n\n# YMSG\ndialog.question.approvecancel=Approuver l\'\'annulation envoy\\u00E9e par {0}\\u00A0?\n\n# YMSG\ndialog.question.rejectcancel=Refuser l\'\'annulation envoy\\u00E9e par {0}\\u00A0?\n\n# YMSG\ndialog.success.approvecancel=Annulation approuv\\u00E9e\n\n# YMSG\ndialog.success.rejectcancel=Annulation refus\\u00E9e\n\n# YMSG\ndialog.success.approve=Demande de cong\\u00E9 approuv\\u00E9e\n\n# YMSG\ndialog.success.reject=Demande de cong\\u00E9 refus\\u00E9e\n\n# YMSG\ndialog.leave.overlaps.disclaimer=Laisser les chevauchements pour {0} entre {1} et {2}\n\n# YMSG: link to Team calendar\nutil.Conversions.OverlapsPlLink=Afficher calendrier de l\'\\u00E9quipe\n\n# XFLD: Status: Cancellation of a Leave Request requested \nview.Header.CancellationStatus=Annulation demand\\u00E9e\n\n# XFLD: Status: Cancellation of a Leave Request requested \nview.List.CancellationStatus=Interrompu\n\n#XBUT: Button for Approve action\nXBUT_APPROVE=Approuver\n\n#XBUT: Button for Reject action\nXBUT_REJECT=Refuser\n\n#XTIT: Title of the confirmation dialog while executing an action\nXTIT_APPROVAL=Approuver\n\n#XTIT: Title of the confirmation dialog while executing an action\nXTIT_REJECT=Refuser\n\n# YMSG: Loading\nLOADING=Chargement...\n\n# XTIT: Leave Request Details\nDETAIL_TITLE=Demande de cong\\u00E9\n\n# YMSG: No items are currently available\nNO_ITEMS_AVAILABLE=Aucun \\u00E9l\\u00E9ment disponible\n\n#XFLD: Label for Start Time\nALR_START_TIME=Heure de d\\u00E9but\n\n#XFLD: Label for Start Time\nALR_END_TIME=Heure de fin\n',
	"hcm/approve/leaverequest/i18n/i18n_hr.properties":'\n# XFLD: number of absence days requested (e.g. two days)\nutil.Conversions.Days=Dani\n\n# XFLD: number of absence days requested (singular)\nutil.Conversions.Day_Singular=Dan\n\n# XFLD: number of absence hours requested (e.g. two hours)\nutil.Conversions.Hours=Sati\n\n# XFLD: number of absence hours requested (e.g. one hour, Singular!)\nutil.Conversions.Hour_Singular=Sat\n\n# XFLD: number of absence days requested (e.g. two days)\nutil.Conversions.Value_Days={0} dana\n\n# XFLD: number of absence days requested (singular)\nutil.Conversions.Value_Day_Singular={0} dan\n\n# XFLD: number of absence hours requested (e.g. two hours)\nutil.Conversions.Value_Hours={0} sati\n\n# XFLD: number of absence hours requested (e.g. one hour, Singular!)\nutil.Conversions.Value_Hour_Singular={0} sat\n\n# XFLD: Current Balance of the leave quote on Detail Screen\nview.AddInfo.CurrentBalance=Raspolo\\u017Eivo stanje\n\n# XFLD: Requested amount of the leave type on Detail Screen (e.g. Vacation Requested:  14 Days)\nview.AddInfo.Requested=Zatra\\u017Eeno\n\n# YMSG: information of existing overlaps of leave requests (e.g.  3 overlaps, Plural)\nutil.Conversions.OverlapsPl={0} Preklapanja\n\n# YMSG: information of existing overlaps of leave requests (e.g. 1 overlap, Singular)\nutil.Conversions.OverlapSing={0} Preklapanje\n\n# XFLD: Requested amount of the leave type on Confirm/Decline Popup (e.g. Request    14 days)\nview.Detail.Request=Zatra\\u017Eeno\n\n#XFLD: Label for Requested Time Duration\nview.Detail.FromTo=Od - do\n\n# YMSG: Alert message that current balance of leave request may not be accurate.\nview.AddInfo.AlertMessageBalanceNotAccurate=Ova osoba nedavno je podnijela druge zahtjeve za dopust; stanje mo\\u017Ee biti neto\\u010Dno\n\n# XSEL: status of Leave Request: approved\nview.Calendar.LegendApproved=Odobreni dopust\n\n# XSEL: status of Leave Request: working day\nview.Calendar.LegendWorkingDay=Radni dan\n\n# XSEL: status of Leave Request: Open Request\nview.Calendar.LegendPending=Predstoje\\u0107e odobrenje\n\n# XSEL: status of Leave Request: Non-working day (e.g. weekend)\nview.Calendar.LegendDayOff=Neradni dan\n\n# XSEL: status of Leave Request: Public Holiday\nview.Calendar.LegendHoliday=Dr\\u017Eavni praznik\n\n# XSEL: status of Leave Request: Today\nview.Calendar.LegendToday=Danas\n\n# XSEL: status of Leave Request:  other request types\nview.Calendar.LegendDeletionRequested=Ostali\n\n# YMSG: Toast message that approval of leave request was successful\nview.Toast.YMSG_LRA_Approved=Zahtjev za dopust odobren\n\n# YMSG: Toast message that reject of leave request was successful\nview.Toast.YMSG_LRA_Declined=Zahtjev za dopust odbijen\n\n# XTIT: Leave Request Details\nview.Detail.title=Zahtjev za dopust\n\n# XTIT: Leave Request Details - Calendar\nview.Calendar.title=Kalendar\n\n# XTIT: Leave Type\nview.AddInfo.LeaveType=Tip dopusta\n\n# XTIT: Total Deduction\nview.AddInfo.Deduction=Ukupni odbitak\n\n# XTIT: Personel Number\nview.Header.EmployeeID=ID zaposlenika {0}\n\n# XTIT: Header text of Master List\nview.Master.title=Zahtjevi za dopust ({0})\n\n# XTIT: Application name (shown in browser header bar or as browser tab title)\napp.Identity=Odobri zahtjeve za dopust\n\n\n# XTIT: Title of Email to Employee on Business Card\nview.BusinessCard.Employee.Subject=Va\\u0161 zahtjev za dopust\\: {0}\n\n# XTIT: Shell title (shown within the UI as title of shell component, desktop only)\nshell.Identity=Odobri zahtjeve za dopust\n\n# YMSG\ndialog.question.approve=Odobriti zahtjev za dopust koji podnosi {0}?\n\n# YMSG\ndialog.question.reject=Odbiti zahtjev za dopust koji podnosi {0}?\n\n# YMSG\ndialog.question.approvecancel=Odobriti otkazivanje koje podnosi {0}?\n\n# YMSG\ndialog.question.rejectcancel=Odbiti otkazivanje koje podnosi {0}?\n\n# YMSG\ndialog.success.approvecancel=Otkazivanje odobreno\n\n# YMSG\ndialog.success.rejectcancel=Otkazivanje odbijeno\n\n# YMSG\ndialog.success.approve=Zahtjev za dopust odobren\n\n# YMSG\ndialog.success.reject=Zahtjev za dopust odbijen\n\n# YMSG\ndialog.leave.overlaps.disclaimer=Dopust se preklapa za {0} izme\\u0111u {1} i {2}\n\n# YMSG: link to Team calendar\nutil.Conversions.OverlapsPlLink=Poka\\u017Ei kalendar tima\n\n# XFLD: Status: Cancellation of a Leave Request requested \nview.Header.CancellationStatus=Otkazivanje zatra\\u017Eeno\n\n# XFLD: Status: Cancellation of a Leave Request requested \nview.List.CancellationStatus=Otkazano\n\n#XBUT: Button for Approve action\nXBUT_APPROVE=Odobri\n\n#XBUT: Button for Reject action\nXBUT_REJECT=Odbij\n\n#XTIT: Title of the confirmation dialog while executing an action\nXTIT_APPROVAL=Odobri\n\n#XTIT: Title of the confirmation dialog while executing an action\nXTIT_REJECT=Odbij\n\n# YMSG: Loading\nLOADING=U\\u010Ditavanje...\n\n# XTIT: Leave Request Details\nDETAIL_TITLE=Zahtjev za dopust\n\n# YMSG: No items are currently available\nNO_ITEMS_AVAILABLE=Stavke nisu raspolo\\u017Eive\n\n#XFLD: Label for Start Time\nALR_START_TIME=Po\\u010Detno vrijeme\n\n#XFLD: Label for Start Time\nALR_END_TIME=Zavr\\u0161no vrijeme\n',
	"hcm/approve/leaverequest/i18n/i18n_hu.properties":'\n# XFLD: number of absence days requested (e.g. two days)\nutil.Conversions.Days=nap\n\n# XFLD: number of absence days requested (singular)\nutil.Conversions.Day_Singular=Nap\n\n# XFLD: number of absence hours requested (e.g. two hours)\nutil.Conversions.Hours=\\u00F3ra\n\n# XFLD: number of absence hours requested (e.g. one hour, Singular!)\nutil.Conversions.Hour_Singular=\\u00D3ra\n\n# XFLD: number of absence days requested (e.g. two days)\nutil.Conversions.Value_Days={0} nap\n\n# XFLD: number of absence days requested (singular)\nutil.Conversions.Value_Day_Singular={0} nap\n\n# XFLD: number of absence hours requested (e.g. two hours)\nutil.Conversions.Value_Hours={0} \\u00F3ra\n\n# XFLD: number of absence hours requested (e.g. one hour, Singular!)\nutil.Conversions.Value_Hour_Singular={0} \\u00F3ra\n\n# XFLD: Current Balance of the leave quote on Detail Screen\nview.AddInfo.CurrentBalance=Rendelkez\\u00E9sre \\u00E1ll\\u00F3\n\n# XFLD: Requested amount of the leave type on Detail Screen (e.g. Vacation Requested:  14 Days)\nview.AddInfo.Requested=Ig\\u00E9nyelt\n\n# YMSG: information of existing overlaps of leave requests (e.g.  3 overlaps, Plural)\nutil.Conversions.OverlapsPl={0} \\u00E1tfed\\u00E9s\n\n# YMSG: information of existing overlaps of leave requests (e.g. 1 overlap, Singular)\nutil.Conversions.OverlapSing={0} \\u00E1tfed\\u00E9s\n\n# XFLD: Requested amount of the leave type on Confirm/Decline Popup (e.g. Request    14 days)\nview.Detail.Request=Ig\\u00E9nyelt\n\n#XFLD: Label for Requested Time Duration\nview.Detail.FromTo=Kezdete - v\\u00E9ge\n\n# YMSG: Alert message that current balance of leave request may not be accurate.\nview.AddInfo.AlertMessageBalanceNotAccurate=Ez a szem\\u00E9ly nemr\\u00E9g m\\u00E1s t\\u00E1voll\\u00E9tk\\u00E9relmeket is k\\u00FCld\\u00F6tt. Lehet, hogy az egyenleg nem pontos.\n\n# XSEL: status of Leave Request: approved\nview.Calendar.LegendApproved=Enged\\u00E9lyezett t\\u00E1voll\\u00E9t\n\n# XSEL: status of Leave Request: working day\nview.Calendar.LegendWorkingDay=Munkanap\n\n# XSEL: status of Leave Request: Open Request\nview.Calendar.LegendPending=F\\u00FCgg\\u0151ben l\\u00E9v\\u0151 enged\\u00E9lyez\\u00E9s\n\n# XSEL: status of Leave Request: Non-working day (e.g. weekend)\nview.Calendar.LegendDayOff=Nem munkanap\n\n# XSEL: status of Leave Request: Public Holiday\nview.Calendar.LegendHoliday=\\u00DCnnepnap\n\n# XSEL: status of Leave Request: Today\nview.Calendar.LegendToday=Ma\n\n# XSEL: status of Leave Request:  other request types\nview.Calendar.LegendDeletionRequested=Egyebek\n\n# YMSG: Toast message that approval of leave request was successful\nview.Toast.YMSG_LRA_Approved=T\\u00E1voll\\u00E9tk\\u00E9relem enged\\u00E9lyezve\n\n# YMSG: Toast message that reject of leave request was successful\nview.Toast.YMSG_LRA_Declined=T\\u00E1voll\\u00E9tk\\u00E9relem elutas\\u00EDtva\n\n# XTIT: Leave Request Details\nview.Detail.title=T\\u00E1voll\\u00E9tk\\u00E9relem\n\n# XTIT: Leave Request Details - Calendar\nview.Calendar.title=Napt\\u00E1r\n\n# XTIT: Leave Type\nview.AddInfo.LeaveType=T\\u00E1voll\\u00E9tfajta\n\n# XTIT: Total Deduction\nview.AddInfo.Deduction=\\u00D6sszes levon\\u00E1s\n\n# XTIT: Personel Number\nview.Header.EmployeeID=Dolgoz\\u00F3 azonos\\u00EDt\\u00F3ja\\: {0}\n\n# XTIT: Header text of Master List\nview.Master.title=T\\u00E1voll\\u00E9tk\\u00E9relmek ({0})\n\n# XTIT: Application name (shown in browser header bar or as browser tab title)\napp.Identity=T\\u00E1voll\\u00E9tk\\u00E9relmek enged\\u00E9lyez\\u00E9se\n\n\n# XTIT: Title of Email to Employee on Business Card\nview.BusinessCard.Employee.Subject=Az \\u00D6n t\\u00E1voll\\u00E9ti k\\u00E9relme\\: {0}\n\n# XTIT: Shell title (shown within the UI as title of shell component, desktop only)\nshell.Identity=T\\u00E1voll\\u00E9tk\\u00E9relmek enged\\u00E9lyez\\u00E9se\n\n# YMSG\ndialog.question.approve=Enged\\u00E9lyezi a k\\u00F6vetkez\\u0151 \\u00E1ltal bek\\u00FCld\\u00F6tt t\\u00E1voll\\u00E9tk\\u00E9relmet\\: {0}?\n\n# YMSG\ndialog.question.reject=Elutas\\u00EDtja a k\\u00F6vetkez\\u0151 \\u00E1ltal bek\\u00FCld\\u00F6tt t\\u00E1voll\\u00E9tk\\u00E9relmet\\: {0}?\n\n# YMSG\ndialog.question.approvecancel=Enged\\u00E9lyezi a k\\u00F6vetkez\\u0151 \\u00E1ltal bek\\u00FCld\\u00F6tt visszavon\\u00E1st\\: {0}?\n\n# YMSG\ndialog.question.rejectcancel=Elutas\\u00EDtja a k\\u00F6vetkez\\u0151 \\u00E1ltal bek\\u00FCld\\u00F6tt visszavon\\u00E1st\\: {0}?\n\n# YMSG\ndialog.success.approvecancel=Visszavon\\u00E1s enged\\u00E9lyezve\n\n# YMSG\ndialog.success.rejectcancel=Visszavon\\u00E1s elutas\\u00EDtva\n\n# YMSG\ndialog.success.approve=T\\u00E1voll\\u00E9tk\\u00E9relem enged\\u00E9lyezve\n\n# YMSG\ndialog.success.reject=T\\u00E1voll\\u00E9tk\\u00E9relem elutas\\u00EDtva\n\n# YMSG\ndialog.leave.overlaps.disclaimer=Hagyjon \\u00E1tfed\\u00E9st {0} , {1} \\u00E9s {2} k\\u00F6z\\u00F6tt.\n\n# YMSG: link to Team calendar\nutil.Conversions.OverlapsPlLink=Csoportnapt\\u00E1r megjelen\\u00EDt\\u00E9se\n\n# XFLD: Status: Cancellation of a Leave Request requested \nview.Header.CancellationStatus=Visszavon\\u00E1st k\\u00E9rt\n\n# XFLD: Status: Cancellation of a Leave Request requested \nview.List.CancellationStatus=Visszavonva\n\n#XBUT: Button for Approve action\nXBUT_APPROVE=J\\u00F3v\\u00E1hagy\\u00E1s\n\n#XBUT: Button for Reject action\nXBUT_REJECT=Elutas\\u00EDt\\u00E1s\n\n#XTIT: Title of the confirmation dialog while executing an action\nXTIT_APPROVAL=J\\u00F3v\\u00E1hagy\\u00E1s\n\n#XTIT: Title of the confirmation dialog while executing an action\nXTIT_REJECT=Elutas\\u00EDt\\u00E1s\n\n# YMSG: Loading\nLOADING=Bet\\u00F6lt\\u00E9s...\n\n# XTIT: Leave Request Details\nDETAIL_TITLE=T\\u00E1voll\\u00E9tk\\u00E9relem\n\n# YMSG: No items are currently available\nNO_ITEMS_AVAILABLE=Nincsenek rendelkez\\u00E9sre \\u00E1ll\\u00F3 t\\u00E9telek\n\n#XFLD: Label for Start Time\nALR_START_TIME=Kezd\\u00E9s id\\u0151pontja\n\n#XFLD: Label for Start Time\nALR_END_TIME=Befejez\\u00E9s id\\u0151pontja\n',
	"hcm/approve/leaverequest/i18n/i18n_it.properties":'\n# XFLD: number of absence days requested (e.g. two days)\nutil.Conversions.Days=Giorni\n\n# XFLD: number of absence days requested (singular)\nutil.Conversions.Day_Singular=Giorno\n\n# XFLD: number of absence hours requested (e.g. two hours)\nutil.Conversions.Hours=Ore\n\n# XFLD: number of absence hours requested (e.g. one hour, Singular!)\nutil.Conversions.Hour_Singular=Ora\n\n# XFLD: number of absence days requested (e.g. two days)\nutil.Conversions.Value_Days={0} giorni\n\n# XFLD: number of absence days requested (singular)\nutil.Conversions.Value_Day_Singular={0} giorno\n\n# XFLD: number of absence hours requested (e.g. two hours)\nutil.Conversions.Value_Hours={0} ore\n\n# XFLD: number of absence hours requested (e.g. one hour, Singular!)\nutil.Conversions.Value_Hour_Singular={0} ora\n\n# XFLD: Current Balance of the leave quote on Detail Screen\nview.AddInfo.CurrentBalance=Saldo disponibile\n\n# XFLD: Requested amount of the leave type on Detail Screen (e.g. Vacation Requested:  14 Days)\nview.AddInfo.Requested=Richiesto\n\n# YMSG: information of existing overlaps of leave requests (e.g.  3 overlaps, Plural)\nutil.Conversions.OverlapsPl={0} sovrapposizioni\n\n# YMSG: information of existing overlaps of leave requests (e.g. 1 overlap, Singular)\nutil.Conversions.OverlapSing={0} sovrapposizione\n\n# XFLD: Requested amount of the leave type on Confirm/Decline Popup (e.g. Request    14 days)\nview.Detail.Request=Richiesto\n\n#XFLD: Label for Requested Time Duration\nview.Detail.FromTo=Da - A\n\n# YMSG: Alert message that current balance of leave request may not be accurate.\nview.AddInfo.AlertMessageBalanceNotAccurate=Questa persona ha inviato recentemente altre richieste di ferie; il saldo potrebbe non essere esatto\n\n# XSEL: status of Leave Request: approved\nview.Calendar.LegendApproved=Ferie approvate\n\n# XSEL: status of Leave Request: working day\nview.Calendar.LegendWorkingDay=Giorno lavorativo\n\n# XSEL: status of Leave Request: Open Request\nview.Calendar.LegendPending=In attesa di approvazione\n\n# XSEL: status of Leave Request: Non-working day (e.g. weekend)\nview.Calendar.LegendDayOff=Giorno non lavorativo\n\n# XSEL: status of Leave Request: Public Holiday\nview.Calendar.LegendHoliday=Giorno festivo\n\n# XSEL: status of Leave Request: Today\nview.Calendar.LegendToday=Oggi\n\n# XSEL: status of Leave Request:  other request types\nview.Calendar.LegendDeletionRequested=Altri\n\n# YMSG: Toast message that approval of leave request was successful\nview.Toast.YMSG_LRA_Approved=Richiesta di ferie approvata\n\n# YMSG: Toast message that reject of leave request was successful\nview.Toast.YMSG_LRA_Declined=Richiesta di ferie rifiutata\n\n# XTIT: Leave Request Details\nview.Detail.title=Richiesta di ferie\n\n# XTIT: Leave Request Details - Calendar\nview.Calendar.title=Calendario\n\n# XTIT: Leave Type\nview.AddInfo.LeaveType=Tipo di ferie\n\n# XTIT: Total Deduction\nview.AddInfo.Deduction=Riduzione totale\n\n# XTIT: Personel Number\nview.Header.EmployeeID=ID dipendente {0}\n\n# XTIT: Header text of Master List\nview.Master.title=Richieste di ferie ({0})\n\n# XTIT: Application name (shown in browser header bar or as browser tab title)\napp.Identity=Approva richieste di ferie\n\n\n# XTIT: Title of Email to Employee on Business Card\nview.BusinessCard.Employee.Subject=La tua richiesta di ferie\\: {0}\n\n# XTIT: Shell title (shown within the UI as title of shell component, desktop only)\nshell.Identity=Approva richieste di ferie\n\n# YMSG\ndialog.question.approve=Approvare la richiesta di ferie inviata da {0}?\n\n# YMSG\ndialog.question.reject=Rifiutare la richiesta di ferie inviata da {0}?\n\n# YMSG\ndialog.question.approvecancel=Approvare l\'\'annullamento inviato da {0}?\n\n# YMSG\ndialog.question.rejectcancel=Rifiutare l\'\'annullamento inviato da {0}?\n\n# YMSG\ndialog.success.approvecancel=Annullamento approvato\n\n# YMSG\ndialog.success.rejectcancel=Annullamento rifiutato\n\n# YMSG\ndialog.success.approve=Richiesta di ferie approvata\n\n# YMSG\ndialog.success.reject=Richiesta di ferie rifiutata\n\n# YMSG\ndialog.leave.overlaps.disclaimer=Sovvrapposizione ferie per {0} tra {1} e {2}\n\n# YMSG: link to Team calendar\nutil.Conversions.OverlapsPlLink=Visualizza calendario del team\n\n# XFLD: Status: Cancellation of a Leave Request requested \nview.Header.CancellationStatus=Annullamento richiesto\n\n# XFLD: Status: Cancellation of a Leave Request requested \nview.List.CancellationStatus=Cancellato\n\n#XBUT: Button for Approve action\nXBUT_APPROVE=Approva\n\n#XBUT: Button for Reject action\nXBUT_REJECT=Rifiuta\n\n#XTIT: Title of the confirmation dialog while executing an action\nXTIT_APPROVAL=Approva\n\n#XTIT: Title of the confirmation dialog while executing an action\nXTIT_REJECT=Rifiuta\n\n# YMSG: Loading\nLOADING=In caricamento ...\n\n# XTIT: Leave Request Details\nDETAIL_TITLE=Richiesta di ferie\n\n# YMSG: No items are currently available\nNO_ITEMS_AVAILABLE=Nessuna posizione disponibile\n\n#XFLD: Label for Start Time\nALR_START_TIME=Ora di inizio\n\n#XFLD: Label for Start Time\nALR_END_TIME=Ora di fine\n',
	"hcm/approve/leaverequest/i18n/i18n_iw.properties":'\n# XFLD: number of absence days requested (e.g. two days)\nutil.Conversions.Days=\\u05D9\\u05DE\\u05D9\\u05DD\n\n# XFLD: number of absence days requested (singular)\nutil.Conversions.Day_Singular=\\u05D9\\u05D5\\u05DD\n\n# XFLD: number of absence hours requested (e.g. two hours)\nutil.Conversions.Hours=\\u05E9\\u05E2\\u05D5\\u05EA\n\n# XFLD: number of absence hours requested (e.g. one hour, Singular!)\nutil.Conversions.Hour_Singular=\\u05E9\\u05E2\\u05D4\n\n# XFLD: number of absence days requested (e.g. two days)\nutil.Conversions.Value_Days={0} \\u05D9\\u05DE\\u05D9\\u05DD\n\n# XFLD: number of absence days requested (singular)\nutil.Conversions.Value_Day_Singular={0} \\u05D9\\u05D5\\u05DD\n\n# XFLD: number of absence hours requested (e.g. two hours)\nutil.Conversions.Value_Hours={0} \\u05E9\\u05E2\\u05D5\\u05EA\n\n# XFLD: number of absence hours requested (e.g. one hour, Singular!)\nutil.Conversions.Value_Hour_Singular={0} \\u05E9\\u05E2\\u05D4\n\n# XFLD: Current Balance of the leave quote on Detail Screen\nview.AddInfo.CurrentBalance=\\u05D9\\u05EA\\u05E8\\u05D4 \\u05D6\\u05DE\\u05D9\\u05E0\\u05D4\n\n# XFLD: Requested amount of the leave type on Detail Screen (e.g. Vacation Requested:  14 Days)\nview.AddInfo.Requested=\\u05DE\\u05D1\\u05D5\\u05E7\\u05E9\n\n# YMSG: information of existing overlaps of leave requests (e.g.  3 overlaps, Plural)\nutil.Conversions.OverlapsPl={0} \\u05D7\\u05E4\\u05D9\\u05E4\\u05D5\\u05EA\n\n# YMSG: information of existing overlaps of leave requests (e.g. 1 overlap, Singular)\nutil.Conversions.OverlapSing={0} \\u05D7\\u05E4\\u05D9\\u05E4\\u05D4\n\n# XFLD: Requested amount of the leave type on Confirm/Decline Popup (e.g. Request    14 days)\nview.Detail.Request=\\u05DE\\u05D1\\u05D5\\u05E7\\u05E9\n\n#XFLD: Label for Requested Time Duration\nview.Detail.FromTo=\\u05DE\\u05EA\\u05D0\\u05E8\\u05D9\\u05DA - \\u05E2\\u05D3 \\u05EA\\u05D0\\u05E8\\u05D9\\u05DA\n\n# YMSG: Alert message that current balance of leave request may not be accurate.\nview.AddInfo.AlertMessageBalanceNotAccurate=\\u05E2\\u05D5\\u05D1\\u05D3 \\u05D6\\u05D4 \\u05D4\\u05D2\\u05D9\\u05E9 \\u05DC\\u05D0\\u05D7\\u05E8\\u05D5\\u05E0\\u05D4 \\u05D1\\u05E7\\u05E9\\u05D5\\u05EA \\u05D7\\u05D5\\u05E4\\u05E9\\u05D4 \\u05D0\\u05D7\\u05E8\\u05D5\\u05EA; \\u05D9\\u05D9\\u05EA\\u05DB\\u05DF \\u05D5\\u05D4\\u05D9\\u05EA\\u05E8\\u05D4 \\u05DC\\u05D0 \\u05EA\\u05D4\\u05D9\\u05D4 \\u05DE\\u05D3\\u05D5\\u05D9\\u05E7\\u05EA\n\n# XSEL: status of Leave Request: approved\nview.Calendar.LegendApproved=\\u05D7\\u05D5\\u05E4\\u05E9\\u05D4 \\u05DE\\u05D0\\u05D5\\u05E9\\u05E8\\u05EA\n\n# XSEL: status of Leave Request: working day\nview.Calendar.LegendWorkingDay=\\u05D9\\u05D5\\u05DD \\u05E2\\u05D1\\u05D5\\u05D3\\u05D4\n\n# XSEL: status of Leave Request: Open Request\nview.Calendar.LegendPending=\\u05DE\\u05DE\\u05EA\\u05D9\\u05DF \\u05DC\\u05D0\\u05D9\\u05E9\\u05D5\\u05E8\n\n# XSEL: status of Leave Request: Non-working day (e.g. weekend)\nview.Calendar.LegendDayOff=\\u05DC\\u05D0 \\u05D9\\u05D5\\u05DD \\u05E2\\u05D1\\u05D5\\u05D3\\u05D4\n\n# XSEL: status of Leave Request: Public Holiday\nview.Calendar.LegendHoliday=\\u05D7\\u05D2 \\u05E8\\u05E9\\u05DE\\u05D9\n\n# XSEL: status of Leave Request: Today\nview.Calendar.LegendToday=\\u05D4\\u05D9\\u05D5\\u05DD\n\n# XSEL: status of Leave Request:  other request types\nview.Calendar.LegendDeletionRequested=\\u05D0\\u05D7\\u05E8\\u05D9\\u05DD\n\n# YMSG: Toast message that approval of leave request was successful\nview.Toast.YMSG_LRA_Approved=\\u05D1\\u05E7\\u05E9\\u05EA \\u05D4\\u05D7\\u05D5\\u05E4\\u05E9\\u05D4 \\u05D0\\u05D5\\u05E9\\u05E8\\u05D4\n\n# YMSG: Toast message that reject of leave request was successful\nview.Toast.YMSG_LRA_Declined=\\u05D1\\u05E7\\u05E9\\u05EA \\u05D4\\u05D7\\u05D5\\u05E4\\u05E9\\u05D4 \\u05E0\\u05D3\\u05D7\\u05EA\\u05D4\n\n# XTIT: Leave Request Details\nview.Detail.title=\\u05D1\\u05E7\\u05E9\\u05EA \\u05D7\\u05D5\\u05E4\\u05E9\\u05D4\n\n# XTIT: Leave Request Details - Calendar\nview.Calendar.title=\\u05DC\\u05D5\\u05D7 \\u05E9\\u05E0\\u05D4\n\n# XTIT: Leave Type\nview.AddInfo.LeaveType=\\u05E1\\u05D5\\u05D2 \\u05D7\\u05D5\\u05E4\\u05E9\\u05D4\n\n# XTIT: Total Deduction\nview.AddInfo.Deduction=\\u05E0\\u05D9\\u05DB\\u05D5\\u05D9 \\u05E1\\u05D4"\\u05DB\n\n# XTIT: Personel Number\nview.Header.EmployeeID=\\u05D6\\u05D9\\u05D4\\u05D5\\u05D9 \\u05E2\\u05D5\\u05D1\\u05D3 {0}\n\n# XTIT: Header text of Master List\nview.Master.title=\\u05D1\\u05E7\\u05E9\\u05D5\\u05EA \\u05D7\\u05D5\\u05E4\\u05E9\\u05D4 ({0})\n\n# XTIT: Application name (shown in browser header bar or as browser tab title)\napp.Identity=\\u05D0\\u05E9\\u05E8 \\u05D1\\u05E7\\u05E9\\u05D5\\u05EA \\u05D7\\u05D5\\u05E4\\u05E9\\u05D4\n\n\n# XTIT: Title of Email to Employee on Business Card\nview.BusinessCard.Employee.Subject=\\u05D4\\u05D1\\u05E7\\u05E9\\u05D4 \\u05E9\\u05DC\\u05DA \\u05DC\\u05D7\\u05D5\\u05E4\\u05E9\\u05D4\\: {0}\n\n# XTIT: Shell title (shown within the UI as title of shell component, desktop only)\nshell.Identity=\\u05D0\\u05E9\\u05E8 \\u05D1\\u05E7\\u05E9\\u05D5\\u05EA \\u05D7\\u05D5\\u05E4\\u05E9\\u05D4\n\n# YMSG\ndialog.question.approve=\\u05D4\\u05D0\\u05DD \\u05DC\\u05D0\\u05E9\\u05E8 \\u05D0\\u05EA \\u05D1\\u05E7\\u05E9\\u05EA \\u05D4\\u05D7\\u05D5\\u05E4\\u05E9\\u05D4 \\u05E9\\u05D4\\u05D5\\u05D2\\u05E9\\u05D4 \\u05E2\\u05DC-\\u05D9\\u05D3\\u05D9 {0}?\n\n# YMSG\ndialog.question.reject=\\u05D4\\u05D0\\u05DD \\u05DC\\u05D3\\u05D7\\u05D5\\u05EA \\u05D0\\u05EA \\u05D1\\u05E7\\u05E9\\u05EA \\u05D4\\u05D7\\u05D5\\u05E4\\u05E9\\u05D4 \\u05E9\\u05D4\\u05D5\\u05D2\\u05E9\\u05D4 \\u05E2\\u05DC-\\u05D9\\u05D3\\u05D9 {0}?\n\n# YMSG\ndialog.question.approvecancel=\\u05D4\\u05D0\\u05DD \\u05DC\\u05D0\\u05E9\\u05E8 \\u05D0\\u05EA \\u05D4\\u05D1\\u05D9\\u05D8\\u05D5\\u05DC \\u05E9\\u05D4\\u05D5\\u05D2\\u05E9 \\u05E2\\u05DC-\\u05D9\\u05D3\\u05D9 {0}?\n\n# YMSG\ndialog.question.rejectcancel=\\u05D4\\u05D0\\u05DD \\u05DC\\u05D3\\u05D7\\u05D5\\u05EA \\u05D0\\u05EA \\u05D4\\u05D1\\u05D9\\u05D8\\u05D5\\u05DC \\u05E9\\u05D4\\u05D5\\u05D2\\u05E9 \\u05E2\\u05DC-\\u05D9\\u05D3\\u05D9 {0}?\n\n# YMSG\ndialog.success.approvecancel=\\u05D4\\u05D1\\u05D9\\u05D8\\u05D5\\u05DC \\u05D0\\u05D5\\u05E9\\u05E8\n\n# YMSG\ndialog.success.rejectcancel=\\u05D4\\u05D1\\u05D9\\u05D8\\u05D5\\u05DC \\u05E0\\u05D3\\u05D7\\u05D4\n\n# YMSG\ndialog.success.approve=\\u05D1\\u05E7\\u05E9\\u05EA \\u05D4\\u05D7\\u05D5\\u05E4\\u05E9\\u05D4 \\u05D0\\u05D5\\u05E9\\u05E8\\u05D4\n\n# YMSG\ndialog.success.reject=\\u05D1\\u05E7\\u05E9\\u05EA \\u05D4\\u05D7\\u05D5\\u05E4\\u05E9\\u05D4 \\u05E0\\u05D3\\u05D7\\u05EA\\u05D4\n\n# YMSG\ndialog.leave.overlaps.disclaimer=\\u05D7\\u05E4\\u05D9\\u05E4\\u05D4 \\u05D1\\u05D7\\u05D5\\u05E4\\u05E9\\u05D5\\u05EA \\u05E2\\u05D1\\u05D5\\u05E8 {0} \\u05D1\\u05D9\\u05DF {1} \\u05DC-{2}\n\n# YMSG: link to Team calendar\nutil.Conversions.OverlapsPlLink=\\u05D4\\u05E6\\u05D2 \\u05DC\\u05D5\\u05D7 \\u05E9\\u05E0\\u05D4 \\u05E9\\u05DC \\u05E6\\u05D5\\u05D5\\u05EA\n\n# XFLD: Status: Cancellation of a Leave Request requested \nview.Header.CancellationStatus=\\u05D4\\u05D5\\u05D2\\u05E9\\u05D4 \\u05D1\\u05E7\\u05E9\\u05D4 \\u05DC\\u05D1\\u05D9\\u05D8\\u05D5\\u05DC\n\n# XFLD: Status: Cancellation of a Leave Request requested \nview.List.CancellationStatus=\\u05D1\\u05D5\\u05D8\\u05DC\n\n#XBUT: Button for Approve action\nXBUT_APPROVE=\\u05D0\\u05E9\\u05E8\n\n#XBUT: Button for Reject action\nXBUT_REJECT=\\u05D3\\u05D7\\u05D4\n\n#XTIT: Title of the confirmation dialog while executing an action\nXTIT_APPROVAL=\\u05D0\\u05E9\\u05E8\n\n#XTIT: Title of the confirmation dialog while executing an action\nXTIT_REJECT=\\u05D3\\u05D7\\u05D4\n\n# YMSG: Loading\nLOADING=\\u05D8\\u05D5\\u05E2\\u05DF ...\n\n# XTIT: Leave Request Details\nDETAIL_TITLE=\\u05D1\\u05E7\\u05E9\\u05EA \\u05D7\\u05D5\\u05E4\\u05E9\\u05D4\n\n# YMSG: No items are currently available\nNO_ITEMS_AVAILABLE=\\u05D0\\u05D9\\u05DF \\u05E4\\u05E8\\u05D9\\u05D8\\u05D9\\u05DD \\u05D6\\u05DE\\u05D9\\u05E0\\u05D9\\u05DD\n\n#XFLD: Label for Start Time\nALR_START_TIME=\\u05E9\\u05E2\\u05EA \\u05D4\\u05EA\\u05D7\\u05DC\\u05D4\n\n#XFLD: Label for Start Time\nALR_END_TIME=\\u05E9\\u05E2\\u05EA \\u05E1\\u05D9\\u05D5\\u05DD\n',
	"hcm/approve/leaverequest/i18n/i18n_ja.properties":'\n# XFLD: number of absence days requested (e.g. two days)\nutil.Conversions.Days=\\u65E5\n\n# XFLD: number of absence days requested (singular)\nutil.Conversions.Day_Singular=\\u65E5\n\n# XFLD: number of absence hours requested (e.g. two hours)\nutil.Conversions.Hours=\\u6642\\u9593\n\n# XFLD: number of absence hours requested (e.g. one hour, Singular!)\nutil.Conversions.Hour_Singular=\\u6642\\u9593\n\n# XFLD: number of absence days requested (e.g. two days)\nutil.Conversions.Value_Days={0} \\u65E5\n\n# XFLD: number of absence days requested (singular)\nutil.Conversions.Value_Day_Singular={0} \\u65E5\n\n# XFLD: number of absence hours requested (e.g. two hours)\nutil.Conversions.Value_Hours={0} \\u6642\\u9593\n\n# XFLD: number of absence hours requested (e.g. one hour, Singular!)\nutil.Conversions.Value_Hour_Singular={0} \\u6642\\u9593\n\n# XFLD: Current Balance of the leave quote on Detail Screen\nview.AddInfo.CurrentBalance=\\u4F11\\u6687\\u6B8B\\u65E5\\u6570\n\n# XFLD: Requested amount of the leave type on Detail Screen (e.g. Vacation Requested:  14 Days)\nview.AddInfo.Requested=\\u7533\\u8ACB\\u6E08\n\n# YMSG: information of existing overlaps of leave requests (e.g.  3 overlaps, Plural)\nutil.Conversions.OverlapsPl={0} \\u4EF6\\u306E\\u91CD\\u8907\n\n# YMSG: information of existing overlaps of leave requests (e.g. 1 overlap, Singular)\nutil.Conversions.OverlapSing={0} \\u4EF6\\u306E\\u91CD\\u8907\n\n# XFLD: Requested amount of the leave type on Confirm/Decline Popup (e.g. Request    14 days)\nview.Detail.Request=\\u7533\\u8ACB\\u6E08\n\n#XFLD: Label for Requested Time Duration\nview.Detail.FromTo=\\u958B\\u59CB - \\u7D42\\u4E86\n\n# YMSG: Alert message that current balance of leave request may not be accurate.\nview.AddInfo.AlertMessageBalanceNotAccurate=\\u3053\\u306E\\u5F93\\u696D\\u54E1\\u306B\\u3088\\u3063\\u3066\\u6700\\u8FD1\\u9001\\u4FE1\\u3055\\u308C\\u305F\\u5225\\u306E\\u4F11\\u6687\\u7533\\u8ACB\\u304C\\u3042\\u308A\\u307E\\u3059\\u3002\\u30BF\\u30A4\\u30E0\\u30D0\\u30E9\\u30F3\\u30B9\\u304C\\u6B63\\u78BA\\u3067\\u306F\\u306A\\u3044\\u53EF\\u80FD\\u6027\\u304C\\u3042\\u308A\\u307E\\u3059\n\n# XSEL: status of Leave Request: approved\nview.Calendar.LegendApproved=\\u627F\\u8A8D\\u6E08\\u306E\\u4F11\\u6687\n\n# XSEL: status of Leave Request: working day\nview.Calendar.LegendWorkingDay=\\u52E4\\u52D9\\u65E5\n\n# XSEL: status of Leave Request: Open Request\nview.Calendar.LegendPending=\\u4FDD\\u7559\\u4E2D\\u306E\\u627F\\u8A8D\n\n# XSEL: status of Leave Request: Non-working day (e.g. weekend)\nview.Calendar.LegendDayOff=\\u4F11\\u65E5\n\n# XSEL: status of Leave Request: Public Holiday\nview.Calendar.LegendHoliday=\\u795D\\u65E5\n\n# XSEL: status of Leave Request: Today\nview.Calendar.LegendToday=\\u672C\\u65E5\n\n# XSEL: status of Leave Request:  other request types\nview.Calendar.LegendDeletionRequested=\\u305D\\u306E\\u4ED6\n\n# YMSG: Toast message that approval of leave request was successful\nview.Toast.YMSG_LRA_Approved=\\u4F11\\u6687\\u7533\\u8ACB\\u304C\\u627F\\u8A8D\\u3055\\u308C\\u307E\\u3057\\u305F\n\n# YMSG: Toast message that reject of leave request was successful\nview.Toast.YMSG_LRA_Declined=\\u4F11\\u6687\\u7533\\u8ACB\\u304C\\u5374\\u4E0B\\u3055\\u308C\\u307E\\u3057\\u305F\n\n# XTIT: Leave Request Details\nview.Detail.title=\\u4F11\\u6687\\u7533\\u8ACB\n\n# XTIT: Leave Request Details - Calendar\nview.Calendar.title=\\u30AB\\u30EC\\u30F3\\u30C0\n\n# XTIT: Leave Type\nview.AddInfo.LeaveType=\\u4F11\\u6687\\u30BF\\u30A4\\u30D7\n\n# XTIT: Total Deduction\nview.AddInfo.Deduction=\\u6D88\\u5316\\u5408\\u8A08\n\n# XTIT: Personel Number\nview.Header.EmployeeID=\\u5F93\\u696D\\u54E1 ID {0}\n\n# XTIT: Header text of Master List\nview.Master.title=\\u4F11\\u6687\\u7533\\u8ACB ({0})\n\n# XTIT: Application name (shown in browser header bar or as browser tab title)\napp.Identity=\\u4F11\\u6687\\u7533\\u8ACB\\u627F\\u8A8D\n\n\n# XTIT: Title of Email to Employee on Business Card\nview.BusinessCard.Employee.Subject=\\u4F11\\u6687\\u7533\\u8ACB\\u306E\\u30BF\\u30A4\\u30D7\\:  {0}\n\n# XTIT: Shell title (shown within the UI as title of shell component, desktop only)\nshell.Identity=\\u4F11\\u6687\\u7533\\u8ACB\\u627F\\u8A8D\n\n# YMSG\ndialog.question.approve={0} \\u304B\\u3089\\u9001\\u4FE1\\u3055\\u308C\\u305F\\u4F11\\u6687\\u7533\\u8ACB\\u3092\\u627F\\u8A8D\\u3057\\u307E\\u3059\\u304B\\u3002\n\n# YMSG\ndialog.question.reject={0} \\u304B\\u3089\\u9001\\u4FE1\\u3055\\u308C\\u305F\\u4F11\\u6687\\u7533\\u8ACB\\u3092\\u5374\\u4E0B\\u3057\\u307E\\u3059\\u304B\\u3002\n\n# YMSG\ndialog.question.approvecancel={0} \\u304B\\u3089\\u9001\\u4FE1\\u3055\\u308C\\u305F\\u53D6\\u6D88\\u3092\\u627F\\u8A8D\\u3057\\u307E\\u3059\\u304B\\u3002\n\n# YMSG\ndialog.question.rejectcancel={0} \\u304B\\u3089\\u9001\\u4FE1\\u3055\\u308C\\u305F\\u53D6\\u6D88\\u3092\\u5374\\u4E0B\\u3057\\u307E\\u3059\\u304B\\u3002\n\n# YMSG\ndialog.success.approvecancel=\\u53D6\\u6D88\\u304C\\u627F\\u8A8D\\u3055\\u308C\\u307E\\u3057\\u305F\n\n# YMSG\ndialog.success.rejectcancel=\\u53D6\\u6D88\\u304C\\u5374\\u4E0B\\u3055\\u308C\\u307E\\u3057\\u305F\n\n# YMSG\ndialog.success.approve=\\u4F11\\u6687\\u7533\\u8ACB\\u304C\\u627F\\u8A8D\\u3055\\u308C\\u307E\\u3057\\u305F\n\n# YMSG\ndialog.success.reject=\\u4F11\\u6687\\u7533\\u8ACB\\u304C\\u5374\\u4E0B\\u3055\\u308C\\u307E\\u3057\\u305F\n\n# YMSG\ndialog.leave.overlaps.disclaimer={0} \\u306B\\u5BFE\\u3057\\u3066\\u3001{1} \\u3068 {2} \\u306E\\u9593\\u3067\\u4F11\\u6687\\u304C\\u91CD\\u8907\\u3057\\u3066\\u3044\\u307E\\u3059\n\n# YMSG: link to Team calendar\nutil.Conversions.OverlapsPlLink=\\u30C1\\u30FC\\u30E0\\u30AB\\u30EC\\u30F3\\u30C0\\u8868\\u793A\n\n# XFLD: Status: Cancellation of a Leave Request requested \nview.Header.CancellationStatus=\\u53D6\\u6D88\\u4F9D\\u983C\\u6E08\n\n# XFLD: Status: Cancellation of a Leave Request requested \nview.List.CancellationStatus=\\u53D6\\u6D88\\u6E08\n\n#XBUT: Button for Approve action\nXBUT_APPROVE=\\u627F\\u8A8D\n\n#XBUT: Button for Reject action\nXBUT_REJECT=\\u5374\\u4E0B\n\n#XTIT: Title of the confirmation dialog while executing an action\nXTIT_APPROVAL=\\u627F\\u8A8D\n\n#XTIT: Title of the confirmation dialog while executing an action\nXTIT_REJECT=\\u5374\\u4E0B\n\n# YMSG: Loading\nLOADING=\\u30ED\\u30FC\\u30C9\\u4E2D...\n\n# XTIT: Leave Request Details\nDETAIL_TITLE=\\u4F11\\u6687\\u7533\\u8ACB\n\n# YMSG: No items are currently available\nNO_ITEMS_AVAILABLE=\\u5229\\u7528\\u53EF\\u80FD\\u30A2\\u30A4\\u30C6\\u30E0\\u306A\\u3057\n\n#XFLD: Label for Start Time\nALR_START_TIME=\\u958B\\u59CB\\u6642\\u523B\n\n#XFLD: Label for Start Time\nALR_END_TIME=\\u7D42\\u4E86\\u6642\\u523B\n',
	"hcm/approve/leaverequest/i18n/i18n_no.properties":'\n# XFLD: number of absence days requested (e.g. two days)\nutil.Conversions.Days=Dager\n\n# XFLD: number of absence days requested (singular)\nutil.Conversions.Day_Singular=Dag\n\n# XFLD: number of absence hours requested (e.g. two hours)\nutil.Conversions.Hours=Timer\n\n# XFLD: number of absence hours requested (e.g. one hour, Singular!)\nutil.Conversions.Hour_Singular=Time\n\n# XFLD: number of absence days requested (e.g. two days)\nutil.Conversions.Value_Days={0} dager\n\n# XFLD: number of absence days requested (singular)\nutil.Conversions.Value_Day_Singular={0} dag\n\n# XFLD: number of absence hours requested (e.g. two hours)\nutil.Conversions.Value_Hours={0} timer\n\n# XFLD: number of absence hours requested (e.g. one hour, Singular!)\nutil.Conversions.Value_Hour_Singular={0} time\n\n# XFLD: Current Balance of the leave quote on Detail Screen\nview.AddInfo.CurrentBalance=Tilgjengelig feriesaldo\n\n# XFLD: Requested amount of the leave type on Detail Screen (e.g. Vacation Requested:  14 Days)\nview.AddInfo.Requested=S\\u00F8kt om\n\n# YMSG: information of existing overlaps of leave requests (e.g.  3 overlaps, Plural)\nutil.Conversions.OverlapsPl={0} Overlapper\n\n# YMSG: information of existing overlaps of leave requests (e.g. 1 overlap, Singular)\nutil.Conversions.OverlapSing={0} Overlapping\n\n# XFLD: Requested amount of the leave type on Confirm/Decline Popup (e.g. Request    14 days)\nview.Detail.Request=S\\u00F8kt om\n\n#XFLD: Label for Requested Time Duration\nview.Detail.FromTo=Fra - til\n\n# YMSG: Alert message that current balance of leave request may not be accurate.\nview.AddInfo.AlertMessageBalanceNotAccurate=Denne personen har nylig levert inn andre frav\\u00E6rss\\u00F8knader. Saldoen kan v\\u00E6re feil.\n\n# XSEL: status of Leave Request: approved\nview.Calendar.LegendApproved=Godkjent frav\\u00E6r\n\n# XSEL: status of Leave Request: working day\nview.Calendar.LegendWorkingDay=Arbeidsdag\n\n# XSEL: status of Leave Request: Open Request\nview.Calendar.LegendPending=Venter p\\u00E5 godkjenning\n\n# XSEL: status of Leave Request: Non-working day (e.g. weekend)\nview.Calendar.LegendDayOff=Ikke-arbeidsdag\n\n# XSEL: status of Leave Request: Public Holiday\nview.Calendar.LegendHoliday=Helgedag\n\n# XSEL: status of Leave Request: Today\nview.Calendar.LegendToday=I dag\n\n# XSEL: status of Leave Request:  other request types\nview.Calendar.LegendDeletionRequested=Andre\n\n# YMSG: Toast message that approval of leave request was successful\nview.Toast.YMSG_LRA_Approved=Frav\\u00E6rss\\u00F8knad godkjent\n\n# YMSG: Toast message that reject of leave request was successful\nview.Toast.YMSG_LRA_Declined=Frav\\u00E6rss\\u00F8knad avvist\n\n# XTIT: Leave Request Details\nview.Detail.title=Frav\\u00E6rss\\u00F8knad\n\n# XTIT: Leave Request Details - Calendar\nview.Calendar.title=Kalender\n\n# XTIT: Leave Type\nview.AddInfo.LeaveType=Frav\\u00E6rstype\n\n# XTIT: Total Deduction\nview.AddInfo.Deduction=Sum fradrag\n\n# XTIT: Personel Number\nview.Header.EmployeeID=Medarbeider-ID {0}\n\n# XTIT: Header text of Master List\nview.Master.title=Frav\\u00E6rss\\u00F8knader ({0})\n\n# XTIT: Application name (shown in browser header bar or as browser tab title)\napp.Identity=Godkjenn frav\\u00E6rss\\u00F8knader\n\n\n# XTIT: Title of Email to Employee on Business Card\nview.BusinessCard.Employee.Subject=Din s\\u00F8knad om frav\\u00E6r\\: {0}\n\n# XTIT: Shell title (shown within the UI as title of shell component, desktop only)\nshell.Identity=Godkjenn frav\\u00E6rss\\u00F8knader\n\n# YMSG\ndialog.question.approve=Godkjenne frav\\u00E6rss\\u00F8knaden fra {0}?\n\n# YMSG\ndialog.question.reject=Avvise frav\\u00E6rss\\u00F8knaden fra {0}?\n\n# YMSG\ndialog.question.approvecancel=Godkjenne annulleringen fra {0}?\n\n# YMSG\ndialog.question.rejectcancel=Avvise annulleringen fra {0}?\n\n# YMSG\ndialog.success.approvecancel=Annullering godkjent\n\n# YMSG\ndialog.success.rejectcancel=Annullering avvist\n\n# YMSG\ndialog.success.approve=Frav\\u00E6rss\\u00F8knad godkjent\n\n# YMSG\ndialog.success.reject=Frav\\u00E6rss\\u00F8knad avvist\n\n# YMSG\ndialog.leave.overlaps.disclaimer=Overlappinger av frav\\u00E6r for {0} mellom {1} og {2}\n\n# YMSG: link to Team calendar\nutil.Conversions.OverlapsPlLink=Vis teamkalender\n\n# XFLD: Status: Cancellation of a Leave Request requested \nview.Header.CancellationStatus=Annullering \\u00F8nsket\n\n# XFLD: Status: Cancellation of a Leave Request requested \nview.List.CancellationStatus=Annullert\n\n#XBUT: Button for Approve action\nXBUT_APPROVE=Godkjenn\n\n#XBUT: Button for Reject action\nXBUT_REJECT=Avvis\n\n#XTIT: Title of the confirmation dialog while executing an action\nXTIT_APPROVAL=Godkjenn\n\n#XTIT: Title of the confirmation dialog while executing an action\nXTIT_REJECT=Avvis\n\n# YMSG: Loading\nLOADING=Laster ...\n\n# XTIT: Leave Request Details\nDETAIL_TITLE=Frav\\u00E6rss\\u00F8knad\n\n# YMSG: No items are currently available\nNO_ITEMS_AVAILABLE=Ingen tilgjengelige elementer\n\n#XFLD: Label for Start Time\nALR_START_TIME=Starttidspunkt\n\n#XFLD: Label for Start Time\nALR_END_TIME=Sluttidspunkt\n',
	"hcm/approve/leaverequest/i18n/i18n_pl.properties":'\n# XFLD: number of absence days requested (e.g. two days)\nutil.Conversions.Days=Dni\n\n# XFLD: number of absence days requested (singular)\nutil.Conversions.Day_Singular=Dzie\\u0144\n\n# XFLD: number of absence hours requested (e.g. two hours)\nutil.Conversions.Hours=Godziny\n\n# XFLD: number of absence hours requested (e.g. one hour, Singular!)\nutil.Conversions.Hour_Singular=Godzina\n\n# XFLD: number of absence days requested (e.g. two days)\nutil.Conversions.Value_Days={0} dni\n\n# XFLD: number of absence days requested (singular)\nutil.Conversions.Value_Day_Singular={0} dzie\\u0144\n\n# XFLD: number of absence hours requested (e.g. two hours)\nutil.Conversions.Value_Hours={0} godz.\n\n# XFLD: number of absence hours requested (e.g. one hour, Singular!)\nutil.Conversions.Value_Hour_Singular={0} godz.\n\n# XFLD: Current Balance of the leave quote on Detail Screen\nview.AddInfo.CurrentBalance=Dost\\u0119pne saldo\n\n# XFLD: Requested amount of the leave type on Detail Screen (e.g. Vacation Requested:  14 Days)\nview.AddInfo.Requested=\\u017B\\u0105dano\n\n# YMSG: information of existing overlaps of leave requests (e.g.  3 overlaps, Plural)\nutil.Conversions.OverlapsPl=Liczba pokry\\u0107\\: {0}\n\n# YMSG: information of existing overlaps of leave requests (e.g. 1 overlap, Singular)\nutil.Conversions.OverlapSing={0} pokrycie\n\n# XFLD: Requested amount of the leave type on Confirm/Decline Popup (e.g. Request    14 days)\nview.Detail.Request=\\u017B\\u0105dano\n\n#XFLD: Label for Requested Time Duration\nview.Detail.FromTo=Od - do\n\n# YMSG: Alert message that current balance of leave request may not be accurate.\nview.AddInfo.AlertMessageBalanceNotAccurate=Ta osoba przes\\u0142a\\u0142a ostatnio inne wnioski urlopowe; saldo mo\\u017Ce by\\u0107 nieaktualne\n\n# XSEL: status of Leave Request: approved\nview.Calendar.LegendApproved=Zatwierdzony urlop\n\n# XSEL: status of Leave Request: working day\nview.Calendar.LegendWorkingDay=Dzie\\u0144 roboczy\n\n# XSEL: status of Leave Request: Open Request\nview.Calendar.LegendPending=Oczekuje na zatwierdzenie\n\n# XSEL: status of Leave Request: Non-working day (e.g. weekend)\nview.Calendar.LegendDayOff=Dzie\\u0144 wolny od pracy\n\n# XSEL: status of Leave Request: Public Holiday\nview.Calendar.LegendHoliday=Dzie\\u0144 \\u015Bwi\\u0105teczny\n\n# XSEL: status of Leave Request: Today\nview.Calendar.LegendToday=Dzisiaj\n\n# XSEL: status of Leave Request:  other request types\nview.Calendar.LegendDeletionRequested=Inne\n\n# YMSG: Toast message that approval of leave request was successful\nview.Toast.YMSG_LRA_Approved=Zatwierdzono wniosek urlopowy\n\n# YMSG: Toast message that reject of leave request was successful\nview.Toast.YMSG_LRA_Declined=Odrzucono wniosek urlopwoy\n\n# XTIT: Leave Request Details\nview.Detail.title=Wniosek urlopowy\n\n# XTIT: Leave Request Details - Calendar\nview.Calendar.title=Kalendarz\n\n# XTIT: Leave Type\nview.AddInfo.LeaveType=Typ urlopu\n\n# XTIT: Total Deduction\nview.AddInfo.Deduction=Zmniejszenie \\u0142\\u0105cznie\n\n# XTIT: Personel Number\nview.Header.EmployeeID=ID pracownika {0}\n\n# XTIT: Header text of Master List\nview.Master.title=Wnioski urlopowe ({0})\n\n# XTIT: Application name (shown in browser header bar or as browser tab title)\napp.Identity=Zatwierd\\u017A wnioski urlopowe\n\n\n# XTIT: Title of Email to Employee on Business Card\nview.BusinessCard.Employee.Subject=Wniosek urlopowy\\: {0}\n\n# XTIT: Shell title (shown within the UI as title of shell component, desktop only)\nshell.Identity=Zatwierd\\u017A wnioski urlopowe\n\n# YMSG\ndialog.question.approve=Zatwierdzi\\u0107 wniosek urlopowy przes\\u0142any przez {0}?\n\n# YMSG\ndialog.question.reject=Odrzuci\\u0107 wniosek urlopowy przes\\u0142any przez {0}?\n\n# YMSG\ndialog.question.approvecancel=Zatwierdzi\\u0107 anulacj\\u0119 przes\\u0142an\\u0105 przez {0}?\n\n# YMSG\ndialog.question.rejectcancel=Odrzuci\\u0107 anulacj\\u0119 przes\\u0142an\\u0105 przez {0}?\n\n# YMSG\ndialog.success.approvecancel=Zatwierdzono anulowanie\n\n# YMSG\ndialog.success.rejectcancel=Odrzucono anulowanie\n\n# YMSG\ndialog.success.approve=Zatwierdzono wniosek urlopowy\n\n# YMSG\ndialog.success.reject=Odrzucono wniosek urlopwoy\n\n# YMSG\ndialog.leave.overlaps.disclaimer=Urlop nak\\u0142ada si\\u0119 dla {0} pomi\\u0119dzy {1} i {2}\n\n# YMSG: link to Team calendar\nutil.Conversions.OverlapsPlLink=Wy\\u015Bwietl kalendarz zespo\\u0142u\n\n# XFLD: Status: Cancellation of a Leave Request requested \nview.Header.CancellationStatus=Za\\u017C\\u0105dano anulowania\n\n# XFLD: Status: Cancellation of a Leave Request requested \nview.List.CancellationStatus=Anulowane\n\n#XBUT: Button for Approve action\nXBUT_APPROVE=Zatwierd\\u017A\n\n#XBUT: Button for Reject action\nXBUT_REJECT=Odrzu\\u0107\n\n#XTIT: Title of the confirmation dialog while executing an action\nXTIT_APPROVAL=Zatwierdzanie\n\n#XTIT: Title of the confirmation dialog while executing an action\nXTIT_REJECT=Odrzucanie\n\n# YMSG: Loading\nLOADING=Wczytywanie...\n\n# XTIT: Leave Request Details\nDETAIL_TITLE=Wniosek urlopowy\n\n# YMSG: No items are currently available\nNO_ITEMS_AVAILABLE=Brak pozycji\n\n#XFLD: Label for Start Time\nALR_START_TIME=Czas rozpocz\\u0119cia\n\n#XFLD: Label for Start Time\nALR_END_TIME=Czas zako\\u0144czenia\n',
	"hcm/approve/leaverequest/i18n/i18n_pt.properties":'\n# XFLD: number of absence days requested (e.g. two days)\nutil.Conversions.Days=Dias\n\n# XFLD: number of absence days requested (singular)\nutil.Conversions.Day_Singular=Dia\n\n# XFLD: number of absence hours requested (e.g. two hours)\nutil.Conversions.Hours=Horas\n\n# XFLD: number of absence hours requested (e.g. one hour, Singular!)\nutil.Conversions.Hour_Singular=Hora\n\n# XFLD: number of absence days requested (e.g. two days)\nutil.Conversions.Value_Days={0} dias\n\n# XFLD: number of absence days requested (singular)\nutil.Conversions.Value_Day_Singular={0} dia\n\n# XFLD: number of absence hours requested (e.g. two hours)\nutil.Conversions.Value_Hours={0} horas\n\n# XFLD: number of absence hours requested (e.g. one hour, Singular!)\nutil.Conversions.Value_Hour_Singular={0} hora\n\n# XFLD: Current Balance of the leave quote on Detail Screen\nview.AddInfo.CurrentBalance=Saldo dispon\\u00EDvel\n\n# XFLD: Requested amount of the leave type on Detail Screen (e.g. Vacation Requested:  14 Days)\nview.AddInfo.Requested=Solicitado\n\n# YMSG: information of existing overlaps of leave requests (e.g.  3 overlaps, Plural)\nutil.Conversions.OverlapsPl={0} sobreposi\\u00E7\\u00F5es\n\n# YMSG: information of existing overlaps of leave requests (e.g. 1 overlap, Singular)\nutil.Conversions.OverlapSing={0} sobreposi\\u00E7\\u00E3o\n\n# XFLD: Requested amount of the leave type on Confirm/Decline Popup (e.g. Request    14 days)\nview.Detail.Request=Solicitado\n\n#XFLD: Label for Requested Time Duration\nview.Detail.FromTo=De - A\n\n# YMSG: Alert message that current balance of leave request may not be accurate.\nview.AddInfo.AlertMessageBalanceNotAccurate=Essa pessoa enviou recentemente outras solicita\\u00E7\\u00F5es de aus\\u00EAncia; o saldo pode n\\u00E3o estar correto\n\n# XSEL: status of Leave Request: approved\nview.Calendar.LegendApproved=Aprovada\n\n# XSEL: status of Leave Request: working day\nview.Calendar.LegendWorkingDay=Dia de trabalho\n\n# XSEL: status of Leave Request: Open Request\nview.Calendar.LegendPending=Aprova\\u00E7\\u00E3o pendente\n\n# XSEL: status of Leave Request: Non-working day (e.g. weekend)\nview.Calendar.LegendDayOff=Dia n\\u00E3o trabalhado\n\n# XSEL: status of Leave Request: Public Holiday\nview.Calendar.LegendHoliday=Feriado\n\n# XSEL: status of Leave Request: Today\nview.Calendar.LegendToday=Hoje\n\n# XSEL: status of Leave Request:  other request types\nview.Calendar.LegendDeletionRequested=Outros\n\n# YMSG: Toast message that approval of leave request was successful\nview.Toast.YMSG_LRA_Approved=Solicita\\u00E7\\u00E3o de aus\\u00EAncia aprovada\n\n# YMSG: Toast message that reject of leave request was successful\nview.Toast.YMSG_LRA_Declined=Solicita\\u00E7\\u00E3o de aus\\u00EAncia rejeitada\n\n# XTIT: Leave Request Details\nview.Detail.title=Solicita\\u00E7\\u00E3o de aus\\u00EAncia\n\n# XTIT: Leave Request Details - Calendar\nview.Calendar.title=Calend\\u00E1rio\n\n# XTIT: Leave Type\nview.AddInfo.LeaveType=Tipo de aus\\u00EAncia\n\n# XTIT: Total Deduction\nview.AddInfo.Deduction=Dedu\\u00E7\\u00E3o total\n\n# XTIT: Personel Number\nview.Header.EmployeeID=ID do funcion\\u00E1rio {0}\n\n# XTIT: Header text of Master List\nview.Master.title=Solicita\\u00E7\\u00F5es de aus\\u00EAncia ({0})\n\n# XTIT: Application name (shown in browser header bar or as browser tab title)\napp.Identity=Aprovar solicita\\u00E7\\u00F5es de aus\\u00EAncia\n\n\n# XTIT: Title of Email to Employee on Business Card\nview.BusinessCard.Employee.Subject=Sua solicita\\u00E7\\u00E3o de aus\\u00EAncia\\: {0}\n\n# XTIT: Shell title (shown within the UI as title of shell component, desktop only)\nshell.Identity=Aprovar solicita\\u00E7\\u00F5es de aus\\u00EAncia\n\n# YMSG\ndialog.question.approve=Aprovar a solicita\\u00E7\\u00E3o de aus\\u00EAncia enviada por {0}?\n\n# YMSG\ndialog.question.reject=Rejeitar a solicita\\u00E7\\u00E3o de aus\\u00EAncia enviada por {0}?\n\n# YMSG\ndialog.question.approvecancel=Aprovar o cancelamento enviado por {0}?\n\n# YMSG\ndialog.question.rejectcancel=Rejeitar o cancelamento enviado por {0}?\n\n# YMSG\ndialog.success.approvecancel=Cancelamento aprovado\n\n# YMSG\ndialog.success.rejectcancel=Cancelamento rejeitado\n\n# YMSG\ndialog.success.approve=Solicita\\u00E7\\u00E3o de aus\\u00EAncia aprovada\n\n# YMSG\ndialog.success.reject=Solicita\\u00E7\\u00E3o de aus\\u00EAncia rejeitada\n\n# YMSG\ndialog.leave.overlaps.disclaimer=Sobreposi\\u00E7\\u00F5es de aus\\u00EAncia para {0} entre {1} e {2}\n\n# YMSG: link to Team calendar\nutil.Conversions.OverlapsPlLink=Exibir calend\\u00E1rio da equipe\n\n# XFLD: Status: Cancellation of a Leave Request requested \nview.Header.CancellationStatus=Cancelamento solicitado\n\n# XFLD: Status: Cancellation of a Leave Request requested \nview.List.CancellationStatus=Cancelado\n\n#XBUT: Button for Approve action\nXBUT_APPROVE=Aprovar\n\n#XBUT: Button for Reject action\nXBUT_REJECT=Rejeitar\n\n#XTIT: Title of the confirmation dialog while executing an action\nXTIT_APPROVAL=Aprovar\n\n#XTIT: Title of the confirmation dialog while executing an action\nXTIT_REJECT=Rejeitar\n\n# YMSG: Loading\nLOADING=Carregando...\n\n# XTIT: Leave Request Details\nDETAIL_TITLE=Solicita\\u00E7\\u00E3o de aus\\u00EAncia\n\n# YMSG: No items are currently available\nNO_ITEMS_AVAILABLE=Nenhum item dispon\\u00EDvel\n\n#XFLD: Label for Start Time\nALR_START_TIME=Hora de in\\u00EDcio\n\n#XFLD: Label for Start Time\nALR_END_TIME=Hora de fim\n',
	"hcm/approve/leaverequest/i18n/i18n_ro.properties":'\n# XFLD: number of absence days requested (e.g. two days)\nutil.Conversions.Days=Zile\n\n# XFLD: number of absence days requested (singular)\nutil.Conversions.Day_Singular=Zi\n\n# XFLD: number of absence hours requested (e.g. two hours)\nutil.Conversions.Hours=Ore\n\n# XFLD: number of absence hours requested (e.g. one hour, Singular!)\nutil.Conversions.Hour_Singular=Or\\u0103\n\n# XFLD: number of absence days requested (e.g. two days)\nutil.Conversions.Value_Days={0} zile\n\n# XFLD: number of absence days requested (singular)\nutil.Conversions.Value_Day_Singular={0} zi\n\n# XFLD: number of absence hours requested (e.g. two hours)\nutil.Conversions.Value_Hours={0} ore\n\n# XFLD: number of absence hours requested (e.g. one hour, Singular!)\nutil.Conversions.Value_Hour_Singular={0} or\\u0103\n\n# XFLD: Current Balance of the leave quote on Detail Screen\nview.AddInfo.CurrentBalance=Sold disponibil\n\n# XFLD: Requested amount of the leave type on Detail Screen (e.g. Vacation Requested:  14 Days)\nview.AddInfo.Requested=Solicitat\n\n# YMSG: information of existing overlaps of leave requests (e.g.  3 overlaps, Plural)\nutil.Conversions.OverlapsPl={0} suprapuneri\n\n# YMSG: information of existing overlaps of leave requests (e.g. 1 overlap, Singular)\nutil.Conversions.OverlapSing={0} suprapunere\n\n# XFLD: Requested amount of the leave type on Confirm/Decline Popup (e.g. Request    14 days)\nview.Detail.Request=Solicitat\n\n#XFLD: Label for Requested Time Duration\nview.Detail.FromTo=De la - p\\u00E2n\\u0103 la\n\n# YMSG: Alert message that current balance of leave request may not be accurate.\nview.AddInfo.AlertMessageBalanceNotAccurate=Aceast\\u0103 persoan\\u0103 a transmis recent alte cereri de concediu; este posibil ca soldul s\\u0103 nu fie exact\n\n# XSEL: status of Leave Request: approved\nview.Calendar.LegendApproved=Concediu aprobat\n\n# XSEL: status of Leave Request: working day\nview.Calendar.LegendWorkingDay=Zi lucr\\u0103toare\n\n# XSEL: status of Leave Request: Open Request\nview.Calendar.LegendPending=\\u00CEn a\\u015Fteptare pt.aprobare\n\n# XSEL: status of Leave Request: Non-working day (e.g. weekend)\nview.Calendar.LegendDayOff=Zi nelucr\\u0103toare\n\n# XSEL: status of Leave Request: Public Holiday\nview.Calendar.LegendHoliday=S\\u0103rb\\u0103toare legal\\u0103\n\n# XSEL: status of Leave Request: Today\nview.Calendar.LegendToday=Ast\\u0103zi\n\n# XSEL: status of Leave Request:  other request types\nview.Calendar.LegendDeletionRequested=Altele\n\n# YMSG: Toast message that approval of leave request was successful\nview.Toast.YMSG_LRA_Approved=Cerere de concediu a fost aprobat\\u0103\n\n# YMSG: Toast message that reject of leave request was successful\nview.Toast.YMSG_LRA_Declined=Cerere de concediu a fost respins\\u0103\n\n# XTIT: Leave Request Details\nview.Detail.title=Cerere de concediu\n\n# XTIT: Leave Request Details - Calendar\nview.Calendar.title=Calendar\n\n# XTIT: Leave Type\nview.AddInfo.LeaveType=Tip de concediu\n\n# XTIT: Total Deduction\nview.AddInfo.Deduction=Deducere total\\u0103\n\n# XTIT: Personel Number\nview.Header.EmployeeID=ID angajat {0}\n\n# XTIT: Header text of Master List\nview.Master.title=Cereri de concediu ({0})\n\n# XTIT: Application name (shown in browser header bar or as browser tab title)\napp.Identity=Aprobare cereri de concediu\n\n\n# XTIT: Title of Email to Employee on Business Card\nview.BusinessCard.Employee.Subject=Cererea dvs. de concediu\\: {0}\n\n# XTIT: Shell title (shown within the UI as title of shell component, desktop only)\nshell.Identity=Aprobare cereri de concediu\n\n# YMSG\ndialog.question.approve=Aproba\\u0163i cererea de concediu transmis\\u0103 de {0}?\n\n# YMSG\ndialog.question.reject=Respinge\\u0163i cererea de concediu transmis\\u0103 de {0}?\n\n# YMSG\ndialog.question.approvecancel=Aproba\\u0163i anularea transmis\\u0103 de {0}?\n\n# YMSG\ndialog.question.rejectcancel=Respinge\\u0163i anularea transmis\\u0103 de {0}?\n\n# YMSG\ndialog.success.approvecancel=Anulare a fost aprobat\\u0103\n\n# YMSG\ndialog.success.rejectcancel=Anulare a fost respins\\u0103\n\n# YMSG\ndialog.success.approve=Cerere de concediu a fost aprobat\\u0103\n\n# YMSG\ndialog.success.reject=Cerere de concediu a fost respins\\u0103\n\n# YMSG\ndialog.leave.overlaps.disclaimer=Concediul se suprapune pt. {0} \\u00EEntre {1} \\u015Fi {2}\n\n# YMSG: link to Team calendar\nutil.Conversions.OverlapsPlLink=Afi\\u015Fare calendar echip\\u0103\n\n# XFLD: Status: Cancellation of a Leave Request requested \nview.Header.CancellationStatus=Anulare solicitat\\u0103\n\n# XFLD: Status: Cancellation of a Leave Request requested \nview.List.CancellationStatus=Anulat\n\n#XBUT: Button for Approve action\nXBUT_APPROVE=Aprobare\n\n#XBUT: Button for Reject action\nXBUT_REJECT=Respingere\n\n#XTIT: Title of the confirmation dialog while executing an action\nXTIT_APPROVAL=Aprobare\n\n#XTIT: Title of the confirmation dialog while executing an action\nXTIT_REJECT=Respingere\n\n# YMSG: Loading\nLOADING=\\u00CEnc\\u0103rcare ...\n\n# XTIT: Leave Request Details\nDETAIL_TITLE=Cerere de concediu\n\n# YMSG: No items are currently available\nNO_ITEMS_AVAILABLE=F\\u0103r\\u0103 pozi\\u0163ii disponibile\n\n#XFLD: Label for Start Time\nALR_START_TIME=Or\\u0103 de \\u00EEnceput\n\n#XFLD: Label for Start Time\nALR_END_TIME=Or\\u0103 de sf\\u00E2r\\u015Fit\n',
	"hcm/approve/leaverequest/i18n/i18n_ru.properties":'\n# XFLD: number of absence days requested (e.g. two days)\nutil.Conversions.Days=\\u0434\\u043D.\n\n# XFLD: number of absence days requested (singular)\nutil.Conversions.Day_Singular=\\u0434\\u0435\\u043D\\u044C\n\n# XFLD: number of absence hours requested (e.g. two hours)\nutil.Conversions.Hours=\\u0447.\n\n# XFLD: number of absence hours requested (e.g. one hour, Singular!)\nutil.Conversions.Hour_Singular=\\u0447\\u0430\\u0441\n\n# XFLD: number of absence days requested (e.g. two days)\nutil.Conversions.Value_Days={0} \\u0434\\u043D.\n\n# XFLD: number of absence days requested (singular)\nutil.Conversions.Value_Day_Singular={0} \\u0434\\u0435\\u043D\\u044C\n\n# XFLD: number of absence hours requested (e.g. two hours)\nutil.Conversions.Value_Hours={0} \\u0447.\n\n# XFLD: number of absence hours requested (e.g. one hour, Singular!)\nutil.Conversions.Value_Hour_Singular={0} \\u0447\\u0430\\u0441\n\n# XFLD: Current Balance of the leave quote on Detail Screen\nview.AddInfo.CurrentBalance=\\u0414\\u043E\\u0441\\u0442\\u0443\\u043F\\u043D\\u044B\\u0439 \\u043E\\u0441\\u0442\\u0430\\u0442\\u043E\\u043A\n\n# XFLD: Requested amount of the leave type on Detail Screen (e.g. Vacation Requested:  14 Days)\nview.AddInfo.Requested=\\u0417\\u0430\\u043F\\u0440\\u043E\\u0448\\u0435\\u043D\\u043E\n\n# YMSG: information of existing overlaps of leave requests (e.g.  3 overlaps, Plural)\nutil.Conversions.OverlapsPl=\\u041A\\u043E\\u043D\\u0444\\u043B\\u0438\\u043A\\u0442\\u044B\\: {0}\n\n# YMSG: information of existing overlaps of leave requests (e.g. 1 overlap, Singular)\nutil.Conversions.OverlapSing={0} \\u043A\\u043E\\u043D\\u0444\\u043B\\u0438\\u043A\\u0442\n\n# XFLD: Requested amount of the leave type on Confirm/Decline Popup (e.g. Request    14 days)\nview.Detail.Request=\\u0417\\u0430\\u043F\\u0440\\u043E\\u0448\\u0435\\u043D\\u043E\n\n#XFLD: Label for Requested Time Duration\nview.Detail.FromTo=\\u0421 - \\u043F\\u043E\n\n# YMSG: Alert message that current balance of leave request may not be accurate.\nview.AddInfo.AlertMessageBalanceNotAccurate=\\u042D\\u0442\\u043E\\u0442 \\u0441\\u043E\\u0442\\u0440\\u0443\\u0434\\u043D\\u0438\\u043A \\u043D\\u0435\\u0434\\u0430\\u0432\\u043D\\u043E \\u043F\\u043E\\u0434\\u0430\\u0432\\u0430\\u043B \\u0434\\u0440\\u0443\\u0433\\u0438\\u0435 \\u0437\\u0430\\u044F\\u0432\\u043A\\u0438 \\u043D\\u0430 \\u043E\\u0442\\u043F\\u0443\\u0441\\u043A. \\u041E\\u0441\\u0442\\u0430\\u0442\\u043E\\u043A \\u0434\\u043D\\u0435\\u0439 \\u043C\\u043E\\u0436\\u0435\\u0442 \\u0431\\u044B\\u0442\\u044C \\u043D\\u0435\\u0442\\u043E\\u0447\\u0435\\u043D.\n\n# XSEL: status of Leave Request: approved\nview.Calendar.LegendApproved=\\u0423\\u0442\\u0432\\u0435\\u0440\\u0436\\u0434\\u0435\\u043D\\u043D\\u044B\\u0439 \\u043E\\u0442\\u043F\\u0443\\u0441\\u043A\n\n# XSEL: status of Leave Request: working day\nview.Calendar.LegendWorkingDay=\\u0420\\u0430\\u0431\\u043E\\u0447\\u0438\\u0439 \\u0434\\u0435\\u043D\\u044C\n\n# XSEL: status of Leave Request: Open Request\nview.Calendar.LegendPending=\\u041E\\u0436\\u0438\\u0434\\u0430\\u0435\\u0442 \\u0443\\u0442\\u0432\\u0435\\u0440\\u0436\\u0434\\u0435\\u043D\\u0438\\u044F\n\n# XSEL: status of Leave Request: Non-working day (e.g. weekend)\nview.Calendar.LegendDayOff=\\u041D\\u0435\\u0440\\u0430\\u0431\\u043E\\u0447\\u0438\\u0439 \\u0434\\u0435\\u043D\\u044C\n\n# XSEL: status of Leave Request: Public Holiday\nview.Calendar.LegendHoliday=\\u041F\\u0440\\u0430\\u0437\\u0434\\u043D\\u0438\\u0447\\u043D\\u044B\\u0439 \\u0434\\u0435\\u043D\\u044C\n\n# XSEL: status of Leave Request: Today\nview.Calendar.LegendToday=\\u0421\\u0435\\u0433\\u043E\\u0434\\u043D\\u044F\n\n# XSEL: status of Leave Request:  other request types\nview.Calendar.LegendDeletionRequested=\\u041F\\u0440\\u043E\\u0447\\u0438\\u0435\n\n# YMSG: Toast message that approval of leave request was successful\nview.Toast.YMSG_LRA_Approved=\\u0417\\u0430\\u044F\\u0432\\u043A\\u0430 \\u043D\\u0430 \\u043E\\u0442\\u043F\\u0443\\u0441\\u043A \\u0443\\u0442\\u0432\\u0435\\u0440\\u0436\\u0434\\u0435\\u043D\\u0430\n\n# YMSG: Toast message that reject of leave request was successful\nview.Toast.YMSG_LRA_Declined=\\u0417\\u0430\\u044F\\u0432\\u043A\\u0430 \\u043D\\u0430 \\u043E\\u0442\\u043F\\u0443\\u0441\\u043A \\u043E\\u0442\\u043A\\u043B\\u043E\\u043D\\u0435\\u043D\\u0430\n\n# XTIT: Leave Request Details\nview.Detail.title=\\u0417\\u0430\\u044F\\u0432\\u043A\\u0430 \\u043D\\u0430 \\u043E\\u0442\\u043F\\u0443\\u0441\\u043A\n\n# XTIT: Leave Request Details - Calendar\nview.Calendar.title=\\u041A\\u0430\\u043B\\u0435\\u043D\\u0434\\u0430\\u0440\\u044C\n\n# XTIT: Leave Type\nview.AddInfo.LeaveType=\\u0422\\u0438\\u043F \\u043E\\u0442\\u043F\\u0443\\u0441\\u043A\\u0430\n\n# XTIT: Total Deduction\nview.AddInfo.Deduction=\\u041E\\u0431\\u0449\\u0438\\u0439 \\u0432\\u044B\\u0447\\u0435\\u0442\n\n# XTIT: Personel Number\nview.Header.EmployeeID=ID \\u0441\\u043E\\u0442\\u0440\\u0443\\u0434\\u043D\\u0438\\u043A\\u0430\\: {0}\n\n# XTIT: Header text of Master List\nview.Master.title=\\u0417\\u0430\\u044F\\u0432\\u043A\\u0438 \\u043D\\u0430 \\u043E\\u0442\\u043F\\u0443\\u0441\\u043A ({0})\n\n# XTIT: Application name (shown in browser header bar or as browser tab title)\napp.Identity=\\u0423\\u0442\\u0432\\u0435\\u0440\\u0436\\u0434\\u0435\\u043D\\u0438\\u0435 \\u0437\\u0430\\u044F\\u0432\\u043E\\u043A \\u043D\\u0430 \\u043E\\u0442\\u043F\\u0443\\u0441\\u043A\n\n\n# XTIT: Title of Email to Employee on Business Card\nview.BusinessCard.Employee.Subject=\\u0412\\u0430\\u0448\\u0430 \\u0437\\u0430\\u044F\\u0432\\u043A\\u0430 \\u043D\\u0430 \\u043E\\u0442\\u0441\\u0443\\u0442\\u0441\\u0442\\u0432\\u0438\\u0435\\: {0}\n\n# XTIT: Shell title (shown within the UI as title of shell component, desktop only)\nshell.Identity=\\u0423\\u0442\\u0432\\u0435\\u0440\\u0436\\u0434\\u0435\\u043D\\u0438\\u0435 \\u0437\\u0430\\u044F\\u0432\\u043E\\u043A \\u043D\\u0430 \\u043E\\u0442\\u043F\\u0443\\u0441\\u043A\n\n# YMSG\ndialog.question.approve=\\u0423\\u0442\\u0432\\u0435\\u0440\\u0434\\u0438\\u0442\\u044C \\u0437\\u0430\\u044F\\u0432\\u043A\\u0443 \\u043D\\u0430 \\u043E\\u0442\\u043F\\u0443\\u0441\\u043A, \\u043F\\u043E\\u043B\\u0443\\u0447\\u0435\\u043D\\u043D\\u0443\\u044E \\u043E\\u0442 {0}?\n\n# YMSG\ndialog.question.reject=\\u041E\\u0442\\u043A\\u043B\\u043E\\u043D\\u0438\\u0442\\u044C \\u0437\\u0430\\u044F\\u0432\\u043A\\u0443 \\u043D\\u0430 \\u043E\\u0442\\u043F\\u0443\\u0441\\u043A, \\u043F\\u043E\\u043B\\u0443\\u0447\\u0435\\u043D\\u043D\\u0443\\u044E \\u043E\\u0442 {0}?\n\n# YMSG\ndialog.question.approvecancel=\\u0423\\u0442\\u0432\\u0435\\u0440\\u0434\\u0438\\u0442\\u044C \\u043E\\u0442\\u043C\\u0435\\u043D\\u0443, \\u043F\\u043E\\u043B\\u0443\\u0447\\u0435\\u043D\\u043D\\u0443\\u044E \\u043E\\u0442 {0}?\n\n# YMSG\ndialog.question.rejectcancel=\\u041E\\u0442\\u043A\\u043B\\u043E\\u043D\\u0438\\u0442\\u044C \\u043E\\u0442\\u043C\\u0435\\u043D\\u0443, \\u043F\\u043E\\u043B\\u0443\\u0447\\u0435\\u043D\\u043D\\u0443\\u044E \\u043E\\u0442 {0}?\n\n# YMSG\ndialog.success.approvecancel=\\u041E\\u0442\\u043C\\u0435\\u043D\\u0430 \\u0443\\u0442\\u0432\\u0435\\u0440\\u0436\\u0434\\u0435\\u043D\\u0430\n\n# YMSG\ndialog.success.rejectcancel=\\u041E\\u0442\\u043C\\u0435\\u043D\\u0430 \\u043E\\u0442\\u043A\\u043B\\u043E\\u043D\\u0435\\u043D\\u0430\n\n# YMSG\ndialog.success.approve=\\u0417\\u0430\\u044F\\u0432\\u043A\\u0430 \\u043D\\u0430 \\u043E\\u0442\\u043F\\u0443\\u0441\\u043A \\u0443\\u0442\\u0432\\u0435\\u0440\\u0436\\u0434\\u0435\\u043D\\u0430\n\n# YMSG\ndialog.success.reject=\\u0417\\u0430\\u044F\\u0432\\u043A\\u0430 \\u043D\\u0430 \\u043E\\u0442\\u043F\\u0443\\u0441\\u043A \\u043E\\u0442\\u043A\\u043B\\u043E\\u043D\\u0435\\u043D\\u0430\n\n# YMSG\ndialog.leave.overlaps.disclaimer=\\u041F\\u0435\\u0440\\u0435\\u043A\\u0440\\u044B\\u0442\\u0438\\u0435 \\u043E\\u0442\\u043F\\u0443\\u0441\\u043A\\u043E\\u0432 \\u0434\\u043B\\u044F {0} \\u043C\\u0435\\u0436\\u0434\\u0443 {1} \\u0438 {2}\n\n# YMSG: link to Team calendar\nutil.Conversions.OverlapsPlLink=\\u041F\\u043E\\u043A\\u0430\\u0437\\u0430\\u0442\\u044C \\u043A\\u0430\\u043B\\u0435\\u043D\\u0434\\u0430\\u0440\\u044C \\u0433\\u0440\\u0443\\u043F\\u043F\\u044B\n\n# XFLD: Status: Cancellation of a Leave Request requested \nview.Header.CancellationStatus=\\u0417\\u0430\\u043F\\u0440\\u043E\\u0448\\u0435\\u043D\\u0430 \\u043E\\u0442\\u043C\\u0435\\u043D\\u0430\n\n# XFLD: Status: Cancellation of a Leave Request requested \nview.List.CancellationStatus=\\u041E\\u0442\\u043C\\u0435\\u043D\\u0435\\u043D\\u043E\n\n#XBUT: Button for Approve action\nXBUT_APPROVE=\\u0423\\u0442\\u0432\\u0435\\u0440\\u0434\\u0438\\u0442\\u044C\n\n#XBUT: Button for Reject action\nXBUT_REJECT=\\u041E\\u0442\\u043A\\u043B\\u043E\\u043D\\u0438\\u0442\\u044C\n\n#XTIT: Title of the confirmation dialog while executing an action\nXTIT_APPROVAL=\\u0423\\u0442\\u0432\\u0435\\u0440\\u0434\\u0438\\u0442\\u044C\n\n#XTIT: Title of the confirmation dialog while executing an action\nXTIT_REJECT=\\u041E\\u0442\\u043A\\u043B\\u043E\\u043D\\u0438\\u0442\\u044C\n\n# YMSG: Loading\nLOADING=\\u0417\\u0430\\u0433\\u0440\\u0443\\u0437\\u043A\\u0430 ...\n\n# XTIT: Leave Request Details\nDETAIL_TITLE=\\u0417\\u0430\\u044F\\u0432\\u043A\\u0430 \\u043D\\u0430 \\u043E\\u0442\\u043F\\u0443\\u0441\\u043A\n\n# YMSG: No items are currently available\nNO_ITEMS_AVAILABLE=\\u041F\\u043E\\u0437\\u0438\\u0446\\u0438\\u0438 \\u043D\\u0435\\u0434\\u043E\\u0441\\u0442\\u0443\\u043F\\u043D\\u044B\n\n#XFLD: Label for Start Time\nALR_START_TIME=\\u0412\\u0440\\u0435\\u043C\\u044F \\u043D\\u0430\\u0447\\u0430\\u043B\\u0430\n\n#XFLD: Label for Start Time\nALR_END_TIME=\\u0412\\u0440\\u0435\\u043C\\u044F \\u043E\\u043A\\u043E\\u043D\\u0447\\u0430\\u043D\\u0438\\u044F\n',
	"hcm/approve/leaverequest/i18n/i18n_sh.properties":'\n# XFLD: number of absence days requested (e.g. two days)\nutil.Conversions.Days=Dani\n\n# XFLD: number of absence days requested (singular)\nutil.Conversions.Day_Singular=Dan\n\n# XFLD: number of absence hours requested (e.g. two hours)\nutil.Conversions.Hours=Sati\n\n# XFLD: number of absence hours requested (e.g. one hour, Singular!)\nutil.Conversions.Hour_Singular=Sat\n\n# XFLD: number of absence days requested (e.g. two days)\nutil.Conversions.Value_Days={0} dana\n\n# XFLD: number of absence days requested (singular)\nutil.Conversions.Value_Day_Singular={0} dan\n\n# XFLD: number of absence hours requested (e.g. two hours)\nutil.Conversions.Value_Hours={0} sati\n\n# XFLD: number of absence hours requested (e.g. one hour, Singular!)\nutil.Conversions.Value_Hour_Singular={0} sat\n\n# XFLD: Current Balance of the leave quote on Detail Screen\nview.AddInfo.CurrentBalance=Dostupno stanje\n\n# XFLD: Requested amount of the leave type on Detail Screen (e.g. Vacation Requested:  14 Days)\nview.AddInfo.Requested=Zahtevano\n\n# YMSG: information of existing overlaps of leave requests (e.g.  3 overlaps, Plural)\nutil.Conversions.OverlapsPl={0} Preklapanja\n\n# YMSG: information of existing overlaps of leave requests (e.g. 1 overlap, Singular)\nutil.Conversions.OverlapSing={0} Preklapanje\n\n# XFLD: Requested amount of the leave type on Confirm/Decline Popup (e.g. Request    14 days)\nview.Detail.Request=Zahtevano\n\n#XFLD: Label for Requested Time Duration\nview.Detail.FromTo=Od - do\n\n# YMSG: Alert message that current balance of leave request may not be accurate.\nview.AddInfo.AlertMessageBalanceNotAccurate=Ovo lice je nedavno podnelo druge zahteve za odsustvo; stanje mo\\u017Eda nije ta\\u010Dno\n\n# XSEL: status of Leave Request: approved\nview.Calendar.LegendApproved=Odobreno odsustvo\n\n# XSEL: status of Leave Request: working day\nview.Calendar.LegendWorkingDay=Radni dan\n\n# XSEL: status of Leave Request: Open Request\nview.Calendar.LegendPending=Odobrenje na \\u010Dekanju\n\n# XSEL: status of Leave Request: Non-working day (e.g. weekend)\nview.Calendar.LegendDayOff=Neradni dan\n\n# XSEL: status of Leave Request: Public Holiday\nview.Calendar.LegendHoliday=Dr\\u017Eavni praznik\n\n# XSEL: status of Leave Request: Today\nview.Calendar.LegendToday=Danas\n\n# XSEL: status of Leave Request:  other request types\nview.Calendar.LegendDeletionRequested=Drugi\n\n# YMSG: Toast message that approval of leave request was successful\nview.Toast.YMSG_LRA_Approved=Zahtev za odsustvo je odobren\n\n# YMSG: Toast message that reject of leave request was successful\nview.Toast.YMSG_LRA_Declined=Zahtev za odsustvo je odbijen\n\n# XTIT: Leave Request Details\nview.Detail.title=Zahtev za odsustvo\n\n# XTIT: Leave Request Details - Calendar\nview.Calendar.title=Kalendar\n\n# XTIT: Leave Type\nview.AddInfo.LeaveType=Tip odsustva\n\n# XTIT: Total Deduction\nview.AddInfo.Deduction=Ukupni odbitak\n\n# XTIT: Personel Number\nview.Header.EmployeeID=ID zaposlenog {0}\n\n# XTIT: Header text of Master List\nview.Master.title=Zahtevi za odsustvo ({0})\n\n# XTIT: Application name (shown in browser header bar or as browser tab title)\napp.Identity=Odobri zahteve za odsustvo\n\n\n# XTIT: Title of Email to Employee on Business Card\nview.BusinessCard.Employee.Subject=Va\\u0161 zahtev za odsustvo\\: {0}\n\n# XTIT: Shell title (shown within the UI as title of shell component, desktop only)\nshell.Identity=Odobri zahteve za odsustvo\n\n# YMSG\ndialog.question.approve=Odobriti zahtev za odsustvo koji je podneo {0}?\n\n# YMSG\ndialog.question.reject=Odbiti zahtev za odsustvo koji je podneo {0}?\n\n# YMSG\ndialog.question.approvecancel=Odobriti otkazivanje koje je podneo {0}?\n\n# YMSG\ndialog.question.rejectcancel=Odbiti otkazivanje koje je podneo {0}?\n\n# YMSG\ndialog.success.approvecancel=Otkazivanje je odobreno\n\n# YMSG\ndialog.success.rejectcancel=Otkazivanje je odbijeno\n\n# YMSG\ndialog.success.approve=Zahtev za odsustvo je odobren\n\n# YMSG\ndialog.success.reject=Zahtev za odsustvo je odbijen\n\n# YMSG\ndialog.leave.overlaps.disclaimer=Preklapanja odsustva za {0} izme\\u0111u {1} i {2}\n\n# YMSG: link to Team calendar\nutil.Conversions.OverlapsPlLink=Prika\\u017Ei kalendar tima\n\n# XFLD: Status: Cancellation of a Leave Request requested \nview.Header.CancellationStatus=Otkazivanje zahtevano\n\n# XFLD: Status: Cancellation of a Leave Request requested \nview.List.CancellationStatus=Otkazano\n\n#XBUT: Button for Approve action\nXBUT_APPROVE=Odobri\n\n#XBUT: Button for Reject action\nXBUT_REJECT=Odbij\n\n#XTIT: Title of the confirmation dialog while executing an action\nXTIT_APPROVAL=Odobri\n\n#XTIT: Title of the confirmation dialog while executing an action\nXTIT_REJECT=Odbij\n\n# YMSG: Loading\nLOADING=U\\u010Ditavanje ...\n\n# XTIT: Leave Request Details\nDETAIL_TITLE=Zahtev za odsustvo\n\n# YMSG: No items are currently available\nNO_ITEMS_AVAILABLE=Stavke nisu dostupne\n\n#XFLD: Label for Start Time\nALR_START_TIME=Vreme po\\u010Detka\n\n#XFLD: Label for Start Time\nALR_END_TIME=Vreme zavr\\u0161etka\n',
	"hcm/approve/leaverequest/i18n/i18n_sk.properties":'\n# XFLD: number of absence days requested (e.g. two days)\nutil.Conversions.Days=Dni\n\n# XFLD: number of absence days requested (singular)\nutil.Conversions.Day_Singular=De\\u0148\n\n# XFLD: number of absence hours requested (e.g. two hours)\nutil.Conversions.Hours=Hodiny\n\n# XFLD: number of absence hours requested (e.g. one hour, Singular!)\nutil.Conversions.Hour_Singular=Hodina\n\n# XFLD: number of absence days requested (e.g. two days)\nutil.Conversions.Value_Days={0} dn\\u00ED\n\n# XFLD: number of absence days requested (singular)\nutil.Conversions.Value_Day_Singular={0} de\\u0148\n\n# XFLD: number of absence hours requested (e.g. two hours)\nutil.Conversions.Value_Hours={0} hod\\u00EDn\n\n# XFLD: number of absence hours requested (e.g. one hour, Singular!)\nutil.Conversions.Value_Hour_Singular={0} hodina\n\n# XFLD: Current Balance of the leave quote on Detail Screen\nview.AddInfo.CurrentBalance=Dostupn\\u00FD zostatok\n\n# XFLD: Requested amount of the leave type on Detail Screen (e.g. Vacation Requested:  14 Days)\nview.AddInfo.Requested=Po\\u017Eadovan\\u00E9\n\n# YMSG: information of existing overlaps of leave requests (e.g.  3 overlaps, Plural)\nutil.Conversions.OverlapsPl={0} prekrytia\n\n# YMSG: information of existing overlaps of leave requests (e.g. 1 overlap, Singular)\nutil.Conversions.OverlapSing={0} prekrytie\n\n# XFLD: Requested amount of the leave type on Confirm/Decline Popup (e.g. Request    14 days)\nview.Detail.Request=Po\\u017Eadovan\\u00E9\n\n#XFLD: Label for Requested Time Duration\nview.Detail.FromTo=Od - do\n\n# YMSG: Alert message that current balance of leave request may not be accurate.\nview.AddInfo.AlertMessageBalanceNotAccurate=T\\u00E1to osoba u\\u017E odoslala \\u010Fal\\u0161ie \\u017Eiadosti o dovolenku. Zostatok nemus\\u00ED by\\u0165 presn\\u00FD.\n\n# XSEL: status of Leave Request: approved\nview.Calendar.LegendApproved=Schv\\u00E1len\\u00E1 dovolenka\n\n# XSEL: status of Leave Request: working day\nview.Calendar.LegendWorkingDay=Pracovn\\u00FD de\\u0148\n\n# XSEL: status of Leave Request: Open Request\nview.Calendar.LegendPending=Nevybaven\\u00E9 schv\\u00E1lenie\n\n# XSEL: status of Leave Request: Non-working day (e.g. weekend)\nview.Calendar.LegendDayOff=Nepracovn\\u00FD de\\u0148\n\n# XSEL: status of Leave Request: Public Holiday\nview.Calendar.LegendHoliday=Sviatok\n\n# XSEL: status of Leave Request: Today\nview.Calendar.LegendToday=Dnes\n\n# XSEL: status of Leave Request:  other request types\nview.Calendar.LegendDeletionRequested=In\\u00E9\n\n# YMSG: Toast message that approval of leave request was successful\nview.Toast.YMSG_LRA_Approved=\\u017Diados\\u0165 o dovolenku bola schv\\u00E1len\\u00E1\n\n# YMSG: Toast message that reject of leave request was successful\nview.Toast.YMSG_LRA_Declined=\\u017Diados\\u0165 o dovolenku bola zamietnut\\u00E1\n\n# XTIT: Leave Request Details\nview.Detail.title=\\u017Diados\\u0165 o dovolenku\n\n# XTIT: Leave Request Details - Calendar\nview.Calendar.title=Kalend\\u00E1r\n\n# XTIT: Leave Type\nview.AddInfo.LeaveType=Typ dovolenky\n\n# XTIT: Total Deduction\nview.AddInfo.Deduction=Celkov\\u00FD odpo\\u010Det\n\n# XTIT: Personel Number\nview.Header.EmployeeID=ID zamestnanca {0}\n\n# XTIT: Header text of Master List\nview.Master.title=\\u017Diadosti o dovolenku ({0})\n\n# XTIT: Application name (shown in browser header bar or as browser tab title)\napp.Identity=Schva\\u013Eovanie \\u017Eiadost\\u00ED o dovolenku\n\n\n# XTIT: Title of Email to Employee on Business Card\nview.BusinessCard.Employee.Subject=Va\\u0161a \\u017Eiados\\u0165 o dovolenku\\: {0}\n\n# XTIT: Shell title (shown within the UI as title of shell component, desktop only)\nshell.Identity=Schva\\u013Eovanie \\u017Eiadost\\u00ED o dovolenku\n\n# YMSG\ndialog.question.approve=Schv\\u00E1li\\u0165 \\u017Eiados\\u0165 o dovolenku, ktor\\u00FA podal {0}?\n\n# YMSG\ndialog.question.reject=Zamietnu\\u0165 \\u017Eiados\\u0165 o dovolenku, ktor\\u00FA podal {0}?\n\n# YMSG\ndialog.question.approvecancel=Schv\\u00E1li\\u0165 zru\\u0161enie, ktor\\u00E9 podal {0}?\n\n# YMSG\ndialog.question.rejectcancel=Zamietnu\\u0165 zru\\u0161enie, ktor\\u00E9 podal {0}?\n\n# YMSG\ndialog.success.approvecancel=Zru\\u0161enie bolo schv\\u00E1len\\u00E9\n\n# YMSG\ndialog.success.rejectcancel=Zru\\u0161enie bolo zamietnut\\u00E9\n\n# YMSG\ndialog.success.approve=\\u017Diados\\u0165 o dovolenku bola schv\\u00E1len\\u00E1\n\n# YMSG\ndialog.success.reject=\\u017Diados\\u0165 o dovolenku bola zamietnut\\u00E1\n\n# YMSG\ndialog.leave.overlaps.disclaimer=Dovolenka sa prekr\\u00FDva pre {0} medzi {1} a {2}\n\n# YMSG: link to Team calendar\nutil.Conversions.OverlapsPlLink=Zobrazi\\u0165 kalend\\u00E1r t\\u00EDmu\n\n# XFLD: Status: Cancellation of a Leave Request requested \nview.Header.CancellationStatus=Po\\u017Eadovan\\u00E9 zru\\u0161enie\n\n# XFLD: Status: Cancellation of a Leave Request requested \nview.List.CancellationStatus=Zru\\u0161en\\u00E9\n\n#XBUT: Button for Approve action\nXBUT_APPROVE=Schv\\u00E1li\\u0165\n\n#XBUT: Button for Reject action\nXBUT_REJECT=Zamietnu\\u0165\n\n#XTIT: Title of the confirmation dialog while executing an action\nXTIT_APPROVAL=Schv\\u00E1li\\u0165\n\n#XTIT: Title of the confirmation dialog while executing an action\nXTIT_REJECT=Zamietnu\\u0165\n\n# YMSG: Loading\nLOADING=Na\\u010D\\u00EDtava sa ...\n\n# XTIT: Leave Request Details\nDETAIL_TITLE=\\u017Diados\\u0165 o dovolenku\n\n# YMSG: No items are currently available\nNO_ITEMS_AVAILABLE=Nie s\\u00FA k dispoz\\u00EDcii \\u017Eiadne polo\\u017Eky\n\n#XFLD: Label for Start Time\nALR_START_TIME=\\u010Cas za\\u010Diatku\n\n#XFLD: Label for Start Time\nALR_END_TIME=\\u010Cas ukon\\u010Denia\n',
	"hcm/approve/leaverequest/i18n/i18n_sl.properties":'\n# XFLD: number of absence days requested (e.g. two days)\nutil.Conversions.Days=Dnevi\n\n# XFLD: number of absence days requested (singular)\nutil.Conversions.Day_Singular=Dan\n\n# XFLD: number of absence hours requested (e.g. two hours)\nutil.Conversions.Hours=Ure\n\n# XFLD: number of absence hours requested (e.g. one hour, Singular!)\nutil.Conversions.Hour_Singular=Ura\n\n# XFLD: number of absence days requested (e.g. two days)\nutil.Conversions.Value_Days={0} dni\n\n# XFLD: number of absence days requested (singular)\nutil.Conversions.Value_Day_Singular={0} dan\n\n# XFLD: number of absence hours requested (e.g. two hours)\nutil.Conversions.Value_Hours={0} ur\n\n# XFLD: number of absence hours requested (e.g. one hour, Singular!)\nutil.Conversions.Value_Hour_Singular={0} ura\n\n# XFLD: Current Balance of the leave quote on Detail Screen\nview.AddInfo.CurrentBalance=Razpolo\\u017Eljivost\n\n# XFLD: Requested amount of the leave type on Detail Screen (e.g. Vacation Requested:  14 Days)\nview.AddInfo.Requested=Zahtevano\n\n# YMSG: information of existing overlaps of leave requests (e.g.  3 overlaps, Plural)\nutil.Conversions.OverlapsPl={0} prekrivanja\n\n# YMSG: information of existing overlaps of leave requests (e.g. 1 overlap, Singular)\nutil.Conversions.OverlapSing={0} prekrivanj\n\n# XFLD: Requested amount of the leave type on Confirm/Decline Popup (e.g. Request    14 days)\nview.Detail.Request=Zahtevano\n\n#XFLD: Label for Requested Time Duration\nview.Detail.FromTo=Od - do\n\n# YMSG: Alert message that current balance of leave request may not be accurate.\nview.AddInfo.AlertMessageBalanceNotAccurate=Ta oseba je nedavno vlo\\u017Eila druge zahtevke za odsotnost; stanje morda ni to\\u010Dno\n\n# XSEL: status of Leave Request: approved\nview.Calendar.LegendApproved=Odobreni dopust\n\n# XSEL: status of Leave Request: working day\nview.Calendar.LegendWorkingDay=Delovni dan\n\n# XSEL: status of Leave Request: Open Request\nview.Calendar.LegendPending=\\u010Caka na odobritev\n\n# XSEL: status of Leave Request: Non-working day (e.g. weekend)\nview.Calendar.LegendDayOff=Dela prost dan\n\n# XSEL: status of Leave Request: Public Holiday\nview.Calendar.LegendHoliday=Praznik\n\n# XSEL: status of Leave Request: Today\nview.Calendar.LegendToday=Danes\n\n# XSEL: status of Leave Request:  other request types\nview.Calendar.LegendDeletionRequested=Drugo\n\n# YMSG: Toast message that approval of leave request was successful\nview.Toast.YMSG_LRA_Approved=Zahtevek za odsotnost je bil odobren\n\n# YMSG: Toast message that reject of leave request was successful\nview.Toast.YMSG_LRA_Declined=Zahtevek za odsotnost je bil zavrnjen\n\n# XTIT: Leave Request Details\nview.Detail.title=Zahtevek za odsotnost\n\n# XTIT: Leave Request Details - Calendar\nview.Calendar.title=Koledar\n\n# XTIT: Leave Type\nview.AddInfo.LeaveType=Vrsta dopusta\n\n# XTIT: Total Deduction\nview.AddInfo.Deduction=Skupni odbitek\n\n# XTIT: Personel Number\nview.Header.EmployeeID=ID zaposlenega {0}\n\n# XTIT: Header text of Master List\nview.Master.title=Zahteve za odsotnost ({0})\n\n# XTIT: Application name (shown in browser header bar or as browser tab title)\napp.Identity=Odobritev zahtevkov za odsotnost\n\n\n# XTIT: Title of Email to Employee on Business Card\nview.BusinessCard.Employee.Subject=Va\\u0161a zahteva za odsotnost\\: {0}\n\n# XTIT: Shell title (shown within the UI as title of shell component, desktop only)\nshell.Identity=Odobritev zahtevkov za odsotnost\n\n# YMSG\ndialog.question.approve=\\u017Delite odobriti zahtevo za odsotnost, ki jo je poslal {0}?\n\n# YMSG\ndialog.question.reject=\\u017Delite zavrniti zahtevo za odsotnost, ki jo je poslal {0}?\n\n# YMSG\ndialog.question.approvecancel=\\u017Delite odobriti preklic, ki ga je poslal {0}?\n\n# YMSG\ndialog.question.rejectcancel=\\u017Delite zavrniti preklic, ki ga je poslal {0}?\n\n# YMSG\ndialog.success.approvecancel=Odpoved je bila odobrena\n\n# YMSG\ndialog.success.rejectcancel=Odpoved je bila zavrnjena\n\n# YMSG\ndialog.success.approve=Zahtevek za odsotnost je bil odobren\n\n# YMSG\ndialog.success.reject=Zahtevek za odsotnost je bil zavrnjen\n\n# YMSG\ndialog.leave.overlaps.disclaimer=Dopust se prekriva za {0} med {1} in {2}\n\n# YMSG: link to Team calendar\nutil.Conversions.OverlapsPlLink=Prikaz koledarja skupine\n\n# XFLD: Status: Cancellation of a Leave Request requested \nview.Header.CancellationStatus=Zahtevana odpoved\n\n# XFLD: Status: Cancellation of a Leave Request requested \nview.List.CancellationStatus=Prekinjeno\n\n#XBUT: Button for Approve action\nXBUT_APPROVE=Odobritev\n\n#XBUT: Button for Reject action\nXBUT_REJECT=Zavrnitev\n\n#XTIT: Title of the confirmation dialog while executing an action\nXTIT_APPROVAL=Odobritev\n\n#XTIT: Title of the confirmation dialog while executing an action\nXTIT_REJECT=Zavrnitev\n\n# YMSG: Loading\nLOADING=Nalaganje ...\n\n# XTIT: Leave Request Details\nDETAIL_TITLE=Zahtevek za odsotnost\n\n# YMSG: No items are currently available\nNO_ITEMS_AVAILABLE=Ni razpolo\\u017Eljivih postavk\n\n#XFLD: Label for Start Time\nALR_START_TIME=\\u010Cas za\\u010Detka\n\n#XFLD: Label for Start Time\nALR_END_TIME=\\u010Cas konca\n',
	"hcm/approve/leaverequest/i18n/i18n_tr.properties":'\n# XFLD: number of absence days requested (e.g. two days)\nutil.Conversions.Days=G\\u00FCn\n\n# XFLD: number of absence days requested (singular)\nutil.Conversions.Day_Singular=G\\u00FCn\n\n# XFLD: number of absence hours requested (e.g. two hours)\nutil.Conversions.Hours=Saat\n\n# XFLD: number of absence hours requested (e.g. one hour, Singular!)\nutil.Conversions.Hour_Singular=Saat\n\n# XFLD: number of absence days requested (e.g. two days)\nutil.Conversions.Value_Days={0} g\\u00FCn\n\n# XFLD: number of absence days requested (singular)\nutil.Conversions.Value_Day_Singular={0} g\\u00FCn\n\n# XFLD: number of absence hours requested (e.g. two hours)\nutil.Conversions.Value_Hours={0} saat\n\n# XFLD: number of absence hours requested (e.g. one hour, Singular!)\nutil.Conversions.Value_Hour_Singular={0} saat\n\n# XFLD: Current Balance of the leave quote on Detail Screen\nview.AddInfo.CurrentBalance=Kullan\\u0131labilir bakiye\n\n# XFLD: Requested amount of the leave type on Detail Screen (e.g. Vacation Requested:  14 Days)\nview.AddInfo.Requested=Talep edilen\n\n# YMSG: information of existing overlaps of leave requests (e.g.  3 overlaps, Plural)\nutil.Conversions.OverlapsPl={0} \\u00C7ak\\u0131\\u015Fmalar\n\n# YMSG: information of existing overlaps of leave requests (e.g. 1 overlap, Singular)\nutil.Conversions.OverlapSing={0} \\u00C7ak\\u0131\\u015Fma\n\n# XFLD: Requested amount of the leave type on Confirm/Decline Popup (e.g. Request    14 days)\nview.Detail.Request=Talep edilen\n\n#XFLD: Label for Requested Time Duration\nview.Detail.FromTo=Ba\\u015Flang\\u0131\\u00E7 - Biti\\u015F\n\n# YMSG: Alert message that current balance of leave request may not be accurate.\nview.AddInfo.AlertMessageBalanceNotAccurate=Bu ki\\u015Fi daha \\u00F6nce ba\\u015Fka izin talepleri g\\u00F6nderdi; bakiye do\\u011Fru olmayabilir\n\n# XSEL: status of Leave Request: approved\nview.Calendar.LegendApproved=Onaylanan izin\n\n# XSEL: status of Leave Request: working day\nview.Calendar.LegendWorkingDay=\\u0130\\u015Fg\\u00FCn\\u00FC\n\n# XSEL: status of Leave Request: Open Request\nview.Calendar.LegendPending=Onay beklemede\n\n# XSEL: status of Leave Request: Non-working day (e.g. weekend)\nview.Calendar.LegendDayOff=\\u0130\\u015Fg\\u00FCn\\u00FC de\\u011Fil\n\n# XSEL: status of Leave Request: Public Holiday\nview.Calendar.LegendHoliday=Resmi tatil\n\n# XSEL: status of Leave Request: Today\nview.Calendar.LegendToday=Bug\\u00FCn\n\n# XSEL: status of Leave Request:  other request types\nview.Calendar.LegendDeletionRequested=Di\\u011Ferleri\n\n# YMSG: Toast message that approval of leave request was successful\nview.Toast.YMSG_LRA_Approved=\\u0130zin talebi onayland\\u0131\n\n# YMSG: Toast message that reject of leave request was successful\nview.Toast.YMSG_LRA_Declined=\\u0130zin talebi reddedildi\n\n# XTIT: Leave Request Details\nview.Detail.title=\\u0130zin talebi\n\n# XTIT: Leave Request Details - Calendar\nview.Calendar.title=Takvim\n\n# XTIT: Leave Type\nview.AddInfo.LeaveType=\\u0130zin t\\u00FCr\\u00FC\n\n# XTIT: Total Deduction\nview.AddInfo.Deduction=Toplam kesinti\n\n# XTIT: Personel Number\nview.Header.EmployeeID=\\u00C7al\\u0131\\u015Fan tan\\u0131t\\u0131c\\u0131s\\u0131 {0}\n\n# XTIT: Header text of Master List\nview.Master.title=\\u0130zin talepleri ({0})\n\n# XTIT: Application name (shown in browser header bar or as browser tab title)\napp.Identity=\\u0130zin taleplerini onayla\n\n\n# XTIT: Title of Email to Employee on Business Card\nview.BusinessCard.Employee.Subject=\\u0130zin talebiniz\\: {0}\n\n# XTIT: Shell title (shown within the UI as title of shell component, desktop only)\nshell.Identity=\\u0130zin taleplerini onayla\n\n# YMSG\ndialog.question.approve={0} taraf\\u0131ndan g\\u00F6nderilen izin talebi onaylans\\u0131n m\\u0131?\n\n# YMSG\ndialog.question.reject={0} taraf\\u0131ndan g\\u00F6nderilen izin talebi reddedilsin mi?\n\n# YMSG\ndialog.question.approvecancel={0} taraf\\u0131ndan g\\u00F6nderilen iptal onaylans\\u0131n m\\u0131?\n\n# YMSG\ndialog.question.rejectcancel={0} taraf\\u0131ndan g\\u00F6nderilen iptal reddedilsin mi?\n\n# YMSG\ndialog.success.approvecancel=\\u0130ptal onayland\\u0131\n\n# YMSG\ndialog.success.rejectcancel=\\u0130ptal reddedildi\n\n# YMSG\ndialog.success.approve=\\u0130zin talebi onayland\\u0131\n\n# YMSG\ndialog.success.reject=\\u0130zin talebi reddedildi\n\n# YMSG\ndialog.leave.overlaps.disclaimer={0} i\\u00E7in {1} ve {2} aras\\u0131nda izin \\u00E7ak\\u0131\\u015F\\u0131yor\n\n# YMSG: link to Team calendar\nutil.Conversions.OverlapsPlLink=Ekip takvimini g\\u00F6ster\n\n# XFLD: Status: Cancellation of a Leave Request requested \nview.Header.CancellationStatus=\\u0130ptal talep edildi\n\n# XFLD: Status: Cancellation of a Leave Request requested \nview.List.CancellationStatus=\\u0130ptal edildi\n\n#XBUT: Button for Approve action\nXBUT_APPROVE=Onayla\n\n#XBUT: Button for Reject action\nXBUT_REJECT=Reddet\n\n#XTIT: Title of the confirmation dialog while executing an action\nXTIT_APPROVAL=Onayla\n\n#XTIT: Title of the confirmation dialog while executing an action\nXTIT_REJECT=Reddet\n\n# YMSG: Loading\nLOADING=Y\\u00FCkleniyor ...\n\n# XTIT: Leave Request Details\nDETAIL_TITLE=\\u0130zin talebi\n\n# YMSG: No items are currently available\nNO_ITEMS_AVAILABLE=Kalem mevcut de\\u011Fil\n\n#XFLD: Label for Start Time\nALR_START_TIME=Ba\\u015Flang\\u0131\\u00E7 saati\n\n#XFLD: Label for Start Time\nALR_END_TIME=Biti\\u015F saati\n',
	"hcm/approve/leaverequest/i18n/i18n_zh_CN.properties":'\n# XFLD: number of absence days requested (e.g. two days)\nutil.Conversions.Days=\\u5929\n\n# XFLD: number of absence days requested (singular)\nutil.Conversions.Day_Singular=\\u5929\n\n# XFLD: number of absence hours requested (e.g. two hours)\nutil.Conversions.Hours=\\u5C0F\\u65F6\n\n# XFLD: number of absence hours requested (e.g. one hour, Singular!)\nutil.Conversions.Hour_Singular=\\u5C0F\\u65F6\n\n# XFLD: number of absence days requested (e.g. two days)\nutil.Conversions.Value_Days={0} \\u5929\n\n# XFLD: number of absence days requested (singular)\nutil.Conversions.Value_Day_Singular={0} \\u5929\n\n# XFLD: number of absence hours requested (e.g. two hours)\nutil.Conversions.Value_Hours={0} \\u5C0F\\u65F6\n\n# XFLD: number of absence hours requested (e.g. one hour, Singular!)\nutil.Conversions.Value_Hour_Singular={0} \\u5C0F\\u65F6\n\n# XFLD: Current Balance of the leave quote on Detail Screen\nview.AddInfo.CurrentBalance=\\u53EF\\u7528\\u5269\\u4F59\\u4F11\\u5047\n\n# XFLD: Requested amount of the leave type on Detail Screen (e.g. Vacation Requested:  14 Days)\nview.AddInfo.Requested=\\u5DF2\\u7533\\u8BF7\n\n# YMSG: information of existing overlaps of leave requests (e.g.  3 overlaps, Plural)\nutil.Conversions.OverlapsPl={0} \\u5904\\u91CD\\u53E0\n\n# YMSG: information of existing overlaps of leave requests (e.g. 1 overlap, Singular)\nutil.Conversions.OverlapSing={0} \\u5904\\u91CD\\u53E0\n\n# XFLD: Requested amount of the leave type on Confirm/Decline Popup (e.g. Request    14 days)\nview.Detail.Request=\\u5DF2\\u7533\\u8BF7\n\n#XFLD: Label for Requested Time Duration\nview.Detail.FromTo=\\u4ECE - \\u81F3\n\n# YMSG: Alert message that current balance of leave request may not be accurate.\nview.AddInfo.AlertMessageBalanceNotAccurate=\\u6B64\\u4EBA\\u6700\\u8FD1\\u63D0\\u4EA4\\u8FC7\\u5176\\u4ED6\\u4F11\\u5047\\u7533\\u8BF7\\uFF1B\\u5269\\u4F59\\u4F11\\u5047\\u5929\\u6570\\u53EF\\u80FD\\u4E0D\\u51C6\\u786E\n\n# XSEL: status of Leave Request: approved\nview.Calendar.LegendApproved=\\u5DF2\\u6279\\u51C6\\u4F11\\u5047\n\n# XSEL: status of Leave Request: working day\nview.Calendar.LegendWorkingDay=\\u5DE5\\u4F5C\\u65E5\n\n# XSEL: status of Leave Request: Open Request\nview.Calendar.LegendPending=\\u5F85\\u5BA1\\u6279\n\n# XSEL: status of Leave Request: Non-working day (e.g. weekend)\nview.Calendar.LegendDayOff=\\u975E\\u5DE5\\u4F5C\\u65E5\n\n# XSEL: status of Leave Request: Public Holiday\nview.Calendar.LegendHoliday=\\u6CD5\\u5B9A\\u5047\\u65E5\n\n# XSEL: status of Leave Request: Today\nview.Calendar.LegendToday=\\u4ECA\\u5929\n\n# XSEL: status of Leave Request:  other request types\nview.Calendar.LegendDeletionRequested=\\u5176\\u4ED6\n\n# YMSG: Toast message that approval of leave request was successful\nview.Toast.YMSG_LRA_Approved=\\u5DF2\\u6279\\u51C6\\u4F11\\u5047\\u7533\\u8BF7\n\n# YMSG: Toast message that reject of leave request was successful\nview.Toast.YMSG_LRA_Declined=\\u5DF2\\u62D2\\u7EDD\\u4F11\\u5047\\u7533\\u8BF7\n\n# XTIT: Leave Request Details\nview.Detail.title=\\u4F11\\u5047\\u7533\\u8BF7\n\n# XTIT: Leave Request Details - Calendar\nview.Calendar.title=\\u65E5\\u5386\n\n# XTIT: Leave Type\nview.AddInfo.LeaveType=\\u4F11\\u5047\\u7C7B\\u578B\n\n# XTIT: Total Deduction\nview.AddInfo.Deduction=\\u603B\\u6263\\u51CF\n\n# XTIT: Personel Number\nview.Header.EmployeeID=\\u5458\\u5DE5\\u6807\\u8BC6 {0}\n\n# XTIT: Header text of Master List\nview.Master.title=\\u4F11\\u5047\\u7533\\u8BF7 ({0})\n\n# XTIT: Application name (shown in browser header bar or as browser tab title)\napp.Identity=\\u5BA1\\u6279\\u4F11\\u5047\\u7533\\u8BF7\n\n\n# XTIT: Title of Email to Employee on Business Card\nview.BusinessCard.Employee.Subject=\\u60A8\\u7684\\u4F11\\u5047\\u7533\\u8BF7\\uFF1A{0}\n\n# XTIT: Shell title (shown within the UI as title of shell component, desktop only)\nshell.Identity=\\u5BA1\\u6279\\u4F11\\u5047\\u7533\\u8BF7\n\n# YMSG\ndialog.question.approve=\\u662F\\u5426\\u6279\\u51C6 {0} \\u63D0\\u4EA4\\u7684\\u4F11\\u5047\\u7533\\u8BF7\\uFF1F\n\n# YMSG\ndialog.question.reject=\\u662F\\u5426\\u62D2\\u7EDD {0} \\u63D0\\u4EA4\\u7684\\u4F11\\u5047\\u7533\\u8BF7\\uFF1F\n\n# YMSG\ndialog.question.approvecancel=\\u662F\\u5426\\u6279\\u51C6 {0} \\u63D0\\u4EA4\\u7684\\u53D6\\u6D88\\u8BF7\\u6C42\\uFF1F\n\n# YMSG\ndialog.question.rejectcancel=\\u662F\\u5426\\u62D2\\u7EDD {0} \\u63D0\\u4EA4\\u7684\\u53D6\\u6D88\\u8BF7\\u6C42\\uFF1F\n\n# YMSG\ndialog.success.approvecancel=\\u5DF2\\u6279\\u51C6\\u53D6\\u6D88\n\n# YMSG\ndialog.success.rejectcancel=\\u5DF2\\u62D2\\u7EDD\\u53D6\\u6D88\n\n# YMSG\ndialog.success.approve=\\u5DF2\\u6279\\u51C6\\u4F11\\u5047\\u7533\\u8BF7\n\n# YMSG\ndialog.success.reject=\\u5DF2\\u62D2\\u7EDD\\u4F11\\u5047\\u7533\\u8BF7\n\n# YMSG\ndialog.leave.overlaps.disclaimer={1} \\u5230 {2} \\u4E4B\\u95F4 {0} \\u4F11\\u5047\\u91CD\\u53E0\n\n# YMSG: link to Team calendar\nutil.Conversions.OverlapsPlLink=\\u663E\\u793A\\u56E2\\u961F\\u65E5\\u5386\n\n# XFLD: Status: Cancellation of a Leave Request requested \nview.Header.CancellationStatus=\\u5DF2\\u7533\\u8BF7\\u53D6\\u6D88\n\n# XFLD: Status: Cancellation of a Leave Request requested \nview.List.CancellationStatus=\\u5DF2\\u53D6\\u6D88\n\n#XBUT: Button for Approve action\nXBUT_APPROVE=\\u6279\\u51C6\n\n#XBUT: Button for Reject action\nXBUT_REJECT=\\u62D2\\u7EDD\n\n#XTIT: Title of the confirmation dialog while executing an action\nXTIT_APPROVAL=\\u6279\\u51C6\n\n#XTIT: Title of the confirmation dialog while executing an action\nXTIT_REJECT=\\u62D2\\u7EDD\n\n# YMSG: Loading\nLOADING=\\u52A0\\u8F7D\\u4E2D...\n\n# XTIT: Leave Request Details\nDETAIL_TITLE=\\u4F11\\u5047\\u7533\\u8BF7\n\n# YMSG: No items are currently available\nNO_ITEMS_AVAILABLE=\\u65E0\\u53EF\\u7528\\u9879\\u76EE\n\n#XFLD: Label for Start Time\nALR_START_TIME=\\u5F00\\u59CB\\u65F6\\u95F4\n\n#XFLD: Label for Start Time\nALR_END_TIME=\\u7ED3\\u675F\\u65F6\\u95F4\n',
	"hcm/approve/leaverequest/util/CalendarServices.js":function(){/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.declare("hcm.approve.leaverequest.util.CalendarServices");
jQuery.sap.require("hcm.approve.leaverequest.util.Conversions");
jQuery.sap.require("sap.ca.ui.model.format.DateFormat");

hcm.approve.leaverequest.util.CalendarServices = (function() {
	"use strict";
	var oCurrRequestParam = {},
		oCalData = {},
		oAppModel = null,
		sCalStartDate = null,
		oCalModel = new sap.ui.model.json.JSONModel(oCalData);
	oCurrRequestParam.RequestID = "4711";
	oCurrRequestParam.ReqOrigin = "";
	oCurrRequestParam.StartDate = "1970-01-01T00:00:00";
	oCurrRequestParam.EndDate = "1970-01-01T00:00:00";

	return {
		checkLoadRequired: function(oReqStartDate, oReqEndDate) {
			var oReqStartMS = oReqStartDate.getTime(),
				oReqEndMS = oReqEndDate.getTime(),
				calData = oCalModel.getData(),
				oDateFormat = sap.ca.ui.model.format.DateFormat.getDateTimeInstance({
					pattern: "yyyy-MM-dd'T'HH:mm:ss"
				}),
				oDataStart = calData[oCurrRequestParam.RequestID].range.StartDate,
				oDataEnd = calData[oCurrRequestParam.RequestID].range.EndDate,
				oDataStartMS = oDateFormat.parse(oDataStart).getTime(),
				oDataEndMS = oDateFormat.parse(oDataEnd).getTime(),
				oDataStatus = {};
			oDataStatus.bLoadReq = false;
			oDataStatus.bLoadBefore = false;
			oDataStatus.StartDate = oDataStart;
			oDataStatus.EndDate = oDataEnd;

			if (!calData[oCurrRequestParam.RequestID]) {
				// ideally does not happen
				return;
			}
			// evaluate cases
			if (oReqStartMS > oDataStartMS && oReqEndMS < oDataEndMS) {
				oDataStatus.bLoadReq = false;
				oDataStatus.bLoadBefore = false;
			} else if (oReqEndMS > oDataEndMS) {
				oDataStatus.bLoadReq = true;
				oDataStatus.bLoadBefore = false;
			} else if (oReqStartMS < oDataStartMS) {
				oDataStatus.bLoadReq = true;
				oDataStatus.bLoadBefore = true;
			} else {
				oDataStatus.bLoadReq = false;
				oDataStatus.bLoadBefore = false;
			}
			return oDataStatus;
		},

		getTimeframe: function(oValue, bExtendBefore) {
			var oDateRange = {},
				oStartDate = new Date(),
				oEndDate = new Date(),
				oDateFormat = sap.ca.ui.model.format.DateFormat.getDateTimeInstance({
					pattern: "yyyy-MM-dd'T'HH:mm:ss"
				}),
				oDate,
				oMS,
				oStartMS,
				oEndMS;
			oDateRange.StartDate = "1970-01-01T00:00:00";
			oDateRange.EndDate = "1970-01-01T00:00:00";
			if (oValue instanceof Date) {
				oDate = oValue;
			} else if (typeof oValue === "string") {
				oDate = oDateFormat.parse(oValue);
			} else {
				return;
			}

			// correction for timezone
			oMS = oDate.getTime();

			if (bExtendBefore === null) {
				// subtract 1 week for start / add 3 weeks for end
				oMS = oDate.getTime();
				oStartMS = oMS - (7 * 24 * 60 * 60 * 1000); // +
				// oTimezoneOffset;
				oEndMS = oMS + (21 * 24 * 60 * 60 * 1000); // +
				// oTimezoneOffset;
				oStartDate.setTime(oStartMS);
				oEndDate.setTime(oEndMS);

				oDateRange.StartDate = oDateFormat.format(oStartDate, false);
				oDateRange.EndDate = oDateFormat.format(oEndDate, false);
			} else if (bExtendBefore === false) {
				// add another 2 weeks to the existing data in the future -
				// timezone offset missing

				oDateRange.StartDate = oValue;

				oMS = oDate.getTime();
				oEndMS = oMS + (14 * 24 * 60 * 60 * 1000);
				oEndDate.setTime(oEndMS);
				oDateRange.EndDate = oDateFormat.format(oEndDate, false);

			} else if (bExtendBefore === true) {
				// add another 2 weeks to the existing data in the past-
				// timezone offset missing

				oDateRange.EndDate = oValue;

				oMS = oDate.getTime();
				oStartMS = oMS - (14 * 24 * 60 * 60 * 1000);
				oStartDate.setTime(oStartMS);
				oDateRange.StartDate = oDateFormat.format(oStartDate, false);
			}
			return oDateRange;
		},

		readCalData: function(sRequestID, oDate, bExtendBefore, sOrigin) {

			// para1: sRequestID (if provided: 'no extend' case
			// para2: sDate (only considered if 'no extend' case)
			// para3: bBefore: 'extend' case - direction considered for calc of
			// new daterange
			var sCalUrl, oThisDateRange, checkCalData, sOriginInfix, thisCalData, collection, calData, sRefDate;
			var oRequestedData = null;

			if (bExtendBefore === null) {
				// calendar should exchange its data (new leadselection in
				// list)
				oCurrRequestParam.RequestID = sRequestID;
				oCurrRequestParam.ReqOrigin = sOrigin;
				oThisDateRange = this.getTimeframe(oDate, null);

				oCurrRequestParam.RequestID = sRequestID;
				oCurrRequestParam.StartDate = oThisDateRange.StartDate;
				oCurrRequestParam.EndDate = oThisDateRange.EndDate;

				// check if data (requestID) is already available:
				checkCalData = oCalModel.getData();
				if (!checkCalData[oCurrRequestParam.RequestID]) {

					sOriginInfix = oCurrRequestParam.ReqOrigin ? "',SAP__Origin='" + oCurrRequestParam.ReqOrigin : "";
					sCalUrl = "/TeamCalendarSet"; //(StartDate=datetime'" + oCurrRequestParam.StartDate + "',EndDate=datetime'" + oCurrRequestParam.EndDate + "',RequestID='" + oCurrRequestParam.RequestID + "')";

					if (oAppModel) {
						oAppModel.read(sCalUrl, undefined, false,
							function(oData) {
								oRequestedData = oData;
							});
					}

					// create CalData
					thisCalData = oCalModel.getData();
					thisCalData[oCurrRequestParam.RequestID] = {};
					thisCalData[oCurrRequestParam.RequestID].range = {};
					thisCalData[oCurrRequestParam.RequestID].range.StartDate = oCurrRequestParam.StartDate;
					thisCalData[oCurrRequestParam.RequestID].range.EndDate = oCurrRequestParam.EndDate;
					thisCalData[oCurrRequestParam.RequestID].events = [];

					if (oRequestedData) {
						collection = oRequestedData.TeamCalendar.results;

						thisCalData[oCurrRequestParam.RequestID].events = collection;

						oCalModel.setData(thisCalData);
					} else {
						return;
					}

				}
			} else {
				// read in the past or in the future and extend existing model
				// check existing range from model
				calData = oCalModel.getData();
				if (calData[oCurrRequestParam.RequestID]) {

					if (bExtendBefore) {
						sRefDate = calData[oCurrRequestParam.RequestID].range.StartDate;
						// calculate new dates and set to the model
						oThisDateRange = this.getTimeframe(sRefDate,
							bExtendBefore);
						calData[oCurrRequestParam.RequestID].range.StartDate = oThisDateRange.StartDate;

					} else {
						sRefDate = calData[oCurrRequestParam.RequestID].range.EndDate;
						// calculate new dates and set to the model
						oThisDateRange = this.getTimeframe(sRefDate,
							bExtendBefore);
						calData[oCurrRequestParam.RequestID].range.EndDate = oThisDateRange.EndDate;
					}

					oCurrRequestParam.StartDate = oThisDateRange.StartDate;
					oCurrRequestParam.EndDate = oThisDateRange.EndDate;

				}

				sOriginInfix = oCurrRequestParam.ReqOrigin ? "',SAP__Origin='" + oCurrRequestParam.ReqOrigin : "";
				sCalUrl = "/TeamCalendarHeaderCollection(StartDate=datetime'" + oCurrRequestParam.StartDate + "',EndDate=datetime'" +
					oCurrRequestParam.EndDate + "',RequestID='" + oCurrRequestParam.RequestID + sOriginInfix + "',FilterLeaves=false)";

				if (oAppModel) {
					oAppModel.read(sCalUrl, undefined, ["$expand=TeamCalendar"], false,
						function(oData) {
							oRequestedData = oData;
						});
				}

				if (oRequestedData) {
					collection = oRequestedData.TeamCalendar.results;
					for (var i = 0; i < collection.length; i++) {
						calData[oCurrRequestParam.RequestID].events.push(collection[i]);
					}
					oCalModel.setData(calData);
				} else {
					return;
				}
			}

		},

		setAppModel: function(model) {
			if (model) {
				oAppModel = model;
			}
		},

		getAppModel: function() {
			return oAppModel;
		},

		getLeadRequestID: function() {
			return oCurrRequestParam.RequestID;
		},

		getCalModel: function() {
			return oCalModel;
		},

		clearCalData: function() {
			// clear calendar buffer (necessary because calendar entries
			// become outdated after approval/decline...)
			// create CalData
			var initCalData = {};

			oCalModel.setData(initCalData);
		},

		setCalStartDate: function(oDate) {
			var oDateFormat = sap.ca.ui.model.format.DateFormat.getDateTimeInstance({
				pattern: "yyyy-MM-dd'T'HH:mm:ss"
			});
			sCalStartDate = oDateFormat.format(oDate, false);
		},

		getCalStartDate: function() {
			return sCalStartDate;
		},

		setDateType: function(oValue) {

			var oDate = null;
			var oDateFormat = sap.ca.ui.model.format.DateFormat.getDateTimeInstance({
				pattern: "yyyy-MM-dd'T'HH:mm:ss"
			});

			oDate = oDateFormat.format(new Date(oValue), true);

			return oDate;

		},
		dateFormatter: function(formatdate) {

			var oFormatter = sap.ui.core.format.DateFormat.getDateInstance({
				style: "medium",
				pattern: "dd-MM-yyyy" //FA 2311921
			});
			var oFormatDate = new Date(formatdate);

			if (oFormatDate) {
				return oFormatter.format(oFormatDate, true);
			}
			return "";
		},
//FA 2311921<<
		stringdateToobject: function (stringdate){
				var mon = stringdate.substr(3,2);
                mon = parseInt(mon, 10) - 1;
                var year = stringdate.substr(6,4);
                var date = stringdate.substr(0,2);
                return new Date(year, mon, date);
		}
//FA 2311921>>		

	};

}());
},
	"hcm/approve/leaverequest/util/Conversions.js":function(){/*
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
},
	"hcm/approve/leaverequest/util/NumberFormatter.js":function(){/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.declare("hcm.approve.leaverequest.util.NumberFormatter");
jQuery.sap.require("sap.ca.ui.model.format.NumberFormat");

hcm.approve.leaverequest.util.NumberFormatter = (function() {
	"use strict";
	return {
		// strips unwanted leading or ending zeros
		formatNumberStripZeros: function(number) {
			var numberFormatter = sap.ca.ui.model.format.NumberFormat.getInstance();
			numberFormatter.oFormatOptions.decimals = 2;
			if (typeof number === "string") {
				return numberFormatter.format(Number(number));
			}
			return numberFormatter.format(number);
		},
		formatNumberStripZerosDays: function(number) {
			var numberFormatter = sap.ca.ui.model.format.NumberFormat.getInstance();
			numberFormatter.oFormatOptions.decimals = 0;
			if (typeof number === "string") {
				return numberFormatter.format(Number(number));
			}
			return numberFormatter.format(number);
		}
	};
}());
},
	"hcm/approve/leaverequest/view/S2.controller.js":function(){/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.require("hcm.approve.leaverequest.util.Conversions");
jQuery.sap.require("sap.ca.scfld.md.controller.ScfldMasterController");
jQuery.sap.require("sap.ca.ui.message.message");
/*global hcm:true*/
sap.ca.scfld.md.controller.ScfldMasterController.extend("hcm.approve.leaverequest.view.S2", {
	extHookChangeFooterButtons: null,
	onInit: function() {
		"use strict";
		this.resourceBundle = this.oApplicationFacade.getResourceBundle();
		this.oDataModel = this.oApplicationFacade.getODataModel();
		this._getData();
		this.registerMasterListBind(this.getList());
		this.aRequestFilterList = [];
		var sComponentId = sap.ui.core.Component.getOwnerIdFor(this.getView());
		var oComponent = sap.ui.component(sComponentId);
		oComponent.oEventBus.subscribe("hcm.approve.leaverequest", "leaveRequestApproveReject", this._handleApproveRejectCallBack, this);
		this.oRouter.attachRoutePatternMatched(function(oEvent) {
			if (oEvent.getParameter("name") === "detail") {
				var sBindingContextPath = this.getBindingContextPathFor(oEvent.getParameter("arguments"));
				var oItem = this.findItemByContextPath(sBindingContextPath);
				var oList = this.getList();
				var aListItems = oList.getItems().filter(function(element, index, array) { // remove invisible items
					return element.getVisible();
				});
				// Find the item that will be displayed next (e.g. if this one is approved)
				if(aListItems.length >= 2) { // At least two items, determine next item to be selected (after approve/reject)
					var iIndex = oList.indexOfItem(oItem);
					if(iIndex + 1 < aListItems.length) { // Still a next item? Mark this one
						this.oApplicationFacade._sNextDetailPath = aListItems[iIndex + 1].getBindingContext(this.sModelName).getPath();
					} else { // No next item? Keep selection at the same position
						this.oApplicationFacade._sNextDetailPath = aListItems[iIndex - 1].getBindingContext(this.sModelName).getPath();
					}
				} else {
					this.oApplicationFacade._sNextDetailPath = null;
				}
			}
		}, this);
	},
	
	/**
	 * @param {string} sFilterPattern
	 *     The content of the search field.
	 * @return {number}
	 *     The number of list items still visible.
	 * @override
	 */
	applySearchPattern: function(sFilterPattern) {
		// This function needs to be overwritten, in order to overrule the default counting of items. With an emtpy filter pattern,
		// the item count above the list does not reflect hidden items. Therefore call the parent implementation, but overwrite the
		// way it counts the items.
		this.iCount = 0;
		sap.ca.scfld.md.controller.ScfldMasterController.prototype.applySearchPattern.call(this, sFilterPattern);
		return this.iCount;
	},
	
	/**
	 * @param {object} oItem
	 *    The item to be tested.
	 * @param {string} sFilterPattern
	 *    The filter pattern.
	 * @returns {boolean}
	 *    Returns <code>true</code> if the item matches to the current filter pattern.
	 * @override
	 */
	applySearchPatternToListItem: function(oItem, sFilterPattern) {
		var oData = this.oDataModel.getProperty(oItem.getBindingContext().sPath);
		if(this.aRequestFilterList.indexOf(oData.RequestId) !== -1) {
			// Found in filter list, set to hidden
			return false;
		}
		// ..else use super implementation to respect user searches (but count visibility separately)
		var visible = sap.ca.scfld.md.controller.ScfldMasterController.prototype.applySearchPatternToListItem.call(this, oItem, sFilterPattern);
		if(visible) {
			this.iCount++;
		}
		return visible;
	},

	/**
	 * On master list loaded
	 * @return {void}
	 */
	onDataLoaded: function() {
		// Reset hidden item filter
		this.aRequestFilterList = [];
		
		if (this.getList().getItems().length < 1) {
			if (!sap.ui.Device.system.phone) {
				this.showEmptyView("DETAIL_TITLE", "NO_ITEMS_AVAILABLE");
			}
		}
	},

	_handleApproveRejectCallBack: function(sChannelId, sEventId, oData) {
		"use strict";
		// Select the next item
		var oItem = this.findItemByContextPath(this.oApplicationFacade._sNextDetailPath);
		if (oItem) {
			this.setListItem(oItem);
		} else {
			if (this.getList().getItems().length > 1) {
				this.selectFirstItem();
			} else {
				this.showEmptyView("DETAIL_TITLE", "NO_ITEMS_AVAILABLE");
			}
		}
		
		// Note 2286172
		// Set a filter on the master list, to hide the item that just was approved and trigger the master list filtering
		this.aRequestFilterList.push(oData.RequestId);
		this._applyClientSideSearch();
	},

	/**
	 * Get master data and bind items
	 * @return {void}
	 */
	_getData: function() {
		"use strict";
		var oList = this.getList(),
			oTemplate = oList.getItems()[0].clone(),
			mParameters = {},
			that = this;
		oList.bindItems("/LeaveRequestSet", oTemplate);
	},

	/**
	 *  Define header & footer options
	 *  @return {object} objHdrFtr Object header footer
	 */
	getHeaderFooterOptions: function() {
		"use strict";
		var objHdrFtr = {
			sI18NMasterTitle: "view.Master.title"
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
		 * @callback hcm.approve.leaverequest.view.S2~extHookChangeFooterButtons
		 * @param {object} Header Footer Object
		 * @return {object} Header Footer Object
		 */

		if (this.extHookChangeFooterButtons) {
			objHdrFtr = this.extHookChangeFooterButtons(objHdrFtr);
		}
		return objHdrFtr;

	},

	/**
	 * handler for list row swipe for approval
	 * @return {void}
	 */
	_handleListSwipe: function() {
		"use strict";
		var that = this;
		var oList = this.getList(),
			oSwipeListItem = oList.getSwipedItem(),
			oContext = oSwipeListItem.getBindingContext(),
			sOrigin = oContext.getProperty("SAP__Origin"),
			sRequestID = oContext.getProperty("RequestId"),
			iVersion = oContext.getProperty("Version"),
			sDecision = "PREPARE_APPROVE",
			sTextKey = "dialog.success.approve",
			mParameters = {};
		oList.swipeOut();
		var sPath = "ApplyLeaveRequestDecision?RequestId='" + sRequestID + "'&Version=" + iVersion + "&Comment=''" +
			"&Decision='" + sDecision + "'";
		mParameters.context = null;
		mParameters.success = function() {
			sap.ca.ui.message.showMessageToast(that.resourceBundle.getText(sTextKey));
			that.oDataModel.refresh(true);
		};
		mParameters.error = jQuery.proxy(this._onRequestFailed, this);
		this.oDataModel.read(sPath, mParameters);
	},

	/**
	 * Handler for service request failure
	 * @param  {object} oError error details
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
},
	"hcm/approve/leaverequest/view/S2.view.xml":'<!--\n\n    Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved\n\n-->\n<core:View\n\txmlns:core="sap.ui.core"\n\txmlns="sap.m"\n\tcontrollerName="hcm.approve.leaverequest.view.S2">\n\t<Page\n\t\tid="page"\n\t\ttitle="{i18n>view.Master.title}">\n\t\t<content>\n\t\t\t<List\n\t\t\t\tid="list"\n\t\t\t\tmode="{device>/listMode}"\n\t\t\t\tselect="_handleSelect">\n\t\t\t\t<ObjectListItem\n\t\t\t\t\tid="MAIN_LIST_ITEM"\n\t\t\t\t\ttype="{device>/listItemType}"\n\t\t\t\t\tpress="_handleItemPress"\n\t\t\t\t\ttitle="{RequesterName}"\n\t\t\t\t\tnumber="{parts:[{path:\'AbsenceDays\'},{path:\'AbsenceHours\'},{path:\'AllDayFlag\'}], formatter:\'hcm.approve.leaverequest.util.Conversions.formatterAbsenceDuration\'}"\n\t\t\t        numberUnit="{parts:[{path:\'AbsenceDays\'},{path:\'AbsenceHours\'},{path:\'AllDayFlag\'}], formatter:\'hcm.approve.leaverequest.util.Conversions.formatterAbsenceDurationUnit\'}">\n\t\t\t\t\t<firstStatus>\n\t\t\t\t\t\t<ObjectStatus\n\t\t\t\t\t\t\ttext="{parts:[{path:\'ChangeDate\'}], formatter:\'hcm.approve.leaverequest.util.Conversions.formatterTimestampToDate\'}"></ObjectStatus>\n\t\t\t\t\t</firstStatus>\n\t\t\t\t\t<secondStatus>\n\t\t\t\t\t\t<ObjectStatus\n\t\t\t\t\t\t\tstate="Warning"\n\t\t\t\t\t\t\ttext="{parts:[{path:\'LeaveRequestType\'}], formatter:\'hcm.approve.leaverequest.util.Conversions.formatterListCancelStatus\'}"></ObjectStatus>\n\t\t\t\t\t</secondStatus>\n\t\t\t\t\t<attributes>\n\t\t\t\t\t\t<ObjectAttribute\n\t\t\t\t\t\t\tid="ATTR1"\n\t\t\t\t\t\t\ttext="{LeaveTypeDesc}" />\n\t\t\t\t\t\t<ObjectAttribute\n\t\t\t\t\t\t\tid="TimeframeList"\n\t\t\t\t\t\t\ttext="{parts:[{path:\'StartDate\'},{path:\'BeginTime\'},{path:\'EndDate\'},{path:\'EndTime\'},{path:\'AllDayFlag\'}], formatter:\'hcm.approve.leaverequest.util.Conversions.formatterAbsenceDays3Short\'}" />\n\t\t\t\t\t\t<ObjectAttribute\n\t\t\t\t\t\t\tid="ATTR2"\n\t\t\t\t\t\t\ttext="{parts:[{path:\'Overlaps\'}], formatter:\'hcm.approve.leaverequest.util.Conversions.formatterOverlaps\'}" />\n\t\t\t\t\t\t<!-- extension added to add fields in list item -->\t\n                \t\t<core:ExtensionPoint name="extS2ListItem"></core:ExtensionPoint>\n\t\t\t\t\t</attributes>\n\t\t\t\t</ObjectListItem>\n\t\t\t\t<swipeContent>\n\t\t\t\t\t<Button\n\t\t\t\t\t\ttext="{i18n>XBUT_APPROVE}"\n\t\t\t\t\t\ttype="Accept"\n\t\t\t\t\t\ttap="_handleListSwipe" />\n\t\t\t\t</swipeContent>\n\t\t\t</List>\n\t\t</content>\n\t\t<footer>\n\t\t\t<Bar id="footer"></Bar>\n\t\t</footer>\n\t</Page>\n</core:View>',
	"hcm/approve/leaverequest/view/S3.controller.js":function(){/*
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
},
	"hcm/approve/leaverequest/view/S3.view.xml":'<!--\n\n    Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved\n\n-->\n<core:View\n\txmlns:core="sap.ui.core"\n\txmlns="sap.m"\n\txmlns:me="sap.me"\n\txmlns:mvc="sap.ui.core.mvc"\n\txmlns:form="sap.ui.layout.form"\n\txmlns:layout="sap.ui.layout"\n\tcontrollerName="hcm.approve.leaverequest.view.S3">\n\t<Page id="detailPage" path="{a>/Details}">\n\t\t<ObjectHeader\n\t\t\tid="S3_DETAILHEADHER"\n\t\t\tnumber="{parts:[{path:\'AbsenceDays\'},{path:\'AbsenceHours\'},{path:\'AllDayFlag\'}], formatter:\'hcm.approve.leaverequest.util.Conversions.formatterAbsenceDuration\'}"\n\t\t\tnumberUnit="{parts:[{path:\'AbsenceDays\'},{path:\'AbsenceHours\'},{path:\'AllDayFlag\'}], formatter:\'hcm.approve.leaverequest.util.Conversions.formatterAbsenceDurationUnit\'}"\n\t\t\ttitle="{RequesterName}"\n\t\t\ttitleActive="true"\n\t\t\ttitlePress="_handleNamePress">\n\t\t\t<statuses>\n\t\t\t\t<ObjectStatus id="S3_CHANGEDATE"\n\t\t\t\t\ttext="{parts:[{path:\'ChangeDate\'}], formatter:\'hcm.approve.leaverequest.util.Conversions.formatterTimestampToDate\'}"></ObjectStatus>\n\t\t\t\t<ObjectStatus id="S3_CANCELSTATUS"\n\t\t\t\t\tstate="Warning"\n\t\t\t\t\ttext="{parts:[{path:\'LeaveRequestType\'},{path:\'RequesterName\'}], formatter:\'hcm.approve.leaverequest.util.Conversions.formatterHeaderCancelStatus\'}"></ObjectStatus>\n\t\t\t</statuses>\n\t\t\t<attributes>\n\t\t\t\t<ObjectAttribute id="S3_REQ_PERNR"\n\t\t\t\t\ttext="{parts:[{path:\'RequesterNumber\'}], formatter:\'hcm.approve.leaverequest.util.Conversions.formatterEmployeeID\'}"></ObjectAttribute>\n\t\t\t\t<ObjectAttribute id="S3_LEAVEDESC"\n\t\t\t\t\ttext="{LeaveTypeDesc}"></ObjectAttribute>\n\t\t\t\t<ObjectAttribute id="S3_TIMEFRAME"\n\t\t\t\t\ttext="{parts:[{path:\'StartDate\'},{path:\'BeginTime\'},{path:\'EndDate\'},{path:\'EndTime\'},{path:\'AllDayFlag\'}], formatter:\'hcm.approve.leaverequest.util.Conversions.formatterAbsenceDays3\'}"></ObjectAttribute>\n\t\t\t</attributes>\n\t\t\t<!-- extension point for additional fields in header -->\n\t\t\t<core:ExtensionPoint name="extS3Header"></core:ExtensionPoint>\n\t\t</ObjectHeader>\n\t\t<IconTabBar\n\t\t\tid="LRAtc"\n\t\t\tselect="_handleTabSelect">\n\t\t\t<items>\n\t\t\t\t<IconTabFilter\n\t\t\t\t\ticon="sap-icon://hint"\n\t\t\t\t\ticonColor="Default"\n\t\t\t\t\tkey="contentInfo">\n\t\t\t\t\t<content>\n\t\t\t\t\t\t<form:Form id="myForm">\n\t\t\t\t\t\t\t<form:layout>\n\t\t\t\t\t\t\t\t<form:ResponsiveLayout id="informationLayout" />\n\t\t\t\t\t\t\t</form:layout>\n\t\t\t\t\t\t\t<form:formContainers>\n\t\t\t\t\t\t\t\t<form:FormContainer id="formContainer">\n\t\t\t\t\t\t\t\t\t<form:layoutData>\n\t\t\t\t\t\t\t\t\t\t<layout:ResponsiveFlowLayoutData\n\t\t\t\t\t\t\t\t\t\t\tlinebreak="true"\n\t\t\t\t\t\t\t\t\t\t\tmargin="false"></layout:ResponsiveFlowLayoutData>\n\t\t\t\t\t\t\t\t\t</form:layoutData>\n\t\t\t\t\t\t\t\t\t<form:formElements>\n\t\t\t\t\t\t\t\t\t\t<form:FormElement id="S3_TIME_QUOTA_FELEM"\n\t\t\t\t\t\t\t\t\t\t\tvisible="{parts:[{path:\'CurrentBalTimeUnitCode\'}], formatter:\'hcm.approve.leaverequest.util.Conversions.formatterCurrentBalanceVisible\'}">\n\t\t\t\t\t\t\t\t\t\t\t<form:layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t<layout:ResponsiveFlowLayoutData\n\t\t\t\t\t\t\t\t\t\t\t\t\tlinebreak="true"\n\t\t\t\t\t\t\t\t\t\t\t\t\tmargin="false"></layout:ResponsiveFlowLayoutData>\n\t\t\t\t\t\t\t\t\t\t\t</form:layoutData>\n\t\t\t\t\t\t\t\t\t\t\t<form:label>\n\t\t\t\t\t\t\t\t\t\t\t\t<Label\n\t\t\t\t\t\t\t\t\t\t\t\t\tid="CurrentBalanceLabel"\n\t\t\t\t\t\t\t\t\t\t\t\t\ttext="{i18n>view.AddInfo.CurrentBalance}">\n\t\t\t\t\t\t\t\t\t\t\t\t\t<layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t<layout:ResponsiveFlowLayoutData\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tweight="3"\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tmin-width="192"></layout:ResponsiveFlowLayoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t</layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t</Label>\n\t\t\t\t\t\t\t\t\t\t\t</form:label>\n\t\t\t\t\t\t\t\t\t\t\t<form:fields>\n\t\t\t\t\t\t\t\t\t\t\t\t<Text\n\t\t\t\t\t\t\t\t\t\t\t\t\tid="CurrentBalance"\n\t\t\t\t\t\t\t\t\t\t\t\t\ttext="{parts:[{path:\'CurrentBalance\'},{path:\'CurrentBalTimeUnitCode\'}], formatter:\'hcm.approve.leaverequest.util.Conversions.formatterCurrentBalance\'}">\n\t\t\t\t\t\t\t\t\t\t\t\t\t<layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t<layout:ResponsiveFlowLayoutData\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tweight="5"></layout:ResponsiveFlowLayoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t</layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t</Text>\n\t\t\t\t\t\t\t\t\t\t\t</form:fields>\n\t\t\t\t\t\t\t\t\t\t</form:FormElement>\n\t\t\t\t\t\t\t\t\t\t<form:FormElement>\n\t\t\t\t\t\t\t\t\t\t\t<form:layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t<layout:ResponsiveFlowLayoutData\n\t\t\t\t\t\t\t\t\t\t\t\t\tlinebreak="true"\n\t\t\t\t\t\t\t\t\t\t\t\t\tmargin="false"></layout:ResponsiveFlowLayoutData>\n\t\t\t\t\t\t\t\t\t\t\t</form:layoutData>\n\t\t\t\t\t\t\t\t\t\t\t<form:label>\n\t\t\t\t\t\t\t\t\t\t\t\t<Label\n\t\t\t\t\t\t\t\t\t\t\t\t\tid="RequestedLabel"\n\t\t\t\t\t\t\t\t\t\t\t\t\ttext="{i18n>view.AddInfo.Requested}">\n\t\t\t\t\t\t\t\t\t\t\t\t\t<layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t<layout:ResponsiveFlowLayoutData\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tweight="3"\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tmin-width="192"></layout:ResponsiveFlowLayoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t</layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t</Label>\n\t\t\t\t\t\t\t\t\t\t\t</form:label>\n\t\t\t\t\t\t\t\t\t\t\t<form:fields>\n\t\t\t\t\t\t\t\t\t\t\t\t<Text\n\t\t\t\t\t\t\t\t\t\t\t\t\tid="Requested"\n\t\t\t\t\t\t\t\t\t\t\t\t\ttext="{parts:[{path:\'AbsenceDays\'},{path:\'AbsenceHours\'},{path:\'AllDayFlag\'}], formatter:\'hcm.approve.leaverequest.util.Conversions.formatterAbsenceDurationAndUnit\'}">\n\t\t\t\t\t\t\t\t\t\t\t\t\t<layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t<layout:ResponsiveFlowLayoutData\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tweight="5"></layout:ResponsiveFlowLayoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t</layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t</Text>\n\t\t\t\t\t\t\t\t\t\t\t</form:fields>\n\t\t\t\t\t\t\t\t\t\t</form:FormElement>\n\t\t\t\t\t\t\t\t\t\t<form:FormElement id="S3_TIME_QUOTA_DEDUCTED"\n\t\t\t\t\t\t\t\t\t\t\tvisible="{parts:[{path:\'Deduction\'}], formatter:\'hcm.approve.leaverequest.util.Conversions.formatterDeductionVisible\'}">\n\t\t\t\t\t\t\t\t\t\t\t<form:layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t<layout:ResponsiveFlowLayoutData\n\t\t\t\t\t\t\t\t\t\t\t\t\tlinebreak="true"\n\t\t\t\t\t\t\t\t\t\t\t\t\tmargin="false"></layout:ResponsiveFlowLayoutData>\n\t\t\t\t\t\t\t\t\t\t\t</form:layoutData>\n\t\t\t\t\t\t\t\t\t\t\t<form:label>\n\t\t\t\t\t\t\t\t\t\t\t\t<Label\n\t\t\t\t\t\t\t\t\t\t\t\t\tid="DeductionLabel"\n\t\t\t\t\t\t\t\t\t\t\t\t\ttext="{i18n>view.AddInfo.Deduction}">\n\t\t\t\t\t\t\t\t\t\t\t\t\t<layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t<layout:ResponsiveFlowLayoutData\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tweight="3"\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tmin-width="192"></layout:ResponsiveFlowLayoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t</layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t</Label>\n\t\t\t\t\t\t\t\t\t\t\t</form:label>\n\t\t\t\t\t\t\t\t\t\t\t<form:fields>\n\t\t\t\t\t\t\t\t\t\t\t\t<Text\n\t\t\t\t\t\t\t\t\t\t\t\t\tid="Deduction"\n\t\t\t\t\t\t\t\t\t\t\t\t\ttext="{parts:[{path:\'Deduction\'},{path:\'CurrentBalTimeUnitCode\'}], formatter:\'hcm.approve.leaverequest.util.Conversions.formatterCurrentBalance\'}">\n\t\t\t\t\t\t\t\t\t\t\t\t\t<layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t<layout:ResponsiveFlowLayoutData\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tweight="5"></layout:ResponsiveFlowLayoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t</layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t</Text>\n\t\t\t\t\t\t\t\t\t\t\t</form:fields>\n\t\t\t\t\t\t\t\t\t\t</form:FormElement>\n\t\t\t\t\t\t\t\t\t\t<form:FormElement\n\t\t\t\t\t\t\t\t\t                 id = "S3_Duration"\n\t\t\t\t\t\t\t\t\t                 visible = "{parts:[{path:\'AllDayFlag\'}], formatter:\'hcm.approve.leaverequest.util.Conversions.formatterTimeDurationVisible\'}">\n\t\t\t\t\t\t\t\t\t\t\t<form:layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t<layout:ResponsiveFlowLayoutData\n\t\t\t\t\t\t\t\t\t\t\t\t\tlinebreak="true"\n\t\t\t\t\t\t\t\t\t\t\t\t\tmargin="false"></layout:ResponsiveFlowLayoutData>\n\t\t\t\t\t\t\t\t\t\t\t</form:layoutData>\n\t\t\t\t\t\t\t\t\t\t\t<form:label>\n\t\t\t\t\t\t\t\t\t\t\t\t<Label\n\t\t\t\t\t\t\t\t\t\t\t\t\tid="S3_DurationLabel"\n\t\t\t\t\t\t\t\t\t\t\t\t\ttext="{i18n>view.Detail.FromTo}">\n\t\t\t\t\t\t\t\t\t\t\t\t\t<layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t<layout:ResponsiveFlowLayoutData\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tweight="3"\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tmin-width="192"></layout:ResponsiveFlowLayoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t</layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t</Label>\n\t\t\t\t\t\t\t\t\t\t\t</form:label>\n\t\t\t\t\t\t\t\t\t\t\t<form:fields>\n\t\t\t\t\t\t\t\t\t\t\t\t<Text\n\t\t\t\t\t\t\t\t\t\t\t\t\tid ="RequestedDurationTime"\n\t\t\t\t\t\t\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t\t\t\t\t\t\ttext = "{parts:[{path:\'BeginTime\'},{path:\'EndTime\'}], formatter:\'hcm.approve.leaverequest.util.Conversions.formatterDurationTime\'}">\n\t\t\t\t\t\t\t\t\t\t\t\t\t<layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t<layout:ResponsiveFlowLayoutData\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tweight="5"></layout:ResponsiveFlowLayoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t</layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t</Text>\n\t\t\t\t\t\t\t\t\t\t\t</form:fields>\n\t\t\t\t\t\t\t\t\t\t</form:FormElement>\n\t\t\t\t\t\t\t\t\t\t<form:FormElement>\n\t\t\t\t\t\t\t\t\t\t\t<form:layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t<layout:ResponsiveFlowLayoutData\n\t\t\t\t\t\t\t\t\t\t\t\t\tlinebreak="true"\n\t\t\t\t\t\t\t\t\t\t\t\t\tmargin="false"></layout:ResponsiveFlowLayoutData>\n\t\t\t\t\t\t\t\t\t\t\t</form:layoutData>\n\t\t\t\t\t\t\t\t\t\t\t<form:label>\n\t\t\t\t\t\t\t\t\t\t\t\t<Label\n\t\t\t\t\t\t\t\t\t\t\t\t\tid="LeaveType"\n\t\t\t\t\t\t\t\t\t\t\t\t\ttext="{i18n>view.AddInfo.LeaveType}">\n\t\t\t\t\t\t\t\t\t\t\t\t\t<layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t<layout:ResponsiveFlowLayoutData\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tweight="3"\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tmin-width="192"></layout:ResponsiveFlowLayoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t</layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t</Label>\n\t\t\t\t\t\t\t\t\t\t\t</form:label>\n\t\t\t\t\t\t\t\t\t\t\t<form:fields>\n\t\t\t\t\t\t\t\t\t\t\t\t<Text\n\t\t\t\t\t\t\t\t\t\t\t\t\tid="formLeaveTypeDesc"\n\t\t\t\t\t\t\t\t\t\t\t\t\ttext="{LeaveTypeDesc}">\n\t\t\t\t\t\t\t\t\t\t\t\t\t<layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t<layout:ResponsiveFlowLayoutData\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tweight="5"></layout:ResponsiveFlowLayoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t</layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t</Text>\n\t\t\t\t\t\t\t\t\t\t\t</form:fields>\n\t\t\t\t\t\t\t\t\t\t</form:FormElement>\n\t\t\t\t\t\t\t\t\t\t<form:FormElement\n\t\t\t\t\t\t\t\t\t\t\tid="Overlaps"\n\t\t\t\t\t\t\t\t\t\t\tvisible="false">\n\t\t\t\t\t\t\t\t\t\t\t<form:layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t<layout:ResponsiveFlowLayoutData\n\t\t\t\t\t\t\t\t\t\t\t\t\tlinebreak="true"\n\t\t\t\t\t\t\t\t\t\t\t\t\tmargin="false"></layout:ResponsiveFlowLayoutData>\n\t\t\t\t\t\t\t\t\t\t\t</form:layoutData>\n\t\t\t\t\t\t\t\t\t\t\t<form:label>\n\t\t\t\t\t\t\t\t\t\t\t\t<Label\n\t\t\t\t\t\t\t\t\t\t\t\t\tid="OverlapListLabel">\n\t\t\t\t\t\t\t\t\t\t\t\t\t<layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t<layout:ResponsiveFlowLayoutData\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tweight="3"\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tmin-width="192"></layout:ResponsiveFlowLayoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t</layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t</Label>\n\t\t\t\t\t\t\t\t\t\t\t</form:label>\n\t\t\t\t\t\t\t\t\t\t\t<form:fields>\n\t\t\t\t\t\t\t\t\t\t\t\t<Text\n\t\t\t\t\t\t\t\t\t\t\t\t\tid="OverlapList"\n\t\t\t\t\t\t\t\t\t\t\t\t\ttext="{parts:[{path:\'OverlapList\'}], formatter:\'hcm.approve.leaverequest.util.Conversions._parseOverlapList\'}">\n\t\t\t\t\t\t\t\t\t\t\t\t\t<layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t<layout:ResponsiveFlowLayoutData\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tweight="5"\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\talign-items="End"></layout:ResponsiveFlowLayoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t\t</layoutData>\n\t\t\t\t\t\t\t\t\t\t\t\t</Text>\n\t\t\t\t\t\t\t\t\t\t\t</form:fields>\n\t\t\t\t\t\t\t\t\t\t</form:FormElement>\n\n\t\t\t\t\t\t\t\t\t</form:formElements>\n\t\t\t\t\t\t\t\t</form:FormContainer>\n\t\t\t\t\t\t\t</form:formContainers>\n\t\t\t\t\t\t</form:Form>\n\t\t\t\t\t</content>\n\t\t\t\t</IconTabFilter>\n\t\t\t\t<IconTabFilter\n\t\t\t\t\ticon="sap-icon://notes"\n\t\t\t\t\ticonColor="Default"\n\t\t\t\t\tcount="{NotesCounter}"\n\t\t\t\t\tkey="contentNotes"\n\t\t\t\t\tvisible="{parts:[{path:\'NotesCounter\'}], formatter:\'hcm.approve.leaverequest.util.Conversions.formatterNotesVisible\'}">\n\t\t\t\t\t<List\n\t\t\t\t\t\t\tid="NotesList"\n\t\t\t\t\t\t\titems="{notes>/NotesCollection}"\n\t\t\t\t\t\t\tinset="false"\n\t\t\t\t\t\t\tshowSeparators="None"\n\t\t\t\t\t\t\theaderDesign="Plain">\n\t\t\t\t\t\t<FeedListItem\n\t\t\t\t\t\t\t\tid="feed"\n\t\t\t\t\t\t\t\tsender="{notes>Author}"\n\t\t\t\t\t\t\t\tsenderPress="_handleSenderPress"\n\t\t\t\t\t\t\t\ttimestamp="{notes>Timestamp}"\n                                text="{notes>Text}"\n\t\t\t\t\t\t\t\t></FeedListItem>\n\t\t\t\t\t</List>\n\t\t\t\t</IconTabFilter>\n\t\t\t\t<IconTabFilter id="S3_ATTACH_ICNTAB"  \n\t\t\t\t\tcount="{AttachmentsCounter}" \n\t\t\t\t\ticon="sap-icon://attachment" \n\t\t\t\t\tvisible="{parts:[{path:\'AttachmentsCounter\'}], formatter:\'hcm.approve.leaverequest.util.Conversions.formatterNotesVisible\'}">\n\t\t\t\t\t<content>\n\t\t\t\t\t\t<layout:VerticalLayout\n                                width="100%">\n\t\t\t\t\t\t\t<UploadCollection id="S3_FILE_LIST"\n                                  uploadEnabled="false"\n                                  items="{files>/AttachmentsCollection}">\n\t\t\t\t\t\t\t\t<UploadCollectionItem\n                                     contributor= "{files>Contributor}"\n                                     documentId="{files>DocumentId}"\n                                     enableDelete="false"\n                                     enableEdit="false"\n                                     url="{files>FileUrl}"\n                                     mimeType="{files>MimeType}"\n                                     fileName="{files>FileName}"\n                                     fileSize="{files>FileSize}"\n                                     uploadedDate="{files>UploadedDate}"\n                                     ></UploadCollectionItem>\n\t\t\t\t\t\t\t</UploadCollection>\n\t\t\t\t\t\t</layout:VerticalLayout>\n\t\t\t\t\t</content>\n\t\t\t\t</IconTabFilter>\n\t\t\t\t<IconTabFilter id="S3_OverlapCalendar"  \n\t\t\t\t\ticon="sap-icon://calendar"\n\t\t\t\t\tcount="{Overlaps}" \n\t\t\t\t\tkey = "calendar"\n\t\t\t\t\tvisible="false">\n\t\t\t\t\t<content>\n\t\t\t\t\t\t<me:OverlapCalendar\n\t\t\t\t            id="OverlapCalendar2"\n\t\t\t\t            startDate="2015-04-16T00:00:00"\n\t\t\t\t            weeksPerRow="2"\n\t\t\t\t            swipeToNavigate="false"\n\t\t\t\t            endOfData="_onEndOfData"\n\t\t\t\t            changeDate="_onChangeDate"></me:OverlapCalendar>\n\t\t\t\t\t\t<me:CalendarLegend\n\t\t\t\t                id="CalenderLegend"\n\t\t\t\t                legendWidth="18em">\n\t\t\t\t        </me:CalendarLegend>\n\t\t\t\t        <Text   id="infoText" \n\t\t\t\t                class="sapUiSmallMarginBeginEnd sapUiSmallMarginTop"\n\t\t\t\t                textAlign = "Right"\n\t\t\t\t                width = "98%" > <!--value changed from 80 to 98% and textAllign Center to right FA 2289207 -->\n\t\t\t\t        </Text>\n\t\t\t\t\t</content>\n\t\t\t\t</IconTabFilter>\n\t\t\t\t<!-- extension point for additional IconTabFilter -->\n\t\t\t\t<core:ExtensionPoint name="extS3Tab"/>\n\t\t\t</items>\n\t\t</IconTabBar>\n\t\t<footer>\n\t\t\t<Bar id="detailFooter"></Bar>\n\t\t</footer>\n\t</Page>\n</core:View>',
	"hcm/approve/leaverequest/view/S4.controller.js":function(){/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.require("hcm.approve.leaverequest.util.CalendarServices");
jQuery.sap.require("hcm.approve.leaverequest.util.Conversions");
jQuery.sap.require("sap.ca.scfld.md.controller.BaseDetailController");
jQuery.sap.require("sap.ca.ui.dialog.factory");

sap.ca.scfld.md.controller.BaseDetailController.extend("hcm.approve.leaverequest.view.S4", {

	extHookChangeFooterButtons: null,

	onInit: function() {
		"use strict";
		this.oView = this.getView();
		this.resourceBundle = this.oApplicationFacade.getResourceBundle();
		this.oDataModel = this.oApplicationFacade.getODataModel();
		this.detailContextPath = "";

		this.oRouter.attachRouteMatched(function(oEvent) {

			if (oEvent.getParameter("name") === "calendar") {
				var sReqStartDate, sRequestId, sOrigin, oStartDate, contextPath;
				sRequestId = oEvent.getParameter("arguments").RequestId;
				sOrigin = oEvent.getParameter("arguments").SAP__Origin;
				contextPath = "/LeaveRequestSet(RequestId='" + sRequestId + "')";

				this.detailContextPath = "LeaveRequestSet(RequestId='" + sRequestId + "')";
				this.oView.bindElement(contextPath);

				sReqStartDate = new Date();
				sReqStartDate.setTime(oEvent.getParameter("arguments").StartDate);
				oStartDate = hcm.approve.leaverequest.util.CalendarServices.setDateType(sReqStartDate);
				hcm.approve.leaverequest.util.CalendarServices.setCalStartDate(oStartDate);

				//set model to the calendar
				if (!hcm.approve.leaverequest.util.CalendarServices.getAppModel()) {
					hcm.approve.leaverequest.util.CalendarServices.setAppModel(this.oDataModel);
				}

				//clear calendar data - since every
				// refresh/approve/reject could outdate the data
				hcm.approve.leaverequest.util.CalendarServices.clearCalData();

				jQuery.sap.delayedCall(5, undefined, jQuery.proxy(function() {
					hcm.approve.leaverequest.util.CalendarServices.readCalData(sRequestId, sReqStartDate, null, sOrigin);
					//call controller to set context
					this._onShow(sRequestId);
				}, this));

			}
		}, this);

		var oCalendar2 = this.byId("OverlapCalendar2"),
			oLegend = this.byId("CalenderLegend");
		if (oCalendar2) {
			oCalendar2.setModel(hcm.approve.leaverequest.util.CalendarServices.getCalModel());
		}

		if (jQuery.device.is.phone) {
			// default: 2 weeks
			oCalendar2.setWeeksPerRow(1);
		}

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

	/**
	 * @param  {string} RequestID Leave Request Id
	 * @return {boolean} bReturn flag to show AllDayFlag
	 */
	_onShow: function(RequestID) {
		"use strict";
		var oCalendar2, sPath, eventTemplate;
		oCalendar2 = this.byId("OverlapCalendar2");

		if (oCalendar2) {
			// bind aggregation
			sPath = "/" + RequestID + "/events";
			eventTemplate = new sap.me.OverlapCalendarEvent({
				row: "{Order}",
				type: "{LegendType}",
				typeName: "{AbsenceType}",
				name: "{EmployeeName}"
			});

			eventTemplate.bindProperty("halfDay", {
				parts: [{
					path: "AllDayFlag"
                }],
				formatter: function(bAllDayFlag) {
					var bReturn = false;
					if (!bAllDayFlag) {
						bReturn = true;
					}
					return bReturn;
				}
			});

			// start date
			eventTemplate.bindProperty("startDay", {
				parts: [{
					path: "StartDate"
                }],
				formatter: hcm.approve.leaverequest.util.Conversions.convertLocalDateToUTC
			});

			// end date
			eventTemplate.bindProperty("endDay", {
				parts: [{
					path: "EndDate"
                }],
				formatter: hcm.approve.leaverequest.util.Conversions.convertLocalDateToUTC
			});

			oCalendar2.bindAggregation("calendarEvents", sPath, eventTemplate);
			oCalendar2.setStartDate(hcm.approve.leaverequest.util.CalendarServices.getCalStartDate());
		}
	},

	/**
	 * @param  {object} oEvt Change of date event
	 * @return {void}
	 */
	_onChangeDate: function(oEvt) {
		"use strict";
		var oDataStatus, bParamBefore;
		oDataStatus = hcm.approve.leaverequest.util.CalendarServices.checkLoadRequired(oEvt.getParameter("firstDate"), oEvt.getParameter(
			"endDate"));
		if (oDataStatus.bLoadReq) {
			bParamBefore = oDataStatus.bLoadBefore;
			jQuery.sap.delayedCall(5, undefined, function() {
				if (hcm.approve.leaverequest.util.CalendarServices.getLeadRequestID()) {
					hcm.approve.leaverequest.util.CalendarServices.readCalData(null, null, bParamBefore, null);
				}
			});
		}
	},

	/**
	 * Defines header & footer options
	 * @return {void}
	 */
	getHeaderFooterOptions: function() {
		"use strict";
		var objHdrFtr = {
			sI18NDetailTitle: "view.Detail.title"
			/* Commenting since this was workaround suggested by UI5 team for IE
			onBack: jQuery.proxy(function() {
				var sDir = sap.ui.core.routing.History.getInstance().getDirection(""); // dummy call to identify deep link situation
				if (sDir && sDir !== "Unknown") {
					window.history.go(-1);
				} else {
					this.oRouter.navTo("detail", {
						from: "calendar",
						contextPath: this.detailContextPath
					}, true);
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
		 * @callback hcm.approve.leaverequest.view.S4~extHookChangeFooterButtons
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
	"hcm/approve/leaverequest/view/S4.view.xml":'<!--\n\n    Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved\n\n-->\n<core:View\n\txmlns:core="sap.ui.core"\n\txmlns="sap.m"\n\txmlns:me="sap.me"\n\tcontrollerName="hcm.approve.leaverequest.view.S4">\n\t<Page id="overlapPage">\n\t\t<VBox id="overlapCalendar">\n\t\t\t<me:OverlapCalendar\n\t\t\t\tid="OverlapCalendar2"\n\t\t\t\tstartDate="2013-04-09T00:00:00"\n\t\t\t\tweeksPerRow="2"\n\t\t\t\tswipeToNavigate="false"\n\t\t\t\tendOfData="_onEndOfData"\n\t\t\t\tchangeDate="_onChangeDate">\n\t\t\t</me:OverlapCalendar>\n\t\t\t<me:CalendarLegend\n\t\t\t\tid="CalenderLegend"\n\t\t\t\tlegendWidth="18em">\n\t\t\t</me:CalendarLegend>\n\t\t</VBox>\n\t</Page>\n</core:View>'
}});
