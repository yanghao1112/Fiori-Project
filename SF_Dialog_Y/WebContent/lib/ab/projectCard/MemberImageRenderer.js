/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2017 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides default renderer for control sap.m.Image
sap.ui.define(['jquery.sap.global', 'sap/m/library', 'sap/m/ImageRenderer'],
	function(jQuery, library, ImageRenderer) {
	"use strict";
	const THIS_LIBRARY_NAME = 'sap.ab.projectCard'

	// shortcut for sap.m.ImageMode
	var ImageMode = library.ImageMode;

	/**
	 * Image renderer.
	 * @author SAP SE
	 * @namespace
	 */
	var MemberImageRenderer = {
	};


	/**
	 * Renders the HTML for the given control, using the provided {@link sap.ui.core.RenderManager}.
	 *
	 * @param {sap.ui.core.RenderManager} oRenderManager the RenderManager that can be used for writing to the Render-Output-Buffer
	 * @param {sap.ui.core.Control} oControl an object representation of the control that should be rendered
	 */
	MemberImageRenderer.render = function(rm, oControl) {

//		rm.write("<img");
		ImageRenderer.render(rm, oControl);
		if (oControl.getProperty("type") === 'P') {
			rm.write("<img");
			rm.addClass("ZMemberImageTypeFirst");
			rm.writeClasses();
			rm.writeAttributeEscaped("src", jQuery.sap.getModulePath(THIS_LIBRARY_NAME) + "/image/P.png");
			rm.addStyle("width", oControl.getProperty('typeWidth'));
			rm.addStyle("height", oControl.getProperty('typeHeight'));
			rm.writeStyles();
			rm.write("/>");
		}
		if (oControl.getProperty("type") === 'M') {
			rm.write("<img");
			rm.addClass("ZMemberImageTypeFirst");
			rm.writeClasses();
			rm.writeAttributeEscaped("src", jQuery.sap.getModulePath(THIS_LIBRARY_NAME) + "/image/M.png");
			rm.addStyle("width", oControl.getProperty('typeWidth'));
			rm.addStyle("height", oControl.getProperty('typeHeight'));
			rm.writeStyles();
			rm.write("/>");
		}
		if (oControl.getProperty("type") === 'All') {
			rm.write("<img");
			rm.addClass("ZMemberImageTypeFirst");
			rm.writeClasses();
			rm.writeAttributeEscaped("src", jQuery.sap.getModulePath(THIS_LIBRARY_NAME) + "/image/P.png");
			rm.addStyle("width", oControl.getProperty('typeWidth'));
			rm.addStyle("height", oControl.getProperty('typeHeight'));
			rm.writeStyles();
			rm.write("/>");
			rm.write("<img");
			rm.addClass("ZMemberImageTypeSecond");
			rm.writeClasses();
			rm.writeAttributeEscaped("src", jQuery.sap.getModulePath(THIS_LIBRARY_NAME) + "/image/M.png");
			rm.addStyle("width", oControl.getProperty('typeWidth'));
			rm.addStyle("height", oControl.getProperty('typeHeight'));
			rm.writeStyles();
			rm.write("/>");
		}
	};

	return MemberImageRenderer;
}, /* bExport= */ true);