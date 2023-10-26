//
//  CCLocationManager.h
//  MMLocationManager
//
//  Created by WangZeKeJi on 14-12-10.
//  Copyright (c) 2014年 Chen Yaoqiang. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>

#import <AMapFoundationKit/AMapFoundationKit.h>
#import <AMapLocationKit/AMapLocationKit.h>
static AMapLocationManager *locationManager;

@interface G3Plugin : NSObject

+ (void)init;
+ (void)vibrate:(int)time;
+ (void)iap:(int)storeid no:(NSString*)no;
+ (void)copy:(NSString *)text;
+ (void)login:(int)platfrom;
+ (void)logout:(int)platfrom;
+ (void)share:(NSMutableDictionary *)shareParams platfrom:(int)platfrom;
+ (void)shareText:(int)platfrom title:(NSString*)title text:(NSString*)text;
+ (void)shareImg:(int)platfrom title:(NSString*)title imgurl:(NSString*)imgurl url:(NSString*)url;
+ (void)shareWeb:(int)platfrom title:(NSString*)title text:(NSString*)text imgurl:(NSString*)imgurl url:(NSString*)url;
+ (void)evalString:(NSString*)code;
@end
