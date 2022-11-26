import Pool from "pg"

const pool = new Pool.Pool({
    user:'postgres',
    host:'localhost',
    database:'pract',
    password:'22334',
    port:5432
})
export default pool;

// module.exports = pool;