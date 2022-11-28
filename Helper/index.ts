import axios from "axios"
import pool from "../model/db";

export function getUniqueListBy(arr:any, key:string) {
    return [...new Map(arr.map((item: { [x: string]: any; }) => [item[key], item])).values()]
}


export async function helperFunc(search_query: any) {
    let date = new Date().toISOString()
    let url = `https://www.googleapis.com/youtube/v3/search?key=${process.env.API_KEY}&type=video&part=snippet&q=${search_query}&published_after=2021-01-01T00:00:00Z&published_before=${date}&order=date`
    let {data} = await axios.get(url)   
    let values: any[] = [];
    data.items.map((value: any) => {
        let p = new Array();
        p.push(search_query)
        p.push(value.snippet.title)
        p.push(value.snippet.description)
        p.push(value.id.videoId)
        p.push(value.snippet.publishTime)
        return values.push(p)
    });
    let { rows } = await pool.query('SELECT * FROM youtube where search_query = $1', [search_query])
    if (rows.length === 0) {
        for (let index = 0; index < values.length; index++) {
            await pool.query('INSERT INTO youtube (search_query,title,description,url,published_date) VALUES($1,$2,$3,$4,$5) RETURNING *', values[index])
        }
    }else{
        for (let index = 0; index < values.length; index++) {
            let flag = 0;
            for (let index1 = 0; index1 < rows.length; index1++) {
                if(rows[index1].url === values[index][3]){
                    flag = 1;
                }
            }
            if (flag === 0) {
                await pool.query('INSERT INTO youtube (search_query,title,description,url,published_date) VALUES($1,$2,$3,$4,$5) RETURNING *', values[index])
            }
        }
    }
    values.map((value: any) => (
        rows.push({
            'search_query': value[0],
            'title': value[1],
            'description': value[2],
            'url': value[3],
            'published_date': value[4]
        })
    ))

    rows  = getUniqueListBy(rows, 'url')

    rows.sort(function (a, b) {
        return (a.published_date < b.published_date) ? ((a.published_date > b.published_date) ? 0 : 1) : -1;
    });

    return rows;
}