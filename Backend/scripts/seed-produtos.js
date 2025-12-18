const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Produtos por categoria
const produtosPorCategoria = {
  'LANCHES': [
    { nome: 'Hambúrguer Clássico', preco: 18.90, descricao: 'Hambúrguer artesanal com queijo, alface, tomate e molho especial', ingredientes: 'Pão, carne, queijo, alface, tomate, molho especial', temTamanho: false, temAdicionais: true },
    { nome: 'X-Burger', preco: 15.90, descricao: 'Hambúrguer com queijo, bacon e ovo', ingredientes: 'Pão, carne, queijo, bacon, ovo', temTamanho: false, temAdicionais: true },
    { nome: 'X-Salada', preco: 16.90, descricao: 'Hambúrguer com queijo, alface, tomate e maionese', ingredientes: 'Pão, carne, queijo, alface, tomate, maionese', temTamanho: false, temAdicionais: true },
    { nome: 'X-Bacon', preco: 19.90, descricao: 'Hambúrguer com queijo e bacon crocante', ingredientes: 'Pão, carne, queijo, bacon', temTamanho: false, temAdicionais: true },
    { nome: 'X-Tudo', preco: 24.90, descricao: 'Hambúrguer completo com tudo', ingredientes: 'Pão, carne, queijo, bacon, ovo, alface, tomate, cebola', temTamanho: false, temAdicionais: true },
    { nome: 'Batata Frita', preco: 12.90, descricao: 'Batata frita crocante', ingredientes: 'Batata, sal', temTamanho: true, temAdicionais: false },
    { nome: 'Batata Frita com Cheddar e Bacon', preco: 18.90, descricao: 'Batata frita com cheddar e bacon', ingredientes: 'Batata, cheddar, bacon', temTamanho: true, temAdicionais: false },
    { nome: 'Refrigerante', preco: 6.90, descricao: 'Refrigerante gelado', ingredientes: 'Refrigerante', temTamanho: true, temAdicionais: false },
    { nome: 'Suco Natural', preco: 8.90, descricao: 'Suco natural de frutas', ingredientes: 'Frutas naturais', temTamanho: true, temAdicionais: false },
    { nome: 'Milk Shake', preco: 14.90, descricao: 'Milk shake cremoso', ingredientes: 'Leite, sorvete, sabor escolhido', temTamanho: true, temAdicionais: false }
  ],
  'PIZZA': [
    { nome: 'Pizza Margherita', preco: 32.90, descricao: 'Pizza com molho de tomate, mussarela e manjericão', ingredientes: 'Massa, molho de tomate, mussarela, manjericão', temTamanho: true, temAdicionais: false },
    { nome: 'Pizza Calabresa', preco: 35.90, descricao: 'Pizza com calabresa e cebola', ingredientes: 'Massa, molho de tomate, mussarela, calabresa, cebola', temTamanho: true, temAdicionais: false },
    { nome: 'Pizza Portuguesa', preco: 38.90, descricao: 'Pizza com presunto, ovos, cebola e azeitona', ingredientes: 'Massa, molho de tomate, mussarela, presunto, ovos, cebola, azeitona', temTamanho: true, temAdicionais: false },
    { nome: 'Pizza 4 Queijos', preco: 39.90, descricao: 'Pizza com 4 tipos de queijo', ingredientes: 'Massa, molho de tomate, mussarela, provolone, parmesão, gorgonzola', temTamanho: true, temAdicionais: false },
    { nome: 'Pizza Frango com Catupiry', preco: 36.90, descricao: 'Pizza com frango desfiado e catupiry', ingredientes: 'Massa, molho de tomate, mussarela, frango, catupiry', temTamanho: true, temAdicionais: false },
    { nome: 'Pizza Pepperoni', preco: 37.90, descricao: 'Pizza com pepperoni e queijo', ingredientes: 'Massa, molho de tomate, mussarela, pepperoni', temTamanho: true, temAdicionais: false },
    { nome: 'Pizza Vegetariana', preco: 34.90, descricao: 'Pizza com vegetais frescos', ingredientes: 'Massa, molho de tomate, mussarela, pimentão, cebola, champignon', temTamanho: true, temAdicionais: false },
    { nome: 'Pizza Doce de Chocolate', preco: 28.90, descricao: 'Pizza doce com chocolate', ingredientes: 'Massa doce, chocolate, açúcar', temTamanho: true, temAdicionais: false },
    { nome: 'Refrigerante', preco: 6.90, descricao: 'Refrigerante gelado', ingredientes: 'Refrigerante', temTamanho: true, temAdicionais: false },
    { nome: 'Coca-Cola 2L', preco: 12.90, descricao: 'Coca-Cola 2 litros', ingredientes: 'Refrigerante', temTamanho: false, temAdicionais: false }
  ],
  'JAPONESA': [
    { nome: 'Sushi Combo 10 peças', preco: 45.90, descricao: 'Combo com 10 peças de sushi variado', ingredientes: 'Arroz, peixe, alga, gergelim', temTamanho: false, temAdicionais: false },
    { nome: 'Sashimi Salmão', preco: 38.90, descricao: 'Sashimi de salmão fresco', ingredientes: 'Salmão fresco', temTamanho: false, temAdicionais: false },
    { nome: 'Temaki Salmão', preco: 22.90, descricao: 'Temaki de salmão com cream cheese', ingredientes: 'Alga, arroz, salmão, cream cheese', temTamanho: false, temAdicionais: false },
    { nome: 'Temaki Atum', preco: 21.90, descricao: 'Temaki de atum', ingredientes: 'Alga, arroz, atum', temTamanho: false, temAdicionais: false },
    { nome: 'Hot Roll 8 peças', preco: 28.90, descricao: 'Hot roll com 8 peças', ingredientes: 'Arroz, peixe, alga, empanado', temTamanho: false, temAdicionais: false },
    { nome: 'Lamen Tradicional', preco: 32.90, descricao: 'Lamen com caldo de porco e ovos', ingredientes: 'Macarrão, caldo, porco, ovos, cebolinha', temTamanho: false, temAdicionais: true },
    { nome: 'Yakisoba', preco: 29.90, descricao: 'Yakisoba com legumes e carne', ingredientes: 'Macarrão, legumes, carne, molho', temTamanho: false, temAdicionais: false },
    { nome: 'Gyoza 6 unidades', preco: 18.90, descricao: 'Pastel japonês frito', ingredientes: 'Massa, carne, legumes', temTamanho: false, temAdicionais: false },
    { nome: 'Sashimi Atum', preco: 36.90, descricao: 'Sashimi de atum fresco', ingredientes: 'Atum fresco', temTamanho: false, temAdicionais: false },
    { nome: 'Combo Sushi + Temaki', preco: 52.90, descricao: 'Combo completo com sushi e temaki', ingredientes: 'Arroz, peixe, alga, cream cheese', temTamanho: false, temAdicionais: false }
  ],
  'BRASILEIRA': [
    { nome: 'Feijoada Completa', preco: 42.90, descricao: 'Feijoada completa com acompanhamentos', ingredientes: 'Feijão preto, carne de porco, linguiça, couve, farofa, arroz', temTamanho: false, temAdicionais: false },
    { nome: 'Prato Feito - Carne', preco: 24.90, descricao: 'PF com carne, arroz, feijão e batata frita', ingredientes: 'Arroz, feijão, carne, batata frita, salada', temTamanho: false, temAdicionais: false },
    { nome: 'Prato Feito - Frango', preco: 22.90, descricao: 'PF com frango grelhado', ingredientes: 'Arroz, feijão, frango, batata frita, salada', temTamanho: false, temAdicionais: false },
    { nome: 'Strogonoff de Carne', preco: 28.90, descricao: 'Strogonoff de carne com batata palha', ingredientes: 'Carne, creme de leite, champignon, batata palha, arroz', temTamanho: false, temAdicionais: false },
    { nome: 'Churrasco Misto', preco: 35.90, descricao: 'Churrasco com picanha, linguiça e frango', ingredientes: 'Picanha, linguiça, frango, farofa, vinagrete', temTamanho: false, temAdicionais: false },
    { nome: 'Moqueca de Peixe', preco: 38.90, descricao: 'Moqueca de peixe com pirão', ingredientes: 'Peixe, leite de coco, pimentão, cebola, tomate, pirão', temTamanho: false, temAdicionais: false },
    { nome: 'Baião de Dois', preco: 26.90, descricao: 'Baião de dois com carne seca', ingredientes: 'Arroz, feijão verde, carne seca, queijo coalho', temTamanho: false, temAdicionais: false },
    { nome: 'Vatapá', preco: 29.90, descricao: 'Vatapá com camarão', ingredientes: 'Pão, leite de coco, camarão, azeite de dendê', temTamanho: false, temAdicionais: false },
    { nome: 'Acarajé', preco: 12.90, descricao: 'Acarajé com vatapá e camarão', ingredientes: 'Feijão fradinho, vatapá, camarão, pimenta', temTamanho: false, temAdicionais: false },
    { nome: 'Coxinha', preco: 6.90, descricao: 'Coxinha de frango', ingredientes: 'Massa, frango, catupiry', temTamanho: false, temAdicionais: false }
  ],
  'ARABE': [
    { nome: 'Esfiha de Carne', preco: 4.90, descricao: 'Esfiha de carne temperada', ingredientes: 'Massa, carne moída, temperos', temTamanho: false, temAdicionais: false },
    { nome: 'Esfiha de Queijo', preco: 4.50, descricao: 'Esfiha de queijo', ingredientes: 'Massa, queijo', temTamanho: false, temAdicionais: false },
    { nome: 'Kebab de Carne', preco: 18.90, descricao: 'Kebab de carne com salada', ingredientes: 'Pão sírio, carne, salada, molho', temTamanho: false, temAdicionais: true },
    { nome: 'Shawarma de Frango', preco: 16.90, descricao: 'Shawarma de frango grelhado', ingredientes: 'Pão sírio, frango, salada, molho', temTamanho: false, temAdicionais: true },
    { nome: 'Hummus', preco: 14.90, descricao: 'Pasta de grão de bico', ingredientes: 'Grão de bico, tahine, azeite, limão', temTamanho: false, temAdicionais: false },
    { nome: 'Quibe Frito', preco: 12.90, descricao: 'Quibe frito crocante', ingredientes: 'Trigo, carne moída, temperos', temTamanho: false, temAdicionais: false },
    { nome: 'Pastel Árabe', preco: 8.90, descricao: 'Pastel árabe assado', ingredientes: 'Massa, carne, temperos', temTamanho: false, temAdicionais: false },
    { nome: 'Tabule', preco: 11.90, descricao: 'Salada de trigo com hortelã', ingredientes: 'Trigo, tomate, cebola, hortelã, limão', temTamanho: false, temAdicionais: false },
    { nome: 'Baba Ganoush', preco: 13.90, descricao: 'Pasta de berinjela', ingredientes: 'Berinjela, tahine, azeite, alho', temTamanho: false, temAdicionais: false },
    { nome: 'Combo Árabe', preco: 32.90, descricao: 'Combo com esfihas, quibe e shawarma', ingredientes: 'Esfihas, quibe, shawarma, salada', temTamanho: false, temAdicionais: false }
  ],
  'CHINESA': [
    { nome: 'Yakisoba de Carne', preco: 28.90, descricao: 'Yakisoba com carne e legumes', ingredientes: 'Macarrão, carne, legumes, molho', temTamanho: false, temAdicionais: false },
    { nome: 'Yakisoba de Frango', preco: 26.90, descricao: 'Yakisoba com frango e legumes', ingredientes: 'Macarrão, frango, legumes, molho', temTamanho: false, temAdicionais: false },
    { nome: 'Frango Xadrez', preco: 32.90, descricao: 'Frango com legumes e castanha', ingredientes: 'Frango, legumes, castanha, molho agridoce', temTamanho: false, temAdicionais: false },
    { nome: 'Rolinho Primavera 4 unidades', preco: 18.90, descricao: 'Rolinho primavera frito', ingredientes: 'Massa, legumes, carne', temTamanho: false, temAdicionais: false },
    { nome: 'Frango à Parmegiana', preco: 29.90, descricao: 'Frango empanado com molho', ingredientes: 'Frango, farinha, molho, queijo', temTamanho: false, temAdicionais: false },
    { nome: 'Porco Agridoce', preco: 31.90, descricao: 'Porco com molho agridoce', ingredientes: 'Porco, molho agridoce, abacaxi', temTamanho: false, temAdicionais: false },
    { nome: 'Arroz Frito', preco: 22.90, descricao: 'Arroz frito com legumes e ovo', ingredientes: 'Arroz, legumes, ovo, molho', temTamanho: false, temAdicionais: false },
    { nome: 'Frango Kung Pao', preco: 30.90, descricao: 'Frango com amendoim e pimenta', ingredientes: 'Frango, amendoim, pimenta, molho', temTamanho: false, temAdicionais: false },
    { nome: 'Bolinho de Camarão', preco: 24.90, descricao: 'Bolinho de camarão frito', ingredientes: 'Camarão, massa, temperos', temTamanho: false, temAdicionais: false },
    { nome: 'Combo Chinês', preco: 45.90, descricao: 'Combo com yakisoba, rolinho e arroz', ingredientes: 'Yakisoba, rolinho primavera, arroz', temTamanho: false, temAdicionais: false }
  ],
  'ITALIANA': [
    { nome: 'Espaguete à Carbonara', preco: 32.90, descricao: 'Espaguete com bacon e creme', ingredientes: 'Massa, bacon, creme, queijo parmesão', temTamanho: false, temAdicionais: false },
    { nome: 'Lasanha à Bolonhesa', preco: 38.90, descricao: 'Lasanha com molho bolonhesa', ingredientes: 'Massa, carne moída, molho, queijo', temTamanho: false, temAdicionais: false },
    { nome: 'Penne ao Molho Pesto', preco: 29.90, descricao: 'Penne com molho pesto', ingredientes: 'Massa, manjericão, azeite, queijo', temTamanho: false, temAdicionais: false },
    { nome: 'Ravioli de Queijo', preco: 34.90, descricao: 'Ravioli recheado com queijo', ingredientes: 'Massa, queijo, molho', temTamanho: false, temAdicionais: false },
    { nome: 'Nhoque de Batata', preco: 26.90, descricao: 'Nhoque com molho de tomate', ingredientes: 'Batata, farinha, molho de tomate', temTamanho: false, temAdicionais: false },
    { nome: 'Risotto de Camarão', preco: 42.90, descricao: 'Risotto cremoso com camarão', ingredientes: 'Arroz arbóreo, camarão, creme, queijo', temTamanho: false, temAdicionais: false },
    { nome: 'Penne ao Molho 4 Queijos', preco: 31.90, descricao: 'Penne com molho de 4 queijos', ingredientes: 'Massa, mussarela, provolone, parmesão, gorgonzola', temTamanho: false, temAdicionais: false },
    { nome: 'Fettuccine Alfredo', preco: 33.90, descricao: 'Fettuccine com molho alfredo', ingredientes: 'Massa, creme, manteiga, queijo', temTamanho: false, temAdicionais: false },
    { nome: 'Pizza Margherita', preco: 32.90, descricao: 'Pizza italiana tradicional', ingredientes: 'Massa, molho, mussarela, manjericão', temTamanho: true, temAdicionais: false },
    { nome: 'Tiramisu', preco: 18.90, descricao: 'Sobremesa italiana tradicional', ingredientes: 'Biscoito, café, mascarpone, cacau', temTamanho: false, temAdicionais: false }
  ],
  'MARMITAS': [
    { nome: 'Marmita - Carne Assada', preco: 22.90, descricao: 'Marmita com carne assada, arroz e feijão', ingredientes: 'Carne, arroz, feijão, salada, batata', temTamanho: false, temAdicionais: false },
    { nome: 'Marmita - Frango Grelhado', preco: 20.90, descricao: 'Marmita com frango grelhado', ingredientes: 'Frango, arroz, feijão, salada, batata', temTamanho: false, temAdicionais: false },
    { nome: 'Marmita - Peixe Frito', preco: 24.90, descricao: 'Marmita com peixe frito', ingredientes: 'Peixe, arroz, feijão, salada, farofa', temTamanho: false, temAdicionais: false },
    { nome: 'Marmita - Omelete', preco: 18.90, descricao: 'Marmita com omelete', ingredientes: 'Ovos, arroz, feijão, salada', temTamanho: false, temAdicionais: false },
    { nome: 'Marmita - Strogonoff', preco: 25.90, descricao: 'Marmita com strogonoff', ingredientes: 'Carne, creme, arroz, batata palha', temTamanho: false, temAdicionais: false },
    { nome: 'Marmita - Feijoada', preco: 28.90, descricao: 'Marmita com feijoada', ingredientes: 'Feijão, carne, linguiça, couve, farofa', temTamanho: false, temAdicionais: false },
    { nome: 'Marmita - Churrasco', preco: 26.90, descricao: 'Marmita com churrasco', ingredientes: 'Carne, arroz, feijão, farofa, vinagrete', temTamanho: false, temAdicionais: false },
    { nome: 'Marmita - Moqueca', preco: 29.90, descricao: 'Marmita com moqueca de peixe', ingredientes: 'Peixe, leite de coco, arroz, pirão', temTamanho: false, temAdicionais: false },
    { nome: 'Marmita - Vegetariana', preco: 19.90, descricao: 'Marmita vegetariana', ingredientes: 'Legumes, arroz, feijão, salada', temTamanho: false, temAdicionais: false },
    { nome: 'Marmita - Frango à Parmegiana', preco: 27.90, descricao: 'Marmita com frango à parmegiana', ingredientes: 'Frango, molho, queijo, arroz, batata', temTamanho: false, temAdicionais: false }
  ],
  'SAUDAVEL': [
    { nome: 'Salada Caesar', preco: 24.90, descricao: 'Salada caesar com frango grelhado', ingredientes: 'Alface, frango, croutons, molho caesar', temTamanho: false, temAdicionais: true },
    { nome: 'Salada de Quinoa', preco: 22.90, descricao: 'Salada com quinoa e legumes', ingredientes: 'Quinoa, legumes, azeite, limão', temTamanho: false, temAdicionais: true },
    { nome: 'Wrap de Frango', preco: 19.90, descricao: 'Wrap com frango e vegetais', ingredientes: 'Tortilha, frango, vegetais, molho', temTamanho: false, temAdicionais: true },
    { nome: 'Bowl de Açaí', preco: 16.90, descricao: 'Bowl de açaí com frutas', ingredientes: 'Açaí, banana, morango, granola', temTamanho: true, temAdicionais: true },
    { nome: 'Smoothie Verde', preco: 14.90, descricao: 'Smoothie com espinafre e frutas', ingredientes: 'Espinafre, banana, abacaxi, água', temTamanho: true, temAdicionais: false },
    { nome: 'Salada de Grão de Bico', preco: 20.90, descricao: 'Salada com grão de bico', ingredientes: 'Grão de bico, legumes, azeite', temTamanho: false, temAdicionais: true },
    { nome: 'Frango Grelhado com Legumes', preco: 28.90, descricao: 'Frango grelhado com legumes assados', ingredientes: 'Frango, legumes, azeite', temTamanho: false, temAdicionais: false },
    { nome: 'Salmão Grelhado', preco: 35.90, descricao: 'Salmão grelhado com legumes', ingredientes: 'Salmão, legumes, azeite, limão', temTamanho: false, temAdicionais: false },
    { nome: 'Quinoa com Vegetais', preco: 23.90, descricao: 'Quinoa com vegetais grelhados', ingredientes: 'Quinoa, vegetais, azeite', temTamanho: false, temAdicionais: false },
    { nome: 'Suco Detox', preco: 12.90, descricao: 'Suco detox com couve e limão', ingredientes: 'Couve, limão, gengibre, água', temTamanho: true, temAdicionais: false }
  ],
  'ACAI': [
    { nome: 'Açaí 300ml', preco: 12.90, descricao: 'Açaí com banana e granola', ingredientes: 'Açaí, banana, granola', temTamanho: true, temAdicionais: true },
    { nome: 'Açaí 500ml', preco: 16.90, descricao: 'Açaí com frutas e granola', ingredientes: 'Açaí, frutas, granola', temTamanho: true, temAdicionais: true },
    { nome: 'Açaí 700ml', preco: 20.90, descricao: 'Açaí completo com todas as frutas', ingredientes: 'Açaí, frutas variadas, granola, leite condensado', temTamanho: true, temAdicionais: true },
    { nome: 'Bowl de Açaí Especial', preco: 24.90, descricao: 'Bowl de açaí com coberturas especiais', ingredientes: 'Açaí, frutas, granola, nutella, morango', temTamanho: false, temAdicionais: true },
    { nome: 'Açaí com Nutella', preco: 18.90, descricao: 'Açaí com nutella e morango', ingredientes: 'Açaí, nutella, morango, granola', temTamanho: true, temAdicionais: false },
    { nome: 'Sorvete de Açaí', preco: 14.90, descricao: 'Sorvete de açaí cremoso', ingredientes: 'Açaí, leite, açúcar', temTamanho: true, temAdicionais: true },
    { nome: 'Açaí Zero Açúcar', preco: 15.90, descricao: 'Açaí sem açúcar', ingredientes: 'Açaí, frutas, adoçante', temTamanho: true, temAdicionais: true },
    { nome: 'Smoothie de Açaí', preco: 16.90, descricao: 'Smoothie de açaí com banana', ingredientes: 'Açaí, banana, leite', temTamanho: true, temAdicionais: false },
    { nome: 'Açaí com Paçoca', preco: 17.90, descricao: 'Açaí com paçoca triturada', ingredientes: 'Açaí, paçoca, banana, granola', temTamanho: true, temAdicionais: false },
    { nome: 'Combo Açaí + Tapioca', preco: 22.90, descricao: 'Combo com açaí e tapioca doce', ingredientes: 'Açaí, tapioca, coco, leite condensado', temTamanho: false, temAdicionais: false }
  ],
  'SORVETES': [
    { nome: 'Sorvete 1 Bola', preco: 8.90, descricao: 'Sorvete com 1 bola', ingredientes: 'Sorvete, sabor escolhido', temTamanho: false, temAdicionais: true },
    { nome: 'Sorvete 2 Bolas', preco: 12.90, descricao: 'Sorvete com 2 bolas', ingredientes: 'Sorvete, 2 sabores', temTamanho: false, temAdicionais: true },
    { nome: 'Sorvete 3 Bolas', preco: 16.90, descricao: 'Sorvete com 3 bolas', ingredientes: 'Sorvete, 3 sabores', temTamanho: false, temAdicionais: true },
    { nome: 'Casquinha', preco: 6.90, descricao: 'Casquinha com sorvete', ingredientes: 'Casca, sorvete', temTamanho: false, temAdicionais: true },
    { nome: 'Milk Shake', preco: 14.90, descricao: 'Milk shake cremoso', ingredientes: 'Sorvete, leite, sabor escolhido', temTamanho: true, temAdicionais: true },
    { nome: 'Açaí Gelado', preco: 15.90, descricao: 'Açaí gelado cremoso', ingredientes: 'Açaí, leite, açúcar', temTamanho: true, temAdicionais: true },
    { nome: 'Sorvete na Casquinha', preco: 7.90, descricao: 'Sorvete na casquinha crocante', ingredientes: 'Casca, sorvete', temTamanho: false, temAdicionais: true },
    { nome: 'Picolé Artesanal', preco: 5.90, descricao: 'Picolé artesanal', ingredientes: 'Frutas, açúcar, água', temTamanho: false, temAdicionais: false },
    { nome: 'Sundae', preco: 18.90, descricao: 'Sundae com calda e chantilly', ingredientes: 'Sorvete, calda, chantilly, cereja', temTamanho: false, temAdicionais: true },
    { nome: 'Banana Split', preco: 22.90, descricao: 'Banana split completo', ingredientes: 'Banana, sorvete, calda, chantilly, cereja', temTamanho: false, temAdicionais: true }
  ],
  'CAFETERIA': [
    { nome: 'Café Expresso', preco: 4.90, descricao: 'Café expresso tradicional', ingredientes: 'Café, água', temTamanho: false, temAdicionais: false },
    { nome: 'Cappuccino', preco: 8.90, descricao: 'Cappuccino com espuma', ingredientes: 'Café, leite, espuma, chocolate', temTamanho: true, temAdicionais: true },
    { nome: 'Latte', preco: 9.90, descricao: 'Latte cremoso', ingredientes: 'Café, leite vaporizado', temTamanho: true, temAdicionais: true },
    { nome: 'Mocha', preco: 11.90, descricao: 'Mocha com chocolate', ingredientes: 'Café, leite, chocolate', temTamanho: true, temAdicionais: true },
    { nome: 'Pão de Açúcar', preco: 6.90, descricao: 'Pão doce tradicional', ingredientes: 'Farinha, açúcar, ovo', temTamanho: false, temAdicionais: false },
    { nome: 'Croissant', preco: 7.90, descricao: 'Croissant francês', ingredientes: 'Massa folhada, manteiga', temTamanho: false, temAdicionais: false },
    { nome: 'Brigadeiro', preco: 3.90, descricao: 'Brigadeiro caseiro', ingredientes: 'Leite condensado, chocolate, manteiga', temTamanho: false, temAdicionais: false },
    { nome: 'Bolo de Chocolate', preco: 12.90, descricao: 'Fatia de bolo de chocolate', ingredientes: 'Farinha, chocolate, açúcar, ovos', temTamanho: false, temAdicionais: false },
    { nome: 'Sanduíche Natural', preco: 14.90, descricao: 'Sanduíche natural com frango', ingredientes: 'Pão, frango, alface, tomate, maionese', temTamanho: false, temAdicionais: true },
    { nome: 'Torta Doce', preco: 10.90, descricao: 'Fatia de torta doce', ingredientes: 'Massa, recheio doce', temTamanho: false, temAdicionais: false }
  ],
  'BEBIDAS': [
    { nome: 'Refrigerante 350ml', preco: 5.90, descricao: 'Refrigerante gelado', ingredientes: 'Refrigerante', temTamanho: false, temAdicionais: false },
    { nome: 'Refrigerante 600ml', preco: 7.90, descricao: 'Refrigerante gelado', ingredientes: 'Refrigerante', temTamanho: false, temAdicionais: false },
    { nome: 'Refrigerante 2L', preco: 12.90, descricao: 'Refrigerante 2 litros', ingredientes: 'Refrigerante', temTamanho: false, temAdicionais: false },
    { nome: 'Suco Natural 300ml', preco: 8.90, descricao: 'Suco natural de frutas', ingredientes: 'Frutas, água, açúcar', temTamanho: false, temAdicionais: false },
    { nome: 'Suco Natural 500ml', preco: 11.90, descricao: 'Suco natural de frutas', ingredientes: 'Frutas, água, açúcar', temTamanho: false, temAdicionais: false },
    { nome: 'Água Mineral 500ml', preco: 3.90, descricao: 'Água mineral gelada', ingredientes: 'Água', temTamanho: false, temAdicionais: false },
    { nome: 'Água Mineral 1.5L', preco: 5.90, descricao: 'Água mineral 1.5 litros', ingredientes: 'Água', temTamanho: false, temAdicionais: false },
    { nome: 'Smoothie 400ml', preco: 14.90, descricao: 'Smoothie de frutas', ingredientes: 'Frutas, iogurte, mel', temTamanho: false, temAdicionais: false },
    { nome: 'Vitamina 400ml', preco: 13.90, descricao: 'Vitamina de frutas com leite', ingredientes: 'Frutas, leite, açúcar', temTamanho: false, temAdicionais: false },
    { nome: 'Chá Gelado 500ml', preco: 9.90, descricao: 'Chá gelado saborizado', ingredientes: 'Chá, açúcar, limão', temTamanho: false, temAdicionais: false }
  ],
  'VEGETARIANA': [
    { nome: 'Hambúrguer Vegetariano', preco: 22.90, descricao: 'Hambúrguer de grão de bico', ingredientes: 'Pão, hambúrguer vegetal, queijo, salada', temTamanho: false, temAdicionais: true },
    { nome: 'Salada Completa', preco: 24.90, descricao: 'Salada com legumes e grãos', ingredientes: 'Alface, tomate, grão de bico, quinoa', temTamanho: false, temAdicionais: true },
    { nome: 'Wrap Vegetariano', preco: 19.90, descricao: 'Wrap com vegetais e hummus', ingredientes: 'Tortilha, vegetais, hummus', temTamanho: false, temAdicionais: true },
    { nome: 'Quibe de Soja', preco: 16.90, descricao: 'Quibe feito com soja', ingredientes: 'Soja, trigo, temperos', temTamanho: false, temAdicionais: false },
    { nome: 'Lasanha Vegetariana', preco: 28.90, descricao: 'Lasanha com berinjela e queijo', ingredientes: 'Massa, berinjela, queijo, molho', temTamanho: false, temAdicionais: false },
    { nome: 'Risotto de Legumes', preco: 26.90, descricao: 'Risotto com legumes frescos', ingredientes: 'Arroz, legumes, queijo, azeite', temTamanho: false, temAdicionais: false },
    { nome: 'Bowl de Quinoa', preco: 23.90, descricao: 'Bowl com quinoa e vegetais', ingredientes: 'Quinoa, vegetais, azeite', temTamanho: false, temAdicionais: true },
    { nome: 'Suco Verde', preco: 12.90, descricao: 'Suco verde detox', ingredientes: 'Couve, limão, gengibre, água', temTamanho: true, temAdicionais: false },
    { nome: 'Hambúrguer de Soja', preco: 20.90, descricao: 'Hambúrguer de soja grelhado', ingredientes: 'Pão, hambúrguer de soja, queijo, salada', temTamanho: false, temAdicionais: true },
    { nome: 'Torta Salgada Vegetariana', preco: 18.90, descricao: 'Torta com legumes', ingredientes: 'Massa, legumes, queijo', temTamanho: false, temAdicionais: false }
  ],
  'DOCES': [
    { nome: 'Brigadeiro', preco: 3.90, descricao: 'Brigadeiro caseiro', ingredientes: 'Leite condensado, chocolate, manteiga', temTamanho: false, temAdicionais: false },
    { nome: 'Beijinho', preco: 3.90, descricao: 'Beijinho caseiro', ingredientes: 'Leite condensado, coco, manteiga', temTamanho: false, temAdicionais: false },
    { nome: 'Bolo de Chocolate', preco: 12.90, descricao: 'Fatia de bolo de chocolate', ingredientes: 'Farinha, chocolate, açúcar, ovos', temTamanho: false, temAdicionais: false },
    { nome: 'Bolo de Morango', preco: 13.90, descricao: 'Fatia de bolo de morango', ingredientes: 'Farinha, morango, açúcar, ovos, creme', temTamanho: false, temAdicionais: false },
    { nome: 'Brownie', preco: 8.90, descricao: 'Brownie de chocolate', ingredientes: 'Chocolate, farinha, açúcar, ovos', temTamanho: false, temAdicionais: false },
    { nome: 'Pudim', preco: 9.90, descricao: 'Pudim de leite condensado', ingredientes: 'Leite condensado, leite, ovos, açúcar', temTamanho: false, temAdicionais: false },
    { nome: 'Torta de Limão', preco: 11.90, descricao: 'Fatia de torta de limão', ingredientes: 'Massa, limão, açúcar, leite condensado', temTamanho: false, temAdicionais: false },
    { nome: 'Brigadeiro Gourmet', preco: 5.90, descricao: 'Brigadeiro gourmet com cobertura', ingredientes: 'Leite condensado, chocolate, cobertura', temTamanho: false, temAdicionais: false },
    { nome: 'Trufa', preco: 6.90, descricao: 'Trufa de chocolate', ingredientes: 'Chocolate, creme, cacau', temTamanho: false, temAdicionais: false },
    { nome: 'Bolo de Cenoura', preco: 11.90, descricao: 'Fatia de bolo de cenoura com cobertura', ingredientes: 'Cenoura, farinha, açúcar, ovos, chocolate', temTamanho: false, temAdicionais: false }
  ]
};

// Opções de tamanho
const tamanhos = [
  { nome: 'Pequeno', preco: 0 },
  { nome: 'Médio', preco: 3.00 },
  { nome: 'Grande', preco: 5.00 }
];

// Adicionais comuns
const adicionais = [
  { nome: 'Bacon', preco: 4.90, tipo: 'adicional' },
  { nome: 'Queijo Extra', preco: 3.90, tipo: 'adicional' },
  { nome: 'Ovo', preco: 2.90, tipo: 'adicional' },
  { nome: 'Cebola', preco: 1.90, tipo: 'adicional' },
  { nome: 'Tomate', preco: 1.90, tipo: 'adicional' },
  { nome: 'Alface', preco: 1.50, tipo: 'adicional' },
  { nome: 'Maionese', preco: 1.50, tipo: 'adicional' },
  { nome: 'Ketchup', preco: 1.50, tipo: 'adicional' },
  { nome: 'Mostarda', preco: 1.50, tipo: 'adicional' }
];

// Remoções
const remocoes = [
  { nome: 'Sem Cebola', preco: 0, tipo: 'remocao' },
  { nome: 'Sem Tomate', preco: 0, tipo: 'remocao' },
  { nome: 'Sem Alface', preco: 0, tipo: 'remocao' },
  { nome: 'Sem Maionese', preco: 0, tipo: 'remocao' },
  { nome: 'Sem Pimenta', preco: 0, tipo: 'remocao' }
];

// Gera imagem do produto usando placeholder
function gerarImagemProduto(nomeProduto) {
  const cores = ['FF6B6B', '4ECDC4', '45B7D1', 'FFA07A', '98D8C8', 'F7DC6F', 'BB8FCE', '85C1E2', 'F1948A', '85C1E9'];
  const cor = cores[Math.floor(Math.random() * cores.length)];
  const texto = encodeURIComponent(nomeProduto.substring(0, 15).toUpperCase());
  return `https://via.placeholder.com/400x400/${cor}/FFFFFF?text=${texto}`;
}

async function main() {
  console.log('🌱 Iniciando seed de produtos...\n');
  console.log('📡 Conectando ao banco de dados...');
  
  try {
    await prisma.$connect();
    console.log('✅ Conectado ao banco de dados\n');
  } catch (error) {
    console.error('❌ Erro ao conectar:', error.message);
    throw error;
  }

  // Busca restaurantes e categorias
  const restaurantes = await prisma.restaurantes.findMany({
    include: {
      produtos: true
    }
  });

  const categorias = await prisma.categorias.findMany();

  if (restaurantes.length === 0) {
    console.error('❌ Nenhum restaurante encontrado! Execute primeiro: npm run seed:restaurantes');
    process.exit(1);
  }

  if (categorias.length === 0) {
    console.error('❌ Nenhuma categoria encontrada! Execute primeiro: npm run seed:categorias');
    process.exit(1);
  }

  console.log(`📋 Encontrados:`);
  console.log(`   - ${restaurantes.length} restaurantes`);
  console.log(`   - ${categorias.length} categorias\n`);

  const produtosCriados = [];
  const opcoesCriadas = [];

  for (const restaurante of restaurantes) {
    // Busca categoria do restaurante (primeiro produto ou categoria padrão)
    let categoriaId = 'LANCHES'; // padrão
    
    // Tenta encontrar categoria pelos produtos existentes
    if (restaurante.produtos.length > 0) {
      categoriaId = restaurante.produtos[0].id_categoria;
    } else {
      // Busca categoria aleatória
      const categoriaAleatoria = categorias[Math.floor(Math.random() * categorias.length)];
      categoriaId = categoriaAleatoria.id;
    }

    const produtosCategoria = produtosPorCategoria[categoriaId] || produtosPorCategoria['LANCHES'];

    console.log(`\n🍽️  Criando produtos para: ${restaurante.name} (${categoriaId})`);

    // Seleciona 10 produtos da categoria
    const produtosSelecionados = [];
    const indicesUsados = new Set();

    while (produtosSelecionados.length < 10 && produtosSelecionados.length < produtosCategoria.length) {
      const indice = Math.floor(Math.random() * produtosCategoria.length);
      if (!indicesUsados.has(indice)) {
        indicesUsados.add(indice);
        produtosSelecionados.push(produtosCategoria[indice]);
      }
    }

    for (let i = 0; i < produtosSelecionados.length; i++) {
      const produtoData = produtosSelecionados[i];
      
      // Variação de preço (±10%)
      const variacaoPreco = (Math.random() * 0.2 - 0.1); // -10% a +10%
      const precoFinal = produtoData.preco * (1 + variacaoPreco);

      // Estoque aleatório (alguns podem estar sem estoque)
      const estoque = Math.random() > 0.1 ? Math.floor(Math.random() * 50) + 10 : 0; // 90% com estoque

      // Horário de disponibilidade (alguns produtos podem ter horário específico)
      let horarioInicio = null;
      let horarioFim = null;
      if (Math.random() > 0.7) { // 30% têm horário específico
        horarioInicio = '11:00';
        horarioFim = '15:00';
      }

      try {
        const produto = await prisma.produtos.create({
          data: {
            name_produto: produtoData.nome,
            preco: parseFloat(precoFinal.toFixed(2)),
            imagem: gerarImagemProduto(produtoData.nome),
            descricao: produtoData.descricao,
            ingredientes: produtoData.ingredientes,
            alergenicos: Math.random() > 0.5 ? 'Contém glúten e lactose' : null,
            tempo_preparo: Math.floor(Math.random() * 20) + 10, // 10 a 30 min
            estoque: estoque,
            quantidade_maxima_pedido: Math.floor(Math.random() * 5) + 3, // 3 a 7
            disponivel: estoque > 0,
            horario_inicio: horarioInicio,
            horario_fim: horarioFim,
            permite_personalizacao: produtoData.temAdicionais || produtoData.temTamanho,
            ativo: true,
            id_restaurante: restaurante.id,
            id_categoria: categoriaId
          }
        });

        produtosCriados.push(produto);

        // Cria opções de tamanho se necessário
        if (produtoData.temTamanho) {
          for (const tamanho of tamanhos) {
            try {
              const opcao = await prisma.opcoesProduto.create({
                data: {
                  nome: tamanho.nome,
                  tipo: 'tamanho',
                  preco: tamanho.preco,
                  obrigatorio: true,
                  id_produto: produto.id
                }
              });
              opcoesCriadas.push(opcao);
            } catch (error) {
              console.log(`      ⚠️  Erro ao criar opção de tamanho: ${error.message}`);
            }
          }
        }

        // Cria opções de adicionais se necessário
        if (produtoData.temAdicionais) {
          // Adiciona 3-5 adicionais aleatórios
          const adicionaisSelecionados = adicionais
            .sort(() => Math.random() - 0.5)
            .slice(0, Math.floor(Math.random() * 3) + 3);

          for (const adicional of adicionaisSelecionados) {
            try {
              const opcao = await prisma.opcoesProduto.create({
                data: {
                  nome: adicional.nome,
                  tipo: adicional.tipo,
                  preco: adicional.preco,
                  obrigatorio: false,
                  id_produto: produto.id
                }
              });
              opcoesCriadas.push(opcao);
            } catch (error) {
              console.log(`      ⚠️  Erro ao criar adicional: ${error.message}`);
            }
          }

          // Adiciona algumas remoções
          const remocoesSelecionadas = remocoes
            .sort(() => Math.random() - 0.5)
            .slice(0, Math.floor(Math.random() * 2) + 2);

          for (const remocao of remocoesSelecionadas) {
            try {
              const opcao = await prisma.opcoesProduto.create({
                data: {
                  nome: remocao.nome,
                  tipo: remocao.tipo,
                  preco: remocao.preco,
                  obrigatorio: false,
                  id_produto: produto.id
                }
              });
              opcoesCriadas.push(opcao);
            } catch (error) {
              console.log(`      ⚠️  Erro ao criar remoção: ${error.message}`);
            }
          }
        }

        console.log(`   ✅ ${i + 1}/10 - ${produtoData.nome} - R$ ${precoFinal.toFixed(2)}`);
      } catch (error) {
        console.error(`   ❌ Erro ao criar produto "${produtoData.nome}":`, error.message);
      }
    }
  }

  console.log('\n\n📊 Resumo:');
  console.log(`   - ${produtosCriados.length} produtos criados`);
  console.log(`   - ${opcoesCriadas.length} opções de produto criadas`);
  console.log(`   - ${restaurantes.length} restaurantes processados`);
  console.log('\n✅ Seed de produtos concluído com sucesso!');
}

main()
  .catch((e) => {
    console.error('❌ Erro no seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });















