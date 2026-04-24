const KEY = "areka_admin_auth";

export const authStore = {
  isAuthed: () => typeof window !== "undefined" && localStorage.getItem(KEY) === "1",
  login: () => localStorage.setItem(KEY, "1"),
  logout: () => localStorage.removeItem(KEY),
};
