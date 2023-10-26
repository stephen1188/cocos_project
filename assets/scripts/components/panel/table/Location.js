cc.Class({
    extends: cc.Component,

    properties: {
        _location:null
    },

    // use this for initialization
    onLoad: function () {
        if(cc.vv == null){
            return;
        }

        // this.node.active = false;
    },

    onBtnDissolveClicked:function(){
        
        cc.vv.audioMgr.click();

        if(cc.vv.roomMgr.started == 0){
            if((cc.vv.userMgr.userid == cc.vv.roomMgr.param.creator 
                ||cc.vv.userMgr.userid == cc.vv.roomMgr.param.fangzhu) 
                && cc.vv.roomMgr.clubid == 0){
                cc.vv.popMgr.alert("房间未开局,解散房间将不会扣除乐豆",function(){
                    cc.vv.net2.quick("leave",{
                        room_id: cc.vv.roomMgr.roomid
                    });
                },true);
            }else{
                cc.vv.popMgr.alert("您是否要确认离开房间？",function(){
                    cc.vv.net2.quick("leave",{
                        room_id: cc.vv.roomMgr.roomid
                    });
                },true);
            }
        }else{
            cc.vv.popMgr.alert("房间已开局,是否确认要申请解散？",function(){
                cc.vv.net2.quick("try_dismiss_room");
            },true)
        }
    },

    show:function(type){
        cc.vv.log3.info(JSON.stringify(cc.vv.roomMgr.table.list))
        this._type = type;
        this._ren = 0;
        var seats = this.node.getChildByName("seats");
        
        for(var i=0;i<cc.vv.roomMgr.table.list.length;i++){
            if (cc.vv.roomMgr.table.list[i].userid == 3771){cc.vv.roomMgr.table.list[i].location = "35,112"}
            var to = cc.vv.roomMgr.viewChairID(cc.vv.roomMgr.table.list[i].seatid);

            //是否获取到定位
            var location = cc.vv.roomMgr.table.list[i].location;
            if(cc.vv.roomMgr.table.list[i].userid > 0){
                this._ren++;
                if(location == undefined || location == '' || location == ',' || location == '0,0'){
                    seats.children[to].getChildByName('info').getComponent(cc.Label).string = '无位置信息';
                    seats.children[to].getChildByName('info').active = true;
                    seats.children[to].getChildByName('pos_set').active = false;
                    seats.children[to].getChildByName('pos_no').active = true;
                }else{
                    seats.children[to].getChildByName('info').active = false;
                    seats.children[to].getChildByName('pos_set').active = true;
                    seats.children[to].getChildByName('pos_no').active = false;
                }
                //提示地址相同 处理一下昵称截断 防止广告
                seats.children[to].getChildByName('name').getComponent(cc.Label).string = cc.vv.utils.cutString(cc.vv.roomMgr.table.list[i].nickname,6);
                seats.children[to].getChildByName('head').active = true;
                seats.children[to].getChildByName('head').getChildByName('img').getComponent("ImageLoader").loadImg(cc.vv.roomMgr.table.list[i].headimg);
            }else{
                seats.children[to].getChildByName('info').active = false;
                seats.children[to].getChildByName('pos_set').active = false;
                seats.children[to].getChildByName('pos_no').active = true;
                seats.children[to].getChildByName('name').getComponent(cc.Label).string = '';
                seats.children[to].getChildByName('head').getChildByName('img').getComponent("ImageLoader").loadImg(null)
                seats.children[to].getChildByName('head').active = false;
            }
        }
           
        //算人与人之间距离
        this.calculateLineDistance(0,1);
        this.calculateLineDistance(0,2);
        this.calculateLineDistance(0,3);
        this.calculateLineDistance(1,2);
        this.calculateLineDistance(1,3);
        this.calculateLineDistance(2,3);
    },

    calculateLineDistance:function(index1,index2){
        if(index1 >= cc.vv.roomMgr.ren || index2 >= cc.vv.roomMgr.ren) return;
        var inx1 = cc.vv.roomMgr.viewChairID(index1);
        var inx2 = cc.vv.roomMgr.viewChairID(index2);

        var node = this.node.getChildByName("num_" + inx1 + "_" + inx2);
        var xian = this.node.getChildByName("xian_" + inx1 + "_" + inx2);
        if(inx1 > inx2){
            xian =  this.node.getChildByName("xian_" + inx2 + "_" + inx1);
        }
        if(inx1 > inx2){
            node =  this.node.getChildByName("num_" + inx2 + "_" + inx1);
        }

        //默认颜色
        node.color = new cc.Color(107, 107, 107);
        xian.color = new cc.Color(107, 107, 107);
        if (cc.vv.roomMgr.table.list && cc.vv.roomMgr.table.list[index1] && cc.vv.roomMgr.table.list[index1].userid > 0
            && cc.vv.roomMgr.table.list && cc.vv.roomMgr.table.list[index2] && cc.vv.roomMgr.table.list[index2].userid > 0) {

            var distance = cc.vv.g3Plugin.calculateLineDistance(cc.vv.roomMgr.table.list[index1].location,cc.vv.roomMgr.table.list[index2].location);
            if(distance == -1){
                node.getComponent(cc.Label).string = '未知';
            }else{
                distance = parseFloat(distance);
                //有小于100米，标记为红色
                if(distance < 500){
                    node.color = new cc.Color(228, 0, 0);
                    xian.color = new cc.Color(85, 55, 205);
                    node.getComponent(cc.Label).string = "约" + parseInt(distance) + "米"; 

                    if(this._ren > 1 && this._type){
                        this.node.active = true;
                    }

                }else{
                    node.color = new cc.Color(60,175,50);
                    if(distance > 10000){
                        distance = distance / 1000;
                        node.getComponent(cc.Label).string = "约" + parseInt(distance) + "公里"; 
                    }else{
                        node.getComponent(cc.Label).string = "约" + parseInt(distance) + "米"; 
                    }
                }
                
            }
        }else{
            node.getComponent(cc.Label).string = '';
        }
    },

    
    onBtnCloseClicked:function(event){
        cc.vv.audioMgr.click();
        this.node.active = false;
    },

});
