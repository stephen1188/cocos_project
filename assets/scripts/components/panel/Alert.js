cc.Class({
    extends: cc.Component,

    properties: {
        _btnOK:null,
        _btnBack:null,
        _content:null,
        _onok:null,
        _oncancel:null,
    },

    // use this for initialization
    onLoad: function () {
   
        this._content = this.node.getChildByName("content").getComponent(cc.Label);
        this._btnOK = this.node.getChildByName("btns").getChildByName("btn_ok");
        this._btnBack =  this.node.getChildByName("btns").getChildByName("btn_back");
        
        cc.vv.utils.addClickEvent(this._btnOK,this.node,"Alert","onBtnClicked");
        cc.vv.utils.addClickEvent(this._btnBack,this.node,"Alert","onBtnClicked");
    },
    
    onBtnClicked:function(event){

        cc.vv.audioMgr.click();
        
        if(event.target.name == "btn_ok"){
            if(this._onok){
                this._onok();
            }
        }else if(event.target.name == "btn_back"){
            
            if(this._oncancel){
                this._oncancel();
            }
        }

        cc.vv.utils.popRemove(this.node);   
    },
    
    show:function(content,onok,needcancel,oncancel){
        this.node.active = true;
        this._onok = onok;
        this._oncancel = oncancel;
        this._content.string = content;
        if(needcancel){
            this._btnBack.active = true;
        }
        else{
            this._btnBack.active = false;
        }
    },
});
