const app = getApp()
let _this;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    msg:{},
    temp:false,
    realName:"",
    realPhone:"",
    openid:""
  },
  formSubmit(e){
    // wx.showLoading({
    //   title: '加载中',
    //   task:true
    // })    
    if (e.detail.value.realName != '' && e.detail.value.realPhone != '' ){
      if(e.detail.value.realPhone.length == 11){
        if (!(/^1[34578]\d{9}$/.test(e.detail.value.realPhone))) {
          wx.showToast({
          title: '手机号码有误',
          duration: 2000,
          icon:'none'
          });
        }else{
          wx.setStorageSync("realName",e.detail.value.realName),
          wx.setStorageSync("realPhone",e.detail.value.realPhone),
          wx.showToast({
            title: '保存成功',
            icon:'success'
          })
          wx.reLaunch({
            url: '../mine',
          })
        }
      }else{
        wx.showModal({
          title: '提交失败',
          content: '请输入正确的手机号'
        })
      }
    }else{
     wx.showModal({
          title: '提交失败',
          content: '请保证真实姓名和手机号不为空'
        })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   
  },
  onShow:function(){
    if((this.data.realName == null || this.data.realName == "") && (this.data.realPhone == null || this.data.realPhone == "")){
      var name = wx.getStorageSync("realName");
      var phone = wx.getStorageSync("realPhone");
      this.setData({
        realName:name,
        realPhone:phone
      })
      this.getOpenid();
    }
  },
  getOpenid(){
    wx.cloud.callFunction({
      name: 'login'
    }).then(res => {
      console.log("openid:",res.result.openid);
      this.setData({
        openid: res.result.openid
      })
    }).catch(err => {
      console.log(err);
    })
  },

  /* 一键复制 */
  callApplOpenid() {
    wx.setClipboardData({
      data: this.data.openid,
    })
  },

})