const PENDING = 'pending';
const RESOLVED = 'resolved';
const REJECTED = 'rejected';

class Promise {
  constructor(executor) {
    this.status = PENDING;
    this.value = null;
    this.reason = null;
    this.resolveCallbacks = [];
    this.rejectCallbacks = [];
    try {
      executor(this.resolve.bind(this), this.reject.bind(this));
    } catch (error) {
      this.reject(error);
    }
  }

  resolve(value) {
    if (this.status === PENDING) {
      this.value = value;
      this.status = RESOLVED;
      this.resolveCallbacks.forEach(onFulfilled => {
        onFulfilled();
      })
    }
  }

  reject(reason) {
    if (this.status === PENDING) {
      this.reason = reason;
      this.status = REJECTED;
      this.rejectCallbacks.forEach(onRejected => {
        onRejected();
      })
    }
  }

  then(onFulfilled, onRejected) {
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : data => data;
    onRejected = typeof onRejected === 'function' ? onRejected : err => { throw err };
    let promise2 = new Promise((resolve, reject) => {
      if (this.status === PENDING) {
        this.resolveCallbacks.push(() => {
          setTimeout(() => {
            try {
              let x = onFulfilled(this.value);
              resolvePromise(x, promise2, resolve, reject);
            } catch (error) {
              reject(error);
            }
          });
        });
        this.rejectCallbacks.push(() => {
          setTimeout(() => {
            try {
              let x = onRejected(this.reason);
              resolvePromise(x, promise2, resolve, reject);
            } catch (error) {
              reject(error);
            }
          });
        });
      }
      if (this.status === RESOLVED) {
        setTimeout(() => {
          try {
            let x = onFulfilled(this.value);
            resolvePromise(x, promise2, resolve, reject);
          } catch (error) {
            reject(error);
          }
        });
      }
      if (this.status === REJECTED) {
        setTimeout(() => {
          try {
            let x = onRejected(this.reason);
            resolvePromise(x, promise2, resolve, reject);
          } catch (error) {
            reject(error);
          }
        });
      }
    })
    return promise2;
  }
}

function resolvePromise(x, promise2, resolve, reject) {
  if (x === promise2) {
    return reject(new TypeError('Chaining cycle detected for promise!'));
  }
  if (x && (typeof x === 'object' || typeof x === 'function')) {
    let called;
    try {
      let then = x.then;
      if (typeof then === 'function') {
        then.call(x, value => {
          if (called) return ;
          called = true;
          resolvePromise(value, promise2, resolve, reject);
        }, reason => {
          if (called) return ;
          called = true;
          reject(reason);
        })
      } else {
        resolve(x);
      }
    } catch (error) {
      if (called) return ;
      called = true;
      reject(error);
    }
  } else {
    resolve(x);
  }
}

Promise.deferred = function() {
  let deferred = {};
  deferred.promise = new Promise((resolve, reject) => {
    deferred.resolve = resolve;
    deferred.reject = reject;
  })
  return deferred;
}

var promisesAplusTests = require('promises-aplus-tests');

promisesAplusTests(Promise, function (err) {
    // All done; output is in the console. Or check `err` for number of failures.
    console.log('测试用例失败', err);
});

/*
  Promise.resolve()
  Promise.reject()
  Promise.all([])
  Promise.race()
  Promise.allSettled([])
  ...
*/

module.exports = Promise;