cc.Class({
    extends: cc.Component,

    properties: {
        _view:null,
        difen:cc.Label,
    },

    // use this for initialization
    onLoad: function () {
        this.index = 9;
        this.difenArr = ["0.1", "0.2", "0.3", "0.4", "0.5", "0.6", "0.7", "0.8", "0.9", "1", "2", "3", "4", "5" ,"10", "20", "50"];
        this.loadSaveConfig();
    },

    wenhao_tips:function(event, data){
           //报听
           switch (event.target.name) {
            case "fengzuizi": {
                cc.vv.popMgr.alert("风嘴子：东南西北任意三张不同的牌可为一刻；中发白可为一刻");
            }
            break;
            case "zhuangfen": {
                cc.vv.popMgr.alert("庄分：增加庄分10分的算分因子;输赢分值受报听状态、自摸或放炮等因素");
            }
            break;
            
        }
    },
    //载入保存项
    loadSaveConfig:function(){

        var conf = cc.sys.localStorage.getItem("last_game_kd_1700_4");
        var play_type = this.node.getChildByName('play_type');
        if(conf){
            var json = JSON.parse(conf);
            cc.vv.utils.setToggleChecked(this.node.getChildByName('ju'),json.ju);
            cc.vv.utils.setToggleChecked(this.node.getChildByName('wanfa'),json.wanfa);
            cc.vv.utils.setToggleChecked(this.node.getChildByName('ren'),json.ren);
            cc.vv.utils.setToggleChecked(this.node.getChildByName('fengzhui'),json.fengzhui);

            cc.vv.utils.setToggleChecked(this.node.getChildByName('difen'),json.difen);
            cc.vv.utils.setToggleChecked(this.node.getChildByName('fangzuobi'),json.fangzuobi);
            cc.vv.utils.setToggleChecked4(play_type,'Zhuang_Score',json.Zhuang_Score);
            if(json.difen){
                var difen = json.difen
                this.difen.string = difen;
                for (var index = 0; index < this.difenArr.length; index++) {
                    if(difen == this.difenArr[index]){
                        this.index = index;
                    }
                }
            }
        }

        
    },

    loadSaveConfig2:function(data){
        var play_type = this.node.getChildByName('play_type');
        var json = data.conf;
        cc.vv.utils.setToggleChecked(this.node.getChildByName('ju'),json.ju);
        cc.vv.utils.setToggleChecked(this.node.getChildByName('wanfa'),json.wanfa);
        cc.vv.utils.setToggleChecked(this.node.getChildByName('ren'),json.ren);
        cc.vv.utils.setToggleChecked(this.node.getChildByName('fengzhui'),json.fengzhui);

        cc.vv.utils.setToggleChecked(this.node.getChildByName('difen'),json.difen);
        cc.vv.utils.setToggleChecked(this.node.getChildByName('fangzuobi'),json.fangzuobi);
        cc.vv.utils.setToggleChecked4(play_type,'Zhuang_Score',json.Zhuang_Score);
        if(json.difen){
            var difen = json.difen
            this.difen.string = difen;
            for (var index = 0; index < this.difenArr.length; index++) {
                if(difen == this.difenArr[index]){
                    this.index = index;
                }
            }
        }
    },
    fengupd:function(data,event){
        if(event == "1"){
            this.node.getChildByName("fengzhui").getChildByName("fengzhui").getComponent(cc.Toggle).isChecked = false;
        }else if(event == "0"){
            this.node.getChildByName("wanfa").getChildByName("budaifeng").getComponent(cc.Toggle).isChecked = false;
        }
    },
    /**
     * 开房选项
     */
    Config:function(){
        
        var ju =  cc.vv.utils.toggleChecked(this.node.getChildByName('ju'));

        var wanfa =  cc.vv.utils.toggleChecked(this.node.getChildByName('wanfa'));
        var ren =  cc.vv.utils.toggleChecked(this.node.getChildByName('ren'));
        var fengzhui = cc.vv.utils.toggleChecked(this.node.getChildByName('fengzhui'));

        var fangzuobi = cc.vv.utils.toggleChecked(this.node.getChildByName('fangzuobi'));
        var play_type = this.node.getChildByName('play_type');
        var Zhuang_Score =  play_type.getChildByName('Zhuang_Score').getComponent(cc.Toggle).isChecked;//庄分
        var desc = [];

        switch (ju) {
            case "4ju": {
                desc.push("4局");
            }
            break;
            case "8ju": {
                desc.push("8局");
            }
            break;
            case "16ju": {
                desc.push("16局");
            }
            break;
        }

        switch (ren) {
            case "2ren": {
                desc.push("2人场");
            }
            break;
            case "3ren": {
                desc.push("3人场");
            }
            break;
            default: {
                desc.push("4人场");
            }
            break;
        }

        desc.push("底分" + this.difen.string);
						
        //报听
        switch (wanfa) {
            case "changgui": {
                desc.push("常规玩法");
            }
            break;
            case "budaifeng": {
                desc.push("不带风");
            }
            break;
            case "fenghaozi": {
                desc.push("风耗子");
            }
            break;
            case "suijihaozi": {
                desc.push("随机耗子");
            }
            break;
        }

        if(Zhuang_Score){
            desc.push("庄分");
        }

        //报听
        switch (fengzhui) {
            case "fengzhui": {
                desc.push("风嘴子");
            }
            break;
        }

        
        var conf = {
            name:'kd_1700',
            title:'扣点点',
            desc:desc,
            ju:ju,
            ren:ren,
            wanfa:wanfa,
            fengzhui:fengzhui,
            difen:this.difen.string,
            Zhuang_Score:Zhuang_Score,
            fangzuobi:fangzuobi,
        }; 

        return conf;
    },
    //按钮事件
    onBtnClick:function(event, data){
        var self = this;
        switch(event.target.name){
            case "add":{
                this.index += 1;
                var length = this.difenArr.length;
                var difen = this.difenArr[this.index % length];
                this.difen.string = difen;
            }
            break;
            case "sub":{
                var length = this.difenArr.length;
                this.index -= 1;
                if(this.index < 0){
                    this.index += length
                }
                var difen = this.difenArr[this.index % length];
                this.difen.string = difen;
            }
            break;
        }
    },
});
