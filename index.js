let Func = require ('./lib/func');
let parsing = require ('./lib/parsing');

let nodedb = function () {
  this.url = '';
  this.db = '';
  this.execute = new Func ();
  (this.init = (url, db) => {
    this.url = url;
    this.db = db;
    parsing.initFile (url + '/' + db);
    this.execute.init (url, db);
  }), (this.checkSys = () => {
    //系统扩展
  });
};
let nodeDb = new nodedb ();
module.exports = nodeDb;
