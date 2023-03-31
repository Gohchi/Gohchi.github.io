import config from '/config.json' assert {type: 'json'};

export const getAPI = (url) => {
  let { baseUrl } = config;
  if( window.location.hostname === 'localhost' ){
    baseUrl = 'http://localhost:8081/';
  }
  return fetch(
    baseUrl + url,
    { mode: 'cors' }
  )
  .then( response => response.json() )
}