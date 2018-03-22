/// <reference path="../../../../../td/ui5/jQuery.d.ts" />.
/// <reference path="../../../../../td/ui5/sap.m.d.ts" />.
/// <reference path="../../../../../td/ui5/sap.ui.d.ts" />.

sap.ui.define([
	'sap/ui/core/Control',
	'sap/m/Image',
	'sap/m/ImageRenderer'
], function(Control, Image, ImageRenderer) {
	const THIS_MODULE_NAME = 'sap.ab.projectCard.MemberImage';
	const THIS_LIBRARY_NAME = 'sap.ab.projectCard';

	function renderer(oRm, oControl) {

		ImageRenderer.render(oRm, oControl);
		if (oControl.type === 'P') {
			rm.write("<img");
			rm.writeAttributeEscaped("src", "image/P.png");
			rm.write("/>");
		}
	}
	function rerender() {
	}
	function onAfterRendering() {
	}
	var oProjectCard = Image.extend(THIS_MODULE_NAME, {
		metadata : {
			library : THIS_LIBRARY_NAME,
			properties: {
				type: {type : "string", group : "Appearance", defaultValue : null},
				typeWidth : {type : "sap.ui.core.CSSSize", group : "Appearance", defaultValue : null},
				typeHeight : {type : "sap.ui.core.CSSSize", group : "Appearance", defaultValue : null}
			},
			renderer : renderer,
			onAfterRendering : onAfterRendering
		}
	});
	oProjectCard.prototype.onclick = function() {
		this.fireClick();
	}
	return oProjectCard;
});
