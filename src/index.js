const Promise = require('./promise');

let p = new Promise((resolve, reject) => {
  // throw '出现错误'
  // resolve(100);
  setTimeout(() => {
    // resolve(100);
    reject('失败0000001')
  }, 1000);
  // resolve(100);
  // reject('失败');
}).then(data => {
  console.log('第一个成功', data);
  // return p;
  return new OtherPromise((resolve) => {
    resolve('别人的promise')
  })
}, reason => {
  console.log('第一个失败', reason);
  throw '错误错误'
}).then(data => {
  console.log('第二个成功', data);
}, reason => {
  console.log('第二个失败', reason);
})