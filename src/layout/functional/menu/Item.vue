<script>
import store from '@/store'
export default {
  name: 'MenuItem',
  functional: true,
  props: {
    icon: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    },
    id: {
      type: String,
      default: ''
    }
  },
  render(h, context) {
    const { icon, title,id } = context.props
    const vnodes = []

    if (icon) {
      vnodes.push(<i class={icon + ' left-icon'} />)
    }

    if (title) {
      // vnodes.push(<span slot='title'>{(title)}</span>)
      const data = store.state.user.remindData[id]
      if (data) {
        if (data.isDot) {
          vnodes.push(<span slot='title'>{(title)}<el-badge is-dot /></span>)
        }else{
          const num = data.num || 0
          vnodes.push(<span slot='title'>{(title)}<el-badge value={num} /></span>)
        }
      }else{
        vnodes.push(<span slot='title'>{(title)}</span>)
      }
    }
    return vnodes
  }
}
</script>
