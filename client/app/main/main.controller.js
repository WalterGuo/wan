(function(){
  'use strict';

  angular.module('venvyApp')
    .controller('MainCtrl', function ($scope, $http, Video,$modal,$timeout,$location) {
      var channelId = '553cd6d42131242435d50cd9';
      //127.0.0.1:3000 '553cd6d42131242435d50cd9'
      Video.queryAllChannels(channelId)
        .then(function (data) {
          $scope.channels = data.msg;
        });
      $scope.playerModal = function($event){
        var url = $($event.target).data('venvy-player-url'),title = $($event.target).data('venvy-player-title'),id= '553cd6d42131242435d50cd9',pic=$($event.target).css('background-image');
        pic = pic.replace(/url\(/,"");//去掉 url(
        pic = pic.replace(/\)/,"");//去掉后面的 )
        $modal.show({
          backdrop:false,
          templateUrl:'app/modal/playModal.html',
          resolve:{
            url: "http://127.0.0.1:8088/v/play/"+id,
            weixinurl:"/public/wechat/wechat_h5.html?vid="+id,
            title: title+"#玩视频么#",
            venvyUrl:url,
            venvyType:0,
            pic:pic
          },
          windowClass:"in"
        }).opened.then(function(modal){
            console.log(modal);

          })
        //$timeout(function(){
        //  new Iva('modal-player', {
        //    type:0,
        //    video: url,
        //    title:title
        //  });
        //},500)
      }
    });
}).call(this);
