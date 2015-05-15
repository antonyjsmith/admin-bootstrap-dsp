'use strict';
/**
 * @ngdoc function
 * @name sbAdminApp.controller:ServicesController
 * @description
 * # SevicesController
 * Controller of the sbAdminApp
 */
angular.module('services', ['ngResource'])
  	
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
	  
///////////////// COUNTRIES /////////////////
	
	  /*
	  	Get the list of countries and related 
	  */	
  
  .factory('CountryList', ['$resource', 'DSP_URL',
	  function($resource, DSP_URL){
	  	  
	    return $resource(DSP_URL + '/rest/ml-sql/globalwatch_country?order=countryName&fields=countryID%2CcountryRating%2CcountryName%2CcountryISO%2CcountryISO3&related=data_evacuation_levels_by_country_id', {}, {
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
					related : 'data_evacuation_levels_by_country_id,globalwatch_country_entries_by_entryCountryID,iprofile_vaccinations_by_countryISO'
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
	    return $resource(DSP_URL + '/rest/wp_incident_feed/posts/', {}, {
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

	
	;

