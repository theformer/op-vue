<template>
	<div class="container">
		<el-form :model="info" label-width="150px" ref="info">
			<el-row>
				<el-col :span="12">
					<el-form-item label="机构名称" prop="name">
						<el-row>
							<el-col :span="13">
								<el-input v-model.trim="info.name" disabled></el-input>
							</el-col>
						</el-row>
					</el-form-item>
					<el-form-item label="机构联系人姓名" prop="name">
						<el-row>
							<el-col :span="13">
								<el-input v-model.trim="info.name" disabled></el-input>
							</el-col>
						</el-row>
					</el-form-item>
					<el-form-item label="机构联系人手机号" prop="name">
						<el-row>
							<el-col :span="13">
								<el-input v-model.trim="info.name" disabled></el-input>
							</el-col>
						</el-row>
					</el-form-item>

				</el-col>
				<el-col :span="12" class="qeCode-wrap">
					<div id="qrCode"></div>
					<span v-for="item in qrCodes" :key="item.id" class="qrCode-container">
						<img :src="item.qrcodeUrl" alt="">
						<el-button type="primary" @click="handleDownloadQrCode(item)" :loading="item.loading" :disabled="item.loading">保存图片</el-button>
                    </span>
				</el-col>
			</el-row>
		</el-form>

		<el-tabs type="border-card">
			<el-tab-pane label="基本信息">
				<basic-info :info="info"></basic-info>
			</el-tab-pane>
			<el-tab-pane label="法人代表信息">
				<legal-info :info="info"></legal-info>
			</el-tab-pane>
			<el-tab-pane label="工商信息">
				<business-info :info="info"></business-info>
			</el-tab-pane>
			<el-tab-pane label="相关证件">
				<certificate-info :info="info"></certificate-info>
			</el-tab-pane>
		</el-tabs>
	</div>
</template>

<script>
  import basicInfo from './basicInfo'
  import legalInfo from './legalInfo'
  import businessInfo from './businessInfo'
  import certificateInfo from './certificateInfo'
  import {qrcode, downloadQrcode} from '@/service/organization/organization'
  import {Loading} from "element-ui";

  export default {
    name: "info",
    components: {basicInfo, legalInfo, businessInfo, certificateInfo},
    data() {
      return {
        info: {},
        loading: false,
        qrCodes: [],
      }
    },
    created() {
      this.getOrganiCode()
    },
    methods: {
      //获取机构二维码
      getOrganiCode() {
        this.qrCodes = [];
        let loading;
        this.$nextTick(() => {
          loading = Loading.service({
            target: document.querySelector('#qrCode'),
            lock: true,
            text: '二维码生成中',
            spinner: 'el-icon-loading'
          });
        });
        qrcode().then(res => {
          if (res.code === '200') {
            if (res.body && res.body.length) {
              res.body.forEach(ele => {
                ele['loading'] = false;
              })
              this.qrCodes = res.body;
            }
          }
        }).finally(() => {
          loading.close();
        })
      },
      // 下载二维码
      handleDownloadQrCode(item) {
        item.loading = true;
        downloadQrcode({url: item.qrcodeUrl}).then(res => {
          let arr = item.qrcodeUrl.split('?')[0].split('/');
          let fileName = arr[arr.length - 1];
          let src = 'data:image/jpg;base64,' + btoa(new Uint8Array(res).reduce((data, byte) => data + String.fromCharCode(byte), ''));
          this.$downloadFile(src, fileName, 'image/jpg');
        }).finally(() => {
          item.loading = false;
        })
      },
    },

  }
</script>

<style scoped lang="scss">
	.container {
		padding: 30px;
	}

	.qeCode-wrap{
		position: relative;
		top: -20px;
	}

	.qrCode-container {
		width: 190px;
		padding: 5px;
		display: inline-block;
		text-align: center;
		img {
			width: 100%;
			height: 100%;
		}
		.el-button {
			width: 75%;
		}
	}

</style>