const nodemailer = require("nodemailer");
var schedule = require("node-schedule");
var Admin = require("../../models/admin");
module.exports = {
  sendRemainderEmail : function (){
    console.log(`server started`);
    var tasks = [];
    Admin.find({}, (err, result) => {
      result.forEach((ele)=>{
        tasks.push(ele.task);
      })
      tasks = tasks[0];
      var interns = [];
      tasks.forEach((ele)=>{
        interns.push(ele.interns);
      })
      tasks = [];
      //res.json(interns);
      var dataForEmail = [];
      interns.forEach((ele)=>{
        ele.forEach((eele)=>{
          if(eele.complete === "Incomplete")
          {
            dataForEmail.push({
              "email":eele.internemail,
              "date":eele.enddate,
              "comp":eele.complete
            });
          }
        })
      })
      interns = []
      //res.json(dataForEmail);
      dataForEmail.forEach((element) => {
        var date = element.date;
        var email = element.email;
        var comp = element.comp;
        var fulldate = date.split("-");

        const fdate = parseInt(fulldate[2]);
        const fmonth = parseInt(fulldate[1]) - 1;
        const fyear = parseInt(fulldate[0]);
        //console.log(`Send Email to ${email} on ${fdate}/${fmonth}/${fyear}`);

        var timer = new Date(fyear, fmonth, fdate, 2,20, 0);
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
              html: `<p style="font-size:20px;background:orange;border:3px;border-radius:15px;box-shadow:10px;color:black;padding:20px"><strong><bold>Inception Wave</bold></strong><br/><br/><br/>A reminder for your incomplete task<br/><br/>We hope you complete the task with positivity and dedication.!<br/><br/>Stay tuned!<br/>Warmest regards,<br/>Inception wave, SRMIST<br/></p>`, // plain text body
              // html: "<b>Hello world?</b>", // html body
            });
            console.log("Message sent: %s", info.messageId);
          }
          main().catch(console.error);
        });
      });
    });
  }
};














// const nodemailer = require("nodemailer");
// var schedule = require("node-schedule");
// var Admin = require("../../models/admin");
// module.exports = (req, res) => {
//   var tasks = []
//   Admin.find({}, (err, result) => {
//     result.forEach((ele)=>{
//       tasks.push(ele.task);
//     })
//     tasks = tasks[0];
//     var interns = [];
//     tasks.forEach((ele)=>{
//       interns.push(ele.interns);
//     })
//     tasks = [];
//     //res.json(interns);
//     var dataForEmail = [];
//     interns.forEach((ele)=>{
//       ele.forEach((eele)=>{
//         if(eele.complete === "Incomplete")
//         {
//           dataForEmail.push({
//             "email":eele.internemail,
//             "date":eele.enddate,
//             "comp":eele.complete
//           });
//         }
//       })
//     })
//     interns = []
//     res.json(dataForEmail);
//     dataForEmail.forEach((element) => {
//       var date = element.date;
//       var email = element.email;
//       var comp = element.comp;
//       var fulldate = date.split("-");

//       const fdate = parseInt(fulldate[2]);
//       const fmonth = parseInt(fulldate[1]) - 1;
//       const fyear = parseInt(fulldate[0]);
//       console.log(fdate + "/" + fmonth + "/" + fyear);

//       var timer = new Date(fyear, fmonth, fdate, 1,54, 0);
//       var j = schedule.scheduleJob(timer, function () {
//         async function main() {
//           let testAccount = await nodemailer.createTestAccount();
//           let transporter = nodemailer.createTransport({
//             service: "gmail",
//             // true for 465, false for other ports
//             auth: {
//               user: "jj6144@srmist.edu.in", // generated ethereal user
//               pass: "SRMworld$2468", // generated ethereal password
//             },
//           });

//           let info = await transporter.sendMail({
//             from: "jj6144@srmist.edu.in", // sender address
//             to: email, // list of receivers
//             subject: "Inception wave", // Subject line
//             text: `Greetings, participant!
                  
//                       Hello!
                      
//                       Stay tuned!
//                       Warmest regards,
//                       Inception Wave`,
//             html: `<p style="font-size:20px;background:orange;border:3px;border-radius:15px;box-shadow:10px;color:black;padding:20px"><strong><bold>Inception Wave</bold></strong><br/><br/><br/>A reminder for your incomplete task<br/><br/>We hope you complete the task with positivity and dedication.!<br/><br/>Stay tuned!<br/>Warmest regards,<br/>Inception wave, SRMIST<br/></p>`, // plain text body
//             // html: "<b>Hello world?</b>", // html body
//           });
//           console.log("Message sent: %s", info.messageId);
//         }
//         main().catch(console.error);
//       });
//     });
//   });
// };