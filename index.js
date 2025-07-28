import {menuArray} from './data.js';


const modal = document.querySelector('.app__modal');
const modalForm = document.querySelector('#modal__form');


let cartItems = []

/* 

<div class="menu__item flex space-between items-center">
    <div class="menu__content flex items-center">
        <div class="menu__img">
            🍕
        </div>
        <div class="menu__text flex-col">
            <h2 class="menu__item-head">Pizza</h2>
            <p class="menu__item-desc">Pepperoni, Mushroom, Mozarella</p>
            <p class="menu__item-price">$14</p>
        </div>
    </div>

    <div class="menu__button">
        <i class="fa-solid fa-plus"></i>
    </div>
</div>
*/


// Click event Listeners 

function closeModal() {
    modal.style.display = 'none';
}

function handleAdd(id) {
    id = Number(id); // Convert to number once
    
    // Check if item already exists in cart
    const existingItem = cartItems.find(item => item.id === id);
    
    if (existingItem) {
        // Item exists - increment quantity
        existingItem.quantity++;
    } else {
        // Item doesn't exist - find in menu and add to cart
        const menuItem = menuArray.find(item => item.id === id);
        if (menuItem) {
            cartItems.push({
                name: menuItem.name,
                price: menuItem.price,
                id: menuItem.id,
                quantity: 1
            });
        }
    }
    
    // Update cart UI
    document.getElementById('app__cart').innerHTML = renderCart(cartItems);
}


function handleRemove(id) {
    id = Number(id);

    const existingItem = cartItems.find(item => item.id === id)

    if(existingItem.quantity > 1) {
        existingItem.quantity--;
    }
    else {
        cartItems.splice(cartItems.indexOf(existingItem), 1);
    }

     // Update cart UI
    if(cartItems.length > 0) {
        document.getElementById('app__cart').innerHTML = renderCart(cartItems);
    }
    else {
        document.getElementById('app__cart').innerHTML = '';
    }
    
}


document.addEventListener('click', (e) => {
    if(modal.style.display === 'flex' && !modal.contains(e.target) && e.target !== e.target.dataset.open) {
        closeModal();
    }
    if(e.target.dataset.open) {
        document.querySelector('.app__modal').style.display = 'flex';
    }
    if(e.target.dataset.remove) {
        handleRemove(e.target.dataset.remove);
    }
    else if(e.target.dataset.add) {
        handleAdd(e.target.dataset.add);
    }
})


function renderRatingModal() {
  const modal = document.querySelector('#ratingModal');
  modal.style.display = 'flex';

  const stars = modal.querySelectorAll('.fa-star');
  const submitBtn = document.getElementById('submitRating');
  const closeBtn = document.getElementById('closeModal');

  let selectedRating = 0;

  // Highlight stars on hover
  stars.forEach((star, idx) => {
    const value = parseInt(star.dataset.value);

    // Hover
    star.addEventListener('mouseover', () => {
      highlightStars(value);
    });

    // Unhighlight on mouseout
    star.addEventListener('mouseout', () => {
      highlightStars(selectedRating); // show current selection
    });

    // Click = Select rating
    star.addEventListener('click', () => {
      selectedRating = value;
      highlightStars(selectedRating);
    });
  });

  // Helper to highlight stars up to a certain value
  function highlightStars(value) {
    stars.forEach(star => {
      const starValue = parseInt(star.dataset.value);
      if (starValue <= value) {
        star.classList.add('selected');
      } else {
        star.classList.remove('selected');
      }
    });
  }

  // Submit rating
  submitBtn.addEventListener('click', () => {
    if (selectedRating === 0) {
      alert('Please select a rating!');
      return;
    }

    // Replace this with your actual logic
    console.log(`Submitted rating: ${selectedRating}`);

    modal.style.display = 'none'; // Hide modal
  });

  // Cancel/Close modal
  closeBtn.addEventListener('click', () => {
    modal.style.display = 'none';
    selectedRating = 0;
    highlightStars(0);
  });
}


modalForm.addEventListener('submit', (e) => {
    e.preventDefault();
    cartItems = []
    const name = document.querySelector('#name').value;
    renderPayment(name);
    renderRatingModal();
    closeModal();
    document.querySelector('#ratingModal').style.display = 'flex';
    document.querySelectorAll('.form-input').forEach((inp) => {
        inp.value = '';
    })
})


const renderPayment = (name) => {
    document.getElementById('app__cart').innerHTML = `
        <div class="order-notification">
            <p class="notification-text">Thanks ${name}, your order is on the way!</p>
        </div>
    `
}

const renderCart = (cartItems) => {
    console.log('Cart Rendered');
    return `
        <h2 class="cart__heading">Your order</h2>
        <div class="cart__items">
            
                ${cartItems.map((item) => {
                    return `
                    <div class="cart__item">
                        <div class="cart__item--content flex space-between items-center">
                            <div class="cart__item--content flex items-center">
                                <p class="cart__item--text">${item.name}${item.quantity > 1 ? `  x ${item.quantity}` : ''}</p>
                                <span class="cart__item--remove" data-remove=${item.id}>remove</span>
                            </div>
                    
                            <div class="cart__item--price">$${item.price * item.quantity}</div>
                        </div>
                    </div>
                    `
                }).join("")}
        </div>
            
        
        <div class="sum__price flex space-between items-center">
            <p class="cart__price">Total Price: </p>
            <p class="cart__price--price">$${cartItems.reduce((sum, item) => {
                 return sum + (item.price * item.quantity)
            }, 0)}</p>
        </div>

        <button class="cart__complete" data-open="open_modal">Complete Order</button>
    `

    
}


const renderMenuItems = (menuArray) => {
    return menuArray.map((menuItem) => {
        return `
        <div class="menu__item flex space-between items-center">
            <div class="menu__content flex items-center">
                <div class="menu__img">
                    ${menuItem.emoji}
                </div>
                <div class="menu__text flex-col">
                    <h2 class="menu__item-head">${menuItem.name}</h2>
                    <p class="menu__item-desc">${menuItem.ingredients.map((ingredient) => ingredient).join(", ")}</p>
                    <p class="menu__item-price">$${menuItem.price}</p>
                </div>
            </div>


            <div class="menu__button" data-add=${menuItem.id}>
                <i class="fa-solid fa-plus" data-add=${menuItem.id}></i>
            </div>
        </div>
        `
    }).join("")
}


document.getElementById('menu-items').innerHTML = renderMenuItems(menuArray);