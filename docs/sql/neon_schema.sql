-- DealDost Neon/PostgreSQL schema
-- Run with a Postgres user that can create extensions/tables.

CREATE EXTENSION IF NOT EXISTS postgis;

CREATE TABLE IF NOT EXISTS locations (
    id UUID PRIMARY KEY,
    mongo_post_id TEXT NOT NULL,
    city TEXT NOT NULL,
    area TEXT NOT NULL,
    lat DOUBLE PRECISION NOT NULL,
    lng DOUBLE PRECISION NOT NULL,
    post_type TEXT NOT NULL,
    dish_name TEXT,
    platform TEXT,
    upvotes INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    geom GEOGRAPHY(POINT, 4326) GENERATED ALWAYS AS (
        ST_SetSRID(ST_MakePoint(lng, lat), 4326)::geography
    ) STORED
);

CREATE INDEX IF NOT EXISTS idx_locations_city_area ON locations (city, area);
CREATE INDEX IF NOT EXISTS idx_locations_post_type ON locations (post_type);
CREATE INDEX IF NOT EXISTS idx_locations_created_at ON locations (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_locations_geom ON locations USING GIST (geom);

CREATE TABLE IF NOT EXISTS search_index (
    id UUID PRIMARY KEY,
    mongo_post_id TEXT NOT NULL,
    title TEXT NOT NULL,
    body TEXT NOT NULL DEFAULT '',
    tags TEXT[] NOT NULL DEFAULT '{}',
    city TEXT,
    post_type TEXT NOT NULL,
    platform TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    search_vector TSVECTOR GENERATED ALWAYS AS (
        to_tsvector('simple', coalesce(title, '') || ' ' || coalesce(body, '') || ' ' || array_to_string(tags, ' '))
    ) STORED
);

CREATE INDEX IF NOT EXISTS idx_search_vector ON search_index USING GIN (search_vector);
CREATE INDEX IF NOT EXISTS idx_search_city_type ON search_index (city, post_type, created_at DESC);

CREATE TABLE IF NOT EXISTS analytics (
    id UUID PRIMARY KEY,
    city TEXT NOT NULL,
    area TEXT NOT NULL,
    post_type TEXT NOT NULL,
    platform TEXT,
    dish_name TEXT,
    total_posts INTEGER NOT NULL DEFAULT 0,
    total_upvotes INTEGER NOT NULL DEFAULT 0,
    date DATE NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_analytics_daily
    ON analytics (city, area, post_type, coalesce(platform, ''), coalesce(dish_name, ''), date);

-- Example nearby query:
-- SELECT *
-- FROM locations
-- WHERE city = 'Delhi'
--   AND ST_DWithin(
--       geom,
--       ST_SetSRID(ST_MakePoint(77.2090, 28.6139), 4326)::geography,
--       5000
--   )
-- ORDER BY created_at DESC;
