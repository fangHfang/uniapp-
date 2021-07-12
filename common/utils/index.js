/**
 * 乘法得到金额数据（保留精度问题）
 * 调用例子：var total = Number(parseInt(num)).mul(parseFloat(dj));
 * @param arg
 * @returns {String}
 */
 Number.prototype.mul = function (arg)
 {
	 var m=0,s1=this.toString(),s2=arg.toString();
	 try{m+=s1.split(".")[1].length}catch(e){}
	 try{m+=s2.split(".")[1].length}catch(e){}

	 var val = Number(s1.replace(".",""))*Number(s2.replace(".",""))/Math.pow(10,m);
	 var m = val.toString();
	 var num = m.split(".");
	 if(num.length>1){
		 var l = num[1];
		 if(l.length<2){
			 m = m + "0";
		 }
	 }
	 return m;
 }

 /**
 * 加法得到金额数据（保留精度问题）
 * 调用例子：var total = Number(0.09999999).add(0.09999999);
 * @param arg
 * @returns {String}
 */
Number.prototype.add = function(arg){
    var r1,r2,m;
    try{r1=this.toString().split(".")[1].length}catch(e){r1=0}
    try{r2=arg.toString().split(".")[1].length}catch(e){r2=0}
    m=Math.pow(10,3)

    var val = (this*m+arg*m)/m;

    var m = val.toString();
	var num = m.split(".");
	if(num.length>1){
		var l = num[1];
		if(l.length<2){
			m = m + "0";
		}
	}
	return m;
}
/**
 * 减法得到金额数据（保留精度问题）
 * 调用例子：var total = Number(-0.09999999).sub(0.00000001);
 * @param arg
 * @returns {String}
 */
 Number.prototype.sub = function (arg){
    return this.add(-arg);
}

/**
 * 除法得到金额数据（保留精度问题）
 * 调用例子：var total = Number(0.000001).div(0.00000001);
 * @param arg
 * @returns {String}
 */
 Number.prototype.div = function (arg){
    var t1=0,t2=0,r1,r2;
    try{t1=this.toString().split(".")[1].length}catch(e){}
    try{t2=arg.toString().split(".")[1].length}catch(e){}
	r1 = Number(this.toString().replace(".",""))
	r1 = Number(arg.toString().replace(".",""))
	return (r1/r2)*pow(10,t2-t1);
}


Number.prototype.formatMoney = function (val){
	var m = val.toString();
	var num = m.split(".");
	if(num.length>1){
		var l = num[1];
		if(l.length<2){
			m = m + "0";
		}
	}
	return m;
}

// 判断市场常见的几种刘海屏机型
function getPhoneType() {
	let isSpecial = false
	uni.getSystemInfo({
		success: function(res) {
			let modelmes = res.model;
			console.log("手机型号-------", res);
			if (/iPhoneSimulator/i.test(modelmes) || /iphone x/i.test(modelmes) || (/(iPhone11|iPhone12,3)/i.test(modelmes) && res.screenHeight === 812)) {
				isSpecial = true
			} else {
				isSpecial = false
			}
		}
	});
	return isSpecial
}

/**
 * 转换json
 * @param
 * @returns
 */
function jsonFormat(json) {
  let str = "?";
  for (const k in json) {
    str += k + "=" + json[k] + "&";
  }
  return str.substring(0, str.length - 1);
}


/**
 * 保留小数点后两位
 * @param {Object} value
 */
function filtersNum(value) {
	if (!value) return '0.00';
	var value = value.toFixed(2);
	var intPart = Math.floor(Number(value));
	var intPartFormat = intPart.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1');
	var floatPart = '.00';
	value = value.toString();
	var value2Array = value.split('.');
	if (value2Array.length === 2) {
	  floatPart = value2Array[1].toString();
	  if (floatPart.length === 1) {
		  return intPartFormat + '.' + floatPart + '0';
	  } else {
		  return intPartFormat + '.' + floatPart;
	  }
	} else {
	  return intPartFormat + floatPart;
	}
}

/**
 * 计算元素的Dom 节点
 * @param {Object} id
 */
function getComponentsDom(id){
	return new Promise((resolve,reject)=>{
		let view = uni.createSelectorQuery().in(this).select(id);
		view.boundingClientRect(data => {
			resolve(data);
		}).exec();
	})
}

function deepClone(target) {
    // 定义一个变量
    let result;
    // 如果当前需要深拷贝的是一个对象的话
    if (typeof target === 'object') {
    // 如果是一个数组的话
        if (Array.isArray(target)) {
            result = []; // 将result赋值为一个数组，并且执行遍历
            for (let i in target) {
                // 递归克隆数组中的每一项
                result.push(deepClone(target[i]))
            }
         // 判断如果当前的值是null的话；直接赋值为null
        } else if(target===null) {
            result = null;
         // 判断如果当前的值是一个RegExp对象的话，直接赋值
        } else if(target.constructor===RegExp){
            result = target;
        }else {
         // 否则是普通对象，直接for in循环，递归赋值对象的所有值
            result = {};
            for (let i in target) {
                result[i] = deepClone(target[i]);
            }
        }
     // 如果不是对象的话，就是基本数据类型，那么直接赋值
    } else {
        result = target;
    }
     // 返回最终结果
    return result;
}


export default {
	isSpecial: getPhoneType(),
	jsonFormat,
	getComponentsDom,
	filtersNum,
	deepClone
}
