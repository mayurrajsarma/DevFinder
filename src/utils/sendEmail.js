// const { SendEmailCommand } =  require("@aws-sdk/client-ses") ;
// const { sesClient } = require("./sesClient.js") ;


// const createSendEmailCommand = (toAddress, fromAddress) => {
//     return new SendEmailCommand({
//       Destination: {
//         /* required */
//         CcAddresses: [
//           /* more items */
//         ],
//         ToAddresses: [
//           toAddress,
//           /* more To-email addresses */
//         ],
//       },
//       Message: {
//         /* required */
//         Body: {
//           /* required */
//           Html: {
//             Charset: "UTF-8",
//             Data: "HTML_FORMAT_BODY",
//           },
//           Text: {
//             Charset: "UTF-8",
//             Data: "TEXT_FORMAT_BODY",
//           },
//         },
//         Subject: {
//           Charset: "UTF-8",
//           Data: "EMAIL_SUBJECT",
//         },
//       },
//       Source: fromAddress,
//       ReplyToAddresses: [
//         /* more items */
//       ],
//     });
//   };

// const run = async () => {
//     const sendEmailCommand = createSendEmailCommand(
//       "mayurrajsarma@gmail.com",
//       "support@mayurvault.in",
//     );
  
//     try {
//       return await sesClient.send(sendEmailCommand);
//     } catch (caught) {
//       if (caught instanceof Error && caught.name === "MessageRejected") {
//         const messageRejectedError = caught;
//         return messageRejectedError;
//       }
//       throw caught;
//     }
// };

// module.exports =  { run };