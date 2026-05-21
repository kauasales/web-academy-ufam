function createLink(filename, isDirectory = false) {
  // Adiciona uma barra no final para diretórios, para indicar que é um diretório
  const linkPath = isDirectory ? `/${filename}/` : `/${filename}`;
  const icon = isDirectory ? '[DIC]' : '[ARQ]';
  return `<a href="${linkPath}">${icon} ${filename}</a><br>\n`;
}

module.exports = { createLink };