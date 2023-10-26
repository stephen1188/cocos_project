cc.Class({
    extends: cc.Component,

    properties: {
        dou1:cc.Label,
        dou2:cc.Label,
        difen:cc.Label,
    },

    // use this for initialization
    onLoad: function () {
        this.index = 0;
        this.difenArr = ["1", "2", "3", "4", "5"];
        this.loadSaveConfig();
    },
    wenhao_tips:function(event, data){
        //报听
        switch (event.target.name) {
         case "threeredtip": {
             cc.vv.popMgr.alert("捉红三：方三必亮，红三可选亮或不亮");
         }
         break;
        }
    },
    formateData(json){
        cc.vv.utils.setToggleChecked(this.node.getChildByName('ju'),json.ju);
          
        if(json.sanHong){
            cc.vv.utils.setToggleChecked(this.node.getChildByName('sanhong'),json.sanHong);
        }
        if(json.fangzuobi){
            cc.vv.utils.setToggleChecked(this.node.getChildByName('fangzuobi'),json.fangzuobi);
        }

        if(json.difen != null){
            this.difen.string = json.difen;
            for (var index = 0; index < this.difenArr.length; index++) {
                if(json.difen == this.difenArr[index]){
                    this.index = index;
                }
            }
        }else{
            this.difen.string = "1";
        }
    },
    //载入保存项
    loadSaveConfig:function(){
        var conf = cc.sys.localStorage.getItem("last_game_zgz_2300");
        if(conf){
            var json = JSON.parse(conf);
            this.formateData(json)
        }
    },
   
    loadSaveConfig2:function(data){
        var json = data.conf;
        this.formateData(json);
    },
    


    /**
     * 赢三张选项
     */
    Config:function(){
        var ju = cc.vv.utils.toggleChecked(this.node.getChildByName('ju'));//局数
        var sanHong = cc.vv.utils.toggleChecked(this.node.getChildByName('sanhong'));
        var fangzuobi = cc.vv.utils.toggleChecked(this.node.getChildByName('fangzuobi'));
        var desc = [];
        
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
        switch(sanHong){
            case "1":{
                desc.push('捉三红');
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
        desc.push("底分" + this.difen.string);
        var conf = {
            name:'zgz_3300',
            title:'扎股子',
            desc:desc,
            ju:ju,
            ren:'5ren',
            difen:this.difen.string,
            // ren:ren,
            sanHong:sanHong?sanHong:0,
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
