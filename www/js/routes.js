angular.module('app.routes', [])

  .config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('usuario', {
        url: '/usuario',
        templateUrl: 'templates/Usuario/usuarioTabs.html',
        abstract: true
      })
      .state('usuario.informacionDelUsuario', {
        url: '/usuarioInfo',
        cache: false,
        views: {
          'informacionDelUsuario': {
            templateUrl: 'templates/Usuario/informacionDelUsuario.html',
            controller: 'infoDelUsuarioController'
          }
        }
      })
      .state('usuario.misPartidas', {
        url: '/misPartidas',
        views: {
          'misPartidas': {
            cache: false,
            templateUrl: 'templates/Usuario/misPartidas.html',
            controller: 'misPartidasController'
          }
        }
      })


      .state('desafio', {
        url: '/desafio',
        cache: false,
        templateUrl: 'templates/Desafio/desafiosTabs.html',
        abstract: true
      })
      .state('desafio.alta', {
        url: '/alta',
        cache: false,
        views: {
          'alta': {
            templateUrl: 'templates/Desafio/desafioAlta.html',
            controller: 'desafioAltaController'
          }
        }
      })
      .state('desafio.lista', {
        url: '/lista',
        cache: false,
        views: {
          'lista': {
            templateUrl: 'templates/Desafio/desafioLista.html',
            controller: 'desafioListaController'
          }
        }
      })


      .state('batallaNaval', {
        url: '/batallaNaval',
        cache: false,
        templateUrl: 'templates/BatallaNaval/batallaNavalTabs.html',
        abstract: true
      })
      .state('batallaNaval.alta', {
        url: '/alta',
        cache: false,
        views: {
          'alta': {
            templateUrl: 'templates/BatallaNaval/batallaNavalAlta.html',
            controller: 'batallaNavalAltaController'
          }
        }
      })
      .state('batallaNaval.lista', {
        url: '/lista',
        cache: false,
        views: {
          'lista': {
            templateUrl: 'templates/BatallaNaval/batallaNavalLista.html',
            controller: 'batallaNavalListaController'
          }
        }
      })



      .state('login', {
        url: '/Login',
        templateUrl: 'templates/login.html',
        controller: 'loginController'
      })
      .state('registrar', {
        url: '/registrar',
        templateUrl: 'templates/registrar.html',
        controller: 'RegistrarController'
      })

    $urlRouterProvider.otherwise('/Login')


  });