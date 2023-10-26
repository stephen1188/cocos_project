var DQConst = cc.Class({
    extends: cc.Component,
    statics: {
        player4:[
            {x:-600,y:-30,scale:1.0,pos:{score:{x:-445,y:-45},tip:{x:0,y:50},fold:{x:0,y:-44},time:{x:0,y:0},zhuafen:{x:-500,y:-42},ready:{x:95,y:0},bet:{x:0,y:-20},chat:{x:200,y:47},card:{x:-45,y:-495,scale:2.5},voice:{x:-112,y:22,scalex:1,scaley:1}}},
            {x:600,y:144,scale:0.8,pos:{score:{x:445,y:125},tip:{x:340,y:61},fold:{x:552,y:99},time:{x:478,y:107},zhuafen:{x:490,y:191},ready:{x:-95,y:0},bet:{x:0,y:-20},chat:{x:-200,y:47},card:{x:400,y:-314,scale:1},voice:{x:112,y:22,scalex:-1,scaley:1}}},
            {x:-168,y:267,scale:0.8,pos:{score:{x:-38,y:325},tip:{x:0,y:200},fold:{x:-135,y:233},time:{x:-69,y:225},zhuafen:{x:-66,y:305},ready:{x:95,y:0},bet:{x:0,y:-20},chat:{x:200,y:47},card:{x:400,y:-84,scale:1},voice:{x:-112,y:22,scalex:1,scaley:1}}},
            {x:-600,y:144,scale:0.8,pos:{score:{x:-445,y:125},tip:{x:-340,y:67},fold:{x:-552,y:99},time:{x:-478,y:107},zhuafen:{x:-500,y:192},ready:{x:95,y:0},bet:{x:0,y:-20},chat:{x:200,y:47},card:{x:-430,y:-84,scale:1},voice:{x:112,y:22,scalex:-1,scaley:1}}}, 
        ],
        player5:[
            {x:-600,y:-30,scale:1.0,pos:{score:{x:-445,y:-45},tip:{x:0,y:50},fold:{x:0,y:-44},time:{x:0,y:0},zhuafen:{x:-500,y:-42},ready:{x:95,y:0},bet:{x:0,y:-20},chat:{x:200,y:47},card:{x:-200,y:-248,scale:1.2},voice:{x:-112,y:22,scalex:1,scaley:1}}},
            {x:600,y:144,scale:0.8,pos:{score:{x:445,y:125},tip:{x:340,y:67},fold:{x:552,y:99},time:{x:478,y:107},zhuafen:{x:500,y:191},ready:{x:-95,y:0},bet:{x:0,y:-20},chat:{x:-200,y:47},card:{x:-404,y:-72,scale:0.8},voice:{x:112,y:22,scalex:-1,scaley:1}}},
            {x:124,y:267,scale:0.8,pos:{score:{x:260,y:300},tip:{x:280,y:200},fold:{x:148,y:233},time:{x:225,y:225},zhuafen:{x:234,y:305},ready:{x:95,y:0},bet:{x:0,y:-20},chat:{x:200,y:47},card:{x:-403,y:201,scale:0.8},voice:{x:112,y:22,scalex:-1,scaley:1}}},
            {x:-365,y:267,scale:0.8,pos:{score:{x:-210,y:300},tip:{x:-210,y:200},fold:{x:-340,y:233},time:{x:-263,y:225},zhuafen:{x:-256,y:305},ready:{x:95,y:0},bet:{x:0,y:-20},chat:{x:200,y:47},card:{x:202,y:201,scale:0.8},voice:{x:-112,y:22,scalex:1,scaley:1}}},
            {x:-600,y:144,scale:0.8,pos:{score:{x:-445,y:125},tip:{x:-340,y:67},fold:{x:-552,y:99},time:{x:-478,y:107},zhuafen:{x:-500,y:191},ready:{x:95,y:0},bet:{x:0,y:-20},chat:{x:200,y:47},card:{x:239,y:-72,scale:0.8},voice:{x:-112,y:22,scalex:1,scaley:1}}}, 
        ],
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
        default_bg:"public/table/game_bg_dq"
    },
});
