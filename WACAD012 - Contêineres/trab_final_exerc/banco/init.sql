CREATE TABLE IF NOT EXISTS livros (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    autor VARCHAR(255) NOT NULL
);

INSERT INTO livros (titulo, autor) VALUES 
('Dom Casmurro', 'Machado de Assis'),
('O Alquimista', 'Paulo Coelho'),
('Sapiens', 'Yuval Noah Harari'),
('O Programador Pragmático', 'Andrew Hunt');