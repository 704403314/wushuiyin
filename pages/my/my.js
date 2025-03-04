const defaultAvatarUrl = 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0'
const domain = "https://www.tankhui.cn"

Page({
    /**
     * 页面的初始数据
     */
    data: {
        show: false,
        barHeight: 20, //  顶部状态栏高度
        navBarHeight: 66, // 顶部高度
        tabList: [],
        nickname: "",
        headImage:"/images/默认头像.png",
        avatarUrl: defaultAvatarUrl,
    },
    onChooseAvatar(e) {
        const { avatarUrl } = e.detail 
        console.log("avatarUrl", avatarUrl)
        this.setData({
          avatarUrl:avatarUrl,
        })
        wx.setStorageSync('avatarUrl', avatarUrl)
      },
    onLoad() {
        const nickname = wx.getStorageSync('nickname')
        if (nickname) {
            this.setData({
                nickname: nickname
            })
        }

        const avatarUrl = wx.getStorageSync('avatarUrl')
        if (avatarUrl) {
            this.setData({
                avatarUrl: avatarUrl
            })
            wx.setStorageSync('avatarUrl', avatarUrl)
        }
    },
    handleBlur(event) {
        const value = event.detail.value;
        console.log('输入内容：', value);
        wx.setStorageSync('nickname', value)
      },
    // 头像监听
    // headClick() {
    //     wx.navigateTo({
    //         url: '/pages/touxiang/touxiang'
    //       });
    //       return
        
    // },
    dashang() {
        wx.navigateTo({
            url: '/pages/dashang/dashang'
          });
    },
    tuijian() {
        wx.navigateTo({
            url: '/pages/tuijian/tuijian'
          });
    },
    


    // 二级菜单监听
    tabClick(e) {
        var info = e.currentTarget.dataset.item;
        wx.showToast({
            title: info.title,
            icon: 'none'
        })
        switch (info.id) {
            case '1':
                wx.navigateTo({
                    url: '菜单一需要跳转的链接路径',
                })
                break;
            case '2':
                wx.navigateTo({
                    url: '菜单二需要跳转的链接路径',
                })
                break;
            case '3':
                wx.navigateTo({
                    url: '菜单三需要跳转的链接路径',
                })
                break;
            default:
                wx.navigateTo({
                    url: '菜单四需要跳转的链接路径',
                })
                break;
        }
    },
    
    // 页面滚动监听
    onPageScroll(e) {
        if (e.scrollTop > 60) {
            this.setData({
                show: true
            })
        } else {
            this.setData({
                show: false
            })
        }
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onShow() {
        var that = this;
        // 胶囊信息
        var menu = wx.getMenuButtonBoundingClientRect();
        wx.getSystemInfo({
            success(res) {
                that.setData({
                    barHeight: res.statusBarHeight,
                    navBarHeight: menu.top + menu.height
                })
            }
        })

        const nickname = wx.getStorageSync('nickname')
        if (nickname) {
            this.setData({
                nickname: nickname
            })
        }

        const avatarUrl = wx.getStorageSync('avatarUrl')
        if (avatarUrl) {
            this.setData({
                avatarUrl: avatarUrl
            })
            wx.setStorageSync('avatarUrl', avatarUrl)
        }
    },
    onShareAppMessage: function () {
        return {
            title: "视频无水印下载,提取短视频音频",
            imageUrl: "../../images/fenxiang.png"
        };
    },
    onShareTimeline: function () {
        return {
            title: "视频无水印下载,提取短视频音频",
            imageUrl: "../../images/fenxiang.png"
        };
    },
    pingjia() {
        var plugin = requirePlugin("wxacommentplugin");
        var _this = this;
        const openid = wx.getStorageSync('openid')

        plugin.openComment({
          success: (result)=>{
            console.log('plugin.openComment success', result)
            if (!openid) {
                wx.login({
                    success: res => {
                    // 发送 res.code 到后台换取 openId, sessionKey, unionId
                        if (res.code) {
                            let codeUrl = domain+"/etf/video/login"
                            wx.request({
                                url: codeUrl, 
                                data: {
                                    code:res.code
                                },
                                header: {
                                    'content-type': 'application/json' // 默认值
                                },
                                success (res) {
                                    if (res.data.code == 200) {
                                        _this.saveComment(res.data.data.openid, 'success', result)
                                    }
                                    
                                },
                                fail(e) {
                                    console.log("get openid error")
                                }
                            })
                        }
                                
                    },
                    fail(e) {
                        console.log("调用接口失败", e)
                        
                    }
                })
            } else {
                _this.saveComment(openid, 'success', result)
            }
              
        },


          fail: (result) =>{
            console.log('plugin.openComment fail', result)

            if (!openid) {
                wx.login({
                    success: res => {
                    // 发送 res.code 到后台换取 openId, sessionKey, unionId
                        if (res.code) {
                            let codeUrl = domain+"/etf/video/login"
                            wx.request({
                                url: codeUrl, 
                                data: {
                                    code:res.code
                                },
                                header: {
                                    'content-type': 'application/json' // 默认值
                                },
                                success (res) {
                                    if (res.data.code == 200) {
                                        //   let fundUrl = domain+"/etf/login"
                                        _this.saveComment(res.data.data.openid, 'fail', result)
                                    }
                                    
                                },
                                fail(e) {
                                    console.log("get openid error")
                                }
                            })
                        }
                                
                    },
                    fail(e) {
                        console.log("调用接口失败", e)
                        
                    }
                })
            } else {
                _this.saveComment(openid, 'fail', result)
            }
          }
        })
        
    },

    saveComment: function(openid, result, response) {
        console.log("saveComment start")
        console.log("response", response)
        let url = domain+"/fund/comment"
        wx.request({
            url: url,
            method: 'POST',
            data: {
                result: result,
                openid: openid,
                response: response.errMsg
            },
            header: {
                'content-type': 'application/json' // 默认值
            },
            success (res) {
                console.log("saveComment 调用接口成功", res)
                
            },
            fail(e) {
                console.log("saveComment 调用接口失败", e)
            }
        })
    },
})
