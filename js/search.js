(function () {
	function getQueryVariable(variable) {
		var query = window.location.search.substring(1),
			vars = query.split("&");

		for (var i = 0; i < vars.length; i++) {
			var pair = vars[i].split("=");

			if (pair[0] === variable) {
				return decodeURIComponent(pair[1].replace(/\+/g, '%20')).trim();
			}
		}
	}

	function getPreview(query, content, previewLength) {
		previewLength = previewLength || (content.length * 2);

		var parts = query.split(" "),
			match = content.toLowerCase().indexOf(query.toLowerCase()),
			matchLength = query.length,
			preview;

		// Find a relevant location in content
		for (var i = 0; i < parts.length; i++) {
			if (match >= 0) {
				break;
			}

			match = content.toLowerCase().indexOf(parts[i].toLowerCase());
			matchLength = parts[i].length;
		}

		// Create preview
		if (match >= 0) {
			var start = match - (previewLength / 2),
				end = start > 0 ? match + matchLength + (previewLength / 2) : previewLength;

			preview = content.substring(start, end).trim();

			if (start > 0) {
				preview = "..." + preview;
			}

			if (end < content.length) {
				preview = preview + "...";
			}

			// Highlight query parts
			preview = preview.replace(new RegExp("(" + parts.join("|") + ")", "gi"), "<strong>$1</strong>");
		} else {
			// Use start of content if no match found
			preview = content.substring(0, previewLength).trim() + (content.length > previewLength ? "..." : "");
		}

		return preview;
	}

	function displaySearchResults(results, query) {
		var spotSearchResultsEl = document.getElementById("spot-search-results"),
			userCenterSearchResultsEl = document.getElementById("user-center-search-results"),
			spotSearchProcessEl = document.getElementById("spot-search-process"),
			userCenterSearchProcessEl = document.getElementById("user-center-search-process");

		if (results.length) {
			var spotResultsHTML = "";
			var userCenterResultsHTML = "";
			results.forEach(function (result) {
				var item = window.data[result.ref],
					contentPreview = getPreview(query, item.content, 170),
					titlePreview = getPreview(query, item.title);

				if(item.category.indexOf("user_center_") == 0){
					userCenterResultsHTML += "<li><h4><a href='" + item.url + "'>" + titlePreview + "</a></h4><p><small>" + contentPreview + "</small></p></li>";
				} else {
					spotResultsHTML += "<li><h4><a href='" + item.url + "'>" + titlePreview + "</a></h4><p><small>" + contentPreview + "</small></p></li>";
				}
			});

			spotSearchResultsEl.innerHTML = spotResultsHTML;
			userCenterSearchResultsEl.innerHTML = userCenterResultsHTML;
			spotSearchProcessEl.innerText = "Showing";
			userCenterSearchProcessEl.innerText = "Showing";
		} else {
			spotSearchResultsEl.style.display = "none";
			userCenterSearchResultsEl.style.display = "none";
			spotSearchProcessEl.innerText = "No";
			userCenterSearchProcessEl.innerText = "No";
		}
	}

	window.index = lunr(function () {
		this.field("id");
		this.field("title", {boost: 10});
		this.field("category");
		this.field("url");
		this.field("content");
	});

	var query = decodeURIComponent((getQueryVariable("q") || "").replace(/\+/g, "%20")),
		spotSearchQueryContainerEl = document.getElementById("spot-search-query-container"),
		userCenterSearchQueryContainerEl = document.getElementById("user-center-search-query-container"),
		spotSearchQueryEl = document.getElementById("spot-search-query"),
		userCenterSearchQueryEl = document.getElementById("user-center-search-query"),
		searchInputEl = document.getElementById("search-input");

	searchInputEl.value = query;
	spotSearchQueryEl.innerText = query;
	userCenterSearchQueryEl.innerText = query;
	spotSearchQueryContainerEl.style.display = "inline";
	userCenterSearchQueryContainerEl.style.display = "inline";

	for (var key in window.data) {
		window.index.add(window.data[key]);
	}

	displaySearchResults(window.index.search(query), query); // Hand the results off to be displayed

})();
