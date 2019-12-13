<template>
    <el-form>
        <el-form :model="info" label-width="150px" ref="info" disabled>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="组织机构代码" prop="name">
                        <el-row>
                            <el-col :span="13"><el-input v-model.trim="info.name"></el-input></el-col>
                        </el-row>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="注册号" prop="name">
                        <el-row>
                            <el-col :span="13"><el-input v-model.trim="info.name"></el-input></el-col>
                        </el-row>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="经营状态" prop="name">
                        <el-row>
                            <el-col :span="13"><el-input v-model.trim="info.name"></el-input></el-col>
                        </el-row>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="所属行业" prop="name">
                        <el-row>
                            <el-col :span="13"><el-input v-model.trim="info.name"></el-input></el-col>
                        </el-row>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="公司类型" prop="name">
                        <el-row>
                            <el-col :span="13"><el-input v-model.trim="info.name"></el-input></el-col>
                        </el-row>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="成立时间" prop="name">
                        <el-row>
                            <el-col :span="13"><el-input v-model.trim="info.name"></el-input></el-col>
                        </el-row>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="营业期限" prop="name">
                        <el-row>
                            <el-col :span="13"><el-input v-model.trim="info.name"></el-input></el-col>
                        </el-row>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="发证时间" prop="name">
                        <el-row>
                            <el-col :span="13"><el-input v-model.trim="info.name"></el-input></el-col>
                        </el-row>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="登记机关" prop="name">
                        <el-row>
                            <el-col :span="13"><el-input v-model.trim="info.name"></el-input></el-col>
                        </el-row>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="注册资本" prop="name">
                        <el-row>
                            <el-col :span="13"><el-input v-model.trim="info.name"></el-input></el-col>
                        </el-row>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-form-item label="企业地址" prop="name">
                <el-row>
                    <el-col :span="19"><el-input v-model.trim="info.name"></el-input></el-col>
                </el-row>
            </el-form-item>
            <el-form-item label="经营范围" prop="name">
                <el-row>
                    <el-col :span="19"><el-input v-model.trim="info.name"></el-input></el-col>
                </el-row>
            </el-form-item>
        </el-form>
    </el-form>
</template>

<script>
  export default {
    name: 'businessInfo',
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