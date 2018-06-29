var orderKeyArr, pageIdArr1, pageIdArr2,
		dialog, form;


$(function() {

	createSortable();
	
	$("#pages li").dblclick(function() { window.location.href = "/admin/page/?page_id=" + $(this).data("page_id"); });

	$("#pages li .btn-props").click(showPropertiesDialog);

	$("#pages li .btn-parts").click(function() { window.location.href = "/admin/page/?page_id=" + $(this.parentNode.parentNode).data("page_id"); });

	$('#pages li .btn-delete').click(function( event ) {
		if( confirm('Речь об удалении страницы. Вы уверены?') ) {
			deletePage( $(this.parentNode.parentNode).data('page_id') );
		}
	});

	dialog = $('#form-updatepage').dialog({
		autoOpen: false,
	  	width: 600,
	  	modal: true,
	  	buttons: {
			'Сохранить': function() {
				updatePage([getDialogData()]);
				dialog.dialog("close");
			}
	  	},
	  	close: function() {
			form[0].reset();
	  	}
	});

	form = dialog.find('form')
		.on( 'submit', function( event ) {
			event.preventDefault();
			updatePage([getDialogData()]);
			dialog.dialog("close");
		});

	function deletePage(pageId) {
		if( !pageId ) return;

		jQuery.ajax(`/rest/page/?page_id=${pageId}`, {
			method: "DELETE",
			dataType: "json",
			cache: false
		})
			.done(function(data) {
				// delete html element, represented that page
				if( data.error_code != 0 ) {
					alert( 'Ошибка на сервере! Страница не удалена.' ) 
				} else {
					$(`#pages li[data-page_id="${pageId}"]`).hide(300);
				}
			});
	}

	function showPropertiesDialog(e) {
		var pageId = $(e.target).parents("li").data("page_id")
		// TODO: show progress here
		if( !pageId ) return;
		jQuery.ajax("/rest/page/?page_id=" + pageId, {
			method: "GET",
			dataType: "json",
			cache: false
		})
			.done(function(page) {
				$("#page-title").val(page.title);
				$("#page-note").val(page.note);
				$("#page-page_id").val(page.page_id);
				$('#page-enabled').prop('checked', ( page.enabled == 1 ));
				dialog.dialog("open");
			});
	}

	function getDialogData() {
		if ( !$('#page-page_id' ).val()) return {}
		r = {
			page_id: $('#page-page_id').val(),
			title: $('#page-title').val(),
			note: $('#page-note').val(),
			enabled: $('#page-enabled').prop('checked') ? 1 : 0
		};
		return r;
	}

	function updatePage(data) {
		if( !data ) return;
		console.log(data);
		jQuery.ajax("/rest/page/", {
			method: "PUT",
			dataType: "json",
			cache: false,
			data: {data: JSON.stringify(data)}
		})
			.done(function(response) {
				if( response.error != 0 ) alert("Error! Code is " + response.error)
			});
	}

	function createSortable() {
		orderKeyArr = getSortableItemDataArr('original');
		pageIdArr1 = getSortableItemDataArr('page_id');
		$("#pages")
			.sortable({
				update: function(event, ui) {
					pageIdArr2 = getSortableItemDataArr('page_id');
					updatePage(getSortableDataDiff(orderKeyArr, pageIdArr1, pageIdArr2));
					pageIdArr1 = pageIdArr2;
				}
			})
			.disableSelection();
	}

	function getSortableItemDataArr(name) {
		r = new Array()
		$("#pages li").each(function(index) {
			r.push($(this).data(name));
		});
		return r;
	}

	function getSortableDataDiff(orderKeyArr, pageIdArr1, pageIdArr2) {
		var r = new Array();
		for(var i in orderKeyArr) {
			if( pageIdArr1[i] != pageIdArr2[i] ) {
				r.push({original: orderKeyArr[i], page_id: pageIdArr2[i]});
			}
		}
		return r;
	}

});