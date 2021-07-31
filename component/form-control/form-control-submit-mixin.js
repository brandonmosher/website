export const submitMixin = {
    _control: function () {
        this.addEventListener("click", (e) => this.handleFormSubmit(e));
        return document.createElement("input");;
    },

    async postFormJSON(form) {
        const url = form.action;
        const formData = new FormData(form);
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(Object.fromEntries(formData.entries())),
        });

        if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(errorMessage);
        }

        return response.json();
    },

    async handleFormSubmit(e) {
        e.preventDefault();
        const form = this.closest("form");

        if (!form.reportValidity() || this.hasAttribute("disabled")) {
            return;
        }

        try {
            const responseData = await this.postFormJSON(form);
            this.setAttribute('disabled', '');
            this.removeEventListener('click', this.handleFormSubmit);
            form.dispatchEvent(new Event('submit', { 'bubbles': true, 'cancelable': true }));

        } catch (error) {
            console.error(error);
        }
    }
};
