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
			            return '<a href="#/portal/countries/overview/'+data+'">View</a>';
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
  	
 	.controller('countryMapController', ['$scope', '$filter', '$http', 'CountryProfile', 'CountryGeoDetail', 'uiGmapGoogleMapApi',
 				function($scope, $filter, $http, CountryProfile, CountryGeoDetail, uiGmapGoogleMapApi) {
	 				
	 				$scope.path = [];
	 				
					var geoDetails = CountryGeoDetail.query({countryID : $scope.countryID});
					
					geoDetails.$promise.then(function(){
						
						uiGmapGoogleMapApi.then(function(maps) {
							
							$scope.map = { center: { latitude: geoDetails.record[0].BGNc_latitude, longitude: geoDetails.record[0].BGNc_longitude }, zoom: 4 };
							
							
						});	  	
						
						var polygon = $http.get('data/geo-json/countries/' + geoDetails.record[0].ISO3166A3 + '.geo.json').success(function(response) {
							
							_.each(response.features[0].geometry.coordinates, function(array){
								
								_.each(array, function(array){
																
									var point 			= new Object({});
									point['latitude'] 	= array[1];
									point['longitude']	= array[0];
									
									$scope.path.push(point);
																	
								})
								
							})
							
						});
						
					})

  	}])
  	
	.controller('incidentCountryWidgetController', ['$scope', '$routeParams', 'wpRestIncidents', 'CountryGeoDetail',
	  function($scope, $routeParams, wpRestIncidents, CountryGeoDetail) {
								
		CountryGeoDetail.query({countryID : $scope.countryID},
			function(value) {
				wpRestIncidents.query({entryQty : 30, countryISO : value.record[0].ISO3166A2},
					function (incidents) {
						$scope.recentIncidents = incidents;
					}
				);
			}
		);
												   
		$scope.recentIncidents = [];
	
		} 	  
	])
	
	  .controller('reportViewController', ['$scope', 'Restangular',
	  function($scope, Restangular) {
	  	
		var resource = Restangular.all('rest/ml-sql/data_report');
	  			  			  					
			resource.customGET([ $scope.countryData.data_reports_by_data_country_v_report[0].id + '?related=data_country_v_reports_by_report_id' ]).then(function(response){
				$scope.report = response;
				
					var resourceAnalysis = Restangular.all('rest/ml-sql/data_report_analysis')
				
						resourceAnalysis.get("?related=data_report_analysis_contents_by_analysis_id&filter=report_id=" +response.id).then(function(analysis){
							$scope.analysis = analysis;
														
					});
					
					var resourceActors = Restangular.all('rest/ml-sql/data_actor_v_report')
				
						resourceActors.get("?related=data_actors_by_actor_id&filter=report_id=" +response.id).then(function(actors){
							$scope.actors = actors;
														
					});
				
				});
						
	  
	  }])
  	  	
  	;