export const initialStore = () => {
  return {
    userType: null,
    userToken: null,
    loggingOut: false,
    // loggingOut will equal true only when the user clicks Log Out from the navbar, then it will immediately become false because of the useEffect inside Login.jsx, which will then log out and navigate to the home page.
  };
};

export default function storeReducer(store, action = {}) {
  switch (action.type) {
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

    case "set_loggingOut":
      return {
        ...store,
        loggingOut: action.payload,
      };

    default:
      throw Error("Unknown action.");
  }
}
