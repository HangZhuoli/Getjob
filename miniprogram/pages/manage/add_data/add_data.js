// miniprogram/pages/add_data/add_data.js
const DB = wx.cloud.database().collection("action")
let shop_name = null
let work_place = null
let tap = null
let start_date = null
let end_date = null
let big = 1
let big_head = ""
let no_name_big = ""
let no_knowledge_big = ""
let num_all = ""
let num_selectable = ""
let num_listen = ""
let related = ""
let att = "注意事项"
let interview = ""
let poster = ""
let price_all = 50
let price_audit = 30
let img_ID = ""
let head_ID = ""
let qunmian = true
let sharemeeting = false
var date = new Date();
var currentHours = date.getHours();
var currentMinute = date.getMinutes();

Page({
  data: {
    actionimg: "../../../img/add_data/photo.png",
    no_big_head: "../../../img/add_data/photo.png",
    startDate: "",
    endDate: "",
    multiArray: [
      ['今天', '明天', '3-2', '3-3', '3-4', '3-5'],
      [0, 1, 2, 3, 4, 5, 6],
      [0, 10, 20]
    ],
    multiIndex: [0, 0, 0],
    all: "",
    all_price: "",
    select: "",
    audit: "",
    audit_price: "",
    isIng: ["正在报名中", "已结束报名"],
    noBigShow: false,
    big_array: [],
    big_index: 0,
    qunmian: 1,
    reverse_data: []
  },
  goToIndex: function () {
    wx.navigateTo({
      url: '/pages/manage/index/index',
    })
  },
  qm: function (e) {
    qunmian = true
    this.setData({
      qunmian: 1
    })
    console.log(this.data)
  },
  sm: function (e) {
    qunmian = true
    this.setData({
      qunmian: 0
    })
    console.log(this, e)
  },
  no_big_inf: function () {
    console.log(this.qunmian)
    if (this.data.noBigShow == false) {
      this.setData({
        no_big_head: "../../../img/add_data/photo.png",
        noBigShow: true
      });
    } else {
      this.setData({
        noBigShow: false
      });
    }
  },
  pickerTap: function () {
    date = new Date();
    var monthDay = [];
    var hours = [];
    var minute = [];

    currentHours = date.getHours();
    currentMinute = date.getMinutes();

    // 月-日
    for (var i = 0; i <= 28; i++) {
      var date1 = new Date(date);
      date1.setDate(date.getDate() + i);
      var md = (date1.getMonth() + 1) + "/" + date1.getDate();
      monthDay.push(md);
    }

    var data = {
      multiArray: this.data.multiArray,
      multiIndex: this.data.multiIndex
    };

    if (data.multiIndex[0] === 0) {
      if (data.multiIndex[1] === 0) {
        this.loadData(hours, minute);
      } else {
        this.loadMinute(hours, minute);
      }
    } else {
      this.loadHoursMinute(hours, minute);
    }

    data.multiArray[0] = monthDay;
    data.multiArray[1] = hours;
    data.multiArray[2] = minute;

    this.setData(data);
  },
  bindMultiPickerColumnChange: function (e) {
    date = new Date();

    var that = this;

    var monthDay = [];
    var hours = [];
    var minute = [];

    currentHours = date.getHours();
    currentMinute = date.getMinutes();

    var data = {
      multiArray: this.data.multiArray,
      multiIndex: this.data.multiIndex
    };
    // 把选择的对应值赋值给 multiIndex
    data.multiIndex[e.detail.column] = e.detail.value;

    // 然后再判断当前改变的是哪一列,如果是第1列改变
    if (e.detail.column === 0) {
      // 如果第一列滚动到第一行
      if (e.detail.value === 0) {

        that.loadData(hours, minute);

      } else {
        that.loadHoursMinute(hours, minute);
      }

      data.multiIndex[1] = 0;
      data.multiIndex[2] = 0;

      // 如果是第2列改变
    } else if (e.detail.column === 1) {

      // 如果第一列为今天
      if (data.multiIndex[0] === 0) {
        if (e.detail.value === 0) {
          that.loadData(hours, minute);
        } else {
          that.loadMinute(hours, minute);
        }
        // 第一列不为今天
      } else {
        that.loadHoursMinute(hours, minute);
      }
      data.multiIndex[2] = 0;

      // 如果是第3列改变
    } else {
      // 如果第一列为'今天'
      if (data.multiIndex[0] === 0) {

        // 如果第一列为 '今天'并且第二列为当前时间
        if (data.multiIndex[1] === 0) {
          that.loadData(hours, minute);
        } else {
          that.loadMinute(hours, minute);
        }
      } else {
        that.loadHoursMinute(hours, minute);
      }
    }
    data.multiArray[1] = hours;
    data.multiArray[2] = minute;
    this.setData(data);
  },

  loadData: function (hours, minute) {
    var minuteIndex = currentMinute;
    if (minuteIndex == 60) {
      // 时
      for (var i = currentHours + 1; i < 24; i++) {
        if (i < 10) {
          hours.push('0' + i);
        } else {
          hours.push(i);
        }
      }
      // 分
      for (var i = 0; i < 60; i += 1) {
        if (i < 10) {
          minute.push('0' + i);
        } else {
          minute.push(i);
        }
      }
    } else {
      // 时
      for (var i = currentHours; i < 24; i++) {
        if (i < 10) {
          hours.push('0' + i);
        } else {
          hours.push(i);
        }
      }
      // 分
      for (var i = minuteIndex; i < 60; i += 1) {
        if (i < 10) {
          minute.push('0' + i);
        } else {
          minute.push(i);
        }
      }
    }
  },

  loadHoursMinute: function (hours, minute) {
    // 时
    for (var i = 0; i < 24; i++) {
      if (i < 10) {
        hours.push('0' + i);
      } else {
        hours.push(i);
      }
    }
    // 分
    for (var i = 0; i < 60; i += 1) {
      if (i < 10) {
        minute.push('0' + i);
      } else {
        minute.push(i);
      }
    }
  },

  loadMinute: function (hours, minute) {
    var minuteIndex = currentMinute;
    if (minuteIndex == 60) {
      // 时
      for (var i = currentHours + 1; i < 24; i++) {
        if (i < 10) {
          hours.push('0' + i);
        } else {
          hours.push(i);
        }
      }
    } else {
      // 时
      for (var i = currentHours; i < 24; i++) {
        if (i < 10) {
          hours.push('0' + i);
        } else {
          hours.push(i);
        }
      }
    }
    // 分
    for (var i = 0; i < 60; i += 1) {
      if (i < 10) {
        minute.push('0' + i);
      } else {
        minute.push(i);
      }
    }
  },

  bindStartMultiPickerChange1: function (e) {
    var that = this;
    var year = new Date();

    var monthDay = that.data.multiArray[0][e.detail.value[0]];
    var hours = that.data.multiArray[1][e.detail.value[1]];
    var minute = that.data.multiArray[2][e.detail.value[2]];
    var month = monthDay.split("/")[0]; // 返回月
    var day = monthDay.split("/")[1]; // 返回日
    monthDay = month + "/" + day;

    var startDate = year.getFullYear() + "/" + monthDay + " " + hours + ":" + minute;
    start_date = this.change_time(startDate)
    that.setData({
      startDate: startDate
    })
    console.log(startDate)
  },
  bindStartMultiPickerChange2: function (e) {
    var that = this;
    var year = new Date();
    var monthDay = that.data.multiArray[0][e.detail.value[0]];
    var hours = that.data.multiArray[1][e.detail.value[1]];
    var minute = that.data.multiArray[2][e.detail.value[2]];
    var month = monthDay.split("/")[0]; // 返回月
    var day = monthDay.split("/")[1]; // 返回日
    monthDay = month + "/" + day;

    var endDate = year.getFullYear() + "/" + monthDay + " " + hours + ":" + minute;
    end_date = this.change_time(endDate)
    that.setData({
      endDate: endDate
    })
    console.log(endDate)
  },
  add_head: function () {
    var that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed', 'original'],
      sourceType: ['camera', 'album'],
      success: res => {
        //临时路径
        const tempfilepath = res.tempFilePaths
        //存储路径
        var timestamp = Date.parse(new Date());
        const filepath = res.tempFilePaths[0];
        const cloudpath = 'big_head/' + timestamp + filepath.match(/\.[^.]+?$/)[0];
        wx.cloud.uploadFile({
          cloudPath: cloudpath,
          filePath: filepath,
          success: res => {
            wx.showToast({
              title: '上传成功',
              duration: 1000
            })
            console.log("success")
            console.log(res.fileID)
            big_head = res.fileID
            this.setData({
              no_big_head: res.fileID,
            })
          },
          fail(res) {
            wx.showToast({
              title: '上传失败',
              duration: 1000
            })
            console.log("fail")
          }
        })
      }
    })
  },
  add_images: function () {
    var that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed', 'original'],
      sourceType: ['camera', 'album'],
      success: res => {
        //临时路径
        const tempfilepath = res.tempFilePaths
        //存储路径
        var timestamp = Date.parse(new Date());
        const filepath = res.tempFilePaths[0];
        const cloudpath = 'action_img/' + timestamp + filepath.match(/\.[^.]+?$/)[0];
        wx.cloud.uploadFile({
          cloudPath: cloudpath,
          filePath: filepath,
          success: res => {
            wx.showToast({
              title: '上传成功',
              duration: 1000
            })
            console.log("success")
            console.log(res.fileID)
            img_ID = res.fileID
            this.setData({
              actionimg: res.fileID,
            })
          },
          fail(res) {
            wx.showToast({
              title: '上传失败',
              duration: 1000
            })
            console.log("fail")
          }
        })
      }
    })
  },
  preview: function (e) {
    let currentUrl = this.data.actionimg
    wx.previewImage({
      current: e.currentTarget.id,
      urls: currentUrl,
    })
  },
  add_relatedIntroduction(e) {
    related = e.detail.value
  },
  add_precautions(e) {
    interview = e.detail.value
  },
  shop_name(e) {
    shop_name = e.detail.value
  },
  add_name(e) {
    big = e.detail.value
  },
  add_workplace(e) {
    work_place = e.detail.value
  },
  add_tap(e) {
    tap = e.detail.value
  },
  handleInput0(e) {
    num_all = e.detail.value
  },
  handleInput1(e) {
    num_selectable = e.detail.value
  },
  handleInput2(e) {
    num_listen = e.detail.value
  },
  add_price_listen(e) {
    price_audit = e.detail.value
  },
  add_price_all(e) {
    price_all = e.detail.value
  },
  no_big_name(e) {
    no_name_big = e.detail.value
  },
  no_big_work(e) {
    no_knowledge_big = e.detail.value
  },
  add_Data() {
    num_all = Number(num_all)
    num_listen = Number(num_listen)
    num_selectable = Number(num_selectable)
    price_all = Number(price_all)
    price_audit = Number(price_audit)
    if (this.data.qunmian == 1) {
      DB.add({
        data: {
          qunmian:1,
          shop_name: shop_name,
          tap: tap,
          work_place: work_place,
          start_date: start_date,
          end_date: end_date,
          big: big,
          num_all: num_all,
          num_listen: num_listen,
          num_selectable: num_selectable,
          related: related,
          interview: interview,
          big_head: big_head,
          no_name_big: no_name_big,
          no_knowledge_big: no_knowledge_big,
          price_all: price_all,
          price_audit: price_audit,
          post_ID: img_ID,
          comment: [],
          index:1
        },
        success(res) {
          wx.showToast({
            title: '添加成功',
            duration: 3000
          }).then(res => {
            wx.navigateTo({
              url: '/pages/manage/index/index',
            })
          })
        },
        fail(res) {
          wx.showToast({
            title: '添加失败',
            duration: 1000
          })
        }
      })
    } else {
      DB.add({
        data: {
          qunmian:0,
          shop_name: shop_name,
          tap: tap,
          work_place: work_place,
          start_date: start_date,
          end_date: end_date,
          big: big,
          num_all: num_all,
          num_listen: num_listen,
          num_selectable: num_selectable,
          related: related,
          interview: interview,
          big_head: big_head,
          no_name_big: no_name_big,
          no_knowledge_big: no_knowledge_big,
          price_all: price_all,
          price_audit: price_audit,
          post_ID: img_ID,
          comment: [],
          index:1
        },
        success(res) {
          wx.showToast({
            title: '添加成功',
            duration: 3000
          }).then(res => {
            wx.navigateTo({
              url: '/pages/manage/index/index',
            })
          })
        }
      })
    }
  },
  //选择器
  onLoad() {
    let that = this
    wx.cloud.callFunction({
      name: 'get_biglist',
      success(res) {
        console.log("success", res)
        that.setData({
          big_array: res.result.data
        })
      }
    })
  },
  big_change: function (e) {
    this.setData({
      index: e.detail.value
    })
  },
  change_time(str) {
    let st = str.split(" ")
    let ls = st[0].split("/")
    if (Number(ls[1]) < 10) {
      ls[1] = "0" + ls[1]
    }
    if (Number(ls[2] < 10)) {
      ls[2] = "0" + ls[2]
    }
    console.log(st)
    console.log(ls)
    let time = ls[0] + "/" + ls[1] + "/" + ls[2] + " " + st[1]
    console.log(time)
    return time
  }
})