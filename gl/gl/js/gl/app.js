var gl = angular.module("gl", [
	"ui.router"
	,"gl.directives"
	,"index.all"
	,"ngKeditor"
]);

gl.run(["$rootScope", "$state", "$stateParams", function($rootScope, $state, $stateParams){
	$rootScope.$state = $state;
	$rootScope.$stateParams = $stateParams;
}]);

gl.config(function($stateProvider, $urlRouterProvider){
	$urlRouterProvider.when("", "/login");
	
	$stateProvider.state("login",{
		url:"/login",
		templateUrl:"/gl/tpls/login.html",
		controller:"loginCtrl"
	}).state("index", {
		url:"/index",
		views: {
			"":{
				templateUrl:"/gl/tpls/index.html"
			},
			"menu@index":{
				templateUrl:"/gl/tpls/menu.html",
				controller:"menuCtrl"
			},
			"content@index":{
				templateUrl:"/gl/tpls/main.html",
				controller:"mainCtrl"
			}
		}
	})
	;
});
