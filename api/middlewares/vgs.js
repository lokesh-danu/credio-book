// const { loadVGSCollect } = require('@vgs/collect-js').loadVGSCollect;
// const fetch = require('node-fetch');

// require('dotenv').config();

// async function collect() {
//   return await loadVGSCollect({
//     vaultId: process.env.VGS,
//     environment: process.env.NODE_ENV,
//     version: '2.11.0'
//   }).catch((e) => { });


// }



// async function getData() {
//   let result;

//   try {
//     result = await fetch('https://tntwvm68lfc.SANDBOX.verygoodproxy.com/post', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({
//         account_number: 'ACC00000000000000000',
//       }),
//     });
//   } catch (e) {
//     console.error(e);
//   }

//   return await result.text();
// }

// getData().then(response => console.log(response));