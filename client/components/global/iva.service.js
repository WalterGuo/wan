(function() {
  'use strict'
  angular.module('venvyApp.iva', [])
    .directive('venvyIvaBox', function() {
      function link(scope, elment) {
        scope.$watch('url', function(newValue) {
          if (!newValue) {
            return;
          }
          if (newValue && elment.attr("id")) {

            new Iva(elment.attr("id"), {
              appkey: 'NJVx-n6abt',
              video: newValue,
              autoplay: true
            })
          }
        })



      }

      return {
        restrict: "A",
        link: link,
        //replace:true,
        //template:'<div id="modal-player" class="card-content"></div>',
        scope: {
          type: '@venvyType',
          url: '@venvyUrl'
        }
      }
    })

}).call(this);
