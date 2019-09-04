let path = require('path')
let baseUrl = path.join(__dirname , '/data')
let nodedb = require('./index')
nodedb.init(baseUrl,'db')

// insert data
// let result = nodedb.execute.insert('user',{userName:'yaguan2',password:'123425'})

// select data
// let result = nodedb.execute.select('user',{fields:['id','userName'],where:{userName:'yaguan',password:'RegExp(/2/)'},limit:[0,10],sort:-1,paging:{pageSize:2,page:0}})
// let result = nodedb.execute.select('user',{fields:['id','userName'],where:{userName:'yaguan',password:'RegExp(/2/)'},limit:[0,10],sort:-1})


// update data
//let result = nodedb.execute.update('user',{userName:'yaguan',password:'123425'},{where:{userName:'yaguan2'}})


// delete data
let result = nodedb.execute.remove('user',{where:{userName:'yaguan2'}})

console.log(result)