export async function fetchHome() {
    // Get website home information from back-end
    const baseUrl = `${
        'http://localhost:8080'
    }/`;
    const url = new URL(baseUrl);

    const response = await fetch(url, {
        method: 'GET',
        headers: {
        'content-type': 'application/json'
        },
    });

    if (!response.ok) {
        const error = new Error('An error occurred while fetching the about page');
        error.code = response.status;
        error.info = await response.json();
        throw error;
    }

    const { home } = await response.json();

    return home;
}