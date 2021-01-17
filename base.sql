CREATE EXTENSION postgis;

/* Combines the data from the import tables into a single staging table */
DROP FUNCTION IF EXISTS get_geojson;
CREATE FUNCTION get_geojson() RETURNS json AS $$
  SELECT
  jsonb_build_object (
    'type', 'FeatureCollection',
    'features', jsonb_agg(feature)
  )
  FROM (
    SELECT
      jsonb_build_object (
        'type',       'Feature',
        'geometry',   ST_AsGeoJSON(geometry, 6)::json,
        'properties', to_jsonb(inputs) - 'geometry'
    ) AS feature
    FROM (
      SELECT * FROM parcels_test
    ) inputs
  ) features;
$$ LANGUAGE sql;