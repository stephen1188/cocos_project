cc.ErrorMsg = {};
let handleError = function(...args){
    // console.log("注释掉上报log")
    // return
    if(window.exceptions == JSON.stringify(args) || !cc.vv.userMgr.userid) {
        return;
    }
    window.exceptions = JSON.stringify(args);
    let param = {};
    param.userId = cc.vv.userMgr.userid ? cc.vv.userMgr.userid : 0;
   
    param.clientVersion = cc.VERSION;
    param.deviceType = cc.vv.utils.getDeviceType();
    param.deviceVersion = cc.PUBLISH;
    param.deviceTag = "deviceTag";
    if(args[4]){
        param.errorInfo = args[4].hasOwnProperty('stack')?args[4].stack:args;
    }else{
        param.errorInfo = args;
    }
    

    let data = JSON.stringify(param);
    // console.log("打印日志",param.errorInfo)
    cc.vv.http.sendRequestUrl( cc.REPORT_SERVER , {data: data} , null , "POST"); 
}

if (cc.sys.isNative) {
    let __handler
    if (window['__errorHandler']) {
        __handler = window['__errorHandler']
    }
    window['__errorHandler'] = function (...args) {
        handleError(...args)
        if (__handler) {
            __handler(...args)
        }
    }
}

if (cc.sys.isBrowser) {
    // console.log("打印日志isBrowser")
    let __handler;
    if (window.onerror) {
        __handler = window.onerror
    }
    window.onerror = function (...args) {
        handleError(...args)
        if (__handler) {
            __handler(...args)
        }
    }
}


cc.Class({
    extends: cc.Component,

    properties: {
        _android:"scunt.wanshung.thuan.G3Plugin",
        _ios:"AppController",
        _share_call:null,
        _isCapturing:false,
    },

    // use this for initialization
    onLoad: function () {
    },

     /**
     * 电量变化监听
     */
    onPowerResult:function(power){
        cc.vv.global.power = power;
    },

    /**
     * 电量变化监听
     */
    onLocationResult:function(code,latitude,longitude,citycode,address){
        //位置坐标如果读取到了 存本地 提供给下次初始值 
        cc.sys.localStorage.setItem("latitude", latitude)
        cc.sys.localStorage.setItem("longitude", longitude)
        cc.vv.global.latitude = latitude;
        cc.vv.global.longitude = longitude;
        cc.vv.global.citycode = citycode;
        cc.vv.global.address = address.substring(0,address.lastIndexOf(" "));
    },

    /**
     * 闲聊 房价内邀请的回调跳转房间接收  
     * 原则上在大厅界面立马发送加入，在登录界面缓存一下，到大厅start在发送进入
     * 如果既不是大厅也不是登录，那就是正在游戏，这时本次邀请码直接清空，不作任何处理
     */
    onXianliaoYQ:function(code,roomid,openid,roomToken){
        roomid = parseInt(roomid)
        if (roomid.length < 3 || roomid == 0){return}
        if (cc.director.getScene().name =="hall"){
            cc.vv.userMgr.join(roomid,0,0);
        }else if(cc.director.getScene().name =="login"){
            cc.vv.global.lastYQroomid = roomid
        }else{
            cc.vv.global.lastYQroomid = null
        }
    },

    /**
     * 网络信号
     */
    onNetworkResult:function(type,level){
        cc.vv.global.net_type = type;
        cc.vv.global.net_level = level;
        cc.vv.gameNetMgr.dispatchEvent("network");
    },

    /**
     * 登录回调
     */
    onUserResult:function(code, msg){
        cc.log('code = ', code);
        switch(code){
            case 1:{
                // msg.nickname = msg.nickname.replace(/[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF][\u200D|\uFE0F]|[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF]|[0-9|*|#]\uFE0F\u20E3|[0-9|#]\u20E3|[\u203C-\u3299]\uFE0F\u200D|[\u203C-\u3299]\uFE0F|[\u2122-\u2B55]|\u303D|[\A9|\AE]\u3030|\uA9|\uAE|\u3030/ig, '☒');
                let ddd = "https://api.weixin.qq.com/sns/oauth2/access_token?appid=wxd10ad8e546464feb&secret=771c6e7811f8ce7d9e30a932614eb6bb&code="+msg+"&grant_type=authorization_code"
                cc.vv.http.sendRequestUrl(ddd,"",(data)=>{
                    data = JSON.parse(data)
                    let aa ="https://api.weixin.qq.com/sns/userinfo?access_token="+data.access_token+"&openid="+data.openid
                    cc.vv.http.sendRequestUrl(aa,"",(lmsg)=>{
                        cc.vv.userMgr.login( cc.vv.utils.encode(lmsg));
                    }, "GET");
                }, "GET"); 
            }
            break;
            case 0:{
                cc.vv.popMgr.hide();
                cc.vv.popMgr.alert("请重新登录");
            }
            break;
            case -1:{
                cc.vv.popMgr.hide();
                cc.vv.popMgr.alert("您已取消授权登录");
                cc.vv.g3Plugin.logout();
            }
            break;
            case 2:{
                cc.vv.userMgr.login(msg);
            }
            break;
        }
    },

    /**
     * 支付回调
     */
    onShoppingResult:function(code,msg,no){
        cc.vv.popMgr.hide();
        cc.vv.popMgr.alert(msg);

        if(code == 1){
            cc.vv.net1.quick('order_purchased',{no:no});
        }
    },
    
    /**
     * 分享回调
     */
    onShareResult:function(code, msg){
        switch(code){
            case 1:{
                if(this._share_call){
                    this._share_call(code,msg);
                    this._share_call = null;
                }
            }
            break;
            // case 0:{
            //     cc.vv.popMgr.tip(msg);
            // }
            // break;
            // case -1:{
            //     cc.vv.popMgr.tip(msg);
            // }
            // break;
        }
    },

    /**
     * 初始化，预获取授权
     */
    init:function(){ 
        
        if(!cc.sys.isNative){
            return;
        }

        if(cc.sys.os == cc.sys.OS_ANDROID){
            var location = jsb.reflection.callStaticMethod(this._android, "init", "()V");
            return location;
        }
        if(cc.sys.os == cc.sys.OS_IOS){
            var location = jsb.reflection.callStaticMethod(this._ios, "init");
            return location;
        }
    },

    //震动
    vibrate:function(milliseconds){
        if(!cc.sys.isNative){
            return;
        }

        if(cc.sys.os == cc.sys.OS_ANDROID){
            jsb.reflection.callStaticMethod(this._android, "vibrate", "(I)V",milliseconds);
        }

        if(cc.sys.os == cc.sys.OS_IOS){
            jsb.reflection.callStaticMethod(this._ios, "vibrate:",milliseconds);
        }

        // this._share_call = func;
    },

    /**
     * 获取定位
     */
    location:function(){

        if(!cc.sys.isNative){
            return;
        }

        if(cc.sys.os == cc.sys.OS_ANDROID){
            jsb.reflection.callStaticMethod(this._android, "location", "()V");
        }

        if(cc.sys.os == cc.sys.OS_IOS){
            jsb.reflection.callStaticMethod("IosHelper", "location");
        }
    },

    calculateLineDistance:function(startLatlng,endLatlng){

        if(startLatlng == undefined || startLatlng == '' || startLatlng == ',')return -1;
        if(endLatlng == undefined || endLatlng == '' || endLatlng == ',')return -1;

        var startArr = startLatlng.split(",");
        var endArr = endLatlng.split(",");

        var lat1 = parseFloat(startArr[1]);
        var lng1 = parseFloat(startArr[0]);
        var lat2 = parseFloat(endArr[1]);
        var lng2 = parseFloat(endArr[0]);

        var EARTH_RADIUS = 6378137.0;    //单位M  
        var PI = Math.PI;  
          
        var radLat1 = (lat1*PI/180.0);  
        var radLat2 = (lat2*PI/180.0);  
          
        var a = radLat1 - radLat2;  
        var b = (lng1*PI/180.0) - (lng2*PI/180.0);  
          
        var s = 2*Math.asin(Math.sqrt(Math.pow(Math.sin(a/2),2) + Math.cos(radLat1)*Math.cos(radLat2)*Math.pow(Math.sin(b/2),2)));  
        s = s*EARTH_RADIUS;  
        s = Math.round(s*10000)/10000.0;

        return s;
        // if(!cc.sys.isNative){
        //     return '';
        // }

        // if(cc.sys.location != 1){
        //     return '';
        // }

        // if(cc.sys.os == cc.sys.OS_ANDROID){
        //     var location = jsb.reflection.callStaticMethod(this._android, "calculateLineDistance", "(Ljava/lang/String;Ljava/lang/String;)Ljava/lang/String;",startLatlng,endLatlng);
        //     return location;
        // }

        // if(cc.sys.os == cc.sys.OS_IOS){
        //     var location = jsb.reflection.callStaticMethod(this._ios, "calculateLineDistance:endLatlng:",startLatlng,endLatlng);
        //     return location;
        // }
    },
    
    /**
     * 剪切板
     */
    copyText:function(text){

        if(!cc.sys.isNative){
            return;
        }
        text = text+ '';
        if(cc.sys.os == cc.sys.OS_ANDROID){
            jsb.reflection.callStaticMethod(this._android, "copy", "(Ljava/lang/String;)V",text);
        }

        if(cc.sys.os == cc.sys.OS_IOS){
            jsb.reflection.callStaticMethod("IosHelper", "copy:",text);
        }
    },

    /**
     * 获取外部房间号
     */
    getRoomId:function(){

        if(!cc.sys.isNative){
            return '';
        }

        if(cc.sys.os == cc.sys.OS_ANDROID){
            var roomid = jsb.reflection.callStaticMethod(this._android, "getRoomid", "()Ljava/lang/String;");
            return roomid;
        }

        if(cc.sys.os == cc.sys.OS_IOS){
            var roomid = jsb.reflection.callStaticMethod(this._ios, "getRoomid");
            return roomid;
        }
    },

    /**
     * 分享文字
     */
    shareText:function(platfrom,title,text,func){

        if(!cc.sys.isNative){
            return;
        }

        if(cc.sys.os == cc.sys.OS_ANDROID){
            jsb.reflection.callStaticMethod(this._android, "shareText", "(ILjava/lang/String;Ljava/lang/String;)V",platfrom,title,text);
        }

        if(cc.sys.os == cc.sys.OS_IOS){
            jsb.reflection.callStaticMethod(this._ios, "shareText:title:text:",platfrom,title,text);
        }

        this._share_call = func;
    },

    /**
     * 闲聊分享文字
     * 用不到
     */
    shareXLText:function(text){

        if(!cc.sys.isNative){
            return;
        }

        if(cc.sys.os == cc.sys.OS_ANDROID){
            jsb.reflection.callStaticMethod(this._android, "shareTextToXL", "(Ljava/lang/String;)V",text);
        }

        if(cc.sys.os == cc.sys.OS_IOS){
            jsb.reflection.callStaticMethod(this._ios, "shareTextToXL:text:",1,text);
        }

        // this._share_call = func;
    },

    /**
     * 闲聊分享图片
     * 用不到
     */
    shareXLTimg:function(text){
        if(!cc.sys.isNative){
            return;
        }

        if(cc.sys.os == cc.sys.OS_ANDROID){
            jsb.reflection.callStaticMethod(this._android, "shareImgToXL", "(Ljava/lang/String;)V",text);
        }

        if(cc.sys.os == cc.sys.OS_IOS){
            jsb.reflection.callStaticMethod(this._ios, "XLshareImg:text:",1,text);
        }

        // this._share_call = func;
    },
    
    /**
     * 闲聊分享连接
     */
    shareXLTUrl:function(imgurl,url,title,detail){
        if(!cc.sys.isNative){
            return;
        }

        if(cc.sys.os == cc.sys.OS_ANDROID){
            jsb.reflection.callStaticMethod(this._android, "shareURLToXL", "(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)V",imgurl,url,title,detail);
        }

        if(cc.sys.os == cc.sys.OS_IOS){
            jsb.reflection.callStaticMethod(this._ios, "XLshareWeb:title:text:imgurl:url:",1,title,detail,imgurl,url);
        }

        // this._share_call = func;
    },
    /**
     * 闲聊的邀请分享
     */
    shareXLTYaoqing:function(imgurl,roomId,roomToken,DownUrl,title,detail){
        if(!cc.sys.isNative){
            return;
        }

        if(cc.sys.os == cc.sys.OS_ANDROID){
            jsb.reflection.callStaticMethod(this._android, "shareYQToXL",
                "(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)V",
                imgurl,roomId,roomToken,DownUrl,title,detail
            );
        }

        if(cc.sys.os == cc.sys.OS_IOS){
            jsb.reflection.callStaticMethod(this._ios, "XLshareYQ:title:text:imgurl:url:roomid:roomtoken:",1,title,detail,imgurl,DownUrl,roomId,roomToken);
        }

        // this._share_call = func;
    },
    /**
     * 图片
     */
    shareWeb:function(platfrom,title,text,imgurl,url,func){

        if(!cc.sys.isNative){
            return;
        }

        if(cc.sys.os == cc.sys.OS_ANDROID){
            jsb.reflection.callStaticMethod(this._android, "shareWeb", "(ILjava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)V",platfrom,title,text,imgurl,url);
        }

        if(cc.sys.os == cc.sys.OS_IOS){
            jsb.reflection.callStaticMethod(this._ios, "shareWeb:title:text:imgurl:url:",platfrom,title,text,imgurl,url);
        }

        this._share_call = func;
    },

    //截屏分享
    screenShare:function(platfrom,callback){

        if(this._isCapturing){
            return;
        }

        this._isCapturing = true;

        var size = cc.winSize;
        var fileName = "result_share.jpg";
        var fullPath = jsb.fileUtils.getWritablePath() + fileName;
        if(jsb.fileUtils.isFileExist(fullPath)){
            jsb.fileUtils.removeFile(fullPath);
        }

        var texture = new cc.RenderTexture(Math.floor(size.width), Math.floor(size.height),cc.Texture2D.PIXEL_FORMAT_RGBA8888, gl.DEPTH24_STENCIL8_OES);

        texture.setPosition(cc.v2(size.width/2, size.height/2));
        texture.begin();
        cc.director.getRunningScene().visit();
        texture.end();
        texture.saveToFile(fileName, cc.IMAGE_FORMAT_JPEG);
        
        var self = this;
        var tryTimes = 0;
        var fn = function(){
            if(jsb.fileUtils.isFileExist(fullPath)){
                if(cc.sys.os == cc.sys.OS_ANDROID || cc.sys.os == cc.sys.OS_IOS){
                    if (platfrom == 4){
                        cc.vv.g3Plugin.shareXLTimg(fullPath)
                    }else{
                        cc.vv.g3Plugin.shareImg(platfrom,"",fullPath,"",callback);
                    }
                         
                }

                self._isCapturing = false;
            }
            else{
                tryTimes++;
                if(tryTimes > 10){
                    console.log("time out...");
                    return;
                }
                setTimeout(fn,50); 
            }
        }
        setTimeout(fn,50);
    },

    /**
     * 分享文字
     */
    shareImg:function(platfrom,title,imgurl,url,func){

        if(!cc.sys.isNative){
            return;
        }

        this._share_call = func;

        if(cc.sys.os == cc.sys.OS_ANDROID){
            jsb.reflection.callStaticMethod(this._android, "shareImg", "(ILjava/lang/String;Ljava/lang/String;Ljava/lang/String;)V",platfrom,title,imgurl,url);
        }

        if(cc.sys.os == cc.sys.OS_IOS){
            jsb.reflection.callStaticMethod(this._ios, "shareImg:title:imgurl:url:",platfrom,title,imgurl,url);
        }
    },

    /**
     * 登录
     */
    login:function(platfrom){
        cc.log("platfrom = ", platfrom);
        if(!cc.sys.isNative){
            cc.log('111');
            return;
        }
        cc.log("platfrom = ", platfrom);
        if(cc.sys.os == cc.sys.OS_ANDROID){ 
            cc.log("调用微信登录？");
            jsb.reflection.callStaticMethod("scunt.wanshung.thuan.WXAPI", "login", "(I)V",platfrom);//this._android, "login", "(I)V",platfrom);
        }

        if(cc.sys.os == cc.sys.OS_IOS){
            jsb.reflection.callStaticMethod(this._ios, "login:",platfrom);
        }
    },

    /**
     * 登出
     */
    logout:function(platfrom){
        if(!cc.sys.isNative){
            return;
        }

        if(cc.sys.os == cc.sys.OS_ANDROID){
            jsb.reflection.callStaticMethod(this._android, "logout", "(I)V",platfrom);
        }

        if(cc.sys.os == cc.sys.OS_IOS){
            jsb.reflection.callStaticMethod(this._ios, "logout:",platfrom);
        }
    },

            /**
     * 图片
     */
    shopping:function(index,no){

        if(!cc.sys.isNative){
            cc.vv.popMgr.hide();
            return;
        }

        if(cc.sys.os == cc.sys.OS_IOS){
            jsb.reflection.callStaticMethod(this._ios, "iap:no:",index,no);
        }

        this._share_call = func;
    },
    
});