function createLink(filename, isDirectory = false) {
  const linkPath = isDirectory ? `/${filename}/` : `/${filename}`;
  const icon = isDirectory ? '[DIC]' : '[ARQ]';

  return `<a href="${linkPath}">${icon} ${filename}</a><br>\n`;
}

export { createLink };