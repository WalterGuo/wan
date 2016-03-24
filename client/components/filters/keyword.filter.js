(function(){
  'use strict';
  angular.module('venvyApp').filter('keywordFilter', function($sce) {
    return function(text, keyword) {
      text  = text.replace(eval("/("+keyword+")/gi"),'<em>$1</em>');
      return $sce.trustAsHtml(text);
    };
  });
}).call(this);
