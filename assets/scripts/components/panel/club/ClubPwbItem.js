cc.Class({
    extends: cc.Component,

    properties: {
        created:cc.Label,
        user_name:cc.Label,
        player_name:cc.Label,
        pwb:cc.Label,
        before_pwb:cc.Label,
        after_pwbz:cc.Label,
        room_id:cc.Label,
        game_name:cc.Label,
        bmf:cc.Label,
        master_bmf:cc.Label
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {

        if(cc.winSize.width / cc.winSize.height - 16 / 9 > 0.1){ 
            var width = cc.winSize.width;
            if(this.node.name == "PwbItem3"){
                this.node.width = width-354;
            }else{
                this.node.width = width;
            }
            
        }
        var self = this;
        this.node.on('new',function(ret){
            var data = ret;
            self.created.string = data.created.replace(/ /g,"\n");

            if(self.user_name){
                // if(data.user_name == data.player_name && data.userid == cc.vv.userMgr.userid){
                //     self.user_name.string = '您';
                // }
                // else{
                //     self.user_name.string = 'ID:' + data.userid + '  ' + data.user_name;
                // }
                self.user_name.string = 'ID:' + data.userid + '  ' + data.user_name;
            }

            if(self.player_name){
                self.player_name.string = 'ID:' + data.playerid + '  ' + data.player_name;
            }

            if(data.pwb >= 0){
                self.pwb.node.color = new cc.Color(255, 0, 0);
            }
            else{
                self.pwb.node.color = new cc.Color(68, 31, 2);
            }
            var op = data.pwb > 0 ? '+' : '';
            self.pwb.string = op + data.pwb;

            if(self.after_pwbz){
                if(data.after_pwb >= 0){
                    self.after_pwbz.node.color = new cc.Color(255, 0, 0);
                }
                else{
                    self.after_pwbz.node.color = new cc.Color(68, 31, 2);
                }
                if(self.node.name == 'PwbItem1' || self.node.name == 'PwbItem2'){
                    self.after_pwbz.string = '剩余:' + data.after_pwb;
                }else{
                    self.after_pwbz.string = data.after_pwb;
                }
            }

            if(self.before_pwb){
                self.before_pwb.string = data.before_pwb;
            }

            if(self.room_id){
                self.room_id.string = '房间号:' + data.room_id;
            }
            if(self.game_name){
                self.game_name.string = data.game_name;
            }
            if(self.bmf){
                self.bmf.string = data.bmf;
            }
            if(self.master_bmf){
                self.master_bmf.string = '(' + data.master_bmf + ')';
                self.master_bmf.node.active = data.master_bmf != 0;
            }
            
        });
    },

    // update (dt) {},
});
