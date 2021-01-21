<template>
    <div class="app-container">

        <search :search-json="searchJson"></search>

        <el-table border :data="tableData" class="table">
            <el-table-column align="center" type="index" :index="indexMethod" label="序号" width="50"></el-table-column>
            <el-table-column align="center" prop="name" label="角色"></el-table-column>
            <el-table-column align="center" label="操作" width="160">
                <template slot-scope="scope">
                    <el-button v-if="scope.row.adminRoleId == null && apiPermNames.indexOf('/api/ac/addAdminRole') > -1" size="mini" type="success" @click="addThisRoleToAdmin(scope.row)">增加角色</el-button>
                    <el-button v-if="scope.row.adminRoleId != null && apiPermNames.indexOf('/api/ac/deleteAdminRole') > -1" size="mini" type="danger" @click="delThisRoleFromAdmin(scope.row)">移除角色</el-button>
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
    import {queryRoleForAdmin, addAdminRole, deleteAdminRole} from '@/api/privilege'
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
                        adminName: {
                            type: 'view',
                            label: '当前管理员',
                            value: this.$route.query.adminName,
                        },
                        type: {
                            type: 'select',
                            label: '筛选',
                            value: 0,
                            options: [
                                {label: '全部', value: 0},
                                {label: '已拥有的角色', value: 1},
                                {label: '未拥有的角色', value: 2}
                            ]
                        }
                    },
                    onSearch: this.onSearch
                },
                searchParams: '',
                adminId: '',
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
                let query = {adminId: this.adminId, ...this.searchParams, ...this.pageParams}
                queryRoleForAdmin(query).then(res => {
                    this.tableData = [...res.data.list] || []
                    this.total = res.data.total
                })
            },
            addThisRoleToAdmin (row) {
                addAdminRole({
                    adminId: this.adminId,
                    roleId: row.id
                }).then(res => {
                    this.refreshPage()
                })
            },
            delThisRoleFromAdmin (row) {
                deleteAdminRole({
                    adminId: this.adminId,
                    roleId: row.id
                }).then(res => {
                    this.refreshPage()
                })
            }
        },
        mounted () {
            if (this.$route.query.adminId != undefined) { //判断url参数是否存在
                this.adminId = this.$route.query.adminId
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
