package cc.futuregame.plugin.mob;

import android.util.Log;

import org.cocos2dx.lib.Cocos2dxJavascriptJavaBridge;
import org.json.JSONObject;

import java.util.HashMap;

import cc.futuregame.plugin.G3Plugin;
import cn.sharesdk.framework.Platform;
import cn.sharesdk.framework.PlatformActionListener;
import cn.sharesdk.dingding.friends.Dingding;
import cn.sharesdk.framework.ShareSDK;
import cn.sharesdk.onekeyshare.OnekeyShare;
import cn.sharesdk.wechat.friends.Wechat;
import cn.sharesdk.wechat.moments.WechatMoments;

/**
 * 分享的操作类，各个平台的分享代码写在这里。
 */

public class MobShare{

	private static G3Plugin mInstace = null;

	private Platform platform = null;
	private MyPlatformActionListener myPlatformActionListener = null;

	public MobShare() {
        myPlatformActionListener = new MyPlatformActionListener();
    }

    public String getPlatfromName(int platfrom){
		switch (platfrom){
			case 1:
				return Wechat.NAME;
			case 2:
				return WechatMoments.NAME;
			case 3:
				return Dingding.NAME;
			case 4:
				return Dingding.NAME;
		}

		return Wechat.NAME;
	}

	//文字分享
	public void shareText(int platfrom,String title,String text) {

		final OnekeyShare oks = new OnekeyShare();

		if(platfrom != 0){
			oks.setPlatform(this.getPlatfromName(platfrom));
		}

		oks.disableSSOWhenAuthorize();
		oks.setTitle(title);
		oks.setText(text);
		oks.setCallback(myPlatformActionListener);
		oks.show(G3Plugin.getActivity());
	}

	//本地图分享
	public void shareImg(int platfrom,String title,String imgurl,String url) {

		final OnekeyShare oks = new OnekeyShare();

		if(platfrom != 0){
			oks.setPlatform(this.getPlatfromName(platfrom));
		}

		//指定分享的平台，如果为空，还是会调用九宫格的平台列表界面
		//关闭sso授权
		oks.disableSSOWhenAuthorize();
		oks.setTitle(title);
		oks.setImagePath(imgurl);
//		oks.setUrl(url);
		oks.setCallback(myPlatformActionListener);
		oks.show(G3Plugin.getActivity());
	}

	//图文分享
	public void shareWeb(int platfrom,String title,String text,String imgurl,String url) {
		Log.e("sdk" , platfrom + title + text + imgurl + url);
//		final OnekeyShare oks = new OnekeyShare();
//
//		if(platfrom != 0){
//			oks.setPlatform(this.getPlatfromName(platfrom));
//		}

		//指定分享的平台，如果为空，还是会调用九宫格的平台列表界面
		//关闭sso授权
//		oks.disableSSOWhenAuthorize();
//		oks.setTitle(title);
//		oks.setUrl(url);
//		oks.setImagePath(imgurl);
//		oks.setText(text);
//
//		oks.setCallback(myPlatformActionListener);
//		oks.show(G3Plugin.getActivity());

		Platform platformClass = ShareSDK.getPlatform( this.getPlatfromName(platfrom) );
		Platform.ShareParams shareParams = new Platform.ShareParams();
		shareParams.setTitle(title);
		shareParams.setText(text);
		shareParams.setUrl(url);
		shareParams.setImagePath(imgurl);
		shareParams.setShareType(Platform.SHARE_WEBPAGE);
		platformClass.setPlatformActionListener(myPlatformActionListener);
		platformClass.share(shareParams);
	}


	class MyPlatformActionListener implements PlatformActionListener {
		@Override
		public void onComplete(Platform platform, int i, final HashMap<String, Object> hashMap) {
			G3Plugin.getActivity().runOnGLThread(new Runnable() {
				@Override
				public void run() {

					String eval = String.format("cc.vv.g3Plugin.onShareResult(%d,\"%s\");",-1,"");

					try{
						JSONObject obj = new JSONObject();
						for (String key : hashMap.keySet()) {
							obj.put(key,hashMap.get(key));
						}
						eval = String.format("cc.vv.g3Plugin.onShareResult(%d,\"%s\");",1,obj.toString());

					}catch (Exception e){
					}

					Cocos2dxJavascriptJavaBridge.evalString(eval);
				}
			});
		}

		@Override
		public void onError(Platform platform, int i, Throwable throwable) {
			throwable.printStackTrace();
			final String error = throwable.toString();
			G3Plugin.getActivity().runOnGLThread(new Runnable() {
				@Override
				public void run() {
					String eval = String.format("cc.vv.g3Plugin.onShareResult(%d,\"%s\");",-1,"");
					Cocos2dxJavascriptJavaBridge.evalString(eval);
				}
			});
		}

		@Override
		public void onCancel(Platform platform, int i) {
			G3Plugin.getActivity().runOnGLThread(new Runnable() {
				@Override
				public void run() {
					String eval = String.format("cc.vv.g3Plugin.onShareResult(%d,\"%s\");",0,"");
					Cocos2dxJavascriptJavaBridge.evalString(eval);
				}
			});
		}
	}
}
