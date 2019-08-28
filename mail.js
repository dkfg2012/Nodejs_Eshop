function Mailer(subjects, content, reciever){
	const nodemailer = require('nodemailer');
	this.subject = subjects;
	this.content = content;
	this.reciever = reciever

	// const cont = "You have just bought " + parseInt(l) + " item, and the total price is "+ parseInt(t) +" HKD. Your account remain "+parseInt(r)+" HKD."

	let transporter = nodemailer.createTransport({
		host: 'smtp.mail.yahoo.com',
		port: 587,
		secure: false,
		auth:{
			user: 'dkfg2012@yahoo.com.hk',
			pass: 'public static void main(String args[])'
		}
	})

	let mailOption = {
		from: '"Nodemailer" <dkfg2012@yahoo.com.hk>',
		to: reciever,
		subject: subjects,
		text: 'hello world',
		html: content
	}

	transporter.sendMail(mailOption, function(err, info){
		if(err) throw err;
		console.log('Message send: %s', info.messageId);
		console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info))
	})

}

module.exports = Mailer;