
/**
 *对Date的扩展，将 Date 转化为指定格式的String
 *月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
 *年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
 *例子：
 *(new Date()).format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
 *(new Date()).format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18
 */
// eslint-disable-next-line no-extend-native
Date.prototype.format = function(fmt) {
  const o = {
    // 月份
    'M+': this.getMonth() + 1,
    // 日
    'd+': this.getDate(),
    // 小时
    'h+': this.getHours(),
    // 分
    'm+': this.getMinutes(),
    // 秒
    's+': this.getSeconds(),
    // 季度
    'q+': Math.floor((this.getMonth() + 3) / 3),
    // 毫秒
    'S': this.getMilliseconds()
  }
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length))
  for (const k in o) { if (new RegExp('(' + k + ')').test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length))) }
  return fmt
}
const weekNameList = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']

/**
 * 对比两个日期是否同月
 * @param startDate
 * @param endDate
 */
export const getMonthCount = (startDate, endDate) => {
  if (endDate.getMonth() === startDate.getMonth()) {
    return getDayCount(startDate, endDate)
  }
}

/**
 * 获取两个日期天数间隔
 * @param startDate
 * @param endDate
 */
export const getDayCount = (startDate, endDate) => {
  const subTime = endDate.getDay() - startDate.getDay()
  return subTime
}

/**
 * 获取日期
 * @param str
 * @returns {string}
 */
export const getDateTime = (str) => {
  const newDate = str.replace(/\\-/g, '/')
  const date = new Date(newDate)
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hours = date.getHours()
  let minutes = date.getMinutes()
  if (minutes === 0) {
    minutes = '00'
  }
  return month + '月' + day + '日' + ' ' + hours + ':' + minutes
}

/**
 * 格式化日期
 * @param str
 * @returns {string}
 */
export const formatDate = (str) => {
  const newDate = str.replace(/\\-/g, '/')
  const date = new Date(newDate)
  let month = date.getMonth() + 1
  const day = date.getDate()
  if (month < 10) {
    month = '0' + month
  }
  return month + '.' + day
}

/**
 * 蚂蚁日期控件使用的日期转换方法 天
 */
export const formatDay = (date) => {
  const pad = n => n < 10 ? `0${n}` : n
  const dateStr = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
  return `${dateStr}`
}

/**
 * 获取日期
 * @param str
 * @returns {string}
 */
export const getDateDay = (str) => {
  return weekNameList[new Date(str).getDay()]
}

/**
 * 获取聊天时间文本内容
 * 如果时间是当天，格式:HH:mm，一周内格式：星期X HH:mm，之前格式：yyyy年MM月dd日 HH:mm
 * @param time 聊天时间
 */
export const getChatTimeText = (time) => {
  // 返回结果
  let result = ''
  // 当前时间
  const now = new Date()
  // 聊天时间
  const chatTime = new Date(time)
  // 格式化日期到天
  const nowDay = now.format('yyyyMMdd')
  const chatDay = chatTime.format('yyyyMMdd')

  // 格式化日期到小时和分钟
  let chatHourMinTime = chatTime.format('yyyy-MM-dd hh:mm')
  chatHourMinTime = chatHourMinTime.substring(chatHourMinTime.indexOf(' ') + 1)
  if (nowDay !== chatDay) {
    // 判断时间差
    const timeSub = getDayCount(chatTime, now)
    if (timeSub < 7) {
      // 一周内
      const weekStr = weekNameList[chatTime.getDay()]
      result = weekStr + ' ' + chatHourMinTime
    } else {
      result = chatTime.format('yyyy年MM月dd日 hh:mm')
    }
  } else {
    result = chatHourMinTime
  }
  return result
}
/**
 * 获取本周时间 ['2019-01-01','2019-01-07']
 * @param  Date 对象
 * @returns {string}
 */
export const getDayOfWeek = (dateFirst = new Date(), dateAfter = new Date()) => {
  // 0 即 7;
  const weekDay = dateFirst.getDay() || 7
  // 往前算（weekday-1）天
  dateFirst.setDate(dateFirst.getDate() - weekDay + 1)
  // 往后算（7-weekday）天
  dateAfter.setDate(dateAfter.getDate() + 7 - weekDay)
  const arr = [dateFirst.format('yyyy-MM-dd'), dateAfter.format('yyyy-MM-dd')]
  return arr
}
/**
 * 获取本月时间 ['2019-01-01','2019-01-31']
 * @param  Date 对象
 * @returns {string}
 */
export const getDayOfMonth = (dateFirst = new Date(), dateAfter = new Date()) => {
  dateFirst.setDate(1)
  const year = dateAfter.getFullYear()
  const month = dateAfter.getMonth() + 1
  const arr = [dateFirst.format('yyyy-MM-dd'), new Date(year, month, 0).format('yyyy-MM-dd')]
  return arr
}

export const dateFormat = (fmt, date) => {
  let ret;
  const opt = {
      "y+": date.getFullYear().toString(),        // 年
      "M+": (date.getMonth() + 1).toString(),     // 月
      "d+": date.getDate().toString(),            // 日
      "H+": date.getHours().toString(),           // 时
      "m+": date.getMinutes().toString(),         // 分
      "s+": date.getSeconds().toString()          // 秒
      // 有其他格式化字符需求可以继续添加，必须转化成字符串
  };
  for (let k in opt) {
      ret = new RegExp("(" + k + ")").exec(fmt);
      if (ret) {
          fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")))
      };
  };
  return fmt;
}