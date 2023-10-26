cc.Class({
    extends: cc.Component,

    properties: {
        _view:null,
        difen:cc.Label,
        xiayu:cc.Label,
    },

    // use this for initialization
    onLoad: function () {
        this.index = 9;
        this.difenArr = ["0.1", "0.2", "0.3", "0.4", "0.5", "0.6", "0.7", "0.8", "0.9", "1", "2", "3", "4", "5" ,"10", "20", "50"];
        this.indexXiayu = 0;
        this.xiaYuArr = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20"];
        this.loadSaveConfig();
    },

    //载入保存项
    loadSaveConfig:function(){
        var conf = cc.sys.localStorage.getItem("last_game_hs_3100");
        if(conf){
            var json = JSON.parse(conf);
            cc.vv.utils.setToggleChecked(this.node.getChildByName('ju'),json.ju);
            cc.vv.utils.setToggleChecked(this.node.getChildByName('wanfa'),json.wanfa);
            cc.vv.utils.setToggleChecked(this.node.getChildByName('ren'),json.ren);
            if(json.zimoHu){
                cc.vv.utils.setToggleChecked(this.node.getChildByName('zimoHu'),'zimoHu');
            }
            if(json.isQingYiSe){
                cc.vv.utils.setToggleChecked(this.node.getChildByName('isQingYiSe'),'isQingYiSe');
            }
            if(json.isTiaoLong){
                cc.vv.utils.setToggleChecked(this.node.getChildByName('isTiaoLong'),'isTiaoLong');
            }
            if(json.mustHu){
                cc.vv.utils.setToggleChecked(this.node.getChildByName('mustHu'),'mustHu');
            }
            if(json.huagang){
                cc.vv.utils.setToggleChecked(this.node.getChildByName('huagang'),'huagang');
            }
            if(json.threePaoOne){
                cc.vv.utils.setToggleChecked(this.node.getChildByName('threePaoOne'),'threePaoOne');
            }
            if(json.genZhuang){
                cc.vv.utils.setToggleChecked(this.node.getChildByName('genZhuang'),'genZhuang');
            }
            cc.vv.utils.setToggleChecked(this.node.getChildByName('hongzhonghaozi'),json.hongzhonghaozi);
            if(json.hongzhonghaozi){
                cc.vv.utils.setToggleChecked(this.node.getChildByName('hongzhonghaozi'),null);
            }
            cc.vv.utils.setToggleChecked(this.node.getChildByName('fangzuobi'),json.fangzuobi);
            cc.vv.utils.setToggleChecked(this.node.getChildByName('qidui'),json.qidui);
            if(json.difen){
                var difen = json.difen
                this.difen.string = difen;
                for (var index = 0; index < this.difenArr.length; index++) {
                    if(difen == this.difenArr[index]){
                        this.index = index;
                    }
                }
            }

            if(json.fish){
                var xiayu = json.fish
                this.xiayu.string = xiayu;
                for (var index = 0; index < this.xiaYuArr.length; index++) {
                    if(xiayu == this.xiaYuArr[index]){
                        this.indexXiayu = index;
                    }
                }
            }

            switch(json.ren){
                case "2ren": {
                    var threePaoOne = this.node.getChildByName('threePaoOne');
                    cc.vv.utils.setToggleChecked(this.node.getChildByName('threePaoOne'),null);
                    threePaoOne.active = false;
                    var genZhuang = this.node.getChildByName('genZhuang');
                    genZhuang.active = false;
                    cc.vv.utils.setToggleChecked(this.node.getChildByName('genZhuang'),null);
                    var wanfa = this.node.getChildByName('wanfa');
                    wanfa.getChildByName("budaifeng").getComponent(cc.Toggle).interactable = false;
                    cc.vv.utils.setToggleChecked(this.node.getChildByName('wanfa'),'budaifeng');
                }
                break; 
                case "3ren": {
                    var threePaoOne = this.node.getChildByName('threePaoOne');
                    cc.vv.utils.setToggleChecked(this.node.getChildByName('threePaoOne'),null);
                    threePaoOne.active = false;
                    var genZhuang = this.node.getChildByName('genZhuang');
                    genZhuang.active = false;
                    cc.vv.utils.setToggleChecked(this.node.getChildByName('genZhuang'),null);
                    var wanfa = this.node.getChildByName('wanfa');
                    wanfa.getChildByName("budaifeng").getComponent(cc.Toggle).interactable = true;
                }
                break; 
                case "4ren": {
                    var threePaoOne = this.node.getChildByName('threePaoOne');
                    threePaoOne.active = true;
                    var genZhuang = this.node.getChildByName('genZhuang');
                    genZhuang.active = true;
                    var wanfa = this.node.getChildByName('wanfa');
                    wanfa.getChildByName("budaifeng").getComponent(cc.Toggle).interactable = true;
                }
                break; 
            }
        }
    },

    loadSaveConfig2:function(data){
        var json = data.conf;
        cc.vv.utils.setToggleChecked(this.node.getChildByName('ju'),json.ju);
        cc.vv.utils.setToggleChecked(this.node.getChildByName('wanfa'),json.wanfa);
        cc.vv.utils.setToggleChecked(this.node.getChildByName('ren'),json.ren);
        if(json.zimoHu){
            cc.vv.utils.setToggleChecked(this.node.getChildByName('zimoHu'),'zimoHu');
        }
        if(json.isQingYiSe){
            cc.vv.utils.setToggleChecked(this.node.getChildByName('isQingYiSe'),'isQingYiSe');
        }
        if(json.isTiaoLong){
            cc.vv.utils.setToggleChecked(this.node.getChildByName('isTiaoLong'),'isTiaoLong');
        }
        if(json.mustHu){
            cc.vv.utils.setToggleChecked(this.node.getChildByName('mustHu'),'mustHu');
        }
        if(json.huagang){
            cc.vv.utils.setToggleChecked(this.node.getChildByName('huagang'),'huagang');
        }
        if(json.threePaoOne){
            cc.vv.utils.setToggleChecked(this.node.getChildByName('threePaoOne'),'threePaoOne');
        }
        if(json.genZhuang){
            cc.vv.utils.setToggleChecked(this.node.getChildByName('genZhuang'),'genZhuang');
        }
        cc.vv.utils.setToggleChecked(this.node.getChildByName('hongzhonghaozi'),json.hongzhonghaozi);
        if(json.hongzhonghaozi){
            cc.vv.utils.setToggleChecked(this.node.getChildByName('hongzhonghaozi'),null);
        }
        cc.vv.utils.setToggleChecked(this.node.getChildByName('fangzuobi'),json.fangzuobi);
        cc.vv.utils.setToggleChecked(this.node.getChildByName('qidui'),json.qidui);
        if(json.difen){
            var difen = json.difen
            this.difen.string = difen;
            for (var index = 0; index < this.difenArr.length; index++) {
                if(difen == this.difenArr[index]){
                    this.index = index;
                }
            }
        }

        if(json.fish){
            var xiayu = json.fish
            this.xiayu.string = xiayu;
            for (var index = 0; index < this.xiaYuArr.length; index++) {
                if(xiayu == this.xiaYuArr[index]){
                    this.indexXiayu = index;
                }
            }
        }

        switch(json.ren){
            case "2ren": {
                var threePaoOne = this.node.getChildByName('threePaoOne');
                cc.vv.utils.setToggleChecked(this.node.getChildByName('threePaoOne'),null);
                threePaoOne.active = false;
                var genZhuang = this.node.getChildByName('genZhuang');
                genZhuang.active = false;
                cc.vv.utils.setToggleChecked(this.node.getChildByName('genZhuang'),null);
            }
            break; 
            case "3ren": {
                var threePaoOne = this.node.getChildByName('threePaoOne');
                cc.vv.utils.setToggleChecked(this.node.getChildByName('threePaoOne'),null);
                threePaoOne.active = false;
                var genZhuang = this.node.getChildByName('genZhuang');
                genZhuang.active = false;
                cc.vv.utils.setToggleChecked(this.node.getChildByName('genZhuang'),null);
            }
            break; 
            case "4ren": {
                var threePaoOne = this.node.getChildByName('threePaoOne');
                threePaoOne.active = true;
                var genZhuang = this.node.getChildByName('genZhuang');
                genZhuang.active = true;
            }
            break; 
        }
    },
    /**
     * 开房选项
     */
    Config:function(){
        var ju = cc.vv.utils.toggleChecked(this.node.getChildByName('ju'));
        var wanfa = cc.vv.utils.toggleChecked(this.node.getChildByName('wanfa'));
        var ren = cc.vv.utils.toggleChecked(this.node.getChildByName('ren'));
        var zimoHu = cc.vv.utils.toggleChecked(this.node.getChildByName('zimoHu'));
        var isQingYiSe = cc.vv.utils.toggleChecked(this.node.getChildByName('isQingYiSe'));
        var isTiaoLong = cc.vv.utils.toggleChecked(this.node.getChildByName('isTiaoLong'));
        var mustHu = cc.vv.utils.toggleChecked(this.node.getChildByName('mustHu'));
        var huagang = cc.vv.utils.toggleChecked(this.node.getChildByName('huagang'));
        var threePaoOne = cc.vv.utils.toggleChecked(this.node.getChildByName('threePaoOne'));
        var hongzhonghaozi = cc.vv.utils.toggleChecked(this.node.getChildByName('hongzhonghaozi'));
        var genZhuang = cc.vv.utils.toggleChecked(this.node.getChildByName('genZhuang'));
        var qidui = cc.vv.utils.toggleChecked(this.node.getChildByName('qidui'));
        var fangzuobi = cc.vv.utils.toggleChecked(this.node.getChildByName('fangzuobi'));
        
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
            case "budaifeng": {
                desc.push("不带风");
            }
            break;
        }

        switch (zimoHu) {
            case "zimoHu": {
                desc.push("只可自摸胡");
            }
            break;
        }

        switch (isQingYiSe) {
            case "isQingYiSe": {
                desc.push("清一色");
            }
            break;
        }

        switch (isTiaoLong) {
            case "isTiaoLong": {
                desc.push("一条龙");
            }
            break;
        }

        switch (mustHu) {
            case "mustHu": {
                desc.push("有胡必胡");
            }
            break;
        }
        
        switch (huagang) {
            case "huagang": {
                desc.push("滑杠");
            }
            break;
        }

        switch (threePaoOne) {
            case "threePaoOne": {
                desc.push("一炮三响三归一");
            }
            break;
        }

        switch (genZhuang) {
            case "genZhuang": {
                desc.push("跟庄");
            }
            break;
        }

        switch (hongzhonghaozi) {
            case "hongzhonghaozi": {
                desc.push("红中赖子杠");
            }
            break;
        }
        
        switch (qidui) {
            case "1": {
                desc.push("七对3番");
            }
            break;
            case "1": {
                desc.push("七对2番");
            }
            break;
        }

        if(this.xiayu.string > 0){
            desc.push("下鱼" + this.xiayu.string +"条");
        }

         //防作弊
         switch (fangzuobi) {
            case "1": {
                desc.push("防作弊");
            }
            break;
        }
    
        var conf = {
            name:'hs_3100',
            title:'划水麻将',
            desc:desc,
            ju:ju,
            ren:ren,
            wanfa:wanfa,
            zimoHu:zimoHu == "zimoHu",
            isQingYiSe:isQingYiSe == "isQingYiSe",
            isTiaoLong:isTiaoLong == "isTiaoLong",
            mustHu:mustHu == "mustHu",
            huagang:huagang == "huagang",
            threePaoOne:threePaoOne == "threePaoOne",
            genZhuang:genZhuang == "genZhuang",
            hongzhonghaozi:hongzhonghaozi,
            difen:this.difen.string,
            fish:this.xiayu.string,
            qidui:qidui,
            fangzuobi:fangzuobi
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

    //按钮事件
    onBtnXiaYuClick:function(event, data){
        var self = this;
        switch(event.target.name){
            case "add":{
                this.indexXiayu += 1;
                var length = this.xiaYuArr.length;
                var xiayu = this.xiaYuArr[this.indexXiayu % length];
                this.xiayu.string = xiayu;
            }
            break;
            case "sub":{
                var length = this.xiaYuArr.length;
                this.indexXiayu -= 1;
                if(this.indexXiayu < 0){
                    this.indexXiayu += length
                }
                var xiayu = this.xiaYuArr[this.indexXiayu % length];
                this.xiayu.string = xiayu;
            }
            break;
        }
    },

    //选人 按钮事件 
    onBtnYa:function(event,detail){

        var threePaoOne = this.node.getChildByName('threePaoOne');
        var genZhuang = this.node.getChildByName('genZhuang');
        var wanfa = this.node.getChildByName('wanfa');
        var ren = cc.vv.utils.toggleChecked(this.node.getChildByName('ren'));
        //人数
        switch (ren) {
            case "2ren": {
                threePaoOne.active = false;
                cc.vv.utils.setToggleChecked(this.node.getChildByName('threePaoOne'),null);
                genZhuang.active = false;
                cc.vv.utils.setToggleChecked(this.node.getChildByName('genZhuang'),null);
                wanfa.getChildByName("budaifeng").getComponent(cc.Toggle).interactable = false;
                cc.vv.utils.setToggleChecked(this.node.getChildByName('wanfa'),'budaifeng');
            }
            break;
            case "3ren": {
                threePaoOne.active = false;
                cc.vv.utils.setToggleChecked(this.node.getChildByName('threePaoOne'),null);
                genZhuang.active = false;
                cc.vv.utils.setToggleChecked(this.node.getChildByName('genZhuang'),null);
                wanfa.getChildByName("budaifeng").getComponent(cc.Toggle).interactable = true;
            }
            break;
            case "4ren": {
                threePaoOne.active = true;
                genZhuang.active = true;
                wanfa.getChildByName("budaifeng").getComponent(cc.Toggle).interactable = true;
            }
            break;
        }
    },

    //一条龙和癞子互斥
    onBtnYitiaolongAndHongzhong:function(event, data){
        //报听
        switch (event.target.name) {
            case "isTiaoLong": {
                cc.vv.utils.setToggleChecked(this.node.getChildByName('hongzhonghaozi'),null);
            }
            break;
            case "hongzhonghaozi": {
                cc.vv.utils.setToggleChecked(this.node.getChildByName('isTiaoLong'),null);
            }
            break;
        }
    },

    wenhao_tips:function(event, data){
        //报听
        switch (event.target.name) {
            case "genzhuangtishi": {
                cc.vv.popMgr.alert("1.指开始出牌时，庄家打出的第一张牌，其他三名闲家打出同样的牌，视为跟庄成功\n2.跟庄成功后，不管本局输赢，庄家都要输1分\n3.跟庄成功后，下局输赢：不限庄闲，放炮人多输3分，自摸每个多输2分，胡分另算");
            }
            break;
        }
    },
});
