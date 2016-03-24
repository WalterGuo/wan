(function () {
  'use strict';

  angular.module('venvyApp')
    .controller('StaticCtrl', function ($scope, $document, $http) {
      $document[0].title = '关于我们｜云视链'
    })
    .controller('ErrorCtrl', function ($scope, $document, $http) {
      $document[0].title = '别止步于此，未知才是启发｜云视链－页面未找到 ';
      $scope.$parent.wrapper = 'fill';
    });
}).call(this);

