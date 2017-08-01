// let elasticsearch = require('elasticsearch');

// let client = new elasticsearch.Client({
//   host: 'localhost:9200',
//   log: 'error'
// });


// //create or update a document:
// // client.index({
// //   index: 'myindex',
// //   type: 'mytype',
// //   id: '1',
// //   body: {
// //     title: 'Test 1',
// //     tags: ['y', 'z'],
// //     published: true,
// //   }
// // }, function (error, response) {
// // });

// const express = require('express');
// const NaturalLanguageUnderstandingV1 = require('watson-developer-cloud/natural-language-understanding/v1.js');
// const elasticsearch = require('elasticsearch');
// const watsonConfig = require('./watson-config.js');

// const username = watsonConfig.username;
// const password = watsonConfig.password;

// const nlu = new NaturalLanguageUnderstandingV1({
//   username: username,
//   password: password,
//   version_date: NaturalLanguageUnderstandingV1.VERSION_DATE_2017_02_27,
// });

// const client = new elasticsearch.Client({
//   host: 'localhost:9200',
//   log: 'error'
// });

// const getFromWatson = (url, callback) => {
//   nlu.analyze({
//   'url': url,
//   'features': {
//     'categories' : {},
//     'metadata': {}
//   },
//   'return_analyzed_text': true
// }, function(err, response) {
//     callback(err, response);
//  });
// };



// // var testUrl = 'http://www.cnn.com/2017/07/31/politics/kelly-comey-phone-call-angry/index.html';

// // getFromWatson(testUrl, function(err, data) {
// //   if (err) {
// //     console.error(err);
// //   } else {
// //     console.log(data);
// //     client.index({
// //   index: 'article',
// //   type: 'mytype',
// //   id: '1',
// //   body: {
// //     title: data.metadata.title,
// //     text: data.analyzed_text,
// //     url: testUrl
// //   }
// // }, function (error, response) {
// //   if (err) {
// //     console.error(err);
// //   } else {
// //     console.log(response);
// //   }
// // });
// //   }
// // });

// // const indices = function indices() {
// //   return client.cat.indices({v: true})
// //     .then(console.log)
// //     .catch((err) => {
// //       console.error(`Error connecting to the es client: ${err}`);
// //   });
// // };

// //   console.log(`elasticsearch indices information:`);
// //   indices();

// // when the url is saved, save the title, the categories in url table
// // save everything in elasticsearch

