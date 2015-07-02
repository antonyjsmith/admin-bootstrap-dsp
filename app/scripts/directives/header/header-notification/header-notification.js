'use strict';

/**
 * @ngdoc directive
 * @name izzyposWebApp.directive:adminPosHeader
 * @description
 * # adminPosHeader
 */
angular.module('sbAdminApp')
	.directive('headerNotification',function(){
		return {
	        templateUrl:'scripts/directives/header/header-notification/header-notification.html',
	        restrict: 'E',
	        replace: true,
    	}
	})
	
	.controller('countrySwitchCtrl', ['$scope', '$http', '$location', 'DSP_URL',
  	function($scope, $http, $location, DSP_URL) {
  	
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
		  
		  $scope.goToCountry = function(countryObj) {
			
			console.log(countryObj);
			
			
			if (countryObj){
					
				$location.url('/portal/countries/overview/' + countryObj.countryID);
					
			}; //Add some error handling if someone clicks without picking a country
			  
		  };
	  	
  	}])
	
	;


