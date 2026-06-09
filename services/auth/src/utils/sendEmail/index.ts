import transporter from "../../config/nodemailer.config";

export const sendEmail = async(to:string,otp:string,message:string)=>{
        console.log("To address",to);
        const mailOptions = {
            from: process.env.EMAIL_ID || 'o220388@rguktrkv.ac.in',
            to: to,
            subject: 'Verification from nodemailer',
            text:message +" "+ otp
        };
        return new Promise((resolve)=>{
            transporter.sendMail(mailOptions,(error,info)=>{
                if(error)
                {

                    return resolve({
                        status:'failed',
                        message:'Failed to send otp',
                        error:error?.message
                   });
                }
                console.log("Nodemailer Success Details:", info.messageId);
                return resolve({
                    status:'success',
                    message:'Otp sent successfully',
                    data:info
                });
            });
        });
}