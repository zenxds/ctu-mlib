/**
 * 微信相关封装
 */
import $ from '../../zepto/zepto'
import '../../zepto/ajax'

const wx = window.wx
const isWX = /MicroMessenger/i.test(navigator.userAgent)

/**
 * 
 */
exports.share = function(options) {
  if (!isWX || !wx) {
    return
  }
  options = mix({
    title: document.title,
    desc: document.title,
    link: location.href,
    imgUrl: ''
  }, options || {})

  $.ajax({
    url: options.shareConfigUrl || '/weixin/sdkconfig',
    dataType: 'json',
    success: (config) => {
      config.jsApiList = [
        'onMenuShareAppMessage',
        'onMenuShareTimeline'
      ]
      wx.config(config)
      wx.ready(() => {
        wx.onMenuShareTimeline(options)
        wx.onMenuShareAppMessage(options)
      })
    }
  })
}

function mix(to, from) {
  for (var i in from) {
    to[i] = from[i]
  }
  return to
}