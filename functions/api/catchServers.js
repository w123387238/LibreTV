export async function onRequestPost({ request, env }) {
    try {
      const data = await request.json();
      
      // 验证字段
      if (!data.data || !data.data.services) {
        return new Response('Missing required fields: email and message', { status: 400 ,headers: { 'Content-Type': 'application/json' }});
      }
      const requiredServices = ["hl-notify","hl-nshop","hl-batch","hl-sfac","hl-task","hl-ssp","hl-channel","hl-account","hl-gate","hl-web","hl-trans"];
      const missingServices = requiredServices.filter(service => !data.data.services.includes(service));

      if (data.data.services.length !== 11 || missingServices.length > 0) {
        return new Response(`Missing required services: ${missingServices.join(', ')}`, { status: 400 ,headers: { 'Content-Type': 'application/json' }});
      }
      // return new Response(JSON.stringify({ status: data.email}), {
      //   headers: { 'Content-Type': 'application/json' }
      // });
      // 存储到KV
      // const id = Date.now() + '-' + Math.random().toString(36).substr(2, 9);
      // await env.MAIL_QUEUE.put(id, JSON.stringify({
      //   email: data.email,
      //   message: data.message,
      //   timestamp: Date.now()
      // }), { expirationTtl: 3600 }); // 1小时过期
      
      return new Response(JSON.stringify({ status: 'queued', id }), {
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