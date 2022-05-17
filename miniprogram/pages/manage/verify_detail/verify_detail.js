let id = ""
Page({
  data:{
    datalist:'',
    imglist:''
  },
  onLoad(options){
    id = options.id
    console.log(id)
    let that = this
    wx.cloud.callFunction({
      name:'get_verify_detail',
      data:{
        id:id
      },
      success(res){
        console.log(res)
        that.setData({
          datalist:res.result.data,
          imglist:res.result.data.img_id
        })
      }
    })
  },
  agree(){
    wx.cloud.database().collection("user_info").doc(id).update({
      data:{
        isbig:true
      },
      success(res){
        console.log(res)
      }
    })
    console.log(this.data)
    let that = this
    wx.cloud.database().collection("big_list").add({
      data:{
        _id:id,
        // _openid:id,
        data:that.data.datalist,
        star:0,
        consultNum:0,
        comment:[],
        my_freetime:[],
        labels:[]
      }
    })
    console.log(id)
    wx.cloud.callFunction({
      name:'del_apply',
      data:{
        id:id
      },success(res){
        console.log(res)
        wx.showToast({
          title: '通过成功',
          duration:2000
        })
        wx.navigateBack({
          delta: 2,
        })
      }
    })
    // wx.cloud.database().collection("apply_big_info").doc(id).remove().then(res=>{
    //   wx.showToast({
    //     title: '通过成功',
    //     duration:2000,
    //   })
    //   wx.navigateBack({
    //     delta: 2,
    //   })
    // })
  },
  view_pdf:function(){
    console.log("ok",this.data)
    wx.cloud.downloadFile({
      fileID:this.data.datalist.file_id[0],
      success(res){
        console.log("download ok",res)
        var filepath = res.tempFilePath
        wx.openDocument({
          filePath: filepath,
          success(res){
            console.log("open succ")
          }
        })
      }
    })
  }
})