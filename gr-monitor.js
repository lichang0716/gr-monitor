/********* Ricoh GR III / IIIx 监控脚本 *********/

const url = "https://newsite.ricn-mall.com/goods_cate?cid=9";

$task.fetch({ url }).then(resp => {
    let body = resp.body || "";

    // 判断关键词是否出现
    const foundIII = body.includes("III");
    const foundIIIX = body.includes("IIIx") || body.includes("III X") || body.includes("GR IIIx");

    let msg = "";

    if (foundIII || foundIIIX) {
        msg = "🚨 Ricoh GR 发现库存！";

        if (foundIII) msg += "\n- GR III 出现";
        if (foundIIIX) msg += "\n- GR IIIx 出现";

        // QuantumultX 通知
        $notify("🎉 GR 商品监控", "页面检测到目标型号", msg);
    } else {
        // 页面未出现目标型号，发送“心跳通知”，确认定时任务正常
        msg = "ℹ️ GR 页面监控正常运行，但未检测到 III 或 IIIx";
        $notify("GR 监控心跳", "定时任务正常", msg);
    }

    $done({});
}).catch(err => {
    // 请求失败也发送通知
    $notify("❌ GR 页面监控失败", "", err);
    $done({});
});
