// pages/calendar/calendar.js
'use strict';
const date = new Date()
const times = []
let id = ''
for (let i = 0; i < 24; i++) {
  for (let j = 0; j < 60; j = j + 15) {
    if(i<10&&j==0) times.push('0' + i + ':' + '0' + j)
    else if(i<10) times.push('0' + i + ':' + j)
    else if(j==0) times.push(i + ':' + '0' + j)
    else times.push(i + ':' + j)
  }
}
let choose_hour = null,
  choose_minute = null;
let free_time = ''
Page({
  onShareAppMessage() {
    return {
      title: 'picker-view',
      path: 'page/component/pages/picker-view/picker-view'
    }
  },
  data: {
    day: '',
    year: '',
    month: '',
    date: '2017-01',
    today: '',
    week: ['日', '一', '二', '三', '四', '五', '六'],
    calendar: {
      first: [],
      second: [],
      third: [],
      fourth: []
    },
    swiperMap: ['first', 'second', 'third', 'fourth'],
    swiperIndex: 1,
    showCaldenlar: false,
    isAm0: true,
    isAm1: false,
    times,
    time: date.getHours() + ':' + date.getMinutes(),
    // value: [9999, 1, 1],
    multipleContent: '重复',
    multiple_list: [{
      day: '每周日'
    }, {
      day: '每周一'
    }, {
      day: '每周二'
    }, {
      day: '每周三'
    }, {
      day: '每周四'
    }, {
      day: '每周五'
    }, {
      day: '每周六'
    }],
    copy: ['永不']
  },
  bindChange(e) {
    const val = e.detail.value
    free_time = val
    console.log(val)
    if (val[1] - val[0] <= 1) {
      wx.showModal({
        title: '设置错误',
        content: '可预约时间段不可小于30分钟',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    } else {
      this.setData({
        time: this.data.times
      })
    }
  },
  onLoad(options) {
    id = options.id
    console.log(id)
    const date = new Date(),
      month = this.formatMonth(date.getMonth() + 1),
      year = date.getFullYear(),
      day = this.formatDay(date.getDate()),
      today = `${year}-${month}-${day}`
    let calendar = this.generateThreeMonths(year, month)

    this.setData({
      calendar,
      month,
      year,
      day,
      today,
      beSelectDate: today,
      date: `${year}/${month}`
    })
  },

  onReady: function () {
    //获得input_select组件
    this.input_select = this.selectComponent("#input_select");

    //获得singer组件 单选
    this.singer = this.selectComponent("#singer");

    //获得multiple组件  多选
    this.multiple = this.selectComponent("#multiple");
  },
  showCaldenlar() {
    this.setData({
      showCaldenlar: !this.data.showCaldenlar
    })
  },
  showMultiple: function () {
    this.multiple.showMultiple();
  },
  //确认事件
  _multipleConfirm(e) {
    console.log('获取选中的项==', e.detail);
    var copyIndex = new Array();
    for (let i = 0; i < e.detail.length; i++) {
      copyIndex[i] = e.detail[i].day;
    }
    var copyBody = copyIndex.join("、");
    console.log("copyBody:" + copyBody);
    this.multiple.hideMultiple();
    this.setData({
      copy: copyBody
    })
  },
  /**
   * 
   * 左右滑动
   * @param {any} e 
   */
  swiperChange(e) {
    const lastIndex = this.data.swiperIndex,
      currentIndex = e.detail.current
    let flag = false,
      {
        year,
        month,
        day,
        today,
        date,
        calendar,
        swiperMap
      } = this.data,
      change = swiperMap[(lastIndex + 2) % 4],
      time = this.countMonth(year, month),
      key = 'lastMonth'

    if (lastIndex > currentIndex) {
      lastIndex === 3 && currentIndex === 0 ? flag = true : null
    } else {
      lastIndex === 0 && currentIndex === 3 ? null : flag = true
    }
    if (flag) {
      key = 'nextMonth'
    }

    year = time[key].year
    month = time[key].month
    date = `${year}/${month}`
    day = ''
    if (today.indexOf(date) !== -1) {
      day = today.slice(-2)
    }

    time = this.countMonth(year, month)
    calendar[change] = null
    calendar[change] = this.generateAllDays(time[key].year, time[key].month)

    this.setData({
      swiperIndex: currentIndex,
      //文档上不推荐这么做，但是滑动并不会改变current的值，所以随之而来的计算会出错
      year,
      month,
      date,
      day,
      calendar
    })
  },
  /**
   * 
   * 点击切换月份，生成本月视图以及临近两个月的视图
   * @param {any} year 
   * @param {any} month 
   * @returns {object} calendar
   */
  generateThreeMonths(year, month) {
    let {
      swiperIndex,
      swiperMap,
      calendar
    } = this.data,
      thisKey = swiperMap[swiperIndex],
      lastKey = swiperMap[swiperIndex - 1 === -1 ? 3 : swiperIndex - 1],
      nextKey = swiperMap[swiperIndex + 1 === 4 ? 0 : swiperIndex + 1],
      time = this.countMonth(year, month)
    delete calendar[lastKey]
    calendar[lastKey] = this.generateAllDays(time.lastMonth.year, time.lastMonth.month)
    delete calendar[thisKey]
    calendar[thisKey] = this.generateAllDays(time.thisMonth.year, time.thisMonth.month)
    delete calendar[nextKey]
    calendar[nextKey] = this.generateAllDays(time.nextMonth.year, time.nextMonth.month)
    return calendar
  },
  bindDayTap(e) {
    let {
      month,
      year
    } = this.data,
      time = this.countMonth(year, month),
      tapMon = e.currentTarget.dataset.month,
      day = e.currentTarget.dataset.day
    console.log(e.currentTarget.dataset)
    if (tapMon == time.lastMonth.month) {
      this.changeDate(time.lastMonth.year, time.lastMonth.month)
    } else if (tapMon == time.nextMonth.month) {
      this.changeDate(time.nextMonth.year, time.nextMonth.month)
    } else {
      this.setData({
        day
      })
    }
    let beSelectDate = e.currentTarget.dataset.date;
    this.setData({
      beSelectDate,
      showCaldenlar: false
    })
  },
  bindDateChange(e) {
    if (e.detail.value === this.data.date) {
      return
    }
    const month = e.detail.value.slice(-2),
      year = e.detail.value.slice(0, 4)
    this.changeDate(year, month)
  },
  prevMonth(e) {
    let {
      year,
      month
    } = this.data,
      time = this.countMonth(year, month)
    this.changeDate(time.lastMonth.year, time.lastMonth.month)
  },
  nextMonth(e) {
    let {
      year,
      month
    } = this.data,
      time = this.countMonth(year, month)
    this.changeDate(time.nextMonth.year, time.nextMonth.month)
  },
  /**
   * 
   * 直接改变日期
   * @param {any} year 
   * @param {any} month 
   */
  changeDate(year, month) {
    let {
      day,
      today
    } = this.data,
      calendar = this.generateThreeMonths(year, month),
      date = `${year}-${month}`
    date.indexOf(today) === -1 ? day = '01' : day = today.slice(-2)

    this.setData({
      calendar,
      day,
      date,
      month,
      year,
    })
  },
  /**
   * 
   * 月份处理
   * @param {any} year 
   * @param {any} month 
   * @returns 
   */
  countMonth(year, month) {
    let lastMonth = {
        month: this.formatMonth(parseInt(month) - 1)
      },
      thisMonth = {
        year,
        month,
        num: this.getNumOfDays(year, month)
      },
      nextMonth = {
        month: this.formatMonth(parseInt(month) + 1)
      }

    lastMonth.year = parseInt(month) === 1 && parseInt(lastMonth.month) === 12 ? `${parseInt(year) - 1}` : year + ''
    lastMonth.num = this.getNumOfDays(lastMonth.year, lastMonth.month)
    nextMonth.year = parseInt(month) === 12 && parseInt(nextMonth.month) === 1 ? `${parseInt(year) + 1}` : year + ''
    nextMonth.num = this.getNumOfDays(nextMonth.year, nextMonth.month)
    return {
      lastMonth,
      thisMonth,
      nextMonth
    }
  },
  currentMonthDays(year, month) {
    const numOfDays = this.getNumOfDays(year, month)
    return this.generateDays(year, month, numOfDays)
  },
  /**
   * 生成上个月应显示的天
   * @param {any} year 
   * @param {any} month 
   * @returns 
   */
  lastMonthDays(year, month) {
    const lastMonth = this.formatMonth(parseInt(month) - 1),
      lastMonthYear = parseInt(month) === 1 && parseInt(lastMonth) === 12 ? `${parseInt(year) - 1}` : year,
      lastNum = this.getNumOfDays(lastMonthYear, lastMonth) //上月天数
    let startWeek = this.getWeekOfDate(year, month - 1, 1), //本月1号是周几
      days = []
    if (startWeek == '6') {
      return days
    } else {
      const startDay = lastNum - startWeek
      return this.generateDays(lastMonthYear, lastMonth, lastNum, {
        startNum: startDay,
        notCurrent: true
      })
    }
  },
  /**
   * 生成下个月应显示天
   * @param {any} year 
   * @param {any} month
   * @returns 
   */
  nextMonthDays(year, month) {
    const nextMonth = this.formatMonth(parseInt(month) + 1),
      nextMonthYear = parseInt(month) === 12 && parseInt(nextMonth) === 1 ? `${parseInt(year) + 1}` : year,
      nextNum = this.getNumOfDays(nextMonthYear, nextMonth) //下月天数
    let endWeek = this.getWeekOfDate(year, month), //本月最后一天是周几
      days = [],
      daysNum = 0
    if (endWeek == 6) {
      return days
    } else if (endWeek == 7) {
      daysNum = 6
    } else {
      daysNum = 6 - endWeek
    }
    return this.generateDays(nextMonthYear, nextMonth, daysNum, {
      startNum: 1,
      notCurrent: true
    })
  },
  /**
   * 
   * 生成一个月的日历
   * @param {any} year 
   * @param {any} month 
   * @returns Array
   */
  generateAllDays(year, month) {
    let lastMonth = this.lastMonthDays(year, month),
      thisMonth = this.currentMonthDays(year, month),
      nextMonth = this.nextMonthDays(year, month),
      days = [].concat(lastMonth, thisMonth, nextMonth)
    return days
  },
  /**
   * 
   * 生成日详情
   * @param {any} year 
   * @param {any} month 
   * @param {any} daysNum 
   * @param {boolean} [option={
   * 		startNum:1,
   * 		grey: false
   * 	}] 
   * @returns Array 日期对象数组
   */
  generateDays(year, month, daysNum, option = {
    startNum: 1,
    notCurrent: false
  }) {
    const weekMap = ['一', '二', '三', '四', '五', '六', '日']
    let days = []
    for (let i = option.startNum; i <= daysNum; i++) {
      let week = weekMap[new Date(year, month - 1, i).getUTCDay()]
      let day = this.formatDay(i)
      days.push({
        date: `${year}-${month}-${day}`,
        event: false,
        day,
        week,
        month,
        year
      })
    }
    return days
  },
  /**
   * 
   * 获取指定月第n天是周几		|
   * 9月第1天： 2017, 08, 1 |
   * 9月第31天：2017, 09, 0 
   * @param {any} year 
   * @param {any} month 
   * @param {number} [day=0] 0为最后一天，1为第一天
   * @returns number 周 1-7, 
   */
  getWeekOfDate(year, month, day = 0) {
    let dateOfMonth = new Date(year, month, 0).getUTCDay() + 1;
    dateOfMonth == 7 ? dateOfMonth = 0 : '';
    return dateOfMonth;
  },
  /**
   * 
   * 获取本月天数
   * @param {number} year 
   * @param {number} month 
   * @param {number} [day=0] 0为本月0最后一天的
   * @returns number 1-31
   */
  getNumOfDays(year, month, day = 0) {
    return new Date(year, month, day).getDate()
  },
  /**
   * 
   * 月份处理
   * @param {number} month 
   * @returns format month MM 1-12
   */
  formatMonth(month) {
    let monthStr = ''
    if (month > 12 || month < 1) {
      monthStr = Math.abs(month - 12) + ''
    } else {
      monthStr = month + ''
    }
    monthStr = `${monthStr.length > 1 ? '' : '0'}${monthStr}`
    return monthStr
  },
  formatDay(day) {
    return `${(day + '').length > 1 ? '' : '0'}${day}`
  },
  shang0: function () {
    this.setData({
      isAm0: true
    })
  },
  xia0: function () {
    this.setData({
      isAm0: false
    })
  },
  shang1: function () {
    this.setData({
      isAm1: true
    })
  },
  xia1: function () {
    this.setData({
      isAm1: false
    })
  },
  goToMyfreetime: function () {
    wx.navigateTo({
      url: '../my_freetime/my_freetime?id='+id,
    })
  },
  add_time: function (e) {
    console.log(e)
    let timeArr = []
    wx.cloud.database().collection("big_list").doc(id).get()
      .then(res => {
        timeArr = res.data.my_freetime
        console.log(res.data.my_freetime)
        let time = {}
        let date = this.data.date.replace("/", "-") + "-" + this.data.day
        let Date = this.change_time(free_time[0], free_time[1])
        time.date = date
        time.begintime = Date[0]
        time.endtime = Date[1]
        time.copy = this.data.copy
        time.isfree = true
        time.small = this.device_time(Date[0],Date[1])
        timeArr.push(time)
        console.log(timeArr)
        wx.showLoading({
          title: '上传中',
        })
        console.log(id)
        console.log(time)
        wx.cloud.database().collection("big_list").doc(id).update({
          data: {
            my_freetime: timeArr
          }
        }).then(res => {
          console.log(res)
          wx.hideLoading({
            success: (res) => {
              wx.showToast({
                title: '上传成功',
                duration: 1000
              })
            },
          })
        }).catch(err => {
          wx.hideLoading({
            success: (res) => {
              wx.showToast({
                title: '上传失败',
                duration: 1000
              })
            },
          })
        })
      })
    console.log(free_time)
    console.log(this.data)
  },
  change_time(start, end) {
    var start_h = parseInt((start * 15) / 60)
    var start_m = (start * 15) % 60
    var start_date 
    if(start_h<10&&start_m==0) start_date = '0' + start_h + ":" + '0' + start_m
    else if(start_h<10) start_date = '0' + start_h + ":" + start_m
    else if(start_m==0) start_date = start_h + ":" + '0' + start_m
    else start_date = start_h + ":" + start_m
    var end_h = parseInt((end * 15) / 60)
    var end_m = (end * 15) % 60
    var end_date
    if(end_h<10&&end_m==0) end_date = '0' + end_h + ":" + '0' + end_m
    else if(end_h<10) end_date = '0' + end_h + ":" + end_m
    else if(end_m==0) end_date = end_h + ":" + '0' + end_m
    else end_date = end_h + ":" + end_m
    return [start_date, end_date]
  },
  device_time(start_time,end_time){
    var shi0, shi1, fen0, fen1;
    shi0 = parseInt(start_time.split(":")[0])
    fen0 = parseInt(start_time.split(":")[1])
    shi1 = parseInt(end_time.split(":")[0])
    fen1 = parseInt(end_time.split(":")[1])
    var length = ((shi1 - shi0) * 60 + (fen1 - fen0)) / 15;
    console.log(length)
    var shi = shi0;
    var fen = fen0;
    var newtimetime = [];
    for (var i = 0; i < length; i++) {
      if (fen == 60) {
        shi++;
        fen = 0;
      }
      var newbegintime
      if(shi < 10 && fen < 10) newbegintime = '0' + shi + ':' + '0' + fen;
      else if(shi < 10) newbegintime = '0' + shi + ':' + fen;
      else if(fen < 10) newbegintime = shi + ':' + '0' + fen;
      else newbegintime = shi + ':' + fen;
      // this.data.reserve_fengetime[i].begintime=shi+':'+fen;
      if (fen + 15 == 60) {
        shi++;
        fen = 0;
      } else {
        fen = fen + 15;
      }
      var newendtime 
      if(shi < 10 && fen < 10) newendtime = '0' + shi + ':' + '0' + fen;
      else if(shi < 10) newendtime = '0' + shi + ':' + fen;
      else if(fen < 10) newendtime = shi + ':' + '0' + fen;
      else newendtime = shi + ':' + fen;
      // this.data.reserve_fengetime[i].endtime=shi+':'+fen;
      var newtime = [{
          begintime: newbegintime,
          endtime: newendtime,
          isfree: true
        }],
        newtimetime = newtimetime.concat(newtime);
      console.log(newtimetime)
    }
    return newtimetime
  }
})