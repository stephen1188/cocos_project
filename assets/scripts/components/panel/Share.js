cc.Class({
    extends: cc.Component,

    properties: {
        _callback:null,
        _obj:null,
        _room_id:null,
    },

    share:function(func,obj,room_id){
        this._callback = func;
        this._obj = obj;
        this._room_id=room_id;
    },
    onhideshare:function(data){
        this.node.getChildByName("btn").getChildByName("btn_"+data).active=false;
    },
    onBtnCliecked:function(event,data){
        this.node.destroy();
        if(this._callback){
            this._callback(data,this._obj,this._room_id);
        }
    }
});
