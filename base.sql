CREATE EXTENSION postgis;

/* Returns the geojson from a table for which the name is given as an argument */
DROP FUNCTION IF EXISTS get_geojson_layer;
CREATE FUNCTION get_geojson_layer(IN layer regclass, OUT result jsonb) AS $F$
  BEGIN
	EXECUTE format($Q$
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
			SELECT * FROM %s
		  ) inputs
	  ) features;
	   $Q$, layer)
	INTO result;
  END
$F$ LANGUAGE plpgsql;