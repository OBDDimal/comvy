import FormData from "form-data";
import axios from "axios";

export async function decisionPropagation(xml, selection, deselection) {

    const content = new TextEncoder().encode(this.xml);
    const data = await axios.post(`${import.meta.env.VITE_APP_DOMAIN_FEATUREIDESERVICE}propagation`,
        ({
            name: this.featureModel.name + ".xml",
            selection: selection,
            deselection: deselection,
            content: Array.from(content)
        }))
    return data;
}

export async function ping() {
    try {
        await axios.get(`${import.meta.env.VITE_APP_DOMAIN_FEATUREIDESERVICE}`);
        return true;
    } catch (e) {
        return false;
    }
}