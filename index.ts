import * as dotenv from "dotenv";
if (process.env.NODE_ENV === undefined || process.env.NODE_ENV !== "production") {
  /* Read environment variables from a .env file in the root folder for local development */
  dotenv.config({path: __dirname + '/.env'});
}
import * as express from "express";
import * as cors from "cors";
import * as helmet from "helmet";
import * as compression from "compression";
import * as path from "path";
import { Pool } from 'pg';
const app = express();

/* Heroku free postgres allows up to 20 concurrent connections */
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20,
  ssl: { rejectUnauthorized: false }
});

pool.on('error', async (error: any, client: any) => {
  if (process.env.NODE_ENV === undefined || process.env.NODE_ENV !== "production") {
    console.error(`Database pool error: ${error}`);
  }
});

/* Middleware */
app.use(cors());
app.use(helmet())
app.use(helmet.hidePoweredBy());
app.use(compression());
app.use(express.urlencoded({ extended: false }));

/* Routes */
//require("./routes/test")(app, pool);
// require("./routes/query-staging")(app, pool);
// require("./routes/last-update")(app, pool);
// require("./routes/admin")(app, pool);

/* Check for database connectivity and provide a human-friendly message on failure */
// pool.query(`select last_update from production_meta`, (err, res) => {
// if (err) {
//     console.error('Error connnecting to the database!');
//     if (keys.DATABASE_URL === undefined || keys.DATABASE_URL === null || keys.DATABASE_URL === '') {
//     console.error('Please check that the DATABASE_URL environment variable is correct. See comments in nodeKeys.js for further information.');
//     }
// }
// });

/* Default handler for requests not handled by one of the above routes */
if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

/* Listen for and handle incoming requests */
const PORT = process.env.PORT || 5000;
app.listen(PORT);