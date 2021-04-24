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

/* Returns the geojson of the parcels in a block with the given FIPS number */
DROP FUNCTION IF EXISTS get_parcels_in_block;
CREATE FUNCTION get_parcels_in_block(IN _fips VARCHAR(12), OUT result jsonb) AS $F$
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
					'geometry',   ST_AsGeoJSON(inputs.geometry, 6)::json,
					'properties', to_jsonb(inputs) - 'geometry'
				) AS feature
				FROM (
				SELECT DISTINCT p.*
				FROM "parcels_test" p
				INNER JOIN "block_groups_2010_test" b
				ON b."FIPS" = '%s' AND ST_Within(p.geometry, b.geometry)
					-- boolean ST_Within(geometry A, geometry B);
					-- Returns TRUE if geometry A is completely inside geometry B
				) AS inputs
			) features;
	   $Q$, _fips)
	INTO result;
  END
$F$ LANGUAGE plpgsql;