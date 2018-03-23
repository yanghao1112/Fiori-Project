sap.ui.define([ 
	"sap/ui/core/mvc/Controller",
	"sap/viz/ui5/controls/common/feeds/FeedItem",
	"sap/viz/ui5/data/FlattenedDataset",
	"sap/m/BusyDialog"
],function(Controller, FeedItem, FlattenedDataset, BusyDialog) {
	"use strict";
	return Controller.extend("ShipmentHF.controller.ZZmain", {
		onInit : function() {
			var oComponent = this.getOwnerComponent();
			this._oDataManager = oComponent.oDataManager;
			this.Data = {};
			this.DataString = "";
			this.oForcastDataArray = [];
			this.SystemPeriod = null;
			// Get Available Year
			this._oBusyDialog = new BusyDialog();
			this._oBusyDialog.open();
			this._oDataManager.getAvailableYear().then(
				function(aData) {
					this.SystemPeriod = aData.results[0];
					return this._oDataManager.getShipmentData(aData);
				}.bind(this)
			).then(
				//Condense Dummy Data to System Date
				this.condenseData.bind(this)
			).then(
				//Prepare Data String for ML API
				this.getDataString.bind(this)
			).then(
				// Call API
				this.onExcuteAPI.bind(this)
			).then(
				// Analyze Response
				function(aResponse) {
					this.analyzeResponse(aResponse);
					this.displayDataToChart();
					this.setChart();
					this._oBusyDialog.close();
				}.bind(this)
			);
		},
		condenseData: function(aDataArray) {
			var aPromise = new Promise(function(fResolve, fReject) {
				var oCondenseResult = [];
				aDataArray.results.forEach(function(aValue, aIndex) {
					if (aValue.Year < this.SystemPeriod.Year 
							|| ( aValue.Year === this.SystemPeriod.Year && aValue.Period <= this.SystemPeriod.Period )
							) {
						oCondenseResult.push(aValue);
					}
				}.bind(this));
				fResolve(oCondenseResult);
			}.bind(this))
			
			return aPromise;
		},
		getDataString : function(aDataArray) {
			var aPromise = new Promise(function(fResolve, fReject) {
				this.Data = aDataArray;
				aDataArray.forEach(function(value, index, ar) {
					this.DataString = this.DataString
							+ Number(value.Plnmg)
							+ ",";
				}.bind(this));
				fResolve(this.DataString.substring(0,this.DataString.length - 1));
			}.bind(this))
			
			return aPromise;
		},
		
		displayDataToChart: function() {
			var oChartData = [];

			//Append Actual Data to ChartData
			this.Data.forEach(function(aValue, aIndex) {
				if (aValue.Year === this.SystemPeriod.Year ||
					(parseInt(aValue.Year) === (this.SystemPeriod.Year-1) && aValue.Period > this.SystemPeriod.Period)
						) {
					oChartData.push(aValue);
				}
			}.bind(this));
			
			//Append Forecast Data to ChartData
			var iAppendTimes = 15 - oChartData.length;
			var iForecast = Number(this.SystemPeriod.Period.substring(1)) + 1;
			var iYear = this.SystemPeriod.Year;
			this.SystemPeriod.ForecastMonth = iYear.concat(iForecast >= 10 ? iForecast : '0'.concat(iForecast));
			for(var iIndex = 0; iIndex < iAppendTimes; iIndex++) {
				var oForecast = {};
				oForecast.Year = this.SystemPeriod.Year;
				var iForecast = Number(this.SystemPeriod.Period.substring(1)) + iIndex + 1;
				oForecast.Year = parseInt((iForecast-1)/12) + parseInt(oForecast.Year);
				oForecast.Year = oForecast.Year.toString();
				if (iForecast > 12) {
					iForecast = iForecast - parseInt((iForecast-1)/12)*12;
				}
				oForecast.Period = iForecast >= 10 ? 'P' + iForecast : 'P0' + iForecast;
				oForecast.Plnmg = this.oForcastDataArray[iIndex];
				oForecast.Month = oForecast.Year.
				concat(iForecast >= 10 ? iForecast : '0'.concat(iForecast));
				oChartData.push(oForecast);
			}

			var oModel = new sap.ui.model.json.JSONModel();
			oModel.setData(oChartData);

			var oVizFrame = this.getView().byId("idVizFrame");
			oVizFrame.setVizType('line');
			oVizFrame.setModel(oModel);
			
		},
		analyzeResponse : function(aResponse) {
			var oJsonResponse = JSON.parse(aResponse);
			var oModel = new sap.ui.model.json.JSONModel();
			var oForecastResponseArray = oJsonResponse.response[0].split(",");
			
			oForecastResponseArray.forEach(function(value, index, ar) {
				var oForcastResponseSingle = value.split(":");
				this.oForcastDataArray.push(((parseFloat(oForcastResponseSingle[0])
								+ parseFloat(oForcastResponseSingle[1]) + parseFloat(oForcastResponseSingle[2])) / 3).toFixed(3))
			}.bind(this));
	
			//return oForecastResponseArray;
		},
		setChart: function() {
			
			var oVizFrame = this.getView().byId("idVizFrame");
			var oCustom = oVizFrame.getVizCustomizations();
			var oProper = {
				"title" : {
					"text" : "Shipment History and Forecast"
				},
				"plotArea" : {
					"marker" : {
						"visible" : true
					},
					"isSmoothed" : false,
					"dataLabel" : {
						"visible" : true
					},
					"dataPointStyle" : {
						"rules" : [{
							"dataContext" : {
								"Period":{
									"min": this.SystemPeriod.ForecastMonth
								}
							},
							"properties" : {
								"color" : "#03A9F4",
								"lineColor" : "#03A9F4",
								"lineType" : "dot"
							},
							"displayName" : "Forecast",
							"dataName" : {
								"Quantity" : "*"
							}
						}],
						others:{
							"properties" : {
								"color" : "#03A9F4",
								"lineColor" : "#03A9F4",
								"lineType" : "solid"
							},
							"displayName" : "Actual",
							"dataName" : {
								"Quantity" : "*"
							}
						}
					}
				}
			}

			var oScale = oVizFrame.getVizScales();
			var piedata = {
				"dimensions" : [ {
					"name" : "Period",
					"value" : "{Month}",
					"displayValue": "{Period}"
				},
				{
					"name" : "Calendar Year",
					"value" : "{Year}",
				}],
				"measures" : [ {
					"name" : "Quantity",
					"value" : "{Plnmg}"
				} ],
				data : {
					path : "/"
				}

			};
			var pieDataSet = new FlattenedDataset(piedata);
			var pieFeed = [ new FeedItem({
				"uid" : "valueAxis",
				"type" : "Measure",
				"values" : [ "Quantity" ]
			}), new FeedItem({
				"uid" : "categoryAxis",
				"type" : "Dimension",
				"values" : [ "Calendar Year" ]
			}), new FeedItem({
				"uid" : "categoryAxis",
				"type" : "Dimension",
				"values" : [ "Period" ]
			}) ];
			
			oVizFrame.vizUpdate({
				'data' : pieDataSet,
				'properties' : oProper,
				'scales' : oScale,
				'customizations' : oCustom,
				'feeds' : pieFeed
			});
			oVizFrame.setDataset(pieDataSet);
			oVizFrame.setVizProperties(oProper);
			oVizFrame.setVizScales(oScale);
			oVizFrame.setVizCustomizations(oCustom);
			
			oVizFrame.removeAllFeeds();
			oVizFrame.addFeed(pieFeed[0]).addFeed(pieFeed[1]).addFeed(pieFeed[2]);
		},
		
		onExcuteAPI : function(aDataString) {
			var data = new FormData();
			data.append("options", '{"period":12, "periods_to_forecast": 12}');
			data.append("texts", aDataString);

			var oPostPromise = new Promise(	function(fResolve, fReject) {
				var xhr = new XMLHttpRequest();
				xhr.withCredentials = false;

				xhr.addEventListener("readystatechange",
					function() {
						if (this.readyState === this.DONE) {
							console.log(this.responseText);
						}
				});

				// setting request
				// method
				// API endpoint for API
				// sandbox
				xhr.open("POST", "https://sandbox.api.sap.com/ml/timeseriesforecast/inference_sync");

				// adding request
				// headers
				xhr.setRequestHeader("Accept","application/json");
				// API Key for API
				// Sandbox
				xhr.setRequestHeader("APIKey","z1nPDdG15DT2CvBUIsyEeBBsTuApdFsU");

				// sending request
				XMLHttpRequest._SAP_ENHANCED === true ? xhr._send(data) : xhr.send(data);

				xhr.onload = function() {
					fResolve(xhr.responseText);
				};
			});

			return oPostPromise;
		}
	});

});