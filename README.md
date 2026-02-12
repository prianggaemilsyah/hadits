# Aplikasi Hadits

A beautiful Hadith application with Bootstrap card views, pagination, SweetAlert popups, and Font Awesome icons.

## Features

- **9 Kitab Hadits Shahih**: Menampilkan hadits dari 9 kitab shahih (Bukhari, Muslim, Abu Daud, Tirmidzi, Nasai, Ibn Majah, Ahmad, Darimi, Malik)
- **Card View**: Tampilan hadits dengan Bootstrap card yang cantik dan responsif
- **Pagination**: Navigasi halaman untuk membatasi jumlah hadits per halaman (20 hadits/halaman)
- **Hadits Acak**: Fitur untuk menampilkan hadits acak dari semua kitab
- **SweetAlert Popups**: Notifikasi dan pesan yang indah dengan SweetAlert2
- **Font Awesome Icons**: Ikon-ikon menarik untuk meningkatkan user experience
- **Responsive Design**: Tampilan yang adaptif untuk berbagai ukuran layar (mobile, tablet, desktop)

## API Source

Data hadits diperoleh dari API: https://api.hadith.gading.dev/

## Installation

1. Clone repository atau download file
2. Buka terminal di direktori project
3. Install dependencies:
   ```bash
   npm install
   ```

## Usage

1. Jalankan server development:
   ```bash
   npm run dev
   ```
2. Buka browser dan akses `http://localhost:3000`
3. Aplikasi akan menampilkan daftar 9 kitab hadits
4. Klik "Lihat Hadits" untuk melihat hadits dari kitab yang dipilih
5. Gunakan pagination untuk navigasi halaman
6. Klik "Hadits Acak" untuk menampilkan hadits acak

## Build

Untuk membuat build production:
```bash
npm run build
```

## Technologies Used

- **HTML5**: Markup language
- **CSS3**: Styling with Bootstrap 5
- **JavaScript ES6**: Logic dan API integration
- **Bootstrap 5**: CSS framework
- **Font Awesome 6**: Icon library
- **SweetAlert2**: Popup library
- **Serve**: Static file server

## License

MIT
