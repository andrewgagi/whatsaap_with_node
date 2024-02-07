/*
 * Starter Project for WhatsApp Echo Bot Tutorial
 *
 * Remix this as the starting point for following the WhatsApp Echo Bot tutorial
 *
 */

"use strict";
require("dotenv").config();
// Access token for your app
// (copy token from DevX getting started page
// and save it as environment variable into the .env file)
const token = process.env.WHATSAPP_TOKEN;
const fs = require("fs");
const cors = require("cors");
const mongoose = require("mongoose");
const routes = require("./src/routes/record");
const filePath = "./newFile.txt";

// Imports dependencies and set up http server
const request = require("request"),
  express = require("express"),
  body_parser = require("body-parser"),
  axios = require("axios").default,
  app = express().use(body_parser.json()); // creates express http server
app.use(cors());

// Middleware

app.use(cors());

// Routes
app.use("/api/v1", routes);

// Error handler
const start = async () => {
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO URI not found");
  }
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log(`Connected to MongoDb ===> ${process.env.MONGO_URI}`);
  } catch (err) {
    console.error(err);
  }
  app.listen(process.env.PORT || 1337, () => {
    console.log(`Listening on port ${process.env.PORT}`);
  });
};

start();
// Accepts POST requests at /webhook endpoint
// Accepts POST requests at /webhook endpoint
app.post("/webhook", (req, res) => {
  // Parse the request body from the POST
  let body = req.body;
  console.log(req.hostname, req.protocol, "jjj");
  // Check the Incoming webhook message
  console.log(JSON.stringify(req.body, null, 2));

  // info on WhatsApp text message payload: https://developers.facebook.com/docs/whatsapp/cloud-api/webhooks/payload-examples#text-messages
  if (req.body.object) {
    if (
      req.body.entry &&
      req.body.entry[0].changes &&
      req.body.entry[0].changes[0] &&
      req.body.entry[0].changes[0].value.messages &&
      req.body.entry[0].changes[0].value.messages[0]
    ) {
      let phone_number_id =
        req.body.entry[0].changes[0].value.metadata.phone_number_id;
      let from = req.body.entry[0].changes[0].value.messages[0].from; // extract the phone number from the webhook payload
      let msg_body = req.body.entry[0].changes[0].value.messages[0].text.body; // extract the message text from the webhook payload

      axios({
        method: "POST", // Required, HTTP method, a string, e.g. POST, GET
        url:
          "https://graph.facebook.com/v12.0/" +
          phone_number_id +
          "/messages?access_token=" +
          token,
        data: {
          messaging_product: "whatsapp",
          to: from,
          text:
            !msg_body.toLowerCase().includes("1") &&
            !msg_body.toLowerCase().includes("2") &&
            !msg_body.toLowerCase().includes("3")
              ? {
                  body: "👋 Welcome! Reply with:\n1. Order 🛒 Here\n2. Track 🚚 Here\n3. Order 📜 History",
                }
              : msg_body.toLowerCase().includes("1")
              ? { body: "🛒 Order here: www.http.gagi.com" }
              : msg_body.toLowerCase().includes("2")
              ? { body: "🚚 Track your order here" }
              : msg_body.toLowerCase().includes("3")
              ? { body: "📜 View your order history" }
              : { body: msg_body },
        },

        headers: { "Content-Type": "application/json" },
      });
    }
    axios({
      method: "POST",
      url: "https://whatsaap-gtqe.onrender.com/api/v1/save",
      data: {
        name:
          req.body &&
          req.body.entry &&
          req.body.entry[0] &&
          req.body.entry[0].changes &&
          req.body.entry[0].changes[0] &&
          req.body.entry[0].changes[0].value &&
          req.body.entry[0].changes[0].value.contacts &&
          req.body.entry[0].changes[0].value.contacts[0] &&
          req.body.entry[0].changes[0].value.contacts[0].profile &&
          req.body.entry[0].changes[0].value.contacts[0].profile.name
            ? req.body.entry[0].changes[0].value.contacts[0].profile.name.toString()
            : "",
        phone_number:
          req.body &&
          req.body.entry &&
          req.body.entry[0] &&
          req.body.entry[0].changes &&
          req.body.entry[0].changes[0] &&
          req.body.entry[0].changes[0].value &&
          req.body.entry[0].changes[0].value.contacts &&
          req.body.entry[0].changes[0].value.contacts[0] &&
          req.body.entry[0].changes[0].value.contacts[0].wa_id
            ? req.body.entry[0].changes[0].value.contacts[0].wa_id.toString()
            : "",
        text:
          req.body &&
          req.body.entry &&
          req.body.entry[0] &&
          req.body.entry[0].changes &&
          req.body.entry[0].changes[0] &&
          req.body.entry[0].changes[0].value &&
          req.body.entry[0].changes[0].value.messages &&
          req.body.entry[0].changes[0].value.messages[0] &&
          req.body.entry[0].changes[0].value.messages[0].text &&
          req.body.entry[0].changes[0].value.messages[0].text.body
            ? req.body.entry[0].changes[0].value.messages[0].text.body.toString()
            : "",
        time:
          req.body &&
          req.body.entry &&
          req.body.entry[0] &&
          req.body.entry[0].changes &&
          req.body.entry[0].changes[0] &&
          req.body.entry[0].changes[0].value &&
          req.body.entry[0].changes[0].value.messages &&
          req.body.entry[0].changes[0].value.messages[0] &&
          req.body.entry[0].changes[0].value.messages[0].timestamp
            ? req.body.entry[0].changes[0].value.messages[0].timestamp.toString()
            : "",
      },
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => {
        console.log("Record saved successfully:", response.data);
      })
      .catch((error) => {
        console.error("Error saving record:", error);
      });
    res.sendStatus(200);
  } else {
    // Return a '404 Not Found' if event is not from a WhatsApp API
    res.sendStatus(404);
  }
});

// Accepts GET requests at the /webhook endpoint. You need this URL to setup webhook initially.
// info on verification request payload: https://developers.facebook.com/docs/graph-api/webhooks/getting-started#verification-requests
app.get("/webhook", (req, res) => {
  /**
   * UPDATE YOUR VERIFY TOKEN
   *This will be the Verify Token value when you set up webhook
   **/
  const verify_token = process.env.VERIFY_TOKEN;

  // Parse params from the webhook verification request
  let mode = req.query["hub.mode"];
  let token = req.query["hub.verify_token"];
  let challenge = req.query["hub.challenge"];

  // Check if a token and mode were sent
  if (mode && token) {
    // Check the mode and token sent are correct
    if (mode === "subscribe" && token === verify_token) {
      // Respond with 200 OK and challenge token from the request
      console.log("WEBHOOK_VERIFIED");
      res.status(200).send(challenge);
    } else {
      // Responds with '403 Forbidden' if verify tokens do not match
      res.sendStatus(403);
    }
  }
});
