(function() {
  'use strict';

  angular.module('venvyApp')
    .controller('SuperSearchCtrl', function($scope, $http, $state, Video, $document, $location, $debounce) {
      var keyword = $state.params.keyword,
        params, ps_u = 7,
        ps_v = 14,
        ps_s = 24,
        pn_u = 0,
        pn_v = 0,
        pn_s = 0;
      $document[0].title = keyword?keyword+"－玩tv搜索":"玩tv视频搜索_云视链";
      $scope.keyword = keyword;
      $scope.nextPage = nextPage;
      $scope.users = [];
      $scope.videos = [];
      $scope.seriess = [];
      $scope.pn_u = pn_u + 1;
      $scope.pn_v = pn_v + 1;
      $scope.u_load = false;
      $scope.v_load = false;
      $scope.s_load = false;

      $scope.nextPageInit = function($event) {
        if (($event&&$event.keyCode === 13) || !$event) {
          $location.path('/search/' + $scope.keyword)
        }
      }
      nextPage();

      function nextPage(swh) {
        $debounce(500, function() {
          timoutNext(swh);
        }, true);
      }

      function timoutNext(swh) {
        switch (swh) {
          case 'u':
            pn_u += 1;
            ps_u = 9;
            $scope.pn_u = pn_u + 1;
            break;
          case 'v':
            pn_v += 1;
            ps_v = 18;
            $scope.pn_v = pn_v + 1;
            break;
          case 's':
            pn_s += 1;
            break;
          default:
            $scope.users = [];
            $scope.videos = [];
            $scope.seriess = [];
            $scope.pn_u = pn_u = 0;
            $scope.pn_v = pn_v = 0;
            $scope.u_load = false;
            $scope.v_load = false;
            $scope.s_load = false;
            pn_s = 0;
            ps_u = 7;
            ps_v = 14;
            ps_s = 24;

        };
        params = {
          "pn_u": pn_u,
          "ps_u": ps_u,
          "pn_v": pn_v,
          "ps_v": ps_v,
          "pn_s": pn_s,
          "ps_s": ps_s,
          "keyword": $scope.keyword
        }
        Video.superSearch(params)
          .then(function(response) {
            if ((response.users.length > 0 && swh === 'u') || !swh) {

              if (response.users.length === ps_u) {
                $scope.u_load = true;
              }
              response.users.map(function(user) {
                $scope.users.push(user);
              })
            }
            if ((response.videos.length > 0 && swh === 'v') || !swh) {
              if (response.videos.length === ps_v) {
                $scope.v_load = true;
              }

              response.videos.map(function(video) {
                $scope.videos.push(video);
              })
            }
            if ((response.seriess.length > 0 && swh === 's') || !swh) {

              if (response.seriess.length === ps_s) {
                $scope.s_load = true;
              }

              response.seriess.map(function(seriess) {
                $scope.seriess.push(seriess);
              })
            }
          })
      }

    });

}());
