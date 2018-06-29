$(function() {

	var gDrawTool,
		gOrderKeyArr, gPartIdArr1, gPartIdArr2,
		gPartId = null, // part currently active
		gCanvasWidth = 0,
		gCanvasHeight = 0,
		gAnimationSpeed = 300;

	jQuery.ajax("/rest/page/?page_id=" + PAGE_ID, { // list of parts for given page
		method: "GET",
		dataType: "json",
		cache: false
	})
		.done(function(data) {

			var pageImageHref = getPagefileHref(BOOK_ID, data.filename, 'm');

			getImageSize(pageImageHref, function(){
				if ( this.height > this.width ) {
					// портрет
					gCanvasHeight = $('#page').height() - 85;
					gCanvasWidth = this.width * (gCanvasHeight / this.height)
				}
				else {
					// пейзаж
					gCanvasWidth = $('#page').width() - 50;
					gCanvasHeight = this.height * (gCanvasWidth / this.width)
				}

				$('#canvas-wrapper').css('left', "-" + gCanvasWidth/2 + "px");
				$('#canvas-wrapper').css('top', "-" + gCanvasHeight/2 + "px");

				gDrawTool = new DrawPolygonTool("canvas-wrapper", "canvas", pageImageHref, gCanvasWidth, gCanvasHeight);

				if( data.parts && data.parts.length > 0 ) {
					for ( var i in data.parts ) appendPartControl(data.parts[i].part_id, data.parts[i].path, data.parts[i].content, data.parts[i].order_key);
				}
				else {
					$('#help').fadeIn();
				}

				gDrawTool.eventStopDrawing = function(){
					$("#part_id_" + gPartId).data('path', this.getCoordinates());
					data = [{
						part_id: gPartId,
						path: this.getJson()
					}];
					updatePart(data);
					gPartId = null;
					$('.part-control-wrapper .btn-draw').blur().removeClass('ui-state-active');
				};

				gDrawTool.eventKeypressEsc = function(){
					$('.part-control-wrapper .btn-draw').blur().removeClass('ui-state-active');
				};

				gDrawTool.eventMousemove = function(e, mouseX, mouseY){
					// TODO: если есть пересечение полигонов, отрисовывается только первый. хорошо бы чтобы все
					var t = this;
					$('#text .part-control-wrapper').each(function(){
						var path = $(this).data('path');
						if( !t.isDrawing && inPolygon(mouseX, mouseY, path) ) {
							t.setCoordinates(path);
							$('#text .part-control-wrapper').removeClass('highlight');
							$(this).addClass('highlight');
							//t.clear();
						}
					});
				};

				createSortable();
				createEditable();
			});

			$("#btn-zoom-page").click(function(e){ window.open(gDrawTool.getImgUrl()); });

			$("#btn-return").click(function(e) { window.history.back(); });

			$("#btn-add-block")
				.click(function(e){
					jQuery.ajax("/rest/part/?page_id=" + PAGE_ID, {
						method: "POST",
						dataType: "json",
						cache: false
					})
						.done(function(data) {
							if( data.error != 0 ) {
								alert("Error! Code is " + data.error);
							}
							else {
								$('#help').hide();
								appendPartControl(data.data.part_id, '', '', data.data.order_key);
								gOrderKeyArr = getSortableItemDataArr('order_key');
								gPartIdArr1  = getSortableItemDataArr('part_id');
								// Scroll to created control
								$('html, body').animate({
        							scrollTop: $('#text .part-control-wrapper:last-child').offset().top
    							}, 1000);
    							// И еще откроем окошко, чтоб блин светлее было.
    							showEditor(data.data.part_id, '')
							}
						});
				});
		});


	function appendPartControl(partId, path, content, orderKey) {

		$('#text').append(getPartControlHtml(partId, path, content, orderKey));

		$('#text .part-control-wrapper:last-child')
			.hover(
				function() {
					gDrawTool.setCoordinates($(this).data('path'));
					$('#text .part-control-wrapper').removeClass('highlight');
					$(this).addClass('highlight');
				},
				function() {
					var isEditorOpened = ($('#editor').css('display') == 'block');
					if(!gDrawTool.isDrawing && !isEditorOpened ) {
						gDrawTool.clearCoordinates();
						$('#text .part-control-wrapper').removeClass('highlight');
					}
				}
			);

		$('.part-control-wrapper:last-child .btn-draw')
			.click(function(e){
				gPartId = $(this).parent().parent().data('part_id');
				$('.part-control-wrapper .btn-draw').removeClass('ui-state-active');
				$(this).addClass('ui-state-active');
				gDrawTool.start();
			});

		$('.part-control-wrapper:last-child .btn-delete')
			.click(function(e){
				var elem = this.parentNode.parentNode;
				if( !confirm("Речь об удалении блока. Вы уверены?") ) return;
				jQuery.ajax("/rest/part/?part_id=" + $(elem).data('part_id'), {
					method: "DELETE",
					dataType: "json",
					cache: false
				})
					.done(function(data) {
						if( data.error != 0 ) {
							alert("Error! Code is " + data.error)
						}
						else {
							$(elem).animate({height:0}, 200, 'swing', function() { $(this).remove(); });
						}
					});

			});

		$('.part-control-wrapper:last-child .btn-edit')
			.click(function(e) {
				var partId = $(this).parent().parent().data('part_id'),
					content = $(this).parent().next().html();
				showEditor( partId, content );
				/*
				var part_id = $(this).parent().parent().data('part_id');
				tinyMCE.get('editor-textarea').setContent( $(this).parent().next().html() );
				tinyMCE.get('editor-textarea').focus();
				$('#save-button').data('part_id', part_id);
				$('#editor').show(gAnimationSpeed);
				*/
			});
	}


	function showEditor(partId, content) {
		tinyMCE.get('editor-textarea').setContent( content );
		tinyMCE.get('editor-textarea').focus();
		$('#save-button').data('part_id', partId);
		$('#editor').show(gAnimationSpeed);
	}


	function getPartControlHtml(partId, path, content, orderKey) {
		r  = '<div class="part-control-wrapper" id="part_id_' + partId + '" data-order_key="' + orderKey + '" data-part_id="' + partId + '" data-path="' + JSON.stringify(recalculatePath(path, [gCanvasWidth, gCanvasHeight])) + '">';
		r += '<div class="tb">';
		r += '<button class="ui-button ui-widget ui-corner-all ui-button-icon-only btn-draw" title="Выделить область"><span class="ui-icon ui-icon-link"></span> Выделить область</button>';
		r += '<button class="ui-button ui-widget ui-corner-all ui-button-icon-only btn-edit" title="Редактировать"><span class="ui-icon ui-icon-pencil"></span> Редактировать</button>';
		r += '<span class="ui-button ui-widget ui-corner-all ui-button-icon-only btn-sort" title="Сортировать"><span class="ui-icon ui-icon-arrowthick-2-n-s"></span> Сортировать</span>';
		r += '<button class="ui-button ui-widget ui-corner-all ui-button-icon-only btn-delete" title="Удалить"><span class="ui-icon ui-icon-close"></span> Удалить</button>';
		r += '</div>';
		r += '<div class="txt"">' + content + '</div>';
		r += '</div>';
		return r;
	}


	function createEditable() {

		tinymce.init({
			selector: '#editor-textarea',
			statusbar: false,
			plugins: ['lists', 'fullscreen', 'code'],
			height: $('#editor').height() - 130, // TODO:150 подобрано экспериментально, разобраться.
			toolbar: 'bold italic | underline strikethrough | styleselect | bullist numlist outdent indent | alignleft aligncenter alignright | subscript superscript | removeformat fullscreen code',
			menu: {},
			branding: false
		});

		$('#save-button').click(function(e){
			var part_id = $(this).data('part_id'),
				content = tinyMCE.get('editor-textarea').getContent()
			data = [{
				part_id: part_id,
				content: content
			}];
			$('#part_id_' + part_id + ' .txt').html(content);
			$('#editor').hide(gAnimationSpeed);
			updatePart(data);
		});

		$('#cancel-button').click(function(e){
			$('#editor').hide(gAnimationSpeed);
		});
	}


	function createSortable() {
		gOrderKeyArr = getSortableItemDataArr('order_key');
		gPartIdArr1 = getSortableItemDataArr('part_id');
		$("#text")
			.sortable({
				handle: ".btn-sort",
				update: function(event, ui) {
					gPartIdArr2 = getSortableItemDataArr('part_id');
					updatePart(getSortableDataDiff(gOrderKeyArr, gPartIdArr1, gPartIdArr2));
					gPartIdArr1 = gPartIdArr2;
				}
			})
			.disableSelection();
	}

	function getSortableItemDataArr(name) {
		r = new Array()
		$("#text div").each(function(index){
			r.push($(this).data(name));
		});
		return r;
	}

	function getSortableDataDiff(gOrderKeyArr, gPartIdArr1, gPartIdArr2) {
		var r = new Array();
		for(var i in gOrderKeyArr) {
			if( gPartIdArr1[i] != gPartIdArr2[i] ) {
				r.push({order_key: gOrderKeyArr[i], part_id: gPartIdArr2[i]});
			}
		}
		return r;
	}


	function updatePart(data) {
		if( !data ) return;
		jQuery.ajax("/rest/part/", {
			method: "PUT",
			dataType: "json",
			cache: false,
			data: {data: JSON.stringify(data)}
		})
			.done(function(data) {
				if( data.error != 0 ) alert("Error! Code is " + data.error)
			});
	}

	// Пересчет path в соответствии с текущим масштабом
	function recalculatePath(path, currentScale) {
		if (path == '') return;
		var p = JSON.parse(path),
			scale = p[0],
			points = p[1],
			r = [];

		// По идее kx всегда равен ky. Если это не так, то и хер с ним.
		kx = currentScale[0] / scale[0];
		ky = currentScale[1] / scale[1];
		for (i in points) {
			r.push([points[i][0] * kx, points[i][1] * ky]);
		}
		return r;
	}

	// Определяем принадлежность точки полигону
	function inPolygon(x, y, path) {
		var xp = [] // Массив X-координат полигона
		var yp = [] // Массив Y-координат полигона
		for (i in path) {
			xp.push(path[i][0]);
			yp.push(path[i][1]);
		}
		var npol = xp.length;
			j = npol - 1;
		var c = 0;
		for (i = 0; i < npol;i++){
			if ((((yp[i]<=y) && (y<yp[j])) || ((yp[j]<=y) && (y<yp[i]))) && (x > (xp[j] - xp[i]) * (y - yp[i]) / (yp[j] - yp[i]) + xp[i])) {
				c = !c
			}
			j = i;
		}
		return c;
	}


});


	