new Vue({
    el: '#app',
    data() {
        return {
            tab: 'stok',
            state: {
                stok: [],
                upbjjList: [],
                ekspedisiList: [],
                paket: [],
                tracking: []
            },
            lastDeletedTitle: '',
            criticalStockCount: 0
        };
    },
    watch: {
        'state.stok': {
            handler(newStok) {
                const critical = newStok.filter(item => item.qty < item.safety || item.qty === 0);
                this.criticalStockCount = critical.length;
                console.log(`[WATCHER 1] Perubahan persediaan terdeteksi. Item stok kritis: ${this.criticalStockCount}`);
            },
            deep: true
        },
        tab(newTab, oldTab) {
            console.log(`[WATCHER 2] Navigasi sistem berpindah dari tab '${oldTab}' ke tab '${newTab}'`);
        }
    },
    created() {
        this.fetchData();
    },
    methods: {
        async fetchData() {
            try {
                const data = await BahanAjarService.getAllData();
                this.state.stok = data.stok || [];
                this.state.upbjjList = data.upbjjList || [];
                this.state.ekspedisiList = data.ekspedisiList || [];
                this.state.paket = data.paket || [];
                this.state.tracking = data.tracking || [];
            } catch (err) {
                console.error('Kesalahan inisialisasi aplikasi:', err);
            }
        },
        handleAddItem(newItem) {
            this.state.stok.unshift(newItem);
        },
        handleUpdateItem(updatedItem) {
            const idx = this.state.stok.findIndex(i => i.id === updatedItem.id);
            if (idx !== -1) {
                Vue.set(this.state.stok, idx, updatedItem);
            }
        },
        confirmDeleteItem(item) {
            this.$refs.modal.open(
                'Konfirmasi Hapus Data',
                `Apakah Anda yakin ingin menghapus stok mata kuliah "${item.judul}" (${item.kode})?`,
                () => {
                    this.state.stok = this.state.stok.filter(i => i.id !== item.id);
                    this.lastDeletedTitle = item.judul;
                }
            );
        },
        handleAddTracking(newTracking) {
            this.state.tracking.unshift(newTracking);
            this.tab = 'tracking';
        },
        handleAddHistory({ nomorDO, historyItem }) {
            const target = this.state.tracking.find(t => t.nomorDO === nomorDO);
            if (target) {
                target.history.push(historyItem);
            }
        },
        handleNewOrder(orderPayload) {
            const year = new Date().getFullYear();
            const count = this.state.tracking.length + 1;
            const seq = String(count).padStart(3, '0');
            const newDoNumber = `DO${year}-${seq}`;
            const pad = (n) => String(n).padStart(2, '0');
            const now = new Date();
            const timeStr = `${now.getFullYear()}-${pad(now.getMonth()+1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;

            const trackingEntry = {
                nomorDO: newDoNumber,
                nim: orderPayload.nim,
                nama: orderPayload.nama,
                ekspedisi: orderPayload.ekspedisi,
                kodePaket: orderPayload.paket.kodePaket,
                namaPaket: orderPayload.paket.namaPaket,
                tanggalKirim: now.toISOString().substr(0, 10),
                totalHarga: orderPayload.paket.harga,
                history: [{
                    waktu: timeStr,
                    keterangan: 'Pesanan baru berhasil diproses dan dikirim ke sistem tracking.'
                }]
            };
            this.state.tracking.unshift(trackingEntry);
            this.tab = 'tracking';
        }
    }
});