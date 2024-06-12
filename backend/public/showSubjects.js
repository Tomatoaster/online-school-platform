function clearDescriptions() {
  const oldDesc = document.getElementsByClassName('descRow');
  while (oldDesc[0]) {
    oldDesc[0].parentNode.removeChild(oldDesc[0]);
  }
}

function getSubjectDesc(source) {
  const xhr = new XMLHttpRequest();

  let desc;
  const subjID = source.textContent.trim();
  xhr.onreadystatechange = () => {
    if (xhr.readyState === 4 && xhr.status === 200) {
      desc = JSON.parse(xhr.responseText);
    }

    clearDescriptions();

    const nextRow = source.parentNode.nextElementSibling;
    const descRow = document.createElement('td');
    const tbody = source.parentNode.parentNode;
    descRow.textContent = desc;
    descRow.setAttribute('colspan', 5);
    descRow.setAttribute('class', 'descRow');
    if (nextRow) {
      tbody.insertBefore(descRow, nextRow);
    } else {
      tbody.appendChild(descRow);
    }
  };

  xhr.open('GET', `/showDescription?id=${subjID}`);
  xhr.send();
}

window.onload = () => {
  const tableRows = document.getElementsByClassName('idColumn');
  for (let i = 0; i < tableRows.length; i++) {
    tableRows[i].addEventListener('click', (evt) => getSubjectDesc(evt.target));
  }

  // Ha a header-ben levo ID oszlopra kattintunk, toroljuk a megjelenitett leirasokat
  const header = document.getElementById('headerID');
  if (header) {
    header.addEventListener('click', clearDescriptions);
  }
};
