function axios(obj) {
    const xhr = new XMLHttpRequest();
    xhr.open(obj.method, obj.url);
    obj.send ? xhr.send(obj.send) : xhr.send();
    if (obj.timeout) {
        xhr.timeout = obj.timeout;
        console.log('请求超时');
    }
    if (obj.type) {
        xhr.responseType = obj.type;
    }
    if (obj.header) {
        xhr.setRequestHeader('content-Type', 'application/x-www-form-urlencoded');
    }
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if (xhr.status >= 200 && xhr.status < 300) {
                obj.success(xhr);
            }
        }
    }
}