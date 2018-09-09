const STORE_KEY = 'my_forms';

export function tryStoreForm(title, form) {
    try {
        const json = localStorage.getItem(STORE_KEY);
        const myForms = json ? JSON.parse(json) : [];
        myForms.push({ id: form.id, title: title, createTime: form.createTime });
        localStorage.setItem(STORE_KEY, JSON.stringify(myForms));
    } catch (err) {
        console.log(err);
    }
}

export function tryGetForms() {
    try {
        const json = localStorage.getItem(STORE_KEY);
        return json ? JSON.parse(json) : [];
    } catch (err) {
        console.log(err);
        return [];
    }
}

export function tryRemoveForms() {
    try {
        localStorage.removeItem(STORE_KEY);
    } catch (err) {
        console.log(err);
    }
}
