(function () {
  'use strict'

  angular.module('venvyApp', [
    'ngResource',
    'ui.router',
    'venvyApp.app',
    'venvyApp.search',
    'venvyVideo.help',
    'util.help'
  ])
    .config(function ($urlRouterProvider, $locationProvider, $httpProvider, $sceDelegateProvider) {
      $urlRouterProvider
        .otherwise('/');
      $locationProvider.html5Mode(true);
      $locationProvider.hashPrefix('!');
      $sceDelegateProvider.resourceUrlWhitelist([
        // Allow same origin resource loads.
        'self',
        // Allow loading from our assets domain.  Notice the difference between * and **.
        'http://7xi4ig.com2.z0.glb.qiniucdn.com/**', 'http://cdn.wantv.me/**']);
    }).controller('appController', function ($scope, $document, $http) {
      $scope.wrapper = "normal";
      $scope.bodyCls = "normal";
      $scope.og_url = "http://wantv.me";
      $scope.video_title = "http://wantv.me";
      $scope.video_image = "http://wantv.me";
      $scope.video_descripttion = "http://wantv.me";
      $scope.video_url = "http://wantv.me";
    })
}).call(this);
