export const setPageTitle = (title) => {
  document.title = title || "DriveBuddy";
};
export const formatDate = (date) => {
  return date.toISOString().split("T")[0];
};
export const generateInvitationCode = () => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};
