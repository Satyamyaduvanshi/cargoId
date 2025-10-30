import emailjs from '@emailjs/browser';

// Initialize EmailJS with your public key
// Make sure to set VITE_EMAILJS_PUBLIC_KEY in your .env file
const publicKey = process.env.VITE_EMAILJS_PUBLIC_KEY || '';
const serviceId = process.env.VITE_EMAILJS_SERVICE_ID || '';
const templateId = process.env.VITE_EMAILJS_TEMPLATE_ID || '';

// Only initialize if we have a public key
if (publicKey) {
  emailjs.init(publicKey);
}

interface EmailParams extends Record<string, unknown> {
  to_email: string;
  product_name: string;
  product_make: string;
  product_id: string;
  verification_link: string;
}

// Function to manually init EmailJS (can be called from other components if needed)
export const initEmailJS = (key: string) => {
  if (key) {
    emailjs.init(key);
    console.log('EmailJS initialized with provided key');
    return true;
  }
  return false;
};

export const sendProductRegistrationEmail = async (params: EmailParams) => {
  try {
    // If public key is not set, log a message but don't throw an error
    // This allows the product registration to continue even if email fails
    if (!publicKey) {
      console.warn('EmailJS public key is not set. Email will not be sent.');
      console.info('To fix this issue:');
      console.info('1. Get your EmailJS public key from https://dashboard.emailjs.com/admin/account');
      console.info('2. Set VITE_EMAILJS_PUBLIC_KEY in your .env file');
      return { status: 'skipped', text: 'Email sending skipped due to missing public key' };
    }

    // Check if required parameters are present
    if (!params.to_email || !params.product_name || !params.product_make || !params.product_id || !params.verification_link) {
      console.warn('Missing required email parameters');
      return { status: 'skipped', text: 'Email sending skipped due to missing parameters' };
    }

    // Check if service ID and template ID are set
    if (!serviceId || !templateId) {
      console.warn('EmailJS service ID or template ID is not set. Email will not be sent.');
      return { status: 'skipped', text: 'Email sending skipped due to missing service or template ID' };
    }

    // Prepare the parameters for the email template
    const emailParams = {
      to_email: params.to_email,
      product_name: params.product_name,
      product_make: params.product_make,
      product_id: params.product_id,
      verification_link: params.verification_link
    };

    const response = await emailjs.send(
      serviceId,
      templateId,
      emailParams
    );
    
    console.log('Email sent successfully:', response);
    return response;
  } catch (error) {
    console.error('Error sending email:', error);
    // Return error object instead of throwing to prevent breaking the product registration flow
    return { status: 'error', error };
  }
}; 