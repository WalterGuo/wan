(function(){

  'use strict';

  angular.module('venvyApp')
    .factory('Channel', function ($resource) {
      return $resource('/series/:controller', {
        },
        {
          querySeriesByChannelId: {
            method: 'GET',
            params: {
              channelId:'@channelId'
            }
          },
          querySeriesById:{
            method:"GET",
            params:{
              seriesId:'@seriesId'
            }
          }


        });
    });

}).call(this);