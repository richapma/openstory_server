angular.module('openstory_server').controller('loginController',
  ['$scope', '$location', 'AuthService',
  function ($scope, $location, AuthService) {

    $scope.login = function () {

      // initial values
      $scope.error = false;
      $scope.disabled = true;

      // call login from service
      AuthService.login($scope.loginForm.username, $scope.loginForm.password)
        // handle success
        .then(function () {
          $scope.$root.isAuth = true;
          $location.path('/');
          $scope.disabled = false;
          $scope.loginForm = {};
        })
        // handle error
        .catch(function () {
          $scope.$root.isAuth = false;
          $scope.error = true;
          $scope.errorMessage = "Invalid username and/or password";
          $scope.loginForm = {};
        });

    };

}]);

angular.module('openstory_server').controller('logoutController',
  ['$scope', '$location', 'AuthService',
  function ($scope, $location, AuthService) {

    $scope.logout = function () {

      // call logout from service
      AuthService.logout()
        .then(function () {
          $scope.$root.isAuth = false;
          $location.path('/login');
        });

    };

}]);

angular.module('openstory_server').controller('registerController',
  ['$scope', '$location', 'AuthService',
  function ($scope, $location, AuthService) {

    $scope.register = function () {

      // initial values
      $scope.error = false;
      $scope.disabled = true;

      // call register from service
      AuthService.register($scope.registerForm.username, $scope.registerForm.password)
        // handle success
        .then(function () {
          $location.path('/login');
          $scope.disabled = false;
          $scope.registerForm = {};
        })
        // handle error
        .catch(function () {
          $scope.error = true;
          $scope.errorMessage = "Something went wrong!";
          $scope.disabled = false;
          $scope.registerForm = {};
        });

    };
}]);


angular.module('openstory_server').controller('catalogController',
  ['$scope', '$location', 'StoryService',
  function ($scope, $location, StoryService) {

    $scope.read_catalog = function() {
      StoryService.read_catalog()
      // handle success
      .then(function(data) {            
            $scope.catalogForm = data.data; 
            console.log($scope.catalogForm);
      })
      // handle error
      .catch(function () {
          $scope.error = true;
          $scope.errorMessage = "Something went wrong!";
          $scope.disabled = false;

          //build empty data.
          $scope.catalogForm = {};
      });
    }

    $scope.write_catalog = function () {
      // initial values
      $scope.error = false;
      $scope.disabled = true;
      // call register from service
      StoryService.write_catalog($scope.catalogForm)

        // handle success
        .then(function () {
          //$location.path('/write_catalog/' + $scope.catalogForm._id);
          //$location.path('/write_story');
          //$scope.disabled = false;
          //$scope.saveStoryForm = {};
        })
        // handle error
        .catch(function () {
          $scope.error = true;
          $scope.errorMessage = "Something went wrong!";
          $scope.disabled = false;
        });

    }

    function init(){
      //call the service to load the data.
      StoryService.read_catalog()
      // handle success
      .then(function(data) {
            var pathparts = $location.path().split('/');
            if(pathparts[pathparts.length-1] == 'NEW'){
              //change location to the new id.
              $location.path('/write_catalog/' + data.data._id);  
            }else{
              $scope.catalogForm = data.data; 
              console.log($scope.catalogForm);
            }
        })
      // handle error
      .catch(function () {
          $scope.error = true;
          $scope.errorMessage = "Something went wrong!";
          $scope.disabled = false;

          //build empty data model.
          $scope.catalogForm = {}; //see how to do this from model.
        });
    }

    init();

}]);

angular.module('openstory_server').controller('searchCatalogController',
       ['$scope', '$filter', '$http', '$mdSidenav', '$location', 'AuthService', '$log', 
       function ($scope, $filter, $http, $mdSidenav, $location, AuthService, $log) {     
        $scope.$root.$location = $location;

        console.log('searchCatalogController');
        $scope.infiniteItems = {
          numLoaded_: 0,
          toLoad_: 0,
          // Required.
          getItemAtIndex: function(index) {
            if (index > this.numLoaded_) {
              console.log('getitematindex');
              this.fetchMoreItems_(index);
              return null;
            }
            return index;
          },
          // Required.
          // For infinite scroll behavior, we always return a slightly higher
          // number than the previously loaded items.
          getLength: function() {
            console.log('numLoad');
            return this.numLoaded_ + 8; // 8=24/3
          },
          fetchMoreItems_: function(index) {
            // For demo purposes, we simulate loading more items with a timed
            // promise. In real code, this function would likely contain an
            // $http request.
            console.log('fetchMoreItems');
            if (this.toLoad_ < index) {
              this.toLoad_ += 8; // 8=24/3                              
              $http.get('/api/search_catalogs/' + (this.numLoaded_*3) + '/24/hello').then(angular.bind(this, function (obj) {
                  
                  if(!this.items){
                    this.items = [];
                  }
                  console.log(this.items);
                  console.log(obj.data);
                  console.log(obj.data.length);
                  if(obj.data.length > 0){
                    this.items = this.items.concat(obj.data);
                    this.numLoaded_ = this.toLoad_;
                  }else{
                    this.toLoad -= 8;
                  }
                  
              }));
            }
          }
        }
      }]);

angular.module('openstory_server').directive('header', function () {
    return {
        restrict: 'A', //This menas that it will be used as an attribute and NOT as an element. I don't like creating custom HTML elements
        replace: true,
        scope: {user: '='},
        templateUrl: "partials/header.html",
        controller: ['$scope', '$filter', '$timeout', '$mdSidenav', '$location', 'AuthService', '$log', function ($scope, $filter, $timeout, $mdSidenav, $location, AuthService, $log) {
          $scope.toggleLeft = buildDelayedToggler('left');
          $scope.$root.$location = $location;

          $scope.logout = function () {

            // call logout from service
            AuthService.logout()
              .then(function () {
                $scope.$root.isAuth = false;
                $location.path('/home');
              });

          };

          $scope.isOpenLeft = function(){
            return $mdSidenav('left').isOpen();
          };

          /*
          * Supplies a function that will continue to operate until the
          * time is up.
          */
          function debounce(func, wait, context) {
            var timer;
            return function debounced() {
              var context = $scope,
                  args = Array.prototype.slice.call(arguments);
              $timeout.cancel(timer);
              timer = $timeout(function() {
                timer = undefined;
                func.apply(context, args);
              }, wait || 10);
            };
          }
          /*
          * Build handler to open/close a SideNav; when animation finishes
          * report completion in console
          */
          function buildDelayedToggler(navID) {
            return debounce(function() {
              // Component lookup should always be available since we are not using `ng-if`
              $mdSidenav(navID)
                .toggle()
                .then(function () {
                  $log.debug("toggle " + navID + " is done");
                });
            }, 200);
          }

          function buildToggler(navID) {
            return function() {
              // Component lookup should always be available since we are not using `ng-if`
              $mdSidenav(navID)
                .toggle()
                .then(function () {
                  $log.debug("toggle " + navID + " is done");
                });
            }
          }

        }
        ]
      }
}
);
