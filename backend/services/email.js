const nodemailer = require('nodemailer');

// Configurar el transporte con los datos de servidor de correo

async function sendTemporaryPassword(to, password, userName){
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
    const subject = 'CACSA Contraseña Temporal';
    const htmlBody = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Contraseña Temporal CACSA</title>
    </head>
    <body>
      <h2>¡Bienvenido a CACSA, ${userName}!</h2>
      <p>Aquí está su contraseña temporal:</p>
      <p><strong>Contraseña Temporal:</strong> ${password}</p>
      <p>Cuando ingreses al sistema, deberás ingresar una nueva contraseña, asegurate de que sea una segura.</p>
      <br></br>
      <strong>Este es un correo generado automáticamente, por favor no contestar.</strong>
    </body>
    </html>
  `;

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: to,
      subject: subject,
      html: htmlBody
    });
  } catch (error) {
    throw new Error(error.message);
  }
}

async function sendEditNotification(to){
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
  const subject = 'Edición de perfil CACSA';
    const htmlBody = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Edición de perfil CACSA</title>
    </head>
    <body>
      <h2>Hola,</h2>
      <p>Hemos detectado que la cuenta asociada al correo: <strong>${to}</strong> ha sido editada.</p>
      <p>Si no fuiste tú o no lo autorizaste, contacta al administrador.</p>
      <br></br>
      <strong>Este es un correo generado automáticamente, por favor no contestar.</strong>
    </body>
    </html>
  `;

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: to,
      subject: subject,
      html: htmlBody
    });
  } catch (error) {
    throw new Error(error.message);
  }
}

async function sendDeleteNotification(to, userName) {
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
  const subject = 'Perfil eliminado CACSA';
  const htmlBody = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Perfil eliminado CACSA</title>
    </head>
    <body>
      <h2>Hola ${userName},</h2>
      <p>Hemos detectado que la cuenta asociada al correo: <strong>${to}</strong> ha sido eliminada.</p>
      <p>Si esto es inesperado, contacta al administrador.</p>
      <br></br>
      <strong>Este es un correo generado automáticamente, por favor no contestar.</strong>
    </body>
    </html>
  `;

  console.log(`${process.env.EMAIL_USER}\n\n\n\n`);
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: to,
      subject: subject,
      html: htmlBody
    });
  } catch (error) {
    throw new Error(error.message);
  }
}

module.exports = {
    sendTemporaryPassword,
    sendEditNotification,
    sendDeleteNotification,
};