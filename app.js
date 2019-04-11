//app.js


App({
  globalData:{
    userInfo:null
  },
  onLaunch: function () {
    var isDebug = false;//true调试状态使用本地服务器，非调试状态使用远程服务器
    if (!isDebug) {
      //远程域名
      wx.setStorageSync('domainName', "https://wxapp.a-cubic.com/api/gift/Wx/")
    }
    else {
      //本地测试域名
      wx.setStorageSync('domainName', "http://192.168.0.11:53695/api/gift/Wx/")
    }
    // 登录
    wx.login({
      success: res => {
        const that = this;
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        this.Ajax(
          'Open',
          'POST',
          'ShopUserLogin',
          { code: res.code },
          function (json) {
            // console.log('~~~',json);
            if (json.success) {
              wx.setStorageSync('token', json.data.token);
              // wx.setStorageSync('scanCode', json.data.scanCode);
              // console.log(json.data.token);
              // console.log(!!json.data.isReg)

              if (!!json.data.isReg) {
                console.log('已经登录过');
                wx.switchTab({
                  url: '../index/index',
                })
              }else{
                wx.redirectTo({
                  url: '../register/register',
                })
              }
            } else {
              // that.Toast('','none',2000,json.msg.code)
              console.log('here');

            }
          }
        )
      }
    })
  },
  Ajax: function (url, type, method, data, callback) {
    wx.showLoading({
      title: 'loading',
      duration: 1000,
    });

    var send = {
      token: wx.getStorageSync('token'),
      method: method,
      param: data,
    };
    wx.request({
      url: wx.getStorageSync('domainName') + url,
      data: send,
      method: type, // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        'content-type': 'application/json' // 默认值
      }, // 设置请求的 header
      success: function (res) {
        wx.hideLoading();
        // 发送请求成功执行的函数
        if (typeof callback === 'function') {
          callback(res.data);
        }
      },
      fail: function (res) {
        wx.hideLoading();
        wx.showModal({
          title: '网络异常提示',
          content: '请检查网络，并重新登录小程序',
          showCancel: false,
        })
        //console.log('fa',res)
      },
      complete: function () {
        // wx.hideLoading();
      }
    })
  }
  ,
  Toast: function (title, icon, duration, code) {
    let content = title;
    switch (code) {
      // 店铺
      case 10301:
        content = '店铺用户已存在'
        break;
      case 10302:
        content = '店铺用户注册失败'
        break;
      case 10303:
        content = '无效的验证码'
        break;
      case 10304:
        content = '无效的取货码'
        break;
      case 10305:
        content = '确认取货失败'
        break;
      case 10306:
        content = '该店铺没有待取货订单'
        break;
      case 10307:
        content = '无效的转换码'
        break;
      case 10308:
        content = '	需要先注册该店铺会员'
        break;
      case 10309:
        content = '转换失败'
        break;
      case 10310:
        content = '确认收货失败'
        break;
      case 10311:
        content = '无效的签到码'
        break;
      case 10312:
        content = '消费签到失败'
        break;

      // 商城
      case 10101:
        content = '首页加载失败'
        break;
      case 10102:
        content = '无效的商品'
        break;
      case 10103:
        content = '没有足够库存'
        break;
      case 10104:
        content = '更新购物车失败'
        break;
      case 10105:
        content = '删除购物车失败'
        break;
      case 10106:
        content = '请先绑定会员卡哦'
        break;
      case 10107:
        content = '无效的预订单号'
        break;
      case 10108:
        content = '	生成订单失败'
        break;
      case 10109:
        content = '无效的订单状态'
        break;
      case 10110:
        content = '没有足够的心值'
        break;
      case 10111:
        content = '支付订单失败'
        break;
      case 10112:
        content = '	无效的店铺'
        break;
      case 10201:
        content = '	店铺会员已存在'
        break;
      case 10202:
        content = '	同步用户信息失败'
        break;

      // 通用
      case 201:
        content = 'APPID错误'
        break;
      case 202:
        content = '签名错误'
        break;
      case 404:
        content = '没有找到'
        break;
      case 500:
        content = '内部错误'
        break;
      case 1000:
        content = '	微信组件异常'
        break;
      case 3000:
        content = '支付错误'
        break;
      case 3001:
        content = '支付金额不能为0'
        break;
      case 3002:
        content = '支付返回异常'
        break;
      case 4000:

        content = '无效的Token'
        break;
      case 4001:
        content = '无效的方法名'
        break;
      case 4002:
        content = '无效的参数'
        break;
      case 4003:
        content = '接口权限不足'
        break;
      case 4004:
        content = '接口的参数不对'
        break;
      case 4005:
        content = '接口数据库操作失败'
        break;
      case 4006:
        content = '需要登陆'
        break;
      default:
        console.log(code);
    }
    wx.showToast({
      title: content,
      icon: icon,
      duration: duration
    });
  }

})