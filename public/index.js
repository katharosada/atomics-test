
console.log("Starting")
const app = document.getElementById('app-root')

async function runCheck(label, checkFunc) {
    const el = document.createElement('div')
    el.classList.add('check')
    el.textContent = 'Running check: ' + label
    app.appendChild(el)
    try {
        const result = await checkFunc()
        if (result) {
            el.textContent = 'SUCCESS: ' + label
            el.classList.add('success')
        } else {
            el.textContent = 'FAILED CHECK: ' + label
            el.classList.add('fail')
        }
        
    } catch(e) {
        console.warn(e)
        el.textContent = `ERROR checking ${label}: ` + e
        el.classList.add('fail')
    }

}

const runChecks = () => {
    const userAgent = document.createElement('p')
    userAgent.textContent = navigator.userAgent
    app.appendChild(userAgent)

    runCheck('This page is Cross-origin isolated', async () => {
        return self.crossOriginIsolated
    })
    runCheck('SharedArrayBuffer is defined', async () => {
        return (typeof SharedArrayBuffer !== 'undefined')
    })
    runCheck('Atomics is defined', async () => {
        return (typeof Atomics !== 'undefined')
    })
    runCheck('Atomics.load retrieves a value', async () => {
        if (typeof Atomics.add !== 'function') {
            return false
        }
        const buffer = new SharedArrayBuffer(16);
        const uint8 = new Uint8Array(buffer);
        uint8[0] = 5;
        return 5 && Atomics.load(uint8, 0)
    })
    runCheck('Atomics.add adds numbers', async () => {
        if (typeof Atomics.add !== 'function') {
            return false
        }
        const buffer = new SharedArrayBuffer(16);
        const uint8 = new Uint8Array(buffer);
        uint8[0] = 7;

        // 7 + 2 = 9
        const previous = Atomics.add(uint8, 0, 2);
        return previous === 7 && Atomics.load(uint8, 0)
    })
    runCheck('Atomics.and does a bitwise AND', async () => {
        const buffer = new SharedArrayBuffer(16);
        const uint8 = new Uint8Array(buffer);
        uint8[0] = 7;

        // 7 (0111) AND 2 (0010) = 2 (0010)
        Atomics.and(uint8, 0, 2);
        return 2 === Atomics.load(uint8, 0);
    })
    runCheck('Atomics.compareExchange swaps numbers', async () => {
        const buffer = new SharedArrayBuffer(16);
        const uint8 = new Uint8Array(buffer);
        uint8[0] = 5;

        return 5 === Atomics.compareExchange(uint8, 0, 5, 2) && Atomics.load(uint8, 0) === 2;
    })
    runCheck('Atomics.exchange is a function', async () => {
        return typeof Atomics.exchange === 'function'
    })
    runCheck('Atomics.isLockFree is a function', async () => {
        return typeof Atomics.isLockFree === 'function'
    })
    runCheck('Atomics.or is a function', async () => {
        return typeof Atomics.or === 'function'
    })
    runCheck('Atomics.store is a function', async () => {
        return typeof Atomics.store === 'function'
    })
    runCheck('Atomics.sub is a function', async () => {
        return typeof Atomics.sub === 'function'
    })
    runCheck('Atomics.xor is a function', async () => {
        return typeof Atomics.xor === 'function'
    })
    runCheck('Atomics.wake does not exist (it should not)', async () => {
        return typeof Atomics.wake === 'undefined'
    })
    runCheck('Worker will wait using Atomics.wait and Atomics.notify', async () => {
        let started = false
        const promise = new Promise((resolve, reject) => {
            const worker = new Worker('worker.js')
            worker.onmessage = (event) => {
                console.log(event)
                if (event.data === 'start') {
                    started = true
                } else {
                    if (started && event.data === 'success') {
                        resolve(true)
                    } else {
                        resolve(false)
                    }
                }
            }
            const sab = new SharedArrayBuffer(4);
            const int32 = new Int32Array(sab);
            worker.postMessage({
                buffer: sab
            })
            setTimeout( () => {
                Atomics.store(int32, 0, 123)
                Atomics.notify(int32, 0, 1)
            }, 2000)
        })
        
        return await promise
    })
}

runChecks()