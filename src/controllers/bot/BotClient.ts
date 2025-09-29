import {
  LexRuntimeV2Client,
  RecognizeTextCommand,
} from "@aws-sdk/client-lex-runtime-v2"; // ES Modules import

const botDetails = {
  region: process.env.AWS_REGION, // Specify the AWS region where your bot is located
  botId: process.env.BOT_ID, // Your Bot ID
  botAliasId: process.env.BOT_ALIAS_ID, // Your Bot Alias ID
  localeId: "en_US",
  sessionId: "some-unique-session-id", // A unique session ID for the conversation
};
// Create a LexRuntimeV2 client
const client = new LexRuntimeV2Client({
  region: botDetails.region,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
});
const localSessionId = "user-" + Date.now(); // Unique identifier for the session

export const talkToLexBot = async (msg: string, sessionId: string) => {
  try {
    const params = {
      // RecognizeTextRequest
      botId: process.env.BOT_ID || "", // required
      botAliasId: process.env.BOT_ALIAS_ID || "", // required
      localeId: "en_US", // required
      sessionId: localSessionId, // required
      text: msg, // required
      // sessionState: { // SessionState
      //   dialogAction: { // DialogAction
      //     type: "Close" || "ConfirmIntent" || "Delegate" || "ElicitIntent" || "ElicitSlot" || "None", // required
      //     slotToElicit: "STRING_VALUE",
      //     slotElicitationStyle: "Default" || "SpellByLetter" || "SpellByWord",
      //     subSlotToElicit: { // ElicitSubSlot
      //       name: "STRING_VALUE", // required
      //       subSlotToElicit: {
      //         name: "STRING_VALUE", // required
      //         subSlotToElicit: "<ElicitSubSlot>",
      //       },
      //     },
      //   },
      //   intent: { // Intent
      //     name: "STRING_VALUE", // required
      //     slots: { // Slots
      //       "<keys>": { // Slot
      //         value: { // Value
      //           originalValue: "STRING_VALUE",
      //           interpretedValue: "STRING_VALUE", // required
      //           resolvedValues: [ // StringList
      //             "STRING_VALUE",
      //           ],
      //         },
      //         shape: "Scalar" || "List" || "Composite",
      //         values: [ // Values
      //           {
      //             value: {
      //               originalValue: "STRING_VALUE",
      //               interpretedValue: "STRING_VALUE", // required
      //               resolvedValues: [
      //                 "STRING_VALUE",
      //               ],
      //             },
      //             shape: "Scalar" || "List" || "Composite",
      //             values: [
      //               "<Slot>",
      //             ],
      //             subSlots: {
      //               "<keys>": "<Slot>",
      //             },
      //           },
      //         ],
      //         subSlots: "<Slots>",
      //       },
      //     },
      //     state: "Failed" || "Fulfilled" || "InProgress" || "ReadyForFulfillment" || "Waiting" || "FulfillmentInProgress",
      //     confirmationState: "Confirmed" || "Denied" || "None",
      //   },
      //   activeContexts: [ // ActiveContextsList
      //     { // ActiveContext
      //       name: "STRING_VALUE", // required
      //       timeToLive: { // ActiveContextTimeToLive
      //         timeToLiveInSeconds: Number("int"), // required
      //         turnsToLive: Number("int"), // required
      //       },
      //       contextAttributes: { // ActiveContextParametersMap // required
      //         "<keys>": "STRING_VALUE",
      //       },
      //     },
      //   ],
      //   sessionAttributes: { // StringMap
      //     "<keys>": "STRING_VALUE",
      //   },
      //   originatingRequestId: "STRING_VALUE",
      //   runtimeHints: { // RuntimeHints
      //     slotHints: { // SlotHintsIntentMap
      //       "<keys>": { // SlotHintsSlotMap
      //         "<keys>": { // RuntimeHintDetails
      //           runtimeHintValues: [ // RuntimeHintValuesList
      //             { // RuntimeHintValue
      //               phrase: "STRING_VALUE", // required
      //             },
      //           ],
      //           subSlotHints: {
      //             "<keys>": {
      //               runtimeHintValues: [
      //                 {
      //                   phrase: "STRING_VALUE", // required
      //                 },
      //               ],
      //               subSlotHints: "<SlotHintsSlotMap>",
      //             },
      //           },
      //         },
      //       },
      //     },
      //   },
      // },
      // requestAttributes: {
      //   "<keys>": "STRING_VALUE",
      // },
    };

    console.log("Sending message to Lex Bot:", msg);
    console.log("Using sessionId:", localSessionId);
    console.log("region:", process.env.AWS_REGION);
    console.log("botId:", process.env.BOT_ID);
    console.log("botAliasId:", process.env.BOT_ALIAS_ID);

    const command = new RecognizeTextCommand(params);
    try {
      const response = await client.send(command);
      console.log("Successfully sent message. Response:");
      console.log(JSON.stringify(response));
      // if(!response.messages) {
      //   console.log("No messages in Lex response");
      //   return { ...response, messages: ["I am un"] };
      // }
      if (response.messages && response.messages.length > 0) {
        const messagesContent = Array.isArray(response?.messages)
          ? response.messages
              .map((msg, key: any) => "msg " + key + ": " + msg.content)
              .join("\n")
          : "";
        console.log("Lex Bot Response in BotClient:", messagesContent);
        return { ...response, messages: messagesContent };
      }
      if (
        response.interpretations &&
        Array.isArray(response.interpretations) &&
        response.interpretations.length > 0 &&
        response.interpretations[0].intent &&
        response.interpretations[0].intent.name === "FallbackIntent"
      )
        console.log("Returning fallback message.");
      return {
        ...response,
        message:
          "I am unable to assist with that question but please, ask me anything about pet insurance.",
      };
    } catch (err) {
      console.error("Error communicating with Lex bot:", err);
      console.log("Returning error message.");
      return { message: "I am unable to assist with that question." };
    }
    // { // RecognizeTextResponse
    //   messages: [ // Messages
    //     { // Message
    //       content: "STRING_VALUE",
    //       contentType: "CustomPayload" || "ImageResponseCard" || "PlainText" || "SSML", // required
    //       imageResponseCard: { // ImageResponseCard
    //         title: "STRING_VALUE", // required
    //         subtitle: "STRING_VALUE",
    //         imageUrl: "STRING_VALUE",
    //         buttons: [ // ButtonsList
    //           { // Button
    //             text: "STRING_VALUE", // required
    //             value: "STRING_VALUE", // required
    //           },
    //         ],
    //       },
    //     },
    //   ],
    //   sessionState: { // SessionState
    //     dialogAction: { // DialogAction
    //       type: "Close" || "ConfirmIntent" || "Delegate" || "ElicitIntent" || "ElicitSlot" || "None", // required
    //       slotToElicit: "STRING_VALUE",
    //       slotElicitationStyle: "Default" || "SpellByLetter" || "SpellByWord",
    //       subSlotToElicit: { // ElicitSubSlot
    //         name: "STRING_VALUE", // required
    //         subSlotToElicit: {
    //           name: "STRING_VALUE", // required
    //           subSlotToElicit: "<ElicitSubSlot>",
    //         },
    //       },
    //     },
    //     intent: { // Intent
    //       name: "STRING_VALUE", // required
    //       slots: { // Slots
    //         "<keys>": { // Slot
    //           value: { // Value
    //             originalValue: "STRING_VALUE",
    //             interpretedValue: "STRING_VALUE", // required
    //             resolvedValues: [ // StringList
    //               "STRING_VALUE",
    //             ],
    //           },
    //           shape: "Scalar" || "List" || "Composite",
    //           values: [ // Values
    //             {
    //               value: {
    //                 originalValue: "STRING_VALUE",
    //                 interpretedValue: "STRING_VALUE", // required
    //                 resolvedValues: [
    //                   "STRING_VALUE",
    //                 ],
    //               },
    //               shape: "Scalar" || "List" || "Composite",
    //               values: [
    //                 "<Slot>",
    //               ],
    //               subSlots: {
    //                 "<keys>": "<Slot>",
    //               },
    //             },
    //           ],
    //           subSlots: "<Slots>",
    //         },
    //       },
    //       state: "Failed" || "Fulfilled" || "InProgress" || "ReadyForFulfillment" || "Waiting" || "FulfillmentInProgress",
    //       confirmationState: "Confirmed" || "Denied" || "None",
    //     },
    //     activeContexts: [ // ActiveContextsList
    //       { // ActiveContext
    //         name: "STRING_VALUE", // required
    //         timeToLive: { // ActiveContextTimeToLive
    //           timeToLiveInSeconds: Number("int"), // required
    //           turnsToLive: Number("int"), // required
    //         },
    //         contextAttributes: { // ActiveContextParametersMap // required
    //           "<keys>": "STRING_VALUE",
    //         },
    //       },
    //     ],
    //     sessionAttributes: { // StringMap
    //       "<keys>": "STRING_VALUE",
    //     },
    //     originatingRequestId: "STRING_VALUE",
    //     runtimeHints: { // RuntimeHints
    //       slotHints: { // SlotHintsIntentMap
    //         "<keys>": { // SlotHintsSlotMap
    //           "<keys>": { // RuntimeHintDetails
    //             runtimeHintValues: [ // RuntimeHintValuesList
    //               { // RuntimeHintValue
    //                 phrase: "STRING_VALUE", // required
    //               },
    //             ],
    //             subSlotHints: {
    //               "<keys>": {
    //                 runtimeHintValues: [
    //                   {
    //                     phrase: "STRING_VALUE", // required
    //                   },
    //                 ],
    //                 subSlotHints: "<SlotHintsSlotMap>",
    //               },
    //             },
    //           },
    //         },
    //       },
    //     },
    //   },
    //   interpretations: [ // Interpretations
    //     { // Interpretation
    //       nluConfidence: { // ConfidenceScore
    //         score: Number("double"),
    //       },
    //       sentimentResponse: { // SentimentResponse
    //         sentiment: "MIXED" || "NEGATIVE" || "NEUTRAL" || "POSITIVE",
    //         sentimentScore: { // SentimentScore
    //           positive: Number("double"),
    //           negative: Number("double"),
    //           neutral: Number("double"),
    //           mixed: Number("double"),
    //         },
    //       },
    //       intent: {
    //         name: "STRING_VALUE", // required
    //         slots: "<Slots>",
    //         state: "Failed" || "Fulfilled" || "InProgress" || "ReadyForFulfillment" || "Waiting" || "FulfillmentInProgress",
    //         confirmationState: "Confirmed" || "Denied" || "None",
    //       },
    //       interpretationSource: "Bedrock" || "Lex",
    //     },
    //   ],
    //   requestAttributes: {
    //     "<keys>": "STRING_VALUE",
    //   },
    //   sessionId: "STRING_VALUE",
    //   recognizedBotMember: { // RecognizedBotMember
    //     botId: "STRING_VALUE", // required
    //     botName: "STRING_VALUE",
    //   },
    // };
  } catch (error) {
    console.log("Error initiating Lex bot:", error);
    return { error: error };
  }
};
