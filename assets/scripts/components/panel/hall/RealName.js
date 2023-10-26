
cc.Class({
    extends: cc.Component,

    properties: {
        textName:cc.EditBox,
        textId:cc.EditBox,
    },
    
    OnBtnClieck:function(event,data){

        var self = this;
        cc.vv.audioMgr.click();
        
        var name = this.textName.string;
        var id = this.textId.string;

        if(name == "" || id == ''){
            cc.vv.popMgr.tip("信息输入不完整");
            return;
        }

        //验证码回调
        var real_name = function(ret){
            
            var data = ret.data;
            
            if(ret.errcode !== 0){
                cc.vv.popMgr.alert(ret.errmsg);
                return;
            }

            cc.vv.popMgr.alert(ret.errmsg);
            self.destroy();
        };

        cc.vv.hall.addHandler("real_name",real_name);
        cc.vv.net1.quick("real_name",{card_id:id,real_name:name});
    },

    onDestroy:function(){
        cc.vv.hall.removeHandler('real_name');
    }
});
