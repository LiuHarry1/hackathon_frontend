<template>
  <a-form
    :label-col="labelCol"
    :wrapper-col="wrapperCol"
    :form="form"
  >
    <a-form-item label="ID">
      <a-input
        v-decorator="decorator.sid"
        :disabled="isEdit"
        placeholder="ID"
        allowClear
      >
        <a-icon
          slot="prefix"
          type="user"
          style="color: rgba(0,0,0,.25)"
        />
      </a-input>
    </a-form-item>
    <a-form-item v-if="!isEdit" label="Password">
      <a-input
        ref="password"
        v-decorator="decorator.password"
        placeholder="Password"
        allowClear
      >
        <a-icon
          slot="prefix"
          type="lock"
          style="color: rgba(0,0,0,.25)"
        />
      </a-input>
    </a-form-item>
    <a-form-item label="Name">
      <a-input
        v-decorator="decorator.name"
        placeholder="Name"
        allowClear
      />
    </a-form-item>
    <a-form-item label="grade">
      <a-select
        v-decorator="decorator.grade"
        :options="grades"
        allowClear
        placeholder="grade"
      />
    </a-form-item>
    <a-form-item label="Class">
      <a-input
        v-decorator="decorator.class"
        placeholder="Class"
        allowClear
      />
    </a-form-item>
    <a-form-item label="Sex">
      <a-radio-group v-decorator="decorator.sex" :options="sexes" />
    </a-form-item>
  </a-form>
</template>

<script>
import { pick } from 'lodash-es';
import { grades, sexes } from '@/utils/const';
import EditMixin from './edit-mixin';

export default {
  name: 'EditStudent',
  mixins: [EditMixin],
  data() {
    return {
      grades,
      decorator,
      sexes,
    };
  },
  methods: {
    initData() {
      const { data } = this;
      const result = pick(data, ['sid', 'name', 'sex', 'class', 'grade']);
      this.form.setFieldsValue(result);
    },
  },
};

/**
 * 定义decorator
 */
const decorator = {
  sid: ['sid', {
    rules: [{
      required: true,
      message: '请输入账号！',
    }],
  }],
  password: ['password', {
    rules: [{
      required: true,
      message: '请输入Password！',
    }],
  }],
  name: ['name', {
    rules: [{
      required: true,
      message: '请输入Name！',
    }],
  }],
  sex: ['sex', {
    initialValue: 1,
  }],
  class: ['class', {
    rules: [{
      required: true,
      message: '请输入Class！',
    }],
  }],
  grade: ['grade', {
    rules: [{
      required: true,
      message: '请选择Grade！',
    }],
  }],
};
</script>
