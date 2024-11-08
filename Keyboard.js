class Keyboard {

    constructor(field, action) {
        this.field = field;
        this.submit = function () {};
        if (action) this.submit = action;
        this.characters = 
        [
            [1, 2, 3, 4, 5, 6, 7, 8, 9, 0, "&#10006;"],
            ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "å", "&#9003;"],
            ["a", "s", "d", "f", "g", "h", "j", "k", "l", "ö", "ä", "Enter"],
            ["z", "x", "c", "v", "b", "n", "m", ",", ".", "-"]

        ];

        this.initStructure();
    }

    initStructure() {
        const container = document.createElement("div");
        container.classList.add("keyboard");

        this.characters.forEach(row => {
            const rowContainer = document.createElement("div");
            row.forEach(character => {
                const key = document.createElement("span");
                key.innerHTML = character;
                if (character == "&#10006;") key.classList.add("close");

                key.classList.add("key");
                key.addEventListener("click",  (event) => {
                    this.setField(event.target.innerHTML);
                });
                container.appendChild(key);

                
            })
            const br = document.createElement("br");
            container.appendChild(br);
           
        })
        const space = document.createElement('span');
        space.innerHTML = " ";
        space.classList.add("key");
        space.classList.add("spacebar");
        container.appendChild(space);

        space.addEventListener("click",  (event) => {
            this.setField(event.target.innerHTML);
        });

        this.container = container;

    }

    setField(value) {

        const selection = this.field.selectionStart;
       

        if (value === "⌫") {

            if (this.field.selectionEnd != this.field.selectionStart) {
                let diff = this.field.selectionEnd - this.field.selectionStart;
                console.log(diff)
                this.field.value = this.field.value.slice(0, (this.field.selectionEnd - diff)) + this.field.value.slice(this.field.selectionEnd);
                return;
            }

            this.field.value = this.field.value.slice(0, selection - 1) + this.field.value.slice(selection);
            this.field.selectionStart = selection - 1;
            return;
        }

        else if (value === "Enter") {
            this.submit();
            return;
        }

        else if (value === "✖") {
            this.container.classList.remove("visible");
            return;
        }

        if (this.field.selectionEnd != this.field.selectionStart) {

            this.field.value = value;
            return;
        }

        
        
        this.field.value = this.field.value.slice(0, selection) + value +  this.field.value.slice(selection);
        

    }

    updateField(field) {
        this.field = field;
    }
    

    outHTML() {
        return this.container;
    }

}