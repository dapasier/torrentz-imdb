var pathName = location.pathname.replace(/\//g, '');
if (pathName.match(/search/)) {
	var items = document.querySelectorAll('.results dl');
	var port = chrome.runtime.connect({
		name : "omdb"
	});
	port.onMessage.addListener(function(msg) {
		var result = msg.result;
		var item = items[msg.idx];
		var rating = result.imdbRating;
		if (!isNaN(rating)) {
			var dd = item.querySelector('dd');
			var dt = item.querySelector('dt');

			var span = document.createElement('span');
			span.setAttribute('class', 'imdb');
			
			var metascore = result.Metascore;
			var metascoreHTML = '';
			
			if (metascore !== 'N/A') {
				metascoreHTML = 'Metascore: ' + metascore + '/100<br /><br />'
			}

			var awards = result.Awards;
			var awardsHTML = '';
			
			if (awards !== 'N/A') {
				awardsHTML = '<tr><td><b>Awards: </b></td><td>' + result.Awards + '</td></tr>'
			}
			
			span.innerHTML = '<a href="http://www.imdb.com/title/' + result.imdbID + '" target="_blank" class="imdb-tooltip">' +
				'<div style="background-color:hsl(' + rating * 12 + ', 90%, 45%);" class="imdb-rating">' + rating + '</div>' +
				'<span>' +
					'<img src="' + result.Poster + '" />' +
					'<b class="imdb-title">' + result.Title + '</b> (' + result.Year + ')<br />' +
					result.Runtime + ' - ' + result.Genre + '<br /><br />' +
					'Ratings: ' + rating + '/10 from ' + result.imdbVotes + ' users<br />' +
					metascoreHTML +
					result.Plot + '<br /><br />' +										
					'<table>' +
						'<tr><td><b>Country: </b></td><td>' + result.Country + '</td></tr>' +
						'<tr><td><b>Language: </b></td><td>' + result.Language + '</td></tr>' +
						'<tr><td><b>Released: </b></td><td>' + result.Released + '</td></tr>' +
						awardsHTML +
						'<tr><td><b>Director: </b></td><td>' + result.Director + '</td></tr>' +
						'<tr><td><b>Writer: </b></td><td>' + result.Writer + '</td></tr>' +
						'<tr><td><b>Actors: </b></td><td>' + result.Actors + '</td></tr>' +
					'</table>' +
				'</span>' +
			'</a>';

			dd.querySelector('.v').insertAdjacentElement('beforeBegin', span);

			var spanWidth = parseInt(window.getComputedStyle(span).width);
			dd.style.width = (parseInt(window.getComputedStyle(dd).width) + spanWidth) + 'px';
			dt.style.width = (parseInt(window.getComputedStyle(dt).width) - spanWidth / 2) + 'px';
		}
	});

	for (var i = 0; i < items.length; i++) {
		(function() {
			var item = items[i];
			var titleLink = item.querySelector('dt a');
			if (titleLink && item.querySelector('dt').innerHTML.match(/movies/)) {
				var parts = titleLink.innerHTML.replace(/<[^>]*>/g, '').match(/(.+?)([0-9]{4})/);
				if (parts) {
					port.postMessage({
						parts : parts,
						idx : i
					});
				}
			}
		})();
	}
}
