(function () {
  'use strict'
  angular.module('util.help', ['util.help.throttle','util.help.UA']);
  angular.module('util.help.throttle', [])
    .factory('$throttle', function ($timeout, $log) {
      var throttle = function (delay, action, tail, debounce) {
        var now = Date.now,
          last_call = 0,
          last_exec = 0,
          timer = null,
          curr, diff,
          ctx, args, exec = function () {
            last_exec = now();
            action.apply(ctx, args);
          };

        ctx = this, args = arguments,
          curr = now(), diff = curr - (debounce ? last_call : last_exec) - delay;

        clearTimeout(timer);

        if (debounce) {
          if (tail) {
            timer = $timeout(exec, delay);
          } else if (diff >= 0) {
            exec();
          }
        } else {
          if (diff >= 0) {
            exec();
          } else if (tail) {
            timer = $timeout(exec, -diff);
          }
        }

        last_call = curr;
      };
      return throttle;
    }).factory('$debounce', function ($timeout, $throttle) {
      var debounce = function (idle, action, tail) {
        return $throttle(idle, action, tail, true);
      }
      return debounce;
    });
  angular.module('util.help.UA', [])
    .factory('$ua', function ($timeout, $log) {
      var ua = navigator.userAgent.toLowerCase();
      var uaObj = {};

      // Software
      uaObj.inWechat = !!ua.match(/micromessenger/);

      // OS
      uaObj.inIos = !!ua.match(/(iphone|ipod|ipad)/);
      uaObj.inAndroid = !!ua.match(/(android)/);
      uaObj.inWp = !!ua.match(/(windows phone)/);
      uaObj.inSymbian = !!ua.match(/(symbianos)/);
      uaObj.inMac = navigator.platform.indexOf('Mac') === 0;
      uaObj.inWindows = navigator.platform.indexOf('Win') === 0;

      // Device
      uaObj.inIphone = !!ua.match(/(iphone)/);
      uaObj.inIpad = !!ua.match(/(ipad)/);

      // Device Attr
      uaObj.inMobile = (uaObj.inIos || uaObj.inAndroid || uaObj.inWp || uaObj.inSymbian);
      uaObj.inPC = !(uaObj.inIos || uaObj.inAndroid || uaObj.inWp || uaObj.inSymbian);
      uaObj.isRetina = typeof window.campaignPlugin !== 'undefined' && window.devicePixelRatio > 1;

      // Backward Compatibility
      uaObj.inWindow = uaObj.inWindows;
      uaObj.isSupportedCSS3 = function(style){
        var prefix = ['webkit', 'Moz', 'ms', 'o'],
          i,
          humpString = [],
          htmlStyle = document.documentElement.style,
          _toHumb = function (string) {
            return string.replace(/-(\w)/g, function ($0, $1) {
              return $1.toUpperCase();
            });
          };

        for (i in prefix)
          humpString.push(_toHumb(prefix[i] + '-' + style));

        humpString.push(_toHumb(style));

        for (i in humpString)
          if (humpString[i] in htmlStyle) return true;

        return false;
      }
      return uaObj;
    });
}).call(this);
