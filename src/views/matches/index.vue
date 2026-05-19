<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getMatches, addMatch, updateMatch, deleteMatch } from '@/api/matches'
import { crawlerMatches } from '@/api/crawler'

interface Match {
  id: number
  name: string
  home_team: string
  visit_team: string
  match_time: string
  score: string
}

const matchList = ref<Match[]>([])
const keyword = ref('')
const showDialog = ref(false)
const isEdit = ref(false)

const emptyForm = (): Match => ({
  id: 0,
  name: '',
  home_team: '',
  visit_team: '',
  match_time: '',
  score: '',
})

const form = ref<Match>(emptyForm())

onMounted(() => {
  loadList()
})

async function loadList() {
  const res = await getMatches()
  matchList.value = res.data
}

const filteredList = computed(() => {
  const k = keyword.value.trim().toLowerCase()
  if (!k) return matchList.value

  return matchList.value.filter(
    (m) =>
      m.name.toLowerCase().includes(k) ||
      m.home_team.toLowerCase().includes(k) ||
      m.visit_team.toLowerCase().includes(k),
  )
})

function openAdd() {
  isEdit.value = false
  form.value = emptyForm()
  showDialog.value = true
}

function openEdit(row: Match) {
  isEdit.value = true
  form.value = { ...row }
  showDialog.value = true
}

async function submitForm() {
  if (!form.value.name || !form.value.home_team || !form.value.visit_team || !form.value.match_time) {
    ElMessage.warning('请填写必填项：联赛、主队、客队、比赛时间')
    return
  }

  const res = isEdit.value ? await updateMatch(form.value) : await addMatch(form.value)

  if (res.data.code === 0) {
    ElMessage.success(isEdit.value ? '修改成功' : '新增成功')
    showDialog.value = false
    await loadList()
  }
}

async function handleDelete(id: number) {
  try {
    await ElMessageBox.confirm('确定要删除这场比赛吗？此操作不可恢复。', '确认删除', {
      confirmButtonText: '确认删除',
      cancelButtonText: '取消',
      type: 'warning',
    })

    const res = await deleteMatch(id)

    if (res.data.code === 0) {
      ElMessage.success('删除成功')
      await loadList()
    }
  } catch {
    // 用户点取消，不处理
  }
}

async function fetchData() {
  await crawlerMatches()
  await loadList()
  ElMessage.success('数据更新成功')
}
</script>

<template>
  <div class="matches-page">
    <div class="page-header">
      <h2>比赛管理</h2>
    </div>

    <el-card>
      <div class="toolbar">
        <el-input
          v-model="keyword"
          placeholder="请输入联赛或球队名称"
          clearable
          style="width: 260px"
        />

        <el-button type="primary" @click="openAdd">新增比赛</el-button>
        <el-button type="warning" @click="fetchData">更新数据</el-button>
      </div>

      <el-table :data="filteredList" border stripe style="width: 100%">
        <el-table-column prop="id" label="ID" width="80" sortable />
        <el-table-column prop="name" label="联赛" />
        <el-table-column prop="home_team" label="主队" />
        <el-table-column prop="visit_team" label="客队" />
        <el-table-column prop="match_time" label="比赛时间" sortable />
        <el-table-column prop="score" label="比分" width="100" />

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
      :title="isEdit ? '编辑比赛' : '新增比赛'"
      width="520px"
    >
      <el-form :model="form" label-width="80px">
        <el-form-item label="联赛" required>
          <el-input v-model="form.name" placeholder="请输入联赛名称" />
        </el-form-item>

        <el-form-item label="主队" required>
          <el-input v-model="form.home_team" placeholder="请输入主队名称" />
        </el-form-item>

        <el-form-item label="客队" required>
          <el-input v-model="form.visit_team" placeholder="请输入客队名称" />
        </el-form-item>

        <el-form-item label="比赛时间" required>
          <el-input v-model="form.match_time" placeholder="如：2026-05-14 21:00:00" />
        </el-form-item>

        <el-form-item label="比分">
          <el-input v-model="form.score" placeholder="如：2-1" />
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
.matches-page {
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