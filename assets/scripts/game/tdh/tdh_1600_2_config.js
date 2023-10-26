cc.Class({
    extends: cc.Component,

    properties: {
        difen:cc.Label,
        _view:null,
    },

    // use this for initialization
    onLoad: function () {
        this.index = 9;
        this.difenArr = ["0.1", "0.2", "0.3", "0.4", "0.5", "0.6", "0.7", "0.8", "0.9", "1", "2", "3", "4", "5" ,"10", "20", "50"];
        this.loadSaveConfig();
    },

    //载入保存项
    loadSaveConfig:function(){

        var conf = cc.sys.localStorage.getItem("last_game_tdh_1600_2");
        if(conf){
            var json = JSON.parse(conf);
            cc.vv.utils.setToggleChecked(this.node.getChildByName('ju'),json.ju);

            cc.vv.utils.setToggleChecked(this.node.getChildByName('baoting'),json.baoting);
            cc.vv.utils.setToggleChecked(this.node.getChildByName('daifeng'),json.daifeng);
            cc.vv.utils.setToggleChecked(this.node.getChildByName('zimo'),json.zimo);
            cc.vv.utils.setToggleChecked(this.node.getChildByName('gang'),json.gang);
            cc.vv.utils.setToggleChecked(this.node.getChildByName('haozi'),json.haozi);
            cc.vv.utils.setToggleChecked(this.node.getChildByName('hupai'),json.hupai);
            cc.vv.utils.setToggleChecked(this.node.getChildByName('ren'),json.ren);

            cc.vv.utils.setToggleChecked(this.node.getChildByName('difen'),json.difen);
            cc.vv.utils.setToggleChecked(this.node.getChildByName('fangzuobi'),json.fangzuobi);
            if(!json.baoting){
                cc.vv.utils.setToggleChecked(this.node.getChildByName('gang'),false);
            }
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

        cc.vv.utils.setToggleChecked(this.node.getChildByName('baoting'),json.baoting);
        cc.vv.utils.setToggleChecked(this.node.getChildByName('daifeng'),json.daifeng);
        cc.vv.utils.setToggleChecked(this.node.getChildByName('zimo'),json.zimo);
        cc.vv.utils.setToggleChecked(this.node.getChildByName('gang'),json.gang);
        cc.vv.utils.setToggleChecked(this.node.getChildByName('haozi'),json.haozi);
        cc.vv.utils.setToggleChecked(this.node.getChildByName('hupai'),json.hupai);
        cc.vv.utils.setToggleChecked(this.node.getChildByName('ren'),json.ren);

        cc.vv.utils.setToggleChecked(this.node.getChildByName('difen'),json.difen);
        cc.vv.utils.setToggleChecked(this.node.getChildByName('fangzuobi'),json.fangzuobi);
        if(!json.baoting){
            cc.vv.utils.setToggleChecked(this.node.getChildByName('gang'),false);
        }
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

    //勾选报名，必须勾听口
    onGangToggle:function(event,data){
        var check = event.isChecked;
        if(check){
            this.node.getChildByName('baoting').getChildByName("baoting").getComponent(cc.Toggle).isChecked = check;
        }
    },

    //勾选报名，必须勾听口
    onBaoTingToggle:function(event,data){
        var check = event.isChecked;

        if(!check){
            this.node.getChildByName('gang').getChildByName("gang").getComponent(cc.Toggle).isChecked = check;
        }
    },


    /**
     * 推倒胡选项
     */
    Config:function(){
        
        var ju =  cc.vv.utils.toggleChecked(this.node.getChildByName('ju'));

        var baoting =  cc.vv.utils.toggleChecked(this.node.getChildByName('baoting'));
        var daifeng =  cc.vv.utils.toggleChecked(this.node.getChildByName('daifeng'));
        var zimo =  cc.vv.utils.toggleChecked(this.node.getChildByName('zimo'));
        var gang =  cc.vv.utils.toggleChecked(this.node.getChildByName('gang'));
        var haozi =  cc.vv.utils.toggleChecked(this.node.getChildByName('haozi'));
        var hupai =  cc.vv.utils.toggleChecked(this.node.getChildByName('hupai'));
        var ren =  cc.vv.utils.toggleChecked(this.node.getChildByName('ren'));
        var ju =  cc.vv.utils.toggleChecked(this.node.getChildByName('ju'));

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
        switch (baoting) {
            case "baoting": {
                desc.push("报听");
            }
            break;
            default : {
                desc.push("不报听");
            }
            break;
        }
			
        //带风
        switch (daifeng) {
            case "daifeng": {
                desc.push("带风");
            }
            break;
            default : {
                desc.push("不带风");
            }
            break;
        }
			
        //只能自摸
        switch (zimo) {
            case "zimo": {
                desc.push("自摸糊");
            }
            break;
        }
        
        //改变听口不能杠
        switch (gang) {
            case "gang": {
                desc.push("改听不能杠");
            }
            break;
        }
			
        //耗子
        switch (haozi) {
            case "haozi": {
                desc.push("耗子");
            }
            break;
            case "hongzhonghaozi": {
                desc.push("红中耗子");
            }
            break;
        }
			
        //胡牌类型
        switch (hupai) {
            case "pinghu": {
                desc.push("平胡");
            }
            break;
            default :{
                desc.push("大胡");
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
            name:'tdh_1600',
            title:'推倒胡',
            desc:desc,
            baoting:baoting,
            daifeng:daifeng,
            zimo:zimo,
            ju:ju,
            gang:gang,
            ren:ren,
            haozi:haozi,
            hupai:hupai,
            difen:this.difen.string,
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
