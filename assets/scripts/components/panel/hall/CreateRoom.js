cc.Class({
    extends: cc.Component,

    properties: {
        gameNode:cc.Node,
        title:cc.Node,
        tools:cc.Node,
        configNode:cc.Node,
        btnCreate:cc.Node,
        btnDaikai:cc.Node,
        btnSave:cc.Node,
        title_create_room:cc.Node,
        title_club_rule:cc.Node,
        forbiddenToggle: cc.Toggle,
        is_mute:1, //默认禁言
    },

    onLoad:function(){
        this.initNode();
        this.initEventHandlers();
      
        // if(cc.vv.userMgr.ios_review == 1){
        if(cc.APP_STORE_REVIEW == 1 && cc.vv.userMgr.ios_review == 1  && cc.sys.os == cc.sys.OS_IOS){
            this.gameNode.active = false;
            this.tools.active = true;
            this.title.active = false;

            this. showTdh();
        }

    },
    start:function(){
        this.create_action("start");
     
    },

    initNode:function(){
        this.is_show = false;
        this.popbg = this.node.getChildByName("popbg");
        this.btn_back = this.node.getChildByName("btn_back");
        this.bg_shadow = this.node.getChildByName("bg_shadow");
        this.shadowCallback = true;
    },

    create_action(str){
        var i_tag = 0;
        var list = this.node.getChildByName("gameNode").getChildByName("view").getChildByName("list");
        var tdh = list.getChildByName("tdh");
        var kd = list.getChildByName("kd");
        var gsj = list.getChildByName("gsj");
        var kd2 = list.getChildByName("kd2");
        var ddz = list.getChildByName("ddz");
        var nn = list.getChildByName("nn");
        var ysz = list.getChildByName("ysz");
        var tjd = list.getChildByName("tjd");

        var pdk = list.getChildByName("pdk");
        var dq = list.getChildByName("dq");
        var hs = list.getChildByName("hs");
        var jzmj = list.getChildByName("jzmj");
        var hlzz = list.getChildByName("hlzz");
        var jqqd = list.getChildByName("jqqd");
        // var ra = list.getChildByName("ra");
        // var zpj = list.getChildByName("zpj");
        var zgz = list.getChildByName("zgz");
        if (cc.vv.userMgr.is_dealer){

        }else if(!this.is_open){
            this.is_open = true;
            nn.active = false;
            ysz.active = false;
            tjd.active = false;
            // zpj.active = false;
            hlzz.x = dq.x
            hlzz.y = dq.y -10
            zgz.x = hs.x
            zgz.y = hs.y
            jqqd.x = jzmj.x
            jqqd.y = jzmj.y
            dq.y = nn.y
            hs.y = ysz.y
            jzmj.y = tjd.y
        }

        tdh.myTag = i_tag++; 
        ddz.myTag = i_tag++; 
        kd.myTag = i_tag++; 
        if(cc.vv.userMgr.is_dealer)nn.myTag = i_tag++; 
        gsj.myTag = i_tag++; 
        if(cc.vv.userMgr.is_dealer)ysz.myTag = i_tag++; 
        kd2.myTag = i_tag++; 
        if(cc.vv.userMgr.is_dealer)tjd.myTag = i_tag++; 
        pdk.myTag = i_tag++; 
        dq.myTag = i_tag++; 
        hs.myTag = i_tag++;
        jzmj.myTag = i_tag++;
        hlzz.myTag = i_tag++;
        // zpj.myTag = i_tag++;
        zgz.myTag = i_tag++;
        jqqd.myTag = i_tag++; 
        // ra.myTag = i_tag++;
       
     
        


        this.index_max = i_tag;
        this.node.getChildByName("bg_shadow").active = this.is_show;
        if(str == "start"){
            this.action_idx = 0;
            for(var i = 0;i < this.index_max;i++){
                var cur_node = cc.vv.utils.getChildByTag(list,i);
                cur_node.on(cc.Node.EventType.TOUCH_START,function(data){
                    var light = data.currentTarget.getChildByName("light");
                    cc.vv.utils.light_action(light);
                });
                cur_node.opacity = 0;
            }
            this.start_action(list);
        }else if(str == "btn_back" && this.action_idx >= this.index_max){
            this.back_action(list);
        }

    },
    back_action:function(list){
        var speed = 0.4;
        var offset_x = 250;
        list.opacity = 0;
        //list.scale = 0.8;

        list.x = list.x + offset_x;
        list.runAction(cc.sequence(
            cc.spawn(
                cc.fadeTo(speed,255),  
                cc.moveTo(speed,cc.v2(list.x - offset_x,list.y))
                //cc.scaleTo(speed,1,1)
            ),
            cc.callFunc(function () {
            },),
        ));
    },
    start_action(list){
        var self = this;
        var speed = 0.1;
        if(this.action_idx >= this.index_max){
            cc.vv.hall.move_in = false;
            return;
        }
        var offset_x = 300;
        var cur = cc.vv.utils.getChildByTag(list,this.action_idx++);
        cur.opacity = 0;
        
        cur.x = cur.x + offset_x;
        cur.runAction(cc.sequence(
            cc.spawn(
                cc.fadeTo(speed,255),  
                cc.moveTo(speed,cc.v2(cur.x - offset_x,cur.y))
            ),
            cc.callFunc(function () {
                self.start_action(list);
            },),
        ));
    },
    showTdh:function(){
        //审核隐藏  
        var self = this;
        this._type = 'tdh';
        this.newPrefad(this._type,function(obj){
            self.configNode.removeAllChildren();
            self.configNode.addChild(obj);
            if(cc.vv.hall.create_room < 1){
                self.btnCreate.active = true;
                self.btnDaikai.active = cc.vv.userMgr.daikai == 1;
                self.btnSave.active = false;
            }else{
                self.btnCreate.active = false;
                self.btnDaikai.active = false;
                self.btnSave.active = true;
            }            
        })
    },
    btn_node_back:function(node){
        var self = this;
        node.opacity = 255;
        node.y = 0;
        node.runAction(cc.sequence(
            cc.spawn(
                cc.moveTo(0.2,cc.v2(0,750)),
                cc.fadeTo(0.2,0),  
            ),
            cc.callFunc(function () {
                node.active = false;
                node.opacity = 255;
                node.y = 0;
                self.gameNode.active = true;
            },)
        ));
    },
    onBtnClicked:function(event,data){
        cc.vv.audioMgr.click();
        var self = this;
        if(event.target.name != "bg_shadow"){
            this._type = event.target.name;
        }
        switch(event.target.name){
            case "bg_shadow":{
                if(this.is_show && this.shadowCallback){
                    this.node.destroy();
                }
            }
            break;
            case "btn_back":{
                if(cc.vv.hall.cur_scene == "main"){
                    this.node.destroy();
                    return;
                }
                cc.vv.audioMgr.click();
                self.create_action("btn_back");
                this.btn_node_back(this.node.getChildByName("popbg"));
                //this.node.getChildByName("popbg").active = false;
                this.node.getChildByName("btn_back").active = false;
                if(cc.vv.hall.create_room > 1){
                    self.node.active = false;
                    return;
                }
                if(self.tools.active){

                    if(cc.APP_STORE_REVIEW == 1 && cc.vv.userMgr.ios_review == 1  && cc.sys.os == cc.sys.OS_IOS){
                        self.node.active = false;
                        return;
                    }

                    self.tools.active = false;
                    self.title.active = true;
                    
                    self.configNode.removeAllChildren();       
                }else{
                    self.node.active = false;
                    
                }
            }
            break;
            case 'dq':
            case "kd":
            case 'nn':
            case 'ddz':
            case 'tjd':
            case 'dsg':
            case 'ttz':
            case 'ysz':
            case 'gsj':
            case 'kd2':
            case 'pdk':
            case 'hs':
            // case "ra":
            // case "zpj":
            case "zgz":
            case "tdh":{
                this.is_show = false;
                cc.vv.utils.popPanel(this.node);
                self.gameNode.active = false;
                this.newPrefad(this._type,function(obj){
                    self.popbg.active = true;
                    self.btn_back.active = true;
                    self.bg_shadow.active = true;
                    self.configNode.removeAllChildren();
                    self.configNode.addChild(obj);

                    self.gameNode.active = false;
                    self.tools.active = true;
                    self.title.active = false;
                    
                    if(cc.vv.hall.create_room < 1){ // 0：大厅进入 2：普通 3：晋级
                        self.btnCreate.active = true;
                        self.btnDaikai.active = cc.vv.userMgr.daikai == 1;
                        self.btnSave.active = false;
                    }else if(cc.vv.hall.create_room >= 1 && cc.vv.hall.create_room < 2){
                        self.btnCreate.active = true;
                        self.btnDaikai.active = false;
                        self.btnSave.active = false;
                    }else{
                        self.btnCreate.active = false;
                        self.btnDaikai.active = false;
                        self.btnSave.active = true;
                    }
                    if(cc.vv.hall.create_room == 3){
                        self.forbiddenToggle.node.active = true;
                    }
                })
                
            }
            break;
            default:{
                cc.vv.popMgr.tip("即将上线，敬请期待");
            }
        }

        
    },

    /**
     * 监听事件
     */
    initEventHandlers: function() {

        //初始化事件监听器
        var self = this;

        //属性更新
        this.node.on('show', function () {
          
            // if(cc.vv.userMgr.ios_review == 1){
            if(cc.APP_STORE_REVIEW == 1 && cc.vv.userMgr.ios_review == 1  && cc.sys.os == cc.sys.OS_IOS){
                // self.showTdh();
                return;
            }
            self.is_show = true;
            self.bg_shadow.active = true;
            self.configNode.removeAllChildren();
            self.gameNode.active = true;
            self.tools.active = false;
            self.title.active = true;

            if(cc.vv.hall.create_room < 2){
                self.title_create_room.active = true;
                self.title_club_rule.active = false;
            }else{
                self.title_create_room.active = false;
                self.title_club_rule.active = true;
            }            
        });

        this.node.on('config', function (ret) {
            self.is_show = true;
            self.gameNode.active = false;
            self.popbg.active = true;
            self.btn_back.active = true;
            self.bg_shadow.active = true;
            self.shadowCallback = false;
            if(cc.APP_STORE_REVIEW == 1 && cc.vv.userMgr.ios_review == 1  && cc.sys.os == cc.sys.OS_IOS){
                return;
            }
            var data = ret;
            self._type = data.game;
            self.newPrefad(self._type,function(obj){
                    
                self.configNode.removeAllChildren();
                self.configNode.addChild(obj);

                self.gameNode.active = false;
                self.tools.active = true;
                self.title.active = false;

                self.btnCreate.active = false;
                self.btnDaikai.active = false;
                self.btnSave.active = true;
                self.Config(data);
            })
        });
    },

    Config:function(data){
        var node = this.configNode.getChildByName(data.game);
        var game = node.getComponent('CreateRoomRule').config(data.rule);
        if(data.rule.hasOwnProperty('is_mute')){ // 判断是否有禁言字段
            this.forbiddenToggle.isChecked = data.rule.is_mute;
        }
        this.onClickToggel(); // 换算is_mute
        var component = null;
        if( node.getChildByName("games") == null){
            component = node.getChildByName("ScrollView").getChildByName("view").getChildByName("content").getChildByName("games").getChildByName(game).getComponent(game + "_config");
        }else{
            component = node.getChildByName("games").getChildByName(game).getComponent(game + "_config");
        }
       
        component.node.active = true;
        component.loadSaveConfig2(data.rule);
    },

    //开房
    onBtnKai:function(event,data){
        cc.vv.audioMgr.click();
        cc.vv.roomMgr.ip_repeat = false;//本局不在弹出IP地址提示框变量在游戏重新创建房间的时候重置
        var node = this.configNode.getChildByName(this._type);
    
        var type = cc.vv.utils.toggleChecked(node.getChildByName("toggles"));
        //获取游戏选项
        if(this.configNode.getChildByName(this._type).getChildByName("games") == null){
            var component = this.configNode.getChildByName(this._type).getChildByName("ScrollView").getChildByName("view").getChildByName("content").getChildByName("games").getChildByName(type).getComponent(type + "_config");
        }else{
            var component = this.configNode.getChildByName(this._type).getChildByName("games").getChildByName(type).getComponent(type + "_config");
        }

        var conf = component.Config();

        //开房模式
        conf.fufei = data;

        //亲友圈自选开房
        conf.clubid = 0;
        if(cc.vv.hall.create_room == 1){
            conf.clubid = cc.vv.userMgr.club_id;
        }

        var create_room = {
            method:"create",
            data:{
                version:cc.SERVER,
                type:conf.name,
                conf:conf,
                location:cc.vv.global.latitude + "," + cc.vv.global.longitude
            }
        };

        //保存开房选项
        cc.sys.localStorage.setItem("last_game_" + this._type,type);
        cc.sys.localStorage.setItem("last_game_" + type,JSON.stringify(conf));
        cc.vv.popMgr.loading_tip("create",function(){
        cc.vv.net1.send(create_room);
        });
    },

    //开房
    onBtnSave:function(event,data){

        cc.vv.audioMgr.click();
        var node = this.configNode.getChildByName(this._type);
        var type = cc.vv.utils.toggleChecked(node.getChildByName("toggles"));

         //获取游戏选项
         if(this.configNode.getChildByName(this._type).getChildByName("games") == null){
            var component = this.configNode.getChildByName(this._type).getChildByName("ScrollView").getChildByName("view").getChildByName("content").getChildByName("games").getChildByName(type).getComponent(type + "_config");
         }else{
            var component = this.configNode.getChildByName(this._type).getChildByName("games").getChildByName(type).getComponent(type + "_config");
         }
         
         var conf = component.Config();
         
         //普通场规则
         if(cc.vv.hall.create_room == 2){

            var club_create_rule_ptz = {
                method:"club_create_rule_ptz",
                data:{
                    version:cc.SERVER,
                    conf:conf,
                    info:conf.desc,
                    club_id:cc.vv.userMgr.club_id,
                    id:cc.vv.userMgr.club_rule_id,
                    index:0,
                    default:0,
                }
            };
            cc.vv.popMgr.pop("club/ClucRuleNameEdit",function(obj){
                obj.getComponent("ClucRuleNameEdit").show(club_create_rule_ptz);
            });
            // cc.vv.popMgr.wait("正在保存规则",function(){
            //     cc.vv.net1.send(club_create_rule_ptz);
            // });
            this.node.destroy();
             return;
         }

         //排位场规则
         if(cc.vv.hall.create_room == 3){
            let is_mute = this.is_mute;
            cc.vv.popMgr.pop('club/ClubPwz',function(obj){
                obj.getComponent('ClubPwz').show(conf,is_mute);
            });
            this.node.destroy();
         }
    }, 

    //实例化
    newPrefad:function(prefab,func){
        var prefabPath = 'prefabs/game/' + prefab;
        var onResourceLoaded = function( errorMessage, loadedResource )
        {
            if( errorMessage ) {return; }
            if( !( loadedResource instanceof cc.Prefab ) ) {return; }
            
            var newMyPrefab = cc.instantiate( loadedResource );
            func(newMyPrefab);
        };
        cc.loader.loadRes( prefabPath, onResourceLoaded );
    },
    onClickToggel(){
        if(cc.vv.hall.create_room == 3){
            this.forbiddenToggle.node.active = true;
            this.is_mute = this.forbiddenToggle.isChecked? 1:0;
        }
      
      
    },
  
});
