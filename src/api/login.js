import ajax from "@/utils/request";

export function login(username, password) {
    return ajax(
        '/api/ac/admin/login',
        {
         'name': username,
         'pswd': password
        },
        'POST')
}

export function logout() {
    return ajax('/api/ac/logout',{},'POST')
}
