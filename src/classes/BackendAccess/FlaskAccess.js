import axios, {CancelToken} from "axios";
import FormData from 'form-data';

let ident = "";

export async function decisionPropagationFL(file, selection = [], deselection = []) {
    if (ident === "") {
        let formData = new FormData();
        let length = file.target.files.length;
        let files = file.target.files;

        for (let x = 0; x < length; x++) {
            formData.append("files[]", files[x]);
        }

        console.log(formData);

        const source = CancelToken.source();
        const timeout = setTimeout(() => {
            source.cancel();
            // Timeout Logic
        }, 450);

        let data = await axios.post(`${import.meta.env.VITE_APP_DOMAIN_FLASKBACKEND}register_formula`, formData,
            {
                headers: {'Content-Type': 'multipart/form-data',},
                cancelToken: source.token,
            });
        clearTimeout(timeout);
    }
}

export async function pingFL() {
    try {
        const source = CancelToken.source();
        const timeout = setTimeout(() => {
            source.cancel();
            // Timeout Logic
        }, 450);
        await axios.get(`${import.meta.env.VITE_APP_DOMAIN_FLASKBACKEND}`, {cancelToken: source.token});
        clearTimeout(timeout);
        return true;
    } catch (e) {
        return false;
    }
}
