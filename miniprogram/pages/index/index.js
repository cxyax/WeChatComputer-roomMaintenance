import {
  floor
} from '../../config/config.default';
const db = wx.cloud.database();
const limit = 20;
let tabsIndex = 0;
let floorIndex = 0;
var interstitialAd = null;

Page({

  data: {
    tabList: [{
      name: '当前未处理',
      status: '未处理'
    }, {
      name: '当前已处理',
      status: '已处理'
    }],
    floorList: floor,
    applyData: [],
    idList:'',
    loginOpenid:''
  },

  onLoad: function (options) {
    this.getOpenid();
    this.onShareMessage();
    this.getApplyData();

    // if (wx.createInterstitialAd) {
    //   interstitialAd = wx.createInterstitialAd({
    //     adUnitId: 'adunit-40082f65d4929d84'
    //   })
    //   interstitialAd.onLoad(() => {})
    //   interstitialAd.onError((err) => {})
    //   interstitialAd.onClose(() => {})
    // }
    
  },

  onShareAppMessage: function () {
    return {
      title: this.data.shareData.title,
      path: this.data.shareData.path,
      imageUrl: this.data.shareData.imageUrl,
      success: res => {
        console.log(res)
      },
      fail: err => {
        console.log(err)
      }
    }
  },

  /* 触底刷新 */
  onReachBottom: function () {
    !this.data.isEndOfList && this.getApplyData();
    
  },

  /* 选择状态 */
  selectStatus(e) {
    const {
      index
    } = e.detail;
    tabsIndex = index;
    this.setData({
      applyData: []
    })
    this.getApplyData();
    
  },



  /* 获取申报数据 */
  async getApplyData() {
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    const res = await db.collection('c_apply').orderBy('createTime', 'desc').where({
      status: this.data.tabList[tabsIndex].status,
      floor: floorIndex === 0 ? {} : floorIndex
    }).skip(this.data.applyData.length).get();
    this.setData({
      applyData: [...this.data.applyData, ...res.data],
      isEndOfList: res.data.length < limit ? true : false
    })
    wx.hideLoading();
  },

  /* 选择栋数获取申报数据 */
  async getApplyDataItem(floor) {
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    await db.collection('c_apply').orderBy('createTime', 'desc').where({
      floor: floor,
      status: this.data.tabList[tabsIndex].status
    }).get().then(res => {
      this.setData({
        applyData: res.data
      })
      wx.hideLoading();
    }).catch(err => {
      console.log(err)
    })
  },

  /* 跳转申报页 */
  toPublish() {
    wx.navigateTo({
      url: '../publish/publish'
    })
  },

  /* 跳转我的报修 */
  toMyRepair() {
    wx.navigateTo({
      url: '../mine/myrepair/myrepair'
    })
  },

  /*跳转已完成的 */
  toOverList() {
    wx.navigateTo({
      url: '../overlist/overlist'
    })
  },

  /* 跳转管理页 */
  toAdmin() {
    if (this.data.isAdmin) {
      wx.requestSubscribeMessage({
        tmplIds: ['yT-oyIq2AUQRVeyic3rFGkubqcOVx1BWG8DzW65SETI'],  //你的订阅消息模板
      })
      wx.navigateTo({
        url: '../admin/admin'
      })
    } else {
      console.log(this.data.isAdmin+"");
      wx.showModal({
        cancelColor: 'cancelColor',
        title:"招兵买马",
        content:"想要成为管理员吗？进入大自委网络部吧！",
        showCancel:false
      })
    }
  },

  /* 获取用户的openid */
  getOpenid() {
    wx.cloud.callFunction({
      name: 'login'
    }).then(res => {
      console.log("openid:",res.result.openid);
      this.getUserRole(res.result.openid);
      this.setData({
        openid: res.result.openid
      })
    }).catch(err => {
      console.log(err);
    })
  },

  /* 获取角色列表 */
  getUserRole(openid) {
    // console.log(openid);
    db.collection('c_role').get().then(res => {
      const openidList = res.data.map((item) => {
        if (item.role === '超级管理员') {
          wx.setStorageSync('admin', item);
        }
        return item.openid;
      })
      const isAdmin = openidList.includes(openid);
      this.setData({
        isAdmin
      })
    })
  },

  /* 查看申报表 */
  navDetail(e) {
    const {
      id
    } = e.currentTarget.dataset
    wx.navigateTo({
      url: '../detail/detail?id=' + id
    })
  },

  /* 获取分享数据 */
  onShareMessage() {
    db.collection('c_share').get().then(res => {
      this.setData({
        shareData: res.data[0]
      })
    })
  },
  //删除自己发布的
  deleteMeSend(e){
    const{id} = e.currentTarget.dataset
    db.collection('c_apply').where({_id : id}).get({
      success:res=>{
        // console.log("listOpenid",res.data[0]._openid)
        let listOpenid = res.data[0]._openid;
        wx.cloud.callFunction({
          name: 'login'
        }).then(res => {
          // console.log("loginOpenid:",res.result.openid);
          if(res.result.openid === listOpenid){
            this.deleteApplyData(e);
          }else{
            wx.showModal({
              title:"提示",
              content:"您不是该报修的发布者，无法删除这条数据！",
              showCancel:false
            })
          }
        }).catch(err => {
          console.log(err);
        })
      }
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
            this.getApplyData();
            wx.hideLoading();
            wx.showToast({
              title: '删除成功',
              duration: 500
            })
          })
        }
      }
    })
  },
  //联系我们跳转
  ContactusBtn(){
    wx.navigateTo({
      url: '/pages/sendContact/sendContact',
    })
  }
})

