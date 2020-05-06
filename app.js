

// var express = require('express');
// var path = require('path');
// var express2 = express();
let app = angular.module('sudokuApp', ["ngRoute"]);
// express2.get('/', function (req, res) {
//     res.sendFile(path.join(__dirname, 'index.html'));
// });
//
// express2.use(express.static(__dirname)); // set static files location, in this case the route, add a file name if not
// express2.listen(process.env.PORT || 3000);

// config routes
app.config(function($routeProvider)  {

    $routeProvider
    // homepage
        .when('/', {
            // this is a template
            templateUrl: 'pages/home/home.html',
            controller : 'homeController as homeCtrl'
        })
        .when('/sudokuGame', {
            // this is a template
            templateUrl: 'pages/sudokuGame/sudokuGame.html',
            controller : 'sudokuGameController as gameCtrl'
        })

        //
        .when('/startQuestion', {
            // this is a template
            templateUrl: 'pages/startQuestion/startQuestion.html',
            controller : 'startQuestionController as questionCtrl'
        })

        .when('/finishQuestion', {
            // this is a template
            templateUrl: 'pages/finishQuestion/finishQuestion.html',
            controller : 'finishQuestionController as finishQuestionCtrl'
        })

        .when('/description', {
            // this is a template
            templateUrl: 'pages/description/description.html',
            controller : 'descriptionController as descriptionCtrl'
        })
        .when('/KnapsackGame', {
            // this is a template
            templateUrl: 'pages/KnapsackGame/KnapsackGame.html',
            controller : 'KnapsackGameController as KnapsackGameCtrl'
        })
        .when('/ExperimentOver', {
            // this is a template
            templateUrl: 'pages/ExperimentOver/ExperimentOver.html',
            controller : 'ExperimentOverController as ExperimentOverCtrl'
        })
        .when('/Tutorial', {
        // this is a template
        templateUrl: 'pages/Tutorial/Tutorial.html',
        controller : 'TutorialController as TutorialCtrl'
        })
        .when('/ExamBeforeGame', {
            // this is a template
            templateUrl: 'pages/ExamBeforeGame/ExamBeforeGame.html',
            controller : 'ExamBeforeGameController as ExamBeforeGameCtrl'
        })
        .when('/Feedback', {
            // this is a template
            templateUrl: 'pages/Feedback/Feedback.html',
            controller : 'FeedbackController as FeedbackCtrl'
        })
        .when('/pageBeforeGame', {
            // this is a template
            templateUrl: 'pages/pageBeforeGame/pageBeforeGame.html',
            controller : 'pageBeforeGameController as pageBeforeGameCtrl'
        })
        // .when('/KnapsackFinishQuestion', {
        //     // this is a template
        //     templateUrl: 'pages/KnapsackFinishQuestion/KnapsackFinishQuestion.html',
        //     controller : 'KnapsackFinishQuestionController as KnapsackFinishQuestionCtrl'
        // })



        // // about
        // .when('/about', {
        //     // this is a template url
        //     templateUrl: 'pages/about/about.html',
        //     controller : 'aboutController as abtCtrl'
        // })
        // // poi
        // .when('/poi', {
        //     templateUrl: 'pages/poi/poi.html',
        //     controller : 'poiController as poiCtrl'
        // })
        // // .when('/httpRequest', {
        // //     templateUrl: 'pages/http/request.html',
        // //     controller : 'httpController as httpCtrl'
        // // })
        //
        // .when('/login', {
        //     templateUrl: 'pages/login/login.html',
        //     controller : 'loginController as loginCtrl'
        // })
        //
        // .when('/register', {
        //     templateUrl: 'pages/register/register.html',
        //     controller : 'registerController as regCtrl'
        // })
        // .when('/loggedIn', {
        //     templateUrl: 'pages/loggedIn/loggedIn.html',
        //     controller : 'loggedInController as logeedInCtrl'
        // })
        // .when('/favorites', {
        //     templateUrl: 'pages/favorites/favorites.html',
        //     controller : 'favoritesController as favoritesCtrl'
        // })
        // .when('/logOut', {
        //     templateUrl: 'pages/logout/logout.html',
        //     controller : 'logoutController as logoutCtrl'
        // })
        // other
        .otherwise({ redirectTo: '/' });
});