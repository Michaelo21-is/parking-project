export default function extractUserDeatils() {
  const userInfo = localStorage.getItem("userInfo");

  if (!userInfo) {
    return null;
  }

  try {
    return JSON.parse(userInfo);
  } catch (error) {
    console.error("Failed to parse userInfo from localStorage:", error);
    localStorage.removeItem("userInfo");
    return null;
  }
}