import nodemailer from "nodemailer";

export async function sendEmail(to,subject,html){
    const transporter = nodemailer.createTransport({
        service:'gmail',
        auth: {
          user: "ali.zaka2012@gmail.com",
          pass: "nlxe fzpf cngz azoe",
        },
      });
        const info = await transporter.sendMail({
          from: '"Maddison Foo Koch 👻" <ali.zaka2012@gmail.com>', // sender address
          to,
          subject,
          html,
        });
        return info;
}

