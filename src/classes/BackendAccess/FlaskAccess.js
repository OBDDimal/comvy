import axios from "axios";
import FormData from 'form-data';

let ident = "";

export async function decisionPropagation(xml, selection) {
    if (ident === "") {
        const form = new FormData();
        form.append('file', file);

        let data = await axios.post(`${import.meta.env.VITE_APP_DOMAIN_FLASKBACKEND}register_formula`, form,
            {
                headers: { 'Content-Type': 'multipart/form-data', },
            });
        console.log(data)
    }


}
