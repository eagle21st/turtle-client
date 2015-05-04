'use strict';

angular.module('turtleApp', ['ngWebSocket', 'ngAnimate', 'ngCookies', 'ngTouch', 'ngSanitize', 'ui.router', 'mm.foundation'])
  .config(function ($stateProvider, $urlRouterProvider) {
    var stateResolve = {
      auth: ['AuthService', function (AuthService) {
        return AuthService.isAuthenticated();
      }]
    };

    $stateProvider
      .state('loggedout', {
        url: '/loggedout',
        templateUrl: 'app/login/login.html',
        controller: 'LoginController'
      })
      .state('home', {
        url: '/',
        templateUrl: 'app/home/home.html',
        controller: 'HomeController',
        resolve: stateResolve
      })
      .state('game', {
        templateUrl: 'app/game/game.html',
        controller: 'GameController',
        resolve: stateResolve
      });

    $urlRouterProvider.otherwise('/loggedout');
  });