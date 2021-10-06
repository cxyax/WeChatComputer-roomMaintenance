const cloud = require('wx-server-sdk')

cloud.init()

exports.main = async (event, context) => {
  try {
    const result = await cloud.openapi.subscribeMessage.send({
        touser: event.openid,           //要发送用户的openid
        page: 'pages/index/index',        //用户通过消息通知点击进入小程序的页面
        lang: 'zh_CN',      //进入小程序查看”的语言类型，支持zh_CN(简体中文)、en_US(英文)、zh_HK(繁体中文)、zh_TW(繁体中文)，默认为zh_CN
        data: {           //要发送的数据，这里需要注意的事项，我在下面说
          // name1: {
          //   value: event.name // 报修人
          // },
          thing2: {
            value: event.dorm // 报修班级
          },
          thing5: {
            value: event.desc // 报修内容
          },
          phone_number3: {
            value: event.phone // 联系方式
          },
          time4: {
            value: event.createTime // 报修时间
          },
        },
        templateId: event.templateId,   //订阅消息模板ID
        miniprogramState: 'formal'   //跳转小程序类型：developer为开发版；trial为体验版；formal为正式版；默认为正式版

      })
    return result
  } catch (err) {
    return err
  }
}
