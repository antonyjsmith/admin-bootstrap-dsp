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
			        DTColumnBuilder.newColumn('data_reports_by_data_country_v_report').withTitle('Reports').renderWith(function(data, type, full) {
				        //When adding threat reports pop an array in here and populate with the icons of whatever report is available
				        
				        if (data.length == 0){
					        return '';

				        } else {
					        return '<i class="fa fa-external-link"></i>';
				        }
			        	
			        }),
			        DTColumnBuilder.newColumn('countryID').withTitle('View').renderWith(function(data, type, full) {
			            return '<a href="#/portal/countries/overview/'+data+'">View</a>';
			        })
			    ];
			    
	  				
  	}])
  	  	
 	.controller('countryProfileController', ['$scope', '$filter', '$state', '$stateParams', 'CountryProfile', 'riskTerms',
 				function($scope, $filter, $state, $stateParams, CountryProfile, riskTerms) {
	 		
	  		$scope.oneAtATime = false;
	  		
	  		$scope.radioModel = 'Overview';
	  			  		
	  		$scope.countryID	=	$stateParams.countryID;
	  		$scope.countryData	=	CountryProfile.query({countryID : $scope.countryID});
	  		
	  		//$scope.medicalData	=	Healix.query({medCountryID : 'ru'});
	  		
	  		$scope.countryData.$promise.then(function (countryData){
		  		
	  			$scope.evacRating = getRatingData('evac_level',countryData.countryRating);
	  			$scope.riskRating = getRatingData('risk_level',countryData.countryRating);
	  			
		  		
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
	 					 				
	 				var paths = new Object({});
	 				paths.type = "FeatureCollection";
	 				paths.features = [];
	 				var polyFillCtr = 0;
	 				
					var geoDetails = CountryGeoDetail.query({countryID : $scope.countryID});
					
					geoDetails.$promise.then(function(){
						
						var polygon = $http.get('data/geo-json/countries/' + geoDetails.record[0].ISO3166A3 + '.geo.json').success(function(response) {
																								
							if (response.features[0].geometry.type === 'Polygon'){
								
								var id = 0;
								
								_.each(response.features[0].geometry.coordinates, function(array){
										
									var nest						= [];
									nest.push(array);
																																						
									var point						= new Object({});
									point['id']						= ++id;
									point['geometry']				= new Object({});
									point.geometry['coordinates'] 	= nest;
									point.geometry['type'] 			= "Polygon";
									
									paths.features.push(point)
										
								})
								
								
							} else if (response.features[0].geometry.type === 'MultiPolygon'){
																		
								var id = 0;
								
								_.each(response.features[0].geometry.coordinates, function(array){
								
									var point						= new Object({});
									point['id']						= ++id;
									point['geometry']				= new Object({});
									point.geometry['coordinates'] 	= array;
									point.geometry['type'] 			= "Polygon";
																			
									paths.features.push(point)
									
								
								})
							
							
							};
							
							uiGmapGoogleMapApi.then(function(maps) {
																						
									$scope.map = {
							          center: {
							            latitude: geoDetails.record[0].BGNc_latitude,
							            longitude: geoDetails.record[0].BGNc_longitude
							          },
							          pan: true,
							          zoom: 4,
							          refresh: false,
							          events: {},
							          bounds: {},
							          polys: [],
							          getPolyFill: function(model){
							            if(!model){
							              console.log("model undefined!");
							              return;
							            }
							            polyFillCtr += 1;
							            console.log("polyFillCtr: " + polyFillCtr + ", id: " + model.id);
							            return { color: '#2c8aa7', opacity: '0.3' };
							          },
							          polyEvents: {
							            click: function (gPoly, eventName, polyModel) {
							              window.alert("Poly Clicked: id:" + polyModel.$id + ' ' + JSON.stringify(polyModel.path));
							            }
							          },
							          draw: undefined
							        };
							        
									$scope.map.polys = paths.features;
									
									console.log($scope.map.polys);
							        							
							});
																							
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
		
			if ($scope.countryData.data_reports_by_data_country_v_report.length == 0){
				
				$scope.report = {"current_situation":"There is currently not an evacuation report for this country"};
				
			} else {
			
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
				
			}
	  
	  }])
  	  	
  	;