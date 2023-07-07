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
        musicUrl: ""
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
            content: "1. 本平台提供免费下载功能，版权归各视频、音乐平台所有，视频｜音频仅供个人观看，学习使用。因用户滥用该功能，导致的侵权行为，由用户承担相关责任。" + "\r\n\r\n" +"2. 下载的文件超过500M，可能会失败，可以复制解析后的链接，在浏览器中打开，下载资源。" + "\r\n\r\n" +"3. 遇到解析失败的情况，可以粘贴相同视频(音频)在其他APP的链接，重新解析。", // 提示的内容
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
    copyLinkFunc: function(e) {
        console.log(e)
        wx.showToast({
            title: '复制成功',
          })
      
          // 下方为微信开发文档中的复制 API
          wx.setClipboardData({
            data: this.data.copyLink, //复制的数据
            success: function (res) {
              wx.getClipboardData({
                success: function (res) {
                    
                }
              })
            }
          })

    },
    copyMusic: function(e) {
        console.log(e)
        wx.showToast({
            title: '复制成功',
          })
      
          // 下方为微信开发文档中的复制 API
          wx.setClipboardData({
            data: this.data.musicUrl, //复制的数据
            success: function (res) {
              wx.getClipboardData({
                success: function (res) {
                    
                }
              })
            }
          })

    },
    downloadMusic: function(e) {
        console.log("downloadVideoFunc start")
        // console.log("this.access:", this.access())
        this.setData({
            hidden: false,
            progressHidden: false
        })
        const that = this 
        wx.downloadFile({
            url: that.data.musicUrl, // 音频资源地
            // filePath: wx.env.USER_DATA_PATH + '/videoCache/' +this.data.copyLink,
            success: res => {
              console.log('downloadFile成功回调res:', res)
              let FilePath = res.tempFilePath; // 下载到本地获取临时路径
              let fileManager = wx.getFileSystemManager();
              
              wx.saveFile({
                tempFilePath: FilePath,
                success: function (result) {
                    that.setData({
                        hidden: true,
                        progressHidden: false
                    })
                    wx.getSavedFileList({
                        success: function (res) {
                          console.log('已保存的文件列表', res.fileList, res.fileList.length, res.fileList[0].filePath)
                          var saveMusicPath = res.fileList[res.fileList.length-1].filePath
                          console.log('音频保存地址:', saveMusicPath)
                          wx.showToast({
                            title: '文件保存地址:' + saveMusicPath,
                            duration: 4000,
                            icon: 'success'
                          })
                        },
                        fail: function (err) {
                          console.log('获取已保存的文件列表失败', err)
                        }
                      })
                    
                },
                fail: function (err) {
                    that.setData({
                        hidden: true,
                        progressHidden: false
                    })
                  wx.showToast({
                    title: '提取保存失败了',
                    duration:4000,
                    icon:'none'
                  })
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
                title: '音频保存失败了, 请重试或点击复制音频链接在浏览器中打开',
                duration:4500,
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
    downloadVideoFunc: function(e) {
        
        console.log("downloadVideoFunc start")
        // console.log("this.access:", this.access())
        this.setData({
            hidden: false,
            progressHidden: false
        })
        const that = this 
        wx.downloadFile({
            url: that.data.saveUrl, // 视频资源地址
            
            // filePath: wx.env.USER_DATA_PATH + '/videoCache/' +this.data.copyLink,
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
    onLoad: function(options) {
        // const that = this
        // // progressNum = 0
        // var timerpro = setInterval(function(){
        //     // if (typeof(progressNum) == undefined) {
        //     //     var progressNum = 0
        //     // }
        //     // progressNum++
        //     if (that.pro>=100) {
        //         clearInterval(timerpro)
        //     }
        //     var progressNum = that.pro + 1
        //     that.setData({
        //         pro:progressNum
        //     })
        // },300)
    }
  })
