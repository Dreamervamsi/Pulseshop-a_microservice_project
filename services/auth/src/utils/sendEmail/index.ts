import transporter from "../../config/nodemailer.config";

export const sendEmail = (to:string,message:string)=>{

    const mailOptions = {
        from: process.env.EMAIL_ID,
        to: to,
        subject: 'Verification from nodemailer',
        text:message
    };
    
    transporter.sendMail(mailOptions,(error,info)=>{
        if(error)
        {
            return error.message;
        }
        console.log(info.messageId);
        return info;
    });
}