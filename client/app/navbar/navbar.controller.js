(function(){
  'use strict';

  angular.module('venvyApp')
    .controller('NavbarCtrl', function ($scope, $location,Auth,$modal) {
      $scope.user = Auth.getCurrentUser;

      $scope.a_login =function(){
        $modal.show({
          windowClass:'login-modal',
          templateUrl:'app/modal/loginModal.html',
          controller:'NavbarCtrl',
          resolve:{

          }
        });
      }
      $scope.vlogin = function(form){
        $scope.submitted = true;
        if(!$scope.user.mail){
          $scope.message = '邮箱或者手机号不能为空！';
          return;
        }
        if(!validator.isEmail($scope.user.mail)&&!validator.isMobilePhone($scope.user.mail,'zh-CN')){
          $scope.message = '请输入正确的邮箱或者手机号！';
          return;
        }
        if(!$scope.user.pwd){
          $scope.message = '密码不能为空！';
          return;
        }
        if(!validator.isLength($scope.user.pwd,6,30)){
          $scope.message = '密码长度为6-30位';
          return;
        }
        Auth.login({
          mail: $scope.user.mail,
          pwd: $scope.user.pwd
        }).then(function(data){
          console.log(data);
          if(data.status===0){
            $scope.message = '';
            $modal.close();
          }else {
            $scope.message = data.msg;
          }

        })

      }
      $('[data-toggle="dropdown"]').unbind('click').on('click',function(){
        var menu = $(this).parent().find('.dropdown-menu');
        if(menu.hasClass('show')){
          menu.removeClass('show').addClass('hide');
          $(document).off('click',dclick);
        }else{
          menu.removeClass('hide').addClass('show');
          $(document).on('click',dclick);
        }
      });

      function dclick(event){
        var menu = $('.dropdown-menu'),target = event.target,$toggle=$('[data-toggle="dropdown"]');
        if(menu.find(target).length<=0&&$toggle.find(target).length<=0){
          menu.removeClass('show').addClass('hide');
          $(document).unbind('click',dclick);
        }
      }
      $scope.loginout = function(){
        Auth.logout().then(function(){
          $scope.user = Auth.getCurrentUser;
        }) .catch( function(err) {
          $scope.errors.other = err.message;
        });
      }
    });
}).call(this);

