var canvas;
var delta = [0, 0];
var stage = [ window.screenX, window.screenY, window.innerWidth, window.innerHeight ];
getBrowserDimensions();

var worldAABB, world, iterations = 1, timeStep = 1 / 15;

var walls = [];
var wall_thickness = 200;
var wallsSetted = false;

var bodies, elements;

var destroyMode = false;

var isMouseDown = false;
var mouseJoint;
var mouse = { x: 0, y: 0 };
var gravity = {x: 0, y: 1};

var PI2 = Math.PI * 2;

var timeOfLastTouch = 0;


init();
play();

function init() {

	canvas = document.getElementById( 'canvas' );//div

	document.onmousedown = onDocumentMouseDown;
	document.onmouseup = onDocumentMouseUp;
	document.onmousemove = onDocumentMouseMove;
	document.ondblclick = onDocumentDoubleClick;

	document.addEventListener( 'touchstart', onDocumentTouchStart, false );
	document.addEventListener( 'touchmove', onDocumentTouchMove, false );
	document.addEventListener( 'touchend', onDocumentTouchEnd, false );
	
	document.addEventListener('keydown', onKeydown, false);

	window.addEventListener( 'deviceorientation', onWindowDeviceOrientation, false );

	// init box2d

	worldAABB = new b2AABB();//用来设置有效区域的大小
	worldAABB.minVertex.Set( -500, -500 );//左上角
	worldAABB.maxVertex.Set( window.innerWidth + 200, window.innerHeight + 200 );//右下角

	//创建一个世界，参数应该是size，gravity，dosleep
	//dosleep = true,忽略休眠的物体
	world = new b2World( worldAABB, new b2Vec2( 0, 300 ), true );

	setWalls();
	reset();
}

function onKeydown(event){
	var keyCode = event.keyCode;
	//console.log(keyCode);
	if(keyCode == 13){
		reset();
		
	}
	else if(keyCode >= 65 && keyCode <= 90){
		createKey(keyCode);		
	}
	else{
		return;
	}

}


function play() {

	setInterval( loop, 1000 / 40 );
}

function reset() {

	var i;

	if ( bodies ) {

		for ( i = 0; i < bodies.length; i++ ) {

			var body = bodies[ i ]
			canvas.removeChild( body.GetUserData().element );
			world.DestroyBody( body );
			body = null;
		}
	}

	bodies = [];
	elements = [];

}

//

function onDocumentMouseDown() {

	isMouseDown = true;
	return false;
}

function onDocumentMouseUp() {

	isMouseDown = false;
	return false;
}

function onDocumentMouseMove( event ) {

	mouse.x = event.clientX;
	mouse.y = event.clientY;
}

function onDocumentDoubleClick() {

	reset();
}

function onDocumentTouchStart( event ) {

	if( event.touches.length == 1 ) {

		event.preventDefault();

		var now = new Date().getTime();

		if ( now - timeOfLastTouch  < 250 ) {

			reset();
			return;
		}

		timeOfLastTouch = now;

		mouse.x = event.touches[ 0 ].pageX;
		mouse.y = event.touches[ 0 ].pageY;
		isMouseDown = true;
	}
}

function onDocumentTouchMove( event ) {

	if ( event.touches.length == 1 ) {

		event.preventDefault();

		mouse.x = event.touches[ 0 ].pageX;
		mouse.y = event.touches[ 0 ].pageY;

	}

}

function onDocumentTouchEnd( event ) {

	if ( event.touches.length == 0 ) {

		event.preventDefault();
		isMouseDown = false;

	}

}

function onWindowDeviceOrientation( event ) {

	if ( event.beta ) {

		gravity.x = Math.sin( event.gamma * Math.PI / 180 );
		gravity.y = Math.sin( ( Math.PI / 4 ) + event.beta * Math.PI / 180 );

	}

}


function createKey(keyCode) {

	var x = Math.random() * stage[2];
	var y = window.innerHeight - 20;

	var size = 40, halfSize = 20;
	
	var element = document.createElement('div');
	element.width = size;
	element.height = size;
	element.style.position = 'absolute';//相对于父元素位置绝对
	element.style.left =  -200 + 'px';
	element.style.top = -200 + 'px';
	element.style.cursor = "default";

	canvas.appendChild(element);//canvas(div) > element(div) > circle(canvas) & text(div)
	elements.push( element );

	var img = document.createElement("img");
	img.src = keyCode + ".jpg";
	img.width = size;
	img.height = size;
	img.style.position = 'absolute';//相对于父元素位置绝对
	img.style.left = 0 + 'px';
	img.style.top = 0 + 'px';
	img.style.WebkitTransform = 'translateZ(0)';//对chrome，移动到z = 0
	img.style.MozTransform = 'translateZ(0)';//firefox
	img.style.OTransform = 'translateZ(0)';//opera
	img.style.msTransform = 'translateZ(0)';//ie9
	img.style.transform = 'translateZ(0)';//normal
	
	element.appendChild(img);

	var b2body = new b2BodyDef();

	var box = new b2BoxDef();
	box.extents.Set(halfSize, halfSize);
	box.density = 0.1;
	box.friction = 0.8;
	box.restitution = 0.1;
	b2body.AddShape(box);
	b2body.userData = {element: element};

	b2body.position.Set( x, y );
	var speedY = (Math.random() + 1) * 400 + 4000 ;
	b2body.linearVelocity.Set(0, speedY);
	//console.log(speedY);
	bodies.push( world.CreateBody(b2body) );
}

//

function loop() {

	//判断浏览器的大小有没有变化，有变化则重新设置活动空间的大小
	if (getBrowserDimensions()) {

		setWalls();

	}

	delta[0] += (0 - delta[0]) * .5;
	delta[1] += (0 - delta[1]) * .5;

	world.m_gravity.x = gravity.x * 350 + delta[0];
	world.m_gravity.y = gravity.y * 350 + delta[1];
	mouseDrag();
	//计算timeStep秒后物体位置
	//drawWorld
	world.Step(timeStep, iterations);

	for (i = 0; i < bodies.length; i++) {

		var body = bodies[i];
		var element = elements[i];

		//右移1表示除2
		element.style.left = (body.m_position0.x - (element.width >> 1)) + 'px';
		element.style.top = (body.m_position0.y - (element.height >> 1)) + 'px';

		if (element.tagName == 'DIV') {

			var style = 'rotate(' + (body.m_rotation0 * 57.2957795) + 'deg) translateZ(0)';
			element.childNodes[0].style.WebkitTransform = style;
			element.childNodes[0].style.MozTransform = style;
			element.childNodes[0].style.OTransform = style;
			element.childNodes[0].style.msTransform = style;
			element.childNodes[0].style.transform = style;

		}

	}

}


// .. BOX2D UTILS
//创建物体，矩形box，参数：位置、宽高、固定
function createBox(world, x, y, width, height, fixed) {

	if (typeof(fixed) == 'undefined') {

		fixed = true;

	}

	var boxSd = new b2BoxDef();

	if (!fixed) {

		boxSd.density = 1.0;
		//boxSd.friction = 1.0;

	}

	//定义宽、高
	boxSd.extents.Set(width, height);

	var boxBd = new b2BodyDef();
	boxBd.AddShape(boxSd);
	boxBd.position.Set(x,y);

	return world.CreateBody(boxBd);

}

function mouseDrag()
{

	if (isMouseDown && !mouseJoint) {

		//鼠标点击的物体
		var body = getBodyAtMouse();

		if (body) {
			//点到了物体，可以拖动
			var md = new b2MouseJointDef();
			md.body1 = world.m_groundBody;
			md.body2 = body;
			md.target.Set(mouse.x, mouse.y);
			md.maxForce = 30000 * body.m_mass;
			// md.timeStep = timeStep;
			mouseJoint = world.CreateJoint(md);
			body.WakeUp();

		}

	}

	// mouse release
	if (!isMouseDown) {
		destroyMode = false;

		if (mouseJoint) {

			world.DestroyJoint(mouseJoint);
			mouseJoint = null;

		}

	}

	// mouse move
	if (mouseJoint) {

		var p2 = new b2Vec2(mouse.x, mouse.y);
		mouseJoint.SetTarget(p2);
	}
}

//得到鼠标点击的物体
function getBodyAtMouse() {

	// Make a small box.
	var mousePVec = new b2Vec2();
	mousePVec.Set(mouse.x, mouse.y);

	var aabb = new b2AABB();
	aabb.minVertex.Set(mouse.x - 1, mouse.y - 1);
	aabb.maxVertex.Set(mouse.x + 1, mouse.y + 1);

	// Query the world for overlapping shapes.
	var k_maxCount = 10;
	var shapes = new Array();
	var count = world.Query(aabb, shapes, k_maxCount);
	var body = null;

	for (var i = 0; i < count; ++i) {

		if (shapes[i].m_body.IsStatic() == false) {

			if ( shapes[i].TestPoint(mousePVec) ) {

				body = shapes[i].m_body;
				break;

			}

		}

	}

	return body;

}

function setWalls() {

	//如果是已经设置过了要先销毁，为什么不用循环？？
	/**
	if (wallsSetted) {
		for(var i = 0; i < 4; i++){
			world.DestroyBody(walls[i]);
			walls[i] = null;
			
		}
	}
	*/
	if(wallsSetted){
		world.DestroyBody(walls[0]);
		world.DestroyBody(walls[1]);
		world.DestroyBody(walls[2]);
		world.DestroyBody(walls[3]);
		
		walls[0] = null;
		walls[1] = null;
		walls[2] = null;
		walls[3] = null;
	}

	//世界、位置、宽高、固定？
	//wall_thickness = 200
	//四面的墙
	walls[0] = createBox(world, stage[2] / 2, - wall_thickness, stage[2], wall_thickness);
	walls[1] = createBox(world, stage[2] / 2, stage[3] + wall_thickness, stage[2], wall_thickness);
	console.log(stage[2] / 2 + ' ' +  (stage[3] + wall_thickness) + ' ' + stage[2] + ' ' + wall_thickness);
	console.log(stage[3]);
	walls[2] = createBox(world, - wall_thickness, stage[3] / 2, wall_thickness, stage[3]);
	walls[3] = createBox(world, stage[2] + wall_thickness, stage[3] / 2, wall_thickness, stage[3]);	

	wallsSetted = true;

}

// BROWSER DIMENSIONS

function getBrowserDimensions() {

	var changed = false;

	if (stage[0] != window.screenX) {

		delta[0] = (window.screenX - stage[0]) * 50;
		stage[0] = window.screenX;
		changed = true;

	}

	if (stage[1] != window.screenY) {

		delta[1] = (window.screenY - stage[1]) * 50;
		stage[1] = window.screenY;
		changed = true;

	}

	if (stage[2] != window.innerWidth) {

		stage[2] = window.innerWidth;
		changed = true;

	}

	if (stage[3] != window.innerHeight) {

		stage[3] = window.innerHeight;
		changed = true;

	}

	return changed;

}
