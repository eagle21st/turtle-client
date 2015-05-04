'use strict';

angular.module('turtleApp')
.controller('RequestModalController', function($scope, $state, $modalInstance, message, MessageType){
	$scope.message = message.content;

	$scope.ok = function(){
		var response = angular.copy(message);
		response.type = MessageType.RES;
		$modalInstance.close(response);
		$state.go('game');
	}

	$scope.cancel = function () {
		$modalInstance.dismiss('cancel');
	};
})