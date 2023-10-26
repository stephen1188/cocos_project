
cc.Class({
    extends: cc.Component,

    properties: {
        btnYingxiao:cc.Toggle,
        btnYingyue:cc.Toggle,
        btnShake:cc.Toggle,
        btnCuoPai:cc.Toggle,
        btnSingleTouch: cc.Toggle,
        pbYingyue:cc.Slider,
        pbYingxiao:cc.Slider,
        btnExit:cc.Node,
        btnChange:cc.Node,
        bgToggles:cc.Node,
        setToggles:cc.Node,
        panlens:cc.Node,
        tip:cc.Node,
    },

    onLoad:function()
    {
        this.initdestbg();
        this.canChangeBg();

        for(var i = 0; i < this.bgToggles.childrenCount; ++i){
            var toggle = this.bgToggles.children[i];
            toggle.myTag = i;
            toggle.on('toggle',function(event){ 
                var name = event.target.name; //event.detail.target.name
                var scene = cc.director.getScene();
                if(name != "tablecloth_moren"){
                    cc.sys.localStorage.setItem(scene.name + 'usedbg',name);
                }else{
                    cc.sys.localStorage.removeItem(scene.name + 'usedbg');
                }
                
                if(scene.name !== 'hall')
                {
                    var canvas = cc.director.getScene().getChildByName('Canvas');
                    canvas.emit('changebg',{bg:name});
                }
            });
        }
    },

    start () {
        this.pbYingxiao.progress = cc.vv.audioMgr.sfxVolume;
        this.pbYingyue.progress = cc.vv.audioMgr.bgmVolume; 

        cc.vv.utils.addSlideEvent(this.panlens.getChildByName("voice_Toggle").getChildByName("slider_yingxiao"),this.node,"Setting","onSlided");
        cc.vv.utils.addSlideEvent(this.panlens.getChildByName("voice_Toggle").getChildByName("slider_yingyue"),this.node,"Setting","onSlided");

        this.reflash();
        
        var type = this.setToggles.children[0].name;
        cc.vv.utils.setToggleChecked(this.setToggles,type);
        
        this.onBtnleiXingXuanZe(null,type);
    },

    onBtnleiXingXuanZe:function(event,detail){
        if(event != null){
            cc.vv.audioMgr.click();
        }
        if(detail == null)detail = event.target.name;
        for(var i = 0; i < this.panlens.children.length; ++i){
            var name = this.panlens.children[i].name;
            this.panlens.children[i].active = (detail == name);
        }
    },

    //滑动
    onSlided:function(slider){
        if(slider.node.name == "slider_yingxiao"){
            cc.vv.audioMgr.setSFXVolume(slider.progress);
        }
        else if(slider.node.name == "slider_yingyue"){
            cc.vv.audioMgr.setBGMVolume(slider.progress);
        }

         this.reflash();
    },

    hideButton:function(){
        this.btnChange.active = false;
        this.btnExit.active = false;
    },

    reflash:function(){ 

        this.btnYingyue.isChecked = (cc.vv.audioMgr.bgmVolume>0);
        this.btnYingxiao.isChecked = (cc.vv.audioMgr.sfxVolume>0);

        var width1 = 480 * cc.vv.audioMgr.sfxVolume;
        this.pbYingxiao.node.getChildByName("progress").width = width1;  
        
        var width2 = 480 * cc.vv.audioMgr.bgmVolume;
        this.pbYingyue.node.getChildByName("progress").width = width2; 
        if(cc.sys.localStorage.getItem("shakeset") == "false"){
            this.btnShake.isChecked = false;
        }else{
            this.btnShake.isChecked = true;
        }

        if(cc.sys.localStorage.getItem("cuopaiset") == "true"){
            this.btnCuoPai.isChecked = true;
        }else{
            this.btnCuoPai.isChecked = false;
        }

        if(cc.sys.localStorage.getItem("singletouchset") == "true"){
            this.btnSingleTouch.isChecked = true;
        }
        else{
            this.btnSingleTouch.isChecked = false;
        }
    },

    //设置变化
    yingyueChange:function(){

        if(this.btnYingyue.isChecked){
            var t = cc.sys.localStorage.getItem("bgmVolume");
            var v = parseFloat(t);
            if(v == 0)v = 0.5;
            cc.vv.audioMgr.setBGMVolume(v);
        }else{
            cc.sys.localStorage.setItem("bgmVolume",cc.vv.audioMgr.bgmVolume);
            cc.vv.audioMgr.setBGMVolume(0);
        }

        // if(this.btnYingxiao.isChecked){
        //     var t = cc.sys.localStorage.getItem("sfxVolume");
        //     var v = parseFloat(t);
        //     if(v == 0)v = 0.5;
        //     cc.vv.audioMgr.setSFXVolume(v);
        // }else{
        //     cc.sys.localStorage.setItem("sfxVolume",cc.vv.audioMgr.sfxVolume);
        //     cc.vv.audioMgr.setSFXVolume(0);
        // }

        // this.pbYingxiao.progress = cc.vv.audioMgr.sfxVolume;
        this.pbYingyue.progress = cc.vv.audioMgr.bgmVolume; 

        this.reflash();
    },

    yingxiaoChange:function(){
        if(this.btnYingxiao.isChecked){
            var t = cc.sys.localStorage.getItem("sfxVolume");
            var v = parseFloat(t);
            if(v == 0)v = 0.5;
            cc.vv.audioMgr.setSFXVolume(v);
        }else{
            cc.sys.localStorage.setItem("sfxVolume",cc.vv.audioMgr.sfxVolume);
            cc.vv.audioMgr.setSFXVolume(0);
        }

        this.pbYingxiao.progress = cc.vv.audioMgr.sfxVolume;
        this.reflash();
    },

   //震动设置
    shakeChange:function(){
        if(this.btnShake.isChecked){
            cc.sys.localStorage.setItem("shakeset",true);
            cc.vv.userMgr.is_shake = true;
        }else{
            cc.sys.localStorage.setItem("shakeset",false);
            cc.vv.userMgr.is_shake = false;
        }
    },
    
    //赢三张搓牌设置
    cuopaiChange:function(){
        if(this.btnCuoPai.isChecked){
            cc.vv.userMgr.is_cuopai = true;
            cc.sys.localStorage.setItem("cuopaiset",true);
        }else{
            cc.sys.localStorage.setItem("cuopaiset",false);
            cc.vv.userMgr.is_cuopai = false;
        }
    },

    // 出牌单击出牌
    singletouchChange: function(){
        let isSingtouch = this.btnSingleTouch.isChecked;
        cc.vv.userMgr.is_singletouch = isSingtouch;
        cc.sys.localStorage.setItem("singletouchset" , isSingtouch);
    },

    onDestroy:function(){
        cc.sys.localStorage.setItem("bgmVolume",cc.vv.audioMgr.bgmVolume);
        cc.sys.localStorage.setItem("sfxVolume",cc.vv.audioMgr.sfxVolume);
    },

    onBtnClicked:function(event){

        cc.vv.audioMgr.click();
        
        switch(event.target.name){
            case "btn_change":{
                cc.vv.net1.close();
                cc.vv.g3Plugin.logout();
                cc.sys.localStorage.setItem("auto_login",false);
                cc.director.loadScene("login");
            }
            break;
            case "btn_exit":{
                cc.game.end();
            }
            break;
            case "btn_fix":{
                cc.vv.popMgr.alert("此功能将重置游戏为初始状态，是否继续？",function(){
                    var storagePath = ((jsb.fileUtils ? jsb.fileUtils.getWritablePath() : '/') + 'remote-asset/');
                    var ret=jsb.fileUtils.removeDirectory(storagePath );
                    if(ret){
                        cc.vv.popMgr.alert("修复成功，请点击确定重新打开游戏",function(){
                            cc.vv.net1.close();
                            cc.vv.g3Plugin.logout();
                            cc.director.loadScene("splash");
                        });
                    }else{
                        cc.vv.popMgr.alert("修复失败，请直接下载最新版本安装，谢谢~",function(){
                        });
                    }
                },true);
            }
            break;
            case "btn_yingyue":{
                this.yingyueChange();
            }
            break;
            case "btn_yingxiao":{
                this.yingxiaoChange();
            }
            break;
            case "off_no":{
                this.shakeChange();
            }
            break;
            case "is_cuopai":{
                this.cuopaiChange();
            }
            break;
            case "is_singletouch": {
                this.singletouchChange();
            }
            break;
        }
    },

    initdestbg:function(){
        this.node.getChildByName("lblVersion").getComponent(cc.Label).string = cc.VERSION;
        var scene = cc.director.getScene();
        var usedbg = cc.sys.localStorage.getItem(scene.name + 'usedbg');
        if(usedbg == null){
            cc.vv.utils.setToggleChecked(this.bgToggles,'tablecloth_moren');
        }
        else{
           cc.vv.utils.setToggleChecked(this.bgToggles,usedbg);
        }
    },

    canChangeBg:function(){
        this.bgToggles.active = false;
        if(cc.vv.game){
            this.bgToggles.active = cc.vv.game.config.set_bg;
        }
    }
});
