cc.Class({
    extends: cc.Component,

    properties: {
        time:cc.Label,
        room_id:cc.Label,
        creator:cc.Label,
        creator_name:cc.Label,
        round:cc.Label,
        player:cc.Node,
        btnDetail:cc.Node,
        btnReplay:cc.Node,
        btnShare:cc.Node,
        gameName:cc.Label,
        ren:cc.Node,
        itemID:0,
    },
    updateID(id){
        this.itemID = id;
    },
    onLoad(){
        // if(cc.winSize.width / cc.winSize.height - 16 / 9 > 0.1){ 
        //     var width = cc.winSize.width;
        //     this.node.width = width-304;
        // }
        
        var self = this;

        var children = self.player.children;
     
        // if(self.node.name == "HistoryItem10"){
        //     self.player.removeAllChildren();
        // }

        //战绩数据
        this.node.on('history',function(ret){
            var data = ret;
            for(var i = 0; i < children.length; ++i){
                children[i].active = false;
            }
            self.time.string = data.time.replace(" ","\r\n");  ;
            self.room_id.string = data.room_id;
            self.creator.string = data.creator;
            self.creator_name.string = data.creator_name;
            self.gameName.string = data.name;
            var scores = data.scores.split(',');
            var names = data.names.split(',');
            var uids = data.uids.split(',');
            for(var i = 0; i < scores.length; ++i){
                // if(self.node.name == "HistoryItem10"){
                //     var node = cc.instantiate(self.ren);
                //     self.player.addChild(node);
                //     node.getChildByName('name').getComponent(cc.Label).string = names[i];
                //     node.getChildByName('score').getComponent(cc.Label).string = scores[i];
                //     node.getChildByName('userid').getComponent(cc.Label).string = '(' + uids[i] + ')';
                // }else{
                    if(i>5){
                        return;
                    }
                    children[i].active = true;
                    children[i].getChildByName('name').getComponent(cc.Label).string = names[i];
                    children[i].getChildByName('score').getComponent(cc.Label).string = scores[i];
                    children[i].getChildByName('userid').getComponent(cc.Label).string = '(' + uids[i] + ')';
                // }
            }
            // self.node.width = 1104;
            
            self._battle_id = data.battle_id;
            self.round.string = '';
            self.btnDetail.active = true;
            self.btnReplay.active = false;
            self.btnShare.active = false;
        });

        //战绩数据
        this.node.on('round',function(ret){

            var data = ret;

            for(var i = 0; i < children.length; ++i){
                children[i].active = false;
            }

            self.time.string = data.created.replace(" ","\r\n");
            var scores = data.scores.split(',');
            for(var i = 0; i < scores.length; ++i){
                children[i].active = true;
                children[i].getChildByName('score').getComponent(cc.Label).string = scores[i];
            }

            self.round.string = '第' + data.round + "局";
            var round = (data.round>=10)?data.round:"0"+data.round;
            self._replay_id = "" + data.battle_id + round + data.key;

            self.btnReplay.active = true;
            self.btnShare.active = true;
            self.btnDetail.active = false;
            // if(self.gameName.string == '赢三张'){
            //     self.btnReplay.active = false;
            //     self.btnShare.active = false;
            // }
        });
    },

    history:function(data){
        var children = this.player.children;
        for(var i = 0; i < children.length; ++i){
            children[i].active = false;
        }
        this.btnDetail.active = false;
        this.time.string = data.time.replace(" ","\r\n");
        this.room_id.string = data.room_id;
        this.creator.string = data.creator;
        this.creator_name.string = data.creator_name;
        this.gameName.string = data.name;
        var scores = data.scores.split(',');
        var names = data.names.split(',');
        var maxscore = 0;
        var uids = data.uids.split(',');
        for(var i=0;i< scores.length ;++i){
            if(parseFloat(scores[i]) > maxscore){
                maxscore = scores[i];
            }
        }
        for(var i = 0; i < scores.length; ++i){
            children[i].active = true;
            if(maxscore == 0){
                children[i].getChildByName('dayinjia').active = false;
            }else{
                children[i].getChildByName('dayinjia').active = scores[i] == maxscore;
            }
            children[i].getChildByName('name').getComponent(cc.Label).string = names[i];
            children[i].getChildByName('score').getComponent(cc.Label).string = scores[i];
            children[i].getChildByName('userid').getComponent(cc.Label).string = '(' + uids[i] + ')';
        }
        this.btnDetail.active = false;
        this.btnReplay.active = false;
        this.btnShare.active = false;
        this._battle_id = data.battle_id;
        this.round.string = '';
    },
    //根据选择分享不同内容
    share:function(){
        var text = "";
        var replay_history = '';
        if(this._replay_id == null){
            replay_history = this._battle_id + "";
        }else{
            replay_history = this._replay_id + "";
            
        }
        text = cc.GAME_NAME + " - 游戏回放码:" + replay_history + " - 点击复制";
        
        // var url = 'http://download.ccplays.com/history/jale/str/' + replay_history;
        // var imgurl = jsb.fileUtils.fullPathForFilename('res/raw-assets/resources/public/dairy_icon.png');
        // cc.vv.g3Plugin.shareText(platform,title,text,imgurl,url);
        cc.vv.g3Plugin.copyText(text);
        cc.vv.popMgr.alert("复制游戏回放码 "+replay_history+" 成功，可以去微信分享了");
    },
    onBtnClicked:function(event,data){
        var self = this;
        switch(event.target.name){
            case "btnDetail":{
                cc.vv.popMgr.wait2("战绩获取中",function(){
                    cc.vv.net1.quick("history_round",{battle_id:self._battle_id});
                })
            }
            break;
            case "btnReplay":{
                cc.vv.popMgr.wait2("正在准备回放",function(){
                    cc.vv.popMgr.hide();
                    cc.vv.net1.quick("history_replay",{replay_id:self._replay_id});
                })
            }
            break;
            case "btnShare":{
                // cc.vv.popMgr.open("Share",function(obj){
                //     obj.getComponent("Share").onhideshare(1);
                //     obj.getComponent("Share").share(self.share,self);
                // });
                self.share();
            }
            break;
            case "btnDetail_club":{
                cc.vv.popMgr.wait2("战绩获取中",function(){
                    cc.vv.net1.quick("club_history_round",{battle_id:self._battle_id});
                })
            }
            break;
            case "btnReplay_club":{
                cc.vv.popMgr.wait2("正在准备回放",function(){
                    cc.vv.popMgr.hide();
                    cc.vv.net1.quick("club_history_replay",{replay_id:self._replay_id});
                })
            }
            break;
            case "btnShare_club":{
                // cc.vv.popMgr.pop("Share",function(obj){
                //     obj.getComponent("Share").onhideshare(1);
                //     obj.getComponent("Share").share(self.share,self);
                // });
                self.share();
            }
            break;
        }
    },
});
