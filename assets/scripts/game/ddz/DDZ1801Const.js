var DDZConst = cc.Class({
    extends: cc.Component,
    statics: {
        player3:[
            {x:-620,y:-40,distance:50,scale:0.8,pos:{ready:{x:95,y:0},bet:{x:0,y:-20},chat:{x:200,y:47},card:{x:-88,y:-248,scale:1.0},voice:{x:112,y:22,scalex:-1,scaley:1},shake:{x:46,y:67}}},
            {x:620,y:143,distance:50,scale:0.8,pos:{ready:{x:-95,y:0},bet:{x:0,y:-20},chat:{x:-200,y:47},card:{x:239,y:-72,scale:0.8},voice:{x:-112,y:22,scalex:1,scaley:1},shake:{x:-46,y:67}}},
            {x:-620,y:143,distance:50,scale:0.8,pos:{ready:{x:95,y:0},bet:{x:0,y:-20},chat:{x:200,y:47},card:{x:-404,y:-72,scale:0.8},voice:{x:112,y:22,scalex:-1,scaley:1},shake:{x:46,y:67}}},
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
        default_bg:"public/table/game_bg_ddz"
    },
});
