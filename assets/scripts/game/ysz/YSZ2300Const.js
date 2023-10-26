var NNConst = cc.Class({
    extends: cc.Component,
    statics: {
        player5:[//逆时针
            {x:-600,y:-250,distance:110,toright:220,scale:1.1,pos:{ready:{x:95,y:0},bet:{x:0,y:-20},chat:{x:200,y:47},card:{x:-270,y:-275,scale:1.0},voice:{x:-112,y:22,scalex:1,scaley:1}}},//1
            {x:600,y:-60,distance:50,toright:60,scale:0.8,pos:{ready:{x:-95,y:0},bet:{x:0,y:-20},chat:{x:-200,y:47},card:{x:400,y:-70,scale:0.8},voice:{x:-112,y:22,scalex:1,scaley:1}}},//2
            {x:54,y:263,distance:50,toright:80,scale:0.8,pos:{ready:{x:95,y:0},bet:{x:0,y:-20},chat:{x:200,y:47},card:{x:154,y:253,scale:0.8},voice:{x:112,y:22,scalex:-1,scaley:1}}},//3
            {x:-327,y:231,distance:50,toright:80,scale:0.8,pos:{ready:{x:-95,y:0},bet:{x:0,y:-20},chat:{x:200,y:47},card:{x:-227,y:221,scale:0.8},voice:{x:-112,y:22,scalex:1,scaley:1}}},//4
            {x:-602,y:-60,distance:50,toright:60,scale:0.8,pos:{ready:{x:95,y:0},bet:{x:0,y:-20},chat:{x:200,y:47},card:{x:-502,y:-70,scale:0.8},voice:{x:112,y:22,scalex:-1,scaley:1}}},//5
        ],
        player8:[//逆时针
            {x:-600,y:-250,distance:110,toright:220,scale:1.1,pos:{ready:{x:95,y:0},bet:{x:0,y:-20},chat:{x:200,y:47},card:{x:-270,y:-275,scale:1.0},voice:{x:-112,y:22,scalex:1,scaley:1}}},//1
            {x:600,y:-60,distance:30,toright:60,scale:0.8,pos:{ready:{x:-95,y:0},bet:{x:0,y:-20},chat:{x:-200,y:47},card:{x:390+70,y:-70,scale:0.6},voice:{x:-112,y:22,scalex:1,scaley:1}}},//2
            {x:557,y:159,distance:30,toright:60,scale:0.8,pos:{ready:{x:-95,y:0},bet:{x:0,y:-20},chat:{x:-200,y:47},card:{x:347+70,y:149,scale:0.6},voice:{x:-112,y:22,scalex:1,scaley:1}}},//3
            {x:296,y:243,distance:30,toright:60,scale:0.8,pos:{ready:{x:95,y:0},bet:{x:0,y:-20},chat:{x:200,y:47},card:{x:86+70,y:233,scale:0.6},voice:{x:-112,y:22,scalex:1,scaley:1}}},//4
            {x:-90,y:273,distance:30,toright:60,scale:0.8,pos:{ready:{x:95,y:0},bet:{x:0,y:-20},chat:{x:200,y:47},card:{x:-10,y:263,scale:0.6},voice:{x:112,y:22,scalex:-1,scaley:1}}},//5
            {x:-325,y:242,distance:30,toright:60,scale:0.8,pos:{ready:{x:95,y:0},bet:{x:0,y:-20},chat:{x:200,y:47},card:{x:-245,y:232,scale:0.6},voice:{x:112,y:22,scalex:-1,scaley:1}}},//6
            {x:-552,y:137,distance:30,toright:60,scale:0.8,pos:{ready:{x:95,y:0},bet:{x:0,y:-20},chat:{x:200,y:47},card:{x:-472,y:127,scale:0.6},voice:{x:112,y:22,scalex:-1,scaley:1}}},//7
            {x:-602,y:-60,distance:30,toright:60,scale:0.8,pos:{ready:{x:95,y:0},bet:{x:0,y:-20},chat:{x:200,y:47},card:{x:-522,y:-70,scale:0.6},voice:{x:112,y:22,scalex:-1,scaley:1}}},//8
        
        ],
        chat_path:"ysz",
        quick_chat:[
            {id:0,info:"上天呐，赐我一把好牌吧！"},
            {id:1,info:"天灵灵地灵灵，赌神请显灵！"},
            {id:2,info:"有种别看牌，我们闷到底！"},
            {id:3,info:"哎，辛辛苦苦几十年一把回到解放前。"},
            {id:4,info:"你敢下，我敢跟。"},
            {id:5,info:"新手吧，鸡不是这样偷的。"},
            {id:6,info:"天空一声响，闷王闪亮登场！"},
            {id:7,info:"别冲动，冷静点。"}, 
            {id:8,info:"看我通杀全场，这些钱都是我的！"}, 
            {id:9,info:"做人不要太勉强，胆子小就别跟。"}, 
        ],
        cuopai:[
            {card:{x:0,y:0,scale:2}}
        ],
        selfPoke5:
            {x:-200,y:-250,distance:50,scale:1.0},
        selfPoke8:
            {x:-200,y:-250,distance:50,scale:1.0},
    },
});
