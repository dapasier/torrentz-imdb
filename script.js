var pathName = location.pathname.replace(/\//g, "");
if(pathName.match(/search/)) {
	var items = document.querySelectorAll(".results dl");
	
	for(var i = 0; i < items.length; i++) {
		(function() {
			var item = items[i];
			var titleLink = item.querySelector("dt a");
			if(titleLink && item.querySelector("dt").innerHTML.match(/movies/)) {
				var parts = titleLink.innerHTML.replace(/<[^>]*>/g, "").match(/(.+?)([0-9]{4})/);
				if(parts) {
					var title = parts[1];
					var year = parts[2];
					
					var r = new XMLHttpRequest;
					r.open("GET", 'http://www.omdbapi.com/?t=' + title + '&y=' + year, true);
					r.onload = function () {
						var result = JSON.parse(r.responseText);
						if(result.Response !== "False") {
							var rating = result.imdbRating;
							if(!isNaN(rating))
								item.querySelector("dt").innerHTML += '<a title="' + result.Runtime + '" href="http://www.imdb.com/title/' + result.imdbID + '" target="_blank"><div style="background-color:hsl(' + rating * 12 + ', 90%, 50%);" class="imdb-rating">' + rating + '</div></a>';
						}
					};
					r.send();
				}
			}
		})();
	}
}