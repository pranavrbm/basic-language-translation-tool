// server.js
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY; // Replace with your actual key
app.post("/api/translate", async (req, res) => {
	const { text, source, target } = req.body;

	const url = `https://translation.googleapis.com/language/translate/v2?key=${GOOGLE_API_KEY}`;
	const body = {
		q: text,
		target,
		format: "text",
	};

	if (source !== "auto") body.source = source;

	try {
		const response = await fetch(url, {
			method: "POST",
			body: JSON.stringify(body),
			headers: { "Content-Type": "application/json" },
		});

		const data = await response.json();
		console.log("Translation response:", data); // 👈 THIS IS IMPORTANT
		if (data.error) return res.status(400).json({ error: data.error });

		res.json({ translatedText: data.data.translations[0].translatedText });
	} catch (err) {
		console.error("Translation error:", err); // 👈 THIS IS IMPORTANT
		res.status(500).json({
			error: "Translation failed",
			details: err.message,
		});
	}
});

const path = require("path");
const fs = require("fs");

// Serve static files from the frontend folder
app.use(express.static(path.join(__dirname, "../frontend")));

// Fallback: serve index.html for any unknown routes (for SPA)
app.get("*", (req, res) => {
	res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

app.listen(PORT, () => {
	console.log(`Server running at http://localhost:${PORT}`);
});
