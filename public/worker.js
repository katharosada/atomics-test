
onmessage = (event) => {
    const data = event.data
    const buffer = new Int32Array(data.buffer)
    try {
        postMessage('start')
        Atomics.wait(buffer, 0, 0) // Wait until index 0 is not zero
        postMessage('success')
    } catch (e) {
        console.warn(e)
        postMessage('fail')
    }
}
