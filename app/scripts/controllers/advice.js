'use strict';
  angular.module('advice', [])	
	
	.controller('adviceController', ['$scope', 'Advice',
	  function($scope, Advice) {
	  
	  		$scope.oneAtATime = true;
						
			$scope.advice = Advice.query();
									
			$scope.selectedArticle = [{"name":"Travel Security Advice",
									   "content":"Click the menu on the left for more content"
										}];
			
			$scope.pushArticle = function(content){
				$scope.selectedArticle = [];
				$scope.selectedArticle.push(content);
				console.log(content);
				console.log($scope.selectedArticle);
			}
					  
	  }])
	  
	;