//
//  CCLocationManager.m
//  MMLocationManager
//
//  Created by WangZeKeJi on 14-12-10.
//  Copyright (c) 2014年 Chen Yaoqiang. All rights reserved.
//

#import "G3IAP.h"
#import "G3Plugin.h"

#import <StoreKit/StoreKit.h>

@interface G3IAP ()<SKPaymentTransactionObserver,SKProductsRequestDelegate>

@end
@implementation G3IAP

+ (void)init{
    [[SKPaymentQueue defaultQueue] addTransactionObserver:self];
}

//下单购买
+ (void)iap:(int)storeid no:(NSString*)no
{
    if(![SKPaymentQueue canMakePayments]){
        [G3IAP orderRet:-1 msg:@"不允许程序内付费"];
        return;
    }
    
    orderNo =[[NSString alloc] init];
    orderNo = [no copy];
    
    NSArray *profuctIdArr = @[@"play6",@"play30",@"play68"];
    NSString *currentProId = profuctIdArr[storeid];

    NSArray *product = [[NSArray alloc] initWithObjects:currentProId,nil];
    NSSet *nsset = [NSSet setWithArray:product];
    SKProductsRequest *request = [[SKProductsRequest alloc] initWithProductIdentifiers:nsset];
    request.delegate = self;
    [request start];
}

+ (void)orderRet:(int)code msg:(NSString*)msg{
    [G3Plugin evalString:[NSString stringWithFormat:@"cc.vv.g3Plugin.onShoppingResult(%d,'%@','%@');",code,msg,orderNo]];
}

//收到产品返回信息
+ (void)productsRequest:(SKProductsRequest *)request didReceiveResponse:(SKProductsResponse *)response{
    
    NSArray *product = response.products;
    if([product count] == 0){
        [G3IAP orderRet:-1 msg:@"不存在的商品"];
        return;
    }
    
    SKPayment *payment = [SKPayment paymentWithProduct:product[0]];
    [[SKPaymentQueue defaultQueue] addPayment:payment];
}

//监听购买结果
+ (void)paymentQueue:(SKPaymentQueue *)queue updatedTransactions:(NSArray *)transaction{
    for(SKPaymentTransaction *tran in transaction){
        switch (tran.transactionState) {
            case SKPaymentTransactionStatePurchased:{
                [[SKPaymentQueue defaultQueue] finishTransaction:tran];
                [G3IAP orderRet:1 msg:@"购买完成，请等候确认后发放道具"];
            }
                break;
            case SKPaymentTransactionStateFailed:{
                [[SKPaymentQueue defaultQueue] finishTransaction:tran];
                [G3IAP orderRet:-1 msg:@"购买失败，请稍后重试"];
            }
                break;
            default:
                break;
        }
    }
}

//交易结束
+ (void)completeTransaction:(SKPaymentTransaction *)transaction{
    NSLog(@"交易结束");
    
    [[SKPaymentQueue defaultQueue] finishTransaction:transaction];
}

//
//+ (void)dealloc{
//    [[SKPaymentQueue defaultQueue] removeTransactionObserver:self];
//}
//
//+ (void)didReceiveMemoryWarning {
//    [super didReceiveMemoryWarning];
//}

@end
