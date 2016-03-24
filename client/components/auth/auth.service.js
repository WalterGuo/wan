(function(){
  'use strict';

  angular.module('venvyApp')
    .factory('Auth', function Auth($location, $rootScope, $http, User, $q) {
      var currentUser = {};
      currentUser = User.get();
      return {
        getCurrentUser: function() {
          return currentUser;
        },

        logout: function(callback) {
          var cb = callback || angular.noop;
          var deferred = $q.defer();
          $http.get('/user/signout').success(function(data) {
            deferred.resolve(data);
            currentUser = User.get();
            return cb();
          }).
            error(function(err) {
              deferred.reject(err);
              return cb(err);
            }.bind(this));
          return deferred.promise;
        },
        login: function(user, callback) {
          var cb = callback || angular.noop;
          var deferred = $q.defer();

          $http.post('/sign', {
            foo: user.mail,
            pwd: user.pwd
          }).
            success(function(data) {
              currentUser = User.get();
              deferred.resolve(data);
              return cb();
            }).
            error(function(err) {
              deferred.reject(err);
              return cb(err);
            }.bind(this));

          return deferred.promise;
        },
        getUserById:function(uid,callback){
          var cb = callback || angular.noop;

          return User.getUserById({ user_id: uid }, {

          }, function (user) {
            return cb(user);
          }, function (err) {
            return cb(err);
          }).$promise;
        }

      }
    })
}).call(this);

