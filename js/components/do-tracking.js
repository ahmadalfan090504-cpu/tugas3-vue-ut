Vue.component('do-tracking', {
    template: '#tpl-tracking',
    props: {
        trackingList: { type: Array, required: true },
        paketList: { type: Array, required: true },
        ekspedisiList: { type: Array, required: true }
    },
    data() {
        return {
            searchQuery: '',
            activeSearchQuery: '',
            selectedPaketKode: '',
            selectedPaketDetail: null,
            progressInputs: {},
            newTracking: {
                nim: '',
                nama: '',
                ekspedisi: '',
                tanggalKirim: new Date().toISOString().substr(0, 10)
            }
        };
    },
    filters: {
        currencyFormat(val) {
            if (typeof val !== "number") return "Rp 0";
            return "Rp " + val.toLocaleString("id-ID");
        },
        dateFormat(val) {
            if (!val) return "-";
            const d = new Date(val);
            if (isNaN(d.getTime())) return val;
            const months = [
                "Januari", "Februari", "Maret", "April", "Mei", "Juni",
                "Juli", "Agustus", "September", "Oktober", "November", "Desember"
            ];
            return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
        }
    },
    computed: {
        generatedDoNumber() {
            const year = new Date().getFullYear();
            const count = this.trackingList.length + 1;
            const seq = String(count).padStart(3, '0');
            return `DO${year}-${seq}`;
        },
        formattedInputDate() {
            if (!this.newTracking.tanggalKirim) return '';
            const d = new Date(this.newTracking.tanggalKirim);
            const months = [
                "Januari", "Februari", "Maret", "April", "Mei", "Juni",
                "Juli", "Agustus", "September", "Oktober", "November", "Desember"
            ];
            return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
        },
        activeSearchResults() {
            if (!this.activeSearchQuery) {
                return this.trackingList;
            }
            const q = this.activeSearchQuery.toLowerCase().trim();
            return this.trackingList.filter(t =>
                t.nomorDO.toLowerCase().includes(q) || t.nim.toLowerCase().includes(q)
            );
        }
    },
    methods: {
        executeSearch() {
            this.activeSearchQuery = this.searchQuery;
        },
        clearSearch() {
            this.searchQuery = '';
            this.activeSearchQuery = '';
        },
        onPaketChange() {
            this.selectedPaketDetail = this.paketList.find(p => p.kodePaket === this.selectedPaketKode) || null;
        },
        submitTracking() {
            if (!this.newTracking.nim || !this.newTracking.nama || !this.selectedPaketDetail) {
                alert('Mohon lengkapi seluruh kolom formulir Tracking DO!');
                return;
            }
            const trackingEntry = {
                nomorDO: this.generatedDoNumber,
                nim: this.newTracking.nim,
                nama: this.newTracking.nama,
                ekspedisi: this.newTracking.ekspedisi,
                kodePaket: this.selectedPaketDetail.kodePaket,
                namaPaket: this.selectedPaketDetail.namaPaket,
                tanggalKirim: this.newTracking.tanggalKirim,
                totalHarga: this.selectedPaketDetail.harga,
                history: [{
                    waktu: this.getFormattedNow(),
                    keterangan: 'Entry Delivery Order berhasil dibuat di sistem.'
                }]
            };
            this.$emit('add-tracking', trackingEntry);
            this.resetForm();
        },
        addProgress(nomorDO) {
            const text = this.progressInputs[nomorDO];
            if (!text || text.trim() === '') return;
            const historyItem = {
                waktu: this.getFormattedNow(),
                keterangan: text.trim()
            };
            this.$emit('add-history', { nomorDO, historyItem });
            Vue.set(this.progressInputs, nomorDO, '');
        },
        getFormattedNow() {
            const now = new Date();
            const pad = (n) => String(n).padStart(2, '0');
            return `${now.getFullYear()}-${pad(now.getMonth()+1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
        },
        resetForm() {
            this.newTracking.nim = '';
            this.newTracking.nama = '';
            this.newTracking.ekspedisi = '';
            this.selectedPaketKode = '';
            this.selectedPaketDetail = null;
        }
    }
});