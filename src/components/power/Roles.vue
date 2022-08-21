<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <!-- 添加角色按钮区域 -->
      <el-row>
        <el-col>
          <el-button type="primary" @click="addDialogVisible = true">添加角色</el-button>
        </el-col>
      </el-row>
      <!-- 角色列表区域 -->
      <el-table :data="roleList" border stripe>
        <!-- 展开列 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row :class="['bdbottom', i1 === 0 ? 'bdtop' : '', 'vcenter']" v-for="(item1, i1) in scope.row.children"
              :key="item1.id">
              <!-- 渲染一级权限 -->
              <el-col :span="5">
                <el-tag closable @close="removeRightById(scope.row, item1.id)">{{item1.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 渲染二级权限和三级权限 -->
              <el-col :span="19">
                <!-- 通过for循环嵌套渲染二级权限 -->
                <el-row :class="[i2 === 0 ? '' : 'bdtop', 'vcenter']" v-for="(item2, i2) in item1.children"
                  :key="item2.id">
                  <el-col :span="6">
                    <el-tag type="success" closable @close="removeRightById(scope.row, item2.id)">{{item2.authName}}
                    </el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag type="warning" v-for="(item3, i3) in item2.children" :key="item3.id" closable
                      @close="removeRightById(scope.row, item3.id)">
                      {{item3.authName}}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
            <!-- <pre>
              {{scope.row}}
            </pre> -->
          </template>
        </el-table-column>
        <!-- 索引列 -->
        <el-table-column type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" width="300px">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" icon="el-icon-edit" @click="showEditDialog(scope.row.id)">编辑
            </el-button>
            <el-button size="mini" type="danger" icon="el-icon-delete" @click="removeRoleById(scope.row.id)">删除
            </el-button>
            <el-button size="mini" type="warning" icon="el-icon-setting" @click="showSetRightDialog(scope.row)">分配权限
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 添加角色的对话框 -->
    <el-dialog title="添加角色" :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed">
      <!-- 内容主体区域 -->
      <el-form :model="addRoleForm" :rules="addFormRules" ref="addRoleFormRef" label-width="100px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addRoleForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addRoleForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRole">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改角色的对话框 -->
    <el-dialog title="修改角色" :visible.sync="editDialogVisible" width="50%" @close="editDialogClosed">
      <el-form :model="editRoleForm" :rules="editFormRules" ref="editRoleFormRef" label-width="100px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editRoleForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editRoleForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRoleInfo">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 分配权限的对话框 -->
    <el-dialog title="分配权限" :visible.sync="setRightDialogVisible" width="50%" @close="setRightDialogClosed">
      <!-- 树形控件 -->
      <el-tree :data="rightList" :props="treeProps" show-checkbox node-key="id" default-expand-all
        :default-checked-keys="defKeys" ref="treeRef"></el-tree>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    data() {
      return {

        //所有角色列表数据
        roleList: [],
        //所有权限的数据
        rightList: [],
        //树形控件的属性绑定对象
        treeProps: {
          children: 'children',
          label: 'authName'
        },
        //默认选中的节点id值数组
        defKeys: [],
        //当前即将分配权限的id
        roleId: '',
        //控制添加角色对话框的显示与隐藏
        addDialogVisible: false,
        //控制修改角色对话框的显示与隐藏
        editDialogVisible: false,
        //控制分配权限对话框的显示与隐藏
        setRightDialogVisible: false,
        //添加角色表单数据
        addRoleForm: {
          roleName: '',
          roleDesc: ''
        },
        //查询到的角色信息对象
        editRoleForm: {},
        //添加表单的验证规则对象
        addFormRules: {
          roleName: [{
            required: true,
            message: '请输入角色名',
            trigger: 'blur'
          }],
          roleDesc: [{
            required: true,
            message: '请输入角色描述',
            trigger: 'blur'
          }]
        },

        //修改表单的验证规则对象
        editFormRules: {
          roleName: [{
            required: true,
            message: '请输入角色名',
            trigger: 'blur'
          }],
          roleDesc: [{
            required: true,
            message: '请输入角色描述',
            trigger: 'blur'
          }]
        }
      }
    },
    created() {
      this.getRoleList()
    },
    methods: {
      async getRoleList() {
        //获取所有角色的列表
        const {
          data: res
        } = await this.$http.get('roles')
        if (res.meta.status !== 200) {
          return this.$message.error('获取角色列表失败！')
        }
        this.roleList = res.data

      },
      //点击按钮确定添加新用户
      addRole() {
        this.$refs.addRoleFormRef.validate(async valid => {
          if (!valid) return
          //可以发起添加用户的网络请求
          const {
            data: res
          } = await this.$http.post('roles', this.addRoleForm)
          if (res.meta.status !== 201) {
            this.$message.error('添加角色失败！')
          }
          this.$message.success('添加角色成功！')
          //隐藏添加新用户对话框
          this.addDialogVisible = false
          //重新获取列表数据
          this.getRoleList()
        })
      },
      //监听添加用户对话框的关闭事件
      addDialogClosed() {
        this.$refs.addRoleFormRef.resetFields()
      },

      //展示编辑角色的对话框
      async showEditDialog(id) {
        const {
          data: res
        } = await this.$http.get('roles/' + id)

        if (res.meta.status !== 200) {
          return this.$message.error('查询角色失败！')
        }
        this.editRoleForm = res.data
        this.editDialogVisible = true
      },
      //监听修改角色对话框的关闭事件
      editDialogClosed() {
        this.$refs.editRoleFormRef.resetFields()
      },
      //修改角色信息并提交
      editRoleInfo() {
        this.$refs.editRoleFormRef.validate(async valid => {
          if (!valid) return
          //可以发起添加用户的网络请求
          const {
            data: res
          } = await this.$http.put('roles/' + this.editRoleForm.roleId, {
            roleName: this.editRoleForm.roleName,
            roleDesc: this.editRoleForm.roleDesc
          })
          console.log(res);
          if (res.meta.status !== 200) {
            this.$message.error('修改角色信息失败！')
          }
          //隐藏添加新角色对话框
          this.editDialogVisible = false
          //重新获取列表数据
          this.getRoleList()
          this.$message.success('修改角色信息成功！')
        })
      },
      //根据id删除对应的用户信息
      async removeRoleById(id) {
        //弹框提示是否删除数据
        const confirmResult = await this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
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
        } = await this.$http.delete('roles/' + id)
        if (res.meta.status !== 200) {
          return this.$message.error('删除角色失败！')
        }
        this.$message.success('删除角色成功！')
        this.getRoleList()
      },
      //根据id删除对应权限
      async removeRightById(role, rightId) {
        //弹框提示用户是否删除
        const confirmResult = await this.$confirm('此操作将永久删除该权限, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)
        if (confirmResult !== 'confirm') {
          return this.$message.info('已取消删除')
        }
        const {
          data: res
        } = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
        if (res.meta.status !== 200) {
          return this.$message.error('删除权限失败！')
        }
        this.$message.success('删除权限成功！')
        role.children = res.data
      },
      //展示分配权限对话框
      async showSetRightDialog(role) {
        this.roleId = role.id
        //获取所有权限数据
        const {
          data: res
        } = await this.$http.get('rights/tree')
        if (res.meta.status !== 200) {
          return this.$message.error('获取权限数据失败！')
        }
        //获取到的权限数据保存在data中
        this.rightList = res.data
        //递归获取三级节点的id
        this.getLeafKeys(role, this.defKeys)

        this.setRightDialogVisible = true
      },
      //通过递归的形式，获取角色下所有三级权限id，并保存到defKeys数组中
      getLeafKeys(node, arr) {
        //如果当前node节点不包含children属性，则是三级节点
        if (!node.children) {
          return arr.push(node.id)
        }
        node.children.forEach(item => this.getLeafKeys(item, arr));
      },
      //监听分配权限对话框的关闭事件
      setRightDialogClosed() {
        this.defKeys = []
      },
      //点击为角色分配权限
      async allotRights() {
        const keys = [...this.$refs.treeRef.getCheckedKeys(),
          ...this.$refs.treeRef.getHalfCheckedKeys()
        ]
        const idStr = keys.join(',')

        const {
          data: res
        } = await this.$http.post(`roles/${this.roleId}/rights`, {
          rids: idStr
        })
        if (res.meta.status !== 200) {
          return this.$message.error('分配权限失败！')
        }
        this.$message.success('分配权限成功！')

        this.getRoleList()
        this.setRightDialogVisible = false
      }
    },
  }
</script>

<style lang="less" scoped>
  .el-tag {
    margin: 7px;
  }

  .bdtop {
    border-top: 1px solid #eee;
  }

  .bdbottom {
    border-bottom: 1px solid #eee;
  }

  .vcenter {
    display: flex;
    align-items: center;
  }
</style>