//index.js
//获取应用实例
const app = getApp()
Page({
  data: {
    scanImgurl:'http://llwell-wxapp.oss-cn-beijing.aliyuncs.com/PurchasingAssistantShop/top_icon_scan_blue_normal@3x.png',
    showExchange:false,
    score: '',
    showCheck:false,
    consume:'',
    scanCode:'',
    showOrder: false,
    orderId:'',
    listData:[],
    listDataOld:[
      {
        goodsName:'韩国JMsolution海洋珍珠玻尿酸三部曲面膜10片',
        goodsNum:1,
        goodsImg:'http://ecc-product.oss-cn-beijing.aliyuncs.com/goodsuploads/8809505541764_cp_1.jpg',
        goodsId:81,
      }, {
        goodsName: '韩国JMsolution海洋珍珠玻尿酸三部曲面膜10片',
        goodsNum: 1,
        goodsImg: 'http://ecc-product.oss-cn-beijing.aliyuncs.com/goodsuploads/8809505541764_cp_1.jpg',
        goodsId: 81,
      }, {
        goodsName: '韩国JMsolution海洋珍珠玻尿酸三部曲面膜10片',
        goodsNum: 1,
        goodsImg: 'http://ecc-product.oss-cn-beijing.aliyuncs.com/goodsuploads/8809505541764_cp_1.jpg',
        goodsId: 81,
      }
    ]
  },
  
  onLoad: function () {
    // console.log('sss', this.data)
  },
  toScanCode:function(){
    wx.scanCode({
      success: (res) => {
        
        // res.result.splice('_')
        this.setData({
          scanImgurl: 'http://llwell-wxapp.oss-cn-beijing.aliyuncs.com/PurchasingAssistantShop/top_icon_Refund_success@3x.png',
          scanCode: res.result,
        })


        // var that = this;
        // app.Ajax(
        //   'Shop',
        //   'POST',
        //   'ScanCode',
        //   // { code: '123456' },
        //   { code: res.result },
        //   function (json) {
        //     // console.log('json',json);
        //     if (json.success) {
        //       that.setData({
        //         scanImgurl: 'http://llwell-wxapp.oss-cn-beijing.aliyuncs.com/A-cubic/scanCode1.png',
        //         scanCode:'',
        //         userId: json.data.userId
        //       })
        //     } else {
        //       app.Toast('扫描失败，请重新扫描', 'none', 3000); 

        //     }

        //   }
        // );
      },
      fail: (res) => {
        
      }
    })
  },

  makeSure: function () {
    // this.setData({
    //   showConsume:true
    // })
    let code = this.data.scanCode;
    let type = code.split('_')[0]
    switch (type) {
      // 取货
      case 'ORDER':
        this.handleOrder()
        break;
      // 扫描送积分
      case 'EXCHANGE':
        this.handleExchange()
        break;
      // 扫描消费
      case 'CHECK':
        this.handleCheck()
        break;
      default:
        console.log('default')
        break;
    }
  },
  // 送积分
  handleExchange:function(){
    // 展示积分弹窗
    this.setData({
      showExchange: true
    })
  },
  // 消费
  handleCheck: function () {
    // 展示消费弹窗
    this.setData({
      showCheck: true
    })
  },
  // 确认收货
  handleOrder: function () {
    // 展示收货详情
    this.getList();
  },
  // 获取待收货列表
  getList(){
    const params = {
      code: this.data.scanCode
    }
    const that = this;
    app.Ajax(
      'Store',
      'POST',
      'ScanOrderCode',
      { ...params },
      function (json) {
        if (json.success) {
          app.Toast('操作成功', 'success', 2000);
          that.setData({
            showOrder:true,
            orderId: json.data.orderId,
            listData: json.data.list
          })
        } else {
          that.closeReset();
          app.Toast('', 'none', 3000, json.msg.code);
        }
      }
    )
  },
  // 确认取货
  onSureOrder() {
    const params = {
      orderId: this.data.orderId,
      code: this.data.scanCode
    }
    const that = this;
    app.Ajax(
      'Store',
      'POST',
      'PickupOrderGoods',
      { ...params },
      function (json) {
        if (json.success) {
          that.closeReset();
          app.Toast('取货成功', 'success', 2000);

        } else {
          that.closeReset();
          app.Toast('', 'none', 3000, json.msg.code);
        }
      }
    )

  },
  // 重置
  closeReset() {
    this.setData({
      scanImgurl: 'http://llwell-wxapp.oss-cn-beijing.aliyuncs.com/PurchasingAssistantShop/top_icon_scan_blue_normal@3x.png',
      
      showExchange: false,
      score: '',
      showCheck: false,
      consume: '',
      scanCode: '',
      showOrder: false,
      orderId: '',
      listData:[]
    });
  },
  // 确认送积分
  onSureExchange(){
    if (this.data.score != '') {
      const params = {
        score: this.data.score,
        code: this.data.scanCode
      }
      const that = this;
      app.Ajax(
        'Store',
        'POST',
        'Exchange',
        { ...params},
        function (json) {
          if (json.success) {
            that.closeReset();
            app.Toast('赠送成功', 'success', 2000);
          } else {
            that.closeReset();
            app.Toast('', 'none', 3000, json.msg.code);
          }
        }
      )
    } else {
      app.Toast('请输入赠送积分数量', 'none', 3000);
    }
  },
  bindInputExchange(event) {
    // event.detail 为当前输入的值
    // console.log(event.detail.value);
    this.setData({
      score: event.detail.value
    })
  },
  // 确认消费
  onSureConsume() {
      const params = {
        consume: this.data.consume == '' ? 0 : this.data.consume,
        code: this.data.scanCode
      }
      const that = this;
      app.Ajax(
        'Store',
        'POST',
        'MemberCheckStore',
        { ...params },
        function (json) {
          if (json.success) {
            
            app.Toast('操作成功', 'success', 2000);
            setTimeout(that.closeReset(),2000)
            
          } else {
            that.closeReset();
            app.Toast('', 'none', 3000, json.msg.code);
          }
        }
      )
    
  },
  bindInputConsume(event) {
    // event.detail 为当前输入的值
    // console.log(event.detail.value);
    this.setData({
      consume: event.detail.value
    })
  },


})
