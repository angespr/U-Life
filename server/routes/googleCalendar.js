const express = require("express");
const { google } = require("googleapis");
const GoogleCalendarToken = require("../models/GoogleCalendarToken");

const router = express.Router();

const SCOPES = [
  "https://www.googleapis.com/auth/calendar.readonly",
  "https://www.googleapis.com/auth/calendar.events",
];

function getOAuthClient() {
  return new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );
}

router.get("/auth-url", (req, res) => {
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ message: "Missing userId" });
  }

  const oauth2Client = getOAuthClient();

  const url = oauth2Client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: SCOPES,
    state: userId,
  });

  res.json({ url });
});

router.get("/callback", async (req, res) => {
  try {
    const { code, state } = req.query;

    if (!code || !state) {
      return res.status(400).send("Missing authorization code or user state.");
    }

    const userId = state;
    const oauth2Client = getOAuthClient();

    const { tokens } = await oauth2Client.getToken(code);

    const existingToken = await GoogleCalendarToken.findOne({ userId });

    await GoogleCalendarToken.findOneAndUpdate(
      { userId },
      {
        userId,
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token || existingToken?.refreshToken,
        expiryDate: tokens.expiry_date,
      },
      { upsert: true, new: true }
    );

    res.redirect(`${process.env.FRONTEND_URL}/#/productivity?calendar=connected`);
  } catch (error) {
    console.error("Google Calendar callback error:", error);
    res.status(500).send("Failed to connect Google Calendar.");
  }
});

router.get("/status", async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ message: "Missing userId" });
    }

    const token = await GoogleCalendarToken.findOne({ userId });

    res.json({ connected: Boolean(token) });
  } catch (error) {
    console.error("Google Calendar status error:", error);
    res.status(500).json({ message: "Failed to check calendar status." });
  }
});

router.get("/events", async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ message: "Missing userId" });
    }

    const savedToken = await GoogleCalendarToken.findOne({ userId });

    if (!savedToken) {
      return res.status(401).json({ message: "Google Calendar is not connected." });
    }

    const oauth2Client = getOAuthClient();

    oauth2Client.setCredentials({
      access_token: savedToken.accessToken,
      refresh_token: savedToken.refreshToken,
      expiry_date: savedToken.expiryDate,
    });

    oauth2Client.on("tokens", async (tokens) => {
      const update = {};

      if (tokens.access_token) update.accessToken = tokens.access_token;
      if (tokens.refresh_token) update.refreshToken = tokens.refresh_token;
      if (tokens.expiry_date) update.expiryDate = tokens.expiry_date;

      if (Object.keys(update).length > 0) {
        await GoogleCalendarToken.findOneAndUpdate({ userId }, update);
      }
    });

    const calendar = google.calendar({
      version: "v3",
      auth: oauth2Client,
    });

    const response = await calendar.events.list({
      calendarId: "primary",
      timeMin: new Date().toISOString(),
      maxResults: 10,
      singleEvents: true,
      orderBy: "startTime",
    });

    res.json(response.data.items || []);
  } catch (error) {
    console.error("Google Calendar events error:", error);
    res.status(500).json({ message: "Failed to load calendar events." });
  }
});

router.post("/events", async (req, res) => {
  try {
    const { userId, title, description, startDateTime, endDateTime } = req.body;

    if (!userId || !title || !startDateTime || !endDateTime) {
      return res.status(400).json({
        message: "Missing userId, title, startDateTime, or endDateTime.",
      });
    }

    const savedToken = await GoogleCalendarToken.findOne({ userId });

    if (!savedToken) {
      return res.status(401).json({ message: "Google Calendar is not connected." });
    }

    const oauth2Client = getOAuthClient();

    oauth2Client.setCredentials({
      access_token: savedToken.accessToken,
      refresh_token: savedToken.refreshToken,
      expiry_date: savedToken.expiryDate,
    });

    const calendar = google.calendar({
      version: "v3",
      auth: oauth2Client,
    });

    const event = await calendar.events.insert({
      calendarId: "primary",
      requestBody: {
        summary: title,
        description: description || "",
        start: {
          dateTime: startDateTime,
          timeZone: "America/Los_Angeles",
        },
        end: {
          dateTime: endDateTime,
          timeZone: "America/Los_Angeles",
        },
      },
    });

    res.status(201).json(event.data);
  } catch (error) {
    console.error("Create Google Calendar event error:", error);
    res.status(500).json({ message: "Failed to create calendar event." });
  }
});

module.exports = router;