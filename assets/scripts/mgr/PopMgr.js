cc.Class({
    extends: cc.Component,

    properties: {
        popFlag:true
    },
    /**
     * 提示文字
     * @param {*} txt 
     */
    tip:function(txt,delaytime){
        let message = txt || "";
        this.pop("Tip",function(obj){
            obj.getComponent("Tip").tip(message,delaytime);
        });
    },

    kuaixun:function(context){
        this.pop("Kuaixun",function(obj){
            obj.getComponent("Kuaixun").kuaixun(context);
        });
    },

    // use this for initialization
    alert: function (context,funok,needcannel,funcancel) {
        this.pop("Alert",function(obj){
            obj.zIndex = 1001;
            obj.getComponent("Alert").show(context,funok,needcannel,funcancel);
        });
    },

    //ip地址专属重复弹出框
    alertip_repeat: function (context,funok,needcannel) {
        var node = cc.find("Canvas/pop/IpCheck");
        if(node != null)
            node.getComponent("IpCheck").show(context,funok,needcannel);
        else
        {
            this.pop("IpCheck",function(obj){
                obj.getComponent("IpCheck").show(context,funok,needcannel);
            });
        }
    },

    
    back_wait:function(context,func){

        var callback = function(node){
            if(func){
                func();
            }
        }

        var node = cc.find("Canvas/pop/BackWaitingConnection");
        if(node != null){
            node.active = true;
            callback(node);
            return;
        }
        
        this.pop("BackWaitingConnection",function(obj){
            obj.zIndex = 1000;
            callback(obj);
        });
    },


    wait:function(context,func){

        var callback = function(node){
            node.getComponent("WaitingConnection").show(context);
            if(func){
                func();
            }
        }

        var node = cc.find("Canvas/pop/WaitingConnection");
        if(node != null){
            callback(node);
            return;
        }
        
        this.pop("WaitingConnection",function(obj){
                obj.zIndex = 1000;
               callback(obj);
            });
    },

    wait2:function(context,func){
        var callback = function(node){
            node.getComponent("WaitingConnection").show(context);
            if(func){
                func(node);
            }
        }
        var node = cc.find("Canvas/pop/Waiting");
        if(node != null){
            callback(node);
            return;
        }
        this.pop("Waiting",function(obj){
            obj.zIndex = 1000;
            callback(obj);
        });
    },

    hide:function(){
        var node = cc.find("Canvas/pop/WaitingConnection");
        if(node != null){
            node.getComponent("WaitingConnection").hide();
        }

        node = cc.find("Canvas/pop/Waiting");
        if(node != null){
            node.getComponent("WaitingConnection").hide();
        }

        var node = cc.find("Canvas/pop/BackWaitingConnection");
        if(node != null){
            node.active = false;
        }
    },

    loading_tip:function(context,func){
        cc.log("context = ", context);
        var callback = function(node){
            node.getComponent("LoadingTip").show(context);
            if(func){
                cc.log('node 1111 = ', node);
                func(node);
            }
        }

        var node = cc.find("Canvas/pop/LoadingTip");
        cc.log('node 11111 =', node);// node = null
        if(node != null){
            callback(node);
            return;
        }
        cc.log('139139');
        this.pop("LoadingTip",function(obj){
            obj.zIndex = 500;
            cc.log('142142');
            callback(obj);
        });
    },

    hide_loading_tip:function(){
        var node = cc.find("Canvas/pop/LoadingTip");
        if(node != null){
            node.getComponent("LoadingTip").hide();
        }
    },
    
    //实例化一个组件
    pop:function(prefab,func){
        var root = cc.find("Canvas/pop");
        this.newPrefad(root,prefab,func);
    },
    //获得pop中的一个场景
    get_pop:function(prefab,func){
        var true_false = cc.find("Canvas/pop/"+prefab);
        if (true_false!=null) return true;
        else return false;
    },
    //删除open场景的控件 如果open节点下有这个控件，就删除这个控件。否则返回false
    del_pop:function(prefab){
        var true_false = cc.find("Canvas/pop");
        var pre = true_false.getChildByName(prefab);
        if (pre!=null)
            pre.destroy(); 
        else return false;
    },
    //实例化一个组件
    open:function(prefab,func,data){
        var root = cc.find("Canvas/open");
        this.newPrefad(root,prefab,func,data);
    },
    //获取一个组件用来直调
    getNode(title,pre,func){
        var true_false = cc.find("Canvas/"+title+"/"+pre);
        if (true_false!=null){
            // if(func)func
            return true_false;
        }else{
            return false; 
        }
    },
    //获取open控件下是否存在这个组件， 如果存在就返回true 如果不存在就返回false
    get_open:function(prefab){
        var true_false = cc.find("Canvas/open/"+prefab);
        if (true_false!=null) return true;
        else return false;
    },
    //删除open场景的控件 如果open节点下有这个控件，就删除这个控件。否则返回false
    del_open:function(prefab){
        var true_false = cc.find("Canvas/open");
        var pre = true_false.getChildByName(prefab);
        if (pre!=null)
            pre.destroy(); 
        else return false;
    },
    //实例化
    newPrefad:function(root,prefab,func,data){
        // cc.log('root = ', root);
        // cc.log('prefab = ', prefab);
        // cc.log('func = ', func);
        // cc.log('data = ', data);
        let self =  this;
        var prefabPath = 'prefabs/' + prefab;
        var onResourceLoaded = function( errorMessage, loadedResource )
        {
            if( errorMessage ) {return; }
            if( !( loadedResource instanceof cc.Prefab ) ) {return; }
            
            var newMyPrefab = cc.instantiate(loadedResource);
            if(cc.isValid(root) && newMyPrefab){
                root.addChild(newMyPrefab);
            }
            if(func && cc.isValid(root)){
                func(newMyPrefab,data);
            }
            // cc.log('return 1111111');
        };
        cc.loader.loadRes( prefabPath, onResourceLoaded );
    },
});
