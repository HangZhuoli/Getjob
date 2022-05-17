//const { fail } = require("assert/strict")

// pages/mine/mine.js
const DB = wx.cloud.database().collection("user_info")
let useropenid = ""
const phone = ""
let cloudID = ""
let user_phonenumber = ""
let isBig = false
let head_fileID = ''
Page({
  data: {
    openid: '',
    phoneNumber: '',
    viewShowed: true,
    weRunData: "",
    user_info: '',
    isBig: false,
    avatarUrl: '',
    nickName: '',
    showModel: true,
    showSheet: false,
    actions:[
      {
        name:'求职前辈认证',
        color:'#FF8D5B',
        url:'../job_senior/job_senior',
        className:'sheetItem'
      },
      {
        name:'留学前辈认证',
        color:'#FF8D5B',
        url:'../abroad_senior/abroad_senior',
        className:'sheetItem'
      },
      {
        name:'    '
      }
    ]
  },
  cancle: function () {
    wx.getStorageSync('get_phone', 'a')
    this.setData({
      viewShowed: true
    })
  },
  /**
   * 控制显示
   */
  reviseName: function () {
    console.log(1)
    this.setData({
      showModal: true
    })

  },
  /**
   * 点击返回按钮隐藏
   */
  back: function () {
    this.setData({
      showModal: false
    })
  },
  /**
   * 获取input输入值
   */
  wish_put: function (e) {
    this.setData({
      textV: e.detail.value
    })
  },
  /**
   * 点击确定按钮获取input值并且关闭弹窗
   */
  name: function () {
    let that = this
    console.log(this.data.textV)
    let us = wx.getStorageSync('user')
    us.nickName = this.data.textV
    wx.setStorageSync('user', us)
    let user_info = this.data.user_info
    user_info.nickName = this.data.textV
    wx.cloud.database().collection("user_info").doc(useropenid).update({
      data:{
        user:user_info
      },success(res){
        console.log('修改成功')
      }
    })
    this.setData({
      showModal: false,
      nickName: this.data.textV
    })
  },
  onShow: function () {
    var phone = wx.getStorageSync('get_phone');
    var that = this;
    var reg = /^[0-9]{11}$/
    if (reg.test(phone)) {
      that.setData({
        viewShowed: true,
        phoneNumber: phone
      })
    } else {
      that.setData({
        viewShowed: false
      })
    }
  },
  getPhoneNumber: function (e) {
    console.log(e)
    this.getPhoneNumberData(e.detail.cloudID)
  },
  getPhoneNumberData: function (cloudID) {
    wx.cloud.callFunction({
        name: 'get_phone',
        data: {
          weRunData: wx.cloud.CloudID(cloudID),
          obj: {
            shareInfo: wx.cloud.CloudID(cloudID)
          }
        }
      })
      .then(res => {
        console.log(res)
        user_phonenumber = res.result.event.weRunData.data.phoneNumber,
          this.setData({
            phoneNumber: res.result.event.weRunData.data.phoneNumber,
            viewShowed: true
          })
        wx.setStorageSync('get_phone', user_phonenumber)
        DB.doc(useropenid).update({
          data: {
            phonenumber: user_phonenumber
          }
        }).then(res => {
          console.log("update pn succ")
        }).catch(err => {
          console.log("update pn err")
        })
      })
      .catch(err => {
        console.log(err)
      })
  },
  onLoad() {
    wx.cloud.callFunction({
      name: "get_openid",
      success: res => {
        console.log(res)
        useropenid = res.result.openid
        console.log("cloudsuccess", useropenid)
        DB.doc(useropenid).get().then(res => {
          console.log("succ")
          console.log(res)
          this.setData({
            isBig: res.data.isbig,
            openid: useropenid,
          })
        }).catch(err => {
          console.log(2)
        })
      }
    })
    let user = wx.getStorageSync('user')
    this.setData({
      user_info: user,
      avatarUrl: user.avatarUrl,
      nickName: user.nickName
    })
  },
  login() {
    wx.cloud.callFunction({
      name: "get_openid",
      success: res => {
        useropenid = res.result.openid
        wx.setStorageSync('get_phone', 'a')
      }
    })
    wx.getUserProfile({
      desc: '登录',
      success: res => {
        //缓存本地
        console.log(res)
        wx.setStorageSync('user', res.userInfo)
        DB.add({
          data: {
            user: res.userInfo,
            avatarUrl: res.userInfo.avatarUrl,
            nickName: res.userInfo.nickName,
            isbig: isBig,
            my_order: [],
            my_freetime: [],
            _id: useropenid,
            phonenumber: ''
          }
        })
        wx.showToast({
          title: '登录成功',
          duration: 1000
        })
        console.log(res)
        this.setData({
          user_info: res.userInfo
        })

      },
      fail(res) {
        console.log("fail")
      }
    })
  },
  my_order(e) {
    console.log(e.currentTarget)
    console.log(useropenid)
    wx.navigateTo({
      url: '/pages/my_order/my_order?id=' + useropenid,
    })
  },
  my_freetime() {
    wx.navigateTo({
      url: '/pages/my_freetime/my_freetime?id=' + useropenid,
    })
  },
  stu_book() {
    wx.navigateTo({
      url: '/pages/stu_book/stu_book?id=' + useropenid,
    })
  },
  about_us() {
    wx.navigateTo({
      url: '/pages/about_us/about_us?id=' + useropenid,
    })
  },
  apply_big() {
    console.log(useropenid)
    wx.navigateTo({
      url: '/pages/apply_big/apply_big?id=' + useropenid,
    })
  },
  setting() {
    wx.navigateTo({
      url: '/pages/manage/index/index',
    })
  },
  modify_head() {
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed', 'original'],
      sourceType: ['camera', 'album'],
      success: res => {
        //存储路径
        var timestamp = Date.parse(new Date())
        const filepath = res.tempFilePaths[0]
        const cloudpath = 'big_head/' + timestamp + filepath.match(/\.[^.]+?$/)[0];
        wx.cloud.uploadFile({
          cloudPath: cloudpath,
          filePath: filepath,
          success: res => {
            wx.showToast({
              title: '上传成功',
              duration: 1000
            })
            head_fileID = res.fileID
            let us = wx.getStorageSync('user')
            us.avatarUrl = head_fileID
            wx.setStorageSync('user', us)
            this.setData({
              avatarUrl: head_fileID
            })
            let user = this.data.user_info
            user.avatarUrl = head_fileID
            wx.cloud.database().collection("user_info").doc(useropenid).update({
              data: {
                user: user
              },
              success: res => {
                console.log("修改成功")
              }
            })
          }
        })
      }
    })
  },
  edit_message() { //修改用户信息
    let icon = this.data.avatarUrl
    wx.navigateTo({
      url: '/pages/editMessage/editMessage?avatarUrl='+icon,
    })
  },
  //控制弹出列表
  letShow(){
    this.setData({
      showSheet:true
    })
  },
  onClose(){
    this.setData({
      showSheet:false
    })
  },
  onSelect(event){
    wx.navigateTo({
      url: event.detail.url,
    })
  }
})