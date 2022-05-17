const DB = wx.cloud.database().collection("apply_big_info")
let education = ""
let gra_school = ""
let major = []
let company = ""
let duty = ""
let profession = ""
let cost = ""
let introduction = ""
let id = ""
let img_id = []
let file_id = []
let user_data = []  
let person_edu="";
Page({
  /**
   * 页面的初始数据
   */
  data: {
    school:"",
    edu_record:"",
    cost:"",
    apply_msg:[
      {
        number:0,
        msg:""
      }
    ],
    showSheet:false,
    showSheet_edu:false,
    actions:[
      {
        name:'计算机/互联网/通信',
        color:'#414141',
        className:'sheetItem'
      },
      {
        name:'金融/银行/投资/保险',
        color:'#414141',
        className:'sheetItem'
      },
      {
        name:'商业/服务业/个体经营',
        color:'#414141',
        className:'sheetItem'
      },
      {
        name:'生产/工艺/制造',
        color:'#414141',
        className:'sheetItem'
      },
      {
        name:'医疗/护理/制药',
        color:'#414141',
        className:'sheetItem'
      },
      {
        name:'文化/广告/传媒',
        color:'#414141',
        className:'sheetItem'
      },
      {
        name:'娱乐/艺术/表演',
        color:'#414141',
        className:'sheetItem'
      },
      {
        name:"法务/律师/检察官/法官",
        color:'#414141',
        className:'sheetItem'
      },
      {
        name:'教育/培训',
        color:'#414141',
        className:'sheetItem'
      },
      {
        name:'公务员/行政/事业单位',
        color:'#414141',
        className:'sheetItem'
      },
      {
        name:'学生',
        color:'#414141',
        className:'sheetItem'
      }
    ],
    actions_edu:[
      {
        name:'研究生',
        color:'#414141',
        className:'sheetItem'
      },
      {
        name:'本科',
        color:'#414141',
        className:'sheetItem'
      },
      {
        name:'专科',
        color:'#414141',
        className:'sheetItem'
      },
      {
        className:'sheetItem_last'
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
  letShow_edu(){
    this.setData({
      showSheet_edu:true
    })
  },
  onClose(){
    this.setData({
      showSheet:false
    })
  },
  onClose_edu(){
    this.setData({
      showSheet_edu:false
    })
  },
  onSelect(e){
    console.log(e)
    let currentNumber = this.data.currentSheetNumber
    this.data.apply_msg[currentNumber].msg = e.detail.name
    this.setData({
      apply_msg:this.data.apply_msg,
    })
    major.push(e.detail.name);
  },
  onSelect_edu(e){
    console.log(e);
    this.setData({
      edu_record:e.detail.name
    })
    person_edu=e.detail.name;
    console.log(person_edu);

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
  },
  add_school(e){
    console.log(e);
    gra_school=e.detail.value;
  },
  add_cost:function(e){
    console.log(e);
    cost=e.detail.value;
  },
  add_introduction:function(e){
    console.log(e);
    introduction=e.detail.value;
  },
  update_all_message(e){
    DB.add({
      data:{
        _id:id,
        education:person_edu,
        gra_school:gra_school,
        cost:cost,
        introuduction:introduction,
        major:major,
        user_info:user_data,
      },
      success:res=>{
        wx.showToast({
          title: '提交成功',
          duration:1000,
        })
        this.setData({
          education:'',
          major:[],
          company:'',
          duty:'',
          profession:'',
          cost:'',
          introduction:'',
        })
      }
    })
  },
  
})