<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getPlayers, addPlayer, updatePlayer, deletePlayer } from '@/api/players'

interface Player {
  id: number
  name: string
  team: string
  position: string
  number: number
  nationality: string
  age: number
}

const playerList = ref<Player[]>([])
const keyword = ref('')
const showDialog = ref(false)
const isEdit = ref(false)

const positionOptions = [
  '控球后卫',
  '得分后卫',
  '小前锋',
  '大前锋',
  '中锋',
  '前锋',
  '中场',
  '后卫',
  '守门员',
  '右翼',
  '左翼',
]

const emptyForm = (): Player => ({
  id: 0,
  name: '',
  team: '',
  position: '',
  number: 1,
  nationality: '',
  age: 20,
})

const form = ref<Player>(emptyForm())

onMounted(() => {
  loadList()
})

async function loadList() {
  const res = await getPlayers()
  playerList.value = res.data
}

const filteredList = computed(() => {
  const k = keyword.value.trim().toLowerCase()
  if (!k) return playerList.value

  return playerList.value.filter(
    (p) =>
      p.name.toLowerCase().includes(k) ||
      p.team.toLowerCase().includes(k) ||
      p.nationality.toLowerCase().includes(k),
  )
})

function openAdd() {
  isEdit.value = false
  form.value = emptyForm()
  showDialog.value = true
}

function openEdit(row: Player) {
  isEdit.value = true
  form.value = { ...row }
  showDialog.value = true
}

async function submitForm() {
  if (!form.value.name || !form.value.team || !form.value.position) {
    ElMessage.warning('请填写必填项：球员姓名、所属球队、位置')
    return
  }

  const res = isEdit.value ? await updatePlayer(form.value) : await addPlayer(form.value)

  if (res.data.code === 0) {
    ElMessage.success(isEdit.value ? '修改成功' : '新增成功')
    showDialog.value = false
    await loadList()
  }
}

async function handleDelete(id: number) {
  try {
    await ElMessageBox.confirm('确定要删除该球员吗？此操作不可恢复。', '确认删除', {
      confirmButtonText: '确认删除',
      cancelButtonText: '取消',
      type: 'warning',
    })

    const res = await deletePlayer(id)

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
  <div class="players-page">
    <div class="page-header">
      <h2>球员管理</h2>
    </div>

    <el-card>
      <div class="toolbar">
        <el-input
          v-model="keyword"
          placeholder="请输入球员姓名、球队或国籍"
          clearable
          style="width: 280px"
        />

        <el-button type="primary" @click="openAdd">新增球员</el-button>
      </div>

      <el-table :data="filteredList" border stripe style="width: 100%">
        <el-table-column prop="id" label="ID" width="80" sortable />
        <el-table-column prop="name" label="姓名" sortable />
        <el-table-column prop="team" label="所属球队" />
        <el-table-column prop="position" label="位置">
          <template #default="{ row }">
            <el-tag>{{ row.position }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="number" label="号码" width="100" sortable />
        <el-table-column prop="nationality" label="国籍" />
        <el-table-column prop="age" label="年龄" width="100" sortable />

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
      :title="isEdit ? '编辑球员' : '新增球员'"
      width="560px"
    >
      <el-form :model="form" label-width="90px">
        <el-form-item label="球员姓名" required>
          <el-input v-model="form.name" placeholder="请输入姓名" />
        </el-form-item>

        <el-form-item label="国籍">
          <el-input v-model="form.nationality" placeholder="如：美国" />
        </el-form-item>

        <el-form-item label="所属球队" required>
          <el-input v-model="form.team" placeholder="请输入球队名称" />
        </el-form-item>

        <el-form-item label="位置" required>
          <el-select v-model="form.position" placeholder="请选择位置" style="width: 100%">
            <el-option
              v-for="item in positionOptions"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="号码">
          <el-input-number v-model="form.number" :min="1" :max="99" />
        </el-form-item>

        <el-form-item label="年龄">
          <el-input-number v-model="form.age" :min="15" :max="50" />
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
.players-page {
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