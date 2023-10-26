cc.Class({
    extends: cc.Component,

    properties: {

    },
    onLoad () {
       
    },

    start:function(){
        cc.vv.moreGame = this;
        this.create_action("start");
        this.androidListener();
    },
    back_action:function(list){
        var speed = 0.4;
        var offset_x = 250;
        list.opacity = 0;
        //list.scale = 0.8;

        list.x = list.x + offset_x;
        list.runAction(cc.sequence(
            cc.spawn(
                cc.fadeTo(speed,255),  
                cc.moveTo(speed,cc.v2(list.x - offset_x,list.y))
                //cc.scaleTo(speed,1,1)
            ),
            cc.callFunc(function () {
            },),
        ));
    },
    start_action(list){
        var self = this;
        var speed = 0.1;
        if(this.action_idx >= this.index_max){
            cc.vv.hall.move_in = false;
            return;
        }
        var offset_x = 300;
        var cur = cc.vv.utils.getChildByTag(list,this.action_idx++);
        cur.opacity = 0;
        
        cur.x = cur.x + offset_x;
        cur.runAction(cc.sequence(
            cc.spawn(
                cc.fadeTo(speed,255),  
                cc.moveTo(speed,cc.v2(cur.x - offset_x,cur.y))
            ),
            cc.callFunc(function () {
                self.start_action(list);
            },),
        ));
    },
    create_action(str){
        var i_tag = 0;
        var list = this.node.getChildByName("gameNode").getChildByName("view").getChildByName("list");
        var mhxy = list.getChildByName("mhxy");
        var zrzs = list.getChildByName("zrzs");
        var dtszj = list.getChildByName("dtszj");
        var frfx = list.getChildByName("frfx");
        var rxcq = list.getChildByName("rxcq");
        var zanwu1 = list.getChildByName("zanwu1");
        var zanwu2 = list.getChildByName("zanwu2");
        var zanwu3 = list.getChildByName("zanwu3");
        

        mhxy.myTag = i_tag++; 
        zrzs.myTag = i_tag++; 
        dtszj.myTag = i_tag++; 
        frfx.myTag = i_tag++; 
        rxcq.myTag = i_tag++; 
        zanwu1.myTag = i_tag++; 
        zanwu2.myTag = i_tag++; 
        zanwu3.myTag = i_tag++; 


        this.index_max = i_tag;
        if(str == "start"){
            this.action_idx = 0;
            for(var i = 0;i < this.index_max;i++){
                var cur_node = cc.vv.utils.getChildByTag(list,i);
                
                cur_node.on(cc.Node.EventType.TOUCH_START,function(data){
                    var light = data.currentTarget.getChildByName("light");
                    cc.vv.utils.light_action(light);
                });
                cur_node.opacity = 0;
            }
            this.start_action(list);
        }else if(str == "btn_back" && this.action_idx >= this.index_max){
            this.back_action(list);
        }

    },
    onBtnClicked:function(event,data){
        
        cc.vv.audioMgr.click();

        var self = this;
        this.showWebView();
        switch(event.target.name){
            case "mhxy":{//梦幻西游
                var url = "http://h5.yuu1.com/game/pc-go/102?mid=535&yid=0";
                this.openH5WebView(url);
            }
            break;
            case "zrzs":{//逐日战神
                var url = "http://h5.yuu1.com/game/pc-go/53?mid=535&yid=0";
                this.openH5WebView(url);
            }
            break;
            case "dtszj":{//大天使之剑
                var url = "http://h5.yuu1.com/game/pc-go/59?mid=535&yid=0";
                this.openH5WebView(url);
            }
            break;
            case "frfx":{//凡人飞仙
                var url = "http://h5.yuu1.com/game/pc-go/77?mid=535&yid=0";
                this.openH5WebView(url);
            }
            break;
            case "rxcq":{//热血传奇
                var url = "http://h5.yuu1.com/game/pc-go/103?mid=535&yid=0";
                this.openH5WebView(url);
            }
            break;
            default:{
                cc.vv.popMgr.tip("敬请期待！");
            }
        }
    },

    openH5WebView:function(url){
        if(cc.sys.os == cc.sys.OS_ANDROID){
            jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "addH5WebView", "(Ljava/lang/String;)V",url);
        }
        else if(cc.sys.os == cc.sys.OS_IOS){
            jsb.reflection.callStaticMethod("RootViewController", "addWebviewFunc:",url);
        }else{
            cc.vv.popMgr.tip("敬请期待！");
        }
    },

    closeH5WebView:function(url){
        if(cc.sys.os == cc.sys.OS_ANDROID){
            jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "removeH5WebView", "()V");
        }
        else if(cc.sys.os == cc.sys.OS_IOS){
            // jsb.reflection.callStaticMethod("VoiceSDK", "prepareRecord:",url);
        }
    },

     /**
     * 安卓手机 返回键监听
     */
    androidListener:function(){
        var self = this;
        //只做安卓的检测
        if(cc.sys.os != cc.sys.OS_ANDROID){
            return;
        }

        var keyboardListener = cc.EventListener.create({
            event: cc.EventListener.KEYBOARD,
            onKeyPressed:  function(keyCode, event){
                if(keyCode == cc.KEY.back){
                    self.hideWebView();
                }
            }
        });

        cc.eventManager.addListener(keyboardListener, this.node);
    },

    onCloseBtnClicked:function(event,data){
        var self = this;
        cc.vv.audioMgr.click();
        switch(event.target.name){
            case "close":{
                self.hideWebView();
            }
            break;
        }
    },

    showWebView:function(){
        cc.vv.audioMgr.playBGM("");
    },

    hideWebView:function(){
        cc.vv.audioMgr.playBGM("bgMain2");
        this.closeH5WebView();
    },
    onDestroy:function(){
        cc.vv.moreGame = null;
    }
    // update (dt) {},
});
