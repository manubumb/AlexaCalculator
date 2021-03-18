'use strict';

//import ask-sdk-core
const Alexa = require('ask-sdk-core');
const request = require('request');
const http = require('http');

const url = "https://api.spacexdata.com/v4/crew";//"https://jsonplaceholder.typicode.com/todos/1"; //"http://numbersapi.com/21";
request.get(url, (error, response, body) => {
    if (error) console.log('error:', error);
//    console.log('status code', response && response.statusCode);
    console.log('body:', body);

    let json = JSON.parse(body);
//    let title = "title: ";
//    title += json.title;
    console.log('length ', json.length);
    console.log('json', json);
});

//skill name
const appName = 'My Calculator';

//code for the handlers
const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
    },
    handle(handlerInput) {
        //welcome message
        let speechText = 'Welcome to my test calculator.  You can say, add 2 and 5, or multiply 4 and 8.';
        //welcome screen message
        let displayText = "Welcome to my test calculator"
        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(speechText)
            .withSimpleCard(appName, displayText)
            .getResponse();
    }
};

// function to get data via http
function httpGet(value) {
    return new Promise (((resolve, reject) => {
        var options = {
            host: 'numbersapi.com',
            port: 80,
            path: `/${value}`,
            method: 'GET'
        };

        var req = http.request(options, res => {
            res.setEncoding('utf8');
            var returnData = '';
    
            res.on('data', chunk => {
                returnData += chunk;
            });
    
            res.on('end', () => {
                console.log(`returnData ${returnData}`);
                resolve(returnData);
            });

            res.on('error', (error) => {
                reject(error);
            });
        });
        req.end();    
    }));
}

//implement custom handlers

const AddIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
        handlerInput.requestEnvelope.request.intent.name === 'AddIntent'
    }, async handle(handlerInput) {
        let speechText = '';
        let displayText = '';
        let intent = handlerInput.requestEnvelope.request.intent;
        let firstNumber = intent.slots.firstNumber.value;
        let secondNumber = intent.slots.secondNumber.value;

        if (firstNumber && secondNumber) {
            let result = parseInt(firstNumber) + parseInt(secondNumber);
            speechText = `The result of ${firstNumber} plus ${secondNumber} is ${result}.  `;
            displayText = `${result}`;

/*            // get the number fact about this result
            const url = `http://numbersapi.com/${result}`; //"https://jsonplaceholder.typicode.com/todos/1"; 
            request.get(url, (error, response, body) => {
                if (error) console.log('error:', error);
                console.log('status code', response && response.statusCode);
                console.log('body: ', body);
                console.log('speechText1: ', speechText);
                speechText = "this is a test";
//                this.response.speak(body);
            });
*/
            const response = await httpGet(result);
            console.log(`response ${response}`);

            return handlerInput.responseBuilder
            .speak(speechText+response)
            .withSimpleCard(appName, displayText)
//            .withShouldEndSession(true)
            .reprompt('Would you like to do anything else?')
            .getResponse();
        } else {
            //ask for the required input
            return handlerInput.responseBuilder
            .addDelegateDirective(intent)
            .getResponse();
        }
    }
};

const SubtractIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
        handlerInput.requestEnvelope.request.intent.name === 'SubtractIntent'
    }, handle(handlerInput) {
        let speechText = '';
        let displayText = '';
        let intent = handlerInput.requestEnvelope.request.intent;
        let firstNumber = intent.slots.firstNumber.value;
        let secondNumber = intent.slots.secondNumber.value;

        if (firstNumber && secondNumber) {
            let result = parseInt(secondNumber) - parseInt(firstNumber);
            speechText = `The result of ${secondNumber} minus ${firstNumber} is ${result}`;
            displayText = `${result}`;

            return handlerInput.responseBuilder
            .speak(speechText)
            .withSimpleCard(appName, displayText)
            .withShouldEndSession(true)
            .getResponse();
        } else {
            //ask for the required input
            return handlerInput.responseBuilder
            .addDelegateDirective(intent)
            .getResponse();
        }
    }
};

const MultiplyIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
        handlerInput.requestEnvelope.request.intent.name === 'MultiplyIntent'
    }, handle(handlerInput) {
        let speechText = '';
        let displayText = '';
        let intent = handlerInput.requestEnvelope.request.intent;
        let firstNumber = intent.slots.firstNumber.value;
        let secondNumber = intent.slots.secondNumber.value;

        if (firstNumber && secondNumber) {
            let result = parseInt(firstNumber) * parseInt(secondNumber);
            speechText = `The result of ${firstNumber} times ${secondNumber} is ${result}`;
            displayText = `${result}`;

            return handlerInput.responseBuilder
            .speak(speechText)
            .withSimpleCard(appName, displayText)
            .withShouldEndSession(true)
            .getResponse();
        } else {
            //ask for the required input
            return handlerInput.responseBuilder
            .addDelegateDirective(intent)
            .getResponse();
        }
    }
};

const DivideIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
        handlerInput.requestEnvelope.request.intent.name === 'DivideIntent'
    }, handle(handlerInput) {
        let speechText = '';
        let displayText = '';
        let intent = handlerInput.requestEnvelope.request.intent;
        let firstNumber = intent.slots.firstNumber.value;
        let secondNumber = intent.slots.secondNumber.value;

        if (firstNumber && secondNumber) {
            let result = parseInt(firstNumber) / parseInt(secondNumber);
            result = +result.toFixed(2); // two decimal places
            speechText = `The result of ${firstNumber} divided by ${secondNumber} is ${result}`;
            displayText = `${result}`;

            return handlerInput.responseBuilder
            .speak(speechText)
            .withSimpleCard(appName, displayText)
            .withShouldEndSession(true)
            .getResponse();
        } else {
            //ask for the required input
            return handlerInput.responseBuilder
            .addDelegateDirective(intent)
            .getResponse();
        }
    }
};
//end Custom handlers

const HelpIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        //help text for your skill
        let speechText = 'you can say add 3 and 5 or divide 50 by 2';

        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(speechText)
            .withSimpleCard(appName, speechText)
            .getResponse();
    }
};

const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && (handlerInput.requestEnvelope.request.intent.name === 'AMAZON.CancelIntent'
                || handlerInput.requestEnvelope.request.intent.name === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
        let speechText = 'Goodbye';
        return handlerInput.responseBuilder
            .speak(speechText)
            .withSimpleCard(appName, speechText)
            .getResponse();
    }
};

const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        //any cleanup logic goes here
        return handlerInput.responseBuilder.getResponse();
    }
};

//Lambda handler function
//Remember to add custom request handlers here
exports.handler = Alexa.SkillBuilders.custom()
     .addRequestHandlers(LaunchRequestHandler,
                         AddIntentHandler,
                         SubtractIntentHandler,
                         MultiplyIntentHandler,
                         DivideIntentHandler,
                         HelpIntentHandler,
                         CancelAndStopIntentHandler,
                         SessionEndedRequestHandler).lambda();
