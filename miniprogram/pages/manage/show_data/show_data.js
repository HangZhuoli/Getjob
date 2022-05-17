// miniprogram/pages/main/main.js
var utils = require('../../utils/utils.js')
const DB = wx.cloud.database()
const db = DB.collection('action')
let search_content = ""
let index = ""
let time_now = []
let time_now_y = []
let start_time = []
let start_time_y = []
Page({
  data: {
    datalist:[],
    isIng:["正在报名中","已结束报名"],
    touchStartX:"",
    touchStartIndex:-1,
    isTouchMove:false,
    index:""
  },
  goToIndex:function(){
    wx.navigateTo({
      url: '/pages/manage/index/index',
    })
  },
  //此处需重写，但是我懒得写，有空再写
  onShow:function(){
    let that = this
    wx.cloud.callFunction({
      name:"get_datalist",
      success(res){
        console.log("成功")
        console.log(res)
        for(var i = 0;i<res.result.data.length;i++){
          var TIME = utils.formatTime(new Date())
          var timeS = res.result.data[i].start_date
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
          db.doc(res.result.data[i]._id).update({
            data:{
              index:index
            }
          })
        }
        wx.cloud.callFunction({
          name:'get_datalist',
        }).then(res=>{
          that.setData({
            datalist:res.result.data
          })
        }).catch(err=>{
          console.log("获取失败",err)
        })
      },
    })
  },
  to_detail(e){
    wx.navigateTo({
      url: '/pages/manage/detail_data/detail_data?id=' + e.currentTarget.dataset.item._id,
    })
  },
  data_del:function(e){
    let id = e.currentTarget.dataset.item._id;
    let that = this
    console.log(id)
    DB.collection('action').doc(id).remove({
      success(res){
        wx.showToast({
          title: '删除成功',
          duration:1000
        })
        that.setData({
          datalist:that.data
        })
        },
      fail(fail){
        wx.showToast({
          title: '删除失败',
          icon:'error',
          duration:1000
        })
      }
    }),
    wx.navigateTo({
      url: '/pages/manage/show_data/show_data',
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
  touchStart: function (e) {
    //开始触摸时 重置所有删除
    console.log("111"+e.currentTarget.dataset.index)
    this.setData({
      touchStartX:e.changedTouches[0].clientX,
      touchStartIndex:e.currentTarget.dataset.index
    })
    
  },
  //滑动事件处理
  touchEnd: function (e) {
    this.data.datalist.forEach(function(v){
      v.isTouchMove=false;
    })
    var endIndex=e.currentTarget.dataset.index;
    if(this.data.touchStartIndex!=endIndex){
      this.setData({
        datalist:this.data.datalist
      })
      return;
    }
    var touchStartX=this.data.touchStartX;
    var touchEndX=e.changedTouches[0].clientX;
    var isTouchMove=false;
    if(touchEndX>touchStartX){

    }else{
      isTouchMove=true;
    }
    this.data.datalist[endIndex].isTouchMove=isTouchMove
    this.setData({
      datalist:this.data.datalist
    })
  },
})