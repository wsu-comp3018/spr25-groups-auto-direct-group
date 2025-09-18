const getImageUrl = (path) => new URL(`${path}`, import.meta.url).href;

export default getImageUrl;