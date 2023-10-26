cc.Class({
    extends: cc.Component,

    properties: {
        time:2,
    },

    start () {
        this.init();
        cc.director.preloadScene('login');
        // this.ps();
        // cc.log("cc.HALL_SERVER = ", cc.HALL_SERVER);
        // if(!cc.HALL_SERVER){
        //     cc.log("SplashLogic 获取失败！");
        //     cc.vv.hallServerArr = ['ws://019035.zhongyundns.wrewre.qlyfhdns.com:19088', 'ws://h1.wanshuns.com:19088'];
        // }else{
        //     cc.vv.hallServerArr = cc.vv.utils.deepCopy(cc.HALL_SERVER);
        // }
        // cc.vv.hallServerArr = cc.vv.utils.deepCopy(cc.HALL_SERVER);
        // cc.vv.hallServerArr = ['ws://h1.wanshun.vip:19088', 'ws://h1.wanshun.vip:19088'];
        // cc.vv.hallServerArr = ['ws://47.57.137.112:19088', 'ws://47.57.137.112:19088'];
        // cc.vv.hallServerArr = ['ws://127.0.0.1:19088', 'ws://127.0.0.1:19088']
        // cc.vv.hallServerArr = ['ws://8.217.44.199:19088', 'ws://8.217.44.199:19088'];
        cc.vv.hallServerArr = ['ws://h1.wanshun.vip:19088', 'ws://h1.wanshun.vip:19088'];
        if (!cc.sys.isNative){
            // this.getReallyAdress()
            this.login();
        }else{
            cc.log("重新获取去");
            this.getReallyAdress()
        }
        // this.getReallyAdress()
    },

    init:function(){
        cc.vv = {};
        cc.vv.tempDataMgr = require("TempDataMgr"); //存放临时数据
        cc.vv.log3 = require("Log");
        cc.vv.config = require("Config");
        cc.vv.global = require("Global");
        cc.vv.http = require("HTTP");

        //初始给个空经纬度
        cc.vv.global.latitude = ""//cc.sys.localStorage.getItem("latitude");
        cc.vv.global.longitude = ""//cc.sys.localStorage.getItem("longitude");

        var AudioMgr = require("AudioMgr");
        cc.vv.audioMgr = new AudioMgr();
        cc.vv.audioMgr.init();

        var UserMgr = require("UserMgr");
        cc.vv.userMgr = new UserMgr();

        var PopMgr = require("PopMgr");
        cc.vv.popMgr = new PopMgr();
        
        var Utils = require("Utils");
        cc.vv.utils = new Utils();
        
        //获取浏览器参数
        cc.args = this.urlParse();

        //播放背景音乐
        cc.vv.audioMgr.playSFX("loading");

        // 只有在登陆场景才切换ip
        cc.vv.isLoginScene = true;
        cc.vv.connceNum = 0;

        cc.vv.sp = this;
    },
    getReallyAdress(){
        // if(cc.GAME_RUNING_ENVIRONMENT == cc.ENVIRONMENT.debug){
            // cc.vv.hallServerArr = cc.vv.utils.deepCopy(cc.HALL_SERVER);
        //     return;
        // }
        function readTextFile(filePath, callback) {
            let newPath = filePath + '?r=' + Date.now();
            const xhrFile = new XMLHttpRequest();
            xhrFile.timeout = 5000;
            xhrFile.open("GET", newPath, true);
            cc.log("newPath = ", newPath);
            xhrFile.onload  = function() {
                cc.log('xhrFile.response = ', xhrFile.response);
                const allText = xhrFile.response;
                callback(allText)
            }
            xhrFile.send();
            xhrFile.ontimeout = function(){
                cc.log("连接超时了 ！！！");
                readTextFile('http://conf.wanshun.vip/config.txt', (textDetail)=>{
                    var json = JSON.parse(textDetail);
                    if(!textDetail || !json.main){
                        cc.vv.popMgr.alert("服务器连接错误，请点击确定重新打开游戏",function(){
                            cc.director.loadScene("splash");
                        });
                    }
                    cc.GAMEDEALER = json.dealer;
                    cc.GAMEMEMBER = json.mgr;
                    cc.HALL_SERVER = [json.main,json.sub];
                    // cc.log("cc.HALL_SERVER = ", cc.HALL_SERVER);
                    cc.vv.hallServerArr = cc.vv.utils.deepCopy(cc.HALL_SERVER);
                    cc.log("cc.vv.hallServerArr = ", cc.vv.hallServerArr);
                    cc.vv.sp.login();
                });
            }
            xhrFile.onerror = ()=>{
                cc.log("连接错误了！！！");
                readTextFile('http://conf.wanshun.vip/config.txt', (textDetail)=>{
                    var json = JSON.parse(textDetail);
                    if(!textDetail || !json.main){
                        cc.vv.popMgr.alert("服务器连接错误，请点击确定重新打开游戏",function(){
                            cc.director.loadScene("splash");
                        });
                    }
                    cc.GAMEDEALER = json.dealer;
                    cc.GAMEMEMBER = json.mgr;
                    cc.HALL_SERVER = [json.main,json.sub];
                    // cc.log("cc.HALL_SERVER = ", cc.HALL_SERVER);
                    cc.vv.hallServerArr = cc.vv.utils.deepCopy(cc.HALL_SERVER);
                    cc.log("cc.vv.hallServerArr = ", cc.vv.hallServerArr);
                    cc.vv.sp.login();
                });
            }
        }

        // let json = {
        //     "main": "ws://120.78.172.160:19088",
        //     "sub": "ws://120.78.172.160:19088",
        //     "mgr": "http://120.2.19.217:8010/mgr/",
        //     "dealer": "http://120.5.197.21:8011/dealer/"
        //   }

        // cc.GAMEDEALER = json.dealer;
        // cc.GAMEMEMBER = json.mgr;
        // cc.HALL_SERVER = [json.main,json.sub];
        // cc.vv.hallServerArr = cc.vv.utils.deepCopy(cc.HALL_SERVER);
        // this.login();
        readTextFile(cc.GAMEDEFILEPATH , (textDetail) => {
            var json = JSON.parse(textDetail);
            if(!textDetail || !json.main){
                cc.vv.popMgr.alert("服务器连接错误，请点击确定重新打开游戏",function(){
                    cc.director.loadScene("splash");
                });
            }
            cc.GAMEDEALER = json.dealer;
            cc.GAMEMEMBER = json.mgr;
            cc.HALL_SERVER = [json.main,json.sub];
            // cc.log("cc.HALL_SERVER = ", cc.HALL_SERVER);
            cc.vv.hallServerArr = cc.vv.utils.deepCopy(cc.HALL_SERVER);
            // cc.HALL_SERVER = ['ws://47.106.133.32:19088','ws://47.106.133.32:19088']
            // cc.HALL_SERVER = ['ws://47.106.86.68:19088','ws://47.106.86.68:19088']
            // cc.HALL_SERVER = ['ws://y5.wanshun2.vip:19088','ws://y5.wanshun2.vip:19088']
            cc.log("cc.vv.hallServerArr = ", cc.vv.hallServerArr);
            this.login();
        })
    },
    //获取浏览器参数，游客登录时使用
    urlParse:function(){
        var params = {};
        if(window.location == null){
            return params;
        }
        var name,value; 
        var str=window.location.href; //取得整个地址栏
        var num=str.indexOf("?") 
        str=str.substr(num+1); //取得所有参数   stringvar.substr(start [, length ]
        
        var arr=str.split("&"); //各个参数放到数组里
        for(var i=0;i < arr.length;i++){ 
            num=arr[i].indexOf("="); 
            if(num>0){ 
                name=arr[i].substring(0,num);
                value=arr[i].substr(num+1);
                params[name]=value;
            } 
        }
        return params;
    },

    //通过搜狐接口，得到IP
    ps:function(){
        var onGet = function (ret) {
            var data = ret.substr(ret.indexOf("{"));
            data = data.substr(0,data.length-1);
            var json = JSON.parse(data);
            cc.vv.global.adcode = json.cid;
            cc.vv.global.address = json.cname;
            cc.vv.global.ip = json.cip;
        };

        if (cc.sys.isNative){
            var xhr = cc.loader.getXMLHttpRequest();
            xhr.timeout = 5000;
            xhr.setRequestHeader("Accept-Encoding","deflate","text/html;charset=utf-8");
            xhr.open("GET","http://pv.sohu.com/cityjson?ie=utf-8", true);
            xhr.onreadystatechange = function() {
                if(xhr.readyState === 4 && (xhr.status >= 200 && xhr.status < 300)){
                    onGet(xhr.responseText);
                }
            };
            xhr.send();
        }
    },

    login:function(){
        var self = this;
        this.node.runAction(
            cc.sequence(
                cc.delayTime(self.time),
                // cc.fadeOut(0.5),
                cc.callFunc(function(){
                    cc.director.loadScene('login');
                })
            )
        );  
    },
});
