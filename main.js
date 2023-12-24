document.addEventListener("DOMContentLoaded", function () {
    const submitForm = document.getElementById("inputBook");
    submitForm.addEventListener("submit", function (event) {
        event.preventDefault();
        addBook();
    });
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

    for (const bookItem of books) {
        const bookElement = makeBook(bookItem);
        if (!bookItem.isCompleted) {
            uncompletedBookList.append(bookElement);
        } else completedBookList.append(bookElement);
    }
});

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

    bookIsCompleted.addEventListener("change", function () {
        bookObject.isCompleted = bookIsCompleted.checked;
        document.dispatchEvent(new Event(RENDER_EVENT));
    });

    return container;
}
