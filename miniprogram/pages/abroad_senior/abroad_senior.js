// pages/abroad_senior/abroad_senior.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    apply_msg:[
      {
        number:0,
        msg:"理科"
      },
      {
        number:1,
        msg:""
      }
    ],
    showSheet:false,
    actions:[
      {
        name:'商科',
        color:'#414141',
        className:'sheetItem'
      },
      {
        name:'社科',
        color:'#414141',
        className:'sheetItem'
      },
      {
        name:'数科',
        color:'#414141',
        className:'sheetItem'
      },
      {
        name:'工科',
        color:'#414141',
        className:'sheetItem'
      },
      {
        name:'理科',
        color:'#414141',
        className:'sheetItem'
      },
      {
        name:'金工',
        color:'#414141',
        className:'sheetItem'
      },
      {
        name:'其他',
        color:'#414141',
        className:'sheetItem'
      }
    ],
    fileList: [],
    currentSheetNumber: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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

  },
  letShow(e){
    let number = e.currentTarget.dataset.num;
    this.setData({
      showSheet:true,
      currentSheetNumber:number
    })
  },
  onClose(){
    this.setData({
      showSheet:false
    })
  },
  onSelect(e){
    console.log(e)
    let currentNumber = this.data.currentSheetNumber
    this.data.apply_msg[currentNumber].msg = e.detail.name
    this.setData({
      apply_msg:this.data.apply_msg
    })
  },
  afterRead(event) {
    const { file } = event.detail;
    wx.uploadFile({
      url: 'https://example.weixin.qq.com/upload', // 等待接口地址
      filePath: file.url,
      name: 'file',
      formData: { user: 'test' },
      success(res) {
        const { fileList = [] } = this.data;
        fileList.push({ ...file, url: res.data });
        this.setData({ fileList });
      },
    });
  },
  add_apply(){
    let apply_length = this.data.apply_msg.length;
    let apply_item = {
      number:apply_length,
      msg:""
    }
    this.data.apply_msg.push(apply_item)
    this.setData({
      apply_msg:this.data.apply_msg
    })
  }
})