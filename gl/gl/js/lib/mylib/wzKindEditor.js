/**
 * 
 */
(function(){
	angular.module("wz.kindeditor", []).
	directive("wzKindeditor", [
		function(){
			
			return {
				restrict:"A",
				require:"ngModel",
				scope:{
					
				},
				link: function(scope, ele, attr, ngModel){
					if(typeof window.KindEditor == undefined){
						throw new Error("kindeditor is undefined");
					}
					
				}
			};
		}
	]);
})();
