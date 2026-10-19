import config from '/config.json' with { type: 'json' };

export const getAPI = (url, type) => {
  let { baseUrl } = config;
  
  if( window.location.hostname === 'localhost' ){
    baseUrl = 'http://localhost:8081/';
  }

  let options = { mode: 'cors' };
  if ( type === 'image' ){ 
    options['headers'] = {
      "Content-Type": "image/jpeg"
    };
  }
  const promise = fetch(
    baseUrl + url,
    options
  );
  if ( type === 'image' ){ 
    return promise.then( response => response.blob() );
  }
  return promise.then( response => response.json() )
    .then( response => {
      if( response["status"] === "fail"){
        console.error(response["message"], 'URL:', url);
      }
      return response;
    });
}