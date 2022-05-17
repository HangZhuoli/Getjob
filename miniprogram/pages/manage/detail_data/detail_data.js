let id = ""
Page({
  data:{
    datalist:'',
    isIng:["正在报名中","已结束报名"]
  },
  goToShow:function(){
    wx.navigateTo({
      url: '/pages/manage/show_data/show_data',
    })
  },
  revise_data:function(){
    wx.navigateTo({
      url: '/pages/manage/revise_data/revise_data?id='+id,
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
  }
})