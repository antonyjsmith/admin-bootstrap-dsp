'use strict';
/**
 * @ngdoc overview
 * @name sbAdminApp
 * @description
 * # sbAdminApp
 *
 * Main module of the application.
 */
angular
  .module('sbAdminApp', [
	'ngRoute',
	'ngResource',
	'ngSanitize',
	'ngCookies',
    'oc.lazyLoad',
    'ui.router',
    'ui.bootstrap',
    'angular-loading-bar',
    'dfUserManagement',
    'ngDreamFactory',
    'services',
    'error',
    'filters',
    'userAuthManage',
    'datatables',
    'datatables.bootstrap',
    'uiGmapgoogle-maps',
    'LocalStorageModule',
    'restangular',
    'modal'
  ])
  
	.constant('DSP_URL', 'https://core.maxwelllucas.com')
	.constant('DSP_API_KEY', 'dfauth')  
	.config(['$httpProvider', 'DSP_API_KEY', function($httpProvider, DSP_API_KEY) {
			$httpProvider.defaults.headers.common['X-DreamFactory-Application-Name'] = DSP_API_KEY;
	}])
	
	//Watch for dreamfactory errors and broadcast and exceptions error.js is listening!!
	
	.config(['$provide', function($provide) {
		$provide.decorator('$exceptionHandler', ['$delegate', '$injector', function($delegate, $injector) {
		    return function(exception) {
		    
		    if (exception.provider === 'dreamfactory') {
	
	            $injector.invoke(['$rootScope', function($rootScope) {
	
	                $rootScope.$broadcast('error:dreamfactory', exception);
	            }]);
	            
			} else {
		        
		        return $delegate(exception);
		        
		        }
		    }
		}])
	}])
	
	.config(['$httpProvider',function($httpProvider) {
	    $httpProvider.interceptors.push('authHttpResponseInterceptor');
	    
	}])
	
    .config(['RestangularProvider', function(RestangularProvider) {
    	RestangularProvider.setBaseUrl('https://core.maxwelllucas.com');
    }])
	
	.config(function(uiGmapGoogleMapApiProvider) {
	    uiGmapGoogleMapApiProvider.configure({
	        //    key: 'your api key',
	        v: '3.17',
	        libraries: 'weather,geometry,visualization'
	    });
	})
  
  .config(['$stateProvider','$urlRouterProvider','$ocLazyLoadProvider',
  	function ($stateProvider,$urlRouterProvider,$ocLazyLoadProvider) {
    
    $ocLazyLoadProvider.config({
      debug:false,
      events:true
    });

    $urlRouterProvider.otherwise('/login');

    $stateProvider
    
		.state('login',{
			url:'/login',
        	templateUrl:'views/pages/login.html',
        	controller: 'loginController'
    	})
    	
    	.state('logout',{
			url:'/logout',
        	templateUrl:'views/pages/logout.html',
        	controller: 'logoutController'
    	})
    	
    	.state('register',{
			url:'/register',
        	templateUrl:'views/pages/register.html',
        	controller: 'registerController'
    	})
    	
    	.state('forgot',{
			url:'/forgot',
        	templateUrl:'views/pages/forgot.html',
        	controller: 'passwordController'
    	})
    	
    	.state('error404',{
			url:'/404',
        	templateUrl:'views/404.html',
    	})
    	
    	.state('error401',{
			url:'/401',
        	templateUrl:'views/401.html',
    	})
    	
    	.state('error403',{
			url:'/403',
        	templateUrl:'views/403.html',
    	})
    	
    	.state('error500',{
			url:'/500',
        	templateUrl:'views/500.html',
    	})
    
      .state('portal', {
        url:'/portal',
        templateUrl: 'views/dashboard/main.html',
        resolve: {
            loadMyDirectives:function($ocLazyLoad){
                return $ocLazyLoad.load(
                {
	                name:'sbAdminApp',
	                files:[
	                'scripts/directives/header/header.js',
	                'scripts/directives/header/header-notification/header-notification.js',
	                'scripts/directives/sidebar/sidebar.js',
	                'scripts/directives/sidebar/sidebar-search/sidebar-search.js'
	                ]
                }),
                $ocLazyLoad.load(
                {
                   name:'toggle-switch',
                   files:["bower_components/angular-toggle-switch/angular-toggle-switch.min.js",
                          "bower_components/angular-toggle-switch/angular-toggle-switch.css"
                      ]
                }),
                $ocLazyLoad.load(
                {
                  name:'ngAnimate',
                  files:['bower_components/angular-animate/angular-animate.js']
                })
                $ocLazyLoad.load(
                {
                  name:'ngTouch',
                  files:['bower_components/angular-touch/angular-touch.js']
                })            
            }
        }
    })
      .state('portal.dashboard',{
        url:'/dashboard',
        controller: 'MainController',
        templateUrl:'views/dashboard/home.html',
        resolve: {
          loadMyFiles:function($ocLazyLoad) {
            return $ocLazyLoad.load({
              name:'sbAdminApp',
              files:[
              'scripts/controllers/main.js',
              'scripts/directives/timeline/timeline.js',
              'scripts/directives/notifications/notifications.js',
              'scripts/directives/chat/chat.js',
              'scripts/directives/dashboard/stats/stats.js'
              ]
            })
          }
        }
      })
      .state('portal.form',{
        templateUrl:'views/form.html',
        url:'/form'
    })
      .state('portal.chart',{
        templateUrl:'views/chart.html',
        url:'/chart',
        controller:'ChartCtrl',
        resolve: {
          loadMyFile:function($ocLazyLoad) {
            return $ocLazyLoad.load({
              name:'chart.js',
              files:[
                'bower_components/angular-chart.js/dist/angular-chart.min.js',
                'bower_components/angular-chart.js/dist/angular-chart.css'
              ]
            }),
            $ocLazyLoad.load({
                name:'sbAdminApp',
                files:['scripts/controllers/chartContoller.js']
            })
          }
        }
    })
      .state('portal.table',{
        templateUrl:'views/table.html',
        url:'/table'
    })
      .state('portal.panels-wells',{
        templateUrl:'views/ui-elements/panels-wells.html',
        url:'/panels-wells'
      })
      .state('portal.buttons',{
        templateUrl:'views/ui-elements/buttons.html',
        url:'/buttons'
    })
      .state('portal.typography',{
       templateUrl:'views/ui-elements/typography.html',
       url:'/typography'
   })
      .state('portal.icons',{
       templateUrl:'views/ui-elements/icons.html',
       url:'/icons'
   })
      .state('portal.grid',{
       templateUrl:'views/ui-elements/grid.html',
       url:'/grid'
   })
       .state('portal.countries',{
       templateUrl:'views/countries/country.list.html',
       controller:'countryListController',
       url:'/countries',
        resolve: {
          loadMyFile:function($ocLazyLoad) {
            return $ocLazyLoad.load({
				name:'countries',
				files:["scripts/controllers/countries.js"]
            })
          }
        }
   })
    .state('portal.countryOverview',{
		templateUrl:'views/countries/country.overview.html',
		controller:'countryProfileController',
		url:'/countries/overview/:countryID',
		resolve: {
          loadMyFile:function($ocLazyLoad) {
            return $ocLazyLoad.load({
				name:'countries',
				files:["scripts/controllers/countries.js"]
            })
          }
        }
   })
	.state('portal.countryOverview.profile',{
		templateUrl:'views/countries/country.profile.html',
		url:'/profile'
	})
	
	.state('portal.countryOverview.map',{
		templateUrl:'views/countries/country.map.html',
		controller:'countryMapController',
		url:'/map'
	})
	
	.state('portal.countryOverview.threat',{
		templateUrl:'views/countries/country.threat.html',
		url:'/threat'
	})
	.state('portal.countryOverview.evacuation',{
		templateUrl:'views/countries/country.evacuation.html',
		controller:'reportViewController',
		url:'/evacuation'
	})
	
	.state('portal.countryOverview.incidents',{
		templateUrl:'views/countries/country.incidents.html',
		controller: 'incidentCountryWidgetController',
		url:'/incidents'
	})
	
	.state('portal.incidents',{
		templateUrl:'views/incidents/incident.feed.html',
		controller:'incidentFeedController',
		url:'/incident/feed',
		resolve: {
          loadMyFile:function($ocLazyLoad) {
            return $ocLazyLoad.load({
				name:'incidents',
				files:["scripts/controllers/incidents.js"]
            })
          }
        }
	})
	
	.state('portal.incidentDetail',{
		templateUrl:'views/incidents/incident.feed.detail.html',
		controller: 'incidentDetailCtrl',
		url:'/incident/feed/:incidentID',
		resolve: {
          loadMyFile:function($ocLazyLoad) {
            return $ocLazyLoad.load({
				name:'incidents',
				files:["scripts/controllers/incidents.js"]
            })
          }
        }
	})
	
	.state('portal.advice',{
		templateUrl:'views/advice/advice.html',
		controller: 'adviceController',
		url:'/advice/',
		resolve: {
          loadMyFile:function($ocLazyLoad) {
            return $ocLazyLoad.load({
				name:'advice',
				files:["scripts/controllers/advice.js"]
            })
          }
        }
	})
	
	.state('portal.map',{
		templateUrl:'views/maps/map.html',
		controller: 'incidentMapController',
		url:'/maps/incidents',
		resolve: {
          loadMyFile:function($ocLazyLoad) {
            return $ocLazyLoad.load({
				name:'maps',
				files:["scripts/controllers/maps.js"]
            })
          }
        }
	})
	
	.state('portal.notifications',{
		templateUrl:'views/notifications/notifications.html',
		controller: 'notificationsController',
		url:'/notifications',
		resolve: {
          loadMyFile:function($ocLazyLoad) {
            return $ocLazyLoad.load({
				name:'notifications',
				files:["scripts/controllers/notifications.js"]
            })
          }
        }
	})
   
   
  }]);

    
