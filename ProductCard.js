class ProductCard {
    
    constructor(product) {
        this.artnr = product.artnr;
        this.title = product.title;
        this.imgsource = product.imgsource;
        this.imgalt = product.imgalt;
        this.colors = product.colors;
        this.price = product.price;
    }

    toHTML() {
        const wrapper = document.createElement("div");
        wrapper.classList.add('productcard');
        const img = document.createElement("img");
        img.src = this.imgsource[0];
        img.alt = this.imgalt;

        const imgwrapper = document.createElement("div");
        imgwrapper.appendChild(img);
        const header = document.createElement("h3");
        header.textContent = this.title;

        const artnr = document.createElement("span");
        artnr.textContent = "artnr: " + this.artnr;

        const price = document.createElement("p");
        price.textContent = this.price + " kr";

        wrapper.appendChild(imgwrapper);
        wrapper.appendChild(header);
        wrapper.appendChild(artnr);
        wrapper.appendChild(price);

        let col = document.createElement("div");
        col.classList.add("card-colors")

        this.colors.forEach(color => {
            const colorElement = document.createElement("div");
            colorElement.style.background = color;
            colorElement.classList.add("product-color-input");
            col.appendChild(colorElement);
        })
        
        wrapper.appendChild(col);

        return wrapper;
    }
}