const AWS = require('aws-sdk');
var lambda = new AWS.Lambda();

const testInvoke = () => {
    var params = {
        ClientContext: "MyApp", 
        FunctionName: "MyFunction", 
        InvocationType: "Event", 
        LogType: "Tail", 
        Payload: {"some":"thing"}, 
        Qualifier: "1"
       };
       lambda.invoke(params, function(err, data) {
         if (err) console.log(err, err.stack); // an error occurred
         else     console.log(data);           // successful response
         /*
         data = {
          FunctionError: "", 
          LogResult: "", 
          Payload: <Binary String>, 
          StatusCode: 123
         }
         */
       });
}

module.exports ={
    testInvoke
}
