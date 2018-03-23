sap.ui.define([							
   "sap/ui/core/mvc/Controller",							
   "sap/m/MessageToast",							
   "sap/ui/model/json/JSONModel"							
], function (Controller, MessageToast, JSONModel) {							
   "use strict";							
   return Controller.extend("sap.ui.test.cache.controller.ZZmain", {							
      onInit : function () {							
         // set data model on view							
         var oData = {							
            recipient : {							
               name : "I'm name of recipient"							
            },							
            buttonText : "I'm button",						
            listData : [							
                    {							
                      "ProductName": "Pineapple",							
                      "Quantity": 21,							
                      "Price": 87.2000							
                    },							
                    {							
                      "ProductName": "Apple",							
                      "Quantity": 15,							
                      "Price": 30.2000							
                    },							
                    {							
                      "ProductName": "Orange",							
                      "Quantity": 20,							
                      "Price": 35.2000							
                    },							
                    {							
                      "ProductName": "Grape",							
                      "Quantity": 36,							
                      "Price": 70.2000							
                    },							
                    {							
                      "ProductName": "Peach",							
                      "Quantity": 60,							
                      "Price": 90.2000							
                    }							
            ]							
         };							
         var oModel = new JSONModel(oData);							
         this.getView().setModel(oModel);							
      },							
      onShowHello : function () {							
         MessageToast.show("Hello World");							
      }							
   });							
});							
