import secureLocalStorage from "react-secure-storage";

// add accessToken to local storage
export const storeAccessToken = (accessToken) => {
  secureLocalStorage.setItem(
    import.meta.env.VITE_SECURE_LOCAL_STORAGE_PREFIX,
    accessToken
  );
};

// get accessToken
export const getAccessToken = () => {
  return secureLocalStorage.getItem(
    import.meta.env.VITE_SECURE_LOCAL_STORAGE_PREFIX
  );
};

// remove accessToken
export const removeAccessToken = () => {
  secureLocalStorage.removeItem(
    import.meta.env.VITE_SECURE_LOCAL_STORAGE_PREFIX
  );
};

export function storeRole(role) {
  localStorage.setItem("role", role);
}

export function removeRole() {
  localStorage.removeItem("role");
}

export function getRole() {
  return localStorage.getItem("role");
}

// Store user information (username, email, profile)
export function storeUser(username, email, profile) {
  localStorage.setItem("username", username);
  localStorage.setItem("email", email);
  localStorage.setItem("profile", profile); // Corrected key
}

// Remove user information
export function removeUser() {
  localStorage.removeItem("username");
  localStorage.removeItem("email");
  localStorage.removeItem("profile"); // Corrected key
}

// Get user information
export function getUser() {
  const username = localStorage.getItem("username");
  const email = localStorage.getItem("email");
  const profile = localStorage.getItem("profile");

  return { username, email, profile };
}
