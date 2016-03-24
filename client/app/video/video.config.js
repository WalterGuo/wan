(function(){
  'use strict'

  angular.module('venvyApp')
    .config(function ($stateProvider) {
      $stateProvider
        .state('play', {
          url: '/v/play/:playId',
          templateUrl: 'app/video/play.html',
          controller: 'VideoPlayCtrl'
        })
    });
}).call(this);
