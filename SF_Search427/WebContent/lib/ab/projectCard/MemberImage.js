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

	var oProjectCard = Image.extend(THIS_MODULE_NAME, {
		metadata : {
			library : THIS_LIBRARY_NAME,
			properties: {
				LEP: {type : "boolean", group : "Appearance", defaultValue : false},
				LEM: {type : "boolean", group : "Appearance", defaultValue : false},
				typeWidth : {type : "sap.ui.core.CSSSize", group : "Appearance", defaultValue : "40px"},
				typeHeight : {type : "sap.ui.core.CSSSize", group : "Appearance", defaultValue : "40px"}
			},
			events : {
				click : {},
			}
		}
	});
	oProjectCard.prototype.onclick = function() {
		this.fireClick();
	}
	return oProjectCard;
});
