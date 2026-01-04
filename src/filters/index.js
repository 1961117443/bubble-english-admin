// import parseTime, formatTime and set to filter
export {
  parseTime,
  formatTime
}
from '@/utils'
import qt from '@/utils/qt'

/**
 * Show plural label if time is plural number
 * @param {number} time
 * @param {string} label
 * @return {string}
 */
function pluralize(time, label) {
  if (time === 1) {
    return time + label
  }
  return time + label + 's'
}

/**
 * @param {number} time
 */
export function timeAgo(time) {
  const between = Date.now() / 1000 - Number(time)
  if (between < 3600) {
    return pluralize(~~(between / 60), ' minute')
  } else if (between < 86400) {
    return pluralize(~~(between / 3600), ' hour')
  } else {
    return pluralize(~~(between / 86400), ' day')
  }
}

/**
 * Number formatting
 * like 10000 => 10k
 * @param {number} num
 * @param {number} digits
 */
export function numberFormatter(num, digits) {
  const si = [{
      value: 1E18,
      symbol: 'E'
    },
    {
      value: 1E15,
      symbol: 'P'
    },
    {
      value: 1E12,
      symbol: 'T'
    },
    {
      value: 1E9,
      symbol: 'G'
    },
    {
      value: 1E6,
      symbol: 'M'
    },
    {
      value: 1E3,
      symbol: 'k'
    }
  ]
  for (let i = 0; i < si.length; i++) {
    if (num >= si[i].value) {
      return (num / si[i].value).toFixed(digits).replace(/\.0+$|(\.[0-9]*[1-9])0+$/, '$1') + si[i].symbol
    }
  }
  return num.toString()
}

/**
 * 10000 => "10,000"
 * @param {number} num
 */
export function toThousandFilter(num) {
  return (+num || 0).toString().replace(/^-?\d+/g, m => m.replace(/(?=(?!\b)(\d{3})+$)/g, ','))
}

/**
 * Upper case first char
 * @param {String} string
 */

//  工作流审批状态
export function flowStatus(status) {
  let text = ''
  switch (status) {
    case 1:
      text = "wait"
      break;
    case 2:
      text = "adopt"
      break;
    case 3:
      text = "reject"
      break;
    case 4:
      text = "revoke"
      break;
    case 5:
      text = "cancel"
      break;
  }
  return text
}
//  工作流紧急程度
export function urgentText(value) {
  let text = ''
  switch (value) {
    case 1:
      text = "普通";
      break;
    case 2:
      text = "重要";
      break;
    case 3:
      text = "紧急";
      break;
    default:
      text = "普通";
      break;
  }
  return text
}

export function uppercaseFirst(string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}
export function toDate(v, format) {
  return qt.toDate(v, format)
}
export function toDateText(dateTime) {
  return qt.toDateText(dateTime)
}
export function toFileSize(size) {
  return qt.toFileSize(size)
}

// 代码生成器数据匹配
export function dynamicText(value, options, vf='id',lf='fullName') {
  if (!value && value!='0') return ''
  if (Array.isArray(value)) {
    if (!options || !Array.isArray(options)) return value.join()
    let textList = []
    for (let i = 0; i < value.length; i++) {
      let item = options.filter(o => o[vf] == value[i])[0]
      if (!item || !item[lf]) {
        textList.push(value[i])
      } else {
        textList.push(item[lf])
      }
    }
    return textList.join()
  }
  if (!options || !Array.isArray(options)) return value
  let item = options.filter(o => o[vf] == value)[0]
  if (!item || !item[lf]) return value
  return item[lf]
}

export function dynamicTreeText(value, options, vf='id',lf='fullName',cf='children',split) {
  if (!value) return ''

  function transfer(data) {
    let textList = []

    function loop(data, id) {
      for (let i = 0; i < data.length; i++) {
        if (data[i][vf] === id) {
          textList.push(data[i][lf])
          break
        }
        if (data[i][cf]) loop(data[i][cf], id)
      }
    }
    for (let i = 0; i < data.length; i++) {
      loop(options, data[i])
    }
    return textList.join()
  }
  if (!options || !Array.isArray(options)) return value.join()
  if (Array.isArray(value)) {
    let text = transfer(value)
    return text
  } else {
    if (!options || !Array.isArray(options)) return value
    let list = split? value.split(split) : value.split()
    let text = transfer(list)
    return text
  }
}

export function fileSizeText(value,type='MB') {
  let text = ''
  switch (type) {
    case 'KB':
      text =  (value / 1024.0).toFixed(2) + "KB";
      break;
    case 'GB':
      text =  (value / 1024.0 / 1024.0 / 1024.0).toFixed(2) + "GB";
      break;
    case 'MB':
    default:
       text =  (value / 1024.0 / 1024.0).toFixed(2) + "MB";
      break;
  }
  return text
}