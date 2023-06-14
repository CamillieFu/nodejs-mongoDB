const fs = require('fs');
const { resolve } = require('path');
const superagent = require('superagent');
// global function
const readFilePro = (file) => {
  return new Promise((resolve, reject) => {
    fs.readFile(file, (err, data) => {
      if (err) reject('File Not Found');
      resolve(data);
    });
  });
};

const writeFilePro = (file, data) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(file, data, (err) => {
      if (err) reject('Unable to write file.');
      // writing files doesn't necessarily need to return a meaningful value
      resolve('Success.');
    });
  });
};

// const capitalize = (str) => {
//   const lowercaseStr = str.toLowerCase();
//   return str.charAt(0).toUpperCase() + lowercaseStr.slice(1);
// };

// async await method
const getDogPic = async () => {
  try {
    const data = await readFilePro(`${__dirname}/dog.txt`);
    const dog = data.toString('utf8').trim();
    const res = await superagent.get(`https://dog.ceo/api/breed/${dog}/images/random`);
    console.log(`Successful api call retrived the img ${res.body.message}`);
    await writeFilePro('dog-img.txt', res.body.message);
    console.log('File (image) successfully written. 👾');
  } catch (err) {
    console.log(err);
  }
};

getDogPic();

// manually writing promises method

// readFilePro(`${__dirname}/dog.txt`)
//   .then((data) => {
//     const dog = data.toString('utf8').trim();
//     // this return returns a promise that we can use "then" on
//     return superagent.get(`https://dog.ceo/api/breed/${dog}/images/random`);
//   })
//   .then((res) => {
//     console.log('writting file ...');
//     console.log(res);
//     return writeFilePro('dog-img.txt', res.body.message);
//   })
//   .then(() => {
//     console.log('Random dog image saved to file.');
//   })
//   .catch((err) => {
//     console.log(err);
//   });

// callback hell
// fs.readFile(`${__dirname}/dog.txt`, (err, data) => {
//   console.log(`Breed: ${data}`);
//   // remove newline from text that prettier inserts
//   const dog = data.toString('utf8').trim();

//   superagent
//     .get(`https://dog.ceo/api/breed/${dog}/images/random`)
//     // promises allow for chaining rather than nesting
//     .then((res) => {
//       // err handling comes first
//       fs.writeFile('dog-img.txt', res.body.message, (err) => {
//         console.log('dog img saved');
//       });
//     })
//     .catch((err) => {
//       console.log(err.message);
//     });
// });
