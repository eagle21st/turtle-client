"use strict";

angular.module("turtleApp")
.service("AuthService", function(UserFactory) {
	this.isAuthenticated = function() {
		return UserFactory.validateToken();
	}
});