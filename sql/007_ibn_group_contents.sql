CREATE TABLE IF NOT EXISTS ibn_group_contents (
  id INT AUTO_INCREMENT PRIMARY KEY,
  section VARCHAR(100) NOT NULL,
  key_name VARCHAR(100) NOT NULL,
  value_long TEXT NULL,
  value_short VARCHAR(500) NULL,
  is_published TINYINT(1) NOT NULL DEFAULT 1,
  sort_order INT NOT NULL DEFAULT 0,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_ibn_section_key (section, key_name)
);

INSERT IGNORE INTO ibn_group_contents (section, key_name, value_short, value_long, sort_order) VALUES
('entreprise', 'nom', 'IBN Group', NULL, 1),
('entreprise', 'presentation', 'Entreprise spécialisée dans les services et solutions SAP.', 'Présentation officielle à compléter avec les contenus vérifiés d\'IBN Group.', 2),
('entreprise', 'annee_creation', 'À vérifier', NULL, 3),
('entreprise', 'siege_social', 'À vérifier', NULL, 4),
('activites', 'principales', 'Services et accompagnement SAP.', NULL, 1),
('activites', 'secteurs', 'À vérifier', NULL, 2),
('services', 'conseil_sap', 'Conseil et accompagnement sur les modules SAP.', NULL, 1),
('services', 'formation_sap', 'Formations certifiantes sur les modules SAP S/4HANA, Fiori et BTP.', NULL, 2),
('services', 'implementation', 'Implémentation et intégration des solutions SAP.', NULL, 3),
('services', 'support_maintenance', 'Support et maintenance des environnements SAP.', NULL, 4),
('expertises', 'modules', 'FI, MM, SD, ABAP, BTP, S/4HANA.', NULL, 1),
('expertises', 'domaines', 'Fonctionnel, technique, data et analytics.', NULL, 2),
('expertises', 'certifications', 'Préparation aux certifications SAP officielles.', NULL, 3),
('realisations', 'projets', 'À vérifier avec les références clients officielles.', NULL, 1),
('realisations', 'clients', 'À vérifier avec les références clients officielles.', NULL, 2),
('accompagnement', 'offres', 'Accompagnement sur mesure pour les entreprises et universités.', NULL, 1),
('accompagnement', 'modalites', 'À vérifier', NULL, 2),
('coordonnées', 'adresse', 'À vérifier', NULL, 1),
('coordonnées', 'telephone', 'À vérifier', NULL, 2),
('coordonnées', 'email', 'À vérifier', NULL, 3),
('coordonnées', 'site_web', 'À vérifier', NULL, 4);

