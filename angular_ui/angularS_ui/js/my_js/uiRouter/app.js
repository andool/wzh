var app = angular.module("myApp", ["ui.router", "ctrls"]);

app.config(function($stateProvider, $urlRouterProvider){
	$stateProvider.state('start', {
		url:'/start',
		templateUrl:'views/uiRouter/start.html',
//		template:'<h2>{{p.hello}}</h2>',
//		controller: 'uiCtrl',
		controller: function($scope, person){
			$scope.p = {
				hello:"Hello ui router",
				person: person
			}
		},
		resolve:{
			person:function(){
				return {
					name:"wzh",
					age: 27,
					email:"wzh@163.com"
				}
			}
		}
	}).state("myRout1",{
		url:'/rout1/{name}/{age}',
		template:'<h1>i am {{p.name}}, i am {{p.age}} years old!</h1>',
		controller:function($scope, $stateParams){
			$scope.p = {
				name:$stateParams.name,
				age:$stateParams.age
			}
		},
		onExit:function(){
			console.info("exit rout1");
		}
	}).state('iBox', {
		url:'/ibox/{id}',
		templateUrl:'views/uiRouter/ibox.html',
		controller:function($scope, $stateParams){
			$scope.p = {
				id: $stateParams.id
			}
		},
		onEnter:function(){
			console.info("enter ibox");
		}
	}).state('iBox.priority', {
		url:'/priority',
		template:'<h1>priority_{{p.id}}</h1>'
	}).state("regist", {
		abstract:true,
		url:"/regist",
		template:"<div><div ui-view></div></div>"
	}).state("regist.signName", {
		url:'/signName',
		template:'<h1>signName</h1>'
	}).state("regist.signEmail", {
		url:'/signEmail',
		template:'<h1>signEmail</h1>'
	}).state("regist.signPwd", {
		url:'/signPwd',
		template:'<h1>signPwd</h1>'
	});
});
