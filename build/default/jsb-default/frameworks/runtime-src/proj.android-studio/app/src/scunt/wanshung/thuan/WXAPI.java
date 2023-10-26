package scunt.wanshung.thuan;

import java.io.File;

import android.app.Activity;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.util.Base64;
import android.util.Log;
import android.view.WindowManager;

import com.tencent.mm.opensdk.modelmsg.SendAuth;
import com.tencent.mm.opensdk.modelmsg.SendMessageToWX;
import com.tencent.mm.opensdk.modelmsg.WXImageObject;
import com.tencent.mm.opensdk.modelmsg.WXMediaMessage;
import com.tencent.mm.opensdk.modelmsg.WXWebpageObject;

import org.cocos2dx.lib.Cocos2dxJavascriptJavaBridge;

public class WXAPI {
//	public static IWXAPI api;
	public static Activity instance;
	public static boolean isLogin = false;
	public static void Init(Activity context){
		WXAPI.instance = context;
//		api = WXAPIFactory.createWXAPI(context, AppActivity.APP_ID, true);
//        api.registerApp(AppActivity.APP_ID);
        context.getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
	}
	
	private static String buildTransaction(final String type) {
	    return (type == null) ? String.valueOf(System.currentTimeMillis()) : type + System.currentTimeMillis();
	}
	
	public static void login(int platfrom){

		Thread current  = Thread.currentThread();
//		Log.v("ss","1---0process:"+ Long.toString(current.getId()));
		
		isLogin = true;
		final SendAuth.Req req = new SendAuth.Req();
		req.scope = "snsapi_userinfo";
		req.state = "carjob_wx_login";
		AppActivity.api.sendReq(req);
		//instance.finish();
	}
	public static void toBase64(final String msg){
		G3Plugin.getActivity().runOnGLThread(new Runnable() {
			@Override
			public void run() {
				try{
					String data = new String(Base64.encode(msg.getBytes(),Base64.DEFAULT));
					data = data.replace("\n","");
					String eval = String.format("cc.vv.g3Plugin.onUserResult(%d,\"%s\");",2,data);
					Cocos2dxJavascriptJavaBridge.evalString(eval);
					return;
				}catch (Exception e){
				}
				String eval = String.format("cc.vv.g3Plugin.onUserResult(%d,\"%s\");",-1,"");
				Cocos2dxJavascriptJavaBridge.evalString(eval);
			}
		});
	}
	/** 分享网页**/
	public static void ShareUrl(int scene, String url,String title,String desc){
		Log.e("传过来的分享参数url：",url);
		Log.e("传过来的分享参数title：",title);
		Log.e("传过来的分享参数desc：",desc);
		Log.e("传过来的分享参数scene：",scene+"");
		try{
			WXWebpageObject webpage = new WXWebpageObject();
			webpage.webpageUrl = url;
			WXMediaMessage msg = new WXMediaMessage(webpage);
			msg.title = title;
			msg.description = desc;

//			Bitmap bmp = BitmapFactory.decodeResource(WXAPI.instance.getResources(), R.mipmap.ic_launcher);
//			Bitmap thumbBmp = Bitmap.createScaledBitmap(bmp, 72, 72, true);
//			bmp.recycle();
//			msg.thumbData = Util.bmpToByteArray(thumbBmp, true);
//
//			SendMessageToWX.Req req = new SendMessageToWX.Req();
//			req.transaction = buildTransaction("webpage");
//			req.message = msg;
//
//		    req.scene = scene;
//			AppActivity.api.sendReq(req);
		}
		catch(Exception e){
			e.printStackTrace();
		}
	}
	/** 图片分享*/
	public static void ShareImage(int scene, String path){
		Log.e("传过来的分享参数url：",path);
//		Log.e("传过来的分享参数title：",title);
//		Log.e("传过来的分享参数desc：",desc);
		Log.e("传过来的分享参数scene：",scene+"");
//		path = "http://res.long.wanlege.com/mnxp/ic_launcher.png";
		try{
			File file = new File(path);
			if (!file.exists()) {
				Log.v("ss","ShareIMG:cant find :" + path);
				return;
			}
			Log.v("ss","ShareIMG:hello :" + path);
			Bitmap bmp = BitmapFactory.decodeFile(path);

			WXImageObject imgObj = new WXImageObject(bmp);
			//imgObj.setImagePath(path);

			WXMediaMessage msg = new WXMediaMessage();
			msg.mediaObject = imgObj;
			Bitmap thumbBmp = Bitmap.createScaledBitmap(bmp, 128, 72, true);
			bmp.recycle();
			msg.thumbData = Util.bmpToByteArray(thumbBmp, true);
			SendMessageToWX.Req req = new SendMessageToWX.Req();
			req.transaction = buildTransaction("img");
			req.message = msg;
			req.scene = scene;
//			msg.title = title;
//			msg.description = desc;
			AppActivity.api.sendReq(req);
		}
		catch(Exception e){
			e.printStackTrace();
		}
	}
}
