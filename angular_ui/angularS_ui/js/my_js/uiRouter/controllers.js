var ctrls = angular.module("ctrls", []);

ctrls.controller("myCtrl", ["$scope", 
	function($sc){
		$sc.p = {
			hello:"Hello angular"
		}
	}
]);

ctrls.controller("uiCtrl", ["$scope", 
	function($sc, person){
		$sc.p = {
			hello:"Hello ui router",
			person: person
		}
		
	}
]);
