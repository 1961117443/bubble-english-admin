<!-- CreateableSelect.vue -->
<template>
    <el-select v-model="innerValue" filterable remote reserve-keyword :remote-method="handleSearch" :loading="loading"
        v-bind="$attrs" multiple>
        <el-option v-for="item in allOptions" :key="item[valueKey]" :label="item[labelKey]" :value="item[valueKey]" />
        <!-- <el-option v-if="showCreateOption" :value="tempValue" :label="`创建：${inputText}`" /> -->
        <div slot="empty">
            <el-button style="margin: 10px;" @click="handleCreate">创建：{{ inputText }}</el-button>
        </div>
    </el-select>
</template>

<script>
import request from "@/utils/request";
export default {
    name: 'CreateableSelect',
    props: {
        value: [String, Number, Array],
        category: {
            type: String,
            required: true
        }
    },
    data() {
        return {
            innerValue: this.value,
            allOptions: [],    // 所有选项（初始加载+搜索）
            initOptions: [],   // 初始加载的选项
            searchOptions: [], // 搜索得到的选项
            inputText: '',
            loading: false,
            showCreateOption: false,
            tempValue: '__CREATE__'
        }
    },
    computed: {
        valueKey() {
            return 'id'
        },
        labelKey() {
            return 'fullName'
        }
    },
    watch: {
        category() {
            this.loadInitialOptions()
        }
    },
    created() {
        this.loadInitialOptions()
    },
    methods: {
        // 初始化加载所有选项
        async loadInitialOptions() {
            try {
                this.loading = true
                const { data } = await request(
                    {
                        url: `/api/extend/label/${this.category}/list`
                    }
                )
                this.initOptions = data || []
                this.allOptions = this.initOptions
            } catch (error) {
                // this.$emit('error', error)
                console.log(error)
            } finally {
                this.loading = false
            }
        },

        // 处理远程搜索
        async handleSearch(query) {
            this.inputText = query
            if (!query) {
                this.allOptions = this.initOptions
                return
            }

            try {
                this.loading = true
                const { data } = await request.get(`/api/extend/label/${this.category}/list`,{
                    data: {
                        keyword: query 
                    }
                })
                this.searchOptions = data || []
                this.allOptions = this.searchOptions
                this.showCreateOption = this.searchOptions.length === 0
            } catch (error) {
                // this.$emit('error', error)
                console.log(error)
            } finally {
                this.loading = false
            }
        },

        // 创建新条目
        async handleCreate() {
            if (!this.inputText.trim()) {
                this.$emit('error', new Error('输入内容不能为空'))
                return
            }

            this.allOptions.push({
                [this.labelKey]: this.inputText.trim(),
                [this.valueKey]: this.inputText.trim()
            })

            this.initOptions.push({
                [this.labelKey]: this.inputText.trim(),
                [this.valueKey]: this.inputText.trim()
            })
            return

            try {
                this.loading = true
                const { data } = await request.post(
                    `/api/extend/label/${this.category}`,
                    { [this.labelKey]: this.inputText,category: this.category }
                )

                // 更新本地数据
                this.initOptions = [...this.initOptions, data]
                this.allOptions = this.initOptions
                this.innerValue = data[this.valueKey]
                this.showCreateOption = false

                this.$emit('create-success', data)
                this.$emit('input', data[this.valueKey])
            } catch (error) {
                // this.$emit('error', error)
                console.log(error)
            } finally {
                this.loading = false
            }
        },

        // 选择处理（保持不变）
        handleSelectChange(value) {
            if (value === this.tempValue) {
                this.handleCreate()
                return
            }
            const selected = this.allOptions.find(item => item[this.valueKey] === value)
            this.$emit('input', value)
            this.$emit('change', value, selected)
        }
    }
}
</script>