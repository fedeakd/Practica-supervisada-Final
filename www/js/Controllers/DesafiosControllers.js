
/**
 * ******Estados del Desafio ************
 * -Activo                              *
 * -En espera (Tiempo cumplido, llena)  *
 * -Supendida                           *
 * -Terminada                           *
 */

angular.module('app.DesafiosControllers', ['firebase'])
    .controller('desafioAltaController',
    function ($scope, $stateParams, $state, $ionicPopup, Servicio, Informacion) {
        var firebaseUsuarios = Servicio.RefJugadores();
        firebaseDesafios = Servicio.RefDesafios();
        $scope.usuario = Informacion.usuario;
        $scope.show = true;
        var desafio = {};
        desafio.aCargo = "";
        desafio.categoria = "";
        desafio.desafiante = "";
        desafio.jugadores = [];
        desafio.resultado = {};
        desafio.estado = "activo";

        $scope.desafio = {};
        $scope.desafio.descripcion = "Corre mil vueltas";
        $scope.desafio.fecha = new Date("2017-10-10");
        $scope.desafio.cantidadPuesta = 5;
        $scope.desafio.jugadoresLimite = 5;



        $scope.options = [
            { name: 'Deporte', value: "Deporte" },
            { name: "Azar", value: 'Azar' },
            { name: "Juego", value: 'Juego' },
            { name: "Tiempo", value: 'Tiempo' },
            { name: "Inteligencia", value: 'Inteligencia' },
            { name: "Riesgo", value: 'Riesgo' },
            { name: "Otros", value: 'Otros' }
        ];



        $scope.Aceptar = function () {
            if ($scope.desafio.cantidadPuesta < 5) {
                Informacion.AlertaMensaje("Algo salio mal", "La apuesta minimo es 5 ");
            }

            if (!Informacion.ComprobarFechaEsMayorQueLaDeHoy($scope.desafio.fecha)) {
                Informacion.AlertaMensaje("Algo salio mal", "La fecha debe ser mayor que la fecha de hoy");
                return;
            }


            desafio.descripcion = $scope.desafio.descripcion;
            desafio.cantidadPuesta = Number($scope.desafio.cantidadPuesta);
            desafio.jugadoresLimite = Number($scope.desafio.jugadoresLimite);


            desafio.categoria = $scope.desafio.categoria.name;
            desafio.desafiante = Informacion.usuario;
            desafio.finaliza = Informacion.DameFecha($scope.desafio.fecha);
            console.log(desafio);

            firebaseDesafios.push(desafio);

            Informacion.usuario.puntos -= desafio.cantidadPuesta;
            firebaseUsuarios.child(Informacion.usuario.key).update({ "puntos": Informacion.usuario.puntos });


            $state.go("desafio.lista");

        }

    })
    .controller('desafioListaController',
    function ($scope, $stateParams, $state, $ionicPopup, Servicio, Informacion) {
        //borrable
        $scope.usuario = {};
        if (Informacion.usuario.mail == null) {
            Informacion.TraerUsuarioActual(function (usuario) {

                $scope.usuario = usuario;
            });
        }
        //fin



        $scope.desafio = {};
        $scope.options = [
            { name: 'Activo', value: "activo" },
            { name: "Espera", value: 'espera' },
            { name: "Mis partidas", value: 'Mis partidas' },
            { name: "Terminada", value: 'terminada' },
            { name: "Inteligencia", value: 'Inteligencia' },
            { name: "Riesgo", value: 'Riesgo' },
            { name: "Otros", value: 'Otros' }
        ];



        var firebaseUsuarios = Servicio.RefJugadores();
        var firebaseDesafios = Servicio.RefDesafios();


        $scope.arrayDesafios = [];
        Informacion.TraerDesafios(function (desafio) {
            $scope.arrayDesafios.push(desafio);
        });

        $scope.ValidarDesafio = function (item) {
            $scope.desafioAdministrador = {};
            $scope.desafioAdministrador.jugadores = item.jugadores;
            $scope.desafioAdministrador.cantidadPuesta = item.cantidadPuesta;
            $scope.desafioAdministrador.key = item.key;
            $scope.alertPopup = $ionicPopup.alert({
                scope: $scope,
                title: 'Seleccione un jugador',
                template: "<div ng-repeat='jugador in desafioAdministrador.jugadores'> <button ng-click='SeleccinarJugador(jugador)' class='button button-dark button-clear'>"
                + " {{jugador.mail}}  </button> </div>"
            })
            console.log(item);
        }
        $scope.SeleccinarJugador = function (jugador) {
            var datos = $scope.desafioAdministrador;
            firebaseUsuarios.child(jugador.key).once('value').then(function (snapshot) {
                var resultado = (datos.jugadores.length * datos.cantidadPuesta) + snapshot.val().puntos;
                firebaseUsuarios.child(jugador.key).update({ "puntos": resultado });
                firebaseDesafios.child(datos.key).update({
                    "estado": "terminada",
                    "aCargo": Informacion.usuario.mail,
                    "gano": jugador.mail,
                });

                $scope.arrayDesafios = [];
                Informacion.TraerDesafios(function (desafio) {
                    $scope.arrayDesafios.push(desafio);
                });

                $scope.alertPopup.close();
            });


        }

        $scope.MostrarContenedor = function (index) {
            $scope.arrayDesafios[index].mostrar = !$scope.arrayDesafios[index].mostrar;
        }
        $scope.Aceptar = function (desafio) {

            var usuario = Informacion.usuario;


            //Valido  para que este todo correcto
            if (!Informacion.ValidarReto(usuario, desafio)) {
                return;
            }
            //Agrego al jugador al desafio y luego lo actualizo  en firebase
            desafio.jugadores.push(usuario);
            firebaseDesafios.child(desafio.key).update({ "jugadores": desafio.jugadores });

            //Le descuento los puntos al jugador y luego lo actualiazo en firebase
            usuario.puntos -= desafio.cantidadPuesta;
            firebaseUsuarios.child(usuario.key).update({ "puntos": usuario.puntos });

            //Mensaje  de logro
            Informacion.AlertaMensaje("Logrado!!", "Te has unido a este desafio!!");
        }

        $scope.MostrarJugadores = function (item) {
            var mostrar = ""
            item.jugadores.forEach(function (jugador) {
                mostrar += "<li style='text-align: center;'>" + jugador.mail + "</li>";
            });

            var alertPopup = $ionicPopup.alert({
                scope: $scope,
                title: 'Jugadores!',
                template: "<ul>" + mostrar + "</ul>"
            });
        }
    })

    .filter('filtroReto', function (Informacion) {
        return function (items, query) {
            var filtered = [];
            var letterMatch = new RegExp(query, 'i');
            for (var i = 0; i < items.length; i++) {
                var item = items[i];
                switch (query) {
                    case 'activo':
                        if (item.estado != null && (query == item.estado)) {
                            filtered.push(item);
                        }
                        break;
                    case 'Mis partidas':
                        if (item.desafiante.mail == Informacion.usuario.mail) {
                            filtered.push(item);
                        }
                    case 'espera':
                        if (item.estado == query) {
                            filtered.push(item);
                        }
                        break;
                    case 'terminada':
                        if (item.estado == query) {
                            filtered.push(item);
                        }
                        break;
                    default:
                        break;
                }

            }
            return filtered;
        };
    });
