export async function load() {
    const response = await fetch('https://api.chucknorris.io/jokes/categories').then((res) => {
        if (res.status !== 200) {
            return null;
        }
        return res.json();
    }).catch(err => {
        console.log(err)
        return null;
    });
    
    if (response && response.length > 0) {
        return {
            categories: response
        } 
    } 
    return null;
}