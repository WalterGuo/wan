/**
 * Created
 * Author:gtanghua
 * Date:15/7/28
 * Email:virgo@lilinyo.me
 */
(function(){
  'use strict';
  angular.module('venvyApp').filter('UrlFilter', function($sce) {
    return function(url) {
      return $sce.trustAsResourceUrl(url);
    };
  });
}).call(this);

