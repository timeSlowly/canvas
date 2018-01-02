autoSetCanvasSize(canvas)
var context = canvas.getContext('2d'),
	drowStatus = false,
	presentPoint = {
		'x': undefined,
		"y": undefined
	},
	includeTouchFunction = 'ontouchstart' in document.documentElement
	
listenUserMove(includeTouchFunction)

//监控鼠标移动且绘制轨迹
function listenUserMove(touchStatus) {
	if(touchStatus) {//支持touch
		canvas.ontouchstart = function(e){
			console.log(e)
			var touchParam = e.touches[0]
			userStart(touchParam)
		}
		canvas.ontouchmove = function(e) {
			e.preventDefault && e.preventDefault();
			//用户移动时阻止手机屏幕晃动
			document.body.style.overflow='hidden';
			document.body.style.height='100%';
			var touchParam = e.touches[0]
			userMove(touchParam)
		}
		canvas.ontouchend = function() {
			userStop()
		}
	} else {//不支持touch
		canvas.onmousedown = function(e) {
			userStart(e)
		}
		canvas.onmousemove = function(e) {
			userMove(e)
		}
		canvas.onmouseup = function() {
			userStop()
		}
	}
	function userStart(e) {
		drowStatus = true
		presentPoint = {
			"x": e.clientX,
			"y": e.clientY
		}
	}
	function userMove(e) {
		var newPoint = {
			'x': e.clientX,
			'y': e.clientY
		}
		if(drowStatus) {
			drowline(presentPoint.x, presentPoint.y, newPoint.x, newPoint.y, 5)
			drow(newPoint.x, newPoint.y, 2.5) //在拐角处画个圆，弥补粗线条拐角处断裂
			presentPoint = newPoint
		}
	}
	function userStop() {
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