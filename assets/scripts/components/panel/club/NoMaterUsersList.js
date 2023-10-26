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
    },

    onLoad:function(){
        var self = this;
        this.listview.on('bounce-bottom',function(){
            self.loadMember(18,self.textID.string);
        });
    },

    loadMember:function(number,text){
        var self = this;
        cc.vv.popMgr.wait2('正在刷新数据',function(){
            var objKeys = Object.keys(self._userdata);
            var k = 0;
            var flag = false;
            for(var i = 0; i < objKeys.length; ++i){
                var data = self._userdata[objKeys[i]];
                if(text != null && data.userid.toString().indexOf(text) != 0){
                    flag = true;
                    continue;
               }
               if(self._userdata[objKeys[i]].is_master == 0 && self._userdata[objKeys[i]].job != 9){
                    flag = true;
                    let tagNode = cc.vv.utils.getChildByTag(self.list,self._userdata[objKeys[i]].userid+"");
                    if(tagNode == null){
                        var node = cc.instantiate(self.userPrefab);
                        node.myTag = data.userid+"";
                        self.list.addChild(node);
                        node.getComponent('AdminSet').init(data); 
                        if(++k>=number)break;
                    }
               }
            }
            cc.vv.popMgr.hide();
            if(flag == false){
                cc.vv.popMgr.tip('没有成员可以添加');
                self.node.destroy();
            }
        });
        
     },
 

    init:function(){
        this._userdata = cc.vv.userMgr.clubUsers[cc.vv.userMgr.club_id];
        this.loadMember(24);
    },

    onEditChanged:function(event){
        this._text = event;
        this.loadMember(18,this.textID.string);
        this.search(event);
    },

    onEditEnd:function(event){
        var id = event.string;
        if(id == ''){
            return;
        }
        var text = parseFloat(id);
        if (text.toString() === "NaN"){
            cc.vv.popMgr.tip("请输入玩家数字ID");
            return;
        }
    },

    search:function(text){
        for(var i = 0; i < this.list.childrenCount; ++i){
            var node = this.list.children[i];
            var myTag = node.myTag.toString();
            node.active = (myTag.indexOf(text) == 0);
        }
    },

    editdel:function(event){
        this.textID.string = '';
        for(var i = 0; i < this.list.childrenCount; ++i){
            var node = this.list.children[i];
            node.active = true;
        }
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
            cc.vv.net1.quick("update_club_user_master",{club_id:cc.vv.userMgr.club_id,
                player_id:this._ary[i].userid,rate:0,is_master:1});
        }
        this.node.destroy();
        
    }

    // update (dt) {},
});
