import * as Express from "express";
import { Pool, QueryResult } from "pg";

module.exports = (app: Express.Application, pool: Pool) => {

  app.get("/api/status", (request: Express.Request, response: Express.Response, next: Express.NextFunction) => {
    try {

      /* Pull the listing table and parse into JSON */
      pool.query<any, any[]>("SELECT * FROM listing", (sqlError: Error, sqlResponse: QueryResult<any>) => {
        if (sqlError) {
          if (process.env.NODE_ENV == undefined || process.env.NODE_ENV !== "production") {
            try {
              response.send(sqlError);
            } catch (e: any) {
              console.error(e);
              response.sendStatus(500);
            }
          }
          return;
        }

        /* Return JSON to the client */
        response.json(sqlResponse.rows);

      });
    } catch (e: any) {
      return next(e);
    }
  });

};