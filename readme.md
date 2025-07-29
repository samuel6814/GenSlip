# 🧾 GenSlip — Smart, Custom Receipt Generator

**GenSlip** is a lightweight, customizable receipt generator built with **React**, **Vite**, and **styled-components**. Designed for makers, freelancers, and small businesses, it allows you to quickly generate and print clean, professional-looking receipts with custom branding and smart totals.

---

## ✨ Features

- 🏷 **Custom Branding** — Add store name, address, phone number, and logo  
- 🔤 **Auto Logo Fallback** — Automatically generate a logo using the first letter of the brand name  
- 📦 **Dynamic Items** — Add items with name, quantity, and price  
- 🧮 **Smart Totals** — Auto-calculated subtotal, tax, discount, and grand total  
- 🖨 **Print-Ready Format** — Optimized layout for 80mm thermal receipt printers  
- 🌒 **Dark/Light Themes** — Toggle between themes  
- 💾 **Local Save/Load** — Save receipts to localStorage and reload them later  
- 📄 **PDF & Print** — Export receipts as PDF or print them  
- ✅ **Input Validation** — Ensures clean data entry and formatting  

---

## 🚀 Tech Stack

- React + Vite  
- Styled-components for theming and styling  
- Lucide-react icons  
- LocalStorage for receipt persistence  

---

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/samuel6814/genslip.git
cd genslip

# Install dependencies
npm install

# Run the development server
npm run dev
