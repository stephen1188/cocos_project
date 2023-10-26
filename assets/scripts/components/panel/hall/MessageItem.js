cc.Class({
    extends: cc.Component,

    properties: {
        title:cc.Label,
        desc:cc.Label,
        status:cc.Sprite,
        statusAtlas:{
            default:null,
            type:cc.SpriteAtlas
        },
        _status:false,
        _content:null,
        _att_ticket:null,
        _userid:null,
        _msglist:null
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad(){
      
        var self = this;
        //消息数据
        this.node.on('new',function(ret){
            var data = ret;
            self.id = data.id;
            self.type = data.type;
            self.title.string = data.title;
            self.desc.string = data.desc!=undefined?data.desc:'';
            self._status = data.status;
            self._content = data.content;
            self._att_ticket = data.att_ticket;
            self._userid = data.userid;
            self.status.spriteFrame = data.status==0? self.statusAtlas.getSpriteFrame('dt_infor_new_img') : null;
        });
    },

    //已读
    setStatus:function(){
        this._status = 1;
        this.status.spriteFrame = null;
    },

    onBtnClicked:function(event){
        var self = this;
        switch(event.target.name){
             //查看消息详情
            case 'btn_chakan':{
                if(this.type == 0 || this.type >= 100){
                    if(this.type == 0 && this._status == 0){
                        var func = function(ret){
                            var data = ret.data;
                            if(ret.errcode !== 0){
                                cc.vv.popMgr.hide();
                                cc.vv.popMgr.alert(ret.errmsg);
                                return;
                            }
                            self.status.spriteFrame = null;
                        };
                        cc.vv.hall.addHandler("message_update_status",func);
                        cc.vv.net1.quick('message_update_status',{id:this.id});
                    }
                    
                    cc.vv.popMgr.pop('hall/MessageContent',function(obj){
                        obj.getComponent('MessageContent').message({id:self.id,content:self._content,
                                                                att_ticket:self._att_ticket,
                                                                status:self._status,userid:self._userid,type:self.type});
                    });
                }
                else if(this.type == 1){
                    cc.vv.net1.quick('user_invite_notice_by_message',{message_id:self.id});
                    this.node.destroy();
                }else if(this.type == 3){
                    cc.vv.net1.quick('invite_user_dealer_notice_by_message',{message_id:self.id});
                    this.node.destroy();
                }else if(this.type == 4){
                    cc.vv.net1.quick('club_friend_user_invite_notice_by_message',{message_id:self.id});
                    this.node.destroy();
                }
            }
            break;
        } 
    },

    onDestroy:function(){
        cc.vv.hall.removeHandler('message_update_status');
    }

    // update (dt) {},
});
