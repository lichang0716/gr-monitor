const URL = "https://newsite.ricn-mall.com/goods_cate?cid=9";
const BOT_TOKEN = "8236756611:AAESk1FakbQ_IKaHJi1svR58xiqf56Bcp6I";  // 你的 Token
const CHAT_ID = "7911131097"; // 你的 chat_id

// Telegram 推送函数
async function sendTG(text) {
  const api = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
  return $task.fetch({
    url: api,
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: CHAT_ID,
      text: text
    })
  });
}

async function checkGR() {
  try {
    const res = await $task.fetch({ url: URL });
    const body = res.body || "";

    // 匹配 GR III / GRIII / IIIx
    const found =
      body.includes("GR III") ||
      body.includes("GRIII") ||
      body.includes("GR IIIx") ||
      body.includes("GRIIIx");

    if (found) {
      const msg = `⚠️ 理光 GR III / IIIx 上架啦！\n${URL}`;
      $notify("GR 监控", "", "发现 GR III / IIIx！");
      await sendTG(msg);
    } else {
      const msg = "⛔ 心跳正常：过去 5 分钟未发现 GR III / IIIx。";
      $notify("GR 监控", "", msg);
      await sendTG(msg);
    }
  } catch (e) {
    await sendTG("❌ 监控失败：" + e.message);
  }

  $done();
}

checkGR();
