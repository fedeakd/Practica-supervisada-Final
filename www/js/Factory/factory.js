angular.module('app.factory', ['firebase']).
  factory('Informacion', function ($stateParams, $state, $ionicPopup, $timeout, Servicio) {
    Informacion = {};
    Informacion.usuario = {};
    Informacion.estilo = {};
    Informacion.usuario.nombre = "joselito";
    Informacion.TraerUsuarioActual = TraerUsuarioActual;
    Informacion.TraerDesafios = TraerDesafios;
    Informacion.TraerBatallaNaval = TraerBatallaNaval;
    Informacion.DameFecha = DameFecha;
    Informacion.AlertaMensaje = AlertaMensaje;
    Informacion.ValidarReto = ValidarReto;
    Informacion.ComprobarFechaEsMayorQueLaDeHoy = ComprobarFechaEsMayorQueLaDeHoy;
    Informacion.GenerarTablero = GenerarTablero;
    Informacion.EventoCambioBatallaNaval = EventoCambioBatallaNaval;
    return Informacion;

    function TraerDesafios(darDesafios) {
      var firebaseDesafios = Servicio.RefDesafios();
      var fechaActual = new Date();
      num = 0;
      firebaseDesafios.on('child_added', function (snapshot) {
        $timeout(function () {
          var desafio = snapshot.val();
          desafio.mostrar = false;
          desafio.num = num;
          desafio.key = snapshot.key;

          var parts = desafio.finaliza.split('-');
          var fechaReto = new Date(parts[0], parts[1] - 1, parts[2]);
          if ((desafio.estado == 'activo') && ((fechaActual.getTime() > fechaReto.getTime()) ||
            (desafio.jugadores != null && desafio.jugadoresLimite <= desafio.jugadores.length))) {
            firebaseDesafios.child(desafio.key).update({ "estado": "espera" });
            desafio.estado = 'espera';
          }


          darDesafios(desafio);
          num++;
        })
      })
    }
    //Batalla Naval
    function TraerBatallaNaval(darBatallaNaval) {
      var firebaseBN = Servicio.RefBatallaNaval();
      var fechaActual = new Date();
      firebaseBN.on('child_added', function (snapshot) {
        $timeout(function () {
          var bn = snapshot.val();
          bn.key = snapshot.key;
          if (bn.estado == "activo") {
            bn.habilitado = bn.tablero[(bn.turno % 2 == 0 ? 1 : 0)].usuario.mail == Informacion.usuario.mail ? true : false;
          }
          if (bn.estado == "inicio") {
            bn.habilitado = (Informacion.usuario.mail != bn.tablero[0].usuario.mail);
          }

          darBatallaNaval(bn);
        })
      })
    }

    function EventoCambioBatallaNaval(DetectarCambio) {
      var firebaseBN = Servicio.RefBatallaNaval();
      firebaseBN.on("child_changed", function (snapshot) {
        var bn = snapshot.val();
         bn.key = snapshot.key;
        if (bn.estado == "activo") {
          bn.habilitado = bn.tablero[(bn.turno % 2 == 0 ? 1 : 0)].usuario.mail == Informacion.usuario.mail ? true : false;
        }
        DetectarCambio(bn);
      });

    }
    //Fin Batalla Naval
    function TraerUsuarioActual(darUsuario) {
      var firabaseJugadores = Servicio.RefJugadores();
      firebase.auth().onAuthStateChanged(function (user) {//si esta logeado
        if (user) {
          firabaseJugadores.on('child_added', function (snapshot) {//Compruebo el usuario  que se logeo y traigo el dato
            $timeout(function () {
              var message = snapshot.val();
              if (message.id === user.uid) {
                Informacion.usuario = message;
                Informacion.usuario.key = snapshot.key;
                darUsuario(message);
                return;
              }
            });
          });
        } else {

        }
      });
    }


    //Complemento
    function DameFecha(fecha) {
      if (typeof fecha) {
        console.log(fecha.getDate());
        //return fecha;
      };
      var dia = fecha.getDate() < 10 ? "0" + fecha.getDate() : fecha.getDate();
      var mes = fecha.getMonth() + 1 < 10 ? "0" + (fecha.getMonth() + 1) : fecha.getMonth() + 1;
      return fecha.getFullYear() + "-" + mes + "-" + dia;
    }


    function AlertaMensaje(titulo, cuerpo) {
      $ionicPopup.alert({
        title: titulo,
        template: cuerpo
      });
    }
    function ComprobarFechaEsMayorQueLaDeHoy(fecha) {
      fecha.setHours(0, 0, 0, 0);
      var fechaActual = new Date();
      fechaActual.setHours(0, 0, 0, 0);
      if (fecha <= fechaActual) {
        return false;
      }

      return true;
    }
    function ValidarReto(usuario, reto) {
      console.log(usuario);
      console.log(reto);
      if (usuario.puntos < reto.cantidadPuesta) {
        Informacion.AlertaMensaje("Algo salio mail!!", "No tiene suficiente ficha lo siento");
        return false;
      }

      if (usuario.mail == reto.desafiante.mail) {
        Informacion.AlertaMensaje("Algo salio mail!!", "No te puedes unir a tus propios reto");
        return false;
      }
      if (reto.jugadores == null) {
        reto.jugadores = [];
      }
      else {
        console.log(reto.jugadores);
        for (var i = 0; i < reto.jugadores.length; i++) {
          if (reto.jugadores[i].mail == usuario.mail) {
            Informacion.AlertaMensaje("Algo salio mail!!", "Lo siento, ya te encuentras en este reto");
            return false;
          }
        }

      }
      return true;

    }
    //BatallaNaval
    function GenerarTablero() {
      matriz = [[0, 0], [0, 0]];
      for (var i = 0; i < matriz.length; i++) {
        for (var q = 0; q < matriz[i].length; q++) {
          matriz[i][q] = {};
          matriz[i][q].evento = "miEvento" + ((i * 2) + q);
          matriz[i][q].barco = false;
          matriz[i][q].rival = false;
          matriz[i][q].descubierto = false;
        }
      }
      return matriz;
    }
  });