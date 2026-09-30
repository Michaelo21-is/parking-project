export default function extractUserDeatils() {
  const storedUserInfo = localStorage.getItem("userInfo");

  if (!storedUserInfo) {
    return null;
  }

  try {
    const userInfo = JSON.parse(storedUserInfo);

    if (Date.now() >= userInfo.expiresAt) {
      localStorage.removeItem("userInfo");
      return null;
    }

    return userInfo;
  } catch (error) {
    console.error("Failed to parse userInfo from localStorage:", error);
    localStorage.removeItem("userInfo");
    return null;
  }
}