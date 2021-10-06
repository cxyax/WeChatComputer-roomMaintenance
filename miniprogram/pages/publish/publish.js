import {
  icon
} from '../../config/config.default';
import { moment } from '../../utils/moment';
const db = wx.cloud.database();

Page({

  data: {
    level: '普通维修',
    levelIcon: icon.ordinary,
    pickerList: ['106', '204', '203', '202', '201'],
    realName:"",
    realPhone:""
  },

  onLoad: function(opstion) {
    const{
      id
    }=opstion;
    if(id!=null && id!=""){
      console.log("工单ID："+id);
      db.collection('c_apply').where({
        _id: id
      }).get().then(res => {
        console.log(res.data[0]);
        this.setData({
          data: res.data[0],
        })
      }).catch(err => {
        console.log(err)
      })
    }


  },
  onShow:function(){
    var ssname = wx.getStorageSync("realName");
    var ssphone = wx.getStorageSync("realPhone");
    if((ssname != null || ssname != "") && (ssphone != null || ssphone != "")){
      this.setData({
        realName:ssname,
        realPhone:ssphone
      })
    }
  },

  /* 申报人 */
  setName(e) {
    this.setData({
      realName: e.detail.value
    })
  },

  /* 选择栋数 */
  selectFloor(e) {
    this.setData({
      floor: this.data.pickerList[Number(e.detail.value)]
    })
  },

  /* 设置机房 */
  setDormNum(e) {
    this.setData({
      dorm: e.detail.value
    })
  },

  /* 联系电话 */
  setPhone(e) {
    this.setData({
      realPhone: e.detail.value
    })
  },

  /* 申报描述 */
  setDesc(e) {
    this.setData({
      desc: e.detail.value
    })
  },

  /* 选择维修级别 */
  selectLevel(e) {
    if (e.detail === '紧急维修') {
      this.setData({
        levelIcon: icon.press
      })
    } else {
      this.setData({
        levelIcon: icon.ordinary
      })
    }
    this.setData({
      level: e.detail
    })
  },

  clickLevel(e) {
    if (e.currentTarget.dataset.level === '紧急维修') {
      this.setData({
        levelIcon: icon.press
      })
    } else {
      this.setData({
        levelIcon: icon.ordinary
      })
    }
    this.setData({
      level: e.currentTarget.dataset.level
    })
  },
  /* 提交申报表 */
  inApplyData() {
    wx.requestSubscribeMessage({
      tmplIds: ['4I4h0-ctfJ12LGBQAqWDJMzc4YKVchUuKJGbeImwtEE'], //你的订阅消息模板
      success:(result) =>{
        if(this.validate()) {
          wx.showLoading({
            title: '正在提交...',
            mask: true
          })
            db.collection('c_apply').add({
              data: {
                name: this.data.realName.trim(),
                floor: this.data.floor,
                dorm: this.data.dorm,
                phone: this.data.realPhone.trim(),
                desc: this.data.desc,
                level: this.data.level,
                levelIcon: this.data.levelIcon,
                status: '未处理',
                createTime: moment('YYYY-MM-DD hh:mm:ss'),
              }
            }).then(res => {
              wx.hideLoading();
              wx.showToast({
                title: '提交成功',
                duration: 1000
              })
              //向sendEmail云函数发送数据
                // wx.cloud.callFunction({
                //   name:'oderRemind',
                //   data:{
                //     name: this.data.realName.trim(),
                //     floor: this.data.floor,
                //     dorm: this.data.dorm,
                //     phone: this.data.realPhone.trim(),
                //     desc: this.data.desc,
                //     level: this.data.level,
                //     levelIcon: this.data.levelIcon,
                //     status: '未处理',
                //   }
                // }).then((res)=>{
                //     console.log(res,'邮件信息发送成功')
                //   })
                  //提交成功
                  wx.showToast({
                    title: '提交成功',
                    icon:'success',
                    duration:1000
                  })
              this.sendApplyNotice();
              wx.reLaunch({
                url: '../index/index?id=success',
              })
            }).catch(err => {
              console.log(err)
            })
        }
      }
    })
   
  },
  /* 发送报修订单提醒 */
  sendApplyNotice() {
    let phone = wx.getStorageSync('realPhone');
    wx.cloud.callFunction({
      name: 'applyNotice',
      data: {
        // name: this.data.name,
        dorm: this.data.floor + '机房' + this.data.dorm + '号机器',
        desc: this.data.desc,//this.data.desc.substr(0, 16) + '...'
        phone: phone,
        createTime: moment('YYYY-MM-DD hh:mm:ss'),
        templateId: '4I4h0-ctfJ12LGBQAqWDJMzc4YKVchUuKJGbeImwtEE',
        openid: wx.getStorageSync('admin').openid
      }
    }).then(res => {
      console.log(res);
    })
  },

  /* 申报表单验证 */
  validate() {
    let cp = /[1][3,4,5,7,8][0-9]{9}$/;
   
    if (this.data.realName === ''  || !this.data.realName) {
      wx.showToast({
        title: '请填写申报人',
        icon: 'error',
        duration: 500
      })
      return false;
    }
    if (this.data.floor === '' || !this.data.floor) {
      wx.showToast({
        title: '请选择故障机器',
        icon: 'error',
        duration: 500
      })
      return false;
    }
    if (this.data.dorm === '' || !this.data.dorm) {
      wx.showToast({
        title: '请填机器号码',
        icon: 'error',
        duration: 500
      })
      return false;
    }
    if (this.data.realPhone === ''  || !this.data.realPhone) {
      wx.showToast({
        title: '请填写手机号码',
        icon: 'error',
        duration: 500
      })
      return false;
    }
    if (!cp.test(this.data.realPhone)) {
      wx.showToast({
        title: '请填写正确手机号',
        icon: 'error',
        duration: 500
      })
      return false;
    }
    if (this.data.desc === '' || !this.data.desc) {
      wx.showToast({
        title: '请说明故障具体情况',
        icon: 'error',
        duration: 500
      })
      return false;
    }
    return true;
  }

})