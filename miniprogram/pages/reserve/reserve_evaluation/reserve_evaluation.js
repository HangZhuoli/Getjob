Page({
  
  /**
   * 页面的初始数据
   */
  data: {
    steps:["我的订单","开始订单","待评论"],
    minutes:0,
    reserve_price:50,
    check:false,
    items:[
      {value:'yes',name:'是'},
      {value:'no',name:'否'}
    ]
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
  }
  
})