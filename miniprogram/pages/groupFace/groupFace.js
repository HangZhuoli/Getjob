// pages/groupFace/groupFace.js
let id = ""
Page({
  data: {
    datalist:'',
    isIng:["正在报名中","已结束报名"]
  },
  goToAction:function(){
    wx.navigateTo({
      url: '/pages/action/action',
    })
  },
  onLoad(options){
    console.log(options.id)
    id = options.id
    wx.cloud.database().collection("action")
    .doc(options.id)
    .get()
    .then(res=>{
      this.setData({
        datalist:res.data
      })
  })
    .catch(res=>{

  })
  },
  
})