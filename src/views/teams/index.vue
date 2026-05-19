<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getTeams, addTeam, updateTeam, deleteTeam } from '@/api/teams'

interface Team {
  id: number
  name: string
  league: string
  city: string
  coach: string
  founded: number
}

const teamList = ref<Team[]>([])
const searchText = ref('')
const showDialog = ref(false)
const isEdit = ref(false)

const emptyForm = (): Team => ({
  id: 0,
  name: '',
  league: '',
  city: '',
  coach: '',
  founded: new Date().getFullYear(),
})

const form = ref<Team>(emptyForm())

onMounted(() => {
  loadList()
})

async function loadList() {
  const res = await getTeams()
  teamList.value = res.data
}

const filteredList = computed(() => {
  const keyword = searchText.value.trim().toLowerCase()
  if (!keyword) return teamList.value

  return teamList.value.filter(
    (t) =>
      t.name.toLowerCase().includes(keyword) ||
      t.league.toLowerCase().includes(keyword) ||
      t.city.toLowerCase().includes(keyword),
  )
})

function openAdd() {
  isEdit.value = false
  form.value = emptyForm()
  showDialog.value = true
}

function openEdit(row: Team) {
  isEdit.value = true
  form.value = { ...row }
  showDialog.value = true
}

async function submitForm() {
  if (!form.value.name || !form.value.league || !form.value.city) {
    ElMessage.warning('请填写必填项：球队名称、所属联赛、所在城市')
    return
  }

  const res = isEdit.value ? await updateTeam(form.value) : await addTeam(form.value)

  if (res.data.code === 0) {
    ElMessage.success(isEdit.value ? '修改成功' : '新增成功')
    showDialog.value = false
    await loadList()
  }
}

async function handleDelete(id: number) {
  try {
    await ElMessageBox.confirm('确定要删除这支球队吗？此操作不可恢复。', '确认删除', {
      confirmButtonText: '确认删除',
      cancelButtonText: '取消',
      type: 'warning',
    })

    const res = await deleteTeam(id)

    if (res.data.code === 0) {
      ElMessage.success('删除成功')
      await loadList()
    }
  } catch {
    // 取消删除
  }
}
</script>

<template>
  <div class="teams-page">
    <div class="page-header">
      <h2>球队管理</h2>
    </div>

    <el-card>
      <div class="toolbar">
        <el-input
          v-model="searchText"
          placeholder="请输入球队名称、联赛或城市"
          clearable
          style="width: 280px"
        />

        <el-button type="primary" @click="openAdd">新增球队</el-button>
      </div>

      <el-table :data="filteredList" border stripe style="width: 100%">
        <el-table-column prop="id" label="ID" width="80" sortable />
        <el-table-column prop="name" label="球队名称" sortable />
        <el-table-column prop="league" label="所属联赛" />
        <el-table-column prop="city" label="所在城市" />
        <el-table-column prop="coach" label="主教练" />
        <el-table-column prop="founded" label="成立年份" width="120" sortable />

        <el-table-column label="操作" width="160">
          <template #default="{ row }">
            <el-button type="primary" link @click="openEdit(row)">编辑</el-button>
            <el-button type="danger" link @click="handleDelete(row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog
      v-model="showDialog"
      :title="isEdit ? '编辑球队' : '新增球队'"
      width="520px"
    >
      <el-form :model="form" label-width="90px">
        <el-form-item label="球队名称" required>
          <el-input v-model="form.name" placeholder="请输入球队名称" />
        </el-form-item>

        <el-form-item label="所属联赛" required>
          <el-input v-model="form.league" placeholder="如：NBA / 英超 / 中超" />
        </el-form-item>

        <el-form-item label="所在城市" required>
          <el-input v-model="form.city" placeholder="请输入城市" />
        </el-form-item>

        <el-form-item label="主教练">
          <el-input v-model="form.coach" placeholder="请输入主教练姓名" />
        </el-form-item>

        <el-form-item label="成立年份">
          <el-input-number v-model="form.founded" :min="1800" :max="2100" />
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

.toolbar {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}
</style>