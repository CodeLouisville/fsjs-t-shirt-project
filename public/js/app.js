// our jquery template string
function listItemTemplate (data) {
  var compiled = ''
  data.forEach(item => {
    compiled += `
      <div class="card" style="width: 18rem;">
        <img class="card-img-top" src="" alt="Shirt Image">
        <div class="card-body">
          <h5 class="card-title">${item.name} - ${item.price}</h5>
          <p class="card-text">${item.description}</p>
          <span class="pull-right">
            <span class="glyphicon glyphicon-pencil" onclick="handleEditShirtClick(this)" data-shirt-id="${item._id}" style="cursor: pointer;"></span>
            <span class="glyphicon glyphicon-remove" onclick="handleDeleteShirtClick(this)" data-shirt-id="${item._id}" style="cursor: pointer;"></span>
          </span>
        </div>
      </div>
    `
  })
  return compiled
}

function getShirts () {
  return $.ajax('/api/shirt')
    .then(res => {
      console.log('Results from getShirts()', res)
      return res
    })
    .fail(err => {
      console.log('Error in getShirts()', err)
      throw err
    })
}

function refreshShirtList () {
  getShirts()
    .then(shirts => {
      window.shirtList = shirts
      $('#list-container').html(listItemTemplate(shirts))
    })
}

function submitShirtForm () {
  console.log("You clicked 'submit'. Congratulations.")

  const shirtData = {
    name: $('#shirt-name').val(),
    description: $('#shirt-description').val(),
    price: $('#shirt-price').val(),
    _id: $('#shirt-id').val()
  }

  let method, url
  if (shirtData._id) {
    method = 'PUT'
    url = '/api/shirt/' + shirtData._id
  } else {
    method = 'POST'
    url = '/api/shirt'
  }

  fetch(url, {
    method: method,
    body: JSON.stringify(shirtData),
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then(response => response.json())
    .then(shirt => {
      console.log('we have updated the data', shirt)
      cancelShirtForm()
      refreshShirtList()
    })
    .catch(err => {
      console.error('A terrible thing has happened', err)
    })
}

function cancelShirtForm () {
  setForm()
  hideAddShirtForm()
}

function hideAddShirtForm () {
  $('#add-shirt-form').hide()
}

function showAddShirtForm () {
  $('#add-shirt-form').show()
}

function handleEditShirtClick (element) {
  const shirtId = element.getAttribute('data-shirt-id')

  const shirt = window.shirtList.find(shirt => shirt._id === shirtId)
  if (shirt) {
    setForm(shirt)
  }

  showAddShirtForm()
}

function handleDeleteShirtClick (element) {
  const shirtId = element.getAttribute('data-shirt-id')

  if (confirm('Are you sure?')) {
    deleteShirt(shirtId)
  }
}

function deleteShirt (shirtId) {
  const url = '/api/shirt/' + shirtId

  fetch(url, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' }
  })
    .then(response => response.json())
    .then(response => {
      console.log('DOOOOOOOOOM!!!!!')
      refreshShirtList()
    })
    .catch(err => {
      console.error("I'm not dead yet!", err)
    })
}

function setForm (data) {
  data = data || {}

  const shirt = {
    name: data.name || '',
    description: data.description || '',
    price: data.price || '',
    _id: data._id || ''
  }

  $('#shirt-name').val(shirt.name)
  $('#shirt-description').val(shirt.description)
  $('#shirt-price').val(shirt.price)
  $('#shirt-id').val(shirt._id)

  if (shirt._id) {
    $('#form-label').text('Edit shirt')
  } else {
    $('#form-label').text('Add shirt')
  }
}
