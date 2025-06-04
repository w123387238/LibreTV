export async function onRequestGet({ env }) {
    try {
        return new Response(JSON.stringify({ asd: 'ok'}), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
          });
    } catch (error) {
        return new Response(`Error: ${error.message}`, { status: 500 });
    }
}