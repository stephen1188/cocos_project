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
         case "yingbazhang": {
             cc.vv.popMgr.alert("硬八张：胡牌时需要万、筒、条、风其中一种够8张，包括点炮或自摸的第十四张牌");
         }
         break;
         case "hongzhonghao": {
            cc.vv.popMgr.alert("红中耗子：固定红中为耗子牌");
        }
        break;
        case "gangsuihuzou": {
            cc.vv.popMgr.alert("杠随胡走：只胡牌玩家的杠，才会算分");
        }
        break;
        }
    },
    //载入保存项
    loadSaveConfig:function(){

        var conf = cc.sys.localStorage.getItem("last_game_gsj_2500");
        if(conf){
            var json = JSON.parse(conf);
            cc.vv.utils.setToggleChecked(this.node.getChildByName('ju'),json.ju);
            cc.vv.utils.setToggleChecked(this.node.getChildByName('haozi'),json.haozi);
            cc.vv.utils.setToggleChecked(this.node.getChildByName('wanfa_qidui'),json.wanfa_qidui);
            cc.vv.utils.setToggleChecked(this.node.getChildByName('wanfa_shisanyao'),json.wanfa_shisanyao);
            cc.vv.utils.setToggleChecked(this.node.getChildByName('wanfa_yingbazhang'),json.wanfa_yingbazhang);
            cc.vv.utils.setToggleChecked(this.node.getChildByName('difen'),json.difen);
            cc.vv.utils.setToggleChecked(this.node.getChildByName('gang_zou'),json.gang_zou);
            cc.vv.utils.setToggleChecked(this.node.getChildByName('fangzuobi'),json.fangzuobi);
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
        var json = data.conf;
        cc.vv.utils.setToggleChecked(this.node.getChildByName('ju'),json.ju);
        cc.vv.utils.setToggleChecked(this.node.getChildByName('haozi'),json.haozi);
        cc.vv.utils.setToggleChecked(this.node.getChildByName('wanfa_qidui'),json.wanfa_qidui);
        cc.vv.utils.setToggleChecked(this.node.getChildByName('wanfa_shisanyao'),json.wanfa_shisanyao);
        cc.vv.utils.setToggleChecked(this.node.getChildByName('wanfa_yingbazhang'),json.wanfa_yingbazhang);
        cc.vv.utils.setToggleChecked(this.node.getChildByName('difen'),json.difen);
        cc.vv.utils.setToggleChecked(this.node.getChildByName('gang_zou'),json.gang_zou);
        cc.vv.utils.setToggleChecked(this.node.getChildByName('fangzuobi'),json.fangzuobi);
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

    /**
     * 开房选项
     */
    Config:function(){
        
        var ju =  cc.vv.utils.toggleChecked(this.node.getChildByName('ju'));

        var haozi =  cc.vv.utils.toggleChecked(this.node.getChildByName('haozi'));
        
        var wanfa_qidui = cc.vv.utils.toggleChecked(this.node.getChildByName('wanfa_qidui'));
        
        var wanfa_shisanyao = cc.vv.utils.toggleChecked(this.node.getChildByName('wanfa_shisanyao'));

        var wanfa_yingbazhang =  cc.vv.utils.toggleChecked(this.node.getChildByName('wanfa_yingbazhang'));

        var gang_zou =  cc.vv.utils.toggleChecked(this.node.getChildByName('gang_zou'));

        var fangzuobi = cc.vv.utils.toggleChecked(this.node.getChildByName('fangzuobi'));

        var difen =  this.difen.string; 

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
       	
        desc.push("底分" + this.difen.string);

        //七小对
        switch (wanfa_qidui) {
            case "1": {
                desc.push("七小对");
            }
            break;
        }

         //十三幺
         switch (wanfa_shisanyao) {
            case "1": {
                desc.push("十三幺");
            }
            break;
        }

        //硬八张
        switch (wanfa_yingbazhang) {
            case "1": {
                desc.push("硬八张");
            }
            break;
        }

        //玩法
        switch (haozi) {
            case "haozi": {
                desc.push("随机耗子");
            }
            break;
            case "hongzhonghaozi": {
                desc.push("红中耗子");
            }
            break;
        }

        //杠随胡走
        switch (gang_zou) {
            case "1": {
                desc.push("杠随胡走");
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

        var conf = {
            name:'gsj_2500',
            title:'拐三角',
            desc:desc,
            ju:ju,
            haozi:haozi,
            wanfa_qidui:wanfa_qidui,
            wanfa_shisanyao:wanfa_shisanyao,
            wanfa_yingbazhang:wanfa_yingbazhang,
            ren:'3ren',
            difen:this.difen.string,
            gang_zou:gang_zou,
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
