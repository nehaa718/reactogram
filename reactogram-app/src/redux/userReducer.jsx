// Get user from localStorage if available
const storedUser = JSON.parse(localStorage.getItem("user"));

const initialState = {
  user: storedUser || {}
};

export const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case "LOGIN_SUCCESS":
      // Save user to localStorage
      localStorage.setItem("user", JSON.stringify(action.payload));
      return {
        ...state,
        user: action.payload
      };

    case "LOGIN_ERROR":
      localStorage.removeItem("user");
      return initialState;

    case "LOGOUT":
      localStorage.removeItem("user");
      localStorage.removeItem("token"); // Optional: if you're storing token
      return initialState;

    default:
      return state;
  }
};
