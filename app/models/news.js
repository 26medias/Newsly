(function() {
	
	// Protects views where angular is not loaded from errors
	if ( typeof angular == 'undefined' ) {
		return;
	};
	
	var IP = "192.168.0.13";
	
	var module = angular.module('NewsModel', ['restangular']);

	module.factory('newslyApi', function($http) {
		
		return {
			categories: function(callback) {
				var promise = $http.jsonp("http://"+IP+":8080/feed/categories/jsonp?callback=JSON_CALLBACK").then(function(response) {
					data = response.data;
					if (data.error) {
						alert(data.error.message);
						return false;
					} else {
						return data;
					}
				});
				return promise;
			},
			stories: function(category, callback) {
				alert("loading stories type "+category);
				var promise = $http.jsonp("http://"+IP+":8080/feed/stories/jsonp?category="+escape(category)+"&callback=JSON_CALLBACK").then(function(response) {
					data = response.data;
					if (data.error) {
						alert(data.error.message);
						return false;
					} else {
						return data;
					}
				});
				return promise;
			}
		};
		
	});
})();

