var angular = require('angular');

var app = angular.module('app', []);

app.controller('MainController', MainController);

function MainController() {
	var vm = this;

	vm.message = "Welcome to the Webpack + Angular Boilerplate"
}