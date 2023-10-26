cc.Class({
    extends: cc.Component,
    properties: {
        nodeCreate:cc.Node,
        nodeJoin:cc.Node,
    },
    
    /**
     * 显示
     */
    show:function(content){

        this.nodeCreate.active = false;
        this.nodeCreate.active = false;
        switch(content){
            case "create":{
                this.nodeCreate.active = true;
            }
            break;
            case "join":{
                this.nodeJoin.active = true;
            }
            break;
        }
        this.node.active = true;
    },

    hide:function(){
        this.node.active = false;
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
