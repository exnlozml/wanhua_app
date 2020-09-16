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
        // alert('单号不存在!');
        // location.href = '/search.html';
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

  // 判断状态图片
  var sta = tran(getData[0].transportstatus);
  // 物流节点左侧直线
  var tline = document.querySelector('#top');
  var line = document.querySelector('#bottom');

  // 渲染当前节点数据
  var first_li_site = document.querySelector('#first .site');
  var first_li_date = document.querySelector('#first .date');
  first_li_site.innerHTML = getData[0].detail[0].node;
  first_li_date.innerHTML = getData[0].detail[0].nodeTime;
  // 上半部分粗线
  tline.style.display = 'block';

  // 判断节点数量
  var we;
  for (var e = 0; e < 9; e++) {
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

  // 根据第一还是第二种节点来选择是否添加运输中节点
  var arrive = document.querySelector('#first');
  var a_site = arrive.querySelector('.site');
  var a_date = arrive.querySelector('.date');
  var li = document.querySelector('#message ul');
  if (getData[0].mode == 2) {
    // 第二种节点 不添加运输中节点
    a_site.innerHTML = getData[0].detail[0].node;
    a_date.innerHTML = getData[0].detail[0].nodeTime;
    addEd();
    addSt();
  } else {
    // 第一种节点
    // 判断是否有离厂
    var tag;
    var flag;
    for (var c = 0; c < e; c++) {
      if (getData[0].detail[c].node.indexOf("离厂") != -1) {
        flag = true;
        // 判断离厂节点是否为当前节点
        if (c == 0) {
          tag = c;
          // 如果是,则将当前节点改为运输中,并在后面加一个离厂节点
          a_site.innerHTML = '运输中';
          a_date.innerHTML = '';
        } else {
          tag = c;
          // 否则,则将detail中给第一个对象的数据渲染到#first上
          a_site.innerHTML = getData[0].detail[0].node;
          a_date.innerHTML = getData[0].detail[0].nodeTime;
          we++;
        }
      }
    }

    // 遍历已到达节点
    if (flag == true && tag == 1) {
      // 如果存在离厂节点且有到达节点
      // 向detia数组对象中添加运输中对象
      var sites = getData[0].detail;
      var tarning = {
        node: "运输中",
        nodeTime: ""
      };
      sites.splice(tag, 0, tarning);
      for (var cc = 1; cc < we; cc++) {
        var trs = document.createElement('li');
        trs.innerHTML = '<img src="img/物流节点_过去.png"><span class="site">' + sites[cc].node + '</span><span class="date">' + sites[cc].nodeTime + '</span>';
        li.appendChild(trs);
      }
    } else if (flag == true && tag == 0) {
      for (var cr = 0; cr < we; cr++) {
        var trs = document.createElement('li');
        trs.innerHTML = '<img src="img/物流节点_过去.png"><span class="site">' + getData[0].detail[cr].node + '</span><span class="date">' + getData[0].detail[cr].nodeTime + '</span>';
        li.appendChild(trs);
      }
      we++;
    } else {
      addEd();
    }
    addSt();
  }

  // 显示上半部分直线
  var top = document.querySelector('#top');
  top.style.visibility = 'visible';
  // 显示当前节点的图片
  var im = document.querySelector('#first img');
  im.style.visibility = 'visible';
  // 不同设备中的节点数据渲染
  var img = document.querySelector('.tab img'); // 当前节点图片
  var gps = document.querySelector('#map iframe') // iframe
  // app下半部分直线
  line.style.height = 1.1 + 0.79 * (we - 2) + "rem";
  // 判断运输状态
  img.src = "img/运输状态_" + sta + "_app.png";
  img.style.visibility = 'visible';
  // 手机地图
  gps.src = "https://lmsqas.whchem.com/myscm/GPSGate?toId=" + getData[0].no + "&client=mobile";

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
// var back = document.querySelector('#back');
// back.onclick = function () {
//   location.href = './search.html';
// }