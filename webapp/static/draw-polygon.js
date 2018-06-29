class DrawPolygonTool {

	constructor(wrapperElemId, canvasElemId, imgUrl, w, h) {
		this.width = w;
		this.height = h;

		this.wrapperElem = $("#" + wrapperElemId)[0];
		this.canvasElem = $("#" + canvasElemId)[0];

		this.imgUrl = imgUrl;

		$(this.wrapperElem).css('background-image', 'url(' + imgUrl + ')');
		$(this.wrapperElem).css('background-repeat', 'no-repeat');
		$(this.wrapperElem).css('background-position', '0 0');
		$(this.wrapperElem).css('background-color', '#555');
		$(this.wrapperElem).css('background-size', w + 'px ' + h + 'px');
		$(this.wrapperElem).css('width', w + 'px');
		$(this.wrapperElem).css('height', h + 'px');

		this.canvas = document.getElementById(canvasElemId);
		this.canvas.width = w;
		this.canvas.height = h;
		this.context = this.canvas.getContext("2d");
		this.context.lineWidth = 2;
		this.context.strokeStyle = '#0a6867';
		this.context.fillStyle = '#0a6867';
		this.context.globalAlpha = 0.2;

		this.coordsMousemove = this.coordsMousedown = [];
		this.isDrawing = false;

		this.offsetX = this.offsetY = null;
		this.reOffset();

		var self = this;

		$(this.canvasElem).mousedown( function(e, t=self){ t.handleMouseDown(e); } );
		$(this.canvasElem).mouseup( function(e, t=self){ t.handleMouseUp(e); } );
		$(this.canvasElem).mousemove( function(e, t=self){ t.handleMouseMove(e); } );
		$(this.canvasElem).dblclick( function(e, t=self){ t.handleMouseDblclick(e); } );
		$(document).keyup( function(e, t=self) { t.handleKeyDown(e); } );
		window.onscroll = function(e, t=self){ t.reOffset(); }

		this.isDragging = false;
		this.draggingStartX = 0;
		this.draggingStartY = 0;
		this.bgPosX = 0;
		this.bgPosY = 0;
		this.zoomRate = 1;
		this.translationX = 0;
		this.translationY = 0;
	}

	reOffset() {
		var rect = this.canvas.getBoundingClientRect();
		this.offsetX = rect.left;
		this.offsetY = rect.top;
	}

	handleKeyDown(e) {

		if( !this.isDrawing || this.coordsMousedown.length > 50 ) return;

		// TODO: тут был код 13 (Enter), но тогда почему-то обнулялся this.coordsMousedown. Разобраться почему.
		if( e.keyCode == 83 || e.keyCode == 13 ) { // Enter: finish to draw
			this.isDrawing = false;
			this.coordsMousemove = this.coordsMousedown.slice(0);
			this.draw(this.coordsMousedown);
			this.eventStopDrawing();
		}

		if( e.keyCode == 8 || e.keyCode == 46 ) { // Backspace OR Delete: clear last point
			var pair = this.coordsMousemove.pop(); // save last mouse pos
			this.coordsMousedown.pop(); // delete point
			this.coordsMousemove = this.coordsMousedown.slice(0);
			this.coordsMousemove.push(pair);
			this.draw(this.coordsMousemove);
			this.eventKeypressDel();
		}

		if( e.keyCode == 27 ) { // Escape: clear canvas
			this.isDrawing = false;
			this.clear();
			this.coordsMousemove = [];
			this.coordsMousedown = [];
			this.eventKeypressEsc();
		}
	}


	handleMouseDblclick(e) {
		if( this.isDrawing ) {
			this.isDrawing = false;
			this.coordsMousedown.pop();
			this.coordsMousedown.pop();
			this.coordsMousemove = this.coordsMousedown.slice(0);
			this.draw(this.coordsMousedown);
			this.eventStopDrawing();
		}
	}


	handleMouseDown(e) {
		if( this.coordsMousedown.length > 50 ) return;
		
		e.preventDefault();
		e.stopPropagation();

		if( this.isDrawing ) {
			// рисуем
			if ( this.coordsMousedown.length > 2 ) {
				var coords = this.coordsMousedown,
					x1 = coords[ coords.length - 1 ][0],
					y1 = coords[ coords.length - 1 ][1],
					x2 = parseInt(e.clientX - this.offsetX),
					y2 = parseInt(e.clientY - this.offsetY);

				for( var i=0; i<coords.length-2; i++ )
					if( this.isCrossing(x1, y1, x2, y2, coords[i][0], coords[i][1], coords[i+1][0], coords[i+1][1]) )
						return
			}
			this.saveMousePosition(e, this.coordsMousedown);
			this.saveMousePosition(e, this.coordsMousemove);
			this.draw(this.coordsMousedown);
		}
		else if( this.zoomRate > 1 ) {
			// drag&drop
			this.isDragging = true;
			this.draggingStartX = e.clientX;
			this.draggingStartY = e.clientY;
			var bgPosArr = $(this.wrapperElem).css('background-position').split(' ');
			this.bgPosX = parseInt(bgPosArr[0]);
			this.bgPosY = parseInt(bgPosArr[1]);
		}
	}


	handleMouseUp(e) {
		e.preventDefault();
		e.stopPropagation();
		if( this.isDragging ) {
			this.isDragging = false;
			this.draggingStartX = 0;
			this.draggingStartY = 0;
			// determine background-position-x and background-position-y
			var bgPosArr = $(this.wrapperElem).css('background-position').split(' ');
			this.bgPosX = parseInt(bgPosArr[0]);
			this.bgPosY = parseInt(bgPosArr[1]);

			this.context.translate(-1*this.translationX/this.zoomRate, -1*this.translationY/this.zoomRate);
			this.translationX = this.bgPosX;
			this.translationY = this.bgPosY;
			this.context.translate(this.translationX/this.zoomRate, this.translationY/this.zoomRate);
		}
	}


	isCrossing(x1, y1, x2, y2, x3, y3, x4, y4) {
		var vektormulti = function(ax, ay, bx, by){ return ax*by-bx*ay },
			less = function(a, b){ return b-a > 0 },
  			v1 = vektormulti(x4-x3, y4-y3, x1-x3, y1-y3),
			v2 = vektormulti(x4-x3, y4-y3, x2-x3, y2-y3),
			v3 = vektormulti(x2-x1, y2-y1, x3-x1, y3-y1),
			v4 = vektormulti(x2-x1, y2-y1, x4-x1, y4-y1);
		return ( less(v1*v2,0) && less(v3*v4,0) );
	}


	handleMouseMove(e) {
		this.eventMousemove(e, parseInt(e.clientX - this.offsetX), parseInt(e.clientY - this.offsetY));

		e.preventDefault();
		e.stopPropagation();

		if( this.coordsMousedown.length > 50 ) return;

		if( this.isDrawing ) {
			this.coordsMousemove.pop();
			this.saveMousePosition(e, this.coordsMousemove)
			this.draw(this.coordsMousemove);
		}

		if( this.isDragging ) {
			this.clear();
			var dX = e.clientX - this.draggingStartX,
				dY = e.clientY - this.draggingStartY;
			$(this.wrapperElem).css('background-position', (this.bgPosX + dX) + 'px ' + (this.bgPosY + dY) + 'px');
		}
	}


	saveMousePosition(e, target) {
		var mouseX = parseInt(e.clientX - this.offsetX);
		var mouseY = parseInt(e.clientY - this.offsetY);
		target.push([mouseX, mouseY]);
	}


	clear() {
		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
	}


	draw(coordinates, preventClear) {
		if( !preventClear ) this.clear();
		if( coordinates.length != 0 ) {
			this.context.beginPath();
			this.context.moveTo(coordinates[0][0], coordinates[0][1]);
			for(var i=1; i<coordinates.length; i++)  this.context.lineTo(coordinates[i][0], coordinates[i][1]);
			this.context.closePath();
			this.context.fill();
			this.context.stroke();
		}
	}


	/* public */

	setCoordinates(coordinates, preventClear) {
		this.coordsMousemove = coordinates;
		this.coordsMousedown = coordinates;
		this.draw(coordinates, preventClear);
	}

	clearCoordinates() {
		this.coordsMousemove = [];
		this.coordsMousedown = [];
		this.clear();
	}

	start() {
		this.clearCoordinates();
		this.isDrawing = true;
	}

	stop() {
		this.isDrawing = false;
		this.coordsMousemove = this.coordsMousedown;
		this.draw(this.coordsMousedown);
	}

	getCoordinates() {
		return this.coordsMousedown;
	}

	getJson() {
		var scale = [Math.round(this.width), Math.round(this.height)];
		return JSON.stringify([scale, this.getCoordinates()]);
	}

	getImgUrl() {
		return this.imgUrl;
	}

	zoom(rate) {
		if( rate >= 1 ) {
			this.clear();
			this.wrapperElem.style.backgroundSize = (100 * rate) + '%';
			var scaleRate = 1 + (rate-this.zoomRate)/this.zoomRate;
			this.context.scale(scaleRate, scaleRate);
			if( rate == 1 ) {
				$(this.wrapperElem).css('background-position', '0 0');
				this.context.translate(-1*this.translationX/rate, -1*this.translationY/rate);
				this.translationX = 0;
				this.translationY = 0;
			}
			this.zoomRate = rate;
		}
	}

	zoomIn() {
		this.zoom(this.zoomRate+.2);
	}

	zoomOut() {
		this.zoom(this.zoomRate-.2);
	}

	// event handlers
	// can b reassigned
	eventStopDrawing() {}
	eventKeypressDel() {}
	eventKeypressEsc() {}
	eventMousemove(e, mouseX, mouseY) {}
}
