import { createClient } from "@libsql/client";

const turso = createClient({
  url: "libsql://whatscord-devmatryca.turso.io", // Verified from your Turso dashboard screenshot
  authToken: process.env.TURSO_AUTH_TOKEN, 
});

export const handler = async (event) => {
  // Handle CORS Pre-flight Options Request
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
      },
    };
  }

  const method = event.httpMethod;

  try {
    // -----------------------------------------------------------------
    // FETCH MESSAGES (GET)
    // -----------------------------------------------------------------
    if (method === "GET") {
      const channelId = event.queryStringParameters?.channelId || "global";
      const result = await turso.execute({
        sql: "SELECT * FROM messages WHERE channel_id = ? ORDER BY created_at ASC LIMIT 100",
        args: [channelId],
      });
      
      return {
        statusCode: 200,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
        body: JSON.stringify(result.rows),
      };
    }

    // -----------------------------------------------------------------
    // SEND MESSAGE OR PHOTO (POST)
    // -----------------------------------------------------------------
    if (method === "POST") {
      const body = JSON.parse(event.body || "{}");
      const { channelId, uid, username, photoUrl, text } = body;

      await turso.execute({
        sql: "INSERT INTO messages (id, channel_id, uid, username, photo_url, text, created_at, is_edited) VALUES (?, ?, ?, ?, ?, ?, datetime('now'), 0)",
        args: [
          crypto.randomUUID(),
          channelId || "global",
          uid || "anonymous",
          username || "User",
          photoUrl || "",
          text || ""
        ],
      });

      return {
        statusCode: 201,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
        body: JSON.stringify({ success: true }),
      };
    }

    // -----------------------------------------------------------------
    // EDIT MESSAGE (PUT)
    // -----------------------------------------------------------------
    if (method === "PUT") {
      const body = JSON.parse(event.body || "{}");
      const { id, text } = body;

      await turso.execute({
        sql: "UPDATE messages SET text = ?, is_edited = 1 WHERE id = ?",
        args: [text, id],
      });

      return {
        statusCode: 200,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
        body: JSON.stringify({ success: true }),
      };
    }

    // -----------------------------------------------------------------
    // DELETE MESSAGE (DELETE)
    // -----------------------------------------------------------------
    if (method === "DELETE") {
      const body = JSON.parse(event.body || "{}");
      const { id } = body;

      await turso.execute({
        sql: "DELETE FROM messages WHERE id = ?",
        args: [id],
      });

      return {
        statusCode: 200,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
        body: JSON.stringify({ success: true }),
      };
    }

    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method Not Allowed" }),
    };

  } catch (err) {
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ error: err.message }),
    };
  }
};

