/// <reference path="../../../../../td/ui5/jQuery.d.ts" />.
/// <reference path="../../../../../td/ui5/sap.m.d.ts" />.
/// <reference path="../../../../../td/ui5/sap.ui.d.ts" />.

sap.ui.define([ 'sap/ui/core/Control' ], function(Control) {
	const THIS_MODULE_NAME = 'sap.ab.projectCard.ProjectCard';
	const THIS_LIBRARY_NAME = 'sap.ab.projectCard';

	function renderer(oRm, oControl) {

		// Create the control

		oRm.write('<div');
		oRm.writeControlData(oControl);
		oRm.write('>');

		var aContent = oControl.getContent();
		var l = aContent.length;

		for (var i = 0; i < l; i++) {
			oRm.renderControl(aContent[i]);
		}

		oRm.write('</div>');
	}
	function rerender() {
	}
	function onAfterRendering() {
	}
	var oProjectCard = Control.extend(THIS_MODULE_NAME, {
		metadata : {
			library : THIS_LIBRARY_NAME,
			defaultAggregation : "content",
			aggregations : {
				/**
				 * Controls that are placed into Grid layout.
				 */
				content : {
					type : "sap.ui.core.Control",
					multiple : true,
					singularName : "content"
				}
			},
			events : {
				click : {},
			},
			designTime: true
		},
		renderer : renderer,
		onAfterRendering : onAfterRendering
	});
	oProjectCard.prototype.onclick = function() {
		this.fireClick();
	}
	return oProjectCard;
});
