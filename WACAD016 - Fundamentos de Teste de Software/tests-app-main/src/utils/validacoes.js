/**
 * Extrai o primeiro nome de uma string de nome completo.
 *
 * @param {string} fullName - O nome completo do usuário, separado por espaços.
 * @returns {string} - O primeiro nome extraído do nome completo ou o próprio nome caso não haja espaços.
 */
function firstName(fullName) {
  const whitespace = fullName.lastIndexOf(" ");

  if (whitespace === -1) return fullName;
  else return fullName.slice(0, whitespace);
}

/**
 * Verifica a disponibilidade de um produto em estoque com base no tipo e na quantidade desejada.
 *
 * @param {string} productType - O tipo do produto a ser verificado no estoque.
 * @param {number} quantity - A quantidade desejada do produto a ser verificada.
 * @returns {boolean} - Retorna true se a quantidade desejada do tipo de produto especificado estiver disponível
 *                      no estoque, caso contrário retorna false.
 */
function checkStockAvailability(productType, quantity) {
  const stock = {
    laptop: 10,
    smartphone: 20,
    headphone: 5,
    tablet: 15,
    book: 0,
  };

  const availableStock = stock[productType];
  if (availableStock === 0) return false;
  else return true;
}

/**
 * Calcula o preço total de um array de produtos em uma aplicação de e-commerce.
 *
 * @param {Array} products - Um array de objetos de produtos, cada um contendo as propriedades 'price' e 'quantity'.
 * @returns {number} - O preço total obtido multiplicando o preço de cada produto pela sua quantidade
 *                     e somando os preços individuais dos produtos.
 *
 * Exemplo de array de produtos:
 *   [
 *     { name: 'Product 1', price: 10, quantity: 2 },
 *     { name: 'Product 2', price: 15, quantity: 2 },
 *     { name: 'Product 3', price: 20, quantity: 1 }
 *   ]
 */
function calculateTotalPrice(products) {
  let total = 0;
  for (let i = 0; i < products.length; i++) {
    total = products[i].price;
  }
  return total;
}

module.exports = {
  firstName,
  checkStockAvailability,
  calculateTotalPrice,
};
