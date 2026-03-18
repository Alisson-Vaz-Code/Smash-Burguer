const menu = document.getElementById("MENU");
const cartBtn = document.getElementById("cart-btn");
const cartModal = document.getElementById("cart-modal");
const cartItemsContainer = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const checkoutBtn = document.getElementById("checkout-btn");
const closeModalBtn = document.getElementById("close-modal-btn");
const cartCounter = document.getElementById("cart-count");
const addressInput = document.getElementById("address");
const addressWarn = document.getElementById("address-warn");
const cartIcon = document.getElementById("cart-icon");
const statusSpan = document.getElementById("date-span");
const paymentSelect = document.getElementById("payment");
const paymentWarn = document.getElementById("payment-warn");

let cart = [];

// ADICIONAR NO CARRINHO
document.querySelectorAll(".add-to-cart-btn").forEach((button) => {
  button.addEventListener("click", function () {
    const name = this.getAttribute("data-name");
    const price = parseFloat(this.getAttribute("data-price"));

    addToCart(name, price);

    // animação no botão clicado
    this.classList.add("btn-bounce");

    setTimeout(() => {
      this.classList.remove("btn-bounce");
    }, 300);
  });
});

// nova
function flyToCart(imgElement) {
  const cart = document.getElementById("cart-icon");
  const imgRect = imgElement.getBoundingClientRect();
  const cartRect = cart.getBoundingClientRect();

  const flyingImg = imgElement.cloneNode();

  flyingImg.classList.add("fly-img");

  flyingImg.style.top = imgRect.top + "px";
  flyingImg.style.left = imgRect.left + "px";

  document.body.appendChild(flyingImg);

  setTimeout(() => {
    flyingImg.style.top = cartRect.top + "px";
    flyingImg.style.left = cartRect.left + "px";
    flyingImg.style.opacity = "0.3";
  }, 10);

  setTimeout(() => {
    flyingImg.remove();
  }, 800);
}

function addToCart(name, price) {
  const existingItem = cart.find((item) => item.name === name);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      name,
      price,
      quantity: 1,
    });
  }

  updateCart();

  // ANIMAÇÃO
  cartIcon.classList.add("cart-bounce");

  setTimeout(() => {
    cartIcon.classList.remove("cart-bounce");
  }, 300);
}

// ATUALIZAR CARRINHO
function updateCart() {
  cartItemsContainer.innerHTML = "";
  let total = 0;

  cart.forEach((item) => {
    const cartItemElement = document.createElement("div");

    cartItemElement.classList.add(
      "flex",
      "items-center",
      "justify-between",
      "border-b",
      "pb-2",
    );

    cartItemElement.innerHTML = `
    
    <div>
    <p class="font-bold">${item.name}</p>
    <p>Qtd: ${item.quantity}</p>
    <p class="font-medium">R$ ${(item.price * item.quantity).toFixed(2)}</p>
    </div>
    
    <button class="remove-btn text-red-500" data-name="${item.name}">
    Remover
    </button>
    
    `;

    total += item.price * item.quantity;

    cartItemsContainer.appendChild(cartItemElement);
  });

  cartTotal.textContent = total.toFixed(2);

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  cartCounter.textContent = totalItems;
}

// REMOVER ITEM
cartItemsContainer.addEventListener("click", function (event) {
  if (event.target.classList.contains("remove-btn")) {
    const name = event.target.getAttribute("data-name");

    removeItemCart(name);
  }
});

function removeItemCart(name) {
  const index = cart.findIndex((item) => item.name === name);

  if (index !== -1) {
    const item = cart[index];

    if (item.quantity > 1) {
      item.quantity -= 1;
    } else {
      cart.splice(index, 1);
    }
  }

  updateCart();
}

// FECHAR MODAL QUANDO CLICAR FORA

cartModal.addEventListener("click", function (event) {
  if (event.target === cartModal) {
    cartModal.classList.add("hidden");
    cartModal.classList.remove("flex");
  }
});

// ABRIR CARRINHO
cartBtn.addEventListener("click", function () {
  cartModal.classList.remove("hidden");
  cartModal.classList.add("flex");
});

// FECHAR CARRINHO
closeModalBtn.addEventListener("click", function () {
  cartModal.classList.add("hidden");
  cartModal.classList.remove("flex");
});

// VALIDAR ENDEREÇO
addressInput.addEventListener("input", function () {
  if (addressInput.value !== "") {
    addressWarn.classList.add("hidden");
  }
});

// Detectar se a hamburgueria está aberta
function isRestaurantOpen() {
  const now = new Date();

  const day = now.getDay(); // 0 domingo, 5 sexta
  const hour = now.getHours();
  const minutes = now.getMinutes();

  const currentTime = hour * 60 + minutes;

  const openTime = 18 * 60 + 30; // 18:30
  const closeTime = 23 * 60 + 30; // 23:30

  // fechado sexta
  if (day === 5) return false;

  return currentTime >= openTime && currentTime < closeTime;
}

function updateRestaurantStatus() {
  if (isRestaurantOpen()) {
    statusSpan.classList.remove("bg-red-500");
    statusSpan.classList.add("bg-green-600");
  } else {
    statusSpan.classList.remove("bg-green-600");
    statusSpan.classList.add("bg-red-500");
  }
}

// roda na hora
updateRestaurantStatus();

// atualiza a cada minuto
setInterval(updateRestaurantStatus, 60000);

// Numeroo de pedido automatico
function generateOrderNumber() {
  return Math.floor(100 + Math.random() * 900);
}

paymentSelect.addEventListener("change", function () {
  paymentWarn.classList.add("hidden");
});

// FINALIZAR PEDIDO
checkoutBtn.addEventListener("click", function () {
  if (cart.length === 0) return;

  if (addressInput.value === "") {
    addressWarn.classList.remove("hidden");
    return;
  }

  if (!isRestaurantOpen()) {
    alert(
      "❌ Estamos fechados agora.\nFuncionamos de 18:30 às 23:30 (exceto sexta).",
    );
    return;
  }

  if (paymentSelect.value === "") {
    paymentWarn.classList.remove("hidden");
    return;
  }

  const orderNumber = generateOrderNumber();

  let total = 0;

  let message = `🍔 Novo Pedido #${orderNumber}\n\n`;

  cart.forEach((item) => {
    message += `${item.name} (x${item.quantity}) - R$ ${(item.price * item.quantity).toFixed(2)}\n`;
    total += item.price * item.quantity;
  });

  const mapsLink =
    "https://www.google.com/maps/search/?api=1&query=" +
    encodeURIComponent(addressInput.value);

  message += `\n📍 Endereço: ${addressInput.value}\n`;
  message += `🗺️ Ver no mapa:\n${mapsLink}\n`;
  message += `\n💰 Total: R$ ${total.toFixed(2)}`;
  message += `💳 Pagamento: ${paymentSelect.value}\n`;

  const phone = "5599981403409";

  window.open(
    `https://wa.me/${phone}?text=${encodeURIComponent(message)}`,
    "_blank",
  );
});
