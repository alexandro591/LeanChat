module.exports = getKey = (request) => {
    const key_index = request.rawHeaders.indexOf('Sec-WebSocket-Key')+1
    const key = request.rawHeaders[key_index]
    return key
}