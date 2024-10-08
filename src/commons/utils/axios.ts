import axios from 'axios'

export const axiosRequest = (url: string, options: any = {}, remarks = '') => {
    axios.get("http://localhost:8080/user/login?username=cyk&password=1111")
        .then(function (success:any) { //success 是自定义响应的参数名
            //返回成功的响应
            console.log(success); //响应是一个 JSON 格式(axios 自动封装的)
            console.log(success.data);
        }).catch(function (error:any) { //error 是自定义的响应参数名
            //返回失败的响应(例如，状态码为 403、500......)
            console.log(error);
        })
}