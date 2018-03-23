/// <reference path="../../../../../td/ui5/jQuery.d.ts" />.
/// <reference path="../../../../../td/ui5/sap.m.d.ts" />.
/// <reference path="../../../../../td/ui5/sap.ui.d.ts" />.

sap.ui.define([
	'sap/ui/core/Control'
], function(Control){
	const THIS_MODULE_NAME = 'sap.ab.personCard.DialogCard';
	const THIS_LIBRARY_NAME = 'sap.ab.personCard';

	function renderer(oRm, oControl){

		//Create the control
		oRm.write('<div');
		oRm.writeControlData(oControl);
		oRm.addClass("chartJSControl");
		oRm.addClass("sapUiResponsiveMargin");
		oRm.writeClasses();
		oRm.write('>');
		oRm.write('</div>');
	}
	function rerender(){
	}
	function onAfterRendering(){
	}
	return Control.extend(THIS_MODULE_NAME, {
			metadata: {
				library: THIS_LIBRARY_NAME,
				properties: {
					data: {
						type: 'object'
					},
					option: {
						type: 'object'
					}
				},
				defaultAggregation : "content",
				aggregations : {
					/**
					 * Controls that are placed into Grid layout.
					 */
					content : {type : "sap.ui.core.Control", multiple : true, singularName : "content"}
				},
				events: {
				}
			},
			renderer: renderer,
			rerender: rerender,
			onAfterRendering: onAfterRendering
	});
});
