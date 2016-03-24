/**
 * Created
 * Author:linyo
 * Date:15/7/22
 * Email:virgo@lilinyo.me
 */
(function () {
  'use strict'

  angular.module('venvyApp')
    .controller('MobileShareCtrl',
    function ($scope, $http, $state, Video, $document, $location,$ua, $debounce,Auth) {

      var vid = $state.params.vid,wrapper = ' fill gradient ',url=$location.$$host+$location.$$url;
      if(!$ua.inMobile){
        wrapper += ' pc ';
      }else{
        wrapper += ' mobile ';
        if($ua.inAndroid){
          wrapper += ' andriod ';
        }
      }
      $scope.url = 'http://baobab.cdn.wandoujia.com/14374760453891.mp4';
      $scope.cover = 'http://img.wdjimg.com/image/video/7cf774ad49a5dadb4c695194c1957c9d_0_0.jpeg';
      $scope.title = '拥有「千塔之城」、「金色城市」美称的捷克首都布拉格，有着浓郁的文化气氛和层出不穷的文化活动。一位旅人把在这里三天三夜的记忆转换为了一帧帧美妙的画面。From Yiannis Kostavaras'
      $scope.$parent.wrapper = wrapper;
      Video.getVideoById(vid).then(function(data){

       if(data&&data.localInfo){
         $scope.url = data.localInfo.url;
         $scope.cover = data.localInfo.cover;
         $scope.title = data.title
         $document[0].title = data.title+"｜玩 tv"
         getUserById(data.localInfo.user);
         getSeriesById(data.series);
         if($scope.url){
           $debounce(2000, function(){
             $scope.duration = document.getElementById('video').duration;
             console.log($scope.duration);
             if($ua.inWechat){
               var friend = {
                 'appId':'wxa19b735a25397b1a',
                 // 这里需要特别说明的是，建议不要用新浪微博的图片地址，要么你试试，哈哈
                 'img': $scope.cover,

                 'link':url,
                 'desc': $scope.title,
                 'title':$scope.title
               };
               var callback = function(arg){

               }
               wechat('friend', friend, callback);           // 朋友
               wechat('timeline', friend, callback);         // 朋友圈
               wechat('weibo', friend, callback);            // 微博
               //wechat('email', friend, callback);
             }
           },true);
         }

       }
      });
      function getUserById(uid){
        Auth.getUserById(uid).then(function(user){
          $scope.user = user.msg;
        })
      }
      function getSeriesById(seriesId){
        Video.querySeriesById(seriesId).then(function(data) {
          if(data.msg){
            $scope.seriesTitle = "#"+data.msg[0].name;
            $scope.seriesDesc = "#"+data.msg[0].desc;
          }
        });
      }
      $('.play-control-box').on('click',function(){
        $(this).hide();
        var video =document.getElementById('video');
        $('.poster').hide();
        video.play();

      })
    });
}).call(this);
