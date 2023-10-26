cc.Class({
    extends: cc.Component,


    onEnable(){
        this.node.on(cc.Node.EventType.TOUCH_START,this.onTouchBegan,this)
        this.node.on(cc.Node.EventType.TOUCH_MOVE,this.onTouchBegan,this)
        this.node.on(cc.Node.EventType.TOUCH_END,this.onTouchBegan,this)
        this.node.on(cc.Node.EventType.TOUCH_CANCEL,this.onTouchBegan,this)
        this.node.on(cc.Node.EventType.MOUSE_DOWN,this.onTouchBegan,this)
        this.node.on(cc.Node.EventType.MOUSE_UP,this.onTouchBegan,this)
        this.node.on(cc.Node.EventType.MOUSE_WHEEL,this.onTouchBegan,this)

    },

    onDisable(){
        this.node.off(cc.Node.EventType.TOUCH_START,this.onTouchBegan,this)
        this.node.off(cc.Node.EventType.TOUCH_MOVE,this.onTouchBegan,this)
        this.node.off(cc.Node.EventType.TOUCH_END,this.onTouchBegan,this)
        this.node.off(cc.Node.EventType.TOUCH_CANCEL,this.onTouchBegan,this)
        this.node.off(cc.Node.EventType.MOUSE_DOWN,this.onTouchBegan,this)
        this.node.off(cc.Node.EventType.MOUSE_UP,this.onTouchBegan,this)
        this.node.off(cc.Node.EventType.MOUSE_WHEEL,this.onTouchBegan,this)
    },
    onTouchBegan(event){
        event._propagationStopped = false;
        this.node._touchListener.swallowTouches = false;
    }
})