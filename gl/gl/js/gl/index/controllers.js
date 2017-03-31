var ctrls = angular.module("index.all", []);

ctrls.service("indexServer", ["$http", 
	function($http){
		
		var dologin = function(user){
			return $http({
				url:"/gl/js/gl/index/login.json",
				method:"get"
			});
		}
		var getMenus = function(userid){
			
			return $http({
				url:"/gl/js/gl/index/menus.json",
				method:"get",
				param:{userid:userid}
			});
		}
		
		return {
			login: function(user){
				return dologin(user);
			},
			menus: function(userid){
				return getMenus(userid);
			}
		}
	}
]);
ctrls.controller("loginCtrl", ["$scope", "indexServer", "$state",
	function($scope, indexServer, $state){
		$scope.user = {
			userName:"lisa",
			pwd:"123123123"
		}
		$scope.login = function(){
			indexServer.login($scope.user).success(function(data){
				if(data.state){
					$state.go("index")
				}
			}).error(function(){
				
			});
		}
	}
]);
ctrls.controller("menuCtrl", ["$scope", "indexServer",
	function($scope, indexServer){
		indexServer.menus().success(function(data){
			$scope.menus = data;
		});
	}
]);
ctrls.controller("mainCtrl", ["$scope", "$sce", "indexServer",
	function($scope, $sce, indexServer){
		$scope.hello = "welcome!!!!";
		$scope.panelcfg = {
			editable:true,
			funs : {
						"方法一": function(ele){
							console.info(ele);
						},
						"方法二": function(ele){
							console.info(ele);
						}
					}
		};
		$scope.panelcfg2 = {
			editable:true,
			funs : {
						"方法一": function(ele){
							console.info(ele);
						},
						"方法二": function(ele){
							console.info(ele);
						}
					}
		};
		$scope.panelcfg3 = {
			editable:true,
			funs : {
						"方法一": function(ele){
							console.info(ele);
						},
						"方法二": function(ele){
							console.info(ele);
						}
					}
		};
		
		$scope.content = $sce.trustAsHtml('<p>this is a p</p>');
		$scope.content2 = $sce.trustAsHtml('<p>this is a p 2</p>');
		$scope.conf = {
			count:1000
//			type: "all",
//			listLength:3
		};
		$scope.changeCount = function(){
			$scope.conf.count = 2000;
		}
		
		$scope.gridData = [
			{name:"张三", age:19, gender:"男", birth:1234123413241234},
			{name:"李四", age:23, gender:"女", birth:1234123413241234},
			{name:"王五", age:18, gender:"男", birth:1234123413241234},
			{name:"赵六", age:21, gender:"女", birth:1234123413241234},
			{name:"张三", age:19, gender:"男", birth:1234123413241234},
			{name:"李四", age:23, gender:"女", birth:1234123413241234},
			{name:"王五", age:18, gender:"男", birth:1234123413241234},
			{name:"赵六", age:21, gender:"女", birth:1234123413241234},
			{name:"张三", age:19, gender:"男", birth:1234123413241234},
			{name:"李四", age:23, gender:"女", birth:1234123413241234}
		];
		var createDate = function(newVal, oldVal){
			if(newVal == oldVal) return;
			$scope.gridConf.data = [];
			for(var i = 0; i < $scope.gridConf.pager.size; i++){
//			for(var i = 0; i < parseInt(Math.random()*100); i++){
				var record = {};
				record.name = String.fromCharCode(Math.round(Math.random() * 20901) + 19968)
					+String.fromCharCode(Math.round(Math.random() * 20901) + 19968);
				record.age = parseInt(Math.random()*40);
				record.gender = ["男", "女"][parseInt(Math.random()*2)];
				record.birth = 1231234123412341;
				$scope.gridConf.data.push(record);
			}
		}
		$scope.gridConf = {
			cols : [
				{ title:"姓名", val:"name", width:100},
				{ title:"生日", val:"birth", width:100},
				{ title:"年龄", val:"age", width:100},
				{ title:"性别", val:"gender", width:100}
			],
			data:$scope.gridData,
			type:"border",// simple border colorful
			hover: true,
			count:1000,
//			desc:"asdfasdf",
//			showIndex:true,
			pager:{
				type:"all",
				count:2000
			}
		};
		
		$scope.$watch(function(){
			return $scope.gridConf.pager.current + " " + $scope.gridConf.pager.size;
		}, createDate);
		
	}
]);

