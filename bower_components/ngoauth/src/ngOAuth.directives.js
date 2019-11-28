/*
 * Credit
------
ALBERT CHEN
albertkeylime@gmail.com
If you use the script, please let me know albertkeylime@gmail.com;  Don't worry, I won't ask for anything!
11/28/2019
 * 
 */


'use strict';


angular.module('ngOAuth.directives', [])

    .controller('OAuthController',['$scope', 'ngOAuth', function($scope, ngOAuth) {
        $scope.ngOAuth = ngOAuth;
    }])


          .directive('ngoathSummary', ['ngOAuth',function(ngOAuth){
        return {
            restrict : 'E',
            controller : 'OAuthController',

            scope: {
                id:'@',
                name:'@'
            },
            transclude: true,
            templateUrl: function(element, attrs) {
                if ( typeof attrs.templateUrl == 'undefined' ) {
             // TEST   	ngOAuth.$auth.name = 'Samuel';
                    return '/template/ngOAuth/summary.html';
                } else {
                	ngOAuth.$auth.name = 'Chen';

                    return attrs.templateUrl;
                }
            }
        };
    }])
    
  .directive("w3Test", function() {
	  return {
          restrict : 'E',

	    template : "<h1>Made by a directive!</h1>"
	  };
	});
   