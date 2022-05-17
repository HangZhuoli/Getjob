// miniprogram/pages/apply_big/apply_big.js
const DB = wx.cloud.database().collection
("apply_big_info")
let education = ""
let gra_school = ""
let major = ""
let company = ""
let duty = ""
let profession = ""
let cost = ""
let introduction = ""
let id = ""
let img_id = []
let file_id = []
let user_data = []
Page({
  add_education(e){
    education = e.detail.value
  },
  add_gra(e){
    gra_school = e.detail.value
  },
  add_major(e){
    major = e.detail.value
  },
  add_company(e){
    company = e.detail.value
  },
  add_duty(e){
    duty = e.detail.value
  },
  add_profession(e){
    profession = e.detail.value
  },
  add_cost(e){
    cost = e.detail.value
  },
  add_introduction(e){
    introduction = e.detail.value
  },
  data: {
    show:false,
    buttons:[
      {
        type:'primary',
        text:'图片',
        value:0
      },{
        type:'primary',
        text:'文件',
        value:1
      }
    ]
  },
  upload_big_info(){
    this.setData({
      show:true
    })
  },
  choosefile:function(e){
    console.log(e.detail.index)
    if(e.detail.index == 0){
      wx.chooseImage({
        count: 1,
        sizeType:['compressed','original'],
        sourceType:['album','camera'],
        success:res=>{
          var timestamp = Date.parse(new Date());
          const filepath = res.tempFilePaths[0];
          const cloudpath = id+'/'+timestamp+filepath.match(/\.[^.]+?$/)[0];
          wx.cloud.uploadFile({
            cloudPath:cloudpath,
            filePath:filepath,
            success:res=>{
              wx.showToast({
                title: '上传成功',
                duration:1000
              })
              img_id.push(res.fileID)
            }
          })
        }
      })
    }
    else{
      wx.chooseMessageFile({
        count: 1,
        type:'file',
        success:res=>{
          var size = res.tempFiles[0].size;
          var name = res.tempFiles[0].name;
          var filepath = res.tempFiles[0].path;
          var newfilename = name + "";
          const cloudpath = id+'/'+name+filepath.match(/\.[^.]+?$/)[0];
          if(size > 10485760 || newfilename.indexOf(".pdf") == -1){
            wx.showToast({
              title: '文件大小不能超过10MB,格式必须为pdf',
              duration:2000
            })
          }else{
            wx.showLoading({
              title: '上传中',
              mask:true,
            })
            wx.cloud.uploadFile({
              cloudPath:cloudpath,
              filePath:filepath,
              success:res=>{
                wx.hideLoading({
                  success: (res) => {
                    wx.showToast({
                      title: '上传成功',
                    })
                  },
                })
                file_id.push(res.fileID)
              }
            })
          }
        }
      })
    }
  },
  upload(){
    DB.add({
      data:{
        _id:id,
        user_info:user_data,
        education:education,
        gra_school:gra_school,
        major:major,
        company:company,
        duty:duty,
        profession:profession,
        cost:cost,
        introduction:introduction,
        img_id:img_id,
        file_id:file_id
      },
      success:res=>{
        wx.showToast({
          title: '提交成功',
          duration:1000
        })
        this.setData({
          education:'',
          gra_school:'',
          major:'',
          company:'',
          duty:'',
          profession:'',
          cost:'',
          introduction:''
        })
      }
    })
  },
  onLoad(option){
    id = option.id
    console.log(id)
    wx.cloud.database().collection('user_info').doc(id).get({
      success(res){
        console.log(res)
        user_data = res.data
        console.log(user_data)
      },
      fail(err){
        console.log(err)
      }
    })
  },
  goToDetail(){
    wx.navigateBack({
      delta: 0,
    })
  }
})