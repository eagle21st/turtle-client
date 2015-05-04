"use strict";

angular.module("turtleApp")
.constant('MessageType', {
	'MOVE': 'M',
	'ACK': 'A',
	'REQ': 'R',
	'RES': 'RS',
	'TURN': 'T',
	'CARD': 'C',
	'WIN': 'W',
	'TURTLE': 'TU'
})