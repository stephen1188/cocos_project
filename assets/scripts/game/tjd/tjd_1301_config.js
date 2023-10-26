cc.Class({
    extends: cc.Component,

    properties: {
        _view:null,
        guodi:cc.Label
    },

    // use this for initialization
    onLoad: function () {
        this.index = 2;
        this.qieguo_index = 0;
        this.guodiArr = ["60", "80", "100", "200", "300", "500"];
        this.qieguo = this.node.getChildByName('qieguo').getChildByName("bg").getChildByName("difennum").getComponent(cc.Label);
        this.qieguoArr = ["5", "8"];
        this.loadSaveConfig();
    },

    //载入保存项
    loadSaveConfig:function(){

        //最后配置
        var conf = cc.sys.localStorage.getItem("last_game_tjd_1301");
        if(conf){
            var json = JSON.parse(conf);
            cc.vv.utils.setToggleChecked(this.node.getChildByName('ju'),json.ju);
            cc.vv.utils.setToggleChecked(this.node.getChildByName('ren'),json.ren);
            //cc.vv.utils.setToggleChecked(this.node.getChildByName('guodi'),json.guodi);
            //cc.vv.utils.setToggleChecked2(this.node.getChildByName('fengding'),json.fengding,1);
            cc.vv.utils.setToggleChecked(this.node.getChildByName('dao'),json.dao);
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
        //cc.vv.utils.setToggleChecked2(this.node.getChildByName('fengding'),json.fengding,1);
        cc.vv.utils.setToggleChecked(this.node.getChildByName('dao'),json.dao);
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
     * 开房选项
     */
    Config:function(){
        
        var ju = cc.vv.utils.toggleChecked(this.node.getChildByName('ju'));
        var ren = cc.vv.utils.toggleChecked(this.node.getChildByName("ren"));
        //var guodi = cc.vv.utils.toggleChecked(this.node.getChildByName('guodi'));
        var fengding = this.node.getChildByName('fengding').getChildByName('qieguo').getComponent(cc.Toggle).isChecked ? 1 : 0;
        var dao = cc.vv.utils.toggleChecked(this.node.getChildByName('dao'));
        var yaoshaizi = cc.vv.utils.toggleChecked(this.node.getChildByName("yaoshaizi"));
        var fangzuobi = cc.vv.utils.toggleChecked(this.node.getChildByName('fangzuobi'));

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

        //人数
        switch (ren) {
            case "4ren": {
               desc.push("4人场");
            }
            break;
            case "6ren": {
                desc.push("6人场");
             }
             break;
        }


         //玩法
         switch (dao) {
            case "3dao": {
               desc.push("三道");
            }
            break;
            case "2dao": {
               desc.push("两道");
            }
            break;
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
            name:'tjd_1301',
            title:'加锅推锅',
            desc:desc,      
            ju:ju,
            guo:guodi,
            dao:dao,
            fengding:qieguo_num,
            ren:ren,
            auto:yaoshaiziValue,
            fangzuobi:fangzuobi,
        }; 

        return conf;
    },
});
