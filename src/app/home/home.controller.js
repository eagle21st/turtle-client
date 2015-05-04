'use strict';

angular.module('turtleApp')
  .controller('HomeController', function ($scope, $state, $timeout, $log, $location, UserFactory, $modal, AuthService, MessageFactory) {
  	// read user state from UserFactory
	$scope.inSearching = UserFactory.inSearching();
	$scope.mode = '2p';
	$scope.bot = false;
	$scope.advanced = false;
	$scope.username = UserFactory.username();

	$scope.find = function(){
		UserFactory.startSearch($scope.mode, $scope.bot, $scope.advanced).then(function(){
			$scope.inSearching = true;
			$timeout(function(){
				$scope.$apply();
			});
		}, function(reason){
			$log.error(reason);
		});
	};

	$scope.cancel = function(){
		UserFactory.cancelSearch().then(function(){
			$scope.inSearching = false;
			$timeout(function(){
				$scope.$apply();
			});
		}, function(reason){
			$log.error(reason);
		});
	};

	UserFactory.getUserStatus().then(function(data) {
		if (data.status === 'INGAME') {
			// prompt modal to let user rejoin the game
			var modalInstance = $modal.open({
    			backdrop: 'static',
    			templateUrl: 'app/rejoinModal/modal.html',
    			controller: 'RejoinModalController'
    		});

    		modalInstance.result.then(function() {
		    	MessageFactory.send(JSON.stringify());
		    	UserFactory.startGame();
		    	$timeout(function(){
					$state.go('game');
				});
		    }, function() {
		    	// reject
		    });
		}
	});

	AuthService.isAuthenticated().then(function(){
		$scope.Messages = MessageFactory;
	    $scope.$watch('Messages.collection.req', function(newVal, oldVal){
	    	if (newVal !== 'null' && newVal !== 'undefined' && newVal != null && newVal != undefined && newVal !== oldVal) {
	    		var modalInstance = $modal.open({
	    			backdrop: 'static',
	    			templateUrl: 'app/requestModal/modal.html',
	    			controller: 'RequestModalController',
	    			resolve: {
	    				message: function() {
	    					return $scope.Messages.collection.req;
	    				}
	    			}
	    		});

	    		modalInstance.result.then(function(response) {
			    	MessageFactory.send(JSON.stringify(response));
			    	UserFactory.startGame();
			    	$timeout(function(){
						$state.go('game');
					});
			    }, function() {
			    	// reject
			    });
	    	}
	    }, true);
	}, function(){
		$state.go('loggedout');
	});
  });