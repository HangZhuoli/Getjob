
Page({
  data:{
    datalist:'',

  },
  onLoad:function(){
    let that = this
    wx.cloud.callFunction({
      name:'get_verify',
      success(res){
        console.log("succ",res)
        that.setData({
          datalist:res.result.data
        })
      }
    })
  },
  to_detail(e){
    wx.navigateTo({
      url: '/pages/manage/verify_detail/verify_detail?id='+e.currentTarget.dataset.item._id,
    })
  }
})