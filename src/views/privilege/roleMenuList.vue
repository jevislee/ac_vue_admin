<template>
    <div class="app-container">

        <search :search-json="searchJson"></search>

        <el-table border :data="tableData" class="table">
            <el-table-column align="center" type="index" :index="indexMethod" label="序号" width="50"></el-table-column>
            <el-table-column align="center" prop="path" label="路径"></el-table-column>
            <el-table-column align="center" prop="component" label="组件"></el-table-column>
            <el-table-column align="center" prop="redirect" label="跳转"></el-table-column>
            <el-table-column align="center" prop="name" label="名称"></el-table-column>
            <el-table-column align="center" prop="title" label="标题"></el-table-column>
            <el-table-column align="center" prop="icon" label="图标"></el-table-column>
            <el-table-column align="center" prop="hidden" label="是否隐藏">
                <template slot-scope="scope">
                    <span v-if="scope.row.hidden == 0">否</span>
                    <span v-if="scope.row.hidden != 0">是</span>
                </template>
            </el-table-column>
            <el-table-column align="center" prop="parentTitle" label="父菜单"></el-table-column>
            <el-table-column align="center" prop="orderNo" label="排序"></el-table-column>
            <el-table-column align="center" label="操作" width="160">
                <template slot-scope="scope">
                    <el-button v-if="scope.row.roleMenuId == null && apiPermNames.indexOf('/addRolePrivilege') > -1" size="mini" type="success" @click="addThisPrivilegeToRole(scope.row)">增加权限</el-button>
                    <el-button v-if="scope.row.roleMenuId != null && apiPermNames.indexOf('/deleteRolePrivilege') > -1" size="mini" type="danger" @click="delThisPrivilegeFromRole(scope.row)">移除权限</el-button>
                </template>
            </el-table-column>
        </el-table>

        <el-pagination
                layout="prev, pager, next, jumper"
                :total="total"
                :page-size="pageParams.pageSize"
                @current-change="changePage"
        >
        </el-pagination>

    </div>
</template>

<script>
    import { mapGetters } from 'vuex'
    import Search from '@/components/search'
    import {queryMenuForRole, addRolePrivilege, deleteRolePrivilege} from '@/api/privilege'
    import {getSearchParams, releaseFunc, withdrawFunc, deleteFunc} from '@/utils/utils'
    export default {
        components: {
            Search
        },
        data () {
            return {
                searchJson: {
                    id: 'search',
                    searchItems: {
                        roleName: {
                            type: 'view',
                            label: '当前角色',
                            value: this.$route.query.roleName,
                        },
                        path: {
                            type: 'input',
                            label: '路径',
                            value: ''
                        },
                        title: {
                            type: 'input',
                            label: '标题',
                            value: ''
                        },
                        type: {
                            type: 'select',
                            label: '筛选',
                            value: 0,
                            options: [
                                {label: '全部', value: 0},
                                {label: '已拥有的权限', value: 1},
                                {label: '未拥有的权限', value: 2}
                            ]
                        }
                    },
                    onSearch: this.onSearch
                },
                searchParams: '',
                roleId: '',
                tableData: [],
                total: 0,
                pageParams: {
                    currentPage: 1,
                    pageSize: 10
                },
            }
        },
        computed: {
            ...mapGetters([
                'apiPermNames'
            ])
        },
        methods: {
            onSearch () {
                this.searchParams = getSearchParams(this.searchJson.searchItems)
                this.pageParams.currentPage = 1
                this.refreshPage()
            },
            indexMethod (index) {
                return this.pageParams.pageSize * (this.pageParams.currentPage - 1) + index + 1
            },
            changePage (val) {
                this.pageParams.currentPage = val
                this.refreshPage()
            },
            refreshPage () {
                let query = {roleId: this.roleId, ...this.searchParams, ...this.pageParams}
                queryMenuForRole(query).then(res => {
                    this.tableData = [...res.data.list] || []
                    this.total = res.data.total
                })
            },
            addThisPrivilegeToRole (row) {
                addRolePrivilege({
                    roleId: this.roleId,
                    privilegeId: row.id,
                    type: 1
                }).then(res => {
                    this.refreshPage()
                })
            },
            delThisPrivilegeFromRole (row) {
                deleteRolePrivilege({
                    roleId: this.roleId,
                    privilegeId: row.id,
                    type: 1
                }).then(res => {
                    this.refreshPage()
                })
            }
        },
        mounted () {
            if (this.$route.query.roleId != undefined) { //判断url参数是否存在
                this.roleId = this.$route.query.roleId
            }
            this.searchParams = getSearchParams(this.searchJson.searchItems)
            this.refreshPage()
        }
    }
</script>

<style scoped>
    .edit-radios {
        display: block;
        margin-bottom: 22px;
        text-align: center;
    }
    .el-pagination {
        text-align: center;
    }
</style>
