<template>
  <div class="pt-search">
    <el-form :inline="true" :label-width="labelWidth + 'px'" @keyup.enter.native="handleKeyUpEnter" class="pb_15">
      <template v-for="(item ,index) in items">

        <el-form-item v-if="item.type==='buttonGroup' && !item.hidden" :key="index+item.type" :label="item.label || ' '" :class="{'small-label': labelWidth > 100}">
          <el-button
            v-for="(button,index) in item.buttons"
            :key="index"
            :disabled="button.disabled"
            :type="button.type"
            :icon="button.icon"
            @click="button.function"
          >{{button.label}}
          </el-button>
        </el-form-item>

        <el-form-item v-if="item.type==='rightButtonGroup' && !item.hidden" :key="index+item.type" :label="item.label || ' '" class="right-button-operation">
          <el-button
                  v-for="(button,index) in item.buttons"
                  :key="index"
                  :disabled="button.disabled"
                  :type="button.type"
                  :icon="button.icon"
                  v-show="!button.hidden"
                  @click="button.function"
          >{{button.label}}
          </el-button>
        </el-form-item>
        <template v-else-if="item.type==='dataTime' && !item.hidden">

          <el-form-item :key="index+item.dataTime.start.key" :label="item.dataTime.start.label || ' '">
            <el-date-picker
                    :disabled="item.dataTime.start.disabled"
                    :editable="false"
                    class="value-width"
                    type="date"
                    format="yyyy-MM-dd"
                    value-format="yyyy-MM-dd"
                    v-model.trim="params[item.dataTime.start.key]"
                    :placeholder="item.dataTime.start.placeholder||('请选择'+item.dataTime.start.label)"
                    :picker-options="startPicker(item.dataTime.end.key,' 23:59:59')"
                    @change="(value)=>handleChangeValue(item.dataTime.start.key,value)">
            </el-date-picker>
          </el-form-item>

          <el-form-item :key="index+item.dataTime.end.key" :label="item.dataTime.end.label || ' '">
            <el-date-picker
                    :disabled="item.dataTime.end.disabled"
                    :editable="false"
                    class="value-width"
                    type="date"
                    format="yyyy-MM-dd"
                    value-format="yyyy-MM-dd"
                    v-model.trim="params[item.dataTime.end.key]"
                    :placeholder="item.dataTime.end.placeholder||('请选择'+item.dataTime.end.label)"
                    :picker-options="endPicker(item.dataTime.start.key, ' 00:00:00')"
                    @change="(value)=>handleChangeValue(item.dataTime.end.key,value)">
            </el-date-picker>
          </el-form-item>

        </template>
        <template v-else-if="item.type==='dateRange' && !item.hidden">

          <el-form-item :key="index+item.dateRange.start.key" :label="item.dateRange.start.label || ' '">
            <el-date-picker
                    :disabled="item.dateRange.start.disabled"
                    :editable="false"
                    class="value-width"
                    type="date"
                    format="yyyy-MM-dd"
                    value-format="yyyy-MM-dd"
                    v-model.trim="params[item.dateRange.start.key]"
                    :placeholder="item.dateRange.start.placeholder||('请选择'+item.dateRange.start.label)"
                    :picker-options="startDatePicker(item.dateRange.end.key,' 23:59:59')"
                    @change="(value)=>handleChangeValue(item.dateRange.start.key,value)">
            </el-date-picker>
          </el-form-item>

          <el-form-item :key="index+item.dateRange.end.key" :label="item.dateRange.end.label || ' '">
            <el-date-picker
                    :disabled="item.dateRange.end.disabled"
                    :editable="false"
                    class="value-width"
                    type="date"
                    format="yyyy-MM-dd"
                    value-format="yyyy-MM-dd"
                    v-model.trim="params[item.dateRange.end.key]"
                    :placeholder="item.dateRange.end.placeholder||('请选择'+item.dateRange.end.label)"
                    :picker-options="endDatePicker(item.dateRange.start.key, ' 00:00:00')"
                    @change="(value)=>handleChangeValue(item.dateRange.end.key,value)">
            </el-date-picker>
          </el-form-item>

        </template>
        <template v-else-if="item.type==='dateRange' && !item.hidden">

          <el-form-item :key="index+item.dateRange.start.key" :label="item.dateRange.start.label || ' '">
            <el-date-picker
              :disabled="item.dateRange.start.disabled"
              :editable="false"
              class="value-width"
              type="date"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              v-model.trim="params[item.dateRange.start.key]"
              :placeholder="item.dateRange.start.placeholder||('请选择'+item.dateRange.start.label)"
              :picker-options="startDatePicker(item.dateRange.end.key,' 23:59:59')"
              @change="(value)=>handleChangeValue(item.dateRange.start.key,value)">
            </el-date-picker>
          </el-form-item>

          <el-form-item :key="index+item.dateRange.end.key" :label="item.dateRange.end.label || ' '">
            <el-date-picker
              :disabled="item.dateRange.end.disabled"
              :editable="false"
              class="value-width"
              type="date"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              v-model.trim="params[item.dateRange.end.key]"
              :placeholder="item.dateRange.end.placeholder||('请选择'+item.dateRange.end.label)"
              :picker-options="endDatePicker(item.dateRange.start.key, ' 00:00:00')"
              @change="(value)=>handleChangeValue(item.dateRange.end.key,value)">
            </el-date-picker>
          </el-form-item>

        </template>

        <template v-else-if="item.type==='dateTimeRange' && !item.hidden">

          <el-form-item :key="index+item.dateTimeRange.start.key" :label="item.dateTimeRange.start.label || ' '">
            <el-date-picker
              :disabled="item.dateTimeRange.start.disabled"
              :editable="false"
              class="value-width"
              type="datetime"
              format="yyyy-MM-dd HH:mm:ss"
              value-format="yyyy-MM-dd HH:mm:ss"
              v-model.trim="params[item.dateTimeRange.start.key]"
              :placeholder="item.dateTimeRange.start.placeholder||('请选择'+item.dateTimeRange.start.label)"
              :picker-options="startDatePicker(item.dateTimeRange.end.key,' 23:59:59')"
              @change="(value)=>handleChangeValue1(item.dateTimeRange.start.key,item.dateTimeRange.end.key,value)">
            </el-date-picker>
          </el-form-item>

          <el-form-item :key="index+item.dateTimeRange.end.key" :label="item.dateTimeRange.end.label || ' '">
            <el-date-picker
              :disabled="item.dateTimeRange.end.disabled"
              :editable="false"
              class="value-width"
              type="datetime"
              format="yyyy-MM-dd HH:mm:ss"
              value-format="yyyy-MM-dd HH:mm:ss"
              v-model.trim="params[item.dateTimeRange.end.key]"
              :placeholder="item.dateTimeRange.end.placeholder||('请选择'+item.dateTimeRange.end.label)"
              :picker-options="endDatePicker(item.dateTimeRange.start.key,' 00:00:00')"
              @change="(value)=>handleChangeValue1(item.dateTimeRange.start.key,item.dateTimeRange.end.key,value)">
            </el-date-picker>
          </el-form-item>

        </template>

        <el-form-item v-else-if="!item.hidden" :key="index" :label="item.label || ' '">

          <template v-if="item.type==='input'">
            <el-input
              clearable
              :disabled="item.disabled"
              class="value-width"
              v-model.trim="params[item.key]"
              :placeholder="item.placeholder||('请输入'+item.label)"
              @change="(value)=>handleChangeValue(item.key,value)">
            </el-input>
          </template>

          <template v-else-if="item.type==='select'">
            <el-select
              clearable
              :filterable = "item.filterable"
              :disabled="item.disabled"
              class="value-width"
              v-model.trim="params[item.key]"
              :placeholder="item.placeholder||('请选择'+item.label)"
              @change="(value)=>handleChangeValue(item.key,value)"
              v-if="!item.hidden">
              <el-option v-for="(option,index) in item.options" :key="index" :label="option.text" :value="option.value"></el-option>
            </el-select>
          </template>

          <template v-else-if="item.type==='date'">
            <el-date-picker
              :disabled="item.disabled"
              :editable="false"
              class="value-width"
              type="date"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              v-model.trim="params[item.key]"
              :placeholder="item.placeholder||('请选择'+item.label)"
              @change="(value)=>handleChangeValue(item.key,value)">
            </el-date-picker>
          </template>

          <template v-else-if="item.type==='datetime'">
            <el-date-picker
              :disabled="item.disabled"
              :editable="false"
              class="value-width"
              type="datetime"
              format="yyyy-MM-dd HH:mm:ss"
              value-format="yyyy-MM-dd HH:mm:ss"
              v-model.trim="params[item.key]"
              :placeholder="item.placeholder||('请选择'+item.label)"
              @change="(value)=>handleChangeValue(item.key,value)">
            </el-date-picker>
          </template>

        </el-form-item>
      </template>
    </el-form>
  </div>
</template>

<script>
  export default {
    props: {
      items: Array,
      params: Object,
      labelWidth: {
        type: Number,
        default: 100
      }
    },
    mounted() {
    },
    data() {
      return {value6: ''}
    },
    watch: {},
    methods: {
      handleKeyUpEnter() {
        if (document.activeElement.parentElement.className !== 'el-input el-pagination__editor is-in-pagination') {
          this.$emit("on-keyup-enter");
        }
      },
      startPicker(key, defTime) {
        let self = this;
        return {
          disabledDate(time) {
            if (self.params[key] && typeof self.params[key].replace !== 'function') {
              return  time.getTime() > self.params[key].getTime() || time.getTime() > Date.now()
            }else if(self.params[key]) {
              return time.getTime() > new Date(self.params[key].replace(/[0-9]{2}:[0-9]{2}:[0-9]{2}/, "") + defTime).getTime() || false;
            } else {
              return false
            }
          }
        }
      },
      endPicker(key, defTime) {
        let self = this;
        return {
          disabledDate(time) {
            if (self.params[key] && typeof self.params[key].replace !== 'function') {
              return self.params[key].getTime() > time.getTime() || time.getTime() > Date.now();
            } else if(self.params[key]){
              return new Date(self.params[key].replace(/[0-9]{2}:[0-9]{2}:[0-9]{2}/, "") + defTime).getTime() > time.getTime() || false;
            }else{
              return false
            }
          }
        }
      },
      startDatePicker(key, defTime) {
        let self = this;
        return {
          disabledDate(time) {
            if (self.params[key] && typeof self.params[key].replace !== 'function') {
                return  time.getTime() > self.params[key].getTime() || time.getTime() > Date.now()
            }else if(self.params[key]) {
                return time.getTime() > new Date(self.params[key].replace(/[0-9]{2}:[0-9]{2}:[0-9]{2}/, "") + defTime).getTime() || time.getTime() > Date.now();
            } else {
              return time.getTime() > Date.now();
            }
          }
        }
      },
      endDatePicker(key, defTime) {
        let self = this;
        return {
          disabledDate(time) {
            if (self.params[key] && typeof self.params[key].replace !== 'function') {
               return self.params[key].getTime() > time.getTime() || time.getTime() > Date.now();
            } else if(self.params[key]){
             return new Date(self.params[key].replace(/[0-9]{2}:[0-9]{2}:[0-9]{2}/, "") + defTime).getTime() > time.getTime() || time.getTime() > Date.now();
            }else{
                return time.getTime() > Date.now();
            }
          }
        }
      },
      handleChangeValue(key, val) {
        if (val === '' || val === null || val === 'null' || val === 'NULL' || val === 'undefined' || val === undefined) {
          delete this.params[key];
        }
      },
      handleChangeValue1(startKey, endKey, val) {

        if (this.params[endKey] && new Date(this.params[endKey]).getTime() > Date.now()) {
          this.params[endKey] = this.timeFormat(new Date());
        }

        if (this.params[startKey] && new Date(this.params[startKey]).getTime() > Date.now()) {
          this.params[startKey] = this.timeFormat(new Date());
        }

        if (this.params[startKey] && this.params[endKey] && new Date(this.params[startKey]).getTime() > new Date(this.params[endKey]).getTime()) {
          this.params[startKey] === val ? this.params[endKey] = this.params[startKey] : this.params[startKey] = this.params[endKey];
        }

      },
      timeFormat(date) {
        let format = 'yyyy-MM-dd hh:mm:ss';

        const info = {
          "M+": date.getMonth() + 1, //month
          "d+": date.getDate(),    //day
          "h+": date.getHours(),   //hour
          "m+": date.getMinutes(), //minute
          "s+": date.getSeconds(), //second
        };

        if (/(y+)/.test(format)) format = format.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (const key in info) {
          if (new RegExp("(" + key + ")").test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length === 1 ? info[key] : ("00" + info[key]).substr(("" + info[key]).length));
          }
        }
        return format;
      }
    }
  }
</script>

<style lang="scss">
  .pt-search {
    background: #F6F7FB;
    padding-top: 15px;
    overflow: hidden;
    .value-width {
      width: 220px !important;
    }
    .pb_15 {
      padding-bottom: 15px;
    }
    .el-form-item {
      margin: 0 5px 10px 0;
      &.small-label{
        label{
          width: 30px!important;
        }
      }
      &.right-button-operation{
        float: right;
        margin-right: 25px;
        label{
          width: 0!important;
        }
      }
    }
    .show-more {
      text-align: center;
      width: 100%;
      height: 15px;
      margin-top: -10px;
      .more {
        display: inline-block;
        width: 10px;
        height: 10px;
      }
    }
  }
</style>
