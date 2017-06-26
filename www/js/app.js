
angular.module('app', [
  'firebase',
  'ionic',
  'angular-flippy',
  'app.controllers',
  'app.InformacionUsuarioControllers',
  'app.UsuarioYRegistrarControllers',
  'app.DesafiosControllers',
  'app.BatallaNavalControllers',
  'app.factory',
  'app.routes',
  'app.directives',
  'app.services'])



  .run(function ($ionicPlatform) {
    $ionicPlatform.ready(function () {

      if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        cordova.plugins.Keyboard.disableScroll(true);
      }
      if (window.StatusBar) {
        StatusBar.styleDefault();
      }
    });
  })

