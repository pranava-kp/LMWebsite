const BASE_URL = process.env.REACT_APP_BASE_URL;
// console.log(BASE_URL);

// AUTH ENDPOINTS
export const endpoints = {
    SIGNUP_API: BASE_URL + "/signup",
    LOGIN_API: BASE_URL + "/login",
};

export const imageDetails = {
    UPLOAD_IMAGE: BASE_URL + "/imageupload",
    GET_ALL_IMAGE: BASE_URL + "/getallimage",
    IMAGE_COUNT: BASE_URL + "/increasecount",
}
