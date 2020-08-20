window.addEventListener('DOMContentLoaded', (event) => {
    const mainContainer = document.querySelector(".greetings");
    if (!mainContainer) return;

    // Redirecting to home page if page is reload
    if (localStorage.length == 0) {
        mainContainer.innerHTML = "";
        window.location.replace("../../index.html");
    }

    // Finding DOM destination elements to fill with data
    const nameElt = document.querySelector(".greetings__name");
    const emailElt = document.querySelector(".greetings__email");
    const priceElt = document.querySelector(".greetings__total");
    const orderElt = document.querySelectorAll(".greetings__orderId");
    const destination = document.querySelector(".greetings__destination");

    if (!nameElt || !emailElt || !priceElt || !orderElt || !destination) return;

    // Getting informations from localStorage and assigning its values to corresponding DOM elements
    const orderRecap = JSON.parse(localStorage.getItem('orderRecap'));

    nameElt.textContent = orderRecap.contact.firstName;
    emailElt.textContent = orderRecap.contact.email;

    orderElt.forEach(element => {
        element.textContent = orderRecap.orderId;
    })

    // Getting every product from products recap array
    const orderedProducts = orderRecap.products;

    // Finding all the possible local keys
    let localNames = [];
    orderedProducts.forEach(product => {
        product.colors.forEach(color => {
            color = color.replace(/\s/g, "");
            let newName = product.name + color;
            if (localNames.indexOf(newName) == -1) {
                localNames.push(newName);
            }
        })
    });

    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        const actualName = JSON.parse(localStorage.getItem(key)).name;
        localNames.forEach(name => {
            if (key == name) {
                const productElt = document.createElement("div");
                productElt.classList.add("greetings__product");
                const quantity = JSON.parse(localStorage.getItem(key)).quantity;
                productElt.innerHTML = `<p>$${actualName}</p><p>${quantity}</p>`;
                destination.appendChild(productElt);
            }
        })
    }

    priceElt.textContent = localStorage.getItem("price");

    // Once geeting content in created, empty localStorage
    // localStorage.clear();
});