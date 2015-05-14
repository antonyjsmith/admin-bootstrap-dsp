'use strict';
/**
 * @ngdoc function
 * @name sbAdminApp.controller:
 * @description
 * # 
 * Controller of the sbAdminApp
 */
 angular.module('countries', [])
 	.controller('countryListController', ['$scope', '$filter', 'CountryList', 'DTOptionsBuilder', 'DTColumnBuilder',
 				function($scope, $filter, CountryList, DTOptionsBuilder, DTColumnBuilder) {
	  		
	  			$scope.dtOptions = DTOptionsBuilder.fromFnPromise(function() {
						return CountryList.query().$promise;
					    })
							 .withDisplayLength(25)
							 .withOption('stateSave', true)
							 .withBootstrap();
							 
							
				$scope.dtColumns = [
			        DTColumnBuilder.newColumn('countryName').withTitle('Country'),
					DTColumnBuilder.newColumn('countryRating').withTitle('Threat Level').renderWith(function(data, type, full) {
			            return $filter('riskTerms')(data);
			        }),
			        DTColumnBuilder.newColumn('data_evacuation_levels_by_country_id[0].level').withTitle('Evacuation Level').renderWith(function(data, type, full) {
			        
			        //There can be multiple evac ratings for each country return the last aka most recent entry
			        	var lastItem = _.last(data);
			        	return $filter('evacTerms')(lastItem);
			        	
			        }),
			        
			        DTColumnBuilder.newColumn('countryID').withTitle('View').renderWith(function(data, type, full) {
			            return '<a href="#/portal/countries/summary/'+data+'">View</a>';
			        })
			    ];
			    
	  				
  	}])
  	  	
 	.controller('countryProfileController', ['$scope', '$filter', '$state', '$stateParams', 'CountryProfile', 'riskTerms',
 				function($scope, $filter, $state, $stateParams, CountryProfile, riskTerms) {
	  			  		
	  		$scope.countryID	=	$stateParams.countryID;
	  		$scope.countryData	=	CountryProfile.query({countryID : $scope.countryID});
	  		
	  		$scope.countryData.$promise.then(function (countryData){
		  		
	  			$scope.riskRating = getRatingData('evac_level',countryData.countryRating);
	  			$scope.evacRating = getRatingData('risk_level',countryData.countryRating);
	  			
		  		
	  		});
	  					
			var currEvacLevel = _.last($scope.countryData.data_evacuation_levels_by_country_id);
						
			var getRatingData = function(type,value){
								
				return riskTerms.query({Type : type, Value : value});
		  		
	  		};
	  		
		  	$scope.getEntryName = function (entryID) {
			  	
			  	return $filter('globalTerms')(entryID);
			  	
		  	};
		  		  		
	  		console.log($scope.countryData);
				  				
  	}])
  	
 	.controller('countryMapController', ['$scope', '$filter', 'CountryProfile', 'uiGmapGoogleMapApi',
 				function($scope, $filter, CountryProfile, uiGmapGoogleMapApi) {
						
			uiGmapGoogleMapApi.then(function(maps) {
				$scope.map = { center: { latitude: 45, longitude: -73 }, zoom: 8 };
			});	  	  			  		

				  				
  	}])
  	  	
  	;