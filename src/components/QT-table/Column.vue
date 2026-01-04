<script>
export default {
  name: 'qt-table-column',
  functional: true,
  render(createElement, context) {
    const list = context.props && context.props.columns || []
    const list2 = context.props && context.props.columnList || []
    const disabled = context.props && context.props.disabled || false
    let slots = []
    for (let i = 0; i < list2.length; i++) {
      inner: for (let j = 0; j < list.length; j++) {
        if (list[j].componentOptions && list[j].componentOptions.propsData && list2[i].prop === list[j].componentOptions.propsData.prop && list2[i].columnVisible) {
          if (list2[i].width) {
            list[j].componentOptions.propsData.width = list2[i].width
            // console.log('componentOptions',list2[i],list[j].componentOptions)
          }
          slots.push(list[j])
          break inner
        }
      }
    }
    let noPropList = list.filter(item => item.componentOptions && item.componentOptions.propsData && !item.componentOptions.propsData.prop)
    let noPropList1 = noPropList.filter(item => item.componentOptions.propsData.label !== '操作')
    let noPropList2 = disabled ? [] : noPropList.filter(item => item.componentOptions.propsData.label === '操作')
    if (noPropList2.length > 0) {
      noPropList2.forEach(element => {
        if (element.componentOptions && element.componentOptions.propsData && !element.fixed) {
          element.componentOptions.propsData.fixed = 'right'
        }
      });
    }
    // console.log('noPropList',noPropList,noPropList1,noPropList2)
    return [...noPropList1, ...slots, ...noPropList2]
  }
}
</script>