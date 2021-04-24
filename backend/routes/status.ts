"use strict";

import * as Express from "express";
import { Pool, PoolClient } from "pg";
import * as Config from '../../frontend//src/config/application.json';
import { Input } from '../../frontend/src/components/Map/InputOverlay/InputOverlay';

module.exports = (app: Express.Application, pool: Pool) => {

  /* Returns server status and also the min/max values for each of the sliders on the map in the client */
  app.get("/api/status", (request: Express.Request, response: Express.Response, next: Express.NextFunction) => {
    try {

      /* Use pool.connect here since the code below will make multiple queries */
      pool.connect(async (sqlError: Error, client: PoolClient) => {
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

        const getMinValue = async (table: string, column: string) => {
          const result = await client.query('SELECT get_min_value($1, $2)', [table, column]);
          return result.rows[0].get_min_value;
        }

        const getMaxValue = async (table: string, column: string) => {
          const result = await client.query('SELECT get_max_value($1, $2)', [table, column]);
          return result.rows[0].get_max_value;
        }

        /* Concatenate the sliders into an array and map to a new array with name and min/max values based on what's actually in the database */
        const inputs = await Promise.all(
          Config.inputSets
            .reduce((a: any, c: any) => [...a, ...c.inputs], []) /* Concatenate the sliders from all slider sets into a single array */
            .map(async (s: Partial<Input>) => {
              /* Map just the name, min, and max values and update the min and max values at the same time */
              return {
                name: s.name,
                min: (s.table !== '' && s.column !== '') ? await getMinValue(s.table, s.column) : s.min,
                max: (s.table !== '' && s.column !== '') ? await getMaxValue(s.table, s.column) : s.max
              }
            })
          ).catch(e => console.error(e))
        
        let responseJson = {
          status: 'OK',
          time: new Date(),
          inputMinMaxValues: inputs
        }
        response.json(responseJson);

        client.release();
      });
    } catch (e: any) {
      return next(e);
    }
  });

};