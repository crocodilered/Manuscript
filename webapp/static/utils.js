function getImageSize(imgUri, onload) {
	var img = new Image()
	img.src = imgUri;
	img.onload = onload;
}


function getPagefileHref(bookId, filename, mode) {
	/*
	 * mode is s, m or l
	 */
	var pad = function(num) { var s = '000000000' + num; return s.substr(s.length-6); },
		dir = '/small/';
	if (mode == 'm') dir = '/medium/';
	if (mode == 'l') dir = '/large/';
	return '/i/pages/' + pad(bookId) + dir + filename;
}
