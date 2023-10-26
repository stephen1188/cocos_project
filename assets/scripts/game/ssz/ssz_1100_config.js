cc.Class({
    extends: cc.Component,

    properties: {
        _view:null,
    },

    // use this for initialization
    onLoad: function () {
        this.loadSaveConfig();
    },

    //载入保存项
    loadSaveConfig:function(){

        var ssz = cc.sys.localStorage.getItem("last_game_ssz_1100");
        if(ssz){
            ssz = JSON.parse(ssz);
            cc.vv.utils.setToggleChecked(this.node.getChildByName('ju'),ssz.ju);
            cc.vv.utils.setToggleChecked(this.node.getChildByName('wanfa'),ssz.wanfa);
            cc.vv.utils.setToggleChecked(this.node.getChildByName('mapai'),ssz.mapai);
            cc.vv.utils.setToggleChecked(this.node.getChildByName('fufei'),ssz.fufei);
            cc.vv.utils.setToggleChecked(this.node.getChildByName('quanleida'),ssz.quanleida);

            var ma = (ssz.mapai == 0)?false:true;
            this.node.getChildByName('daima').getComponent(cc.Toggle).isChecked = ma;

            var event = new cc.Event.EventCustom('click', true);
            event.isChecked = ma;
            this.onSSZMapaiToggle(event,null);
        }
    },

    onSSZMapaiToggle:function(event,data){
        var check = event.isChecked;
        var node = this.node.getChildByName("mapai");
        for(var i = 0; i < node.children.length - 1; ++i){
            var toggle =  node.children[i].getComponent(cc.Toggle);
            if(!check)toggle.isChecked = check;
            toggle.interactable = check;
        }

        if(check == false){
            node.getChildByName("x").getComponent(cc.Toggle).isChecked = true;
        }else if(check){
            if(node.getChildByName("x").getComponent(cc.Toggle).isChecked){
                node.getChildByName("1").getComponent(cc.Toggle).isChecked = true;
            }
        }
    },

    /**
     * 十三张 选项控制
     * @param {*} event 
     * @param {*} detail 
     */
    onBtnSSZContorl(event,detail){
        
        var that = this;
        var view = this.node;
        var daqiang = cc.vv.utils.toggleChecked(view.getChildByName('daqiang'));
        var quanleida = cc.vv.utils.toggleChecked(view.getChildByName('quanleida'));
        var ren = cc.vv.utils.toggleChecked(view.getChildByName('ren'));
        var jiase = cc.vv.utils.toggleChecked(view.getChildByName('jiase'));
        
        switch(event.target.parent.name){
            case "6ren":{
                cc.vv.utils.setToggleChecked(view.getChildByName('jiase'),'jia2');
            }
            break;
            case "5ren":{
                if(jiase == 'bujia'){
                    cc.vv.utils.setToggleChecked(view.getChildByName('jiase'),'jia1');
                }
            }
            break;
            case "bujia":{
                if(ren == '6ren' || ren == '5ren'){
                    cc.vv.utils.setToggleChecked(view.getChildByName('ren'),'4ren');
                }
            }
            break;
            case "jia1":{
                if(ren == '6ren'){
                    cc.vv.utils.setToggleChecked(view.getChildByName('ren'),'5ren');
                }
            }
            break;
            case "cheng2":{
                if(event.target.parent.parent.name == 'quanleida' && quanleida == "cheng2"){
                    cc.vv.utils.setToggleChecked(view.getChildByName('daqiang'),'cheng2');
                }

                if(event.target.parent.parent.name == 'daqiang' && daqiang == undefined){
                    cc.vv.utils.setToggleChecked(view.getChildByName('quanleida'),'');
                }
            }
            break;
        }
    },


    /**
     * 牛牛选项
     */
    Config:function(){
        
        var ju =  cc.vv.utils.toggleChecked(this.node.getChildByName('ju'));
        var wanfa =  cc.vv.utils.toggleChecked(this.node.getChildByName('wanfa'));
        var fufei =  cc.vv.utils.toggleChecked(this.node.getChildByName('fufei'));
        var mapai =  cc.vv.utils.toggleChecked(this.node.getChildByName('mapai'));
        var daqiang =  cc.vv.utils.toggleChecked(this.node.getChildByName('daqiang'));
        var quanleida =  cc.vv.utils.toggleChecked(this.node.getChildByName('quanleida'));
        

        if(this.node.getChildByName('daima').getComponent(cc.Toggle).isChecked == false){
            mapai = 0;
        }

        var conf = {
            name:'ssz_1100',
            wanfa:wanfa,
            fufei:fufei,
            daqiang:daqiang,
            mapai:mapai,
            jys:'',
            quanleida:quanleida
        }; 

        return conf;
    },
});
