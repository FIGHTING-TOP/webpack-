export function getUrlParam(paras) {
            var url = window.location.href;
            var paraString = url.substring(url.indexOf("?") + 1, url.length).split("&");
            var paraObj = {};
            var i, j;
            for (i = 0; j = paraString[i]; i++) {
                paraObj[j.substring(0, j.indexOf("=")).toLowerCase()] = j.substring(j.indexOf("=") + 1, j.length);
            }
            var returnValue = paraObj[paras.toLowerCase()];
            if (returnValue && returnValue.indexOf('#') > -1) {
                returnValue = returnValue.split('#')[0];
            }
            if (typeof(returnValue) == "undefined") {
                return "";
            } else {
                return returnValue;
            }
        };

export function Store(preId, timeSign) {
    this.preId = preId;
    this.timeSign = timeSign || '-';
}
Store.prototype = {
    /*状态数据*/
    status: {
        success: 0, //成功
        failure: 1, //失败
        overflow: 2, //溢出
        timeout: 3 //过期
    },
    store: localStorage || window.localStorage,
    /*转换为json字符串*/
    toJsonStr: function(val) {
        return val === undefined || typeof val === "function" ? val + "" : JSON.stringify(val);
    },
    /*反序列化转化为json对象*/
    toJson: function(val) {
        if (typeof val !== "string") {
            return undefined;
        }
        try {
            return JSON.parse(val);
        } catch (err) {
            return val || undefined;
        }
    },
    /*获取本地库真实字段*/
    getKey: function(key) {
        return this.preId + key;
    },
    /**
     * 类存值方法
     * 参数 key 键  类型String
     * 参数 val 值  类型String/Array/Object
     * 参数 cb  回调函数   类型  Funciton
     */
    set: function(key, val) {
        /*默认为成功状态*/
        var status = this.status.success,
            /*得到真实字段*/
            key = this.getKey(key),
            time = new Date().getTime();
        try {
            /*向数据库添加数据*/
            this.store.setItem(key, time + this.timeSign + this.toJsonStr(val));
        } catch (err) {
            /*存储失败返回溢出状态*/
            status = this.status.overflow;
        }
        
    },
    /**
     * 类取值方法
     * 参数 key 键   类型 String
     * 参数 exp 过期时间   类型Number
     * 参数 cb  回调函数  类型Function
     */
    get: function(key, exp) {
        var status = this.status.success, //默认状态
            key = this.getKey(key), //实际字段
            value = null, //默认value值
            timeSignLen = this.timeSign.length,
            me = this, //存储当前对象
            index,
            time,
            result,
            exp = parseInt(exp) || 1000 * 60 * 60;
        try {
            value = this.store.getItem(key);
        } catch (err) {
            result = {
                status: this.status.failure,
                value: null
            };
            
            return result;
        }
        if (value) {
            index = value.indexOf(me.timeSign);
            time = +value.slice(0, index);
            if ((new Date().getTime() - time) < exp) {
                value = this.toJson(value.slice(index + timeSignLen));
            } else {
                value = null;
                status = me.status.timeout;
                this.store.removeItem(key);
            }
        } else {
            status = this.status.failure;
        }
        result = {
            status: status,
            value: value
        }
        
        return result;
    },
    /**
     * 类移除方法
     * 参数 key 键   类型 String
     * 参数 cb  回调函数  类型Function
     */
    remove: function(key) {
        var status = this.status.failure,
            key = this.getKey(key);
        value = null;
        try {
            value = this.store.getItem(key);
        } catch (err) {}
        if (value) {
            try {
                this.store.removeItem(key);
                status = this.status.success;
            } catch (err) {}
        }
    },
    /**
     * 类取值方法（无参）
     */
    clear: function() {
        this.store.clear();
    },
    /**
     * 类判断方法
     * 参数 key 键   类型 String
     */
    has: function(key) {
        var key = this.getKey(key);
        return this.store.hasOwnProperty(key);
    },
    /**
     * 类当前容量方法（无参）
     */
    size: function() {
        return this.toJsonStr(this.store).length;
    }
}


export function goLogin(res) {
    if (res.code == '100') {
       window.location.href = '/admin/pages/login.html';//http://mp.bbtree.com
    }
}
