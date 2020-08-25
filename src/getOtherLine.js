import sv0700504220631 from './config/lines/sv0700504220631.svg'; //Красная линия А
import sv0700504220632 from './config/lines/sv0700504220632.svg'; //Зелёная линия А

import sv0700604220631 from './config/lines/sv0700604220631.svg'; //Красная линия B
import sv0700604220632 from './config/lines/sv0700604220632.svg'; //Зелёная линия B

import sv0700704220631 from './config/lines/sv0700704220631.svg'; //Красная линия C
import sv0700704220632 from './config/lines/sv0700704220632.svg'; //Зелёная линия C

const list = [
    sv0700504220631,
    sv0700504220632,

    sv0700604220631,
    sv0700604220632,

    sv0700704220631,
    sv0700704220632,
];

//Получение противоположной линии
export function getOtherLine(id, doc)
{
    let url;
    let change = {
        url,
        id
    }

    if (doc.getElementById(id) == null)
    {
        let truncWord = id.substring(0, id.length - 1); 
        let lastChar = id[id.length - 1];
        let findID = (lastChar == "1") ? truncWord + "2" : truncWord + "1";

        list.forEach((item) => 
        {
            let listID = item.toString().split('/')[3].split('.')[0];
            if (listID == id)
            {
                change.url = item;
            }
        });

        change.id = findID;
    }else
    {
        change.url = 0;
        change.id = "0";
    }

    return change;
}