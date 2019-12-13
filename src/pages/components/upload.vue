<template>
	<div class="audit-upload">
		<el-upload
				accept="image/jpeg,image/jpg,image/png,image/pdf,image/gif"
				list-type="picture-card"
				:action="actionURL"
				:limit="limit"
				:file-list="fileList"
				:on-success="handleSuccess"
				:data="otherParam"
				:before-upload="checkSize"
				:on-preview="handlePictureCardPreview"
				:on-remove="handleRemove"
				:before-remove="handlePicRemove"
				:disabled="disabled"
				:class="limit === 1 && imgUrl || (limit > 1 && imgUrl.length > limit - 1) ? 'upload-view' : ''">
			<i class="el-icon-plus"></i>
		</el-upload>
		<el-dialog :visible.sync="dialogVisible">
			<img width="100%" :src="dialogImageUrl" alt="">
		</el-dialog>
	</div>
</template>

<script>
  import API from '@/constant/API';

  export default {
    name: "PtUpload",
    props: {
      applyId: [Number, String],
      imgUrl: [String, Array],
      fieldId: [Number, String],
      fileCategory: String,
      limit: {
        type: Number,
        default: 1
      },
      usePreview: {//是否使用自带的预览弹窗
        type: Boolean,
        default: true
      },
      businessTypeProp: String,
      disabled: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        actionURL: '',
        otherParam: {},
        dialogImageUrl: '',
        dialogVisible: false,
        fileList: []
      }
    },
    computed: {
      businessType() {
        return this.businessTypeProp || this.$enum.ApplyLoanBusinessType
      }
    },
    watch:{
      'imgUrl'(val){
        this.updateFileList(val);
      }
    },
    created() {
      this.initUpload();
      this.updateFileList(this.imgUrl);
    },
    methods: {
      updateFileList(val) {
        if (this.limit === 1) {
          if (!val) {
            this.fileList = []
          } else {
            this.fileList = [{name: 'test.jpeg', url: val, response: {body: val}}]
          }
        } else {
          if (val.length) {
            if (!this.fileList.length) {
              this.fileList = [];
              val.forEach((ele) => {
                this.fileList.push({url: ele, response: {body: ele}})
              });
            } else {
              this.fileList = this.fileList.filter(ele => {
                return val.includes(ele.response.body)
              });
            }
          } else {
            this.fileList = []
          }
        }
      },
      initUpload() {
        //请求路径
        let hostUrl = window.location.protocol + "//" + window.location.host;
        this.actionURL = hostUrl + API.COMMON.UPLOAD;
        //额外参数
        this.otherParam.businessType = this.businessType;
        this.applyId ? this.otherParam.applyId = this.applyId : '';
        this.fieldId ? this.otherParam.fieldId = this.fieldId : '';
        this.otherParam.fileCategory = this.fileCategory || null;
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
      },
      handleSuccess(res, fileList) {
        if (res.code === "200") {
          this.fileList.push(fileList);
          this.$emit("success", res.body)
        } else {
          this.$message(res.message);
        }
      },

      handlePicRemove(file) {
        this.$confirm('确认要执行删除操作吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
         this.handleRemove(file)
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
        return false
      },

      handleRemove(file) {
        if (this.limit === 1) {
          this.$emit("success", '')
		} else {
          this.$emit("remove", file.response.body)
		}
      },
      handlePictureCardPreview(file) {
        if (this.usePreview) {
          this.dialogImageUrl = file.url;
          this.dialogVisible = true;
        } else {
          this.$emit('preview', file.response.body);
        }
      }
    }
  }
</script>

<style lang="scss" scope>
	.el-upload--picture-card {
		background-color: #fbfdff;
		border: 1px dashed #c0ccda;
		border-radius: 6px;
		-webkit-box-sizing: border-box;
		box-sizing: border-box;
		width: 100px;
		height: 50px;
		line-height: 56px;
		vertical-align: top;
	}
	.el-upload-list--picture-card .el-upload-list__item {
		overflow: hidden;
		background-color: #fff;
		border: 1px solid #c0ccda;
		border-radius: 6px;
		-webkit-box-sizing: border-box;
		box-sizing: border-box;
		width: 100px;
		height: 50px;
		margin: 0 8px 8px 0;
		display: inline-block;
		&.is-uploading{
			background-color: #0000009f;
			.el-progress{
				display: none;
			}
			&:after{
				content: '';
				width: 20px;
				height: 20px;
				margin: 12px 35px;
				border-radius: 100%;
				border: 2px solid #409eff;
				border-bottom-color: transparent;
				display: inline-block;
				animation: rotate 1s linear infinite;
			}
		}
	}
	.el-upload-list--picture-card .el-upload-list__item-actions {
		position: absolute;
		width: 100px;
		height: 50px;
		left: 0;
		top: 0;
		cursor: default;
		text-align: center;
		color: #fff;
		opacity: 0;
		font-size: 20px;
		background-color: rgba(0, 0, 0, .5);
		transition: opacity .3s;
	}
	.el-upload-list__item .el-icon-close-tip {
		display:none !important;
	}

	@keyframes rotate {
		0% {
			transform: rotate(0deg);
		}
		50% {
			transform: rotate(180deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}
</style>

