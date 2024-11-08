

window.addEventListener("load", init);


function init() {
    const filters = document.querySelectorAll("#assortment-filter");

    filters.forEach(input => {
        input.addEventListener("change", checkFilters);
    });

    filteredproducts = products;
    outputProducts(products);

    const field = document.querySelector("#searchbar");
   
    const keyboard = new Keyboard(field);

    document.querySelector("#assortment-body").appendChild(keyboard.outHTML());

    field.addEventListener("focus", () => {
        document.querySelector(".keyboard").classList.add("visible");

    })

}

function checkFilters() {
    const filters = document.querySelectorAll("#assortment-filter select");

    let appliedFilters = [null, null, null, null];

    for (let i = 0; i < filters.length; i++) {
        if (filters[i].value != "") appliedFilters[i] = filters[i].value
    }

    filter(appliedFilters);
}

function outputProducts(array) {



    if (array.length === 0) {
        document.querySelector("#assortment-products").innerHTML = "<p>Vi hittade inga möbler som uppfyller dina önskemål. Pröva att <a href='assortment.html'>rensa filter.</a></p>";
        return;
    }

    array.forEach(product => {
        const card = new ProductCard(product);

        const li = document.createElement("li");
        const a = document.createElement("a");
        a.href = "product.html?ref=" + product.artnr;
        const HTML = card.toHTML();
        li.appendChild(HTML);
        a.appendChild(li);


        document.querySelector("#assortment-products").appendChild(a);
    });
}

function filter(appliedFilters) {

    document.querySelector("#assortment-products").innerHTML = "";
    console.log(appliedFilters)
    sort(appliedFilters);
}

function sort(appliedFilters) {

    filteredproducts = [products[0], products[1], products[2], products[3]];


    if (appliedFilters[0] != null){
        for (let i = 0; i < filteredproducts.length; i++) {
            if (filteredproducts[i].artnr.substring(0, 1) === appliedFilters[0]){
                continue
                 };

            filteredproducts.splice(i, 1);
            i--;

        }
    }

    

    if (appliedFilters[1] != null){

        for (let i = 0; i < filteredproducts.length; i++) {
            if (filteredproducts[i].colorcategories.includes(appliedFilters[1])) continue;
            filteredproducts.splice(i, 1);
            i--;
        }
    }

    if (appliedFilters[2] != null){

        for (let i = 0; i < filteredproducts.length; i++) {
            if (filteredproducts[i].price < appliedFilters[2]) continue;
            filteredproducts.splice(i, 1);
            i--;
        }
    }

    if (appliedFilters[3] != null){

        for (let i = 0; i < filteredproducts.length; i++) {
            if (filteredproducts[i].material ==  appliedFilters[3]) continue;
            filteredproducts.splice(i, 1);
            i--;
        }
    }

    outputProducts(filteredproducts);
}



