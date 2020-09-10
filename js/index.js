// dom加载之前执行的操作(根据设备类型使用相应的样式表)
// 获取送货单号
function getNo() {
  var url = location.search; //获取url中"?"符后的字串 ('?modFlag=business&role=1')
  var theRequest = new Object();
  if (url.indexOf("?") != -1) {
    var str = url.substr(1); //substr()方法返回从参数值开始到结束的字符串；
    var strs = str.split("&");
    for (var i = 0; i < strs.length; i++) {
      theRequest[strs[i].split("=")[0]] = (strs[i].split("=")[1]);
    }
  }
  return theRequest;
}

//根据设备加载不同的样式
var setStyle = function (cssArr) {
  var i = 0;
  len = cssArr.length;
  for (i; i < len; i++) {
    document.write('<link href="' + cssArr[i] + '" type="text/css" rel=stylesheet>');
  }
}

setStyle(['css/App.css']);

function resetFontSize() {
  var baseFontSize = 100;
  var designWidth = 750;
  var width = window.innerWidth;
  var currentFontSize = (width / designWidth) * baseFontSize
  document.getElementsByTagName('html')[0].style.fontSize = currentFontSize + 'px'
}

window.onresize = function () {
  resetFontSize()
};
resetFontSize();