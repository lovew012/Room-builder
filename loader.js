window.addEventListener("load", init);
let product;
let index;

function init() {
    let params = new URLSearchParams(document.location.search);

    index = 0;

    const artnr = params.get('ref');

    product = getProduct(artnr);

    function getProduct(artnr) {

        let target;
        products.forEach(product => {
            if (product.artnr == artnr) target = product;
        });
        return target;
    }

    const field = document.querySelector("#searchbar");
   
    const keyboard = new Keyboard(field);

    document.querySelector("#product-body").appendChild(keyboard.outHTML());

    field.addEventListener("focus", () => {
        document.querySelector(".keyboard").classList.add("visible");

    })

    loadContent();
}

function loadContent() {

    document.querySelector("#img-wrapper-carousel img").src = product.imgsource[0];

    document.querySelector("#button-prev").addEventListener('click', prevSlide);
    document.querySelector("#button-next").addEventListener('click', nextSlide);

    document.querySelector("#product-block-top h1").innerText = product.title;
    document.querySelector("#span-artnr").innerText = product.artnr;
    document.querySelector("#span-price").innerText = product.price;
    document.querySelector("#span-material").innerText = product.material;

    product.colors.forEach(color => {
        const colorElement = document.createElement("div");
        colorElement.style.background = color;
        colorElement.classList.add("product-color-input");
        colorElement.addEventListener("click", setImage);
        document.querySelector("#display-colors").appendChild(colorElement);
    })
    
    document.querySelector("#description").innerText = product.description;
    document.querySelector("#map").src = product.locationmap;
    document.querySelector("#row-length").innerText = toDecimal(product.dimensions.length);
    document.querySelector("#row-width").innerText = toDecimal(product.dimensions.width);
    document.querySelector("#row-height").innerText = toDecimal(product.dimensions.height);

    document.querySelector("#anchor-3dfy").href = "index.html?display=" + product.artnr;

    function toDecimal(value) {
        return value.toLocaleString("pt-SE")+ "m";
    }



}

function prevSlide() {

    if (this.classList.contains("disabled")) return;

    document.querySelector("#button-prev").classList.remove("disabled");
    document.querySelector("#button-next").classList.remove("disabled");
    

    index--;

    
    
    setImage();

}

function nextSlide() {

    if (this.classList.contains("disabled")) return;

    document.querySelector("#button-prev").classList.remove("disabled");
    document.querySelector("#button-next").classList.remove("disabled");

    

    index++;

    
    
    setImage();
}

function setImage() {
    let arr = Array.from(document.querySelectorAll("#display-colors div"));

    if (this.parentElement == document.querySelector("#display-colors")) {

        index = arr.indexOf(this);
    }

    if (index === 0) document.querySelector("#button-prev").classList.add("disabled");
    else document.querySelector("#button-prev").classList.remove("disabled");
    if (index ===  arr.length -1) document.querySelector("#button-next").classList.add("disabled");
    else document.querySelector("#button-next").classList.remove("disabled");
    document.querySelector("#img-wrapper-carousel img").src = product.imgsource[index];
}