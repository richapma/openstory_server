var myApp = angular.module('openstory_server', ['ngRoute', 'ngMaterial']);

myApp.config(function ($routeProvider) {
  $routeProvider
    .when('/', {
      templateUrl: 'partials/home.html',
      access: {restricted: false}
    })
    .when('/login', {
      templateUrl: 'partials/login.html',
      controller: 'loginController',
      access: {restricted: false}
    })
    .when('/logout', {
      controller: 'logoutController',
      access: {restricted: true}
    })
    .when('/register', {
      templateUrl: 'partials/register.html',
      controller: 'registerController',
      access: {restricted: false}
    })
    .when('/write_catalog/:c1', {
      templateUrl: 'partials/write_catalog.html',
      controller: 'catalogController',
      access: {restricted: true}
    })
    .when('/search_catalogs/:skip/:limit/:search', {
      templateUrl: 'partials/search_catalogs.html',
      controller: 'searchCatalogController',
      access: {restricted: false}
    })    
    .when('/search_mycatalogs/:skip/:limit/:search', {
      templateUrl: 'partials/search_mycatalogs.html',
      controller: 'searchCatalogController',
      access: {restricted: true}
    })
    .when('/detail_catalog/:search', {
      templateUrl: 'partials/detail_catalog.html',
      controller: 'catalogController',
      access: {restricted: true}
    })        
    .when('/two', {
      template: '<h1>This is page two!</h1>',
      access: {restricted: false}
    })
    .otherwise({
      redirectTo: '/',
      access: {restricted: false}
    });
});

/*
myApp.config(function($mdIconProvider) {
    $mdIconProvider
      .defaultIconSet('img/icons/sets/core-icons.svg', 24);
});*/

myApp.run(function ($rootScope, $location, $route, AuthService) {
  $rootScope.$on('$routeChangeStart',
    function (event, next, current) {
      AuthService.getUserStatus()
      .then(function(){
        if (next.access.restricted && !AuthService.isLoggedIn()){
          $location.path('/login');
          $route.reload();
        }
      });
  });
});