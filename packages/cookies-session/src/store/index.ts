const tablestoreFn = require('../tablestore')
const storeStrategy = {
    tablestore: tablestoreFn,
    // 其他存储
}

const store = (options, ctx) => {
    const opts = options || {};
    if(!opts.store) return{};
    const fn = storeStrategy[opts.store];
    if (!fn)return{};
    const { init, put, get, update, remove} = fn(ctx, options);
    return {
        init,
        put,
        get,
        update,
        remove
    }
}
module.exports = store