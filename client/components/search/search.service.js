(function() {
  'use strict'
  angular.module('venvyApp.search', []).
  service("superSearchConfig", ['$timeout', '$q', '$http', '$filter', 'Video',function($timeout, $q, $http, $filter,Video) {
      var requestParam = {};

      function getSuperSerachSuggestions(prefix) {
        //console.log(escape(prefix.toLowerCase()));
        var params = {
          "pn_u": 0,
          "ps_u": 3,
          "pn_v": 0,
          "ps_v": 3,
          "pn_s": 0,
          "ps_s": 3,
          "keyword": prefix
        };
        var $promise = Video.superSearch(params);
        // var $promise = $http.get("/superSearch", {
        //   params: {
        //     "pn_u": 0,
        //     "ps_u": 3,
        //     "pn_v": 0,
        //     "ps_v": 3,
        //     "pn_s": 0,
        //     "ps_s": 3,
        //     "keyword": prefix
        //   },
        //   cache: false
        // })
        // $promise.then(function(response) {
        //   console.log($filter("limitTo")(response));
        //   return (response);
        // })
        return $promise;
      }

      return {
        getSuperSearch: getSuperSerachSuggestions
      };
    }])
    .service("superSearchService", ["superSearchConfig", function(superSearchConfig) {
      var getSuperSearch = superSearchConfig.getSuperSearch;
      return {
        getSuperSearch: getSuperSearch
      }
    }])
    .controller("superSearchController",
      function($scope, superSearchService, $window, $timeout, $document, $modal,$debounce) {
        $scope.suggestions = [];
        $scope.prefix = "";
        $scope.selected = -1;
        $scope.selectionMade = false;
        $scope.keyword = "";
        $scope.len = 0;
        var isOpend = true;
        $scope.$watch("prefix", function(newValue, oldValue) {
          if (validator.isURL(newValue)) {
            console.log("url true");

            $modal.show({
              templateUrl: 'app/modal/playModal.html',
              resolve: {
                // url: "http://wantv.me/v/play/"+id,
                // weixinurl:"http://wantv.me/public/wechat/wechat_h5.html?vid="+id,
                // title: title+"#玩视频么#",
                venvyUrl: newValue,
                venvyType: 0
                  // pic:pic
              }
            }).result.then(function(modal) {

            })
            $scope.prefix = '';
            return;
          }

          if (newValue != oldValue && $scope.selectionMade == false) {
            $debounce(500,function(){
              console.log($scope.prefix+" "+new Date().getTime());
              if (newValue == "" || angular.isUndefined(newValue)) {
                $scope.suggestions = [];
                $scope.len = 0;
              } else {
                var promise = superSearchService.getSuperSearch($scope.prefix);
                promise.then(function(data) {
                  $scope.suggestions = data;

                  $scope.len = data.users?data.users.length:0 + data.videos?data.videos.length:0 + data.seriess?data.seriess.length:0;
                });
              }
            },true);

          }
        });
        $scope.setSelected = function(newValue) {
          if (newValue > $scope.len) {
            $scope.selected = 0;
          } else if (newValue < 0) {
            $scope.selected = $scope.len;
          } else {
            $scope.selected = newValue;
          }
        };
        $scope.submitClicked = function() {
          $window.open("/search/" + encodeURIComponent($scope.prefix)) ;
        };
        $scope.clickedSomewhereElse = function() {
          $scope.selected = -1;
          $scope.len = 0;
        };
        $document.bind('click', function(evt) {
          if ($(evt.target).hasClass('autocomplete')||(evt.target.nodeName==="INPUT"&&evt.target.type==="search")) {
            return false;
          }
          $('.autocomplete').addClass('hide');
        });
      }
    )
    .directive("searchInput", function() {
      function link(scope, element) {
        element.bind("keydown", function(event) {
          switch (event.which) {
            case 40: // down arrow
              scope.$apply(function() {
                console.log(parseInt(scope.index));
                scope.select({
                  "x": parseInt(scope.index) + 1
                });
              });
              break;
            case 38: // up arrow
              scope.$apply(function() {
                console.log(parseInt(scope.index));
                scope.select({
                  "x": parseInt(scope.index) - 1
                });
              });
              break;
            case 13: // enter
              event.preventDefault();
              if (scope.selectionMade == false) {
                if (scope.index == "-1") {
                  scope.$apply(function() {
                    scope.listItems = [];
                  });
                }
                scope.$apply(function() {
                  scope.close();
                })
              }
              break;
            default:
              scope.$apply(function() {
                scope.selectionMade = false;
                scope.index = -1;
              });
          }
        });
        element.bind('focus',function(){
          $('.autocomplete').removeClass('hide');
        })
        element.bind("blur", function(event) {
          scope.close();
        });
        element.bind("compositionstart", function(event) {
          console.log(scope.prefix);
        });
      }
      return {
        restrict: "A",
        link: link,
        scope: {
          prefix: "=ngModel",
          select: "&",
          index: "=",
          selectionMade: "=",
          listItems: "=",
          close: "&"
        }
      };
    })
    .directive("searchSuggestions", ["$document", function($document) {
      function link(scope, element, attrs) {
        element.bind("click", function(e) {
          // e.stopPropagation();
        });

      }
      return {
        restrict: "A",
        link: link,
        scope: {
          suggestions: "=",
          selected: "=",
          applyClass: "&",
          selectSuggestion: "&",
          prefix: "@"
        },
        //  template:'' +
        //
        //  '<div class="view-all-box"><a href="javascript:void(0);">查看所有结果</a></div>' +
        //'<div class="view-results">' +
        //'<ul class="results-ul">' +
        //'<li ng-repeat="seriess in suggestions.seriess"><a href="javascript:void(0)"><i class="fa fa-tag fa-fw"></i><span>#NBA</span></a></li>' +
        //'</ul>' +
        //'<ul class="results-ul">' +
        //'<li ng-repeat="users in suggestions.users"><a href="javascript:void(0)"><img src="http://cdn.wantv.me/55025e0e9477c9c23e748dcd/1426990180496.jpg" class="avatar"/>[[users.name]]</a></li>' +
        //'</ul>' +
        //'<ul class="results-ul">' +
        //  '<li ng-repeat="videos in suggestions.videos"><a href="javascript:void(0)"><i class="fa fa-play-circle fa-fw"></i><span>[[videos.title]]</span></a></li>' +
        //  '</ul>' +
        //  '</div>'
        templateUrl: '/components/search/superSearchBox.html'
      };
    }])
    .directive("searchSuggestionsBox", function() {
      return {
        restrict: "A",
        template: '<div class="autocomplete" ng-if="len> 0 " apply-class="setSelected(x)"' +
          'selected="selected"' +
          'suggestions="suggestions"  prefix="{{prefix}}" ' +
          'search-suggestions' +
          '></div>'
      }
    })

}).call(this);
