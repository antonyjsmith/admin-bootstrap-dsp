'use strict';
/**
 * @ngdoc function
 * @name sbAdminApp.controller:MainController
 * @description
 * # MainController
 * Controller of the sbAdminApp
 */
angular.module('sbAdminApp')
  .controller('MainController', ['$scope', '$position', 'DreamFactory', 'uiGmapGoogleMapApi',
  				function($scope, $position, DreamFactory, uiGmapGoogleMapApi) {
	      
		uiGmapGoogleMapApi.then(function(maps) {
			$scope.map = { center: { latitude: 45, longitude: -73 }, zoom: 8 };
	    });	  
	  
  }]);
