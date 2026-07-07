// Make sure your messages.js POST section handles data like this:
const body = JSON.parse(event.body);
const { channelId, uid, username, photoUrl, text } = body;

await turso.execute({
  sql: "INSERT INTO messages (id, channel_id, uid, username, photo_url, text) VALUES (?, ?, ?, ?, ?, ?)",
  args: [
    crypto.randomUUID(), 
    channelId || "global", 
    uid || "anonymous", 
    username || "User", 
    photoUrl || "", 
    text || ""
  ]
});
