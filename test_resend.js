require('dotenv').config();
const { Resend } = require('resend');

try {
  const resend = new Resend('fake_key');
  console.log('Resend instantiated with fake key');
} catch (e) {
  console.log('Resend failed to instantiate', e);
}
