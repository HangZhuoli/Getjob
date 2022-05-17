let cost = ''
let date = ''
let start_t = ''
let choiced_time = []
let id = ''
let changed_time = []
let big_info = ''
let user_openid = ''
let small_info = ''
let point = ''
let order_status=['待支付','待前辈确认','订单待开始','前辈已拒绝','订单进行中','待评价','订单已结束','订单已取消']
Page({

  /**
   * 页面的初始数据
   */
  data: {
    steps: ["预约订单", "开始订单", "待评论"],
    minutes: 0,
    reserve_price: 0,
    check: false,
    reserve_time: [{
        begintime: '10:00',
        copy: ["永不"],
        date: '2021-09-03',
        endtime: '11:15',
        isfree: false
      }
      // {
      //   begintime:'10:00',
      //   copy: ["永不"],
      //   date:'2021-09-03',
      //   endtime:'10:45',
      //   isfree: false
      // }
    ],
    reserve_fengetime: [],
    // [
    //   {
    //     begintime:'',
    //     endtime:'',
    //     isfree:true
    //   },
    //   {
    //     begintime:'',
    //     endtime:'',
    //     isfree:true
    //   },
    //   {
    //     begintime:'',
    //     endtime:'',
    //     isfree:true
    //   },
    //   {
    //     begintime:'',
    //     endtime:'',
    //     isfree:true
    //   },
    //   {
    //     begintime:'',
    //     endtime:'',
    //     isfree:true
    //   }
    // ],
    date:'',
    start_time: '',
    end_time: '',
    state: 0, //0：后辈提交订单；1：前辈确认订单；2：前辈拒绝订单
    big_info:''
  },
  onLoad: function (options) {
    wx.cloud.callFunction({
      name: 'get_openid',
      success: res => {
        user_openid = res.result.openid
        console.log(res)
      }
    })
    start_t = options.begintime
    date = options.date
    id = options.id
    console.log(id, date, start_t)
    wx.cloud.database().collection("big_list").doc(id).get().then(res => {
      console.log(res)
      cost = res.data.data.cost
      var freetime = res.data.my_freetime
      big_info = res.data
      changed_time = res.data.my_freetime
      var open_time = []
      for (var i = 0; i < freetime.length; i++) {
        if (freetime[i].date == date && freetime[i].begintime == start_t) {
          point = i
          for (var j = 0; j < freetime[i].small.length; j++) {
            if (freetime[i].small[j].isfree == true) {
              console.log(freetime[i].small[j])
              open_time.push(freetime[i].small[j])
            }
          }
          console.log(open_time)
          break
        }
      }
      this.setData({
        reserve_fengetime: open_time
      })
    })
  },
  taptime: function (e) {
    console.log(e.currentTarget.dataset.idx)
    console.log(this.data)
    var idx = e.currentTarget.dataset.idx
    console.log(changed_time[point])
    this.setData({
      ['reserve_fengetime[' + idx + '].isfree']: !this.data.reserve_fengetime[idx].isfree
    })
    console.log(this.data.reserve_fengetime[idx].isfree)
    //计算预约时间
    var allminutes = 0;
    for (var i = 0; i < this.data.reserve_fengetime.length; i++) {
      if (this.data.reserve_fengetime[i].isfree == false) {
        allminutes = allminutes + 15;
      }
    }
    var num = allminutes / 15
    var totalfee = parseInt(num) * parseInt(cost)
    console.log(allminutes)
    this.setData({
      minutes: allminutes,
      reserve_price: totalfee
    })
    // changed_time[point].small[idx].isfree = !changed_time[point].small[idx].isfree
  },
  finishOrder: function () {
    //判断订单时间是否连续
    var success = 0
    var geshu = 0;
    var index = new Array()
    for (var i = 0; i < this.data.reserve_fengetime.length; i++) {
      if (this.data.reserve_fengetime[i].isfree == false) {
        changed_time[point].small[i].isfree = false
        choiced_time.push(this.data.reserve_fengetime[i])
        index[geshu] = i;
        geshu++;
      }
    }
    if (geshu == 0) {
      wx: wx.showModal({
        showCancel: false,
        title: '提示',
        content: '您还未选择预约时间段喔',
      })
    }
    else if (geshu == 1 && this.data.reserve_fengetime.length!=1) {
      wx: wx.showModal({
        showCancel: false,
        title: '提示',
        content: '至少选择30分钟预约时间喔'
      })
    }
    else {
      for (var i = 0; i < index.length - 1; i++) {
        if (index[i + 1] - index[i] != 1) {
          wx: wx.showModal({
            showCancel: false,
            title: '提示',
            content: '请勿选择非连续的时间段喔'
          })
          break;
        }
        else {
          success += 1
        }
      }
    }
    if (success == index.length-1) {
      console.log(success)
      console.log(this.data)
      this.createOrder(geshu)
    }
  },
  createOrder(geshu) {
    //获取后辈的信息
    wx.cloud.database().collection("user_info").doc(user_openid).get().then(res => {
      small_info = res.data
      console.log("获取后辈信息成功", res)
    }).catch(err => {
      console.log("get small fail", err)
    })
    var order1 = this.orderCode()
    wx.cloud.database().collection("11orderon").add({
      data: {
        p: user_openid,
        _id: order1,
        big_head: big_info.data.user_info.user.avatarUrl,
        big_name: big_info.data.user_info.user.nickName,
        big_workplace: big_info.data.gra_school,
        order_date: date,
        order_time: choiced_time,
        orderNO: order1,
        time: wx.cloud.database().serverDate(),
        status: 1,
        totalfee: this.data.reserve_price,
        start_time:choiced_time[0].begintime,
        end_time:choiced_time[choiced_time.length-1].endtime
      },
      success(res) {
        console.log("创建发起订单成功", res)
      }
    })
    // wx.cloud.database().collection("11orderget").add({
    //   data: {
    //     _id: order1,
    //     p: id,
    //     small_head: small_info.user.avatarUrl,
    //     name: small_info.user.nickName,
    //     time: wx.cloud.database().serverDate(),
    //     order_time: choiced_time,
    //     info: '',
    //     totalfee: this.data.totalfee,
    //     status: 0,
    //     orderNO: order1
    //   },
    //   success(res) {
    //     wx.showToast({
    //       title: '创建订单成功',
    //       duration: 2000
    //     })
    //     this.gopay(order1)
    //   },
    //   fail(err) {
    //     wx.showToast({
    //       title: '创建订单失败',
    //     })
    //   }
    // })
    this.gopay(order1, geshu)
  },
  gopay(order1, geshu) {
    let small_info = wx.getStorageSync('user')
    wx.cloud.database().collection("11orderget").add({
      data: {
        _id: order1,
        p: id,
        small_head: small_info.avatarUrl,
        name: small_info.nickName,
        time: wx.cloud.database().serverDate(),
        order_date: date,
        order_time: choiced_time,
        info: '',
        totalfee: this.data.reserve_price,
        status: 1,
        orderNO: order1,
        start_time:choiced_time[0].begintime,
        end_time:choiced_time[choiced_time.length-1].endtime
      },
      success(res) {
        wx.showToast({
          title: '创建订单成功',
          duration: 2000
        })
        // this.gopay(order1)
      },
      fail(err) {
        wx.showToast({
          title: '创建订单失败',
        })
      }
    })
    wx.cloud.callFunction({
      name: 'pay',
      data: {
        good_name: '1v1咨询',
        tradeNO: order1,
        // totalFee: this.data.reserve_price
        totalFee: 1
      },
      success: res => {
        let that = this
        console.log("succ", res)
        const payment = res.result.payment
        wx.requestPayment({
          ...payment,
          success(res) {
            console.log('支付成功')
            //更新数据库的空闲时间
            if (geshu == that.data.reserve_fengetime.length) {
              changed_time[point].isfree = false
            }
            console.log(changed_time)
            wx.cloud.database().collection("big_list").doc(id).update({
              data: {
                my_freetime: changed_time
              },
              success(res) {
                console.log("更新成功", res)
                wx.cloud.database().collection("11orderon").doc(order1).update({
                  data: {
                    status: 2
                  },
                }).then(res => {
                  console.log(1)
                  wx.cloud.database().collection("11orderget").doc(order1).update({
                    data: {
                      status: 2
                    }
                  }).then(res => {
                    that.setData({
                      state:1,
                      big_info:big_info,
                      start_time:choiced_time[0].begintime,
                      end_time:choiced_time[choiced_time.length-1].endtime,
                      date:date
                    })
                  }).catch(err => {
                    console.log('update status fail')
                  })
                }).catch(err => {
                  console.log('update status fail')
                })
                
              },
              fail(err) {
                console.log("更新失败", err)
              }
            })
          
          },
          fail(err) {
            console.log('支付失败', err)
          }
        })
      }
    })
  },
  orderCode() {
    let ordercode = ''
    for (var i = 0; i < 6; i++) {
      ordercode += Math.floor(Math.random() * 10);
    }
    ordercode = 'W' + new Date().getTime() + ordercode
    return ordercode
  },
  goToBigDetail(){
    wx.navigateBack({})
  },
  doc:function(){
    console.log(1)
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
  },
  img(){
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
  },
})