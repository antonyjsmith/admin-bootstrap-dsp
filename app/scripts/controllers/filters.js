angular.module('filters', [])

// Convert html and markdown tags from escaped character into formatted text

	.filter('markdown', function ($sce) {
	    var converter = new Showdown.converter();
	    return function (value) {
			var html = converter.makeHtml(value || '');
	        return $sce.trustAsHtml(html);
	    };
	})
	
// Swap Risk ID's for Terms
// todo: normalise data into global_terms table e.g 1e , 2e ...
	
	.filter('evacTerms', function () {

		var terms = {
					  "record": [
					    {
					      "id": 0,
					      "term": "Monitoring"
					    },
					    {
					      "id": 1,
					      "term": "Increased Monitoring"
					    },
					    {
					      "id": 2,
					      "term": "Warning"
					    },
					    {
					      "id": 3,
					      "term": "Consider Evacuation"
					    },
					    {
					      "id": 4,
					      "term": "Evacuation"
					    }
					  ]
					};
						
		return function(termid){

			result = _.find(terms.record, function(term){ return term.id == termid; });
			
			if (typeof result == 'undefined'){
				
				return 'Loading...';
				
			} else {
			
				return result.term;

			};

						
	    };
	})
	
// Swap Risk ID's for Terms
// todo: normalise data into global_terms table e.g 1r , 2r ...
	
	.filter('riskTerms', function () {

		var terms = {
					  "record": [
					    {
					      "id": 1,
					      "term": "Low"
					    },
					    {
					      "id": 2,
					      "term": "Medium"
					    },
					    {
					      "id": 3,
					      "term": "High"
					    },
					    {
					      "id": 4,
					      "term": "Extreme"
					    }
					  ]
					};
						
		return function(termid){

			result = _.find(terms.record, function(term){ return term.id == termid; });
			
			if (typeof result == 'undefined'){
				
				return 'Loading...';
				
			} else {
			
				return result.term;

			};

						
	    };
	})
	
	.filter('intentTerms', function () {

		var terms = {
					  "record": [
					    {
					      "id": 1,
					      "term": "Little/Improbabale"
					    },
					    {
					      "id": 3,
					      "term": "Expressed/Probable"
					    },
					    {
					      "id": 4,
					      "term": "Determined/Likely"
					    }
					  ]
					};
						
		return function(termid){

			result = _.find(terms.record, function(term){ return term.id == termid; });
			
			if (typeof result == 'undefined'){
				
				return 'Loading...';
				
			} else {
			
				return result.term;

			};

						
	    };
	})
	
	.filter('capabilityTerms', function () {

		var terms = {
					  "record": [
					    {
					      "id": 0,
					      "term": "Low"
					    },
					    {
					      "id": 1,
					      "term": "Moderate"
					    },
					    {
					      "id": 2,
					      "term": "Extensive"
					    }
					  ]
					};
						
		return function(termid){

			result = _.find(terms.record, function(term){ return term.id == termid; });
			
			if (typeof result == 'undefined'){
				
				return 'Loading...';
				
			} else {
			
				return result.term;

			};

						
	    };
	})
	
// convert Country ISO into name
	
	.filter('countryName', function (Countries) {

		var countries = Countries.query();
						
		return function(term){

			result = _.find(countries, function(country){ return country.countryISO == term; });
			
			//wait for DB to load the list...
			
			if (typeof result == 'undefined'){
				
				return 'Loading...';
				
			} else {
			
				return result.countryName;

			};			
	    };
	})
	
// Pull results from the global_terms table and match
	
	.filter('globalTerms', function (GlobalTerms) {

		var terms = GlobalTerms.query();
						
		return function(termid){

			result = _.find(terms.record, function(term){ return term.id == termid; });
						
			//wait for DB to load the term list...
			
			if (typeof result == 'undefined'){
				
				return 'Loading...';
				
			} else {
			
				return result.term;

			};			
	    };
	});
	
