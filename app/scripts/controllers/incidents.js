'use strict';
/**
 * @ngdoc function
 * @name sbAdminApp.controller:
 * @description
 * # 
 * Controller of the sbAdminApp
 */
 angular.module('incidents', [])

	.controller('incidentFeedController', ['$scope', '$http', '$filter', '$routeParams', 'wpPosts', 'localStorageService',
	  function($scope, $http, $filter, $routeParams, wpPosts, localStorageService) {
		  
	  	  $scope.itemsPerPage = 10;
	  	  	  	  
		  $scope.incidents = wpPosts.query({postCount: $scope.itemsPerPage}, function(response){
			
			$scope.totalItems = response.meta.count;
						  
		  });
		  
		  $scope.currOffset = 0;
		  
		  $scope.currShowing = $scope.currOffset + $scope.itemsPerPage;
		  		  
		  $scope.currentPage = 1;
		  
		  $scope.clear = function(){
			  
			  $scope.search = '';
			  localStorageService.set('incident_search_string', null);
			  $scope.pageChanged($scope.search);
			  
		  }
		
		  $scope.pageChanged = function(searchValue) {
			  
		  	function submit(val) {
			  	
		  		return localStorageService.set('incident_search_string', val);
		  		
			}
			  
			  
		    console.log('Page changed to: ' + $scope.currentPage);
		    console.log('Offset ' + ($scope.currentPage - 1) * $scope.itemsPerPage);
		    
		    var searchString = '';
		    
		    var checkSearchValue = function (val) {
			    
			    if ((typeof val == 'undefined') || (val == null)) {
				    
				    console.log('nothing there');
				    
			    } else {
				    
				    searchString = val;
				    
			    }
			    
		    };
		    
		    submit(searchValue);
		    checkSearchValue(searchValue);
		    
		    $scope.currOffset = ($scope.currentPage - 1) * $scope.itemsPerPage;
		    
		        $http.get("https://core.maxwelllucas.com/rest/wp_posts/wp_4_posts", {
			        params:{
				        include_count: true,
				        order: 'post_date DESC',
				        limit: $scope.itemsPerPage,
				        offset: $scope.currOffset,
				        filter: '(post_content LIKE "%' +searchString+ '%" OR post_title LIKE "%' +searchString+ '%") AND post_status = "publish"'
			        }
		        }).success(function(data) {
			        
			      $scope.incidents = data;
			      $scope.totalItems = data.meta.count;
			      
			      $scope.currShowing = $scope.currOffset + $scope.itemsPerPage;
			    
			    });
		  };
		
		  $scope.maxSize = 5;
		  
		  
		  if(localStorageService.isSupported) {
			  		    
		    $scope.search = localStorageService.get('incident_search_string');
		    
		    if ($scope.search != null) {
			    
			    $scope.pageChanged($scope.search);
			    
		    }
		    		    
		  }
 
		} 	  
	])
	
	.controller('incidentDetailCtrl', ['$scope', '$stateParams', 'Incident', 'uiGmapGoogleMapApi',
	  function($scope, $stateParams, Incident, uiGmapGoogleMapApi) {
		  	  
	  		$scope.incident = Incident.query({incidentID: $stateParams.incidentID});
	  		
	  		$scope.incident.$promise.then(function (location){
		  		
		  		//set variables and convert string to integer
		  		var lat = parseFloat(location.location_data.incident_latitude);
		  		var lng = parseFloat(location.location_data.incident_longitude);
		  		
		  		$scope.map = { center: { latitude: lat, longitude: lng }, zoom: 8 };
		  		$scope.point = { latitude: lat, longitude: lng };
		  				  		
	  		})
	  		
			uiGmapGoogleMapApi.then(function(maps) {
				$scope.map = { center: { latitude: 0, longitude: 0 }, zoom: 2 };
			});
					  		

		}	  
	])
	
	;	