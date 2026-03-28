const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Rupa@180206P', // <-- Change this
  multipleStatements: true
});

const SQL = `
CREATE DATABASE IF NOT EXISTS membership_db;
USE membership_db;

DROP TABLE IF EXISTS plan_history;
DROP TABLE IF EXISTS login_history;
DROP TABLE IF EXISTS membership;
DROP TABLE IF EXISTS subscription_plan;
DROP TABLE IF EXISTS users;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  phone VARCHAR(15),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS subscription_plan (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  duration_days INT NOT NULL,
  description TEXT
);

CREATE TABLE IF NOT EXISTS membership (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  plan_id INT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  status ENUM('active', 'cancelled', 'expired') DEFAULT 'active',
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (plan_id) REFERENCES subscription_plan(id)
);

CREATE TABLE IF NOT EXISTS login_history (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  login_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  ip_address VARCHAR(45),
  user_agent TEXT,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS plan_history (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  plan_id INT NOT NULL,
  plan_name VARCHAR(50) NOT NULL,
  plan_price DECIMAL(10,2) NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  status ENUM('active', 'cancelled', 'expired') DEFAULT 'active',
  action_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (plan_id) REFERENCES subscription_plan(id)
);

INSERT IGNORE INTO subscription_plan (id, name, price, duration_days, description) VALUES
(1, 'Basic',    499,  30,  'Access to core features. Perfect for individuals.'),
(2, 'Standard', 999,  90,  'All Basic features + priority support. Best value.'),
(3, 'Premium',  1999, 365, 'Unlimited access + dedicated support. For teams.');
`;

db.connect(err => {
  if (err) { console.error('❌ DB Connection Error:', err.message); process.exit(1); }
  console.log('✅ Connected to MySQL');
  db.query(SQL, err => {
    if (err) { console.error('❌ Init Error:', err.message); process.exit(1); }
    console.log('✅ Database & tables created. Plans seeded.');
    db.end();
    process.exit(0);
  });
});
