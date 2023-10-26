// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
        
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        var edit_password_code = this.node.getChildByName("edit_password_code");
        if(cc.sys.localStorage.getItem("is_me_password") != null && cc.sys.localStorage.getItem("is_me_password") != ""){
            edit_password_code.getComponent(cc.EditBox).string = cc.sys.localStorage.getItem("is_me_password");
            this.node.getChildByName("is_me_password").getComponent(cc.Toggle).isChecked = true;
        }else{
            this.node.getChildByName("is_me_password").getComponent(cc.Toggle).isChecked = false;
        }
        var edit_phone_code = this.node.getChildByName("edit_phone_code");
        if(cc.sys.localStorage.getItem("is_me_phone") != null && cc.sys.localStorage.getItem("is_me_phone") != ""){
            edit_phone_code.getComponent(cc.EditBox).string = cc.sys.localStorage.getItem("is_me_phone");
            this.node.getChildByName("is_me_phone").getComponent(cc.Toggle).isChecked = true;
        }else{
            this.node.getChildByName("is_me_phone").getComponent(cc.Toggle).isChecked = false;
        }
    },

    start () {
        this.waittime = 60
    },
    on_regist_ok(){
        let registNode = this.node.getChildByName("register")
        let accountEd = registNode.getChildByName("edit_phone_code1").getComponent(cc.EditBox).string
        let paswordEd = registNode.getChildByName("edit_password1").getComponent(cc.EditBox).string
        this.node.getChildByName("edit_password_code").getComponent(cc.EditBox).string = paswordEd
        this.node.getChildByName("edit_phone_code").getComponent(cc.EditBox).string = accountEd
        this.btn_hide_register()
        this.node.runAction(cc.sequence(
            cc.delayTime(0.1),
            cc.callFunc(()=>{
                this.btn_phone_login()
            })
        ))
    },
    btn_retrieve_psd:function(){
        this.node.getChildByName("zhaohui").active = true
        let zhaohuiNode = this.node.getChildByName("zhaohui")
        zhaohuiNode.getChildByName("edit_phone_code1").getComponent(cc.EditBox).string = ""
        zhaohuiNode.getChildByName("edit_code1").getComponent(cc.EditBox).string = ""
        zhaohuiNode.getChildByName("edit_password1").getComponent(cc.EditBox).string = ""
    },
    btn_retrieve_hid:function(){
        this.node.getChildByName("zhaohui").active = false
    },
    btn_getchange_code(){
        let registNode = this.node.getChildByName("zhaohui")
        let accountEd = registNode.getChildByName("edit_phone_code1").getComponent(cc.EditBox).string
        if(accountEd==""){
            cc.vv.popMgr.tip("请输入手机号！");
            return
        }
        let guest = {
            method:"blogin_sendcode_for_password",
            data:{
                account:accountEd,
            }
        };
        cc.vv.popMgr.tip("正在获取验证码！");
        this.waitNode = this.node.getChildByName("zhaohui").getChildByName("btnGetCode").getComponent(cc.Button).interactable = false
        cc.vv.net1.send(guest);
    },
    btn_sure_change(){
        let registNode = this.node.getChildByName("zhaohui")
        let accountEd = registNode.getChildByName("edit_phone_code1").getComponent(cc.EditBox).string
        let codeEdi = registNode.getChildByName("edit_code1").getComponent(cc.EditBox).string
        let paswordEd = registNode.getChildByName("edit_password1").getComponent(cc.EditBox).string
        var psd_md5 = cc.vv.utils.md5(paswordEd + "jiale")
        let pPattern = /^1[3|4|5|6|7|8|9][0-9]\d{4,8}$/;
        let is_true = pPattern.test(accountEd);
        if(accountEd==""){
            cc.vv.popMgr.tip("请输入手机号！");
            return
        }
        if(!is_true){
            cc.vv.popMgr.tip("请输入正确的手机号");
            return
        }
        if(codeEdi==""){
            cc.vv.popMgr.tip("请输入验证码！");
            return
        }
        if(psd_md5==""){
            cc.vv.popMgr.tip("请输入密码！");
            return
        }
        let pPattern1 = /^.*(?=.{6,16})(?=.*\d)(?=.*[a-zA-z]).*$/;
        let is_true1 = pPattern1.test(psd_md5);
        if(!is_true1){
            cc.vv.popMgr.tip("密码长度必须大于六且必须包含一个字母或一个字符");
            return
        }
        var platform = 1;
        if(cc.sys.os == cc.sys.OS_IOS){
            platform = 2;
        }
        let guest = {
            method:"blogin_find_password",
            data:{
                account:accountEd,
                code:codeEdi,
                // name:nickname,
                password:psd_md5,
                // version:cc.VERSION,
                // platform:platform
            }
        };
        cc.vv.popMgr.wait("正在找回密码！",function(){
            cc.vv.net1.send(guest);
        });
    },
    on_chenge_ok(){
        let registNode = this.node.getChildByName("zhaohui")
        registNode.getChildByName("btnGetCode").getComponent(cc.Button).interactable = true
        let accountEd = registNode.getChildByName("edit_phone_code1").getComponent(cc.EditBox).string
        let paswordEd = registNode.getChildByName("edit_password1").getComponent(cc.EditBox).string
        this.node.getChildByName("edit_password_code").getComponent(cc.EditBox).string = paswordEd
        this.node.getChildByName("edit_phone_code").getComponent(cc.EditBox).string = accountEd
        this.btn_retrieve_hid()
    },
    btn_show_register(){
        this.node.getChildByName("register").active = true
        let registNode = this.node.getChildByName("register")
        registNode.getChildByName("edit_phone_code1").getComponent(cc.EditBox).string = ""
        registNode.getChildByName("edit_code1").getComponent(cc.EditBox).string = ""
        registNode.getChildByName("edit_password1").getComponent(cc.EditBox).string = ""
        registNode.getChildByName("edit_password1").getComponent(cc.EditBox).string = ""
        registNode.getChildByName("edit_nickname").getComponent(cc.EditBox).string = ""
    },
    btn_get_code(){
        let registNode = this.node.getChildByName("register")
        let accountEd = registNode.getChildByName("edit_phone_code1").getComponent(cc.EditBox).string
        if(accountEd==""){
            cc.vv.popMgr.tip("请输入手机号！");
            return
        }
        let guest = {
            method:"register_code",
            data:{
                account:accountEd,
            }
        };
        this.waitNode = this.node.getChildByName("register").getChildByName("btnGetCode").getComponent(cc.Button).interactable = false
        this.waitNode = this.node.getChildByName("register").getChildByName("btnGetCode").getChildByName("send").active = false
        this.waitNode = this.node.getChildByName("register").getChildByName("btnGetCode").getChildByName("time").active = true
        this.waitNode = this.node.getChildByName("register").getChildByName("btnGetCode").getChildByName("time").getComponent(cc.Label).string = 60
        this.dotime()
        cc.vv.popMgr.tip("正在获取验证码！");
        cc.vv.net1.send(guest);
    },
    btn_to_regist(){
        let registNode = this.node.getChildByName("register")
        let accountEd = registNode.getChildByName("edit_phone_code1").getComponent(cc.EditBox).string
        let codeEdi = registNode.getChildByName("edit_code1").getComponent(cc.EditBox).string
        let paswordEd = registNode.getChildByName("edit_password1").getComponent(cc.EditBox).string
        let nickname = registNode.getChildByName("edit_nickname").getComponent(cc.EditBox).string
        var psd_md5 = cc.vv.utils.md5(paswordEd + "jiale")
        let pPattern = /^1[3|4|5|6|7|8|9][0-9]\d{4,8}$/;
        let is_true = pPattern.test(accountEd);
        if(accountEd==""){
            cc.vv.popMgr.tip("请输入手机号！");
            return
        }
        if(!is_true){
            cc.vv.popMgr.tip("请输入正确的手机号");
            return
        }
        if(codeEdi==""){
            cc.vv.popMgr.tip("请输入验证码！");
            return
        }
        if(psd_md5==""){
            cc.vv.popMgr.tip("请输入密码！");
            return
        }
        let pPattern1 = /^.*(?=.{6,16})(?=.*\d)(?=.*[a-zA-z]).*$/;
        let is_true1 = pPattern1.test(psd_md5);
        if(!is_true1){
            cc.vv.popMgr.tip("密码长度必须大于六且必须包含一个字母或一个字符");
            return
        }
        if(nickname==""){
            cc.vv.popMgr.tip("请输入昵称！");
            return
        }
        var platform = 1;
        if(cc.sys.os == cc.sys.OS_IOS){
            platform = 2;
        }
        let guest = {
            method:"register",
            data:{
                account:accountEd,
                code:codeEdi,
                name:nickname,
                password:psd_md5,
                version:cc.VERSION,
                platform:platform
            }
        };
        cc.vv.popMgr.wait("正在注册中！",function(){
            cc.vv.net1.send(guest);
        });
    },
    
    btn_hide_register(){
        this.node.getChildByName("register").active = false
    },
    btn_phone_login:function(){
        var account = cc.args["account"];
        if(account == null){
            account = cc.sys.localStorage.getItem("account");
        }
        
        var platform = 1;
        if(cc.sys.os == cc.sys.OS_IOS){
            platform = 2;
        }
        if(account == null){
            account = Date.now() + "";
            cc.sys.localStorage.setItem("account",account);
        }

        var edit_password_code = this.node.getChildByName("edit_password_code");
        var psd = edit_password_code.getComponent(cc.EditBox).string;

        var edit_phone_code = this.node.getChildByName("edit_phone_code");
        var phone_code = edit_phone_code.getComponent(cc.EditBox).string;
        var psd_md5 = cc.vv.utils.md5(psd + "jiale")
        var guest = {
            method:"login",
            data:{
                type:2,
                msg:{
                    openid:account
                },
                version:cc.VERSION,
                platform:platform,
                adcode:cc.vv.global.adcode,
                ip:cc.vv.global.ip,
                password:psd_md5,
                account:phone_code,
                address:cc.vv.global.address,
            }
        };
        var is_me_phone = this.node.getChildByName("is_me_phone").getComponent(cc.Toggle).isChecked;
        var is_me_password = this.node.getChildByName("is_me_password").getComponent(cc.Toggle).isChecked;
        if(is_me_phone){
            cc.sys.localStorage.setItem("is_me_phone",phone_code);
        }else{
            cc.sys.localStorage.setItem("is_me_phone","");
        }
        if(is_me_password){
            cc.sys.localStorage.setItem("is_me_password",psd);
        }else{
            cc.sys.localStorage.setItem("is_me_password","");
        }
        cc.vv.popMgr.wait("正在登录中",function(){
            cc.vv.net1.send(guest);
        });
    },
    dotime(){
        if(this.waittime>0){
            this.waittime--
            this.node.runAction(cc.sequence(
                cc.delayTime(1),
                cc.callFunc(()=>{
                    this.waitNode = this.node.getChildByName("register").getChildByName("btnGetCode").getChildByName("time").getComponent(cc.Label).string = this.waittime
                    this.dotime()
                })
            ))
        }else{
            this.waitNode = this.node.getChildByName("register").getChildByName("btnGetCode").getComponent(cc.Button).interactable = true
            this.waitNode = this.node.getChildByName("register").getChildByName("btnGetCode").getChildByName("send").active = true
            this.waitNode = this.node.getChildByName("register").getChildByName("btnGetCode").getChildByName("time").getComponent(cc.Label).string = 60
            this.waitNode = this.node.getChildByName("register").getChildByName("btnGetCode").getChildByName("time").active = false
        }
    }
    // update (dt) {},
});
