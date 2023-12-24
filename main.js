document.addEventListener("DOMContentLoaded", function () {
    const submitForm = document.getElementById("inputBook");
    submitForm.addEventListener("submit", function (event) {
        event.preventDefault();
        addBook();
    });

    if (isStorageExist()) {
        loadDataFromStorage();
    }
});

function addBook() {
    const bookTitle = document.getElementById("inputBookTitle").value;
    const bookAuthor = document.getElementById("inputBookAuthor").value;
    const bookYear = document.getElementById("inputBookYear").value;
    const bookIsCompleted = document.getElementById("inputBookIsComplete").checked;

    const generatedID = generateId();
    const bookObject = generateBookObject(generatedID, bookTitle, bookAuthor, bookYear, bookIsCompleted);
    books.push(bookObject);

    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function generateId() {
    return +new Date();
}

function generateBookObject(id, bookTitle, bookAuthor, timestamp, isCompleted) {
    return {
        id,
        bookTitle,
        bookAuthor,
        timestamp,
        isCompleted,
    };
}

const books = [];
const RENDER_EVENT = "render-book";

document.addEventListener(RENDER_EVENT, function () {
    console.log(books);

    const uncompletedBookList = document.getElementById("incompleteBookshelfList");
    uncompletedBookList.innerHTML = "";

    const completedBookList = document.getElementById("completeBookshelfList");
    completedBookList.innerHTML = "";

    const searchBookSubmit = document.getElementById("searchBook");
    searchBookSubmit.addEventListener("submit", function (event) {
        event.preventDefault();
        const keyword = document.getElementById("searchBookTitle").value;

        console.log(searchBook(keyword));

        uncompletedBookList.innerHTML = "";
        completedBookList.innerHTML = "";

        for (const bookItem of searchBook(keyword)) {
            const bookElement = makeBook(bookItem);
            if (!bookItem.isCompleted) {
                uncompletedBookList.append(bookElement);
            } else completedBookList.append(bookElement);
        }
    });

    for (const bookItem of books) {
        const bookElement = makeBook(bookItem);
        if (!bookItem.isCompleted) {
            uncompletedBookList.append(bookElement);
        } else completedBookList.append(bookElement);
    }
});

function findBookIndex(id) {
    for (const index in books) {
        if (books[index].id === id) {
            return index;
        }
    }

    return -1;
}

function searchBook(search) {
    // membuat text menjadi huruf kecil
    const searchKeyword = search.toLowerCase();

    // Membuat array hasil pencarian
    const searchResults = books.filter(function (book) {
        const titleLowerCase = book.bookTitle.toLowerCase();

        return titleLowerCase.includes(searchKeyword);
    });

    return searchResults;
}

function makeBook(bookObject) {
    const title = document.createElement("h2");
    title.innerText = bookObject.bookTitle;

    const author = document.createElement("p");
    author.innerText = bookObject.bookAuthor;

    const timestamp = document.createElement("p");
    timestamp.innerText = bookObject.timestamp;

    const container = document.createElement("article");
    container.classList.add("book_item");
    container.append(title, author, timestamp);
    container.setAttribute("id", `buku-${bookObject.id}`);

    let bookIsCompleted = document.createElement("input");
    bookIsCompleted.type = "checkbox";
    bookIsCompleted.checked = bookObject.isCompleted;

    // jika checkbox sudah dibaca diklik
    bookIsCompleted.addEventListener("change", function () {
        // maka checkbox true
        bookObject.isCompleted = bookIsCompleted.checked;
        document.dispatchEvent(new Event(RENDER_EVENT));
    });

    // button uncomplete
    const uncompleteBtn = document.createElement("button");
    uncompleteBtn.innerText = "Belum Selesai Dibaca";
    // button complete
    const completeBtn = document.createElement("button");
    completeBtn.innerText = "Selesai Dibaca";
    // button delete
    const deleteBookBtn = document.createElement("button");
    deleteBookBtn.innerText = "Hapus Buku";

    // fungsi delete buku
    deleteBookBtn.addEventListener("click", function () {
        const target = findBookIndex(bookObject.id);

        books.splice(target, 1);
        document.dispatchEvent(new Event(RENDER_EVENT));
        saveData();
    });

    // jika btn uncomplete di click
    uncompleteBtn.addEventListener("click", function () {
        // maka tidak sama dengan true(false)
        bookObject.isCompleted = !bookObject.isCompleted;
        document.dispatchEvent(new Event(RENDER_EVENT));
        saveData();
    });

    // jika btn complete di click
    completeBtn.addEventListener("click", function () {
        // maka isCompleted true
        bookObject.isCompleted = true;
        document.dispatchEvent(new Event(RENDER_EVENT));
        saveData();
    });

    if (bookIsCompleted.checked) {
        container.append(uncompleteBtn, deleteBookBtn);
    } else {
        container.append(completeBtn, deleteBookBtn);
    }

    return container;
}

function saveData() {
    if (isStorageExist()) {
        const parsed = JSON.stringify(books);
        localStorage.setItem(STORAGE_KEY, parsed);
        document.dispatchEvent(new Event(SAVED_EVENT));
    }
}

const SAVED_EVENT = "saved-book";
const STORAGE_KEY = "BOOKSHELF_APPS";

function isStorageExist() /* boolean */ {
    if (typeof Storage === undefined) {
        alert("Browser kamu tidak mendukung local storage");
        return false;
    }
    return true;
}

function loadDataFromStorage() {
    const serializedData = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(serializedData);

    if (data !== null) {
        for (const book of data) {
            books.push(book);
        }
    }

    document.dispatchEvent(new Event(RENDER_EVENT));
}
