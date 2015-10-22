angular.module("reddit")

    .service('FirebaseService', function($http, $q) {
        var guid = function() {
            var s4 = function() {
                return Math.floor((1 + Math.random()) * 0x10000)
                    .toString(16)
                    .substring(1);
            }
            return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
                s4() + '-' + s4() + s4() + s4();
        }
    
        this.getPosts = function() {      
            var dfr = $q.defer();
            $http({
                method: "GET",
                url: "https://devmtn.firebaseio.com/posts.json"
            }).then(function(response){
                dfr.resolve(response.data);
            }, function(error){
                throw error;
            })
            return dfr.promise;
        }
        
        this.addPost = function(post) {
            var dfr = $q.defer();
            post.timestamp = Date.now();
            post.comments = [];
            post.karma = 0;
            post.id = guid();
            $http({
                method: "PUT",
                url: "https://devmtn.firebaseio.com/posts/" + post.id + ".json",
                data: post
            }).then(function(response){
                dfr.resolve(response);
            }, function(error){
                console.log(error);
            })
            return dfr.promise;
        }
        
        this.vote = function(id, direction, karmaPoints) {
            if(direction === 'up') {
                karmaPoints++;
            } else if(direction === 'down'){
                karmaPoints--;
            }
            var dfr = $q.defer();
            $http({
                method: "PATCH",
                url: "https://devmtn.firebaseio.com/posts/" + id + ".json",
                data: {karma: karmaPoints}
            }).then(function(response){
                dfr.resolve(response);
            }, function(error){
                console.log(error);
            });
            return dfr.promise;
        }
        
        this.addComment = function(post, commentTxt) {
            if(!post.comments){
                post.comments = [];
            }
            post.comments.push({comment: commentTxt});
            console.log(post.comments);
            post.commentForm = '';
            var dfr = $q.defer();
            $http({
                method: "PATCH",
                url: "https://devmtn.firebaseio.com/posts/" + post.id + ".json",
                data: post
            }).then(function(response){
                dfr.resolve(response);
            }, function(error){
                console.log(error);
            });
            return dfr.promise;
        }
    });