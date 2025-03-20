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
export const capitalizeFirstLetter = (val) => {
  return String(val).charAt(0).toUpperCase() + String(val).slice(1);
};
export const applyBodyClass = (pathname) => {
  const isAuthPage = ["/signin", "/signup", "/enter"].includes(pathname);
  console.log(isAuthPage);
  if (isAuthPage) {
    document.body.classList.remove("white-background");
    document.body.classList.add("gradient-background");
  } else {
    document.body.classList.remove("gradient-background");
    document.body.classList.add("white-background");
  }
  console.log(document.body.classList);
};
