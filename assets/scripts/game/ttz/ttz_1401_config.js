cc.Class({
    extends: cc.Component,

    properties: {
        _view:null,
        guodi:cc.Label
    },

    // use this for initialization
    onLoad: function () {
        this.index = 2;
        this.qieguo_index = 4;
        this.guodiArr = ["60", "80", "100", "200", "300", "500"];
        this.qieguo = this.node.getChildByName('qieguo').getChildByName("bg").getChildByName("difennum").getComponent(cc.Label);
        this.qieguoArr = ['5','8'];
        this.loadSaveConfig();
    },

    //载入保存项
    loadSaveConfig:function(){

        //最后配置
        var conf = cc.sys.localStorage.getItem("last_game_ttz_1401");
        if(conf){
            var json = JSON.parse(conf);
            cc.vv.utils.setToggleChecked(this.node.getChildByName('ju'),json.ju);
            cc.vv.utils.setToggleChecked(this.node.getChildByName('ren'),json.ren);
            //cc.vv.utils.setToggleChecked(this.node.getChildByName('guodi'),json.guodi);
            cc.vv.utils.setToggleChecked2(this.node.getChildByName('wanfa'),json.cond,1);
            //cc.vv.utils.setToggleChecked2(this.node.getChildByName('fengding'),json.fengding,1);
            cc.vv.utils.setToggleChecked2(this.node.getChildByName('yaoshaizi'),json.auto,1);
            cc.vv.utils.setToggleChecked(this.node.getChildByName('fangzuobi'),json.fangzuobi);
            if(json.guo != null){
                this.guodi.string = json.guo;
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
        cc.vv.utils.setToggleChecked(this.node.getChildByName('ren'),json.ren);
        //cc.vv.utils.setToggleChecked(this.node.getChildByName('guodi'),json.guodi);
        cc.vv.utils.setToggleChecked2(this.node.getChildByName('wanfa'),json.cond,1);
        //cc.vv.utils.setToggleChecked2(this.node.getChildByName('fengding'),json.fengding,1);
        cc.vv.utils.setToggleChecked2(this.node.getChildByName('yaoshaizi'),json.auto,1);
        cc.vv.utils.setToggleChecked(this.node.getChildByName('fangzuobi'),json.fangzuobi);
        if(json.guo != null){
            this.guodi.string = json.guo;
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

    /**
     * 开房选项
     */
    Config:function(){
        
        var ju = cc.vv.utils.toggleChecked(this.node.getChildByName('ju'));
        var ren = cc.vv.utils.toggleChecked(this.node.getChildByName("ren"));
        //var guodi = cc.vv.utils.toggleChecked(this.node.getChildByName('guodi'));
        var fengding = this.node.getChildByName('fengding').getChildByName('qieguo').getComponent(cc.Toggle).isChecked ? 1 : 0;
        var yaoshaizi = cc.vv.utils.toggleChecked(this.node.getChildByName("yaoshaizi"));
        var wanfa = cc.vv.utils.toggleChecked(this.node.getChildByName('wanfa'));
        var fangzuobi = cc.vv.utils.toggleChecked(this.node.getChildByName('fangzuobi'));
        var play_type = 0;
        var desc = [];
         //锅底
         var guodi = this.guodi.string;
         desc.push("锅底" + guodi + "分");
         cc.vv.userMgr.guodi = parseInt(guodi);
        //  switch (guodi) {
        //     case "60di": {
        //         desc.push("锅底60分");
        //         cc.vv.userMgr.guodi = 60;
        //     }
        //     break;
        //     case "80di": {
        //         desc.push("锅底80分");
        //         cc.vv.userMgr.guodi = 80;
        //     }
        //     break;
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
        //     case "300di": {
        //         desc.push("锅底300分");
        //         cc.vv.userMgr.guodi = 300;
        //     }
        //     break;
        //     case "500di": {
        //         desc.push("锅底500分");
        //         cc.vv.userMgr.guodi = 500;
        //     }
        //     break;
        //     default:{
        //         desc.push("锅底300分");
        //         cc.vv.userMgr.guodi = 300;
        //     }
        //     break;
        // }

        desc.push("5人场");
        //玩法
        switch (wanfa) {
            case "28g": {
                desc.push("二八杠");
            }
            break;
        }
        if(wanfa){
            play_type = 1
        }else{
            play_type = 0;
        }
        // //封顶
        // switch (fengding) {
        //     case 1: {
        //         desc.push('5倍强制切锅');
        //     }
        //     break;
        // }
        var qieguo_num;
        if(this.qieguo.string == "5"){
            qieguo_num = 1;
            desc.push("5倍强制切锅");
        }else if(this.qieguo.string == "8"){
            qieguo_num = 2;
            desc.push("8倍强制切锅");
        }
        //玩法
        switch (yaoshaizi) {
            case "shaizi": {
                desc.push("自动摇骰子");
            }
            break;
        }
        //防作弊
        switch (fangzuobi) {
            case "1": {
                desc.push("防作弊");
            }
            break;
        }
        var yaoshaiziValue = 0;
        if(yaoshaizi){
            yaoshaiziValue = 1;
        }
        
        var conf = {
            name:'ttz_1401',
            title:'加锅推饼子',
            desc:desc,      
            ju:ju,
            cond:play_type,
            guo:guodi,
            fengding:qieguo_num,
            ren:'5ren',
            auto:yaoshaiziValue,
            fangzuobi:fangzuobi,
        }; 

        return conf;
    },
});
