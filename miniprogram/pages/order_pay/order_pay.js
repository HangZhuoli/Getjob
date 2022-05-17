const DB = wx.cloud.database()
let datalist = ""
let id = ""
let index = ''
var num = ''
Page({
  data:{
    datalist:'',
    choice:'',
    price:'',
    isAgree:false
  },
  onLoad:function(optinons){
    console.log(optinons.id)
    console.log(optinons.price)
    console.log(optinons.index)
    index = optinons.index
    id = optinons.id
    num = optinons.num
    if(optinons.index==0){
      this.setData({
        choice:'正式位',
        price:optinons.price
      })
    }else{
      this.setData({
        choice:'旁听位',
        price:optinons.price
      })
    }
    wx.cloud.database().collection("action")
    .doc(optinons.id)
    .get()
    .then(res=>{
      this.setData({
        datalist:res.data
      })
    }).catch(err=>{
      console.log(err)
    })
  },
  pay(e){
    if(!this.data.isAgree){
      wx.showModal({
        content: '请先阅读并同意用户协议和买家须知条款',
      })
    }else{
      wx.showLoading({
        title: '正在锁定位置',
      })
      DB.collection('action').doc(id).get().then(res=>{
        if(index==0){
          if(res.data.num_selectable>0){
            num = res.data.num_selectable
            wx.hideLoading({
              success: (res) => {
                this.prepay(num_selectable);
              },
            })
          }else{
            wx.hideLoading({
              success: (res) => {
                wx.showToast({
                  title: '位置已经售空',
                  duration:2000,
                  icon:'none'
                })
              },
            })
            num+=1
          }
        }else{
          if(res.data.num_listen>0){
            num = res.data.num_listen
            wx.hideLoading({
              success: (res) => {
                this.prepay(num_listen);
              },
            })
          }else{
            wx.hideLoading({
              success: (res) => {
                wx.showToast({
                  title: '位置已经售空',
                  duration:2000,
                  icon:'none'
                })
              },
            })
          }
        }
      })
    }
    
  },
  prepay(seat){
    num -= 1
    console.log(this.data.isAgree)
    if(this.data.isAgree){
      let order1 = this.orderCode()
      console.log(this.data)
      DB.collection("my_order").add({
        data:{
          _id:order1,
          time:DB.serverDate(),
          name:this.data.datalist.shop_name,
          totalFee:this.data.price,
          status:0,
          big_name:this.data.datalist.no_name_big,
          company:this.data.datalist.work_place,
          tap:this.data.datalist.tap,
          start_time:this.data.datalist.start_date,
          end_time:this.data.datalist.end_date,
          tradeNO:order1
        }
      }).then(res=>{
        console.log(res)
        wx.showToast({
          title: '订单创建成功',
        })
        console.log("succ")
        this.goPay(order1,seat)
      }).catch(err=>{
        console.log("fail")
      })

      wx.navigateTo({
        url: '../my_order/my_order',
      })
    }else{
      wx.showModal({
        title: '提示',
        content: '请阅读并同意用户协议、买家须知条款',
        success (res) {
          if (res.confirm) {
            console.log('用户点击确定')
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    }
  },
  goToDetail:function(){
    wx.navigateTo({
      url: '/pages/action_detail/action_detail?id='+id,
    })
  },
  goPay(order1,seat){
    wx.cloud.callFunction({
      name:'pay',
      data:{
        good_name:this.data.datalist.shop_name,
        tradeNO:order1,
        totalFee:1
      },
      success:res=>{
        console.log("参数succ",res)
        const payment = res.result.payment
        wx.requestPayment({
        ...payment,
        success(res){
          console.log('支付成功',res)
          console.log(this)
          wx.cloud.database().collection("my_order").doc(order1).update({
            data:{
              status:1
            }
          }).then(res=>{
            wx.cloud.database().collection('action').doc(id).update({
              data:{
                seat:num
              }
            }).then(res=>{
              wx.redirectTo({
                url: '/pages/my_order/my_order?id='+id,
              })
            })
          }).catch(err=>{
            console.log("update f")
          })
        },
        fail(err){
          console.log("支付失败",err)
        }
        })
      }
    })
  },
  orderCode(){
    let ordercode = ''
    for(var i =0;i<6;i++){
      ordercode += Math.floor(Math.random()*10);
    }
    ordercode = 'W' + new Date().getTime() +ordercode
    return ordercode
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
  agree:function(){
    var isAgree = this.data.isAgree;
    isAgree=!isAgree;
    this.setData({
      isAgree:isAgree
    })
  },
})