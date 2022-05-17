// component/selector/singer.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    //标题文字
    multipleContent: {
      type: String,
      value: ''
    },
    multiple_list: {
      type: Array,
      value: [{
        day: ''
      }, ]
    }
  },
 
  /**
   * 组件的初始数据
   */
  data: {
    is_clicked: 'choosed',
    // 弹窗显示控制
    isShow: false,
    list: '',
  },
  pageLifetimes: {
    // 组件所在页面的生命周期函数
    show() {
      this.setData({
        list: this.properties.multiple_list
      })
    },
  },
  /**
   * 组件的方法列表
   */
  methods: {
    //选中
    choose_item: function(e) {
      var temp = e.currentTarget.dataset.mkh;
 
      var list_new = this.data.list;
 
      var check_item = {};
      check_item = list_new[temp];
      check_item.type = check_item.type == "choosed" ? "" : "choosed";
      list_new[temp] = check_item;
 
      this.setData({
        list: list_new,
 
      })
    },
    //隐藏弹框
    hideMultiple: function() {
      this.setData({
        isShow: false,
      })
    },
    //展示弹框
    showMultiple: function() {
      this.setData({
        isShow: true,
      })
    },
    /*
     * 内部私有方法建议以下划线开头
     * triggerEvent 用于触发事件
     */
    _multipleConfirm() {
      //触发成功回调
      var return_list=[];
      for(var i=0;i<this.data.list.length;i++){
        if (this.data.list[i].type=="choosed"){
          return_list.push(this.data.list[i]);
        }else{
          continue;
        }
      }
      this.triggerEvent("multipleConfirm",return_list);
    }
  }
})