<template>
  <div class="channel-upload">
    <template v-if="!imgUrl">
      <p v-if="!isCheck">{{uploadTitle}}</p>
      <input type="file" @change="changeFile" :disabled="isCheck">
    </template>
    <template v-else>
      <div class="upload-operate" v-if="!isCheck">
        <el-button type="text" icon="el-icon-delete" @click="removeFile" class="remove"></el-button>
      </div>
      <img :src="imgUrl" class="avatar">
    </template>
  </div>

</template>

<script>
  export default {
    name: "ChannelUpload",
    props: {
      uploadTitle: String,
      isCheck: Boolean,
      imgUrl: String,
      fileCategory: String
    },
    data() {
      return {
        actionURL: '',
        otherParam: {}
      }
    },
    methods: {
      changeFile(e) {
        let file = e.target.files[0];
        if (file && this.checkSize(file) !== false) {
          this.$emit('success', {
            file: file,
            image: URL.createObjectURL(file)
          });
        } else {
          this.removeFile()
        }
      },
      removeFile() {
        this.$emit('success', {
          file: '',
          image: ''
        });
      },
      checkSize(file) {
        //检查上传文件的大小和格式
        if (file.size / 1024 / 1024 > 10) {
          this.$message("图片过大，不应超过10M");
          return false;
        }
        if (
          file.type !== "image/jpeg" &&
          file.type !== "image/jpg" &&
          file.type !== "image/png" &&
          file.type !== "image/bmp" &&
          file.type !== "image/gif"
        ) {
          this.$message("图片格式不正确");
          return false;
        }
      }
    }
  }
</script>

<style lang="scss">
  .channel-upload {
    position: relative;
    display: inline-block;
    width: 200px;
    height: 150px;
    background: url(../../assets/idCardDefault.png) no-repeat;
    vertical-align: top;
    &:hover {
      background: url(../../assets/idCardHover.jpg) no-repeat;
      .cropper {
        img {
          display: block;
          height: 140px;
        }
      }
    }
    .avatar-uploader {
      text-align: initial;
    }
    p {
      font-size: 14px;
      color: #4c4a50;
      position: absolute;
      margin-top: 95px;
      line-height: 24px;
      width: 100%;
      text-align: center;
    }
    input {
      width: 200px;
      height: 140px;
      opacity: 0;
      position: absolute;
      z-index: 99;
      &:disabled{
        cursor: not-allowed;
      }
    }
    .upload-operate {
      position: absolute;
      top: 0;
      width: 200px;
      height: 140px;
      .remove{
        display: none;
        color: #fff;
        font-size: 20px;
      }
      &:hover{
        background: rgba(0, 0, 0, .5);
        display: flex;
        align-items: center;
        justify-content: center;
        .remove{
          display: inline-block;
        }
      }
    }
  }

  .avatar {
    width: 200px;
    height: 140px;
  }
</style>
