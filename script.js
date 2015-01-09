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
			span.innerHTML = '<a title="' + result.Runtime + '" href="http://www.imdb.com/title/' + result.imdbID
					+ '/" target="_blank"><div style="background-color:hsl(' + rating * 12 + ', 90%, 45%);" class="imdb-rating">' + rating
					+ '</div></a>';
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
