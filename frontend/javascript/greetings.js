window.addEventListener('DOMContentLoaded', (event) => {
    const mainContainer = document.querySelector(".greetings");
    if (!mainContainer) return;

    if (localStorage.length == 0) {
        mainContainer.innerHTML = "";
        window.location.replace("../../index.html");
    }

    const nameElt = document.querySelector(".greetings__name");
    const emailElt = document.querySelector(".greetings__email");
    const priceElt = document.querySelector(".greetings__total");
    const orderElt = document.querySelectorAll(".greetings__orderId");
    const destination = document.querySelector(".greetings__destination");

    if (!nameElt || !emailElt || !priceElt || !orderElt || !destination) return;

    const orderRecap = JSON.parse(localStorage.getItem('orderRecap'));

    nameElt.textContent = orderRecap.contact.firstName;
    emailElt.textContent = orderRecap.contact.email;

    orderElt.forEach(element => {
        element.textContent = orderRecap.orderId;
    })

    const orderedProducts = orderRecap.products;
    orderedProducts.forEach(element => {
        const productElt = document.createElement("div");
        productElt.classList.add("greetings__product");
        productElt.innerHTML = `<p>${element.name}</p>
        <p></p>`;
        destination.appendChild(productElt);
    })
    localStorage.clear();
});