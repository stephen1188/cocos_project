cc.Class({
    extends: cc.Component,

    properties: {
        difen:cc.Label,
    },

    // use this for initialization
    onLoad: function () {
        //this.index = 9;
        this.index = 0;
        //this.difenArr = ["0.1", "0.2", "0.3", "0.4", "0.5", "0.6", "0.7", "0.8", "0.9", "1", "2", "3", "4", "5" ,"10", "20", "50"];
        this.difenArr = ["1", "2", "3", "4", "5" ,"10", "20", "50"];
        this.loadSaveConfig(); 
    },

    //载入保存项
    loadSaveConfig:function(){

        var conf = cc.sys.localStorage.getItem("last_game_dq_2700");
        if(conf){
            var json = JSON.parse(conf);
            var ju = json.ju;
            switch(json.ju){
                case '4ju':
                case '6ju':
                case '8ju':{
                    ju = "6ju";
                }
                break;
            }
            var koudi = json.koudi;
            switch(json.koudi){
                case '0':{
                    koudi = '1';
                }
                break;
            }
            cc.vv.utils.setToggleChecked(this.node.getChildByName('ju'),ju);
            cc.vv.utils.setToggleChecked(this.node.getChildByName('ren'),json.ren);
            cc.vv.utils.setToggleChecked(this.node.getChildByName('maxPower'),json.maxPower);
            cc.vv.utils.setToggleChecked(this.node.getChildByName('gametype').getChildByName('koudi'),koudi);
            cc.vv.utils.setToggleChecked(this.node.getChildByName('gametype').getChildByName('touwu'),json.touwu);
            this.node.getChildByName('gametype').getChildByName('fanpai').getComponent(cc.Toggle).isChecked = json.fanpai == 1;
            this.node.getChildByName('gametype').getChildByName('zDouble').getComponent(cc.Toggle).isChecked = json.zDouble == 0;
            if(json.difen){
                this.difen.string = json.difen;
            }
            for (var index = 0; index < this.difenArr.length; index++) {
                if(this.difen.string == this.difenArr[index]){
                    this.index = index;
                }
            }
        }
    },

    loadSaveConfig2:function(data){
        var json = data.conf;
        var ju = json.ju;
        switch(json.ju){
            case '4ju':
            case '6ju':
            case '8ju':{
                ju = "6ju";
            }
            break;
        }
        var koudi = json.koudi;
        switch(json.koudi){
            case '0':{
                koudi = '1';
            }
            break;
        }
        cc.vv.utils.setToggleChecked(this.node.getChildByName('ju'),ju);
        cc.vv.utils.setToggleChecked(this.node.getChildByName('ren'),json.ren);
        cc.vv.utils.setToggleChecked(this.node.getChildByName('maxPower'),json.maxPower);
        cc.vv.utils.setToggleChecked(this.node.getChildByName('gametype').getChildByName('koudi'),koudi);
        cc.vv.utils.setToggleChecked(this.node.getChildByName('gametype').getChildByName('touwu'),json.touwu);
        this.node.getChildByName('gametype').getChildByName('fanpai').getComponent(cc.Toggle).isChecked = json.fanpai == 1;
        this.node.getChildByName('gametype').getChildByName('zDouble').getComponent(cc.Toggle).isChecked = json.zDouble == 0;
        if(json.difen){
            this.difen.string = json.difen;
        }
        for (var index = 0; index < this.difenArr.length; index++) {
            if(this.difen.string == this.difenArr[index]){
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

    wenhao_tips:function(event){
        switch (event.target.name) {
            case "koudi2": {
                cc.vv.popMgr.alert("翻2倍：扣底分数固定翻2倍");
            }
            break;
            case "koudijiaji": {
               cc.vv.popMgr.alert("扣底加级翻倍：单张2倍，对子4倍，拖拉机8倍");
           }
           break;
        }
    },

    /**
     * 选项
     */
    Config:function(){
        
        var ju =  cc.vv.utils.toggleChecked(this.node.getChildByName('ju'));
        var ren =  cc.vv.utils.toggleChecked(this.node.getChildByName('ren'));
        var maxPower = cc.vv.utils.toggleChecked(this.node.getChildByName('maxPower'));
        var gametype = this.node.getChildByName('gametype');

        var fanpai = gametype.getChildByName('fanpai').getComponent(cc.Toggle).isChecked ? 1 : 0;
        var koudi = cc.vv.utils.toggleChecked(gametype.getChildByName('koudi'));
        var zDouble = gametype.getChildByName('zDouble').getComponent(cc.Toggle).isChecked ? 0 : 1;
        var touwu = cc.vv.utils.toggleChecked(gametype.getChildByName('touwu'));


        var desc = [];
        switch (ju) {
            case "6ju": {
                desc.push("6局");
            }
            break;
            case "12ju": {
                desc.push("12局");
            }
            break;
        }
        switch (ren) {
            case "4ren": {
                desc.push("4人");
            }
            break;
            case "5ren": {
                desc.push("5人");
            }
            break;
        }

        desc.push("底分"+this.difen.string);

        switch (maxPower) {
            case "0": {
                desc.push("不封顶");
            }
            break;
            case "3": {
                desc.push("3级封顶");
            }
            break;
            case "5": {
                desc.push("5级封顶");
            }
            break;
        }

        switch (fanpai) {
            case 1: {
                desc.push("翻牌");
            }
            break;
        }

        switch (koudi) {
            case '1': {
                desc.push("扣底翻2倍");
            }
            break;
            case '2': {
                desc.push("扣底加级翻倍");
            }
            break;
        }

        switch(zDouble){
            case 0:{
                desc.push("庄家单打赢双倍");
            }
            break;
        }
        
        switch(touwu){
            case '1':{
                desc.push("头五张叫主翻倍");
            }
            break;
            default:{
                touwu = '0';
            }
            
        }

        var conf = {
            name:'dq_2700',
            title:'打七',
            desc:desc,
            ju:ju,
            difen:this.difen.string,
            koudi:koudi,
            fanpai:fanpai,
            zDouble:zDouble,
            ren:ren,
            maxPower:maxPower,
            touwu:touwu
        }; 
        return conf;
    },
});
