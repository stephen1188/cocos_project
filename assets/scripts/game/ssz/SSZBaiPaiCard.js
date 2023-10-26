cc.Class({
    extends: cc.Component,

    properties: {
        _taget:null,
        _dao:-1,
        _index:-1,
        _select:0,
        _pai:-1,
        _type:0,//type 1是十三张
    },

    //点击牌
    onBaiPaiClieck:function(){
        if (this._type != 1) {
            return
        }
        
        cc.vv.audioMgr.click();
        
        if(this._dao != -1){
            this._taget.cardCallback(this.node);
            return;
        }

        this._select = (this._select==1)?0:1;
        this.node.y = (this._select==0)?0:20;
    },

    setDao:function(dao){
        this._dao = dao;

        if(dao == -1){
            this.setEnabled(false);
        }else{
            this.setEnabled(true);
        }

    },

    setGameType:function(type) {
        this._type = type
    },

    setIndex:function(index){
        this._index = index;
    },

    getDao:function(){
        return this._dao;
    },

    getIndex:function(){
        return this._index;
    },

    getPai:function(){
        return this._pai;
    },


    isSelect:function(){
        return this._select;
    },

    setSelect:function(selected){
        this._select = selected;

        if(this._dao == -1){
            this.node.y = (this._select==0)?0:20;
        }
    },

    //显示牌
    setPai:function(pai){
        if(pai == 255){
            this.node.getComponent(cc.Sprite).spriteFrame = this._taget.sszGame.sszPokerAtlas.getSpriteFrame(255);
        }
        else{
            this.node.getComponent(cc.Sprite).spriteFrame = this._taget.sszGame.getsszPokerSpriteFrame(pai);
        }
        
        this._pai = pai;
    },

    setEnabled:function(enabled){
        if(enabled){
            var button = this.node.addComponent(cc.Button);
            button.node.on('click', this.onBaiPaiClieck, this);
        }else{
            this.node.removeComponent(cc.Button);
        }
    },

    setMaPai:function(pai){

        if(pai == 255){
            this.node.getChildByName("horse").active = false;
            return;
        }

        this.node.getChildByName("horse").active = (this._pai == pai);
    },

    setTaget:function(taget){
        this._taget = taget;
    }
});