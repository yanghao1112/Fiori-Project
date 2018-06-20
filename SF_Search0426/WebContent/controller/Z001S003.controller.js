sap.ui.define([
	"sap/pwaa/controller/ZZBaseController",
	"sap/m/MessageToast",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/IconPool",
	"sap/ui/core/Popup",
	"sap/m/TabContainerItem",
	"sap/m/UploadCollectionParameter"],
function(ZZBaseController, MessageToast, JSONModel, IconPool, Popup, TabContainerItem, UploadCollectionParameter) {
	"use strict";
	return ZZBaseController.extend("sap.pwaa.controller.Z001S003", {
		
		/* =========================================================== */
		/* lifecycle methods                                           */
		/* =========================================================== */

		/**
		 * Called when the controller is instantiated.
		 * 1.Set DataManager to the controller
		 * 2.Attach the "showAnalysisFilter" Event to open Analysis Filter dialog for user to select 
		 * @public
		 */
		onInit : function() {
			"use strict";
			let oComponent = this.getOwnerComponent();
			this._oDataManager = oComponent.oDataManager;
			this._oMessageDisplayer = oComponent.oMessageDisplayer;
			
			var oEventBus = sap.ui.getCore().getEventBus();
			oEventBus.subscribe("showAnalysisFilter", function() {
				let oComponent = this.getOwnerComponent();
				let oParameterData = oComponent.getModel("Parameter").getData();
				let oAnalysisFilterPromise = null;
				if (oParameterData.AssignMemberType === null ||
						oParameterData.AnalysisGroupUnit === null) {
					oAnalysisFilterPromise = 
						oComponent.ZPO_ANALYSISFILTER.open(oComponent.getModel("Parameter"));
				} else {
					oAnalysisFilterPromise = Promise.resolve(null);
				}
				oAnalysisFilterPromise.then(this._getTopViewData.bind(this)).catch(function() {
					if (oParameterData.AssignMemberType === null ||
							oParameterData.AnalysisGroupUnit === null) {
						this.getOwnerComponent().getRouter().getTargets().display("search");
					}
				}.bind(this));
			},this);
	
		},
		
		/* =========================================================== */
		/* event handlers                                              */
		/* =========================================================== */

		/**
		 * Event handling for clicking 'Group Title'
		 * Navigate to the Group Detail Screen
		 * @public
		 */
		onPressGroup: function(aControlEvent) {
			"use strict";
			let oGroupData = aControlEvent.getSource().getBindingContext("ClientDetail").getObject();
			let oSummary = this.getView().getModel("ClientDetail").getProperty("/clientSummary");
			let oComponent = this.getOwnerComponent();

			oComponent._oDetailOption = {
					ClientCode: oSummary["clientCode"],
					MemberAssigned: oSummary["memberAssigned"],
					AnalysisGroupUnit: oSummary["analysisGroupUnit"],
					LEPCode: oGroupData["lepCode"],
					LEMCode: oGroupData["lemCode"],
					ImpEventName: oGroupData["impEventName"],
					EngCode: oGroupData["engCode"],
					GroupName: oGroupData["groupName"],
					GroupCode: oGroupData["groupCode"]
			};
			
			this.getOwnerComponent().getRouter().getTargets().display("detail");

		},
		
		/**
		 * Event handling for clicking 'NavBack Button'
		 * Navigate to the Search Screen
		 * Clear Top Screen Data and Analysis Filter Selection
		 * @public
		 */
		onNavPress : function(aControlEvent){
			"use strict";
			//Navigate to the Search Screen
			this.getOwnerComponent().getRouter().getTargets().display("search");
			
			//Clear Top Screen Data 
			let oClientDetailModel = this.getView().getModel("ClientDetail")
			if (oClientDetailModel) {
				oClientDetailModel.setData(null);
			}

			//Clear Analysis Filter
			let oComponent = this.getOwnerComponent();
			let oModel = oComponent.getModel("Parameter");

			oModel.setProperty("/AssignMemberType",null);
			oModel.setProperty("/AssignMemberTypeText","");
			oModel.setProperty("/AssignMemberTypeIndex",0);
			oModel.setProperty("/AnalysisGroupUnit",null);
			oModel.setProperty("/AnalysisGroupUnitText","");
			oModel.setProperty("/AnalysisGroupUnitIndex",0);
			oModel.setProperty("/ClientCode","");
			
		},

		
		/**
		 * Event handling for clicking 'Setting Button' of analysis filter
		 * After user click Save from [Save] from filter Dialog, get the data according the selecton
		 * @public
		 */
		onPressAnalysisFilter: function(aControlEvent) {
			let oComponent = this.getOwnerComponent();
			let oAnalysisFilterPromise = oComponent.ZPO_ANALYSISFILTER.open();
			
			//After user click Save from [Save] from filter Dialog, get the data according the selecton
			oAnalysisFilterPromise.then(this._getTopViewData.bind(this));
		},
		
		/**
		 * Event handling for clicking 'Evaluation Type' [Progress or Proposal]
		 * Change the binding according the Evaluation Type
		 * @public
		 */
		onQRMTypeChange: function(aControlEvent) {
			let sSelectedKey = aControlEvent.getSource().getSelectedItem().getKey();
			let oQRMPart = this.getView().byId("QRM");
			oQRMPart.bindElement({
				path: "/qrmData/" + sSelectedKey,
				model: "ClientDetail"
			});
		},
		
		/* =========================================================== */
		/* begin: internal methods                                     */
		/* =========================================================== */
		
		/**
		 * Prepare Data to display on Screen
		 * @private
		 */
		_handleData: function(aData) {

			
			if (!aData["clientSummary"]["lcpimage"]) {
				aData["clientSummary"]["lcpimage"] = "image/default.jpeg"
			}
			
			// 1. Merge Members<Array> to each 3 Members as an Object
			// --> GroupMembers : [M1,M2,M3,M4,M5,M6,M7,M8]
			// Change to MemberPages : [ { Member6: [M1,M2,M3,M4,M5,M6] }, { Member6: [M7,M8] }]
			
			let oGroupList = aData["analysisGroups"];
			$.each(oGroupList, function(aIdxGroup, aGroup){

				let oMembers = aGroup["members"];				
				let oMemberPages = [];
				let oMember6 = [];
				let iMembersLength = oMembers.length;
				
				$.each(oMembers, function(aIdxMember, aMember) {
					if (!aMember["image"]) {
						aMember["image"] = "image/default.jpeg"
					}
					if (aIdxMember % 6 === 0 && aIdxMember !== 0) {
						oMemberPages.push({"Member6":oMember6});
						oMember6 = [];
					}
					
					oMember6.push(aMember);
					
					if (aIdxMember === (iMembersLength - 1)) {
						oMemberPages.push({"Member6":oMember6});
						oMember6 = [];
					}
				});
				
				aGroup["MemberPages"] = oMemberPages;
			});
			
			// 2. For LeaderSkillData: Add classText (display as legend text), add classColor (color of the group), classId(unique Id for group)
			let oLeaderSkillList = aData.leaderSkill.skillGroups;
			let oColorArray = this.getOwnerComponent().oColorArray;
			let iHasAverage = 0;
			$.each(oLeaderSkillList, function(aIdxLeaderSkill, aLeaderSkill){
				aLeaderSkill["axes"] = aLeaderSkill["skillValues"];
				if (aLeaderSkill["groupName"] === "Average") {
					iHasAverage += 1;
					aLeaderSkill["classText"] = aLeaderSkill["groupName"];
					aLeaderSkill["classColor"] = "blue";
					aLeaderSkill["classId"] = aIdxLeaderSkill;
					aLeaderSkill["className"] = "ZAverageOpacity";
					return true;
				}
				aLeaderSkill["classText"] = aLeaderSkill["groupName"];
				aLeaderSkill["classColor"] = oColorArray[(aIdxLeaderSkill - iHasAverage) % oColorArray.length];
				aLeaderSkill["classId"] = aIdxLeaderSkill;
				
			}.bind(this))
			
			// 3. For QRMData: Add classText (display as legend text), add classColor (color of the group), classId(unique Id for group)
			let oQRMProgressProject = aData["qrmData"]["progress"]["project"];
			let oQRMProgressQAP		= aData["qrmData"]["progress"]["qap"];
			let oQRMProposalProject = aData["qrmData"]["proposal"]["project"];
			let oQRMProposalQAP		= aData["qrmData"]["proposal"]["qap"];
			//let oColorArray = this.getOwnerComponent().oColorArray;
			iHasAverage = 0;
			$.each([oQRMProgressProject,oQRMProgressQAP,oQRMProposalProject,oQRMProposalQAP], function(aIdxType, aType){
				$.each(aType, function(aIdxQRM, aQRM){
				aQRM["classText"] = aQRM["text"];
				aQRM["classColor"] = oColorArray[(aIdxQRM - iHasAverage) % oColorArray.length];
				aQRM["classId"] = aIdxQRM;
				}.bind(this));
			}.bind(this))
			
			aData["qrmData"]["progress"]["Option"] = this.getView().getModel("chartConfiguration").getData()["TopQRMProgress"];
			aData["qrmData"]["proposal"]["Option"] = this.getView().getModel("chartConfiguration").getData()["TopQRMProposal"];
			
			// 4. For AssignBalance
			let oAssignmentArray = aData["assignBalance"]["assignmentDetails"];
			let oAssignmentChart = [];
			$.each(oAssignmentArray, function(aIdxAssignment, aAssignment){
				let oNormal = {
						rankType : "Normal",
						rankCode : aAssignment["rankCode"],
						rankName : aAssignment["rankName"],
						e : aAssignment["e"],
						p : aAssignment["p"],
						t : aAssignment["t"],
						r : aAssignment["r"],
						s : aAssignment["s"],
						standard : 0
				}
				let oStandard = {
						rankType : "Standard",
						rankCode : aAssignment["rankCode"],
						rankName : aAssignment["rankName"],
						e : 0,
						p : 0,
						t : 0,
						r : 0,
						s : 0,
						standard : aAssignment["standard"]
				}
				oAssignmentChart.push(oNormal);
				oAssignmentChart.push(oStandard);
			});
			aData["assignBalance"]["assignmentChart"] = oAssignmentChart;
			
			// 5. For AssignBalance
//			let sClientCd = aData["clientSummary"]["clientCode"];
//			let sUploadUrl = "proxy/pwaa/file/upload" + "?Z_P001=" + sClientCd;
//			aData["uploadUrl"] = sUploadUrl;
			
		},
		
		/**
		 * Get the Client data according the analysis filter and client code
		 * @private
		 */
		_getTopViewData:function() {

			let oComponent = this.getOwnerComponent();
			let oParameterData = oComponent.getModel("Parameter").getData();
			let sMemberAssigned = oParameterData.AssignMemberType;
			let sAnalysisGroupUnit = oParameterData.AnalysisGroupUnit;
			let sClientCode = oParameterData.ClientCode;
			
			this.getClientDetailGot = this._oDataManager.getClientDetailData({
				Period: oComponent._oInitialData.period,
				MemberAssigned: sMemberAssigned,
				AnalysisGroupUnit: sAnalysisGroupUnit,
				ClientCode: sClientCode
			});
			this.getClientDetailGot.then(function(aData) {

				this._handleData(aData[0]);
				let oClientDetailModel = new JSONModel(aData[0]);
				
				
				this.getView().setModel(oClientDetailModel,"ClientDetail");
				
				
//				jQuery.sap.delayedCall(0, this, function () {
//					var oVizFrame = this.getView().byId("idVizFrame")
//					var fSetScale = function() {
//						let oInstanceApp = this.getView().byId("idVizFrame")._vizFrame.__internal_reference_VizFrame__._viz._vizInstance.app;
//						this.sync(oInstanceApp["_scales"]["valueAxis"], oInstanceApp["_scales"]["valueAxis2"])
//						this.getView().byId("idVizFrame")._vizFrame.__internal_reference_VizFrame__._viz._vizInstance.app._chartView._plotArea.updateValueScale();
//
//						oVizFrame.setVizScales([
//							{
//								"feed": "valueAxis2",
//								"max": labelArray[1],
//								"min": labelArray[0]
//							}
//						]);
//						oVizFrame.detachRenderComplete(fSetScale);
//					}
//					oVizFrame.attachEventOnce('renderComplete',fSetScale.bind(this));
//				});
				
			}.bind(this)).catch(function(aError) {
				this._oMessageDisplayer.showError(aError);
			}.bind(this));
			

		},
		
		/**
		 * Handling for format Client Description
		 * Format: "<Client Name>(<Client Code>)"
		 * @public
		 */
		_formatClientDescription: function(aClientName, aClientCode) {
			let oI18nModel = this.getOwnerComponent().getModel("i18n");
			if (aClientName && aClientCode) {
				return oI18nModel.getResourceBundle().getText("ZFClientTitleFormat",[aClientName, aClientCode]);
			} else {
				return "";
			}
		},
		_formatGroupTitle: function(aGroupName, aGroupMemberArray) {
			let oI18nModel = this.getOwnerComponent().getModel("i18n");
			if (aGroupName && aGroupMemberArray) {
				return oI18nModel.getResourceBundle().getText("ZFGroupTitleFormat",[aGroupName, aGroupMemberArray.length]);
			} else {
				return "";
			}
		},
		
		onChange : function(oEvent) {
//			let oUploadCollection = oEvent.getSource();
//			// Header Token
//			let oCustomerHeaderToken = new UploadCollectionParameter({
//				name : "x-csrf-token",
//				value : "securityTokenFromModel"
//			});
//			oUploadCollection.addParameter(oCustomerHeaderToken);
			oEvent.getSource().getParent().getParent().getParent().setBusy(true);
			MessageToast.show("Event change triggered");
		},
 
		onFileDeleted : function(aControlEvent) {

			let oDeletedFileData = aControlEvent.getParameter("item").getBindingContext("ClientDetail").getObject();
			let oDeletePromise = this._oDataManager.deleteFilebyID(oDeletedFileData["documentId"]);
			oDeletePromise.then(function() {

				let oClientDetailModel = this.getView().getModel("ClientDetail");
				let oFileArray = oClientDetailModel.getProperty("/attachFiles");
				let iDeleteIndex = -1;
				$.each(oFileArray, function(aIdxFile, aFile){

					if (aFile["documentId"] === oDeletedFileData["documentId"]) {
						iDeleteIndex = aIdxFile;
					};
				});
				if (iDeleteIndex >= 0) {
					oFileArray.splice(iDeleteIndex, 1);
					oClientDetailModel.setProperty("/attachFiles",oFileArray);
				}
				MessageToast.show("Event fileDeleted triggered");
			}.bind(this)).catch(function() {
				MessageToast.show("Event fileDeleted triggered Field");
			})
		},
 
		onFilenameLengthExceed : function(oEvent) {
			MessageToast.show("Event filenameLengthExceed triggered");
		},
 
		onFileSizeExceed : function(oEvent) {
			MessageToast.show("Event fileSizeExceed triggered");
		},
 
		onTypeMissmatch : function(oEvent) {
			MessageToast.show("Event typeMissmatch triggered");
		},
 
		onBeforeUploadStarts : function(oEvent) {
//			
			let oModel = this.getView().getModel("ClientDetail");
			let Client = oModel.getProperty("/clientSummary/clientCode")
			
			// Header Slug
			let oCustomerHeaderFileName = new sap.m.UploadCollectionParameter({
				name : "X-FileName",
				value : oEvent.getParameter("fileName")
			});
			// Header Slug
			let oCustomerHeaderClientCd = new sap.m.UploadCollectionParameter({
				name : "X-ClientCd",
				value : Client
			});
			// Header Slug
			let oCustomerHeaderY = new sap.m.UploadCollectionParameter({
				name : "X-EngageCd",
				value : Client
			});
			oEvent.getParameters().addHeaderParameter(oCustomerHeaderFileName);
			oEvent.getParameters().addHeaderParameter(oCustomerHeaderClientCd);
//			oEvent.getParameters().addHeaderParameter(oCustomerHeaderY);
			setTimeout(function() {
				MessageToast.show("Event beforeUploadStarts triggered");
			}, 4000);
			
		},
		onUploadComplete : function(oEvent) {
			
			let oFileUpload = oEvent.getParameter("files")[0];
			let sResponse = oFileUpload["responseRaw"];
			if (sResponse) {
				
				let oClientDetailModel = this.getView().getModel("ClientDetail");
				let oFileArray = oClientDetailModel.getProperty("/attachFiles");
				
				let oResponse = JSON.parse(sResponse);
				oFileArray.push(oResponse["results"][0]["attachFile"]);
				oClientDetailModel.setProperty("/attachFiles",oFileArray);
				
			} else {
				
			}
			oEvent.getSource().getParent().getParent().getParent().setBusy(false);
			setTimeout(function() {
				MessageToast.show("Event UploadComplete triggered");
			}, 4000);
		}
	});
});
