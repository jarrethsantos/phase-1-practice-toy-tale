let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });
});


//Creating Cards with GET

document.addEventListener("DOMContentLoaded", () => {
  fetch('http://localhost:3000/toys')
    .then(response => response.json())
    .then(toys => {
      toys.forEach(toy => {
        addToyToDOM(toy);
      });
    })
    .catch(error => {
      console.error('Error fetching toys:', error);
    });
});

function addToyToDOM(toy) {
  const toyCollection = document.querySelector('.toy-collection');

  const card = document.createElement('div');
  card.classList.add('card');

  const name = document.createElement('h2');
  name.textContent = toy.name;

  const image = document.createElement('img');
  image.classList.add('toy-avatar');
  image.src = toy.image;

  const likes = document.createElement('p');
  likes.textContent = `Likes: ${toy.likes}`;

  const likeButton = document.createElement('button');
  likeButton.classList.add('like-btn');
  likeButton.id = toy.id;
  likeButton.textContent = 'Like';
  likeButton.addEventListener('click', () => {
    updateToyLikes(toy);
  });

  card.appendChild(name);
  card.appendChild(image);
  card.appendChild(likes);
  card.appendChild(likeButton);

  toyCollection.appendChild(card);
}






//Adding a new toy with POSt
const toyForm = document.querySelector('.add-toy-form');

toyForm.addEventListener('submit', event => {
  event.preventDefault();

  const toyData = {
    name: event.target.name.value,
    image: event.target.image.value,
    likes: 0
  };

  fetch('http://localhost:3000/toys', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(toyData)
  })
  .then(response => response.json())
  .then(newToy => {
    addToyToDOM(newToy);
  })
  .catch(error => {
    console.error('Error creating new toy:', error);
  });
});


//Toy Likes (patch)
function updateToyLikes(toy) {
  toy.likes += 1;

  fetch(`http://localhost:3000/toys/:id`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ likes: toy.likes })
  })
  .then(response => response.json())
  .then(updatedToy => {
    // Find the existing toy card in the DOM and update its likes
    const toyCard = document.getElementById(updatedToy.id).parentElement;
    const likesElement = toyCard.querySelector('p');
    likesElement.textContent = `Likes: ${updatedToy.likes}`;
  })
  .catch(error => {
    console.error('Error updating toy likes:', error);
  });
}
