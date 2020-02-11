<template>
    <div class="app-container">

        <search :search-json="searchJson"></search>

        <div class="menu-btns">
            <el-button @click="discovery()">发现接口</el-button>
        </div>

        <el-table border :data="tableData" class="table">
            <el-table-column align="center" type="index" :index="indexMethod" label="序号" width="50"></el-table-column>
            <el-table-column align="center" prop="uri" label="路径"></el-table-column>
            <el-table-column align="center" prop="title" label="标题"></el-table-column>
            <el-table-column align="center" label="操作" width="160">
                <template slot-scope="scope">
                    <el-button v-if="apiPermNames.indexOf('/modifyApi') > -1" size="mini" type="primary" @click="openEditDialog(scope.row)" style="margin-left:10px">编辑</el-button>
                    <el-button v-if="apiPermNames.indexOf('/moveApiToExcluded') > -1" size="mini" type="primary" @click="openDeleteDialog(scope.row.id)" style="margin-left:10px">排除</el-button>
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

        <el-dialog title="编辑接口信息" :visible.sync="showEditDialog" width="440px">
            <el-form label-position="right" label-width="150px" size="mini">
                <el-form-item label="路径:">
                    <span>{{editInfo.uri}}</span>
                </el-form-item>
                <el-form-item label="标题:">
                    <el-input  size="mini" v-model="editInfo.title"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="showEditDialog = false">取 消</el-button>
                <el-button type="primary" @click="handleEdit">确 定</el-button>
             </span>
        </el-dialog>

        <el-dialog title="发现接口" :visible.sync="showDiscoveryDialog" width="440px">
            <el-table border :data="discoveryList" max-height="250">
                <el-table-column align="center" type="index" :index="indexMethod" label="序号" width="50"></el-table-column>
                <el-table-column align="center" prop="uri" label="路径"></el-table-column>
            </el-table>
            <span slot="footer" class="dialog-footer">
                <el-button @click="closeDiscoveryDialog">确 定</el-button>
             </span>
        </el-dialog>

        <el-dialog
                title="提示"
                :visible.sync="delDialogVisible"
                width="400px"
                center>
            <span>确定排除该API吗?</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="doDelete">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import { mapGetters } from 'vuex'
    import Search from '@/components/search'
    import {queryAllApi, modifyApi, autoRegisterApi, moveApiToExcluded} from '@/api/privilege'
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
                        uri: {
                            type: 'input',
                            label: '路径',
                            value: ''
                        },
                        title: {
                            type: 'input',
                            label: '标题',
                            value: ''
                        },
                    },
                    onSearch: this.onSearch,
                    onClear: this.onClear
                },
                searchParams: '',
                tableData: [],
                total: 0,
                pageParams: {
                    currentPage: 1,
                    pageSize: 10
                },
                showEditDialog: false,
                editInfo: '',
                showDiscoveryDialog: false,
                discoveryList: [],
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
            onSearch () {
                this.searchParams = getSearchParams(this.searchJson.searchItems)
                this.pageParams.currentPage = 1
                this.refreshPage()
            },
            onClear () {
                this.searchJson.searchItems.title.value = '';
                this.searchJson.searchItems.uri.value = '';
            },
            indexMethod (index) {
                return this.pageParams.pageSize * (this.pageParams.currentPage - 1) + index + 1
            },
            openEditDialog (data) {
                this.showEditDialog = true
                this.editInfo = {...data}
            },
            handleEdit () {
                modifyApi({
                    id: this.editInfo.id,
                    title: this.editInfo.title,
                    uri: this.editInfo.uri,
                }).then(res => {
                    this.showEditDialog = false
                    this.refreshPage()
                })
            },
            discovery () {
                autoRegisterApi().then(res => {
                    this.showDiscoveryDialog = true
                    this.discoveryList = res.data
                })
            },
            closeDiscoveryDialog () {
                this.showDiscoveryDialog = false
                this.refreshPage()
            },
            changePage (val) {
                this.pageParams.currentPage = val
                this.refreshPage()
            },
            refreshPage () {
                let query = {...this.searchParams, ...this.pageParams}
                queryAllApi(query).then(res => {
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
                    moveApiToExcluded({id: this.currentDel}).then(res => {
                        this.refreshPage()
                    })
                }
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
