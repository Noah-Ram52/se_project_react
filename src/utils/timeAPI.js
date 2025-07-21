import { checkResponse } from "./api";

export const getTime = (APIkeyTime) => {
  return fetch(
    `http://api.timezonedb.com/v2.1/get-time-zone?key=${APIkeyTime}&format=json&by=zone&zone=America/Chicago`
  ).then(checkResponse);
};

export const APIkeyTime = "7FBSD5X015OJ";
