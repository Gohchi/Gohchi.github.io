
window.onload = init;

function changed(input) {
  log(input.id + ' added');
  input.parentElement.classList.add('loaded');

  const check = !!document.querySelector('.loaded');

  if (check) {
    const upload = get('upload');
    upload.disabled = false;
    upload.classList.add('loaded');
  }
}

function get(id) {
  return document.getElementById(id);
}

function init() {
  const container = get('buttons');

  for (var i = 0; i < 24; i++) {
    const label = document.createElement('label');
    const id = 'file-' + i;
    label.setAttribute('for', id);
    label.innerText = 'File ' + i;
    label.classList.add('custom-file-upload');
    const input = document.createElement('input');
    input.id = id;
    input.onchange = changed.bind(this, input);
    input.setAttribute('type', 'file');
    label.appendChild(input);
    // if (i < 3) {  //test
    //   label.classList.add('loaded');
    // }
    container.appendChild(label);
  }

  const upload = document.createElement('button');
  upload.classList.add('custom-file-upload');
  upload.id = 'upload';
  upload.innerText = 'upload';
  upload.setAttribute('disabled', 'disabled');
  upload.onclick = uploadFiles;
  container.appendChild(upload);
  
  get('loading').classList.add('hidden');
}

function uploadFiles(){
  log('uploading...', true);
  const req = new XMLHttpRequest();
  const formData = new FormData();

  const files = document.querySelectorAll('.loaded input[type=file]');

  for (var i = 0; i < files.length; i++) {
    const file = files[i].files[0];
    formData.append("photo", file);
  }

  req.onreadystatechange = function() {
    if (req.readyState == XMLHttpRequest.DONE) {
      log('All uploaded!', true);
      clear();
    }
  }

  const service = get('service');
  req.open("POST", service.value);
  req.send(formData);
}

function log(message, clear) {
  if (clear) {
    get('log').innerText = message;
  } else {
    get('log').innerText += message + '\n';
  }
}

function clear() {
  const elements = document.querySelectorAll('.loaded');

  for (var i = 0; i < elements.length; i++) {
    const element = elements[i];
    element.classList.remove('loaded');
  }
  const upload = get('upload');
  upload.disabled = true;
}