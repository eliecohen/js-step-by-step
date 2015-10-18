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

                $( "body#b1" ).keypress(function() {
                    // user press the '1' .....'n' button
                    if ( event.which >= 49 && event.which < 56) {
                        var n = event.which - 48;
                        $( ".m"+n).trigger( "click" );
                    }
                    //press space
                    else if  (event.which === 32){
                        console.log(event);
                        event.preventDefault();
                        //return;
                        console.log("total=###",total);
                        console.log("currentIndex=###",scope.currentIndex);
                        scope.$apply(function () {
                            scope.currentIndex = scope.currentIndex + 1;
                        })
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

    myApp.controller('myController', function($scope,$location){

        $scope.init = function init (){
            $scope.closeAllTopics();

            var id = $location.url().substr(1);

            $scope.gotoId(id);  // remove the trailing slash  '/number' from url
            $scope.updateTree(id);
        };

        $scope.updateTree = function updateTree (id){
            console.log("update tree");
            var found;
            angular.forEach($scope.treeModel, function(topicItem, topicKey) {
                found = false;
                if (topicItem.hasOwnProperty('children')){
                    angular.forEach(topicItem.children, function(item, key) {
                        if (item.id === id){
                            found = true;
                            topicItem.collapsed = false;
                            item.selected = "selected";
                        }
                    });
                    if (!found)
                        topicItem.collapsed = true;
                }
            });

        };

        $scope.closeAllTopics = function closeAllTopics(){
            console.log("close all parents");
            angular.forEach($scope.treeModel, function(topicItem, topicKey) {
                if (topicItem.hasOwnProperty("children"))
                    topicItem.collapsed = true;
            });
        };

        $scope.closeAllOtherTopics = function closeAllOtherTopics(id){
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

        $scope.templateUrl = function templateUrl() {
            if (!$scope.topic)
                return "data/" + $scope.page + ".html";   //home page

            return "data/" + $scope.topic + "/" + $scope.page + ".html";
        };


        //test tree model 1
        $scope.treeModel = [
            {"label":"Home","id":"home"},
            { "label" : "Variables & Data Types", "id" : "dataType", "children" : [
                { "label" : "Dynamic Nature", "id" : "dynamic"},
                { "label" : "The String Type", "id" : "string"},
                { "label" : "The Number Type", "id" : "number"},
                { "label" : "The Boolean Type", "id" : "boolean"},
                { "label" : "The Null Type", "id" : "null"},
                { "label" : "The Undefined Type", "id" : "string2"},
                { "label" : "The Object Type", "id" : "object"}
            ]},
            { "label" : "Objects", "id" : "dataType", "children" : [
                { "label" : "rwer", "id" : "dynamic3"},
                { "label" : "Creating Objects", "id" : "string4"},
                { "label" : "Modifying Objects", "id" : "string5"},
                { "label" : "Enumerating Properties", "id" : "string6"},
                { "label" : "Property Attribute", "id" : "string7"},
                { "label" : "Object Attribute", "id" : "string8"},
                { "label" : "Object Serialization", "id" : "string9"}
            ]},
            { "label" : "Array", "id" : "array", "children" : [
                { "label" : "Introduction", "id" : "array_intro"},
                { "label" : "Array Creation", "id" : "array_creation"},
                { "label" : "Array Modification", "id" : "array_modification"}
            ]},
            { "label" : "Function", "id" : "function", "children" : [
                { "label" : "Function Introduction", "id" : "function1"},
                { "label" : "Declaration & Expression", "id" : "declaration_expression"},
                { "label" : "Evaluation Order", "id" : "evaluation_order"},
                { "label" : "First Class: Function as Value", "id" : "first_class"}
            ]},
            { "label" : "Scope", "id" : "scope", "children" : [
                { "label" : "function scope", "id" : "intro"},
                { "label" : "The IIFE Pattern", "id" : "iife"}
            ] },
            { "label" : "Closure", "id" : "closure", "children" : [
                { "label" : "Intro Closure", "id" : "intro-closure"},
                { "label" : "Closure Mechanism", "id" : "closure_mechanism"},
                { "label" : "Context Access", "id" : "closure-example2"}
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

        $scope.getParentNode = function getParentNodegetParentNode(id){
            var parentId;
            var parentLabel;
            var result={label:null,id:null};

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

        $scope.gotoId = function gotoId (id){

            var parent = $scope.getParentNode(id);

            console.log("--------------2",id,parent);

            if (!id || !parent.id){
                $scope.topic = null;
                $scope.page = "home";
                $location.path("home");
                $scope.closeAllTopics();
                return;
            }
            else{
                $scope.topic = parent.id;
                $scope.page = id;
                $location.path(id);
                $scope.closeAllOtherTopics(id);
            }
        }

        $scope.$watch( 'mytree.currentNode', function( newObj, oldObj ) {
            if( $scope.mytree && angular.isObject($scope.mytree.currentNode) ) {
                //console.log("current id",$scope.mytree.currentNode.id );
                $scope.gotoId($scope.mytree.currentNode.id);
            }
        }, false);

        $scope.$watch('currentIndex', function(newObj, oldObj){
            console.log("old",oldObj,"new",newObj);
        });

    });




})();