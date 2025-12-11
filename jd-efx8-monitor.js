/********* 京东商品到货监控 *********/

const skuId = "10128509573156";       // 你的商品 SKU
const areaId = "12-988-40034-48092";  // 你的地区 Area ID

// 京东库存 API
const url = `https://c0.3.cn/stock?skuId=${skuId}&area=${areaId}&callback=stockCallback`;

$task.fetch({ url }).then(resp => {
    let body = resp.body;

    // 解析返回 JSON
    let jsonText = body.match(/stockCallback\((.*)\)/)[1];
    let data = JSON.parse(jsonText);

    // stockState: 33=有货, 34=无货, 40=即将到货
    if (data.stockState === 33) {
        $notify("🎉 京东到货提醒", `EF-8X 已到货！`, `请及时下单`);
    } else {
        // 心跳通知，确认定时任务正常运行
        $notify("京东监控", `EF-8X  仍未到货`, "定时任务正常运行");
    }

    $done({});
}).catch(err => {
    // 请求失败也发送通知
    $notify("❌ 京东监控失败", "", err);
    $done({});
});
