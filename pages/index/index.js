// const mux = require('../../node_modules/mux.js/dist/mux');
// const ffmpeg = require('../../node_modules/ffmpeg.js/ffmpeg-mp4.js');
// const ffmpeg = require("../../utils/ffmpeg-mp4.js");
Page({
    data: {
        buttonShow: false,
        copyLink: "",
        hidden:true,
        isShow: false,
        saveUrl: "",
        content: "",
        pro:20,
        totalPage:0,
        progress:0,
        progressHidden:true,
        musicUrl: "",
        onCloseCount: 0,
        onMP4CloseCount: 0,
        onCopyVideoCloseCount: 0,
        onCopyMusicCloseCount: 0
    },
    // tap() {
    //   console.log('tap')
    // },
    formSubmitBefore: function(e) {
        this.setData({
            buttonShow: false,
            progressHidden: true
        })
        
        if (e.detail.value.videoUrl == "") {
            wx.showToast({
                title: '请输入需要解析的视频地址',
                icon: 'none',
                duration: 2500
            })
            return
        }
        
        console.log('videoUrl：', e.detail.value.videoUrl);
        var data =  e.detail.value.videoUrl;
        let regex = /http[s]?:\/\/[\w.-]+[\w\/-]*[\w.-]*\??[\w=&:\-\+\%]*[/]*/;
        
        if (data.match(regex) == null) {
            wx.showToast({
                title: '请输入有效的视频地址',
                icon: 'none',
                duration: 2500
            })
            return
        }
        const that = this
        wx.showModal({
            title: "温馨提示", // 提示的标题
            content: "1. 本平台提供免费下载功能，版权归各视频、音乐平台所有，视频｜音频仅供个人观看，学习使用。因用户不当使用，导致的侵权行为，由用户承担相关责任。" + "\r\n\r\n" +"2. 下载的文件超过500M，可能会失败，可以复制解析后的链接，在浏览器中打开，下载资源。" + "\r\n\r\n" +"3. 遇到解析失败的情况，可以粘贴相同视频(或音频)在其他APP的链接，重新解析。", // 提示的内容
            showCancel: false, // 是否显示取消按钮，默认true
            cancelText: "取消", // 取消按钮的文字，最多4个字符
            cancelColor: "#000000", // 取消按钮的文字颜色，必须是16进制格式的颜色字符串
            confirmText: "知道了", // 确认按钮的文字，最多4个字符
            confirmColor: "#576B95", // 确认按钮的文字颜色，必须是 16 进制格式的颜色字符串
            success: function (res) {
                console.log("接口调用成功的回调函数");
                if (res.confirm) {
                    that.formSubmit(e)
                } else if (res.cancel) {
                    return
                }
            },
            fail: function () {
                console.log("接口调用失败的回调函数");
            },
            complete: function () {
                console.log("接口调用结束的回调函数（调用成功、失败都会执行）");
            }
        })
    },
    formSubmit: function(e) {
        
        if (e.detail.value.videoUrl == "") {
            wx.showToast({
                title: '请输入需要解析的视频地址',
                icon: 'none',
                duration: 2500
            })
            return
        }
        
        console.log('videoUrl：', e.detail.value.videoUrl);
        var data =  e.detail.value.videoUrl;
        let regex = /http[s]?:\/\/[\w.-]+[\w\/-]*[\w.-]*\??[\w=&:\-\+\%]*[/]*/;
        
        if (data.match(regex) == null) {
            wx.showToast({
                title: '请输入有效的视频地址',
                icon: 'none',
                duration: 2500
            })
            return
        }
        
        var v =  data.match(regex)[0];
        
        const that = this
        this.setData({
            hidden: false
        })
        wx.request({
            url: 'https://www.tankhui.cn/video/share/url/parse', 
            data: {
                url: v     
            },
            header: {
                'content-type': 'application/json' // 默认值
            },
            success (res) {
                console.log(res.data)
                that.setData({
                    hidden: true
                })
                if (res.data.code == 200) {
                    
                    console.log(res.data.data.video_url)
                    that.setData({
                        copyLink: res.data.data.origin_url,
                        saveUrl: res.data.data.video_url,
                        musicUrl: res.data.data.music_url,
                        buttonShow: true,
                    })
                    wx.showToast({
                        title: '解析成功',
                        icon: 'success',
                        duration: 1500//持续的时间
                    })
                } else {
                    wx.showToast({
                        title: "链接不正确或暂不支持, 请重试",
                        icon: 'none',
                        duration: 4000//持续的时间
                    })
                }
                
            },
            fail(e) {
                console.log("调用接口失败", e)
                that.setData({
                    hidden: true
                })
            }
        })
    },
    copyCommon: function(url) {
        wx.showToast({
            title: '复制成功',
        })

        wx.setClipboardData({
            data: url, //复制的数据
            success: function (res) {
              wx.getClipboardData({
                success: function (res) {
                    
                }
              })
            }
          })
    },
    copyLinkFuncBefore: function(e) {
        let viewedAd = wx.getStorageSync('viewedAd');
        // 如果今天还没有观看过广告
        if (!viewedAd) {
          // 调用观看广告的方法
          const that = this
          wx.showModal({
              title: "温馨提示", // 提示的标题
              content: "每天只需观看一次广告，即可解锁复制链接功能", // 提示的内容
              showCancel: true, // 是否显示取消按钮，默认true
              cancelText: "取消", // 取消按钮的文字，最多4个字符
              cancelColor: "#000000", // 取消按钮的文字颜色，必须是16进制格式的颜色字符串
              confirmText: "知道了", // 确认按钮的文字，最多4个字符
              confirmColor: "#576B95", // 确认按钮的文字颜色，必须是 16 进制格式的颜色字符串
              success: function (res) {
                  console.log("接口调用成功的回调函数");
                  if (res.confirm) {
                      that.copyLinkFunc(e)
                  } else if (res.cancel) {
                      return
                  }
              },
              fail: function () {
                  console.log("接口调用失败的回调函数");
              },
              complete: function () {
                  console.log("接口调用结束的回调函数（调用成功、失败都会执行）");
              }
          })
          
        } else {
          // 提示用户今天已经观看过广告，无法再次观看
            
            console.log("今天已经观看过广告了")
           

            this.copyCommon(this.data.copyLink)  
        }


        
    },
    copyLinkFunc: function(e) {
        // 在页面中定义激励视频广告
        let videoAd = null
        
        // 在页面onLoad回调事件中创建激励视频广告实例
        if (wx.createRewardedVideoAd) {
            videoAd = wx.createRewardedVideoAd({
                adUnitId: 'adunit-052ed3c0d5e20c89'
            })
            videoAd.onLoad(() => {})
            videoAd.onError((err) => {
                this.copyCommon(this.data.copyLink)
            })
            videoAd.onClose((rrrr) => {
                if (rrrr && rrrr.isEnded) {
                    // 正常播放结束,可以下发游戏奖励
                    // 原始复制的代码
                    
                    if (this.data.onCopyVideoCloseCount == 0) {
                        console.log("激励了一次")
                        wx.setStorageSync('viewedAd', true);
                        this.setData({
                            onCopyVideoCloseCount: this.data.onCopyVideoCloseCount + 1
                        })
                        this.copyCommon(this.data.copyLink)
                    }
                    
                } else {
                    // 播放中途退出,不下发游戏奖励
                    console.log("播放中途退出,不下发游戏奖励")
                    // videoAd.show()
                }
            })
        }

        // 用户触发广告后，显示激励视频广告
        if (videoAd) {
            videoAd.show().catch(() => {
                // 失败重试
                videoAd.load()
                .then(() => videoAd.show())
                .catch(err => {
                    console.log('激励视频 广告显示失败')
                })
            })
        }



    },
    copyMusicBefore: function(e) {
        let viewedAd = wx.getStorageSync('viewedAd');
        console.log("复制音频看了广告：", viewedAd)
        // 如果今天还没有观看过广告
        if (!viewedAd) {
          // 调用观看广告的方法
          const that = this
          wx.showModal({
              title: "温馨提示", // 提示的标题
            //   content: "每天只需观看一次广告，即可解锁全部功能", // 提示的内容
              content: "每天只需观看一次广告，即可解锁复制链接功能", // 提示的内容
              showCancel: true, // 是否显示取消按钮，默认true
              cancelText: "取消", // 取消按钮的文字，最多4个字符
              cancelColor: "#000000", // 取消按钮的文字颜色，必须是16进制格式的颜色字符串
              confirmText: "知道了", // 确认按钮的文字，最多4个字符
              confirmColor: "#576B95", // 确认按钮的文字颜色，必须是 16 进制格式的颜色字符串
              success: function (res) {
                  console.log("接口调用成功的回调函数");
                  if (res.confirm) {
                      that.copyMusic(e)
                  } else if (res.cancel) {
                      return
                  }
              },
              fail: function (res) {
                  console.log("接口调用失败的回调函数");
                  console.log(res)
              },
              complete: function () {
                  console.log("接口调用结束的回调函数（调用成功、失败都会执行）");
              }
          })
          
        } else {
          // 提示用户今天已经观看过广告，无法再次观看
            
            console.log("今天已经观看过广告了")
           

            this.copyCommon(this.data.musicUrl)  
        }

        
    },
    copyMusic: function(e) {
        let videoAd = null
        // console.log(123123)
        // 在页面onLoad回调事件中创建激励视频广告实例
        if (wx.createRewardedVideoAd) {
            // console.log(12312312)
            videoAd = wx.createRewardedVideoAd({
                adUnitId: 'adunit-e79ef43a712de5cd'
            })
            try {
                if (videoAd.closeHandler) {
                    console.log("videoAd.offClose开始卸载");
                    videoAd.offClose(videoAd.closeHandler);
                    console.log("videoAd.offClose卸载成功");
                }
            } catch (e) {
                console.log("videoAd.offClose 卸载失败");
                console.error(e);
            }
            videoAd.onLoad(() => {})
            videoAd.onError((err) => {
                this.copyCommon(this.data.musicUrl)  
            })
            videoAd.onClose((r) => {
                // console.log(123123123)
                if (r && r.isEnded) {
                    
                    
                    if (this.data.onCopyMusicCloseCount == 0) {
                        console.log("激励了一次")
                        wx.setStorageSync('viewedAd', true);
                        this.setData({
                            onCopyMusicCloseCount: this.data.onCopyMusicCloseCount + 1
                        })
                        this.copyCommon(this.data.musicUrl)
                    }
                    
                } else {
                    // console.log(3332)
                    // 播放中途退出,不下发游戏奖励
                    console.log("播放中途退出,不下发游戏奖励")
                    // videoAd.show()
                }
            })
        }

        // 用户触发广告后，显示激励视频广告
        if (videoAd) {
            videoAd.show().catch(() => {
                // 失败重试
                videoAd.load()
                .then(() => videoAd.show())
                .catch(err => {
                    console.log('激励视频 广告显示失败')
                    console.log(err)
                })
            })
        }

    },
    downloadVideoFuncAd: function(e) {
        let videoAd = null
        
        // 在页面onLoad回调事件中创建激励视频广告实例
        if (wx.createRewardedVideoAd) {
            videoAd = wx.createRewardedVideoAd({
                adUnitId: 'adunit-40a5841cb54a089f'
            })
                    

            videoAd.onLoad(() => {})
            videoAd.onError((err) => {
                this.downloadVideoFunc(e)  
            })
            videoAd.onClose((rrr) => {
                
                if (rrr && rrr.isEnded) {
                    
                    if (this.data.onCloseCount == 0) {
                        console.log("激励了一次")
                        wx.setStorageSync('viewedDownloadVideoAd', true);
                        this.setData({
                            onCloseCount: this.data.onCloseCount + 1
                        })
                        this.downloadVideoFunc(e)
                    }
                    // this.downloadVideoFunc(e)
                } else {
                    // 播放中途退出,不下发游戏奖励
                    console.log("播放中途退出,不下发游戏奖励")
                    // videoAd.show()
                }
                
            })
        }

        // 用户触发广告后，显示激励视频广告
        if (videoAd) {
            videoAd.show().catch(() => {
                // 失败重试
                videoAd.load()
                .then(() => videoAd.show())
                .catch(err => {
                    console.log('激励视频 广告显示失败')
                    console.log(err)
                })
            })
        }

    },

    downloadVideoFuncBefore: function(e) {
        let viewedAd = wx.getStorageSync('viewedDownloadVideoAd');
        // 如果今天还没有观看过广告
        if (!viewedAd) {
          // 调用观看广告的方法
          const that = this
          wx.showModal({
              title: "温馨提示", // 提示的标题
            //   content: "每天只需观看一次广告，即可解锁全部功能", // 提示的内容
              content: "每天只需观看一次广告，即可解锁保存视频功能",
              showCancel: true, // 是否显示取消按钮，默认true
              cancelText: "取消", // 取消按钮的文字，最多4个字符
              cancelColor: "#000000", // 取消按钮的文字颜色，必须是16进制格式的颜色字符串
              confirmText: "知道了", // 确认按钮的文字，最多4个字符
              confirmColor: "#576B95", // 确认按钮的文字颜色，必须是 16 进制格式的颜色字符串
              success: function (res) {
                  console.log("接口调用成功的回调函数");
                  if (res.confirm) {
                      that.downloadVideoFuncAd(e)
                  } else if (res.cancel) {
                      return
                  }
              },
              fail: function (res) {
                  console.log("接口调用失败的回调函数");
                  console.log(res)
              },
              complete: function () {
                  console.log("接口调用结束的回调函数（调用成功、失败都会执行）");
              }
          })
          
        } else {
          // 提示用户今天已经观看过广告，无法再次观看
            
            console.log("今天已经观看过广告了")
           

            this.downloadVideoFunc(e)  
        }
    },

    downloadVideoFunc: function(e) {
        this.setData({
            hidden: false,
            progressHidden: false
        })
        const that = this 
        wx.downloadFile({
            url: that.data.saveUrl, // 视频资源地址
        
            success: res => {
            console.log('downloadFile成功回调res:', res)
            let FilePath = res.tempFilePath; // 下载到本地获取临时路径
            let fileManager = wx.getFileSystemManager();
            if (res.statusCode === 504 || res.statusCode === 400 || res.statusCode === 500) {
                // 执行下载成功后的操作
                console.log('504');
                that.setData({
                    hidden: true,
                    progressHidden: false
                })
                wx.showToast({
                    title: '请求失败, 文件可能过大, 请点击复制视频链接在浏览器中打开',
                    duration: 4500,
                    icon: 'none'
                })
                return
            }

                wx.saveVideoToPhotosAlbum({ // 保存到相册
                    filePath: FilePath,
                    success: file => {
                        that.setData({
                            hidden: true,
                            progressHidden: false
                        })
                    console.log('saveVideoToPhotosAlbum成功回调file:', file)
                    console.log('FilePath:', FilePath)
                    
                    wx.showToast({
                        title: '保存成功',
                        duration: 3000,
                        icon: 'success'
                    })
                    fileManager.unlink({ // 删除临时文件
                        filePath: FilePath,
                        success(res) {
                            console.log(res,"unlink success")
                        },
                        fail(res) {
                            console.error(res,"unlink fail")
                        }
                    })
                    },
                    fail: err => {
                        that.setData({
                            hidden: true,
                            progressHidden: false
                        })
                    console.log('saveVideoToPhotosAlbum失败回调err:', err)
                    fileManager.unlink({ // 删除临时文件
                        filePath: FilePath,
                        success(res) {
                            console.log(res,"unlink success")
                        },
                        fail(res) {
                            console.error(res,"unlink fail")
                            wx.showToast({
                                title: '视频保存失败, 请重试',
                                duration: 4000,
                                icon: 'none'
                            })
                        }
                    })
                    wx.showToast({
                        title: '视频保存失败, 请点击复制链接在浏览器中打开',
                        duration: 4000,
                        icon: 'none'
                    })
                    },
                    complete() {
                    //   wx.hideLoading()
                    }
                })
            
            
            },
            fail(e) {
            console.log('失败e', e)
            that.setData({
                    hidden: true,
                    progressHidden: false
                })
            wx.showToast({
                title: '视频保存失败了, 请点击复制链接在浏览器中打开',
                duration:4000,
                icon:'none'
            })
            },
            complete() {
            // wx.hideLoading();
            }
        }).onProgressUpdate((res) => {
            // 下载进度更新时的回调函数
            this.setData({
            progress: res.progress
            });
        });

            

    },

    downloadMP4FuncAd: function(e) {
        let videoAd = null
        
        // 在页面onLoad回调事件中创建激励视频广告实例
        if (wx.createRewardedVideoAd) {
            videoAd = wx.createRewardedVideoAd({
                adUnitId: 'adunit-c06784d3e3dc5629'
            })
                    
            try {
                if (videoAd.closeHandler) {
                    console.log("videoAd.offClose开始卸载");
                    videoAd.offClose(videoAd.closeHandler);
                    console.log("videoAd.offClose卸载成功");
                }
            } catch (e) {
                console.log("videoAd.offClose 卸载失败");
                console.error(e);
            }

            videoAd.onLoad(() => {})
            videoAd.onError((err) => {
                this.downloadMP4Func(e)  
            })
            videoAd.onClose((rr) => {
                
                if (rr && rr.isEnded) {
                    
                   
                    if (this.data.onMP4CloseCount == 0) {
                        console.log("激励了一次")
                        wx.setStorageSync('viewedDownloadMusicAd', true);
                        console.log("---------viewedDownloadMusicAd true:")
                        this.setData({
                            onMP4CloseCount: this.data.onMP4CloseCount + 1
                        })
                        this.downloadMP4Func(e)
                    }
                } else {
                    // 播放中途退出,不下发游戏奖励
                    console.log("播放中途退出,不下发游戏奖励")
                    // videoAd.show()
                }
                
            })
        }

        // 用户触发广告后，显示激励视频广告
        if (videoAd) {
            videoAd.show().catch(() => {
                // 失败重试
                videoAd.load()
                .then(() => videoAd.show())
                .catch(err => {
                    console.log('激励视频 广告显示失败')
                    console.log(err)
                })
            })
        }

    },

    downloadMP4FuncBefore: function(e) {
        let viewedAd = wx.getStorageSync('viewedDownloadMusicAd');
        console.log("下载音频看了广告：", viewedAd)
        // 如果今天还没有观看过广告
        if (!viewedAd) {
          // 调用观看广告的方法
          const that = this
          wx.showModal({
              title: "温馨提示", // 提示的标题
            //   content: "每天只需观看一次广告，即可解锁全部功能",
              content: "每天只需观看一次广告，即可解锁保存音频功能",
              showCancel: true, // 是否显示取消按钮，默认true
              cancelText: "取消", // 取消按钮的文字，最多4个字符
              cancelColor: "#000000", // 取消按钮的文字颜色，必须是16进制格式的颜色字符串
              confirmText: "知道了", // 确认按钮的文字，最多4个字符
              confirmColor: "#576B95", // 确认按钮的文字颜色，必须是 16 进制格式的颜色字符串
              success: function (res) {
                  console.log("接口调用成功的回调函数");
                  if (res.confirm) {
                      that.downloadMP4FuncAd(e)
                  } else if (res.cancel) {
                      return
                  }
              },
              fail: function (res) {
                  console.log("接口调用失败的回调函数");
                  console.log(res)
              },
              complete: function () {
                  console.log("接口调用结束的回调函数（调用成功、失败都会执行）");
              }
          })
          
        } else {
          // 提示用户今天已经观看过广告，无法再次观看
            
            console.log("今天已经观看过广告了")
           
            console.log(wx.getStorageSync('viewedAd'))
            console.log(wx.getStorageSync('viewedAdDate'))
            this.downloadMP4Func(e)  
        }
    },

    downloadMP4Func: function () {
        console.log("downloadMP4Func start")
        // console.log("this.access:", this.access())
        this.setData({
            hidden: false,
            progressHidden: false,
            progress: 0
        })
        const that = this 
        var mp4MusicUrl = that.data.musicUrl.replace("/music/download", "/music/mp4/download")
        // var mp4MusicUrl = mp4MusicUrl.replace("tankhui.cn", "tankhui.cn:8083")

        console.log("musicUrl mp4", mp4MusicUrl)
        wx.downloadFile({
            url: mp4MusicUrl, // 音频资源地址
            // filePath: wx.env.USER_DATA_PATH + '/videoCache/' +this.data.copyLink,
            success: res => {
              console.log('downloadFile成功回调res:', res)
              let FilePath = res.tempFilePath; // 下载到本地获取临时路径
              let fileManager = wx.getFileSystemManager();
                //let FilePath = wx.env.USER_DATA_PATH + "/" + that.data.saveUrl.substring(that.data.saveUrl.length - 16)
                wx.saveVideoToPhotosAlbum({ // 保存到相册
                    filePath: FilePath,
                    success: file => {
                        that.setData({
                            hidden: true,
                            progressHidden: false
                        })
                      console.log('saveMp4ToPhotosAlbum成功回调file:', file)
                      console.log('FilePath:', FilePath)
                      wx.showToast({
                        title: '保存成功',
                        duration: 3000,
                        icon: 'success'
                      })
                      fileManager.unlink({ // 删除临时文件
                        filePath: FilePath,
                        success(res) {
                            console.log(res,"unlink success")
                        },
                        fail(res) {
                            console.error(res,"unlink fail")
                        }
                      })
                    },
                    fail: err => {
                        that.setData({
                            hidden: true,
                            progressHidden: false
                        })
                      console.log('saveVideoToPhotosAlbum失败回调err:', err)
                      fileManager.unlink({ // 删除临时文件
                        filePath: FilePath,
                        success(res) {
                            console.log(res,"unlink success")
                        },
                        fail(res) {
                            console.error(res,"unlink fail")
                            wx.showToast({
                                title: '音频保存失败, 请重试',
                                duration: 4000,
                                icon: 'none'
                              })
                        }
                      })
                      wx.showToast({
                        title: '音频保存失败, 请点击复制链接在浏览器中打开',
                        duration: 4000,
                        icon: 'none'
                      })
                    },
                    complete() {
                    //   wx.hideLoading()
                    }
                  })
              
              
            },
            fail(e) {
              console.log('失败e', e)
              that.setData({
                    hidden: true,
                    progressHidden: false
                })
              wx.showToast({
                title: '音频保存失败了, 请点击复制链接在浏览器中打开',
                duration:4000,
                icon:'none'
              })
            },
            complete() {
              // wx.hideLoading();
            }
      }).onProgressUpdate((res) => {
        // 下载进度更新时的回调函数
        this.setData({
          progress: res.progress
        });
      });
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
        }
    },
    onStartDownload() {
        wx.getSetting({
          success: (res) => {
            if (res.authSetting['scope.writePhotosAlbum'] === undefined) {
              wx.authorize({
                scope: 'scope.writePhotosAlbum',
                success: () => {
                  console.log('打开了授权')
                  this.downloadVideoFunc()
                },
                fail: (err) => {
                  console.log('授权失败:', err)
                }
              })
            } else if (!res.authSetting['scope.writePhotosAlbum']) {
              wx.openSetting({
                success: (res) => {
                  console.log('openSetting成功回调:res', res)
                  if (res.authSetting['scope.writePhotosAlbum']) {
                    console.log('授权了')
                    this.downloadVideoFunc()
                  } else {
     
                  }
                },
                fail: (err) => {
     
                },
              })
            } else {
                this.downloadVideoFunc()
            }
          }
        })
    },
    cleanCon: function() {
        this.setData({
            content: "",
            progressHidden: true,
            buttonShow: false
        })
        
    },
    onShow: function () {
        wx.setStorageSync('viewedAd', false);
        wx.setStorageSync('viewedAdDate', "date");
        wx.setStorageSync('viewedDownloadMusicAd', false);
        wx.setStorageSync('viewedAdDownloadMusicDate', "date");
        wx.setStorageSync('viewedDownloadVideoAd', false);
        wx.setStorageSync('viewedAdDownloadVideoDate', "date");

        // 获取当前日期
        let date = new Date().toLocaleDateString();
    
        // 每次启动小程序时，检查是否已经观看过广告
        let viewedAdDate = wx.getStorageSync('viewedAdDate');
        
        // 如果没有观看过广告，或者观看过广告的日期不是今天，则将观看广告的标记重新设置为false
        console.log("viewedAdDate:", viewedAdDate)
        if (!viewedAdDate || viewedAdDate !== date) {
           console.log("123")
          wx.setStorageSync('viewedAd', false);
          wx.setStorageSync('viewedAdDate', date);
        }
        // 视频下载
        let viewedAdDownloadVideoDate = wx.getStorageSync('viewedAdDownloadVideoDate');
        
        console.log("viewedAdDownloadVideoDate:", viewedAdDownloadVideoDate)
        if (!viewedAdDownloadVideoDate || viewedAdDownloadVideoDate !== date) {
           console.log("123")
          wx.setStorageSync('viewedDownloadVideoAd', false);
          wx.setStorageSync('viewedAdDownloadVideoDate', date);
        }
        // 音频下载
        let viewedAdDownloadMusicDate = wx.getStorageSync('viewedAdDownloadMusicDate');
        
        console.log("viewedAdDownloadMusicDate:", viewedAdDownloadMusicDate)
        if (!viewedAdDownloadMusicDate || viewedAdDownloadMusicDate !== date) {
           console.log("123")
          wx.setStorageSync('viewedDownloadMusicAd', false);
          wx.setStorageSync('viewedAdDownloadMusicDate', date);
        }


        console.log("wx.getStorageSync('viewedAdDate')", wx.getStorageSync('viewedAdDate'))
        console.log("wx.getStorageSync('viewedAd')", wx.getStorageSync('viewedAd'))
        console.log("wx.getStorageSync('viewedDownloadMusicAd')", wx.getStorageSync('viewedDownloadMusicAd'))
        console.log("wx.getStorageSync('viewedDownloadVideoAd')", wx.getStorageSync('viewedDownloadVideoAd'))

    },
    onHide: function () {
        this.setData({
          onCloseCount: 0,
          onMP4CloseCount: 0,
          onCopyVideoCloseCount: 0,
          onCopyMusicCloseCount: 0
        })
    },
    onUnload: function () {
        this.setData({
            onCloseCount: 0,
            onMP4CloseCount: 0,
            onCopyVideoCloseCount: 0,
            onCopyMusicCloseCount: 0
        })
    },
    onLoad: function(options) {
        
    }
  })
