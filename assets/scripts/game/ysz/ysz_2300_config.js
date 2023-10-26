cc.Class({
    extends: cc.Component,

    properties: {
        dou1:cc.Label,
        dou2:cc.Label,
        dou3:cc.Label,
        fangzuobiNode: cc.Node
    },

    // use this for initialization
    onLoad: function () {
        this.loadSaveConfig();
        this.waibuy_time  = ["120","180","300","480","600","1200"];
        this.baozi_score  = ["0","10","20","30","40","50","60","70","80","90","100"];
        this.toujiabimanNumber  = ["1","2","3","4","5"];
        this.toujiabimanNumberFengkuang  = ["1","2","3","4","5","8","10"];
    },
    wenhao_tips:function(event, data){
        //报听
        switch (event.target.name) {
         case "yszfengkuangjiabei": {
             cc.vv.popMgr.alert("疯狂加倍：加注功能添加8倍底分与10倍底分");
         }
         break;
        }
    },
    //载入保存项
    loadSaveConfig:function(){
        this.auto_ready_list    = [];
        this.auto_ready_list_10 = ["手动","满2","满3","满4","满5","满6","满7","满8"];
        this.auto_ready_list_5  = ["手动","满2","满3","满4","满5"];
        this.auto_ready_list = this.auto_ready_list_5;
        var conf = cc.sys.localStorage.getItem("last_game_ysz_2300");
        if(conf){
            var json = JSON.parse(conf);
            switch(json.ju){
                case '10':{
                    json.ju = '8';
                }
                break;
                case '20':{
                    json.ju = '16';
                }
                break;
            }
            cc.vv.utils.setToggleChecked(this.node.getChildByName('ju'),json.ju);
            cc.vv.utils.setToggleChecked(this.node.getChildByName('ren'),json.ren);
            cc.vv.utils.setToggleChecked(this.node.getChildByName('minPai'),json.minPai);
            cc.vv.utils.setToggleChecked(this.fangzuobiNode,json.fangzuobi);
            if(json.sCompareT)
                cc.vv.utils.setToggleChecked(this.node.getChildByName('sCompareT'),json.sCompareT);
            //cc.vv.utils.setToggleChecked(this.node.getChildByName('dizhu'),json.dizhu);
            //cc.vv.utils.setToggleChecked(this.node.getChildByName('maxLun'),json.maxLun);
            // cc.vv.utils.setToggleChecked(this.node.getChildByName('tuoguan'),json.tuoGuan);
            // cc.vv.utils.setToggleChecked(this.node.getChildByName('biLun'),json.biLun);
            // cc.vv.utils.setToggleChecked(this.node.getChildByName('anLun'),json.anLun);
 
            this.node.getChildByName('dizhu').getChildByName("num").getComponent(cc.Label).string = json.dizhu;
            if(json.maxLun == "30"){
                json.maxLun == "20";
            }
            if(json.maxfen == "0"){
                json.maxfen = "不限"
            }
            if(json.waitbuy){
                this.node.getChildByName('waitbuy').getChildByName("num").getComponent(cc.Label).string = json.waitbuy;
            }
            if(json.baozi){
                this.node.getChildByName('baozi').getChildByName("num").getComponent(cc.Label).string = json.baozi;
            }
            this.node.getChildByName('maxLun').getChildByName("num").getComponent(cc.Label).string = json.maxLun;
            this.node.getChildByName('biLun').getChildByName("num").getComponent(cc.Label).string = json.biLun;
            this.node.getChildByName('anLun').getChildByName("num").getComponent(cc.Label).string = json.anLun;
            if(json.showWin == 1){
                cc.vv.utils.setToggleChecked(this.node.getChildByName('showWin'),json.showWin,1);
            }else{
                cc.vv.utils.setToggleChecked(this.node.getChildByName('showWin'),json.showWin,0);
            }
            
            if(json.maxfen){
                this.node.getChildByName('maxfen').getChildByName("num").getComponent(cc.Label).string = json.maxfen;
            }
            if(json.MinKeep){
                cc.vv.utils.setToggleChecked(this.node.getChildByName('MinKeep'),json.MinKeep);
            }
            if(json.ren == "5ren"){
                this.auto_ready_list = this.auto_ready_list_5;
            }else{
                this.auto_ready_list = this.auto_ready_list_10;
            }
            if(json.start_mode != null){//自动开局
                if(json.start_mode != 0){
                    this.node.getChildByName('autoready').getChildByName("num").getComponent(cc.Label).string = this.auto_ready_list[json.start_mode - 1];
                }else{
                    this.node.getChildByName('autoready').getChildByName("num").getComponent(cc.Label).string = this.auto_ready_list[json.start_mode];
                }
                
            }else{
                this.node.getChildByName('autoready').getChildByName("num").getComponent(cc.Label).string = this.auto_ready_list[0];
            }
            if(json.bipower)
                this.node.getChildByName('bipower').getChildByName("num").getComponent(cc.Label).string = json.bipower;
            else
                this.node.getChildByName('bipower').getChildByName("num").getComponent(cc.Label).string = "4";
            var time;
            if(json.fengKuang){
                cc.vv.utils.setToggleChecked(this.node.getChildByName('fengKuang'),json.fengKuang);
            }
            if(json.tuoGuan != null){
                if(json.tuoGuan == 0){
                    time = "不限";
                }else if(json.tuoGuan == 1){
                    time = "15";
                }else if(json.tuoGuan == 2){
                    time = "20";
                }else if(json.tuoGuan == 3){
                    time = "30";
                }else if(json.tuoGuan == 4){
                    time = "60";
                }else if(json.tuoGuan == 5){
                    time = "120";
                }
            }else{
                time = "不限";
            }
            this.node.getChildByName('tuoguan').getChildByName("num").getComponent(cc.Label).string = time;

            var is_ture;
            if(json.Birule == 1){
                is_ture = true;
            }else{
                is_ture = false;
            }
            if(json.jiaZhu){
                cc.vv.utils.setToggleChecked(this.node.getChildByName('toujiabiman'),json.jiaZhu);
            }
            if(json.beishu){
                this.node.getChildByName('toujiabimanNumber').getChildByName("num").getComponent(cc.Label).string = json.beishu;
            }
            cc.vv.utils.setToggleChecked(this.node.getChildByName('Birule'),is_ture);
            cc.vv.utils.setToggleChecked(this.node.getChildByName('baozi'),json.baozi);
            //模拟点击人数，变化耗卡数
            var event = new cc.Event.EventCustom('click', true);
            this.onBtnYa(event,json.ya);
        
            if(json.join != null)cc.vv.utils.setToggleChecked(this.node.getChildByName('join'),json.join);
        }
    },

    loadSaveConfig2:function(data){
        
        this.auto_ready_list    = [];
        this.auto_ready_list_10 = ["手动","满2","满3","满4","满5","满6","满7","满8"];
        this.auto_ready_list_5  = ["手动","满2","满3","满4","满5"];
        this.auto_ready_list = this.auto_ready_list_5;
        var json = data.conf;
        switch(json.ju){
            case '10':{
                json.ju = '8';
            }
            break;
            case '20':{
                json.ju = '16';
            }
            break;
        }
        cc.vv.utils.setToggleChecked(this.node.getChildByName('ju'),json.ju);
        cc.vv.utils.setToggleChecked(this.node.getChildByName('ren'),json.ren);
        cc.vv.utils.setToggleChecked(this.node.getChildByName('minPai'),json.minPai);
        cc.vv.utils.setToggleChecked(this.fangzuobiNode,json.fangzuobi);
        if(json.sCompareT)
                cc.vv.utils.setToggleChecked(this.node.getChildByName('sCompareT'),json.sCompareT);
        // cc.vv.utils.setToggleChecked(this.node.getChildByName('dizhu'),json.dizhu);
        // cc.vv.utils.setToggleChecked(this.node.getChildByName('maxLun'),json.maxLun);
        // cc.vv.utils.setToggleChecked(this.node.getChildByName('biLun'),json.biLun);
        // cc.vv.utils.setToggleChecked(this.node.getChildByName('anLun'),json.anLun);
        // cc.vv.utils.setToggleChecked(this.node.getChildByName('tuoguan'),json.tuoGuan);
        this.node.getChildByName('dizhu').getChildByName("num").getComponent(cc.Label).string = json.dizhu;
        if(json.maxLun == "30"){
            json.maxLun == "20";
        }
        if(json.showWin == 1){
            cc.vv.utils.setToggleChecked(this.node.getChildByName('showWin'),json.showWin,1);
        }else{
            cc.vv.utils.setToggleChecked(this.node.getChildByName('showWin'),json.showWin,0);
        }
        if(json.waitbuy){
            this.node.getChildByName('waitbuy').getChildByName("num").getComponent(cc.Label).string = json.waitbuy;
        }
        if(json.baozi){
            this.node.getChildByName('baozi').getChildByName("num").getComponent(cc.Label).string = json.baozi;
        }
        this.node.getChildByName('maxLun').getChildByName("num").getComponent(cc.Label).string = json.maxLun;
        this.node.getChildByName('biLun').getChildByName("num").getComponent(cc.Label).string = json.biLun;
        this.node.getChildByName('anLun').getChildByName("num").getComponent(cc.Label).string = json.anLun;
        this.node.getChildByName('bipower').getChildByName("num").getComponent(cc.Label).string = json.bipower;
        if(json.ren == "5ren"){
            this.auto_ready_list = this.auto_ready_list_5;
        }else{
            this.auto_ready_list = this.auto_ready_list_10;
        }
        if(json.start_mode != null){//自动开局
            if(json.start_mode != 0){
                this.node.getChildByName('autoready').getChildByName("num").getComponent(cc.Label).string = this.auto_ready_list[json.start_mode - 1];
            }else{
                this.node.getChildByName('autoready').getChildByName("num").getComponent(cc.Label).string = this.auto_ready_list[json.start_mode];
            }
            
        }else{
            this.node.getChildByName('autoready').getChildByName("num").getComponent(cc.Label).string = this.auto_ready_list[0];
        }
        if(json.fengKuang){
            cc.vv.utils.setToggleChecked(this.node.getChildByName('fengKuang'),json.fengKuang);
        }
        if(json.MinKeep){
            cc.vv.utils.setToggleChecked(this.node.getChildByName('MinKeep'),json.MinKeep);
        }
        var time;
        if(json.tuoGuan != null){
            if(json.tuoGuan == 0){
                time = "无限"
            }else if(json.tuoGuan == 1){
                time = "15";
            }else if(json.tuoGuan == 2){
                time = "20";
            }else if(json.tuoGuan == 3){
                time = "30";
            }else if(json.tuoGuan == 4){
                time = "60";
            }else if(json.tuoGuan == 5){
                time = "120";
            }
        }else{
            time = "无限"
        }
        this.node.getChildByName('tuoguan').getChildByName("num").getComponent(cc.Label).string = time;
        var is_ture;
        if(json.Birule == 1){
            is_ture = true;
        }else{
            is_ture = false;
        }
        if(json.jiaZhu){
            cc.vv.utils.setToggleChecked(this.node.getChildByName('toujiabiman'),json.jiaZhu);
        }
        cc.vv.utils.setToggleChecked(this.node.getChildByName('Birule'),is_ture);
        cc.vv.utils.setToggleChecked(this.node.getChildByName('baozi'),json.baozi);
        if(json.join != null)cc.vv.utils.setToggleChecked(this.node.getChildByName('join'),json.join);
        //模拟点击人数，变化耗卡数
        var event = new cc.Event.EventCustom('click', true);
        this.onBtnYa(event,json.ya);
    },
    
    
    /**
     * 推筒子 选分变化时
     */
    onBtnYa:function(event,detail){

        var ren = cc.vv.utils.toggleChecked(this.node.getChildByName('ren'));

        //人数
        switch (ren) {
            case "5ren": {
                this.dou1.string = "3";
                this.dou2.string = "5";
                this.dou3.string = "4";
                var num_list = this.auto_ready_list;
                var num = this.node.getChildByName('autoready').getChildByName("num");
                var num_str = num.getComponent(cc.Label).string;
                var index = 0;
                for(var i = 0;i < num_list.length;i++){
                    if(num_list[i] == num_str){
                        index = i;
                        break;
                    }
                }
                if(index >= 5){
                    index = 4;
                }
                num.getComponent(cc.Label).string = num_list[index];
                this.auto_ready_list = this.auto_ready_list_5;
            }
            break;
            case "8ren": {
                this.dou1.string = "4";
                this.dou2.string = "7";
                this.dou3.string = "5";
                this.auto_ready_list = this.auto_ready_list_10;
            }
            break;
        }

        if(event.node == null)return;
        var show = false;
        switch(event.node.name){
            case "guding":{
                show = true;
            }
            break;
        }
    },
    //底注 加减框
    btn_dizhu_click_event:function(data,event){ //event = 1是 +   event = 0 是 -
        var num = this.node.getChildByName('dizhu').getChildByName("num");
        var strnum = parseInt(num.getComponent(cc.Label).string);
        if(event == "0"){
            if(strnum <= 10 && strnum > 1){
                strnum--;
            }else if(strnum == 20){
                strnum = 10;
            }else if(strnum == 50){
                strnum = 20;
            }else if(strnum <= 1){
                strnum = 10;
            }else if(strnum == 100){
                strnum = 50;
            }
            
        }else if(event == "1"){
            if(strnum < 10 && strnum >= 1){
                strnum++;
            }else if(strnum >= 10){
                strnum = 1;
            }else if(strnum == 20){
                strnum = 50;
            }else if(strnum == 50){
                strnum = 100;
            }else if(strnum == 100){
                strnum = 1;
            }
        }
        num.getComponent(cc.Label).string = strnum;
    },
    //比牌轮数 加减框
    btn_bilun_click_event:function(data,event){ //event = 1是 +   event = 0 是 -
        var num = this.node.getChildByName('biLun').getChildByName("num");
        var num_str = parseInt(num.getComponent(cc.Label).string);
        if(event == "1"){
            if(num_str >= 3){
                num_str = 0;
            }else{
                num_str++;
            }
        }else if(event == "0"){
            if(num_str <= 0){
                num_str = 3;
            }else{
                num_str--;
            }
        }
        num.getComponent(cc.Label).string = num_str;
    },
    //闷牌轮数 加减框
    btn_anLun_click_event:function(data,event){ //event = 1是 +   event = 0 是 -
        var num = this.node.getChildByName('anLun').getChildByName("num");
        var num_str = parseInt(num.getComponent(cc.Label).string);
        if(event == "1"){
            if(num_str == 0){
                num_str = 1;
            }else if(num_str == 1){
                num_str = 3;
            }else if(num_str == 3){
                num_str = 5;
            }else if(num_str == 5){
                num_str = 0;
            }
        }else if(event == "0"){
            if(num_str == 0){
                num_str = 5;
            }else if(num_str == 1){
                num_str = 0;
            }else if(num_str == 3){
                num_str = 1;
            }else if(num_str == 5){
                num_str = 3;
            }
        }
        num.getComponent(cc.Label).string = num_str;
    },
    //最大轮数 加减框
    btn_maxLun_click_event:function(data,event){ //event = 1是 +   event = 0 是 -
        var num = this.node.getChildByName('maxLun').getChildByName("num");
        var num_str = parseInt(num.getComponent(cc.Label).string);
        if(event == "1"){
            if(num_str == 5){
                num_str = 10;
            }else if(num_str == 10){
                num_str = 15;
            }else if(num_str == 15){
                num_str =20;
            }else if(num_str == 20){
                num_str = 5;
            }
        }else if(event == "0"){
            if(num_str == 5){
                num_str = 20;
            }else if(num_str == 10){
                num_str = 5;
            }else if(num_str == 15){
                num_str = 10;
            }else if(num_str == 20){
                num_str = 15;
            }
        }
        num.getComponent(cc.Label).string = num_str;
    },
    //托管时间 加减框
    btn_tuoguan_click_event:function(data,event){ //event = 1是 +   event = 0 是 -
        var num = this.node.getChildByName('tuoguan').getChildByName("num");
        var num_str = num.getComponent(cc.Label).string;
        if(event == "1"){
            if(num_str == "15"){
                num_str = "20";
            }else if(num_str == "20"){
                num_str = "30";
            }else if(num_str == "30"){
                num_str = "60";
            }else if(num_str == "60"){
                num_str = "120";
            }else if(num_str == "120"){
                num_str = "不限";
            }else if(num_str == "不限" || num_str == "无限"){
                num_str = "15";
            }
        }else if(event == "0"){
            if(num_str == "15"){
                num_str = "不限";
            }else if(num_str == "20"){
                num_str = "15";
            }else if(num_str == "30"){
                num_str = "20";
            }else if(num_str == "60"){
                num_str = "30";
            }else if(num_str == "120"){
                num_str = "60";
            }else if(num_str == "不限" || num_str == "无限"){
                num_str = "120";
            }
        }
        num.getComponent(cc.Label).string = num_str;
    },
    // 加减框
    btn_maxfen_click_event:function(data,event){ //event = 1是 +   event = 0 是 -
        var num = this.node.getChildByName('maxfen').getChildByName("num");
        var num_str = num.getComponent(cc.Label).string;
        if(event == "1"){
            if(num_str == "200"){
                num_str = "300";
            }else if(num_str == "300"){
                num_str = "500";
            }else if(num_str == "500"){
                num_str = "800";
            }else if(num_str == "800"){
                num_str = "1000";
            }else if(num_str == "1000"){
                num_str = "不限";
            }else if(num_str == "不限"){
                num_str = "200";
            }
        }else if(event == "0"){
            if(num_str == "不限"){
                num_str = "1000";
            }else if(num_str == "1000"){
                num_str = "800";
            }else if(num_str == "800"){
                num_str = "500";
            }else if(num_str == "500"){
                num_str = "300";
            }else if(num_str == "300"){
                num_str = "200";
            }else if(num_str == "200"){
                num_str = "不限";
            }
        }
        num.getComponent(cc.Label).string = num_str;
    },
    //已看与未看比牌 比 倍数 加减框
    btn_bipower_click_event:function(data,event){ //event = 1是 +   event = 0 是 -
        var num = this.node.getChildByName('bipower').getChildByName("num");
        var num_str = parseInt(num.getComponent(cc.Label).string);
        if(num_str == 2){
            num_str = 4;
        }else{
            num_str = 2;
        }
        num.getComponent(cc.Label).string = num_str;
    },
    btn_auto_ready:function(data,event){
        var num_list = this.auto_ready_list;
        var num = this.node.getChildByName('autoready').getChildByName("num");
        var num_str = num.getComponent(cc.Label).string;
        var index = 0;
        for(var i = 0;i < num_list.length;i++){
            if(num_list[i] == num_str){
                index = i;
                break;
            }
        }
        if(event == "1"){
            index++;
            if(index >= num_list.length){
                index = 0;
            }
        }else{
            index--;
            if(index < 0){
                index = num_list.length - 1;
            }
        }
        num.getComponent(cc.Label).string = num_list[index];
    },
    waibuytime:function(data,event){
        //
        var num_list = this.waibuy_time;
        
        var num = this.node.getChildByName('waitbuy').getChildByName("num");
        var num_str = num.getComponent(cc.Label).string;
        var index = 0;
        for(var i = 0;i < num_list.length;i++){
            if(num_list[i] == num_str){
                index = i;
                break;
            }
        }
        if(event == "1"){
            index++;
            if(index >= num_list.length){
                index = 0;
            }
        }else{
            index--;
            if(index < 0){
                index = num_list.length - 1;
            }
        }
        num.getComponent(cc.Label).string = num_list[index];
    },
    baozi_list:function(data,event){
        //
        var num_list = this.baozi_score;
        
        var num = this.node.getChildByName('baozi').getChildByName("num");
        var num_str = num.getComponent(cc.Label).string;
        var index = 0;
        for(var i = 0;i < num_list.length;i++){
            if(num_list[i] == num_str){
                index = i;
                break;
            }
        }
        if(event == "1"){
            index++;
            if(index >= num_list.length){
                index = 0;
            }
        }else{
            index--;
            if(index < 0){
                index = num_list.length - 1;
            }
        }
        num.getComponent(cc.Label).string = num_list[index];
    },

    //首轮必闷加减框
    btn_shoujiabimenAdd:function(data,event){
        //
        var num_list = this.toujiabimanNumber;
        var fengKuang = cc.vv.utils.toggleChecked(this.node.getChildByName('fengKuang'));
        if(fengKuang == 1){
            var num_list = this.toujiabimanNumberFengkuang;
        }
        
        var num = this.node.getChildByName('toujiabimanNumber').getChildByName("num");
        var num_str = num.getComponent(cc.Label).string;
        var index = 0;
        for(var i = 0;i < num_list.length;i++){
            if(num_list[i] == num_str){
                index = i;
                break;
            }
        }
        if(event == "1"){
            index++;
            if(index >= num_list.length){
                index = 0;
            }
        }else{
            index--;
            if(index < 0){
                index = num_list.length - 1;
            }
        }
        num.getComponent(cc.Label).string = num_list[index];
    },

    btn_fengkuang:function(){
        var fengKuang = cc.vv.utils.toggleChecked(this.node.getChildByName('fengKuang'));
        if(fengKuang != 1){
            var num = this.node.getChildByName('toujiabimanNumber').getChildByName("num");
            num.getComponent(cc.Label).string = "1";
        }
    },

    /**
     * 赢三张选项
     */
    Config:function(daikai){
        var ju = cc.vv.utils.toggleChecked(this.node.getChildByName('ju'));//局数
        var ren = cc.vv.utils.toggleChecked(this.node.getChildByName('ren'));//人数
        var maxLun = cc.vv.utils.toggleChecked(this.node.getChildByName('maxLun'));//封顶开牌
        var biLun = cc.vv.utils.toggleChecked(this.node.getChildByName('biLun'));//比牌轮数
        var anLun = cc.vv.utils.toggleChecked(this.node.getChildByName('anLun'));//闷牌轮数
        //var baozi = cc.vv.utils.toggleChecked(this.node.getChildByName('baozi'));//豹子奖励
        var dizhu = cc.vv.utils.toggleChecked(this.node.getChildByName('dizhu'));//底注
        var tuoguan = cc.vv.utils.toggleChecked(this.node.getChildByName('tuoguan'));//底注
        var join = cc.vv.utils.toggleChecked(this.node.getChildByName('join'));
        var minPai = cc.vv.utils.toggleChecked(this.node.getChildByName('minPai'));
        var sCompareT = cc.vv.utils.toggleChecked(this.node.getChildByName('sCompareT'));
        var fengKuang = cc.vv.utils.toggleChecked(this.node.getChildByName('fengKuang'));
        var MinKeep = cc.vv.utils.toggleChecked(this.node.getChildByName('MinKeep'));
        var showWin = cc.vv.utils.toggleChecked(this.node.getChildByName('showWin'));//赢家不翻牌
        var fangzuobi = cc.vv.utils.toggleChecked(this.fangzuobiNode);
        
        var Birule = this.node.getChildByName('Birule').getChildByName("1").getComponent(cc.Toggle).isChecked;

        var desc = [];

        var dizhu = this.node.getChildByName('dizhu').getChildByName("num").getComponent(cc.Label).string;
        var biLun = this.node.getChildByName('biLun').getChildByName("num").getComponent(cc.Label).string;
        var anLun = this.node.getChildByName('anLun').getChildByName("num").getComponent(cc.Label).string;
        var maxLun = this.node.getChildByName('maxLun').getChildByName("num").getComponent(cc.Label).string;
        var tuoguan = this.node.getChildByName('tuoguan').getChildByName("num").getComponent(cc.Label).string;
        var bipower = this.node.getChildByName('bipower').getChildByName("num").getComponent(cc.Label).string;
        var maxfen = this.node.getChildByName('maxfen').getChildByName("num").getComponent(cc.Label).string;
        var waitbuy = this.node.getChildByName('waitbuy').getChildByName("num").getComponent(cc.Label).string;
        var baozi = this.node.getChildByName('baozi').getChildByName("num").getComponent(cc.Label).string;
        var num_list = this.auto_ready_list;
        var num = this.node.getChildByName('autoready').getChildByName("num");
        var num_str = num.getComponent(cc.Label).string;

        var jiaZhu = cc.vv.utils.toggleChecked(this.node.getChildByName('toujiabiman'));

        var beishu = this.node.getChildByName('toujiabimanNumber').getChildByName("num").getComponent(cc.Label).string;

        var index = 0;
        for(var i = 0;i < num_list.length;i++){
            if(num_list[i] == num_str){
                index = i;
                break;
            }
        }

        //人数
        switch (ren) {
            case "5ren": {
                //desc.push("5人场");
            }
            break;
            case "8ren": {
                //desc.push("8人场");
            }
            break;
        }
        //局数
        switch (ju) {
            case "8": {
                desc.push("8局");
            }
            break;
            case "12": {
                desc.push("12局");
            }
            break;
            case "16": {
                desc.push("16局");
            }
            break;
        }
        //底注
        if(dizhu){
            desc.push("底注" + dizhu + "分");
        }

        if(biLun){
            desc.push(biLun + "轮比牌");
        }
        if(anLun){
            desc.push(anLun + "轮闷牌");
        }
        if(maxLun){
            desc.push(maxLun + "轮开牌");
        }
        if(tuoguan && (tuoguan != "无限" || tuoguan != "不限")){
            desc.push(tuoguan +"秒弃牌");
        }
        //比牌限制
        if(Birule){
            desc.push("比牌限制");
        }
        if(bipower){
            desc.push("已看牌比牌" + bipower + "倍"); 
        }
        baozi = parseFloat(baozi);
        if(baozi != 0){
            desc.push('豹子奖励'+baozi+'分');
        }
        switch(join){
            case "yes":{
                desc.push('中途加入');
            }
            break;
            default:{
                join = '';
            }
            break;
        }
        switch(fengKuang){
            case "1":{
                desc.push('疯狂加倍');
            }
            break;
        }

        switch(jiaZhu){
            case "1":{
                desc.push('首家必满');
                desc.push("首轮倍数" + beishu + "倍");
            }
            break;
            default:{
                beishu = "1";
            }
        }
        //防作弊
        switch (fangzuobi) {
            case "1": {
                desc.push("防作弊");
            }
            break;
        }
        if(minPai == "0"){
            desc.push("235不吃豹子");
        }
        
        var start_mode = index + 1
        if(start_mode == 1){
            start_mode = 0;
        }
        if(index == 0){
            desc.push('手动开局');
        }else{
            desc.push('满'+ start_mode +"人自动开局");
        }
        if(sCompareT == 1){
            desc.push('顺子大过金花');
        }
        if(sCompareT != 1){
            sCompareT = 0;
        }
        var server_value;
        if(tuoguan == 15){
            server_value = 1;
        }else if(tuoguan == 20){
            server_value = 2;
        }else if(tuoguan == 30){
            server_value = 3;
        }else if(tuoguan == 60){
            server_value = 4;
        }else if(tuoguan == 120){
            server_value = 5;
        }else{
            server_value = 0;
        }
        if(maxfen == "不限"){
            maxfen = "0";
        }else{
            desc.push(maxfen+'分封顶');
        }
        if(MinKeep == 1){
            desc.push('123最小');
        } 
        waitbuy = parseFloat(waitbuy);
        if(waitbuy >= 60){
            desc.push('加胜点等待'+ (waitbuy/60) +'分');
        }else{
            desc.push('加胜点等待'+ waitbuy +'秒');
        }
        if(showWin == 1){
            desc.push('赢家不翻牌');
        }
       
        var conf = {
            name:'ysz_2300',
            title:'欢乐斗',
            desc:desc,
            ju:ju,
            minPai:minPai,
            sCompareT:sCompareT,
            ren:ren,
            maxLun:maxLun,
            start_mode:start_mode,
            biLun:biLun,
            bipower:bipower,
            anLun:anLun,
            baozi:baozi,
            dizhu:dizhu,
            Birule:Birule == true ? 1 : 0,
            tuoGuan:server_value,
            join:join,
            fengKuang:fengKuang,
            maxfen:maxfen,
            MinKeep:MinKeep,
            waitbuy:waitbuy,
            showWin:showWin,
            jiaZhu:jiaZhu,
            beishu:beishu,
            fangzuobi:fangzuobi,
        }; 
        return conf;
    },
});
