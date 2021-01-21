const nodemailer = require("nodemailer");
var schedule = require("node-schedule");
var Task = require("../../models/task");
var User = require("../../models/user");
module.exports = (req, res) => {
    Task.find({},(err,result)=>{
        result.forEach(element=>{
            var date = element.enddate;
            var email = element.email;
            var comp = element.complete;
            var name = element.taskname;
            var fulldate = date.split('-');

            const fdate = parseInt(fulldate[2]);
            const fmonth = parseInt(fulldate[1]) - 1;
            const fyear = parseInt(fulldate[0]);
            //console.log(fdate + "/" + fmonth + "/" + fyear);
        
            var timer = new Date(fyear, fmonth, fdate, 22, 28, 0);

            if(comp == "Incomplete")
            {
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
                            `<p style="font-size:20px;background:orange;border:3px;border-radius:15px;box-shadow:10px;color:black;padding:20px"><strong><bold>Inception Wave</bold></strong><br/><br/><br/>A reminder for your incomplete task<br/><br/>We hope you complete the <strong><bold>${name}</bold></strong> with positivity and dedication.!<br/><br/>Stay tuned!<br/>Warmest regards,<br/>Inception wave, SRMIST<br/></p>`, // plain text body
                        // html: "<b>Hello world?</b>", // html body
                        });
                        console.log("Message sent: %s", info.messageId);
                    }
                    main().catch(console.error);
                });
            }
        })
    })
  }