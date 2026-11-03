Vue.component('order-form', {
    template: '#tpl-order',
    props: {
        paket: { type: Array, required: true },
        ekspedisi: { type: Array, required: true }
    },
    data() {
        return {
            selectedOrderPaket: null,
            orderData: {
                nim: '',
                nama: '',
                ekspedisi: '',
                kodePaket: ''
            }
        };
    },
    filters: {
        currencyFormat(val) {
            if (typeof val !== "number") return "Rp 0";
            return "Rp " + val.toLocaleString("id-ID");
        }
    },
    methods: {
        onOrderPaketSelect() {
            this.selectedOrderPaket = this.paket.find(p => p.kodePaket === this.orderData.kodePaket) || null;
        },
        submitOrder() {
            if (!this.orderData.nim || !this.orderData.nama || !this.selectedOrderPaket) {
                alert('Mohon lengkapi formulir pemesanan.');
                return;
            }
            const newOrderPayload = {
                nim: this.orderData.nim,
                nama: this.orderData.nama,
                ekspedisi: this.orderData.ekspedisi,
                paket: this.selectedOrderPaket
            };
            this.$emit('created', newOrderPayload);
            alert('Pemesanan bahan ajar berhasil dikirim!');
            this.orderData = { nim: '', nama: '', ekspedisi: '', kodePaket: '' };
            this.selectedOrderPaket = null;
        }
    }
});