sap.ui.define([
	'sap/m/P13nPanel'
], function(P13nPanel) {
	const THIS_MODULE_NAME = 'sap.ab.p13Panel.CustomPanel';
	const THIS_LIBRARY_NAME = 'sap.ab.p13Panel';

	var oCustomPanel = P13nPanel.extend(THIS_MODULE_NAME, {
		constructor: function(sId, mSettings) {
			sap.m.P13nPanel.apply(this, arguments);
		},
		metadata: {
			library: "sap.m",
			aggregations: {
	 
				/**
				 * Control embedded into CustomPanel
				 */
				content: {
					type: "sap.ui.core.Control",
					multiple: false,
					singularName: "content"
				}
			}
		},
		renderer: function(oRm, oControl) {
			if (!oControl.getVisible()) {
				return;
			}
			oRm.renderControl(oControl.getContent());
		}
	});
	return oCustomPanel;
});
