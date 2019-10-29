import axios from 'axios'

const _7mxBaseURL =  '//api.7mx.com'
const paixinBaseURL =  '//api.paixin.com'

axios.interceptors.request.use(
  config => {
    let isNoCookie = (config.baseURL == _7mxBaseURL)

    if (isNoCookie) {
      config.headers['no-cookie'] = '1'
      const xToken = localStorage.getItem('x-token')
      if (xToken) {
        config.headers['x-token'] = xToken
      }
    }

    return config
  },
  err => {
    return Promise.reject(err)
  }
)

// http response 拦截器
axios.interceptors.response.use(
  response => {
    const xToken = response.headers['x-token']
    if (xToken || xToken == '') {
      localStorage.setItem('x-token', xToken)
    }

    return response
  },
  error => {
    return Promise.reject(error)
  }
)

/**
 * 删除空的属性
 * @param {*} object 想要删除空属性的对象
 */
function deleteEmptyProperty(object) {
  let objCopy = JSON.parse(JSON.stringify(object))

  for (let i in objCopy) {
    let value = objCopy[i]
    if (value === '' || value === null || value === undefined) {
      delete objCopy[i]
    }
  }

  return objCopy
}

/**
 * api.7mx.com下请求接口的封装
 * @param {*} url 不带域名的url，域名将在baseURL中设置
 * @param {*} data 请求的参数，数据放在request rody
 * @param {*} params 请求的参数，将数据放在URL之后，以?连接，参数之间以&进行拼接
 */
export const axios7mx = (url, data = {}, params = {}) => {
  let config = {
    baseURL: _7mxBaseURL,
    method: 'POST',
    headers: {'Content-Type': 'application/json; charset=utf-8'},
    withCredentials: true,
    responseType: 'text'
  }

  config.url = url
  config.data = deleteEmptyProperty(data)
  config.params = deleteEmptyProperty(params)

  return axios(config)
};

/**
 * api.paixin.com下请求接口的封装
 * @param {*} url 不带域名的url，域名将在baseURL中设置
 * @param {*} data 请求的参数，数据放在request rody
 * @param {*} params 请求的参数，将数据放在URL之后，以?连接，参数之间以&进行拼接
 */
export const axiosPaixin = (url, data = {}, params = {}) => {
  let config = {
    baseURL: paixinBaseURL,
    method: 'POST',
    headers: {'Content-Type': 'application/json; charset=utf-8'},
    withCredentials: true,
    responseType: 'text'
  }

  config.url = url
  config.data = deleteEmptyProperty(data)
  config.params = deleteEmptyProperty(params)

  return axios(config)
}

/**
 * 非api.7mx.com下的自定义url的GET封装
 * @param {*} url 自定义的url（完整的url）
 * @param {*} params 请求的参数，将数据放在URL之后，以?连接，参数之间以&进行拼接
 */
export const axiosGet = (url, params = {}) => {
  let config = {
    method: 'GET',
    headers: {'Content-Type': 'application/json; charset=utf-8'},
    responseType: 'text'
  };
  config.url = url;
  config.params = deleteEmptyProperty(params);
  return axios(config);
}

/**
 * 非api.7mx.com下的自定义url的POST封装
 * @param {*} url 自定义的url（完整的url）
 * @param {*} data 请求的参数，数据放在request rody
 * @param {*} params 请求的参数，将数据放在URL之后，以?连接，参数之间以&进行拼接
 */
export const axiosPost = (url, data = {}, params = {}) => {
  let config = {
    method: 'POST',
    headers: {'Content-Type': 'application/json; charset=utf-8'},
    responseType: 'text'
  };
  config.url = url;
  config.data = deleteEmptyProperty(data);
  config.params = deleteEmptyProperty(params);
  return axios(config);
}

/**
 * @returns axios
 */
export const getAxios = () => {
  return axios
}
