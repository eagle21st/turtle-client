"use strict";

angular.module("turtleApp")
.factory('MessageFactory', function($websocket, $log, UserFactory, ServerConfig, MessageType){
	var ws = $websocket(ServerConfig.WS_URL+'?token='+UserFactory.token());
	var collection = {
		moves: [],
		acks: [],
		req: null, // max of 1 req is allowed during all time
		turn: null,
		cards: [],
		win: null,
		turtle: null
	};
	ws.onMessage(function(event){
		var res;
		try {
			res = JSON.parse(event.data);
			switch(res.type){
				case MessageType.MOVE:
					collection.moves.push(res);
					break;
				case MessageType.ACK:
					collection.acks.push(res);
					break;
				case MessageType.REQ:
					collection.req = res;
					break;
				case MessageType.TURN:
					collection.turn = res;
					break;
				case MessageType.CARD:
					collection.cards.push(res);
					break;
				case MessageType.WIN:
					collection.win = res;
					break;
				case MessageType.TURTLE:
					collection.turtle = res;
					break;
				default:
					throw new Error('Unsupported Message Type');
					break;
			}
		} catch(e) {
			$log.error('MESSAGEERROR: ' + e);
		}
	});

	return {
		collection: collection,
		status: function() {
			return ws.readyState;
		},
		send: function(message) {
			if (angular.isString(message)) {
				ws.send(message);
			}
			else if (angular.isObject(message)) {
				ws.send(JSON.stringify(message));
				if (message.type === MessageType.RES)
					collection.req = null;
			}
		},
		clean: function() {
			this.collection.req = null;
			this.collection.moves = [];
			this.collection.acks = [];
			this.collection.turn = null;
			this.collection.cards = [];
			this.collection.win = null
			this.collection.turtle = null;
		}
	};
});