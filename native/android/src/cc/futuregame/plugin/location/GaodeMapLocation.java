package cc.futuregame.plugin.location;

import com.amap.api.location.AMapLocation;
import com.amap.api.location.AMapLocationClient;
import com.amap.api.location.AMapLocationClientOption;
import com.amap.api.location.AMapLocationListener;
import org.cocos2dx.lib.Cocos2dxJavascriptJavaBridge;

import cc.futuregame.plugin.G3Plugin;

/**
 * Created by Administrator on 2018/5/16 0016.
 */

public class GaodeMapLocation {

    private static GaodeMapLocation mInstace = null;
    /**
     * 定位相关
     */
    private AMapLocationClient locationClient = null;
    private AMapLocationClientOption locationOption = null;

    /**
     * 单例化
     * @return
     */
    public static GaodeMapLocation getInstance() {
        if (null == mInstace){
            mInstace = new GaodeMapLocation();
        }
        return mInstace;
    }

    /**
     * 实例化定位
     */
    public GaodeMapLocation(){

        //初始化client
        locationClient = new AMapLocationClient(G3Plugin.getActivity().getApplicationContext());
        locationOption = new AMapLocationClientOption();
        locationOption.setNeedAddress(true);
        locationOption.setInterval(600000);
        locationOption.setGpsFirst(true);//可选，设置是否gps优先，只在高精度模式下有效。默认关闭

        AMapLocationClientOption.setLocationProtocol(AMapLocationClientOption.AMapLocationProtocol.HTTP);//可选， 设置网络请求的协议。可选HTTP或者HTTPS。默认为HTTP
        locationOption.setLocationCacheEnable(false); //可选，设置是否使用缓存定位，默认为true
        locationOption.setGeoLanguage(AMapLocationClientOption.GeoLanguage.DEFAULT);//可选，设置逆地理信息的语言，默认值为默认语言（根据所在地区选择语言）

        //设置定位参数
        locationClient.setLocationOption(locationOption);

        // 设置定位监听
        locationClient.setLocationListener(locationListener);
    }



    /**
     * 定位监听
     */
    AMapLocationListener locationListener = new AMapLocationListener() {
        @Override
        public void onLocationChanged(AMapLocation loc) {
            GaodeMapLocation.getInstance().Callback(loc);
        }
    };

    /**
     * 回调给游戏
     * @param loc
     */
    private void Callback(AMapLocation loc){

        if (null != loc && loc.getErrorCode() == 0) {

            final String latitude = String.valueOf(loc.getLatitude());//获取纬度
            final String longitude = String.valueOf(loc.getLongitude());//获取经度
            final String citycode = loc.getAdCode();
            final String address = String.format("%s %s %s %s %s",loc.getProvince(),loc.getCity(),loc.getDistrict(),loc.getStreet(),loc.getStreetNum()).trim();

            G3Plugin.getActivity().runOnGLThread(new Runnable() {
                @Override
                public void run() {
                    String eval = String.format("cc.vv.g3Plugin.onLocationResult(%d,\"%s\",\"%s\",\"%s\",\"%s\");",1,latitude,longitude,citycode,address);
                    Cocos2dxJavascriptJavaBridge.evalString(eval);
                }
            });
        } else {
            G3Plugin.getActivity().runOnGLThread(new Runnable() {
                @Override
                public void run() {
                    String eval = String.format("cc.vv.g3Plugin.onLocationResult(%d,\"%s\",\"%s\",\"%s\",\"%s\");",0,"","","","");
                    Cocos2dxJavascriptJavaBridge.evalString(eval);
                }
            });
        }
    }

    public void location(){
        //开始定位
        if(!locationClient.isStarted()){

            //最后一次成功定位先给下去
            AMapLocation loc = locationClient.getLastKnownLocation();
            this.Callback(loc);

            locationClient.startLocation();
        }
    }

    public void init(){

    }
}
