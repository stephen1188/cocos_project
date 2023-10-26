cc.Class({
    extends: cc.Component,

    properties: {
        _view:null,
        _TAndt:0,
        _FAndf:0,
        difen:cc.Label,
        _gameMoShi:"jindian"
    },

    // use this for initialization
    onLoad: function () {
        this.index = 0;
        this.difenArr = ["1", "2", "3", "5" ,"10", "20", "50"];
        this.loadSaveConfig();
    },

    //载入保存项
    loadSaveConfig:function(){

        var conf = cc.sys.localStorage.getItem("last_game_ddz_1800");
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
            cc.vv.utils.setToggleChecked(this.node.getChildByName('zha'),json.zha);
            //cc.vv.utils.setToggleChecked(this.node.getChildByName('difen'),json.difen);
            this.difen.string = json.difen;
            cc.vv.utils.setToggleChecked(this.node.getChildByName('gameMoShi'),json.gameMoShi);
            cc.vv.utils.setToggleChecked3(this.node.getChildByName('lati'),json.la);
            cc.vv.utils.setToggleChecked3(this.node.getChildByName('lati'),json.ti);
            
            cc.vv.utils.setToggleChecked2(this.node.getChildByName('buxipai'),json.xipai,1);
            cc.vv.utils.setToggleChecked2(this.node.getChildByName('jipaiqi'),json.remeberCard,1);
            this.node.getChildByName('gametype').getChildByName('FAndf').getComponent(cc.Toggle).isChecked = json.FAndf==1;
            this.node.getChildByName('gametype').getChildByName('TAndt').getComponent(cc.Toggle).isChecked = json.TAndt==1;
            if(json.mingpai != null){
                this.node.getChildByName('gametype').getChildByName('mingpai').getComponent(cc.Toggle).isChecked = json.mingpai==1;
            }
            if(json.fangzuobi){
                cc.vv.utils.setToggleChecked(this.node.getChildByName('fangzuobi'),json.fangzuobi);
            }

            if(json.gameMoShi != null){
                var event = new cc.Event.EventCustom('click', true);
                event.node = this.node.getChildByName('gameMoShi').getChildByName(json.gameMoShi);
                this.onBtnMoShi(event);
                if(json.gameMoShi == '0'){
                    for(var i = 0; i < this.difenArr.length; i++){
                        if(json.difen == this.difenArr[i]){
                            this.index = i;
                        }
                    }
                }
            }else{
                var moshi = json.difen == '1' ? '1' : '0';
                cc.vv.utils.setToggleChecked(this.node.getChildByName('gameMoShi'),moshi);
                var event = new cc.Event.EventCustom('click', true);
                event.node = this.node.getChildByName('gameMoShi').getChildByName(moshi);
                this.onBtnMoShi(event);
            }
            
            //模拟点击人数，变化耗卡数
            // var event = new cc.Event.EventCustom('click', true);
            // event.node = this.node.getChildByName('difen').getChildByName(json.difen);
            //this.onBtnDifen(event);
            // var event2 = new cc.Event.EventCustom('click', true);
            // event2.node = this.node.getChildByName('zha').getChildByName(json.zha);
            // this.onBtnZha(event2);
            // var event3 = new cc.Event.EventCustom('click', true);
            // event3.node = this.node.getChildByName('buxipai').getChildByName('buxipai');
            // this.onBtnBuxipai(event3);
        }
    },

    loadSaveConfig2:function(data){
        var json = data.conf;
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
        cc.vv.utils.setToggleChecked(this.node.getChildByName('zha'),json.zha);
        //cc.vv.utils.setToggleChecked(this.node.getChildByName('difen'),json.difen);
        this.difen.string = json.difen;
        cc.vv.utils.setToggleChecked(this.node.getChildByName('gameMoShi'),json.gameMoShi);
        cc.vv.utils.setToggleChecked3(this.node.getChildByName('lati'),json.la);
        cc.vv.utils.setToggleChecked3(this.node.getChildByName('lati'),json.ti);
        cc.vv.utils.setToggleChecked2(this.node.getChildByName('buxipai'),json.xipai,1);
        cc.vv.utils.setToggleChecked2(this.node.getChildByName('jipaiqi'),json.remeberCard,1);
        this.node.getChildByName('gametype').getChildByName('FAndf').getComponent(cc.Toggle).isChecked = json.FAndf==1;
        this.node.getChildByName('gametype').getChildByName('TAndt').getComponent(cc.Toggle).isChecked = json.TAndt==1;
        if(json.mingpai != null){
            this.node.getChildByName('gametype').getChildByName('mingpai').getComponent(cc.Toggle).isChecked = json.mingpai==1;
        }
        
        if(json.fangzuobi){
            cc.vv.utils.setToggleChecked(this.node.getChildByName('fangzuobi'),json.fangzuobi);
        }
        
        if(json.gameMoShi != null){
            var event = new cc.Event.EventCustom('click', true);
            event.node = this.node.getChildByName('gameMoShi').getChildByName(json.gameMoShi);
            this.onBtnMoShi(event);
            if(json.gameMoShi == '0'){
                for(var i = 0; i < this.difenArr.length; i++){
                    if(json.difen == this.difenArr[i]){
                        this.index = i;
                    }
                }
            }
        }else{
            var moshi = json.difen == '1' ? '1' : '0';
            cc.vv.utils.setToggleChecked(this.node.getChildByName('gameMoShi'),moshi);
            var event = new cc.Event.EventCustom('click', true);
            event.node = this.node.getChildByName('gameMoShi').getChildByName(moshi);
            this.onBtnMoShi(event);
        }

        //模拟点击人数，变化耗卡数
        // var event = new cc.Event.EventCustom('click', true);
        // event.node = this.node.getChildByName('difen').getChildByName(json.difen);
        //this.onBtnDifen(event);
        // var event2 = new cc.Event.EventCustom('click', true);
        // event2.node = this.node.getChildByName('zha').getChildByName(json.zha);
        // this.onBtnZha(event2);
        // var event3 = new cc.Event.EventCustom('click', true);
        // event3.node = this.node.getChildByName('buxipai').getChildByName('buxipai');
        // this.onBtnBuxipai(event3);
    },

    onBtnMoShi:function(event){
        var show = false;
        this._gameMoShi = "jindian";
        switch(event.node.name){
            case "0":{
                show = true;
                this._gameMoShi = "guding";
            }
            break;
        }
        this.node.getChildByName('difen').active = show;
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

    //经典抢地主选择时
    onBtnDifen:function(event){
        if(event.node == null)return;

        var show = true;
        switch(event.node.name){
            case "1":{
                show = false;
            }
            break;
        }
        this.node.getChildByName('lati').active = show;
    },

    onBtnZha:function(event){
        var show = true;
        switch(event.node.name){
            case "0zha":{
                show = false;
            }
            break;
        }
        this.node.getChildByName('buxipai').getChildByName('buxipai').getComponent(cc.Toggle).isChecked = show;
    },

    onBtnBuxipai:function(event){
        switch(event.node.name){
            case 'buxipai':{
                if(event.isChecked){
                    var zha = cc.vv.utils.toggleChecked(this.node.getChildByName('zha'));
                    if(zha == '0zha'){
                        cc.vv.utils.setToggleChecked(this.node.getChildByName('zha'),"3zha");
                    }
                }
            }
        }
    },
    
    //勾选报名，必须勾听口
    onTiLaToggle:function(event,data){
        
        if(event.node == null)return;

        var lati = this.node.getChildByName('lati');
        var la = lati.getChildByName('la').getComponent(cc.Toggle).isChecked ? 'la' : '';
        var ti = lati.getChildByName('ti').getComponent(cc.Toggle).isChecked ? 'ti' : '';
        
        switch(event.node.name){
            case "ti":{
                //如果勾了踢，必须拉
                if(ti == 'ti'){
                    lati.getChildByName("la").getComponent(cc.Toggle).isChecked = true;
                }
            }
            break;
            case "la":{
                //如果没有勾拉，不能踢
                if(la == ''){
                    lati.getChildByName("ti").getComponent(cc.Toggle).isChecked = false;
                }
            }
            break;
        }
    },

    /**
     * 选项
     */
    Config:function(){
        
        var ju =  cc.vv.utils.toggleChecked(this.node.getChildByName('ju'));
        var zha =  cc.vv.utils.toggleChecked(this.node.getChildByName('zha'));
        //var difen =  cc.vv.utils.toggleChecked(this.node.getChildByName('difen')); 
        var lati = this.node.getChildByName('lati');
        var la = '', ti = '';
        if(lati.active){
            la = lati.getChildByName('la').getComponent(cc.Toggle).isChecked ? 'la' : '';
            ti = lati.getChildByName('ti').getComponent(cc.Toggle).isChecked ? 'ti' : '';
        }
        var xipai = this.node.getChildByName('buxipai');
        var buxipai = xipai.getChildByName('buxipai').getComponent(cc.Toggle).isChecked ? 1 : 0;
        var gametype = this.node.getChildByName('gametype');
        var FAndf = gametype.getChildByName('FAndf').getComponent(cc.Toggle).isChecked ? 1 : 0;
        var TAndt = gametype.getChildByName('TAndt').getComponent(cc.Toggle).isChecked ? 1 : 0;
        var mingpai = gametype.getChildByName('mingpai').getComponent(cc.Toggle).isChecked ? 1 : 0;

        var jipaiqi = this.node.getChildByName('jipaiqi').getChildByName('jipaiqi').getComponent(cc.Toggle).isChecked ? 1 : 0;
        var fangzuobi = cc.vv.utils.toggleChecked(this.node.getChildByName('fangzuobi'));
        var gameMoShi = cc.vv.utils.toggleChecked(this.node.getChildByName('gameMoShi'));
        var desc = [];
        switch (ju) {
            case "1ju": {
                desc.push("1局");
            }
            break;
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

        var difen = this.difen.string;
        if(gameMoShi == '1'){
            difen = '1';
            desc.push("经典");
        }else{
            switch (difen){
                case '1': {
                    desc.push("1分");
                }
                break;
                case '2': {
                    desc.push("2分");
                }
                break;
                case '3': {
                    desc.push("3分");
                }
                break;
                case '5': {
                    desc.push("5分");
                }
                break;
                case '10': {
                    desc.push("10分");
                }
                break;
                case '20': {
                    desc.push("20分");
                }
                break;
                case '50': {
                    desc.push("50分");
                }
                break;
            }
        }

        

        switch (zha) {
            case "3zha": {
                desc.push("3炸封顶");
            }
            break;
            case "4zha": {
                desc.push("4炸封顶");
            }
            break;
            case "5zha": {
                desc.push("5炸封顶");
            }
            break;
            case "0zha": {
                desc.push("不封顶");
            }
            break;
        }

        switch (la) {
            case 'la': {   
                desc.push('可加倍');
            }
            break;
        }

        switch (ti) {
            case 'ti': {   
                desc.push('可再加倍');
            }
            break;
        }

        switch (buxipai) {
            case 1: {
                desc.push('不洗牌');
            }
            break;
        }

        switch (TAndt) {
            case 1: {
                desc.push("三带一对");
            }
            break;
        }
        switch (FAndf) {
            case 1: {
                desc.push("四带两对");
            }
            break;
        }

        switch(jipaiqi){
            case 1:{
                desc.push("开启记牌器");
            }
            break;
        }

        switch (mingpai) {
            case 1: {
                desc.push('明牌');
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
            name:'ddz_1800',
            title:'经典斗地主',
            desc:desc,
            ju:ju,
            xipai:buxipai,
            ti:ti,
            la:la,
            zha:zha,
            difen:difen,
            TAndt:TAndt,
            FAndf:FAndf,
            ren:'3ren',
            remeberCard:jipaiqi,
            fangzuobi:fangzuobi,
            gameMoShi:gameMoShi,
            mingpai:mingpai
        }; 

        return conf;
    },
});
