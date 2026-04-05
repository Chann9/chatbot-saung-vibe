-- ===================================
-- Chatbot AI Database Schema (MySQL)
-- ===================================

-- Create Database
CREATE DATABASE IF NOT EXISTS chatbot_saung_vibe;
USE chatbot_saung_vibe;

-- ===================================
-- Users Table
-- ===================================
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin', 'user') DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_username (username),
  INDEX idx_role (role)
);

-- ===================================
-- User Settings Table (untuk limit chat)
-- ===================================
CREATE TABLE user_settings (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL UNIQUE,
  chat_limit INT DEFAULT 10,
  current_chat_count INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id)
);

-- ===================================
-- Chat Conversations Table
-- ===================================
CREATE TABLE chat_conversations (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  title VARCHAR(255) DEFAULT 'New Chat',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id),
  INDEX idx_created_at (created_at)
);

-- ===================================
-- Chat Messages Table
-- ===================================
CREATE TABLE chat_messages (
  id INT PRIMARY KEY AUTO_INCREMENT,
  conversation_id INT NOT NULL,
  sender ENUM('user', 'ai') NOT NULL,
  message LONGTEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (conversation_id) REFERENCES chat_conversations(id) ON DELETE CASCADE,
  INDEX idx_conversation_id (conversation_id),
  INDEX idx_sender (sender),
  INDEX idx_created_at (created_at)
);

-- ===================================
-- Insert Default Admin User
-- ===================================
INSERT INTO users (username, email, password, role) 
VALUES ('admin', 'admin@saungvibe.com', '$2b$10$8K3DqYHZ8C8P8J2Z3Z3Z3Z3Z3Z3Z3Z3Z3Z3Z3Z3Z3Z3Z3Z3Z3Z3Z3Z', 'admin');

-- Insert Admin Settings
INSERT INTO user_settings (user_id, chat_limit, current_chat_count) 
SELECT id, 100, 0 FROM users WHERE username = 'admin';

-- ===================================
-- Indexes untuk Performance
-- ===================================
-- Sudah dibuat di atas pada setiap tabel
