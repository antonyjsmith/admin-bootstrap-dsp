'use strict';
  angular.module('maps', [])	
	
	.controller('incidentMapController', ['$scope', '$http', '$timeout', 'Incidents', 'CountryList', 'geoIncident', 'uiGmapGoogleMapApi',
	  function($scope, $http, $timeout, Incidents, CountryList, geoIncident, uiGmapGoogleMapApi) {
		  		  		  	
            var evacPolyProperties= {
	                    
	                    "0": {
	                            name: 'Monitoring',
	                            colors: [ '#00CC00' ]
	                    },            
	                    "1": {
	                            name: 'Increased Monitoring',
	                            colors: [ '#006699' ]
	                    },
	                    "2": {
	                            name: 'Warning',
	                            colors: [ '#FFD700' ]
	                    },
	                    "3": {
	                            name: 'Consider Evacuation',
	                            colors: [ '#CC0066' ]
	                    },
	                    "4": {
	                            name: 'Evacuation',
	                            colors: [ '#FF0000' ]
	                    },
                    
                   };
                   
            var riskPolyProperties= {
	                               
	                    "1": {
	                            name: 'Low',
	                            colors: [ '#3BAC54' ]
	                    },
	                    "2": {
	                            name: 'Medium',
	                            colors: [ '#E2FF34' ]
	                    },
	                    "3": {
	                            name: 'High',
	                            colors: [ '#FFC307' ]
	                    },
	                    "4": {
	                            name: 'Extreme',
	                            colors: [ '#FF0000' ]
	                    },
                    
                   };
                   
                   
            $scope.incidentParams 				= new Object({});
		  	$scope.incidentParams.count 		= 20;
            $scope.incidentParams.dateBefore 	= new Date();
            $scope.incidentParams.dateAfter		= null;
                   
            $scope.loading = false;
            
            //Open or close datepicker
			$scope.open = function($event) {
				$event.preventDefault();
				$event.stopPropagation();
				
				$scope.opened = true;
			};
                   
		  	$scope.markers = [];
		  	
		  	//Set max date in date picker
		  	
		  	$scope.maxDate = new Date();	
		  	
		  	var populateMarkerModel = function(input){
			  	
			  		//$scope.markers.length = 0;

					_.each(input, function (incident){
						
						//set variables and convert string to integer
						var lat = parseFloat(incident.location_data.incident_latitude);
						var lng = parseFloat(incident.location_data.incident_longitude);
						
						var point = {
							
								latitude: lat,
								longitude: lng,
								id: incident.ID,
								title: '<b><p>' + incident.title + ' - Incident Rating: ' + incident.rating_data.incident_rating + '</p></b>' + incident.excerpt + '<a href="/#/portal/incident/feed/' + incident.ID + '">More...</a>',
								icon: "assets/level-" + incident.rating_data.incident_rating + ".svg"
							
							};
						
						$scope.markers.push(point);
																	
					});
					
					$scope.loading = false;
					
					//console.log($scope.markers.length);			  	
			  	
		  	};
		  	
			$scope.getIncidents = function (){
				
				$scope.incident = Incidents.query();
			
				$scope.incident.$promise.then(function (location){
					
					populateMarkerModel(location);
																	
				})
				
			};
			
			$scope.getIncidents();
	  
						
			$scope.updateIncidents = function (){
				
				var a = $scope.incidentParams.dateBefore; // today!
			  	var b = $scope.incidentParams.dateAfter; // today too!
						
				var fromDate = a.toISOString(a.setDate(a.getDate())).slice(0, 19)
				var toDate = b.toISOString(b.setDate(b.getDate())).slice(0, 19)
								
				$scope.loading = true;
				
				$scope.incident = Incidents.query({postCount:$scope.incidentParams.count, dateBefore:fromDate, dateAfter:toDate});
			
				$scope.incident.$promise.then(function (location){
					
					populateMarkerModel(location);
																	
				})
				
			};
						
			
			  $scope.markersEvents = {
			    click: function (gMarker, eventName, model) {
			      console.log(model);
			      model.show = !model.show;
			    }
			  };
			  
			
			
			var paths = new Object({});
			paths.type = "FeatureCollection";
			paths.features = [];
			var polyFillCtr = 0;
			
		  	var countryData = CountryList.query();
		  	
		  	countryData.$promise.then(function (response){
			  	
			  	$scope.countries = {};
			  				  	
                for (var i=0; i< response.length; i++) {
                    var country = response[i];
                    $scope.countries[country['countryISO3']] = country;
                };
                
	            function getColor(country) {
	                if (!country || !country["countryRating"]) {
	                    return "#FFF";
	                }
	
	                var colors = riskPolyProperties[country["countryRating"]].colors;
	                var index = country["countryISO3"].charCodeAt(0) % colors.length ;
	                return colors[index];
	            }
	            
	            function getColorEvac(country) {
					if (typeof country == 'undefined') {
						return "#FFF";
					} else if (typeof country.data_evacuation_levels_by_country_id == 'undefined') {
						return "#FFF";
					}
					if (typeof country.data_evacuation_levels_by_country_id[0] == 'undefined') {
				//		console.log('Nothing to add!');
						return "#FFF";
					} else {
						var colors = evacPolyProperties[_.last(country.data_evacuation_levels_by_country_id).level].colors;
						var index = country["countryISO3"].charCodeAt(0) % colors.length ;
						return colors[index];
					}
	               
	            }
	                            			  				  	
				var polygon = $http.get('data/geo-json/countries.geo.json').success(function(response) {
					
					_.each(response.features, function(borders){
																						
						if (borders.geometry.type === 'Polygon'){
													
							_.each(borders.geometry.coordinates, function(array){
									
								var nest						= [];
								nest.push(array);
																																					
								var point						= new Object({});
								point['id']						= borders.id;
								point['geometry']				= new Object({});
								point.geometry['coordinates'] 	= nest;
								point.geometry['type'] 			= "Polygon";
								point['rating']					= getColor($scope.countries[borders.id]);
								point['evacrating']				= getColorEvac($scope.countries[borders.id]);
								
								paths.features.push(point)
									
							})
							
							
						} else if (borders.geometry.type === 'MultiPolygon'){
																								
							_.each(borders.geometry.coordinates, function(array){
							
								var point						= new Object({});
								point['id']						= borders.id;
								point['geometry']				= new Object({});
								point.geometry['coordinates'] 	= array;
								point.geometry['type'] 			= "Polygon";
								point['rating']					= getColor($scope.countries[borders.id]);
								point['evacrating']				= getColorEvac($scope.countries[borders.id]);
																		
								paths.features.push(point)
							
							})
						
						};
						
					});
					
				});
			  	
			});
			
			//This by far the most elegant method, due to a bug in uiGmapGoogleMapApi visibility cannot be bound to a model so this a nasty workaround
		  	  	
		  	$scope.layerModel = 0;
		
		  	$scope.switchLayer = function (layer){
		  		
		  		if (layer == 0) {
			  		
			  		$scope.map.visible = false;
			  		$scope.map2.visible = false;
			  		
		  		} else if (layer == 1) {
			  		
			  		$scope.map.visible = true;
			  		$scope.map2.visible = false;
			  		
		  		} else if (layer == 2) {
			  	
			  		$scope.map.visible = false;
			  		$scope.map2.visible = true;
			  		
		  		};
			  	
			  	
		  	};
		  			
			uiGmapGoogleMapApi.then(function(maps) {
																	
				$scope.map = {
		          center: {
		            latitude: 40.74,
		            longitude:  -16.18
		          },
		          pan: true,
		          zoom: 2,
		          visible: false,
		          events: {},
		          bounds: {},
		          polys: [],
		          polyFill: function(model){
					            if(!model){
					              console.log("model undefined!");
					              return;
					            }
					            polyFillCtr += 1;
					            //console.log("polyFillCtrRisk: " + polyFillCtr + ", id: " + model.id);
					            return { color: model.rating, opacity: '0.6' };
					          },
		          polyEvents: {
		            click: function (gPoly, eventName, polyModel) {
		              //window.alert("Poly Clicked: id:" + polyModel.id + ' ' + JSON.stringify(polyModel.path));
		              console.log(polyModel.id);
		            }
		          }
		        };
		        
		        $scope.map.polys = paths.features;
		        
				$scope.map2 = {
		          visible: false,
		          events: {},
		          bounds: {},
		          polys: [],
		          polyFill: function(model){
					            if(!model){
					              console.log("model undefined!");
					              return;
					            }
					            polyFillCtr += 1;
					            //console.log("polyFillCtrEvac: " + polyFillCtr + ", id: " + model.id);
					            return { color: model.evacrating, opacity: '0.6' };
					            
					          },
		          polyEvents: {
		            click: function (gPoly, eventName, polyModel) {
		              //window.alert("Poly Clicked: id:" + polyModel.id + ' ' + JSON.stringify(polyModel.path));
		              console.log(polyModel.id);
		            }
		          }
		        };			 
		               
				$scope.map2.polys = paths.features;
									
			});
			
	        $scope.circle =
	            {
	                center: {
	                    latitude: 53,
	                    longitude: -1.45
	                },
	                radius: 1000000,
	                stroke: {
	                    color: '#08B21F',
	                    weight: 2,
	                    opacity: 1
	                },
	                fill: {
	                    opacity: 0.0
	                },
	                geodesic: true, // optional: defaults to false
	                draggable: true, // optional: defaults to false
	                clickable: true, // optional: defaults to true
	                editable: true, // optional: defaults to false
	                visible: true, // optional: defaults to true
	                events:{
			            dragend: function (gCircle, eventName, circleModel) {
				          $scope.circle.center = circleModel.center;
			              console.log(circleModel);
			            },
			            radius_changed: function (gCircle, eventName, circleModel) {
				          $scope.circle.radius = circleModel.radius;
			              console.log(circleModel);
			            },		                
	                },
	                control: {}
	            };
	        	        
				
			$scope.updateGeoIncidents = function (){
				
				var locQuery = {"params": [
						        {
						            "name": "lat",
						            "param_type": "IN",
						            "value": $scope.circle.center.latitude
						        },
						        {
						            "name": "lon",
						            "param_type": "IN",
						            "value": $scope.circle.center.longitude
						        },
						        {
							        "name": "rad",
						            "param_type": "IN",
						            "value": getMiles($scope.circle.radius)
						        }
						    ]
						  };
						        
				var geo = geoIncident.query(locQuery);
				
				geo.$promise.then(function (response){
					
					populateGeoMarkerModel(response);
					
				});
			
			};
			
			function getMiles(i) {
			     return i*0.000621371192;
			}
			
		  	var populateGeoMarkerModel = function(input){
			  	
			  		$scope.markers.length = 0;
			  		
			  		//set a small delay to make sure the map is cleared first [evalAsync doesn't work for some reason]
			  		$timeout(function () {
				  		
						_.each(input, function (incident){
							
							//set variables and convert string to integer
							var lat = parseFloat(incident.incident_latitude);
							var lng = parseFloat(incident.incident_longitude);
							
							var point = {
								
									latitude: lat,
									longitude: lng,
									id: incident.ID,
									title: '<b><p>' + incident.title + ' - Incident Rating: ' + incident.incident_rating + '</p></b>' + incident.excerpt + '<a href="/#/portal/incident/feed/' + incident.ID + '">More...</a>',
									icon: "assets/level-" + incident.incident_rating + ".svg"
								
								};
							
							$scope.markers.push(point);
																		
						});
						
					}, 250);
					
					$scope.loading = false;
					
					//console.log($scope.markers.length);			  	
			  	
		  	};
		  	
		  	$scope.clearMarkers = function(){
			  	
			  	$scope.markers.length = 0;
			  	
		  	};	       						
					  
	  }])
	  
	;