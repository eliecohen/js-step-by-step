(function(){

    //angular module
    var myApp = angular.module('myApp', ['angularTreeview','ngRoute']);

    myApp.directive('prism', [function() {
        return {
            restrict: 'A',
            link: function ($scope, element, attrs) {
                element.ready(function() {
                    Prism.highlightElement(element[0]);
                });
            }
        }
    }]
    );

    myApp.directive('template1', ['$compile', function($compile) {
        return {
            restrict:'A',
            link: function(scope, elem, attrs) {

                // make the first element the active one
                scope.currentIndex = 1;

                // add the class message to the message li
                elem.find('li').addClass("message");

                // make the first message li current
                elem.find('li').eq(0).addClass("current");

                // compute the total number of list item
                var total = $('ul li.message').length;
                scope.total = total;

                // add the class m1 ..... m6 to the message li
                for (var i = 1; i <= total; i++) {
                    elem.find('li').eq(i-1).addClass("m"+i);
                }

                // Insert the buttons rows
                var buttonHtml = '\
                <hr/>\
                <div class="row" style="margin-right: 20px">\
                <div class="pull-left">\
                <ul class="breadcrumbs-four" style="margin-right: 10px">';

                for (var i = 1; i <= total; i++) {
                    if (i===1)
                        strClass = "class='current'";
                    else
                        strClass = "";
                    buttonHtml += '<li class="key b'+i+'"><a '+strClass+'href="">'+i+'</a></li>';
                }

                buttonHtml += '</ul></div></div>';

                // inject the html just after the h3
                elem.find('h3').after(buttonHtml);

                $('.code').hide();
                $('.code1').show();

                $( "body" ).keypress(function() {
                    // user press the '1' .....'n' button
                    if ( event.which >= 49 && event.which < 56) {
                        var n = event.which - 48;
                        $( ".m"+n).trigger( "click" );
                    }
                    //press space
                    else if  (event.which === 32){
                        console.log(event);
                        event.preventDefault();
                        return;
                        //console.log("total=###",total);
                        //console.log("currentIndex=###",scope.currentIndex);
                        //scope.$apply(function () {
                            //scope.currentIndex = scope.currentIndex + 1;
                        //})
                        //if (scope.currentIndex+1 <= total){
                         //   console.log("increment currentIndex")
                            //scope.currentIndex = scope.currentIndex+1 ;
                       // }
                       // else{
                            //scope.currentIndex = 1;
                       // }

                        //$( ".button"+scope.currentIndex).trigger( "click" );
                    }
                    event.preventDefault();
                });

                //click
                $('.key,.message').bind('click', function() {
                    var currentIndex = $(this).index();
                    currentIndex++;
                    elem.find('li').removeClass("current");
                    elem.find('li a').removeClass("current");

                    $('.m'+currentIndex).addClass("current");
                    $('.b'+currentIndex+' a').addClass("current");

                    $('.code').hide();
                    $('.code'+currentIndex).show();

                    scope.$apply(function () {
                        scope.currentIndex = currentIndex;
                    })
                });

                //console.log(scope,elem,attrs);
            }
        };
    }]);

    myApp.directive('nagPrism', ['$compile', function($compile) {
        return {
            restrict: 'A',
            transclude: true,
            scope: {
                source: '@'
            },
            link: function(scope, element, attrs, controller, transclude) {
                scope.$watch('source', function(v) {
                    element.find("code").html(v);

                    Prism.highlightElement(element.find("code")[0]);
                });

                transclude(function(clone) {
                    if (clone.html() !== undefined) {
                        element.find("code").html(clone.html());
                        $compile(element.contents())(scope.$parent);
                    }
                });
            },
            template: "<code></code>"
        };
    }]);

    myApp.config(function($routeProvider) {
        $routeProvider

            // route for the home page
            .when('/', {
                templateUrl : 'partials/1.html',
                controller  : 'mainController'
            })

            .when('/this-intro', {
                templateUrl : 'partials/this-intro.html',
                controller  : 'mainController'
            })

            .when('/scope-function', {
                templateUrl : 'partials/scope-function.html',
                controller  : 'scope-function-controller'
            })

            // route for the contact page
            .when('/2', {
                templateUrl : 'partials/2.html',
                controller  : 'contactController'
            });

    });

    // create the controller and inject Angular's $scope
    myApp.controller('mainController', function($scope) {
        // create a message to display in our view
        $scope.message = 'Everyone come and see how good I look!';
    });

    myApp.controller('contactController', function($scope) {
        $scope.message = 'Contact us! JK. This is just a demo.';
    });




    //test controller
    myApp.controller('myController', function($scope,$location){

        $scope.color = "merde";
        $scope.ttt = "eeeeeeeeeeee";

        $scope.topic = "home";
        $scope.page = "home";


        $scope.closeAllTopics = function(){
                console.log("close all parents");
                angular.forEach($scope.treeModel, function(topicItem, topicKey) {
                    topicItem.collapsed = true;
                });
        };


        $scope.closeAllOtherTopics = function(id){
            console.log("close all parents");
            var found;
            angular.forEach($scope.treeModel, function(topicItem, topicKey) {
                found = false;
                if (topicItem.hasOwnProperty('children')){
                    angular.forEach(topicItem.children, function(item, key) {
                        if (item.id === id){
                            found = true;
                        }
                    });
                    if (!found)
                        topicItem.collapsed = true;
                }
            });
        };

        $scope.templateUrl = function() {
            return "data/"+$scope.topic+"/"+$scope.page+".html";
        };


        //test tree model 1
        $scope.treeModel = [
            { "label" : "Variables & Data Types", "id" : "dataType", "children" : [
                { "label" : "Dynamic Nature", "id" : "dynamic"},
                { "label" : "The String Type", "id" : "string"},
                { "label" : "The Number Type", "id" : "number"},
                { "label" : "The Boolean Type", "id" : "boolean"},
                { "label" : "The Null Type", "id" : "string3"},
                { "label" : "The Undefined Type", "id" : "string2"},
                { "label" : "The Object Type", "id" : "object"}
            ]},
            { "label" : "Objects", "id" : "dataType", "children" : [
                { "label" : "", "id" : "dynamic3"},
                { "label" : "Creating Objects", "id" : "string4"},
                { "label" : "Modifying Objects", "id" : "string5"},
                { "label" : "Enumerating Properties", "id" : "string6"},
                { "label" : "Property Attribute", "id" : "string7"},
                { "label" : "Object Attribute", "id" : "string8"},
                { "label" : "Object Serialization", "id" : "string9"}
            ]},
            { "label" : "Array", "id" : "array", "children" : [
                { "label" : "intro", "id" : "array_intro"}
            ]},
            { "label" : "Function", "id" : "function", "children" : [
                { "label" : "Dynamic Nature", "id" : "f1"}
            ]},
            { "label" : "Scope", "id" : "scope", "children" : [
                { "label" : "function scope", "id" : "intro"}
            ] },
            { "label" : "Closure", "id" : "closure", "children" : [
                { "label" : "function scope", "id" : "intro56456"}
            ] },
            { "label" : "The this keyword", "id" : "this", "children" : [
                { "label" : "function scope", "id" : "intro234234"},
                { "label" : "Case 1: As Object Method", "id" : "287654"},
                { "label" : "Case 2: As Global Context", "id" : "345623"},
            ] },
            { "label" : "Inheritance", "id" : "inheritance", "children" : [
                { "label" : "function scope", "id" : "9878"}
            ] },
            { "label" : "Regular Expression", "id" : "regularExpression", "children" : [
                { "label" : "function scope", "id" : "reg1"}
            ] },
            { "label" : "Design Pattern", "id" : "designPattern", "children" : [
                { "label" : "function scope", "id" : "dp1"}
            ] },

        ];

        $scope.getParentNode = function (id){
            var parentId;
            var parentLabel;
            var result;

            console.log("looking for ",id);

            angular.forEach($scope.treeModel, function(topicItem, topicKey) {
                parentId = topicItem.id;
                parentLabel = topicItem.label;
                //console.log("parent",topicItem.label);
                if (topicItem.hasOwnProperty('children'))
                angular.forEach(topicItem.children, function(item, key) {
                    if (item.id === id){
                        //console.log("done");
                        //console.log("parent = ",parentId,parentLabel);
                        result = {label:parentLabel, id:parentId};
                        return result;
                    }
                });
            });

            return result;
        };

        $scope.$watch( 'mytree.currentNode', function( newObj, oldObj ) {
            if( $scope.mytree && angular.isObject($scope.mytree.currentNode) ) {
                //console.log( 'Node Selected!!' );
                //console.log("current id",$scope.mytree.currentNode.id );
                var parent = $scope.getParentNode($scope.mytree.currentNode.id);
                $scope.topic = parent.id;
                $scope.page = $scope.mytree.currentNode.id;
                console.log("parent-out",parent);
                $location.path($scope.mytree.currentNode.id);
                $scope.closeAllOtherTopics($scope.mytree.currentNode.id);
            }
        }, false);

    });

    myApp.controller('scope-function-controller', function($scope,$location,$http){
        ///$scope.code = "var aaaa = 1;\nvar person = {firstName: 'Penelope'};";


        $http.get('1.js').
            then(function(response) {
                console.log("##########################",response);
                $scope.code = response.data;
                // this callback will be called asynchronously
                // when the response is available
            }, function(response) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
            });

    });






})();