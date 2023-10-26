cc.Class({
    extends: cc.Component,

    properties: {
    },

    // use this for initialization
    onLoad: function () {
        this.qieguo_index = 0;
        this.qieguo = this.node.getChildByName('qieguo').getChildByName("bg").getChildByName("difennum").getComponent(cc.Label);
        this.qieguoArr = ["5", "8"];
        this.loadSaveConfig();
    },

    //载入保存项
    loadSaveConfig:function(){

        //大众牛牛
        var conf = cc.sys.localStorage.getItem("last_game_dsg_2001");
        if(conf){
            var json = JSON.parse(conf);
            cc.vv.utils.setToggleChecked(this.node.getChildByName('ju'),json.ju);
            cc.vv.utils.setToggleChecked(this.node.getChildByName('wanfa'),json.wanfa);
            cc.vv.utils.setToggleChecked(this.node.getChildByName('guodi'),json.guodi);
           // cc.vv.utils.setToggleChecked2(this.node.getChildByName('fengding'),json.fengding,1);
            if(json.fengding){
                if(json.fengding == 1){
                    this.qieguo.string = "5";
                }else if(json.fengding == 2){
                    this.qieguo.string = "8";
                }
            }
            cc.vv.utils.setToggleChecked(this.node.getChildByName('ren'),json.ren);
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
        var guodi = cc.vv.utils.toggleChecked(this.node.getChildByName('guodi'));
        var ren = cc.vv.utils.toggleChecked(this.node.getChildByName('ren'));
        var fengding = this.node.getChildByName('fengding').getChildByName('qieguo').getComponent(cc.Toggle).isChecked ? 1 : 0;
        
        var desc = [];
        
        //锅底
        switch (guodi) {
            case "100di": {
                desc.push("锅底100分");
                cc.vv.userMgr.guodi = 100;
            }
            break;
            case "200di": {
                desc.push("锅底200分");
                cc.vv.userMgr.guodi = 200;
            }
            break;
            default:{
                desc.push("锅底300分");
                cc.vv.userMgr.guodi = 300;
            }
            break;
        }

        //人数
        switch (ren) {
            case "5ren": {
               desc.push("5人场");
            }
            break;
            case "10ren": {
               desc.push("8人场");
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

        //切锅封顶

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

        var conf = {
            name:'dsg_2101',
            title:'加锅斗三公',
            desc:desc,
            ju:ju,
            guodi:guodi,
            fengding:qieguo_num,
            ren:ren
            //wanfa:wanfa
        }; 

        return conf;
    },
});
