<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区 -->
    <el-card>
      <!-- 搜索与添加区域 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getOrderList">
            <el-button slot="append" icon="el-icon-search" @click="getOrderList"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <!-- 订单列表区域 -->
      <el-table :data="orderlist" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="订单编号" prop="order_number"></el-table-column>
        <el-table-column label="订单价格" prop="order_price"></el-table-column>
        <el-table-column label="是否付款" prop="pay_status">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.pay_status === '1'">已付款</el-tag>
            <el-tag type="danger" v-else>未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="是否发货" prop="is_send"></el-table-column>
        <el-table-column label="下单时间" prop="add_time">
          <template slot-scope="scope">
            {{scope.row.create_time | dateFormat}}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <!-- 修改按钮 -->
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="showBox">
            </el-button>
            <!-- 定位按钮 -->
            <el-button type="success" icon="el-icon-location" size="mini" @click="showProgressBox">
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum" :page-sizes="[5, 10, 15]" :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper" :total="total" background>
      </el-pagination>
    </el-card>

    <!-- 修改地址的对话框 -->
    <el-dialog title="修改地址" :visible.sync="addressVisible" width="50%" @close="editDialogClosed">
      <el-form :model="addressForm" :rules="addressFormRules" ref="addressFormRef" label-width="100px">
        <el-form-item label="省市区/县" prop="address1">
          <el-cascader :options="cityData" v-model="addressForm.address1"></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="address2">
          <el-input v-model="addressForm.address2"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addressVisible = false">取 消</el-button>
        <el-button type="primary" @click="editAddress">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 物流进度对话框 -->
    <el-dialog title="物流进度" :visible.sync="progressVisible" width="50%">
      <!-- 时间线 -->
      <el-timeline>
        <el-timeline-item v-for="(activity, index) in progressInfo" :key="index" :timestamp="activity.time">
          {{activity.context}}
        </el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>

<script>
  import cityData from './citydata.js'
  import kd from './kd.js'

  export default {
    data() {
      return {
        //获取订单的对象参数
        queryInfo: {
          query: '',
          //当前页数
          pagenum: 1,
          //当前每页显示多少条
          pagesize: 10
        },
        //订单列表
        orderlist: [],
        //总数据条数
        total: 0,
        addressVisible: false,
        progressVisible: false,
        addressForm: {
          address1: [],
          address2: ''
        },
        addressFormRules: {
          address1: [{
            required: true,
            message: '请选择省市区县',
            trigger: 'blur'
          }],
          address2: [{
            required: true,
            message: '请输入详细地址',
            trigger: 'blur'
          }],
        },
        cityData,
        progressInfo: [],
        kd,

      }
    },
    created() {
      this.getOrderList()
    },
    methods: {
      //根据分页获取对应订单列表
      async getOrderList() {
        const {
          data: res
        } = await this.$http.get('orders', {
          params: this.queryInfo
        })
        if (res.meta.status !== 200) {
          return this.$message.error('获取订单列表失败！')
        }
        this.orderlist = res.data.goods
        this.total = res.data.total
        console.log(res)
      },
      //监听pagesize改变的事件
      handleSizeChange(newSize) {
        //console.log(newSize)
        this.queryInfo.pagesize = newSize
        this.getOrderList()
      },
      //监听 页码值 改变的事件
      handleCurrentChange(newPage) {
        console.log(newPage)
        this.queryInfo.pagenum = newPage
        this.getOrderList()
      },
      //展示修改地址对话框
      showBox() {
        this.addressVisible = true
      },
      //监听对话框关闭事件
      editDialogClosed() {
        this.$refs.addressFormRef.resetFields()
      },
      //提交修改
      editAddress() {
        this.$refs.addressFormRef.validate(async valid => {
          if (!valid) {
            return this.$message.error('请完善表单！')
          }
          this.$message.success('地址修改成功！')
          this.addressVisible = false
        })
      },
      showProgressBox() {

        this.progressInfo = this.kd
        this.progressVisible = true
      }
    },
  }
</script>

<style lang="less" scoped>
  .el-cascader {
    width: 100%;
  }
</style>