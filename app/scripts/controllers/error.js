'use strict';
  
angular.module('error', [])
  
  .controller('errorController', ['$scope',
  				function($scope) {
  
	  	$scope.currentError = null;
	  	  
            $scope.parseDreamFactoryError = function (errorDataObj) {

                // create a place to store the error
                var error = null;

                // If the exception type is a string we don't need to go any further
                // This was thrown explicitly by the module due to a module error
                // unrelated to the server
                if (typeof errorDataObj.exception === 'string') {

                    // store the error
                    // and we're done
                    error = errorDataObj.exception;
                    
                // the exception is not a string
                // let's assume it came from the server
                } else {

                    // is there more than one error contained in the object
                    // I don't think I've ever encountered more than one message
                    // in the error object but we should check
                    if(errorDataObj.exception.data.error.length > 1) {

                        // yes. Let's loop through and concat these to display to the user
                        angular.forEach(errorDataObj.exception.data.error, function(obj) {

                        // add the message from each error obj to the error store
                        error += obj.message + '\n';
                    })

                // We have only one error message
                // 99.9% of the time this is the case
                } else {

                    // store that error message
                    error = errorDataObj.exception.data.error[0].message;
                    }
                }

                // return the built message to display to the user
                // return errorDataObj.module + ': ' + error
				return 'It would appear we have an error! : ' + error
            };

            $scope.clearError = function() {

                $scope.currentError = null;
            };


            $scope.$on('error:dreamfactory', function(e, errorMessageObj) {

                $scope.currentError = $scope.parseDreamFactoryError(errorMessageObj);
            });
	
	}
	
  ]);