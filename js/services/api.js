const BahanAjarService = {
    async getAllData() {
        try {
            const response = await fetch('./data/dataBahanAjar.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error('Gagal memuat layanan data bahan ajar:', error);
            throw error;
        }
    }
};