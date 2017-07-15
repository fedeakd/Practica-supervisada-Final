angular.module('app.InformacionUsuarioControllers', ['firebase'])
	.controller('infoDelUsuarioController',
	function ($scope, $stateParams, Servicio, $state, Informacion, $ionicPopup, $timeout, $ionicSideMenuDelegate, $cordovaVibration, $cordovaBarcodeScanner) {
		$scope.usuario = {};
		var firebaseUsuarios = Servicio.RefJugadores();
		$ionicSideMenuDelegate.canDragContent(true);
		console.log("entro");

		Informacion.TraerUsuarioActual(function (usuario) {
			$scope.usuario = usuario;
		});

		$scope.usuario = Informacion.usuario;
		$scope.Cerrar = function () {
			firebase.auth().signOut().then(function () {//Si me queiro desloguear
				$state.go("login");
			}, function (error) {
				// An error happened.
			});
			console.log("Cerrar");
		}
		$scope.DarTickets = function () {
			if ($scope.usuario.puntos > 0) {
				Informacion.AlertaMensaje("Aun tiene fichasm", "Solo se permite recargar si  te quedaste sin fichas");
				return;
			}
			try {
				$cordovaBarcodeScanner
					.scan()
					.then(function (barcodeData) {

						var num = parseInt(barcodeData.text) + parseInt($scope.usuario.puntos);
						firebaseUsuarios.child($scope.usuario.key).update({
							"puntos": num
						});


						Informacion.TraerUsuarioActual(function (usuario) {
							$scope.usuario = usuario;
						});
						alert("Se cargaron "+ barcodeData.text+ " puntos");
					}, function (error) {
						//alert(error);
					});
			} catch (error) {
			//	alert(error);
			}
		}

		$scope.MostrarCreador = function () {
			$state.go("presentacion");
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
	function ($scope, $stateParams, $state, $ionicPopup, Informacion) {
		$scope.partida = {
			ganada: 0,
			empatada: 0,
			perdida: 0,
			total: 0
		}

		$scope.CambioTab = function (tipo) {
			$scope.tipo = tipo;
			var p = {};
			switch ($scope.tipo) {
				case "Desafio":
					p = $scope.usuario.partidas.Desafio;
					$scope.partida.ganada = p.ganada;
					$scope.partida.empatada = p.empatada;
					$scope.partida.perdida = p.perdida;
					$scope.partida.total = p.ganada + p.empatada + p.perdida;
					break;
				case "BatallaNaval":
					p = $scope.usuario.partidas.BatallaNaval;
					$scope.partida.ganada = p.ganada;
					$scope.partida.empatada = p.empatada;
					$scope.partida.perdida = p.perdida;
					$scope.partida.total = p.ganada + p.empatada + p.perdida;
					break;

			}


		}

		if (Informacion.usuario.mail == null) {
			Informacion.TraerUsuarioActual(function (usuario) {
				$scope.usuario = usuario;
				console.log($scope.usuario);
				$scope.CambioTab("Desafio");
			});
		}
		else {
			$scope.usuario = Informacion.usuario;
			$scope.CambioTab("Desafio");
		}

		$scope.tipo = "";
		/*Parte  de  diseño  de los botones aca no hay que tocar  */
		var switchButton = document.querySelector('.switch-button');
		var switchBtnRight = document.querySelector('.switch-button-case.right');
		var switchBtnLeft = document.querySelector('.switch-button-case.left');
		var activeSwitch = document.querySelector('.active');
		function switchLeft() {
			switchBtnRight.classList.remove('active-case');
			switchBtnLeft.classList.add('active-case');
			activeSwitch.style.left = '0%';
		}

		function switchRight() {
			switchBtnRight.classList.add('active-case');
			switchBtnLeft.classList.remove('active-case');
			activeSwitch.style.left = '50%';
		}
		switchBtnLeft.addEventListener('click', function () {
			switchLeft();
		}, false);

		switchBtnRight.addEventListener('click', function () {
			switchRight();
		}, false);





	}).controller('presentacionController',
	function ($scope, $stateParams, $state, $ionicPopup, Informacion) {

		$scope.Volver = function () {
			$state.go("usuario.informacionDelUsuario");
		}
	})