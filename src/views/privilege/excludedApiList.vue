<template>
    <div class="app-container">
        <el-table border :data="tableData" class="table">
            <el-table-column align="center" type="index" :index="indexMethod" label="序号" width="50"></el-table-column>
            <el-table-column align="center" prop="uri" label="路径"></el-table-column>
            <el-table-column align="center" label="操作" width="160">
                <template slot-scope="scope">
                    <el-button v-if="apiPermNames.indexOf('/deleteExcludedApi') > -1" size="mini" type="primary" @click="openDeleteDialog(scope.row.id)" style="margin-left:10px">删除</el-button>
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
    import {queryAllExcludedApi, deleteExcludedApi} from '@/api/privilege'
    export default {
        data () {
            return {
                tableData: [],
                total: 0,
                pageParams: {
                    currentPage: 1,
                    pageSize: 10
                },
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
            changePage (val) {
                this.pageParams.currentPage = val
                this.refreshPage()
            },
            refreshPage () {
                let query = {...this.pageParams}
                queryAllExcludedApi(query).then(res => {
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
                    deleteExcludedApi({id: this.currentDel}).then(res => {
                        this.refreshPage()
                    })
                }
            },
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
