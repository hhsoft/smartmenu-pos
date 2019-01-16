<template>
<v-container fill-height class="signin">
  <v-layout column wrap fill-height align-center justify-center v-if="noSignIn">
    <v-spacer></v-spacer>
    <div class="form">
      <v-layout>
        <v-flex>
          <v-text-field hide-details flat solo type="text" class="text-field first login-id" v-model="id" v-on:keyup.13="signin" :placeholder="idPlaceholder"></v-text-field>
          <v-text-field hide-details flat solo type="password" class="text-field login-password" v-model="password" v-on:keyup.13="signin" :placeholder="passwordPlaceholder"></v-text-field>
        </v-flex>
        <div class="signin-btn" v-on:click="signin">로그인</div>
      </v-layout>
      <v-checkbox v-model="autoSignin" label="자동로그인" hide-details></v-checkbox>
    </div>
    <v-spacer></v-spacer>
    <v-spacer></v-spacer>
  </v-layout>
</v-container>
</template>
<script>
const settings = require('electron-settings');
var data = {
  number: "",
  numberPlaceholder: "테이블 번호를 입력해주세요",
  id: "",
  idPlaceholder: "아이디를 입력해주세요",
  password: "",
  passwordPlaceholder: "패스워드를 입력해주세요",
  storeSelectModal: false,
  autoSignin: true,
  noSignIn: false,
  storeList: [],
  env: process.env.NODE_ENV
};
export default {
  data: function() {
    return data
  },
  mounted: function() {
    // this.sessionCheck()
    var id = settings.get('signInfo.id');
    var password = settings.get('signInfo.password');
    if (id && password) {
      this.id = id;
      this.password = password
      this.signin()
    } else {
      this.noSignIn = true;
    }
  },
  methods: {

    signin: function() {
      if (this.id == "") {
        window.alert("아이디를 입력해주세요")
        return
      }
      if (this.password == "") {
        return window.alert("패스워드를 입력해주세요")
      }
      let self = this;
      this.$service.post("/device/signin", {
          id: this.id,
          password: this.password
        })
        .then(function(result) {
          if (result.data.res) {
            if (self.autoSignin) {
              settings.set('signInfo', {
                id: self.id,
                password: self.password
              });
            }
            self.$router.replace("main")
          } else {
            self.noSignIn = true;
            window.alert(result.data.msg)
          }
        });
    }
  }
}
</script>
<style scoped lang="less">
.signin {
    .text-field {
        border: 1px solid #B3B3B3;
        &.first {
            margin-bottom: 8px;
        }
    }
    .signin-btn {
        cursor: pointer;
        margin-left: 10px;
        width: 88px;
        text-align: center;
        line-height: 100px;
        background: #1A1A1A;
        color: #2CA6E0;
        &:active {
            transform: scale(0.9);
        }
    }
    .form {
        width: 60%;
    }
}
@media screen and (max-width: 600px) {
    .form {
        width: 100%!important;
    }
}
</style>
