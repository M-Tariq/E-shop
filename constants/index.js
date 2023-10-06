module.exports = {
  MISSING_TOKEN: "Missing Authentication Token",
  ADMIN_NOTFOUND: "Admin Information Not Found",
  ACCOUNT_NOTFOUND: "Account Information Not Found",
  INVALID_TOKEN: "Token Is Invalid",
  URL_NOTFOUND: "URL Not Found",
  // codes
  UNAUTHORIZE_CODE: 401,
  CREATED_CODE: 201,
  BAD_REQUEST_CODE: 400,
  UNPROCESS_ENTITY_REQUEST_CODE: 422,
  SUCCESS_REQUEST_CODE: 200,
  CONFLICT_REQUEST_CODE: 409,
  FORBIDDEN_CODE: 403,

  //models
  USER_MODEL: "users",
  PRODUCT_MODEL: "products",

  USER_ROLES: {
    ADMIN: "admin",
    CUSTOMER: "customer",
  },

  PRODUCT_CATEGORIES: {
    TOPS: "tops",
    BOTTOMS: "bottoms",
    HATS: "hats",
    ACCESSORIES: "accessories",
    MEN: "men",
    WOMEN: "women",
  },
  DATABASE_CONNECTED: "Database Connected",
  DATABASE_NOTCONNECTED: "Data connection issue",
  SERVER_RUNNING: "Server running",
  DATA_LOADED: "Data Loaded successfully",
};
