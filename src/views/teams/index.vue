<script setup lang="ts">
import { ref,  onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getTeams, addTeam, updateTeam, deleteTeam } from '@/api/teams'

interface Team {
  id: number
  team_cn: string
  team_en: string
  league: string
}

const teamList = ref<Team[]>([])
const keyword = ref('')
const dialogVisible = ref(false)
const isEdit = ref(false)

const currentPage = ref(1)
const pageSize = ref(12)
const total = ref(0)

const emptyForm = (): Team => ({
  id: 0,
  team_cn: '',
  team_en: '',
  league: '',
})

const form = ref<Team>(emptyForm())

onMounted(() => {
  loadList()
})

async function loadList() {
 const res = await getTeams(currentPage.value, pageSize.value,keyword.value)
  teamList.value = res.data.list
  total.value = res.data.total
}


function openAdd() {
  isEdit.value = false
  form.value = emptyForm()
  dialogVisible.value = true
}

function openEdit(row: Team) {
  isEdit.value = true
  form.value = { ...row }
  dialogVisible.value = true
}

async function submitForm() {
  if (!form.value.team_cn || !form.value.league) {
    ElMessage.warning('请填写必填项：中文名、所属联赛')
    return
  }

  const res = isEdit.value ? await updateTeam(form.value) : await addTeam(form.value)

  if (res.data.code === 0) {
    ElMessage.success(isEdit.value ? '修改成功' : '新增成功')
    dialogVisible.value = false
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
    // 用户点取消，不处理
  }
}

async function handlePageChange(page: number) {
  currentPage.value = page
  await loadList()
}

async function handleSearch() {
  currentPage.value = 1
  await loadList()
}

</script>

<template>
  <div class="teams-page">
    <div class="page-header">
      <h2>球队管理</h2>
    </div>

    <div class="search-bar">
      <el-input
        v-model="keyword"
        placeholder="请输入球队名称或联赛"
        clearable
        style="width: 260px"
        @change = handleSearch
      />

      <el-button type="primary" @click="openAdd">新增球队</el-button>
    </div>

    <el-card>
    <el-table  :data="teamList" border stripe style="width: 100%" >
      <el-table-column prop="id" label="ID" width="80" sortable />
      <el-table-column prop="team_cn" label="中文名" sortable />
      <el-table-column prop="team_en" label="英文名" sortable/>
      <el-table-column prop="league" label="所属联赛" sortale/>

      <el-table-column label="操作" width="160">
        <template #default="{ row }">
          <el-button type="primary" link @click="openEdit(row)">编辑</el-button>
          <el-button type="danger" link @click="handleDelete(row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
     <el-pagination
  v-model:current-page="currentPage"
  :page-size="pageSize"
  :total="total"
  layout="total, prev, pager, next"
  @current-change="handlePageChange"
/>
    </el-card>

    <el-dialog
      v-model="dialogVisible"
      :title="isEdit ? '编辑球队' : '新增球队'"
      width="480px"
    >
      <el-form :model="form" label-width="90px">
        <el-form-item label="中文名" required>
          <el-input v-model="form.team_cn" placeholder="请输入中文名" />
        </el-form-item>

        <el-form-item label="英文名">
          <el-input v-model="form.team_en" placeholder="请输入英文名" />
        </el-form-item>

        <el-form-item label="所属联赛" required>
          <el-input v-model="form.league" placeholder="如：英超 / 意甲" />
        </el-form-item>
      </el-form>

      

      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
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

.search-bar {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}
</style>