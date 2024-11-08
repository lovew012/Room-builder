window.addEventListener("load", init);

function init() {
    document.querySelector("#searchbar").addEventListener("input", search); 
    document.querySelector("#searchbar").addEventListener("blur", search); 
    window.addEventListener("click", checkTarget);
}

function search() {
    const field = document.querySelector("#searchbar");
    let query = field.value.toLowerCase();

    document.querySelector("#resultlist").innerHTML = "";

    if (query === "") return;

    products.forEach(insert => {
        if (insert.title.toLowerCase().includes(query)  || insert.artnr.toLowerCase().includes(query) || insert.material.toLowerCase().includes(query) || insert.description.toLowerCase().includes(query)) {
            const litem = document.createElement("li");
            const an = document.createElement("a");
            an.href = "product.html?ref=" + insert.artnr; 

            const sp = document.createElement("span");
            sp.style.backgroundImage="url(" + insert.imgsource[0] + ")";
            
            const txt = document.createTextNode(insert.title + " | " + insert.description);
            an.appendChild(sp);
            an.appendChild(txt);
            
            litem.appendChild(an);
            
            document.querySelector("#resultlist").appendChild(litem);
        }
        else {
           
        }
    })
    if ( document.querySelector("#resultlist").innerHTML == "") {
        const feed = document.createElement("li");
        feed.innerText = "Vi hittade inga möbler som matchar din sökterm...";
        document.querySelector("#resultlist").appendChild(feed);
    }

    
}

function checkTarget(e) {
    if (e.target.classList.contains("key")) {
        search();
    }
}