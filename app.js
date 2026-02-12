// API Configuration
const API_BASE_URL = 'https://api.hadith.gading.dev';
const HADITS_PER_PAGE = 20;

// Global variables
let currentBookId = null;
let currentBookName = null;
let totalAvailable = 0;
let currentPage = 1;

// Show loading indicator
function showLoading() {
    document.getElementById('loadingIndicator').classList.remove('d-none');
    document.getElementById('errorMessage').classList.add('d-none');
    document.getElementById('booksList').innerHTML = '';
    document.getElementById('hadithsList').innerHTML = '';
    document.getElementById('pagination').innerHTML = '';
}

// Hide loading indicator
function hideLoading() {
    document.getElementById('loadingIndicator').classList.add('d-none');
}

// Show error message
function showError(message) {
    document.getElementById('errorMessage').textContent = message;
    document.getElementById('errorMessage').classList.remove('d-none');
}

// Show books list
async function showBookList() {
    showLoading();
    
    // Reset button text
    const bookListButton = document.querySelector('button[onclick="showBookList()"]');
    bookListButton.innerHTML = '<i class="fas fa-list"></i> Daftar Kitab';
    
    try {
        const response = await fetch(`${API_BASE_URL}/books/`);
        const data = await response.json();
        
        if (data.code === 200 && !data.error) {
            displayBooks(data.data);
        } else {
            throw new Error(data.message || 'Gagal mengambil daftar kitab');
        }
    } catch (error) {
        console.error('Error fetching books:', error);
        showError('Gagal mengambil daftar kitab. Silakan coba lagi.');
    } finally {
        hideLoading();
    }
}

// Display books in card view
function displayBooks(books) {
    const booksList = document.getElementById('booksList');
    booksList.innerHTML = '';
    
    books.forEach(book => {
        const bookCard = createBookCard(book);
        booksList.appendChild(bookCard);
    });
}

// Create book card
function createBookCard(book) {
    const col = document.createElement('div');
    col.className = 'col-md-4 col-lg-3';
    
    const card = document.createElement('div');
    card.className = 'book-card card';
    
    const cardHeader = document.createElement('div');
    cardHeader.className = 'card-header';
    cardHeader.textContent = book.name;
    
    const cardBody = document.createElement('div');
    cardBody.className = 'card-body';
    
    const bookId = document.createElement('p');
    bookId.className = 'book-id';
    bookId.textContent = book.id;
    
    const bookCount = document.createElement('p');
    bookCount.className = 'book-count';
    bookCount.innerHTML = `<i class="fas fa-book"></i> ${book.available.toLocaleString()} Hadits`;
    
    const viewButton = document.createElement('button');
    viewButton.className = 'btn btn-primary w-100';
    viewButton.innerHTML = '<i class="fas fa-eye"></i> Lihat Hadits';
    viewButton.onclick = () => viewBookHadits(book.id, book.name, book.available);
    
    cardBody.appendChild(bookId);
    cardBody.appendChild(bookCount);
    cardBody.appendChild(viewButton);
    
    card.appendChild(cardHeader);
    card.appendChild(cardBody);
    
    col.appendChild(card);
    
    return col;
}

// View book hadiths
function viewBookHadits(bookId, bookName, available) {
    currentBookId = bookId;
    currentBookName = bookName;
    totalAvailable = available;
    currentPage = 1;
    
    // Update button text to show selected book
    const bookListButton = document.querySelector('button[onclick="showBookList()"]');
    bookListButton.innerHTML = `<i class="fas fa-list"></i> Kitab: ${bookName} (${available.toLocaleString()})`;
    
    loadHadiths();
}

// Load hadiths for current page
async function loadHadiths() {
    showLoading();
    
    const start = ((currentPage - 1) * HADITS_PER_PAGE) + 1;
    const end = Math.min(start + HADITS_PER_PAGE - 1, totalAvailable);
    
    try {
        const response = await fetch(`${API_BASE_URL}/books/${currentBookId}?range=${start}-${end}`);
        const data = await response.json();
        
        if (data.code === 200 && !data.error) {
            displayHadiths(data.data.hadiths);
            displayPagination();
        } else {
            throw new Error(data.message || 'Gagal mengambil data hadits');
        }
    } catch (error) {
        console.error('Error fetching hadiths:', error);
        showError('Gagal mengambil data hadits. Silakan coba lagi.');
    } finally {
        hideLoading();
    }
}

// Display hadiths in card view
function displayHadiths(hadiths) {
    const hadithsList = document.getElementById('hadithsList');
    hadithsList.innerHTML = '';
    
    hadiths.forEach(hadith => {
        const hadithCard = createHadithCard(hadith);
        hadithsList.appendChild(hadithCard);
    });
}

// Create hadith card
function createHadithCard(hadith) {
    const col = document.createElement('div');
    col.className = 'col-12';
    
    const card = document.createElement('div');
    card.className = 'hadith-card card';
    
    const cardBody = document.createElement('div');
    cardBody.className = 'card-body';
    
    const hadithNumber = document.createElement('div');
    hadithNumber.className = 'hadith-number';
    hadithNumber.textContent = `Hadits ke-${hadith.number}`;
    
    const hadithArab = document.createElement('div');
    hadithArab.className = 'hadith-arab';
    hadithArab.textContent = hadith.arab;
    
    const hadithId = document.createElement('div');
    hadithId.className = 'hadith-id';
    hadithId.innerHTML = `<i class="fas fa-quote-left"></i> ${hadith.id}`;
    
    const buttonGroup = document.createElement('div');
    buttonGroup.className = 'd-flex gap-2 mt-4';
    
    const imageButton = document.createElement('button');
    imageButton.className = 'btn btn-primary';
    imageButton.innerHTML = '<i class="fas fa-image"></i> Lihat Gambar';
    imageButton.onclick = () => showHadithImage(hadith);
    
    const shareButton = document.createElement('button');
    shareButton.className = 'btn btn-success';
    shareButton.innerHTML = '<i class="fas fa-share"></i> Bagikan';
    shareButton.onclick = () => shareHadith(hadith);
    
    buttonGroup.appendChild(imageButton);
    buttonGroup.appendChild(shareButton);
    
    cardBody.appendChild(hadithNumber);
    cardBody.appendChild(hadithArab);
    cardBody.appendChild(hadithId);
    cardBody.appendChild(buttonGroup);
    
    card.appendChild(cardBody);
    col.appendChild(card);
    
    return col;
}

// Display pagination
function displayPagination() {
    const totalPages = Math.ceil(totalAvailable / HADITS_PER_PAGE);
    const pagination = document.getElementById('pagination');
    
    if (totalPages <= 1) {
        pagination.innerHTML = '';
        return;
    }
    
    let paginationHTML = `
        <nav>
            <ul class="pagination">
                <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
                    <a class="page-link" href="#" onclick="changePage(${currentPage - 1})">
                        <i class="fas fa-chevron-left"></i>
                    </a>
                </li>
    `;
    
    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, currentPage + 2);
    
    if (startPage > 1) {
        paginationHTML += `
            <li class="page-item">
                <a class="page-link" href="#" onclick="changePage(1)">1</a>
            </li>
        `;
        if (startPage > 2) {
            paginationHTML += `<li class="page-item disabled"><span class="page-link">...</span></li>`;
        }
    }
    
    for (let i = startPage; i <= endPage; i++) {
        paginationHTML += `
            <li class="page-item ${i === currentPage ? 'active' : ''}">
                <a class="page-link" href="#" onclick="changePage(${i})">${i}</a>
            </li>
        `;
    }
    
    if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
            paginationHTML += `<li class="page-item disabled"><span class="page-link">...</span></li>`;
        }
        paginationHTML += `
            <li class="page-item">
                <a class="page-link" href="#" onclick="changePage(${totalPages})">${totalPages}</a>
            </li>
        `;
    }
    
    paginationHTML += `
                <li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
                    <a class="page-link" href="#" onclick="changePage(${currentPage + 1})">
                        <i class="fas fa-chevron-right"></i>
                    </a>
                </li>
            </ul>
        </nav>
    `;
    
    pagination.innerHTML = paginationHTML;
}

// Change page
function changePage(page) {
    const totalPages = Math.ceil(totalAvailable / HADITS_PER_PAGE);
    
    if (page < 1 || page > totalPages || page === currentPage) {
        return;
    }
    
    currentPage = page;
    loadHadiths();
    
    // Scroll to top
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Show random hadith
async function showRandomHadith() {
    showLoading();
    
    try {
        // Get all books first
        const booksResponse = await fetch(`${API_BASE_URL}/books/`);
        const booksData = await booksResponse.json();
        
        if (booksData.code === 200 && !booksData.error) {
            // Randomly select a book
            const randomBook = booksData.data[Math.floor(Math.random() * booksData.data.length)];
            
            // Randomly select a hadith number
            const randomNumber = Math.floor(Math.random() * randomBook.available) + 1;
            
            // Fetch the random hadith
            const hadithResponse = await fetch(`${API_BASE_URL}/books/${randomBook.id}?range=${randomNumber}-${randomNumber}`);
            const hadithData = await hadithResponse.json();
            
            if (hadithData.code === 200 && !hadithData.error && hadithData.data.hadiths.length > 0) {
                const hadith = hadithData.data.hadiths[0];
                
                Swal.fire({
                    title: `Hadits Acak dari ${randomBook.name}`,
                    html: `
                        <div style="text-align: center; margin-bottom: 20px;">
                            <div style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; padding: 8px 16px; border-radius: 20px; font-weight: 600; display: inline-block; margin-bottom: 15px;">
                                Hadits ke-${hadith.number}
                            </div>
                        </div>
                        <div style="font-size: 1.4rem; line-height: 1.8; color: #1a202c; margin-bottom: 20px; font-family: 'Arial', sans-serif; text-align: right;">
                            ${hadith.arab}
                        </div>
                        <div style="color: #4a5568; line-height: 1.8; font-size: 1.1rem;">
                            <i class="fas fa-quote-left"></i> ${hadith.id}
                        </div>
                    `,
                    icon: 'info',
                    confirmButtonText: 'OK',
                    width: '800px',
                    padding: '30px'
                });
            } else {
                throw new Error(hadithData.message || 'Gagal mengambil hadith acak');
            }
        } else {
            throw new Error(booksData.message || 'Gagal mengambil daftar kitab');
        }
    } catch (error) {
        console.error('Error fetching random hadith:', error);
        Swal.fire({
            title: 'Error',
            text: 'Gagal mengambil hadith acak. Silakan coba lagi.',
            icon: 'error',
            confirmButtonText: 'OK'
        });
    } finally {
        hideLoading();
    }
}

// Show hadith image in Instagram style
function showHadithImage(hadith) {
    // Create Instagram-style image template
    const html = `
        <!DOCTYPE html>
        <html lang="id">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Hadith Image</title>
            <style>
                body {
                    margin: 0;
                    padding: 0;
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    min-height: 100vh;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }
                
                .image-container {
                    background: white;
                    border-radius: 20px;
                    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
                    max-width: 600px;
                    width: 90%;
                    padding: 40px;
                    text-align: center;
                }
                
                .header {
                    margin-bottom: 30px;
                }
                
                .logo {
                    font-size: 2.5rem;
                    color: #667eea;
                    margin-bottom: 10px;
                }
                
                .book-name {
                    font-size: 1.2rem;
                    color: #718096;
                    margin-bottom: 20px;
                }
                
                .hadith-number {
                    background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
                    color: white;
                    padding: 10px 20px;
                    border-radius: 25px;
                    font-weight: 600;
                    display: inline-block;
                    margin-bottom: 25px;
                }
                
                .hadith-arab {
                    font-size: 1.8rem;
                    line-height: 1.8;
                    color: #1a202c;
                    margin-bottom: 30px;
                    font-family: 'Arial', sans-serif;
                    text-align: right;
                    direction: rtl;
                }
                
                .divider {
                    height: 2px;
                    background: linear-gradient(90deg, transparent, #e2e8f0, transparent);
                    margin: 30px 0;
                }
                
                .hadith-id {
                    color: #4a5568;
                    line-height: 1.8;
                    font-size: 1.1rem;
                    text-align: left;
                    margin-bottom: 30px;
                }
                
                .footer {
                    margin-top: 30px;
                    padding-top: 20px;
                    border-top: 1px solid #e2e8f0;
                }
                
                .footer-text {
                    color: #718096;
                    font-size: 0.9rem;
                }
                
                .download-button {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    border: none;
                    padding: 12px 30px;
                    border-radius: 25px;
                    font-weight: 600;
                    cursor: pointer;
                    margin-top: 20px;
                    font-size: 1rem;
                    transition: transform 0.2s ease;
                }
                
                .download-button:hover {
                    transform: translateY(-2px);
                }
                
                @media (max-width: 768px) {
                    .image-container {
                        padding: 20px;
                    }
                    
                    .hadith-arab {
                        font-size: 1.4rem;
                    }
                }
            </style>
        </head>
        <body>
            <div class="image-container">
                <div class="header">
                    <div class="logo">
                        <i class="fas fa-book-open"></i>
                    </div>
                    <div class="book-name">${currentBookName || 'Kitab Hadits'}</div>
                </div>
                
                <div class="hadith-number">Hadits ke-${hadith.number}</div>
                
                <div class="hadith-arab">${hadith.arab}</div>
                
                <div class="divider"></div>
                
                <div class="hadith-id">
                    <i class="fas fa-quote-left"></i> ${hadith.id}
                </div>
                
                <div class="footer">
                    <div class="footer-text">
                        <i class="fas fa-heart"></i>  Aplikasi Hadits
                    </div>
                    <button class="download-button" onclick="downloadImage()">
                        <i class="fas fa-download"></i> Download Gambar
                    </button>
                </div>
            </div>
            
            <script src="https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js"></script>
            <script>
                function downloadImage() {
                    const container = document.querySelector('.image-container');
                    
                    html2canvas(container, {
                        backgroundColor: null,
                        scale: 2,
                        useCORS: true
                    }).then(canvas => {
                        // Create download link
                        const link = document.createElement('a');
                        link.download = 'hadith-' + ${hadith.number} + '.png';
                        link.href = canvas.toDataURL('image/png');
                        link.click();
                    }).catch(error => {
                        console.error('Error generating image:', error);
                        alert('Gagal membuat gambar. Silakan coba lagi.');
                    });
                }
            </script>
        </body>
        </html>
    `;
    
    // Open in new tab
    const newWindow = window.open('', '_blank');
    newWindow.document.write(html);
    newWindow.document.close();
}

// Share hadith
function shareHadith(hadith) {
    const shareText = `Hadits ke-${hadith.number}\\n${hadith.arab}\\n\\n${hadith.id}`;
    
    if (navigator.share) {
        // Use Web Share API if available
        navigator.share({
            title: 'Hadith',
            text: shareText,
            url: window.location.href
        }).catch(console.error);
    } else {
        // Fallback to copy to clipboard
        navigator.clipboard.writeText(shareText).then(() => {
            Swal.fire({
                title: 'Berhasil!',
                text: 'Hadith berhasil disalin ke clipboard',
                icon: 'success',
                confirmButtonText: 'OK'
            });
        });
    }
}

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    // Show books list on initial load
    showBookList();
});