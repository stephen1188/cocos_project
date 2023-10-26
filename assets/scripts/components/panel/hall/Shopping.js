cc.Class({
    extends: cc.Component,

    properties: {
    },
    
    OnBtnClieck:function(event,store_id){

        cc.vv.audioMgr.click();

        var self = this;
        self.index = parseInt(store_id);

        //验证码回调
        var order = function(ret){
            
            var data = ret.data;
            
            if(ret.errcode !== 0){
                cc.vv.popMgr.hide();
                cc.vv.popMgr.alert(ret.errmsg);
                return;
            }
            
            cc.vv.g3Plugin.shopping(self.index,data.order_no);
        };

        cc.vv.hall.addHandler("order",order);
        cc.vv.popMgr.wait('购买中',function(){
            cc.vv.net1.quick("order",{store_id:self.index});
        })
    },

    onDestroy:function(){
        cc.vv.hall.removeHandler('order');
    }
});
