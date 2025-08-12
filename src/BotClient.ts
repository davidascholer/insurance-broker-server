import {
  LexRuntimeV2Client,
  RecognizeTextCommand,
} from "@aws-sdk/client-lex-runtime-v2"; // ES Modules import

export const talkToLexBot = async (msg:string, sessionId:string) => {
  try {
    const client = new LexRuntimeV2Client({
      region: process.env.AWS_REGION || "", // Replace with your AWS region
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
      },
    });
    const input = {
      // RecognizeTextRequest
      botId: process.env.BOT_ID || "", // required
      botAliasId: process.env.BOT_ALIAS_ID || "", // required
      localeId: "en_US", // required
      sessionId: sessionId, // required
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

    const command = new RecognizeTextCommand(input);
    const response = await client.send(command);
    const messagesContent = Array.isArray(response?.messages)
      ? response.messages
          .map((msg, key: any) => "msg " + key + ": " + msg.content)
          .join("\n")
      : "";
    console.log("Lex Bot Response in BotClient:", messagesContent);
    return response;
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
