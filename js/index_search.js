// 判断是否移动端
function goPAGE() {

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
}
goPAGE();