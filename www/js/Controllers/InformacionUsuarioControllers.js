angular.module('app.InformacionUsuarioControllers', ['firebase'])
	.controller('infoDelUsuarioController',
	function ($scope, $stateParams, $state, Informacion, $ionicPopup, $timeout) {
		$scope.usuario={};
		if (Informacion.usuario.mail == null) {
			Informacion.TraerUsuarioActual(function(usuario){
				$scope.usuario=usuario;
			});		
		}
		else{
			 $scope.usuario=Informacion.usuario;
		}
	



		$scope.EliminarCuenta = function () {
			console.log(Informacion.usuario);
			var confirmPopup = $ionicPopup.confirm({
				title: 'Eliminar cuenta',
				template: 'Seguro que quieres eliminar esta cuenta?'
			});
			confirmPopup.then(function (res) {
				if (res) {
					var user = firebase.auth().currentUser;

					user.delete().then(function () {
						var alertPopup = $ionicPopup.alert({
							title: 'Usuario eliminado',
							template: 'El usuario a sido  eliminado'
						});
						$state.go("login");
					}, function (error) {
						alert(error);
					});
				} else {

				}
			});
		}

	})
	.controller('misPartidasController',
	function ($scope, $stateParams, $state, $ionicPopup) {
		console.log("Hola mundo x2");
	

	})