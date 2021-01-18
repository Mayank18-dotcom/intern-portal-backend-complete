const nodemailer = require("nodemailer");
var schedule = require("node-schedule");
var Task = require("../../models/task");
var User = require("../../models/user");

// var arr=[[],[]];
// var ar2 = [
//     {
//         date: "dummy"
//     },
//     {
//         email : "dummy1@gmail.com"
//     }
// ]
module.exports = (req, res) => {
    Task.find({},(err,result)=>{
        result.forEach(element=>{
            //arr.push([[element.enddate],[element.email]]);
            //ar2.push([{date : element.enddate},{email : element.email}]);
            var date = element.enddate;
            var email = element.email;
            //console.log("date is "+date+" email is "+email);
            /****************************************************** */
            //const time = req.body.date;
            //console.log(time);
            
            var fulldate = date.split('-');
            //console.log(fulldate);

            const fdate = fulldate[2];
            const fmonth = fulldate[1];
            const fyear =fulldate[0];
            console.log(fdate + "/" + fmonth + "/" + fyear);
        
            var timer = new Date(fyear, fmonth, fdate, 22, 50, 0);

            var j = schedule.scheduleJob(timer, function () {
            async function main() {
                let testAccount = await nodemailer.createTestAccount();
                let transporter = nodemailer.createTransport({
                service: "gmail",
                // true for 465, false for other ports
                auth: {
                    user: "jj6144@srmist.edu.in", // generated ethereal user
                    pass: "SRMworld$2468", // generated ethereal password
                },
                });
        
                let info = await transporter.sendMail({
                from: "jj6144@srmist.edu.in", // sender address
                to: email, // list of receivers
                subject: "Inception wave", // Subject line
                text: `Greetings, participant!
            
                Hello!
                
                Stay tuned!
                Warmest regards,
                Inception Wave`,
                html:
                    '<p style="font-size:20px;background:orange;border:3px;border-radius:15px;box-shadow:10px;color:black;padding:20px"><strong><bold>Inception Wave</bold></strong><br/><br/><br/>A reminder for your incomplete task<br/><br/>We hope you complete the quiz with positivity and dedication. So brace yourself for the test and best of luck!<br/><br/>Stay tuned!<br/>Warmest regards,<br/>Inception wave, SRMIST<br/></p>', // plain text body
                // html: "<b>Hello world?</b>", // html body
                });
                console.log("Message sent: %s", info.messageId);
                // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
        
                // Preview only available when sending through an Ethereal account
                //console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
            }
            main().catch(console.error);
            // console.log('The world is going to end today.');
            });
            //console.log(req.body.email);
            //res.status(200).json({ message: "hello" });
            /***************************************************** */
        })
        // console.log(ar2);
    })
  }