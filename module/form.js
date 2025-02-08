export let formValidityType = 'core-form-errors'; // Available Types: alert, tooltip, html5, core-input-error, core-form-errors

export const clearMessages = (args) => { // Available Arguments: element
    if(args.element instanceof HTMLInputElement || args.element instanceof HTMLTextAreaElement || args.element instanceof HTMLSelectElement){
        args.element.parentElement.querySelectorAll(".core-input-error").forEach((div) => div.textContent = "");
    }else if(args.element instanceof HTMLFormElement){
        args.element.querySelectorAll(".core-form-errors").forEach((div) => div.textContent = "");
        args.element.querySelectorAll(".core-input-error").forEach((div) => div.textContent = ""); 
    }
}

export const inputHandler = (args) => { // Available Arguments: inputElement, formElement, validityType
    let quiet    = args.formElement && args.formElement instanceof HTMLFormElement;
    let form     = args.formElement || input.closest("form");
    let formData = new FormData(form);
    let pairs    = [];

    if(!quiet){
        clearMessages({element:args.inputElement});
    }

    // Convert FormData to array format
    formData.forEach((value, key) => {
        pairs.push({ name: key, value: value });
    });

    let data   = args.inputElement.dataset;
    let scrubs = data.scrubs ? data.scrubs.split(",") : [];
    let check  = core.sv.scrubEach({ name: args.inputElement.name, value: args.inputElement.value, scrubs: scrubs }, pairs);

    if (!check.success) {
        check.warningSm = `${check.errors.join(", ")}`;
        check.warningLg = `Invalid input for ${check.name.toUpperCase()}: ${check.warningSm}`;
        switch (args.validityType || formValidityType) {
            case 'alert':
                if(!quiet) alert(check.warningLg);
                break;
            case 'tooltip':
                args.inputElement.setAttribute("title", check.warningLg);
                break;
            case 'html5':
                args.inputElement.setCustomValidity(check.warningLg);
                if(!quiet) form.reportValidity();
                setTimeout(() => {
                    args.inputElement.setCustomValidity("");
                }, 3000);
            case 'core-form-errors':
                const uxFormDiv = form.querySelector(".core-form-errors");
                if (uxFormDiv) {
                    // Create a new paragraph element
                    const newParagraph = document.createElement("p");
                    newParagraph.classList.add("text-danger", "mb-0");
                    newParagraph.textContent = check.warningLg;
            
                    // Append the new paragraph to the div
                    uxFormDiv.appendChild(newParagraph);
                } else {
                    console.warn("No .core-form-errors found within the form.");
                }
                break;
            case 'core-input-error':
                const uxInputDiv = args.inputElement.parentElement.querySelector(".core-input-error");
                if (uxInputDiv) {            
                    // Add warning message to the div
                    uxInputDiv.textContent = check.warningSm;
                } else {
                    console.warn("No .core-input-error found within the form.");
                }
                break;  
        }
    } else {
        args.inputElement.value = check.value;
    }

    return check;
};

export const formHandler = (args) => { // Available Arguments: formElement, validityType, formId (unused)
    
    if(args.formElement instanceof HTMLFormElement === false){
        return;
    }

    // Hide the form before cloning
    args.formElement.style.display = "none";

    // Remove event listeners
    const newForm = args.formElement.cloneNode(true);
    args.formElement.replaceWith(newForm); 

    // Add Listener
    newForm.addEventListener("submit", function (e) {
        e.preventDefault();

        clearMessages({element:this});

        // When configured, wait 60 seconds before sending providing spam protection

        if(core.useDebugger) console.log("submitting...");
        const hit = core.cr.getData('hit');
        if(hit){
            let isReady = (core.hf.date(null, 'ts') - 60) > core.cr.getData('hit').ts;
            if (!isReady) {
                if(core.useDebugger) console.log("waiting..." + ((core.hf.date(null, 'ts') - 60) - core.cr.getData('hit').ts));
                return;
            }
        }

        const name   = this.getAttribute("name") || "form";   
        const action = this.getAttribute("action") || core.hf.getRoute('search') || '?' + name + '=submitted';
        const method = this.getAttribute("method") || "POST";

        let nvObj = {};
        let fails = [];

        this.querySelectorAll("input, select, textarea").forEach((inputElement) => {
            let check = inputHandler({inputElement:inputElement, formElement:this, validityType:args.validityType}); //inputElement, formElement, validityType
             //build the name/value object
            if(inputElement.name) nvObj[inputElement.name] = inputElement.value;

            if(!check.success) {
                fails.push(check);
            }
        });

        if (fails.length) {
            switch (args.validityType || formValidityType) {
                case 'alert':
                    console.log(fails);
                    alert(fails.map(f => f.warningLg).join("\n"));
                    break;
                case 'html5':
                    this.reportValidity();
            }
        } else {
            core.be.getData(name, action, { data: nvObj, method: method, isFormData: true });
        }
    });

    // Show the form again
    newForm.style.display = ""; 
};
