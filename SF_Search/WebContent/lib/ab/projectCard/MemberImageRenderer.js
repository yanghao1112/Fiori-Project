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

		var oImage = oControl;
		rm.write("<div");
		rm.writeClasses();

		rm.writeControlData(oControl);

		rm.write(">");
		
		var sMode = oImage.getMode(),
		alt = oImage.getAlt(),
		tooltip = oImage.getTooltip_AsString(),
		bHasPressHandlers = oImage.hasListeners("press"),
		oLightBox = oImage.getDetailBox(),
		sUseMap = oImage.getUseMap();
	
		// Additional element for Image with LightBox
		if (oLightBox) {
			rm.write("<span class=\"sapMLightBoxImage\"");
//			rm.writeControlData(oImage);
			rm.write(">");
			rm.write("<span class=\"sapMLightBoxMagnifyingGlass\"></span>");
		}
	
	
		// Open the DOM element tag. The 'img' tag is used for mode sap.m.ImageMode.Image and 'span' tag is used for sap.m.ImageMode.Background
		rm.write(sMode === ImageMode.Image ? "<img" : "<span");
	
		if (!oLightBox) {
//			rm.writeControlData(oImage);
		}
	
		if (sMode === ImageMode.Image) {
			rm.writeAttributeEscaped("src", oImage._getDensityAwareSrc());
		} else {
			// preload the image with a window.Image instance. The source uri is set to the output DOM node via CSS style 'background-image' after the source image is loaded (in onload function)
			oImage._preLoadImage(oImage._getDensityAwareSrc());
			rm.addStyle("background-size", jQuery.sap.encodeHTML(oImage.getBackgroundSize()));
			rm.addStyle("background-position", jQuery.sap.encodeHTML(oImage.getBackgroundPosition()));
			rm.addStyle("background-repeat", jQuery.sap.encodeHTML(oImage.getBackgroundRepeat()));
		}

		
		if(oControl.getProperty("type")) {
			rm.addClass("ZLeaderBorder");
		}
		
		rm.addClass("sapMImg");
		if (oImage.hasListeners("press") || oImage.hasListeners("tap")) {
			rm.addClass("sapMPointer");
		}
	
		if (sUseMap || !oImage.getDecorative() || bHasPressHandlers) {
			rm.addClass("sapMImgFocusable");
		}
	
		rm.writeClasses();
	
		//TODO implement the ImageMap control
		if (sUseMap) {
			if (!(jQuery.sap.startsWith(sUseMap, "#"))) {
				sUseMap = "#" + sUseMap;
			}
			rm.writeAttributeEscaped("useMap", sUseMap);
		}
	
		if (oImage.getDecorative() && !sUseMap && !bHasPressHandlers) {
			rm.writeAttribute("role", "presentation");
			rm.writeAttribute("aria-hidden", "true");
			rm.write(" alt=''"); // accessibility requirement: write always empty alt attribute for decorative images
		} else {
			if (alt || tooltip) {
				rm.writeAttributeEscaped("alt", alt || tooltip);
			}
		}
	
		if (alt || tooltip) {
			rm.writeAttributeEscaped("aria-label", alt || tooltip);
		}
	
		if (tooltip) {
			rm.writeAttributeEscaped("title", tooltip);
		}
	
		if (bHasPressHandlers) {
			rm.writeAttribute("role", "button");
			rm.writeAttribute("tabIndex", 0);
		}
	
		// Dimensions
		if (oImage.getWidth() && oImage.getWidth() != '') {
			rm.addStyle("width", oImage.getWidth());
		}
		if (oImage.getHeight() && oImage.getHeight() != '') {
			rm.addStyle("height", oImage.getHeight());
		}
	
		rm.writeStyles();
		
		rm.write(" />"); // close the <img> element
	
		if (oLightBox) {
			rm.write("</span>");
		}
		
		if (oControl.getProperty("type") === 'LEP') {
			rm.write("<img");
			rm.addClass("ZMemberImageTypeFirst");
			rm.writeClasses();
			rm.writeAttributeEscaped("src", jQuery.sap.getModulePath(THIS_LIBRARY_NAME) + "/image/P.png");
			rm.addStyle("width", oControl.getProperty('typeWidth'));
			rm.addStyle("height", oControl.getProperty('typeHeight'));
			rm.writeStyles();
			rm.write("/>");
		}
		if (oControl.getProperty("type") === 'LEM') {
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
		
		rm.write("</div>");
	};

	return MemberImageRenderer;
}, /* bExport= */ true);