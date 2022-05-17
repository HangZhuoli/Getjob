Page({
  data: {
    steps:["我的订单","开始订单","待评论"],
    minutes:0,
    reserve_time:"2021.7.7 下午2:00至3:00",
    reserve_price:50,
    check:false,
    reserve_price:50,
    items:[
      {value:'yes',name:'是'},
      {value:'no',name:'否'}
    ],
    comment: [], //评论内容数组
    userstar:[
      "../../img/lightstar.png",
      "../../img/lightstar.png",
      "../../img/lightstar.png",
      "../../img/lightstar.png",
      "../../img/lightstar.png",
    ],
    score:0,
    meeting:214324243,
    status:6
  },
  
  radioChange(e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value)
    const items = this.data.items
    for (let i = 0, len = items.length; i < len; ++i) {
      items[i].checked = items[i].value === e.detail.value
    }
    this.setData({
      items
    })
  },
  onShareAppMessage() {
    return {
      title: 'radio',
      path: 'page/component/pages/radio/radio'
    }
  },
  star:function(e){
    let that = this
    var index = e.currentTarget.dataset.index
    var t = this.data.userstar
    var len = t.length
    for(var i=0;i<len;i++){
      if(i<=index){
        t[i] = "../../../img/deepstar.png"
        that.setData({
          score:i+1
        })
        
      }else{
        t[i] = "../../../img/lightstar.png"
      }
    }
    that.setData({
      userstar:t
    })
  },
  // onLoad(options) {
  //   wx.cloud.callFunction({
  //     name: "get_openid",
  //     success: res => {
  //       console.log(res)
  //       openid = res.result.openid
  //       console.log("cloudsuccess", openid)
  //     }
  //   })
  //   let user = wx.getStorageSync('user')
  //   user_nickname = user.nickName
  //   user_head = user.avatarUrl
  //   // console.log(options.id)
  //   id = options.id
  //   DB.collection("action")
  //     .doc("2d44d6c2612b8d8407ba0b7c301fcc07")
  //     .get()
  //     .then(res => {
  //       console.log(res)
  //       this.setData({
  //         detail: res.data,
  //         comment: res.data.comment
  //       })
  //     })
  //     .catch(res => {})
  // },
  //获取评论内容
  // getContent(e) {
  //   this.setData({
  //     user_content: e.detail.value
  //   })
  // },
  //发表评论
  // upload_content:function(e) {
  //   console.log(this.data)
  //   let that = this
  //   console.log(this.data.isItem)
  //   let user_content = this.data.user_content
  //   console.log(user_content,user_content.length)
  //   if(this.data.isItem==0){
  //     console.log('ewfwe')
  //     wx.showToast({
  //       icon: "none",
  //       title: '您的问题是否得到解决？',
  //       success(res){
  //       }
  //     })
  //     console.log('ewfwewfrewq')
  //   }else if (user_content.length < 4) {
  //     wx.showToast({
  //       icon: "none",
  //       title: '评论太短或内容为空',
  //       success(res){
  //         that.setData({
  //           user_content:''
  //         })
  //       }
  //     })
  //   }else{
  //   let Comment = {}
  //   //name需获取用户信息后赋值
  //   Comment.name = user_nickname
  //   Comment.content = user_content
  //   Comment.avatarUrl = user_head
  //   Comment.point = this.data.score
  //   let commentArr = this.data.comment
  //   commentArr.push(Comment)
  //   wx.showLoading({
  //     title: '发表中',
  //   })
  //   console.log(id)
  //   console.log(commentArr)
  //   wx.cloud.callFunction({
  //     name: "update_comment",
  //     data: {
  //       id: "2d44d6c2612b8d8407ba0b7c301fcc07",
  //       users_comment: commentArr
  //     }
  //   }).then(res => {
  //     console.log("发表成功")
  //     this.setData({
  //       comment: commentArr,
  //       user_content: ''
  //     })
  //     wx.hideLoading()
  //   }).catch(err => {
  //     console.log("发表失败")
  //     console.log(err)
  //     wx.hideLoading()
  //   })
  // }
  // }
})