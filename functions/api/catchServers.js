export async function onRequestPost({ request, env }) {
    try {
      const data = await request.json();
      
      // 验证字段
      if (!data.data || !data.data.services) {
        return new Response('Missing required fields: email and message', { status: 400 ,headers: { 'Content-Type': 'application/json' }});
      }
      const timestamp = Date.now();
      await env.MAIL_QUEUE.put("recentTime", JSON.stringify({
        timestamp
      }), { expirationTtl: 300 }); // 5分钟过期
      const requiredServices = ["hl-notify","hl-nshop","hl-batch","hl-sfac","hl-task","hl-ssp","hl-channel","hl-account","hl-gate","hl-web","hl-trans"];
      const missingServices = requiredServices.filter(service => !data.data.services.includes(service));
      if (data.data.services.length !== 11 || missingServices.length > 0) {
        let msg = `Missing required services: ${missingServices.join(', ')}`;
        sendAggregatedEmail(msg);
        return new Response(msg, { status: 200 ,headers: { 'Content-Type': 'application/json' }});
      }
      
      return new Response(JSON.stringify({ status: 'queued' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }

  async function sendAggregatedEmail(messages) {
    const sendgridUrl = 'https://oapi.dingtalk.com/robot/send?access_token=8a0d823ff4225a46dc374f01520ac6f71bc94ced5fea0dc2ca21f4c96a8db32a';
    
    const response = await fetch(sendgridUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        msgtype: "text",
        text: {
          content: messages
        }
      })
    });
    
  }