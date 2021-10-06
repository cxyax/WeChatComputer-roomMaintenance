import {
  floor
} from '../../config/config.default';
const db = wx.cloud.database()
const limit = 20;
let tabsIndex = 0;
let floorIndex = 0;

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
    applyData: []
  },

  onLoad: function () {
    this.getApplyData();
  },

  /* 触底刷新 */
  onReachBottom: function() {
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

  /* 选择栋数 */
  selectFloor(e) {
    const {
      index
    } = e.detail;
    floorIndex = index;
    if (index === 0) {
      this.setData({
        applyData: []
      })
      this.getApplyData();
    } else {
      this.getApplyDataItem(floorIndex);
    }
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

  /* 更新申请状态 */
  updateApplyStatus(e) {
    const { id, index } = e.currentTarget.dataset;
    wx.showModal({
      title: '温馨提示',
      content: '确认此申报数据？',
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

  /* 发送处理通知 */
  sendHandleNotice(e) {
    console.log(this.data.applyDataItem._openid);
    wx.cloud.callFunction({
      name: 'handleNotice',
      data: {
        name: wx.getStorageSync('admin').name,
        dorm: this.data.applyDataItem.floor + '机房' + this.data.applyDataItem.dorm + '号机器',
        phone: wx.getStorageSync('admin').phone,
        status: '已处理',
        // remarks: '祝您生活愉快!',
        openid: this.data.applyDataItem._openid,
        templateId: 'yT-oyIq2AUQRVeyic3rFGkubqcOVx1BWG8DzW65SETI'
      }
    }).then(res => {
      console.log(res);
    })
  },

  /* 查看申报表 */
  navDetail(e) {
    const {
      id,
      admin
    } = e.currentTarget.dataset
    wx.navigateTo({
      url: '../detail/detail?id=' + id + '&admin=' + admin
    })
  },

})