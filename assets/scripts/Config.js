cc.VERSION = 'V1.0.0';
// cc.SERVER = '10086'
cc.SERVER = '1829'
cc.GAME_CODE = 'lolo';
cc.GAME_NAME = '墨丸';


// 环境枚举
cc.ENVIRONMENT = {
    debug: "debug",
    release: "release"
};
// 游戏运行环境
// cc.GAME_RUNING_ENVIRONMENT = cc.ENVIRONMENT.debug;
cc.GAME_RUNING_ENVIRONMENT = cc.ENVIRONMENT.release;

cc.DEF_KEY = 'sd49KylCxsHxK59z';//"E1oTc35YNLPiezjX"//sd49KylCxsHxK59z
cc.NET_KEY = {
    'hall':"",
    'game':""
};

cc.SIGN = {
    'hall':0,
    'game':0
};
cc.GAMEADRESS = "http://xxx.xxx.xxx.xxx/index.html"
if (cc.sys.os != cc.sys.OS_ANDROID && cc.sys.os != cc.sys.OS_IOS) {
    cc.PUBLISH = '20190829';
}


function readTextFile(filePath, callback){
    let newPath = filePath + '?r=' + Date.now();
    const xhrFile = new XMLHttpRequest();
    xhrFile.timeout = 5000;
    cc.log("newPath = ", newPath);
    xhrFile.open("GET", newPath, true);
    xhrFile.onload = function(){
        const allText = xhrFile.response;
        callback(allText);
    }
    xhrFile.send();
    xhrFile.ontimeout = function(){
        cc.log("连接超时了 ！！！");
        readTextFile('http://conf.wanshun.vip/config.txt', (res)=>{
            let data = JSON.parse(res);
            cc.log('最新打印data11 = ', data);
            cc.HALL_SERVER = [];
            cc.HALL_SERVER.push(data.main);
            cc.HALL_SERVER.push(data.sub);
            cc.log("cc.HALL_SERVER11 = ", cc.HALL_SERVER);
        });
    }
    xhrFile.onerror = function(){
        cc.log("连接错误了！！！");
        readTextFile('http://conf.wanshun.vip/config.txt', (res)=>{
            let data = JSON.parse(res);
            cc.log('最新打印data11 = ', data);
            cc.HALL_SERVER = [];
            cc.HALL_SERVER.push(data.main);
            cc.HALL_SERVER.push(data.sub);
            cc.log("cc.HALL_SERVER11 = ", cc.HALL_SERVER);
        });
    }
}

cc.GAMEKEFU = "http://xxx.xxx.xxx.xxx./index.html"; //这个功能已关闭
cc.GAMEDEFILEPATH = 'http://newf.wanshun.vip/config.txt'; //配置文件 

// cc.HALL_SERVER = ['ws://g1.eefey.com:19096','ws://g2.eefey.com:19096']
// cc.HALL_SERVER = ['ws://h2.eefey.com:19088','ws://h2.eefey.com:19088']
// cc.HALL_SERVER = ['ws://119.23.74.148:19088','ws://119.23.74.148:19088']

// cc.HALL_SERVER = ['ws://47.106.86.68:19088','ws://47.106.86.68:19088']
// cc.HALL_SERVER = ['ws://y5.wanshun2.vip:19088','ws://y5.wanshun2.vip:19088']
// cc.HALL_SERVER = ['ws://ns.wanshun2.vip:19088','ws://ns.wanshun2.vip:19088']

// cc.HALL_SERVER = ['ws://47.107.76.171:19088','ws://47.107.76.171:19088']
// cc.HALL_SERVER = ['ws://119.23.252.227:19088','ws://119.23.252.227:19088']

// cc.HALL_SERVER = ['ws://019035.zhongyundns.wrewre.qlyfhdns.com:19088','ws://019035.zhongyundns.wrewre.qlyfhdns.com:19088']

// cc.HALL_SERVER = ['ws://019035.zhongyundns.h1.wanshuns.com.qlyfhdns.com:19088','ws://019035.zhongyundns.h1.wanshuns.com.qlyfhdns.com:19088']

// cc.HALL_SERVER = ['ws://019035.zhongyundns.wrewre.qlyfhdns.com:19096','ws://019035.zhongyundns.wrewre.qlyfhdns.com:19096']

// cc.HALL_SERVER = ['ws://019035.zhongyundns.h1.wanshuns.com.qlyfhdns.com:19096','ws://019035.zhongyundns.h1.wanshuns.com.qlyfhdns.com:19096']

readTextFile(cc.GAMEDEFILEPATH, (res)=>{
    // cc.log('最新打印res = ', res);
    let data = JSON.parse(res);
    cc.log('最新打印1data11 = ', data);
    cc.HALL_SERVER = [];
    cc.HALL_SERVER.push(data.main);
    cc.HALL_SERVER.push(data.sub);
    cc.log("cc.HALL_SERVER11 = ", cc.HALL_SERVER);

    // cc.HALL_SERVER = ['ws://h1.wanshuns.com:19088','ws://g1.wanshuns.com:19088']
});

// if(cc.GAME_RUNING_ENVIRONMENT == cc.ENVIRONMENT.release){
//     cc.HALL_SERVER = [];
//     cc.HALL_SERVER = ['ws://120.78.172.160:19088','ws://120.78.172.160:19088']
//     // cc.log('cc.GAMEDEFILEPATH = ', cc.GAMEDEFILEPATH);
//     // cc.loader.load(cc.GAMEDEFILEPATH, function(err, res){
//     //     if(err){
//     //         cc.log("err = ", err);
//     //     }
//     //     let obj = JSON.parse(res);
//     //     console.log(obj,res,"++++++++")
//     //     // cc.log('obj = ', obj);
//     //     // cc.log('obj.main = ', obj.main);
//     //     //cc.HALL_SERVER.push(obj.main);
//     //     //cc.HALL_SERVER.push(obj.sub);
//     // });
//     // cc.HALL_SERVER = [];
//     //   cc.HALL_SERVER = ['ws://120.78.172.160:19088'];
//     //   cc.HALL_SERVER = ['ws://xxx.xxx.xxx.xxx:1988'];
// }
// else if(cc.GAME_RUNING_ENVIRONMENT == cc.ENVIRONMENT.debug){
//     cc.HALL_SERVER = [];
//     cc.HALL_SERVER = ['ws://120.78.172.160:19088','ws://120.78.172.160:19088']
//     // cc.HALL_SERVER = [];
//     // // cc.log('cc.GAMEDEFILEPATH = ', cc.GAMEDEFILEPATH);
//     // cc.loader.load(cc.GAMEDEFILEPATH, function(err, res){
//     //     if(err){
//     //         cc.log("err = ", err);
//     //     }
//     //     let obj = JSON.parse(res);
//     //     // cc.log('obj = ', obj);
//     //     // cc.log('obj.main = ', obj.main);
//     //     cc.HALL_SERVER.push(obj.main);
//     //     cc.HALL_SERVER.push(obj.sub);
//     // });
//     // cc.HALL_SERVER = ['ws://xxx.xxx.xxx.xxx:1988','ws://xxx.xxx.xxx.xxx:1988']
//     // cc.HALL_SERVER = ['ws://120.78.172.160:19088','ws://120.78.172.160:19088']
// }
// cc.HALL_SERVER = ["w"];