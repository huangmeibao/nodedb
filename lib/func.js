let parsing = require ('./parsing');
let fs = require ('fs');
class Func {
  constructor () {
    this.url = '';
    this.db = '';
  }
  init (url, db) {
    this.url = url;
    this.db = db;
  }
  create (type, name) {
    switch (type) {
      case 'table':
        //
        break;
      case 'database':
        //
        break;
    }
  }
  /*
    check table data
  */
  checkDataType (table_name, data) {
    let tableData = JSON.parse (
      fs.readFileSync (`${this.url}\\${this.db}\\${table_name}.json`)
    );
    tableData.code = 200;
    Object.keys (tableData.fields).map ((key, item) => {
      if (tableData.fields[key] === 'autoId') {
        tableData.autoIdKey = key;
      } else {
        if (typeof data[key] !== tableData.fields[key]) {
          tableData.code = -1;
          tableData.error = `${key} data type is error!`;
        }
      }
    });
    return tableData;
  }
  drop () {}
  /*
    select table data
  */
  select (table_name, option) {
    try {
      let tableDesign = this.checkDataType (table_name, {});
      // return;
      let dataString = fs
        .readFileSync (`${this.url}\\${this.db}\\${table_name}.nb`)
        .toString ();
      let tableData = parsing.stringToJson (dataString);

      if (option.where) {
        // where filtrate
        tableData = parsing.whereFiltrate (tableData, option.where);
      }

      if (option.limit) {
        // limit filtrate
        tableData = parsing.limitFiltrate (tableData, option.limit);
      }

      if (option.sort) {
        // sort filtrate
        tableData = option.sort === -1 ? tableData.reverse () : tableData;
      }

      if (option.paging) {
        // paging filtrate
        const data = parsing.pagingFiltrate (tableData, option.paging);

        if (option.fields) {
          // fields filtrate
          data.data = parsing.fieldsFiltrate (data.data, option.fields);
        }
        return {
          code: 200,
          data: data.data,
          message: 'success',
          totalNum: data.total,
          totalPage: data.totalPage,
        };
      }

      if (option.fields) {
        // fields filtrate
        tableData = parsing.fieldsFiltrate (tableData, option.fields);
      }
      return {
        code: 200,
        data: tableData,
        message: 'success',
      };
    } catch (e) {
      return parsing.returnError (e);
    }
  }
  /*
    insert table data
  */
  insert (table_name, data) {
    try {
      let tableDesign = this.checkDataType (table_name, data);
      if (tableDesign.code === -1) {
        return {
          code: 201,
          message: tableDesign.error,
        };
      } else {
        tableDesign.autoId++;
        if (tableDesign.autoIdKey) {
          data[tableDesign.autoIdKey] = tableDesign.autoId;
        }
      }
      delete tableDesign.code;
      delete tableDesign.error;
      delete tableDesign.autoIdKey;
      // tableDesign.autoId ++
      fs.writeFileSync (
        `${this.url}\\${this.db}\\${table_name}.json`,
        `${JSON.stringify (tableDesign)}`
      );
      fs.writeFileSync (
        `${this.url}\\${this.db}\\${table_name}.nb`,
        `${JSON.stringify (data)}\n`,
        {flag: 'a'}
      );
      return {
        code: 200,
        insertId: tableDesign.autoId,
        message: 'success',
      };
    } catch (e) {
      return parsing.returnError (e);
    }
  }
  update (table_name, data, option) {
    try {
      let tableDesign = this.checkDataType (table_name, {});
      let dataString = fs
        .readFileSync (`${this.url}\\${this.db}\\${table_name}.nb`)
        .toString ();
      let tableData = parsing.stringToJson (dataString);

      if (option.where) {
        // where filtrate
        tableData = parsing.whereUpdateFiltrate (tableData, data, option.where);
      } else {
        return {
          code: 2003,
          message: 'Please add constraints!',
        };
      }

      let outData = JSON.stringify (tableData)
        .replace (/},/g, '}\n')
        .replace ('[', '')
        .replace (']', '');

      fs.writeFileSync (
        `${this.url}\\${this.db}\\${table_name}.nb`,
        `${outData}\n`
      );
      return {
        code: 200,
        message: 'success',
      };
    } catch (e) {
      return parsing.returnError (e);
    }
  }
  remove (table_name, option) {
    try {
      let tableDesign = this.checkDataType (table_name, {});
      let dataString = fs
        .readFileSync (`${this.url}\\${this.db}\\${table_name}.nb`)
        .toString ();
      let tableData = parsing.stringToJson (dataString);

      if (option.where) {
        // where filtrate
        tableData = parsing.whereRemoveFiltrate (tableData, option.where);
      } else {
        return {
          code: 2003,
          message: 'Please add constraints!',
        };
      }
      let outData = JSON.stringify (tableData)
        .replace (/},/g, '}\n')
        .replace ('[', '')
        .replace (']', '');

      fs.writeFileSync (
        `${this.url}\\${this.db}\\${table_name}.nb`,
        `${outData}\n`
      );
      return {
        code: 200,
        message: 'success',
      };
    } catch (e) {
      return parsing.returnError (e);
    }
  }
}

module.exports = Func;
