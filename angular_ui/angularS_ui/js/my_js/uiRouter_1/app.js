var app = angular.module("app", ['ui.router']);

app.config(["$stateProvider", "$urlRouterProvider", 
	function($stateProvider, $urlRouterProvider){
		$stateProvider.state('home', {
			url:'/home',
			template:'<h1>home</h1>'
		}).state('photos', {
			url:'/photos/{name}',
			template:'<h1>{{p.name}}</h1>',
			controller:["$scope", "$stateParams", function($scope, $stateParams){
				$scope.p = {
					name: $stateParams.name
				}
			}],
		}).state('main', {
			views:{
				'main1':{
					url:'/main',
					template:'<h1>main_</h1>'
				},
				'main':{
					url:'/main',
					template:'<h1>main_main</h1>'
				}
			}
		}).state('qiantao', {
			views:{
				'qiantao':{
					url:'/qiantao',
					template:'<div><h1>嵌套</h1><div ui-view></div></div>'
				}
			}
		}).state('qiantao.ziqiantao', {
			views:{
				'':{
					url:'/zqiantao',
					template:'<p>子嵌套</p>'
				}
			}
		}).state('qiantao.ziqiantao1', {
			url:'/zqiantao1/{name}',
			template:'<p>子嵌套——1_{{p.name}}</p>',
			controller:["$scope", "$stateParams", 
				function($sc, $sp){
					$sc.p = {
						name : $sp.name
					}
				}
			]
		});
		
		$stateProvider.state('index', {
			url:'/index',
			abstact:true,
			views:{
				'index1':{
					template:'<div><div ui-view="header"></div><div ui-view="nav"></div><div ui-view="body"></div></div>'
				},
				'foot':{
					template:'<div><p>没foot啥事儿</p></div>'
				},
				'header@index':{
					template:'<p>这里是header</p>'
				},
				'nav@index':{
					template:'<p>这里是导航</p>'
				},
				'body@index':{
					template:'<p>这里是body</p>'
				}
			}
		}).state('index.content1', {
			url:'/content1',
			views:{
				'body@index':{
					template:'<p>content1111111111</p>'
				},
				'nav@index':{
					template:'<p>contet111111</p>'
				}
			}
		}).state('index.content2', {
			url:'/content2',
			views:{
				'body':{
					template:'<p>content2222222222222222</p>'
				},
				'header':{
					template:'<p>content22222222222222222</p>'
				}
			}
		}).state('footer', {
			url:'/footer',
			views:{
				'foot':{
					template:'<p>footer33333333333333333</p>'
				},
				'index1':{
					template:'<div><p>没index啥事儿</p><div ui-view="nav"></div></div>'
				},
				'nav@footer':{
					template:'<p>footer4444444444444444</p>'
				}
			}
		});
	}
]);
