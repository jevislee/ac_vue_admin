import ajax from "@/utils/request";

export function login(username, password) {
    return ajax(
        '/admin/login',
        {
         'name': username,
         'pswd': password
        },
        'POST')
}

export function logout() {
    return ajax('/logout',{},'POST')
}
