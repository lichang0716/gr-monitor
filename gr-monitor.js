const URL = 'https://newsite.ricn-mall.com/goods_cate?cid=9';
const BOT_TOKEN = '8236756611:AAESk1FakbQ_IKaHJi1svR58xiqf56Bcp6I'; // 你的 Token
const CHAT_ID = '7911131097'; // 你的 chat_id

// Telegram 推送函数
async function sendTG(text) {
  const api = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
  return $task.fetch({
    url: api,
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: CHAT_ID,
      text: text,
    }),
  });
}

async function checkGR() {
  try {
    const res = await $task.fetch({ url: URL });
    const body = res.body || '';

    // 匹配 GR III / GRIII / IIIx
    // 判断关键词是否出现
    const foundIII = body.includes('III');
    const foundIIIX =
      body.includes('IIIx') ||
      body.includes('III X') ||
      body.includes('GR IIIx');

    let msg = '';

    if (foundIII || foundIIIX) {
      msg = '🚨 Ricoh GR 发现库存！';

      if (foundIII) msg += '\n- GR III 出现';
      if (foundIIIX) msg += '\n- GR IIIx 出现';

      // QuantumultX 通知
      $notify('🎉 GR 商品监控', '页面检测到目标型号', msg);

      await sendTG(msg);
    } else {
      // 页面未出现目标型号，发送“心跳通知”，确认定时任务正常
      msg = 'ℹ️ GR 页面监控正常运行，但未检测到 III 或 IIIx';
      $notify('GR 监控心跳', '定时任务正常', msg);
      await sendTG(msg);
    }
  } catch (e) {
    const errText = e && typeof e === 'object'
    ? JSON.stringify(e, Object.getOwnPropertyNames(e), 2)
    : String(e);
    $notify('❌ GR 监控失败', '页面检测', errText);
    await sendTG('❌ 监控失败：\n' + errText);
  }

  $done();
}

checkGR();
