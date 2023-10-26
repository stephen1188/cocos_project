cc.Class({
    extends: cc.Component,

    properties: {
        item:cc.Prefab,
        roomlist:cc.Prefab,
        room:cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.data = [];
        // for (let i = 0; i <150; i ++) {
        //     let norroun = 0;
        //     if(i%2 === 0){
        //         norroun = 0;
        //     }else{
        //         norroun = 1;
        //     }
        //     this.data[i] = {roomid: i, ruleid: i,now_round:norroun};
        // }
        cc.vv.club.roomPool = new cc.NodePool();
        var initCount = 40;
        for(var i = 0; i < initCount; i++){
            var room = cc.instantiate(this.item);
           cc.vv.club.roomPool.put(room);
        }
    },

    isToggled(value){
        // cc.log("value = ", value);
        // cc.log("cc.vv.userMgr.selectroom = ", cc.vv.userMgr.selectroom);
        for(var i = 0; i < cc.vv.userMgr.selectroom.length; i++){
            if(value == cc.vv.userMgr.selectroom[i]){
                return true;
            }
        }
        return null;
    },

    //加载显示桌子模版 如果之前已经有 则刷新显示，如果没有 则创建 inx为桌号
    refresh(inx){
        var root = this.newlist(cc.vv.userMgr.club_id,true);
        var content = root.getComponent(cc.ScrollView).content;
        var rules = cc.vv.userMgr.clublist[cc.vv.userMgr.club_id].rules;
        for(var i = 0; i < rules.length; ++i){
            var old = cc.vv.utils.getChildByTag(content,rules[i].id + "");
            var index = cc.vv.userMgr.roomlist[rules[i].conf.name];
            var value = this.isToggled(index);
            if(!value){
                continue;
            }
            if(old != null){
                if(rules[i].default == 0){
                    //old.destroy();
                   cc.vv.club.roomPool.put(old);
                }else if(cc.vv.userMgr.selectroom.length > 0&&value == null){
                    cc.vv.club.roomPool.put(old);
                }
            }
            if(rules[i].default == 1){
                if(cc.vv.userMgr.selectroom.length > 0&&value == null){
                    continue;
                }
                var node = cc.vv.utils.getChildByTag(content,rules[i].id + "");
                if(node == null){
                    if(cc.vv.club.roomPool.size() > 0){
                        node = cc.vv.club.roomPool.get();
                    }else{
                        node = cc.instantiate(this.item);
                    }
                    content.addChild(node);
                    node.myTag = rules[i].id + "";
                    node.roomid = 0;
                }
                //node.setSiblingIndex(inx++);
                node.zIndex = inx++;
                node.inxs = null;
                node.getComponent('ClubRoomItem').seat2(rules[i]);
                node.getComponent('ClubRoomItem').seatNumber(inx);
                this.setClubListNode(node);
            }
        }
        return inx;
    },

    removeRuleRoom(id,clubid){
        var flag = clubid == cc.vv.userMgr.club_id;
        var root = this.newlist(clubid,flag);
        if(root == null) return;
        var content = root.getComponent(cc.ScrollView).content;
        var node = cc.vv.utils.getChildByTag(content,id + "");
        if(node){
            //node.destroy();
           cc.vv.club.roomPool.put(node);
        }
        if(flag){
            this.OpenedRoomList(1);
        }
    },
  
    /**
     * 
     * @param {*} clubid 乐圈id
     * @param {*} flag 暂时不知道干啥
     * one === 是否有这个 roomlist
     * 这个要改
     */
    newlist(clubid,flag){
        for(var i in cc.vv.userMgr.clublist){
            var one = cc.vv.utils.getChildByTag(this.room,cc.vv.userMgr.clublist[i].club_id);
            if(cc.vv.userMgr.clublist[i].club_id == clubid){
                if(one == null){
                    if(clubid == cc.vv.userMgr.club_id){
                        one = cc.instantiate(this.roomlist);
                        one.myTag = cc.vv.userMgr.club_id;
                        this.room.addChild(one);
                    }                   
                }
                else{
                    if(flag){
                        one.active = true;
                    }
                }
            }else{
                if(one != null && flag){
                    one.active = false;
                }
            }
        }
        var node =  cc.vv.utils.getChildByTag(this.room,clubid);
        return node;
    },

    getRule(ruleid){
        var rules = cc.vv.userMgr.clublist[cc.vv.userMgr.club_id].rules;
        for(var i = 0; i < rules.length; i++){
            if(ruleid == rules[i].id){
                return rules[i].conf.name;
            }
        }
        return null;
    },
   
    OpenedRoomList:function(type){
        // cc.log("执行桌子刷新 开始1: type: ", type);
        // cc.log("cc.vv.userMgr.clubroom[cc.vv.userMgr.club_id] = ", cc.vv.userMgr.clubroom[cc.vv.userMgr.club_id]);
        if(!cc.vv.club.clubMain.active){ //当圈主删除规则的时候 没有打开我的圈子 不做此操作
            return;
        }
        this.clubListNode = [];
        this.curIndex = 0;
        var root = this.newlist(cc.vv.userMgr.club_id,true);

        //如果type==0 移除所有 并初始化scoreview拉到最顶部
        if(type == 0 ){
            root.getComponent(cc.ScrollView).content.removeAllChildren()
            root.getComponent(cc.ScrollView).scrollToTop(0);
        }
        
        //判断桌子是否应该移除
        var content = root.getComponent(cc.ScrollView).content;
        for(var i = 0; i < content.childrenCount; i++){
            var node = content.children[i];
            if(node.name == "ClubRuleTip"){
                node.removeFromParent();
            }
        }
        //设置背景大小
        content.getComponent(cc.Layout).enabled = true;
        if(cc.winSize.width / cc.winSize.height - 16 / 9 > 0.1){
            root.width = 1500;
            root.getChildByName('view').width = 1550;
            content.x = -750;
            content.scale = 1;
            content.width = 1500;
            content.getComponent(cc.Layout).spacingX = 120;
        }
        //获取到最新的桌子数据，从服务器端请求的最新数据
        var list = cc.vv.userMgr.clubroom[cc.vv.userMgr.club_id];
        // cc.log('list = ', list);
        // cc.log("content.childrenCount = ", content.childrenCount);
        // return;
        //初始化排序 所有桌子的zIndex=0 不分先后
        for(var i = 0; i < content.childrenCount; i++){
            var node = content.children[i];
            node.zIndex = 0;
        }
        var inx = 0;
        for(var i in list){
            //先处理 now_round==0的桌子，目测应该是未开局的，当前局数为0的桌子
            if(list[i].now_round == 0){
                //从content下的所有桌子中 根据roomid获取当前要处理的桌子
                var node = cc.vv.utils.getChildByTag(content,list[i].roomid + "");
                //获取到当前桌子在roomlist中的index
                var index = cc.vv.userMgr.roomlist[this.getRule(list[i].ruleid)];
                //判断是否显示该桌子 ， selectroom
                var value = this.isToggled(index);
                // cc.log('value = ', value);
                if(!value){
                    continue;
                }
                //桌子之前已经创建好了 并且也让显示了 cc.vv.club.roomPool.put(node);
                if(node != null){
                    if(cc.vv.userMgr.selectroom.length > 0&&value == null){
                        cc.vv.club.roomPool.put(node);
                        continue;
                    }
                }
                
                if(node == null){
                    //如果通过房间号没找到该桌子，则加载显示一个新桌子 有数据 但是之前桌子还未创建
                    if(cc.vv.userMgr.selectroom.length > 0&&value == null){
                        continue;
                    }
                    if(cc.vv.club.roomPool.size() > 0){
                        node = cc.vv.club.roomPool.get();
                    }else{
                        node = cc.instantiate(this.item);
                    }
                    node.myTag = list[i].roomid + "";
                    node.roomid = list[i].roomid;
                    content.addChild(node);
                }
                node.zIndex = inx++;
                node.inxs = i;
                node.getComponent('ClubRoomItem').seatNumber(inx);
                this.setClubListNode(node);
            }
        }
        
        // 第二步 加载桌子模版
        inx = this.refresh(inx);
        //第三步 处理已经开局的桌子显示
        for(var i in list){
            if(list[i].now_round > 0){
                var node = cc.vv.utils.getChildByTag(content,list[i].roomid + "")
                var index = cc.vv.userMgr.roomlist[this.getRule(list[i].ruleid)];
                var value = this.isToggled(index);
                if(!value){
                    continue;
                }
                if(node != null){
                    if(cc.vv.userMgr.selectroom.length > 0&&value == null){
                        cc.vv.club.roomPool.put(node);
                        continue;
                    }
                }
                if(node == null){
                    if(cc.vv.userMgr.selectroom.length > 0&&value == null){
                        continue;
                    }
                    if(cc.vv.club.roomPool.size() > 0){
                        node = cc.vv.club.roomPool.get();
                    }else{
                        node = cc.instantiate(this.item);
                    }
                    node.myTag = list[i].roomid + "";
                    node.roomid = list[i].roomid;
                    content.addChild(node);
                }

                node.zIndex = inx++;
                node.inxs = i;
                node.getComponent('ClubRoomItem').seatNumber(inx);
                this.setClubListNode(node);
            }
        }
        var delay = cc.delayTime(0.02)
        var callfunc = cc.callFunc(function(){
    
            this.showItem(root,list);
        
        }.bind(this));
        var seq = cc.sequence(delay,callfunc)
        root.stopAllActions()
        root.runAction(cc.repeatForever(seq))
    },
    setClubListNode(node){
        this.clubListNode.push(node);
    },
    showItem(root,list){
      if(this.curIndex >= this.clubListNode.length)
        {
          root.stopAllActions()
          return
        }

        var node = this.clubListNode[this.curIndex];
        if(!node){
            return;
        }
        node.active = true;
        let i = node.inxs;
        if(i){
            node.emit("new",list[i]);
        }
        this.curIndex += 1;
  
    },
    //个别房间有更新
    OpenedRoomChange(data){
        var flag = data.clubid == cc.vv.userMgr.club_id;
        var root = this.newlist(data.clubid,flag);
        if(root == null) return;
        var content = root.getComponent(cc.ScrollView).content;
        var node = cc.vv.utils.getChildByTag(content,data.roomid + "");
        var index = cc.vv.userMgr.roomlist[this.getRule(data.ruleid)];
        var value = this.isToggled(index);
        if(node){
            if(cc.vv.userMgr.selectroom.length > 0&&value == null){
                cc.vv.club.roomPool.put(node);
               return;
            }
            node.emit("new",data);
        }
        else{
            if(cc.vv.userMgr.selectroom.length > 0&&value == null){
               return;
            }
            if(cc.vv.club.roomPool.size() > 0){
                node = cc.vv.club.roomPool.get();
            }else{
                node = cc.instantiate(this.item);
            }
            //var node = cc.instantiate(this.item);
            node.myTag = data.roomid + "";
            node.roomid = data.roomid;
            content.addChild(node);
            node.emit("new",data);
        }
        if(flag){
            this.OpenedRoomList(1);
        }
    },

    //个别房间删除
    OpenedRoomRemove(data){
        var flag = data.data.clubid == cc.vv.userMgr.club_id;
        var root = this.newlist(data.data.clubid,flag);
        if(root == null) return;
        var content = root.getComponent(cc.ScrollView).content;
        var node = cc.vv.utils.getChildByTag(content,data.data.roomid + "");
        if(node){
            //node.destroy();
           cc.vv.club.roomPool.put(node);
        }
        if(flag){
            this.OpenedRoomList(1);
        }
    },

    /**
     * 重新整理
     */


});
