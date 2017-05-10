 angular.module('app', ['ui.router'])
        .config(function($stateProvider, $urlRouterProvider) {
            $urlRouterProvider.otherwise('/placeholder');

            $stateProvider
                .state('home', {
                    url: '/',
                    templateUrl: 'blog-masonry-sidebar-angular'
                })
                .state('about', {
                    url: '/about',
                    template: '<h1>About inserted</h1>'
                })
        }
        )