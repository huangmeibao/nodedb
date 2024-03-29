let fs = require ('fs');
let parsing = {
  stringToJson: function (str) {
    let data;
    str = str.substr (0, str.length - 1).replace (/\n/g, ',');
    data = JSON.parse (`[${str}]`);
    return data;
  },
  returnError: function (e) {
    switch (e.errno) {
      case -4058:
        return {
          code: 4058,
          message: 'Table does not exist',
        };
        break;
      default:
        return e;
    }
  },
  initFile: function (pathName) {
    fs.readdir (pathName, function (err, files) {
      let table = [];
      for (var i = 0; i < files.length; i++) {
        if (files[i].toString ().indexOf ('.json') != -1) {
          //console.log (files[i].toString ());
          table.push (files[i].toString ().replace ('.json', ''));
        }
      }
      //console.log (table);
      table.forEach (el => {
        let file = pathName + '/' + el + '.nb';
        fs.access (file, fs.constants.F_OK, err => {
          if (err) {
            fs.writeFileSync (file, `\n`, {
              flag: 'a',
            });
          } else {
          }
        });
      });
    });
  },

  checkAccess: async function (file) {
    let bool = await this.fsAccess (file);
    return bool;
  },
  fsAccess: function (file) {
    return new Promise ((resolve, reject) => {
      //...
      fs.access (file, fs.constants.F_OK, err => {
        if (err) {
          fs.writeFileSync (file, `\n`, {
            flag: 'a',
          });
          resolve (true);
        } else {
          resolve (true);
        }
      });
    });
  },

  whereRemoveFiltrate: function (res, where) {
    // let indexs = []
    // res.forEach((element,index) => {
    //   let notWhere = true
    //   Object.keys(where).map((key,item) => {
    //     if(where[key].indexOf('RegExp') === -1){
    //       if(element[key] !== where[key]){
    //         notWhere = false
    //       }
    //     }else{
    //       let patt = eval(`new ${where[key]}`)
    //       if(!patt.test(element[key])) {
    //         notWhere = false
    //       }
    //     }
    //   })
    //   if(notWhere) {
    //     indexs.push(index)
    //   }
    // });
    function checkAdult (element) {
      let notWhere = true;
      Object.keys (where).map ((key, item) => {
        if (where[key].toString().indexOf ('RegExp') === -1) {
          if (element[key] !== where[key]) {
            notWhere = false;
          }
        } else {
          let patt = eval (`new ${where[key]}`);
          if (!patt.test (element[key])) {
            notWhere = false;
          }
        }
      });
      // if(notWhere) {
      //   indexs.push(index)
      // }
      return !notWhere;
    }

    // indexs.forEach((el) => {

    // })
    return res.filter (checkAdult);
  },
  whereUpdateFiltrate: function (res, data, where) {
    res.forEach (element => {
      let notWhere = true;
      Object.keys (where).map ((key, item) => {
        if (where[key].toString().indexOf ('RegExp') === -1) {
          if (element[key] !== where[key]) {
            notWhere = false;
          }
        } else {
          let patt = eval (`new ${where[key]}`);
          if (!patt.test (element[key])) {
            notWhere = false;
          }
        }
      });
      if (notWhere) {
        res.forEach (element => {
          Object.keys (data).map ((key, item) => {
            element[key] = data[key];
          });
        });
      }
    });
    return res;
  },
  whereFiltrate: function (res, where) {
    let data = [];
    res.forEach (element => {
      let notWhere = true;
      Object.keys (where).map ((key, item) => {
        if (where[key].toString ().indexOf ('RegExp') === -1) {
          if (element[key] !== where[key]) {
            notWhere = false;
          }
        } else {
          let patt = eval (`new ${where[key]}`);
          if (!patt.test (element[key])) {
            notWhere = false;
          }
        }
      });
      if (notWhere) {
        data.push (element);
      }
    });
    return data;
  },
  limitFiltrate: function (res, limit) {
    return res.slice (limit[0], limit[1]);
  },
  pagingFiltrate: function (res, paging) {
    let total = res.length;
    let data = res.slice (
      paging.page * paging.pageSize,
      paging.page * paging.pageSize + paging.pageSize
    );
    return {
      total,
      data,
      totalPage: Math.ceil (total / paging.pageSize),
    };
  },
  fieldsFiltrate: function (res, fields) {
    res.forEach (el => {
      Object.keys (el).map (field => {
        if (fields.indexOf (field) === -1) {
          delete el[field];
        }
      });
    });
    return res;
  },
};
module.exports = parsing;
