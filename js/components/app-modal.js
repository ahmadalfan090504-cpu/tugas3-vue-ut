Vue.component('app-modal', {
    template: '#tpl-modal',
    data() {
        return {
            visible: false,
            title: '',
            message: '',
            onConfirmCallback: null
        };
    },
    methods: {
        open(title, message, onConfirm) {
            this.title = title;
            this.message = message;
            this.onConfirmCallback = onConfirm;
            this.visible = true;
        },
        confirm() {
            if (typeof this.onConfirmCallback === 'function') {
                this.onConfirmCallback();
            }
            this.dismiss();
        },
        dismiss() {
            this.visible = false;
            this.onConfirmCallback = null;
        }
    }
});