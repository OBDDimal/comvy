import axios from "axios";

export async function decisionPropagationFIDE(xml, selection = [], deselection = []) {
    try {
        const content = new TextEncoder().encode(xml);
        const data = await axios.post(`${import.meta.env.VITE_APP_DOMAIN_FEATUREIDESERVICE}propagation`,
            ({
                name: "vue" + ".xml",
                selection: selection,
                deselection: deselection,
                content: Array.from(content)
            }))
        return data.data;
    } catch (e) {

    }
}

export async function pingFIDE() {
    try {
        let data = await axios.get(`${import.meta.env.VITE_APP_DOMAIN_FEATUREIDESERVICE}`);
        console.log(data)
        return true;
    } catch (e) {
        return false;
    }
}