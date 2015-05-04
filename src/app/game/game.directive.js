"use strict";

angular.module('turtleApp')
.directive('pixiStage', function() {
	return {
		restrict: 'A',
		scope: {
			onAnimate: '=?'
		},
		link: function($scope, $element, $attrs) {
			var delta = 110,
		    	canvasWidth = 960,
		    	canvasHeight = 720,
		    	cardWidth = 100,
		    	cardHeight = 160,
		    	cardDelta = 10,
		    	cardY = 50,
		    	colors = ['R', 'B', 'Y', 'P', 'G'],
		    	cardSelected = null,
		    	colorSelected = null;

			var stage = new PIXI.Stage(0x66FF99),
				colorPickerContainer = new PIXI.DisplayObjectContainer(),
				cardContainer = new PIXI.DisplayObjectContainer(),
				mapContainer = new PIXI.DisplayObjectContainer(),
				playButtonContainer = new PIXI.DisplayObjectContainer(),
				gameEndContainer = new PIXI.DisplayObjectContainer(),
				gameEndMask = new PIXI.Graphics(),
				renderer = PIXI.autoDetectRenderer(canvasWidth, canvasHeight);


			
			gameEndContainer.addChild(gameEndMask);
			gameEndContainer.visible = false;
			// thing.lineStyle(10, 0xffffff, 1);
			gameEndMask.alpha = 0.8;
			gameEndMask.beginFill(0x222222);
			// thing.lineStyle(2, 0x0000FF, 1);
			gameEndMask.drawRect(0, 0, canvasWidth, canvasHeight);
			gameEndMask.endFill();

			var endText = new PIXI.Text("", {font:"50px Arial", fill:"blue"});
     		endText.position.set(canvasWidth/2, canvasHeight/2);
     		endText.anchor.set(0.5, 0.5);
     		gameEndContainer.addChild(endText);

			playButtonContainer.position.x = canvasWidth - 200;
			playButtonContainer.position.y = canvasHeight - 200;

			var playButton = new PIXI.Sprite(PIXI.Texture.fromImage('assets/images/playbtn.png'));
			playButton.anchor.x = 0.5;
			playButton.anchor.y = 0.5;
			playButton.width = 160;
			playButton.height = 62;
			playButton.position.y = 130;
			playButton.buttonMode = true;
			playButton.interactive = true;


			playButton.mouseover = function() {
				this.width *= 1.1;
				this.height *= 1.1;
			};

			playButton.mouseout = function() {
				this.width /= 1.1;
				this.height /= 1.1;
			};

			playButton.click = function() {
				if (cardSelected !== null) {
					if (cardSelected.content.color !== 'C' || (cardSelected.content.color === 'C' && colorSelected !== null)) {
						$scope.$emit('card.play', cardSelected, colorSelected);		
					} else {
						console.log('You have to pick a color');
					}
				} else {
					console.log('You have to pick a card');
				}
			};

			playButtonContainer.addChild(playButton);

			cardContainer.position.x = 0;
			cardContainer.position.y = canvasHeight - cardHeight;

			var cardX = (canvasWidth - 200 - 5*cardWidth - 4*cardDelta) / 2;

			colorPickerContainer.position.x = 0;
			colorPickerContainer.position.y = cardContainer.position.y - 70;

			colorPickerContainer.visible = false;

			var colorX = (canvasWidth - 200 - 5*50 - 4*10) / 2;

			for (var i=0;i<colors.length;i++) {
				var imgSrc = 'assets/images/turtles/'+colors[i]+'.png';
				var texture = PIXI.Texture.fromImage(imgSrc);
				// create a new Sprite using the texture
				var color = new PIXI.Sprite(texture);
				color.data = colors[i];

				color.anchor.x = 0.5;
				color.anchor.y = 0.5;
				color.alpha = 1;

				// move the sprite t the center of the screen
				color.position.x = colorX;
				color.position.y = 0;

				color.width = 50;
				color.height = 50;
				color.interactive = true;

				color.click = function(mouseData) {
					for (var j=0; j<colors.length; j++) {
						try {
							colorPickerContainer.getChildAt(j).width = 50;
							colorPickerContainer.getChildAt(j).height = 50;
						} catch (err) {
							console.log(err);
							continue;
						}
					}
					this.width *= 1.2;
					this.height *= 1.2;
					colorSelected = this.data;
				};

				colorX += 60;

				colorPickerContainer.addChildAt(color, i);
			}

			stage.addChild(playButtonContainer);
			stage.addChild(colorPickerContainer);
			stage.addChild(mapContainer);
			stage.addChild(cardContainer);
			stage.addChild(gameEndContainer);

			var tick = Math.PI * 0.5;
     		var turnText = new PIXI.Text("Your Turn !", {font:"50px Arial", fill:"red"});
     		turnText.position.set(canvasWidth/2, canvasHeight/2);
     		turnText.anchor.set(0.5, 0.5);
     		turnText.alpha = 0;

     		stage.addChild(turnText);

			var assetsToLoad = ["assets/images/tiles/tileGrass_tile.png", 
				"assets/images/turtles/B.png", 
				"assets/images/turtles/G.png", 
				"assets/images/turtles/R.png",
				"assets/images/turtles/Y.png",
				"assets/images/turtles/P.png",
				"assets/images/backbtn.png"];
     		var loader = new PIXI.AssetLoader(assetsToLoad);
     		loader.onComplete = onAssetsLoaded
     		loader.load();

     		function onAssetsLoaded() {
     			$element.append(renderer.view);

     			// backbutton
     			var backButton = new PIXI.Sprite(PIXI.Texture.fromImage('assets/images/backbtn.png'));
				backButton.anchor.x = 0.5;
				backButton.anchor.y = 0.5;
				backButton.width = 192;
				backButton.height = 77;
				backButton.position.x = canvasWidth / 2;
				backButton.position.y = canvasHeight - 200;
				backButton.buttonMode = true;
				backButton.interactive = true;

				backButton.click = function() {
					$scope.$emit('go.home');
				};
				gameEndContainer.addChild(backButton);

				// set up map
				var tileTexture = PIXI.Texture.fromImage('assets/images/tiles/tileGrass_tile.png');
				var tileX = 150,
					tileY = 200;

				for (var i=0;i<10;i++) {
					var tile = new PIXI.Sprite(tileTexture);

					tile.anchor.x = 0.5;
					tile.anchor.y = 0.5;

					tile.position.x = tileX;
					tile.position.y = tileY;
					tile.scale.x = 2;
					tile.scale.y = 2;

					tileX += (tile.width*3/5);

					if (tileY === 200)
						tileY = 200 + tile.height;
					else
						tileY = 200
					tile.width = tile.width;
					tile.height = tile.height;

					mapContainer.addChildAt(tile, i);
				}

				requestAnimFrame( animate );
	 
			    function animate() {
			    	if (tick < Math.PI * 0.5) {
						tick += 0.05;
						turnText.scale.x = 1+ Math.sin(tick);
						turnText.scale.y = 1+ Math.sin(tick);
					} else {
						turnText.alpha -= 0.1;
					}

			        requestAnimFrame( animate );
			        // render the stage   
			        renderer.render(stage);
			    }


				$scope.$on('map.sync', function(event, snapshot) {
					for (var i=0; i<mapContainer.children.length; i++)
						mapContainer.getChildAt(i).removeChildren();

					var positionDict = {};
					for (var color in snapshot) {
						positionDict[snapshot[color].position] = positionDict[snapshot[color].position] || 0;
						positionDict[snapshot[color].position] ++;
					}

					var map = {};
					for (var pos in positionDict) {
						pos = parseInt(pos);
						map[pos] = map[pos] || [];
						if (pos !== 0) {
							var level = positionDict[pos]-1;
							var parent = mapContainer.getChildAt(pos-1);
							while(level >= 0) {
								for (var color in snapshot) {
									if (snapshot[color].position === pos && snapshot[color].level === level) {
										var imgSrc = 'assets/images/turtles/'+color+'.png',
											texture = PIXI.Texture.fromImage(imgSrc),
											turtle = new PIXI.Sprite(texture);

										turtle.anchor.x = 0.5;
										turtle.anchor.y = 0.5;
										if (positionDict[pos] - level === 1) {
											turtle.scale.x = 0.5;
											turtle.scale.y = 0.5;
										} else {
											turtle.scale.x = 0.8;
											turtle.scale.y = 0.8;
										}
										turtle.position.y = -parent.height*(turtle.scale.y)/(2*(parent.scale.y));
										parent.addChild(turtle);
										parent = turtle;
										level --;
										break;
									}
								}
							}
						}
					}
				});

     		};

     		$scope.$on('card.sync', function(event, cards){
				for (var i=0; i<cards.length; i++) {
					try {
						var card = cardContainer.getChildAt(i);
					} catch(err) {
						var imgSrc = 'assets/images/cards/'+cards[i].content.color+'_'+cards[i].content.symbol+'.png';
						var texture = PIXI.Texture.fromImage(imgSrc);
						// create a new Sprite using the texture
						var card = new PIXI.Sprite(texture);
						card.data = cards[i];

						// center the sprites anchor point
						card.anchor.x = 0.5;
						card.anchor.y = 0.5;
						card.alpha = 1;

						// move the sprite t the center of the screen
						card.position.x = cardX;
						card.position.y = cardY;

						card.width = 100;
						card.height = 160;

						card.interactive = true;

						card.mouseover = function(mouseData){
							this.width *= 1.1;
							this.height *= 1.1;
						}

						card.mouseout = function(mouseData){
						   	this.width /= 1.1;
							this.height /= 1.1;			
						}

						card.click = function(mouseData) {
							cardSelected = this.data;
							for (var j=0; j<5; j++) {
								try {
									cardContainer.getChildAt(j).position.y = cardY;
								} catch (err) {
									continue;
								}
							}
							this.position.y -= 20;
							if (this.data.content.color === 'C')
								colorPickerContainer.visible = true;
							else
								colorPickerContainer.visible = false;
						}

						cardContainer.addChildAt(card, i);
						cardX += delta;
					}
				};
				cardSelected = null;
				colorSelected = null;
			});

			$scope.$on('card.remove', function(event, index) {
				cardContainer.removeChildAt(index);
				cardX -= delta;
				for (var i=0; i<4; i++) {
					try {
						cardContainer.getChildAt(i).position.y = cardY;
						if (i >= index)
							cardContainer.getChildAt(i).position.x -= delta;
					} catch (err) {
						console.log(err);
						continue;
					}
				}
				colorPickerContainer.visible = false;
			});

			$scope.$on('turtle.color', function(event, color) {
				var imgSrc = 'assets/images/turtles/'+color+'.png';
				var texture = PIXI.Texture.fromImage(imgSrc);
				var myTurtle = new PIXI.Sprite(texture);

				// center the sprites anchor point
				myTurtle.anchor.x = 0.5;
				myTurtle.anchor.y = 0.5;
				myTurtle.alpha = 1;

				// move the sprite t the center of the screen
				myTurtle.position.x = 50;
				myTurtle.position.y = 50;

				myTurtle.width = 80;
				myTurtle.height = 80;

				stage.addChild(myTurtle);
			});

			$scope.$on('play.turn', function() {
				tick = 0;
				turnText.alpha = 1;
			});

			$scope.$on('play.end', function(event, result) {
				gameEndContainer.visible = true;
				if (result) {
					endText.setText('You Won!');
				} else {
					endText.setText('You Lost :(');
				}
			});
			
		}
	}
});