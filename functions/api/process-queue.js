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
      // https://oapi.dingtalk.com/robot/send?access_token=8a0d823ff4225a46dc374f01520ac6f71bc94ced5fea0dc2ca21f4c96a8db32a
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
      const isExpired = await env.MAIL_QUEUE.get("recentTime") === null;
      if (isExpired) {
        const rsp = await sendAggregatedEmail(`服务器无活动`);
        if(rsp){
          return rsp;
        }
      }

      return new Response(`messages`, { status: 200 });
      // return new Response(`Processed ${messages.length} messages`, { status: 200 });
    } catch (error) {
      return new Response(`Error: ${error.message}`, { status: 500 });
    }
  }
  
  async function sendAggregatedEmail(messages) {
    const sendgridUrl = 'https://oapi.dingtalk.com/robot/send?access_token=8a0d823ff4225a46dc374f01520ac6f71bc94ced5fea0dc2ca21f4c96a8db32a';
    
    
    const response = await fetch(sendgridUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${env.SENDGRID_API_KEY}`
      },
      body: JSON.stringify({
        msgtype: "text",
        text: {
          content: messages
        }
      })
    });
    
  }