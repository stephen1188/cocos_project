cc.Class({
    extends: cc.Component,

    properties: {
        difen:cc.Label
    },

    // use this for initialization
    onLoad: function () {
        this.index = 0;
        this.difenArr = ["0.1", "0.2", "0.3", "0.4", "0.5", "0.6", "0.7", "0.8", "0.9", "1", "2", "3", "4", "5" ,"10", "20", "50"];
        this.loadSaveConfig();
    },
    wenhao_tips:function(event, data){
        //报听
        switch (event.target.name) {
            case "zhuaniao": {
                cc.vv.popMgr.alert("抓鸟：拿到红桃十的玩家，最后输赢分×2");
            }
            break;
        }
    },
    //载入保存项
    loadSaveConfig:function(){

        var conf = cc.sys.localStorage.getItem("last_game_pdk_1900");
        var wanfa = this.node.getChildByName('wanfa');
        if(conf){
            var json = JSON.parse(conf);
            var ju = json.ju;
            switch(json.ju){
                case '10ju':{
                    ju = "8ju";
                }
                break;
                case '20ju':{
                    ju = "16ju";
                }
                break;
            }
            cc.vv.utils.setToggleChecked(this.node.getChildByName('ju'),ju);
            cc.vv.utils.setToggleChecked(this.node.getChildByName('ren'),json.ren);
            this.difen.string = json.difen;
            cc.vv.utils.setToggleChecked(wanfa.getChildByName('shouChu'),json.shouChu);
            cc.vv.utils.setToggleChecked(wanfa.getChildByName('maxPai'),json.maxPai);
            cc.vv.utils.setToggleChecked(wanfa.getChildByName('must'),json.must);
            cc.vv.utils.setToggleChecked(wanfa.getChildByName('tAndt'),json.tAndt);
            //cc.vv.utils.setToggleChecked(wanfa.getChildByName('tAndd'),json.tAndd);
            cc.vv.utils.setToggleChecked(wanfa.getChildByName('fAndf'),json.fAndf);
            cc.vv.utils.setToggleChecked(wanfa.getChildByName('zhuaNiao'),json.zhuaNiao);
            cc.vv.utils.setToggleChecked(wanfa.getChildByName('AAA'),json.AAA);
            if(json.tAnddOne != null){
                cc.vv.utils.setToggleChecked(wanfa.getChildByName('tAnddOne'),json.tAnddOne);
            }
            if(json.AAAMax != null){
                cc.vv.utils.setToggleChecked(wanfa.getChildByName('AAAMax'),json.AAAMax);
            }
            var event = new cc.Event.EventCustom('click', true);
            event.node = wanfa.getChildByName('AAAMax').getChildByName('1');
            this.onBtnAAAMax(event);

            var event2 = new cc.Event.EventCustom('click', true);
            event2.node = wanfa.getChildByName('AAA').getChildByName('1');
            this.onBtnAAA(event2);

            if(json.showPais != null){
                cc.vv.utils.setToggleChecked(wanfa.getChildByName('showPais'),json.showPais);
            }
            if(json.gaobei != null){
                cc.vv.utils.setToggleChecked(wanfa.getChildByName('gaobei'),json.gaobei);
            }
           
            for (var index = 0; index < this.difenArr.length; index++) {
                if(json.difen == this.difenArr[index]){
                    this.index = index;
                }
            }
        }else{
            for (var index = 0; index < this.difenArr.length; index++) {
                if(this.difen.string == this.difenArr[index]){
                    this.index = index;
                }
            }
        }
    },

    loadSaveConfig2:function(data){
        var json = data.conf;
        var wanfa = this.node.getChildByName('wanfa');
        var ju = json.ju;
        switch(json.ju){
            case '10ju':{
                ju = "8ju";
            }
            break;
            case '20ju':{
                ju = "16ju";
            }
            break;
        }
        cc.vv.utils.setToggleChecked(this.node.getChildByName('ju'),ju);
        cc.vv.utils.setToggleChecked(this.node.getChildByName('ren'),json.ren);
        this.difen.string = json.difen;
        cc.vv.utils.setToggleChecked(wanfa.getChildByName('shouChu'),json.shouChu);
        cc.vv.utils.setToggleChecked(wanfa.getChildByName('maxPai'),json.maxPai);
        cc.vv.utils.setToggleChecked(wanfa.getChildByName('must'),json.must);
        cc.vv.utils.setToggleChecked(wanfa.getChildByName('tAndt'),json.tAndt);
        //cc.vv.utils.setToggleChecked(wanfa.getChildByName('tAndd'),json.tAndd);
        cc.vv.utils.setToggleChecked(wanfa.getChildByName('fAndf'),json.fAndf);
        cc.vv.utils.setToggleChecked(wanfa.getChildByName('zhuaNiao'),json.zhuaNiao);
        cc.vv.utils.setToggleChecked(wanfa.getChildByName('AAA'),json.AAA);
        if(json.tAnddOne != null){
            cc.vv.utils.setToggleChecked(wanfa.getChildByName('tAnddOne'),json.tAnddOne);
        }
        if(json.gaobei != null){
            cc.vv.utils.setToggleChecked(wanfa.getChildByName('gaobei'),json.gaobei);
        }
        if(json.AAAMax != null){
            cc.vv.utils.setToggleChecked(wanfa.getChildByName('AAAMax'),json.AAAMax);
        }
        if(json.showPais != null){
            cc.vv.utils.setToggleChecked(wanfa.getChildByName('showPais'),json.showPais);
        }
        if(json.fangzuobi){
            cc.vv.utils.setToggleChecked(this.node.getChildByName('fangzuobi'),json.fangzuobi);
        }
        var event = new cc.Event.EventCustom('click', true);
        event.node = wanfa.getChildByName('AAAMax').getChildByName('1');
        this.onBtnAAAMax(event);

        var event2 = new cc.Event.EventCustom('click', true);
        event2.node = wanfa.getChildByName('AAA').getChildByName('1');
        this.onBtnAAA(event2);

        for (var index = 0; index < this.difenArr.length; index++) {
            if(json.difen == this.difenArr[index]){
                this.index = index;
            }
        } 
    },

    onBtnAAAMax:function(event){
        var wanfa = this.node.getChildByName('wanfa');
        switch(event.node.parent.name){
            case 'AAAMax':{
                var max = cc.vv.utils.toggleChecked(wanfa.getChildByName('AAAMax'));
                if(max == '1'){
                    cc.vv.utils.setToggleChecked(wanfa.getChildByName('AAA'),"1");
                }
            }
            break;
        }
    },

    onBtnAAA:function(event){
        var wanfa = this.node.getChildByName('wanfa');
        switch(event.node.parent.name){
            case 'AAA':{
                var max = cc.vv.utils.toggleChecked(wanfa.getChildByName('AAA'));
                if(max != '1'){
                    cc.vv.utils.setToggleChecked(wanfa.getChildByName('AAAMax'),"0");
                }
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

    /**
     * 选项
     */
    Config:function(){
        
        var ju =  cc.vv.utils.toggleChecked(this.node.getChildByName('ju'));
        var ren =  cc.vv.utils.toggleChecked(this.node.getChildByName('ren'));
        var wanfa = this.node.getChildByName('wanfa');
        var shouChu = cc.vv.utils.toggleChecked(wanfa.getChildByName('shouChu'));
        var maxPai  = cc.vv.utils.toggleChecked(wanfa.getChildByName('maxPai'));
        var must  = cc.vv.utils.toggleChecked(wanfa.getChildByName('must'));
        var tAndt = cc.vv.utils.toggleChecked(wanfa.getChildByName('tAndt'));
        var tAndd = cc.vv.utils.toggleChecked(wanfa.getChildByName('tAndd'));
        var fAndf  = cc.vv.utils.toggleChecked(wanfa.getChildByName('fAndf'));
        var zhuaNiao  = cc.vv.utils.toggleChecked(wanfa.getChildByName('zhuaNiao'));
        var AAA  = cc.vv.utils.toggleChecked(wanfa.getChildByName('AAA'));
        var gaobei  = cc.vv.utils.toggleChecked(wanfa.getChildByName('gaobei'));
        var showPais = cc.vv.utils.toggleChecked(wanfa.getChildByName('showPais'));
        var AAAMax = cc.vv.utils.toggleChecked(wanfa.getChildByName('AAAMax'));
        var fangzuobi = cc.vv.utils.toggleChecked(this.node.getChildByName('fangzuobi'));
        var tAnddOne = cc.vv.utils.toggleChecked(wanfa.getChildByName('tAnddOne'));
        var desc = [];
        switch (ju) {
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
            case "4ren": {
                desc.push("4人场");
            }
            break;
        }

        desc.push("底分"+this.difen.string);

        switch (gaobei){
            case '0': {
                desc.push("全关2倍");
            }
            break;
            case '1': {
                desc.push("全关4倍");
            }
            break;
            default:{
            }
        }
            
        switch (shouChu){
            case '3': {
                desc.push("红桃3先出");
            }
            break;
            case '0': {
                desc.push("赢家先出");
            }
            break;
        }

        switch (maxPai){
            case '0': {
                //desc.push("不封顶");
            }
            break;
            case '8': {
                //desc.push("8张牌封顶");
            }
            break;
        }

        switch (must){
            case '1': {
                desc.push("有管必管");
            }
            break;
            default:{
                must = 0;
            }
        }

        switch (tAnddOne){
            case '1': {
                desc.push("三带一");
            }
            break;
            default:{
                tAnddOne = 0;
            }
        }

        switch (tAndt){
            case '1': {
                desc.push("三带二");
            }
            break;
            default:{
                tAndt = 0;
            }
        }

        // switch (tAndd){
        //     case '1': {
        //         desc.push("三带一对");
        //     }
        //     break;
        //     default:{
        //         tAndd = 0;
        //     }
        // }

        switch (fAndf){
            case '1': {
                desc.push("四带三");
            }
            break;
            default:{
                fAndf = 0;
            }
        }

        switch (zhuaNiao){
            case '1': {
                desc.push("抓鸟");
            }
            break;
            default:{
                zhuaNiao = 0;
            }
        }

        switch (AAA){
            case '1': {
                desc.push("3A当炸弹");
            }
            break;
            default:{
                AAA = 0;
            }
        }

        switch (showPais){
            case '1': {
                desc.push("显示牌数");
            }
            break;
            default:{
                showPais = 0;
            }
        }

        switch (AAAMax){
            case '1': {
                desc.push("3A最大");
            }
            break;
            default:{
                AAAMax = 0;
            }
        }

        switch (fangzuobi) {
            case "1": {
                desc.push("防作弊");
            }
            break;
        }

        var conf = {
            name:'pdk_1900',
            title:'跑得快',
            desc:desc,
            ju:ju,
            ren:ren,
            difen:this.difen.string,
            shouChu:shouChu,
            maxPai:0,
            must:must,
            tAndt:tAndt,
            tAndd:0,
            fAndf:fAndf,
            zhuaNiao:zhuaNiao,
            AAA:AAA,
            gaobei:gaobei,
            showPais:showPais,
            AAAMax:AAAMax,
            fangzuobi:fangzuobi,
            tAnddOne:tAnddOne
        }; 

        return conf;
    },
});
