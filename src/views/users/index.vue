<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { getUsers,addUser,updateUser,deleteUser,toggleUserStatus } from '@/api/users'

interface User {
  id: number
  username: string
  password:string
  type: string
  status:number

}

// 模拟数据
const userList = ref<User[]>([])

// 搜索
const searchText = ref('')
const filteredList = computed(() => {
  const keyword = searchText.value.trim().toLowerCase()
  if (!keyword) return userList.value
  return userList.value.filter(
    (t) =>
      t.username.toLowerCase().includes(keyword) ||
      t.type.toLowerCase().includes(keyword) 
  )
})

// 弹窗
const showModal = ref(false)
const isEdit = ref(false)

const emptyForm = (): Omit<User, 'id'> => ({
  username: '',
  password:'',
  type: '',
  status: 1
})

const form = ref<User>({ id: 0, ...emptyForm() })

onMounted(async () => {
  const res = await getUsers()
  userList.value = res.data
})

function openAdd() {
  isEdit.value = false
  form.value = { id: 0, ...emptyForm() }
  showModal.value = true
}

function openEdit(team: User) {
  isEdit.value = true
  form.value = { ...team }
  showModal.value = true
}

function closeModal() {
  showModal.value = false
}

async function submitForm() {
  if (!form.value.username || (!isEdit.value && !form.value.password) ) {
    alert('请填写必填项：用户名、密码')
    return
  }
  if (isEdit.value) {
    const res = await updateUser(form.value)
    if (res.data.code === 0) {
      const resTeam = await getUsers()
      userList.value = resTeam.data
    }
  } else {
    const res = await addUser(form.value)
    if (res.data.code === 0) {
      const resTeam = await getUsers()
      userList.value = resTeam.data
    }
  }
  closeModal()
}

// 删除
const deleteTargetId = ref<number | null>(null)
const showDeleteConfirm = ref(false)

function openDelete(id: number) {
  deleteTargetId.value = id
  showDeleteConfirm.value = true
}

async function confirmDelete() {
  if (deleteTargetId.value !== null) {
    const res = await deleteUser(deleteTargetId.value)
    if (res.data.code === 0) {
      const resTeam = await getUsers()
      userList.value = resTeam.data
    }
  }
  showDeleteConfirm.value = false
  deleteTargetId.value = null
}

function cancelDelete() {
  showDeleteConfirm.value = false
  deleteTargetId.value = null
}

async function toggleStatus(id: number){
    const res = await toggleUserStatus(id)
   if (res.data.code === 0) {
      const resTeam = await getUsers()
      userList.value = resTeam.data
    }
}


</script>

<template>
  <div class="teams-page">
    <!-- 页头 -->
    <div class="page-header">
      <h2>用户管理</h2>
    </div>

    <!-- 搜索栏 -->
    <div class="search-bar">
      <input
        v-model="searchText"
        type="text"
        placeholder="请输入用户名、组别或状态"
        class="search-input"
      />
      <button class="btn btn-default">搜索</button>
        <button class="btn btn-primary" @click="openAdd">新增用户</button>

    </div>

    <!-- 表格 -->
    <div class="table-wrapper">
      <table class="data-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>用户名</th>
            <th>组别</th>
            <th>状态</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="filteredList.length === 0">
            <td colspan="7" class="empty-tip">暂无数据</td>
          </tr>
          <tr v-for="user in filteredList" :key="user.id">
            <td>{{ user.id }}</td>
            <td>{{ user.username }}</td>
            <td>{{ user.type }}</td>
            <td v-if="user.status == 1">启用</td>
            <td v-else>禁用</td>
              <td>
              <button class="btn-link edit" @click="openEdit(user)">编辑</button>
              <span class="divider">|</span>
            <button class="btn-link toggle-enable" v-if="user.status == 1" @click="toggleStatus(user.id)">禁用</button>
                        <button class="btn-link toggle-disable" v-else  @click="toggleStatus(user.id)">启用</button>
  
            <span class="divider">|</span>


              <button class="btn-link delete" @click="openDelete(user.id)">删除</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
   <!-- 新增/编辑弹窗 -->
    <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal">
        <div class="modal-header">
          <h3>{{ isEdit ? '编辑用户' : '新增用户' }}</h3>
          <button class="modal-close" @click="closeModal">✕</button>
        </div>
        <div class="modal-body">
          <div class="form-item">
            <label>用户名 <span class="required">*</span></label>
            <input v-model="form.username" type="text" placeholder="请输入用户名" />
          </div>
   
          <div class="form-item">
            <label>密码 <span class="required">*</span></label>
            <input v-model="form.password" type="password" placeholder="若为空，则不修改密码" />
          </div>
     
        </div>
        <div class="modal-footer">
          <button class="btn btn-default" @click="closeModal">取消</button>
          <button class="btn btn-primary" @click="submitForm">确定</button>
        </div>
      </div>
    </div>

    <!-- 删除确认弹窗 -->
    <div v-if="showDeleteConfirm" class="modal-overlay" @click.self="cancelDelete">
      <div class="modal modal-sm">
        <div class="modal-header">
          <h3>确认删除</h3>
          <button class="modal-close" @click="cancelDelete">✕</button>
        </div>
        <div class="modal-body">
          <p>确定要删除这名用户吗？此操作不可恢复。</p>
        </div>
        <div class="modal-footer">
          <button class="btn btn-default" @click="cancelDelete">取消</button>
          <button class="btn btn-danger" @click="confirmDelete">确认删除</button>
        </div>
      </div>
    </div>
   
  </div>
</template>

<style scoped>
.teams-page {
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

/* 搜索栏 */
.search-bar {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.search-input {
  width: 260px;
  padding: 6px 12px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  font-size: 14px;
  outline: none;
  transition: border-color 0.2s;
}

.search-input:focus {
  border-color: #1890ff;
}

/* 按钮 */
.btn {
  padding: 6px 16px;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  border: 1px solid transparent;
  transition: opacity 0.2s;
}

.btn:hover {
  opacity: 0.85;
}

.btn-default {
  background: #fff;
  border-color: #d9d9d9;
  color: #333;
}

.btn-primary {
  background: #1890ff;
  color: #fff;
}

.btn-danger {
  background: #ff4d4f;
  color: #fff;
}

.toggle-enable { color: #fa8c16; }
.toggle-disable { color: #52c41a; }
/* 表格 */
.table-wrapper {
  border: 1px solid #f0f0f0;
  border-radius: 4px;
  overflow: hidden;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

.data-table th,
.data-table td {
  padding: 12px 16px;
  text-align: left;
  border-bottom: 1px solid #f0f0f0;
}

.data-table th {
  background: #fafafa;
  font-weight: 600;
  color: #333;
}

.data-table tr:last-child td {
  border-bottom: none;
}

.data-table tbody tr:hover {
  background: #f5f9ff;
}

.empty-tip {
  text-align: center;
  color: #999;
  padding: 40px 0;
}

/* 操作按钮 */
.btn-link {
  background: none;
  border: none;
  padding: 0;
  font-size: 14px;
  cursor: pointer;
  transition: opacity 0.2s;
}

.btn-link:hover {
  opacity: 0.75;
}

.btn-link.edit {
  color: #1890ff;
}

.btn-link.delete {
  color: #ff4d4f;
}

.divider {
  color: #d9d9d9;
  margin: 0 8px;
}

/* 弹窗 */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background: #fff;
  border-radius: 8px;
  width: 480px;
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.15);
}

.modal-sm {
  width: 360px;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid #f0f0f0;
}

.modal-header h3 {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.modal-close {
  background: none;
  border: none;
  font-size: 16px;
  color: #999;
  cursor: pointer;
  line-height: 1;
  padding: 0;
}

.modal-close:hover {
  color: #333;
}

.modal-body {
  padding: 20px;
}

.modal-body p {
  margin: 0;
  color: #555;
  font-size: 14px;
}

/* 表单 */
.form-item {
  margin-bottom: 16px;
}

.form-item label {
  display: block;
  margin-bottom: 6px;
  font-size: 14px;
  color: #333;
}

.required {
  color: #ff4d4f;
}

.form-item input {
  width: 100%;
  padding: 7px 12px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  font-size: 14px;
  outline: none;
  box-sizing: border-box;
  transition: border-color 0.2s;
}

.form-item input:focus {
  border-color: #1890ff;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding: 12px 20px;
  border-top: 1px solid #f0f0f0;
}
</style>
