import * as Dotenv from 'dotenv';
if (process.env.NODE_ENV === undefined || process.env.NODE_ENV !== 'production') {
  /* Read environment variables from a .env file in the root folder for local development */
  Dotenv.config({path: __dirname + '/.env'});
}
import * as Express from 'express';
import * as Cors from 'cors';
import * as Compression from 'compression';
import * as Path from 'path';
import { Pool } from 'pg';
const app = Express();

/* Heroku free postgres allows up to 20 concurrent connections */
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20,
  ssl: { rejectUnauthorized: false }
});

pool.on('error', (e: Error) => {
  if (process.env.NODE_ENV === undefined || process.env.NODE_ENV !== 'production') {
    console.error(`Database pool error: ${e}`);
  }
});

/* Middleware */
app.use(Cors());
app.use(Compression());
app.use(Express.urlencoded({ extended: false }));

/* Headers */
app.use(function (req, res, next) {
  res.setHeader(
    'Content-Security-Policy-Report-Only',
    "default-src 'self'; font-src 'self'; img-src 'self'; script-src 'self'; style-src 'self'; frame-src 'self'"
  );
  res.setHeader(
    'Access-Control-Allow-Origin',
    '*'
  )
  next();
});

/* Routes */
require("./routes/status")(app, pool);
require("./routes/geojson")(app, pool);

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
  app.use(Express.static("client/build"));
  app.get("/", (request: Express.Request, response: Express.Response) => {
    response.sendFile(Path.resolve(__dirname, "client", "build", "index.html"));
  });
}

/* Listen for and handle incoming requests */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.info(`Server running on PORT ${PORT}`);
});