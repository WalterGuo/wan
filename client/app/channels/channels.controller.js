(function() {

  'use strict';

  angular.module('venvyApp')
    .controller('ChannelsCtrl', function($scope, $http, $state, $location, Video, $modal, $timeout, $document) {
      var channels = $state.params.channels;
      var seriesId = $state.params.channelsId;
      if (!seriesId) {
        $location.path('/');
      }
      $scope.cls = channels;
      $scope.index = 0;
      nextPage($scope.index);
      $scope.nextPage = nextPage;
      $scope.series = [];
      $scope.ifNext = true;
      Video.querySeriesById(seriesId).then(function(data) {
        $document[0].title = data.msg[0].name + "频道－玩tv玩视频";
        $scope.title = "#" + data.msg[0].name + "#";
      });

      function nextPage(index) {
        if (!index && index !== 0) {
          index = $scope.index + 1;
          $scope.index = index;
        }

        Video.queryVideoBySeriesId(seriesId, index, 10).then(function(data) {

          $scope.ifNext = true;
          if (data.msg.length < 10) {
            $scope.ifNext = false;
          }
          if (data.msg.length <= 0) {
            return;
          }
          data.msg.map(function(el) {
            $scope.series.push(el);
          });
          $scope.time = data.time;
        })
      };

      $scope.playerModal = function($event) {
        if ($('.volume-box').find($event.target).length > 0) {
          return false;
        }
        var evt = $event.currentTarget == $event.target ? $event.target : $event.currentTarget;

        var url = $(evt).attr('venvy-player-url'),
          title = $(evt).data('venvy-player-title'),
          id = $(evt).data('venvy-player-id'),
          pic = $(evt).css('background-image');
        pic = pic.replace(/url\(/, ""); //去掉 url(
        pic = pic.replace(/\)/, ""); //去掉后面的 )
        $modal.show({
          templateUrl: 'app/modal/playModal.html',
          resolve: {
            url: "http://wantv.me/v/play/" + id,
            weixinurl: "http://wantv.me/public/wechat/wechat_h5.html?vid=" + id,
            title: title + "#玩视频么#",
            venvyUrl: url,
            venvyType: 1,
            pic: pic
          }
        }).result.then(function(modal) {

        })

      }

      $scope.src = 'http://7u2pv5.com2.z0.glb.qiniucdn.com/' + channels.charAt(0).toUpperCase() + channels.slice(1) + '_trans@2x.png';
    });

}).call(this);
