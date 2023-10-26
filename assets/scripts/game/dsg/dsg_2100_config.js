cc.Class({
    extends: cc.Component,

    properties: {
        dou1:cc.Label,
        dou2:cc.Label
    },

    // use this for initialization
    onLoad: function () {
        this.loadSaveConfig();
        
    },

    //载入保存项
    loadSaveConfig:function(){
        this.auto_ready_list    = [];
        this.auto_ready_list_10 = ["手动","满2","满3","满4","满5","满6","满7","满8"];
        this.auto_ready_list_5  = ["手动","满2","满3","满4","满5"];
        this.auto_ready_list = this.auto_ready_list_5;
        //大众牛牛
        var conf = cc.sys.localStorage.getItem("last_game_dsg_2100");
        if(conf){
            var json = JSON.parse(conf);
            cc.vv.utils.setToggleChecked(this.node.getChildByName('ju'),json.ju);
            cc.vv.utils.setToggleChecked(this.node.getChildByName('wanfa'),json.wanfa);
            cc.vv.utils.setToggleChecked(this.node.getChildByName('zhuang'),json.zhuang);
            cc.vv.utils.setToggleChecked(this.node.getChildByName('ya'),json.ya);
            cc.vv.utils.setToggleChecked(this.node.getChildByName('feng'),json.feng);
            cc.vv.utils.setToggleChecked(this.node.getChildByName('ren'),json.ren);
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
            if(json.join != null)cc.vv.utils.setToggleChecked(this.node.getChildByName('join'),json.join);
            if(json.dizhu != null){
                this.node.getChildByName('difen').getChildByName("bg").getChildByName("difennum").getComponent(cc.Label).string = json.dizhu;
            }else{
                this.node.getChildByName('difen').getChildByName("bg").getChildByName("difennum").getComponent(cc.Label).string = "1";
            }
            var time;
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
                }else if(json.tuoGuan == 6){
                    time = "5";
                }else if(json.tuoGuan == 7){
                    time = "10";
                }
                this.node.getChildByName('tuoguan').getChildByName("num").getComponent(cc.Label).string = time;
            }
            //模拟点击人数，变化耗卡数
            var event = new cc.Event.EventCustom('click', true);
            event.node = this.node.getChildByName('ya').getChildByName(json.ya);
            this.onBtnYa(event,json.ya);
        }
    },

    loadSaveConfig2:function(data){
        this.auto_ready_list    = [];
        this.auto_ready_list_10 = ["手动","满2","满3","满4","满5","满6","满7","满8"];
        this.auto_ready_list_5  = ["手动","满2","满3","满4","满5"];
        this.auto_ready_list = this.auto_ready_list_5;
        var json = data.conf;
        cc.vv.utils.setToggleChecked(this.node.getChildByName('ju'),json.ju);
        cc.vv.utils.setToggleChecked(this.node.getChildByName('wanfa'),json.wanfa);
        cc.vv.utils.setToggleChecked(this.node.getChildByName('zhuang'),json.zhuang);
        cc.vv.utils.setToggleChecked(this.node.getChildByName('ya'),json.ya);
        cc.vv.utils.setToggleChecked(this.node.getChildByName('feng'),json.feng);
        cc.vv.utils.setToggleChecked(this.node.getChildByName('ren'),json.ren);
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
        if(json.join != null)cc.vv.utils.setToggleChecked(this.node.getChildByName('join'),json.join);
        if(json.dizhu != null){
            this.node.getChildByName('difen').getChildByName("bg").getChildByName("difennum").getComponent(cc.Label).string = json.dizhu;
        }else{
            this.node.getChildByName('difen').getChildByName("bg").getChildByName("difennum").getComponent(cc.Label).string = "1";
        }
        var time;
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
            }else if(json.tuoGuan == 6){
                time = "5";
            }else if(json.tuoGuan == 7){
                time = "10";
            }
            this.node.getChildByName('tuoguan').getChildByName("num").getComponent(cc.Label).string = time;
        }
        //模拟点击人数，变化耗卡数
        var event = new cc.Event.EventCustom('click', true);
        event.node = this.node.getChildByName('ya').getChildByName(json.ya);
        this.onBtnYa(event,json.ya);
    },
    /**
     * 推筒子 选分变化时
     */
    difenupd:function(event,data){
        var strnum =  parseInt(this.node.getChildByName('difen').getChildByName("bg").getChildByName("difennum").getComponent(cc.Label).string);
        if(data == "0"){
            if(strnum <= 10 && strnum > 1){
                strnum--;
            }else if(strnum == 20){
                strnum = 10;
            }else if(strnum == 50){
                strnum = 20;
            }else if(strnum == 1){
                strnum = 10;
            }
        }else if(data == "1"){
            if(strnum < 10 && strnum >= 1){
                strnum++;
            }else if(strnum == 10){
                strnum = 1;
            }else if(strnum == 20){
                strnum = 50;
            }else if(strnum == 50){
                strnum = 1;
            }
        }
        this.node.getChildByName('difen').getChildByName("bg").getChildByName("difennum").getComponent(cc.Label).string = strnum;
    },
   //托管时间 加减框
   btn_tuoguan_click_event:function(data,event){ //event = 1是 +   event = 0 是 -
    var num = this.node.getChildByName('tuoguan').getChildByName("num");
    var num_str = num.getComponent(cc.Label).string;
    if(event == "1"){
        if(num_str == "5"){
            num_str = "10";
        }else if(num_str == "10"){
            num_str = "15";
        }else if(num_str == "15"){
            num_str = "20";
        }else if(num_str == "20"){
            num_str = "30";
        }else if(num_str == "30"){
            num_str = "60";
        }else if(num_str == "60"){
            num_str = "120";
        }else if(num_str == "120"){
            num_str = "不限";
        }else if(num_str == "不限"){
            num_str = "5";
        }
    }else if(event == "0"){
        if(num_str == "5"){
            num_str = "不限";
        }else if(num_str == "10"){
            num_str = "5";
        }else if(num_str == "15"){
            num_str = "10";
        }else if(num_str == "20"){
            num_str = "15";
        }else if(num_str == "30"){
            num_str = "20";
        }else if(num_str == "60"){
            num_str = "30";
        }else if(num_str == "120"){
            num_str = "60";
        }else if(num_str == "不限"){
            num_str = "120";
        }
    }
    num.getComponent(cc.Label).string = num_str;
},
    onBtnYa:function(event,detail){

        var ren = cc.vv.utils.toggleChecked(this.node.getChildByName('ren'));
        var ya = cc.vv.utils.toggleChecked(this.node.getChildByName('ya'));

        //人数
        switch (ren) {
            case "5ren": {
                this.dou1.string = "2";
                this.dou2.string = "4";
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
                this.dou2.string = "6";
                this.auto_ready_list = this.auto_ready_list_10;
            }
            break;
        }
        var show = false;
        switch(ya){
            case "guding":{
                show = true;
            }
            break;
        }
        this.node.getChildByName('feng').active = show;
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
    /**
     * 牛牛选项
     */
    Config:function(daikai){
        
        var ju = cc.vv.utils.toggleChecked(this.node.getChildByName('ju'));
        var zhuang = cc.vv.utils.toggleChecked(this.node.getChildByName('zhuang'));
        var ya = cc.vv.utils.toggleChecked(this.node.getChildByName('ya'));
        var feng = cc.vv.utils.toggleChecked(this.node.getChildByName('feng'));
        var wanfa = cc.vv.utils.toggleChecked(this.node.getChildByName('wanfa'));
        var ren = cc.vv.utils.toggleChecked(this.node.getChildByName('ren'));
        var join = cc.vv.utils.toggleChecked(this.node.getChildByName('join'));
        var tuoguan = this.node.getChildByName('tuoguan').getChildByName("num").getComponent(cc.Label).string;
        var strnum =  parseInt(this.node.getChildByName('difen').getChildByName("bg").getChildByName("difennum").getComponent(cc.Label).string);

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

        if(ya == "xuan"){
            feng = "0feng";
        }

        var desc = [];
        desc.push("底分" + strnum);
        
        //局数
        switch (ju) {
            case "10ju": {
                desc.push("10局");
            }
            break;
            default:{
                desc.push("20局");
            }
            break;
        }
        
        //人数
        switch (ren) {
            case "5ren": {
               desc.push("5人场");
            }
            break;
            case "8ren": {
               desc.push("8人场");
            }
            break;
        }
			
        //抢分或固定分
        switch (feng) {
            case "0feng": {
            //    desc.push("每次选分");
            }
            break;
            case "3feng": {
               desc.push("固定3分");
            }
            break;
            case "5feng": {
               desc.push("固定5分");
            }
            break;
            case "7feng": {
               desc.push("固定7分");
            }
            break;
            case "10feng": {
               desc.push("固定10分");
            }
            break;
        }

			//模式
        switch (zhuang) {
            case "qiang": {
               desc.push("抢庄");
            }
            break;
            case "lunliu": {
               desc.push("轮庄");
            }
            break;
            case "fangzhu": {
               desc.push("霸王庄");
            }
            break;
        }
			
        //玩法
        switch (wanfa) {
        case "ko1": {
           desc.push("扣1张");
        }
        break;
        case "ko2": {
           desc.push("扣2张");
        }
        break;
        case "quankou": {
           desc.push("全扣");
        }
        break;
        }
        if(tuoguan && tuoguan != "不限"){
            desc.push(tuoguan +"秒下注");
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
        var start_mode = index + 1
        if(start_mode == 1){
            start_mode = 0;
        }
        if(index == 0){
            desc.push('手动开局');
        }else{
            desc.push('满'+ start_mode +"人自动开局");
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
        }else if(tuoguan == 5){
            server_value = 6;
        }else if(tuoguan == 10){
            server_value = 7;
        }else{
            server_value = 0;
        }
        var conf = {
            name:'dsg_2100',
            title:'斗三公',
            desc:desc,
            ju:ju,
            wanfa:wanfa,
            dizhu:strnum,
            ren:ren,
            tuoGuan:server_value,
            start_mode:start_mode,
            feng:feng,
            zhuang:zhuang,
            ya:ya,
            join:join
        }; 

        return conf;
    },
});
