(function(){

  'use strict';

  angular.module('venvyApp')
    .factory('Video', function($location, $rootScope, $http, $q, Channel) {
      return {
        getVideoViewsById:function(vid,callback){
          var cb = callback || angular.noop;
          var deferred = $q.defer();

          $http.get('http://wantv.me/busTrack/count',{
            params:{
              hostname:'wantv.me',
              video:vid
            }
          })
            .success(function(data) {
              deferred.resolve(data.msg);
              return cb();
            }).
            error(function(err) {
              this.logout();
              deferred.reject(err);
              return cb(err);
            }.bind(this));

          return deferred.promise
        },
        getVideoById:function(vid,callback){
          var cb = callback || angular.noop;
          var deferred = $q.defer();

          $http.get('video/getVideoById', {
              params:{
                v_id:vid
              }
            }
          ).
            success(function(data) {
              deferred.resolve(data.msg);
              return cb();
            }).
            error(function(err) {
              this.logout();
              deferred.reject(err);
              return cb(err);
            }.bind(this));

          return deferred.promise;
        },
        queryAllChannels: function (channelId, callback) {
          var cb = callback || angular.noop;
          return Channel.querySeriesByChannelId({controller: 'querySeriesByChannelId'}, {
            channelId: channelId
          }, function (channel) {
            return cb(channel);
          }, function (err) {
            return cb(err);
          }).$promise;
        },
        querySeriesById:function(seriesId,callback){
          var cb = callback || angular.noop;
          return Channel.querySeriesById({controller: 'querySeries'}, {
            seriesId: seriesId
          }, function (seriess) {
            return cb(seriess);
          }, function (err) {
            return cb(err);
          }).$promise;
        },
        queryVideoBySeriesId:function(seriesId,pn,ps,callback){
          var cb = callback || angular.noop;
          var deferred = $q.defer();

          $http.get('/video/getVideosBySeries', {
              params:{
                seriesId:seriesId,
                ps:ps,
                pn:pn
              }
            }
          ).
            success(function(data) {
              deferred.resolve(data);
              return cb();
            }).
            error(function(err) {
              deferred.reject(err);
              return cb(err);
            }.bind(this));

          return deferred.promise;
        },
        superSearch:function(params,callback){
          var cb = callback || angular.noop;
          var deferred = $q.defer();

          $http.get('/superSearch', {
              params:params
            }
          ).
            success(function(data) {
              deferred.resolve(data);
              return cb();
            }).
            error(function(err) {
              deferred.reject(err);
              return cb(err);
            }.bind(this));

          return deferred.promise;
        }
      }
    })

}).call(this);