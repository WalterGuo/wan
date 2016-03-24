(function() {
  'use strict'
  angular.module('venvyVideo.help', ['venvyApp.video.count', 'venvyApp.video.copy', 'venvyApp.video.qrcode', 'venvyApp.video.scrollPlay']);
  angular.module('venvyApp.video.count', [])

  .directive('venvyVideoLoop', ['$filter', 'Video', function($filter, Video) {
    function link(scope, element) {
      if (scope.id) {
        Video.getVideoViewsById(scope.id).then(function(data) {
          if (!data) {
            return;
          }
          var views = Number(data.view);
          views = views * data.tagShow;
          if (views) {
            element.text($filter('number')(views) + "  Interactions");
          }
        })
      }
    }

    return {
      restrict: "A",
      link: link,
      //replace:true,
      //template:'<div id="modal-player" class="card-content"></div>',
      scope: {
        id: '@vId'
      }
    }
  }]);
  angular.module('venvyApp.video.copy', [])
    .directive('venvyVideoCopy', ['$filter', function($filter) {
      function link(scope, element) {
        if (scope.text) {
          ZeroClipboard.config({
            swfPath: "bower_components/zeroclipboard/dist/ZeroClipboard.swf"
          });
          // ZeroClipboard.setMoviePath('client/bower_components/zeroclipboard/dist/ZeroClipboard.swf')
          var clip = new ZeroClipboard(element); //创建ZeroClipboard.Client对象
          clip.on('copy', function() {
            clip.setText(scope.text);
          })
          clip.on('aftercopy', function(client, args) {
            console.log("复制成功");
            // clip.destroy();
          });

        }
      }

      return {
        restrict: "A",
        link: link,
        // replace:true,
        // template:'<div id="modal-player" class="card-content"></div>',
        scope: {
          text: '@zeroclipText'
        }
      }
    }]);
  angular.module('venvyApp.video.qrcode', [])
    .directive('venvyVideoQrcode', function() {
      function link(scope, element) {
        var visible = false,
          par = element.parent();
        if (scope.text) {
          $('.qrcode.weixin').qrcode({
            text: scope.text,
            width: 133,
            height: 133,
            label: 'wantv.me',
            fontcolor: "#3a3"
          })
          par.hover(function() {
            element.removeClass('hide').addClass('show');
          }, function() {
            element.removeClass('show').addClass('hide');
          })
        }

      }

      return {
        restrict: "A",
        link: link,
        replace: true,
        template: '<div class="qrcode-box venvy-box right center hide">' +
          '<div class="container"><!-- i class="fa fa-times"></i -->' +
          '  <p class="weixin-share-title">分享到微信朋友圈</p>' +
          '<div class="qrcode weixin">' +
          '' +
          '</div>' +
          '  <p class="weixin-share-footer">打开微信。点击“发现”,使用“扫一扫”即可将网页分享至朋友圈。' +
          '   </p>' +
          '  </div>' +
          '  </div>',
        scope: {
          text: '@qrcodeText'
        }
      }
    });
  angular.module('venvyApp.video.scrollPlay', [])
    .controller('scrollPlayController', function($scope, $document, $window) {
      // $document.on('scroll', checkScroll);
      // $document.on('resize', checkScroll);
      function checkScroll() {
        var scrollTop = (window.pageYOffset !== undefined) ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;
        scrollTop = scrollTop + 218;
        console.log(scrollTop);
        var scrollBottom = scrollTop + $(this).height();
        var video = $('.scroll-video-player-box');
        video.each(function(index) {
          var media = $(this)[0];
          var mediaTop = $(this).offset().top;
          var mediaBottom = mediaTop + $(this).height();
          var v = $(this).find('video');
          var that = $(this),
            loading = that.find('.scroll-video-loading-box');
          // console.log(scrollTop + " " + mediaBottom  + "  " + mediaTop);
          // console.log(scrollTop >= mediaTop && scrollTop <= mediaBottom);
          if (scrollTop >= mediaTop && scrollTop <= mediaBottom) {
            if (!v.attr('src')) {
              v.attr('src', v.data('src'));
            }
            v[0].play();
            if (v[0].readyState === 0) {
              loading.addClass('show');
              v[0].removeEventListener('canplay');
              v[0].addEventListener('canplay', function() {
                console.log("加载完成");
                loading.removeClass('show');
              });
            }

          } else {
            loading.removeClass('show');
            v.removeAttr('src');
            v[0].pause();
          }
        });
      }
    })
    .directive('venvyVideoScrollPlay', function($document, $debounce) {
      function link(scope, element) {
        scope.voiceSwitch = function($event) {
          var video = $($event.currentTarget).parent().next().find('video');

          if (video[0].muted === true) {
            $($event.target).removeClass('icon-volume-off').addClass('icon-volume-2');
            video[0].muted = false;
          } else {
            $($event.target).removeClass('icon-volume-2').addClass('icon-volume-off');
            video[0].muted = true;
          }

        }
        Waypoint.destroyAll();
        var channels = document.getElementsByClassName('channels-item');

        function handler(direction) {

          $('video').each(function() {
            $(this).get(0).pause();
          });
          var that = $(this.element),
            v = that.find('video'),
            loading = that.find('.scroll-video-loading-box');
          loading.removeClass('show');
          that.parent().find('.channels-item').removeClass('video-play-status');
          v[0].removeEventListener('canplay');
          that.addClass('video-play-status');
          if (v[0].readyState !== 4){
            loading.addClass('show');
          }
          $debounce(500, playVideo,true); //停留500毫秒之后才加载video
          function playVideo() {
            if (!v.attr('src')) {
              v.attr('src', v.data('src'));
            }
            loading.removeClass('show');
            if (v[0].readyState === 0) {
              loading.addClass('show');
              v[0].addEventListener('canplay', function() {
                console.log("加载完成");
                loading.removeClass('show');
              });
            }
            v[0].play();
          }
        }
        if (channels.length > 1) {

          Array.prototype.forEach.call(channels, function(element) {
            new Waypoint({
              element: element,
              handler: handler,
              group: 'item',
              offset: 120
            });
          });
        } else {
          new Waypoint({
            element: channels[0],
            handler: handler,
            offset: 120
          });
        }
      }

      return {
        restrict: "A",
        link: link,
        // transclude:true,
        template: '<div class="scroll-video-player-box">' +
          '<div class="scroll-video-player">' +
          '<div class="scroll-video-loading-box"><div class="loading"></div></div>' +
          '<div class="volume-box"><a href="javascript:void(0);" ng-click="voiceSwitch($event)"><i class="icon-volume-off"></i></a></div>' +
          '<div class="video-box">' +
          '<video webkit-playsinline="webkit-playsinline" loop="true" preload="auto" muted="true" data-src="{{text}}"></video>' +
          '</div>' +
          '</div>' +
          '</div>',
        scope: {
          text: '@venvyPlayerUrl'
        }
      }
    });

}());
