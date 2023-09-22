<template>
  <div class="container">
    <SearchForm
      ref="searchForm"
      :loading="loading"
      :options="searchOptions"
      @search="search"
      @reset="search"
    />

    <!--信息列表-->
    <AntTable
      v-model="selectedKeys"
      row-key="sid"
      :loading="loading"
      :data-source="users"
      :pagination="pagination"
      :columns="tableColumns"
      @change="changePage"
    >
      <template #header>
        <a-button-group>
          <a-button v-if="$has('user:add')" type="primary" @click="addUser">
            Add Student
          </a-button>
          <a-button
            v-if="$has('user:delete')"
            :disabled="!selectedKeys.length"
            @click="batchDelete"
          >
            Delete  ({{ selectedKeys.length }})
          </a-button>
          <a-button v-if="$has('user:import')" @click="$refs.import.show()">
            ExcelImport
          </a-button>
          <a-button
            v-if="$has('user:export')"
            :loading="exporting"
            @click="exportAll"
          >
            全量导出
          </a-button>
        </a-button-group>
      </template>
      <template #action="record">
        <a-space>
          <template v-if="$has('user:update')">
            <!--编辑-->
            <a v-if="$has('user:update')" @click="editUser(record)">
              <a-icon type="edit" />
            </a>

            <!--重置Password-->
            <a-popconfirm
              title="确认重置Password？"
              ok-text="确认"
              cancel-text="取消"
              placement="left"
              @confirm="resetPassword(record)"
            >
              <template #icon>
                <a-icon type="question-circle-o" style="color: orange" />
              </template>
              <a-tooltip placement="top">
                <template #title>
                  <span>重置Password</span>
                </template>
                <a><a-icon type="rollback" /></a>
              </a-tooltip>
            </a-popconfirm>

            <!--授权-->
            <a @click="grantRole(record)">
              <a-icon type="key" />
            </a>
          </template>

          <!--删除-->
          <a-popconfirm
            v-if="$has('user:delete')"
            title="确认删除？"
            ok-text="确认"
            cancel-text="取消"
            placement="left"
            @confirm="deleteUser(record)"
          >
            <template #icon>
              <a-icon type="question-circle-o" style="color: orange" />
            </template>
            <a><a-icon type="delete" /></a>
          </a-popconfirm>
        </a-space>
      </template>
    </AntTable>

    <UserImport type="student" ref="import" @refresh="search" />
  </div>
</template>

<script>
import { grades, gradeMap, sexes, sexMap } from '@/utils/const';
import { exportData } from '@/utils/excel';
import createColumns from '@/helpers/importuser-columns';
import EditStudent from '@/components/edit/EditStudent';
import UserImport from '@/components/common/UserImport';
import GrantRole from '@/components/common/GrantRole';

const STUDENT_COLUMNS = [
  { title: 'Number', dataIndex: 'sid' },
  { title: 'Name', dataIndex: 'name' },
  { title: 'Sex', customRender: ({ sex }) => sexMap[sex] },
  { title: 'Grade', customRender: ({ grade }) => gradeMap[grade] },
  { title: 'Class', dataIndex: 'class' },
  { title: 'Create Date', dataIndex: 'create_time' },
  { title: 'Update Date', dataIndex: 'update_time' },
  {
    title: 'Operation',
    align: 'center',
    width: 100,
    scopedSlots: { customRender: 'action' },
  },
];

function exportExcel(data) {
  const header = STUDENT_COLUMNS.map(v => v.title);
  header.pop(); // 去掉最后一栏Operation栏
  return exportData({
    name: 'Student信息',
    data,
    header,
    keyMap: {
      sid: 'Number',
      name: 'Name',
      sex: ['Sex', sex => sexMap[sex]],
      grade: ['Grade', grade => gradeMap[grade]],
      class: 'Class',
      create_time: 'Create Date',
      update_time: 'Update Date',
    },
  });
}

export default {
  name: 'Student',
  metaInfo: {
    title: 'Student',
  },
  components: {
    UserImport,
  },
  data() {
    return {
      loading: false,
      exporting: false,
      query: {},
      selectedKeys: [],
      users: [],
      current: 1,
      pageSize: 10,
      total: 0,
      tableColumns: STUDENT_COLUMNS,
    };
  },
  computed: {
    searchOptions() {
      return createSearchOptions.call(this);
    },
    curColumns() {
      return createColumns(this.importUserType);
    },
    user() {
      return this.$store.state.user;
    },
    pagination() {
      return {
        current: this.current,
        pageSize: this.pageSize,
        total: this.total,
      };
    },
  },
  mounted() {
    this.$watch(() => [this.pageSize, this.current], this.getData, { immediate: true });
  },
  methods: {
    search() {
      this.current = 1;
      this.getData();
    },
    changePage({ pageSize, current }) {
      Object.assign(this, { pageSize, current });
    },
    getData() {
      this.loading = true;
      this.query = this.$refs.searchForm.getResult();
      this.$api.getUserList({
        ...this.query,
        type: 'student',
        offset: this.current,
        limit: this.pageSize,
      }).then(data => {
        this.users = data.data;
        this.total = data.count;
      }).catch(e => {
        console.error(e);
        this.$message.error(e.msg || '获取数据失败');
      }).finally(() => {
        this.loading = false;
      });
    },
    resetPassword(row) {
      const key = Date.now();
      this.$message.loading({
        key,
        content: '请稍后',
        duration: 0,
      });
      this.$api.resetPassword({
        type: 'student',
        account: row.sid,
      }).then(() => {
        this.$message.success({ content: '已重置', key });
      }).catch(() => {
        this.$message.error({ content: '重置失败', key });
      });
    },
    addUser() {
      let vnode;

      this.$confirm({
        title: 'Add Student',
        content: h => (vnode = h(EditStudent)),
        onOk: async () => {
          const values = await vnode.componentInstance.validate();
          return this.$api.addUser('student', values).then(() => {
            this.$message.success('Add 成功');
            this.getData();
          }).catch(e => {
            console.error(e);
            this.$message.error(e.msg || 'Add 失败');
            throw e;
          });
        },
      });
    },
    editUser(row) {
      let vnode;
      this.$confirm({
        title: '修改信息',
        content: h => (vnode = <EditStudent type="update" data={row} />),
        onOk: async () => {
          const values = await vnode.componentInstance.validate();
          return this.$api.updateUser(
            'student',
            values,
          ).then(() => {
            this.$message.success('修改成功');
            this.getData();
          }).catch(e => {
            console.error(e);
            this.$message.error(e.msg || '修改失败');
            throw e;
          });
        },
      });
    },
    deleteUser(row) {
      const key = Math.random();
      this.$message.loading({ content: '正在删除', duration: 0, key });
      this.$api.deleteUser('student', {
        ids: [row.sid],
      }).then(() => {
        this.$message.success({ content: '删除成功!', key });
        this.getData();
      }).catch(e => {
        this.$message.error({ content: e.msg || '删除失败!', key });
      });
    },
    batchDelete() {
      this.$modal.confirm({
        title: `确认删除选中的${this.selectedKeys.length}项数据?`,
        onOk: () => this.$api.deleteUser('student', {
          ids: this.selectedKeys,
        }).then(() => {
          this.$message.success('删除成功!');
          this.selectedKeys.splice(0);
          this.getData();
        }).catch(e => {
          this.$message.error(e.msg || '删除失败!');
          throw e;
        }),
      });
    },
    exportAll() {
      this.exporting = true;
      this.$api.getUserList({
        ...this.query,
        type: 'student',
      }).then(data => {
        return exportExcel(data.data);
      }).catch(e => {
        console.error(e);
        this.$message.error(e.msg || '导出失败');
      }).finally(() => {
        this.exporting = false;
      });
    },
    grantRole(item) {
      let vnode;
      this.$confirm({
        title: '授权',
        content: () => (vnode = <GrantRole
          type="student"
          role={item.role_id}
          account={item.sid}
        />),
        onOk: async () => {
          await vnode.componentInstance.confirm();
          this.getData();
        },
      });
    },
  },
};

function createSearchOptions() {
  return [
    {
      label: 'Number',
      key: 'sid',
      default: '',
      component: 'input',
    },
    {
      label: 'Name',
      key: 'name',
      default: '',
      component: 'input',
    },
    {
      label: 'Sex',
      key: 'sex',
      default: undefined,
      component: 'select',
      props: {
        options: sexes,
      },
    },
    {
      label: 'Grade',
      key: 'grade',
      default: undefined,
      component: 'select',
      props: {
        options: grades,
      },
    },
    {
      label: 'Class',
      key: 'class',
      default: '',
      component: 'input',
    },
  ];
}
</script>
