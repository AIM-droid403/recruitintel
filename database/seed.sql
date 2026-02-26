-- RecruitIntel Seed Script

-- Admin User (Password: admin123 - though hashing should be used in reality)
INSERT INTO users (email, password_hash, role, tokens) VALUES 
('admin@recruitintel.com', '$2b$10$C7.CidmR0yEwLqGv1.xT.OnPzS3mU9d5m7.WpXo.1S1fG.Q.1.S1m', 'ADMIN', 999999);

-- Mock Employer
INSERT INTO users (email, password_hash, role, tokens) VALUES 
('google@employer.com', '$2b$10$C7.CidmR0yEwLqGv1.xT.OnPzS3mU9d5m7.WpXo.1S1fG.Q.1.S1m', 'EMPLOYER', 500);

-- Mock Candidate
INSERT INTO users (email, password_hash, role, tokens) VALUES 
('john.doe@candidate.com', '$2b$10$C7.CidmR0yEwLqGv1.xT.OnPzS3mU9d5m7.WpXo.1S1fG.Q.1.S1m', 'CANDIDATE', 50);

-- Mock Job Vacancy
INSERT INTO job_vacancies (employer_id, title, persona_description)
SELECT id, 'Senior AI Engineer', 'Looking for a specialist in LLMs and RAG systems with 5+ years of experience in Python and Node.js.'
FROM users WHERE email = 'google@employer.com';

-- Mock system log
INSERT INTO system_logs (action, payload) VALUES 
('SYSTEM_INIT', '{"message": "RecruitIntel Alpha Online"}');
