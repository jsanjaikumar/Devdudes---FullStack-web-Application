const cron = require("node-cron");
const {subDays, startOfDay, endOfDay} = require("date-fns");
const sendEmail = require("./sendEmail");
const connectionRequestModel = require("../models/connectionRequest");


cron.schedule("0 8 * * *", async () => {

  
  // This will run every day at 8 AM for the users who got the request the previous day
  try {
    
    const yesterday = subDays(new Date(), 1);

    const yesterdayStart = startOfDay(yesterday);
    const yesterdayEnd = endOfDay(yesterday);

    const pendingRequests = await connectionRequestModel
      .find({
        status: "interested",
        createdAt: {
          $gte: yesterdayStart,
          $lt: yesterdayEnd,
        },
      })
      .populate("fromUserId toUserId");

    const listOfEmails = [
      ...new Set(pendingRequests.map((req) => req.toUserId.emailId)),
    ];
    console.log(listOfEmails);

    for (const email of listOfEmails) {
      //send email to this user
      try {
        const res = await sendEmail.run(
          "New Friend Requests pending for " + email,
          "There are so many friend requests pending, please login to DevDudes.tech and build new connections!"
        );
        console.log(res);
      } catch (err) {
        console.error("Error sending email to " + email + " : " + err.message);
      }
    }
  } catch (err) {
    console.error("Cron Job Error: " + err.message);
  }
});