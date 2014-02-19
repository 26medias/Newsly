var _ 					= require('underscore');
var nlpsum				= require('nlpsum').main;
var sum 				= new nlpsum();
var cheerio 			= require("cheerio");
var http 				= require("http");

exports.dataProvider = function (Gamify) {
	
	var stories = {};
	
	Gamify.data.stories = new (function() {
		
		console.log("Stories buffer loaded.");
		
		
		var scope 				= this;
		
		this.get = function(guid, url, callback) {
			Gamify.log("Checking...", guid);
			if (stories[guid]) {
				callback(stories[guid]);
			} else {
				http.get(url, function(res) {
					var data = "";
					res.on('data', function (chunk) {
						data += chunk;
					});
					res.on("end", function() {
						if (data) {
							var text = "";
							// console.log(data);
							var $ = cheerio.load(data);
							$(".story-body p").each(function(i, e) {
								text += $(e).text()+"\r\n\r\n";
							});
							stories[guid] = sum.sinWordFrequencySummary(text, 5).text;
							Gamify.log("Summary ",stories[guid]);
							callback(stories[guid]);
						} else {
							callback(false);
						}
					});
				}).on("error", function() {
					callback(false);
				});
			}
			
		};
		
	})();
	
};