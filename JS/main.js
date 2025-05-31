let category_nav_list = document.querySelector(".category_nav_list");

function Open_Categ_list(){
    category_nav_list.classList.toggle("active")

}

let nav_links = document.querySelector(".nav_links")

function open_Menu() {
    nav_links.classList.toggle("active")
}


var cart = document.querySelector('.cart');

function open_close_cart() {
    cart.classList.toggle("active")
}

fetch('products.json')
.then(response => response.json())
.then(data => {
    
    const addToCartButtons = document.querySelectorAll(".btn_add_cart")

    addToCartButtons.forEach(button =>{
        button.addEventListener("click", (event) => {
            const productId = event.target.getAttribute('data-id')
            const selcetedProduct = data.find(product => product.id == productId)
            

            addToCart(selcetedProduct)

            const allMatchingButtons = document.querySelectorAll(`.btn_add_cart[data-id="${productId}"]`)

            allMatchingButtons.forEach(btn =>{
                btn.classList.add("active")
                btn.innerHTML = `      <i class="fa-solid fa-cart-shopping"></i> Item in cart`
            })
        })
    })
    
    
})


function addToCart(product) {
    showLoading();
    setTimeout(() => {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        cart.push({...product, quantity: 1});
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCart();
        hideLoading();
        showAlert('تمت إضافة المنتج إلى السلة بنجاح', '#1abc9c');
    }, 500);
}



function updateCart() {
    const cartItemsContainer = document.getElementById("cart_items")

    const cart = JSON.parse(localStorage.getItem('cart')) || []


    var total_Price = 0
    var total_count = 0

    cartItemsContainer.innerHTML = "" ;
    cart.forEach((item , index) => {

        let total_Price_item = item.price * item.quantity;

        total_Price += total_Price_item
        total_count += item.quantity

    
        cartItemsContainer.innerHTML += `
        
            <div class="item_cart">
                <img src="${item.img}" alt="">
                <div class="content">
                    <h4>${item.name}</h4>
                    <p class="price_cart">$${total_Price_item}</p>
                    <div class="quantity_control">
                        <button class="decrease_quantity" data-index=${index}>-</button>
                        <span class="quantity">${item.quantity}</span>
                        <button class="Increase_quantity" data-index=${index}>+</button>
                    </div>
                </div>

                <button class="delete_item" data-inex="${index}" ><i class="fa-solid fa-trash-can"></i></button>
            </div>


        `
    })


    const price_cart_total = document.querySelector('.price_cart_toral')
    
    const count_item_cart = document.querySelector('.Count_item_cart')

    const count_item_header = document.querySelector('.count_item_header')
    
    price_cart_total.innerHTML = `$ ${total_Price}`

    count_item_cart.innerHTML = total_count

    count_item_header.innerHTML = total_count


    const increaseButtons = document.querySelectorAll(".Increase_quantity")
    const decreaseButtons = document.querySelectorAll(".decrease_quantity")

    increaseButtons.forEach(button => {
        button.addEventListener("click" , (event) =>{
            const itemIndex = event.target.getAttribute("data-index")
            increaseQuantity(itemIndex)
        })
    })


    decreaseButtons.forEach(button => {
        button.addEventListener("click" , (event) =>{
            const itemIndex = event.target.getAttribute("data-index")
            decreaseQuantity(itemIndex)
        })
    })



    const delteButtons = document.querySelectorAll('.delete_item')
    
    delteButtons.forEach(button =>{
        button.addEventListener('click' , (event) =>{
            const itemIndex = event.target.closest('button').getAttribute('data-inex')
            removeFromCart(itemIndex)
        })
    })

}


function increaseQuantity(index){
    let cart = JSON.parse(localStorage.getItem('cart')) || []
    cart[index].quantity += 1
    localStorage.setItem('cart' , JSON.stringify(cart))
    updateCart()
}

function decreaseQuantity(index){
    let cart = JSON.parse(localStorage.getItem('cart')) || []

    if (cart[index].quantity > 1){
        cart[index].quantity -= 1
    }
 
    localStorage.setItem('cart' , JSON.stringify(cart))
    updateCart()
}





function removeFromCart(index) {
    showLoading();
    setTimeout(() => {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const removeProduct = cart.splice(index, 1)[0];
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCart();
        updateButoonsState(removeProduct.id);
        hideLoading();
        showAlert('تم حذف المنتج من السلة', '#e74c3c');
    }, 500);
}


function updateButoonsState(productId) {
    const allMatchingButtons = document.querySelectorAll(`.btn_add_cart[data-id="${productId}"]`)
    allMatchingButtons.forEach(button =>{
        button.classList.remove('active');
        button.innerHTML = `      <i class="fa-solid fa-cart-shopping"></i> add to cart`
    })
}

updateCart()

document.addEventListener('DOMContentLoaded', function() {
    // زر Checkout
    const checkoutBtn = document.querySelector('.btn_cart.btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const cart = JSON.parse(localStorage.getItem('cart')) || [];
            if (cart.length === 0) {
                showAlert('السلة فارغة!');
                return;
            }
            showLoading();
            // تجهيز بيانات CSV
            let csv = 'اسم المنتج,الكمية,السعر\n';
            cart.forEach(item => {
                csv += `${item.name},${item.quantity},${item.price}\n`;
            });
            // إرسال الطلبية إلى السيرفر
            const formData = new FormData();
            formData.append('order', new Blob([csv], { type: 'text/csv' }), 'order.csv');
            fetch('send_order.php', {
                method: 'POST',
                body: formData
            })
            .then(res => res.text())
            .then(response => {
                hideLoading();
                if (response.trim() === 'success') {
                    showAlert('تم إرسال الطلبية بنجاح! سيتم التواصل معك عبر البريد الإلكتروني.', '#1abc9c');
                    localStorage.removeItem('cart');
                    updateCart();
                } else {
                    showAlert('حدث خطأ أثناء إرسال الطلبية. حاول لاحقاً.');
                }
            })
            .catch(() => {
                hideLoading();
                showAlert('تعذر الاتصال بالخادم.');
            });
        });
    }

    // Traduction des boutons Login/Sign Up
    document.querySelectorAll('.btns .btn').forEach(btn => {
        if (btn.textContent.includes('Login')) {
            btn.innerHTML = 'Connexion <i class="fa-solid fa-right-to-bracket"></i>';
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                showAlert('La connexion est en cours de développement.');
            });
        }
        if (btn.textContent.includes('Sign UP')) {
            btn.innerHTML = 'Créer un compte <i class="fa-solid fa-user-plus"></i>';
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                showAlert('La création de compte est en cours de développement.');
            });
        }
    });

    // Traduction du bouton Checkout
    let checkoutBtnFr = document.querySelector('.btn_cart.btn');
    if (checkoutBtnFr) {
        checkoutBtnFr.innerHTML = 'Commander';
        checkoutBtnFr.addEventListener('click', function(e) {
            e.preventDefault();
            const cart = JSON.parse(localStorage.getItem('cart')) || [];
            if (cart.length === 0) {
                showAlert('Le panier est vide !');
                return;
            }
            showLoading();
            let csv = 'Nom du produit,Quantité,Prix\n';
            cart.forEach(item => {
                csv += `${item.name},${item.quantity},${item.price}\n`;
            });
            const formData = new FormData();
            formData.append('order', new Blob([csv], { type: 'text/csv' }), 'order.csv');
            fetch('send_order.php', {
                method: 'POST',
                body: formData
            })
            .then(res => res.text())
            .then(response => {
                hideLoading();
                if (response.trim() === 'success') {
                    showAlert('Commande envoyée avec succès ! Vous serez contacté par email.', '#1abc9c');
                    localStorage.removeItem('cart');
                    updateCart();
                } else {
                    showAlert('Une erreur est survenue lors de l\'envoi de la commande.');
                }
            })
            .catch(() => {
                hideLoading();
                showAlert('Impossible de contacter le serveur.');
            });
        });
    }

    // Traduction du bouton Shop More
    const shopMoreBtn = document.querySelector('.btn_cart.trans_bg.btn');
    if (shopMoreBtn) {
        shopMoreBtn.innerText = 'Continuer vos achats';
    }

    // Traduction de la recherche
    const searchForm = document.querySelector('.search_box');
    if (searchForm) {
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const searchValue = document.getElementById('search').value.trim().toLowerCase();
            if (!searchValue) {
                showAlert('Veuillez saisir un mot-clé pour la recherche.');
                return;
            }
            showLoading();
            fetch('products.json')
                .then(res => res.json())
                .then(data => {
                    const results = data.filter(product => product.name.toLowerCase().includes(searchValue));
                    hideLoading();
                    if (results.length === 0) {
                        showAlert('Aucun résultat trouvé.');
                    } else {
                        let msg = 'Résultats de la recherche :\n';
                        results.forEach(p => {
                            msg += `- ${p.name} ($${p.price})\n`;
                        });
                        alert(msg);
                    }
                });
        });
    }

    // Traduction des alertes Wishlist
    document.querySelectorAll('.icon_product').forEach(icon => {
        icon.addEventListener('click', function(e) {
            e.preventDefault();
            icon.classList.toggle('active');
            if (icon.classList.contains('active')) {
                showAlert('Produit ajouté à la liste de souhaits.', '#1abc9c');
            } else {
                showAlert('Produit retiré de la liste de souhaits.', '#e74c3c');
            }
        });
    });
});

// ====== مؤشرات التحميل والتنبيهات ======
// عنصر overlay للتحميل
const loadingOverlay = document.createElement('div');
loadingOverlay.style.position = 'fixed';
loadingOverlay.style.top = 0;
loadingOverlay.style.left = 0;
loadingOverlay.style.width = '100vw';
loadingOverlay.style.height = '100vh';
loadingOverlay.style.background = 'rgba(255,255,255,0.7)';
loadingOverlay.style.display = 'flex';
loadingOverlay.style.alignItems = 'center';
loadingOverlay.style.justifyContent = 'center';
loadingOverlay.style.zIndex = 9999;
loadingOverlay.style.fontSize = '2rem';
loadingOverlay.style.color = '#db0000';
loadingOverlay.style.display = 'none';
loadingOverlay.innerHTML = '<div class="loader"></div>';
document.body.appendChild(loadingOverlay);

function showLoading() {
    loadingOverlay.style.display = 'flex';
}
function hideLoading() {
    loadingOverlay.style.display = 'none';
}

// عنصر للتنبيهات
const alertDiv = document.createElement('div');
alertDiv.style.position = 'fixed';
alertDiv.style.top = '30px';
alertDiv.style.left = '50%';
alertDiv.style.transform = 'translateX(-50%)';
alertDiv.style.background = '#db0000';
alertDiv.style.color = '#fff';
alertDiv.style.padding = '12px 30px';
alertDiv.style.borderRadius = '5px';
alertDiv.style.fontSize = '1.1rem';
alertDiv.style.zIndex = 10000;
alertDiv.style.display = 'none';
document.body.appendChild(alertDiv);

function showAlert(msg, color = '#db0000') {
    alertDiv.innerText = msg;
    alertDiv.style.background = color;
    alertDiv.style.display = 'block';
    setTimeout(() => {
        alertDiv.style.display = 'none';
    }, 1800);
}