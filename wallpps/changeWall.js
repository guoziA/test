
var img1 = './images/linzhiling.jpg';
var img2 = './images/redgirl.jpeg';

var imgBool;

window.onload = function(){
	adjustTimeFont();
	changeBackground('');
};

motion();
getTime();

function onBodyResize(){
	adjustTimeFont();
}

function adjustTimeFont(){
	var winWidth = document.body.clientWidth;
	var pWidth = winWidth * 0.9;
	var pEle = document.getElementById("timer");
	pEle.style.fontSize = pWidth / 7 + 'px';
}

function changeBackground(imgStr){
	var bgDiv;
	var imgUrl;
	bgDiv = document.getElementById('imgdiv');
	if(imgBool == true){
		imgUrl = img1;
		bgDiv.style.backgroundImage = "url(" + img1 + ")";
		imgBool = false;
	}else{
		imgUrl = img2;
		bgDiv.style.backgroundImage = "url(" + img2 + ")";
		imgBool = true;
	}
	
	var imgProp = getImgProportion(imgUrl);
	var winProp = getWindowProportion();
	if( imgProp > winProp ){
		bgDiv.style.backgroundSize = "100% auto";
	}else{
		bgDiv.style.backgroundSize = "auto 100%";
	}
	bgDiv.style.backgroundRepeat = "no-repeat";
}

function getImgProportion(imgUrl){
	var img = new Image;
	img.src = imgUrl;
	if(img.complete){
		// 打印
		console.log('from:complete : width:'+img.width+',height:'+img.height);
	}else{
		// 加载完成执行
		img.onload = function(){
        // 打印
        console.log('from:onload : width:'+img.width+',height:'+img.height);
		}
	};
	return img.height / img.width;
}

function getWindowProportion(){
	var winWidth = document.body.clientWidth;
	var winHeight = document.body.clientHeight;
	console.log('window width: ' + winWidth + ', window height: ' + winHeight);
	return winHeight / winWidth;
}

function getTime(){
	var mytime = new Date();
	var pTime = document.getElementById('timer');
	pTime.innerText = PrefixInteger(mytime.getHours(),2) + ":" + PrefixInteger(mytime.getMinutes(),2) + ":" + PrefixInteger(mytime.getSeconds(),2);
}

function PrefixInteger(num, n) {
	return (Array(n).join(0) + num).slice(-n);
}

function motion(){
	setInterval( changeBackground, 2000 );
	setInterval( getTime, 1000 );
}