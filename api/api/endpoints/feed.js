var _ 					= require('underscore');
var qs 					= require("querystring");
var request 			= require('request');
var cheerio 			= require("cheerio");
var http 				= require("http");

// Users
function api() {
	
}
api.prototype.init = function(Gamify, callback){
	var scope = this;
	
	this.Gamify = Gamify;
	
	var FeedParser 		= require('feedparser');
	var request 		= require('request');
	
	var feeds = {
		"top_stories": {
			name:	"Top Stories",
			feed:	"http://feeds.bbci.co.uk/news/rss.xml"
		},
		"world": {
			name:	"World",
			feed:	"http://feeds.bbci.co.uk/news/world/rss.xml"
		},
		"business": {
			name:	"Business",
			feed:	"http://feeds.bbci.co.uk/news/business/rss.xml"
		},
		"tech": {
			name:	"Technology",
			feed:	"http://feeds.bbci.co.uk/news/technology/rss.xml"
		},
	};
	
	// Return the methods
	var methods = {
		
		categories: {
			require:		[],
			auth:			false,
			description:	"List the available categories",
			params:			{},
			status:			'stable',
			version:		1,
			callback:		function(params, req, res, callback) {
				callback(feeds);
			}
		},
		stories: {
			require:		['category'],
			auth:			false,
			description:	"List the available categories",
			params:			{},
			status:			'stable',
			version:		1,
			callback:		function(params, req, res, callback) {
				var req = request(feeds[params.category].feed);
				var feedparser = new FeedParser();
				
				req.on('error', function (error) {
					callback(Gamify.api.errorResponse("Failed to load the news feed."));
				});
				req.on('response', function (res) {
					var stream = this;
				
					if (res.statusCode != 200) return this.emit('error', new Error('Bad status code'));
				
					stream.pipe(feedparser);
				});
				
				
				var news = [];
				
				
				
				feedparser.on('error', function(error) {
					callback(Gamify.api.errorResponse("Failed to load the news feed."));
				});
				feedparser.on('readable', function() {
					// This is where the action is!
					var stream = this;
					var meta = this.meta; // **NOTE** the "meta" is always available in the context of the feedparser instance
					var item;
					
					while (item = stream.read()) {
						news.push({
							title:			item.title,
							description:	item.description,
							summary:		item.summary,
							url:			item.link,
							guid:			item.guid,
							image:			item.image
						})
					}
				});
				feedparser.on('end', function() {
					
					// Limit the amount of news
					news = news.slice(0,5);
					
					var stack = new Gamify.stack();
					var output = [];
					_.each(news, function(story) {
						stack.add(function(p, cb) {
							Gamify.data.stories.get(story.guid, story.url, function(summary) {
								if (summary) {
									story.summary = summary;
								}
								output.push(story);
								cb();
							});
						});
					});
					stack.process(function() {
						callback(output);
					}, true);
					
					
				});
			}
		},
		summary: {
			require:		['guid'],
			auth:			false,
			description:	"Get a summary from the guid",
			params:			{},
			status:			'stable',
			version:		1,
			callback:		function(params, req, res, callback) {
				callback(Gamify.data.stories);
			}
		}
	};
	
	// Init a connection
	this.mongo	= new this.Gamify.mongo({database:Gamify.settings.db});
	this.mongo.init(function() {
		callback(methods);
	});
}
exports.api = api;