export let formValidityType = 'core-form-errors'; // Available Types: alert, tooltip, html5, core-input-error, core-form-errors
let hit;

export const clearMessages = ({ element }) => {
    // Define error selectors
    const selectors = ['.core-input-error'];
    const isFormElement = element instanceof HTMLFormElement;
    
    // Add form-specific selector if element is a form
    if (isFormElement) {
        selectors.push('.core-form-errors');
    }
    
    // Get parent element for searching (form or input's parent)
    const searchElement = isFormElement ? element : element.parentElement;
    
    // Skip if element is not valid
    if (!searchElement) return;
    
    // Clear all error messages
    selectors.forEach(selector => 
        searchElement.querySelectorAll(selector)
            .forEach(div => div.textContent = '')
    );
};

export const inputHandler = ({ inputElement, formElement, validityType }) => {
    const quiet = formElement && formElement instanceof HTMLFormElement;
    const form = formElement || inputElement.closest("form");
    
    // Early return if no form found
    if (!form) return null;
    
    // Clear messages if not in quiet mode
    if (!quiet) {
        clearMessages({ element: inputElement });
    }

    // Get form data
    const pairs = Array.from(new FormData(form), ([key, value]) => ({
        name: key,
        value: value
    }));

    // Process input data and scrubs
    const { dataset, name, value } = inputElement;
    const scrubs = dataset.scrubs?.split(",") || [];
    const check = core.sv.scrubEach({ name, value, scrubs }, pairs);

    if (check.success) {
        inputElement.value = check.value;
        return check;
    }

    // Handle validation errors
    check.warningSm = check.errors.join(", ");
    check.warningLg = `Invalid input for ${check.name.toUpperCase()}: ${check.warningSm}`;

    handleValidationError({
        type: validityType || formValidityType,
        check,
        inputElement,
        form,
        quiet
    });

    return check;
};

// Separate validation error handling
const handleValidationError = ({ type, check, inputElement, form, quiet }) => {
    const handlers = {
        alert: () => {
            if (!quiet) alert(check.warningLg);
        },
        tooltip: () => {
            inputElement.setAttribute("title", check.warningLg);
        },
        html5: () => {
            inputElement.setCustomValidity(check.warningLg);
            if (!quiet) form.reportValidity();
            setTimeout(() => inputElement.setCustomValidity(""), 3000);
        },
        'core-form-errors': () => {
            const formErrorsDiv = form.querySelector(".core-form-errors");
            if (!formErrorsDiv) {
                console.warn("No .core-form-errors found within the form.");
                return;
            }

            const errorParagraph = document.createElement("p");
            errorParagraph.classList.add("text-danger", "mb-0");
            errorParagraph.textContent = check.warningLg;
            formErrorsDiv.appendChild(errorParagraph);
        },
        'core-input-error': () => {
            const inputErrorDiv = inputElement.parentElement.querySelector(".core-input-error");
            if (!inputErrorDiv) {
                console.warn("No .core-input-error found within the form.");
                return;
            }

            inputErrorDiv.textContent = check.warningSm;
        }
    };

    const handler = handlers[type];
    if (handler) handler();
};

export const formHandler = ({ formElement, validityType }) => {
    hit = core.cr.getData('hit') || core.cr.setData('hit',{'ts': core.hf.date(null, 'ts')});

    // Early return if not a form element
    if (!(formElement instanceof HTMLFormElement)) return;

    // Create new form with removed event listeners
    const newForm = replaceForm(formElement);
    
    // Add submit handler
    newForm.addEventListener("submit", (e) => handleSubmit(e, validityType));
};

const replaceForm = (form) => {
    const newForm = form.cloneNode(true);
    form.replaceWith(newForm);
    return newForm;
};

const isSubmissionReady = () => {
    let isReady = true;
    let waitTime;

    if (core.useDebugger) console.log("submitting...");

    if(hit && hit.hasOwnProperty('ts')){
        waitTime = (core.hf.date(null, 'ts') - 10) - hit.ts;
        isReady = waitTime >= 0;
    }

    if (!isReady) {
        handleValidationFailures([{warningLg:'Please try again in T' + waitTime}], 'alert')
        if(core.useDebugger) console.log(`waiting... ` + waitTime);
    }
    
    return isReady;
};

const getFormAttributes = (form) => ({
    name: form.getAttribute("name") || "form",
    action: form.getAttribute("action") || core.hf.getRoute('search') || `?${form.getAttribute("name") || "form"}=submitted`,
    method: form.getAttribute("method") || "POST"
});

const handleSubmit = (e, validityType) => {
    e.preventDefault();
    const form = e.currentTarget;
    
    clearMessages({ element: form });

    const { name, action, method } = getFormAttributes(form);
    const { nvObj, fails } = processFormInputs(form, validityType);

    if (fails.length) {
        handleValidationFailures(fails, validityType, form);
        return;
    }
    
    // Check simple spam protection
    if (!isSubmissionReady()) return;

    // Submit form data
    core.be.getData(name, action, { 
        data: nvObj, 
        method: method, 
        isFormData: true 
    });
};

const processFormInputs = (form, validityType) => {
    const nvObj = {};
    const fails = [];

    form.querySelectorAll("input, select, textarea").forEach(inputElement => {
        const check = inputHandler({
            inputElement,
            formElement: form,
            validityType
        });

        if (inputElement.name) {
            nvObj[inputElement.name] = inputElement.value;
        }

        if (!check.success) {
            fails.push(check);
        }
    });

    return { nvObj, fails };
};

const handleValidationFailures = (fails, validityType, form) => {
    const handlers = {
        'alert': () => {
            alert(fails.map(f => f.warningLg).join("\n"));
        },
        'html5': () => {
            form.reportValidity();
        }
    };

    const handler = handlers[validityType || formValidityType];
    if (handler) handler();
};