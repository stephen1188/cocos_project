var NNConst = cc.Class({
    extends: cc.Component,
    statics: {
        player4:[
            {x:-448,y:-255,distance:-80,distanceX:-6,distanceY:-7.5,xiazhuX:140,xiazhuH:-20,dianshuX:250,dianshuH:0,scale:1.0,pos:{xiazhu:{x:-448,y:-285},ready:{x:95,y:0},bet:{x:0,y:-20},chat:{x:200,y:47},card:{x:-80,y:-575,scale:1.5},voice:{x:-112,y:22,scalex:1,scaley:1}}},
            {x:512,y:-68,distance:-53,distanceX:-4,distanceY:-5,xiazhuX:0,xiazhuH:50,dianshuX:-120,dianshuH:0,scale:1.0,pos:{xiazhu:{x:512,y:-100},ready:{x:-94,y:0},bet:{x:0,y:-20},chat:{x:-200,y:47},card:{x:330,y:-384,scale:1},voice:{x:112,y:22,scalex:-1,scaley:1}}},
            {x:512,y:165,distance:-53,distanceX:-4,distanceY:-5,xiazhuX:0,xiazhuH:50,dianshuX:-120,dianshuH:0,scale:1.0,pos:{xiazhu:{x:512,y:131},ready:{x:-94,y:0},bet:{x:0,y:-20},chat:{x:-200,y:47},card:{x:330,y:-164,scale:1},voice:{x:-112,y:22,scalex:1,scaley:1}}},
            {x:-556,y:165,distance:-53,distanceX:-4,distanceY:-5,xiazhuX:0,xiazhuH:50,dianshuX:150,dianshuH:0,scale:1.0,pos:{xiazhu:{x:-556,y:131},ready:{x:94,y:0},bet:{x:0,y:-20},chat:{x:200,y:47},card:{x:-360,y:-164,scale:1},voice:{x:112,y:22,scalex:-1,scaley:1}}},
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
        xipai_pos:[
            {x:-163,y:-400,distance:53,scale:1.0},
            {x:-163,y:-200,distance:53,scale:1.0},
            {x:-163,y:0,distance:53,scale:1.0},
            {x:-163,y:200,distance:53,scale:1.0},
        ],
        not_xipai_pos:[
            {x:-163,y:-268,distance:53,scale:1.0},
            {x:-167,y:-273,distance:53,scale:1.0},
            {x:-163,y:-132,distance:53,scale:1.0},
            {x:-167,y:-137,distance:53,scale:1.0},
        ],
    },
});

