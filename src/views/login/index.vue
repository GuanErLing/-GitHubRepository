<template>
  <div class="login-container">
    <el-form
      ref="loginForm"
      :model="loginForm"
      :rules="loginRules"
      class="login-form"
      auto-complete="on"
    >
      <div class="title-container">
        <h3 class="title">系统登录</h3>
      </div>

      <el-form-item prop="username">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input
          ref="username"
          v-model="loginForm.username"
          placeholder="Username"
          name="username"
          type="text"
          auto-complete="on"
        ></el-input>
      </el-form-item>

      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input
          ref="password"
          v-model="loginForm.password"
          :type="passwordType"
          placeholder="Password"
          name="password"
          auto-complete="on"
          @keyup.enter.native="onSubmit"
        ></el-input>
        <span class="show-pwd" @click="changeShowPwd">
          <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
        </span>
      </el-form-item>

      <div class="login-btns">
        <el-button :loading="loading" class="btn" type="primary" @click="onSubmit">登录</el-button>
        <el-button class="btn" @click="resetLoginForm">取消</el-button>
      </div>
    </el-form>
  </div>
</template>

<script>
import { validUsername } from "@/utils/validate";
export default {
  name: "Login",
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!validUsername(value)) {
        callback(new Error("请输入正确的用户名"));
      } else {
        callback();
      }
    };
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error("密码不能少于六位"));
      } else {
        callback();
      }
    };
    return {
      loginForm: {
        username: "admin",
        password: "111111"
      },
      loginRules: {
        username: [
          {
            required: true,
            trigger: "blur",
            validator: validateUsername
          }
        ],
        password: [
          {
            required: true,
            trigger: "blur",
            validator: validatePassword
          }
        ]
      },
      passwordType: "password",
      loading: false,
      redirect: undefined
    };
  },
  watch: {
    $route: {
      handler: function (route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  methods: {
    changeShowPwd: function() {
      this.passwordType =
        this.passwordType === "password" ? "text" : "password";
      this.$nextTick(() => {
        this.$refs.password.focus();
      });
    },
    onSubmit: function() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true;
          this.$store.dispatch("user/login", this.loginForm).then(() => {
              this.$router.push({ path: this.redirect || "/" });
              this.loading = false;
            }).catch(() => {
              this.loading = false;
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetLoginForm: function() {
      // this.$nextTick(() => {
      this.$refs.loginForm.resetFields(); //此方法只会还原初始化赋值
      // });
    }
  }
};
</script>


<style lang="scss">
/* 修复input背景不协调和光标变色 */

@supports (-webkit-mask: none) and (not (cater-color: #000000)) {
  .login-container .el-input input {
    color: #000000;
  }
}

.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: #000000;
      height: 47px;
      caret-color: #000000;
      font-family: sans-serif;

      &:-webkit-autofill {
        // box-shadow: 0 0 0px 1000px #e2e2e2 inset !important;     // 设置色值背景(二选一)
        transition: background-color 5000s ease-in-out 0s; // 设置透明背景
        -webkit-text-fill-color: #000000 !important;
      }

      &::-webkit-input-placeholder {
        color: #909090 !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
    margin-bottom: 30px;
  }
}
</style>

<style lang="scss" scoped>
.login-container {
  min-height: 100%;
  width: 100%;
  background-color: #ffffff;
  background: url("../../assets/image/bg.jpg") center no-repeat;
  background-size: cover;
  overflow: hidden;

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 35px;
    margin: 160px auto 0 auto;
    overflow: hidden;
    background: rgba(255, 255, 255, 0.5);
    border-radius: 5px;
    -moz-border-radius: 5px;
    -webkit-box-shadow: 0 0 30px #8c8c8c;
    box-shadow: 0 0 30px #8c8c8c;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 0 5px 0 15px;
    color: #383838;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: #000000;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
      letter-spacing: 5px;
    }
  }

  .login-btns {
    display: flex;
    align-items: center;
    justify-content: space-between;

    .btn {
      width: 50%;
    }
  }

  .show-pwd {
    font-size: 16px;
    color: #383838;
    cursor: pointer;
    user-select: none;
  }
}
</style>