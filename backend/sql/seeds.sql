-- =================================================================
--  SCRIPT DE CRÉATION ET D'INSERTION POUR LA BDD EVENTIK
-- =================================================================

-- 0. Création de la base de données
-- -----------------------------------------------------------------
CREATE DATABASE IF NOT EXISTS `eventik`;
USE `eventik`;

-- Suppression des tables existantes pour un environnement de test propre
DROP TABLE IF EXISTS `tickets`;
DROP TABLE IF EXISTS `event_invitees`;
DROP TABLE IF EXISTS `events`;
DROP TABLE IF EXISTS `users`;

-- =================================================================
--  CRÉATION DES TABLES
-- =================================================================

-- 1. Table `users`
-- -----------------------------------------------------------------
CREATE TABLE `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `role` VARCHAR(50) DEFAULT 'user',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Table `events`
-- -----------------------------------------------------------------
CREATE TABLE `events` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `description` TEXT,
  `location` VARCHAR(255),
  `event_date` DATETIME NOT NULL,
  `capacity` INT DEFAULT 0,
  `slug` VARCHAR(255) NOT NULL UNIQUE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
);

-- 3. Table `event_invitees` (pour événements à accès restreint)
-- -----------------------------------------------------------------
CREATE TABLE `event_invitees` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `event_id` INT NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `has_ticket` BOOLEAN DEFAULT FALSE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(`event_id`, `email`),
  FOREIGN KEY (`event_id`) REFERENCES `events`(`id`) ON DELETE CASCADE
);

-- 4. Table `tickets`
-- -----------------------------------------------------------------
CREATE TABLE `tickets` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `event_id` INT NOT NULL,
  `owner_email` VARCHAR(255) NOT NULL,
  `qr_code` VARCHAR(255) NOT NULL UNIQUE,
  `status` VARCHAR(50) DEFAULT 'valid', -- e.g., 'valid', 'used', 'cancelled'
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`event_id`) REFERENCES `events`(`id`) ON DELETE CASCADE
);

-- =================================================================
--  INSERTION DES DONNÉES FICTIVES
-- =================================================================

-- 1. Insertion de quelques utilisateurs
-- -----------------------------------------------------------------
INSERT INTO `users` (`id`, `name`, `email`, `password`, `role`, `created_at`) VALUES
(1, 'Jean Dupont', 'jean.dupont@email.com', 'hashed_password_123', 'user', NOW()),
(2, 'Marie Curie', 'marie.curie@email.com', 'hashed_password_456', 'admin', NOW());

-- 2. Insertion de plusieurs événements
-- -----------------------------------------------------------------
INSERT INTO `events` (`user_id`, `title`, `description`, `location`, `event_date`, `capacity`, `slug`) VALUES
(
  1,
  'Conférence Tech 2025',
  'Une conférence annuelle sur les dernières avancées technologiques, du Web3 à l''IA.',
  'Palais des Congrès, Paris',
  '2025-10-15 09:00:00',
  500,
  'conference-tech-2025'
),
(
  2,
  'Festival de Musique Électronique',
  'Un week-end complet avec les meilleurs DJs de la scène internationale. Shows visuels et sonores immersifs.',
  'Grande Halle de la Villette, Paris',
  '2025-09-20 18:00:00',
  2000,
  'festival-musique-electronique'
),
(
  1,
  'Atelier de Cuisine Locale',
  'Apprenez à cuisiner des plats traditionnels avec des produits de saison. Dégustation à la fin de l''atelier.',
  'L''Atelier des Chefs, Lyon',
  '2025-11-05 14:00:00',
  20,
  'atelier-cuisine-locale'
),
(
  2,
  'Exposition d''Art Abstrait',
  'Découvrez les œuvres de jeunes artistes prometteurs de la scène locale et internationale.',
  'Fondation Louis Vuitton, Paris',
  '2025-12-01 10:00:00',
  150,
  'exposition-art-abstrait'
);

-- 3. Insertion d'invités pour des événements spécifiques
-- -----------------------------------------------------------------
INSERT INTO `event_invitees` (`event_id`, `email`, `has_ticket`) VALUES
(1, 'invite1@example.com', 0),
(1, 'invite2@example.com', 0),
(3, 'gourmet@example.com', 0);

-- 4. Insertion de tickets (simule une action qui serait faite par l'API)
-- -----------------------------------------------------------------
INSERT INTO `tickets` (`event_id`, `owner_email`, `qr_code`) VALUES
(1, 'invite1@example.com', 'a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4');

-- 5. Mise à jour du statut de l'invité pour refléter qu'il a un ticket
-- -----------------------------------------------------------------
UPDATE `event_invitees`
SET `has_ticket` = 1
WHERE `event_id` = 1 AND `email` = 'invite1@example.com';
