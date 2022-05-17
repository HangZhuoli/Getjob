// pages/big_detail/big_detail.js

let id = ''
Page({
  data: {
    datalist:'',
    num:'',
    headImg:'../../img/zhixun/1591750159293.jpeg',
    name:'万杨洋',
    place:'阿里巴巴',
    star:9.9,
    consultNum:58,
    date:"8月2日上午",
    labels:[
      {label:'阿里'},
      {label:'阿里云'}
    ],
    inf:'Ali暑期培训生收获多家offer。国内+海外 群面后100%进入一面。曾在微软面试中做旁听面试官，告诉你面试官笔记上是什么、真正讨论的是什么！前辈的经历不重要，你学到的才重要。',
    tab:['前辈详情','可约时间'],
    selected:1,
    num:10,
    username:'戴俊伟',
    star:9.9,
    date:'2021-8-7',
    comment:'很感谢学长对我的帮助！学长永远的神！',
    hint:['至少预约满30分钟','不足15分钟时可预约15分钟','预约体验过后才可进行评价哦'],
    day: '',
    year: '',
    month: '',
    date: '2017-01',
    today: '',
    week: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
    calendar: {
      first: [],
      second: [],
      third: [],
      fourth: []
    },
    swiperMap: ['first', 'second', 'third', 'fourth'],
    swiperIndex: 1,
    showCaldenlar: false,
    isAm:true,
    reserve_time:
    [
      {
        date:'2021-09-03',
        begintime:'9:00',
        endtime:'9:15'
      },
      {
        date:'2021-09-03',
        begintime:'10:00',
        endtime:'10:45'
      },
      {
        date:'2021-09-03',
        begintime:'15:00',
        endtime:'15:15'
      },
      {
        date:'2021-09-05',
        begintime:'9:00',
        endtime:'9:15'
      },
      {
        date:'2021-09-05',
        begintime:'23:00',
        endtime:'23:45'
      }
    ]
  },
  selected:function(e){
    console.log(e)
    let that=this
    let index=e.currentTarget.dataset.index
    console.log(index)
    if(index==0){
      that.setData({
        selected:0
      })
    }else{
      that.setData({
        selected:1
      })
    }
  },
  onLoad:function(options){
    let that = this
    id = options.id
    wx.cloud.database().collection("big_list").doc(id).get().then(res=>{
      var num1 = res.data.comment.length
        that.setData({
          datalist:res.data,
          num:num1,
          reserve_time:res.data.my_freetime
        })
    })
    // wx.cloud.callFunction({
    //   name:'get_big_detail',
    //   data:{
    //     id:id
    //   },success(res){
    //     console.log(res.result.data)
    //     var num1 = res.result.data.comment.length
    //     that.setData({
    //       datalist:res.result.data,
    //       num:num1,
    //       reserve_time:res.result.data.my_freetime
    //     })
    //   }
    // })
    console.log(this)
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
      date: `${year}年${month}月`
    })

  },
  goTozhixun:function(){
    wx.switchTab({
      url: '../zhixun/zhixun',
    })
  },
  showCaldenlar() {
    this.setData({
      showCaldenlar: !this.data.showCaldenlar
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
    { year, month, day, today, date, calendar, swiperMap } = this.data,
    change = swiperMap[(lastIndex + 2) % 4],
    time = this.countMonth(year, month),
    key = 'lastMonth'

    if (lastIndex > currentIndex) {
      lastIndex === 3 && currentIndex === 0?flag = true  : null
    } else {
      lastIndex === 0 && currentIndex === 3?null  : flag = true
    }
    if (flag) {
      key = 'nextMonth'
    }

    year = time[key].year
    month = time[key].month
    date = `${year}年${month}月`
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
    let { swiperIndex, swiperMap, calendar } = this.data,
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
    let { month, year } = this.data,
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
  // prevMonth(e) {
  //   let { year, month } = this.data,
  //   time = this.countMonth(year, month)
  //   this.changeDate(time.lastMonth.year, time.lastMonth.month)
  // },
  // nextMonth(e) {
  //   let { year, month } = this.data,
  //   time = this.countMonth(year, month)
  //   this.changeDate(time.nextMonth.year, time.nextMonth.month)
  // },
	/**
	 * 
	 * 直接改变日期
	 * @param {any} year 
	 * @param {any} month 
	 */
  changeDate(year, month) {
    let { day, today } = this.data,
    calendar = this.generateThreeMonths(year, month),
    date = `${year}-${month}`
    date.indexOf(today) === -1?day = '01':day = today.slice(-2)

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

    lastMonth.year = parseInt(month) === 1 && parseInt(lastMonth.month) === 12?`${parseInt(year) - 1}`:year + ''
    lastMonth.num = this.getNumOfDays(lastMonth.year, lastMonth.month)
    nextMonth.year = parseInt(month) === 12 && parseInt(nextMonth.month) === 1?`${parseInt(year) + 1}`:year + ''
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
      lastMonthYear = parseInt(month) === 1 && parseInt(lastMonth) === 12?`${parseInt(year) - 1}`:year,
       lastNum = this.getNumOfDays(lastMonthYear, lastMonth) //上月天数
    let startWeek = this.getWeekOfDate(year, month - 1, 1), //本月1号是周几
    days = []
    if (startWeek == '6') {
      return days
    }else{
      const startDay = lastNum - startWeek
      return this.generateDays(lastMonthYear, lastMonth, lastNum, { startNum: startDay, notCurrent: true })
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
      nextMonthYear = parseInt(month) === 12 && parseInt(nextMonth) === 1?`${parseInt(year) + 1}`: year,
      nextNum = this.getNumOfDays(nextMonthYear, nextMonth)  //下月天数
    let endWeek = this.getWeekOfDate(year, month)	,					 //本月最后一天是周几
      days = [],
      daysNum = 0
    if (endWeek == 6) {
      return days
    } else if (endWeek == 7) {
      daysNum = 6
    } else {
      daysNum = 6 - endWeek
    }
    return this.generateDays(nextMonthYear, nextMonth, daysNum, { startNum: 1, notCurrent: true })
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
  shang:function(){
    this.setData({
      isAm:true
    })
  },
  xia:function(){
    this.setData({
      isAm:false
    })
  },
  get_time(e){
    console.log(e.currentTarget)
    console.log(this.data)
    wx.navigateTo({
      url: '/pages/reserve/reserve_small/reserve_small?id='+this.data.datalist._id+'&begintime='+e.currentTarget.dataset.time.begintime+'&date='+e.currentTarget.dataset.time.date
    })
  }
})