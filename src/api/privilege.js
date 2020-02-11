import ajax from '@/utils/request'

export function queryAllApi(data) {
    return ajax('/queryAllApi', data)
}

export function autoRegisterApi() {
    return ajax('/autoRegisterApi')
}

export function modifyApi(data) {
    return ajax('/modifyApi', data, 'POST')
}

export function moveApiToExcluded(data) {
    return ajax('/moveApiToExcluded', data, 'POST', 1)
}


export function queryAllExcludedApi(data) {
    return ajax('/queryExcludedApi', data)
}

export function deleteExcludedApi(data) {
    return ajax('/deleteExcludedApi', data, 'POST', 1)
}


export function queryAllRoles(data) {
    return ajax('/queryAllRoles', data)
}

export function addRole(data) {
    return ajax('/addRole', data, 'POST')
}

export function modifyRole(data) {
    return ajax('/modifyRole', data, 'POST')
}

export function deleteRole(data) {
    return ajax('/deleteRole', data, 'POST', 1)
}


export function queryApiForRole(data) {
    return ajax('/queryApiForRole', data)
}

export function addRolePrivilege(data) {
    return ajax('/addRolePrivilege', data, 'POST', 1)
}

export function deleteRolePrivilege(data) {
    return ajax('/deleteRolePrivilege', data, 'POST', 1)
}



export function queryAllAdmins(data) {
    return ajax('/queryAllAdmins', data)
}

export function addAdmin(data) {
    return ajax('/addAdmin', data, 'POST')
}

export function modifyAdmin(data) {
    return ajax('/modifyAdmin', data, 'POST')
}

export function deleteAdmin(data) {
    return ajax('/deleteAdmin', data, 'POST', 1)
}


export function queryRoleForAdmin(data) {
    return ajax('/queryRoleForAdmin', data)
}

export function addAdminRole(data) {
    return ajax('/addAdminRole', data, 'POST', 1)
}

export function deleteAdminRole(data) {
    return ajax('/deleteAdminRole', data, 'POST', 1)
}


export function queryAllMenu(data) {
    return ajax('/queryAllMenu', data)
}

export function addMenu(data) {
    return ajax('/addMenu', data, 'POST')
}

export function modifyMenu(data) {
    return ajax('/modifyMenu', data, 'POST')
}

export function deleteMenu(data) {
    return ajax('/deleteMenu', data, 'POST', 1)
}

export function queryMenuForRole(data) {
    return ajax('/queryMenuForRole', data)
}

export function queryApiPermNames() {
    return ajax('/admin/queryApiPermNames')
}

export function queryRoleNames() {
    return ajax('/admin/queryRoleNames')
}

export function queryMenuTree() {
    return ajax('/queryMenuTree')
}

export function queryTopLevelMenu() {
    return ajax('/queryTopLevelMenu')
}
