<template>
  <a-form-model
    ref="form"
    :label-col="{ span: 4 }"
    :wrapper-col="{ span: 20 }"
    :model="formData"
    :rules="rules"
  >
    <a-form-model-item label="Original" prop="password" >
      <a-input-password v-model="formData.password" placeholder="Original Password">
        <a-icon
          slot="prefix"
          type="lock"
          style="color: rgba(0,0,0,.25)"
        />
      </a-input-password>
    </a-form-model-item>
    <a-form-model-item label="New" prop="newPass">
      <a-input-password v-model="formData.newPass" placeholder="New Password">
        <a-icon
          slot="prefix"
          type="lock"
          style="color: rgba(0,0,0,.25)"
        />
      </a-input-password>
    </a-form-model-item>
    <a-form-model-item label="reNew" prop="reNewPass">
      <a-input-password v-model="formData.reNewPass" placeholder="Input again">
        <a-icon
          slot="prefix"
          type="lock"
          style="color: rgba(0,0,0,.25)"
        />
      </a-input-password>
    </a-form-model-item>
  </a-form-model>
</template>

<script>
export default {
  name: 'UpdatePassword',
  data() {
    return {
      rules: getRules.call(this),
      formData: {
        password: '',
        newPass: '',
        reNewPass: '',
      },
    };
  },
  methods: {
    validate() {
      // 依次校验表单字段，遇到失败项就停止
      const promise = Object.keys(this.rules).reduce((promise, key) => {
        return promise.then(() => new Promise((resolve, reject) => {
          this.$refs.form.validateField(key, msg => {
            if (msg) reject(new Error(msg));
            else resolve();
          });
        }));
      }, Promise.resolve());
      return promise.then(() => ({
        oldVal: this.formData.password,
        newVal: this.formData.newPass,
      }));
    },
  },
};

function getRules() {
  return {
    password: {
      required: true,
      message: 'InputPassword！',
    },
    newPass: {
      required: true,
      validator: (rule, value, callback) => {
        const oldPass = this.formData.password;
        if (!value) {
          callback(new Error('Input新Password！'));
        } else if (value === oldPass) {
          callback(new Error('新Password不能与原Password相同！'));
        } else {
          callback();
        }
      },
    },
    reNewPass: {
      required: true,
      validator: (rule, value, callback) => {
        if (!value) {
          callback(new Error('请确认新Password！'));
        } if (value && value !== this.formData.newPass) {
          callback(new Error('两次Password不一致'));
        } else {
          callback();
        }
      },
    },
  };
}
</script>
