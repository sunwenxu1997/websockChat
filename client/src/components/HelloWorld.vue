<template>
  <div class="test3">
    <p>在线人数：{{count}}</p>
    <div class="msg" ref="box">
      <div v-for="(i,index) in list" :key="index">
        <p>{{i.content}}</p>
      </div>
    </div>
    <div class="input-group">
      <input type="text" v-model="contentText" />
      <button @click="sendText">发送</button>
    </div>
  </div>
</template>
 
<script>
export default {
  name: "index3",
  data() {
    return {
      ws: null,
      count: 0,
      list: [], //聊天记录的数组
      contentText: "" //input输入的值
    };
  },
  mounted() {
    this.initWebSocket();
  },
  methods: {
    //发送聊天信息
    sendText() {
      let that = this;
      // this.list = [...this.list, { type: "mine", content: this.contentText }]; //通过type字段进行区分是自己（mine）发的还是系统（robot）返回的
      that.ws.send(that.contentText);
    },
    initWebSocket() {
      let that = this;
      if (window.WebSocket) {
        let ws = new WebSocket("ws://192.168.0.115:8181");
        that.ws = ws;
        ws.onopen = function(e) {
          //往服务器发送数据
          console.log("连接服务器成功");
        };
        ws.onclose = function(e) {
          console.log("服务器关闭");
        };
        ws.onerror = function() {
          console.log("服务器出错");
        };
        ws.onmessage = function(e) {
          //接收服务器返回的数据
          console.log(e);
          let resData = JSON.parse(e.data);
          if (resData.funName == "userCount") {
            that.count = resData.users;
          }else{
           that.list = [...that.list, { content: e.data }]; 
          }
          
        };
      }
    }
  }
};
</script>
 
<style scoped >
</style>