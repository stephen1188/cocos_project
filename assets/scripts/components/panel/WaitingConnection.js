cc.Class({
    extends: cc.Component,
    properties: {
        lblContent:cc.Label,
        _err:"",
        _fun:null,
    },
    
    /**
     * 显示
     */
    show:function(content){
        this.node.active = true;   
        this.lblContent.string = content;
    },

    hide:function(){
        this.node.active = false;
    },

    scheduleTip:function(dt){
        // cc.vv.popMgr.tip(this._err);
        self.node.removeFromParent();
        if(this._fun){
            this._fun();
        }
    },

        /**
     * 定时关闭
     */
    scheduleShow:function(time,err,func){
        var self = this;
        this._err = err;
        this._fun = func;
        this.scheduleOnce(this._fun,time);
    },

    scheduleCannel:function(){
        if(this._fun)this.unschedule(this._fun);
    },
});
