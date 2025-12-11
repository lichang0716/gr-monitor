/********* Ricoh GR III / IIIx 监控脚本 *********/

const url = "https://newsite.ricn-mall.com/goods_cate?cid=9";

$task.fetch({ url }).then(resp => {
    let body = resp.body || "";

    // 判断关键词是否出现
    const foundIII = body.includes("III");
    const foundIIIX = body.includes("IIIx") || body.includes("III X") || body.includes("GR IIIx");

    if (foundIII || foundIIIX) {
        let msg = "🚨 Ricoh GR 发现库存！";

        if (foundIII) msg += "\n- GR III 出现";
        if (foundIIIX) msg += "\n- GR IIIx 出现";

        // QuantumultX 通知
        $notify("🎉 GR 商品监控", "页面检测到目标型号", msg);

        // === 邮件通知（可选）===
        // 如果你需要发邮件，请替换自己的 SMTP 信息
        /*
        $task.fetch({
            url: "http://your-smtp-server/sendmail",
            method: "POST",
            body: JSON.stringify({
                to: "you@example.com",
                subject: "GR 监控提醒",
                text: msg
            })
        });
        */
    }

    $done({});
}).catch(err => {
    $notify("GR 页面监控失败", "", err);
    $done({});
});
