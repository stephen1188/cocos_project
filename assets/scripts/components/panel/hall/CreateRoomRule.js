cc.Class({
    extends: cc.Component,

    properties: {
    },

    // use this for initialization
    onLoad:function () {
        
        this._type = this.node.name;
        this._toggles =  this.node.getChildByName("toggles");
        
        if(this._type == "ysz" || this._type == "nn"){
            this._games =  this.node.getChildByName("ScrollView").getChildByName("view").getChildByName("content").getChildByName("games");
        }else{
            this._games =  this.node.getChildByName("games");
        }
        this._type2 = null;
    },

    start(){
        var last_game = null;
        if(this._type2 != null){
            cc.vv.utils.setToggleChecked(this._toggles,this._type2);
        }else{
            last_game = cc.sys.localStorage.getItem("last_game_" + this._type);
            if(last_game){
                cc.vv.utils.setToggleChecked(this._toggles,last_game);
            }
        }
        //选上最后玩的游戏
        // var last_game = cc.sys.localStorage.getItem("last_game_" + this._type);
        // if(last_game){
        //     cc.vv.utils.setToggleChecked(this._toggles,last_game);
        // }

        //默认被选中的玩法，如果没有默认，第一个
        var type = cc.vv.utils.toggleChecked(this._toggles);
        if(type == null){
            type = this._toggles.children[0].name;
            cc.vv.utils.setToggleChecked(this._toggles,type);
        }
        this.onBtnleiXingXuanZe(null,type);
    },

    config:function(data){
        this._type2 = data.conf.name;
        if(data.conf.name == "tdh_1600"){
            switch(data.conf.ren){
                case '2ren':{
                    this._type2 = 'tdh_1600_2';
                }
                break;
                case '3ren':{
                    this._type2 = 'tdh_1600_3';
                }
                break;
                case '4ren':{
                    this._type2 = 'tdh_1600_4';
                }
                break;
            }
        }else if(data.conf.name == "ra_1910"){
            switch(data.conf.ren){
                case '2ren':{
                    this._type2 = 'ra_1910_2';
                }
                break;
                case '3ren':{
                    this._type2 = 'ra_1910_3';
                }
                break;
                case '4ren':{
                    this._type2 = 'ra_1910_4';
                }
                break;
            }
        }else if(data.conf.name == "kd_1700"){
            switch(data.conf.ren){
                case '2ren':{
                    this._type2 = 'kd_1700_2';
                }
                break;
                case '3ren':{
                    this._type2 = 'kd_1700_3';
                }
                break;
                case '4ren':{
                    this._type2 = 'kd_1700_4';
                }
                break;
            }
        }
        return this._type2;
    },

      /**
     * 类型选择
     */
    onBtnleiXingXuanZe:function(event,detail){
        var str = this._type.substr(0,2);
        if(str == "nn" ){
            this.node.getChildByName("ScrollView").getComponent(cc.ScrollView).scrollToTop(0);
        }
        if(event != null){
            cc.vv.audioMgr.click();
        }
        if(detail == null)detail = event.target.name;
        for(var i = 0; i < this._games.children.length; ++i){
            var name = this._games.children[i].name;
            this._games.children[i].active = (detail == name);
        }
        this._type = detail;
    },
});
