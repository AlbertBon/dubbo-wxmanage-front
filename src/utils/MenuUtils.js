
export default (routers,data) => {
  //这里之所以要重新遍历一下，是因为，通常我们动态路由的时候，是获取服务端数据，这个component属性是一个字符串，或者可能连字段名都是其他的key
  //所以这里要做一些转换
  generaMenu(routers,data)
}
var lazyLoading = (name) => () => import(`@/views${name}.vue`)
function generaMenu(routers,data){
  data.forEach((item)=>{
    let menu = Object.assign({},item)//复制对象，转化为对象
    // let menu = {}
    // menu.name = item.name
    // menu.path = item.path
    // menu.title = item.title
    menu.component = lazyLoading(menu.component)
    //
    // if(item.redirect!=undefined){
    //   menu.redirect = item.redirect
    // }
    // if(item.icon!=undefined){
    //   menu.icon = item.icon
    // }
    // if(item.hidden!=undefined){
    //   menu.hidden = item.hidden
    // }
    // if(item.alwaysShow!=undefined){
    //   menu.alwaysShow = item.alwaysShow
    // }
    if(item.children!=undefined&&item.children.length>0){
      menu.children = []
      generaMenu(menu.children,item.children)//递归组装子菜单
    }
    routers.push(menu)
  })
}
