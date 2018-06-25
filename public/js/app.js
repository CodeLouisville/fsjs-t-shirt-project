// our jquery template string
function listItemTemplate(data) {
    var compiled = '';
    data.forEach(item => {
        compiled += `
      <li class="list-group-item">
        <strong>${item.name}</strong> - ${item.description} - ${item.price}
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

function submitShirtForm() {
    console.log("You clicked 'submit'. Congratulations.");

    const shirtData = {
        name: $('#shirt-name').val(),
        description: $('#shirt-description').val(),
        price: $('#shirt-price').val()
    };

    fetch('/api/shirt', {
        method: 'post',
        body: JSON.stringify(shirtData),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(shirt => {
            console.log("we have posted the data", shirt);
        refreshShirtList();
    })
    .catch(err => {
            console.error("A terrible thing has happened", err);
    })
}

function cancelShirtForm() {
    hideAddShirtForm();
}

function showAddShirtForm(){
    $('#add-shirt-form').show();
}

function hideAddShirtForm(){
    $('#add-shirt-form').hide();
}