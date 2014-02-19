var newsApp = angular.module('newsApp', ['NewsModel', 'hmTouchevents']);


// Index: http://localhost/views/news/index.html

newsApp.controller('IndexCtrl', function ($scope, newslyApi) {
	
	$scope.loadingCategories = true;
	
	
	newslyApi.categories().then(function(data) {
		$scope.loadingCategories = false;
		if (data) {
			$scope.categories = data;
		}
	});
	
	$scope.cat = function(category) {
		webView = new steroids.views.WebView("/views/news/show.html?id="+category);
		steroids.layers.push(webView);
		steroids.view.navigationBar.hide();
	};
	
	steroids.view.navigationBar.hide();
	
	// -- Native navigation
	//steroids.view.navigationBar.show("News index");

});


// Show: http://localhost/views/news/show.html?id=<id>

newsApp.controller('ShowCtrl', function ($scope, newslyApi) {
	
	newslyApi.stories(steroids.view.params.id).then(function(data) {
		if (data) {
			$scope.stories = data;
		}
	});
	
	steroids.view.navigationBar.show("News: " + steroids.view.params.id );
	/*
	// Fetch all objects from the local JSON (see app/models/news.js)
	NewsRestangular.all('news').getList().then( function(newss) {
		// Then select the one based on the view's id query parameter
		$scope.news = $filter('filter')(newss, {news_id: steroids.view.params['id']})[0];
	});

	// -- Native navigation
	steroids.view.navigationBar.show("News: " + steroids.view.params.id );
	*/
});
