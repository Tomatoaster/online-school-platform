function clearAnswer() {
  const oldAns = document.getElementsByClassName('ansMsg');
  while (oldAns[0]) {
    oldAns[0].parentNode.removeChild(oldAns[0]);
  }
}

function deleteAssignment(source) {
  const xhr = new XMLHttpRequest();
  const subjID = source.parentNode.children[0].textContent.trim();
  let ans;
  xhr.onreadystatechange = () => {
    if (xhr.readyState === 4) {
      ans = JSON.parse(xhr.responseText);

      clearAnswer();

      if (xhr.status === 200) {
        const tRow = source.parentNode;
        tRow.parentNode.removeChild(tRow);
      }

      const ansMsg = document.createElement('div');
      ansMsg.textContent = ans;
      ansMsg.setAttribute('class', 'ansMsg');
      const formElement = document.getElementsByTagName('form')[0];
      const bodyElement = document.getElementsByTagName('body')[0];
      bodyElement.insertBefore(ansMsg, formElement);
    }
  };

  xhr.open('POST', `/removeAssignment?id=${subjID}`);
  xhr.send();
}

window.onload = () => {
  const delButtons = document.getElementsByClassName('delAssignment');
  for (let i = 0; i < delButtons.length; i++) {
    delButtons[i].addEventListener('click', (evt) => deleteAssignment(evt.target));
  }
};
