// 本地存储持久化数据

// 存储token
export const setToken = (token) => {
    localStorage.setItem('TOKEN', token);
}
// 获取oken
export const getToken = () => {
    return localStorage.getItem('TOKEN');
}
// 清除本地存储的token
export const removeToken = () => {
    localStorage.removeItem("TOKEN");
}