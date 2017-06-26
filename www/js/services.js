angular.module('app.services', [])
    .service('Servicio', ['$http', function ($http) {
        this.RefJugadores = RefJugadores;
        this.RefDesafios = RefDesafios;
        this.RefBatallaNaval= RefBatallaNaval;
        function ObtenerRef(coleccion) {
            return firebase.database().ref(coleccion);

        }

        function RefJugadores() {
            return ObtenerRef('Jugadores/');
        }
        function RefDesafios() {
            return ObtenerRef('Desafios/');
        }   
        function RefBatallaNaval() {
            return ObtenerRef('BatallaNaval/');
        }
    }]);