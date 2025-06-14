function goBack() {
  history.back();
}

function get(url, onload, onerror) {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', url);
  xhr.send();
  xhr.onload = onload.bind(xhr);
  xhr.onerror = onerror.bind(xhr);
}

// function getFile() {
//   get('http://192.168.0.14:3000/mpo',
//     function () {

//     }
//   );
// }

function addPhoto(dir, fileName) {
  const urlBase = 'http://192.168.0.14:3000/static/';
  const urlPreview = urlBase + dir + '/' + fileName + '.JPG';
  const urlLink = urlBase + dir + '/' + fileName + '.MPO';

  const container = document.querySelector('#photos');

  const el = document.createElement('a');
  el.href = urlLink;
  
  const img = document.createElement('img');
  img.src = urlPreview;
  img.onerror = function() {
    img.src='http://192.168.0.14:8080/img/no-preview.jpg';
  };
  img.title = fileName;

  el.appendChild(img);
  container.appendChild(el);
}

function getCall() {
  // const xhr = new XMLHttpRequest();
  // xhr.open('GET', 'http://192.168.0.14:3000/');
  // xhr.send();
  // xhr.onload = function() {
  //   alert('testtt');
  // };
  // xhr.onerror = function() {
  //   alert('errrr');
  // };
  get(
    'http://192.168.0.14:3000/files',
    function() {
      // alert('Cargado:' + xhr.status + ' ' + xhr.response);
      const data = JSON.parse(this.response);

        for (var i = 0; i < data.files.length; i++) {
          const file = data.files[i];
          const dir = file.dir;
          for (var l = 0; l < file.fileNames.length; l++) {
            const fileName = file.fileNames[l];
            //   alert(dir, fileName);
            addPhoto(dir, fileName);
          }
        // http://localhost:3000/static/100NIN03/HNI_0001.JPG
        }
    },
    function() {
      alert('Error de red');
    });
}

// function getCall() {
//   const url = new URL('http://192.168.0.14:3000');
//   fetch(url)
//     .then(res => res.json())
//     .then(res => {
//       alert(res.message);
//     })
//     .catch(e => {
//       alert(e);
//     });
// }