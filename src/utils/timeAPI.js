export const getTime = (APIkeyTime) => {
  return fetch(
    `http://api.timezonedb.com/v2.1/get-time-zone?key=${APIkeyTime}&format=json&by=zone&zone=America/Chicago`
  ).then((res) => {
    if (res.ok) {
      return res.json();
    } else {
      return Promise.reject(`Error: ${res.status} ${res.statusText}`);
    }
  });
};

export const APIkeyTime = "7FBSD5X015OJ";
