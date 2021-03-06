
angular.module('app.UsuarioYRegistrarControllers', ['firebase'])

	.controller('loginController',
	function ($scope, $stateParams, $ionicPopup, Informacion, $state, $timeout, Servicio, $ionicSideMenuDelegate) {
		$ionicSideMenuDelegate.canDragContent(false);
		$scope.user = {};
		$scope.user.mail = "";
		$scope.user.clave = "";
		$scope.$root.showMenuIcon = true;
		var firabaseJugadores = Servicio.RefJugadores();

		firebase.auth().onAuthStateChanged(function (user) {//si esta logeado
			if (user) {
				firabaseJugadores.on('child_added', function (snapshot) {//Compruebo el usuario  que se logeo y traigo el dato

					var message = snapshot.val();
					if (message.id === user.uid) {
						//Servicio.subirAlConectado(message.id);	
						//Usuario=message;
						Informacion.usuario = message;
						$scope.$root.showMenuIcon = false;
						$state.go("usuario.informacionDelUsuario");

						return;
					}
				});
			} else {

			}
		});




		$scope.IrARegistrar = function () {
			console.log("registrar");
			$state.go("registrar");
		}

		$scope.IrAlDesafio = function () {
			console.log("hola");

		}
		$scope.IrAlDesafio = function () {
			firebase.auth().signInWithEmailAndPassword($scope.user.mail, $scope.user.clave).then(function (user) {
				$timeout(function () {
					$scope.datoUsuario = JSON.stringify(user, "sin registrar", "");

					if (user) {
						firabaseJugadores.on('child_added', function (snapshot) {//Compruebo el usuario  que se logeo y traigo el dato

							var message = snapshot.val();
							if (message.id === user.uid) {
								$scope.$root.showMenuIcon = false;
								$state.go("usuario.informacionDelUsuario", {}, { reload: true });

								return;
							}
						});

						$scope.estalogeado = "si";
					}
					else {

						$scope.estalogeado = "no";

					}

					$scope.habilitarfORM = true;
				})

			}).catch(function (error) {
				var errorCode = error.code;
				var erroMessage = error.menssage;
				var mensaje = "";

				if (errorCode === "auth/wrong-password") {
					mensaje = "Error, contraseña no valida";
					console.log("Wrong password");

				}
				else if (errorCode === "auth/invalid-email") {
					mensaje = "Error, MAIL no valido";
				}
				else if (errorCode === "auth/user-disabled") {
					mensaje = "Error, El usuario se ah dado de baja";
					//Usuario  desactivado
				}
				else if (errorCode === "auth/user-not-found") {
					mensaje = "Error, el usuario no existe";
					// usuario  no existe
				}

				else {

					console.log(erroMessage);
				}


				$ionicPopup.alert({
					title: 'Algo salio mal!!',
					template: mensaje
				});

				$scope.habilitarfORM = true;
				console.info("errores:", error);
				console.log(error);
			})


		}

		$scope.AutoLogin = function (tipo) {
			var usuario = "";
			var clave = "123456";

			switch (tipo) {
				case "player1":
					usuario = "jugador@matrix.com";
					break;
				case "player2":
					usuario = "jugador2@matrix.com";
					break;
				case "administrador":
					usuario = "administrador@matrix.com";
					break;
			}

			firebase.auth().signInWithEmailAndPassword(usuario, clave).then(function (user) {
				$timeout(function () {
					$scope.datoUsuario = JSON.stringify(user, "sin registrar", "");

					if (user) {
						firabaseJugadores.on('child_added', function (snapshot) {//Compruebo el usuario  que se logeo y traigo el dato

							var message = snapshot.val();
							if (message.id === user.uid) {
								$scope.$root.showMenuIcon = false;
								$state.go("usuario.informacionDelUsuario", {}, { reload: true });

								return;
							}
						});

						$scope.estalogeado = "si";
					}
					else {

						$scope.estalogeado = "no";

					}

					$scope.habilitarfORM = true;
				})

			}).catch(function (error) {
				var errorCode = error.code;
				var erroMessage = error.menssage;
				var mensaje = "";

				if (errorCode === "auth/wrong-password") {
					mensaje = "Error, contraseña no valida";
					console.log("Wrong password");

				}
				else if (errorCode === "auth/invalid-email") {
					mensaje = "Error, MAIL no valido";
				}
				else if (errorCode === "auth/user-disabled") {
					mensaje = "Error, El usuario se ah dado de baja";
					//Usuario  desactivado
				}
				else if (errorCode === "auth/user-not-found") {
					mensaje = "Error, el usuario no existe";
					// usuario  no existe
				}

				else {

					console.log(erroMessage);
				}


				$ionicPopup.alert({
					title: 'Algo salio mal!!',
					template: mensaje
				});

				$scope.habilitarfORM = true;
			})

		}
	})
	.controller('RegistrarController',
	function ($scope, $stateParams, $state, $ionicPopup, Servicio) {
		$scope.persona = {};
		$scope.persona.mail = "soii_fede123@hotmail.com";
		$scope.persona.clave = "federico18";
		$scope.persona.reClave = "federico18";
		$scope.$root.showMenuIcon = true;
		var firabaseJugadores = Servicio.RefJugadores();

		$scope.fechaActual = function () {
			var today = new Date();
			var dd = today.getDate();
			var mm = today.getMonth() + 1;
			var yyyy = today.getFullYear();

			if (dd < 10) {
				dd = '0' + dd
			}

			if (mm < 10) {
				mm = '0' + mm
			}

			today = dd + '/' + mm + '/' + yyyy;
			return today;
		}

		$scope.IrAlLogin = function () {
			$state.go("login");
		}

		$scope.Registrar = function () {
			firebase.auth().createUserWithEmailAndPassword($scope.persona.mail, $scope.persona.clave).then(function (user) {
				if (user) {
					console.log(user);
					firabaseJugadores.push({
						'id': user.uid,
						"mail": $scope.persona.mail,
						'clave': $scope.persona.clave,
						'estado': 'normal',
						'proveedor': 'ordinario',
						'puntos': 50,
						'tickets': [],
						'partidas': {
							'BatallaNaval': {
								'empatada': 0,
								'perdida': 0,
								'ganada': 0
							},
							'Desafio': {
								'empatada': 0,
								'perdida': 0,
								'ganada': 0
							}
						},
						'fechaIncripcion': $scope.fechaActual()


					});
					$scope.$root.showMenuIcon = false;
					$state.go("login");
				}


			}).catch(function (error) {

				var errorCode = error.code;
				var erroMessage = error.menssage;
				var mensaje = "";

				if (errorCode === "auth/email-already-in-use") {
					mensaje = "Error, esss MAIL ya se encuentra registrado";
				}
				else if (errorCode === "auth/invalid-email") {
					mensaje = "Error, MAIL no valido";
				}
				else if (errorCode === "auth/operation-not-allowed") {
					mensaje = "Error, El usuario no esta habilitado";
					//Usuario  desactivado
				}
				else if (errorCode === "auth/weak-password") {
					mensaje = "Error, la clave es debil";
					// usuario  no existe
				}

				else {

					console.log(erroMessage);
				}


				$ionicPopup.alert({
					title: 'Algo salio mal!!',
					template: mensaje
				});

				$scope.habilitarfORM = true;
			})
			$state.go("login");
		}


	})
	.controller('logoutController',
	function ($scope, $stateParams, $state, $ionicPopup, Servicio, $ionicSideMenuDelegate) {
		firebase.auth().signOut().then(function () {//Si me queiro desloguear
			$state.go("login");
		}, function (error) {
			// An error happened.
		});

	})


