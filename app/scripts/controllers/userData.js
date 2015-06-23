'use strict';
/**
 * @ngdoc function
 * @name sbAdminApp.controller:MainController
 * @description
 * # MainController
 * Controller of the sbAdminApp
 */
angular.module('userData', [])
	.controller('userProfileCtrl', ['$scope', 'UserDataService', 'Restangular',
	  function($scope, UserDataService, Restangular) {
		  
		$scope.phoneRegex = /^(\+|\d)[0-9]{7,16}$/;
	  	  
		var resource = Restangular.all('rest/user/profile')
		
		resource.get("").then(function(data){
						
			$scope.profile = data;
			
			$scope.userData = data;
		  				
		});
		
		$scope.savePhone = function(){
			
			var payload = new Object();
				
			payload['phone'] = '+' + $scope.profile.phone;
			
			console.log(payload);
			
			resource.post(payload).then(function(response) {
				
				console.log(response);
				
			})
			
		};
		
		//Show previous notifications 

		var userID = UserDataService.getCurrentUser().id;
			
		var resourceLog = Restangular.all('rest/ml-sql/user_notification_log')
		  
		resourceLog.get("?filter=user_id=" +userID).then(function(data){
						
		  $scope.notifications = data;
		  				
		});
	  
	
	}]);
