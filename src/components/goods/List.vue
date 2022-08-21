<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区 -->
    <el-card>
      <!-- 搜索与添加区域 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getGoodsList">
            <el-button slot="append" icon="el-icon-search" @click="getGoodsList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="goAddPage">添加商品</el-button>
        </el-col>
      </el-row>
      <!-- 用户列表区域 -->
      <el-table :data="goodslist" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="商品名称" prop="goods_name"></el-table-column>
        <el-table-column label="商品价格(元)" prop="goods_price" width="95px"></el-table-column>
        <el-table-column label="商品重量" prop="goods_weight" width="70px"></el-table-column>
        <el-table-column label="创建时间" prop="add_time" width="140px">
          <template slot-scope="scope">
            {{scope.row.add_time | dateFormat}}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150px">
          <template slot-scope="scope">
            <!-- 修改按钮 -->
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.goods_id)">
            </el-button>
            <!-- 删除按钮 -->
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeById(scope.row.goods_id)">
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum" :page-sizes="[1, 2, 5, 10]" :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper" :total="total" background>
      </el-pagination>
    </el-card>

    <!-- 修改商品的对话框 -->
    <el-dialog title="修改商品" :visible.sync="editDialogVisible" width="50%" @close="editDialogClosed">
      <el-form :model="editListForm" :rules="editFormRules" ref="editListFormRef" label-width="100px">
        <el-form-item label="商品名称" prop="goods_name">
          <el-input v-model="editListForm.goods_name"></el-input>
        </el-form-item>
        <el-form-item label="商品价格" prop="goods_price">
          <el-input v-model="editListForm.goods_price"></el-input>
        </el-form-item>
        <el-form-item label="商品重量" prop="goods_weight">
          <el-input v-model="editListForm.goods_weight"></el-input>
        </el-form-item>
        <el-form-item label="商品数量" prop="goods_number">
          <el-input v-model="editListForm.goods_number" type="number"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editListInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        //获取商品列表的对象参数
        queryInfo: {
          query: '',
          //当前页数
          pagenum: 1,
          //当前每页显示多少条
          pagesize: 10
        },
        //商品列表
        goodslist: [],
        //总数据条数
        total: 0,
        editListForm: {},
        editDialogVisible: false,
        //修改表单的验证规则对象
        editFormRules: {
          goods_name: [{
            required: true,
            message: '请输入商品名称',
            trigger: 'blur'
          }],
          goods_price: [{
            required: true,
            message: '请输入商品价格',
            trigger: 'blur'
          }],
          goods_weight: [{
            required: true,
            message: '请输入商品重量',
            trigger: 'blur'
          }],
        }
      }
    },
    created() {
      this.getGoodsList()
    },
    methods: {
      //根据分页获取对应商品列表
      async getGoodsList() {
        const {
          data: res
        } = await this.$http.get('goods', {
          params: this.queryInfo
        })
        if (res.meta.status !== 200) {
          return this.$message.error('获取用户列表失败！')
        }
        this.goodslist = res.data.goods
        this.total = res.data.total
        console.log(res)
      },
      //监听pagesize改变的事件
      handleSizeChange(newSize) {
        //console.log(newSize)
        this.queryInfo.pagesize = newSize
        this.getGoodsList()
      },
      //监听 页码值 改变的事件
      handleCurrentChange(newPage) {
        console.log(newPage)
        this.queryInfo.pagenum = newPage
        this.getGoodsList()
      },
      //展示编辑角色的对话框
      async showEditDialog(goods_id) {
        const {
          data: res
        } = await this.$http.get('goods/' + goods_id)

        if (res.meta.status !== 200) {
          return this.$message.error('查询角色失败！')
        }
        this.editListForm = res.data
        this.editDialogVisible = true
      },
      //监听修改商品对话框的关闭事件
      editDialogClosed() {
        this.$refs.editListFormRef.resetFields()
      },
      //修改商品信息并提交
      editListInfo() {
        this.$refs.editListFormRef.validate(async valid => {
          if (!valid) {
            return this.$message.error('请完善表单！')
          }
          //可以发起网络请求
          const {
            data: res
          } = await this.$http.put(`goods/ ${this.editListForm.goods_id}`, {
            goods_name: this.editListForm.goods_name,
            goods_price: this.editListForm.goods_price,
            goods_number: this.editListForm.goods_number,
            goods_weight: this.editListForm.goods_weight,
            goods_cat: this.editListForm.goods_cat,
          })
          console.log(res);
          if (res.meta.status !== 201) {
            this.$message.error('修改商品失败！')
          }
          //隐藏添加新角色对话框
          this.editDialogVisible = false
          //重新获取列表数据
          this.getGoodsList()
          this.$message.success('修改商品成功！')

        })
      },
      //根据id删除对应商品
      async removeById(id) {
        //弹框提示是否删除数据
        const confirmResult = await this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)

        //如果用户确认删除，则返回值为字符串 confirm
        //如果用户取消了删除，则返回值为字符串 cancel
        if (confirmResult !== 'confirm') {
          return this.$message.info('已取消删除')
        }
        const {
          data: res
        } = await this.$http.delete('goods/' + id)
        if (res.meta.status !== 200) {
          return this.$message.error('删除商品失败！')
        }
        this.$message.success('删除商品成功！')
        this.getGoodsList()
      },
      goAddPage() {
        this.$router.push('/goods/add')
      }
    },
  }
</script>

<style lang="less" scoped>

</style>