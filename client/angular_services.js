angular.module('openstory_server').factory('AuthService',
  ['$q', '$timeout', '$http',
  function ($q, $timeout, $http) {
      var user;
      // create user variable

      // return available functions for use in the controllers
      return({isLoggedIn: function isLoggedIn() {
        return user;
      },
      
      getUserStatus: function getUserStatus() {
        return $http.get('/user/status')
        // handle success
        .success(function (data) {
          if(data.status){
            user = true;
          } else {
            user = false;
          }
        })
        // handle error
        .error(function (data) {
          user = false;
        });
      },
      
      login: function login(username, password) {
        // create a new instance of deferred
        var deferred = $q.defer();

        // send a post request to the server
        $http.post('/user/login',
          {username: username, password: password})
          // handle success
          .success(function (data, status) {
            if(status === 200 && data.status){
              user = true;
              deferred.resolve();
            } else {
              user = false;
              deferred.reject();
            }
          })
          // handle error
          .error(function (data) {
            user = false;
            deferred.reject();
          });

        // return promise object
        return deferred.promise;
      },

      logout: function logout() {

        // create a new instance of deferred
        var deferred = $q.defer();

        // send a get request to the server
        $http.get('/user/logout')
          // handle success
          .success(function (data) {
            user = false;
            deferred.resolve();
          })
          // handle error
          .error(function (data) {
            user = false;
            deferred.reject();
          });

        // return promise object
        return deferred.promise;

      },
      
      register: function register(username, password) {
        // create a new instance of deferred
        var deferred = $q.defer();

        // send a post request to the server
        $http.post('/user/register',
          {username: username, password: password})
          // handle success
          .success(function (data, status) {
            if(status === 200 && data.status){
              deferred.resolve();
            } else {
              deferred.reject();
            }
          })
          // handle error
          .error(function (data) {
            deferred.reject();
          });

        // return promise object
        return deferred.promise;
      }      
      })}]);


angular.module('openstory_server').factory('StoryService',
  ['$q', '$timeout', '$http', '$routeParams',
  function ($q, $timeout, $http, $routeParams) {
      // create user variable

      // return available functions for use in the controllers
      return({
        write_catalog: function write_catalog(cat) {
          return $http({url: '/api/write_catalog/' + $routeParams.c1,
                        method:'PUT',
                        data: cat,
                        headers: {'Content-Type': 'application/json;charset=utf-8'}
                      })
          // handle success
          .success(function (data) {
            
          })
        }
        ,
        read_catalog: function read_catalog() {
        //console.log('/read_catalog/' + $routeParams.c1);
        return $http.get('/api/read_catalog/' + $routeParams.c1)

          .success(function (data) {
            console.log(data);
            return data;
          })
        
          // handle error
          .error(function (data) {
            console.log('error retrieving catalog');
          })
        }
        ,
        search_catalogs: function search_catalogs(search, skip, limit){
          return $http.get('/api/search_catalogs/' + search + '/' + skip + '/' + limit)

          .success(function (data) {
            console.log(data);
            return data;
          })
        
          // handle error
          .error(function (data) {
            console.log('error retrieving catalog');
          })
        }
        ,
        search_mycatalogs: function search_mycatalogs(search, skip, limit){
          return $http.get('/api/search_mycatalogs/' + search + '/' + skip + '/' + limit)

          .success(function (data) {
            console.log(data);
            return data;
          })
        
          // handle error
          .error(function (data) {
            console.log('error retrieving catalog');
          })
        }
      })
    }]);