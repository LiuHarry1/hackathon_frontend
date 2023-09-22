<template>
  <div>
    <SearchForm
      ref="searchForm"
      :options="searchOptions"
      :loading="loading"
      @search="search"
      @reset="search"
    />

    <AntTable
      :loading="loading"
      :bordered="false"
      :columns="columns"
      :data-source="tableData"
      :pagination="pagination"
      :scroll="{ x: 500 }"
      @change="changePage"
    >
      <template #header>
        <a-button v-if="$has('role:add')" type="primary" @click="addRole">
          <a-icon type="plus" />Add Role
        </a-button>
      </template>
      <template #expandedRowRender="record">
        <div
          class="permissions"
          v-for="(items, type) in group(record.permissions)"
          :key="type"
        >
          <span class="title">{{ type }}</span>
          <div class="tag-container">
            <a-tag
              v-for="({ label, action }, index) in items"
              :key="index"
              color="green"
            >
              {{ `${label}(${action})` }}
            </a-tag>
          </div>
        </div>
      </template>
    </AntTable>
  </div>
</template>

<script>
import EditRole from '@/components/edit/EditRole';

export default {
  name: 'PermissionList',
  metaInfo: {
    title: 'Role',
  },
  data() {
    return {
      loading: false,
      current: 1,
      pageSize: 10,
      total: 0,
      tableData: [],
      searchOptions: createSearchOptions.call(this),
      columns: createTableColumns.call(this, this.$createElement),
    };
  },
  computed: {
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
    changePage({ pageSize, current }) {
      Object.assign(this, { pageSize, current });
    },
    search() {
      this.current = 1;
      this.getData();
    },
    getData() {
      this.loading = true;
      this.$api.getRoles({
        ...this.$refs.searchForm.getResult(),
        offset: this.current,
        limit: this.pageSize,
      }).then(data => {
        this.tableData = data.data;
        this.total = data.count;
      }).catch(e => {
        this.$message.error(e.msg || '获取Role列表失败');
      }).finally(() => {
        this.loading = false;
      });
    },
    addRole() {
      let vnode;
      this.$drawer({
        title: 'Add Role',
        content: h => (vnode = <EditRole />),
        onOk: async () => {
          const values = await vnode.componentInstance.validate();
          return this.$api.addRole(values).then(() => {
            this.search();
          }).catch(e => {
            console.error(e);
            this.$message.error(e.msg || 'Add 失败');
            throw e;
          });
        },
      });
    },
    edit(row) {
      let vnode;
      this.$drawer({
        title: 'EditRole',
        content: h => (vnode = <EditRole data={row} />),
        onOk: async () => {
          const values = await vnode.componentInstance.validate();
          values.id = row.id;
          return this.$api.updateRole(values).then(() => {
            this.search();
          }).catch(e => {
            console.error(e);
            this.$message.error(e.msg || 'Edit失败');
            throw e;
          });
        },
      });
    },
    remove(row) {
      this.$modal.confirm({
        title: `确认Delete ${row.label}?`,
        onOk: () => this.$api.deleteRole([row.id]).then(() => {
          this.$message.success('DeleteSuccess');
          this.search();
        }).catch(e => {
          console.error(e);
          this.$message.error(e.msg || 'Delete失败');
          throw e;
        }),
      });
    },
    group(permissions) {
      const result = {};
      for (const { type, action, label } of permissions) {
        const item = { action, label };
        if (!result[type]) result[type] = [];
        result[type].push(item);
      }
      return result;
    },
  },
};

function createSearchOptions() {
  return [
    {
      label: 'RoleID',
      key: 'id',
      default: '',
      component: 'input',
    },
    {
      label: 'RoleName',
      key: 'label',
      default: '',
      component: 'input',
    },
    {
      label: 'RoleDescription',
      key: 'description',
      default: '',
      component: 'input',
    },
  ];
}

function createTableColumns(h) {
  return [
    { title: 'RoleID', dataIndex: 'id', width: 80 },
    { title: 'RoleName', dataIndex: 'label', ellipsis: true },
    { title: 'RoleDescription', dataIndex: 'description' },
    {
      title: 'Operation',
      width: 100,
      customRender: (row) => {
        const buttons = [
          this.$has('role:update') && <a onClick={this.edit.bind(this, row)}>Edit</a>,
          this.$has('role:delete') && <a onClick={this.remove.bind(this, row)}>Delete</a>,
        ];
        return <div>{buttons}</div>;
      },
    },
  ];
}
</script>

<style scoped lang="stylus">
.permissions
  display flex
  align-items center
  &:not(:last-child)
    margin-bottom 10px
  & > .title
    align-self flex-start
    display inline-block
    min-width 80px
  & >>> .ant-tag
    cursor pointer
    margin-bottom 5px

a:not(:last-child)
  margin-right 10px
</style>
