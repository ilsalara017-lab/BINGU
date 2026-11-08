// DATA PRODUK: ubah nama, harga, dan deskripsi sesuai keputusan kelompok.
const products = [
    {
        id: 1,
        name: "BINGU Original",
        description: "Lumpia dengan isian ubi ungu lembut.",
        price: 15000,
        icon: "🥟"
    },
    {
        id: 2,
        name: "BINGU Cokelat",
        description: "Lumpia ubi ungu dengan sentuhan cokelat.",
        price: 18000,
        icon: "🍫"
    },
    {
        id: 3,
        name: "BINGU Keju",
        description: "Lumpia ubi ungu dengan topping keju.",
        price: 18000,
        icon: "🧀"
    }
];

// GANTI nomor ini dengan nomor WhatsApp toko.
// Gunakan kode negara 62, tanpa tanda +, spasi, atau angka 0 di depan.
const NOMOR_WHATSAPP_TOKO = "082318061839";

function formatRupiah(angka) {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0
    }).format(angka);
}

function ambilKeranjang() {
    return JSON.parse(localStorage.getItem("keranjangBINGU")) || [];
}

function simpanKeranjang(keranjang) {
    localStorage.setItem("keranjangBINGU", JSON.stringify(keranjang));
    perbaruiJumlahKeranjang();
}

function perbaruiJumlahKeranjang() {
    const keranjang = ambilKeranjang();
    const jumlah = keranjang.reduce((total, item) => total + item.qty, 0);
    document.querySelectorAll(".cart-count").forEach((el) => {
        el.textContent = jumlah;
    });
}

function tampilkanProduk() {
    const tempatProduk = document.getElementById("product-list");
    if (!tempatProduk) return;

    tempatProduk.innerHTML = products.map((produk) => `
        <article class="product-card">
            <div class="product-art">${produk.icon}</div>
            <h3>${produk.name}</h3>
            <p>${produk.description}</p>
            <span class="price">${formatRupiah(produk.price)}</span>
            <button class="button" onclick="tambahKeKeranjang(${produk.id})">Tambah ke Keranjang</button>
        </article>
    `).join("");
}

function tambahKeKeranjang(id) {
    const produk = products.find((item) => item.id === id);
    const keranjang = ambilKeranjang();
    const itemAda = keranjang.find((item) => item.id === id);

    if (itemAda) {
        itemAda.qty += 1;
    } else {
        keranjang.push({ id: produk.id, name: produk.name, price: produk.price, qty: 1 });
    }

    simpanKeranjang(keranjang);
    alert(produk.name + " berhasil ditambahkan ke keranjang.");
}

function hapusDariKeranjang(id) {
    const keranjangBaru = ambilKeranjang().filter((item) => item.id !== id);
    simpanKeranjang(keranjangBaru);
    tampilkanKeranjang();
}

function tampilkanKeranjang() {
    const tempatKeranjang = document.getElementById("cart-items");
    if (!tempatKeranjang) return;

    const keranjang = ambilKeranjang();

    if (keranjang.length === 0) {
        tempatKeranjang.innerHTML = "<p>Keranjang masih kosong. Silakan pilih produk terlebih dahulu.</p>";
        document.getElementById("cart-total").textContent = formatRupiah(0);
        return;
    }

    tempatKeranjang.innerHTML = keranjang.map((item) => `
        <div class="cart-row">
            <div>
                <strong>${item.name}</strong><br>
                <small>${item.qty} x ${formatRupiah(item.price)}</small>
            </div>
            <div>
                <strong>${formatRupiah(item.qty * item.price)}</strong><br>
                <button type="button" onclick="hapusDariKeranjang(${item.id})">Hapus</button>
            </div>
        </div>
    `).join("");

    const total = keranjang.reduce((jumlah, item) => jumlah + (item.price * item.qty), 0);
    document.getElementById("cart-total").textContent = formatRupiah(total);
}

function aturFormPemesanan() {
    const form = document.getElementById("order-form");
    if (!form) return;

    form.addEventListener("submit", function(event) {
        event.preventDefault();

        const keranjang = ambilKeranjang();
        const pesan = document.getElementById("order-message");

        if (keranjang.length === 0) {
            pesan.textContent = "Keranjang masih kosong. Silakan pilih produk terlebih dahulu.";
            return;
        }

        const nama = document.getElementById("buyer-name").value.trim();
        const telepon = document.getElementById("buyer-phone").value.trim();
        const alamat = document.getElementById("buyer-address").value.trim();
        const catatan = document.getElementById("buyer-note").value.trim();

        const total = keranjang.reduce((jumlah, item) => jumlah + (item.price * item.qty), 0);
        let isiPesan = "Halo BingU, saya ingin memesan:%0A%0A";
        isiPesan += "Nama: " + encodeURIComponent(nama) + "%0A";
        isiPesan += "Nomor HP: " + encodeURIComponent(telepon) + "%0A";
        isiPesan += "Alamat: " + encodeURIComponent(alamat) + "%0A%0A";
        isiPesan += "Pesanan:%0A";

        keranjang.forEach((item) => {
            isiPesan += "- " + encodeURIComponent(item.name) + " (" + item.qty + ") = " +
                encodeURIComponent(formatRupiah(item.price * item.qty)) + "%0A";
        });

        isiPesan += "%0ATotal: " + encodeURIComponent(formatRupiah(total));
        if (catatan) isiPesan += "%0ACatatan: " + encodeURIComponent(catatan);

        if (NOMOR_WHATSAPP_TOKO === "082318061839") {
            pesan.textContent = "OKE PESANAN MASUK:).";
            return;
        }

        window.open("https://wa.me/" + NOMOR_WHATSAPP_TOKO + "?text=" + isiPesan, "_blank");
    });
}

document.addEventListener("DOMContentLoaded", function() {
    perbaruiJumlahKeranjang();
    tampilkanProduk();
    tampilkanKeranjang();
    aturFormPemesanan();
});
