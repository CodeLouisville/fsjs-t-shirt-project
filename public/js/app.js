// our jquery template string
function listItemTemplate(data) {
  var compiled = '';
  data.forEach(item => {
    compiled += `
      <li class="list-group-item">
        <strong>${item.name}</strong> - ${item.description}
      </li>
    `;
  });
  return compiled;
}

function getShirts() {
  return $.ajax('/api/shirt')
    .then(res => {
      console.log("Results from getShirts()", res);
      return res;
    })
    .fail(err => {
      console.log("Error in getShirts()", err);
      throw err;
    });
}

function refreshShirtList() {
  getShirts()
    .then(shirts => {
      const data = {shirts: shirts};
      $('#list-container').html(listItemTemplate(data.shirts));
    })
}