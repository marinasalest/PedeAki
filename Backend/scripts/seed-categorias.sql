-- Script SQL para popular categorias
-- Execute este script diretamente no banco de dados se preferir

INSERT INTO categorias (id, name) VALUES
  ('LANCHES', 'Lanches / Hamburgueria'),
  ('PIZZA', 'Pizza'),
  ('JAPONESA', 'Japonesa / Sushi'),
  ('BRASILEIRA', 'Brasileira'),
  ('ARABE', 'Árabe / Esfiha / Kebab'),
  ('CHINESA', 'Chinesa'),
  ('ITALIANA', 'Italiana / Massas'),
  ('MARMITAS', 'Marmitas / Pratos Feitos (PF)'),
  ('SAUDAVEL', 'Saudável / Fitness / Saladas'),
  ('ACAI', 'Açaí / Sobremesas'),
  ('SORVETES', 'Sorvetes / Gelatos'),
  ('CAFETERIA', 'Cafeteria / Padaria'),
  ('BEBIDAS', 'Bebidas / Sucos / Refrigerantes'),
  ('VEGETARIANA', 'Vegetariana / Vegana'),
  ('DOCES', 'Doces / Confeitaria')
ON CONFLICT (id) DO NOTHING;















