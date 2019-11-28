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


angular.module('ngOAuth', ['ngOAuth.directives'])

    .config([function () {

    }])

    .provider('$ngOAuth', function () {
        this.$get = function () {
        };
    })

    .run(['$rootScope', 'ngOAuth','ngOAuthItem', 'authstore', function ($rootScope, ngOAuth, ngOAuthItem, authstore) {

        $rootScope.$on('ngOAuth:change', function(){
            ngOAuth.$save();
        });

        if (angular.isObject(authstore.get('auth'))) {
            ngOAuth.$restore(authstore.get('auth'));
        	console.log(authstore.get('auth') + " - ngOAuth restored");
           	console.log("ngOAuth Name Value: " + ngOAuth.name);


        } else {
        	   ngOAuth.init();
           	console.log("ngOAuth initilized with: " + ngOAuth.$auth.name);

        }

    }])

    .service('ngOAuth', ['$rootScope', '$window', 'ngOAuthItem', 'authstore', function ($rootScope, $window,ngOAuthItem, authstore) {

        this.init = function(){
        	console.log("ngOAuth initilized..");
            this.$auth = {
            		id: '',  // username
                name : '',
                oauthtoken : '',
                refreshtoken : ''

                
            };
        };

      
        
        this.setAuth = function (auth) {
            this.$auth = auth;
            return this.getAuth();
        };

        this.getAuth = function(){
            return this.$auth;
        };

      

        this.updateAuth = function (id, name, oauthtoken, refreshtoken) {

            var inAuth = this.getAuth();

            if (typeof inAuth === 'object'){
                //Update quantity of an item if it's already in the cart
            	inAuth.id = id;
            	inAuth.name = name;
            	inAuth.oauthtoken = oauthtoken;
            	inAuth.refreshtoken = refreshtoken;


                $rootScope.$broadcast('ngOAuth:itemUpdated', inAuth);
            } else {
                var newItem = new ngOAuthItem(id, name, oauthtoken, refreshtoken);
                this.$oauth.name
                $rootScope.$broadcast('ngOAuth:itemAdded', newItem);
            }

            $rootScope.$broadcast('ngOAuth:change', {});
        };

        this.updateAuthToken = function (oauthtoken, refreshtoken) {

            var inAuth = this.getAuth();

            if (typeof inAuth === 'object'){
                //Update quantity of an item if it's already in the cart
          
            	inAuth.oauthtoken = oauthtoken;
            	inAuth.refreshtoken = refreshtoken;


                $rootScope.$broadcast('ngOAuth:itemUpdated', inAuth);
            } else {
                var newItem = new ngOAuthItem(oauthtoken, refreshtoken);
                this.$oauth.name
                $rootScope.$broadcast('ngOAuth:itemAdded', newItem);
            }

            $rootScope.$broadcast('ngOAuth:change', {});
        };

        

        this.toObject = function() {

            if (this.username.length == 0) return false;

           
            return {
              	id: this.getId(),
              	name: this.getName(),
              	oauthtoken: this.getOAuthtoken(),
              	refreshtoken: this.getRefreshtoken()

            }
        };


        this.$restore = function(storedAuth){
            var _self = this;
            _self.init();
            _self.$auth.id = storedAuth.id;
            _self.$auth.name = storedAuth.name;
            _self.$auth.oauthtoken = storedAuth.oauthtoken;
            _self.$auth.refreshtoken = storedAuth.refreshtoken;

            this.$save();
        };

        this.$save = function () {
            return authstore.set('auth', JSON.stringify(this.getAuth()));
        }

    }])

    .factory('ngOAuthItem', ['$rootScope', '$log', function ($rootScope, $log) {

        var item = function (id, name, oauthtoken, refreshtoken) {
            this.setId(id);
            this.setName(name);
            this.setOAuthtoken(oauthtoken)
            this.setORefreshtoken(refreshtoken)

        };
        
        var item = function (oauthtoken, refreshtoken) {
            this.setOAuthtoken(oauthtoken)
            this.setORefreshtoken(refreshtoken)

        };



        item.prototype.setId = function(id){
            if (id)  this._id = id;
            else {
                $log.error('An ID must be provided');
            }
        };

        item.prototype.getId = function(){
            return this._id;
        };


        item.prototype.setName = function(name){
            if (name)  this._name = name;
            else {
                $log.error('A name must be provided');
            }
        };
        item.prototype.getName = function(){
            return this._name;
        };

      

        item.prototype.setOAuthtoken = function(oauthtoken){
            if (oauthtoken) this._oauthtoken = oauthtoken;
        };

        item.prototype.getOAuthtoken = function(){
            if (this._oauthtoken) return this._oauthtoken;
            else $log.info('This item has no oauthtoken');
        };


        item.prototype.setRefreshtoken = function(refreshtoken){
            if (refreshtoken) this._refreshtoken = refreshtoken;
        };

        item.prototype.getRefreshtoken = function(){
            if (this._refreshtoken) return this._refreshtoken;
            else $log.info('This item has no refreshtoken');
        };


        item.prototype.toObject = function() {
            return {
                id: this.getId(),
                name: this.getName(),
                oauthtoken: this.getOAuthtoken(),
                refreshtoken: this.getRefreshtoken(),

            }
        };

        return item;

    }])


    
    .service('authstore', ['$window', function ($window) {
        return {
            get: function (key) {
                if ( $window.localStorage.getItem(key) )  {
                	
                	console.log(key + " - Restoring json : " + $window.localStorage.getItem(key));
                    var auth = angular.fromJson( $window.localStorage.getItem(key) ) ;
                    return JSON.parse(auth);
                }
                return false;

            },
            set: function (key, val) {
            	
            	console.log(key + " - Saving json : " + $window.localStorage.getItem(key));

                if (val === undefined) {
                    $window.localStorage.removeItem(key);
                } else {
                    $window.localStorage.setItem( key, angular.toJson(val) );
                }
                return $window.localStorage.getItem(key);
            }
        }
    }])

    .controller('OAuthController',['$scope', 'ngOAuth', function($scope, ngOAuth) {
        $scope.ngOAuth = ngOAuth;
    }])

    .value('version', '1.0.0');
