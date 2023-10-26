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

    //载入保存项
    loadSaveConfig:function(){

        var conf = cc.sys.localStorage.getItem("last_game_kd_1702");
        var play_type = this.node.getChildByName('play_type');
        if(conf){
            var json = JSON.parse(conf);
            cc.vv.utils.setToggleChecked(this.node.getChildByName('ju'),json.ju);
            cc.vv.utils.setToggleChecked4(play_type,'Wheel_Zhuang',json.Wheel_Zhuang);
            cc.vv.utils.setToggleChecked4(play_type,'Must_Hu',json.Must_Hu);
            cc.vv.utils.setToggleChecked4(play_type,'Bright_baris_zimo',json.Bright_baris_zimo);
            cc.vv.utils.setToggleChecked4(play_type,'clean_OneColor_or_A_dragon',json.clean_OneColor_or_A_dragon);
            cc.vv.utils.setToggleChecked4(play_type,'one_two_can_zimo',json.one_two_can_zimo);
            cc.vv.utils.setToggleChecked4(play_type,'too_hu_must_zimo',json.too_hu_must_zimo);
            cc.vv.utils.setToggleChecked4(play_type,'Seven_Pairs',json.Seven_Pairs);
            cc.vv.utils.setToggleChecked4(play_type,'Zhuang_Score',json.Zhuang_Score);

            cc.vv.utils.setToggleChecked(this.node.getChildByName('difen'),json.difen);
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
            if(json.play_type == "0"){
                cc.vv.utils.setToggleChecked(play_type,'Classic_play');
            }else if(json.play_type == "1"){
                cc.vv.utils.setToggleChecked(play_type,'Grab_Mouse');
            }else if(json.play_type == "2"){
                cc.vv.utils.setToggleChecked(play_type,'Double_Mouse');
            }
            var info ={

            }
            this.play_type_Choice(info, json.play_type);
        }
    },

    loadSaveConfig2:function(data){
        var play_type = this.node.getChildByName('play_type');
        
        var json = data.conf;
        cc.vv.utils.setToggleChecked(this.node.getChildByName('ju'),json.ju);
        cc.vv.utils.setToggleChecked4(play_type,'Wheel_Zhuang',json.Wheel_Zhuang);
        cc.vv.utils.setToggleChecked4(play_type,'Must_Hu',json.Must_Hu);
        cc.vv.utils.setToggleChecked4(play_type,'Bright_baris_zimo',json.Bright_baris_zimo);
        cc.vv.utils.setToggleChecked4(play_type,'clean_OneColor_or_A_dragon',json.clean_OneColor_or_A_dragon);
        cc.vv.utils.setToggleChecked4(play_type,'one_two_can_zimo',json.one_two_can_zimo);
        cc.vv.utils.setToggleChecked4(play_type,'too_hu_must_zimo',json.too_hu_must_zimo);
        cc.vv.utils.setToggleChecked4(play_type,'Seven_Pairs',json.Seven_Pairs);
        cc.vv.utils.setToggleChecked4(play_type,'Zhuang_Score',json.Zhuang_Score);

        cc.vv.utils.setToggleChecked(this.node.getChildByName('difen'),json.difen);
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
       
        if(json.play_type == "0"){
            cc.vv.utils.setToggleChecked(play_type,'Classic_play');
        }else if(json.play_type == "1"){
            cc.vv.utils.setToggleChecked(play_type,'Grab_Mouse');
        }else if(json.play_type == "2"){
            cc.vv.utils.setToggleChecked(play_type,'Double_Mouse');
        }
        var info ={

        }
        this.play_type_Choice(info, json.play_type);
    },

    play_type_Choice:function(data,event){
        var conf = cc.sys.localStorage.getItem("last_game_kd_1702");
        var play_type = this.node.getChildByName('play_type');
        this.choice_show();
        if(event == "0"){
            var too_hu_must_zimo =  play_type.getChildByName('too_hu_must_zimo');//过胡只能自摸
            var Seven_Pairs =  play_type.getChildByName('Seven_Pairs');//七对
            var Zhuang_Score =  play_type.getChildByName('Zhuang_Score');//庄分
            Zhuang_Score.active = false;
            Seven_Pairs.active = false;
            too_hu_must_zimo.active = false;

            var Zhuang_Score =  play_type.getChildByName('Zhuang_Score');//庄分
            Zhuang_Score.getComponent(cc.Toggle).isChecked = false;
            Zhuang_Score.active = false;

            if(conf){
                var json = JSON.parse(conf);
                cc.vv.utils.setToggleChecked4(play_type,'Must_Hu',json.Must_Hu);
                cc.vv.utils.setToggleChecked4(play_type,'clean_OneColor_or_A_dragon',json.clean_OneColor_or_A_dragon);
            }
           
        }else if(event == "1"){
            var Must_Hu =  play_type.getChildByName('Must_Hu');//有胡必胡
            var clean_OneColor_or_A_dragon =  play_type.getChildByName('clean_OneColor_or_A_dragon');//清一色一条龙加番
            Must_Hu.active = false;
            clean_OneColor_or_A_dragon.active = false;
            var Zhuang_Score =  play_type.getChildByName('Zhuang_Score');//庄分
            Zhuang_Score.getComponent(cc.Toggle).interactable = true;
            Zhuang_Score.getComponent(cc.Toggle).isChecked = false;
            Zhuang_Score.active = true;

            if(conf){
                var json = JSON.parse(conf);
                cc.vv.utils.setToggleChecked4(play_type,'too_hu_must_zimo',json.too_hu_must_zimo);
                cc.vv.utils.setToggleChecked4(play_type,'Seven_Pairs',json.Seven_Pairs);
            }
        }else if(event == "2"){
            var Must_Hu =  play_type.getChildByName('Must_Hu');//有胡必胡
            var clean_OneColor_or_A_dragon =  play_type.getChildByName('clean_OneColor_or_A_dragon');//清一色一条龙加番
            var Zhuang_Score =  play_type.getChildByName('Zhuang_Score');//庄分
            Must_Hu.active = false;
            clean_OneColor_or_A_dragon.active = false;
            Zhuang_Score.getComponent(cc.Toggle).interactable = true;
            Zhuang_Score.getComponent(cc.Toggle).isChecked = false;
            Zhuang_Score.active = true;
            if(conf){
                var json = JSON.parse(conf);
                cc.vv.utils.setToggleChecked4(play_type,'too_hu_must_zimo',json.too_hu_must_zimo);
                cc.vv.utils.setToggleChecked4(play_type,'Seven_Pairs',json.Seven_Pairs);
            }
        }else{
            var too_hu_must_zimo =  play_type.getChildByName('too_hu_must_zimo');//过胡只能自摸
            var Seven_Pairs =  play_type.getChildByName('Seven_Pairs');//七对
            var Zhuang_Score =  play_type.getChildByName('Zhuang_Score');//庄分
            Zhuang_Score.active = false;
            Seven_Pairs.active = false;
            too_hu_must_zimo.active = false;

            var Zhuang_Score =  play_type.getChildByName('Zhuang_Score');//庄分
            Zhuang_Score.getComponent(cc.Toggle).isChecked = false;
            Zhuang_Score.active = false;


            if(conf){
                var json = JSON.parse(conf);
                cc.vv.utils.setToggleChecked4(play_type,'Must_Hu',json.Must_Hu);
                cc.vv.utils.setToggleChecked4(play_type,'clean_OneColor_or_A_dragon',json.clean_OneColor_or_A_dragon);
            }
        }
    },
    /**
     * 开房选项
     */
    choice_show:function(){
        var play_type = this.node.getChildByName('play_type');
        var Wheel_Zhuang =  play_type.getChildByName('Wheel_Zhuang');//轮庄
        var Must_Hu =  play_type.getChildByName('Must_Hu');//有胡必胡
        var Bright_baris_zimo =  play_type.getChildByName('Bright_baris_zimo');//明杠杠开算自摸
        var clean_OneColor_or_A_dragon =  play_type.getChildByName('clean_OneColor_or_A_dragon');//清一色一条龙加番
        var one_two_can_zimo = play_type.getChildByName('one_two_can_zimo');//1.2可以自摸
        var too_hu_must_zimo =  play_type.getChildByName('too_hu_must_zimo');//过胡只能自摸
        var Seven_Pairs =  play_type.getChildByName('Seven_Pairs');//七对
        var Zhuang_Score =  play_type.getChildByName('Zhuang_Score');//庄分
        Wheel_Zhuang.active = true;
        Must_Hu.active = true;
        clean_OneColor_or_A_dragon.active = true;
        one_two_can_zimo.active = true;
        too_hu_must_zimo.active = true;
        Seven_Pairs.active = true;
        Zhuang_Score.active = true;
    },
    Config:function(){
        var play_type = cc.vv.utils.toggleChecked(this.node.getChildByName('play_type'));
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
        
        var play_type = this.node.getChildByName('play_type');

        var Classic_play =  play_type.getChildByName('Classic_play').getComponent(cc.Toggle).isChecked;//轮庄
        var Grab_Mouse =  play_type.getChildByName('Grab_Mouse').getComponent(cc.Toggle).isChecked;//有胡必胡
        var Double_Mouse =  play_type.getChildByName('Double_Mouse').getComponent(cc.Toggle).isChecked;//明杠杠开算自摸

        var Wheel_Zhuang =  play_type.getChildByName('Wheel_Zhuang').getComponent(cc.Toggle).isChecked;//轮庄
        var Must_Hu =  play_type.getChildByName('Must_Hu').getComponent(cc.Toggle).isChecked;//有胡必胡
        var Bright_baris_zimo =  play_type.getChildByName('Bright_baris_zimo').getComponent(cc.Toggle).isChecked;//明杠杠开算自摸
        var clean_OneColor_or_A_dragon =  play_type.getChildByName('clean_OneColor_or_A_dragon').getComponent(cc.Toggle).isChecked;//清一色一条龙加番
        var one_two_can_zimo = play_type.getChildByName('one_two_can_zimo').getComponent(cc.Toggle).isChecked;//1.2可以自摸
        var too_hu_must_zimo =  play_type.getChildByName('too_hu_must_zimo').getComponent(cc.Toggle).isChecked;//过胡只能自摸
        var Seven_Pairs =  play_type.getChildByName('Seven_Pairs').getComponent(cc.Toggle).isChecked;//七对
        var Zhuang_Score =  play_type.getChildByName('Zhuang_Score').getComponent(cc.Toggle).isChecked;//庄分

        var play_type;
        if(Classic_play == true){
            play_type = 0;
            too_hu_must_zimo = false;
            Seven_Pairs = false;
            Zhuang_Score = false;
        }else if(Grab_Mouse == true){
            play_type = 1;
            clean_OneColor_or_A_dragon = false;
            Must_Hu = false;
        }else if(Double_Mouse == true){
            play_type = 2;
            clean_OneColor_or_A_dragon = false;
            Must_Hu = false;
        }

        desc.push("底分" + this.difen.string);
        
        if(Classic_play)
            desc.push("经典玩法");
        if(Grab_Mouse)
            desc.push("捉耗子");
        if(Double_Mouse)
            desc.push("双耗子");
        if(Wheel_Zhuang)
            desc.push("轮庄");
        if(Must_Hu)
            desc.push("有胡必胡");
        if(Bright_baris_zimo)
            desc.push("明杠杠开算自摸");
        if(clean_OneColor_or_A_dragon)
            desc.push("清一色、一条龙加番");
        if(one_two_can_zimo)
            desc.push("1、2点可自摸");
        if(too_hu_must_zimo)
            desc.push("过胡只能自摸");
        if(Seven_Pairs)
            desc.push("七对");
        if(Zhuang_Score)
            desc.push("庄分");
   

  
        //防作弊
        switch (fangzuobi) {
            case "1": {
                desc.push("防作弊");
            }
            break;
        }

        var conf = {
            name:'kd_1702',
            title:'吕梁麻将',
            play_type:play_type,
            Wheel_Zhuang:Wheel_Zhuang,
            Must_Hu:Must_Hu,
            Bright_baris_zimo:false,
            clean_OneColor_or_A_dragon:clean_OneColor_or_A_dragon,
            one_two_can_zimo:one_two_can_zimo,
            too_hu_must_zimo:too_hu_must_zimo,
            Seven_Pairs:Seven_Pairs,
            Zhuang_Score:Zhuang_Score,
            desc:desc,
            ju:ju,
            ren:'4ren',
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
