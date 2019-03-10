
var imgIndexDay = 1;
var imgIndexNight = 51;

window.onload = function(){
	adjustTimeFont();
	changeBackground('');
};

motion();
getTime();


function findImg(directoryPath){
	var i;
	var to = 1;
	var isImgExsist;
	var timeNow = new Date();
	if((timeNow.getHours() > 0) && (timeNow.getHours() < 6)){
		for(i = imgIndexNight; i++;)
		{
			if(i > 99) {
				i = 51;
			}
			isImgExsist = isHasImg(directoryPath + i + ".jpg");
			if(isImgExsist){
				imgIndexNight = i;
				return directoryPath + i + ".jpg";
				break;
			}else{
				isImgExsist = isHasImg(directoryPath + i + ".jpeg");
				if(isImgExsist){
					imgIndexNight = i;
					return directoryPath + i + ".jpeg";
					break;
				}
			}
			to++;
			if(to > 50) break;
		}
	}else{
		for(i = imgIndexDay; i++;)
		{
			if(i > 50) {
				i = 1;
			}
			isImgExsist = isHasImg(directoryPath + i + ".jpg");
			if(isImgExsist){
				imgIndexDay = i;
				return directoryPath + i + ".jpg";
				break;
			}else{
				isImgExsist = isHasImg(directoryPath + i + ".jpeg");
				if(isImgExsist){
					imgIndexDay = i;
					return directoryPath + i + ".jpeg";
					break;
				}
			}
			to++;
			if(to > 50) break;
		}
	}
}

function isHasImg(pathImg){
    var ImgObj=new Image();
    ImgObj.src= pathImg;
     if(ImgObj.fileSize > 0 || (ImgObj.width > 0 && ImgObj.height > 0))
     {
       return true;
     } else {
       return false;
    }
}

function onBodyResize(){
	adjustTimeFont();
}

function adjustTimeFont(){
	var winWidth = document.body.clientWidth;
	var pWidth = winWidth * 0.9;
	var pEle = document.getElementById("timer");
	pEle.style.fontSize = pWidth / 4 + 'px';
}

function changeBackground(){
	var bgDiv;
	var imgUrl;
	bgDiv = document.getElementById('imgdiv');
	imgUrl = findImg("./images/");
	
	var imgProp = getImgProportion(imgUrl);
	var winProp = getWindowProportion();
	if( imgProp > winProp ){
		bgDiv.style.backgroundSize = "100% auto";
	}else{
		bgDiv.style.backgroundSize = "auto 100%";
	}
	bgDiv.style.backgroundImage = "url(" + imgUrl + ")";
	bgDiv.style.backgroundRepeat = "no-repeat";
	bgDiv.style.backgroundPosition = "center top";
	console.log("img: " + imgUrl);
}

function getImgProportion(imgUrl){
	var img = new Image;
	img.src = imgUrl;
	if(img.complete){
		return img.height / img.width;
	}else{
		// 加载完成执行
		img.onload = function(){
		};
		return img.height / img.width;
	}
}

function getWindowProportion(){
	var winWidth = document.body.clientWidth;
	var winHeight = document.body.clientHeight;
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
	setInterval( changeBackground, 30 * 1000 );
	setInterval( getTime, 1000 );
}