// miniprogram/pages/main/main.js
const DB = wx.cloud.database().collection
("user_infomation")
let user_openid = ""
const phone = ""
let cloudID = ""
Page({
  data:{
    phoneNumber:'',
    viewShowed:true,
    weRunData:"",
    //不为空隐藏登录按钮
    user_info:'',
    big:''
  },
  cancle:function(){
    wx.getStorageSync('get_phone','2')
    this.setData({
      viewShowed:true
    })
  },
  onShow:function(){
    var phone = wx.getStorageSync('get_phone');
    var that = this;
    if(phone != '2'){
      that.setData({
        viewShowed:false
      })
    }
  },
  getPhoneNumber:function(e){
    console.log(e)
    console.log(e.detail)
    this.getPhoneNumberData(e.detail.cloudID)
  },
  getPhoneNumberData:function(cloudID){
    wx.cloud.callFunction({
      name:'get_phone',
      data:{
        weRunData:wx.cloud.CloudID(cloudID),
        obj:{
          shareInfo:wx.cloud.CloudID(cloudID)
        }
      }
    })
    .then(res=>{
      console.log(res)
      this.setData({
        phoneNumber:res.result.event.weRunData.data.phoneNumber,
        viewShowed:true
      })
    })
    .catch(err=>{
      console.log(err)
    })
  },
  onLoad(){
    wx.cloud.callFunction({
      name:"get_openid",
      success:res=>{
        user_openid = res.result.openid
        console.log("cloudsuccess",user_openid)
      }
    })
    let user = wx.getStorageSync('user')
    this.setData({
      user_info:user
    })
  },
  login(){
    wx.getUserProfile({
      desc: '登录',
      success:res=>{
        //缓存本地
        console.log(res)
        wx.setStorageSync('user', res.userInfo)
        DB.add({
          data:{
            user:res.userInfo,
            big:''
          }
        })
        wx.showToast({
          title: '登录成功',
          duration:1000
        })
        this.setData({
          user_info:res.userInfo
        })
      },
      fail(res){
      console.log("fail")
      }
    })
  },
  apply_big:function(){
    wx.navigateTo({
      url: '/pages/apply_big/apply_big?id='+user_openid,
      success:res=>{
        wx.setNavigationBarTitle({
          title: '前辈认证',
        })
      }
    })
  },
  modify_userinfo:function(){
    wx.navigateTo({
      url: '/pages/modify_userinfo/modify_userinfo',
      success:res=>{
        wx.setNavigationBarTitle({
          title: '修改个人信息',
        })
      }
    })
  },
  admin_login(){
    wx.navigateTo({
      url: '/pages/admin_login/admin_login',
      success:res=>{
        wx.setNavigationBarTitle({
          title: '管理员登录',
        })
      }
    })
  },
  my_freetime(){
    wx.navigateTo({
      url: '/pages/my_freetime/my_freetime?id='+user_openid,
      success:res=>{
        wx.setNavigationBarTitle({
          title: '我的时间',
        })
      }
    })
  },
  my_order(){
    wx.cloud.callFunction({
      name:"get_openid",
      success:res=>{
        user_openid = res.result.openid
      }
    })
    wx.navigateTo({
      url: '/pages/my_order/my_order?id='+user_openid,
      success:res=>{
        wx.setNavigationBarTitle({
          title: '我的订单',
        })
      }
    })
  }
})