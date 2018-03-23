sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	'sap/viz/ui5/format/ChartFormatter',
	'sap/viz/ui5/api/env/Format'],
function(Controller, JSONModel, ChartFormatter, Format) {
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
			// oTooltip.setFormatString(CustomerFormat.FIORI_LABEL_FORMAT_2);
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
		onChange : function(oControlEvent) {
			var rABS = true;
			var files = oControlEvent.getParameters().files;
			var f = files[0];
			var reader = new FileReader();
			reader.onload = function(e) {
				var data = e.target.result;
				if (!rABS)
					data = new Uint8Array(data);
				var workbook = XLSX.read(data,	{
									type : rABS ? 'binary'	: 'array'
				});
	
				var data = XLSX.utils.sheet_to_html(workbook.Sheets.FY17Q1);
				/* DO SOMETHING WITH workbook HERE */
				
				document.write(data);
			};
			if (rABS)
				reader.readAsBinaryString(f);
			else
				reader.readAsArrayBuffer(f);
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
					bookSST : true
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
		}
	});
});