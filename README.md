# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    'react-x': reactX,
    'react-dom': reactDom,
  },
  rules: {
    // other rules...
    // Enable its recommended typescript rules
    ...reactX.configs['recommended-typescript'].rules,
    ...reactDom.configs.recommended.rules,
  },
})
```

# Supply Chain Frontend

A React-based frontend for the Solana Supply Chain application.

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```
4. Update the `.env` file with your Solana program ID and EmailJS credentials

## EmailJS Setup

This application uses EmailJS to send email notifications when products are registered. To set up EmailJS:

1. Create an account at [EmailJS](https://www.emailjs.com/)
2. Create a new email service
3. Create a new email template with the following variables:
   - `{{product_name}}` - Name of the registered product
   - `{{product_id}}` - ID of the registered product
   - `{{verification_link}}` - Link to verify the product

Here's a sample template you can use:

```html
<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 14px; color: #2c3e50;">
  <p style="margin-bottom: 20px;">Hello, Sir/Ma'am</p>

  <p>Your product <strong>{{product_name}}</strong> has been successfully registered with the following ID:</p>
  <p style="font-size: 16px; font-weight: bold; margin: 10px 0 20px;">#{{product_id}}</p>

  <p style="margin-bottom: 16px;">
    <strong>Note:</strong> This product has been authenticated on-chain by Cargo Id Platform.
  </p>

  <p style="margin-bottom: 16px;">
    You can visit our website anytime to verify or track your product.
  </p>

  <p style="margin-bottom: 20px;">
    <a href="{{verification_link}}" style="color: #1e90ff;">{{verification_link}}</a>
  </p>

  <p style="margin-top: 30px;">Thank you,<br/>Cargo Id Platform</p>
</div>
```

4. Update your `.env` file with:
   - `VITE_EMAILJS_PUBLIC_KEY` - Your EmailJS public key
   - `VITE_EMAILJS_SERVICE_ID` - Your EmailJS service ID
   - `VITE_EMAILJS_TEMPLATE_ID` - Your EmailJS template ID

### Troubleshooting EmailJS Issues

If you're experiencing issues with EmailJS, check the following:

1. **Public Key Error**: If you see an error like "The public key is required," make sure:
   - You've copied your **complete** public key from the EmailJS dashboard (Account > API Keys)
   - The key is correctly set in your `.env` file without any spaces or quotes

2. **Service ID Error**: Verify that your service ID matches what's shown in the EmailJS dashboard (Email Services > [Your Service] > Service ID)

3. **Template ID Error**: Confirm your template ID from the EmailJS dashboard (Email Templates > [Your Template] > Template ID)

4. **Missing Parameters**: Ensure all required template variables are provided when sending an email

Note: The application is designed to continue working even if email sending fails. You'll see a console message, but product registration will still complete successfully.

## Running the Application

```bash
npm run dev
```

The application will be available at http://localhost:3000
