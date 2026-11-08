# Online BookStore

A simple, browser-based bookstore demo for browsing physical books and e-books, adding items to a cart, and listing books for sale.

## Technology Used
<p align="center">
  <img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white" alt="HTML5" />
  <img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white" alt="CSS3" />
  <img src="https://img.shields.io/badge/Javascript-61DAFB?style=for-the-badge&logo=javascript&logoColor=black" alt="React" />
</p>

## Features

- Sign-in and registration page with basic form validation.
- Catalog pages for physical books and e-books.
- Shopping cart saved in browser `localStorage`.
- Checkout page with a demo-only payment form.
- Sell-a-book form with a live preview and optional cover/PDF upload.
- User-submitted listings saved in browser `IndexedDB` and displayed in the relevant catalog. ( `This was made using AI Help` )
- Responsive layout for smaller screens.

## Getting Started

This project uses plain HTML, CSS, and JavaScript. No build step or package installation is required.

1. Download or clone the project.
2. Open `index.html` in a modern browser.
3. Use the navigation to browse books, add items to your cart, or list a book.

Alternatively, open the project folder in Visual Studio Code and run it with a local server extension such as Live Server.

## Project Structure

```text
.
├── index.html       # Sign-in, registration, and password-reset views
├── shop.html        # Physical book catalog
├── ebook.html       # E-book catalog
├── sellbook.html    # Submit a book listing
├── cart.html        # Shopping cart
├── checkout.html    # Demo checkout
├── css/
│   ├── style.css    # Shared styles
│   └── cart.css     # Cart and checkout styles
└── js/
    ├── app.js       # Shared page interactions
    ├── books.js     # Book listing storage and rendering
    └── cart.js      # Cart storage and actions
```

## Notes

- This is a front-end demonstration. Sign-in, registration, password reset, and payment are not connected to a server or real services.
- Cart contents and submitted listings are stored only in the current browser. They are not shared across browsers or devices.
- Do not enter real payment card details on the demo checkout page.
- Catalog cover images are loaded from external image URLs and require an internet connection.

## Author

[KartikR888 on GitHub](https://github.com/KartikR888)
