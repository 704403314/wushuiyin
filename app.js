// app.js
const domain = "https://www.tankhui.cn"

App({
  onLaunch() {
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        console.log("登录成功")
        console.log(res)
        if (res.code) {
            let url = domain+"/etf/login"
            const _this = this
            wx.request({
                url: url, 
                data: {
                    code:res.code
                },
                header: {
                    'content-type': 'application/json' // 默认值
                },
                success (res) {
                    
                    console.log("res:",res)
                    console.log("openid:",wx.getStorageSync('openid'))
                    if (res.data.code == 200) {
                        wx.setStorageSync('openid', res.data.data.openid)
                    } else {
                        console.log(res)
                        
                    }
                    
                },
                fail(e) {
                   
                    console.log("调用接口失败", e)
                    
                }
            })
        }
      }
    })
  },
  globalData: {
    userInfo: null
  }
})
