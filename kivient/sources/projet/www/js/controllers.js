var allEvents = [
    { 
      id: 1,
      category    : 'Soirée',
      title       : 'Lancement de l\'application',
      hours       : {start: '19:00', end: '06:00', date: '17/04/2015'},
      owner       : {displayName: 'Henri Durand', phoneNumbers: '0687384537'},
      adress      : {street: '6 rue Froment', cp: '75011', city: 'Paris'},
      description : 'Soirée de lancement de l\'appli Kivient',
      picture     : 'ionic.png'
    },
    { id: 2, title: 'Event 02' },
  ];


angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout, $rootScope, $state, $cordovaGoogleAnalytics, $window) {

  // Form data for the login modal
  $scope.loginData = {};
  $scope.isLogged = true;

  $scope.t = function(word) {

    if (typeof $rootScope.locale == "undefined") { $rootScope.locale = 'en'; }
    return GlobalizationService.translate($rootScope.locale, word);
  };

  $scope.setLang = function() {
    $scope.langage = $scope.t('langage');
  };

  $scope.changeLocale = function() {

    $rootScope.locale = ($rootScope.locale == 'en') ? 'fr' : 'en';
    $scope.setLang();
    // $state.reload();

  };

  $scope.setLang();

})

/** List all events **/
.controller('EventsCtrl', function($scope, $ionicViewService, $localStorage, $cordovaNetwork, $rootScope, $cordovaVibration) {
  $ionicViewService.clearHistory();
  $scope.events = allEvents;

  $scope.isOffline = function() {
    if (typeof navigator.connection !== "undefined") {
      return $cordovaNetwork.isOffline();
    }
  }

  $rootScope.$on('beacon', function(event, msg) {
    if (msg == true) {
      $('#beaconNotif').stop().show();
    } else {
      $('#beaconNotif').stop().hide();
    }
  });

})



/** Single event age **/
.controller('EventCtrl', function($scope, $stateParams, $cordovaContacts, $location, $cordovaSocialSharing) {
  $scope.events = allEvents;
  var id = $stateParams.id;

  // Get this event information
  $scope.events.forEach( function(a, e) {
    if (a.id == id) {
      $scope.thisEvent = a;
      return false;
    }
  });
  
  // Function to save owner event contact
  contactForm = $scope.thisEvent.owner;
  $scope.addContact = function() 
  {
    var phoneNumbers = [];
    phoneNumbers[0] = new ContactField('Principal', contactForm.phoneNumbers, false);
    contactForm.phoneNumbers = phoneNumbers;
    console.log(contactForm);

    $cordovaContacts.save(contactForm).then(function(result) {
      // alert(result);
    }, function(err) {
      // Contact error
    });
  };

  // Function to participate
  $scope.participate = function(id) 
  {
    console.log(id); 
  }

  // Function to share on Twitter
  $scope.twitter = function(msg)
  {
    $cordovaSocialSharing
      .shareViaTwitter(msg, null, null)
      .then(function(result) {
        console.log('shared');
      }, function(err) {
        // An error occurred. Show a message to the user
      });
  }

})



.controller('ProfilCtrl', function($scope, $localStorage) {
  
  $scope.infosUser = angular.fromJson($localStorage.infos);
  $scope.infos = {};
  $scope.updated = {};

  if (typeof $scope.infosUser !== "undefined") {
    $scope.infos.prenom = $scope.infosUser.prenom;
    $scope.infos.nom = $scope.infosUser.name;
    $scope.infos.promo = $scope.infosUser.promo;
  }


  $scope.updateInfos = function() {

    delete $localStorage.infos;
    $scope.$storage = $localStorage.$default({
            infos : angular.toJson({
                    'name' : $scope.infos.nom,
                    'prenom' : $scope.infos.prenom,
                    'promo' : $scope.infos.promo
                  })
        });
    $scope.updated.status = true;
  }
})

.controller('CreateCtrl', function($scope, $cordovaGeolocation, $http, $cordovaCamera, $rootScope) {

  $scope.create = {};

  console.log($rootScope.locale);

  $scope.here = function() {
    var posOptions = {timeout: 10000, enableHighAccuracy: false};
    $cordovaGeolocation.getCurrentPosition(posOptions)
      .then(function (position) {
        var lat  = position.coords.latitude;
        var long = position.coords.longitude;
        var now = new Date();
        var urlMap = 'http://maps.googleapis.com/maps/api/geocode/json?latlng=' + lat + ',' + long + '&sensor=false';

        $scope.create.hoursStart = now;
        $scope.create.dateStart = now;

        $http.get(urlMap).
          success(function(data, status, headers, config) {
            $scope.create.street = data.results[0].address_components[0].long_name + " " + data.results[0].address_components[1].long_name;
            $scope.create.cp = data.results[0].address_components[6].long_name;
            $scope.create.city = data.results[0].address_components[2].long_name;
          }).
          error(function(data, status, headers, config) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
          });

      }, function(err) {
        console.log('error');
      });
  };


  $scope.cam = function() {

    document.addEventListener("deviceready", function () {

      var options = {
        quality: 50,
        destinationType: Camera.DestinationType.DATA_URL,
        // sourceType: Camera.PictureSourceType.CAMERA,
        sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
        allowEdit: true,
        encodingType: Camera.EncodingType.JPEG,
        // targetWidth: 100,
        targetHeight: 150,
        popoverOptions: CameraPopoverOptions,
        saveToPhotoAlbum: false
      };

      $cordovaCamera.getPicture(options).then(function(imageData) {
        var image = document.getElementById('myImage');
        image.src = "data:image/jpeg;base64," + imageData;
      }, function(err) {
        // error
      });

    }, false);

  };
})

.controller('RegisterCtrl', function($scope, $window, $state, $http) {
  $scope.registerData = {};

  // Function to login user
  $scope.doRegister = function() {
    console.log($scope.registerData);
  
    if (typeof $scope.registerData.username !== "undefined" && typeof $scope.registerData.password !== "undefined" && typeof $scope.registerData.email !== "undefined") {

      $http.post('http://kivient.local/api/register', 

        {
          name      : $scope.registerData.username, 
          password  : $scope.registerData.password, 
          email     : $scope.registerData.email,
          phone     : $scope.registerData.phone
        }

        ).success(function(data, status, headers, config) {
          console.log(data);
          $state.go('app.login');
        }).
        error(function(data, status, headers, config) {
          console.log(data);
        });
    }
    
  }
})

.controller('LoginCtrl', function($scope, $window, $state, $http, $localStorage) {

  // Function to login user
  $scope.doLogin = function() {
    if (typeof $scope.loginData.username !== "undefined" && typeof $scope.loginData.password !== "undefined") {

      if ($scope.loginData.username == "user@kivient.com" && 
          $scope.loginData.password == "useruser") 
      {
        $scope.$storage = $localStorage.$default({
            auth : angular.toJson({
                    'logged'  : true, 
                    'token'   : 'myTokenKey',
                    'email'   : $scope.loginData.username,
                    'username': 'User',
                    'id'      : 23
                  })
        });
        $state.go("app.events");
      }

      // logged = AuthService.Authentification(, $scope.loginData.password);
      
      // if (logged) {
      //   $window.localStorage.setItem('auth', angular.toJson({logged: true, 'token': 'token123'}))
      //   $state.transitionTo("app.events");
      // }
    }
    
  }

});
