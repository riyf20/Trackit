import { Resend } from 'resend';
const resend = new Resend(process.env.EXPO_PUBLIC_RESEND_API_KEY);


export const resetPasswordEmail = async (usernameValue:string, resetCode:number, emailTarget:string) => {

    // const data = await resend.emails.send({
    // from: 'you@example.com',
    // to: 'user@gmail.com',
    // replyTo: 'you@example.com',
    // subject: 'hello world',
    // text: 'it works!',
    // });

    
    try {
        const data = await resend.emails.send({
        from: 'TrackIt Admin <recovery@trackit.com>',
        to: [emailTarget],
        subject: 'Password Reset Code',
        html: `<strong>Hello ${usernameValue}! We have received your password reset request. Here is your code: ${resetCode}</strong>`
        });

        console.log(data);
    } catch (error) {
        console.error(error);
    }
    
    // console.log(`Email: ${emailTarget}`);

}