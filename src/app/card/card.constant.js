"use strict";

angular.module("turtleApp")
.constant('CardColor', {
	'BLUE': 'B',
	'COLOR': 'C', // color means player can treat it as any color else
	'GREEN': 'G',
	'PURPLE': 'P',
	'RED': 'R',
	'YELLOW': 'Y'
})
.constant('CardSymbolConvertor', {
	'FORWARD1': 'FORWARD1',
	'FORWARD2': 'FORWARD2',
	'BACKWARD1': 'BACKWARD1',
	'LASTFORWARD': 'FORWARD1',
	'LASTFORWARD2': 'FORWARD2'
});