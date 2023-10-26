var WebSocket = WebSocket || window.WebSocket || window.MozWebSocket;
 
cc.Class({
    extends: cc.Component,
    properties: {
        ip:"",
        type:"hall",
        auto:1,
        num:0,
        sio:null,
        isPinging:false,
        fnDisconnect:null,
        handlers: {
            default: {},
        },
    },

    addHandler:function(event,fn){

        // cc.log(this.ip);
        // cc.log("event = ", event, fn);

        if(this.handlers == null){
            this.handlers = {};
        }

        if(this.handlers[event]){
            return;
        }

        var handler = function(data){           
            fn(data);
        };
        
        this.handlers[event] = handler;
    },

    connect:function(fnConnect,fnError) {

        var self = this;
        self.auto = 1;

        if(this.sio && self.sio.connected){
            fnConnect();
            return;
        }
        
        cc.vv.log3.debug('websokect.connect:'+ this.ip);
        this.sio = new WebSocket(this.ip);

        this.sio.onopen = function(evt){  
            self.sio.connected = true;
            self.num = 0;
            fnConnect(evt);
        };

        this.sio.onmessage = function(evt){  
            var data = evt.data;
            // cc.log('data = ', data);
            // cc.vv.log3.debug(self.type+"<<<<====", cc.NET_KEY[self.type]);
            var to = cc.vv.utils.decrypt(data,cc.NET_KEY[self.type]);

            // cc.vv.log3.debug(to);
            data = JSON.parse(to);
            // cc.log('data 123 = ', data);
            // cc.log('self.handlers =', self.handlers);
            //遍历数组,给所有添加监听的函数分发数据       
            for(var key in self.handlers){
                if(key != data.model)continue;
                var callback = self.handlers[key];
                if(typeof(callback) == "function"){
                    // cc.log('callback = ', callback);
                    callback(data);
                }
            }
        };  

        this.sio.onclose = function(evt){  
            if(self.auto!=1)return;

            if(self.sio && self.sio.connected){
                self.sio.connected = false;
                self.close();
            }

            // cc.vv.popMgr.show("与服务器断开，3秒后自动重连");
            self.reConnectGameServer();
        }; 

        this.sio.onerror = function(evt){
            if(cc.vv.isLoginScene){
                cc.vv.connceNum = 1; 
            }
            fnError();
        };  
        
        this.startHearbeat();
    },

    reConnectGameServer(){

        var self = this;

        this.num++;
        if(this.num >= 3){
            cc.vv.popMgr.hide();
            cc.vv.popMgr.alert('多次尝试仍无法连接游戏，游戏将重新启动',function(){
                self.num = 0;
                cc.game.restart();
            });
            return;
        }

        var deley = 1000;
        if(this.num == 1){
            deley = 0;
        }

        var self = this;
        setTimeout(function(){
            if(self.sio && self.sio.connected){
                return;
            }
            
            switch(self.type){
                case "hall":{
                    if(cc.director.getScene().name == 'hall'){
                        cc.vv.popMgr.back_wait();
                    }
                    function callback() {
                        cc.vv.popMgr.hide();
                    }
                    cc.vv.gameNetMgr.connectHallServer(callback);
                }
                break;
                case "game":{
                    cc.vv.popMgr.back_wait();
                    cc.vv.gameNetMgr.connectGameServer(self.ip);
                }
                break;
            }
            
        },deley);
    },
    
    startHearbeat:function(){

        var pong = function(){
            self.lastRecieveTime = Date.now(); 
        };

        this.addHandler('pong',pong);

        this.lastRecieveTime = Date.now();
        var self = this;
        if(!self.isPinging){
            self.isPinging = true;
            setInterval(function(){
                if(self.sio && self.sio.connected){
                    self.quick("ping");
                }
            },20000);
        }   
    },

    toserver:function(model,data){
        if(this.sio && this.sio.readyState == WebSocket.OPEN){
            data.model = model;
            data = JSON.stringify(data);    
            cc.vv.log3.debug('net data====>>>>:' + data);

            var to = cc.vv.utils.encrypt(data,cc.NET_KEY[this.type]);
            this.sio.send(to);                
        }
    },


    isConnectd:function(){
        return this.sio && this.sio.readyState == WebSocket.OPEN;
    },

    recursive:function (obj) {
        var output = '';
        if (typeof obj === 'object') {

            var objKeys = Object.keys(obj);
                

                // var isSort = false;
                // for(var i=0;i<objKeys.length;i++){
                //     var item = obj[objKeys[i]];
                //     if(item == undefined)continue;
                //     if (typeof item === 'object') {
                //         isSort = true;
                //         break;
                //     }
                // }

                // if(isSort){
                    objKeys = objKeys.sort();//这里写所需要的规则
                // }

                for(var i=0;i<objKeys.length;i++){
                    var item = obj[objKeys[i]];
                    if(item == undefined)continue;
                    if (typeof item === 'object') {
                        output += this.recursive(item);
                    } else {
                        output += item;
                    }
                }
        } else {
            output += obj;
        }
        return output;
    },
    
    /**
     * 共通方法
     */
    send:function(param){
        // cc.log('param =', param);
        if(param.data == null){
            param.data = {}
        }

        var sign_str = this.recursive(param.data) + cc.SIGN[this.type];
        var sign = cc.vv.utils.md5(sign_str);

        param.data.sign = sign;
        // cc.log(this.type ,  param);
        this.toserver(this.type,param);   
    },

    /**
     * 共通方法
     */
    quick:function(method,param){
        
        var info = {
            method:method,
            data:param
        };
        this.send(info);   
    },
    
    close:function(){
        if(this.sio && this.sio.connected){
            this.sio.connected = false;
            this.sio.close();
            this.sio = null;
            this.auto = 0;
        }
    },
});