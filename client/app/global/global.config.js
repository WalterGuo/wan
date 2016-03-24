(function () {
  'use strict'

  angular.module('venvyApp')
    .config(function ($stateProvider) {
      $stateProvider
        .state('about', {
          url: '/about',
          templateUrl: 'app/global/about.html',
          controller: 'StaticCtrl'
        })
        .state('search', {
          url: '/search/:keyword',
          templateUrl: 'app/global/search.html',
          controller: 'SuperSearchCtrl'
        })
        .state('error', {
          url: '/404',
          templateUrl: 'app/global/error.html',
          controller: 'ErrorCtrl'
        })
    });
}).call(this);

