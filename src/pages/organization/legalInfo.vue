<template>
    <el-form>
        <el-form :model="info" label-width="150px" ref="info" disabled>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="姓名" prop="name">
                        <el-row>
                            <el-col :span="13"><el-input v-model.trim="info.name"></el-input></el-col>
                        </el-row>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="手机号码" prop="name">
                        <el-row>
                            <el-col :span="13"><el-input v-model.trim="info.name"></el-input></el-col>
                        </el-row>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="证件类型" prop="name">
                        <el-row>
                            <el-col :span="13"><el-input v-model.trim="info.name"></el-input></el-col>
                        </el-row>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="证件号码" prop="name">
                        <el-row>
                            <el-col :span="13"><el-input v-model.trim="info.name"></el-input></el-col>
                        </el-row>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-form-item label="家庭住址" prop="name">
                <el-row>
                    <el-col :span="19"><el-input v-model.trim="info.name"></el-input></el-col>
                </el-row>
            </el-form-item>
            <el-form-item label="户籍住址" prop="name">
                <el-row>
                    <el-col :span="19"><el-input v-model.trim="info.name"></el-input></el-col>
                </el-row>
            </el-form-item>
            <el-form-item label="证件照片" prop="name">
                <img src="" alt="">
                <img src="" alt="">
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