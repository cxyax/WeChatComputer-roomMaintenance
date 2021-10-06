const db = wx.cloud.database()
Page({
  data:{
    inorderopenid:"",
    thisopenid:""
  },
  
  onLoad: function (options) {
    const {
      id,
      admin
    } = options;
    this.getApplyDataItem(id);
    this.getOpenid();
    if (admin) {
      this.setData({
        admin
      })
    }
  },
    /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // this.checkBtnIsShow();
  },

  /* 申报详情 */
  getApplyDataItem(id) {
    db.collection('c_apply').where({
      _id: id
    }).get().then(res => {
      // console.log(res.data[0]._openid);
      this.setData({
        data: res.data[0],
        inorderopenid:res.data[0]._openid,
      })
    }).catch(err => {
      console.log(err)
    })
  },

  /* 一键联系 */
  callApplyPhone(e) {
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.phone
    })
  },
  /* 修改按钮 */
  updateOrder(e){
    const {
      id
    } = e.currentTarget.dataset
    wx.navigateTo({
      url: '../updatepublish/updatepublish?id=' + id
    })
  },
   /* 一键复制 */
  //  copyApplyPhone(e) {
  //   wx.setClipboardData({
  //     data: e.currentTarget.dataset.phone,
  //   })
  // },
  hiring:function(){
    wx.showModal({
      title:"招兵买马",
      content:"想成为管理员吗？进入大自委网络部吧！",
      showCancel:false
    })
  },
  /* 获取用户的openid */
  getOpenid() {
    wx.cloud.callFunction({
      name: 'login'
    }).then(res => {
      // console.log("当前用户openid:",res.result.openid);
      this.setData({
        thisopenid:res.result.openid
      })
    }).catch(err => {
      console.log(err);
    })
  },
     /* 删除申报数据 */
  deleteApplyData(e) {
    const { id } = e.currentTarget.dataset;
    wx.showModal({
      title: '温馨提示',
      content: '确认删除此申报数据？',
      success: (res) => {
        if(res.confirm) {
          wx.showLoading({
            title: '删除中...',
            mask: true
          })
          db.collection('c_apply').doc(id).remove().then(res => {
            this.setData({
              applyData: []
            })
            wx.hideLoading();
            wx.showToast({
              title: '删除成功',
              duration: 500
            })
            let that = this;
            wx.navigateBack({
              delta: 2,
              success:function(res){
                  that.onLoad();
              }
            })

          })
        }
      }
    })
  },
  
})