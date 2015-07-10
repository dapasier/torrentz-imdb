chrome.runtime.onConnect.addListener(function (port) {
	console.assert(port.name == "omdb");
	port.onMessage.addListener(function(msg) {
		var parts = msg.parts;
		var title = parts[1];
		var year = parts[2];
		var season = parts[3];
		var episode = parts[4];
		var url = 'http://www.omdbapi.com/?t=';

		if (title)
		    url = url + title;

		if (year)
		    url = url + '&y=' + year;

		if (season)
		    url = url + '&Season=' + season;

		if (episode)
		    url = url + '&Episode=' + episode;

		var r = new XMLHttpRequest;
		r.open('GET', url, true);
		r.onload = function() {
			var result = JSON.parse(r.responseText);
			port.postMessage({
					result : result,
					idx : msg.idx
			});		
		};
		r.send();
	});
});
