(function(){

  'use strict'
  angular.module("venvyApp.app", ['venvyApp.template', 'venvyApp.modal','venvyApp.iva']);
  angular.module("venvyApp.template", ["template/modal/window.html"])
  angular.module('venvyApp.modal', [])
    .directive('modalWindow', ['$modalStack', '$timeout', function ($modalStack, $timeout) {
      return {
        restrict: 'EA',
        scope: {
          index: '@',
          animate: '='
        },
        replace: true,
        transclude: true,
        templateUrl: function (tElement, tAttrs) {
          return tAttrs.templateUrl || 'template/modal/window.html';
        },
        link: function (scope, element, attrs) {
          element.addClass(attrs.windowClass || '');
          scope.size = attrs.size;

          $timeout(function () {
            // trigger CSS transitions
            scope.animate = true;

            if (!element[0].querySelectorAll('[autofocus]').length) {
              element[0].focus();
            }
          });
          scope.close = function (evt) {
            if (evt.currentTarget === evt.target) {
              evt.preventDefault();
              evt.stopPropagation();
              $modalStack.dismiss(evt);
            }
          };
        }
      };
    }])
    .directive('modalTransclude', function () {
      return {
        link: function ($scope, $element, $attrs, controller, $transclude) {
          $transclude($scope.$parent, function (clone) {
            $element.empty();
            $element.append(clone);
          });
        }
      };
    })
    .factory('$modalStack', ['$animate', '$timeout', '$document', '$compile', '$rootScope',
      function ($animate, $timeout, $document, $compile, $rootScope) {
        var $modalStack = {};
        var OPENED_MODAL_CLASS = 'modal-open';
        $document.bind('keydown', function (evt) {
          if (evt.which === 27) {
            evt.preventDefault();
            $modalStack.dismiss(evt);
          }
        });
        $modalStack.open = function (modalInstance, modal) {
          var body = $document.find('body').eq(0);
          var angularDomEl = angular.element('<div modal-window></div>');
          angularDomEl.attr({
            'template-url': modal.windowTemplateUrl,
            'window-class': modal.windowClass
          }).html(modal.content);
          var modalDomEl = $compile(angularDomEl)(modal.scope);
          body.append(modalDomEl);
          body.addClass(OPENED_MODAL_CLASS);
        };
        $modalStack.close = function () {
          console.log('close');
        };
        $modalStack.dismiss = function ($event) {
          var body = $document.find('body').eq(0);
          body.removeClass(OPENED_MODAL_CLASS);
          body.find('.modal.show').removeClass('in').remove();
        };
        return $modalStack;
      }])
    .provider('$modal', function () {
      var $modalProvider = {
        options: {
          keyboard: true
        },
        $get: ['$injector', '$rootScope', '$q', '$http', '$templateCache', '$controller', '$modalStack','$document',
          function ($injector, $rootScope, $q, $http, $templateCache, $controller, $modalStack,$document) {
            var $modal = {};

            function getTemplatePromise(options) {
              return options.template ? $q.when(options.template) :
                $http.get(angular.isFunction(options.templateUrl) ? (options.templateUrl)() : options.templateUrl,
                  {cache: $templateCache}).then(function (result) {
                    return result.data;
                  });
            }

            function getResolvePromises(resolves) {
              var promisesArr = [];
              angular.forEach(resolves, function (value) {
                if (angular.isFunction(value) || angular.isArray(value)) {
                  promisesArr.push($q.when($injector.invoke(value)));
                }
              });
              return promisesArr;
            }

            $modal.close = function () {
              $modalStack.dismiss();
            }
            $modal.show = function (modalOptions) {
              var modalResultDeferred = $q.defer();
              var modalOpenedDeferred = $q.defer();


              var modalInstance = {
                result: modalResultDeferred.promise,
                opened: modalOpenedDeferred.promise,
                close: function (result) {
                  $modalStack.close(modalInstance, result);
                },
                dismiss: function (reason) {
                  $modalStack.dismiss(modalInstance, reason);
                }
              };
              modalOptions = angular.extend({}, $modalProvider.options, modalOptions);
              modalOptions.resolve = modalOptions.resolve || {};
              if (!modalOptions.template && !modalOptions.templateUrl) {
                throw new Error('One of template or templateUrl options is required.');
              }

              var templateAndResolvePromise =
                $q.all([getTemplatePromise(modalOptions)].concat(getResolvePromises(modalOptions.resolve)));
              templateAndResolvePromise.then(function resolveSuccess(tplAndVars) {
                var modalScope = (modalOptions.scope || $rootScope).$new();
                modalScope.url = (modalOptions.resolve && modalOptions.resolve.url ? modalOptions.resolve.url : 'http://wantv.me');
                modalScope.eurl=encodeURIComponent((modalOptions.resolve && modalOptions.resolve.url ? modalOptions.resolve.url : 'http://wantv.me'));
                modalScope.weixinurl = (modalOptions.resolve && modalOptions.resolve.weixinurl ? modalOptions.resolve.weixinurl : 'http://wantv.me');
                modalScope.title = encodeURIComponent((modalOptions.resolve && modalOptions.resolve.title ? modalOptions.resolve.title : '#玩视频吧#'));
                modalScope.title +="  "+ document.getElementsByName('description')[0].content;
                modalScope.venvyUrl =  (modalOptions.resolve && modalOptions.resolve.venvyUrl ? modalOptions.resolve.venvyUrl : 'http://www.letv.com/ptv/vplay/23011457.html');
                modalScope.venvyType =  (modalOptions.resolve && modalOptions.resolve.venvyType ? modalOptions.resolve.venvyType : 0);
                modalScope.pic=((modalOptions.resolve && modalOptions.resolve.pic ? modalOptions.resolve.pic : 'http://7u2n0p.com2.z0.glb.qiniucdn.com/dapai629x.png'));

                modalScope.$close = modalInstance.close;
                modalScope.$dismiss = modalInstance.dismiss;
                var ctrlInstance, ctrlLocals = {};
                var resolveIter = 1;
                if (modalOptions.controller) {
                  ctrlLocals.$scope = modalScope;
                  ctrlLocals.$modalInstance = modalInstance;
                  angular.forEach(modalOptions.resolve, function (value, key) {
                    ctrlLocals[key] = tplAndVars[resolveIter++];
                  });

                  ctrlInstance = $controller(modalOptions.controller, ctrlLocals);
                  if (modalOptions.controllerAs) {
                    modalScope[modalOptions.controllerAs] = ctrlInstance;
                  }
                }
                $modalStack.open(modalInstance, {
                  scope: modalScope,
                  deferred: modalResultDeferred,
                  content: tplAndVars[0],
                  keyboard: modalOptions.keyboard,
                  windowClass: modalOptions.windowClass,
                  windowTemplateUrl: modalOptions.windowTemplateUrl,
                  size: modalOptions.size
                });
              }, function resolveError(reason) {
                modalResultDeferred.reject(reason);
              });

              templateAndResolvePromise.then(function () {
                modalOpenedDeferred.resolve(true);
              }, function () {
                modalOpenedDeferred.reject(false);
              });
              return modalInstance;
            }
            return $modal;
          }]
      }
      return $modalProvider;
    });
  angular.module("template/modal/window.html", []).run(["$templateCache", function ($templateCache) {
    $templateCache.put("template/modal/window.html",
      "<div tabindex=\"-1\" role=\"dialog\" class=\"modal show\" ng-class=\"{in: animate}\" ng-style=\"{'z-index': 1050 + index*10, display: 'block'}\" ng-click=\"close($event)\">\n" +
      "<div class='modal-bg' ng-click=\"close($event)\"></div>" +
      "   <div class=\"modal-container\" ng-click=\"close($event)\" modal-transclude></div>\n" +
      "</div>");
  }]);

}).call(this);