var angular = require('angular');
var router = require('angular-ui-router');
var angularfire = require('angularfire');
var Firebase = require('firebase');
var angularFormly = require('angular-formly');
var formlyBootstrap = require('angular-formly-templates-bootstrap');
var $ = require('jquery');
var _ = require('lodash');

var app = angular.module('app', ['ui.router', 'firebase', 'formly', 'formlyBootstrap', 'angular-mapbox']);

app.config(function($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise("/app/home");

  $stateProvider
    .state('app', {
        url: '/app',
        abstract: true,
        template: '<ui-view/>'
    })
    .state('app.home', {
      url: "/home",
      templateUrl: "home.html",
      controller: 'HomeController',
      controllerAs: 'vm'
    })
});

app.directive('googlePlaces', function(){
    return {
        restrict:'E',
        replace:true,
        scope: {location:'='},
        template: '<input id="google_places_ac" name="google_places_ac" type="text" class="input-block-level"/>',
        link: function($scope, elm, attrs){
            var autocomplete = new google.maps.places.Autocomplete($("#google_places_ac")[0], {});
            google.maps.event.addListener(autocomplete, 'place_changed', function() {
                var place = autocomplete.getPlace();
                $scope.location = place;
                $scope.$apply();
            });
        }
    }
});

app.controller('MainController', MainController);

function MainController() {
	var vm = this;

	vm.message = "Welcome to the Webpack + Angular Boilerplate"
}

app.controller('HomeController', HomeController);

HomeController.$inject = ['$scope', '$http', '$firebaseArray'];

function HomeController($scope, $http, $firebaseArray) {
    var vm = this;

    var ref = new Firebase("https://naderhen.firebaseio.com/locations");
    vm.locations = $firebaseArray(ref);
    console.log(vm.locations)

    vm.fields = [
      {
        key: 'name',
        type: 'input',
        templateOptions: {
          label: 'Name',
          required: true,
          placeholder: 'Location Name'
        }
      },
      {
        key: 'price',
        type: 'input',
        templateOptions: {
         type: 'number',
          label: 'Price',
          required: true,
          placeholder: 'Location Price'
        }
      },
      {
        key: 'category',
        type: 'select',
        templateOptions: {
          label: 'category',
          required: true,
          options: [
            {name: 'Hotel', value: 'lodging'},
            {name: 'Golf', value: 'golf'},
            {name: 'Pub', value: 'beer'},
            {name: 'Food', value: 'fast-food'},
            {name: 'Other', value: 'monument'}
          ]
        }
      }
    ];

    vm.submit = function() {
        console.log(vm.new_location)
        vm.locations.$add(_.omit(vm.new_location, 'photos')).then(function(response) {
            vm.new_location = null;
        })
    }

    $scope.$watch('vm.googleLocation', function(newValue, oldValue) {
        if (angular.isDefined(newValue)) {
            vm.new_location = newValue;
        }
    })

}
