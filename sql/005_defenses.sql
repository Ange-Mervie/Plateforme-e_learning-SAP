CREATE TABLE IF NOT EXISTS defenses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  project_id INT NOT NULL,
  user_id INT NOT NULL,
  course_slug VARCHAR(255) NOT NULL,
  scheduled_at DATETIME NULL,
  decision VARCHAR(50) NOT NULL DEFAULT 'pending',
  evaluator_comment TEXT NULL,
  decided_by INT NULL,
  decided_at DATETIME NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (project_id) REFERENCES projects(id),
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (decided_by) REFERENCES users(id)
);
