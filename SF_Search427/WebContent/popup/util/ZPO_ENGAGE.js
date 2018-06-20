sap.ui.define([
	"sap/ui/base/Object",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/Popup",
	"sap/m/MessageBox",
	"sap/m/MessageToast",
	"sap/m/Button",
	"sap/m/Dialog",
	"sap/m/Text",
], function(BaseObject, JSONModel, Popup, MessageBox, MessageToast, Button, Dialog, Text) {
	"use strict";
	let oEngagementDialog = null;
	let oEditCommentDialog = null;
	let oHistoryCommentDialog = null;
	let oDataManager = null;
	const oQRMProgressModel = new JSONModel(jQuery.sap.getModulePath("sap.pwaa.popup.data",
					"/radarOptionQRMProgress.json"));
	
	const oQRMProposalModel = new JSONModel(jQuery.sap.getModulePath("sap.pwaa.popup.data",
					"/radarOptionQRMProposal.json"));
	
	let oZPO_ENGAGE = BaseObject.extend("sap.ui.demo.wt.popup.util.ZPO_ENGAGE",
	{
		
		/* =========================================================== */
		/* lifecycle methods                                           */
		/* =========================================================== */

		/**
		 * Called when the object is created.
		 * 1.Create the dialog UI
		 * 2.Set the i18n Model
		 * 3.Set Decline button to the header right of dialog
		 * @public
		 */
		constructor : function(aDataManager) {
			/* Create AnalysisFilter Dialog */
			oEngagementDialog = sap.ui.xmlfragment(
					"sap.pwaa.popup.view.ZZEngagementDetail",
					this);

			/* set i18n model */
			let sRootPath = jQuery.sap
					.getModulePath("sap.pwaa.popup");
			let i18nModel = new sap.ui.model.resource.ResourceModel({
				bundleUrl : [ sRootPath, "i18n/i18n.properties" ]
						.join("/")
			});

			oEngagementDialog.setModel(i18nModel, "i18n");
			let oDecline = new Button({
				icon:"sap-icon://decline",
				press: this.onClose
			})
			oEngagementDialog._header.addContentRight(oDecline);
			oDataManager = aDataManager;
		},
		
		/* =========================================================== */
		/* public methods                                     */
		/* =========================================================== */
		
		/**
		 * Open the dialog
		 * set the selection to the model data
		 * set first two comment as visible
		 * set show more button as visible
		 * set show less button as invisible
		 * set Dialog Title according to the engagement code/name
		 * @private
		 */	
		open : function(aEngageData) {
			"use strict";
			aEngageData.QRMData.Progress["Option"] = oQRMProgressModel.getData();
			aEngageData.QRMData.Proposal["Option"] = oQRMProposalModel.getData();

			if (aEngageData["Comment"]) {
				$.each(aEngageData["Comment"], function(aIdxComment, aComment){

					let oCommentData = {};
					$.extend(true, oCommentData, {
						OriginComment:	aComment
					});
					aComment["CommentVisible"] = true;
					aComment["OriginComment"] = oCommentData["OriginComment"];
				});
			}
			
			this._handleCommentData(aEngageData);
			
			let oEngageModel = new JSONModel(aEngageData)
			oEngagementDialog.setModel(oEngageModel, "EngageDetail");

			let oI18n = oEngagementDialog.getModel("i18n");
			let sTitle = oI18n.getResourceBundle().getText("ZFTitle",[aEngageData.EngageName, aEngageData.EngageCode])
			
			
			oEngagementDialog.setTitle( sTitle );
			
			if (oEngagementDialog.isOpen()) {
				return;
			} else {
				oEngagementDialog.open(100);
			}
		},
		
		/* =========================================================== */
		/* event handlers                                              */
		/* =========================================================== */
		
		/**
		 * Display Tooltip Popup
		 * Change the binding according the Evaluation Type
		 * @public
		 */
		onShowHelpContent: function(aEvent) {
			"use strict";
			// create popover
			let sPos = "Right";
			let oIcon = aEvent.getSource();
			let oCustomData = oIcon.getCustomData();
			let sText = oCustomData[0].getValue();
			
			if(oCustomData.length >= 2) {
				sPos = oCustomData[1].getValue();
			}
			
			if (! this._oPopover) {
				this._oPopover = sap.ui.xmlfragment("sap.pwaa.view.ZZHelpContent", this);
			}
			this._oPopover.setModel(new JSONModel({
				helpContent: sText
		      }));
			jQuery.sap.delayedCall(0, this, function () {
				this._oPopover.setPlacement(sPos);
				this._oPopover.openBy(oIcon);
			});
		},
		
		/**
		 * Event handling for clicking 'Evaluation Type' [Progress or Proposal]
		 * Change the binding according the Evaluation Type
		 * @public
		 */
		onQRMTypeChangeEngage: function(aControlEvent) {
			let sSelectedKey = aControlEvent.getSource().getSelectedItem().getKey();
			let oQRMPart = sap.ui.getCore().byId("QRMEngage");
			oQRMPart.bindElement({
				path: "/QRMData/" + sSelectedKey,
				model: "EngageDetail"
			});
		},
		
		/**
		 * Event handling for clicking 'Show more button'
		 * set all comment as visible
		 * set show more button as invisible
		 * set show less button as visible
		 * @public
		 */
		showMore: function(aControlEvent) {
			let oEngageModel = oEngagementDialog.getModel("EngageDetail")
			let oEngageData = oEngageModel.getData();
			oEngageData["ShowMoreVisible"] = false;
			oEngageData["ShowLessVisible"] = true;
			
			if (oEngageData["Comment"]) {
				$.each(oEngageData["Comment"], function(aIdxComment, aComment){
					aComment["CommentVisible"] = true;
				});
			}
			oEngageModel.updateBindings(true);
		},
		
		/**
		 * Event handling for clicking 'Show less button'
		 * set first two comment as visible
		 * set show more button as visible
		 * set show less button as invisible
		 * @public
		 */
		showLess: function(aControlEvent) {
			let oEngageModel = oEngagementDialog.getModel("EngageDetail")
			let oEngageData = oEngageModel.getData();
			this._handleCommentData(oEngageData);
			oEngageModel.updateBindings(true);
		},

		/**
		 * Event handling for clicking 'Edit Comment button'
		 * open edit comment dialog 
		 * get first comment if has
		 * @public
		 */
		onEditComment : function() {
			//Get Newest Comment and edit
			let oEngageDetailModel = oEngagementDialog.getModel("EngageDetail");
			let oFirstComment = oEngageDetailModel.getData()["Comment"][0];
			
			let oCommentData = {};
			$.extend(true, oCommentData, oFirstComment);
			let oDetailCommentModel = new JSONModel(oCommentData);
			
			let oI18n = oEngagementDialog.getModel("i18n");
			let sTitle = oI18n.getResourceBundle().getText("ZFCommentChangeTitle")
			
			this._openEditCommentDialog(oDetailCommentModel,sTitle);

		},

		/**
		 * Event handling for clicking 'Insert new record button'
		 * open edit comment dialog 
		 * @public
		 */
		onNewComment: function() {

			let oDetailCommentModel = new JSONModel({});
			let oI18n = oEngagementDialog.getModel("i18n");
			let sTitle = oI18n.getResourceBundle().getText("ZFCommentChangeTitle")
			
			this._openEditCommentDialog(oDetailCommentModel,sTitle);
		},

		/**
		 * Event handling for clicking 'Show History Comment' button
		 * Get History comment dialog
		 * Set i18n model
		 * Set comment data model
		 * Open dialog
		 * @public
		 */
		onShowHistoryComment: function() {
			if (!oHistoryCommentDialog) {
				oHistoryCommentDialog = sap.ui.xmlfragment(
						"sap.pwaa.popup.view.ZZHistoryComment",
						this);
				oHistoryCommentDialog.setEscapeHandler(this.onEscape);
				oHistoryCommentDialog.setModel(oEngagementDialog.getModel("i18n"),"i18n");
				let oEngageDetailModel = oEngagementDialog.getModel("EngageDetail");
				oHistoryCommentDialog.setModel(oEngageDetailModel,"EngageDetail");
				
			}
			if (oHistoryCommentDialog.isOpen()) {
				return;
			} else {

				oHistoryCommentDialog.open(100);
			}
			
		},
		
		/**
		 * Event handling for clicking 'Edit Comment' button on history dialog
		 * Get History comment data
		 * Get title according to History comment data
		 * Open Edit Comment dialog
		 * @public
		 */
		onEditHistoryComment: function() {

			let oHistoryCommentModel = oHistoryCommentDialog.getModel("DetailComment");
			let oHistoryComment = oHistoryCommentModel.getData();
			let oCommentData = {};
			$.extend(true, oCommentData, oHistoryComment);
			
			let oI18n = oEngagementDialog.getModel("i18n");
			let sTitle = oI18n.getResourceBundle().getText("ZFCommentChangeTitle")
			
			
			let oDetailCommentModel = new JSONModel(oCommentData);
			
			
			this._openEditCommentDialog(oDetailCommentModel,sTitle);

		},
		
		/**
		 * Event handling list(UI) of comment update finished
		 * Select the first Comment
		 * @public
		 */
		onCommentListUpdateFinished: function() {
			let oList = sap.ui.getCore().byId("ZCommentList");
			let oAllItems = oList.getItems();
			if (oAllItems.length > 0) {
				oList.setSelectedItem(oAllItems[0]);
				let oEngageDetailModel = oEngagementDialog.getModel("EngageDetail");
				let oFirstComment = oEngageDetailModel.getData()["Comment"][0];
				let oDetailCommentModel = new JSONModel(oFirstComment);
				oHistoryCommentDialog.setModel(oDetailCommentModel,"DetailComment");
			}
		},
		
		/**
		 * Event handling for select one comment from comment list
		 * Change comment data model on detail view
		 * @public
		 */
		onCommentListSelect: function(oControlEvent) {

			let oList = sap.ui.getCore().byId("ZCommentList");
			let oSelectData = oList.getSelectedContexts()[0].getObject();
			let oDetailCommentModel = new JSONModel(oSelectData);
			oHistoryCommentDialog.setModel(oDetailCommentModel,"DetailComment");

		},
		
		/**
		 * Event handling for clicking 'delete' button
		 * Popup a confirm dialog
		 * delete the comment when click delete
		 * close the dialog when click cancel
		 * @public
		 */
		onDeleteComment: function(aControlEvent) {
			let oButton = aControlEvent.getSource();
			let oData = oButton.getBindingContext("DetailComment").getObject();
			let oI18nResourceBundle = oEngagementDialog.getModel("i18n").getResourceBundle();
			let sDetail = oI18nResourceBundle.getText("ZFDeleteCommentDetail", [oData["EffectiveDate"]]);

			let oPromise = new Promise(function(fnResolve, fnReject) {
				let oDialog = new Dialog({
					title: oI18nResourceBundle.getText("ZFDeleteCommentTitle"),
					type: "Message",
					state: "None",
					content: new Text({
						text: sDetail
					}),
					buttons: [new Button({
						text: oI18nResourceBundle.getText("ZFCancelButton"),
						press: function () {
							fnReject(oData);
							oDialog.close();
						}
					}),new Button({
						text: oI18nResourceBundle.getText("ZFDeleteButton"),
						type: "Emphasized",
						press: function () {
							fnResolve(oData);
							oDialog.close();
						}
					})],
					afterClose: function() {
						oDialog.destroy();
					}
				});
				oDialog.open();
			}.bind(this))
			
			oPromise.then(function(aData) {
				let oDeletePromise = oDataManager.deleteCommentData(aData);
				return oDeletePromise;
			}.bind(this)).then(function() {
				var msg = "delete success";
				MessageToast.show(msg);
			}.bind(this)).catch(function() {
				var msg = "delete success";
				MessageToast.show(msg);
			}.bind(this));

		},
		
		/**
		 * Event handling for clicking 'save' button
		 * Popup a confirm dialog if there have some changes not saved
		 * close the confirm dialog and edit comment dialog when click don't save
		 * close the confirm dialog when click cancel
		 * save the comment when click save button
		 * @public
		 */
		onEditCommentSave: function(aControlEvent) {

			let oEffectiveDatePicker = sap.ui.getCore().byId("EffectiveDatePicker");
			let oCommentByInput = sap.ui.getCore().byId("CommentByInput");
			let oCommentTextArea = sap.ui.getCore().byId("CommentTextArea");
			let bNoErrorFlag = true;
			
			//Check whether there has error on input field
			[	oEffectiveDatePicker,
				oCommentByInput,
				oCommentTextArea
			].every(function(aCurrentControl, aIndex, aArr) {
				if (aCurrentControl.getValueState() !== "None" ) {
					aCurrentControl.focus();
					bNoErrorFlag = false;
					return false;
				} else {
					return true;
				}
			});
			
			if (bNoErrorFlag) {
				//Check whether changed data is same with origin data
				let oButton = aControlEvent.getSource();
				let oData = oButton.getBindingContext("DetailComment").getObject();
				let oI18nResourceBundle = oEngagementDialog.getModel("i18n").getResourceBundle();
				
				let bSameFlag = this._checkDataWithOrgin(oData);

				let oPromise = null;
				if (bSameFlag) {
					return;
				} else {
					oDataManager.saveCommentData(oData).then(function() {
						
					}).catch(function() {
						
					});
				}
			} else {
				return;
			}
		},
		/**
		 * Event handling for clicking 'close' button
		 * Popup a confirm dialog if there have some changes not saved
		 * close the confirm dialog and edit comment dialog when click don't save
		 * close the confirm dialog when click cancel
		 * save the comment when click save button
		 * @public
		 */
		onEditCommentClose: function(aControlEvent) {
			let oButton = aControlEvent.getSource();
			let oData = oButton.getBindingContext("DetailComment").getObject();
			let oI18nResourceBundle = oEngagementDialog.getModel("i18n").getResourceBundle();
			let sDetail = oI18nResourceBundle.getText("ZFEditCommentCloseDetail", [oData["EffectiveDate"]]);
			
			let bSameFlag = this._checkDataWithOrgin(oData);
			
			let oPromise = null;
			if (bSameFlag) {
				oPromise = Promise.reject(2)
			} else {

				oPromise = new Promise(function(fnResolve, fnReject) {
					let oDialog = new Dialog({
						title: oI18nResourceBundle.getText("ZFEditCommentCloseTitle"),
						type: "Message",
						state: "Warning",
						content: new Text({
							text: sDetail
						}),
						buttons: [new Button({
							text: oI18nResourceBundle.getText("ZFCancelButton"),
							press: function () {
								fnReject(1);
								oDialog.close();
							}
						}),new Button({
							text: oI18nResourceBundle.getText("ZFDontSaveButton"),
							press: function () {
								fnReject(2);
								oDialog.close();
							}
						}),new Button({
							text: oI18nResourceBundle.getText("ZFSaveButton"),
							press: function () {
								fnResolve(oData);
								oDialog.close();
							}
						})],
						afterClose: function() {
							oDialog.destroy();
						}
					});
					oDialog.open();
					
				}.bind(this))
			}
			
			oPromise.then(function(aData) {
				let oSavePromise = oDataManager.saveCommentData(oData);
				return oSavePromise;
			}.bind(this)).then(function() {
				oEditCommentDialog.close();
			}).catch(function(aType) {
				if (aType === 1) {
				} else {
					oEditCommentDialog.close();
				}
			}.bind(this));
		},
		
		
		/**
		 * Event handling for clicking 'close' button on history dialog
		 * @public
		 */
		onHistoryCommentClose: function() {
			oHistoryCommentDialog.close();
		},
		
		/**
		 * Event handling for clicking 'close' button on engagement detail dialog
		 * @public
		 */
		onClose : function() {
			oEngagementDialog.close();
		},

		/**
		 * Event handling for clicking 'Esc' keyboard button
		 * Make the dialog can't be closed be press 'Esc'
		 * @public
		 */
		onEscape: function(aPromise) {
			aPromise.reject();
		},

		/* =========================================================== */
		/* internal methods											   */
		/* =========================================================== */
		
		/**
		 * Set first two comment as visible
		 * Set show more button as visible if there are more than 2 comments
		 * Set show less button as invisible
		 * @private
		 */
		_handleCommentData: function(aEngageData) {
			let iLength = aEngageData["Comment"].length ? aEngageData["Comment"].length : 0 ;
			if (aEngageData["Comment"]) {

				$.each(aEngageData["Comment"], function(aIdxComment, aComment){
					if (aIdxComment < 2) {
						aComment["CommentVisible"] = true;
					} else {
						aComment["CommentVisible"] = false;
					}
				});
			}
			if (iLength > 2) {
				aEngageData["ShowMoreVisible"] = true;
				aEngageData["ShowLessVisible"] = false;
			} else {
				aEngageData["ShowMoreVisible"] = false;
				aEngageData["ShowLessVisible"] = false;
			}
			
		},
		
		/**
		 * Get edit comment dialog
		 * Set i18n model
		 * Set edit comment dialog title
		 * Open dialog
		 * @private
		 */
		_openEditCommentDialog: function(aDetailCommentModel, aDialogTitle) {
			
			if (!oEditCommentDialog) {
				oEditCommentDialog = sap.ui.xmlfragment(
					"sap.pwaa.popup.view.ZZEditComment",
					this);
				oEditCommentDialog.setModel(oEngagementDialog.getModel("i18n"),"i18n");
				oEditCommentDialog.setEscapeHandler(this.onEscape);
			}
			if (oEditCommentDialog.isOpen()) {
				return;
			} else {
				let oEffectiveDatePicker = sap.ui.getCore().byId("EffectiveDatePicker");
				oEffectiveDatePicker.setValueState("None");
				let oCommentByInput = sap.ui.getCore().byId("CommentByInput");
				oCommentByInput.setValueState("None");
				let oCommentTextArea = sap.ui.getCore().byId("CommentTextArea");
				oCommentTextArea.setValueState("None");
				
				oEditCommentDialog.setModel(aDetailCommentModel,"DetailComment");
				oEditCommentDialog.setTitle(aDialogTitle);
				oEditCommentDialog.open(100);
			}
		},
		
		/**
		 * Check changed comment data is same with origin comment data or not
		 * 
		 * @private
		 */
		_checkDataWithOrgin: function(aCommentData) {

			let bSameFlag = false;
			
			if (aCommentData["OriginComment"]) {
				bSameFlag =
				( aCommentData["EffectiveDate"] === aCommentData["OriginComment"]["EffectiveDate"] ) && 
				( aCommentData["CommentBy"] === aCommentData["OriginComment"]["CommentBy"] ) && 
				( aCommentData["Comment"] === aCommentData["OriginComment"]["Comment"] )
			} else {
				bSameFlag =
				(aCommentData["EffectiveDate"] === undefined) &&
				(aCommentData["CommentBy"] === undefined) &&
				(aCommentData["Comment"] === undefined)
			}
			return bSameFlag;
		},
		
		/**
		 * Save changed comment data
		 * 
		 * @private
		 */
		_saveCommentData: function(oData) {
			let oPromise = oDataManager.saveCommentData(oData);
			oPromise.then(function() {
				
			}).catch(function() {
				
			});
		}
	});

	return oZPO_ENGAGE;
});