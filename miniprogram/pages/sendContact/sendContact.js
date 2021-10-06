const app = getApp();
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
			shopname:"", //商户名
			shopphone:"", //商户手机号
			shopdata:"", //备注
			// texts: "至少需要15个字",
   		min: 15,//最少字数
    	max: 500, //最多字数
    	currentWordNumber:0 
	},
	shopname:function(e){
		this.data.shopname = e.detail.value;
	},
	shopphone:function(e){
		this.data.shopphone = e.detail.value;
	},
	sendEmail:function(){
		var that = this;
		if(that.data.shopname.length == 0 || that.data.shopphone.length == 0 || that.data.shopdata.length == 0){
			wx.showModal({
				title:'提示',
				content:'请告诉我们怎么称呼/联系您/您的意见或建议，方便我们与您联系',
				showCancel:'false',
				cancelColor: 'cancelColor', //取消按钮的文本颜色
				confirmColor:'red', //确认按钮文本
				confirmText:'我知道了',
			})
		}else{
			if(this.data.shopphone.length == 11){
				let date = new Date()
				var day = date.getDate().toString()
				// console.log(day);
					if (day != wx.getStorageSync('day')){
						wx.setStorageSync('day', day)//把时间数放到缓存
						console.log(wx.getStorageSync('day'));
						wx.showModal({
							title: '提示',
							content: '每位用户每天只能提交一次，请勿重复提交！',
						})
						//向sendEmail云函数发送数据
						wx.cloud.callFunction({
						name:'sendEmail',
						data:{
							shop_name:this.data.shopname,
							shop_phone:this.data.shopphone,
							shop_data:this.data.shopdata
						}
					}).then((res)=>{
							console.log(res,'邮件信息发送成功')
						})
						//提交成功
						wx.showToast({
							title: '提交成功',
							icon:'success',
							duration:1000
						})
					}else{
							wx.showModal({
								title: '重复提交',
								content: '当前您提交频繁，请在次日再次提交！',
								showCancel:false,
							})
					} 
			}else{
				wx.showModal({
					title:'提示',
					content:'请输入正确的手机号',
					cancelColor: 'cancelColor',
				})
			}
		}
	},
	//字数限制  
  inputs: function (e) {
		this.data.shopdata = e.detail.value;
    // 获取输入框的内容
    var value = e.detail.value;
    // 获取输入框内容的长度
    var len = parseInt(value.length);
    // console.log(len)
    //最少字数限制
    if (len <= this.data.min)
      this.setData({
        texts: "至少还需要",
        textss: "字",
        num:this.data.min-len
      })
    else if (len > this.data.min)
      this.setData({
        texts: " ",
        textss: " ",
        num:''
      })

    this.setData({
      currentWordNumber: len //当前字数  
    });
    //最多字数限制
    if (len > this.data.max) return;
    // 当输入框内容的长度大于最大长度限制（max)时，终止setData()的执行

    // console.log(this.data)
	},
	
	//电话联系
	makePhone(){
		wx.makePhoneCall({
			phoneNumber: '18754026672',
		})
	},
	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {

	},

	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function () {

	},

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: function () {
		
	},
	/**
	 * 生命周期函数--监听页面隐藏
	 */
	onHide: function () {

	},

	/**
	 * 生命周期函数--监听页面卸载
	 */
	onUnload: function () {

	},

	/**
	 * 页面相关事件处理函数--监听用户下拉动作
	 */
	onPullDownRefresh: function () {

	},

	/**
	 * 页面上拉触底事件的处理函数
	 */
	onReachBottom: function () {

	},

	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function () {

	}
})