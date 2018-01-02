//初始化屏幕宽度
autoSetCanvasSize(canvas)
var context = canvas.getContext('2d'), //声明上下文并赋值
	drowStatus = false, //触摸or按住鼠标状态 默认值=‘false-未按下’
	presentPoint = { //画笔落点连接备用对象，存储两个连接点的前者
		'x': '',
		"y": ''
	},
	lineColor = '#000000',
	lineWidth = '5',
	oldColor = '',
	oldwidth = '',
	eraserWidth = lineWidth * 2,
	touchStutas = 'ontouchstart' in document.documentElement, //touch方法状态
	eraserAble = false, //橡皮开关，默认值false
	toolParam = {
		'color': lineColor,
		'width': lineWidth
	}

//****Stup1.调用主函数，完成用户动作监听****//
listenUserActivity(touchStutas)

//****Stup2.调用绑定点击事件函数****///
bindClick()

//监控鼠标移动且绘制轨迹
function listenUserActivity(touchAble) {
	if(touchAble) { //支持touch
		var touchParam = '';
		canvas.ontouchstart = function(e) {
			touchParam = e.touches[0]
			if(eraserAble) {
				wipe()
			}
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
			drowline(presentPoint.x, presentPoint.y, newPoint.x, newPoint.y)
			drow(newPoint.x, newPoint.y) //在拐角处画个圆，弥补粗线条拐角处断裂
			presentPoint = newPoint

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
	context.arc(x, y, (lineWidth / 2), 0, Math.PI * 2)
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
function wipe() {
	if(lineColor != 'white'){//不然双击橡皮擦会有bug
		oldColor = lineColor
		oldWidth = lineWidth
	}
	console.log('出发橡皮擦时' + oldColor, oldWidth)
	lineColor = 'white'
	lineWidth = eraserWidth
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
//绑定点击事件
function bindClick() {
	//监听eraser是否激活
	eraser.onclick = function() {
		eraserAble = true
		eraser.classList.add('activity')
		pencial.classList.remove('activity')
	}
	//监听画笔是否激活
	pencial.onclick = function() {
		eraserAble = false
		lineColor = oldColor
		lineWidth = oldWidth
		pencial.classList.add('activity')
		eraser.classList.remove('activity')
	}
	//清除屏幕
	clearCanvas.onclick = function() {
		var clear = confirm('是否清除当前作品？')
		if(clear) context.clearRect(0, 0, canvas.width, canvas.height)
	}
	//展开更多工具
	more.onclick = function() {
		mainTool.style.height = '100%'
	}
	//切换颜色&粗细
	black.onclick = function() {
		chooseBlack()
		setPencialParam('color', '#000000')
	}
	green.onclick = function() {
		chooseGreen()
		setPencialParam('color', '#008000')
	}
	red.onclick = function() {
		chooseRed()
		setPencialParam('color', '#ff0000')
	}
	lineOne.onclick = function() {
		chooseLineOne()
		setPencialParam('width', '5')
	}
	lineTwo.onclick = function() {
		chooseLineTwo()
		setPencialParam('width', '10')
	}
	lineThree.onclick = function() {
		chooseLineThree()
		setPencialParam('width', '15')
	}
	//收起更多工具(不保存)
	mainToolClose.onclick = function() {
		mainTool.style.height = '0'
		if(lineColor == '#ff0000') chooseRed()
		if(lineColor == '#000000') chooseBlack()
		if(lineColor == '#008000') chooseGreen()
		if(lineWidth == '5') chooseLineOne()
		if(lineWidth == '10') chooseLineTwo()
		if(lineWidth == '15') chooseLineThree()
		toolParam = {
			'color': lineColor,
			'width': lineWidth
		}
	}
	//收起更多工具（保存）
	mainToolConfirm.onclick = function() {
		mainTool.style.height = '0'
		lineColor = toolParam.color
		lineWidth = toolParam.width
	}
	download.onclick = function(){
		var url = canvas.toDataURL('image/png')
		var a = document.createElement('a')
		document.body.appendChild(a)
		a.href = url
		a.download = '我的作品'
		a.target = '_blank'
		a.click()
	}
}
//变更画笔数值
function setPencialParam(type, value) {
	if(type == 'color') {
		toolParam.color = value
	} else if(type == 'width') {
		toolParam.width = value
	}
}
//目前没有优化能力，且需要多次用到的烦人的2B代码都来这里吧
function chooseBlack() {
	black.classList.add('activity')
	green.classList.remove('activity')
	red.classList.remove('activity')
}

function chooseGreen() {
	green.classList.add('activity')
	black.classList.remove('activity')
	red.classList.remove('activity')
}

function chooseRed() {
	red.classList.add('activity')
	green.classList.remove('activity')
	black.classList.remove('activity')
}

function chooseLineOne() {
	lineOne.classList.add('activity')
	lineTwo.classList.remove('activity')
	lineThree.classList.remove('activity')
}

function chooseLineTwo() {
	lineTwo.classList.add('activity')
	lineOne.classList.remove('activity')
	lineThree.classList.remove('activity')
}

function chooseLineThree() {
	lineThree.classList.add('activity')
	lineTwo.classList.remove('activity')
	lineOne.classList.remove('activity')
}