### 微信机房报修小程序

###  **介绍** 

计算机教室机房报修小程序，实用表单申报工具类小程序，适用于学校、公司，简单云开发，满足你的需求

### 软件架构

本项目二开于“宿舍报修助手”，小程序基于云开发，简单易用，逻辑主要是云数据库的增删查改，页面自写无模板，部分使用vant weapp小程序组件库。大家可用于学习或者二次开发，有什么不懂的地方可联系wechat：FreeRoot200716。如果用于其他用途请注明一下原作者，谢谢大家。 本人第一次写小程序，缺乏经验，有些代码冗余，多多包涵！

### 安装教程

环境需求
本机node环境和云开发

 **步骤一：修改云环境与上传云函数** 

1.导入源码后，打开app.js文件，找到如下代码修改云环境。


```
wx.cloud.init({
   env: '云环境ID', // 打开云控制台可获取
   traceUser: true
})
```

```
/* 跳转管理页 */
  toAdmin() {
    if (this.data.isAdmin) {
      wx.requestSubscribeMessage({
        tmplIds: ['订阅消息ID'], //在微信公众平台中获取
      })
```

2.上传cloudfunctions目录下的云函数  **login，applyNotice, handleNotice , sendEmail**  。注意上传时选择（ 上传并部署，不上传node_modules ）。

 **步骤二：导入数据库** 

打开云开发控制台，创建 **c_apply，c_role，c_share** 集合，然后找到源码databases目录下的数据库文件，分别导入。

 **步骤三：添加权限** 

将c_apply数据库自定义权限为自定义权限

```
{
  "read": true,
  "write": true
}
```

![教程](https://images.gitee.com/uploads/images/2021/1006/195037_840ab62c_6550174.png "屏幕截图.png")

 **部署完成！** 


### 使用说明

使用前需要给自己添加管理权限，管理权限这样添加↓ 安装部署完成后，编译程序，在个人信息页面点击你的昵称可以复制你的openid，打开云控制台c_role集合，找到openid字段替换为你的openid。

![输入图片说明](https://images.gitee.com/uploads/images/2021/1006/195046_99298f40_6550174.png "屏幕截图.png")

![输入图片说明](https://images.gitee.com/uploads/images/2021/1006/195058_4ff5daca_6550174.png "屏幕截图.png")

没有做内容管理CMS，你们自己做就行，非常简单，就是开通后把数据库字段比着输一遍即可自动识别

### 特别鸣谢


aYuan

[Demo演示](http://)

![小程序码](https://images.gitee.com/uploads/images/2021/1006/195242_14923314_6550174.png "屏幕截图.png")

### 界面截图


![首页](https://images.gitee.com/uploads/images/2021/1006/195256_c24dacdb_6550174.png "屏幕截图.png")

![报修页面](https://images.gitee.com/uploads/images/2021/1006/195307_41ceaed2_6550174.png "屏幕截图.png")

![报修未处理页面](https://images.gitee.com/uploads/images/2021/1006/195324_fe3fb818_6550174.png "屏幕截图.png")

![报修已处理界面](https://images.gitee.com/uploads/images/2021/1006/195334_b32523df_6550174.png "屏幕截图.png")

![个人中心](https://images.gitee.com/uploads/images/2021/1006/195344_a18f5a2a_6550174.png "屏幕截图.png")
