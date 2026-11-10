ALTER TABLE users
  ADD COLUMN name VARCHAR(120) NOT NULL DEFAULT '';

UPDATE users
SET name = SUBSTRING_INDEX(email, '@', 1)
WHERE name = '';

UPDATE users
SET role = 'apprenant'
WHERE role = 'learner';

CREATE TABLE sessions (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  token_hash CHAR(64) NOT NULL UNIQUE,
  expires_at DATETIME NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_sessions_expires_at (expires_at),
  CONSTRAINT fk_sessions_user
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
