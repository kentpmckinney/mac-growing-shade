"use strict";

import * as Express from "express";
import { Pool, QueryResult } from "pg";

module.exports = (app: Express.Application, pool: Pool) => {

  app.get("/api/geojson", (request: Express.Request, response: Express.Response, next: Express.NextFunction) => {
    try {

      /* Get URL params */
      //const layer = request.query.layer || '';
      const fips = request.query.fips || '';

      if (fips.length === 12) {
        pool.query<any, any[]>("SELECT get_parcels_in_block($1)", [fips], (sqlError: Error, sqlResponse: QueryResult<any>) => {
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
          response.json(sqlResponse.rows[0].get_parcels_in_block);
        });
      }
      else {
        /* Pull the listing table and parse into JSON */
        //pool.query<any, any[]>("SELECT get_geojson_layer($1)", [layer], (sqlError: Error, sqlResponse: QueryResult<any>) => {
        pool.query<any, any[]>("SELECT * FROM production_block_group_layer", (sqlError: Error, sqlResponse: QueryResult<any>) => {
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
          response.json(sqlResponse.rows[0].result);
          //response.json(sqlResponse.rows[0].get_geojson_layer);

        });
      }
    } catch (e: any) {
      return next(e);
    }
  });

};