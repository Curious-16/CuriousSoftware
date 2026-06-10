const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "mkeerthivarman34@gmail.com",   // your email
    pass: "uuuoplcmjzxueslg"           // Gmail App Password (not normal password)
  }
});