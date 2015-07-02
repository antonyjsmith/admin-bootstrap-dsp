'use strict';
/**
 * @ngdoc function
 * @name sbAdminApp.controller:ServicesController
 * @description
 * # SevicesController
 * Controller of the sbAdminApp
 */
angular.module('services', ['ngResource'])

	.factory('authHttpResponseInterceptor',['$q','$location',function($q,$location){
	    return {
	        response: function(response){
	            if (response.status === 401) {
	                console.log("Response 401");
	            }
	            return response || $q.when(response);
	        },
	        responseError: function(rejection) {
	            if (rejection.status === 401) {
	                console.log("Response Error 401",rejection);
	                $location.path('/401').search('returnTo', $location.path());
	            } else if (rejection.status === 403) {
	                console.log("Response Error 403",rejection);
	                $location.path('/403').search('returnTo', $location.path());
	            }
	            return $q.reject(rejection);
	        }
	    }
	}])
  	
  .factory('PasswordServices', ['$resource', 'DSP_URL',
	function($resource, DSP_URL){
		  
	return $resource(DSP_URL + '/rest/user/password', {},
		{
	    	save : { method: 'POST'}
	    	
	    })
	    
	}])
	
	  /*
	  	Get term list - used by custom filter globalTerms to swap out title ID's for text
	  */
	  
	.factory('GlobalTerms', ['$resource', 'DSP_URL',
	  function($resource, DSP_URL){
	    return $resource('https://core.maxwelllucas.com/rest/db/global_terms', {}, {
		    
		    query: {
	      	method:'GET',
	      	isArray:false,

		  	}
		    
	    } )
	    
	  }])
	  
	.factory('riskTerms', ['$resource', 'DSP_URL',
	  function($resource, DSP_URL){
	    return $resource(DSP_URL + "/rest/db/rating_terms?filter=value=:Value AND type=':Type'", {}, {
		    
		    query: {
	      	method:'GET',
	      	isArray:false,

		  	}
		    
	    } )
	    
	  }])
	  
	  
///////////////// NOTIFICATIONS /////////////////

	  
	.factory('UserNotificationList', ['$resource', 'DSP_URL',
	  function($resource, DSP_URL){
	    return $resource(DSP_URL + '/rest/db/user_notification/:id/?filter=userID=:userID', {}, {
	      query: {method:'GET', isArray:false}
	    })
	    
	  }])
	  
	  	  
///////////////// COUNTRIES /////////////////
	
	  /*
	  	Get the list of countries and related 
	  */	
  
  .factory('CountryList', ['$resource', 'DSP_URL',
	  function($resource, DSP_URL){
	  	  
	    return $resource(DSP_URL + '/rest/ml-sql/globalwatch_country?order=countryName&fields=countryID%2CcountryRating%2CcountryName%2CcountryISO%2CcountryISO3&related=data_evacuation_levels_by_country_id,data_reports_by_data_country_v_report', {}, {
	      query: {
	      	method:'GET',
	      	isArray:true,
	      	transformResponse: function(data, header) {
	      		var wrapped = angular.fromJson(data);
	      		return wrapped.record;
		  		}
		  	}
	      
	    })
	    
	}])
	
  .factory('CountryListShort', ['$resource', 'DSP_URL',
	  function($resource, DSP_URL){
	  	  
	    return $resource(DSP_URL + '/rest/ml-sql/globalwatch_country?order=lastEdit%20DESC&limit=10&fields=countryID%2CcountryRating%2CcountryName%2ClastEdit', {}, {
	      query: {
	      	method:'GET',
	      	isArray:false
		  	}
	      
	    })
	    
	}])
	
	  /*
	  	Get data from country table for individual record using the country id grabbed from the URL
	  */
	  
	.factory('CountryGeoDetail', ['$resource', 'DSP_URL',
	  function($resource, DSP_URL){
	    return $resource(DSP_URL + '/rest/ml-sql/country_geo_data?filter=ID%3D:countryID', {}, {
		    
		    query: {
		      	method:'GET',
		      	isArray:false
		      	}
		      	
		    })
	    
	  }])
	  
	  /*
	  	Get data from country table for individual record using the country id  from the URL
	  */
	  
	.factory('CountryDetail', ['$resource', 'DSP_URL',
	  function($resource, DSP_URL){
	    return $resource(DSP_URL + '/rest/ml-sql/globalwatch_country?filter=countryID%3D:countryID', {}, {
		    
			query: {
				method:'GET',
				isArray:false
			}
		    
	    })
	    
	  }])
	  
	.factory('CountryProfile', ['$resource', 'DSP_URL',
	  function($resource, DSP_URL){
	    return $resource(DSP_URL + '/rest/ml-sql/globalwatch_country/:countryID', {}, {
		    
			query: {
				method:'GET',
				params:{
					related : 'data_evacuation_levels_by_country_id,globalwatch_country_entries_by_entryCountryID,data_reports_by_data_country_v_report,data_actors_by_data_actor_v_country'
				},
				isArray:false
			}
		    
	    })
	    
	  }])
	  
	.factory('CountryGeoDetail', ['$resource', 'DSP_URL',
	  function($resource, DSP_URL){
	    return $resource(DSP_URL + '/rest/ml-sql/country_geo_data?filter=ID%3D:countryID', {}, {
		    
		    query: {
		      	method:'GET',
		      	isArray:false
		      	}
		      	
		    })
	    
	  }])
	  
///////////////// INCIDENTS /////////////////
	  	
	.factory('wpPosts', ['$resource', 'DSP_URL',
	  function($resource, DSP_URL){
	    return $resource( DSP_URL + "/rest/wp_posts/wp_4_posts?include_count=true&order=post_date%20DESC&limit=:postCount&offset=0&filter=post_status='publish'", {}, {
		    	query: {
		      		method:'GET',
			  		isArray:false,
		      	}
	    	})
	    
	  }])
	  	  
	.factory('wpPostsRating', ['$resource', 'DSP_URL',
	  function($resource, DSP_URL){
	    return $resource(DSP_URL + '/rest/wp_posts/_proc/listAlerts', {}, {
		    
		    query: {
		      	method:'POST',
		      	isArray:false
		      	}
		      	
		      	})
	    
	  }])
	  
	.factory('Incident', ['$resource', 'DSP_URL',
	  function($resource, DSP_URL){
	    return $resource(DSP_URL + '/rest/wp_incident_feed/posts/:incidentID', {}, {
		    query: {
		      	method:'GET',
		      	isArray:false
		      	}
		      	
		      	})
	    
	  }])
	  	  
	/* Subtle difference to above! returns array rather than single object */
	  	  
	.factory('Incidents', ['$resource', 'DSP_URL',
	  function($resource, DSP_URL){
	    return $resource(DSP_URL + '/rest/wp_incident_feed/posts/?filter[posts_per_page]=:postCount&filter[date_query][before]=:dateBefore&filter[date_query][after]=:dateAfter', {}, {
		    query: {
		      	method:'GET',
		      	isArray:true
		      	}
		      	
		      	})
	    
	  }])
	  
	  
	.factory('geoIncident', ['$resource', 'DSP_URL',
	  function($resource, DSP_URL){
	    return $resource(DSP_URL + '/rest/wp_posts/_proc/queryAlerts', {}, {
		    
		    query: {
		      	method:'POST',
		      	isArray:true
		      	}
		      	
		      	})
	    
	  }])
	  
	/* Pulls from the wordpress REST api */
	  
	.factory('wpRestIncidents', ['$resource', 'DSP_URL',
	  function($resource, DSP_URL){
	    return $resource(DSP_URL + '/rest/wp_incident_feed/posts/?filter[posts_per_page]=:entryQty&filter[taxonomy]=country&filter[term]=:countryISO&filter[date_query][after]=:dateParam', {}, {
		    query: {
		      	method:'GET',
		      	isArray:true
		      	}
		      	
		      	})
	    
	  }])
	  	  
///////////////// ADVICE /////////////////

	.factory('Advice', ['$resource', 'DSP_URL',
	  function($resource, DSP_URL){
	    return $resource(DSP_URL + '/rest/ml-sql/data_advice_categories?related=data_advice_articles_by_category_id', {}, {
		    query: {
		      	method:'GET',
		      	isArray:false
		      	}
		      	
		      	})
	    
	  }])
	  
	  
	.factory('Healix', ['$resource', 'DSP_URL',
	  function($resource, DSP_URL){
	    return $resource(DSP_URL + '/rest/healix/api/Country/getByISOCode/:medCountryID', {}, {
		    query: {
		      	method:'GET',
		      	isArray:true
		      	}
		      	
		      	})
	    
	  }])
	
	;

