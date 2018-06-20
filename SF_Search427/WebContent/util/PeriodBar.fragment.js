sap.ui.jsfragment ( "sap.pwaa.util.PeriodBar",{ 
	createContent: function (aController ) {
		let oPeridData = aController.getOwnerComponent().getModel("Period").getData();
		let oContent = [];
		oPeridData.forEach(function(iItem, iIndex) {
			let oVBox = new sap.m.VBox().addStyleClass(iItem.Class);
			let oTitle = new sap.m.Title({
				width: "100%",
				text: iItem.Period,
				titleStyle: "H6",
				textAlign: "Center"
			})
			oVBox.addItem(oTitle);
			oContent.push(oVBox);
		})
		
        let oGrid  = new sap.ui.layout.Grid({
        	defaultSpan: "XL1 L1 M1 S1",
        	vSpacing: 0,
        	hSpacing: 0,
        	content: oContent
		}).addStyleClass(""); 
		return oGrid; 
	} 
});