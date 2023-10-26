cc.Class({
    extends: cc.Component,

    properties: {
        _view:null,
    },

    // use this for initialization
    onLoad: function () {
        this.limit_index = 4;
        this.limitQZ = this.node.getChildByName('limitQZ').getChildByName("bg").getChildByName("difennum").getComponent(cc.Label);//抢庄限制
        this.limitQZArr = ["0","50", "100", "200", "300", "400", "500", "600", "700", "800", "900", "1000"];
        this.is_limit_QZ = true;
        this.loadSaveConfig();
    },

    //载入保存项
    loadSaveConfig:function(){
        this.auto_ready_list    = ["手动","满2","满3","满4","满5"];
        //大众推九点
        var conf = cc.sys.localStorage.getItem("last_game_ttz_1402") ;
        if(conf){
            var json = JSON.parse(conf);
            switch(json.ju){
                case '10ju':{
                    json.ju = '8ju';
                }
                break;
                case '20ju':{
                    json.ju = '16ju';
                }
                break;
            }
            cc.vv.utils.setToggleChecked(this.node.getChildByName('ju'),json.ju);
            cc.vv.utils.setToggleChecked(this.node.getChildByName('ren'),json.ren);
            cc.vv.utils.setToggleChecked(this.node.getChildByName('zhuang'),json.zhuang);
            cc.vv.utils.setToggleChecked2(this.node.getChildByName('yaoshaizi'),json.auto,1);
            cc.vv.utils.setToggleChecked2(this.node.getChildByName('wanfa'),json.cond,1);
            cc.vv.utils.setToggleChecked(this.node.getChildByName('fangzuobi'),json.fangzuobi);
            if(json.overflow){
                cc.vv.utils.setToggleChecked(this.node.getChildByName('overflow'),json.overflow);
            }
            if(json.zhuang != "qiang" || json.zhuang != "lunliu" || json.zhuang != "lun"){
                this.is_limit_QZ = false;
            }else{
                this.is_limit_QZ = true;
            }
            if(json.limitQZ){
                this.limitQZ.string = json.limitQZ;
                for (var index = 0; index < this.limitQZArr.length; index++) {
                    if(this.limitQZ.string == this.limitQZArr[index]){
                        this.limit_index = index;
                    }
                }
            }
            if(json.rule == 0){
                cc.vv.utils.setToggleChecked(this.node.getChildByName('rule'),json.rule,0);
            }else{
                cc.vv.utils.setToggleChecked(this.node.getChildByName('rule'),json.rule,1);
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
            var event = new cc.Event.EventCustom('click', true);
            event.node = this.node.getChildByName('ren').getChildByName(json.ren);
            this.onBtnRen(event);
        }

    },

    loadSaveConfig2:function(data){
        this.auto_ready_list    = ["手动","满2","满3","满4","满5"];
        var json = data.conf;
        switch(json.ju){
            case '10ju':{
                json.ju = '8ju';
            }
            break;
            case '20ju':{
                json.ju = '16ju';
            }
            break;
        }
        cc.vv.utils.setToggleChecked(this.node.getChildByName('ju'),json.ju);
        cc.vv.utils.setToggleChecked(this.node.getChildByName('ren'),json.ren);
        cc.vv.utils.setToggleChecked(this.node.getChildByName('zhuang'),json.zhuang);
        cc.vv.utils.setToggleChecked2(this.node.getChildByName('yaoshaizi'),json.auto);
        cc.vv.utils.setToggleChecked2(this.node.getChildByName('wanfa'),json.cond);
        cc.vv.utils.setToggleChecked(this.node.getChildByName('fangzuobi'),json.fangzuobi);
        if(json.overflow){
            cc.vv.utils.setToggleChecked(this.node.getChildByName('overflow'),json.overflow);
        }
        if(json.zhuang != "qiang" || json.zhuang != "lunliu" || json.zhuang != "lun"){
            this.is_limit_QZ = false;
        }else{
            this.is_limit_QZ = true;
        }
        if(json.limitQZ){
            this.limitQZ.string = json.limitQZ;
            for (var index = 0; index < this.limitQZArr.length; index++) {
                if(this.limitQZ.string == this.limitQZArr[index]){
                    this.limit_index = index;
                }
            }
        }
        if(json.rule == 0){
            cc.vv.utils.setToggleChecked(this.node.getChildByName('rule'),json.rule,0);
        }else{
            cc.vv.utils.setToggleChecked(this.node.getChildByName('rule'),json.rule,1);
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
        var event = new cc.Event.EventCustom('click', true);
        event.node = this.node.getChildByName('ren').getChildByName(json.ren);
        this.onBtnRen(event);
    },
      //按钮事件
      onBtnClick_limit:function(event, data){
        if(!this.is_limit_QZ)
            return;
        var self = this;
        switch(event.target.name){
            case "add":{
                this.limit_index += 1;
                var length = this.limitQZArr.length;
                var guodi = this.limitQZArr[this.limit_index % length];
                this.limitQZ.string = guodi;
            }
            break;
            case "sub":{
                var length = this.limitQZArr.length;
                this.limit_index -= 1;
                if(this.limit_index < 0){
                    this.limit_index += length
                }
                var guodi = this.limitQZArr[this.limit_index % length];
                this.limitQZ.string = guodi;
            }
            break;
        }
    },
    not_limitQZ:function(event,data){
        switch(event.target.name){
            case "lunliu":
            case "lun":
            case "qiang":{
                this.is_limit_QZ = true;
            }
            break;
            case "fangzhu":
            case "niuniu":{
                this.limit_index = 0;
                var guodi = this.limitQZArr[this.limit_index];
                this.limitQZ.string = guodi;
                this.is_limit_QZ = false;
            }
            break;
        }
    },
    difenupd:function(event,data){
        var strnum =  parseInt(this.node.getChildByName('difen').getChildByName("bg").getChildByName("difennum").getComponent(cc.Label).string);
        if(data == "0"){
            if(strnum <= 10 && strnum > 1){
                strnum--;
            }else if(strnum == 20){
                strnum = 10;
            }else if(strnum == 50){
                strnum = 20;
            }else if(strnum <= 1){
                strnum = 10;
            }
            
        }else if(data == "1"){
            if(strnum < 10 && strnum >= 1){
                strnum++;
            }else if(strnum >= 10){
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
    onBtnRen:function(event){
        if(event.node == null) return;
        var show = true;
        switch(event.node.name){
            case "6ren":{
                show = false;
            }
            break;
        }
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
     * 开房选项
     */
    Config:function(){
        
        var ju = cc.vv.utils.toggleChecked(this.node.getChildByName('ju'));
        var zhuang = cc.vv.utils.toggleChecked(this.node.getChildByName('zhuang'));
        var ren = cc.vv.utils.toggleChecked(this.node.getChildByName("ren"));
        var yaoshaizi = cc.vv.utils.toggleChecked(this.node.getChildByName("yaoshaizi"));
        var join = cc.vv.utils.toggleChecked(this.node.getChildByName('join'));
        var wanfa = cc.vv.utils.toggleChecked(this.node.getChildByName('wanfa'));
        var rule = cc.vv.utils.toggleChecked(this.node.getChildByName('rule'));
        var fangzuobi = cc.vv.utils.toggleChecked(this.node.getChildByName('fangzuobi'));
        var tuoguan = this.node.getChildByName('tuoguan').getChildByName("num").getComponent(cc.Label).string;
        var strnum =  parseInt(this.node.getChildByName('difen').getChildByName("bg").getChildByName("difennum").getComponent(cc.Label).string);
        var overflow = cc.vv.utils.toggleChecked(this.node.getChildByName('overflow'));
        var play_type = 0;

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
        var desc = [];
        desc.push("底分" + strnum);
        //局数
        switch (ju) {
            case "10ju": {
                desc.push("10局");
            }
            break;
            case "20ju": {
                desc.push("20局");
            }
            break;
        }
        
        //人数
  
        desc.push("5人场");

        //玩法
        switch (wanfa) {
            case "28g": {
                desc.push("二八杠");
            }
            break;
        }
        if(wanfa){
            play_type = 1
        }else{
            play_type = 0;
        }

        //模式
        switch (zhuang) {
            case "qiang": {
                desc.push("抢庄");
            }
            break;
            case "lun": {
                desc.push("轮庄");
            }
            break;
            case "fangzhu": {
                desc.push("霸王庄");
            }
            break;
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
        if(rule == "0"){
            desc.push('同点数比点');
            rule = 0;
        }else{
            desc.push('同点数庄大');
            rule = 1;
        }
        if(this.limitQZ.string != "0"){
            desc.push("低于"+ this.limitQZ.string+"不能抢庄");
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
        if(overflow == "1"){
            desc.push("不可负分");
        }
        var conf = {
            name:'ttz_1402',
            title:'推筒子',
            desc:desc,            
            ju:ju,
            cond:play_type,
            dizhu:strnum,
            start_mode:start_mode,
            tuoGuan:server_value,
            ren:"5ren",
            zhuang:zhuang,
            auto:yaoshaiziValue,
            join:join,
            rule:rule,
            limitQZ:this.limitQZ.string,
            overflow:overflow,
            fangzuobi:fangzuobi,
        }; 

        return conf;
    },
});
