var NNConst = cc.Class({
    extends: cc.Component,
    statics: {
        player4:[
            {x:-600,y:-30,scale:1.0,pos:{score:{x:-445,y:-45},tip:{x:0,y:50},fold:{x:0,y:-44},time:{x:0,y:0},zhuafen:{x:-500,y:-42},ready:{x:95,y:0},bet:{x:0,y:-20},chat:{x:200,y:47},card:{x:-45,y:-495,scale:2.5},voice:{x:-112,y:22,scalex:1,scaley:1}}},
            {x:600,y:144,scale:0.8,pos:{score:{x:445,y:125},tip:{x:340,y:61},fold:{x:552,y:99},time:{x:478,y:107},zhuafen:{x:490,y:191},ready:{x:-95,y:0},bet:{x:0,y:-20},chat:{x:-200,y:47},card:{x:400,y:-314,scale:1},voice:{x:112,y:22,scalex:-1,scaley:1}}},
            {x:-168,y:267,scale:0.8,pos:{score:{x:-38,y:325},tip:{x:0,y:200},fold:{x:-135,y:233},time:{x:-69,y:225},zhuafen:{x:-66,y:305},ready:{x:95,y:0},bet:{x:0,y:-20},chat:{x:200,y:47},card:{x:400,y:-84,scale:1},voice:{x:-112,y:22,scalex:1,scaley:1}}},
            {x:-600,y:144,scale:0.8,pos:{score:{x:-445,y:125},tip:{x:-340,y:67},fold:{x:-552,y:99},time:{x:-478,y:107},zhuafen:{x:-500,y:192},ready:{x:95,y:0},bet:{x:0,y:-20},chat:{x:200,y:47},card:{x:-430,y:-84,scale:1},voice:{x:112,y:22,scalex:-1,scaley:1}}}, 
        ],
        player5:[//逆时针
            {x:-600,y:-250,distance:110,toright:220,scale:1.1,pos:{ready:{x:95,y:0},bet:{x:0,y:-20},chat:{x:200,y:47},card:{x:-270,y:-275,scale:1.0},voice:{x:-112,y:22,scalex:1,scaley:1}}},//1
            {x:600,y:50,distance:50,toright:60,scale:0.8,pos:{ready:{x:-95,y:0},bet:{x:0,y:-20},chat:{x:-200,y:47},card:{x:400,y:-70,scale:0.8},voice:{x:-112,y:22,scalex:1,scaley:1}}},//2
            {x:327,y:251,distance:50,toright:80,scale:0.8,pos:{ready:{x:95,y:0},bet:{x:0,y:-20},chat:{x:200,y:47},card:{x:154,y:253,scale:0.8},voice:{x:112,y:22,scalex:-1,scaley:1}}},//3
            {x:-327,y:251,distance:50,toright:80,scale:0.8,pos:{ready:{x:-95,y:0},bet:{x:0,y:-20},chat:{x:200,y:47},card:{x:-227,y:221,scale:0.8},voice:{x:-112,y:22,scalex:1,scaley:1}}},//4
            {x:-600,y:50,distance:50,toright:60,scale:0.8,pos:{ready:{x:95,y:0},bet:{x:0,y:-20},chat:{x:200,y:47},card:{x:-502,y:-70,scale:0.8},voice:{x:112,y:22,scalex:-1,scaley:1}}},//5
        ],
        alarmpos:[{x:0,y:0},{x:507,y:46},{x:225,y:132},{x:-225,y:132},{x:-507,y:46}],
        chat_path:"nn",
        quick_chat:[
            {id:0,info:"加个好友，以后一起玩"},
            {id:1,info:"和你合作真是太愉快啦~"},
            {id:2,info:"快点吧，我等的花儿都谢了"},
            {id:3,info:"你的牌打的太好啦"},
            {id:4,info:"拜托，有你这样玩牌的吗？"},
            {id:5,info:"不好意思出错了，真对不住啊"},
            {id:6,info:"来来来，继续大战三百回合"},
            {id:7,info:"苍天啊，赐给我一手好牌吧"}, 
        ],
        selfPoke5:{x:-200,y:-250,distance:50,scale:1.0},
        default_bg:"public/table/game_bg_dq"
    },
});
