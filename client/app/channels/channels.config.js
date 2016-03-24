(function(){
  'use strict'

  angular.module('venvyApp')
    .config(function ($stateProvider) {
      $stateProvider
        .state('channels',{
          url:'/channels/:channels/:channelsId',
          templateUrl:'app/channels/channels.html',
          controller: 'ChannelsCtrl'
        });
    });
}).call(this);

