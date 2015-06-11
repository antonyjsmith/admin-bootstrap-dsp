'use strict';
/**
 * @ngdoc function
 * @name sbAdminApp.controller:
 * @description
 * # 
 * Controller of the sbAdminApp
 */
 angular.module('notifications', [])

	.controller('notificationsController', ['$scope', '$routeParams', 'UserNotificationList', 'UserDataService', 'Restangular', 'modalService',
	  function($scope, $routeParams, UserNotificationList, UserDataService, Restangular, modalService) {

	  		var resource = Restangular.all('rest/ml-sql/user_notification')
	  		
	  		var userID = UserDataService.getCurrentUser().id;
	  		
	  		$scope.payload = new Object();
	  		
	  		//General Watchlist usage
	  					
			resource.customGET(['?filter=user_id=' + userID] + '&related=globalwatch_country_by_countryID').then(function(response){
				$scope.watchList = response;
			});
			
			$scope.updateStatus = function (id, status, field) {

					$scope.payload = new Object();
					$scope.payload[field] = status;
					
					console.log($scope.payload);
			
					resource.one(''+id+'').patch($scope.payload).then(function (){
												
					});
				
			};
				  								
			$scope.add = function(countryid){
							
				var watching = _.some($scope.watchList.record, function(countries) {
										    return countries.countryID === countryid;
										});
				
				if (watching === false) {
					$scope.payload['countryID'] = countryid;
					$scope.payload['user_id'] = userID;
					$scope.payload['type'] = 'incident';
					
					resource.customPOST($scope.payload,['?fields=*&related=globalwatch_country_by_countryID']).then(function(newRecord){
						$scope.watchList.record.push(newRecord);
					})	
					
					
				} else {
				
		            var modalOptions = {
			            actionButtonText: 'Ok',
			            headerText: 'An error has occurred',
			            bodyText: 'This country is already on your notification list'
			        };
			
			        modalService.showModal({}, modalOptions);
					
				}
				
				$scope.selectedCountry = null;

			}
			
			$scope.removeItem = function(itemid,$index){
			//console.log($scope.watchList.record);
			//console.log($index);
			resource.get(itemid).then(function(response){
					response.remove().then(function(){
						$scope.watchList.record.splice($index, 1);
					});
				});
			};
					  		


	}])
	
   .controller('locationCtrl', ['$scope', '$http', 'DSP_URL',
  	function($scope, $http, DSP_URL) {
  	
			$scope.getLocation = function(val) {
		    return $http.get(DSP_URL + '/rest/ml-sql/globalwatch_country?fields=countryID%2CcountryName%2CcountryISO', {
		    params: {
		        filter: 'countryName LIKE "%' + val + '%"',
		      }
		    }).then(function(response){
		      var list = [];
		      angular.forEach(response.data.record, function(item){
		        list.push(item);
		      });

		      return list;
		      		      
		    });
		  };
	  	
  	}])
	
	;	