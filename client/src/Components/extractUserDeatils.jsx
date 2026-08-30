export default function extractUserDeatils() {
  const getCookie = (name) => {
    const match = document.cookie.match(
      new RegExp("(^| )" + name + "=([^;]+)")
    );

    return match ? match[2] : null;
  };

  const userInfo = getCookie("userInfo");

  if (!userInfo) {
    return null;
  }

  try {
    return JSON.parse(decodeURIComponent(userInfo));
  } catch (error) {
    console.error("Failed to parse userInfo cookie:", error);
    return null;
  }
}