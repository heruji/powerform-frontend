// fetch的参数: post方式提交, 类型为JSON
const init = {
    method: 'post',
    headers: {
        'Content-Type': 'application/json; charset=UTF-8'
    },
    mode: 'cors', // cors|no-cors|same-orgin
    credentials: 'same-origin', // same-orgin|omit|include
    cache: 'no-cache'
};

// 处理feich返回结果, 若成功则获得JSON对象, 否则抛出错误
function processResponse(response) {
    if (response.ok) {
        return response.json();
    }
    throw new Error('failed to submit data');
}

// 向url地址发送data数据
function postFormData(url, data, doSuccess, doError) {
    const initObj = Object.assign({}, init, {body: JSON.stringify(data)});
    return fetch(url, initObj).then(processResponse).then(doSuccess).catch(doError);
}

export default postFormData;