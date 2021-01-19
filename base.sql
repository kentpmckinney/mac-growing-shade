CREATE EXTENSION postgis;

/* Get the maximum value for the given column in the given table */
DROP FUNCTION IF EXISTS get_max_value;
CREATE FUNCTION get_max_value(IN table_name regclass, IN column_name varchar(100), OUT result integer) AS $$
  BEGIN
    EXECUTE format('SELECT CAST(MAX("%s") AS integer) FROM %s', column_name, table_name)
    INTO result;
  END
$$ LANGUAGE plpgsql;

/* Get the minimum value for the given column in the given table */
DROP FUNCTION IF EXISTS get_min_value;
CREATE FUNCTION get_min_value(IN table_name regclass, IN column_name varchar(100), OUT result integer) AS $$
  BEGIN
    EXECUTE format('SELECT CAST(MIN("%s") AS integer) FROM %s', column_name, table_name)
    INTO result;
  END
$$ LANGUAGE plpgsql;

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

DROP FUNCTION IF EXISTS etl_import_block_layer;
CREATE FUNCTION etl_import_block_layer(out void) AS $$
  CREATE TABLE production_block_group_layer AS
SELECT * FROM get_geojson_layer('block_groups_2010_test')
$$ LANGUAGE sql;