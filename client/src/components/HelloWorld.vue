<template>
  <div class="test3">
    <div class="chat-box">
      <p>在线人数：{{count}}</p>
      <div class="msg">
        <div v-for="(i,index) in list" :key="index">
          <p>{{i.userId}}:{{i.content}}</p>
        </div>
      </div>
      <div class="input-group">
        <input type="text" v-model="contentText" />
        <button @click="sendText">发送</button>
      </div>
    </div>
  </div>
</template>
 
<script>
export default {
  data() {
    return {
      ws: null,
      count: 0,
      userId: null, //当前用户ID
      list: [], //聊天记录的数组
      contentText: "" //input输入的值
    };
  },
  created() {
    this.getUserID();
  },
  mounted() {
    this.initWebSocket();
  },
  methods: {
    //根据时间戳作为当前用户ID
    getUserID() {
      let time = new Date();
      this.userId = time;
    },
    //发送聊天信息
    sendText() {
      let _this = this;
      let params = {
        userId: _this.userId,
        msg: _this.contentText
      };
      _this.ws.send(JSON.stringify(params)); //调用WebSocket send()发送信息的方法
    },
    //进入页面创建websocket连接
    initWebSocket() {
      let _this = this;
      //判断页面有没有存在websocket连接
      if (window.WebSocket) {
        // 192.168.0.115 是我本地IP地址 此处的 :8181 端口号 要与后端配置的一致
        let ws = new WebSocket("ws://192.168.0.115:8181");
        _this.ws = ws;
        ws.onopen = function(e) {
          console.log("服务器连接成功");
        };
        ws.onclose = function(e) {
          console.log("服务器连接关闭");
        };
        ws.onerror = function() {
          console.log("服务器连接出错");
        };
        ws.onmessage = function(e) {
          //接收服务器返回的数据
          let resData = JSON.parse(e.data);
          if (resData.funName == "userCount") {
            _this.count = resData.users;
          } else {
            _this.list = [
              ..._this.list,
              { userId: resData.userId, content: resData.msg }
            ];
          }
        };
      }
    }
  }
};
</script>
 
<style lang="scss" scoped>

</style>