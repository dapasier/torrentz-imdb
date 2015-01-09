chrome.runtime.onConnect.addListener(function(port) {
	console.assert(port.name == "omdb");
	port.onMessage.addListener(function(msg) {
		var parts = msg.parts;
		var title = parts[1];
		var year = parts[2];

		var r = new XMLHttpRequest;
		r.open('GET', 'http://www.omdbapi.com/?t=' + title + '&y=' + year, true);
		r.onload = function() {
			var result = JSON.parse(r.responseText);
			if (result.Response !== 'False') {
				port.postMessage({
					result : result,
					idx : msg.idx
				});
			}
		};
		r.send();
	});
});
