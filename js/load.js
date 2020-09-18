// dom加载完毕执行的操作(渲染数据等)
// 判断运输状态
function tran(state) {
  if (state == 1) {
    return '运输中';
  } else if (state == 2) {
    return '已送达';
  } else {
    return '延误';
  }
}

var No = getNo().order_no; // 送货单号
// var Mode = getNo().mode; // 第二种节点的参数
// // 第一次请求建立连接
// (function testCon(callback) {
//   // 发送异步请求
//   var xmlHttp = new XMLHttpRequest();
//   xmlHttp.onreadystatechange = function () {
//     if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
//       console.log('第一次请求建立连接');
//       putData(proData);
//     }
//   }
//   if (Mode != undefined) {
//     xmlHttp.open("get", "https://lmsqas.whchem.com/myscm/getTransportation?delivery_order_no=" + No + "&mode=" + Mode, true);
//   } else {
//     xmlHttp.open("get", "https://lmsqas.whchem.com/myscm/getTransportation?delivery_order_no=" + No, true);
//   }

//   xmlHttp.send();
// })();

// 第二次ajax请求获取数据
function putData(callback) {
  // 发送异步请求
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.onreadystatechange = function () {
    if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
      var dd = xmlHttp.responseText;
      if (dd != '[]') {
        callback(dd);
      } else {
        alert('单号不存在!');
      }
    }
  }
  // if (Mode != undefined) {
  //   xmlHttp.open("get", "https://lmsqas.whchem.com/myscm/getTransportation?delivery_order_no=" + No + "&mode=" + Mode, true);
  // } else {
  xmlHttp.open("get", "https://lms.whchem.com/myscm/getTransportation?delivery_order_no=" + No, true);
  // }
  xmlHttp.send();
}

// 处理数据,ajax请求方法putData的回调函数
function proData(data) {
  // 处理表头数据
  var getData = JSON.parse(data);
  var contents = document.querySelectorAll('.ul .content');
  contents[0].innerHTML = getData[0].delivery_order_no; // 送货单号
  contents[1].innerHTML = getData[0].truck_name; // 车牌号码
  contents[2].innerHTML = getData[0].place_adress; // 发货地址
  contents[3].innerHTML = getData[0].customer_address; // 送货地址
  contents[4].innerHTML = getData[0].driver_name; // 司机姓名
  contents[5].innerHTML = getData[0].driver_phone; // 司机手机
  contents[6].innerHTML = getData[0].leave_factory_time; // 离厂时间
  contents[7].innerHTML = getData[0].re_customer_time; // 预计到达
  contents[9].innerHTML = getData[0].qty + ' 吨'; // 数量

  // 处理发货和送货地址长度超出一行（21字）
  (function () {
    var ul_height = document.querySelector('.ul');
    var li1 = document.querySelector('.ul li:nth-child(3)');
    var li2 = document.querySelector('.ul li:nth-child(4)');
    if (contents[2].innerHTML != 'undefined' && contents[3].innerHTML != 'undefined') {
      if (getData[0].place_adress.length > 21) {
        li1.style.marginBottom = '0.575rem';
        ul_height.style.height = '5.925rem';
        if (getData[0].customer_address.length > 21) {
          li2.style.marginBottom = '0.575rem';
          ul_height.style.height = '6.3rem';
        }
      } else {
        if (getData[0].customer_address.length > 21) {
          li2.style.marginBottom = '0.575rem';
          ul_height.style.height = '5.925rem';
        }
      }
    } else if (contents[2].innerHTML != 'undefined') {
      if (getData[0].place_adress.length > 21) {
        li1.style.marginBottom = '0.575rem';
        ul_height.style.height = '5.925rem';
      }
    } else if (contents[3].innerHTML != 'undefined') {
      if (getData[0].customer_address.length > 21) {
        li2.style.marginBottom = '0.575rem';
        ul_height.style.height = '5.925rem';
      }
    }
  })();

  // 显示产品名称
  if (getData[0].product_name) {
    var result = getData[0].product_name.split(";");
    if (result.length < 4) { // 如果产品名为三个及以下
      contents[8].innerHTML = getData[0].product_name;
    } else { // 如果大于三个只取前三个
      var prn = '';
      for (var i = 0; i < 3; i++) {
        prn = prn + result[i] + ';';
      }
      contents[8].innerHTML = prn.substr(0, prn.length - 1);
    }
  }

  // 判断是否为未定义.如果为undefined替换为空
  for (var con = 0; con < 10; con++) {
    if (contents[con].innerHTML == 'undefined') {
      contents[con].innerHTML = '';
    }
  }

  

  // 渲染当前节点数据
  var first_li_site = document.querySelector('#first .site');
  var first_li_date = document.querySelector('#first .date');
  first_li_site.innerHTML = getData[0].detail[0].node;
  first_li_date.innerHTML = getData[0].detail[0].nodeTime;

  // 判断节点数量
  var we;
  for (var e = 0; e < 10; e++) {
    if (getData[0].detail[e]) {

    } else {
      we = e;
      break;
    }
  }

  // 遍历已到达节点
  function addEd() {
    for (var ca = 1; ca < we; ca++) {
      var trs = document.createElement('li');
      trs.innerHTML = '<img src="img/物流节点_过去.png"><span class="site">' + getData[0].detail[ca].node + '</span><span class="date">' + getData[0].detail[ca].nodeTime + '</span>';
      li.appendChild(trs);
    }
  }

  // 添加起始节点
  function addSt() {
    var last = document.createElement('li');
    last.innerHTML = '<li><img src="img/物流节点_起始.png"></li>';
    li.appendChild(last);
  }

  // 遍历节点
  // 当前节点
  var arrive = document.querySelector('#first');
  var a_site = arrive.querySelector('.site');
  var a_date = arrive.querySelector('.date');
  var li = document.querySelector('#message ul');
  a_site.innerHTML = getData[0].detail[0].node;
  a_date.innerHTML = getData[0].detail[0].nodeTime;
  // 已到达节点
  addEd();
  // 起始节点
  addSt();

  // 显示上半部分直线
  var top = document.querySelector('#top');
  top.style.visibility = 'visible';

  // 显示当前节点的图片
  var im = document.querySelector('#first img');
  im.style.visibility = 'visible';
  
  
  // 下半部分直线
  var line = document.querySelector('#bottom');
  line.style.height = 1.1 + 0.79 * (we - 2) + "rem";

  // 判断运输状态
  var img = document.querySelector('.tab img'); // 运输状态图片
  var sta = tran(getData[0].transportstatus); // 状态数据
  img.src = "img/运输状态_" + sta + "_app.png";
  img.style.visibility = 'visible';

  // 手机地图
  var gps = document.querySelector('#map iframe') // iframe
  gps.src = "https://lms.whchem.com/myscm/GPSGate?toId=" + getData[0].no + "&client=mobile";

  // 查看地图按钮可用
  var mapBtn = document.querySelector('.map');
  mapBtn.style.background = '#13489d';
  mapBtn.style.pointerEvents = 'auto';
}
// 渲染数据
(function () {
  putData(proData);
})();

// 查看物流地图
var mapbtn = document.querySelector('.map');
var map = document.querySelector('#map');
var bg = document.querySelector('.bg');
mapbtn.onclick = function () {
  map.style.display = 'block';
}

// 关闭物流地图
var closeMap = document.querySelector('#map span');
closeMap.onclick = function () {
  map.style.display = 'none';
  // bg.style.display = 'none';
}

// 返回查询页
var back = document.querySelector('#back');
back.onclick = function () {
  send();
  // location.href = './search.html';
}

// 向查询页面发送关闭iframe数据
function send() {
  var data = new Array();
  data[0] = 'close';
  data[1] = document.querySelector('.ul .content').innerHTML;
  parent.postMessage(data, 'http://30k7192928.picp.vip/search.html'); // 触发跨域子页面的messag事件
}

