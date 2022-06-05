import axios from "axios";

const API_URL = "https://run.mocky.io/v3/a2fbc23e-069e-4ba5-954c-cd910986f40f";

export const fetchData = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await axios.get(API_URL);
      resolve(response.data);
    } catch (e) {
      reject({
        error: true,
        message: "Something went wrong!",
      });
    }
  });
};
