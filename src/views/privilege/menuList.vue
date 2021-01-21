<template>
    <div class="app-container">
        <div class="menu-btns">
            <el-button @click="openEditDialog(null)">新增</el-button>
        </div>

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
            <el-table-column align="center" label="操作" width="240">
                <template slot-scope="scope">
                    <el-button v-if="apiPermNames.indexOf('/api/ac/modifyMenu') > -1" size="mini" type="primary" @click="openEditDialog(scope.row)" style="margin-left:10px">编辑</el-button>
                    <el-button v-if="apiPermNames.indexOf('/api/ac/deleteMenu') > -1" size="mini" type="primary" @click="openDeleteDialog(scope.row.id)" style="margin-left:10px">删除</el-button>
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

        <el-dialog title="菜单信息" :visible.sync="showEditDialog" width="440px">
            <el-form label-position="right" label-width="150px" size="mini">
                <el-form-item label="路径:">
                    <el-input  size="mini" v-model="editInfo.path"></el-input>
                </el-form-item>
                <el-form-item label="组件:">
                    <el-input  size="mini" v-model="editInfo.component"></el-input>
                </el-form-item>
                <el-form-item label="跳转:">
                    <el-input  size="mini" v-model="editInfo.redirect"></el-input>
                </el-form-item>
                <el-form-item label="名称:">
                    <el-input  size="mini" v-model="editInfo.name"></el-input>
                </el-form-item>
                <el-form-item label="标题:">
                    <el-input  size="mini" v-model="editInfo.title"></el-input>
                </el-form-item>
                <el-form-item label="图标:">
                    <el-input  size="mini" v-model="editInfo.icon"></el-input>
                </el-form-item>
                <el-form-item label="是否隐藏:">
                    <el-select v-model="editInfo.hidden" placeholder="请选择" style="width:100%">
                        <el-option
                                v-for="item in hiddenOptions"
                                :label="item.label"
                                :value="item.value"
                                :key="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="父菜单:">
                    <el-select v-model="editInfo.parentId" placeholder="请选择" style="width:100%">
                        <el-option
                                v-for="item in topLevelMenu"
                                :label="item.title"
                                :value="item.id"
                                :key="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="排序:">
                    <el-input  size="mini" v-model="editInfo.orderNo"></el-input>
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
    import {queryAllMenu, addMenu, modifyMenu, deleteMenu, queryTopLevelMenu} from '@/api/privilege'
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
                hiddenOptions: [
                    {label: '否', value: 0},
                    {label: '是', value: 1}
                ],
                topLevelMenu: []
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
                        path: "",
                        component:"",
                        redirect:"",
                        name:"",
                        title:"",
                        icon:"",
                        hidden:"",
                        parentId: "",
                        orderNo:"",
                    }
                }

                queryTopLevelMenu().then(res => {
                    let list = res.data;

                    this.topLevelMenu.splice(0, this.topLevelMenu.length)
                    list.forEach(m => {
                        if(this.editInfo.id != m.id) {
                            this.topLevelMenu.push(m);
                        }
                    })
                })
            },
            handleEdit () {
                if(this.editInfo.id == -1) {
                   addMenu({
                       path: this.editInfo.path,
                       component: this.editInfo.component,
                       redirect: this.editInfo.redirect,
                       name: this.editInfo.name,
                       title: this.editInfo.title,
                       icon: this.editInfo.icon,
                       hidden: this.editInfo.hidden,
                       parentId: this.editInfo.parentId,
                       orderNo: this.editInfo.orderNo,
                    }).then(res => {
                        this.showEditDialog = false
                        this.refreshPage()
                    })
                } else {
                    modifyMenu({
                        id: this.editInfo.id,
                        path: this.editInfo.path,
                        component: this.editInfo.component,
                        redirect: this.editInfo.redirect,
                        name: this.editInfo.name,
                        title: this.editInfo.title,
                        icon: this.editInfo.icon,
                        hidden: this.editInfo.hidden,
                        parentId:  this.editInfo.parentId,
                        orderNo: this.editInfo.orderNo,
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
                queryAllMenu(query).then(res => {
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
                    deleteMenu({id: this.currentDel}).then(res => {
                        this.refreshPage()
                    })
                }
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
