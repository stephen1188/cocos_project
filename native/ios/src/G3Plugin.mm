//
//  CCLocationManager.m
//  MMLocationManager
//
//  Created by WangZeKeJi on 14-12-10.
//  Copyright (c) 2014年 Chen Yaoqiang. All rights reserved.
//

#import "G3Plugin.h"
#import "G3IAP.h"
#import <AudioToolbox/AudioToolbox.h>

#include "cocos/scripting/js-bindings/jswrapper/SeApi.h"
#include "cocos/scripting/js-bindings/manual/ScriptingCore.h"

//微信SDK头文件
#import "WXApi.h"

#import <DTShareKit/DTOpenAPI.h>

//mobSDK
#import <ShareSDK/ShareSDK.h>
#import <ShareSDKConnector/ShareSDKConnector.h>
#import <StoreKit/StoreKit.h>

@interface G3Plugin ()

@end
@implementation G3Plugin 

+ (void)init{
    
    [UIApplication sharedApplication].idleTimerDisabled = YES;
    
    //定时查看电量
    [NSTimer scheduledTimerWithTimeInterval:10.0f target:self selector:@selector(currentPhoneLister:) userInfo:nil repeats:YES];
    
    //定位SDK
    [AMapServices sharedServices].apiKey =@"9f057604c43e5e43d82503087b90ec0a";//高德地图key
    
    //初始化SHARESDK
    [G3Plugin initMobSDK];
    
    //IAP
    [G3IAP init];
}

//下单购买
+ (void)iap:(int)storeid no:(NSString*)no
{
    [G3IAP iap:storeid no:no];
}

//复制内容至剪切板
+(void)copy:(NSString *)text
{
    UIPasteboard *pasteboard = [UIPasteboard generalPasteboard];
    pasteboard.string = text;
}

//分享文字
+ (void)shareText:(int)platfrom title:(NSString*)title text:(NSString*)text{
    
    NSMutableDictionary *shareParams = [NSMutableDictionary dictionary];
    [shareParams SSDKSetupShareParamsByText:text images:nil url:nil title:title type:SSDKContentTypeText];
    
    [G3Plugin share:shareParams platfrom:platfrom];
}

//分享图片
+ (void)shareImg:(int)platfrom title:(NSString*)title imgurl:(NSString*)imgurl url:(NSString*)url{
    
    NSMutableDictionary *shareParams = [NSMutableDictionary dictionary];
    NSArray* imageArray = @[[UIImage imageNamed:imgurl]];
     [shareParams SSDKSetupShareParamsByText:@"" images:imageArray url:[NSURL URLWithString:url] title:title type:SSDKContentTypeImage];
    
    [G3Plugin share:shareParams platfrom:platfrom];
}

//分享
+ (void)share:(NSMutableDictionary *)shareParams platfrom:(int)platfrom{
    
    SSDKPlatformType type = SSDKPlatformSubTypeWechatSession;
    switch (platfrom){
        case 1:{
            type = SSDKPlatformSubTypeWechatSession;
        }
            break;
        case 2:{
            type = SSDKPlatformSubTypeWechatTimeline;
        }
            break;
        case 3:{
            type = SSDKPlatformTypeDingTalk;
        }
            break;
    }
    
    //2、直接分享
    [ShareSDK share:type parameters:shareParams onStateChanged:^(SSDKResponseState state, NSDictionary *userData, SSDKContentEntity *contentEntity, NSError *error) {
        switch (state) {
            case SSDKResponseStateSuccess:
            {
                [G3Plugin evalString:[NSString stringWithFormat:@"cc.vv.g3Plugin.onShareResult(%d,'%@');",1,@""]];
            }
                break;
            case SSDKResponseStateFail:
            {
                [G3Plugin evalString:[NSString stringWithFormat:@"cc.vv.g3Plugin.onShareResult(%d,'%@');",-1,error.userInfo.description]];
            }
                break;
            case SSDKResponseStateCancel:
            {
                [G3Plugin evalString:[NSString stringWithFormat:@"cc.vv.g3Plugin.onShareResult(%d,'%@');",-1,@"分享取消"]];
            }
            default:
                break;
        }
    }];
}

//分享网页
+ (void)shareWeb:(int)platfrom title:(NSString*)title text:(NSString*)text imgurl:(NSString*)imgurl url:(NSString*)url{
    
    NSMutableDictionary *shareParams = [NSMutableDictionary dictionary];
    NSArray* imageArray = @[[UIImage imageNamed:imgurl]];
    [shareParams SSDKSetupShareParamsByText:text images:imageArray url:[NSURL URLWithString:url] title:title type:SSDKContentTypeWebPage];
    
    [G3Plugin share:shareParams platfrom:platfrom];
}

//登出
+(void) logout:(int)platform{
    //例如QQ的登录
    [ShareSDK cancelAuthorize:SSDKPlatformTypeWechat];
}

/**
 * 登录
 */
+(void) login:(int)platfrom{
    
    //例如QQ的登录
    [ShareSDK getUserInfo:SSDKPlatformTypeWechat onStateChanged:^(SSDKResponseState state, SSDKUser *user, NSError *error)
     {
         if (state == SSDKResponseStateSuccess)
         {
             NSData *jsonData = [NSJSONSerialization dataWithJSONObject:user.rawData options:NSJSONWritingPrettyPrinted error:&error];
             NSString *base64String = [jsonData base64EncodedStringWithOptions:0];
             [G3Plugin evalString:[NSString stringWithFormat:@"cc.vv.g3Plugin.onUserResult(%d,'%@');",1,base64String]];
         }
         else
         {
             [G3Plugin evalString:[NSString stringWithFormat:@"cc.vv.g3Plugin.onUserResult(%d,'%@');",-1,error]];
         }
         
     }];
}


/**初始化ShareSDK应用
 @param activePlatforms
 使用的分享平台集合
 @param importHandler (onImport)
 导入回调处理，当某个平台的功能需要依赖原平台提供的SDK支持时，需要在此方法中对原平台SDK进行导入操作
 @param configurationHandler (onConfiguration)
 配置回调处理，在此方法中根据设置的platformType来填充应用配置信息
 */
+ (void) initMobSDK
{
    
    [ShareSDK registerActivePlatforms:@[
                                        @(SSDKPlatformTypeWechat),
                                        @(SSDKPlatformTypeDingTalk)
                                        ]
    onImport:^(SSDKPlatformType platformType)
     {
         switch (platformType)
         {
             case SSDKPlatformTypeWechat:
                 [ShareSDKConnector connectWeChat:[WXApi class]];
                 break;
              case SSDKPlatformTypeDingTalk:
                  [ShareSDKConnector connectDingTalk:[DTOpenAPI class]];
                  break;
             default:
                 break;
         }
     }
    onConfiguration:^(SSDKPlatformType platformType, NSMutableDictionary *appInfo)
     {
         switch (platformType)
         {
             case SSDKPlatformTypeWechat://微信分享
                 [appInfo SSDKSetupWeChatByAppId:@"wxf9a6595838f4da04"
                                       appSecret:@"da1ddcc1d5d5a10cbefe9e2ef6ce0741"];
                 break;
             case SSDKPlatformTypeDingTalk://钉钉分享
                 [appInfo SSDKSetupDingTalkByAppId:@"dingoauz5vmbnmc8awrvpi"];
                 break;
             default:
                 break;
         }
     }];
}

//js获取定位
+ (void)location
{
    //初始化位置管理器
    locationManager = [[AMapLocationManager alloc] init];
    //设置委托
    [locationManager setDelegate:self];
  
    [locationManager setDesiredAccuracy:kCLLocationAccuracyBest];
    locationManager.locationTimeout =10;
    locationManager.reGeocodeTimeout = 10;
    locationManager.distanceFilter = 50;
    
    //开始持续定位
    [locationManager setLocatingWithReGeocode:YES];
    [locationManager startUpdatingLocation];
}

//定位返回值
+ (void)amapLocationManager:(AMapLocationManager *)manager didUpdateLocation:(CLLocation *)location reGeocode:(AMapLocationReGeocode *)reGeocode
{
    NSString* citycode = @"";
    NSString* address = @"";
    
    if (reGeocode)
    {
        citycode = reGeocode.adcode;
        address = reGeocode.formattedAddress;
    }
    
    NSString* eval = [NSString stringWithFormat:@"cc.vv.g3Plugin.onLocationResult(%d,\"%f\",\"%f\",\"%@\",\"%@\");",1,location.coordinate.latitude,location.coordinate.longitude,citycode,address];
    
    [G3Plugin evalString:eval];
}



//手机震动
+ (void)vibrate:(int)time{
    AudioServicesPlaySystemSound(kSystemSoundID_Vibrate);
}

+ (void) evalString:(NSString*)code
{
    se::ScriptEngine::getInstance()->evalString([code UTF8String]);
}

//电量和WIFI信号监听
+(void) currentPhoneLister:(id) sender{
    
    NSArray *children;
    UIApplication *app = [UIApplication sharedApplication];

    // 不能用 [[self deviceVersion] isEqualToString:@"iPhone X"] 来判断，因为模拟器不会返回 iPhone X
    if ([[app valueForKeyPath:@"_statusBar"] isKindOfClass:NSClassFromString(@"UIStatusBar_Modern")]) {
        children = [[[[app valueForKeyPath:@"_statusBar"] valueForKeyPath:@"_statusBar"] valueForKeyPath:@"foregroundView"] subviews];
    } else {
        children = [[[app valueForKeyPath:@"_statusBar"] valueForKeyPath:@"foregroundView"] subviews];
    }
 
    for (id info in children)
    {
        if ([info isKindOfClass:NSClassFromString(@"UIStatusBarBatteryPercentItemView")])
        {
            int power = [[info valueForKeyPath:@"percentString"] intValue];
            [G3Plugin evalString:[NSString stringWithFormat:@"cc.vv.g3Plugin.onPowerResult(%d);",power]];
        }
        
        if([info isKindOfClass:[NSClassFromString(@"UIStatusBarDataNetworkItemView") class]]) {
            int strength = [[info valueForKey:@"_wifiStrengthBars"] intValue];
            [G3Plugin evalString:[NSString stringWithFormat:@"cc.vv.g3Plugin.onNetworkResult(%d,%d);",0,strength]];
        }
    }
}

@end
