package cc.futuregame.plugin.mob;

import android.util.Base64;

import org.cocos2dx.lib.Cocos2dxJavascriptJavaBridge;
import org.json.JSONObject;

import java.util.HashMap;

import cc.futuregame.plugin.G3Plugin;
import cn.sharesdk.framework.Platform;
import cn.sharesdk.framework.PlatformActionListener;
import cn.sharesdk.framework.ShareSDK;
import cn.sharesdk.wechat.friends.Wechat;

/**
 * Created by yjin on 2017/6/21.
 */

public class MobAuthorize {

	private MyPlatformActionListener myPlatformActionListener = null;

	public MobAuthorize() {
		this.myPlatformActionListener = new MyPlatformActionListener();
	}

	public void login(int platfrom){
		Platform form = null;

		switch(platfrom){
			case 1:{
				form = ShareSDK.getPlatform(Wechat.NAME);
			}
			default:{
				form = ShareSDK.getPlatform(Wechat.NAME);
			}
		}

//		doAuthorize(form);
		doUserInfo(form);
	}

	public void logout(int platfrom){
		Platform form = null;

		switch(platfrom){
			default:{
				form = ShareSDK.getPlatform(Wechat.NAME);
			}
		}

		doUnAuthorize(form);
	}

	/**
	 * 授权的代码
	 */
	public void doAuthorize(Platform platform) {
		if (platform != null) {
			platform.setPlatformActionListener(myPlatformActionListener);
			if (platform.isAuthValid()) {
				platform.removeAccount(true);
				return;
			}
			platform.SSOSetting(true);
			platform.authorize();
		}
	}

	/**
	 * 解除授权的代码
	 */
	public void doUnAuthorize(Platform platform) {
		if (platform != null) {
			platform.setPlatformActionListener(myPlatformActionListener);
			platform.removeAccount(true);
		}
	}

	/**
	 * 用户信息的代码
	 */
	public void doUserInfo(Platform platform) {
		if (platform != null) {
			platform.setPlatformActionListener(myPlatformActionListener);
			platform.showUser(null);
		}
	}

	/**
	 * 回调代码
	 */
	class MyPlatformActionListener implements PlatformActionListener {
		@Override
		public void onComplete(final Platform platform, int i, final HashMap<String, Object> hashMap) {
			G3Plugin.getActivity().runOnGLThread(new Runnable() {
				@Override
				public void run() {

					try{
						JSONObject obj = new JSONObject();
						for (String key : hashMap.keySet()) {
							obj.put(key, hashMap.get(key));
						}

						String data = new String(Base64.encode(obj.toString().getBytes(),Base64.DEFAULT));
						data = data.replace("\n","");

						String eval = String.format("cc.vv.g3Plugin.onUserResult(%d,\"%s\");",1,data);
						Cocos2dxJavascriptJavaBridge.evalString(eval);

						return;

					}catch (Exception e){
					}

					String eval = String.format("cc.vv.g3Plugin.onUserResult(%d,\"%s\");",-1,"");
					Cocos2dxJavascriptJavaBridge.evalString(eval);
				}
			});
		}

		@Override
		public void onError(Platform platform, int i, Throwable throwable) {
			throwable.printStackTrace();
			G3Plugin.getActivity().runOnGLThread(new Runnable() {
				@Override
				public void run() {
					String eval = String.format("cc.vv.g3Plugin.onUserResult(%d,\"%s\");",-1,"");
					Cocos2dxJavascriptJavaBridge.evalString(eval);
				}
			});
		}

		@Override
		public void onCancel(Platform platform, int i) {
			G3Plugin.getActivity().runOnGLThread(new Runnable() {
				@Override
				public void run() {
					String eval = String.format("cc.vv.g3Plugin.onUserResult(%d,\"%s\");",0,"");
					Cocos2dxJavascriptJavaBridge.evalString(eval);
				}
			});
		}
	}
}
