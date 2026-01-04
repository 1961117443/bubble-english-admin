<script lang="jsx">
import {Select as T} from 'element-ui'
// console.log(T)
export default{
    name:'QTSelect',
    extends:T,
    data(){
        valueData: undefined
    },
    // model: {
    //     // prop: 'value',
    //     event: 'change'
    // },
    // props:Object.assign({},T.props,{
    //     value: {
    //         required: true
    //     }
    // }),
    methods:{
        handleChange (e) {
            console.log('handleChange',e)
            const value = e.target.value
            console.log(value)
            // this.valueData 
            this.$emit('change', value)
       }

    },
    render(){
        // let props = {}
        // let slots = {...this.$slots}

        // const localKeys = Object.keys(this.$data)
        // Object.keys(T.props).forEach(k => {
        //     const localKey = `local${k.substring(0, 1).toUpperCase()}${k.substring(1)}`
        //     if (localKeys.includes(localKey)) {
        //         props[k] = this[localKey]
        //         return props[k]
        //     }
        //     this[k] && (props[k] = this[k])
        //     // 此处配置表格大小与要显示的列
        //     props = {
        //         ...props
        //     }
        //     return props[k]
        // })
       
        // console.log(props)
        // console.log(this.$props)
        const { prefixCls, ...props  } = this.$props
        console.log(this.$scopedSlots)
        return (
            // <el-select {...{ props }} v-model={this.value} onChange={this.handleChange}>
                <el-select {...{ props, scopedSlots: { ...this.$scopedSlots } }} v-model={this.valueData}> 
                {  Object.keys(this.$slots).map(name => (<template slot={name}>{this.$slots[name]}</template>)) }
            </el-select>
        )
    }
}

</script>