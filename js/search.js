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
var vm = new Vue({
  el: '#app',
  data: {
    order: "",
    reg: /^[0-9]{10}$/,
    reg8: /^[0-9]{8}$/,
    tips: "您可以输运单号进行查询",
    mess: '',
    isShow: false
  },
  methods: {
    search: function () {
      that = this;
      if (this.reg.test(this.order)) {
        this.mess = 'http://30k7192928.picp.vip/message_app.html?order_no=' + this.order;
        setTimeout(function() {
          that.isShow = true;
        }, 500);
      } else if (this.reg8.test(this.order)) {
        var no = '00' + this.order;
        this.mess = 'http://30k7192928.picp.vip/message_app.html?order_no=' + no;
        setTimeout(function() {
          that.isShow = true;
        }, 500);
      } else {
        this.order = '';
        this.tips = "请输入10位运单号";
      }
    }
  },
  mounted() {
    window.addEventListener('message', messageEvent => {
      // window.location.reload();
      var data = messageEvent.data;
      if (data[0] == 'close') {
        this.isShow = false;
      }
      this.order = data[1];
    });
  }
});