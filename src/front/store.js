export const initialStore = () => {
  return {
    isLoggedIn: false,
    userType: null,
    userToken: "",
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

    case "set_userToken":
      return {
        ...store,
        userToken: action.payload,
      };

    default:
      throw Error("Unknown action.");
  }
}
