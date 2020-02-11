<template>
    <div class="app-container">
        <div class="menu-btns">
            <el-button @click="openEditDialog(null)">新增</el-button>
        </div>

        <el-table border :data="tableData" class="table">
            <el-table-column align="center" type="index" :index="indexMethod" label="序号" width="50"></el-table-column>
            <el-table-column align="center" prop="name" label="名称"></el-table-column>
            <el-table-column align="center" label="操作" width="300">
                <template slot-scope="scope">
                    <el-button v-if="apiPermNames.indexOf('/modifyRole') > -1" size="mini" type="primary" @click="openEditDialog(scope.row)" style="margin-left:10px">编辑</el-button>
                    <el-button v-if="apiPermNames.indexOf('/deleteRole') > -1" size="mini" type="primary" @click="openDeleteDialog(scope.row.id)" style="margin-left:10px">删除</el-button>
                    <el-button v-if="apiPermNames.indexOf('/queryApiForRole') > -1" size="mini" type="success" @click="toRoleApiList(scope.row)" style="margin-left:10px">API配置</el-button>
                    <el-button v-if="apiPermNames.indexOf('/queryMenuForRole') > -1" size="mini" type="success" @click="toRoleMenuList(scope.row)" style="margin-left:10px">菜单配置</el-button>
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

        <el-dialog title="角色信息" :visible.sync="showEditDialog" width="440px">
            <el-form label-position="right" label-width="150px" size="mini">
                <el-form-item label="名称:">
                    <el-input  size="mini" v-model="editInfo.name"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="showEditDialog = false">取 消</el-button>
                <el-button type="primary" @click="handleEdit">确 定</el-button>
             </span>
        </el-dialog>

        <el-dialog
                title="提示"
                :visible.sync="delDialogVisible"
                width="400px"
                center>
            <span>确定删除这条记录吗?</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="doDelete">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import { mapGetters } from 'vuex'
    import {queryAllRoles, addRole, modifyRole, deleteRole} from '@/api/privilege'
    export default {
        data () {
            return {
                tableData: [],
                total: 0,
                pageParams: {
                    currentPage: 1,
                    pageSize: 10
                },
                showEditDialog: false,
                editInfo: '',
                delDialogVisible: false,
                currentDel: -1,
            }
        },
        computed: {
            ...mapGetters([
                'apiPermNames'
            ])
        },
        methods: {
            indexMethod (index) {
                return this.pageParams.pageSize * (this.pageParams.currentPage - 1) + index + 1
            },
            openEditDialog (data) {
                this.showEditDialog = true

                if(data != null) {
                    this.editInfo = {...data}
                } else {
                    this.editInfo = {
                        id: -1,
                        name: ""
                    }
                }
            },
            handleEdit () {
                if(this.editInfo.id == -1) {
                   addRole({
                        name: this.editInfo.name
                    }).then(res => {
                        this.showEditDialog = false
                        this.refreshPage()
                    })
                } else {
                    modifyRole({
                        id: this.editInfo.id,
                        name: this.editInfo.name
                    }).then(res => {
                        this.showEditDialog = false
                        this.refreshPage()
                    })
                }
            },
            changePage (val) {
                this.pageParams.currentPage = val
                this.refreshPage()
            },
            refreshPage () {
                let query = {...this.pageParams}
                queryAllRoles(query).then(res => {
                    this.tableData = [...res.data.list] || []
                    this.total = res.data.total
                })
            },
            openDeleteDialog (val) {
                this.delDialogVisible = true;
                this.currentDel = val;
            },
            doDelete() {
                this.delDialogVisible = false;
                if(this.currentDel != -1) {
                    deleteRole({id: this.currentDel}).then(res => {
                        this.refreshPage()
                    })
                }
            },
            toRoleApiList(data) {
                this.$router.push({
                    path: '/privilege/roleApiList',
                    query: {
                        roleId: data.id,
                        roleName: data.name
                    }
                });
            },
            toRoleMenuList(data) {
                this.$router.push({
                    path: '/privilege/roleMenuList',
                    query: {
                        roleId: data.id,
                        roleName: data.name
                    }
                });
            }
        },
        mounted () {
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
