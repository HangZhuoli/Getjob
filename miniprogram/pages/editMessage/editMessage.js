// pages/editMessage/editMessage.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userId:"",//用户id
    userAvatarUrl:"",
    pickerValueGender:0,
    pickerValueEdu:0,
    pickerValueStatus:0,
    pickerArrayGender:['男','女'],
    pickerArrayEdu:['研究生','本科','专科'],
    pickerArrayStatus:['在校生','工作','创业','其他']
  },
  /**
   * 生命周期函数--监听页面加载
   */
  bindChange(e){
    console.log(e.currentTarget);
    if(e.currentTarget.dataset.index === "0"){
      console.log('picker发送选择改变，携带值为', e.detail.value)
      this.setData({
        pickerValueGender:e.detail.value
      })
    }else if(e.currentTarget.dataset.index === "1"){
      this.setData({
        pickerValueEdu:e.detail.value
      })
    }else if(e.currentTarget.dataset.index === "2"){
      this.setData({
        pickerValueStatus:e.detail.value
      })
    }
  },
  onLoad: function (options) {
    this.setData({
      userId:options.id,
      userAvatarUrl:options.avatarUrL
    })
    console.log(this.data.userAvatarUrl)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function (options) {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})