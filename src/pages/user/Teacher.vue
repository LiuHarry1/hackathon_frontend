<template>
  <div class="container">
    <SearchForm
      ref="searchForm"
      :loading="loading"
      :options="searchOptions"
      @search="search"
      @reset="search"
    />

    <!--Info列表-->
    <AntTable
      v-model="selectedKeys"
      row-key="tid"
      :loading="loading"
      :data-source="users"
      :pagination="pagination"
      :columns="tableColumns"
      @change="changePage"
    >
      <template #header>
        <a-button-group>
          <a-button v-if="$has('user:add')" type="primary" @click="addUser">
            Add Teacher
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
            Export
          </a-button>
        </a-button-group>
      </template>
      <template #action="record">
        <a-space>
          <template v-if="$has('user:update')">
            <!--Edit-->
            <a @click="editUser(record)">
              <a-icon type="edit" />
            </a>

            <!--ResetPassword-->
            <a-popconfirm
              title="确认ResetPassword？"
              ok-text="确认"
              cancel-text="Cancel"
              placement="left"
              @confirm="resetPassword(record)"
            >
              <template #icon>
                <a-icon type="question-circle-o" style="color: orange" />
              </template>
              <a-tooltip placement="top">
                <template #title>
                  <span>ResetPassword</span>
                </template>
                <a><a-icon type="rollback" /></a>
              </a-tooltip>
            </a-popconfirm>

            <!--授权-->
            <a @click="grantRole(record)">
              <a-icon type="key" />
            </a>
          </template>

          <!--Delete-->
          <a-popconfirm
            title="确认Delete？"
            ok-text="确认"
            cancel-text="Cancel"
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

    <UserImport type="teacher" ref="import" @refresh="search" />
  </div>
</template>

<script>
import { rankMap, ranks } from '@/utils/const';
import { exportData } from '@/utils/excel';
import createColumns from '@/helpers/importuser-columns';
import EditTeacher from '@/components/edit/EditTeacher';
import UserImport from '@/components/common/UserImport.vue';
import GrantRole from '@/components/common/GrantRole';

const TEACHER_COLUMNS = [
  { title: 'Number', dataIndex: 'tid' },
  { title: 'Name', dataIndex: 'name' },
  { title: 'Level', customRender: ({ rank }) => rankMap[rank] },
  { title: 'Description', dataIndex: 'description', ellipsis: true },
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
  const header = TEACHER_COLUMNS.map(v => v.title);
  header.pop(); // 去掉最后一栏Operation栏
  return exportData({
    name: 'TeacherInfo',
    data,
    header,
    keyMap: {
      tid: 'Number',
      name: 'Name',
      rank: ['Level', rank => rankMap[rank]],
      description: 'Description',
      create_time: 'Create Date',
      update_time: 'Update Date',
    },
  });
}

export default {
  name: 'Teacher',
  components: { UserImport },
  metaInfo: {
    title: 'Teacher管理',
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
      tableColumns: TEACHER_COLUMNS,
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
        type: 'teacher',
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
        type: 'teacher',
        account: row.tid,
      }).then(() => {
        this.$message.success({ content: '已Reset', key });
      }).catch(() => {
        this.$message.error({ content: 'Reset失败', key });
      });
    },
    addUser() {
      let vnode;

      this.$confirm({
        title: 'Add Teacher',
        content: h => (vnode = h(EditTeacher)),
        onOk: async () => {
          const values = await vnode.componentInstance.validate();
          return this.$api.addUser('teacher', values).then(() => {
            this.$message.success('Add Success');
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
        title: 'EditInfo',
        content: h => (vnode = <EditTeacher type="update" data={row} />),
        onOk: async () => {
          const values = await vnode.componentInstance.validate();
          return this.$api.updateUser(
            'teacher',
            values,
          ).then(() => {
            this.$message.success('EditSuccess');
            this.getData();
          }).catch(e => {
            console.error(e);
            this.$message.error(e.msg || 'Edit失败');
            throw e;
          });
        },
      });
    },
    deleteUser(row) {
      const key = Math.random();
      this.$message.loading({ content: '正在Delete', duration: 0, key });
      this.$api.deleteUser('teacher', {
        ids: [row.tid],
      }).then(() => {
        this.$message.success({ content: 'DeleteSuccess!', key });
        this.getData();
      }).catch(e => {
        this.$message.error({ content: e.msg || 'Delete失败!', key });
      });
    },
    batchDelete() {
      this.$modal.confirm({
        title: `确认Delete选中的${this.selectedKeys.length}项数据?`,
        onOk: () => this.$api.deleteUser('teacher', {
          ids: this.selectedKeys,
        }).then(() => {
          this.$message.success('DeleteSuccess!');
          this.selectedKeys.splice(0);
          this.getData();
        }).catch(e => {
          this.$message.error(e.msg || 'Delete失败!');
          throw e;
        }),
      });
    },
    exportAll() {
      this.exporting = true;
      this.$api.getUserList({
        ...this.query,
        type: 'teacher',
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
          type="teacher"
          role={item.role_id}
          account={item.tid}
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
      key: 'tid',
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
      label: 'Level',
      key: 'rank',
      default: undefined,
      component: 'select',
      props: {
        options: ranks,
      },
    },
  ];
}
</script>
