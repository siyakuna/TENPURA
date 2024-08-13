var selFile = document.getElementById('selectFile'); 
var c = document.getElementById('canvas');
var ctx = c.getContext('2d');
var dataUrl
var img = new Image(); // 画像
var file  
var reader = new FileReader();
var siz = {height:600,width:600}
var imgSiz = {height:300,width:600}
var pro = 1
let title = ""
var backColor = "rgb(255, 255, 255)"
var blockColor = "rgb(255, 255, 255)"
let obj = [];

selFile.addEventListener("change", function(evt){
  file = evt.target.files; 
 reader.readAsDataURL(file[0]); // fileの要素をdataURL形式で読み込む
 // ファイルを読み込んだ時に実行する
 reader.onload = function(){
   dataUrl = reader.result; // 読み込んだファイルURL
  img.src = dataUrl;

  // 画像が読み込んだ時に実行する
  　img.onload = function() {
    imgSiz.height = siz.height = img.naturalHeight
    imgSiz.width = siz.width = img.naturalWidth
    document.getElementById('canvas').height = imgSiz.height
    document.getElementById('canvas').width = imgSiz.width
    pro = imgSiz.height / imgSiz.width
    }
  }
}, false);
document.getElementById('background-color').addEventListener("input", function(evt){
backColor = evt.target.value
})
document.getElementById('block-color').addEventListener("input", function(evt){
    blockColor = evt.target.value
    })
document.getElementById('height').addEventListener("input", function(evt){
    if(document.getElementById('pro').checked){
        document.getElementById('canvas').width = evt.target.value / pro
        document.getElementById('width').value = evt.target.value / pro
        siz.width = evt.target.value / pro
    }
    document.getElementById('canvas').height = evt.target.value
    siz.height = evt.target.value
})
document.getElementById('width').addEventListener("input", function(evt){
    if(document.getElementById('pro').checked){
        document.getElementById('canvas').height = evt.target.value * pro
        document.getElementById('height').value = evt.target.value * pro
        siz.height = evt.target.value * pro
    }
    document.getElementById('canvas').width = evt.target.value
    siz.width = evt.target.value
})
document.getElementById('pro').addEventListener("change", function(evt){
    if(document.getElementById('pro').checked)pro = siz.height/siz.width
})

document.getElementById('title').addEventListener('input', function(evt){
  title = evt.target.value
})
function draw(){//描写
    var mag = 40;
    if(document.getElementById('title').value==="") mag = 0;
    ctx.save();
    ctx.fillStyle = backColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);//背景
    ctx.fillStyle = blockColor;
    ctx.fillRect(90, 80 + mag, canvas.width-180, canvas.height-140 - mag);//背景
    ctx.drawImage(img, 0, 0,siz.width, siz.height);//背景画像
    if(document.getElementById('line').checked){
        ctx.beginPath();
        ctx.strokeStyle = 'rgb(0, 0, 0)';
        ctx.moveTo(canvas.width/2, 80  + mag)
        ctx.lineTo(canvas.width/2, canvas.height-60 )
        ctx.stroke()
        ctx.beginPath();
        ctx.moveTo(90,(canvas.height/2) + mag)
        ctx.lineTo(canvas.width-90,(canvas.height/2) + mag)
        ctx.stroke()
    }
    ctx.restore();
    ctx.save();
    ctx.fillStyle = document.getElementById('txt-color').value;
    ctx.textAlign = 'center';
    ctx.font = 'bold 48px serif'
    ctx.fillText(title, canvas.width/2, 40, canvas.width);
    ctx.textAlign = 'left';
    textDraw(document.getElementById('left').value,"l",mag)
    textDraw(document.getElementById('right').value,"r",mag)
    ctx.textAlign = 'center';
    ctx.fillText(document.getElementById('top').value, canvas.width/2, 50+mag, canvas.width);
    ctx.fillText(document.getElementById('bottom').value, canvas.width/2,canvas.height-10, canvas.width);
    ctx.restore();
    ctx.save();
    obj.forEach((element,index) => {
        if(element != "remove"){
        ctx.save();
        var elsizW = element.siz.w * element.scale;
        var elsizH = element.siz.h * element.scale;
        var fontsiz = 12;
        fontsiz = 12*element.txtSiz;
        ctx.fillStyle = element.color;
        ctx.textAlign = 'center';
        ctx.font = 'bold '+ fontsiz +'px serif'
        ctx.translate(element.x, element.y)
        ctx.rotate((Math.PI/180)*element.siz.r)
        ctx.fillText(element.text, 0, 0,);
        ctx.drawImage(element.img,- (elsizW/2), - (elsizH+fontsiz), elsizW, elsizH,)
        ctx.restore();
    }})
    ctx.restore();
}
function textDraw(txt,rl,mag) {
    ctx.font = 'bold 30px serif';
    var h = ctx.measureText(txt).width;
    var textH = (canvas.height/2) - (h/2) + mag + 10;
    [...txt].forEach((element,index) => {
            if(rl==="l") ctx.fillText(element,0,(30*index)+textH);
            if(rl==="r") ctx.fillText(element,canvas.width-30,(30*index)+textH);
    });
}

let objNo = 0;
function newObj(){
document.getElementById('obj').insertAdjacentHTML('beforeend',`
    <div class="objDiv">
    <input type="text"  class="objText">
    <input type="file" class="objImg" accept=".png,.jpeg,.jpg">
    X<input type="range" class="objX" max="100" min="0" >
    Y<input type="range" class="objY" max="100" min="0" >
    SIZ<input type="range" class="objSIZ" max="200" min="0" >
    詳細設定<input type="checkbox" class="objSett">
    <input type="button" value="削除" class="objDelete">
    <div class="settingP">
    テキストカラー<input type="color" class="objTxtColor">
    テキストサイズ<input type="range" class="objTxtSIZ" max="600" min="0" >
    回転<input type="range" class="objR" max="360" min="0" value=0>
    </dib>
    </div>
    `)
    objNo++
    obj.push({x:canvas.width/2,y:canvas.height/2,siz:{h:0,w:0,r:0},txtSiz:1,scale:1,text:"",color:"rgb(0, 0, 0)",img:new Image()})
    objSet()
}
function objSet(){
    let txtLists = document.querySelectorAll(".objText")
    txtLists[txtLists.length - 1].addEventListener("input", (e) => {
        var index = Array.from(txtLists).findIndex(list => list === e.target)
        obj[index].text = e.target.value
    });
    let imgLists = document.querySelectorAll(".objImg")
    imgLists[imgLists.length - 1].addEventListener("change", (e) => {
        var index = Array.from(imgLists).findIndex(list => list === e.target)
        file = e.target.files; 
        reader.readAsDataURL(file[0]); // fileの要素をdataURL形式で読み込む
 // ファイルを読み込んだ時に実行する
        reader.onload = function(){
         dataUrl = reader.result; // 読み込んだファイルURL
         obj[index].img.src = dataUrl;
         obj[index].img.onload = function() {
         var h = obj[index].img.naturalHeight
         var w = obj[index].img.naturalWidth
         var p = h / w
         if(h >= w){
            h = 100
            w = h * p
         }else{
            w = 100
            h = w * p
         }
         obj[index].siz.h = h
         obj[index].siz.w = w
        }
        }
    });
    let XLists = document.querySelectorAll(".objX")
    XLists[XLists.length - 1].addEventListener("input", (e) => {
        var index = Array.from(XLists).findIndex(list => list === e.target)
        var ans = (e.target.value/100)*canvas.width
        obj[index].x = ans
    });
    let YLists = document.querySelectorAll(".objY")
    YLists[YLists.length - 1].addEventListener("input", (e) => {
        var index = Array.from(YLists).findIndex(list => list === e.target)
        var ans = (e.target.value/100)*canvas.height
        obj[index].y = ans
    });
    let  sizLists = document.querySelectorAll(".objSIZ")
    sizLists[sizLists.length - 1].addEventListener("input", (e) => {
        var index = Array.from(sizLists).findIndex(list => list === e.target)
        obj[index].scale = (e.target.value/100)
    });
    let  colorLists = document.querySelectorAll(".objTxtColor")
    colorLists[colorLists.length - 1].addEventListener("input", (e) => {
        var index = Array.from(colorLists).findIndex(list => list === e.target)
        obj[index].color = e.target.value
    });
    let  txtsizLists = document.querySelectorAll(".objTxtSIZ")
    txtsizLists[txtsizLists.length - 1].addEventListener("input", (e) => {
        var index = Array.from(txtsizLists).findIndex(list => list === e.target)
        obj[index].txtSiz = (e.target.value/100)
    });
    let  RLists = document.querySelectorAll(".objR")
    RLists[RLists.length - 1].addEventListener("input", (e) => {
        var index = Array.from(RLists).findIndex(list => list === e.target)
        obj[index].siz.r = e.target.value
    });
    let  delLists = document.querySelectorAll(".objDelete")//削除（強引）
    delLists[delLists.length - 1].addEventListener("click", (e) => {
        var index = Array.from(delLists).findIndex(list => list === e.target)
        obj[index] = "remove"
        document.querySelectorAll('.objDiv')[index].style.display = "none"
        
        objSet()
    });
}
setInterval(draw, 10)