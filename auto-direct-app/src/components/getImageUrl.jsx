const getImageUrl = (inputPath) => {
  if (!inputPath) return '';
  // Normalize to use the public/assets base during dev/build
  // If caller already passes an absolute URL or starts with /assets, keep it
  if (inputPath.startsWith('http://') || inputPath.startsWith('https://')) return inputPath;
  if (inputPath.startsWith('/assets/')) return inputPath;

  // Strip any "../../public/" or "./public/" prefixes commonly used in components
  const cleaned = inputPath
    .replace(/^\.\.\/\.\.\/public\//, '')
    .replace(/^\.\/public\//, '')
    .replace(/^public\//, '');

  // Ensure it points to /assets/... from Vite's public dir
  const finalPath = cleaned.startsWith('assets/') ? `/${cleaned}` : `/assets/${cleaned}`;
  return finalPath;
};

export default getImageUrl;