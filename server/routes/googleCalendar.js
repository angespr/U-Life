const express = require("express");
const { google } = require("googleapis");
const GoogleCalendarToken = require("../models/GoogleCalendarToken");

const router = express.Router();

const SCOPES = [
  "https://www.googleapis.com/auth/calendar.readonly",
  "https://www.googleapis.com/auth/calendar.events",
];

function getOAuthClient() {
  const {
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    GOOGLE_REDIRECT_URI,
  } = process.env;

  if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET || !GOOGLE_REDIRECT_URI) {
    throw new Error("Missing Google OAuth environment variables.");
  }

  return new google.auth.OAuth2(
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    GOOGLE_REDIRECT_URI
  );
}

async function getAuthorizedClient(userId) {
  const savedToken = await GoogleCalendarToken.findOne({ userId });

  if (!savedToken) {
    const error = new Error("Google Calendar is not connected.");
    error.statusCode = 401;
    throw error;
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

  return oauth2Client;
}

router.get("/auth-url", (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ message: "Missing userId." });
    }

    const oauth2Client = getOAuthClient();

    const url = oauth2Client.generateAuthUrl({
      access_type: "offline",
      prompt: "consent",
      scope: SCOPES,
      state: userId,
      include_granted_scopes: true,
    });

    res.json({ url });
  } catch (error) {
    console.error("Google auth-url error:", error);
    res.status(500).json({ message: error.message });
  }
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
      return res.status(400).json({ message: "Missing userId." });
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
      return res.status(400).json({ message: "Missing userId." });
    }

    const oauth2Client = await getAuthorizedClient(userId);

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
    res.status(error.statusCode || 500).json({
      message: error.message || "Failed to load calendar events.",
    });
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

    const oauth2Client = await getAuthorizedClient(userId);

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
    res.status(error.statusCode || 500).json({
      message: error.message || "Failed to create calendar event.",
    });
  }
});

module.exports = router;