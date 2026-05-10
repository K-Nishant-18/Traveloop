-- ============================================================
-- V1__Initial_Schema.sql
-- Traveloop Initial Database Schema
-- Managed by Flyway - DO NOT edit manually after first run
-- ============================================================

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id            BIGINT AUTO_INCREMENT PRIMARY KEY,
    name          VARCHAR(100)  NOT NULL,
    email         VARCHAR(100)  NOT NULL UNIQUE,
    password      VARCHAR(255)  NOT NULL,
    location      VARCHAR(100),
    created_at    TIMESTAMP     DEFAULT CURRENT_TIMESTAMP
);

-- Trips table
CREATE TABLE IF NOT EXISTS trips (
    id            BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id       BIGINT        NOT NULL,
    name          VARCHAR(255)  NOT NULL,
    description   TEXT,
    start_date    DATE          NOT NULL,
    end_date      DATE          NOT NULL,
    cover_image   VARCHAR(500),
    status        VARCHAR(50)   DEFAULT 'UPCOMING',
    is_public     BOOLEAN       DEFAULT FALSE,
    created_at    TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_trip_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Stops table (city segments of a trip)
CREATE TABLE IF NOT EXISTS stops (
    id                BIGINT AUTO_INCREMENT PRIMARY KEY,
    trip_id           BIGINT        NOT NULL,
    city_name         VARCHAR(255)  NOT NULL,
    start_date        DATE          NOT NULL,
    end_date          DATE          NOT NULL,
    budget_allocated  DOUBLE,
    order_index       INT           DEFAULT 0,
    CONSTRAINT fk_stop_trip FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE CASCADE
);

-- Activities table (events within a stop)
CREATE TABLE IF NOT EXISTS activities (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    stop_id         BIGINT        NOT NULL,
    title           VARCHAR(255)  NOT NULL,
    type            VARCHAR(50),
    cost            DOUBLE,
    start_time      TIME,
    duration_hours  DOUBLE,
    CONSTRAINT fk_activity_stop FOREIGN KEY (stop_id) REFERENCES stops(id) ON DELETE CASCADE
);

-- Checklist items table
CREATE TABLE IF NOT EXISTS checklist_items (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    trip_id     BIGINT        NOT NULL,
    category    VARCHAR(100),
    item_name   VARCHAR(255)  NOT NULL,
    is_packed   BOOLEAN       DEFAULT FALSE,
    CONSTRAINT fk_checklist_trip FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE CASCADE
);

-- Notes table (trip-level or stop-level)
CREATE TABLE IF NOT EXISTS notes (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    trip_id     BIGINT   NOT NULL,
    stop_id     BIGINT,
    content     TEXT     NOT NULL,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_note_trip FOREIGN KEY (trip_id)  REFERENCES trips(id) ON DELETE CASCADE,
    CONSTRAINT fk_note_stop FOREIGN KEY (stop_id)  REFERENCES stops(id) ON DELETE SET NULL
);

-- ============================================================
-- Seed Data — Demo user for local testing
-- Password is "password" encoded with BCrypt
-- ============================================================
MERGE INTO users (id, name, email, password, location) KEY(email) VALUES (
    1,
    'Demo Traveler',
    'demo@traveloop.com',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LnJ8o/b6c3C',
    'New York, USA'
);
