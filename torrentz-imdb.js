function toHours(mins) {
	mins = parseInt(mins)
	return Math.floor(mins / 60) + "h " + mins % 60 + "min";
}

function imdbBuildRating(rating, error) {
	var ratingHTML;
	var ratingInner;
	var hue;
	var sat;
	var lev;

	if (rating !== 'N/A' && rating != undefined) {
		hue = rating * 12;
		sat = 90;
		lev = 45;
		ratingInner = rating;
	} else {
		hue = 360;
		sat = 35;
		lev = 90;
		ratingInner = '_._';
	};

	if (error) {
		hue = 360;
		sat = 100;
		lev = 100;
	} else {
		error = '';
	};

	ratingHTML = '<span style="background-color:hsl(' + hue + ', ' + sat + '%, ' + lev + '%);" class="imdb-rating" title="' + error + '" >' + ratingInner + '</span>';

	return ratingHTML;
};

function imdbBuildHTML(omdbResult) {
	var imdbRatingHTML;

	if (omdbResult.Response !== 'False' && omdbResult.imdbId !== 'N/A') {
		var posterHTML = '';
		if (omdbResult.Poster !== 'N/A') {
			posterHTML = '<img src="' + omdbResult.Poster + '" class="imdb-poster" />';
		} else {
			posterHTML = '<img src="http://www.imdb.com/images/nopicture/large/film.png" class="imdb-poster" />';
		}

		var runtimeHTML = '';
		if (omdbResult.Runtime !== 'N/A') {
			runtimeHTML = toHours(omdbResult.Runtime) + ' - ';
		}

		var rartingVotesHTML = '';
		if (omdbResult.imdbRating !== 'N/A') {
			rartingVotesHTML = 'Ratings: ' + omdbResult.imdbRating + ' from ' + omdbResult.imdbVotes + ' users<br />';
		}

		var metascoreHTML = '';
		if (omdbResult.Metascore !== 'N/A') {
			metascoreHTML = 'Metascore: ' + omdbResult.Metascore + '%';
		}

		var plotHTML = '';
		if (omdbResult.Plot !== 'N/A') {
			plotHTML = omdbResult.Plot + '<br /><br />';
		}

		var awardsHTML = '';
		if (omdbResult.Awards !== 'N/A') {
			awardsHTML = '<tr><td><b>Awards: </b></td><td>' + omdbResult.Awards + '</td></tr>';
		}

		var ratingHTML = imdbBuildRating(omdbResult.imdbRating, omdbResult.Error);

		imdbRatingHTML = '<a href="http://www.imdb.com/title/' + omdbResult.imdbID + '" target="_blank" class="imdb-link">' +
				ratingHTML +
				'<span class="imdb-tooltip">' +
					posterHTML +
					'<b class="imdb-title">' + omdbResult.Title + '</b> (' + omdbResult.Year + ')<br />' +
					runtimeHTML + omdbResult.Genre + '<br /><br />' +
					rartingVotesHTML +
					metascoreHTML + '<br /><br />' +
					plotHTML +
					'<table>' +
						'<tr><td><b>Country: </b></td><td>' + omdbResult.Country + '</td></tr>' +
						'<tr><td><b>Language: </b></td><td>' + omdbResult.Language + '</td></tr>' +
						'<tr><td><b>Released: </b></td><td>' + omdbResult.Released + '</td></tr>' +
						awardsHTML +
						'<tr><td><b>Director: </b></td><td>' + omdbResult.Director + '</td></tr>' +
						'<tr><td><b>Writer: </b></td><td>' + omdbResult.Writer + '</td></tr>' +
						'<tr><td><b>Actors: </b></td><td>' + omdbResult.Actors + '</td></tr>' +
					'</table>' +
				'</span>' +
			'</a>';
	} else {
		imdbRatingHTML = imdbBuildRating(omdbResult.imdbRating, omdbResult.Error);
	}

	return imdbRatingHTML;
};

function qualityBuildHTML(titleLink) {
	var quality;
	var qualityName;
	var qualityHTML;

	if (titleLink.match(/[\s>]CAM|[\s>]HQCAM/i)) {
		quality = 0;
		qualityName = 'CAM';
	} else if (titleLink.match(/[\s>]HDCAM/)) {
		quality = 1;
		qualityName = 'HD CAM';
	} else if (titleLink.match(/[\s>]TS|[\s>]TELESYNC/)) {
		quality = 2;
		qualityName = 'TS';
	} else if (titleLink.match(/[\s>]HDTS/)) {
		quality = 3;
		qualityName = 'HD TS';
	} else if (titleLink.match(/[\s>]TC/)) {
		quality = 4;
		qualityName = 'TC';
	} else if (titleLink.match(/[\s>]HDTC/)) {
		quality = 5;
		qualityName = 'HD TC';
	} else if (titleLink.match(/[\s>]R5/i)) {
		quality = 6;
		qualityName = 'Russia';
	} else if (titleLink.match(/[\s>]R6/i)) {
		quality = 6;
		qualityName = 'China';
	} else if (titleLink.match(/DVD(?:\s|<\/b>\s?)?Scr/i)) {
		quality = 7;
		qualityName = 'DVD Scr';
	} else if (titleLink.match(/HD(?:\s|<\/b>\s?)?Rip/i)) {
		quality = 8;
		qualityName = 'HD Rip';
	} else if (titleLink.match(/DVD(?:\s|<\/b>\s?)?Rip/i)) {
		quality = 9;
		qualityName = 'DVD Rip';
	} else if (titleLink.match(/[\s>]HDTV/i)) {
		quality = 10;
		qualityName = 'HDTV';
	} else if (titleLink.match(/WEB(?:\s|<\/b>\s?)?(?:DL|Rip)?/i)) {
		quality = 10;
		qualityName = 'WEB DL';
	} else if (titleLink.match(/B[DR](?:\s|<\/b>\s?)?(?:Rip)?/i)) {
		quality = 11;
		qualityName = 'BR Rip';
	} else {
		quality = -1;
		qualityName = 'unkn.';
	}

	if (quality >= 0) {
		qualityHTML = '<span style="background-color:hsl(' + quality * 10 + ', 90%, 45%);" class="quality">' + qualityName + '</span>';
	} else {
		qualityHTML = '<span style="background-color:hsl(360, 100%, 100%);" class="quality">' + qualityName + '</span>';
	}

	return qualityHTML;
}

function addColumn(item, spanHTML, spanClass) {
	var dt = item.querySelector('dt');
	var dd = item.querySelector('dd');

	var span = document.createElement('span');
	span.setAttribute('class', spanClass);

	span.innerHTML = spanHTML;

	dd.querySelector('.v').insertAdjacentElement('beforeBegin', span);

	var spanWidth = parseInt(window.getComputedStyle(span).width);
	dt.style.width = (parseInt(window.getComputedStyle(dt).width) - spanWidth) + 'px';
	dd.style.width = (parseInt(window.getComputedStyle(dd).width) + spanWidth) + 'px';
}

function parseTitle(link) {
	var parts_out = [];
	var parts_1pass = [];
	var parts_2pass = [];
	var title;
	var year;
	var season;
	var episode;

	//match title year
	parts_1pass = link.match(/(.+?)(\d{4}[^p])/);
	//match title year? season episode
	parts_2pass = link.match(/(.+?)(?:\d{4})?.?S(\d{2})E(\d{2})/i);

	if (parts_1pass || parts_2pass) {
		
		if (parts_1pass) {
			title = parts_1pass[1];
			year = parts_1pass[2];
		}

		if (parts_2pass) {
			title = parts_2pass[1];
			season = parts_2pass[2];
			episode = parts_2pass[3];
		}
		
		parts_out[1] = title;
		parts_out[2] = year;
		parts_out[3] = season;
		parts_out[4] = episode;
	}

	return parts_out;
}

var pathName = location.pathname.replace(/\//g, '');

if (pathName.match(/search|any|verified/)) {
	var items = document.querySelectorAll('.results dl');

	var port = chrome.runtime.connect({
		name: "omdb"
	});

	for (var i = 0; i < items.length; i++) {
		(function () {
			var item = items[i];			

			if (item.querySelector('dt').innerHTML.match(/movies|tv/)) {
				var titleLink = item.querySelector('dt a').innerHTML.replace(/<[^>]*>/g, '');

				if (titleLink)
					var parts = parseTitle(titleLink);

				if (parts) {
					port.postMessage({
						parts: parts,
						idx: i
					});
				}
			}
		})();
	}

	port.onMessage.addListener(function (msg) {
		var item = items[msg.idx];
		var imdbHTML;
		var titleLink;
		var qualityHTML;

		titleLink = item.querySelector('dt a').innerHTML;
		qualityHTML = qualityBuildHTML(titleLink);
		addColumn(item, qualityHTML, 'quality');

		imdbHTML = imdbBuildHTML(msg.result);
		addColumn(item, imdbHTML, 'imdb');
	});
}
