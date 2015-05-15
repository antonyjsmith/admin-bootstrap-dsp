'use strict';
  angular.module('maps', [])	
	
	.controller('incidentMapController', ['$scope', 'Incidents',
	  function($scope, Incidents) {
	  
			$scope.incident = Incidents.query();
			
			$scope.incident.$promise.then(function (location){
			
				//set variables and convert string to integer
				var lat = parseFloat(location[0].location_data.incident_latitude);
				var lng = parseFloat(location[0].location_data.incident_longitude);
				
				//$scope.map = { center: { latitude: lat, longitude: lng }, zoom: 8 };
				//$scope.point = { latitude: lat, longitude: lng };
							
			})

					  
	  }])
	  
	;