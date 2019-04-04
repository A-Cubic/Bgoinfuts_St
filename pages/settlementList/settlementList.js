// pages/settlementList/settlementList.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    noRecord:'暂时没有相关记录',
    getData:[],
    getDataOld: [
      {
        paymentDays: '2019-01-01 ~ 2019-06-01',
        heartNum: '200000',
        state: '待付款'
      }, {
        paymentDays: '2019-01-01 ~ 2019-06-01',
        heartNum: '200000',
        state: '已付款'
      }
    ], 
    
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getMainList()
  },
  getMainList: function () {
    const that = this;
    app.Ajax(
      'Store',
      'POST',
      'GetStoreAccount',
      {},
      function (json) {
        console.log('aaa', json);
        if (json.success) {
          that.setData({
            getData: json.data
          })
        } else {
          app.Toast('', 'none', 3000, json.msg.code);
          // wx.showToast({
          //   title: json.msg.msg,
          //   icon: 'none',
          //   duration: 2500
          // });
        }
      }
    )
  },

})