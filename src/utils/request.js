import axios from 'axios'
import router from '@/router/index.js'
import { getToken } from '@/utils/auth'
import { Message } from 'element-ui'
import qs from 'qs';

//contentType为1用于上传文件
export default function ajax(url, data = {}, method = 'GET', isQueryParams = 0, contentType = 0) {
    let instance = axios.create({
        baseURL: process.env.BASE_API,
        timeout: 20000,//timeout设置的时间短会导致请求耗时接口时被cancel
        headers: {
            'token': getToken(),
            'Content-Type': contentType == 0 ? 'application/json; charset=UTF-8' : 'application/x-www-form-urlencoded'
        }
    });

    return new Promise(((resolve, reject) => {
        let promise;
        if (method == 'GET') {
            promise = instance.get(url, {params: data}) //会将data内的属性以query参数的形式拼接
        } else if (method == 'POST') {
            if(isQueryParams == 0) {
                promise = instance.post(url, data)
            } else {
                promise = instance.post(url + '?' + qs.stringify(data), {})
            }
        } else if (method == 'PUT') {
            promise = instance.put(url, data)
        } else if (method == 'DELETE') {
            promise = instance.delete(url)
        }

        promise.then(response => {
            //console.log("response:" + JSON.stringify(response))

            //response.data是业务数据的开始节点
            let code = response.data.code;
            if(code == 1004) {
                router.push({path: '/'})
            } else if(code != 1000) {
                Message({
                    message: response.data.message,
                    type: 'error',
                    duration: 2000
                })
            } else {
                resolve(response.data)
            }
        }).catch(error => {
            reject('请求出错:' + error.message)
        })
    }))
}
