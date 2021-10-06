import {
  floor
} from '../../../config/config.default';
const db = wx.cloud.database();
const limit = 20;
let tabsIndex = 0;

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
    this.getApplyData();
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
    let openid = wx.getStorageSync('openid');
    const res = await db.collection('c_apply').orderBy('createTime', 'desc').where({
      // status: this.data.tabList[tabsIndex].status,
      // floor: floorIndex === 0 ? {} : floorIndex
      _openid:openid
    }).skip(this.data.applyData.length).get();
    this.setData({
      applyData: [...this.data.applyData, ...res.data],
      isEndOfList: res.data.length < limit ? true : false
    })
    wx.hideLoading();
  },

  /* 更新申请状态 */
  updateApplyStatus(e) {
    const { id, index } = e.currentTarget.dataset;
    wx.showModal({
      title: '温馨提示',
      content: '确定机器已经好了，不需要报修了',
      success: (res) => {
        console.log(res);
        if(res.confirm) {
          this.setData({
            applyDataItem: this.data.applyData[index]
          })
          wx.showLoading({
            title: '处理中...',
            mask: true
          })
          db.collection('c_apply').where({_id: id}).update({
            data: {
              status: '已处理'
            }
          }).then(res => {
            this.setData({
              applyData: []
            })
            this.getApplyData();
            wx.hideLoading();
            wx.showToast({
              title: '处理成功',
              duration: 500
            })
            this.sendHandleNotice();
          })
        }
      }
    })
  },

  /* 查看申报表 */
  navDetail(e) {
    const {
      id
    } = e.currentTarget.dataset
    wx.navigateTo({
      url: '../../detail/detail?id=' + id
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
  escUp(){
    wx.reLaunch({
      url: '../mine',
    })
  },
  goToPubish(){
    wx.navigateTo({
      url: '/pages/publish/publish'
    })
  }
})

