'use strict';

angular.module('turtleApp')
.controller('GameController', function($scope, $rootScope, $state, $timeout, $location, $log, $modal, AuthService, UserFactory, MessageFactory, CardColor, CardSymbolConvertor, MessageType){
	AuthService.isAuthenticated().then(function(){
		$scope.Messages = MessageFactory;
		$scope.$watch(function(scope){ return scope.Messages.collection.cards.length }, function(newVal, oldVal){
	    	if (newVal === 5)
	    		$rootScope.$broadcast('card.sync', $scope.Messages.collection.cards);
	    });

	    $scope.$watch(function(scope){ return scope.Messages.collection.moves.length }, function(newVal, oldVal){
	    	if (newVal > 0) {
	    		var currentMove = $scope.Messages.collection.moves[newVal-1];
	    		if (currentMove.content.playerId === UserFactory.userId()) {
	    			// remove card from cards
	    			var cards = $scope.Messages.collection.cards;
	    			var index = -1;
	    			for (var i=0;i<cards.length;i++){
	    				if (cards[i].content.color===currentMove.content.card.color &&
	    					cards[i].content.symbol===currentMove.content.card.symbol){
	    					index = i;
	    					break;
	    				}
	    			}
	    			if (index !== -1) {
	    				$scope.Messages.collection.cards.splice(index, 1);
	    				$rootScope.$broadcast('card.remove', index);
	    			}
	    		}
	    		// convert playerId to username
	    		var screenName = currentMove.content.playerId;
	    		try {
	    			screenName = screenName.match(/^(\S+)-/)[1];
	    		} catch (err) {}

	    		$scope.Messages.collection.moves[newVal-1].content.move = {screenName: screenName};

	    		// modify move.content.card.symbol if card if colorful
	    		if ($scope.Messages.collection.moves[newVal-1].content.card.color === CardColor.COLOR) {
	    			$scope.Messages.collection.moves[newVal-1].content.move.colorful = true;
	    			$scope.Messages.collection.moves[newVal-1].content.move.symbol = CardSymbolConvertor[currentMove.content.card.symbol];
	    		}
	    		// sync map

    			// syncMap(currentMove.content.snapshot);
    			$rootScope.$broadcast('map.sync', currentMove.content.snapshot);

	    		$timeout(function(){
	    			$scope.$apply();
	    		});
	    	}
	    });

		$scope.$watch('Messages.collection.turtle', function(newVal, oldVal) {
			if (newVal !== null)
				$rootScope.$broadcast('turtle.color', newVal.content);
		}, true);

		$scope.$watch('Messages.collection.turn', function(newVal, oldVal) {
			if (newVal !== null && UserFactory.userId() === newVal.content)
				$rootScope.$broadcast('play.turn');
		}, true);

		$scope.$watch('Messages.collection.win', function(newVal, oldVal) {
			if (newVal !== null) {
				if (UserFactory.userId() === newVal.content.id)
					$rootScope.$broadcast('play.end', 1);
				else
					$rootScope.$broadcast('play.end', 0);
			}
		}, true);

	});

	$scope.$on('card.play', function(event, cardSelected, colorSelected) {
		var move = angular.copy(cardSelected);
		move.type = MessageType.MOVE;
		if (colorSelected)
			move.content.pick = colorSelected;
		MessageFactory.send(JSON.stringify(move));
	});

	$scope.$on('go.home', function() {
		MessageFactory.clean();
		$timeout(function(){
			$state.go('home');
		});
	});
});