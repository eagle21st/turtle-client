"use strict";

angular.module("turtleApp")
.factory('UserFactory', function($log, $q, $state, $cookies, $http, ServerConfig, UserState) {
	var tokenCookieKey = 'trtk';

	var user = {
		firstName: null,
		lastName: null,
		isAuthenticated: false,
		token: null,
		state: UserState.IDLE,
		ws: null
	};
	
	var resolved = false;

	return new (function(scope){
		this.validateToken = function() {
			var deferred = $q.defer();
			if (user.isAuthenticated && user.token){
				deferred.resolve(true);
				return deferred.promise;
			}
			// retrieve token from cookie if there's any
			var token = $cookies[tokenCookieKey];
			// refreshed the token
			if (token) {
				var req = {
					method: 'POST',
					url: ServerConfig.API_URL+'auth/status/',
					headers: {
						'Authorization': 'Bearer '+token
					},
					data: {
						token: token
					}
				};
				$http(req).success(function(data){
					$cookies[tokenCookieKey] = data.token;
					user.isAuthenticated = true;
					user.token = data.token;
					user.id = data.id;
					user.username = data.username;
					deferred.resolve(true);
					$state.go('home');
				}).error(function(data){
					user.isAuthenticated = false;
					user.token = null;
					deferred.reject('Token expired or not valid');
				});
			} else {
				deferred.reject('No valid token found');
			}
			return deferred.promise;
		};

		this.login = function(accessToken, backend) {
			var req = {
				method: 'POST',
				url: ServerConfig.API_URL+'auth/login/'+backend+'/',
				headers: {
					'Authorization': 'Token '+accessToken
				}
			};
			$http(req).success(function(data, status, headers, config){
				user.isAuthenticated = true;
				user.token = data.token;
				user.id = data.id;
				user.username = data.username;
				$cookies[tokenCookieKey] = data.token;
				$state.go('home');
			}).error(function(data, status, headers, config){
				user.isAuthenticated = false;
				user.token = null;
			});
		};

		this.startSearch = function(mode, bot, advanced) {
			var deferred = $q.defer();
			var req = {
				method: 'POST',
				url: ServerConfig.API_URL+'game/find/',
				headers: {
					'Authorization': 'Bearer '+user.token
				},
				data: {
					mode: mode,
					bot: bot,
					advanced: advanced
				}
			};
			$http(req).success(function(data, status, headers, config){
				if (data && data.error) {
					deferred.reject(data.error);
				} else {
					user.state = UserState.SEARCHING;
					user.mode = mode;
					user.bot = bot;
					user.advanced = advanced;
					deferred.resolve(true);
				}
			}).error(function(data, status, headers, config){
				deferred.reject(data);
			});

			return deferred.promise;
		};

		this.cancelSearch = function() {
			var deferred = $q.defer();
			var req = {
				method: 'POST',
				url: ServerConfig.API_URL+'game/cancel/',
				headers: {
					'Authorization': 'Bearer '+user.token
				},
				data: {
					mode: user.mode,
					advanced: user.advanced
				}
			};
			$http(req).success(function(data, status, headers, config){
				user.state = UserState.SEARCHING;
				deferred.resolve(true);
			}).error(function(data, status, headers, config){
				deferred.reject(data);
			});

			return deferred.promise;
		};

		this.getUserStatus = function() {
			var deferred = $q.defer();
			var req = {
				method: 'GET',
				url: ServerConfig.API_URL+'user/status/',
				headers: {
					'Authorization': 'Bearer '+user.token
				}
			};
			$http(req).success(function(data, status, headers, config){
				deferred.resolve(data);
			}).error(function(data, status, headers, config){
				deferred.reject(data);
			});
			return deferred.promise;
		};

		this.startGame = function() {
			user.state = UserState.PLAYING;
		};

		this.inSearching = function() {
			return user.state === UserState.SEARCHING;
		};

		this.token = function() {
			return user.token;
		};

		this.userId = function() {
			return user.id;
		};

		this.username = function() {
			return user.username;
		};

	})();
});