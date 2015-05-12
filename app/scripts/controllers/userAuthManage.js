'use strict';
/**
 * @ngdoc function
 * @name sbAdminApp.controller:userAuthManage
 * @description
 * Login, logout, password reset etc
 * Controller of the sbAdminApp
 */
angular.module('userAuthManage', [])

  	.controller('loginController', ['$scope','$location', 'UserEventsService',
  				function($scope, $location, UserEventsService) {
	  		
	      $scope.userCreds = {
	      
	        email: null,
	        password: null
	        
	      };
	      
	      $scope.login = function() {
	      
	        $scope.$broadcast(UserEventsService.login.loginRequest, $scope.userCreds);
	        
	      };
			    
	      $scope.$on(UserEventsService.login.loginSuccess, function(e, userDataObj) {
	      
	        $scope.$parent.currentUser = userDataObj;
	        $location.url('/portal/dashboard');
	        	        
	      });
			      				
  	}])
  	
  	.controller('logoutController', ['$scope','$location', 'UserEventsService',
  				function($scope, $location, UserEventsService) {
	  				
            $scope.$on(UserEventsService.logout.logoutSuccess, function(e, userDataObj) {

            $scope.$parent.currentUser = userDataObj;
                $location.url('/')
            })
	  		
	  				
  	}])
  	
  	.controller('registerController', ['$scope', '$location', 'UserEventsService',
		function($scope, $location, UserEventsService) {
			
			
			$scope.registerUser = {
				
				policy: null,
				email: null,
				firstName: null,
				lastName: null,
				new_password: null
				
			};
			
			
			
			$scope.registerNewUser = function () {
				
				$scope.$broadcast(UserEventsService.register.registerRequest, $scope.registerUser);
				
			};
			
			$scope.$on(UserEventsService.register.registerSuccess, function(e, userCredsObj) {
					
	            $scope.$broadcast(UserEventsService.login.loginRequest, userCredsObj);
	            	            
	        });
	        
	        
	        $scope.$on(UserEventsService.login.loginRequest, function(e, userDataObj) {
		        	
	            $scope.$parent.currentUser = userDataObj;
	        })
	        
	        $scope.$on(UserEventsService.login.loginSuccess, function(e, userDataObj) {
	      
	        $location.url('/dashboard');
	        
	      });
	        
	        			
			$scope.confirmUser = {
				
				email: null,
				code: null,
				password: null
				
			};
			
			$scope.confirmNewUser = function () {
				
				$scope.$broadcast(UserEventsService.register.registerConfirmation, $scope.confirmUser);
				
			};

    }])
    
  .controller('passwordController', [ '$scope', '$location', '$timeout', 'PasswordServices',
  		function($scope, $location, $timeout, PasswordServices) {
	  		
	  	$scope.loading = false;
	  	
	  	$scope.alerts = [];
	  	
	  	$scope.closeAlert = function(index) {
	  		$scope.alerts.splice(index, 1);
	  	};
	  	
	  	$scope.getParam = function() {
	  	
	  		var paramValue = $location.search().code;
	  		
	  		console.log(paramValue);
	  		
	  	};
	  		
		$scope.userCreds = {
			
			email: null,
			code: $location.search().code,
			new_password: null,
			verify_password: null
			
		};
  		

		$scope.requestReset = function() {
			
			$scope.loading = true;
			  		
			PasswordServices.save({
				reset : true, email : $scope.userCreds.email
			}, function (result){
			
				$scope.loading = false;
				$scope.alerts.push({type: 'success', msg: 'A password reset eMail has been sent to your account'});
			
			}, function(error){
				
				//console.log(error.data.error[0].message);
				$scope.loading = false;
				$scope.alerts.push({type: 'danger', msg: error.data.error[0].message});
								
			});					  			
		}
		
		$scope.resetDetails = function() {
  		
			$scope.loading = true;
			
			PasswordServices.save({email : $scope.userCreds.email, code: $scope.userCreds.code, new_password: $scope.userCreds.new_password} , function (){
				
				$scope.loading = false;
				$scope.alerts.push({type: 'success', msg: 'Your details have been updated, please wait to be redirected to the login page'});
			 	      
				$timeout(function() {
					$location.path("/login");
				}, 2500);
				
			});
  			
		}

    }
  ]);

