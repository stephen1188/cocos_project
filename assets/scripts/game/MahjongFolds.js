cc.Class({
    extends: cc.Component,

    properties: {
        _pointers:null,
        _folds:null,
        _huas:null,
        _chupaiSprite:[],
        _cradarea_outcrad:[],
        _chupaibgSprite:[],
    },

    // use this for initialization
    onLoad: function () {

        if(cc.vv == null){
            return;
        }
        
        this.initView();
        this.initEventHandler();
        cc.vv.folds = this;

    },
    
    initView:function(){
        this._folds = {};
        this._pointers = {};
        this._huas = {};
        var game = cc.find("Canvas/mgr/game");
        var sides = ["myself","right","up","left"];
        //cc.vv.mahjongMgr.chupaitime = 1;
        for(var i = 0; i < sides.length; ++i){
            var sideName = sides[i];
            var sideRoot = game.getChildByName(sideName);

            
            var foldRoot = sideRoot.getChildByName("folds").getChildByName("list");
             var count=0;//记录一行有多少给麻将
             var row=1;//记录有几行
             var folds = [];
            for(var j = 0; j < foldRoot.children.length; ++j){//这个节点下的子节点
                var n = foldRoot.children[j];
                if(cc.vv.roomMgr.ren == 2 && sideName == "myself"){
                 //如果是自己这边的牌区而且是两人场的时候
                    if (count==15 && row==3){//第三行到15张麻将的时候换行
                        row = 4;
                        count=0;
                    }else if (count==15 && row==2){//第二行到15张麻将的时候换行
                        row = 3;
                        count=0;
                    }else if (count==15){//一行到15张麻将的时候换行
                        row = 2;
                        count=0;
                    }if (row==1)
                        n.y=30;
                    else if(row==2)
                        n.y=75;
                    else if(row==3)
                        n.y=120;
                    else if(row==4)
                        n.y=165;
                    n.x=-335+47*count;//麻将的位置=初始位置+47（麻将的距离）*第几个麻将
                    count++;
                    n.zIndex=j;
                }else if(cc.vv.roomMgr.ren == 2 && sideName == "up"){
                    if (count==15 && row==3){//第三行到15张麻将的时候换行
                        row = 4;
                        count=0;
                    }else if (count==15 && row==2){//第二行到15张麻将的时候换行
                        row = 3;
                        count=0;
                    }else if (count==15){//一行到15张麻将的时候换行
                        row = 2;
                        count=0;
                    }if (row==1)
                        n.y=-30;
                    else if(row==2)
                        n.y=-75;
                    else if(row==3)
                        n.y=-120;
                    else if(row==4)
                        n.y=-165;
                    n.x=350-47*count;//麻将的位置=初始位置+47（麻将的距离）*第几个麻将
                    count++;
                    n.zIndex=j;
                } 
                n.active = false;
                folds.push(n); 
            } 
            this._folds[sideName] = folds;   
            this._pointers[sideName] = sideRoot.getChildByName("folds").getChildByName("folds_list").getChildByName("pointer"); 
            //this._chupaiSprite.push(sideRoot.getChildByName("folds").getChildByName("folds_list").getChildByName("ChuPai"));
            this._chupaiSprite[sideName] = sideRoot.getChildByName("folds").getChildByName("folds_list").getChildByName("ChuPai"); 
            this._cradarea_outcrad[sideName] = sideRoot.getChildByName("folds").getChildByName("cradarea_node").getChildByName("cradarea_outcrad"); 
            
            this._chupaibgSprite[sideName] = sideRoot.getChildByName("folds").getChildByName("folds_list").getChildByName("ChuPaiBg"); 
            // var huas = [];
            // var huaRoot = sideRoot.getChildByName("seat").getChildByName("piaohua");
            // for(var k=0;k< huaRoot.children.length;++k){
            //     var n = huaRoot.children[k];
            //     n.active = false;
            //     var sprite = n.getComponent(cc.Sprite);
            //     huas.push(sprite);
            // }
            // this._huas[sideName] = huas;
        }
        
        this.hideAllFolds();
    },
    
    //隐藏所有人手牌
    hideAllFolds:function(){
        for(var k in this._folds){
            var f = this._folds[i];
            for(var i in f){
                f[i].active = false;
            }
        }
    },
    
    initEventHandler:function(){

        var self = this;
        this.node.on('game_begin',function(data){
            self.initAllFolds();
        });  
        
        this.node.on('login_finished',function(data){
            self.initAllFolds();
        });  

        this.node.on('game_sync',function(data){
            self.initAllFolds();
        });
        
        this.node.on('game_chupai_notify',function(data){
            self.initFolds(data.seatData);
        });

        this.node.on('buhua_notify',function(data){
            self.initFolds(data);
            // self.initHuas(data);
        });
        

        this.node.on('guo_notify',function(data){
            self.initFolds(data);
        });
    },

    update:function(dt){
        if(cc.vv.mahjongMgr.chupaitime <= 0){
            this.hideChupai();
            return;
        }
        cc.vv.mahjongMgr.chupaitime -= dt;
    },
    
    //显示出牌
    showChupai:function(){

        var pai = cc.vv.mahjongMgr._chupai;
        if( pai >= 0 ){ 
            this.unschedule(this.one_timehidechupai);
            var turnlocalIndex =  cc.vv.roomMgr.viewChairID(cc.vv.mahjongMgr._turn);
            var side = cc.vv.mahjongMgr.getSide(turnlocalIndex);
            var spriteChuai = this._chupaiSprite[side].children[0].getComponent(cc.Sprite);
            spriteChuai.spriteFrame = cc.vv.mahjongMgr.getSpriteFrameByMJID("M_",pai);
            var ourcard = this._cradarea_outcrad[side].children[0].getComponent(cc.Sprite);
            ourcard.spriteFrame = cc.vv.mahjongMgr.getSpriteFrameByMJID("M_",pai);
            //显示所有人的出牌
            for(var i = 0; i < cc.vv.roomMgr.ren; ++i){
                var seatData = cc.vv.mahjongMgr._seats[i];
                var localIndex = cc.vv.roomMgr.viewChairID(i);        
                
                if(turnlocalIndex == localIndex){
                    
                    var folds = seatData.folds;
                    if(folds == null){
                        return;
                    }
                    //var pre = cc.vv.mahjongMgr.getFoldPre(localIndex);
                    var side = cc.vv.mahjongMgr.getSide(localIndex);
                    var foldsSprites = this._folds[side];
                    var index = 0;
                    index = folds.length;

                    var sprite = foldsSprites[index];
                    //if (seatData.baoTing_index != )
                    //获得第一个空位置x,y
                    
                    this._cradarea_outcrad[side].x = sprite.x;
                    this._cradarea_outcrad[side].y = sprite.y;
                    //this._chupaiSprite[side].x = sprite.x;
                    //this._chupaiSprite[side].y = sprite.y;
                    this._chupaibgSprite[side].active =true;
                    this._chupaiSprite[side].active = true;
                    this._cradarea_outcrad[side].active = true;
                    // if (side=="right" || side == "myself"){
                    //     this._chupaiSprite[side].setLocalZOrder(-99);
                    //     this._chupaibgSprite[side].setLocalZOrder(-99);
                    // }else{
                    //     //cc.find("Canvas/mgr/game").getChildByName(side).getChildByName("folds").getChildByName("cradarea_node").setLocalZOrder(100);
                    //     //this._cradarea_outcrad[side].setLocalZOrder(100);
                    // }

                    //cc.vv.mahjongMgr.chupaitime = 1;
                    //显示出牌位置
                    this.setSpritePointer(sprite,side);
                }
            }   
        }
    },
    one_timehidechupai:function(){
        var sides = ["myself","right","up","left"];
        for(var i = 0; i < sides.length; ++i){
            this._chupaiSprite[sides[i]].active = false;
            this._chupaibgSprite[sides[i]].active = false;
        } 
        this.unschedule(this.one_timehidechupai);
    },
    //延迟一秒后隐藏出的牌
    hideChupai:function(){
        this.unschedule(this.one_timehidechupai);
        this.schedule(this.one_timehidechupai,1);
    },
      //直接隐藏出的牌
    zeortime_hideChupai:function(){
        var sides = ["myself","right","up","left"];
        for(var i = 0; i < sides.length; ++i){
            this._chupaiSprite[sides[i]].active = false;
            this._chupaibgSprite[sides[i]].active = false;
        } 
    },
       //直接隐藏出的牌
    zeortime_hide_outcrad:function(){
        var sides = ["myself","right","up","left"];
        for(var i = 0; i < sides.length; ++i){
            this._cradarea_outcrad[sides[i]].active = false;
        } 
    },
    //选择牌 改变牌区的当前牌的颜色
    change_color_outcrad:function(pai){
        this._chupai_pai=pai;
        var seats = cc.vv.mahjongMgr._seats;
        var sides = ["myself","right","up","left"];
        for(var i in seats){
            var folds = seats[i].folds;
            if(folds == null){
                return;
            }
            var localIndex = cc.vv.roomMgr.viewChairID(seats[i].seatIndex);
            var side = cc.vv.mahjongMgr.getSide(localIndex);
            var foldsSprites = this._folds[side];
            for(var j = 0; j < folds.length; ++j){
                var index = j;
                var sprite = foldsSprites[index];
                if (folds[j] == pai){
                    sprite.color = new cc.color(0,255,0);
                }else{
                    sprite.color = new cc.color(255,255,255);
                }
            }
            for(var i = 0; i < sides.length; ++i){
                if(pai == cc.vv.mahjongMgr._chupai){
                    this._cradarea_outcrad[sides[i]].color = new cc.color(0,255,0);
                }else{
                    this._cradarea_outcrad[sides[i]].color = new cc.color(255,255,255);
                }
               
            } 
         
        
        }
    },
    //初始化所有手牌
    initAllFolds:function(){
        var seats = cc.vv.mahjongMgr._seats;
        for(var i in seats){
            this.initFolds(seats[i]);
            // this.initHuas(seats[i]);
        }
        this.initPointer();
    },

    //干嘛的？
    initHuas:function(seatData){
        var localIndex = cc.vv.roomMgr.viewChairID(seatData.seatIndex);
        var pre = cc.vv.mahjongMgr.getFoldPre(localIndex);
        var side = cc.vv.mahjongMgr.getSide(localIndex);
        var huasSprites = this._huas[side];

        for(var i = 0; i< huasSprites.length;++i){
            var sprite = huasSprites[i];
            sprite.node.active = false;
        }
        
        if(cc.vv.replayMgr.isReplay() != true){ 
            if(seatData.huas && seatData.huas.length > 0){
                var sprite = huasSprites[seatData.piaonum -2];
                sprite.node.active = true;
            }
        }
    },

    //隐藏所有出牌位置标识
    initPointer:function(){
        var sides = ["myself","right","up","left"];
        for(var i = 0; i < sides.length; ++i){
            this._pointers[sides[i]].active = false;
        }
    },
    
    //初始化出牌
    initFolds:function(seatData){

        var folds = seatData.folds;
        if(folds == null){
            return;
        }

        var localIndex = cc.vv.roomMgr.viewChairID(seatData.seatIndex);
        var pre = cc.vv.mahjongMgr.getFoldPre(localIndex);
        var side = cc.vv.mahjongMgr.getSide(localIndex);
        
        var foldsSprites = this._folds[side];
        for(var i = 0; i < folds.length; ++i){
            var index = i;
            // if(side == "up"){
            //     index = foldsSprites.length - i - 1;
            // }
            var sprite = foldsSprites[index];
    
            if (side=="right"){
                sprite.setLocalZOrder(1000- i);
            }else if(side == "myself"){
                sprite.setLocalZOrder(1000-i);
            }
            //this.hideChupai();//隐藏出的位置牌
            if (side=="up"||side=="myself"){
                sprite.getComponent(cc.Sprite).spriteFrame=cc.vv.mahjongMgr.getBackSpriteFrame("defaultum");
            }else if(side=="right"||side=="left"){
                sprite.getComponent(cc.Sprite).spriteFrame=cc.vv.mahjongMgr.getBackSpriteFrame("defaultlr");
            }
            if (seatData.baoTing_index != null || seatData.baoTing_index!=-1){//如果报听的扣到牌，不等于null 或 不等于 -1 
                if(i == seatData.baoTing_index){ //遍历牌区的牌的麻将，是第几张牌报听的。
                    sprite.children[0].active = false;//如果找到了就隐藏他的子节点，
                    sprite.getComponent(cc.Sprite).spriteFrame=cc.vv.mahjongMgr.getBackSpriteFrame(side);//且把他的图片换成倒扣
                }
            }
            if(sprite.active)continue;
            sprite.active = true;
            var mjSprite = sprite.children[0].getComponent(cc.Sprite);
            this.setSpriteFrameByMJID(pre,mjSprite,folds[i]);
            if (seatData.baoTing_index != null || seatData.baoTing_index!=-1){
                if(i == seatData.baoTing_index){
                    sprite.children[0].active = false;
                    sprite.getComponent(cc.Sprite).spriteFrame=cc.vv.mahjongMgr.getBackSpriteFrame(side);//且把他的图片换成倒扣
                }
            }
            //最后一张，位置标识
            // if(i == folds.length - 1){
            //     this.setSpritePointer(sprite,side);
            // }
        }

        for(var i = folds.length; i < foldsSprites.length; ++i){
            var index = i;
            // if(side == "up"){
            //     index = foldsSprites.length - i - 1;
            // }
            var sprite = foldsSprites[index];

            if(!sprite.active)break;
            sprite.active = false;
        }  
    },
    
    //更新出牌位置
    setSpriteFrameByMJID:function(pre,sprite,mjid){
        sprite.spriteFrame = cc.vv.mahjongMgr.getSpriteFrameByMJID(pre,mjid);
        sprite.node.active = true;
    },

    //出牌位置标识
    setSpritePointer:function(sprite,side){
        
        this.initPointer();
        this._pointers[side].active = true;

        switch(side){
            case "myself":
            {
                this._pointers[side].x = sprite.x;
                this._pointers[side].y = sprite.y+25;
            }
            break;
            case "right":
            {
                this._pointers[side].x = sprite.x;
                this._pointers[side].y = sprite.y + 25;
            }
            break;
            case "up":
            {   
                this._pointers[side].x = sprite.x;
                this._pointers[side].y = sprite.y+30;
            }
            break;
            case "left":
            {
                this._pointers[side].x = sprite.x;
                this._pointers[side].y = sprite.y + 25;
            }
            break;
        }
    }
});
