Vue.component('ba-stock-table', {
    template: '#tpl-stock',
    props: {
        items: { type: Array, required: true },
        upbjjList: { type: Array, required: true }
    },
    data() {
        return {
            filterUpbjj: '',
            filterKategori: '',
            filterReorderOnly: false,
            sortBy: 'judul',
            isEditing: false,
            editingId: null,
            formData: {
                kode: '',
                judul: '',
                kategori: '',
                upbjj: '',
                lokasiRak: '',
                harga: 0,
                qty: 0,
                safety: 0,
                catatanHTML: ''
            }
        };
    },
    filters: {
        currencyFormat(value) {
            if (typeof value !== "number") return "Rp 0";
            return "Rp " + value.toLocaleString("id-ID");
        },
        unitFormat(value) {
            if (typeof value !== "number") return "0 buah";
            return value + " buah";
        }
    },
    computed: {
        availableKategori() {
            if (!this.filterUpbjj) return [];
            const categories = this.items
                .filter(item => item.upbjj === this.filterUpbjj)
                .map(item => item.kategori);
            return [...new Set(categories)];
        },
        filteredAndSortedStok() {
            let result = [...this.items];
            if (this.filterUpbjj) {
                result = result.filter(item => item.upbjj === this.filterUpbjj);
            }
            if (this.filterUpbjj && this.filterKategori) {
                result = result.filter(item => item.kategori === this.filterKategori);
            }
            if (this.filterReorderOnly) {
                result = result.filter(item => item.qty < item.safety || item.qty === 0);
            }
            result.sort((a, b) => {
                if (this.sortBy === 'judul') {
                    return a.judul.localeCompare(b.judul);
                } else if (this.sortBy === 'qty') {
                    return a.qty - b.qty;
                } else if (this.sortBy === 'harga') {
                    return a.harga - b.harga;
                }
                return 0;
            });
            return result;
        }
    },
    watch: {
        filterUpbjj() {
            this.filterKategori = '';
        }
    },
    methods: {
        resetFilters() {
            this.filterUpbjj = '';
            this.filterKategori = '';
            this.filterReorderOnly = false;
            this.sortBy = 'judul';
        },
        submitForm() {
            if (!this.formData.kode || !this.formData.judul) {
                alert('Mohon isi field kode dan judul mata kuliah!');
                return;
            }
            if (!this.formData.catatanHTML) {
                this.formData.catatanHTML = `Catatan persediaan untuk ${this.formData.judul}`;
            }
            if (this.isEditing) {
                this.$emit('update-item', {...this.formData, id: this.editingId });
                this.cancelEdit();
            } else {
                const newItem = {
                    ...this.formData,
                    id: Date.now()
                };
                this.$emit('add-item', newItem);
                this.resetForm();
            }
        },
        editItem(item) {
            this.isEditing = true;
            this.editingId = item.id;
            this.formData = {...item };
        },
        cancelEdit() {
            this.isEditing = false;
            this.editingId = null;
            this.resetForm();
        },
        resetForm() {
            this.formData = {
                kode: '',
                judul: '',
                kategori: '',
                upbjj: '',
                lokasiRak: '',
                harga: 0,
                qty: 0,
                safety: 0,
                catatanHTML: ''
            };
        }
    }
});