// pages/zhixun/zhixun.js
const DB = wx.cloud.database().collection('big_list')
Page({
  data: {
    search:"",//搜索框输入内容
    biglist:"",
    selected:0,
    selected1:0,
    selected2:0,
    border_radius:['20rpx 0 0 20rpx','0 20rpx 20rpx 0'],
    list:['求职','留学'],
    list0:['互联网','金融','咨询','快消'],
    list1:['商科','社科','数科','工科','理科','金工','其它'],
    posters:[
      {url:'../../img/zhixun/1591750120020.jpeg'},
      {url:'../../img/zhixun/1591750124013.jpeg'},
      {url:'../../img/zhixun/1591750129767.jpeg'},
      {url:'../../img/zhixun/1591750146246.jpeg'},
      {url:'../../img/zhixun/1591750150520.jpeg'},
      {url:'../../img/zhixun/1591750159293.jpeg'}
    ],
    bingo:true,
    /* 头像字段 avatarUrl
    * 名字字段 nickName
    * 其他字段暂未设计(根据审核方式修改)
    */
    big_mes:''
  },
  selected:function(e){
    console.log(e)
    let that=this
    let index=e.currentTarget.dataset.index
    console.log(index)
    if(index==0){
      that.setData({
        selected:0
      })
    }else{
      that.setData({
        selected:1
      })
    }
  },
  selected1:function(e){
    console.log(e)
    let that=this
    let index=e.currentTarget.dataset.index
    console.log(index)
    if(index==0){
      that.setData({
        selected1:0
      })
    }else if(index==1){
      that.setData({
        selected1:1
      })
    }else if(index==2){
      that.setData({
        selected1:2
      })
    }else{
      that.setData({
        selected1:3
      })
    }
  },
  selected2:function(e){
    console.log(e)
    let that=this
    let index=e.currentTarget.dataset.index
    console.log(index)
    if(index==0){
      that.setData({
        selected2:0
      })
    }else if(index==1){
      that.setData({
        selected2:1
      })
    }else if(index==2){
      that.setData({
        selected2:2
      })
    }else if(index==3){
      that.setData({
        selected2:3
      })
    }else if(index==4){
      that.setData({
        selected2:4
      })
    }else if(index==5){
      that.setData({
        selected2:5
      })
    }else{
      that.setData({
        selected2:6
      })
    }
  },
  onLoad(){
    console.log("a")
    wx.cloud.database().collection("big_list").get().then(res=>{
      this.setData({
        big_mes:res.data
      })
    })
  },
  search_content(){
    
  },
  big_detail(e){
    console.log(e)
    wx.navigateTo({
      url: '/pages/big_detail/big_detail?id='+e.currentTarget.dataset.item._id,
    })
  }
})