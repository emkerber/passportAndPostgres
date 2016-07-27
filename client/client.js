
angular.module('catApp', []);

angular.module('catApp').controller('CatController', ['$http', function($http) {

  var vm = this;

   vm.car ={};
   vm.cats = [];
   var fetchCats = function() {
       return $http.get('/cats').then(function(response){
           if(response.status !== 200){
               throw new Error('Failed to fetch cats from the API');
           }
           vm.cat = {};
           vm.cats = response.data;
           return response.data;
       })
   };
   vm.add = function(cat){
       return $http.post('/add', cat).then(fetchCats());
   };
   fetchCats();
}]);
