cc.Class({
    extends: cc.Component,

    properties: {
    },

    // use this for initialization
    onLoad: function () {
        this.index = 2;
        this.qieguo_index = 0;
        this.guodi = this.node.getChildByName('guodi').getChildByName("bg").getChildByName("difennum").getComponent(cc.Label);
        this.guodiArr = ["60", "80", "100", "200", "300", "500"];
        this.qieguo = this.node.getChildByName('qieguo').getChildByName("bg").getChildByName("difennum").getComponent(cc.Label);
        this.qieguoArr = ["5", "8"];
        this.loadSaveConfig();
    },

    //载入保存项
    loadSaveConfig:function(){

        //大众牛牛
        var conf = cc.sys.localStorage.getItem("last_game_nn_1001");
        if(conf){
            var json = JSON.parse(conf);
            cc.vv.utils.setToggleChecked(this.node.getChildByName('ju'),json.ju);
            cc.vv.utils.setToggleChecked(this.node.getChildByName('wanfa'),json.wanfa);
            cc.vv.utils.setToggleChecked(this.node.getChildByName('fangzuobi'),json.fangzuobi);
            //cc.vv.utils.setToggleChecked(this.node.getChildByName('guodi'),json.guodi);
            //cc.vv.utils.setToggleChecked2(this.node.getChildByName('fengding'),json.fengding,1);
            var idx = json.guodi.indexOf("d");
            
            if(json.insane != null){
                cc.vv.utils.setToggleChecked(this.node.getChildByName('insane'),json.insane);
            }
            if(json.guodi != null){
                this.guodi.string = json.guodi.substring(0,idx);
            }
            if(json.fengding){
                if(json.fengding == 1){
                    this.qieguo.string = "5";
                }else if(json.fengding == 2){
                    this.qieguo.string = "8";
                }
            }
            
           
            for (var index = 0; index < this.guodiArr.length; index++) {
                if(this.guodi.string == this.guodiArr[index]){
                    this.index = index;
                }
            }
        }
    },
    loadSaveConfig2:function(data){
        var json = data.conf;
        cc.vv.utils.setToggleChecked(this.node.getChildByName('ju'),json.ju);
        cc.vv.utils.setToggleChecked(this.node.getChildByName('wanfa'),json.wanfa);
        cc.vv.utils.setToggleChecked(this.node.getChildByName('guodi'),json.guodi);
        cc.vv.utils.setToggleChecked(this.node.getChildByName('fangzuobi'),json.fangzuobi);
        //cc.vv.utils.setToggleChecked2(this.node.getChildByName('fengding'),json.fengding,1);
        var idx = json.guodi.indexOf("d");
        if(json.insane != null){
            cc.vv.utils.setToggleChecked(this.node.getChildByName('insane'),json.insane);
        }
        if(json.guodi != null){
            this.guodi.string = json.guodi.substring(0,idx);
        }
        if(json.fengding){
            if(json.fengding == 1){
                this.qieguo.string = "5";
            }else if(json.fengding == 2){
                this.qieguo.string = "8";
            }
        }
        for (var index = 0; index < this.guodiArr.length; index++) {
            if(this.guodi.string == this.guodiArr[index]){
                this.index = index;
            }
        }
    },
    //按钮事件
    onBtnClick:function(event, data){
        var self = this;
        switch(event.target.name){
            case "add":{
                this.index += 1;
                var length = this.guodiArr.length;
                var guodi = this.guodiArr[this.index % length];
                this.guodi.string = guodi;
            }
            break;
            case "sub":{
                var length = this.guodiArr.length;
                this.index -= 1;
                if(this.index < 0){
                    this.index += length
                }
                var guodi = this.guodiArr[this.index % length];
                this.guodi.string = guodi;
            }
            break;
        }
    },
    //切锅
    onBtnqieguo:function(event, data){
        var self = this;
        switch(event.target.name){
            case "add":{
                this.qieguo_index += 1;
                var length = this.qieguoArr.length;
                var qieguo = this.qieguoArr[this.qieguo_index % length];
                this.qieguo.string = qieguo;
            }
            break;
            case "sub":{
                var length = this.qieguoArr.length;
                this.qieguo_index -= 1;
                if(this.qieguo_index < 0){
                    this.qieguo_index += length
                }
                var qieguo = this.qieguoArr[this.qieguo_index % length];
                this.qieguo.string = qieguo;
            }
            break;
        }
    },


    /**
     * 牛牛选项
     */
    Config:function(){
        
        var ju = cc.vv.utils.toggleChecked(this.node.getChildByName('ju'));
        var wanfa = cc.vv.utils.toggleChecked(this.node.getChildByName('wanfa'));
        var fangzuobi = cc.vv.utils.toggleChecked(this.node.getChildByName('fangzuobi'));
        //var guodi = cc.vv.utils.toggleChecked(this.node.getChildByName('guodi'));
        var fengding = this.node.getChildByName('fengding').getChildByName('qieguo').getComponent(cc.Toggle).isChecked ? 1 : 0;
        var insane = cc.vv.utils.toggleChecked(this.node.getChildByName('insane'));
        var guodi = this.guodi.string;
        var desc = [];
        desc.push("锅底"+guodi+"分");
        cc.vv.userMgr.guodi = parseInt(guodi);
        // //锅底
        // switch (guodi) {
        //     case "100di": {
        //         desc.push("锅底100分");
        //         cc.vv.userMgr.guodi = 100;
        //     }
        //     break;
        //     case "200di": {
        //         desc.push("锅底200分");
        //         cc.vv.userMgr.guodi = 200;
        //     }
        //     break;
        //     default:{
        //         desc.push("锅底300分");
        //         cc.vv.userMgr.guodi = 300;
        //     }
        //     break;
        // }

        //局数
        // switch (ju) {
        //     case "40ju": {
        //         desc.push("40局封顶");
        //     }
        //     break;
        //     default:{
        //         desc.push("30局封顶");
        //     }
        //     break;
        // }
        //疯狂模式
        switch(insane){
            case "1":{
                desc.push('疯狂加倍');
            }
            break;
        }
        //玩法
        switch (wanfa) {
        case "ko1": {
           desc.push("扣1张");
        }
        break;
        case "ko2": {
           desc.push("扣2张");
        }
        break;
        case "quankou": {
           desc.push("全扣");
        }
        break;
        }
        var qieguo_num;
        if(this.qieguo.string == "5"){
            qieguo_num = 1;
            desc.push("5倍强制切锅");
        }else if(this.qieguo.string == "8"){
            qieguo_num = 2;
            desc.push("8倍强制切锅");
        }
        // switch (fengding) {
        //     case 1: {
        //         desc.push('5倍强制切锅');
        //     }
        //     break;
        // }
        //防作弊
        switch (fangzuobi) {
            case "1": {
                desc.push("防作弊");
            }
            break;
        }
        var conf = {
            name:'nn_1001',
            title:'加锅牛元帅',
            desc:desc,
            ju:ju,
            insane:insane,
            guodi:guodi + "di",
            wanfa:wanfa,
            fengding:qieguo_num,
            ren:'5ren',
            fangzuobi:fangzuobi,
        }; 

        return conf;
    },
});
