'use strict';
/**
 * @ngdoc function
 * @name sbAdminApp.controller:ServicesController
 * @description
 * # SevicesController
 * Controller of the sbAdminApp
 */
angular.module('services', ['ngResource'])

  .controller('ServicesController', ['$scope', 'CountriesTest',
  				function($scope, CountriesTest) {
	  		
	  		console.log(CountriesTest.query());
	  				
  	}])
  	
  .factory('PasswordServices', ['$resource', 'DSP_URL',
	function($resource, DSP_URL){
		  
	return $resource(DSP_URL + '/rest/user/password', {},
		{
	    	save : { method: 'POST'}
	    	
	    })
	    
	}])
  
  
  .factory('CountriesTest', ['$resource', 'DSP_URL',
	  function($resource, DSP_URL){
	  	  
	    return $resource(DSP_URL + '/rest/ml-sql/globalwatch_country', {}, {
	      query: {
	      	method:'GET',
	      	isArray:false
	      	
		  	}
	      
	    })
	    
	}]);

