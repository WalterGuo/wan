(function() {
  'use strict';

  angular.module('venvyApp')
    .controller('VideoPlayCtrl', function($scope, $http, $state, Video, $location, $document) {
      var playId = $state.params.playId;
      $scope.weixinurl = "http://wantv.me/public/wechat/wechat_h5.html?vid=" + playId;
      $scope.eurl = encodeURIComponent("http://wantv.me" + $location.url());
      $scope.url = ("http://wantv.me" + $location.url());
      var data = {
          title:"我是本地视频网站",
          cover:"http://7xr9m4.com1.z0.glb.clouddn.com/%40%2Flive%2Fnew%2Fdesign%2F3ad1de40-4785-4e31-bd98-be80575c5553.png"
        }
        // Video.getVideoById(playId).then(function(data) {
      if (!data) {
        $location.path('/');
      }
      var type = 0,
        url = void 0;
      url = "http://play.videojj.com/20160325/VIDEO++%E7%81%B5%E6%82%A6%E4%BA%A7%E5%93%811_mp4/VIDEO++%E7%81%B5%E6%82%A6%E4%BA%A7%E5%93%811_1080p.mp4";

      $scope.$parent.wrapper = 'fill';
      $scope.video = data;
      $scope.title = encodeURIComponent(data.title + "#玩视频么#");
      $document[0].title = data.title ? data.title + "－在线观看－玩tv视频" : "在线观看－玩tv视频";
      $scope.venvyUrl = url;
      $scope.venvyType = type;
      $scope.pic = data.cover;
      $scope.$parent.video_url = url;
      $scope.$parent.og_url = $scope.url;
      console.log(data.cover)
        //if(url){
        //  new Iva('card-player',{
        //    type:type,
        //    video:url
        //  });
        //}

    })
    // });
}).call(this);
