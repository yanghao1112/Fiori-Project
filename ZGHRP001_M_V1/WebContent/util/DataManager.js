/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.declare("sap.ZG001.timesheet.input.dailyDemo.util.DataManager");
jQuery.sap.require("sap.ui.model.odata.datajs");
jQuery.sap.require("sap.m.MessageToast");
jQuery.sap.require("sap.ca.ui.message.message");
jQuery.sap.require("sap.ui.base.EventProvider");
jQuery.sap.require("sap.m.MessageBox");

sap.ui.base.EventProvider
	.extend(
		"sap.ZG001.timesheet.input.dailyDemo.DataManager", {
			constructor: function(aDataModel,aBundle) {
				this._iCounter = 0;
				this._oBusyDialog = new sap.m.BusyDialog();
				this.oDataModel = aDataModel;
				this.oBundle = aBundle;
			},

			processError: function(aError) {
				var sMessage = "";
				var sMessageDetails = "";
				var oSelf = this;
				if (aError.response) {
					var oBody = aError.response.body;
					try {
						oBody = JSON.parse(oBody);
						if (oBody.error.innererror && oBody.error.innererror.errordetails) {

							var oErrors = oBody.error.innererror.errordetails;
							for (var i = 0; i < oErrors.length; i++) {
								sMessageDetails += oErrors[i].code + " : " + oErrors[i].message + "\n";
							}
							sMessage = this.oBundle.getText("ZF_NUMBEROFERROR",oErrors.length);

						}
						if (sMessageDetails === "") {
							sMessage = oBody.error.code + " : " + oBody.error.message.value;
						}
						
					} catch (e) {
						jQuery.sap.log.warning("Could parse the response", ["parseError"], ["sap.ZG001.timesheet.input.dailyDemo"]);
					}
				}
				if (sMessage === "") {
					sMessage = this.oBundle.getText("INTERNAL_ERROR");
				}
				if (sMessageDetails === "") {
					sMessageDetails = this.oBundle.getText("INTERNAL_ERROR_BODY");
				}
				var oMessage = {
					message: sMessage,
					details: sMessageDetails,
					type: sap.m.MessageBox.Icon.ERROR
					/* 	type: sap.ca.ui.message.Type.ERROR*/
				};

				try {
					setTimeout(function(){
						sap.m.MessageBox.show(
							oMessage.message, {
								icon: oMessage.type,
								title: oSelf.oBundle.getText("ERROR"),
								actions: [sap.m.MessageBox.Action.OK],
								details: oMessage.details,
								onClose: function(oAction) {}
							}
						);
					},300);
				} catch (o) {
					setTimeout(function(){
						oMessage.type = sap.ca.ui.message.Type.ERROR;
						sap.ca.ui.message.showMessageBox({
							type: sap.ca.ui.message.Type.ERROR,
							message: oMessage.message,
							details: oMessage.details
						});
					},300);
				}

			},
			
			getRootPernr: function(aSuccess) {
				this.showBusy();
				var oSelf = this;
				this.oDataModel
					.read(
							"/RootPernrSet",
							null, [],
							true,
							function(aData) {
								aSuccess(aData.results);
								oSelf.hideBusy(true);
							},
							function(aError) {
								oSelf.hideBusy(true);
								oSelf.processError(aError);
							});
			},

			updateTimesheetData: function(aPernr,aWorkingHours,aTimesheetData,aTimesheetDataOld,aSuccess) {
				var sDatePath = "/RootPernrSet";
				this.showBusy();
				var oSelf = this;
				this.oDataModel.create(sDatePath,{
					"Pernr": aPernr,
					"WorkingHoursSet" : aWorkingHours,
					"TimesheetDataSet": aTimesheetData,
					"TimesheetDataOldSet": aTimesheetDataOld
					},{
					success: function(){
						oSelf.hideBusy(true);
						aSuccess();
					},
					error: function(aError){
						oSelf.hideBusy(true);
						oSelf.processError(aError);
					}
				});
			},

			getWorkCalendar: function(aPernr, aBegda, aEndda, aSuccess) {
				var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyy-MM-ddTHH:mm:ss"});
				oDateFormat.format(new Date());
				this.showBusy();
				var oSelf = this;
				this.oDataModel
					.read(
							"/WorkCalendarSet",
							null, ["$filter=Pernr eq '" + aPernr
							       + "' and StartDate eq datetime'" + oDateFormat.format(aBegda)
							       + "' and EndDate eq datetime'" + oDateFormat.format(aEndda)
							       + "'" ],
							       true,
							function(aData) {
								aSuccess(aData.results);
								oSelf.hideBusy(true);
							},
							function(aError) {
								oSelf.hideBusy(true);
								oSelf.processError(aError);
							});
			},

			getWorkingHours: function(aPernr, aBegda, aEndda, aSuccess) {
				var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyy-MM-ddTHH:mm:ss"});
				oDateFormat.format(new Date());
				this.showBusy();
				var oSelf = this;
				this.oDataModel.read(
						"/WorkingHoursSet",
						null, ["$filter=Pernr eq '" + aPernr
						       + "' and StartDate eq datetime'" + oDateFormat.format(aBegda)
						       + "' and EndDate eq datetime'" + oDateFormat.format(aEndda)
						       + "'"],
						       true,
						function(aData) {
							aSuccess(aData.results);
							oSelf.hideBusy(true);
						},
						function(aError) {
							oSelf.processError(aError);
							oSelf.hideBusy(true);
						});
			},
			
			getDeductionTsCd: function(aSuccess) {
				this.showBusy();
				var oSelf = this;
				this.oDataModel.read(
						"/DeductionTScdSet",
						null, [],
						true,
						function(aData) {
							aSuccess(aData.results);
							oSelf.hideBusy(true);
						},
						function(aError) {
							oSelf.processError(aError);
							oSelf.hideBusy(true);
						});
			},

			getSubEntry: function(aPernr , aSuccess){
				this.showBusy();
				var oSelf = this;
				this.oDataModel.read(
						"/SubEntrySet",
						null, ["$filter=Pernr eq '" + aPernr 
						       + "'"],
						       true,
						function(aData) {
							aSuccess(aData);
							oSelf.hideBusy(true);
						},
						function(aError) {
							oSelf.processError(aError);
							oSelf.hideBusy(true);
						});
			},
			
			getSettingInfo: function(aPernr, aBegda, aEndda, aMode,aSourceScreenMode, aSuccess) {
				var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyy-MM-ddTHH:mm:ss"});
				oDateFormat.format(new Date());

				this.showBusy();
				var oSelf = this;
				this.oDataModel
					.read(
							"/SettingInfoSet",
							null, ["$filter=Pernr eq '" + aPernr
							       + "' and StartDate eq datetime'" + oDateFormat.format(aBegda)
							       + "' and EndDate eq datetime'" + oDateFormat.format(aEndda)
							       + "' and UIDisplayMode eq " + aMode
							       + " and ProxyType eq '" + aSourceScreenMode
							       + "'"],
							       true,
						function(oData) {
								aSuccess(oData.results);
							oSelf.hideBusy(true);
						},
						function(oError) {
							oSelf.hideBusy(true);
							oSelf.processError(oError);
						});
			},
			
			getTimesheetData: function(aPernr, aBegda, aEndda, aSuccess) {
				var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyy-MM-ddTHH:mm:ss"});
				oDateFormat.format(new Date());
				this.showBusy();
				var oSelf = this;
				this.oDataModel.read(
						"/TimesheetDataSet",
						null, ["$filter=Pernr eq '" + aPernr
						       + "' and StartDate eq datetime'" + oDateFormat.format(aBegda)
						       + "' and EndDate eq datetime'" + oDateFormat.format(aEndda)
						       + "'"],
						       true,
						function(aData) {
							aSuccess(aData.results);
							oSelf.hideBusy(true);
						},
						function(aError) {
							oSelf.processError(aError);
							oSelf.hideBusy(true);
						});
			},

			getDefaultTimesheet: function(aPernr, aBegda, aEndda, aProxyType, aSuccess) {
				var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyy-MM-ddTHH:mm:ss"});
				oDateFormat.format(new Date());
				this.showBusy();
				var oSelf = this;
				this.oDataModel
					.read(
							"/DefaultTimesheetSet",
							null, ["$filter=Pernr eq '" + aPernr
							       + "' and StartDate eq datetime'" + oDateFormat.format(aBegda)
							       + "' and EndDate eq datetime'" + oDateFormat.format(aEndda)
							       + "' and ProxyType eq '" + aProxyType
							       + "'"],
							true,
							function(aData) {
								aSuccess(aData.results);
								oSelf.hideBusy(true);
							},
							function(aError) {
								oSelf.hideBusy(true);
								oSelf.processError(aError);
							});
			},

			getMonthlyWorkingTime: function(aPernr,aYear,aMonth,aDate,aSuccess) {
				var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyy-MM-ddTHH:mm:ss"});
				oDateFormat.format(new Date());
				this.showBusy();
				var oSelf = this;
				this.oDataModel
					.read(
							"/MonthlyWorkingTimeSet",
							null, ["$filter=Pernr eq '" + aPernr
							       + "' and Year eq '" + aYear
							       + "' and Month eq '" + aMonth
							       + "' and WorkDate eq datetime'" + oDateFormat.format(aDate)
							       + "'"],
							true,
							function(aData) {
								aSuccess(aData);
								oSelf.hideBusy(true);
							},
							function(aError) {
								oSelf.hideBusy(true);
								oSelf.processError(aError);
							});
			},

			getMonthDetailInfo: function(aPernr, aYear, aMonth,aSuccess) {
				this.showBusy();
				var aSelf = this;
				this.oDataModel
					.read(
							"/MonthDetailInfoSet(Pernr='" + aPernr
							+ "',Month='" + aMonth
							+ "',Year='" + aYear
							+ "')",
							null, [],
							true,
							function(aData) {
								aSuccess(aData);
								aSelf.hideBusy(true);
							},
							function(aError) {
								aSelf.hideBusy(true);
								aSelf.processError(aError);
							});
			},
			
			getDateValidationse: function (aPernr,aBegda,aEndda,aSuccess){
				var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyy-MM-ddTHH:mm:ss"});
				oDateFormat.format(new Date());
				this.showBusy();
				var oSelf = this;
				this.oDataModel
					.read(
							"/DateValidationSet",
							null,["$filter=Pernr eq '" + aPernr
							+ "' and StartDate eq datetime'" + oDateFormat.format(aBegda)
							+ "' and EndDate eq datetime'" + oDateFormat.format(aEndda)
							+ "'"],
							true,
							function(aData) {
								aSuccess(aData.results);
								oSelf.hideBusy(true);
							},
							function(aError) {
								oSelf.hideBusy(true);
								oSelf.processError(aError);
							});
			},
			
			getClientText: function(aClntCd,aSuccess) {
				var aSelf = this;
				this.oDataModel
					.read(
							"/ClientTextSet(ClntCd='" + aClntCd
							+ "')",
							null, [],
							true,
							function(aData) {
								aSuccess(aData);
							},
							function(aError) {
								aSelf.processError(aError);
							});
			},
			getTimesheetCodeText: function(aTsMnCd, aTsSubCd,aSuccess) {
				var aSelf = this;
				this.oDataModel
					.read(
							"/TimesheetCodeTextSet(TSCdOutput='" + aTsMnCd
							+ "',TsSbCd='" + aTsSubCd
							+ "')",
							null, [],
							true,
							function(aData) {
								aSuccess(aData);
							},
							function(aError) {
								aSelf.processError(aError);
							});
			},
			getApproverName: function(aPernr,aSuccess) {
				var aSelf = this;
				this.oDataModel
					.read(
							"/ApproverNameSet(Appointapp='" + aPernr
							+ "')",
							null, [],
							true,
							function(aData) {
								aSuccess(aData);
							},
							function(aError) {
								aSelf.processError(aError);
							});
			},
			
			showBusy: function() {
				this._iCounter++;
				if (this._iCounter === 1) {
					this._oBusyDialog.open();

				}
			},

			hideBusy: function(aForceHide) {
				if (this._iCounter === 0) {
					return;
				}
				this._iCounter = aForceHide ? 0 : Math.max(0,
					this._iCounter - 1);
				if (this._iCounter > 0) {
					return;
				}
				this._oBusyDialog.close();
			}

		});