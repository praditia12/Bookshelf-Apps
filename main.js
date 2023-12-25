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
    const bookisComplete = document.getElementById("inputBookIsComplete").checked;

    const generatedID = generateId();
    const bookObject = generateBookObject(generatedID, bookTitle, bookAuthor, bookYear, bookisComplete);
    books.push(bookObject);

    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function generateId() {
    return +new Date();
}

function generateBookObject(id, title, author, year, isComplete) {
    return {
        id,
        title,
        author,
        year: Number(year),
        isComplete,
    };
}

const books = [];
const RENDER_EVENT = "render-book";

document.addEventListener(RENDER_EVENT, function () {
    const uncompletedBookList = document.getElementById("incompleteBookshelfList");
    uncompletedBookList.innerHTML = "";

    const completedBookList = document.getElementById("completeBookshelfList");
    completedBookList.innerHTML = "";

    const searchBookSubmit = document.getElementById("searchBook");
    searchBookSubmit.addEventListener("submit", function (event) {
        event.preventDefault();
        const keyword = document.getElementById("searchBookTitle").value;

        uncompletedBookList.innerHTML = "";
        completedBookList.innerHTML = "";

        for (const bookItem of searchBook(keyword)) {
            const bookElement = makeBook(bookItem);
            if (!bookItem.isComplete) {
                uncompletedBookList.append(bookElement);
            } else completedBookList.append(bookElement);
        }
    });

    for (const bookItem of books) {
        const bookElement = makeBook(bookItem);
        if (!bookItem.isComplete) {
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
        const titleLowerCase = book.title.toLowerCase();

        return titleLowerCase.includes(searchKeyword);
    });

    return searchResults;
}

function makeBook(bookObject) {
    const title = document.createElement("h2");
    title.innerText = bookObject.title;

    const author = document.createElement("p");
    author.innerText = bookObject.author;

    const timestamp = document.createElement("p");
    timestamp.innerText = bookObject.year;

    const container = document.createElement("article");
    container.classList.add("book_item", "card");
    container.append(title, author, timestamp);
    container.setAttribute("id", `buku-${bookObject.id}`);

    let bookisComplete = document.createElement("input");
    bookisComplete.type = "checkbox";
    bookisComplete.checked = bookObject.isComplete;

    // jika checkbox sudah dibaca diklik
    bookisComplete.addEventListener("change", function () {
        // maka checkbox true
        bookObject.isComplete = bookisComplete.checked;
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
    deleteBookBtn.classList.add("deleteBtn");
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
        bookObject.isComplete = !bookObject.isComplete;
        document.dispatchEvent(new Event(RENDER_EVENT));
        saveData();
    });

    // jika btn complete di click
    completeBtn.addEventListener("click", function () {
        // maka isComplete true
        bookObject.isComplete = true;
        document.dispatchEvent(new Event(RENDER_EVENT));
        saveData();
    });

    if (bookisComplete.checked) {
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
