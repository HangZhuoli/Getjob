// miniprogram/pages/add_data/add_data.js
const DB = wx.cloud.database().collection
("action")
let shop_name = null
let work_place = null
let tap = null
let start_date=null
let end_date=null
let big = 1
let num_all = ""
let num_selectable = ""
let num_listen = ""
let related = ""
let interview = ""
var date = new Date();
var currentHours = date.getHours();
var currentMinute = date.getMinutes();
let big_head = ""
let no_name_big = ""
let no_knowledge_big = ""
let att = "注意事项"
let poster = ""
let price_all = ""
let price_audit = ""
let id =""
let datalist = ''
Page({
  data: {
    datalist:'',
    actionimg:"",
    startDate: "",
    endDate: "",
    multiArray: [['今天', '明天', '3-2', '3-3', '3-4', '3-5'], [0, 1, 2, 3, 4, 5, 6], [0, 10, 20]],
    multiIndex: [0, 0, 0],
    all:"",
    all_price:"",
    select:"",
    audit:"",
    audit_price:"",
    noBigShow:false
  },
  goToShow:function(){
    wx.navigateTo({
      url: '/pages/manage/show_data/show_data',
    })
  },
  no_big_inf:function(){
    if(this.data.noBigShow==false){
      this.setData({
        noBigShow:true
      });
    }else{
      this.setData({
        noBigShow:false
      });
    }
  },
  pickerTap:function() {
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
      var md = (date1.getMonth() + 1) + "-" + date1.getDate();
      monthDay.push(md);
    }

    var data = {
      multiArray: this.data.multiArray,
      multiIndex: this.data.multiIndex
    };

    if(data.multiIndex[0] === 0) {
      if(data.multiIndex[1] === 0) {
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
  bindMultiPickerColumnChange:function(e) {
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
        if(data.multiIndex[1] === 0) {
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

    var minuteIndex;
    if (currentMinute > 0 && currentMinute <= 10) {
      minuteIndex = 10;
    } else if (currentMinute > 10 && currentMinute <= 20) {
      minuteIndex = 20;
    } else if (currentMinute > 20 && currentMinute <= 30) {
      minuteIndex = 30;
    } else if (currentMinute > 30 && currentMinute <= 40) {
      minuteIndex = 40;
    } else if (currentMinute > 40 && currentMinute <= 50) {
      minuteIndex = 50;
    } else {
      minuteIndex = 60;
    }

    if (minuteIndex == 60) {
      // 时
      for (var i = currentHours + 1; i < 24; i++) {
        hours.push(i);
      }
      // 分
      for (var i = 0; i < 60; i += 1) {
        minute.push(i);
      }
    } else {
      // 时
      for (var i = currentHours; i < 24; i++) {
        hours.push(i);
      }
      // 分
      for (var i = minuteIndex; i < 60; i += 1) {
        minute.push(i);
      }
    }
  },

  loadHoursMinute: function (hours, minute){
    // 时
    for (var i = 0; i < 24; i++) {
      hours.push(i);
    }
    // 分
    for (var i = 0; i < 60; i += 1) {
      minute.push(i);
    }
  },

  loadMinute: function (hours, minute) {
    var minuteIndex;
    if (minuteIndex == 60) {
      // 时
      for (var i = currentHours + 1; i < 24; i++) {
        hours.push(i);
      }
    } else {
      // 时
      for (var i = currentHours; i < 24; i++) {
        hours.push(i);
      }
    }
    // 分
    for (var i = 0; i < 60; i += 1) {
      minute.push(i);
    }
  },

  bindStartMultiPickerChange1: function (e) {
    var that = this;
    var monthDay = that.data.multiArray[0][e.detail.value[0]];
    var hours = that.data.multiArray[1][e.detail.value[1]];
    var minute = that.data.multiArray[2][e.detail.value[2]];

    if (monthDay === "今天") {
      var month = date.getMonth()+1;
      var day = date.getDate();
      monthDay = month + "月" + day + "日";
    } else if (monthDay === "明天") {
      var date1 = new Date(date);
      date1.setDate(date.getDate() + 1);
      monthDay = (date1.getMonth() + 1) + "月" + date1.getDate() + "日";

    } else {
      var month = monthDay.split("-")[0]; // 返回月
      var day = monthDay.split("-")[1]; // 返回日
      monthDay = month + "月" + day + "日";
    }

    var startDate = monthDay + " " + hours + ":" + minute;
    start_date = startDate
    if(start_date == ""){
      start_date = datalist.start_date
    }
    else{
      start_date = startDate
    }
    that.setData({
      startDate: startDate
    })
  },
  bindStartMultiPickerChange2: function (e) {
    var that = this;
    var monthDay = that.data.multiArray[0][e.detail.value[0]];
    var hours = that.data.multiArray[1][e.detail.value[1]];
    var minute = that.data.multiArray[2][e.detail.value[2]];

    if (monthDay === "今天") {
      var month = date.getMonth()+1;
      var day = date.getDate();
      monthDay = month + "月" + day + "日";
    } else if (monthDay === "明天") {
      var date1 = new Date(date);
      date1.setDate(date.getDate() + 1);
      monthDay = (date1.getMonth() + 1) + "月" + date1.getDate() + "日";

    } else {
      var month = monthDay.split("-")[0]; // 返回月
      var day = monthDay.split("-")[1]; // 返回日
      monthDay = month + "月" + day + "日";
    }

    var endDate = monthDay + " " + hours + ":" + minute;
    end_date = endDate
    if(end_date == ""){
      end_date = datalist.end_date
    }else{
      end_date = endDate
    }
    that.setData({
      endDate: endDate
    })
  },
  add_images:function(){
    var that = this;
    wx.chooseImage({
      count: 1,
      sizeType:['compressed','original'],
      sourceType:['camera','album'],
      success(res){
        //临时路径
        const tempfilepath = res.tempFilePaths
        //存储路径
        var timestamp = Date.parse(new Date());
        const filepath = res.tempFilePaths[0];
        const cloudpath = 'action_img/' + timestamp+filepath.match(/\.[^.]+?$/)[0];
        wx.cloud.uploadFile({
          cloudPath:cloudpath,
          filePath:filepath,
          success(res){
            wx.showToast({
              title: '上传成功',
              duration:1000
            })
            console.log("success")
              console.log(res.fileID)
              console.log(that)
          },
          fail(res){
            wx.showToast({
              title: '上传失败',
              duration:1000
            })
            console.log("fail")
          }
        })
      }

    })
  },
  add_relatedIntroduction(e){
    related = e.detail.value
    console.log(related)
    if(related == ""){
      related = datalist.related
    }else{
      related = e.detail.value
    }
  },
  add_precautions(e){
    interview = e.detail.value
    if(interview == ""){
      interview = datalist.related
    }else{
      interview = e.detail.value
    }
  },
  shop_name(e){
    console.log(e.detail.value)
    shop_name = e.detail.value
    console.log(e.detail.value)
    if(shop_name == ""){
      shop_name = datalist.related
    }else{
      shop_name = e.detail.value
    }
  },
  add_name(e){
    big = e.detail.value
    if(big == ""){
      big = datalist.related
    }else{
      big = e.detail.value
    }
  },
  add_workplace(e){
    work_place = e.detail.value
    if(work_place == ""){
      work_place = datalist.related
    }else{
      work_place = e.detail.value
    }
  },
  add_tap(e){
    tap = e.detail.value
    if(tap == ""){
      tap = datalist.related
    }else{
      tap = e.detail.value
    }
  },
  handleInput0(e){
    num_all = e.detail.value
    if(num_all == ""){
      num_all = datalist.related
    }else{
      num_all = e.detail.value
    }
  },
  handleInput1(e){
    num_selectable = e.detail.value
    if(num_selectable == ""){
      num_selectable = datalist.related
    }else{
      num_selectable = e.detail.value
    }
  },
  handleInput2(e){
    num_listen = e.detail.value
    if(num_listen == ""){
      num_listen = datalist.related
    }else{
      num_listen = e.detail.value
    }
  },
  add_price_listen(e){
    price_audit = e.detail.value
    if(price_audit == ""){
      price_audit = datalist.related
    }else{
      price_audit = e.detail.value
    }
  },
  add_price_all(e){
    price_all = e.detail.value
    if(price_all == ""){
      price_all = datalist.related
    }else{
      price_price_all = e.detail.value
    }
  },
  onLoad(options){
    console.log(options.id)
    id = options.id
    wx.cloud.database().collection("action")
    .doc(options.id)
    .get()
    .then(res =>{
      console.log(res.data)
      
      this.setData({
        datalist:res.data
      })
    })
    .catch(err=>{
      console.log(err)
    })
  },
  add_data(){
    wx.cloud.database().collection('action')
    .doc(id)
    .update({
      data:{
        shop_name:shop_name,
        tap:tap,
        work_place:work_place,
        start_date:start_date,
        end_date:end_date,
        big:big,
        num_all:num_all,
        num_listen:num_listen,
        num_selectable:num_selectable,
        related:related,
        interview:interview,
        big_head:big_head,
        no_name_big:no_name_big,
        no_knowledge_big:no_knowledge_big,
        price_all:price_all,
        price_audit:price_audit
      }
    }).then(res =>{
      console.log("success")
    }).catch(err=>{
      console.log("fail")
    })
    
  }
})