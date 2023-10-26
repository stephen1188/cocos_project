cc.Class({
    extends: cc.Component,

    properties: {
        _type:0,

        array1:[cc.Prefab],
        array2:[cc.Prefab],

        _player_id:0,

        list_club:cc.Node,
        list_game:cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        if(cc.winSize.width / cc.winSize.height - 16 / 9 > 0.1){ 
            var width = cc.winSize.width;
            this.node.width = width;
        }
        this._toggles =  this.node.getChildByName("toggles");
        this._lists =  this.node.getChildByName("lists");

        var type = this._toggles.children[0].name;
        // cc.vv.utils.setToggleChecked(this._toggles,type);
        
        this.onBtnleiXingXuanZe(null,type);
    },

    // onEnable:function(){
    //     var type = this._toggles.children[0].name;
    //     cc.vv.utils.setToggleChecked(this._toggles,type);
        
    //     this.onBtnleiXingXuanZe(null,type);
    // },

    show:function(data){
        this._player_id = data.player_id;
        this._type = data.type;
        if(data.player_id == 0){
            this.allUsers(data);
        }
        else{
            this.personal(data);
        }
    },

    allUsers:function(data){
        this.list_club.removeAllChildren();
        this.list_game.removeAllChildren();
        var list = data.list;
        
        for(var i = 0; i < list.length; ++i){
            var node = cc.instantiate(this.array1[this._type]);
            if(this._type == 0){
                this.list_club.addChild(node);
            }
            else{
                this.list_game.addChild(node);
            }
            
            node.emit('new',list[i]);
        }
    },

    personal:function(data){
        this.list_club.removeAllChildren();
        this.list_game.removeAllChildren();
        var list = data.list;

        for(var i = 0; i < list.length; ++i){
            var node = cc.instantiate(this.array2[this._type]);
            if(this._type == 0){
                this.list_club.addChild(node);
            }
            else{
                this.list_game.addChild(node);
            }
            node.emit('new',list[i]);
        }
    },

    onBtnleiXingXuanZe:function(event,detail){
        var self = this;
        if(event != null){
            cc.vv.audioMgr.click();
        }
        if(detail == null)detail = event.target.name;
        for(var i = 0; i < this._lists.children.length; ++i){
            var name = this._lists.children[i].name;
            this._lists.children[i].active = (detail == name);
        }
        if(event){
            switch(event.target.name){
                case 'club':{
                    cc.vv.popMgr.wait2('正在获取清单',function(){
                        cc.vv.net1.quick('club_pwb_list',{club_id:cc.vv.userMgr.club_id,player_id:self._player_id,type:0});
                    });
                }
                break;
                case 'game':{
                    cc.vv.popMgr.wait2('正在获取清单',function(){
                        cc.vv.net1.quick('club_pwb_list',{club_id:cc.vv.userMgr.club_id,player_id:self._player_id,type:1});
                    });
                }
                break;
            }
        }
    },

    onclickClose(){
        cc.vv.club._clubPwbList = null
        this.node.destroy();
    },
    // update (dt) {},
});
