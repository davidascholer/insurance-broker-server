// Create a basic Express server
import express from "express";
import cors from "cors";
import quotesRouter from "./routes/quotesRouter";
import analyticsRouter from "./routes/analyticsRouter";
import botRouter from "./routes/botRouter";
import emailRouter from "./routes/emailRouter";
import loggerRouter from "./routes/loggerRouter";
import authRouter from "./routes/authRouter";

const app = express();
const PORT = process.env.PORT || 3000;

var whitelist = [
  "http://localhost:5173",
  "https://www.pipabroker.com",
  "https://www.dev.pipabroker.com",
];
var corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true, // Allow cookies and authentication headers
};
app.use(cors(corsOptions));
app.use(express.json());

// Routes
app.use("/api/v1/quotes", quotesRouter);
app.use("/api/v1/analytics", analyticsRouter);
app.use("/api/v1/bot", botRouter);
app.use("/api/v1/email", emailRouter);
app.use("/api/v1/logger", loggerRouter);
app.use("/api/v1/auth", authRouter);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
