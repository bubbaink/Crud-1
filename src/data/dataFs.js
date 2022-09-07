const fs = require('fs');

module.exports={
    
    productStorage: (dataBase) => {
        fs.writeFileSync(
           './src/data/productsDataBase.json',
           JSON.stringify(dataBase), "utf-8"
        );
     }
}
