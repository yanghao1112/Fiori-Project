sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	'sap/viz/ui5/format/ChartFormatter',
	'sap/viz/ui5/api/env/Format',
	'sap/ZZZ01/ZCHARTTEST/js/sheet',
	'sap/ZZZ01/ZCHARTTEST/js/FileSaver'],
function(Controller, JSONModel, ChartFormatter, Format, XLSX, saveAs) {
	"use strict";
	return Controller.extend("sap.ZZZ01.ZCHARTTEST.controller.ZZmain", {

		/* =========================================================== */
		/* lifecycle methods */
		/* =========================================================== */

		/**
		 * Called when the controller is
		 * instantiated. It sets up the constant
		 * and JSON Model.
		 * 
		 * @public
		 */
		onInit : function(evt) {
			var oVizFrame = this.getView().byId("idVizFrame");

			var oTooltip = new sap.viz.ui5.controls.VizTooltip(
					{});
			oTooltip.connect(oVizFrame
					.getVizUid());
			// //

		},

		onResize: function() {
			var oVBox = this.getView().byId("ChartVBox");
			var iHeight = oVBox.getDomRef().offsetHeight;

			this.getView().byId("idVizFrame").setHeight(iHeight*0.9 + "px")
		},
		onAfterRendering: function() {
			var oVizFrame = this.getView().byId("1111");
		},
		onChartTypeChanged : function(oEvent) {
			var oVizFrame = this.getView()
					.byId("idVizFrame");
			var selectedKey = this.chart = parseInt(oEvent
					.getSource()
					.getSelectedKey());
			var oModel = this
					.getOwnerComponent()
					.getModel("list")
			var data = oModel.getData();
			var oDataSet = oVizFrame
					.getDataset();
			var oFeed = oVizFrame.getFeeds();
			var oCustom = oVizFrame
					.getVizCustomizations();
			var oProper = oVizFrame
					.getVizProperties();
			var oScale = oVizFrame
					.getVizScales();
			oVizFrame
					.setVizType(data.chartType.values[selectedKey].vizType);
			oVizFrame.vizUpdate({
				'data' : oDataSet,
				'properties' : oProper,
				'scales' : oScale,
				'customizations' : oCustom,
				'feeds' : oFeed

			});
		},
		onSelectA : function(evt) {
			var oVizFrame = this.getView()
					.byId("idVizFrame");
			var FeedItem = sap.viz.ui5.controls.common.feeds.FeedItem;
			var VizType = "column";
			var scales = [ {
				'feed' : 'color',
				'palette' : [ "#748CB2" ]
			} ];
			var feeds = [ new FeedItem({
				"uid" : "valueAxis",
				"type" : "Measure",
				"values" : [ "Accumulated" ]
			}), new FeedItem({
				"uid" : "categoryAxis",
				"type" : "Dimension",
				"values" : [ "Period" ]
			}) ];
			oVizFrame.setVizType(VizType);
			oVizFrame.vizUpdate({
				'feeds' : feeds,
				'scales' : scales
			});
		},
		onSelectB : function(evt) {
			var oVizFrame = this.getView()
					.byId("idVizFrame");
			var FeedItem = sap.viz.ui5.controls.common.feeds.FeedItem;
			var VizType = "column";
			var scales = [ {
				'feed' : 'color',
				'palette' : [ "#748CB2" ]
			} ];
			var feeds = [ new FeedItem({
				"uid" : "valueAxis",
				"type" : "Measure",
				"values" : [ "Periodical" ]
			}), new FeedItem({
				"uid" : "categoryAxis",
				"type" : "Dimension",
				"values" : [ "Period" ]
			}) ];
			oVizFrame.setVizType(VizType);
			oVizFrame.vizUpdate({
				'feeds' : feeds,
				'scales' : scales
			});

		},
		onSelectC : function(evt) {
			var oVizFrame = this.getView()
					.byId("idVizFrame");
			var FeedItem = sap.viz.ui5.controls.common.feeds.FeedItem;
			var VizType = "pie";
			var scales = [ {
				'feed' : 'color',
				'palette' : [ "#748CB2",
						"#9CC677", "#EACF5E",
						"#F9AD79", "#D16A7C",
						"#8873A2", "#3A95B3",
						"#B6D949", "#FDD36C",
						"#F47958", "#A65084",
						"#0063B1", "#0DA841",
						"#FCB71D", "#F05620",
						"#B22D6E", "#3C368E",
						"#8FB2CF", "#95D4AB",
						"#EAE98F", "#F9BE92",
						"#EC9A99", "#BC98BD",
						"#1EB7B2", "#73C03C",
						"#F48323", "#EB271B",
						"#D9B5CA", "#AED1DA",
						"#DFECB2", "#FCDAB0",
						"#F5BCB4" ]
			} ];
			var feeds = [ new FeedItem({
				"uid" : "size",
				"type" : "Measure",
				"values" : [ "Periodical" ]
			}), new FeedItem({
				"uid" : "color",
				"type" : "Dimension",
				"values" : [ "Period" ]
			}) ];
			oVizFrame.setVizType(VizType);
			oVizFrame.vizUpdate({
				'feeds' : feeds,
				'scales' : scales
			});

		},
		onPressDownload : function(evt) {
			

			var oModel = this.getOwnerComponent().getModel("list");
			var data = oModel.getData();
	
			var ws = XLSX.utils.json_to_sheet (data.Data);
			

			var rows = data.Data.length;
			var columns = 9;
			
			for (var iRows = 0; iRows < rows; iRows++) {
				for (var iColumns = 0; iColumns < columns; iColumns++) {
					var oCell = ws[XLSX.utils.encode_cell({
										c : iColumns,
										r : iRows
								})];
					oCell.s = {
                    }
					if ( iRows === 2) {
						if (typeof oCell.s.border === 'undefined') {
							oCell.s.border = {
									right : { style: "thin", color: { rgb: "FF000080" } },
									left : { style: "thin", color: { rgb: "FF000080" } },
		                            top: { style: "thin", color: { rgb: "FF000080" } },
		                            bottom: { style: "thin", color: { rgb: "FF000080" } }
							};

						};

						oCell.s.fill = {
	                            patternType: "solid",
	                            fgColor: { rgb: "FF99CCFF" }
						}
						
						oCell.s.font = {
								name : 'Calibri',
								sz : 12,
								bold : true,
								color: { rgb: 'e4140cFF' }
							}
					}
				}
			}
			
			var defaultStyleXml = jQuery.sap.sjax({
				url: sap.ui.resource("sap.ZZZ01.ZCHARTTEST", "data/styles.xml"),
				data: null,
				type: 'GET',
				dataType: "text"
			})
			
			var wb = {
					SheetNames : [ "ABC", "GDC", "ABCN"],
					Sheets : {
						ABC : ws,
						GDC : ws,
						ABCN : ws

					}
				};
				var wbout = XLSX.write(wb, {
					bookType: "xlsx",
					type : 'binary',
					bookSST : true,
					defaultStyleXml: defaultStyleXml.data
				});

				var fname = 'test.xlsx';
				try {
					saveAs(new Blob([ this.s2ab(wbout) ], {
						type : "application/octet-stream"
					}), fname);
				} catch (e) {
					if (typeof console != 'undefined')
						console.log(e, wbout);
				}
		},
		s2ab : function(s) {
			if (typeof ArrayBuffer !== 'undefined') {
				var buf = new ArrayBuffer(s.length);
				var view = new Uint8Array(buf);
				for (var i = 0; i != s.length; ++i)
					view[i] = s.charCodeAt(i) & 0xFF;
				return buf;
			} else {
				var buf = new Array(s.length);
				for (var i = 0; i != s.length; ++i)
					buf[i] = s.charCodeAt(i) & 0xFF;
				return buf;
			}
		},
		onPress: function() {
			var oNavigationList = this.getView()
			.byId("navigationList");
			var x = oNavigationList.getSelectedItem();
			alert(x.getText());

		},
		selectData: function(oEvent) {
			var x = 1;
		}
	});
});