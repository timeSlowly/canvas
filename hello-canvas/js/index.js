autoSetCanvasSize(canvas)
listenMouseMove()
var context = canvas.getContext('2d'),
	drowStatus = false,
	presentPoint = {
		'x': undefined,
		"y": undefined
	}

//监控鼠标移动且绘制轨迹
function listenMouseMove() {
	canvas.onmousedown = function(e) {
		drowStatus = true
		presentPoint = {
			"x": e.clientX,
			"y": e.clientY
		}
	}
	canvas.onmousemove = function(e) {
		var newPoint = {
			'x': e.clientX,
			'y': e.clientY
		}
		if(drowStatus) {
			drowline(presentPoint.x, presentPoint.y, newPoint.x, newPoint.y, 5)
			drow(newPoint.x, newPoint.y, 2.5)
			presentPoint = newPoint
		}
	}
	canvas.onmouseup = function() {
		drowStatus = false
	}
}

//画笔(印章/盖戳)
function drow(x, y, radius) {
	context.beginPath()
	context.moveTo(x, y)
	context.arc(x, y, radius, 0, Math.PI * 2)
	context.fill()
}
//画笔(轨迹/划线)
function drowline(x1, y1, x2, y2, _lineWidth) {
	context.beginPath();
	context.strokeStyle = 'black'
	context.moveTo(x1, y1) // 起点
	context.lineWidth = _lineWidth
	context.lineTo(x2, y2) // 终点
	context.stroke()
	context.closePath()
}
//自适应画布大小
function autoSetCanvasSize(canvas) {
	setCanvasSize()
	window.onresize = function() {
		setCanvasSize()
	}

	function setCanvasSize() {
		var pageWidth = document.documentElement.clientWidth
		var pageHeight = document.documentElement.clientHeight
		canvas.width = pageWidth
		canvas.height = pageHeight
	}
}