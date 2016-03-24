(function(){
  'use strict';

  angular.module('venvyApp')
    .controller('VideoPlayCtrl', function ($scope, $http,$state, Video,$location,$document) {
      var playId = $state.params.playId;
      $scope.weixinurl ="http://wantv.me/public/wechat/wechat_h5.html?vid="+playId;
      $scope.eurl = encodeURIComponent("http://wantv.me"+$location.url());
      $scope.url = ("http://wantv.me"+$location.url());
      Video.getVideoById(playId).then(function(data){
        if(!data){
          $location.path('/');
        }
        var type = 0,url=void 0 ;
        if(data.source[0]&&data.source[0].link){
          url = data.source[0].link;
        }
        if(data.localInfo&&data.localInfo.url){
          type = 1;
          url = data.localInfo.url;
        }
        $scope.$parent.wrapper = 'fill';
        $scope.video = data;
        $scope.title = encodeURIComponent(data.title+"#玩视频么#");
        $document[0].title = data.title?data.title+"－在线观看－玩tv视频":"在线观看－玩tv视频";
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
    });
}).call(this);

