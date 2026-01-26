const axios = require("axios");


module.exports = {


getLocation: async (userIp) => {
    try {
      const url = `http://ip-api.com/json/${userIp}`;

      const response = await axios.get(url, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      const res = response.data;
      const result = {
        state: res.regionName || "",
        city: res.city || "",
        country: res.country || "",
        countryCode: res.countryCode || "",
        zip: res.zip || "",
        ip: userIp,
        lead_src: "YTII",
      };

      return result;
    } catch (error) {
      const result = {
        state: "",
        city: "",
        country: "",
        countryCode: "",
        zip: "",
        ip: "",
        lead_src: "YTII",
      };

      return result;
    }
  },

}