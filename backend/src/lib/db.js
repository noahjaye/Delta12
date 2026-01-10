import {Pool} from 'pg'

const pool = new Pool({
    database: 'delta',
    password: 'spacehog',
})

export default pool