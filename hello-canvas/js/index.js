//初始化屏幕宽度
autoSetCanvasSize(canvas)
var context = canvas.getContext('2d'), //声明上下文并赋值
	drowStatus = false, //触摸or按住鼠标状态 默认值=‘false-未按下’
	presentPoint = { //画笔落点连接备用对象，存储两个连接点的前者
		'x': '',
		"y": ''
	},
	lineColor = 'black',
	lineWidth = '5',
	eraserSize = '10',
	touchStutas = 'ontouchstart' in document.documentElement, //touch方法状态
	eraserAble = false //橡皮开关，默认值false

//调用主函数，完成用户动作监听
listenUserActivity(touchStutas) 

//监听eraser是否激活
eraser.onclick = function() {
	eraserAble = true
	eraser.classList.add('activity')
	pencial.classList.remove('activity')
}
//监听画笔是否激活
pencial.onclick = function(){
	eraserAble = false
	pencial.classList.add('activity')
	eraser.classList.remove('activity')
}
//清除屏幕
clearCanvas.onclick = function(){
	var clear = confirm('是否清除当前作品？')
	if(clear) context.clearRect(0,0,canvas.width,canvas.height)
}

//监控鼠标移动且绘制轨迹
function listenUserActivity(touchAble) {
	if(touchAble) { //支持touch
		var touchParam = '';
		canvas.ontouchstart = function(e) {
			touchParam = e.touches[0]
			userStart(touchParam)
		}
		canvas.ontouchmove = function(e) {
			e.preventDefault && e.preventDefault();
			//用户移动时阻止手机屏幕晃动
			document.body.style.overflow = 'hidden';
			document.body.style.height = '100%';
			touchParam = e.touches[0]
			userMove(touchParam)
		}
		canvas.ontouchend = function() {
			userStop()
		}
	} else { //不支持touch
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
		if(eraserAble) {
			wipe(e.clientX, e.clientY)
		}
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
			if(eraserAble) {
				wipe(e.clientX, e.clientY)
			} else {
				drowline(presentPoint.x, presentPoint.y, newPoint.x, newPoint.y)
				drow(newPoint.x, newPoint.y) //在拐角处画个圆，弥补粗线条拐角处断裂
				presentPoint = newPoint
			}
		}
	}

	function userStop() {
		drowStatus = false
	}
}

//画笔(印章/盖戳)
function drow(x, y) {
	context.beginPath()
	context.fillStyle = lineColor
	context.moveTo(x, y)
	context.arc(x, y, (lineWidth/2), 0, Math.PI * 2)
	context.fill()
}
//画笔(轨迹/划线)
function drowline(x1, y1, x2, y2, _lineWidth) {
	context.beginPath();
	context.strokeStyle = lineColor
	context.moveTo(x1, y1) // 起点
	context.lineWidth = lineWidth
	context.lineTo(x2, y2) // 终点
	context.stroke()
	context.closePath()
}
//橡皮
function wipe(x, y) {
	context.clearRect(x, y, eraserSize,eraserSize)
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