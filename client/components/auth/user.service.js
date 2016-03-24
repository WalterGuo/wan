(function(){
  'use strict';

  angular.module('venvyApp')
    .factory('User', function ($resource) {
      return $resource('/user/:controller', {
        },
        {
          get: {
            method: 'GET',
            params: {
              controller:'getCurrentUser'
            }
          },
          getUserById:{
            method:'GET',
            params:{
              controller:'findOne'
            }
          }


        });
    });
}).call(this);