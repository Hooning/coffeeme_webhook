
# A Simple Authenticated Webhook for API.AI with Node.js.
Copyrights from : https://github.com/supermamon/apiai-nodejs-webhook-sample

# Coffee Ordering Chatbot Program
with Dialogflow(aka API.AI) + Slack Integration

1. Make an account for Dialogflow (chatbot platform) \n
: https://console.dialogflow.com/api-client/#/login

2. Create a new agent \n
: https://console.dialogflow.com/api-client/#/newAgent

3. Edit agent import Entities and Intents from .ZIP file \n
: https://console.dialogflow.com/api-client/#/editAgent \n
  Choose this file => ["CoffeeMeBot.zip" - API.AI Entities and intents for slack integration]
  
4. Select Fulfillment menu from selected agent then fill appropriate information
 - 1) URL* \n
   e.g. https://coffeemewebhook.herokuapp.com/webhook
 - 2) HEADERS \n 
   e.g. Auth-Token : an-example-token
   above token value will be checked in Webhook server.

5. Select Integrations menu from selected agent then activate the slack integration \n
: Sign in to already created workspace from slack, then you are ready to go for the test

This Chatbot program was created for self study. \n
I have not connected to proper database, just used .txt file for temporal use of input data.

Most basic communication with Chatbot was available with Dialogflow chatbot platform, \n
But when I needed some data to remember the order from the customer, \n
I have used the webhook to validated or update the data.

