const getImageUrl = (path) => {
  if (!path) return "/assets/react.svg";
  
  return path.replace("../../public", "").replace("../assets", "/assets");
};

export default getImageUrl;