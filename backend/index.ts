"use strict";

require('dotenv').config();
import * as Express from 'express';
import * as Cors from 'cors';
import * as Compression from 'compression';
import * as Path from 'path';
import { Pool } from 'pg';
const app = Express();

/* Determine whether the Node.js environment is development or production */
const isProdEnvironment = 
  process.env.NODE_ENV !== undefined && process.env.NODE_ENV === "production";

/* Heroku free postgres allows up to 20 concurrent connections */
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20,
  ssl: { rejectUnauthorized: false }
});

pool.on('error', (e: Error) => {
  if (isProdEnvironment) console.error(`Database pool error: ${e}`);
});

/* Headers */
app.use(function (req, res, next) {
  res.setHeader(
    'Content-Security-Policy',
    `default-src * 'unsafe-inline'; style-src 'self' 'unsafe-inline';\
     img-src 'self' data: blob: 'unsafe-inline'; child-src blob: ;\
     worker-src 'self' blob: ;\
     script-src 'self' https://www.youtube.com blob: 'unsafe-inline' 'unsafe-eval' `
  );
  const expireAfterMinutes = 60;
  const cacheControlHeaderValue = isProdEnvironment
    ? `public, max-age=${expireAfterMinutes/2 * 60}, 
       stale-while-revalidate=${expireAfterMinutes/2 * 6}`
    : `no-cache`
  res.header('Cache-Control', cacheControlHeaderValue);
  next();
});

/* Middleware */
app.use(Compression({ filter: shouldCompress }))
function shouldCompress (req, res) {
  if (req.headers['x-no-compression']) return false;
  return Compression.filter(req, res);
}
app.use(Cors());
app.use(Express.urlencoded({ extended: false }));

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
    response.sendFile(Path.resolve(__dirname, "frontend", "dist", "index.html"));
  });
}

/* Listen for and handle incoming requests */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.info(`Server running on PORT ${PORT}`);
});