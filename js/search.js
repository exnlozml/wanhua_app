var vm = new Vue({
  el: '#app',
  data: {
    order: "",
    reg: /^[0-9]{10}$/,
    reg8: /^[0-9]{8}$/,
    tips: "您可以输运单号进行查询",
  },
  methods: {
    search: function () {
      if (this.reg.test(this.order)) {
        sessionStorage.setItem('test', JSON.stringify(this.order));
        location.href = './message_app.html?order_no=' + this.order;
      } else if (this.reg8.test(this.order)) {
        var no = '00' + this.order;
        location.href = './message_app.html?order_no=' + no;
      } else {
        this.order = '';
        this.tips = "请输入10位运单号"
      }
    }
  }
});