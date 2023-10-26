var NNConst = cc.Class({
    extends: cc.Component,
    statics: {
        player4:[
            {x:-448,y:-255,distance:119,distanceH:36,xiazhuX:140,xiazhuH:-20,dianshuX:64,dianshuH:280,scale:1.0,pos:{xiazhu:{x:-448,y:-285},ready:{x:95,y:0},bet:{x:0,y:-20},chat:{x:200,y:47},card:{x:-45,y:-495,scale:2.5},voice:{x:-112,y:22,scalex:1,scaley:1}}},
            {x:512,y:-68,distance:47,distanceH:18,xiazhuX:0,xiazhuH:50,dianshuX:30,dianshuH:230,scale:1.0,pos:{xiazhu:{x:512,y:-100},ready:{x:-94,y:0},bet:{x:0,y:-20},chat:{x:-200,y:47},card:{x:400,y:-314,scale:1},voice:{x:112,y:22,scalex:-1,scaley:1}}},
            {x:512,y:165,distance:47,distanceH:18,xiazhuX:0,xiazhuH:50,dianshuX:30,dianshuH:230,scale:1.0,pos:{xiazhu:{x:512,y:131},ready:{x:-94,y:0},bet:{x:0,y:-20},chat:{x:-200,y:47},card:{x:400,y:-84,scale:1},voice:{x:-112,y:22,scalex:1,scaley:1}}},
            {x:-556,y:165,distance:47,distanceH:18,xiazhuX:0,xiazhuH:50,dianshuX:25,dianshuH:230,scale:1.0,pos:{xiazhu:{x:-556,y:131},ready:{x:94,y:0},bet:{x:0,y:-20},chat:{x:200,y:47},card:{x:-430,y:-84,scale:1},voice:{x:112,y:22,scalex:-1,scaley:1}}},
            // {x:-556,y:-68,distance:47,distanceH:18,xiazhuX:0,xiazhuH:50,dianshuX:30,dianshuH:200,scale:1.0,pos:{ready:{x:94,y:0},bet:{x:0,y:-20},chat:{x:200,y:47},card:{x:-430,y:-315,scale:1},voice:{x:-112,y:22,scalex:1,scaley:1}}},
        ],
        player6:[
            {x:-448,y:-255,distance:119,distanceH:36,xiazhuX:-107,xiazhuH:-20,dianshuX:244,dianshuH:190,scale:1.0,pos:{xiazhu:{x:-448,y:-285},ready:{x:95,y:0},bet:{x:0,y:-20},chat:{x:200,y:47},card:{x:-234,y:-475,scale:2.5},voice:{x:-112,y:22,scalex:1,scaley:1}}},
            {x:-580,y:-18,distance:30,distance:47,distanceH:18,xiazhuX:114,xiazhuH:50,dianshuX:130,dianshuH:155,scale:0.8,pos:{xiazhu:{x:-580,y:-44},ready:{x:95,y:0},bet:{x:0,y:-20},chat:{x:200,y:47},card:{x:-445,y:-285,scale:1},voice:{x:112,y:22,scalex:-1,scaley:1}}},//2
            {x:-580,y:200,distance:30,distance:47,distanceH:18,xiazhuX:114,xiazhuH:50,dianshuX:130,dianshuH:154,scale:0.8,pos:{xiazhu:{x:-580,y:172},ready:{x:95,y:0},bet:{x:0,y:-20},chat:{x:200,y:47},card:{x:-445,y:-74,scale:1},voice:{x:112,y:22,scalex:-1,scaley:1}}},//3
            // {x:-580,y:260,distance:30,scale:0.8,pos:{ready:{x:95,y:0},bet:{x:0,y:-20},chat:{x:200,y:47},card:{x:-500,y:248,scale:0.6},voice:{x:112,y:22,scalex:-1,scaley:1}}},//4
            // {x:-286,y:260,distance:30,scale:0.8,pos:{ready:{x:95,y:0},bet:{x:0,y:-20},chat:{x:200,y:47},card:{x:-208,y:248,scale:0.6},voice:{x:-112,y:22,scalex:1,scaley:1}}},//5
            // {x:10,y:260,distance:30,scale:0.8,pos:{ready:{x:95,y:0},bet:{x:0,y:-20},chat:{x:200,y:47},card:{x:85,y:248,scale:0.6},voice:{x:-112,y:22,scalex:1,scaley:1}}},//6
            // {x:310,y:260,distance:30,scale:0.8,pos:{ready:{x:95,y:0},bet:{x:0,y:-20},chat:{x:200,y:47},card:{x:385,y:248,scale:0.6},voice:{x:-112,y:22,scalex:1,scaley:1}}},//7
            {x:580,y:200,distance:30,distance:47,distanceH:18,xiazhuX:-137,xiazhuH:-102,dianshuX:-90,dianshuH:152,scale:0.8,pos:{xiazhu:{x:580,y:172},ready:{x:-95,y:0},bet:{x:0,y:-20},chat:{x:-200,y:47},card:{x:460,y:-74,scale:1},voice:{x:-112,y:22,scalex:1,scaley:1}}},//8
            {x:580,y:-18,distance:30,distance:47,distanceH:18,xiazhuX:-137,xiazhuH:-94,dianshuX:-90,dianshuH:155,scale:0.8,pos:{xiazhu:{x:580,y:-40},ready:{x:-95,y:0},bet:{x:0,y:-20},chat:{x:-200,y:47},card:{x:460,y:-285,scale:1},voice:{x:-112,y:22,scalex:1,scaley:1}}},//9
            {x:427,y:-255,distance:30,distance:47,distanceH:18,xiazhuX:-170,xiazhuH:48,dianshuX:25,dianshuH:225,scale:0.8,pos:{xiazhu:{x:427,y:-280},ready:{x:95,y:0},bet:{x:0,y:-20},chat:{x:200,y:47},card:{x:304,y:-525,scale:1},voice:{x:-112,y:22,scalex:1,scaley:1}}},//10
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
            {x:-150,y:45,distance:47,scale:1.0},
            {x:-150,y:145,distance:47,scale:1.0},
            {x:-150,y:-155,distance:47,scale:1.0},
            {x:-150,y:-55,distance:47,scale:1.0},
        ],
        not_xipai_pos:[
            {x:-150,y:-27,distance:47,scale:1.0},
            {x:-150,y:-11,distance:47,scale:1.0},
            {x:-150,y:-83,distance:47,scale:1.0},
            {x:-150,y:-67,distance:47,scale:1.0},
        ],
        default_bg:"public/table/ysz_bg"
    },
});
