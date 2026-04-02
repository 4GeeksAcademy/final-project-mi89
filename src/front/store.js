export const initialStore = () => {
  return {
    userType: null,
    userToken: null,
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

    default:
      throw Error("Unknown action.");
  }
}
