# 🚢 Cargo ID — Solana Supply Chain Frontend

A **React + TypeScript + Vite** frontend application built for the **Solana Supply Chain** project.  
It enables secure **on-chain product registration, verification, and tracking**, with integrated **email notifications** powered by EmailJS.

---

## ✨ Features

- ⚡ Built with **React + Vite + TypeScript** for ultra-fast development  
- 🔥 Supports **Hot Module Replacement (HMR)** for smooth editing  
- 🔍 Configured with **ESLint + TypeScript rules** for clean, maintainable code  
- 📧 Integrated **EmailJS** notifications for product registration alerts  
- 🔗 Connects directly with your **Solana program** to authenticate products on-chain  

---

## 🧱 Tech Stack

- **Frontend:** React, TypeScript, Vite  
- **Styling:** Tailwind CSS (or your chosen framework)  
- **Blockchain:** Solana Web3.js  
- **Email Notifications:** EmailJS  
- **Linting:** ESLint with React & TypeScript plugins  

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/Satyamyaduvanshi/cargoId.git
cd cargoId
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env` file from the example template:

```bash
cp .env.example .env
```

Then open `.env` and update the following fields:

| Variable | Description |
|-----------|-------------|
| `VITE_EMAILJS_PUBLIC_KEY` | Your EmailJS public key |
| `VITE_EMAILJS_SERVICE_ID` | Your EmailJS service ID |
| `VITE_EMAILJS_TEMPLATE_ID` | Your EmailJS template ID |
| `VITE_SOLANA_PROGRAM_ID` | The Solana program ID for your deployed contract |

---

## ✉️ EmailJS Integration

This project uses [EmailJS](https://www.emailjs.com/) to send email notifications when new products are registered.

### Setup Steps

1. **Create an EmailJS account** at [emailjs.com](https://www.emailjs.com/)
2. **Add a new Email Service** (e.g., Gmail, Outlook)
3. **Create an Email Template** with the following variables:

   - `{{product_name}}` – Product name  
   - `{{product_id}}` – Product ID  
   - `{{verification_link}}` – Verification URL  

#### Example Email Template

```html
<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 14px; color: #2c3e50;">
  <p>Hello Sir/Ma'am,</p>
  <p>Your product <strong>{{product_name}}</strong> has been successfully registered with ID:</p>
  <p style="font-weight: bold;">#{{product_id}}</p>
  <p>This product has been authenticated on-chain by the Cargo ID Platform.</p>
  <p>You can verify it anytime using the link below:</p>
  <a href="{{verification_link}}" style="color: #1e90ff;">{{verification_link}}</a>
  <p style="margin-top: 20px;">Thank you,<br/>Cargo ID Team</p>
</div>
```

---

### ⚠️ Troubleshooting EmailJS Issues

| Issue | Possible Fix |
|-------|---------------|
| **Public key error** | Ensure the public key in `.env` exactly matches the one under *Account → API Keys* |
| **Service ID error** | Check *Email Services → [Your Service] → Service ID* |
| **Template ID error** | Check *Email Templates → [Your Template] → Template ID* |
| **Missing parameters** | Verify all template variables (`product_name`, `product_id`, `verification_link`) are passed correctly |

> **Note:** Even if EmailJS fails, product registration will still complete successfully — you’ll only see a console warning.

---

## 🧠 ESLint Configuration Tips

If you’re building a production-ready app, you can extend ESLint to include **type-aware linting**:

```js
export default tseslint.config({
  extends: [
    ...tseslint.configs.recommendedTypeChecked,
    ...tseslint.configs.strictTypeChecked,
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

For React-specific linting, install:
```bash
npm install eslint-plugin-react-x eslint-plugin-react-dom --save-dev
```

Then extend your config:
```js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config({
  plugins: {
    'react-x': reactX,
    'react-dom': reactDom,
  },
  rules: {
    ...reactX.configs['recommended-typescript'].rules,
    ...reactDom.configs.recommended.rules,
  },
})
```

---

## 🖥️ Running the App Locally

```bash
npm run dev
```

The application will start on **http://localhost:3000**

---

## 🧾 License

This project is licensed under the [MIT License](LICENSE).

---

## 🤝 Contributing

Contributions are welcome!  
If you’d like to improve the UI, enhance performance, or add blockchain integrations, feel free to:
1. Fork the repository  
2. Create a new branch  
3. Commit your changes  
4. Open a Pull Request

---

### 💡 Project Maintainer
**[Satyam Yaduvanshi](https://github.com/Satyamyaduvanshi)**  
Building decentralized solutions for transparent and verifiable supply chains on **Solana**.
