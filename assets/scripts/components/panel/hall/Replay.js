

cc.Class({
    extends: cc.Component,

    properties: {
        Replay_Code:cc.EditBox,
    },

    onBtnClicked: function (event, data) {
        var self = this;
        switch (event.target.name) {
            case "select":
            {
                cc.vv.popMgr.wait("正在查询中...");
                var replaycode = self.Replay_Code.string
                cc.vv.net1.quick("history_replay",{replay_id:replaycode});
            }
            break;
            case "rezero":
            {
                self.Replay_Code.string = "";
            }
            break;
        }
    },
    start () {

    },

    // update (dt) {},
});
