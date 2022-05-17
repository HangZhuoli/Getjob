//index.js
const DB = wx.cloud.database()
let id = ""
let search_content = ""
//字段初始值
Page({
  //跳转至添加活动页面
  add_Data:function(){
  wx.navigateTo({
    url: '/pages/manage/add_data/add_data',
  })
  },
  //跳转至浏览活动页面
  search_Data:function(){
    wx.navigateTo({
      url: '/pages/manage/show_data/show_data',
    })
  },
  search_content(e){
    search_content = e.detail.value
    console.log(search_content)
  },
  //搜索活动
  search(){
    DB.collection('action').where({
      shop_name:DB.RegExp({
        regexp:search_content,
        options:'i'
      })
    }).get({
      success:res=>{
        console.log(res)
      },fail(err){
        console.log(err)
      }
    })
  },
  data:{
    ne:[]
  },
  onLoad:function(e){
  },
  onPullDownRefresh:function(){
    wx.showNavigationBarLoading();
    wx.redirectTo({
      url: '/pages/index/index',
      success:function(res){
        wx.stopPullDownRefresh();
      }
    })
  },
  verify(){
    wx.navigateTo({
      url: '/pages/manage/verify/verify',
    })
  }
})
