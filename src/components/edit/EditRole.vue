<template>
  <a-form-model ref="form" :model="formData" :rules="rules">
    <a-form-model-item label="RoleName" prop="label">
      <a-input v-model.trim="formData.label" placeholder="InputPermissionName" />
    </a-form-model-item>
    <a-form-model-item label="Description" prop="description">
      <a-input v-model.trim="formData.description" placeholder="InputNote" />
    </a-form-model-item>
    <a-form-model-item label="Permission" prop="permissions">
      <a-spin v-if="loading" style="width: 100%" />
      <a-tree
        v-else
        v-model="formData.permissions"
        checkable
        defaultExpandAll
        :tree-data="permissions"
        :replace-fields="{ key: 'value' }"
      />
    </a-form-model-item>
  </a-form-model>
</template>

<script>
import { groupBy } from 'lodash-es';

export default {
  name: 'EditRole',
  props: {
    data: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      permissions: [],
      loading: true,
      formData: {
        label: '',
        description: '',
        permissions: [],
      },
      rules: {
        label: { required: true, message: 'InputRoleName' },
        permissions: { required: true, message: '' },
      },
    };
  },
  watch: {
    data: {
      immediate: true,
      handler(data) {
        if (!data) return;
        this.formData = {
          label: data.label,
          description: data.description,
          permissions: data.permissions.map(i => i.id),
        };
      },
    },
  },
  mounted() {
    this.loading = true;
    this.$api.getPermissions()
      .then(data => {
        this.initPermissions(data.data);
      }).catch(e => {
        console.error(e);
        this.$message.error(e.msg || 'Permission列表获取失败');
      }).finally(() => {
        this.loading = false;
      });
  },
  methods: {
    initPermissions(data) {
      const permissions = groupBy(data, 'type');
      const result = [];
      for (const [type, items] of Object.entries(permissions)) {
        result.push({
          title: type,
          value: type,
          children: items.map(item => ({
            title: item.label,
            value: item.id,
          })),
        });
      }
      this.permissions = result;
    },
    validate() {
      return this.$refs.form.validate().then(() => ({
        ...this.formData,
        permissions: this.formData.permissions.filter(v => {
          return typeof v === 'number';
        }),
      }));
    },
  },
};
</script>
