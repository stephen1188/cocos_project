cc.Class({
    extends: cc.Component,

    properties: {
       userPrefab:cc.Prefab,
       list:cc.Node,
       listview:cc.Node,
       textID:cc.EditBox,
       _ary:[],
       _userdata:null,
       _idx:0,
       _text:'',
       _showTipFlag:false, // 筛选的没有文字提示
    },

    onLoad:function(){
        var self = this;
        this.listview.on('bounce-bottom',function(){
            self.loadMember(18);
        });
    },

    loadMember:function(number){
        var self = this;
        self.list.removeAllChildren();
        cc.vv.popMgr.wait2('正在刷新数据',function(){
            var objKeys = Object.keys(self._userdata);
            var k = 0;
            var flag = false;
            for(var i = 0; i < objKeys.length; ++i){
    
                var data = self._userdata[objKeys[i]];
                if(data.job == 0){
                    flag = true;
                    let tagNode = cc.vv.utils.getChildByTag(self.list,data.userid+"");
                    if(tagNode == null){
                        var node = cc.instantiate(self.userPrefab);
                        node.myTag = data.userid;
                        self.list.addChild(node);
                        node.getComponent('AdminSet').init(data); 
                        if(++k>=number)break;
                    }
                }
            }
            cc.vv.popMgr.hide();
            if(!flag && !self._showTipFlag){
                cc.vv.popMgr.tip('没有成员可以添加');
                // self.node.destroy();
            }
        });
        
     },
 

    init:function(flag,normaldata){
        this._showTipFlag = flag;
        this._userdata = cc.vv.userMgr.clubUsers[cc.vv.userMgr.club_id];
        if(normaldata){
            this._userdata = normaldata[cc.vv.userMgr.club_id];
        }
        this.loadMember(24);
    },

    onEditChanged:function(event){
        this.ReqSearchMember();
    },
    ReqSearchMember(){ //成员管理搜索
        let player_id = this.textID.string;
        if(player_id == "" || !player_id){
            player_id = -1;
        }
        cc.vv.net1.quick("club_single_type_users",{club_id:cc.vv.userMgr.club_id,player_id:player_id});
    },
    onEditEnd:function(event){
      
        this.ReqSearchMember();
    },

    // search:function(text){
    //     for(var i = 0; i < this.list.childrenCount; ++i){
    //         var node = this.list.children[i];
    //         var myTag = node.myTag.toString();
    //         node.active = (myTag.indexOf(text) == 0);
    //     }
    // },

    editdel:function(){
        this.textID.string = '';
        this.ReqSearchMember();
    },

    check:function(){
        for(var i = 0; i < this.list.childrenCount; ++i){
            var node = this.list.children[i];
            var toggle = node.getComponent(cc.Toggle);
            if(toggle.isChecked){
                if(this.selected(node.myTag) !== null){
                    this._ary.push(this.selected(node.myTag));
                }
            }
        }
    },

    selected:function(myTag){
        for(var i in this._userdata){
            if(myTag === this._userdata[i].userid){
                return this._userdata[i];
            }
        }
        return null;
    },

    onBtnClicked:function(event){
        var self = this;
        this.check();
        for(var i = 0; i < this._ary.length; ++i){
            cc.vv.net1.quick("club_user_admin",{club_id:cc.vv.userMgr.club_id,
                user_id:self._ary[i].userid,is_admin:1});
        }
        this.node.destroy();
    },
    onClose(){
        this.node.destroy();
    },
    onDestroy(){
        cc.vv.club._normalUsersList = null;
        this.editdel();
    }

    // update (dt) {},
});
