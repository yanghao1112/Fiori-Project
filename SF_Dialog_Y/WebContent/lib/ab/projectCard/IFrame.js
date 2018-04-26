/// <reference path="../../../../../td/ui5/jQuery.d.ts" />.
/// <reference path="../../../../../td/ui5/sap.m.d.ts" />.
/// <reference path="../../../../../td/ui5/sap.ui.d.ts" />.

sap.ui.define([ 'sap/ui/core/Control' ], function(Control) {
	const THIS_MODULE_NAME = 'sap.ab.projectCard.IFrame';
	const THIS_LIBRARY_NAME = 'sap.ab.projectCard';

	function renderer(oRm, oControl) {

		// Create the control
//<iframe width=420 height=330 frameborder=0 scrolling=auto src=URL>
		oRm.write('<iframe');
		oRm.writeAttributeEscaped("src", "https://salesdemo.successfactors.eu/sf/directory?bplte_company=SFPART016845&_s.crb=rUKtTS7%2bk3fvn9ZGpwk3BmFvWco%3d");

		oRm.writeAttributeEscaped("width", "100%");
		oRm.writeAttributeEscaped("height", "400px");
		oRm.writeAttributeEscaped("vspace", "-500");
		oRm.writeAttributeEscaped("hspace", "-800");
		oRm.writeAttributeEscaped("scrolling", "yes");
		
			
//		oRm.addStyle("visibility", "hidden");
		oRm.writeStyles();
		oRm.addClass("iframe");
		oRm.writeClasses();
		oRm.write('</iframe>');
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
			designTime: true
		},
		renderer : renderer,
		onAfterRendering : onAfterRendering
	});
	oProjectCard.prototype.onclick = function() {
	}
	return oProjectCard;
});
