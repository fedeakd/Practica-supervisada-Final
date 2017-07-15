
angular.module('app.BatallaNavalControllers', ['firebase'])
    .controller('batallaNavalAltaController',
    function ($scope, $stateParams, $state, $ionicPopup, Servicio, Informacion, $rootScope) {

        Informacion.TraerUsuarioActual(function (usuario) {

            $scope.usuario = usuario;
            Informacion.usuario = usuario;
        });

        $scope.bn = {};
        bn = {};
        bn.fecha = "";
        bn.apuesta = "";
        bn.ganador = "";
        bn.tablero = [];
        bn.estado = "inicio";

        tablero = {};
        tablero.usuario = Informacion.usuario;

        $scope.bn.fecha = new Date("2017-08-10");
        $scope.bn.cantidadPuesta = 0;
        var firebaseBN = Servicio.RefBatallaNaval();
        var firebaseUsuarios = Servicio.RefJugadores();

        ultimoItem = null;
        $scope.show = true;
        $scope.matriz = Informacion.GenerarTablero();



        $scope.Aceptar = function () {
            if ($scope.bn.cantidadPuesta < 5) {
                Informacion.AlertaMensaje("Algo salio mal", "La apuesta minimo es 5 ");
                return;
            }
            if (ultimoItem == null) {
                Informacion.AlertaMensaje("Algo salio mal", "Una carta debe ser seleccionada");
                return;
            }
            if (!Informacion.ComprobarFechaEsMayorQueLaDeHoy($scope.bn.fecha)) {
                Informacion.AlertaMensaje("Algo salio mal", "La fecha debe ser mayor que la fecha de hoy");
                return;
            }
            bn.fecha = Informacion.DameFecha($scope.bn.fecha);
            bn.apuesta = Number($scope.bn.cantidadPuesta);
            bn.turno = -1;

            tablero.cartas = $scope.matriz;
            tablero.usuario = Informacion.usuario;
            bn.tablero.push(tablero);
            Informacion.usuario.puntos -= bn.apuesta;
            firebaseUsuarios.child($scope.usuario.key).update({ "puntos": $scope.usuario.puntos });
            firebaseBN.push(bn);

            $state.go("batallaNaval.lista");


        }
        $scope.CambiarCarta = function (item) {
            if (ultimoItem != null) {
                $rootScope.$broadcast(ultimoItem.evento + 'Out');
                ultimoItem.barco = false;
            }
            ultimoItem = item;
            ultimoItem.barco = true;
        }

    }).controller('batallaNavalListaController',
    function ($scope, $stateParams, $state, $ionicPopup, Servicio, Informacion, $rootScope, $timeout, $cordovaVibration) {

        Informacion.TraerUsuarioActual(function (usuario) {

            $scope.usuario = usuario;
            Informacion.usuario = usuario;
        });

        var firebaseBN = Servicio.RefBatallaNaval();
        var firebaseUsuarios = Servicio.RefJugadores();
        $scope.arrayBN = [];
        Informacion.TraerBatallaNaval(function (bn) {
            bn.usuario = bn.tablero[0].usuario.mail;
            $scope.arrayBN.push(bn);

            // console.log(bn);

        })
        Informacion.EventoCambioBatallaNaval(function (bn) {
            bn.usuario = bn.tablero[0].usuario.mail;
            for (var i = 0; i < $scope.arrayBN.length; i++) {
                if ($scope.arrayBN[i].key == bn.key) {
                    $scope.arrayBN[i] = bn;
                    break;
                }
            }
        });


        $scope.Informacion= function(item){
            var formato = "Estado: "+ item.estado +"\n" +
            "Creador: "+ item.usuario + "\n" ;
            if(item.estado== "activo"){
                formato+="Desafiante: "+ item.tablero[1].usuario.mail+"\n" ;
            }
            else{
                formato+="Desafiante: "+ "esperando..."+"\n" ;
            }
            formato += "Turno: " + (item.turno==-1 ? "-" : item.turno)+"\n";
            formato += "Apuesta: "+ item.apuesta;
            alert(formato);
           //Informacion.AlertaMensaje("Informacion de la partida", "hola \n chau ");
        }
        $scope.MostrarBatallaN = function (item) {
            $scope.mostrarCarta = true;

            $scope.batallaNaval = item;
            console.log(Informacion.usuario.puntos + "-" + item.apuesta);
            if ((item.estado == "inicio") && (Informacion.usuario.puntos < item.apuesta)) {
                Informacion.AlertaMensaje("Algo salio mal", "No tienes fichas suficientes ");
                return;
            }

            if (item.estado == "inicio" && (item.usuario != Informacion.usuario.maill)) {
                $scope.titulo = "Seleccione donde quiere que este tu barco";
                $scope.matrizInicio = Informacion.GenerarTablero();
            }
            else if (item.estado == "activo") {
                $scope.titulo = "Descubre el barco de tu enemigo!!  ";
                $scope.matrizActivo = item.tablero[item.turno % 2].cartas;

            }

            $scope.tituloColor = "blue";
            $scope.miPoppup = $ionicPopup.show({
                scope: $scope,
                title: "BATALLA NAVAL",
                template: "<style>.popup {width: 1000px !important; height:400px;} </style>",
                templateUrl: 'templates/BatallaNaval/PopupBatallaNaval.html'
            });

        }


        /***********  Parte popup ***********************/
        ultimoItem = null;
        /*Parte 1*/
        $scope.CambiarCarta = function (item) {
            if (ultimoItem != null) {
                $rootScope.$broadcast(ultimoItem.evento + 'Out');
                ultimoItem.barco = false;
            }
            ultimoItem = item;
            ultimoItem.barco = true;
        }
        $scope.AceptarBN = function () {
            switch ($scope.batallaNaval.estado) {
                case "inicio":
                    if (ultimoItem != null) {
                        tablero = {}
                        tablero.cartas = $scope.matrizInicio;
                        tablero.usuario = Informacion.usuario;
                        $scope.titulo = "Descubre el barco de tu enemigo!!  ";
                        $scope.batallaNaval.tablero.push(tablero);
                        $scope.batallaNaval.estado = "activo";
                        $scope.batallaNaval.turno = 0;
                        firebaseBN.child($scope.batallaNaval.key).update({ "tablero": $scope.batallaNaval.tablero });
                        firebaseBN.child($scope.batallaNaval.key).update({ "turno": 0 });
                        firebaseBN.child($scope.batallaNaval.key).update({ "estado": "activo" });
                        $scope.matrizActivo = $scope.batallaNaval.tablero[0].cartas;

                        Informacion.usuario.puntos -= $scope.batallaNaval.apuesta;
                        firebaseUsuarios.child(Informacion.usuario.key).update({ "puntos": Informacion.usuario.puntos });

                    }
                    else {
                        $scope.titulo = "Debes seleccionar una carta";
                        $scope.color = "red";
                    }
                    break;
                case "activo":
                    $scope.miPoppup.close();
                    $scope.arrayBN = [];
                    Informacion.TraerBatallaNaval(function (bn) {
                        bn.usuario = bn.tablero[0].usuario.mail;
                        $scope.arrayBN.push(bn);
                    })
                    break;
            }

        }
        /*Parte 2 */
        $scope.ComprobarCarta = function (celda) {
            var turno = $scope.batallaNaval.turno;
            if ($scope.mostrarCarta) {

                $rootScope.$broadcast(celda.evento + 'In');
                if (celda.barco) {
                    $scope.tituloColor = "green";
                    $scope.titulo = "HAS ENCONTRADO EL BARCO!";
                    $scope.batallaNaval.tablero[turno % 2 == 0 ? 1 : 0].encontro = true;
                    if (turno % 2 == 1) {
                        if (!$scope.batallaNaval.tablero[1].encontro) {
                            $scope.titulo = "HAS GANADO  LA PARTIDA";
                            firebaseBN.child($scope.batallaNaval.key).update({ "ganador": $scope.batallaNaval.tablero[0].usuario });
                            firebaseBN.child($scope.batallaNaval.key).update({ "estado": "finalizo" });
                            AsignarPartida($scope.batallaNaval.tablero[0].usuario.key, "ganada", $scope.batallaNaval.apuesta);
                            AsignarPartida($scope.batallaNaval.tablero[1].usuario.key, "perdida", -1);
                            try {
                                navigator.vibrate([1000, 500, 1000, 500, 1000]);
                            }
                            catch (error) {

                            }
                        }
                        else {
                            $scope.tituloColor = "ORANGE";
                            $scope.titulo = "HAS EMPATADO  LA PARTIDA";
                            firebaseBN.child($scope.batallaNaval.key).update({ "ganador": "empatada" });
                            firebaseBN.child($scope.batallaNaval.key).update({ "estado": "finalizo" });
                            console.log("entro");
                            AsignarPartida($scope.batallaNaval.tablero[0].usuario.key, "empatada", -1);
                            AsignarPartida($scope.batallaNaval.tablero[1].usuario.key, "empatada", -1);

                            try {
                                navigator.vibrate([2000]);
                            }
                            catch (error) {

                            }
                        }
                    }
                }
                else {
                    $scope.tituloColor = "red";
                    $scope.titulo = "NO HAS ACERTADO";
                    if (turno % 2 == 1) {
                        if ($scope.batallaNaval.tablero[1].encontro) {
                            $scope.titulo = "HAS PERDIDOS  LA PARTIDA";
                            firebaseBN.child($scope.batallaNaval.key).update({ "ganador": $scope.batallaNaval.tablero[1].usuario });
                            firebaseBN.child($scope.batallaNaval.key).update({ "estado": "finalizo" });
                            AsignarPartida($scope.batallaNaval.tablero[1].usuario.key, "ganada", $scope.batallaNaval.apuesta);
                            AsignarPartida($scope.batallaNaval.tablero[0].usuario.key, "perdida", -1);
                            try {
                                navigator.vibrate([1000, 500]);
                            }
                            catch (error) {

                            }
                        }
                    }
                }
                $timeout(function () {
                    celda.descubierto = true;
                    firebaseBN.child($scope.batallaNaval.key).update({ "tablero": $scope.batallaNaval.tablero });
                }, 500)

                $scope.batallaNaval.hablitado = false;
                firebaseBN.child($scope.batallaNaval.key).update({ "turno": (++$scope.batallaNaval.turno) });
                $scope.mostrarCarta = false;
            }
        }

        function AsignarPartida(key, opc, apuesta) {
            firebaseUsuarios.child(key).once('value').then(function (snapshot) {
                var p = snapshot.val();
                var resultado = -1;
                switch (opc) {
                    case "ganada":
                        p.partidas.BatallaNaval.ganada++;
                        resultado = (2 * apuesta) + p.puntos;
                        break;
                    case "empatada":
                        p.partidas.BatallaNaval.empatada++;
                        break;
                    case "perdida":
                        p.partidas.BatallaNaval.perdida++;
                        break;
                }
                if (resultado != -1) {
                    firebaseUsuarios.child(key).update({
                        "partidas": p.partidas,
                        "puntos": resultado
                    });
                }
                else {
                    firebaseUsuarios.child(key).update({
                        "partidas": p.partidas
                    });
                }

            });
        }


    })