$(function() {

	jQuery.ajax('/rest/page/?page_id=' + PAGE_ID, {
		method: 'GET',
		dataType: 'json',
		cache: false
	})
	.done(function(data) {
		//$('h1').html(data.title + ' <small>(' + data.toc_title + ')</small>')
		//$('#image').html('<img src='/i/pages/medium/' + data.filename + ''>');

		console.log(data);

		var pageImageHref = getPagefileHref(BOOK_ID, data.filename, 'm');

		getImageSize(pageImageHref, function() {
			var viewportW = $('#image').outerWidth(),
				viewportH = $(window).height() - $('#_header').outerHeight(),
				padding = 60;

			if ( this.height > this.width ) {
				// портрет
				CANVAS_HEIGHT = viewportH - padding;
				CANVAS_WIDTH = this.width * (CANVAS_HEIGHT / this.height);
				if( CANVAS_WIDTH > viewportW ) {
					CANVAS_WIDTH = viewportW - padding;
					CANVAS_HEIGHT = this.height * (CANVAS_WIDTH / this.width);
				}
			}
			else {
				// пейзаж
				CANVAS_WIDTH = viewportW - padding;
				CANVAS_HEIGHT = this.height * (CANVAS_WIDTH / this.width);
				if( CANVAS_HEIGHT > viewportH ) {
					CANVAS_HEIGHT = viewportH - padding;
					CANVAS_WIDTH = this.width * (CANVAS_HEIGHT / this.height);
				}
			}

			DRAW_TOOL = new DrawPolygonTool('canvas-wrapper', 'canvas', pageImageHref, CANVAS_WIDTH, CANVAS_HEIGHT);

			// позиционирование img 
			var w = $(window).height(),
				h = $('#_header').outerHeight(),
				c = $('#canvas-position').outerHeight(),
				imgTop = (w - c) / 2 + h/2;
			$('.page #image').css('top', imgTop + 'px');

			DRAW_TOOL.reOffset();

			for( var i in data.parts ) $('#parts').append( renderPart(data.parts[i]) );

			// Hover текстовых блоков
			$('#parts .part').hover(
				function() {
					DRAW_TOOL.setCoordinates($(this).data('path'));
					$('#parts .part').removeClass('highlight');
					$(this).addClass('highlight');
				},
				function() {
					DRAW_TOOL.clearCoordinates();
					$('#parts .part').removeClass('highlight');
				}
			);

			var elemToScroll, // элемент, к которому в последний раз скролились
				canScroll = true; // 

			// Hover полигонов на канве
			DRAW_TOOL.eventMousemove = function(e, mouseX, mouseY) {
				// TODO: если есть пересечение полигонов, отрисовывается только первый. Возможно, нужно переделать.
				var preventClear = false,
					inPoly;
				$('#parts .part').each(function() {
					// $(this).data('path') нужно чпокнуть с учетом zoom и translate
					//console.log( DRAW_TOOL.zoomRate, DRAW_TOOL.translationX, DRAW_TOOL.translationY, $(this).data('path') );
					var path = [], x, y;
					for( i in $(this).data('path') ) {
						x = $(this).data('path')[i][0];
						y = $(this).data('path')[i][1];
						x = x * DRAW_TOOL.zoomRate;
						y = y * DRAW_TOOL.zoomRate;
						x = x + DRAW_TOOL.translationX;
						y = y + DRAW_TOOL.translationY;
						path.push([x, y]);
					}
					inPoly = inPolygon(mouseX, mouseY, path);
					preventClear = preventClear || inPoly;
					if( canScroll && elemToScroll != this && inPoly ) {
						elemToScroll = this;
						DRAW_TOOL.setCoordinates($(elemToScroll).data('path'));
						// если текст не попадает на экран, нужно до него доскролиться...
						// но делать это можно только один раз, иначе браузер начинает плющить
						canScroll = false;
						var scrollTo = $(elemToScroll).offset().top - $(window).outerHeight()/2 + (	$(elemToScroll).innerHeight()-50)/2;
						$('html, body').animate({ scrollTop: scrollTo }, 200, function() {
							$(elemToScroll).addClass('highlight');
							canScroll = true;
						});
					}
				});
				if( !preventClear ) {
					DRAW_TOOL.clearCoordinates();
					elemToScroll = null;
					$('#parts .part').removeClass('highlight');
				}
			};

			var bookId = data.book_id;

			// Еще навигацию нужно замутить
			jQuery.ajax('/rest/book/?load_complete=1&book_id=' + bookId, {
				method: 'GET',
				dataType: 'json',
				cache: false
			})
				.done(function(data) {
					$('#book-title').html(' — ' + data.title);
					$('#href-toc').attr('href', '/book/' + BOOK_ID);
					for(var i in data.pages) {
						if( data.pages[i].page_id == PAGE_ID ) {
							if( i == 0 ) {
								setHrefState('#href-prev', false);
								setHrefState('#href-next', true);
								if( data.pages[parseInt(i)+1] ) $('#href-next').attr('href', './?page_id=' + data.pages[parseInt(i)+1].page_id);
							}
							else if( i == data.pages.length-1 ) {
								setHrefState('#href-prev', true);
								setHrefState('#href-next', false);
								$('#href-prev').attr('href', './?page_id=' + data.pages[parseInt(i)-1].page_id);
							}
							else {
								setHrefState('#href-prev', true);
								setHrefState('#href-next', true);
								$('#href-prev').attr('href', './?page_id=' + data.pages[parseInt(i)-1].page_id);
								$('#href-next').attr('href', './?page_id=' + data.pages[parseInt(i)+1].page_id);
							}
						}
					}
				});
		});
	});

	$('#href-zoomin').click(function(e) { DRAW_TOOL.zoomIn(); return false; });
	$('#href-zoomout').click(function(e) { DRAW_TOOL.zoomOut(); return false; });
	$('#href-zoomreset').click(function(e) { DRAW_TOOL.zoom(1); return false; });

	$('#_header .page-navigation span').show();

	$(window).on('resize',function(){location.reload();});

});


function setHrefState(selector, state) {
	if( state ) {
		$(selector).removeClass('disabled');
	}
	else {
		$(selector).addClass('disabled');
		$(selector).attr('href', '#');
	}
}


function renderPart(part) {
	return '<div class="part" data-path="' + JSON.stringify(scalePath(part.path, [CANVAS_WIDTH, CANVAS_HEIGHT])) + '">' + part.content + '</div>';
}

/* ПОВТОР *********************************************************** */
// Пересчет path в соответствии с текущим масштабом
function scalePath(path, currentScale) {
	if (path == '') return;
	var p = JSON.parse(path),
		scale = p[0],
		points = p[1],
		r = [];

	// По идее kx всегда равен ky. Если это не так, то и хер с ним.
	kx = currentScale[0] / scale[0];
	ky = currentScale[1] / scale[1];
	for (i in points) r.push([points[i][0] * kx, points[i][1] * ky]);
	return r;
}

// Определяем принадлежность точки полигону
function inPolygon(x, y, path) {
	var xp = [], // Массив X-координат полигона
		yp = []; // Массив Y-координат полигона
	for( i in path ) {
		xp.push(path[i][0]);
		yp.push(path[i][1]);
	}
	var npol = xp.length,
		j = npol - 1,
		c = 0;
	for (i = 0; i < npol;i++) {
		if ((((yp[i]<=y) && (y<yp[j])) || ((yp[j]<=y) && (y<yp[i]))) && (x > (xp[j] - xp[i]) * (y - yp[i]) / (yp[j] - yp[i]) + xp[i])) c = !c;
		j = i;
	}
	return c ? true : false;
}
/* /ПОВТОР *********************************************************** */
