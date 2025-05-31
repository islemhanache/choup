fetch('products.json')
.then(response => response.json())
.then(data => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const sections = [
        {
            id: 'swiper_items_sale',
            filter: product => product.old_price,
        },
        {
            id: 'swiper_elctronics',
            filter: product => product.category === 'electronics',
        },
        {
            id: 'swiper_appliances',
            filter: product => product.category === 'appliances',
        },
        {
            id: 'swiper_mobiles',
            filter: product => product.category === 'mobiles',
        },
    ];

    function getProductHTML(product, isInCart) {
        const percent_disc = product.old_price ? Math.floor((product.old_price - product.price) / product.old_price * 100) : null;
        const percent_disc_div = percent_disc ? `<span class="sale_present">%${percent_disc}</span>` : '';
        const old_price_Pargrahp = product.old_price ? `<p class="old_price">$${product.old_price}</p>` : '';
        return `
            <div class="swiper-slide product">
                ${percent_disc_div}
                <div class="img_product">
                    <a href="#"><img src="${product.img}" alt=""></a>
                </div>
                <div class="stars">
                    <i class="fa-solid fa-star"></i>
                    <i class="fa-solid fa-star"></i>
                    <i class="fa-solid fa-star"></i>
                    <i class="fa-solid fa-star"></i>
                    <i class="fa-solid fa-star"></i>
                </div>
                <p class="name_product"><a href="#">${product.name}</a></p>
                <div class="price">
                    <p><span>$${product.price}</span></p>
                    ${old_price_Pargrahp}
                </div>
                <div class="icons">
                    <span class="btn_add_cart ${isInCart ? 'active' : ''}" data-id="${product.id}">
                        <i class="fa-solid fa-cart-shopping"></i> ${isInCart ? 'Item in cart' : 'add to cart'}
                    </span>
                    <span class="icon_product"><i class="fa-regular fa-heart"></i></span>
                </div>
            </div>
        `;
    }

    sections.forEach(section => {
        const container = document.getElementById(section.id);
        if (!container) return;
        container.innerHTML = '';
        data.filter(section.filter).forEach(product => {
            const isInCart = cart.some(cartItem => cartItem.id === product.id);
            container.innerHTML += getProductHTML(product, isInCart);
        });
    });
});