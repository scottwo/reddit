angular.module("reddit")

    .controller('PostsController', function($scope, FirebaseService){
        $scope.newPost = {};
    
        var getPosts = function() {      
            FirebaseService.getPosts().then(function(response){
            $scope.posts = [];
            for(var objs in response){
                $scope.posts.push({author: response[objs].author, body: response[objs].body, id: response[objs].id, karma: response[objs].karma, timestamp: response[objs].timestamp, title: response[objs].title, comments: response[objs].comments});
                }
            }, function(error){
                throw error;
            })
        };
    
        getPosts();
    
        $scope.addPost = function (newPost) {
            FirebaseService.addPost(newPost).then(function(response) {
                getPosts();
            }, function(error){
                console.log(error);
            });
        }
        
        $scope.submitComment = function(post, commentTxt) {
            FirebaseService.addComment(post, commentTxt).then(function(response) {
                getPosts();
            }, function(error){
                console.log(error);
            });
        };
    
        $scope.vote = function(id, direction, karmaPoints) {
            FirebaseService.vote(id, direction, karmaPoints).then(function(response) {
                getPosts();
            }, function(error){
                console.log(error);
            });
        }
    });