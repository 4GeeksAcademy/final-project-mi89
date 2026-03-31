export const initialStore = () => {
  return {
    isLoggedIn: false,
    userType: null,
  };
};

export default function storeReducer(store, action = {}) {
  switch (action.type) {
    case "set_isLoggedIn":
      return {
        ...store,
        isLoggedIn: action.payload,
      };

    case "set_userType":
      return {
        ...store,
        userType: action.payload,
      };

    default:
      throw Error("Unknown action.");
  }
}
