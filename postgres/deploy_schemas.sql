-- DEPLOY FRESH DATABASE TABLES
-- ORDER MATTERS
\i '/docker-entrypoint-initdb.d/tables/users.sql'
\i '/docker-entrypoint-initdb.d/tables/login.sql'