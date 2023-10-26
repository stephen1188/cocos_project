

cc.Class({
    extends: cc.Component,

    properties: {
        wanfa:cc.Label,
        line:cc.Label,
        bmf:cc.Label,
        title:cc.Label,
        game:cc.Sprite,
        gameAtlas:{
            default:null,
            type:cc.SpriteAtlas
        },
        defaultToggle:cc.Toggle,
        Edidbox:cc.Node,
        a_name:cc.Label,
        ren:cc.Label,

        _type:0,
        is_default:0,
    },

    onLoad:function(){

    },
    info:function(data,type){
        this.node.myTag = data.id;
        this._type = data.type;
        var info = data.info.split(' ');
        this.showGame(data.conf.name);
        this.wanfa.string = '';
        for(var i = 1; i < info.length; ++i){
            this.wanfa.string += info[i] + ' ';
        }
        this.title.string = data.conf.title;
        this.ren.string = parseInt(data.conf.ren) + '人场';
        if(data.line != undefined){
            this.line.string = data.line; 
        }
        if(data.max != undefined){
            if(data.is_aa == 1){
                this.bmf.string = data.bmf;
            }else{
                this.bmf.string = data.max;
            }
        }
        this.defaultToggle.isChecked = data.default==1;
        this.is_default = data.default;
        this.a_name.string = data.name;
        this.node.a_name = data.name;
        this.a_name.node.stopAllActions();
        if(this.a_name.node.width > 168){
            var move = (this.a_name.node.width - 168) / 2;
            this.a_name.node.runAction(
                cc.repeatForever(
                    cc.sequence(cc.delayTime(1.0),cc.moveTo(2.0,cc.v2(move,this.a_name.node.y)),cc.delayTime(1.0),cc.moveTo(2.0,cc.v2(-move,this.a_name.node.y)))
                )
            );
        }

        if(type == 1){
            var button = this.node.addComponent(cc.Button);
            button.node.on('click', this.onGameClicked, this);
        }
    },

    showGame:function(name){
        var sprite = null;
        var game = '';
        switch(name){
            case "tdh_1600":{
                sprite = "img_btn_tdh";
                game = 'tdh';
            }
            break;
            case "kd_1700":{
                sprite = "img_btn_kd";
                game = 'kd';
            }
            break;
            case "ddz_1801":
            case "ddz_1803":
            case "ddz_1800":{
                sprite = "img_btn_ddz";
                game = 'ddz';
            }
            break;
            case "nn_1002":
            case "nn_1003":
            case "nn_1000":
            case "nn_1002":
            case "nn_1003":
            case "nn_1001":{
                sprite = "img_btn_nn";
                game = 'nn';
            }
            break;
            case "tjd_1301":
            case "tjd_1300":{
                sprite = "img_btn_pjd";
                game = 'tjd';
            }
            break;
            case "ysz_2300":{
                sprite = "img_btn_jss";
                game = 'ysz';
            }
            break;
            case 'gsj_2500':{
                sprite = "img_btn_gsj";
                game = 'gsj';
            }
            break;
            case 'kd_1702':{
                sprite = "img_btn_kd2";
                game = 'kd2';
            }
            break;
            case 'ttz_1401':
            case 'ttz_1402':
            case 'ttz_1400':{
                sprite = "img_btn_ttz";
                game = 'tjd';
            }
            break;
            case 'pdk_1900':{
                sprite = "img_btn_pdk";
                game = 'pdk';
            }
            break;
            case 'dsg_2100':
            case 'dsg_2101':{
                sprite = "img_btn_dsg";
                game = 'dsg';
            }
            break;
            case 'dq_2700':{
                sprite = "img_btn_pdk";
                game = 'dq';
            }
            break;
            // case 'zpj_2800':
            // case 'zpj_2801':{
            //     sprite = "img_btn_zpj";
            //     game = 'zpj';
            // }
            // break;
            case 'zgz_3300':{
                sprite = "img_btn_zgz";
                game = 'zgz';
            }
            break;
            case 'hs_3100':{
                sprite = "img_btn_huashui";
                game = 'hs';
            }
            break;
        }
        this._gameName = game;
        this.game.spriteFrame = this.gameAtlas.getSpriteFrame(sprite);
        //this.game.node.setContentSize(209.3,200.9);
    },

    onGameClicked:function(){
        cc.vv.audioMgr.click();
        if(cc.vv.userMgr.clublist[cc.vv.userMgr.club_id].userStatus == -1){
            cc.vv.popMgr.alert('你无法在该乐圈游戏');
            return;
        }
        var club_room_create = {
            method:"club_room_create",
            data:{
                version:cc.SERVER,
                club_id:cc.vv.userMgr.club_id,
                model:this._type == 0 ? 2 : 3,
                id:this.node.myTag,
                location:cc.vv.global.latitude + "," + cc.vv.global.longitude
            }
        };
        cc.vv.popMgr.wait("正在创建房间",function(){
            cc.vv.net1.send(club_room_create);
        });
        cc.vv.userMgr.clubRoomEnter = cc.vv.userMgr.club_id;
    },

    onBtnClicked:function(event){
        var self = this;
        cc.vv.audioMgr.click();
        let names = event.name || event.target.name;
        this.defaultToggle.isChecked = !this.defaultToggle.isChecked
        switch(names){
            case "toggle_zidong":{
                //自动开桌
                var rule = null;
                var rules = cc.vv.userMgr.clublist[cc.vv.userMgr.club_id].rules;
                for(var i = 0; i < rules.length; ++i){
                    if(this.node.myTag == rules[i].id && this._type == rules[i].type){
                        rule = rules[i];
                        break;
                    }
                }
                var club_create_rule = null;
                if(this._type == 0){
                    club_create_rule = {
                        method:"club_create_rule_ptz",
                        data:{
                            version:cc.SERVER,
                            conf:rule.conf,
                            info:rule.conf.desc,
                            club_id:cc.vv.userMgr.club_id,
                            id:this.node.myTag,
                            index:0,
                            default:this.defaultToggle.isChecked ? 1 : 0,
                            name:this.a_name.string
                        }
                    };
                }else{
                    club_create_rule = { //修改规则
                        method:"club_create_rule_pwz",
                        data:{
                            version:cc.SERVER,
                            conf:rule.conf,
                            info:rule.conf.desc,
                            club_id:cc.vv.userMgr.club_id,
                            id:this.node.myTag,
                            line:rule.line,
                            max:rule.max,
                            other:rule.other,
                            reward:rule.reward,
                            free:rule.free,
                            min:rule.min,
                            max_reward:rule.max_reward,
                            bmf:rule.bmf,
                            is_aa:rule.is_aa,
                            is_mute:rule.is_mute,
                            index:0,
                            default:this.defaultToggle.isChecked ? 1 : 0,
                            name:rule.name
                        }
                    }
                }
                cc.vv.popMgr.wait("正在保存规则",function(){
                    cc.vv.net1.send(club_create_rule);
                })
            }
            break;
            case "btn_del":{
                cc.vv.popMgr.alert('是否确认删除规则?',function(){
                    cc.vv.popMgr.wait('正在删除规则',function(){
                        if(self._type == 0){
                            cc.vv.net1.quick("club_delete_rule_ptz", {id:self.node.myTag,club_id:cc.vv.userMgr.club_id});
                        }else{
                            cc.vv.net1.quick("club_delete_rule_pwz", {id:self.node.myTag,club_id:cc.vv.userMgr.club_id});
                        }
                        
                    });
                },true);
            }
            break;
            case "btn_edit":{
                if(this._type == 1){
                    cc.vv.hall.create_room = 3;
                }
                else{
                    cc.vv.hall.create_room = 2;
                }
                cc.vv.userMgr.club_rule_id = this.node.myTag;
                var rule = null;
                var rules = cc.vv.userMgr.clublist[cc.vv.userMgr.club_id].rules;
                for(var i = 0; i < rules.length; ++i){
                    if(this.node.myTag == rules[i].id){
                        rule = rules[i];
                    }
                }
                if(rule == null){
                    cc.vv.popMgr.tip('规则不存在');
                    return;
                }
                cc.vv.popMgr.pop('hall/new_CreateRoom',function(obj){
                    obj.emit('config',{rule:rule,game:self._gameName});

                });
            }
            break;
            case 'name_edit':{
                //this.Edidbox.active = true;
                var rule = null;
                var rules = cc.vv.userMgr.clublist[cc.vv.userMgr.club_id].rules;
                for(var i = 0; i < rules.length; ++i){
                    if(this.node.myTag == rules[i].id){
                        rule = rules[i];
                    }
                }
                if(rule == null){
                    cc.vv.popMgr.tip('规则不存在');
                    return;
                }
                var club_create_rule = null;
                if(this._type == 0){
                    club_create_rule = {
                        method:"club_create_rule_ptz",
                        data:{
                            version:cc.SERVER,
                            conf:rule.conf,
                            info:rule.conf.desc,
                            club_id:cc.vv.userMgr.club_id,
                            id:this.node.myTag,
                            index:0,
                            default:this.is_default,
                        }
                    };
                }else{
                    club_create_rule = { // 修改名字
                        method:"club_create_rule_pwz",
                        data:{
                            version:cc.SERVER,
                            conf:rule.conf,
                            info:rule.conf.desc,
                            club_id:cc.vv.userMgr.club_id,
                            id:this.node.myTag,
                            line:rule.line,
                            max:rule.max,
                            other:rule.other,
                            reward:rule.reward,
                            free:rule.free,
                            min:rule.min,
                            max_reward:rule.max_reward,
                            bmf:rule.bmf,
                            is_aa:rule.is_aa,
                            is_mute:rule.is_mute,
                            index:0,
                            default:this.is_default,
                        }
                    };
                }
                cc.vv.popMgr.pop("club/ClucRuleNameEdit",function(obj){
                    obj.getComponent("ClucRuleNameEdit").show(club_create_rule);
                });
            }
            break;
        }
    },

    editEnd:function(event){
        // if(event.string == ""){
        //     cc.vv.popMgr.tip("别名不能为空");
        //     return;
        // }
        // //this.a_name.string = event.string;
        // this.Edidbox.active = false;
        // var rule = null;
        // var rules = cc.vv.userMgr.clublist[cc.vv.userMgr.club_id].rules;
        // for(var i = 0; i < rules.length; ++i){
        //     if(this.node.myTag == rules[i].id){
        //         rule = rules[i];
        //     }
        // }
        // var club_create_rule = null;
        // if(this._type == 0){
        //     club_create_rule = {
        //         method:"club_create_rule_ptz",
        //         data:{
        //             version:cc.SERVER,
        //             conf:rule.conf,
        //             info:rule.conf.desc,
        //             club_id:cc.vv.userMgr.club_id,
        //             id:this.node.myTag,
        //             index:0,
        //             default:this.is_default,
        //             name:event.string
        //         }
        //     };
        // }else{
        //     club_create_rule = {
        //         method:"club_create_rule_pwz",
        //         data:{
        //             version:cc.SERVER,
        //             conf:rule.conf,
        //             info:rule.conf.desc,
        //             club_id:cc.vv.userMgr.club_id,
        //             id:this.node.myTag,
        //             line:rule.line,
        //             max:rule.max,
        //             other:rule.other,
        //             reward:rule.reward,
        //             free:rule.free,
        //             min:rule.min,
        //             max_reward:rule.max_reward,
        //             bmf:rule.bmf,
        //             is_aa:rule.is_aa,
        //             index:0,
        //             default:this.is_default,
        //             name:event.string
        //         }
        //     };
        // }
        // cc.vv.popMgr.wait("正在保存规则",function(){
        //     cc.vv.net1.send(club_create_rule);
        // })
    }

    // update (dt) {},
});
