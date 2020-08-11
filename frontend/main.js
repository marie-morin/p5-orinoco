function displayToogleNavigation() {
    const links = document.querySelector("#myLinks");
    if (links.style.display === "block") {
        links.style.display = "none";
    } else {
        links.style.display = "block";
        links.style.position = "absolute";

        if (window.innerWidth > 420) {
            links.style.top = "64px";
        } else {
            links.style.top = "109px";
        }
        // links.style.textAlign = "right";
    }
}

document.getElementById("burger").addEventListener("click", displayToogleNavigation);