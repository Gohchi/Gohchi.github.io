function mapData({ name, desc, checklists }) {
  const template = document.importNode(document.querySelector('#template-list').content, true);
  template.querySelector('h1').innerText = name;
  // template.querySelector('h3').innerText = desc;
  const unorderedList = template.querySelector('ul');

  const [list] = checklists;
  const items = list.checkItems
    .sort(({ pos: a }, { pos: b }) => a - b)
    .forEach(({ name, state }) => {
      const listItem = document.createElement('li');
      listItem.innerText = name;
      listItem.classList.add(state);

      unorderedList.appendChild(listItem);
    });
  console.log(items);

  document.querySelector('#books-science-fiction')
    .appendChild(template);
}


fetch('data.json')
  .then(response => response.json())
  .then(mapData);