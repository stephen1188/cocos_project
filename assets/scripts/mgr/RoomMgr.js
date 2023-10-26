cc.Class({
    extends: cc.Component,
    properties: {
        roomType:"",        //房间类型
        roomId:0,           //房间号
        started:0,          //房间是否开始
        data:null,          //enter返回内容
        param:null,         //param返回内容
        table:null,         //房间信息
        seatid:0,           //自己的位置
        ren:5,              //默认5人
        now:0,              //当前局数
        max:20,             //总局数
        clubid:0,           //亲友圈ID
        minmoney:false,     //提示胜点不足，如果未true 代表胜点不足。则拦截准备消息
        ip_repeat:null,             //本局是否继续提示ip地址相同
    },

    init:function(){
        this.started = 0;
        this.param = null;
        this.table = null;
        this.seatid = 0;
        this.ren = 5;
        this.now = 0;
        this.max = 20;
        this.ip_repeat=false;
    },

    //转换椅子
    viewChairID : function( wChairID ){
        var wViewChairID=Math.abs(wChairID + this.ren - this.seatid);
        return wViewChairID % this.ren;
    },

    //转换真实坐位
    realChairID : function( wChairID ){
        var wRealChairID = this.seatid + wChairID;
        return wRealChairID % this.ren;
    },

    //玩家性别
    userSex:function(seatid){
        if(this.table == null && this.ren <= seatid)return; 
        if(!this.table.list){
            return;
        }
        var sex = this.table.list[seatid].sex;

        if(sex != 1 && sex !=2){
            sex = 1;
        }
        return sex;
    },

    //根据ID找座位
    getSeatIndexByID:function(userId){
        if(this.table == null)return -1;
        for(var i = 0; i < this.table.list.length; ++i){
            var s = this.table.list[i];
            if(s.userid == userId){
                return i;
            }
        }
        return -1;
    },

    is_end(){
        return this.now >= this.max && this.max != -1;
    }
});
