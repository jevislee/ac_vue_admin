<template>
    <div class="app-container">
        <div class="menu-btns">
            <el-button @click="openEditDialog(null)">新增</el-button>
        </div>

        <el-table border :data="tableData" class="table">
            <el-table-column align="center" type="index" :index="indexMethod" label="序号" width="50"></el-table-column>
            <el-table-column align="center" prop="name" label="名称"></el-table-column>
            <el-table-column align="center" prop="createTime" label="创建时间"></el-table-column>
            <el-table-column align="center" prop="lastLoginTime" label="最后登录时间"></el-table-column>
            <el-table-column align="center" prop="status" label="状态">
                <template slot-scope="scope">
                    <span v-if="scope.row.status===1">有效</span>
                    <span v-if="scope.row.status===2">冻结</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="操作" width="240">
                <template v-if="scope.row.name == 'admin'" slot-scope="scope">
                    <el-button size="mini" type="primary" @click="openEditDialog(scope.row)" style="margin-left:10px">编辑</el-button>
                    <el-button size="mini" type="primary" @click="openDeleteDialog(scope.row.id)" style="margin-left:10px">删除</el-button>
                    <el-button size="mini" type="success" @click="toAdminRoleList(scope.row)" style="margin-left:10px">角色配置</el-button>
                </template>
                <template v-if="scope.row.name != 'admin'" slot-scope="scope">
                    <el-button v-if="apiPermNames.indexOf('/modifyAdmin') > -1" size="mini" type="primary" @click="openEditDialog(scope.row)" style="margin-left:10px">编辑</el-button>
                    <el-button v-if="apiPermNames.indexOf('/deleteAdmin') > -1" size="mini" type="primary" @click="openDeleteDialog(scope.row.id)" style="margin-left:10px">删除</el-button>
                    <el-button v-if="apiPermNames.indexOf('/queryRoleForAdmin') > -1" size="mini" type="success" @click="toAdminRoleList(scope.row)" style="margin-left:10px">角色配置</el-button>
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

        <el-dialog title="管理员信息" :visible.sync="showEditDialog" width="440px">
            <el-form label-position="right" label-width="150px" size="mini">
                <el-form-item label="名称:">
                    <el-input  size="mini" v-model="editInfo.name"></el-input>
                </el-form-item>
                <el-form-item label="密码:">
                    <el-input  size="mini" v-model="editInfo.pswd"></el-input>
                </el-form-item>
                <el-form-item label="状态:">
                    <el-select v-model="editInfo.status" placeholder="请选择" style="width:100%">
                        <el-option
                                v-for="item in statusOptions"
                                :label="item.label"
                                :value="item.value"
                                :key="item.value">
                        </el-option>
                    </el-select>
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
    import {queryAllAdmins, addAdmin, modifyAdmin, deleteAdmin} from '@/api/privilege'
    export default {
        data () {
            return {
                tableData: [],
                total: 0,
                pageParams: {
                    currentPage: 1,
                    pageSize: 10
                },
                statusOptions: [
                    {label: '有效', value: 1},
                    {label: '冻结', value: 2}
                ],
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
                        name: "",
                        pswd: "",
                        status: ""
                    }
                }
            },
            handleEdit () {
                if(this.editInfo.id == -1) {
                   addAdmin({
                        name: this.editInfo.name,
                        pswd: this.editInfo.pswd,
                        status: this.editInfo.status
                    }).then(res => {
                        this.showEditDialog = false
                        this.refreshPage()
                    })
                } else {
                    modifyAdmin({
                        id: this.editInfo.id,
                        name: this.editInfo.name,
                        pswd: this.editInfo.pswd,
                        status: this.editInfo.status
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
                queryAllAdmins(query).then(res => {
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
                    deleteAdmin({id: this.currentDel}).then(res => {
                        this.refreshPage()
                    })
                }
            },
            toAdminRoleList(data) {
                this.$router.push({
                    path: '/privilege/adminRoleList',
                    query: {
                        adminId: data.id,
                        adminName: data.name
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
