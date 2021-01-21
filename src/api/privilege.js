import ajax from '@/utils/request'

export function queryAllApi(data) {
    return ajax('/api/ac/queryAllApi', data)
}

export function autoRegisterApi() {
    return ajax('/api/ac/autoRegisterApi')
}

export function modifyApi(data) {
    return ajax('/api/ac/modifyApi', data, 'POST')
}

export function moveApiToExcluded(data) {
    return ajax('/api/ac/moveApiToExcluded', data, 'POST', 1)
}


export function queryAllExcludedApi(data) {
    return ajax('/api/ac/queryExcludedApi', data)
}

export function deleteExcludedApi(data) {
    return ajax('/api/ac/deleteExcludedApi', data, 'POST', 1)
}


export function queryAllRoles(data) {
    return ajax('/api/ac/queryAllRoles', data)
}

export function addRole(data) {
    return ajax('/api/ac/addRole', data, 'POST')
}

export function modifyRole(data) {
    return ajax('/api/ac/modifyRole', data, 'POST')
}

export function deleteRole(data) {
    return ajax('/api/ac/deleteRole', data, 'POST', 1)
}


export function queryApiForRole(data) {
    return ajax('/api/ac/queryApiForRole', data)
}

export function addRolePrivilege(data) {
    return ajax('/api/ac/addRolePrivilege', data, 'POST', 1)
}

export function deleteRolePrivilege(data) {
    return ajax('/api/ac/deleteRolePrivilege', data, 'POST', 1)
}



export function queryAllAdmins(data) {
    return ajax('/api/ac/queryAllAdmins', data)
}

export function addAdmin(data) {
    return ajax('/api/ac/addAdmin', data, 'POST')
}

export function modifyAdmin(data) {
    return ajax('/api/ac/modifyAdmin', data, 'POST')
}

export function deleteAdmin(data) {
    return ajax('/api/ac/deleteAdmin', data, 'POST', 1)
}


export function queryRoleForAdmin(data) {
    return ajax('/api/ac/queryRoleForAdmin', data)
}

export function addAdminRole(data) {
    return ajax('/api/ac/addAdminRole', data, 'POST', 1)
}

export function deleteAdminRole(data) {
    return ajax('/api/ac/deleteAdminRole', data, 'POST', 1)
}


export function queryAllMenu(data) {
    return ajax('/api/ac/queryAllMenu', data)
}

export function addMenu(data) {
    return ajax('/api/ac/addMenu', data, 'POST')
}

export function modifyMenu(data) {
    return ajax('/api/ac/modifyMenu', data, 'POST')
}

export function deleteMenu(data) {
    return ajax('/api/ac/deleteMenu', data, 'POST', 1)
}

export function queryMenuForRole(data) {
    return ajax('/api/ac/queryMenuForRole', data)
}

export function queryApiPermNames() {
    return ajax('/api/ac/admin/queryApiPermNames')
}

export function queryRoleNames() {
    return ajax('/api/ac/admin/queryRoleNames')
}

export function queryMenuTree() {
    return ajax('/api/ac/queryMenuTree')
}

export function queryTopLevelMenu() {
    return ajax('/api/ac/queryTopLevelMenu')
}
