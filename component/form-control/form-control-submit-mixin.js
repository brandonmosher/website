export const submitMixin = {
    _control: function() {
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
            form.querySelectorAll('form-control:not([type=submit])').forEach((node, i, arr) => {
                const duration = i / (2 * arr.length);
                const delay = (arr.length - i) / (3 * arr.length);
                node.style.transition = `opacity ${duration}s ${delay}s, max-height ${duration}s ${delay}s, padding ${duration}s ${delay}s, margin ${duration}s ${delay}s, overflow ${duration}s ${delay}s`;
                node.style.opacity = 0;
                node.style.maxHeight = '0';
                node.style.padding = '0';
                node.style.margin = '0';
                node.style.overflow = 'hidden';
            });

        } catch (error) {
            console.error(error);
        }
    }
};
