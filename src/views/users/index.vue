<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getUsers, addUser, updateUser, deleteUser, toggleUserStatus } from '@/api/users'

interface User {
  id: number
  username: string
  password: string
  type: string
  status: number
}

const userList = ref<User[]>([])
const searchText = ref('')
const showDialog = ref(false)
const isEdit = ref(false)

const emptyForm = (): User => ({
  id: 0,
  username: '',
  password: '',
  type: 'normal',
  status: 1,
})

const form = ref<User>(emptyForm())

onMounted(() => {
  loadList()
})

async function loadList() {
  const res = await getUsers()
  userList.value = res.data
}

const filteredList = computed(() => {
  const keyword = searchText.value.trim().toLowerCase()
  if (!keyword) return userList.value

  return userList.value.filter(
    (u) =>
      u.username.toLowerCase().includes(keyword) ||
      u.type.toLowerCase().includes(keyword),
  )
})

function openAdd() {
  isEdit.value = false
  form.value = emptyForm()
  showDialog.value = true
}

function openEdit(row: User) {
  isEdit.value = true
  form.value = { ...row, password: '' }
  showDialog.value = true
}

async function submitForm() {
  if (!form.value.username || (!isEdit.value && !form.value.password)) {
    ElMessage.warning('请填写必填项：用户名、密码')
    return
  }

  const res = isEdit.value ? await updateUser(form.value) : await addUser(form.value)

  if (res.data.code === 0) {
    ElMessage.success(isEdit.value ? '修改成功' : '新增成功')
    showDialog.value = false
    await loadList()
  }
}

async function handleDelete(id: number) {
  try {
    await ElMessageBox.confirm('确定要删除这名用户吗？此操作不可恢复。', '确认删除', {
      confirmButtonText: '确认删除',
      cancelButtonText: '取消',
      type: 'warning',
    })

    const res = await deleteUser(id)

    if (res.data.code === 0) {
      ElMessage.success('删除成功')
      await loadList()
    }
  } catch {
    // 取消删除
  }
}

async function toggleStatus(row: User) {
  const text = row.status === 1 ? '禁用' : '启用'

  try {
    await ElMessageBox.confirm(`确定要${text}该用户吗？`, `${text}用户`, {
      confirmButtonText: text,
      cancelButtonText: '取消',
      type: 'warning',
    })

    const res = await toggleUserStatus(row.id)

    if (res.data.code === 0) {
      ElMessage.success(`${text}成功`)
      await loadList()
    }
  } catch {
    // 取消操作
  }
}
</script>

<template>
  <div class="users-page">
    <div class="page-header">
      <h2>用户管理</h2>
    </div>

    <el-card>
      <div class="toolbar">
        <el-input
          v-model="searchText"
          placeholder="请输入用户名或组别"
          clearable
          style="width: 280px"
        />

        <el-button type="primary" @click="openAdd">新增用户</el-button>
      </div>

      <el-table :data="filteredList" border stripe style="width: 100%">
        <el-table-column prop="id" label="ID" width="80" sortable />
        <el-table-column prop="username" label="用户名" sortable />
        <el-table-column prop="type" label="组别" width="140">
          <template #default="{ row }">
            <el-tag :type="row.type === 'admin' ? 'danger' : 'info'">
              {{ row.type }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column prop="status" label="状态" width="120">
          <template #default="{ row }">
            <el-tag :type="row.status === 1 ? 'success' : 'info'">
              {{ row.status === 1 ? '启用' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column label="操作" width="220">
          <template #default="{ row }">
            <el-button type="primary" link @click="openEdit(row)">编辑</el-button>

            <el-button
              :type="row.status === 1 ? 'warning' : 'success'"
              link
              @click="toggleStatus(row)"
            >
              {{ row.status === 1 ? '禁用' : '启用' }}
            </el-button>

            <el-button type="danger" link @click="handleDelete(row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog
      v-model="showDialog"
      :title="isEdit ? '编辑用户' : '新增用户'"
      width="480px"
    >
      <el-form :model="form" label-width="80px">
        <el-form-item label="用户名" required>
          <el-input v-model="form.username" placeholder="请输入用户名" />
        </el-form-item>

        <el-form-item :label="isEdit ? '新密码' : '密码'" :required="!isEdit">
          <el-input
            v-model="form.password"
            type="password"
            show-password
            :placeholder="isEdit ? '若为空，则不修改密码' : '请输入密码'"
          />
        </el-form-item>

        <el-form-item label="组别">
          <el-select v-model="form.type" style="width: 100%">
            <el-option label="管理员" value="admin" />
            <el-option label="普通用户" value="normal" />
          </el-select>
        </el-form-item>

        <el-form-item label="状态">
          <el-radio-group v-model="form.status">
            <el-radio :label="1">启用</el-radio>
            <el-radio :label="0">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="showDialog = false">取消</el-button>
        <el-button type="primary" @click="submitForm">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.users-page {
  padding: 20px;
}

.page-header {
  margin-bottom: 20px;
}

.page-header h2 {
  font-size: 20px;
  font-weight: 600;
  color: #333;
}

.toolbar {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}
</style>