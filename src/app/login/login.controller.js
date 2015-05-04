'use strict';

angular.module('turtleApp')
  .controller('LoginController', function ($scope, $timeout, $log, $location, UserFactory) {
  	$scope.fbAsyncInit = false;

	function statusChangeCallback(response) {
		if (response.status === 'connected') {
			UserFactory.login(response.authResponse.accessToken, 'facebook')
		} else if (response.status === 'not_authorized') {
			$log.log('Not Authorized');
		} else {
			$log.log('Not Logged-in');
		}
	}

	window.checkLoginState = function(){
		FB.getLoginStatus(function(response) {
       		statusChangeCallback(response);
       	});
	};

	window.fbAsyncInit = function() {
		if ($scope.fbAsyncInit || window.FB === undefined) 
			return;

		FB.init({
			appId      : '784037768309074',
			cookie     : true, 
            xfbml      : true,
            version    : 'v2.1'
       	});

       	FB.getLoginStatus(function(response) {
       		statusChangeCallback(response);
       	});

       	$scope.fbAsyncInit = true;
  	};

  	fbAsyncInit();
  	
  	// Load the SDK asynchronously
  	(function(d, s, id) {
  		var js, fjs = d.getElementsByTagName(s)[0];
  		if (d.getElementById(id)) return;
  		js = d.createElement(s); js.id = id;
  		js.src = "//connect.facebook.net/en_US/sdk.js";
  		fjs.parentNode.insertBefore(js, fjs);
  	}(document, 'script', 'facebook-jssdk'));
  });