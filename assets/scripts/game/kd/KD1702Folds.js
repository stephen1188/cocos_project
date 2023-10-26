cc.Class({
    extends: cc.Component,

    properties: {
        _pointers:null,
        _folds:null,
        _huas:null,
    },

    // use this for initialization
    onLoad: function () {

        if(cc.vv == null){
            return;
        }
    },

    start(){
        this.initView();
        this.initEventHandler();
    },
    
    initView:function(){
        this._folds = {};
        this._pointers = {};
        this._huas = {};
        var sides = cc.vv.mahjongMgr._sides;
        for(var i = 0; i < sides.length; ++i){
            var sideName = sides[i];
            this._folds[sideName] = [];
            this._pointers[sideName] = [];
            this._huas[sideName] = [];
        }
    },

    initEventHandler:function(){

        var self = this;
        this.node.on('game_begin',function(data){
            // self.initAllFolds();
        });  
        
        this.node.on('login_finished',function(data){
            // self.initAllFolds();
        });  

        this.node.on('game_sync',function(data){
            // self.initAllFolds();
        });
        
        this.node.on('game_chupai_notify',function(data){
            // self.initFolds(data.seatData);
        });

        this.node.on('buhua_notify',function(data){
            // self.initFolds(data);
            // self.initHuas(data);
        });
        

        this.node.on('guo_notify',function(data){
            // self.initFolds(data);
        });
    },

    //选择牌 改变牌区的当前牌的颜色
    change_color_outcrad:function(pai){
        this._chupai_pai=pai;
        var seats = cc.vv.mahjongMgr._seats;
        for(var i in seats){
            var folds = seats[i].folds;
            if(folds == null){
                return;
            }
            var viewid = cc.vv.roomMgr.viewChairID(seats[i].seatIndex);
            for(var j = 0; j < folds.length; ++j){
                var index = j;
                var myTag = viewid + "_folds_" + index;
                var end = folds.length - 1;
                if (folds[j] == pai){
                    var info = {
                        isColor:true,
                    }
                    cc.vv.game.majiangTable.send_card_item_emit("folds", viewid, "setOutcrad", info, myTag);
                }else{
                    var info = {
                        isColor:false,
                    }
                    cc.vv.game.majiangTable.send_card_item_emit("folds", viewid, "setOutcrad", info, myTag);
                }
            }

            //碰杠
            var chipenggang = seats[i].chipenggang;
            if(chipenggang == null){
                return;
            }
            for(var j = 0; j < chipenggang.length; ++j){
                var index = j;
                var end = chipenggang.length - 1;
                var parent = cc.vv.game.majiangTable.getHoldParent(viewid, "penggangs");
                var myTag = viewid + "_nodeChipenggang_" + index;
                var nodeParent = cc.vv.utils.getChildByTag(parent,myTag);
                var myTag = viewid + "_chipenggang_"  + index + "_"  + 0;
                if (chipenggang[j][1][1] == pai){
                    var info = {
                        isColor:true,
                    }
                    cc.vv.game.majiangTable.send_card_emit(nodeParent, "setOutcrad", info, myTag);
                }else{
                    var info = {
                        isColor:false,
                    }
                    cc.vv.game.majiangTable.send_card_emit(nodeParent, "setOutcrad", info, myTag);
                }
                var myTag = viewid + "_chipenggang_"  + index + "_"  + 1;
                if (chipenggang[j][1][1] == pai){
                    var info = {
                        isColor:true,
                    }
                    cc.vv.game.majiangTable.send_card_emit(nodeParent, "setOutcrad", info, myTag);
                }else{
                    var info = {
                        isColor:false,
                    }
                    cc.vv.game.majiangTable.send_card_emit(nodeParent, "setOutcrad", info, myTag);
                }
                var myTag = viewid + "_chipenggang_"  + index + "_"  + 2;
                if (chipenggang[j][1][1] == pai){
                    var info = {
                        isColor:true,
                    }
                    cc.vv.game.majiangTable.send_card_emit(nodeParent, "setOutcrad", info, myTag);
                }else{
                    var info = {
                        isColor:false,
                    }
                    cc.vv.game.majiangTable.send_card_emit(nodeParent, "setOutcrad", info, myTag);
                }
                var myTag = viewid + "_chipenggang_"  + index + "_"  + 3;
                if (chipenggang[j][1][1] == pai){
                    var info = {
                        isColor:true,
                    }
                    cc.vv.game.majiangTable.send_card_emit(nodeParent, "setOutcrad", info, myTag);
                }else{
                    var info = {
                        isColor:false,
                    }
                    cc.vv.game.majiangTable.send_card_emit(nodeParent, "setOutcrad", info, myTag);
                }
            }
        }
    },

    //隐藏所有人出牌
    hideAllFolds:function(){
        var game = cc.find("Canvas/mgr/game");
        var sides = cc.vv.mahjongMgr._sides;
        for(var i = 0; i < sides.length; ++i){
            var sideName = sides[i];
            var sideRoot = game.getChildByName(sideName);
            var holds = sideRoot.getChildByName("folds").getChildByName("list");
            holds.removeAllChildren();
        }
    },

    //隐藏出的牌(放大显示)
    hideChupai:function(){
        if(cc.vv.mahjongMgr._turn == -1)return;
        if(cc.vv.mahjongMgr._turn == cc.vv.roomMgr.seatid){
            var viewid = cc.vv.roomMgr.viewChairID(cc.vv.mahjongMgr._turn); 
            var seatDataFolds = cc.vv.mahjongMgr._seats[cc.vv.mahjongMgr._turn];
            var folds = seatDataFolds.folds;
            var foldslength = folds.length;
            cc.vv.game.majiangTable.hideFolds(viewid, foldslength);
        }else{
            var viewid = cc.vv.roomMgr.viewChairID(cc.vv.mahjongMgr._turn);
            if(cc.vv.mahjongMgr._seats.length == 0){
                return;
            }
            var seatData = cc.vv.mahjongMgr._seats[cc.vv.mahjongMgr._turn];
            var folds = seatData.folds;
            var foldslength = folds.length;
            var myTag = viewid  + "_chupai_" + foldslength;
            //出的牌飞入牌堆
            var data = {
    
            }
            var parentchupai = cc.vv.game.majiangTable.getHoldParent(viewid, "holdschupai");
            cc.vv.game.majiangTable.send_card_emit(parentchupai, "nodeDestroy", data, myTag);
            var chupaiArr = cc.vv.game.majiangTable._chupaiArr;
            var tagIndex = chupaiArr.indexOf(myTag);
            if(tagIndex != -1){
                chupaiArr.splice(tagIndex, 1)
            }
        }
    },
    
    //初始化所有出牌
    initAllFolds:function(){
        var seats = cc.vv.mahjongMgr._seats;
        for(var i in seats){
            this.initFolds(seats[i]);
        }
        this.initPointer();
    },

    //隐藏所有出牌位置标识
    initPointer:function(){
        var sides = cc.vv.mahjongMgr._sides;
        for(var i = 0; i < sides.length; ++i){
            var sideName = sides[i];
            var viewid = cc.vv.mahjongMgr.getViewidBySide(sides[i]);
            var _pointersItem = this._pointers[sideName];
            for(var j = 0; j < _pointersItem.length; j++){
                var myTag = _pointersItem[j];
                var info = {
                    isShow:false,
                }
                cc.vv.game.majiangTable.send_card_item_emit("folds", viewid, "setPointer", info, myTag);
            }
        }
    },
    
    //初始化出牌
    initFolds:function(seatData){
        var folds = seatData.folds;
        if(folds == null){
            return;
        }
        
    },

    //出牌位置标识
    setSpritePointer:function(seatid,index,isShow){
        var viewid = cc.vv.roomMgr.viewChairID(seatid);
        this.initPointer();
        var myTag = viewid + "_folds_" + index;
        var info = {
            isShow:isShow,
        }
        cc.vv.game.majiangTable.send_card_item_emit("folds", viewid, "setPointer", info, myTag);
        this.setPointers(isShow, viewid, myTag);

        var infoShandian = {

        };
        cc.vv.game.majiangTable.send_card_item_emit("folds", viewid, "setShandian", infoShandian, myTag);
        // cc.vv.game.majiangTable.send_card_item_emit("folds", viewid, "sethu", infoShandian, myTag);
    },

    //记录红点牌tag
    setPointers:function(isAdd, viewid, data){
        var sides = cc.vv.mahjongMgr._sides;
        var sideName = sides[viewid];
        var _pointers = this._pointers[sideName];
        if(isAdd){
            var length = _pointers.length;
            _pointers[length] = data;
        }else{
            _pointers.splice(data, 1);
        }
    },

    //记录出牌牌tag
    setFolds:function(isAdd, viewid, data){
        var sides = cc.vv.mahjongMgr._sides;
        var sideName = sides[viewid];
        var _folds = this._folds[sideName];
        if(isAdd){
            var length = _folds.length;
            _folds[length] = data;
        }else{
            _folds.splice(data,1);
        }
    },

    //记录花牌tag
    setHua:function(isAdd, viewid, data){
        var sides = cc.vv.mahjongMgr._sides;
        var sideName = sides[viewid];
        var _huas = this._huas[sideName];
        if(isAdd){
            var length = _huas.length;
            _huas[length] = data;
        }else{
            _huas.splice(data,1);
        }
    },

});
