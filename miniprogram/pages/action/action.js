var utils = require('../utils/utils.js')
const DB = wx.cloud.database()
const db = DB.collection('action')
let search_content = ""
let index = ""
Page({
  data: {
    datalist:[],
    isIng:["正在报名中","已结束报名"],
    index:""
  },
  // goToIndex:function(){
  //   wx.navigateTo({
  //     url: '/pages/manage/index/index',
  //   })
  // },
  onLoad:function(){
    console.log(1)
    wx.cloud.database().collection('action').get().then(res=>{
        console.log("成功")
        console.log(res)
        for(var i = 0;i<res.data.length;i++){
          var TIME = utils.formatTime(new Date())
          var timeS = res.data[i].start_date
          var TIME_NOW = TIME.substring(0,10).split("/")
          var times = timeS.substring(0,10).split("/")
          TIME = TIME_NOW[1]+'-'+TIME_NOW[2]+'-'+TIME_NOW[0]+' '+TIME.substring(10,16)+":"+"00"
          timeS = times[1]+'-'+times[2]+'-'+times[0]+' '+timeS.substring(10,16)+":"+"00"
          var bj = (Date.parse(timeS) - Date.parse(TIME)) / 3600/1000;
          console.log(TIME)
          console.log(timeS)
          console.log(bj)
          if(bj<0){
            index = 1
          }else{
            index = 0
          }
          console.log("index=",index)
          db.doc(res.data[i]._id).update({
            data:{
              index:index
            }
          })
        }
        this.order()
      })
  },
  to_detail(e){
    wx.navigateTo({
      url: '/pages/action_detail/action_detail?id=' + e.currentTarget.dataset.item._id,
    })
  },
  search_content(e){
    search_content = e.detail.value
    console.log(search_content)
  },
  //查询
  search(){
    if(search_content == ""){
      var that = this
      wx.cloud.callFunction({
        name:'get_datalist',
        success(res){
          console.log('update suc')
          that.setData({
            datalist:res.result.data
          })
        }
      })
    }else{
    DB.collection('action').where({
      shop_name:DB.RegExp({
        regexp:search_content,
        options:'i'
      })
    }).get().then(res =>{
      console.log(res)
      this.setData({
        datalist:res.data
      })
    })
  }
  },
  sortBytimeA(){
    DB.collection('action').orderBy("start_date","asc")
    .get()
    .then(res =>{
      this.setData({
        datalist:res.data
      })
    }).catch(err =>{
      console.log("fail")
    })
  },
  sortBytimeD(){
    DB.collection('action').orderBy("start_date","desc")
    .get()
    .then(res =>{
      this.setData({
        datalist:res.data
      })
    }).catch(err =>{
      console.log("fail")
    })
  },
  order:function(){
    DB.collection('action').orderBy("index","asc")
    .get()
    .then(res =>{
      this.setData({
        datalist:res.data
      })
    }).catch(err =>{
      console.log("fail")
    })
  }
})