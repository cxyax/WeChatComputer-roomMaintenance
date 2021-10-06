const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV,
})

exports.main = async (event, context) => {
  try {
    const result = await cloud.openapi.subscribeMessage.send({
        touser: event.openid,           //要发送用户的openid
        page: 'pages/index/index',        //用户通过消息通知点击进入小程序的页面
        lang: 'zh_CN',      //进入小程序查看”的语言类型，支持zh_CN(简体中文)、en_US(英文)、zh_HK(繁体中文)、zh_TW(繁体中文)，默认为zh_CN
        data: {           
          thing4: {
            value: event.name // 联系人
          },
          phrase5: {
            value: event.status // 报修状态
          },
          thing2: {
            value: event.dorm // 报修班级
          },
          // phone_number12: {
          //   value: event.phone // 联系方式
          // },
          // thing15: {
          //   value: event.remarks // 备注
          // },
        },
        templateId: event.templateId,   //订阅消息模板ID
        miniprogramState: 'formal'   //跳转小程序类型：developer为开发版；trial为体验版；formal为正式版；默认为正式版

      })
    return result
  } catch (err) {
    return err
  }
  
}

