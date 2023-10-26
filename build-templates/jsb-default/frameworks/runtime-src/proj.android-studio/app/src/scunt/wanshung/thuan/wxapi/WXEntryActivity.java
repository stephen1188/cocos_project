package scunt.wanshung.thuan.wxapi;
import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.util.Log;

import com.tencent.mm.opensdk.modelbase.BaseReq;
import com.tencent.mm.opensdk.modelbase.BaseResp;
import com.tencent.mm.opensdk.modelmsg.SendAuth;
import com.tencent.mm.opensdk.openapi.IWXAPIEventHandler;
import com.tencent.mm.opensdk.openapi.WXAPIFactory;

import scunt.wanshung.thuan.AppActivity;
import scunt.wanshung.thuan.SDKWrapper;

import scunt.wanshung.thuan.WXAPI;
import org.cocos2dx.lib.Cocos2dxJavascriptJavaBridge;
import org.json.JSONArray;
import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;

public class WXEntryActivity extends Activity implements IWXAPIEventHandler{
//    private IWXAPI _api;
    private Context mainActive = null;
//    private static final String APP_ID = "这个是微信的appid换成你自己的";
//    private static final String APP_ID = "wx212f955e753aff78";
    private static final String APP_ID = "wxd10ad8e546464feb";
    public static String Tag = "WXEntryActivity";
    private String ls_url = "";

    public static BaseResp wxResp = null;


    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        AppActivity.api = WXAPIFactory.createWXAPI(this, WXEntryActivity.APP_ID, false);
        Log.e("===============","执行了注册这里");
        try {
            Intent intent = getIntent();
            AppActivity.api.handleIntent(intent, this);
        } catch (Exception e) {
        	e.printStackTrace();
        }
	}

    @Override
    protected void onNewIntent(Intent intent) {
        super.onNewIntent(intent);

        setIntent(intent);
        AppActivity.api.handleIntent(intent, this);
    }

	@Override
	public void onReq(BaseReq req) {

        finish();
	}
    public Context getContext() {
        return this.mainActive;
    }
	@Override
	public void onResp(BaseResp resp) {
        Log.e("===============","有返回值");
        if(resp.getType() == 1) {
            WXEntryActivity.wxResp = resp;
            AppActivity appActivity = (AppActivity) (SDKWrapper.getInstance().getContext());
            appActivity.runOnGLThread(new Runnable() {
                @Override
                public void run() {
                    Log.e("===============","有返回值");
                    switch (WXEntryActivity.wxResp.errCode) {
                        case BaseResp.ErrCode.ERR_OK:
                            if (WXAPI.isLogin) {
                                String token = ((SendAuth.Resp) WXEntryActivity.wxResp).code;
                                Thread current = Thread.currentThread();
                                Log.v(Tag, "1---===============:" + Long.toString(current.getId()));
                                Log.v(Tag, "1---===============:" + token);
                                String eval = String.format("cc.vv.g3Plugin.onUserResult(%d,\"%s\");",1,token);
                                Cocos2dxJavascriptJavaBridge.evalString(eval);
                                Log.v(Tag, "1----4 ");
                            }
                            break;
                        case BaseResp.ErrCode.ERR_USER_CANCEL:
//                            String eval3 =
//                            Cocos2dxJavascriptJavaBridge.evalString(eval3);
                            Cocos2dxJavascriptJavaBridge.evalString(String.format("cc.vv.g3Plugin.onUserResult(%d,\"%s\");",-1,""));
                            break;
                        case BaseResp.ErrCode.ERR_AUTH_DENIED:
                            Cocos2dxJavascriptJavaBridge.evalString(String.format("cc.vv.g3Plugin.onUserResult(%d,\"%s\");",0,""));
                            break;
                        default:
                            Cocos2dxJavascriptJavaBridge.evalString(String.format("cc.vv.g3Plugin.onUserResult(%d,\"%s\");",0,""));
                            break;
                    }
                }
            });
        }
        finish();
	}
}