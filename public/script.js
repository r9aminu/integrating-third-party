document.addEventListener('DOMContentLoaded', function () {
    fetchAndDisplayBooks();
});

async function fetchAndDisplayBooks() {
    const bookAPI = 'https://openlibrary.org/people/mekBot/books/currently-reading.json';

    try {
        const response = await fetch(bookAPI);

        if (!response.ok) {
            throw new Error('API request failed');
        }

        const data = await response.json();
        const booksContainer = document.getElementById('book-list');
        const errorContainer = document.getElementById('error-message');

        if (!booksContainer) {
            throw new Error('Book list container not found');
        }

        // reset the book list
        booksContainer.innerHTML = '';

        data.reading_log_entries.forEach(entry => {
            const book = entry.work;
            const listItem = document.createElement('li');
            listItem.textContent = book.title;
            listItem.setAttribute('data-book-url', entry.logged_edition);
            listItem.classList.add('book-item');
            listItem.addEventListener('click', function() {
                displayBookDetails(book, this);
            });
            booksContainer.appendChild(listItem);
        });
        
        // remove any previous error message
        if (errorContainer) {
            errorContainer.textContent = '';
        }
    } catch (error) {
        console.error('Error:', error.message);

        // display error message to the user
        const errorContainer = document.getElementById('error-message');
        if (errorContainer) {
            errorContainer.textContent = 'Error: Cannot fetch book data or there was an issue with the API.';
        }
    }
}

function displayBookDetails(book, listItem) {
    // erase any existing details
    document.querySelectorAll('.book-details').forEach(el => el.remove());

    // create the details div and add the book details
    const detailsDiv = document.createElement('div');
    detailsDiv.classList.add('book-details');
    const authors = book.author_names ? book.author_names.join(', ') : 'Unknown Author';
    const firstPublished = book.first_publish_year || 'Not Available';
    detailsDiv.innerHTML = `
        <p><strong>Title:</strong> ${book.title}</p>
        <p><strong>Author:</strong> ${authors}</p>
        <p><strong>First Published:</strong> ${firstPublished}</p>
        <p><strong>Link:</strong> <a href="https://openlibrary.org${book.key}" target="_blank">View Book</a></p>
    `;
    listItem.insertAdjacentElement('afterend', detailsDiv);
}
