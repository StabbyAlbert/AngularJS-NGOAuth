/*
 * Credit
------
ALBERT CHEN
albertkeylime@gmail.com
If you use the script, please let me know albertkeylime@gmail.com;  Don't worry, I won't ask for anything!
11/28/2019
 * 
 */


angular.module('ngOAuth.fulfilment', [])
.service('ngOAuthFulfilmentProvider', ['$injector', function($injector){

	this._obj = {
			service : undefined,
			settings : undefined,
            _scope : undefined

	};

	this.setService = function(service){
		this._obj.service = service;
	};

	this.setSettings = function(settings){
		this._obj.settings = settings;
	};

	this.checkout = function(){
		var provider = $injector.get('ngCart.fulfilment.' + this._obj.service);
		return provider.checkout(this._obj.settings);

	}

}])


.service('ngOAuth.fulfilment.log', ['$q', '$log', 'ngOAuth', function($q, $log, ngOAuth){

	this.checkout = function(){

		var deferred = $q.defer();

		$log.info(ngOAuth.toObject());

		$log.info("*LOGGED*")
		deferred.resolve({
			cart:ngOAuth.toObject()
		});

		return deferred.promise;

	}

}])


.service('ngCart.fulfilment.httpverifytokennrefresh', ['$window','$http', 'ngOAuth',function($window,$http, ngOAuth){

	this.checkout = function(settings){
		document.getElementById('mymessage').innerHTML = ("<font color=red>Verifying data, please wait...</font><br>");

		const masterVerifytokennrefresh = baseWebserviceURL + "/master/verifynrefreshtoken";

		
		
		var config2 = {
				headers : {
					'method.request.header.Authorization':settings.oauthtoken,
					'method.request.header.RefreshToken':settings.refreshtoken,
					'Accept': 'application/json'
				}
		}
		
		document.getElementById('mymessage').innerHTML = ("<font color=red>RefreshToken1: "+settings.refreshtoken+"</font><br>");

		console.log("oauthtoken: "+settings.oauthtoken);

		
		$http
		.get(masterVerifytokennrefresh,config2)
		.then(
				function(response) {


					if(response != null) {
						console.log("data111:"+JSON.stringify(response));


						if( response.data.code == "200" && response.data.message.length > 0) {
							console.log("newoauthtoken:" + response.data.message);
							$window.sessionStorage.id_token = response.data.message;
							settings._scope.setId(response.data.message);
						}

						settings._scope.myToken = $window.sessionStorage.id_token;
						
						ngOAuth.updateAuthToken($window.sessionStorage.id_token,settings.refreshtoken);
						console.log("masterVerifytokennrefresh 200");
						document.getElementById('mymessage').innerHTML = ("<font color=red>oauth: "+$window.sessionStorage.id_token+"</font><br>");
			            document.getElementById('Auth').value =  $window.sessionStorage.id_token;  // use by A1InvEmpMain.html

						return "200";

						


					} else {
						settings._scope.setAdminGroup("false")
						settings._scope.setInventoryEmployeeGroup("false");
						console.log("masterVerifytokennrefresh 300 ERROR");

						return "300";

					}


				}).catch(function(response) {
					console.log('http get request error: ' + response.status + response.error);
					console.log("masterVerifytokennrefresh 400 ERROR");

					return "400";

				})
		console.log("masterVerifytokennrefresh 300 ERROR DONE");

		return "300";
	}
}])

.service('ngCart.fulfilment.httpverifytokennrefresh_findall', ['$window','$http', 'ngOAuth',function($window,$http, ngOAuth){

	this.checkout = function(settings){
		document.getElementById('mymessage').innerHTML = ("<font color=red>Verifying data, please wait...</font><br>");
		const masterVerifytokennrefresh_findall = baseWebserviceURL + "/master/verifynrefreshtoken_findall";
		var config2 = {
				headers : {
					'method.request.header.Authorization':settings.oauthtoken,
					'method.request.header.RefreshToken':settings.refreshtoken,
					'Accept': 'application/json'
				}
		}
		document.getElementById('mymessage').innerHTML = ("<font color=red>RefreshToken: "+settings.refreshtoken+"</font><br>");
		console.log("oauthtoken: "+settings.oauthtoken);
		$http
		.get(masterVerifytokennrefresh_findall,config2)
		.then(
				function(response) {


					if(response != null) {
						console.log("data111:"+JSON.stringify(response));


						//	$http.post("http://127.0.0.1:8080/V2/requesttest", data, config).then(function (response) {
						if( response.data.code == "200" && response.data.message.length > 0) {
							console.log("newoauthtoken:" + response.data.message);
							$window.sessionStorage.id_token = response.data.message;
							settings._scope.setId(response.data.message);
						}
						//		$window.sessionStorage.currentime_plus_timeout_second = response.expires_in + Math.round(new Date() / 1000);

						settings._scope.myToken = $window.sessionStorage.id_token;
				//		alert("data.count1: " + JSON.stringify(response.data.master));

						if(Object.keys(response.data.master).length > 0) {

							$window.sessionStorage.admingroup = response.data.master.vcEx20;
							$window.sessionStorage.login_userName = response.data.master.userName;
							$window.sessionStorage.login_phoneNumber = response.data.master.vcEx5;
							$window.sessionStorage.login_email = response.data.master.vcEx6;

							ngOAuth.updateAuth(response.data.master.userName,response.data.master.title,  $window.sessionStorage.id_token,settings.refreshtoken);


							if(response.data.master.vcEx20 == "true") {
								console.log("ISadmin ");

								settings._scope.setAdminGroup(response.data.master.vcEx20);

								$window.location.href = 'A1AdminMain.html';
							} else if(response.data.master.vcEx21 == "true") {
								settings._scope.setAdminGroup("false");
								settings._scope.setInventoryEmployeeGroup("true");

								$window.sessionStorage.inventorygroup = response.data.master.vcEx21;
								settings._scope.setInventoryEmployeeGroup(response.data.master.vcEx21);
								console.log("INVENTORY EMPLOYEE: " + response.data.master.vcEx21);

								$window.sessionStorage.inventoryemployeeid = response.data.master.intEx1;
								$window.sessionStorage.inventoryemployeename = response.data.master.title;
								//	alert("INVENTORY EMPLOYEE TRU::E"+$window.sessionStorage.inventoryemployeeid);
								$window.location.href = 'A1InvEmpMain.html';

							} else {

								settings._scope.setAdminGroup("false");
								settings._scope.setInventoryEmployeeGroup("false");
								$window.location.href = 'A1MissionSelection.html';
							}
						}




					} else {
						settings._scope.setAdminGroup("false")
						settings._scope.setInventoryEmployeeGroup("false");

					}


				}).catch(function(response) {
					console.log('http get request error: ' + response.status + response.error);
				})
		
		
		
		
		
		
		

		return "200";
	}
}]);
