cc.Class({
    extends: cc.Component,

    properties: {
        IpNode:cc.Prefab,
        _btnOK:null,
        _btnBack:null,
        _onok:null,
        _repeat:null,
    },

    // use this for initialization
    onLoad: function () {
        this.iplist = this.node.getChildByName("iplist").getChildByName("view").getChildByName("content");
        this._btnOK = this.node.getChildByName("btn_ok");
        this._btnBack = this.node.getChildByName("btn_back");
        this._repeat = this.node.getChildByName("repeat");
        cc.vv.utils.addClickEvent(this._btnOK,this.node,"IpCheck","onBtnClicked");
    },
    
    onBtnClicked:function(event){

        cc.vv.audioMgr.click();
        
        if(event.target.name == "btn_ok"){
            if(this._onok){
                this._onok();
            }
        }
        if(this._repeat.getComponent(cc.Toggle).isChecked == true)
        cc.vv.roomMgr.ip_repeat = true;
        this.node.destroy();
    },
    

    show:function(content,onok,needcancel){
        this.iplist.removeAllChildren();
        if(cc.vv.roomMgr.real > 7){
            this.iplist.height = 300;
        }
        var str1 = "", str2 = "";
        for (var i in content) {
            for (var j in content[i].names) {
                //提示地址相同 处理一下昵称截断 防止广告
                str1 = cc.vv.utils.cutString(content[i].names[j],6);
                var ip = content[i].ip;
                if (ip.indexOf("::ffff:") != -1) {
                    ip = ip.substr(7);
                }
                str2 = "[ " + ip + " ]";
                var ipnode=cc.instantiate(this.IpNode);
                ipnode.getChildByName("content1").getComponent(cc.Label).string=str1;
                ipnode.getChildByName("content2").getComponent(cc.Label).string=str2;
                this.iplist.addChild(ipnode);
            }
        }
        this.node.active = true;
        this._onok = onok;
        // this._content.string = content;
        if(needcancel){
            this._btnBack.active = true; 
        }
        else{
            this._btnBack.active = false;
        }
    },
});
