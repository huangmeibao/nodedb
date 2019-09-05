# nodedb
node.js database    最简单的数据库， 免安装，只需插件引用，不需要学习sql语句 ，适用非大型项目，让javascript同学 从前端--后端--数据库 一把鲁下去。


一 安装方式

      npm install node-edb

二 初始化

      let path = require('path')
   
      let baseUrl = path.join(__dirname , '/data')
      
      let nodedb = require('node-edb')
   
      nodedb.init(baseUrl,'db')  

   
   1  init 第一个参数为 数据库数据保存的路径
   
   2  init 第二个参数为 引用的数据库
   
   3  数据库创建方式，非常简在存储路径下 新建一个文件夹即创建一个数据库 (比如 ：  /data/db)
   
   4  创建表  以创建一个 user 表为列子
   
   在对应的数据库文件夹下创建user.json   (/data/db/user.json)
   填充内容：
      
            {"autoId":0,"fields":{"id":"autoId","userName":"string","password":"string"}}
            
   autoId : 参数为表自增id初始值 
   fields ：参数为表中字段及字段的类型 类型支持 javascript 所有类型

三 使用说明
   1 插入数据 
 
       // insert data
       let result = nodedb.execute.insert('user',{userName:'yaguan2',password:'123425'})
       
   2 查询数据 fields:查询过滤  where：查询条件 (支持正则)  limit: 数据截取 sort：排序 paging： 支持分页
   
        // select data
        let result = nodedb.execute.select('user',{fields:['id','userName'],where:{userName:'yaguan',password:'RegExp(/2/)'},limit:[0,10],sort:-1,paging:{pageSize:2,page:0}})
        
   3 更新数据 
   
        // update data
        let result = nodedb.execute.update('user',{userName:'yaguan',password:'123425'},{where:{userName:'yaguan2'}})
        
   4 删除数据 
         
         // delete data
         let result = nodedb.execute.remove('user',{where:{userName:'yaguan2'}})


