
import qt from './qt.js'

const util = {
    sum:qt.sum,
    convertCurrency (money) {
        var cnNums = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖']
        var cnIntRadice = ['', '拾', '佰', '仟']
        var cnIntUnits = ['', '万', '亿', '兆']
        var cnDecUnits = ['角', '分', '毫', '厘']
        var cnInteger = '整'
        var cnIntLast = '元'
        var maxNum = 999999999999999.9999
        var integerNum
        var decimalNum
        var chineseStr = ''
        var parts
        if (money === '') {
            return ''
        }
        money = parseFloat(money)
        if (money >= maxNum) {
            return ''
        }
        if (money === 0) {
            chineseStr = cnNums[0] + cnIntLast + cnInteger
            return chineseStr
        }
        money = money.toString()
        if (money.indexOf('.') === -1) {
            integerNum = money
            decimalNum = ''
        } else {
            parts = money.split('.')
            integerNum = parts[0]
            decimalNum = parts[1].substr(0, 4)
        }
        if (parseInt(integerNum, 10) > 0) {
            var zeroCount = 0
            var IntLen = integerNum.length
            for (var i = 0; i < IntLen; i++) {
                var n = integerNum.substr(i, 1)
                var p = IntLen - i - 1
                var q = p / 4
                var m = p % 4
                if (n === '0') {
                    zeroCount++
                } else {
                    if (zeroCount > 0) {
                        chineseStr += cnNums[0]
                    }
                    zeroCount = 0
                    chineseStr += cnNums[parseInt(n)] + cnIntRadice[m]
                }
                if (m === 0 && zeroCount < 4) {
                    chineseStr += cnIntUnits[q]
                }
            }
            chineseStr += cnIntLast
        }
        if (decimalNum !== '') {
            var decLen = decimalNum.length
            for (i = 0; i < decLen; i++) {
                n = decimalNum.substr(i, 1)
                if (n !== '0') {
                    chineseStr += cnNums[Number(n)] + cnDecUnits[i]
                }
            }
        }
        if (chineseStr === '') {
            chineseStr += cnNums[0] + cnIntLast + cnInteger
        } else if (decimalNum === '') {
            chineseStr += cnInteger
        }
        return chineseStr
    }
    

}


export default util;