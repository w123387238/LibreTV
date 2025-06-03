export async function onRequestGet({ env }) {
    try {
      // console.log('Request received');
      // // 获取所有消息
      // const keys = await env.MAIL_QUEUE.list();
      // const messages = [];
      
      // // 批量获取消息内容
      // for (const key of keys.keys) {
      //   const value = await env.MAIL_QUEUE.get(key.name);
      //   if (value) {
      //     messages.push(JSON.parse(value));
      //   }
      //   await env.MAIL_QUEUE.delete(key.name);
      // }
      
      // if (messages.length === 0) {
      //   return new Response('No messages to process', { status: 200 });
      // }
      
      // // 按邮箱分组
      // const grouped = messages.reduce((acc, { email, message }) => {
      //   if (!acc[email]) acc[email] = [];
      //   acc[email].push(message);
      //   return acc;
      // }, {});
      
      // // 发送邮件
      // for (const [email, messageList] of Object.entries(grouped)) {
      //   await sendAggregatedEmail(email, messageList, env);
      // }
      return new Response(`messages`, { status: 200 });
      // return new Response(`Processed ${messages.length} messages`, { status: 200 });
    } catch (error) {
      return new Response(`Error: ${error.message}`, { status: 500 });
    }
  }
  
  async function sendAggregatedEmail(to, messages, env) {
    const sendgridUrl = 'https://api.sendgrid.com/v3/mail/send';
    
    const emailContent = `
      <h1>您有 ${messages.length} 条新消息</h1>
      <ul>
        ${messages.map(msg => `<li>${msg}</li>`).join('')}
      </ul>
    `;
    
    const response = await fetch(sendgridUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${env.SENDGRID_API_KEY}`
      },
      body: JSON.stringify({
        personalizations: [{ to: [{ email: to }] }],
        from: { email: 'noreply@example.com' },
        subject: `聚合消息 (${messages.length}条)`,
        content: [{ type: 'text/html', value: emailContent }]
      })
    });
    
    if (!response.ok) throw new Error(await response.text());
  }