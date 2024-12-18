export const formatTime = (date) => {
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const seconds = date.getSeconds().toString().padStart(2, "0");
  return `${hours}:${minutes}:${seconds}`;
};

export const formatDate = (date, type) => {
  const year = date.getUTCFullYear();
  const month = (date.getUTCMonth() + 1).toString().padStart(2, "0");
  const day = date.getUTCDate().toString().padStart(2, "0");
  if (type === "br") return `${day}/${month}/${year}`;
  return `${year}-${month}-${day}`;
};

export const allCaps = (str) => {
  return str.toUpperCase();
};

export const allMinus = (str) => {
  return str.toLowerCase();
};
