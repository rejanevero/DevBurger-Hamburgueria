const menu = document.getElementById("menu")
const cartBtn = document.getElementById("cart-btn")
const cartModal = document.getElementById("cart-modal")
const cartItemsContainer = document.getElementById("cart-items")
const cartTotal = document.getElementById("cart-total")
const checkoutBtn = document.getElementById("checkout-btn")
const closeModalBtn = document.getElementById("close-modal-btn")
const cartCounter = document.getElementById("cart-count")
const address = document.getElementById("address")
const addressWarn = document.getElementById("address-warn")


let cart = []

//abrir modal do carrinhos
cartBtn.addEventListener("click", function() {
    updateCartModal();
    cartModal.style.display = "flex"
})

//fechar modal quando clicar fora do modal
cartModal.addEventListener("click", function(event) {
    if(event.target === cartModal){
        cartModal.style.display = "none"
    }
})

//fechar modal quando clicar no botão fechar
closeModalBtn.addEventListener("click", function() {
    cartModal.style.display = "none"
})

menu.addEventListener("click", function(event){
    //captura do campo de produto
    let parentButton = event.target.closest(".add-to-cart-btn")

    if(parentButton){
        const name = parentButton.getAttribute("data-name")
        const price = parseFloat(parentButton.getAttribute("data-price"))

        addToCart(name, price)

    }
})

//função para adicionar no carrinho
function addToCart(name, price){
    //verifica se existe mais de item com mesmo nome
    const existingItems = cart.find(item => item.name === name)

    if(existingItems){
        //se o item já existe, aumenta apenas a quantidade +1
        existingItems.quantity +=1;
        
    }else{
        //se não existir adiciona 1
        cart.push({
            name,
            price,
            quantity: 1,
        })
    }

    //Se adicionou items, faça update na função modal
    updateCartModal()
    
}

//atualizar o cartinhos com as informações do updateCartModal
function updateCartModal(){
    cartItemsContainer.innerHTML = "";
    let total = 0;

    cart.forEach(item => {
        const cartItemElement = document.createElement("div");
        
        cartItemElement.classList.add("felx", "justify-between", "mb-4", "flex-col")

        cartItemElement.innerHTML = `
            <div class="flex items-center justify-between">
                
                <div>
                    <p class="font-medium">${item.name}</p>
                    <p>Qtd: ${item.quantity}</p>
                    <p class="font-medium mt-2">R$ ${item.price.toFixed(2)}</p>
                </div>
                
                <button class="remove-from-cart-btn" data-name="${item.name}">
                    Remover
                </button>
                
            </div>
        `

        total += item.price * item.quantity;

        cartItemsContainer.appendChild(cartItemElement)
    })

    cartTotal.textContent = total.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });

    cartCounter.innerHTML = cart.length;
}

//função para remover o item do carrinhos
cartItemsContainer.addEventListener("click", function(event){
    if(event.target.classList.contains("remove-from-cart-btn")){
        const name = event.target.getAttribute("data-name")
        removeItemCart(name);
    }
})

function removeItemCart(name){
    const index = cart.findIndex(item => item.name === name);

    if(index !== -1){
        const item = cart[index];
        
        if(item.quantity > 1){
            item.quantity -= 1;
            updateCartModal();
            return;
        }

        cart.splice(index, 1);
        updateCartModal();
    }
}

address.addEventListener("input", function(event){
  let inputValue = event.target.value;

  if(inputValue !== ""){
    address.classList.remove("border-red-500")
    addressWarn.classList.add("hidden")
    
  }
})

//finalizar pedido
checkoutBtn.addEventListener("click", function(){

    const isOpen = checkRestaurantOpen();
    if(!isOpen){
        
        Toastify({
            text: "Olá, estamos fechado no momento!",
            duration: 3000,
            close: true,
            gravity: "top",
            position: "center",
            stopOnFocus: true,
            style: {
                backgroud: "linear-gradient(to right, #00b09b, #96c93d",
            },
        }).showToast();

        return;
    }

    if(cart.length === 0) return;
    if(address.value === ""){
        addressWarn.classList.remove("hidden")
        address.classList.add("border-red-500")
        return;
    }

    //enviar o pedido para api do whatsapp
    const cartItems = cart.map((item) => {
        return (
            `${item.name} - Quantidade: ${item.quantity} - Preço: R$${item.price} `
        )
    }).join("")

    const message = encodeURIComponent(cartItems)
    const phone = "85982170079"
    const nomeClient = document.getElementById("nome-client").value;

    window.open(`https://wa.me/${phone}?text=${message} - Nome Cliente: ${nomeClient} - Endereço: ${address.value}`, "_blank")

    cart = [];
    updateCartModal();
})


function checkRestaurantOpen(){
    const data = new Date();
    const hora = data.getHours();
    return hora >= 0 && hora < 12;
    //true = restaurante está aberto
}

const spanItem = document.getElementById("date-span")
const isOpen  = checkRestaurantOpen();

if(isOpen){
    spanItem.classList.remove("bg-red-500");
    spanItem.classList.add("bg-green-600");
}else{
    spanItem.classList.remove("bg-green-600");
    spanItem.classList.add("bg-red-500");
}