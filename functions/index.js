/**
 * Clerk -> Firestore user sync.
 * Clerk sends Svix-signed webhooks (user.created / updated / deleted) to this
 * HTTPS function. We verify the signature, then upsert/delete users/{clerkId}.
 *
 * Deploy:  firebase deploy --only functions:clerkWebhook
 * Secret:  firebase functions:secrets:set CLERK_WEBHOOK_SECRET   (paste whsec_...)
 */
import { onRequest } from "firebase-functions/v2/https";
import { defineSecret } from "firebase-functions/params";
import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { Webhook } from "svix";

initializeApp();
const db = getFirestore();
const CLERK_WEBHOOK_SECRET = defineSecret("CLERK_WEBHOOK_SECRET");

export const clerkWebhook = onRequest(
  { secrets: [CLERK_WEBHOOK_SECRET], cors: false },
  async (req, res) => {
    if (req.method !== "POST") {
      res.status(405).send("Method not allowed");
      return;
    }

    // Svix needs the RAW body + these headers to verify the signature.
    const payload = req.rawBody.toString("utf8");
    const headers = {
      "svix-id": req.get("svix-id"),
      "svix-timestamp": req.get("svix-timestamp"),
      "svix-signature": req.get("svix-signature"),
    };

    let evt;
    try {
      const wh = new Webhook(CLERK_WEBHOOK_SECRET.value());
      evt = wh.verify(payload, headers); // throws if invalid
    } catch (err) {
      console.error("Invalid webhook signature:", err.message);
      res.status(400).send("Invalid signature");
      return;
    }

    const { type, data } = evt;

    try {
      if (type === "user.created" || type === "user.updated") {
        const primaryId = data.primary_email_address_id;
        const primary = (data.email_addresses || []).find((e) => e.id === primaryId);
        await db.collection("users").doc(data.id).set(
          {
            clerkId: data.id,
            email: primary?.email_address || null,
            firstName: data.first_name || null,
            lastName: data.last_name || null,
            imageUrl: data.image_url || null,
            updatedAt: new Date().toISOString(),
          },
          { merge: true }
        );
      } else if (type === "user.deleted") {
        await db.collection("users").doc(data.id).delete();
      }
    } catch (err) {
      console.error("Firestore write failed:", err);
      res.status(500).send("Write failed");
      return;
    }

    res.status(200).send("ok"); // 2xx tells Svix delivery succeeded
  }
);
