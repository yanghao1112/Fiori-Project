sap.ui.controller("ObjectPage.ext.controller.MyObjectPageExt",
{

	onPrintAction : function(oEvent) {
		// alert("hello word!")
		var oModel = oEvent.getSource().getModel();
		var oPath = oEvent.getSource().getBindingContext()
				.getPath();
		var oData = oModel.getProperty(oPath)
		var sResource = sap.ui.resource("ObjectPage", "ext/pdfjs/web/viewer.html");
		path = sResource + "?file="
				+ encodeURIComponent("../../../proxy/sap/opu/odata/sap/ZSALESORDER_CP_SRV/PDFSet(OrderNo='"
						+ oData.OrderNo + "')/$value");
		window.open(path, "PDF");
	},
	onCustomAction2 : function(oEvent) {
	}
});