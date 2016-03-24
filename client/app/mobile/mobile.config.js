/**
 * Created
 * Author:linyo
 * Date:15/7/22
 * Email:virgo@lilinyo.me
 */
(function () {
  'use strict'

  angular.module('venvyApp')
    .config(function ($stateProvider) {
      $stateProvider
        .state('mobile', {
          url: '/mobile',
          templateUrl: 'app/mobile/mobile.html',
          controller: 'MobileCtrl',
          abstract:true
        })
        .state('mobile.share', {
          url: '/share/:vid',
          templateUrl: 'app/mobile/mobile.share.html',
          controller: 'MobileShareCtrl'
        })
    });
}).call(this);
