var myMD5 = require('MD5');

var bad_list = ['圈','零','一','二','三','四','五','六','七','八','九','Q','W','E','R','T','Y','U','I','O','P','A','S','D','F','G','H','J','K','L','Z','X','C','V','B','N','M','q','w','e','r','t','y','u','i','o','p','a','s','d','f','g','h','j','k','l','z','x','c','v','b','n','m','1','2','3','4','5','6','7','8','9','0','金花','上分','下分','元','块','角','毛','牛牛','近平','克强','泽东','小平','泽民','A片','A级','QQ客服','一中','一台','一黨','一党','三唑仑','三唑侖','三级片','上访','破解','专制','独立','中共','九评','共产党','人民','伦公','伦功','伦攻','安定','侦探','六合彩','六合采','六四','共狗','功法','动乱','包夜','博讯','反共','封锁','腐败','发伦','发沦','发论','发轮','口交','口技','迷香','台湾','台独','台獨','喷精','独立','回民','国军','国贼','中华','中国','大法','大紀元','大纪元','大纪园','大蓋帽','大陆','天安门','学潮','学生妹','学联','学自联','学运','宏法','密穴','專政','小穴','屠杀','幼交','庆红','廉政','异见','异议','办理','性息','抡功','护法','抽插','揭批书','新华','新唐人','新生网','新疆','独立','獨立','新闻','贷款','无界','无网界','明慧','暴亂','暴動','暴政','李洪志','极景','枪','刀','毒品','民主','民猪','民联','民进','民阵','水果','沦公','沦功','沦攻','法伦','法倫','法沦','法淪','法論','法论','法輪','法轮','法轮功','洪传','洪吟','洪志','海洛因','淪公','淪功','淪攻','甲基','疆独','疆独','藏独','疆獨','發倫','發淪','發論','發輪','百家乐','监听','监听王','真善忍','短信','破码器','加持','窃听','紅志','紅智','红志','红智','恐怖','统独','绵恒','网特','美国','群发','翻墙','联总','肉棍','手枪','自杀','蒙古','蒙汗药','蒙独','藏独','藏獨','血腥','裸聊','西藏','独立','獨立','論公','論功','論攻','论公','论攻','貓肉','两极法','赤化','赤匪','身份证','輪公','輪功','转法轮','轮公','轮大','轮奸','达赖','偷拍','退党','退党','透视','郑义','阴毛','阴茎','阴道','露乳','露毛','露点','静坐','高校','鸡巴','黄色','小电影','黑社會','龙虎豹','POS','POS机','POS機','POS机套现','赌博','财产','冰毒','成品冰','出售冰','bing毒买','bing毒卖','出售k粉','出售冰毒','摇头丸','搖頭丸','摇头wan','海洛因','K粉','麻古','大麻','美沙酮','氯胺酮','麻黄素','麻果','植物冰','化学冰','博彩','保安器材','私服','外挂','销售QQ','麻醉乙醚','麻醉枪','麻醉药','麻醉钢枪','麻醉','迷唤药','迷昏药','迷昏藥','迷藥','迷葯','迷药','洣药','洣葯','迷情药','迷情葯','春葯','春药','昏药','售葯','迷幻葯','发情药','迷魂藥','迷奸','通奸','兽交','冰火','强奸','强暴','强效失意药','偷窥','催情药','催情藥','土瓜根','证','针孔','监控','气枪','氣槍','氣枪','汽槍','猎槍','步枪','步槍','子彈','子弹','手枪','手槍','猎枪','枪支','軍用','器械','小口径','冲锋枪','狙击枪','警用','军用','警察','手拷','军用手','出售','左轮','54式','64','64式','77式','92式','仿真枪','电棍','指纹套','安乐死','氰化物','假比','假币','人民币','假钱','假幣','假鈔','假錢','时时彩','手狗','砖石','白粉','援交','小姐','桑拿','按摩','美女','保健','上門','上门','服務','兼職','美女','找小姐','楼凤','大学生','少妇','伴游','包夜','全套','兼职','艳舞','兼职','出台','模特','发票','醱票','开发票','開發票','發票','办証','办证','空白证','答案','考研','职称','网赚','代考','代攷','代办','代開','代开','代发','代聊','论文','刻章','证件','文凭','六合彩','毕业证','文凭','枪手','高仿','车牌','军牌','套牌','走私','套牌','假证','车牌','成人','高清','富婆','鸭子','小三','打手','报仇','复仇','千术','牌技','佳人','偷電','奇迹','外挂','私服','赛马会','烫图烫钻','开户'];
//阿拉伯数字不屏蔽
var bad_list_2 = ['炸金花','金花','上分','下分','元','块','角','毛','牛牛','近平','克强','泽东','小平','泽民','A片','A级','QQ客服','一中','一台','一黨','一党','三唑仑','三唑侖','三级片','上访','破解','专制','独立','中共','九评','共产党','人民','伦公','伦功','伦攻','安定','侦探','六合彩','六合采','六四','共狗','功法','动乱','包夜','博讯','反共','封锁','腐败','发伦','发沦','发论','发轮','口交','口技','迷香','台湾','台独','台獨','喷精','独立','回民','国军','国贼','中华','中国','大法','大紀元','大纪元','大纪园','大蓋帽','大陆','天安门','学潮','学生妹','学联','学自联','学运','宏法','密穴','專政','小穴','屠杀','幼交','庆红','廉政','异见','异议','办理','性息','抡功','护法','抽插','揭批书','新华','新唐人','新生网','新疆','独立','獨立','新闻','贷款','无界','无网界','明慧','暴亂','暴動','暴政','李洪志','极景','枪','刀','毒品','民主','民猪','民联','民进','民阵','水果','沦公','沦功','沦攻','法伦','法倫','法沦','法淪','法論','法论','法輪','法轮','法轮功','洪传','洪吟','洪志','海洛因','淪公','淪功','淪攻','甲基','疆独','疆独','藏独','疆獨','發倫','發淪','發論','發輪','百家乐','监听','监听王','真善忍','短信','破码器','加持','窃听','紅志','紅智','红志','红智','恐怖','统独','绵恒','网特','美国','群发','翻墙','联总','肉棍','手枪','自杀','蒙古','蒙汗药','蒙独','藏独','藏獨','血腥','裸聊','西藏','独立','獨立','論公','論功','論攻','论公','论攻','貓肉','两极法','赤化','赤匪','身份证','輪公','輪功','转法轮','轮公','轮大','轮奸','达赖','偷拍','退党','退党','透视','郑义','阴毛','阴茎','阴道','露乳','露毛','露点','静坐','高校','鸡巴','黄色','小电影','黑社會','龙虎豹','POS','POS机','POS機','POS机套现','赌博','财产','冰毒','成品冰','出售冰','bing毒买','bing毒卖','出售k粉','出售冰毒','摇头丸','搖頭丸','摇头wan','海洛因','K粉','麻古','大麻','美沙酮','氯胺酮','麻黄素','麻果','植物冰','化学冰','博彩','保安器材','私服','外挂','销售QQ','麻醉乙醚','麻醉枪','麻醉药','麻醉钢枪','麻醉','迷唤药','迷昏药','迷昏藥','迷藥','迷葯','迷药','洣药','洣葯','迷情药','迷情葯','春葯','春药','昏药','售葯','迷幻葯','发情药','迷魂藥','迷奸','通奸','兽交','冰火','强奸','强暴','强效失意药','偷窥','催情药','催情藥','土瓜根','证','针孔','监控','气枪','氣槍','氣枪','汽槍','猎槍','步枪','步槍','子彈','子弹','手枪','手槍','猎枪','枪支','軍用','器械','小口径','冲锋枪','狙击枪','警用','军用','警察','手拷','军用手','出售','左轮','54式','64','64式','77式','92式','仿真枪','电棍','指纹套','安乐死','氰化物','假比','假币','人民币','假钱','假幣','假鈔','假錢','时时彩','手狗','砖石','白粉','援交','小姐','桑拿','按摩','美女','保健','上門','上门','服務','兼職','美女','找小姐','楼凤','大学生','少妇','伴游','包夜','全套','兼职','艳舞','兼职','出台','模特','发票','醱票','开发票','開發票','發票','办証','办证','空白证','答案','考研','职称','网赚','代考','代攷','代办','代開','代开','代发','代聊','论文','刻章','证件','文凭','六合彩','毕业证','文凭','枪手','高仿','车牌','军牌','套牌','走私','套牌','假证','车牌','成人','高清','富婆','鸭子','小三','打手','报仇','复仇','千术','牌技','佳人','偷電','奇迹','外挂','私服','赛马会','烫图烫钻','开户'];
// 转码表
var table = [
    'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H',
    'I', 'J', 'K', 'L', 'M', 'N', 'O' ,'P',
    'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X',
    'Y', 'Z', 'a', 'b', 'c', 'd', 'e', 'f',
    'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n',
    'o', 'p', 'q', 'r', 's', 't', 'u', 'v',
    'w', 'x', 'y', 'z', '0', '1', '2', '3',
    '4', '5', '6', '7', '8', '9', '+', '/'
]
cc.Class({
    extends: cc.Component,

    properties: {
    },

    /**
     * 是否包含屏蔽关键字
     */
    testBad:function(str){
        var patt = new RegExp(bad_list.join('|'),'img');
        var result = patt.test(str);
        return result;
    },
    // testBad2:function(str){
    //     var patt = new RegExp(bad_list_2.join('|'),'img');
    //     var result = patt.test(str);
    //     return result;
    // },

    testBad2:function(str){
        for(var i = 0; i < bad_list_2.length; i++){
            var count = 0;
            for(var j = 0; j < bad_list_2[i].length; j++){
                for(var k = 0; k < str.length; k++){
                    if(str[k] == bad_list_2[i][j]){
                        count++;
                        break;
                    }
                }
            }
            if(count >= bad_list_2[i].length){
                return true;
            }
        }
        return false;
    },

    getDeviceType(){
        let platform = 0;
        if (cc.sys.isBrowser) {
            platform = 3;
        }
        switch(cc.sys.os){
            case cc.sys.OS_ANDROID: platform = 2 ; break;
            case cc.sys.OS_IOS: platform = 1 ; break;
        }

        return platform;
    },

    addClickEvent:function(node,target,component,handler){
        cc.vv.log3.debug(component + ":" + handler);
        var eventHandler = new cc.Component.EventHandler();
        eventHandler.target = target;
        eventHandler.component = component;
        eventHandler.handler = handler;

        var clickEvents = node.getComponent(cc.Button).clickEvents;
        clickEvents.push(eventHandler);
    },
    
    addSlideEvent:function(node,target,component,handler){
        var eventHandler = new cc.Component.EventHandler();
        eventHandler.target = target;
        eventHandler.component = component;
        eventHandler.handler = handler;

        var slideEvents = node.getComponent(cc.Slider).slideEvents;
        slideEvents.push(eventHandler);
    },

    /**
     * 从Group中拿到选中项
     */
    toggleChecked:function(node){
        if(node == null)return;
        for(var i = 0; i < node.children.length; ++i){
            var toggle =  node.children[i].getComponent(cc.Toggle);
            if(toggle && toggle.isChecked){
                return node.children[i].name;
            }
        }
    },

        /**
     * 从Group中拿到选中项
     */
    toggleCheckedNode:function(node){
        if(node == null)return;
        for(var i = 0; i < node.children.length; ++i){
            var toggle =  node.children[i].getComponent(cc.Toggle);
            if(toggle && toggle.isChecked){
                return node.children[i];
            }
        }
    },

    /**
     * 从Group中拿到选中项
     */
    setToggleChecked:function(node,name){
        if(node == null)return;
        for(var i = 0; i < node.children.length; ++i){
            var toggle =  node.children[i].getComponent(cc.Toggle);
            if(toggle){
                toggle.isChecked = node.children[i].name == name;
            }
        }
    },

    
      /**
     * 从Group中拿到选中项
     */
    setToggleChecked2:function(node,value,checked){
        if(node == null)return;
        for(var i = 0; i < node.children.length; ++i){
            var toggle =  node.children[i].getComponent(cc.Toggle);
            if(toggle){
                toggle.isChecked = value == checked;
            }
        }
    },

        /**
     * 从Group中拿到选中项
     */
    setToggleChecked3:function(node,name){
        if(node == null)return;
        for(var i = 0; i < node.children.length; ++i){
            var toggle =  node.children[i].getComponent(cc.Toggle);
            if(toggle && node.children[i].name == name){
                toggle.isChecked = true;
            }
        }
    },

       /**
     * 从Group中拿到选中项
     */
    setToggleChecked4:function(node,name,isChecked){
        if(node == null)return;
        for(var i = 0; i < node.children.length; ++i){
            var toggle =  node.children[i].getComponent(cc.Toggle);
            if(toggle && node.children[i].name == name){
                toggle.isChecked = isChecked;
            }
        }
    },
  
    popRemove:function(node){
        var mask;
        mask = node.getChildByName("bg_shadow");
        if(mask == null){
            mask = node.getChildByName("mask");
        }
        if(mask == null){
            mask = node.getChildByName("Mask");
        }if(mask == null){
            mask = node.getChildByName("btn_back");
        }
        
        if(mask != null){
            mask.y = 0;
            mask.runAction(cc.sequence(
                cc.moveTo(0.3,cc.v2(0,-200)),
                cc.callFunc(function (mask) {
                },mask),
            ));
        }
        node.opacity = 255;
        node.y = 0;
        node.runAction(cc.sequence(
            cc.spawn(
                cc.moveTo(0.3,cc.v2(0,200)),
                cc.fadeTo(0.3,50),  
            ),
            cc.callFunc(function (node) {
                node.destroy();
            },node),
        ));
    },
    //渐出弹出框 但不删除淡出 只隐藏
    btn_node_back:function(node){
        var mask;
        mask = node.getChildByName("bg_shadow");
        if(mask == null){
            mask = node.getChildByName("mask");
        }
        if(mask == null){
            mask = node.getChildByName("Mask");
        }if(mask == null){
            mask = node.getChildByName("btn_back");
        }
        
        if(mask != null){
            mask.y = 0;
            mask.runAction(cc.sequence(
                cc.moveTo(0.3,cc.v2(0,-200)),
                cc.callFunc(function (mask) {
                },mask),
            ));
        }
        node.opacity = 255;
        node.y = 0;
        node.runAction(cc.sequence(
            cc.spawn(
                cc.moveTo(0.3,cc.v2(0,200)),
                cc.fadeTo(0.3,50),  
            ),
            cc.callFunc(function (node) {
                node.active = false;
            },node),
        ));
    },
    //弹出对话框
    popPanel:function(node){
        if(node == null)return;
        node.active = true;
        var mask;
        mask = node.getChildByName("bg_shadow");
        if(mask == null){
            mask = node.getChildByName("mask");
        }
        if(mask == null){
            mask = node.getChildByName("Mask");
        }
        if(mask == null){
            mask = node.getChildByName("btn_back");
        }
        if(mask != null){
            mask.y = -100;
            mask.runAction(cc.sequence(
                cc.moveTo(0.2,cc.v2(0,30)),
                cc.callFunc(function (mask) {
                    mask.runAction(cc.sequence(
                        cc.moveTo(0.1,cc.v2(0,0)),
                     
                        cc.callFunc(function (mask) {
                        },mask),
                    ));
                },mask),
            ));
        }
        node.opacity = 0;
        node.y = 100;
        node.runAction(cc.sequence(
            cc.spawn(
                cc.moveTo(0.2,cc.v2(0,-30)),
                cc.fadeTo(0.2,255),  
            ),
            cc.moveTo(0.1,cc.v2(0,0)),
            cc.callFunc(function (node) {
                if(cc.vv.hall){
                    cc.vv.hall.move_in = false;
                }
            },node),
            // cc.callFunc(function (node) {
            //     node.runAction(cc.sequence(
            //         cc.moveTo(0.1,cc.v2(0,0)),
            //         cc.callFunc(function (node) {
            //             if(cc.vv.hall){
            //                 cc.vv.hall.move_in = false;
            //             }
            //         },node),
            //     ));
            // },node),
        ));
    },
    //闪光效果。需要一个图片
    light_action:function(node){
        node.active = true;
        node.opacity = 180;
        node.scale = 1;
        node.stopAllActions();
        node.runAction(cc.sequence(
            cc.spawn(
                cc.fadeTo(0.3,0),  
                cc.scaleTo(0.3,1.25,1.25)
            ),
            cc.callFunc(function () {
                node.active = false;
            },this),
        ));
    },
    //加载图片  
    loadimg:function(name,func){
        //加载默认头像
        cc.loader.loadRes(name,function( error, tex )
        {
            var spriteFrame = new cc.SpriteFrame(tex, cc.Rect(0, 0, tex.width, tex.height));
            func(spriteFrame);
        });
    },
    loadUrlImg(imgurl,cb){
        if(imgurl && !cc.sys.isNative){
            return;
        };  

        //本地图片
        var dirpath =  jsb.fileUtils.getWritablePath() + 'img/';
        var key = cc.vv.utils.md5(imgurl);
        var filepath = dirpath + key + '.png';
        

        //加载到本地
        if( jsb.fileUtils.isFileExist(filepath) ){
            if(cb){
                cb(filepath)
            }
            return;
        }

        //保存到本地
        var saveFile = function(data){
            if( typeof data !== 'undefined' ){

                if(!jsb.fileUtils.isDirectoryExist(dirpath) ){
                    jsb.fileUtils.createDirectory(dirpath);
                }
    
                if( jsb.fileUtils.writeDataToFile(  new Uint8Array(data) , filepath) ){
                    if(cb){
                        cb(filepath)
                    }
                    return;
                }
            }
        };

        //远程获取，保存到本地
        var xhr = cc.loader.getXMLHttpRequest();
        xhr.responseType = 'arraybuffer';
        xhr.onreadystatechange = function() {
            if(xhr.readyState === 4 && (xhr.status >= 200 && xhr.status < 300)){
                saveFile(xhr.response);
            }
        };
        xhr.open("GET",imgurl, true);
        xhr.send();
    },
    //赢三张扑克值
    getYSZPokerSpriteFrame:function(atlas,data){

        var PokerFrameName = '255';
        if(data != 255){
            var colorList = ["D","C","H","S","A","B"];
            var color = parseInt(data/16);
            var num = data%16;
    
            if(num == 1){
                num = 14;
            }
            
            PokerFrameName = colorList[color]+num;
        }

        return atlas.getSpriteFrame(PokerFrameName);             
    },
    getPokerSpriteFrame:function(atlas,data){

        var PokerFrameName = '255';

        if(data != 255){
            var colorList = ["D","C","H","S","A","B"];
            var color = parseInt(data/16);
            var num = data%16;
    
            if(num == 1){
                num = 14;
            }
            
            PokerFrameName = colorList[color]+num;
        }
        if(data == 96){
            PokerFrameName = "96";
        }  
        return atlas.getSpriteFrame(PokerFrameName);             
    },

        /**
     * 加密（需要先加载lib/aes/aes.min.js文件）
     * @param word
     * @returns {*}
     */
    encrypt:function (data,key){
        key = CryptoJS.enc.Utf8.parse(key);
        var encrypted = CryptoJS.AES.encrypt(data, key, {
            iv: key,
            mode: CryptoJS.mode.CBC
        });
        return encrypted.toString();
    },

    /**
     * 解密
     * @param word
     * @returns {*}
     */
    decrypt:function(data,key){
        key = CryptoJS.enc.Utf8.parse(key);
        var encrypted = CryptoJS.AES.decrypt(data, key, {
            iv: key,
            mode: CryptoJS.mode.CBC
        });  
        return CryptoJS.enc.Utf8.stringify(encrypted).toString();  
    },

    md5:function(text){
        return cc.md5Encode(text).toLowerCase();
    },

    checkInput:function (str) {
        var pattern = /^[\w\u4e00-\u9fa5]+$/gi;
        if(!pattern.test(str))
        {
            return false;
        }
        return true;
    },

    isEmojiCharacter:function(substring){  
        for  (  var  i = 0; i <substring.length; i ++){  
            var  hs = substring.charCodeAt(i);
            if  (0xd800 <= hs && hs <= 0xdbff){  
                if  (substring.length> 1){  
                    var  ls = substring.charCodeAt(i + 1);  
                    var  uc =((hs - 0xd800)* 0x400)+(ls - 0xdc00)+ 0x10000;  
                    if  (0x1d000 <= uc && uc <= 0x1f77f){  
                        return true;   
                    }  
                }  
            }  else if(substring.length> 1){   
                var  ls = substring.charCodeAt(i + 1);  
                if  (ls == 0x20e3){  
                    return true ;   
                }  
            }  else  {  
                if (0x2100 <= hs && hs <= 0x27ff){  
                    return true ;   
                }  else if  (0x2B05 <= hs && hs <= 0x2b07){   
                    return true ;   
                }  else if  (0x2934 <= hs && hs <= 0x2935){   
                    return true ;   
                }  else if  (0x3297 <= hs && hs <= 0x3299){   
                    return true ;   
                }  else if  (hs == 0xa9 || hs == 0xae || hs == 0x303d || hs == 0x3030   
                        || hs == 0x2b55 || hs == 0x2b1c || hs == 0x2b1b  
                        || hs == 0x2b50){  
                    return true ;   
                }  
            }  
        }  
    },

    checkUserName:function(str){
        var strArr = str.split("");
        var result = "";
        var totalLen = 0;

        for(var idx = 0; idx < strArr.length; idx ++) {
            // 超出长度,退出程序
            if(totalLen >= 16) break;
            var val = strArr[idx];
            // 英文,增加长度1
            if(/[a-zA-Z]/.test(val)) {
                totalLen = 1 + (+totalLen);
                result += val;
            }
            // 中文,增加长度2
            else if(/[\u4e00-\u9fa5]/.test(val)) {
                totalLen = 2 + (+totalLen);
                result += val;
            }
            // 遇到代理字符,将其转换为 "口", 不增加长度
            else if(/[\ud800-\udfff]/.test(val)) {
                // 代理对长度为2,
                if(/[\ud800-\udfff]/.test(strArr[idx + 1])) {
                    // 跳过下一个
                    idx ++;
                }
                // 将代理对替换为 "口"
                result += "口";
            }
        }
        return result;
    },
    
    numFormat:function(str){
        var num = parseFloat(str);
        return num.toFixed(1);
    },
    //转Int
    numInt:function(str){
        var num = parseInt(str);
        return num;
    },
    
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },

    //深层拷贝
    deepCopy:function(obj){
         if(typeof obj !== "object"){ return ;}
         var newObj;
         //保留对象的constructor属性
         if(obj.constructor === Array){
            newObj = [];
         } else {
             newObj = {};
             newObj.constructor = obj.constructor;
         }
         for(var prop in obj){
         if(typeof obj[prop] === 'object'){
              if(obj[prop].constructor === RegExp ||obj[prop].constructor === Date){
                    newObj[prop] = obj[prop];
              } else {
                //递归
                newObj[prop] = cc.vv.utils.deepCopy(obj[prop]);
              }
         } else {
                newObj[prop] = obj[prop];
            }
         }
            return newObj;
    },
    //截取过长字符串 用...替代
    cutString:function(str, len) {
        if(!str) str = "";

        if(!len)
            len = 9;

        if(str.length*2 <= len) {
            return str;
        }

        let strlen = 0;
        let s = "";

        for(let i = 0;i < str.length; i++) {
            s = s + str.charAt(i);
            if (str.charCodeAt(i) > 128) {
                strlen = strlen + 2;
                if(strlen >= len){
                    return s.substring(0,s.length-1) + "...";
                }
            } else {
                strlen = strlen + 1;
                if(strlen >= len){
                    return s.substring(0,s.length-2) + "...";
                }
            }
        }
        return s;
    },
    /**
     * 通过标签获取节点的子节点
     * @param {*} node 
     * @param {*} tag
     */
    getChildByTag(node,tag) {
        if(!node){
            return null;
        }
        var children = node.children;
        if (children !== null) {
            for (var i = 0; i < children.length; i++) {
                var node = children[i];
                if (node && node.myTag === tag)
                    return node;
            }
        }
        return null;
    },
    
    UTF16ToUTF8 : function(str) {
        var res = [], len = str.length;
        for (var i = 0; i < len; i++) {
            var code = str.charCodeAt(i);
            if (code > 0x0000 && code <= 0x007F) {
                // 单字节，这里并不考虑0x0000，因为它是空字节
                // U+00000000 – U+0000007F     0xxxxxxx
                res.push(str.charAt(i));
            } else if (code >= 0x0080 && code <= 0x07FF) {
                // 双字节
                // U+00000080 – U+000007FF     110xxxxx 10xxxxxx
                // 110xxxxx
                var byte1 = 0xC0 | ((code >> 6) & 0x1F);
                // 10xxxxxx
                var byte2 = 0x80 | (code & 0x3F);
                res.push(
                    String.fromCharCode(byte1), 
                    String.fromCharCode(byte2)
                );
            } else if (code >= 0x0800 && code <= 0xFFFF) {
                // 三字节
                // U+00000800 – U+0000FFFF     1110xxxx 10xxxxxx 10xxxxxx
                // 1110xxxx
                var byte1 = 0xE0 | ((code >> 12) & 0x0F);
                // 10xxxxxx
                var byte2 = 0x80 | ((code >> 6) & 0x3F);
                // 10xxxxxx
                var byte3 = 0x80 | (code & 0x3F);
                res.push(
                    String.fromCharCode(byte1), 
                    String.fromCharCode(byte2), 
                    String.fromCharCode(byte3)
                );
            } else if (code >= 0x00010000 && code <= 0x001FFFFF) {
                // 四字节
                // U+00010000 – U+001FFFFF     11110xxx 10xxxxxx 10xxxxxx 10xxxxxx
            } else if (code >= 0x00200000 && code <= 0x03FFFFFF) {
                // 五字节
                // U+00200000 – U+03FFFFFF     111110xx 10xxxxxx 10xxxxxx 10xxxxxx 10xxxxxx
            } else /** if (code >= 0x04000000 && code <= 0x7FFFFFFF)*/ {
                // 六字节
                // U+04000000 – U+7FFFFFFF     1111110x 10xxxxxx 10xxxxxx 10xxxxxx 10xxxxxx 10xxxxxx
            }
        }

        return res.join('');
    },
    UTF8ToUTF16 : function(str) {
        var res = [], len = str.length;
        var i = 0;
        for (var i = 0; i < len; i++) {
            var code = str.charCodeAt(i);
            // 对第一个字节进行判断
            if (((code >> 7) & 0xFF) == 0x0) {
                // 单字节
                // 0xxxxxxx
                res.push(str.charAt(i));
            } else if (((code >> 5) & 0xFF) == 0x6) {
                // 双字节
                // 110xxxxx 10xxxxxx
                var code2 = str.charCodeAt(++i);
                var byte1 = (code & 0x1F) << 6;
                var byte2 = code2 & 0x3F;
                var utf16 = byte1 | byte2;
                res.push(Sting.fromCharCode(utf16));
            } else if (((code >> 4) & 0xFF) == 0xE) {
                // 三字节
                // 1110xxxx 10xxxxxx 10xxxxxx
                var code2 = str.charCodeAt(++i);
                var code3 = str.charCodeAt(++i);
                var byte1 = (code << 4) | ((code2 >> 2) & 0x0F);
                var byte2 = ((code2 & 0x03) << 6) | (code3 & 0x3F);
                var utf16 = ((byte1 & 0x00FF) << 8) | byte2
                res.push(String.fromCharCode(utf16));
            } else if (((code >> 3) & 0xFF) == 0x1E) {
                // 四字节
                // 11110xxx 10xxxxxx 10xxxxxx 10xxxxxx
            } else if (((code >> 2) & 0xFF) == 0x3E) {
                // 五字节
                // 111110xx 10xxxxxx 10xxxxxx 10xxxxxx 10xxxxxx
            } else /** if (((code >> 1) & 0xFF) == 0x7E)*/ {
                // 六字节
                // 1111110x 10xxxxxx 10xxxxxx 10xxxxxx 10xxxxxx 10xxxxxx
            }
        }

        return res.join('');
    },
    encode : function(str) {
        if (!str) {
            return '';
        }
        var utf8    = this.UTF16ToUTF8(str); // 转成UTF8
        var i = 0; // 遍历索引
        var len = utf8.length;
        var res = [];
        while (i < len) {
            var c1 = utf8.charCodeAt(i++) & 0xFF;
            res.push(table[c1 >> 2]);
            // 需要补2个=
            if (i == len) {
                res.push(table[(c1 & 0x3) << 4]);
                res.push('==');
                break;
            }
            var c2 = utf8.charCodeAt(i++);
            // 需要补1个=
            if (i == len) {
                res.push(table[((c1 & 0x3) << 4) | ((c2 >> 4) & 0x0F)]);
                res.push(table[(c2 & 0x0F) << 2]);
                res.push('=');
                break;
            }
            var c3 = utf8.charCodeAt(i++);
            res.push(table[((c1 & 0x3) << 4) | ((c2 >> 4) & 0x0F)]);
            res.push(table[((c2 & 0x0F) << 2) | ((c3 & 0xC0) >> 6)]);
            res.push(table[c3 & 0x3F]);
        }

        return res.join('');
    },
    decode : function(str) {
        if (!str) {
            return '';
        }

        var len = str.length;
        var i   = 0;
        var res = [];

        while (i < len) {
            code1 = table.indexOf(str.charAt(i++));
            code2 = table.indexOf(str.charAt(i++));
            code3 = table.indexOf(str.charAt(i++));
            code4 = table.indexOf(str.charAt(i++));

            c1 = (code1 << 2) | (code2 >> 4);
            res.push(String.fromCharCode(c1));

            if (code3 != -1) {
                c2 = ((code2 & 0xF) << 4) | (code3 >> 2);
                res.push(String.fromCharCode(c2));
            }
            if (code4 != -1) {
                c3 = ((code3 & 0x3) << 6) | code4;
                res.push(String.fromCharCode(c3));
            }

        }
        return this.UTF8ToUTF16(res.join(''));
    }
});
