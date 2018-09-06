// 工具方法，用于判断字符串是否以`$`或`_`开头
export function isReserved (str) {
    var c = (str + '').charCodeAt(0)
    return c === 0x24 || c === 0x5F
}