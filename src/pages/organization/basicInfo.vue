<template>
    <el-form>
        <el-form :model="info" label-width="150px" ref="info" disabled>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="机构编号" prop="name">
                        <el-row>
                            <el-col :span="13"><el-input v-model.trim="info.name"></el-input></el-col>
                        </el-row>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="机构名称" prop="name">
                        <el-row>
                            <el-col :span="13"><el-input v-model.trim="info.name"></el-input></el-col>
                        </el-row>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="公司全称" prop="name">
                        <el-row>
                            <el-col :span="13"><el-input v-model.trim="info.name"></el-input></el-col>
                        </el-row>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="公司简称" prop="name">
                        <el-row>
                            <el-col :span="13"><el-input v-model.trim="info.name"></el-input></el-col>
                        </el-row>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="联系电话" prop="name">
                        <el-row>
                            <el-col :span="13"><el-input v-model.trim="info.name"></el-input></el-col>
                        </el-row>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="邮政编码" prop="name">
                        <el-row>
                            <el-col :span="13"><el-input v-model.trim="info.name"></el-input></el-col>
                        </el-row>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="企业规模" prop="name">
                        <el-row>
                            <el-col :span="13"><el-input v-model.trim="info.name"></el-input></el-col>
                        </el-row>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="企业网址" prop="name">
                        <el-row>
                            <el-col :span="13"><el-input v-model.trim="info.name"></el-input></el-col>
                        </el-row>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-form-item label="办公地址" prop="name">
                <el-row>
                    <el-col :span="19"><el-input v-model.trim="info.name"></el-input></el-col>
                </el-row>
            </el-form-item>
            <el-form-item label="工商logo" prop="name">
                <span class="logo-tip">建议宽高比大于等于 3:1，透明或白色背景</span>
                <img src="" alt="公司logo">
            </el-form-item>
        </el-form>
    </el-form>
</template>

<script>
  export default {
    name: 'basicInfo',
    props: {
      info: Object
    },
    data() {
      return {

      }
    }
  }
</script>

<style scoped>
    .logo-tip{
        display: block;
        color: #909399;
    }
</style>