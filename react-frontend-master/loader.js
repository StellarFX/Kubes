window.addEventListener("DOMContentLoaded", (e) => {
    const loader = document.getElementsByClassName("loader")[0];

    setTimeout(() => {
        loader.style.opacity = 0;
    }, 1000);

    setTimeout(() => {
        loader.remove();
    }, 2000);
})