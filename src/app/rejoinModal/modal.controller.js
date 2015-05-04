'use strict';

angular.module('turtleApp')
.controller('RejoinModalController', function($scope, $state, $modalInstance){
	$scope.reconnect = function(){
		$modalInstance.close();
	}

	$scope.disconnect = function () {
		$modalInstance.dismiss('cancel');
	};
})