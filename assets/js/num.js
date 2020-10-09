// 去掉末尾小数 0
function cutZero (old) {
    //拷贝一份 返回去掉零的新串
    newstr = old;
    //循环变量 小数部分长度
    var leng = old.length - old.indexOf(".") - 1
    //判断是否有效数
    if (old.indexOf(".") > -1) {
        //循环小数部分
        for (i = leng; i > 0; i--) {
            //如果newstr末尾有0
            if (newstr.lastIndexOf("0") > -1 && newstr.substr(newstr.length - 1, 1) == 0) {
                var k = newstr.lastIndexOf("0");
                //如果小数点后只有一个0 去掉小数点
                if (newstr.charAt(k - 1) == ".") {
                    return newstr.substring(0, k - 1);
                } else {
                    //否则 去掉一个0
                    newstr = newstr.substring(0, k);
                }
            } else {
                //如果末尾没有0
                return newstr;
            }
        }
    }
    return old;
}

// 保留8位小数，不四舍五入
function formatDecimal (num, decimal) {
    num = num.toString()
    let index = num.indexOf('.')
    if (index !== -1) {
        num = num.substring(0, decimal + index + 1)
    } else {
        num = num.substring(0)
    }
    return parseFloat(num).toFixed(decimal)
}

// 钱包地址
function hidden_address (wallet_address) {
    if (null === wallet_address) return wallet_address;
    // 0x3ead5b...1cee9c.字符串长度小于等于此长度的不处理
    let strLen = wallet_address.length
    if (strLen <= 17) return wallet_address;

    // 剩下的就是正常长度的钱包地址
    return wallet_address.slice(0, 6) + '...' + wallet_address.slice(-4)
}

//将科学计数法转换为小数
function toNonExponential (num) {
    var m = num.toExponential().match(/\d(?:\.(\d*))?e([+-]\d+)/);
    return num.toFixed(Math.max(0, (m[1] || '').length - m[2]));
}
