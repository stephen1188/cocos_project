cc.Class({
    extends: cc.Component,

    properties: {
    },

    // use this for initialization
    onLoad: function () {
        this.init();
    },

    init:function(){
        this.indexfeng = 0;
        this.index = 9;
        this.difenArr = ["0.1", "0.2", "0.3", "0.4", "0.5", "0.6", "0.7", "0.8", "0.9", "1", "2", "3", "4", "5" ,"10", "20", "50"];
        this.gudingfenArr = ["1", "2", "3", "4", "5" ,"10", "20", "50"];
        this.loadSaveConfig();
    },

    //载入保存项
    loadSaveConfig:function(){

        //推天九
        var conf = cc.sys.localStorage.getItem("last_game_zpj_2801");
        if(conf){
            var json = JSON.parse(conf);
            cc.vv.utils.setToggleChecked(this.node.getChildByName('ju'),json.ju);
            cc.vv.utils.setToggleChecked(this.node.getChildByName('zhuang'),json.zhuang);
            var ya = "guding"
            if(json.Gdfen == 0){
                ya = "xuan";
            }
            cc.vv.utils.setToggleChecked(this.node.getChildByName('ya'),ya);
            cc.vv.utils.setToggleChecked(this.node.getChildByName('zhadan'),json.typeZd);
            cc.vv.utils.setToggleChecked(this.node.getChildByName('dijiuniangniang'),json.typeDj);
            cc.vv.utils.setToggleChecked(this.node.getChildByName('guizi'),json.typeGz);
            cc.vv.utils.setToggleChecked(this.node.getChildByName('tianwangjiu'),json.typeTj);
            cc.vv.utils.setToggleChecked(this.node.getChildByName('auto'),json.auto);
            var time = "不限";
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
                this.node.getChildByName('tuoguan').getChildByName("num").getComponent(cc.Label).string = time;
            }

            var wanfatime = "不亮";
            if(json.mingpai != null){
                if(json.mingpai == "0"){
                    wanfatime = "不亮";
                }else if(json.mingpai == "1"){
                    wanfatime = "1";
                }else if(json.mingpai == "2"){
                    wanfatime = "2";
                }else if(json.mingpai == "3"){
                    wanfatime = "3";
                }
                this.node.getChildByName('wanfa').getChildByName("num").getComponent(cc.Label).string = wanfatime;
            }
            this.onBtnYa();
            if(json.Gdfen != null && json.Gdfen != 0){
                var feng = json.Gdfen;
                cc.vv.utils.setToggleChecked(this.node.getChildByName('feng'),feng);
                // this.node.getChildByName('feng').getChildByName("num").getComponent(cc.Label).string = feng;
                for (var indexfeng = 0; indexfeng < this.gudingfenArr.length; indexfeng++) {
                    if(feng == this.gudingfenArr[index]){
                        this.indexfeng = indexfeng;
                    }
                }
            }

            if(json.join != null)cc.vv.utils.setToggleChecked(this.node.getChildByName('join'),json.join);
            //模拟点击人数，变化耗卡数
            var event = new cc.Event.EventCustom('click', true);
            event.node = this.node.getChildByName('ya').getChildByName(ya);
           

            if(json.difen){
                var difen = json.difen
                this.node.getChildByName('difen').getChildByName("bg").getChildByName("difennum").getComponent(cc.Label).string == difen;
                for (var index = 0; index < this.difenArr.length; index++) {
                    if(difen == this.difenArr[index]){
                        this.index = index;
                    }
                }
            }
        }
    },

    loadSaveConfig2:function(data){
        this.init();
        this.difenArr = ["0.1", "0.2", "0.3", "0.4", "0.5", "0.6", "0.7", "0.8", "0.9", "1", "2", "3", "4", "5" ,"10", "20", "50"];
        var json = data.conf;
        cc.vv.utils.setToggleChecked(this.node.getChildByName('ju'),json.ju);
        cc.vv.utils.setToggleChecked(this.node.getChildByName('zhuang'),json.zhuang);
        var ya = "guding"
        if(json.Gdfen == 0){
            ya = "xuan";
        }
        cc.vv.utils.setToggleChecked(this.node.getChildByName('ya'),ya);
        cc.vv.utils.setToggleChecked(this.node.getChildByName('ya'),json.ya);
        cc.vv.utils.setToggleChecked(this.node.getChildByName('zhadan'),json.typeZd);
        cc.vv.utils.setToggleChecked(this.node.getChildByName('dijiuniangniang'),json.typeDj);
        cc.vv.utils.setToggleChecked(this.node.getChildByName('guizi'),json.typeGz);
        cc.vv.utils.setToggleChecked(this.node.getChildByName('tianwangjiu'),json.typeTj);
        cc.vv.utils.setToggleChecked(this.node.getChildByName('auto'),json.auto);
        var time = "不限";
        
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
            this.node.getChildByName('tuoguan').getChildByName("num").getComponent(cc.Label).string = time;
        }

        var wanfatime = "不亮";
        if(json.wanfa != null){
            if(json.wanfa == "0"){
                wanfatime = "不亮";
            }else if(json.wanfa == "1"){
                wanfatime = "1";
            }else if(json.wanfa == "2"){
                wanfatime = "2";
            }else if(json.wanfa == "3"){
                wanfatime = "3";
            }
            this.node.getChildByName('wanfa').getChildByName("num").getComponent(cc.Label).string = wanfatime;
        }
        this.onBtnYa();
        if(json.Gdfen != null && json.Gdfen != 0){
            var feng = json.Gdfen;
            cc.vv.utils.setToggleChecked(this.node.getChildByName('feng'),feng);
            // this.node.getChildByName('feng').getChildByName("num").getComponent(cc.Label).string = feng;
            for (var indexfeng = 0; indexfeng < this.gudingfenArr.length; indexfeng++) {
                if(feng == this.gudingfenArr[index]){
                    this.indexfeng = indexfeng;
                }
            }
        }
    
        if(json.join != null)cc.vv.utils.setToggleChecked(this.node.getChildByName('join'),json.join);
        //模拟点击人数，变化耗卡数
        var event = new cc.Event.EventCustom('click', true);
        event.node = this.node.getChildByName('ya').getChildByName(ya);
        

        if(json.difen){
            var difen = json.difen
            this.node.getChildByName('difen').getChildByName("bg").getChildByName("difennum").getComponent(cc.Label).string = difen;
            for (var index = 0; index < this.difenArr.length; index++) {
                if(difen == this.difenArr[index]){
                    this.index = index;
                }
            }
        }
    },

    
    /**
     * NN 选分变化时
     */
    onBtnYa:function(){
        var ya = cc.vv.utils.toggleChecked(this.node.getChildByName('ya'));
        var show = false;
        switch(ya){
            case "guding":{
                show = true;
            }
            break;
        }
        this.node.getChildByName('feng').active = show;
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
            }else if(num_str == "不限"){
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
            }else if(num_str == "不限"){
                num_str = "120";
            }
        }
        num.getComponent(cc.Label).string = num_str;
    },

    //托管时间 加减框
    btn_wanfa_click_event:function(data,event){
        var num = this.node.getChildByName('wanfa').getChildByName("num");
        var num_str = num.getComponent(cc.Label).string;
        if(event == "1"){
            if(num_str == "1"){
                num_str = "2";
            }else if(num_str == "2"){
                num_str = "3";
            }else if(num_str == "3"){
                num_str = "不亮";
            }else if(num_str == "不亮"){
                num_str = "1";
            }
        }else if(event == "0"){
            if(num_str == "1"){
                num_str = "不亮";
            }else if(num_str == "2"){
                num_str = "1";
            }else if(num_str == "3"){
                num_str = "2";
            }else if(num_str == "不亮"){
                num_str = "3";
            }
        }
        num.getComponent(cc.Label).string = num_str;
    },

    //固定分 加减框
    btn_gudingfen_click_event:function(event,data){
        switch(event.target.name){
            case "add":{
                this.indexfeng += 1;
                var length = this.gudingfenArr.length;
                var feng = this.gudingfenArr[this.indexfeng % length];
                this.node.getChildByName('feng').getChildByName("num").getComponent(cc.Label).string = feng;
            }
            break;
            case "sub":{
                var length = this.gudingfenArr.length;
                this.indexfeng -= 1;
                if(this.indexfeng < 0){
                    this.indexfeng += length
                }
                var feng = this.gudingfenArr[this.indexfeng % length];
                this.node.getChildByName('feng').getChildByName("num").getComponent(cc.Label).string = feng;
            }
            break;
        }
    },
    /**
     * 推天九选项
     */
    Config:function(daikai){
        
        var ju = cc.vv.utils.toggleChecked(this.node.getChildByName('ju'));
        var wanfa = this.node.getChildByName('wanfa').getChildByName("num").getComponent(cc.Label).string;
        var zhuang = cc.vv.utils.toggleChecked(this.node.getChildByName('zhuang'));
        var ya = cc.vv.utils.toggleChecked(this.node.getChildByName('ya'));
        // var feng = this.node.getChildByName('feng').getChildByName("num").getComponent(cc.Label).string;
        var feng =cc.vv.utils.toggleChecked(this.node.getChildByName('feng'));
        var zhadan = cc.vv.utils.toggleChecked(this.node.getChildByName('zhadan'));
        var dijiuniangniang = cc.vv.utils.toggleChecked(this.node.getChildByName('dijiuniangniang'));
        var guizi = cc.vv.utils.toggleChecked(this.node.getChildByName('guizi'));
        var tianwangjiu = cc.vv.utils.toggleChecked(this.node.getChildByName('tianwangjiu'));
        var join = cc.vv.utils.toggleChecked(this.node.getChildByName('join'));
        var tuoguan = this.node.getChildByName('tuoguan').getChildByName("num").getComponent(cc.Label).string;
        var auto = cc.vv.utils.toggleChecked(this.node.getChildByName('auto'));
        var desc = [];

        var difen =  this.node.getChildByName('difen').getChildByName("bg").getChildByName("difennum").getComponent(cc.Label).string; 

        //局数
        switch (ju) {
            case "12ju": {
                desc.push("12局");
            }
            break;
            default:{
                desc.push("24局");
            }
            break;
        }
        
        desc.push("底分" + difen);

        if(tuoguan && tuoguan != "不限"){
            desc.push(tuoguan +"秒下注");
        }

        //自动
        switch (auto) {
            case "1": {
                desc.push("自动摇色子");
            }
            break;
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

        if(ya == "xuan"){
            feng = "0";
        }
        
        if(feng != 0){
            //抢分或固定分
            desc.push("固定" + feng + "分");
        }

        //炸弹
        switch (zhadan) {
            case "1": {
               desc.push("炸弹");
            }
        }

        //地九娘娘
        switch (dijiuniangniang) {
            case "1": {
               desc.push("地九娘娘");
            }
        }

        //鬼子
        switch (guizi) {
            case "1": {
               desc.push("鬼子");
            }
        }

        //天王九
        switch (tianwangjiu) {
            case "1": {
               desc.push("天王九");
            }
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

        if(wanfa && wanfa != "不亮"){
            desc.push("庄家亮"+ wanfa +"张");
           
        }
        if(wanfa && wanfa == "不亮"){
            wanfa = "0";
        }
      
        var conf = {
            name:'zpj_2801',
            title:'推小九',
            desc:desc,
            ren:"4ren",
            ju:ju,
            mingpai:wanfa,
            auto:auto,
            zhuang:zhuang,
            Gdfen:feng,
            typeZd:zhadan,
            typeDj:dijiuniangniang,
            typeGz:guizi,
            typeTj:tianwangjiu,
            tuoGuan:server_value,
            difen:difen,
            join:join
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
                this.node.getChildByName('difen').getChildByName("bg").getChildByName("difennum").getComponent(cc.Label).string = difen;
            }
            break;
            case "sub":{
                var length = this.difenArr.length;
                this.index -= 1;
                if(this.index < 0){
                    this.index += length
                }
                var difen = this.difenArr[this.index % length];
                this.node.getChildByName('difen').getChildByName("bg").getChildByName("difennum").getComponent(cc.Label).string = difen;
            }
            break;
        }
    },
});
