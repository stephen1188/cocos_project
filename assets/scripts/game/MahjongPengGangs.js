cc.Class({
    extends: cc.Component,

    properties: {
    },

    // use this for initialization
    onLoad: function () {
        if(!cc.vv){
            return;
        }
        
        var gameChild = cc.find("Canvas/mgr/game");
        var myself = gameChild.getChildByName("myself");
        var pengangroot = myself.getChildByName("penggangs");
        var realwidth = cc.director.getVisibleSize().width;
        
        var self = this;
        this.node.on('peng_notify',function(data){
            self.onPengGangChanged(data);
        });

        this.node.on('chi_notify',function(data){
            self.onPengGangChanged(data);
        });
       
        this.node.on('gang_notify',function(data){
            self.onPengGangChanged(data.seatData);
        });
        
        this.node.on('game_begin',function(data){
            self.onGameBein();
        });

        this.node.on('login_finished',function(data){
            var seats = cc.vv.mahjongMgr._seats;
            for(var i in seats){
                self.onPengGangChanged(seats[i]);
            }
        });

        this.node.on('game_sync',function(data){
            var seats = cc.vv.mahjongMgr._seats;
            for(var i in seats){
                self.onPengGangChanged(seats[i]);
            }
        });
    },
    
    onGameBein:function(){
        this.hideSide("myself");
        this.hideSide("right");
        this.hideSide("up");
        this.hideSide("left");
    },
    
    //隐藏所有吃牌
    hideSide:function(side){
        var gameChild = cc.find("Canvas/mgr/game");
        var myself = gameChild.getChildByName(side);
        var pengangroot = myself.getChildByName("penggangs");
        if(pengangroot){
            for(var i = 0; i < pengangroot.childrenCount; ++i){
                pengangroot.children[i].active = false;
            }         
        }
    },
    


    onPengGangChanged:function(seatData){
        
        //没有任何吃碰杠操作
        if(seatData.angangs == null 
            && seatData.diangangs == null 
            && seatData.wangangs == null 
            && seatData.pengs == null 
            && seatData.chis == null){
            return;
        }
        var localIndex = cc.vv.roomMgr.viewChairID(seatData.seatIndex);
        var side = cc.vv.mahjongMgr.getSide(localIndex);
        var pre = cc.vv.mahjongMgr.getFoldPre(localIndex);

        var gameChild = cc.find("Canvas/mgr/game");
        var myself = gameChild.getChildByName(side);
        var pengangroot = myself.getChildByName("penggangs");
        
        for(var i = 0; i < pengangroot.childrenCount; ++i){
            pengangroot.children[i].active = false;
        }
        
        var targetSide = -1; 

        //暗杠
        var index = 0;
        var gangs = seatData.angangs;
        for(var i = 0; i < gangs.length; ++i){            
            targetSide = cc.vv.mahjongMgr.getTargetSide(seatData,gangs[i][0]);
            var mjid = [gangs[i][1],gangs[i][2],gangs[i][3],gangs[i][4]];
            this.initPengAndGangAndChis(pengangroot,side,pre,targetSide,index,mjid,"angang");
            index++;    
        }

        //点杠
        var gangs = seatData.diangangs;
        for(var i = 0; i < gangs.length; ++i){
            targetSide = cc.vv.mahjongMgr.getTargetSide(seatData,gangs[i][0]);
            var mjid = [gangs[i][1],gangs[i][2],gangs[i][3],gangs[i][4]];
            this.initPengAndGangAndChis(pengangroot,side,pre,targetSide,index,mjid,"diangang");
            index++;    
        }
        
        //弯杠
        var gangs = seatData.wangangs;
        for(var i = 0; i < gangs.length; ++i){       
            targetSide = cc.vv.mahjongMgr.getTargetSide(seatData,gangs[i][0]);     
            var mjid = [gangs[i][1],gangs[i][2],gangs[i][3],gangs[i][4]];
            this.initPengAndGangAndChis(pengangroot,side,pre,targetSide,index,mjid,"wangang");
            index++;    
        }
        
        //碰
        var pengs = seatData.pengs;
        if(pengs){
            for(var i = 0; i < pengs.length; ++i){     
                targetSide = cc.vv.mahjongMgr.getTargetSide(seatData,pengs[i][0]);              
                var mjid = [pengs[i][1],pengs[i][1],pengs[i][1]];
                this.initPengAndGangAndChis(pengangroot,side,pre,targetSide,index,mjid,"peng");
                index++;    
            }
        }

        //吃
        var chis =  seatData.chis;
        if(chis){
            for(var i=0;i<chis.length;i++){                    
                targetSide = chis[i][0];        
                var mjid = [chis[i][1],chis[i][2],chis[i][3]];
                this.initPengAndGangAndChis(pengangroot,side,pre,targetSide,index,mjid,"chi");
                index++;
            }
        }
    },
   
    //显示吃碰杠牌
    initPengAndGangAndChis:function(pengangroot,side,pre,targetSide,index,mjid,flag){
        var pgroot = null;
        if(pengangroot.childrenCount <= index){//如果碰杠 控件的 子控件小于等于 吃碰杠循环的数量的话
            if(side == "left" ){//如果是左边的玩家 就在左边添加一个  吃碰杠的 预制件
                pgroot = cc.instantiate(cc.vv.mahjongMgr.pengPrefabLeft);
            }else if(side == "right"){       //如果是右边的玩家 就在左边添加一个  吃碰杠的 预制件               
                pgroot = cc.instantiate(cc.vv.mahjongMgr.pengPrefabRight);            
            }
            else{  //否则 就在上下玩家添加一个  吃碰杠的 预制件    后面设定位置
                pgroot = cc.instantiate(cc.vv.mahjongMgr.pengPrefabSelf);
            }
            pengangroot.addChild(pgroot);    //把添加的预制件 放到 吃碰杠 集合 控件里
        }
        else{//就原样显示
            pgroot = pengangroot.children[index];
            pgroot.active = true;
        }
        //根据玩家的位置，移动吃碰杠预制件的位置
        if(side == "left"){
            pgroot.y = -(index * 33 * 3+index*1);  
        }
        else if(side == "right"){
            pgroot.y = (index * 33 * 3 +index *1);
            pgroot.setLocalZOrder(-index);
        }
        else if(side == "myself"){
            pgroot.x = index * 55 * 3 + index * 10;           
        }
        else{
            pgroot.x = -(index * 55*3+index *3);
            //pgroot.setLocalZOrder(-index);
        }

        //var sprites = pgroot.getComponentsInChildren(cc.Sprite);
        var  sprites = pgroot.children;//赋值吃碰杠预制件变量
        for(var s = 0; s < sprites.length-2; ++s){//循环 预制件的 子控件，因为最后一个控件是 点碰指示所有减 2       
            var sprite   = sprites[s].getComponent(cc.Sprite);//获取吃碰杠预制件中的麻将底图
            var mjSprite = sprites[s].children[0].getComponent(cc.Sprite);//获取吃碰杠预制件中的麻将底图
            var penggang_tip   = pgroot.getChildByName("peng_gang_tip");//获得 预制件的 吃碰杠 指示控件
            sprite.node.color = cc.color(255, 255, 255);
            sprite.node.opacity = 255;
            mjSprite.node.color = cc.color(255, 255, 255);

            if(sprite.node.name == "gang"){//如果是杠的话 就显示 吃碰杠 中的 杠麻将
                var isGang = ((flag != "peng") && (flag != "chi"));
                sprite.spriteFrame   = cc.vv.mahjongMgr.getBgSpriteFrame(side);
                mjSprite.spriteFrame = cc.vv.mahjongMgr.getSpriteFrameByMJID(pre,mjid[s]); 
                sprite.node.active = isGang;                
            }
            else{ 
                if(flag == "angang" || flag == "wangang"){
                    sprites[5].active = true
                }else{
                    sprites[5].active = false
                }
                if(flag == "angang"){//如果是暗杠
                    sprite.spriteFrame = cc.vv.mahjongMgr.getEmptySpriteFrame(side);//地图反面
                    mjSprite.spriteFrame = null;//花图隐藏
                    if(side == "myself" || side == "up"){
                        sprite.node.W = 54;
                        sprite.node.H = 73;                                                                                 
                    }
                    if(side == "myself"){
                        penggang_tip.rotation = 270;
                    }else if(side == "up"){
                        penggang_tip.rotation = 90;
                        penggang_tip.y = -51;
                    }else if(side == "left"){
                        penggang_tip.rotation = 0;  
                    }else if(side == "right"){
                        penggang_tip.rotation = 180;
                    }
                }
                else{  //明杠                                 
                    var mjIdx = s;//碰杠吃指示
                    if(side == "up" ||side == "right"){
                        if(s == 2){
                            mjIdx = 0;
                        }
                        else if(s == 0){
                            mjIdx = 2;
                        }
                        else {
                            mjIdx = 1;
                        }
                    }
                    var empty = false;
                    if(flag != "chi"){
                        if(targetSide == mjIdx){
                            if(mjIdx == 2){     //下家
                                if(cc.vv.roomMgr.ren == 2){
                                    if(side == "myself")
                                        penggang_tip.rotation = 90;
                                    else if(side == "up")
                                        penggang_tip.rotation = 270;
                                }
                                else if(cc.vv.roomMgr.ren == 3){
                                    if(side == "myself")
                                        penggang_tip.rotation = 180;
                                    else if(side == "left")
                                        penggang_tip.rotation = 270;
                                    else if(side == "right")
                                        penggang_tip.rotation = 0;
                                }else{
                                    if(side == "myself")
                                        penggang_tip.rotation = 180;
                                    else if(side == "left")
                                        penggang_tip.rotation = 270;
                                    else if(side == "right")
                                        penggang_tip.rotation = 90;
                                    else if(side == "up")
                                        penggang_tip.rotation = 0;
                                }
                                empty = true;
                            }
                            else if(mjIdx == 1){ //对家    
                                if (cc.vv.roomMgr.ren == 3){
                                    if (side == "myself")
                                        penggang_tip.rotation = 0;
                                    else if (side == "right")
                                        penggang_tip.rotation = 270;
                                    else if (side == "left")
                                        penggang_tip.rotation = 180;
                                }else{
                                    if (side == "myself")
                                        penggang_tip.rotation = 90;
                                    else if (side == "left")
                                        penggang_tip.rotation = 180;
                                    else if (side == "right")
                                        penggang_tip.rotation = 0;
                                    else if (side == "up")
                                        penggang_tip.rotation = 270;
                                }              
                                empty = true;                       
                            }
                            else if(mjIdx == 0){  //上家
                                if(cc.vv.roomMgr.ren == 2){
                                    if(side == "myself")
                                        penggang_tip.rotation = 90;
                                    else if(side == "up")
                                        penggang_tip.rotation = 270;
                                }
                                else if(cc.vv.roomMgr.ren == 3){
                                    if(side == "myself")
                                        penggang_tip.rotation = 0;
                                    else if(side == "left")
                                        penggang_tip.rotation = 180;
                                    else if(side == "right")
                                        penggang_tip.rotation = 270;
                                }else{
                                    if(side == "myself")
                                        penggang_tip.rotation = 0;
                                    else if(side == "left")
                                        penggang_tip.rotation = 90;
                                    else if(side == "right")
                                        penggang_tip.rotation = 270;
                                    else if(side == "up")
                                        penggang_tip.rotation = 180;
                                }
                                empty = true;
                            }
                            if(side == "up"){
                                penggang_tip.y = -51;
                                sprites[5].y = -51;
                            }
                        }
                    }
                    else{                         
                        if(targetSide == mjid[mjIdx]){
                            empty = true;
                        }                                      
                    }
                    
                    sprite.spriteFrame  =  cc.vv.mahjongMgr.getBgSpriteFrame(side);
                    mjSprite.spriteFrame = cc.vv.mahjongMgr.getSpriteFrameByMJID(pre,mjid[mjIdx]); 

                    // if(empty == true){
                    //     sprite.node.color = cc.color(124,202,137);
                    //     mjSprite.node.color = cc.color(124,202,137);
                    // }                    
                }
                
            }
        }
    },
});
