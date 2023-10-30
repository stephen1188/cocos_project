cc.Class({
    extends: cc.Component,
    properties: {
        account:null,
	    userId:null,
		userName:null,
		lv:0,
        exp:0,
        ticket:0,
		coins:0,
		gems:0,
		sign:0,
        ip:"",
        sex:0,
        headimg:"",
        adcode:0,
        status:1,
        sign_code_time:0,           //验证码时间
        ios_review:0,
        is_dealer:0,
        token:"",
        clublist:null,
        clubInfo:null,
        clubUsers:null,
        clubRoom:null,

        clubRoomEnter:0,
        playFisrtWelcome:1,
        rule_id:null,
    },
    
    //游客登录
    guest:function(){
        var account = cc.args["account"];
        cc.log("acc = ", account);
        if(account == null){
            account = cc.sys.localStorage.getItem("account");
        }
        
        if(account == null){
            account = Date.now() + "";
        }
        
        cc.sys.localStorage.setItem("account",account);
        
        var guest = {
            method:"login",
            data:{
                type:0,
                msg:{
                    openid:account
                },
                version:cc.VERSION,
                platform:0,
                adcode:0,
                ip:cc.vv.global.ip,
                address:"未知",
            }
        };
        cc.log('account = ', guest.data.msg);
        cc.vv.net1.send(guest);
    },

    //授权登录
    login:function(data){

        var platform = 1;
        if(cc.sys.os == cc.sys.OS_IOS){
            platform = 2;
        }
        
        var user = {
            method:"login",
            data:{
                type:1,
                msg:data,
                ip:cc.vv.global.ip,
                version:cc.VERSION,
                platform:platform,
                address:cc.vv.global.address,
                adcode:cc.vv.global.adcode,
            }
        };
        cc.vv.net1.send(user);
    },

    //授权登录
    join:function(roomId,clubId,type){
        var enter_room = {
            method:"join",
            data:{
                version:cc.SERVER,
                room_id:roomId,
                club_id:clubId,
                type:type,
                location:cc.vv.global.latitude + "," + cc.vv.global.longitude
            }
        };
        
        cc.vv.popMgr.loading_tip("join " + roomId,function(){
            cc.vv.net1.send(enter_room);
        });
    },
});
