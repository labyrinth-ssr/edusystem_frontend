<template>
  <div class="el-quarter-picker">
    <el-popover
        v-model="visible"
        :disabled="!canPopover"
        :tabindex="null"
        placement="bottom-start"
        transition="el-zoom-in-top"
        trigger="click">

      <div class="el-date-picker">
        <div class="el-picker-panel__body">
          <div class="el-date-picker__header el-date-picker__header--bordered" style="margin:0px; line-height:30px">
            <button
                type="button"
                @click="clickLast"
                aria-label="前一年"
                class="el-picker-panel__icon-btn el-date-picker__prev-btn el-icon-d-arrow-left"></button>
            <span role="button" class="el-date-picker__header-label" @click="clickYear">{{ title }}</span>
            <button
                type="button"
                @click="clickNext"
                aria-label="后一年"
                class="el-picker-panel__icon-btn el-date-picker__next-btn el-icon-d-arrow-right"></button>
          </div>
          <div class="el-picker-panel__content" style="margin:0px; width:100%">
            <table class="el-month-table" style="">
              <tbody>
              <tr v-for="line in lineCount" :key="line">
                <td v-for="index in (line * 4 <= viewList.length ? 4 : viewList.length - (line - 1) * 4)" :key="index" :class="{ today: viewList[(line - 1) * 4 + index - 1].current, current: viewList[(line - 1) * 4 + index - 1].active }">
                  <div><a class="cell" @click="clickItem(viewList[(line - 1) * 4 + index - 1])">{{ viewList[(line - 1) * 4 + index - 1].label }}</a></div>
                </td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <el-input
          slot="reference"
          @change="changeText"
          @mouseenter.native="mouseEnter"
          @mouseleave.native="mouseLeave"
          :placeholder="placeholder"
          v-model="text"
          :size="size"
          :readonly="!canEdit"
          :disabled="disabled">
        <i slot="prefix" class="el-input__icon el-icon-date"></i>
        <i slot="suffix" class="el-input__icon el-icon-circle-close" v-show="showClear" style="cursor:pointer" @click.stop="clear"></i>
      </el-input>
    </el-popover>
  </div>
</template>

<script>
export default {
  name: 'ElQuarterPicker',
  props: {
    placeholder: {
      type: String,
      default: ''
    },
    size: {
      type: String,
      default: ''
    },
    readonly: {
      type: Boolean,
      default: false
    },
    clearable: {
      type: Boolean,
      default: true
    },
    editable: {
      type: Boolean,
      default: true
    },
    disabled: {
      type: Boolean,
      default: false
    },
    format: {
      type: String,
      default: 'yyyy年第Q学期'
    },
    valueFormat: {
      type: String,
      default: 'yyyy-qq'
    },
    value: {
      type: String,
      default: ''
    }
  },
  model: {
    prop: 'value',
    event: 'change'
  },
  watch: {
    value(val) {
      // console.log('change-------', val)
      this.changeValue(val)
    },
    readonly(val) {
      this.canEdit = !val && this.editable
      this.canPopover = !this.disabled && !val
    },
    editable(val) {
      this.canEdit = !this.readonly && val
    },
    disabled(val) {
      this.canPopover = !val && !this.readonly
    }
  },
  data() {
    return {
      visible: false,
      showClear: false, // 控制清空按钮展示
      canEdit: true, // 是否可编辑
      canPopover: true, // 选择器弹出是否可用
      text: '', // 文本框值
      viewType: 1, // 视图类型，1季度，2年度
      viewYear: 0, // 当前年份
      viewList: [], // 数据列表
      lineCount: 0, // 数据行数
      title: '', // 选择器标题
      data: [0, 0] // 当前选择年度-季度
    }
  },
  mounted() {
    // console.log('mounted--------', this.value)
    this.changeValue(this.value)

    // 设置文本框是否可编辑
    this.canEdit = !this.readonly && this.editable
    this.canPopover = !this.disabled && !this.readonly

    // 监听按键(上下左右键可以切换季度)
    document.onkeydown = (event) => {
      if (this.visible) {
        const data = [this.data[0], this.data[1]]
        if (data[0] < 1 || data[1] < 1) {
          // 以当前季度为标准
          const curDate = new Date()
          data[0] = curDate.getFullYear()
          data[1] = parseInt(curDate.getMonth() / 3) + 1
        }
        if (event.code === 'ArrowLeft') {
          // 上一个季度
          if (data[1] === 1) {
            data[0] = data[0] - 1
            data[1] = 4
          } else {
            data[1] = data[1] - 1
          }
        } else if (event.code === 'ArrowRight') {
          // 下一个季度
          if (data[1] === 4) {
            data[0] = data[0] + 1
            data[1] = 1
          } else {
            data[1] = data[1] + 1
          }
        } else if (event.code === 'ArrowUp') {
          // 上一年季度
          data[0] = data[0] - 1
        } else if (event.code === 'ArrowDown') {
          // 下一年季度
          data[0] = data[0] + 1
        } else {
          return
        }

        // 超过年限的不处理
        if (data[0] < 1000 || data[0] > 9999) {
          return
        }
        this.data = data
        this.viewType = 1
        this.viewYear = data[0]
        this.$emit('change', this.formatTo(data, this.valueFormat))
      }
    }
  },
  destroyed() {
    document.onkeydown = null
  },
  methods: {
    // 季度文本变更
    changeText() {
      if (this.checkFormat(this.format, this.text)) {
        // 设置值
        this.formatFrom(this.text, this.format)
        this.$emit('change', this.formatTo(this.data, this.valueFormat))
      } else {
        // 输入了无效的格式，还原回原来的值
        if (this.data[0] < 1 || this.data[1] < 1) {
          this.text = ''
        } else {
          this.text = this.formatTo(this.data, this.format)
        }
      }
      this.visible = false
    },
    // 鼠标进入
    mouseEnter() {
      if (!this.disabled && !this.readonly && this.clearable && this.text !== '') {
        this.showClear = true
      }
    },
    // 鼠标离开
    mouseLeave() {
      if (!this.disabled && this.clearable) {
        this.showClear = false
      }
    },
    // 清除季度
    clear() {
      this.showClear = false
      this.visible = false
      this.$emit('change', '')
    },
    // 季度值变更
    changeValue(val) {
      this.viewType = 1
      if (val) {
        // 反向格式化
        this.formatFrom(val, this.valueFormat)
        this.text = this.formatTo(this.data, this.format)
        this.viewYear = this.data[0]
      } else {
        this.text = ''
        this.data = [0, 0]
        this.viewYear = new Date().getFullYear()
      }
      this.initView()
    },
    // 初始化视图数据
    initView() {
      const list = []
      const curDate = new Date()
      const curYear = curDate.getFullYear()
      const curQuarter = parseInt(curDate.getMonth() / 3) + 1
      if (this.viewType === 1) {
        let index = 0
        for (const i of '一二三四') {
          index++
          const item = { label: '第' + i + '学期', year: this.viewYear, quarter: index, current: false, active: false }
          if (this.viewYear === curYear && index === curQuarter) {
            item.current = true
          } else if (this.viewYear === this.data[0] && index === this.data[1]) {
            item.active = true
          }
          list.push(item)
        }
        this.title = this.viewYear + ' 年'
      } else {
        const start = parseInt(this.viewYear / 10) * 10
        this.viewYear = start
        for (let i = 0; i < 10; i++) {
          const year = start + i
          const item = { label: year + '', year: year, current: false, active: false }
          if (year === curYear) {
            item.current = true
          } else if (year === this.data[0]) {
            item.active = true
          }
          list.push(item)
        }
        this.title = start + ' 年 - ' + (start + 9) + ' 年'
      }
      this.viewList = list
      this.lineCount = parseInt(list.length / 4)
      if (list.length % 4 > 0) {
        this.lineCount++
      }
    },
    // 校验季度格式是否正确
    checkFormat(pattern, val) {
      // 格式转成正则表达式
      let text = ''
      for (const char of pattern) {
        const dict = '\\^$.+?*[]{}!'
        if (dict.indexOf(char) === -1) {
          text += char
        } else {
          text += '\\' + char
        }
      }
      text = text.replace('yyyy', '[1-9]\\d{3}')
      text = text.replace('qq', '0[1-4]')
      text = text.replace('q', '[1-4]')
      text = text.replace('Q', '[一二三四]')
      text = '^' + text + '$'
      const patt = new RegExp(text)
      return patt.test(val)
    },
    // 格式化季度到指定格式
    formatTo(data, pattern) {
      let text = pattern.replace('yyyy', '' + data[0])
      text = text.replace('qq', '0' + data[1])
      text = text.replace('q', '' + data[1])
      text = text.replace('Q', '一二三四'.substr(data[1] - 1, 1))
      return text
    },
    // 以指定格式解析季度
    formatFrom(str, pattern) {
      const year = this.findText(str, pattern, 'yyyy')
      const quarter = this.findText(str, pattern, ['qq', 'q', 'Q'])
      this.data = [year, quarter]
    },
    // 查找文本数值
    findText(str, pattern, find) {
      if (find instanceof Array) {
        for (const f of find) {
          const val = this.findText(str, pattern, f)
          if (val !== -1) {
            return val
          }
        }
        return -1
      }
      const index = pattern.indexOf(find)
      if (index === -1) {
        return index
      }
      const val = str.substr(index, find.length)
      if (find === 'Q') {
        return '一二三四'.indexOf(val) + 1
      } else {
        return parseInt(val)
      }
    },
    // 年份点击
    clickYear() {
      if (this.viewType !== 1) {
        return
      }
      // 切换年度选择器
      this.viewType = 2
      this.initView()
    },
    // 季度选择
    clickItem(item) {
      // console.log('select--------', item)
      if (this.viewType === 1) {
        // 选择季度
        this.$emit('change', this.formatTo([item.year, item.quarter], this.valueFormat))
        this.visible = false
      } else {
        // 选择年度
        this.viewType = 1
        this.viewYear = item.year
        this.initView()
      }
    },
    // 上一年
    clickLast() {
      if (this.viewYear > 1000) {
        if (this.viewType === 1) {
          this.viewYear--
          this.initView()
        } else {
          this.viewYear = this.viewYear - 10
          this.initView()
        }
      }
    },
    // 下一年
    clickNext() {
      if (this.viewYear < 9999) {
        if (this.viewType === 1) {
          this.viewYear++
          this.initView()
        } else {
          this.viewYear = this.viewYear + 10
          this.initView()
        }
      }
    }
  }
}
</script>

<style>
.el-quarter-picker {
  width: 220px;
  display: inline-block;
}
</style>