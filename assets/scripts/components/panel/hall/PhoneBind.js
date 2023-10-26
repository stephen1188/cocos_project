cc.Class({
    extends: cc.Component,

    properties: {
        textPhone:cc.EditBox,
        textCode:cc.EditBox,
        lblTime:cc.Label,
        btnSend:cc.Button,
        sprSend:cc.Sprite,
    },

    onLoad:function()
    {
        this.init();
          //监听协议
        //倒计时
        // if(cc.vv.userMgr.sign_code_time !== 0){
        //     this.disbleSend();
        // }

    },

    disbleSend:function(){

        this.sprSend.node.active = false;
        this.lblTime.node.active = true;
        this.lblTime.string = cc.vv.userMgr.sign_code_time;      
        
        //创建一个定时器
        cc.director.getScheduler().schedule(this.updates, this, 1);
        this.btnSend.interactable = false;
    },
    start(){
        
    },
    init:function(){
        var node  = this.node;
        this.sprSend.node.active = true;
        this.lblTime.node.active = false;
        this.phone_type = 0;//0 账号绑定    1 更换手机号   2 修改密码
        this.send_type = 0;//验证修改密码还是 旧密码修改密码 0  旧 密码   1 验证码修改
        this.toggle = node.getChildByName("toggle");
        this.bind_phone = node.getChildByName("bind_phone");//账号绑定 层
        this.retrieve_psd = node.getChildByName("retrieve_psd");//更换手机号 层
        this.update_psd = node.getChildByName("update_psd");//修改吗密码 层
        this.btnGetCode = node.getChildByName("btnGetCode");
        this.phone_retrieve_user = node.getChildByName("phone_retrieve_user");
        var cur_scenc = cc.director.getScene().name;
        if(cur_scenc != "hall"){
            this.node.getChildByName("toggle").active = false;
            this.bind_phone.active = false;
            this.retrieve_psd.active = false;
            this.update_psd.active = true;
            this.phone_type = 2;
            this.btnGetCode.active = false;
        }
    },
    ableSend:function(){
        //update_password
        
        //this.lblTime.string = cc.vv.userMgr.sign_code_time;      
        
        //创建一个定时器
        cc.director.getScheduler().unschedule(this.updates);
        this.btnSend.interactable = true;
    },
    is_phonce_yz:function(type){
        var is_true = false;
        var pPattern;
        var edb_input_psd;
        var str;//密码
        var edb_phone_number;
        var phone_str;//手机号
        var edb_okinput_psd;
        var ok_phone_str;//确定密码
        var new_input_psd;
        var new_phone_str;//新密码
        if(type == 0){//账号绑定
            edb_input_psd = this.bind_phone.getChildByName("edb_input_psd");
            str = edb_input_psd.getComponent(cc.EditBox).string;;//密码
            edb_phone_number = this.bind_phone.getChildByName("edb_phone_number");
            phone_str = edb_phone_number.getComponent(cc.EditBox).string;//手机号
            edb_okinput_psd = this.bind_phone.getChildByName("edb_okinput_psd");
            ok_phone_str = edb_okinput_psd.getComponent(cc.EditBox).string;//确定密码
        }else if(type == 2){//密码找回
            // edb_input_psd = this.update_psd.getChildByName("edb_psd_code");
            // str = edb_input_psd.getComponent(cc.EditBox).string;//密码
            edb_phone_number = this.update_psd.getChildByName("edb_phone_number");
            phone_str = edb_phone_number.getComponent(cc.EditBox).string;//手机号
            edb_okinput_psd = this.update_psd.getChildByName("edb_okinput_psd");
            ok_phone_str = edb_okinput_psd.getComponent(cc.EditBox).string;//确定密码
            new_input_psd = this.update_psd.getChildByName("edb_input_psd");
            str = new_input_psd.getComponent(cc.EditBox).string;//新密码
        }else{
            return;
        }
        if(str == ""){
            if(type == 0)
                cc.vv.popMgr.tip("密码不能为空");
            else if(type == 2)
                cc.vv.popMgr.tip("新密码不能为空");
            return false;   
        }
        return true;
        // if(!is_true){
        //     pPattern =  /^[0-9]{1,8}$/;
        //     is_true = pPattern.test(str);
        //     if(is_true){
        //     if(type == 0)
        //         cc.vv.popMgr.tip("密码不能是9位以下纯数字");
        //     else if(type == 2)
        //         cc.vv.popMgr.tip("新密码不能是9位以下纯数字");
        //         return false;
        //     }else{
        //         is_true = true;
        //     }
        // }
        // if(!is_true){
        //     pPattern = /^.*(?=.{6,16})(?=.*\d)(?=.*[a-zA-z]).*$/;
        //     is_true = pPattern.test(str);
        //     if(!is_true){
        //     if(type == 0)
        //         cc.vv.popMgr.tip("密码长度必须大于六且必须包含一个字母或一个字符");
        //     else if(type == 2)
        //         cc.vv.popMgr.tip("新密码长度必须大于六且必须包含一个字母或一个字符");
        //         return false;
        //     }else{
        //         is_true = true;
        //     }
        // }
        // if(type == 2){
        //     if(new_phone_str == ""){
        //         cc.vv.popMgr.tip("新密码不能为空");
        //         return;
        //     }
        // }
        // if(str == phone_str){
        //     cc.vv.popMgr.tip("新密码不能和手机一样");
        //     return false;
        // }
   
        
    },
    is_phone_code:function(){
        var is_true = false;
        var pPattern;
        if(this.phone_type == 0){
            var edb_phone_number = this.bind_phone.getChildByName("edb_phone_number");
            var phone_str = edb_phone_number.getComponent(cc.EditBox).string;
            if(!is_true){
                pPattern = /^1[3|4|5|6|7|8|9][0-9]\d{4,8}$/;
                is_true = pPattern.test(phone_str);
                if(!is_true){
                    cc.vv.popMgr.tip("请输入正确的手机号");
                    return false;
                }
            }
        }else if(this.phone_type == 1){
            var edb_phone_number = this.retrieve_psd.getChildByName("edb_phone_number");
            var phone_str = edb_phone_number.getComponent(cc.EditBox).string;
            if(!is_true){
                pPattern = /^1[3|4|5|6|7|8|9][0-9]\d{4,8}$/;
                is_true = pPattern.test(phone_str);
                if(!is_true){
                    cc.vv.popMgr.tip("请输入正确的手机号");
                    return false;
                }
            }
        }
     
        return true;
    },
    OnBtnClieck:function(event,data){

        cc.vv.audioMgr.click();
        
        var phone = this.textPhone.string;
        var textCode = this.textCode.string;

        var phonefinduser=  this.node.getChildByName("toggle").getChildByName("phonefinduser");
        var isphonefinduser = phonefinduser.getComponent(cc.Toggle);


        if(!this.is_phone_code()){
            return;
        }
        var self = this;

        //验证码回调
        var mobile_code = function(ret){
            
            var data = ret.data;

            if(ret.errcode !== 0){
                cc.vv.popMgr.alert(ret.errmsg);
                self.ableSend();
                return;
            }

            //增加按钮倒计时功能
            cc.vv.userMgr.sign_code_time = 60;    
            self.disbleSend();
            cc.vv.popMgr.tip(ret.errmsg,3.0);
        };

         //找回账号回调
         var update_account = function(ret)
         {
            var data = ret.data;
            
            if(ret.errcode !== 0){
                cc.vv.popMgr.tip(ret.errmsg);
                return;
            }
            if(ret.errmsg == 'ok'){
                cc.vv.popMgr.alert('找回账号成功,需要重新登陆',function(){
                    cc.game.restart();
                });
            }
           
         }
        
        //绑定回调
        var bind_mobile = function(ret){

            var data = ret.data;
            
            if(ret.errcode !== 0){
                cc.vv.popMgr.alert(ret.errmsg);
                return;
            }

            cc.vv.popMgr.alert(ret.errmsg,function(){
                self.node.destroy();
            });
        };

        switch(event.target.name){
            case "btnGetCode" :{
                var cur_scenc = cc.director.getScene().name;
                var type = isphonefinduser.isChecked?1:0;
                if(cur_scenc == "hall"){
                    cc.vv.hall.addHandler("mobile_code",mobile_code);
                }
                if(this.phone_type == 0){
                    cc.vv.net1.quick("mobile_code",{no:phone,type:0});
                }else if(this.phone_type == 1){
                    var edb_input_psd = this.retrieve_psd.getChildByName("edb_phone_number");
                    var str = edb_input_psd.getComponent(cc.EditBox).string;
                    cc.vv.net1.quick("mobile_code",{no:str,type:2});
                }else if(this.phone_type == 2){
                    var edb_input_psd = this.update_psd.getChildByName("edb_phone_number");
                    var str = edb_input_psd.getComponent(cc.EditBox).string;
                    cc.vv.net1.quick("mobile_code",{no:str,type:3});
                }else if(this.phone_type == 3){
                    var edb_input_psd = this.phone_retrieve_user.getChildByName("edb_phone_number");
                    var str = edb_input_psd.getComponent(cc.EditBox).string;
                    cc.vv.net1.quick("mobile_code",{no:str,type:1});
                }
            }
            break;
            case "btnBind" :{
                if(this.phone_type == 0){//账号绑定
                    if(textCode == "" || textCode.length != 6){
                        cc.vv.popMgr.tip("验证码输入不正确");
                        return;
                    }
                    if(!this.is_phonce_yz(this.phone_type)){
                        return;
                    }  
                    var edb_input_psd = this.bind_phone.getChildByName("edb_input_psd");
                    var str = edb_input_psd.getComponent(cc.EditBox).string;
                    cc.vv.hall.addHandler("bind_mobile",bind_mobile);
                    var new_psd_md5 = cc.vv.utils.md5(str + "jiale");
                    cc.vv.net1.quick("bind_mobile",{no:phone,code:textCode,type:0,password:new_psd_md5});
                   
                }else if(this.phone_type == 1){
                    var edb_phone_code = this.retrieve_psd.getChildByName("edb_phone_code");
                    var code = edb_phone_code.getComponent(cc.EditBox).string;
                    if(code == "" || code.length != 6){
                        cc.vv.popMgr.tip("验证码输入不正确");
                        return;
                    }
                    var edb_phone_number = this.retrieve_psd.getChildByName("edb_phone_number");
                    var phone_code = edb_phone_number.getComponent(cc.EditBox).string;
                    cc.vv.hall.addHandler("bind_mobile",bind_mobile);
                    cc.vv.net1.quick("bind_mobile",{no:phone_code,code:code,type:1});
             
                }else if(this.phone_type == 2){
                    if(!this.is_phonce_yz(this.phone_type)){
                        return;
                    }
                    if(this.send_type == 0){
                        var edb_input_psd = this.update_psd.getChildByName("edb_psd_code");
                        var old_str = edb_input_psd.getComponent(cc.EditBox).string;//密码
                        var edb_phone_number = this.update_psd.getChildByName("edb_phone_number");
                        var phone_str = edb_phone_number.getComponent(cc.EditBox).string;//手机号
                        var new_input_psd = this.update_psd.getChildByName("edb_input_psd");
                        var new_str = new_input_psd.getComponent(cc.EditBox).string;//新密码
                        var old_psd_md5 = cc.vv.utils.md5(old_str + "jiale");
                        var new_psd_md5 = cc.vv.utils.md5(new_str + "jiale");
                        cc.vv.net1.quick("update_password",{account:phone_str,password:new_psd_md5,old_password:old_psd_md5,type:2});
                    }else if(this.send_type == 1){
                        var edb_input_psd = this.update_psd.getChildByName("edb_phone_code");
                        var old_str = edb_input_psd.getComponent(cc.EditBox).string;//验证码
                        var edb_phone_number = this.update_psd.getChildByName("edb_phone_number");
                        var phone_str = edb_phone_number.getComponent(cc.EditBox).string;//手机号
                        var new_input_psd = this.update_psd.getChildByName("edb_input_psd");
                        var new_str = new_input_psd.getComponent(cc.EditBox).string;//新密码
                        var new_psd_md5 = cc.vv.utils.md5(new_str + "jiale")
                        cc.vv.net1.quick("find_password",{account:phone_str,password:new_psd_md5,code:old_str,type:2});
                    }
                }else if(this.phone_type == 3){
               
                    var edb_input_psd = this.phone_retrieve_user.getChildByName("edb_phone_code");
                    var old_str = edb_input_psd.getComponent(cc.EditBox).string;//验证码
                    if(old_str == "" || old_str.length != 6){
                        cc.vv.popMgr.tip("验证码输入不正确");
                        return;
                    }
                    var edb_phone_number = this.phone_retrieve_user.getChildByName("edb_phone_number");
                    var phone_str = edb_phone_number.getComponent(cc.EditBox).string;//手机号

                    cc.vv.hall.addHandler("update_account",update_account);
                    cc.vv.net1.quick("update_account", { no: phone_str,code:old_str});
                }
            }
            break;
        }
    },
    btn_switch:function(event,data){
        switch(event.target.name){
            case "wenhao_1" :{
                cc.vv.popMgr.alert("绑定手机号绑定手机号后，能够使用手机号登录游戏；并能够在新号上通过找回功能，恢复为老号码");
            }
            break;
            case "wenhao_2" :{
                cc.vv.popMgr.alert("找回账号绑定手机号后，如果您的微信号被封，可使用新号登录后，使用本功能找回老号码");
            }
            break;
            case "wenhao_3" :{
                cc.vv.popMgr.alert("注销绑定取消手机号与当前用户的绑定，您将失去手机登录和找回帐号功能");
            }
            break;
            case "wenhao_4" :{
                cc.vv.popMgr.alert("重置密码通过本功能，可以重置您设置的登录密码");
            }
            break;




            case "btn_back" :{
                cc.vv.utils.btn_node_back(this.node.getChildByName("tis_node"));
            }
            break;
            case "btn_tips" :{
                cc.vv.utils.popPanel(this.node.getChildByName("tis_node"));
            }
            break;
            case "userbindphone" :{
                this.btnGetCode.active = true;  
                this.phone_type = 0;
                this.bind_phone.active = true;
                this.retrieve_psd.active = false;
                this.update_psd.active = false;
                this.phone_retrieve_user.active = false;
            }
            break;
            case "phonefinduser" :{
                this.btnGetCode.active = true;  
                this.phone_type = 1;
                this.bind_phone.active = false;
                this.retrieve_psd.active = true;
                this.update_psd.active = false;
                this.phone_retrieve_user.active = false;
            }
            break;
            case "password" :{
                this.phone_type = 2;
                this.bind_phone.active = false;
                this.retrieve_psd.active = false;
                this.update_psd.active = true;
                this.phone_retrieve_user.active = false;
                if(this.send_type == 1){
                    this.btnGetCode.active = true;  
                }else if(this.send_type == 0){
                    this.btnGetCode.active = false;  
                }
            }
            break;
            case "phone_user" :{
                this.phone_type = 3;
                this.bind_phone.active = false;
                this.retrieve_psd.active = false;
                this.update_psd.active = false;
                this.phone_retrieve_user.active = true;
                this.btnGetCode.active = true;  
            }
            break;
  
            case "btn_code_upd" :{//验证码修改密码
                this.send_type = 1;
                var btn_psd_upd = this.update_psd.getChildByName("btn_psd_upd");
                var btn_code_upd = this.update_psd.getChildByName("btn_code_upd");

                this.btnGetCode.active = true;
                var txt_pwd_code = this.update_psd.getChildByName("txt_pwd_code");
                var edb_psd_code = this.update_psd.getChildByName("edb_psd_code");

                var txt_phone_code = this.update_psd.getChildByName("txt_phone_code");
                var edb_phone_code = this.update_psd.getChildByName("edb_phone_code");

                txt_pwd_code.active = false;
                edb_psd_code.active = false;

                txt_phone_code.active = true;
                edb_phone_code.active = true;

                btn_psd_upd.active = true;
                btn_code_upd.active = false;
            }
            break;
            case "btn_psd_upd" :{//旧密码修改
                this.send_type = 0;
                var btn_psd_upd = this.update_psd.getChildByName("btn_psd_upd");
                var btn_code_upd = this.update_psd.getChildByName("btn_code_upd");

                var txt_pwd_code = this.update_psd.getChildByName("txt_pwd_code");
                var edb_psd_code = this.update_psd.getChildByName("edb_psd_code");

                txt_phone_code = this.update_psd.getChildByName("txt_phone_code");
                edb_phone_code = this.update_psd.getChildByName("edb_phone_code");

                txt_pwd_code.active = true;
                edb_psd_code.active = true;
                this.btnGetCode.active = false;
                txt_phone_code.active = false;
                edb_phone_code.active = false;

                btn_psd_upd.active = false;
                btn_code_upd.active = true;
            }
            break;
            
        }
    },
    onDestroy:function(){
        var cur_scenc = cc.director.getScene().name;
        if(cur_scenc != "hall"){
            return;
        }
        cc.vv.hall.removeHandler('bind_mobile');
        cc.vv.hall.removeHandler('mobile_code');
        cc.vv.hall.removeHandler('update_account');
    },
    updates : function() {
        cc.vv.userMgr.sign_code_time--;
        this.lblTime.string = cc.vv.userMgr.sign_code_time;
        if(cc.vv.userMgr.sign_code_time <= 0){
            this.unschedule(this.updates);//移除定时器
            this.btnSend.interactable = true;
            this.sprSend.node.active = true;
            this.lblTime.node.active = false;
       }
    },
        //监听协议
  

});
