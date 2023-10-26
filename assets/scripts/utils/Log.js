var Log = cc.Class({
    extends: cc.Component,
    statics: {
        _log:true,
        _error:true,
        _debug:true,
        _info:true,

        log:function(message){
            if (cc.sys.isNative)return;
            if(this._log){
                console.log(message);
            }
        },

        error:function(message){
            if (cc.sys.isNative)return;
            if(this._error){
                console.log(message);
            }
        },

        debug:function(message){
            if (cc.sys.isNative)return;
            if(this._debug){
                console.log(message);
            }
        },

        info:function(message){
            if (cc.sys.isNative)return;
            if(this._info){
                console.log(message);
            }
        }
    }
});
