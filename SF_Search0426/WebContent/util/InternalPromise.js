sap.ui.define([],
function() {

	return function() {
		let fnInternalResolve = null;
		let fnInternalReject = null;
		let oPromise = null;
		oPromise = new Promise(function(fnResolve, fnReject) {
			fnInternalResolve = fnResolve;
			fnInternalReject  = fnReject;
		})

		let _resolvePromise = function(aData) {
			fnInternalResolve(aData);
		}
		
		let _rejectPromise = function(aData) {
			fnInternalReject(aData);
		}
		return {
			Promise : oPromise,
			resolvePromise : _resolvePromise,
			rejectPromise : _rejectPromise
		}
	}
})