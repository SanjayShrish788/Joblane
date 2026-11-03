-- Run after starting the backend once so Hibernate can create job_post.
-- Existing jobs with these IDs are preserved.
INSERT INTO job_post (post_id, post_profile, post_desc, req_experience, post_tech_stack) VALUES
(1, 'Software Engineer', 'Build reliable backend services and REST APIs for a growing product team.', 3, ARRAY['Java', 'Spring Boot', 'PostgreSQL']),
(2, 'Data Scientist', 'Analyze product data and build machine learning models to improve customer experiences.', 3, ARRAY['Python', 'SQL', 'Machine Learning']),
(3, 'Frontend Developer', 'Create responsive, accessible web interfaces and collaborate with designers.', 2, ARRAY['JavaScript', 'React', 'CSS']),
(4, 'DevOps Engineer', 'Automate deployments and maintain reliable cloud infrastructure and monitoring.', 4, ARRAY['Docker', 'Kubernetes', 'AWS']),
(5, 'UX Designer', 'Research user needs and design intuitive workflows, wireframes, and prototypes.', 2, ARRAY['Figma', 'User Research', 'Prototyping'])
ON CONFLICT (post_id) DO NOTHING;
